import yauzl from 'yauzl';

const EXPORT_ORIGIN = "https://platform.deepseek.com";
const EXPORT_PATH = "/api/v0/usage/export";
const TIMEOUT_MS = 15e3;
const TOKEN_REF = "DEEPSEEK_USER_TOKEN";

/** Resolve the platform login token through the credentials seam (secret). */
async function resolveToken(credentials) {
	if (credentials === null || credentials === void 0 || typeof credentials.resolve !== "function") return "";
	try {
		const value = (await credentials.resolve(TOKEN_REF))?.value;
		return typeof value === "string" && value.trim() !== "" ? value.trim() : "";
	} catch {
		return "";
	}
}

/** Round a monetary value to 2 decimal places. */
function round2(value) {
	return Math.round(value * 100) / 100;
}

/** Parse a numeric cell defensively; anything non-finite becomes 0. */
function safeFloat(value) {
	const parsed = Number.parseFloat(value);
	return Number.isFinite(parsed) ? parsed : 0;
}

/** Parse an integer cell defensively; anything non-finite becomes 0. */
function safeInt(value) {
	const parsed = Number.parseInt(value, 10);
	return Number.isFinite(parsed) ? parsed : 0;
}

/** Unzip a ZIP buffer into a fileName → utf8 text map (lazyEntries mode). */
function unzipEntries(buf) {
	return new Promise((resolve, reject) => {
		const files = new Map();
		yauzl.fromBuffer(buf, { lazyEntries: true }, (err, zipfile) => {
			if (err) return reject(err);
			zipfile.readEntry();
			zipfile.on("entry", (entry) => {
				if (/\/$/.test(entry.fileName)) {
					zipfile.readEntry();
					return;
				}
				zipfile.openReadStream(entry, (err2, rs) => {
					if (err2) return reject(err2);
					const chunks = [];
					rs.on("data", (c) => chunks.push(c));
					rs.on("end", () => {
						files.set(entry.fileName, Buffer.concat(chunks).toString("utf8"));
						zipfile.readEntry();
					});
					rs.on("error", reject);
				});
			});
			zipfile.on("end", () => resolve(files));
			zipfile.on("error", reject);
		});
	});
}

/** Find the first CSV whose basename contains `<kind>-` (e.g. `cost-`, `amount-`). */
function findCsv(files, kind) {
	for (const name of files.keys()) {
		const base = String(name).split("/").pop() ?? String(name);
		if (base.includes(`${kind}-`) && base.endsWith(".csv")) return files.get(name);
	}
	return null;
}

/** Aggregate the cost CSV (header: user_id, utc_date, model, wallet_type, cost, currency). */
function parseCost(csvText, byModel) {
	const lines = String(csvText).split("\n");
	for (let i = 1; i < lines.length; i++) {
		const line = lines[i];
		if (line.trim() === "") continue;
		const cols = line.split(",");
		const model = (cols[2] ?? "").trim();
		if (model === "") continue;
		const agg = ensureModel(byModel, model);
		agg.cost += safeFloat(cols[4]);
	}
}

/**
 * Aggregate the amount CSV (header: user_id, utc_date, model, api_key_name,
 * api_key, type, price, amount). Only columns 2 (model), 5 (type) and 7
 * (amount) are read — column 4 (plaintext api key) is intentionally never
 * touched.
 */
function parseAmount(csvText, byModel) {
	const lines = String(csvText).split("\n");
	for (let i = 1; i < lines.length; i++) {
		const line = lines[i];
		if (line.trim() === "") continue;
		const cols = line.split(",");
		const model = (cols[2] ?? "").trim();
		const type = (cols[5] ?? "").trim();
		if (model === "" || type === "") continue;
		const agg = ensureModel(byModel, model);
		const amount = safeInt(cols[7]);
		if (type === "request_count") agg.requests += amount;
		else if (type === "input_cache_hit_tokens") agg.inputCacheHitTokens += amount;
		else if (type === "input_cache_miss_tokens") agg.inputCacheMissTokens += amount;
		else if (type === "output_tokens") agg.outputTokens += amount;
	}
}

/** Fetch (or lazily create) the per-model aggregation bucket. */
function ensureModel(byModel, model) {
	let agg = byModel.get(model);
	if (agg === void 0) {
		agg = {
			model,
			cost: 0,
			requests: 0,
			inputCacheHitTokens: 0,
			inputCacheMissTokens: 0,
			outputTokens: 0
		};
		byModel.set(model, agg);
	}
	return agg;
}

/** Compute the (year, month) list going backwards from a UTC timestamp. */
function monthTargets(nowMs, months) {
	const date = new Date(nowMs);
	let year = date.getUTCFullYear();
	let month = date.getUTCMonth() + 1;
	const targets = [];
	for (let i = 0; i < months; i++) {
		targets.push({ year, month });
		month -= 1;
		if (month === 0) {
			month = 12;
			year -= 1;
		}
	}
	return targets;
}

/** Fetch and aggregate one month; returns null when the month has no usable data. */
async function fetchMonth(target, token, fetchImpl) {
	const url = new URL(EXPORT_PATH, EXPORT_ORIGIN);
	url.searchParams.set("month", String(target.month));
	url.searchParams.set("year", String(target.year));
	const response = await fetchImpl(url.href, {
		headers: { authorization: `Bearer ${token}` },
		signal: AbortSignal.timeout(TIMEOUT_MS)
	});
	if (!response.ok) throw new Error(`usage export returned HTTP ${response.status}`);
	const files = await unzipEntries(Buffer.from(await response.arrayBuffer()));
	const costCsv = findCsv(files, "cost");
	const amountCsv = findCsv(files, "amount");
	if (costCsv === null && amountCsv === null) return null;
	const byModel = new Map();
	if (costCsv !== null) parseCost(costCsv, byModel);
	if (amountCsv !== null) parseAmount(amountCsv, byModel);
	if (byModel.size === 0) return null;
	let rawTotal = 0;
	const models = [];
	for (const agg of byModel.values()) {
		rawTotal += agg.cost;
		models.push({
			model: agg.model,
			cost: round2(agg.cost),
			requests: agg.requests,
			inputCacheHitTokens: agg.inputCacheHitTokens,
			inputCacheMissTokens: agg.inputCacheMissTokens,
			outputTokens: agg.outputTokens
		});
	}
	return {
		year: target.year,
		month: target.month,
		currency: "CNY",
		totalCost: round2(rawTotal),
		models
	};
}

/**
 * Query the DeepSeek platform monthly billing exports and return a
 * structured, secret-free summary for up to `months` months (default 3).
 *
 * @param credentials - credentials service with `resolve(ref)` → `{ value }`
 * @param options - `{ months?, now?, fetchImpl? }`
 */
export async function queryDeepseekBilling(credentials, options = {}) {
	const token = await resolveToken(credentials);
	if (token === "") return {
		configured: false,
		message: "未配置 DeepSeek 平台登录 Token（DEEPSEEK_USER_TOKEN）",
		fetchedAt: null,
		months: []
	};
	const nowMs = (options.now ?? Date.now)();
	const months = Math.max(1, Math.min(12, Math.trunc(options.months ?? 3) || 3));
	const fetchImpl = options.fetchImpl ?? fetch;
	const monthsOut = [];
	for (const target of monthTargets(nowMs, months)) try {
		const month = await fetchMonth(target, token, fetchImpl);
		if (month !== null) monthsOut.push(month);
	} catch {}
	if (monthsOut.length === 0) return {
		configured: true,
		message: "DeepSeek 账单拉取失败（Token 可能已失效或近期无账单数据）",
		fetchedAt: null,
		months: []
	};
	return {
		configured: true,
		message: null,
		fetchedAt: nowMs,
		months: monthsOut
	};
}
