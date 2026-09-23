/**
 * Unified provider-account monitoring.
 *
 * Adapters normalize monetary balances and subscription/token-plan windows to
 * one discriminated account snapshot. Configuration is declarative: secrets
 * are credential references, request paths are relative, and response fields
 * are extracted with JSON Pointer rather than executable JavaScript.
 *
 * @module dsh-usage-skill/accounts
 */

import { balanceSchemeOf, queryBalance } from "./balance.js";
import { collectSubscription } from "./subscriptions.js";
import { lookup as dnsLookup } from "node:dns/promises";
import { request as httpRequest } from "node:http";
import { request as httpsRequest } from "node:https";
import { isIP } from "node:net";
import { createHash, randomBytes } from "node:crypto";

const DEFAULT_TIMEOUT_MS = 15000;
const DEFAULT_REFRESH_MS = 300000;
const MAX_RESPONSE_BYTES = 1024 * 1024;
const OPENROUTER_MANAGEMENT_REF = "OPENROUTER_MANAGEMENT_KEY";
const SENSENOVA_CONSOLE_TOKEN_REF = "SENSENOVA_CONSOLE_TOKEN";
const SENSENOVA_USERNAME_REF = "SENSENOVA_USERNAME";
const SENSENOVA_PASSWORD_REF = "SENSENOVA_PASSWORD";
const SENSENOVA_PLATFORM_ORIGIN = "https://platform.sensenova.cn";
const SENSENOVA_ISSUER = "https://signin.sensecore.cn";
const SENSENOVA_IAM = "https://iam.sensecoreapi.cn";
const SENSENOVA_CLIENT_ID = "nova";
const SENSENOVA_REDIRECT_URI = "https://platform.sensenova.cn";
const SENSENOVA_AUTHORIZE = "https://platform.sensenova.cn/oauth2/auth";
const SENSENOVA_SCOPE = "openid offline offline_access";
const SENSENOVA_TOKEN_SKEW_MS = 60000;
const sensenovaTokenCache = new Map();
const ACCOUNT_STATUSES = new Set([
	"ok",
	"not-configured",
	"unauthorized",
	"rate-limited",
	"unavailable",
	"invalid-response",
	"unsupported"
]);
const ADAPTERS = new Set([
	"deepseek-balance",
	"openrouter-balance",
	"moonshot-balance",
	"zai-balance",
	"general",
	"new-api",
	"sub2api",
	"opencode-go",
	"zai-token-plan",
	"kimi-token-plan",
	"minimax-token-plan",
	"sensenova-token-plan",
	"declarative"
]);
const SENSITIVE_HEADERS = new Set([
	"authorization",
	"api-key",
	"cookie",
	"host",
	"proxy-authorization",
	"proxy-authenticate",
	"set-cookie",
	"transfer-encoding",
	"connection",
	"upgrade",
	"x-api-key"
]);

function nonEmptyString(value) {
	return typeof value === "string" && value.trim() !== "" ? value.trim() : null;
}

function numberOrNull(value) {
	if (typeof value === "number" && Number.isFinite(value)) return value;
	if (typeof value === "string" && value.trim() !== "") {
		const parsed = Number(value);
		if (Number.isFinite(parsed)) return parsed;
	}
	return null;
}

function booleanOrNull(value) {
	if (typeof value === "boolean") return value;
	if (value === 1 || value === "1" || value === "true") return true;
	if (value === 0 || value === "0" || value === "false") return false;
	return null;
}

function round1(value) {
	return Math.round(value * 10) / 10;
}

function toIso(value) {
	if (value === null || value === void 0 || value === "") return null;
	if (typeof value === "number" && Number.isFinite(value)) {
		const date = new Date(value < 20000000000 ? value * 1000 : value);
		return Number.isNaN(date.getTime()) ? null : date.toISOString();
	}
	const date = new Date(String(value));
	return Number.isNaN(date.getTime()) ? null : date.toISOString();
}

function statusError(status, message, httpStatus) {
	const error = new Error(message);
	error.providerStatus = status;
	if (httpStatus !== void 0) error.httpStatus = httpStatus;
	return error;
}

function statusOf(error) {
	if (ACCOUNT_STATUSES.has(error?.providerStatus)) return error.providerStatus;
	if (error?.name === "TimeoutError" || error?.name === "AbortError") return "unavailable";
	return "unavailable";
}

async function resolveCredential(credentials, ref) {
	if (nonEmptyString(ref) === null || credentials === null || credentials === void 0 || typeof credentials.resolve !== "function") return "";
	try {
		const hit = await credentials.resolve(ref);
		return nonEmptyString(hit?.value) ?? "";
	} catch {
		return "";
	}
}

function responseStatus(status) {
	if (status === 401 || status === 403) return "unauthorized";
	if (status === 429) return "rate-limited";
	if (status === 404 || status === 405) return "unsupported";
	return status >= 500 ? "unavailable" : "invalid-response";
}

async function parseJsonResponse(response, maxBytes = MAX_RESPONSE_BYTES) {
	const declared = numberOrNull(response.headers?.get?.("content-length"));
	if (declared !== null && declared > maxBytes) throw statusError("invalid-response", "upstream response exceeds the size limit");
	const contentType = response.headers?.get?.("content-type");
	if (typeof contentType === "string" && contentType !== "" && !/\bjson\b/i.test(contentType)) {
		throw statusError("invalid-response", "upstream did not return JSON");
	}
	if (typeof response.arrayBuffer === "function") {
		const bytes = new Uint8Array(await response.arrayBuffer());
		if (bytes.byteLength > maxBytes) throw statusError("invalid-response", "upstream response exceeds the size limit");
		try {
			return JSON.parse(new TextDecoder().decode(bytes));
		} catch {
			throw statusError("invalid-response", "upstream returned invalid JSON");
		}
	}
	try {
		return await response.json();
	} catch {
		throw statusError("invalid-response", "upstream returned invalid JSON");
	}
}

async function requestJson(url, init, deps = {}) {
	const response = await (deps.fetch ?? fetch)(url, {
		...init,
		redirect: "manual",
		signal: AbortSignal.timeout(deps.timeoutMs ?? DEFAULT_TIMEOUT_MS)
	});
	if (!response.ok) throw statusError(responseStatus(response.status), `upstream returned HTTP ${response.status}`, response.status);
	return parseJsonResponse(response, deps.maxResponseBytes ?? MAX_RESPONSE_BYTES);
}

function schemeAdapter(scheme) {
	return `${scheme}-balance`;
}

function schemeOfAdapter(adapter) {
	return adapter.endsWith("-balance") ? adapter.slice(0, -8) : null;
}

function defaultAdapter(provider) {
	const providerId = provider.id;
	if (providerId === "opencode-go") return "opencode-go";
	if (providerId === "zai" || providerId === "zai-coding-cn") return "zai-token-plan";
	if (providerId === "kimi-coding" || providerId === "kimi-for-coding") return "kimi-token-plan";
	if (["minimax", "minimaxi", "minimax-cn", "minimax-coding"].includes(providerId)) return "minimax-token-plan";
	if (providerId === "sensenova") return "sensenova-token-plan";
	if (providerId === "passion") return "sub2api";
	try {
		const hostname = new URL(provider.baseURL).hostname.toLowerCase();
		if (hostname === "passionapi.com" || hostname.endsWith(".passionapi.com")) return "sub2api";
		if (hostname === "token.sensenova.cn" || hostname.endsWith(".sensenova.cn")) return "sensenova-token-plan";
	} catch {
		// A malformed provider URL is handled by the adapter when it is queried.
	}
	const scheme = balanceSchemeOf(providerId);
	return scheme === null ? null : schemeAdapter(scheme);
}

function adapterMode(adapter, monitor) {
	if (adapter === "declarative") return monitor.mode;
	if (["opencode-go", "zai-token-plan", "kimi-token-plan", "minimax-token-plan", "sensenova-token-plan"].includes(adapter)) return "subscription";
	return "balance";
}

function assertRelativePath(path, label) {
	if (typeof path !== "string" || !path.startsWith("/") || path.startsWith("//")) {
		throw new Error(`${label} must be an absolute-path relative path beginning with /`);
	}
	try {
		const parsed = new URL(path, "https://usage.invalid");
		if (parsed.origin !== "https://usage.invalid") throw new Error("origin changed");
	} catch {
		throw new Error(`${label} must be a relative path, not a URL`);
	}
}

function validatePointer(pointer, label) {
	if (pointer === void 0 || pointer === null) return;
	const value = typeof pointer === "object" && pointer !== null ? pointer.pointer : pointer;
	if (typeof value !== "string" || value !== "" && !value.startsWith("/")) throw new Error(`${label} must be a JSON Pointer`);
}

function validateWarning(value, label) {
	if (value === void 0) return;
	if (value === null || typeof value !== "object" || Array.isArray(value)) throw new Error(`${label} must be an object`);
	for (const field of ["warnBelow", "criticalBelow"]) {
		if (value[field] !== void 0 && numberOrNull(value[field]) === null) throw new Error(`${label}.${field} must be numeric`);
	}
	const warn = numberOrNull(value.warnBelow);
	const critical = numberOrNull(value.criticalBelow);
	if (warn !== null && critical !== null && critical > warn) throw new Error(`${label}.criticalBelow must not exceed warnBelow`);
}

function validateDeclarative(monitor, label) {
	if (monitor.mode !== "balance" && monitor.mode !== "subscription") throw new Error(`${label}.mode must be balance or subscription`);
	if (monitor.request === null || typeof monitor.request !== "object" || Array.isArray(monitor.request)) throw new Error(`${label}.request must be an object`);
	assertRelativePath(monitor.request.path, `${label}.request.path`);
	if (monitor.request.method !== void 0 && monitor.request.method !== "GET") throw new Error(`${label}.request.method must be GET`);
	const authType = monitor.request.auth?.type;
	if (authType !== void 0 && !["bearer", "raw", "x-api-key"].includes(authType)) throw new Error(`${label}.request.auth.type is unsupported`);
	for (const name of Object.keys(monitor.request.headers ?? {})) {
		if (SENSITIVE_HEADERS.has(name.toLowerCase())) throw new Error(`${label}.request.headers cannot override ${name}`);
	}
	if (monitor.extract === null || typeof monitor.extract !== "object" || Array.isArray(monitor.extract)) throw new Error(`${label}.extract must be an object`);
	for (const field of ["root", "valid", "invalidMessage", "plan", "remaining", "used", "total", "currency", "unlimited", "expiresAt", "items", "kind", "usedPercent", "remainingPercent", "resetsAt"]) {
		validatePointer(monitor.extract[field], `${label}.extract.${field}`);
	}
	if (monitor.mode === "balance" && monitor.extract.remaining === void 0 && monitor.extract.total === void 0) throw new Error(`${label}.extract requires remaining or total`);
	if (monitor.mode === "subscription" && monitor.extract.items === void 0) throw new Error(`${label}.extract.items is required`);
	if (monitor.extract.divisor !== void 0 && (numberOrNull(monitor.extract.divisor) === null || Number(monitor.extract.divisor) === 0)) throw new Error(`${label}.extract.divisor must be a non-zero number`);
}

/** Validate and freeze the non-secret account-monitor configuration shape. */
export function validateAccountConfig(raw = {}) {
	if (raw === null || typeof raw !== "object" || Array.isArray(raw)) throw new Error("account config must be an object");
	const monitors = raw.monitors ?? {};
	if (monitors === null || typeof monitors !== "object" || Array.isArray(monitors)) throw new Error("monitors must be an object keyed by provider id");
	const normalized = {};
	for (const [key, value] of Object.entries(monitors)) {
		const label = `monitors.${key}`;
		if (nonEmptyString(key) === null || value === null || typeof value !== "object" || Array.isArray(value)) throw new Error(`${label} must be an object`);
		const providerId = nonEmptyString(value.providerId) ?? key;
		const adapter = nonEmptyString(value.adapter);
		if (adapter === null || !ADAPTERS.has(adapter)) throw new Error(`${label}.adapter is unsupported`);
		if (value.usageBaseURL !== void 0) {
			let url;
			try { url = new URL(value.usageBaseURL); } catch { throw new Error(`${label}.usageBaseURL must be a valid URL`); }
			if (url.username !== "" || url.password !== "") throw new Error(`${label}.usageBaseURL must not contain credentials`);
			if (url.protocol !== "https:" && value.allowInsecure !== true) throw new Error(`${label}.usageBaseURL must use HTTPS unless allowInsecure is true`);
		}
		validateWarning(value.warning, `${label}.warning`);
		if (adapter === "declarative") validateDeclarative(value, label);
		normalized[providerId] = { ...value, providerId, adapter };
	}
	return { monitors: normalized };
}

/** Bind one configured Harness provider to its explicit or built-in adapter. */
export function resolveAccountSpec(provider, config = { monitors: {} }) {
	const monitor = config.monitors?.[provider.id] ?? {};
	const adapter = monitor.adapter ?? defaultAdapter(provider);
	const mode = adapter === null ? null : adapterMode(adapter, monitor);
	const apiKeyRef = monitor.credentialRef
		?? (adapter === "openrouter-balance" ? OPENROUTER_MANAGEMENT_REF
			: adapter === "sensenova-token-plan" ? SENSENOVA_USERNAME_REF
			: provider.apiKeyEnv);
	return {
		id: provider.id,
		displayName: provider.displayName ?? provider.id,
		adapter,
		mode,
		apiKeyRef,
		baseURL: monitor.usageBaseURL ?? provider.baseURL,
		providerBaseURL: provider.baseURL,
		monitor,
		configKey: JSON.stringify({ adapter, mode, provider, monitor })
	};
}

function decodePointerToken(token) {
	return token.replace(/~1/g, "/").replace(/~0/g, "~");
}

/** RFC 6901 JSON Pointer lookup; missing paths return undefined. */
export function jsonPointer(value, pointer) {
	if (pointer === "" || pointer === void 0 || pointer === null) return value;
	if (typeof pointer !== "string" || !pointer.startsWith("/")) return void 0;
	let current = value;
	for (const raw of pointer.slice(1).split("/")) {
		const key = decodePointerToken(raw);
		if (current === null || current === void 0 || typeof current !== "object" || !Object.hasOwn(current, key)) return void 0;
		current = current[key];
	}
	return current;
}

function mapped(root, mapping) {
	if (mapping === void 0 || mapping === null) return void 0;
	if (typeof mapping === "string") return jsonPointer(root, mapping);
	if (typeof mapping === "object" && typeof mapping.pointer === "string") {
		const value = jsonPointer(root, mapping.pointer);
		const divisor = numberOrNull(mapping.divisor);
		return divisor === null ? value : numberOrNull(value) === null ? void 0 : Number(value) / divisor;
	}
	return void 0;
}

function ipv4Private(octets) {
	const [a, b, c] = octets;
	return a === 0
		|| a === 10
		|| a === 127
		|| a === 169 && b === 254
		|| a === 172 && b >= 16 && b <= 31
		|| a === 192 && b === 168
		|| a === 192 && b === 0 && (c === 0 || c === 2)
		|| a === 192 && b === 88 && c === 99
		|| a === 100 && b >= 64 && b <= 127
		|| a === 198 && (b === 18 || b === 19)
		|| a === 198 && b === 51 && c === 100
		|| a === 203 && b === 0 && c === 113
		|| a >= 224;
}

function ipv6Bytes(address) {
	let value = address.toLowerCase().split("%")[0];
	let ipv4Tail = null;
	const lastColon = value.lastIndexOf(":");
	if (value.slice(lastColon + 1).includes(".")) {
		const octets = value.slice(lastColon + 1).split(".").map(Number);
		if (octets.length !== 4 || octets.some((part) => !Number.isInteger(part) || part < 0 || part > 255)) return null;
		ipv4Tail = [(octets[0] << 8) | octets[1], (octets[2] << 8) | octets[3]];
		value = `${value.slice(0, lastColon)}:${ipv4Tail[0].toString(16)}:${ipv4Tail[1].toString(16)}`;
	}
	const halves = value.split("::");
	if (halves.length > 2) return null;
	const left = halves[0] === "" ? [] : halves[0].split(":");
	const right = halves.length === 1 || halves[1] === "" ? [] : halves[1].split(":");
	const missing = 8 - left.length - right.length;
	if (missing < 0 || halves.length === 1 && missing !== 0) return null;
	const words = [...left, ...Array(missing).fill("0"), ...right].map((part) => Number.parseInt(part || "0", 16));
	if (words.length !== 8 || words.some((part) => !Number.isInteger(part) || part < 0 || part > 0xffff)) return null;
	const bytes = [];
	for (const word of words) bytes.push(word >> 8, word & 0xff);
	return bytes;
}

/** True for loopback, private, link-local, documentation, multicast, and other non-public IP space. */
export function isPrivateAddress(address) {
	const value = String(address ?? "").trim().replace(/^\[|\]$/g, "");
	if (isIP(value) === 4) return ipv4Private(value.split(".").map(Number));
	if (isIP(value) !== 6) return false;
	const bytes = ipv6Bytes(value);
	if (bytes === null) return true;
	if (bytes.slice(0, 10).every((byte) => byte === 0) && bytes[10] === 0xff && bytes[11] === 0xff) return ipv4Private(bytes.slice(12));
	// Public provider endpoints should resolve to global unicast (2000::/3).
	// This conservative allow-range excludes loopback/unspecified, NAT64,
	// discard-only, ULA, link/site-local, multicast, and other special space.
	const globalUnicast = (bytes[0] & 0xe0) === 0x20;
	const word0 = (bytes[0] << 8) | bytes[1];
	const word1 = (bytes[2] << 8) | bytes[3];
	// IETF protocol assignments 2001:0000::/23 include benchmarking, ORCHID,
	// and tunnel mechanisms; 2002::/16 (6to4) embeds an unchecked IPv4 target.
	const ietfSpecial = word0 === 0x2001 && word1 <= 0x01ff;
	const sixToFour = word0 === 0x2002;
	const documentation = word0 === 0x2001 && word1 === 0x0db8
		|| word0 === 0x3fff && (word1 & 0xf000) === 0;
	return !globalUnicast || ietfSpecial || sixToFour || documentation;
}

function privateHostname(hostname) {
	const host = hostname.toLowerCase().replace(/^\[|\]$/g, "");
	return host === "localhost" || host.endsWith(".localhost") || isPrivateAddress(host);
}

async function resolvePublicAddress(url, spec, deps) {
	const hostname = url.hostname.replace(/^\[|\]$/g, "");
	if (privateHostname(hostname) && spec.monitor.allowPrivateNetwork !== true) throw statusError("unsupported", "account monitor private-network access requires allowPrivateNetwork");
	if (isIP(hostname) !== 0) return { address: hostname, family: isIP(hostname) };
	let addresses;
	try {
		addresses = await (deps.lookup ?? dnsLookup)(hostname, { all: true, verbatim: true });
	} catch {
		throw statusError("unavailable", "account monitor hostname could not be resolved");
	}
	if (!Array.isArray(addresses)) addresses = [addresses];
	if (addresses.length === 0) throw statusError("unavailable", "account monitor hostname resolved to no addresses");
	if (spec.monitor.allowPrivateNetwork !== true && addresses.some((entry) => isPrivateAddress(entry?.address))) {
		throw statusError("unsupported", "account monitor hostname resolves to a private network");
	}
	const selected = addresses[0];
	return { address: selected.address, family: selected.family ?? isIP(selected.address) };
}

function crossOriginSensitive(spec) {
	return spec.monitor.usageBaseURL !== void 0
		|| spec.adapter === "general"
		|| spec.adapter === "new-api"
		|| spec.adapter === "declarative"
		|| schemeOfAdapter(spec.adapter ?? "") !== null;
}

async function assertTargetPolicy(rawUrl, spec, deps) {
	const url = new URL(rawUrl);
	if (url.username !== "" || url.password !== "") throw statusError("unsupported", "account monitor URL must not contain credentials");
	if (url.protocol !== "https:" && spec.monitor.allowInsecure !== true) throw statusError("unsupported", "account monitor requires HTTPS");
	if (url.protocol !== "https:" && url.protocol !== "http:") throw statusError("unsupported", "account monitor protocol is unsupported");
	if (crossOriginSensitive(spec) && nonEmptyString(spec.providerBaseURL) !== null) {
		const providerOrigin = new URL(spec.providerBaseURL).origin;
		if (url.origin !== providerOrigin && spec.monitor.allowCrossOrigin !== true) throw statusError("unsupported", "account monitor cross-origin access requires allowCrossOrigin");
	}
	const resolved = await resolvePublicAddress(url, spec, deps);
	return { url, ...resolved };
}

function responseHeaders(headers) {
	return {
		get: (name) => {
			const value = headers[String(name).toLowerCase()];
			return Array.isArray(value) ? value.join(", ") : value === void 0 ? null : String(value);
		},
		getSetCookie: () => {
			const value = headers["set-cookie"];
			if (value === void 0) return [];
			return Array.isArray(value) ? value : [String(value)];
		}
	};
}

/** HTTPS/HTTP transport that pins the DNS answer checked by the policy layer. */
async function pinnedFetch(rawUrl, init, spec, deps) {
	const target = await assertTargetPolicy(rawUrl, spec, deps);
	const signal = init?.signal ?? AbortSignal.timeout(deps.timeoutMs ?? DEFAULT_TIMEOUT_MS);
	return new Promise((resolve, reject) => {
		const transport = target.url.protocol === "https:" ? httpsRequest : httpRequest;
		const request = transport(target.url, {
			method: init?.method ?? "GET",
			headers: init?.headers,
			signal,
			servername: isIP(target.url.hostname.replace(/^\[|\]$/g, "")) === 0 ? target.url.hostname : void 0,
			lookup: (_hostname, options, callback) => {
				if (options?.all) callback(null, [{ address: target.address, family: target.family }]);
				else callback(null, target.address, target.family);
			}
		}, (response) => {
			const chunks = [];
			let size = 0;
			response.on("data", (chunk) => {
				size += chunk.length;
				if (size > (deps.maxResponseBytes ?? MAX_RESPONSE_BYTES)) request.destroy(statusError("invalid-response", "upstream response exceeds the size limit"));
				else chunks.push(chunk);
			});
			response.on("end", () => {
				const body = Buffer.concat(chunks);
				resolve({
					ok: response.statusCode >= 200 && response.statusCode < 300,
					status: response.statusCode,
					headers: responseHeaders(response.headers),
					arrayBuffer: async () => body.buffer.slice(body.byteOffset, body.byteOffset + body.byteLength),
					json: async () => JSON.parse(body.toString("utf8")),
					text: async () => body.toString("utf8")
				});
			});
		});
		request.on("error", reject);
		if (init?.body !== void 0 && init?.body !== null && init?.body !== "") request.write(init.body);
		request.end();
	});
}

function customURL(spec) {
	const base = new URL(spec.baseURL);
	const providerBase = nonEmptyString(spec.providerBaseURL) === null ? null : new URL(spec.providerBaseURL);
	if (base.protocol !== "https:" && spec.monitor.allowInsecure !== true) throw statusError("unsupported", "custom monitor requires HTTPS");
	if (privateHostname(base.hostname) && spec.monitor.allowPrivateNetwork !== true) throw statusError("unsupported", "custom monitor private-network access requires allowPrivateNetwork");
	if (providerBase !== null && base.origin !== providerBase.origin && spec.monitor.allowCrossOrigin !== true) throw statusError("unsupported", "custom monitor cross-origin access requires allowCrossOrigin");
	const url = new URL(spec.monitor.request.path, base);
	if (url.origin !== base.origin) throw statusError("unsupported", "custom monitor request must stay on its configured origin");
	return url.href;
}

function customHeaders(spec, credential) {
	const headers = { accept: "application/json" };
	for (const [name, value] of Object.entries(spec.monitor.request.headers ?? {})) {
		if (!SENSITIVE_HEADERS.has(name.toLowerCase()) && typeof value === "string") headers[name] = value;
	}
	const type = spec.monitor.request.auth?.type;
	if (credential !== "") {
		if (type === "bearer") headers.authorization = `Bearer ${credential}`;
		if (type === "raw") headers.authorization = credential;
		if (type === "x-api-key") headers["x-api-key"] = credential;
	}
	return headers;
}

function balanceAlert(balance, warning) {
	const remaining = numberOrNull(balance?.remaining);
	const warnBelow = numberOrNull(warning?.warnBelow);
	const criticalBelow = numberOrNull(warning?.criticalBelow);
	if (remaining !== null && (warnBelow !== null || criticalBelow !== null)) {
		if (criticalBelow !== null && remaining <= criticalBelow) return { level: "critical", metric: "balance", value: remaining, threshold: criticalBelow };
		if (warnBelow !== null && remaining <= warnBelow) return { level: "warning", metric: "balance", value: remaining, threshold: warnBelow };
		return { level: "normal", metric: "balance", value: remaining };
	}
	const total = numberOrNull(balance?.total);
	if (remaining !== null && total !== null && total > 0) {
		const value = round1(Math.max(0, Math.min(100, remaining / total * 100)));
		return { level: value <= 10 ? "critical" : value <= 30 ? "warning" : "normal", metric: "remaining-percent", value };
	}
	return { level: "unknown", metric: "balance", value: remaining };
}

function subscriptionAlert(windows) {
	const remaining = windows.map((entry) => numberOrNull(entry.remainingPercent)).filter((value) => value !== null);
	if (remaining.length === 0) return { level: "unknown", metric: "remaining-percent", value: null };
	const value = round1(Math.min(...remaining));
	return { level: value <= 10 ? "critical" : value <= 30 ? "warning" : "normal", metric: "remaining-percent", value };
}

function baseSnapshot(spec, status, now) {
	return {
		id: spec.id,
		displayName: spec.displayName,
		mode: spec.mode ?? "balance",
		adapter: spec.adapter,
		status,
		fetchedAt: now
	};
}

function unavailableSnapshot(spec, status, now, extra = {}) {
	const base = baseSnapshot(spec, status, now);
	if (base.mode === "subscription") return { ...base, windows: [], alert: subscriptionAlert([]), ...extra };
	return { ...base, balance: null, alert: { level: "unknown", metric: "balance", value: null }, ...extra };
}

async function queryBuiltInBalance(spec, credential, deps, now) {
	const scheme = schemeOfAdapter(spec.adapter);
	const raw = await queryBalance(scheme, spec.baseURL, credential, deps.timeoutMs ?? DEFAULT_TIMEOUT_MS, deps.fetch ?? fetch);
	const remaining = numberOrNull(raw.total);
	if (remaining === null) throw statusError("invalid-response", "balance response is missing a numeric amount");
	const used = numberOrNull(raw.used);
	const total = numberOrNull(raw.limit);
	const balance = {
		remaining,
		...(used === null ? {} : { used }),
		...(total === null ? {} : { total }),
		currency: nonEmptyString(raw.currency) ?? "USD",
		unlimited: false,
		expiresAt: null,
		available: raw.isAvailable !== false,
		breakdown: {
			granted: numberOrNull(raw.granted),
			toppedUp: numberOrNull(raw.toppedUp)
		}
	};
	// DeepSeek's explicit `is_available` flag is an upstream account state.
	// Other schemes infer this field from a numeric zero balance, which remains a
	// valid successful response and should still render the critical balance.
	const status = scheme === "deepseek" && raw.isAvailable === false ? "unavailable" : "ok";
	return { ...baseSnapshot(spec, status, now), balance, alert: balanceAlert(balance, spec.monitor.warning) };
}

async function queryGeneral(spec, credential, deps, now) {
	const body = await requestJson(new URL("/user/balance", spec.baseURL).href, {
		headers: { authorization: `Bearer ${credential}`, accept: "application/json" }
	}, deps);
	const remaining = numberOrNull(body?.balance);
	if (remaining === null) throw statusError("invalid-response", "general balance response is missing balance");
	const balance = { remaining, currency: nonEmptyString(body?.currency) ?? "USD", unlimited: false, expiresAt: null };
	return { ...baseSnapshot(spec, "ok", now), balance, alert: balanceAlert(balance, spec.monitor.warning) };
}

async function quotaPerUnit(spec, deps) {
	try {
		const body = await requestJson(new URL("/api/status", spec.baseURL).href, { headers: { accept: "application/json" } }, deps);
		const value = numberOrNull(body?.data?.quota_per_unit);
		if (value !== null && value > 0) return { value, fallback: false };
		// Old status schemas did not expose quota_per_unit.
		return { value: 500000, fallback: true };
	} catch (error) {
		if (error?.httpStatus === 404 || error?.httpStatus === 405) return { value: 500000, fallback: true };
		throw error;
	}
}

async function queryNewApiFallback(spec, credentials, deps, now) {
	const ref = spec.monitor.fallbackCredentialRef;
	const token = await resolveCredential(credentials, ref);
	if (token === "") return unavailableSnapshot(spec, "unsupported", now, { missingCredentials: ref === void 0 ? [] : [ref] });
	const headers = { authorization: `Bearer ${token}`, accept: "application/json" };
	const userId = await resolveCredential(credentials, spec.monitor.fallbackUserIdRef);
	if (userId !== "") headers["new-api-user"] = userId;
	const [body, quotaUnit] = await Promise.all([
		requestJson(new URL("/api/user/self", spec.baseURL).href, { headers }, deps),
		quotaPerUnit(spec, deps)
	]);
	const unit = quotaUnit.value;
	if (body?.success === false || body?.data === null || typeof body?.data !== "object") throw statusError("invalid-response", "New API user response is invalid");
	const remainingQuota = numberOrNull(body.data.quota);
	const usedQuota = numberOrNull(body.data.used_quota);
	if (remainingQuota === null) throw statusError("invalid-response", "New API user response is missing quota");
	const balance = {
		remaining: remainingQuota / unit,
		...(usedQuota === null ? {} : { used: usedQuota / unit, total: (remainingQuota + usedQuota) / unit }),
		currency: "USD",
		unlimited: false,
		expiresAt: null
	};
	return {
		...baseSnapshot(spec, "ok", now),
		plan: nonEmptyString(body.data.group) ?? void 0,
		balance,
		alert: balanceAlert(balance, spec.monitor.warning),
		source: "management-fallback",
		quotaUnit: unit,
		quotaUnitFallback: quotaUnit.fallback
	};
}

async function queryNewApi(spec, credentials, credential, deps, now) {
	let body;
	try {
		body = await requestJson(new URL("/api/usage/token/", spec.baseURL).href, {
			headers: { authorization: `Bearer ${credential}`, accept: "application/json" }
		}, deps);
	} catch (error) {
		if (error?.httpStatus === 404 || error?.httpStatus === 405) return queryNewApiFallback(spec, credentials, deps, now);
		throw error;
	}
	if (body?.code !== true || body?.data === null || typeof body?.data !== "object") throw statusError("invalid-response", "New API token response is invalid");
	const granted = numberOrNull(body.data.total_granted);
	const used = numberOrNull(body.data.total_used);
	const available = numberOrNull(body.data.total_available);
	const quotaUnit = await quotaPerUnit(spec, deps);
	const unit = quotaUnit.value;
	const unlimited = booleanOrNull(body.data.unlimited_quota) === true;
	if (!unlimited && available === null) throw statusError("invalid-response", "New API token response is missing total_available");
	const balance = {
		remaining: available === null ? null : available / unit,
		...(used === null ? {} : { used: used / unit }),
		...(granted === null ? {} : { total: granted / unit }),
		currency: "USD",
		unlimited,
		expiresAt: numberOrNull(body.data.expires_at) > 0 ? toIso(body.data.expires_at) : null
	};
	return {
		...baseSnapshot(spec, "ok", now),
		plan: nonEmptyString(body.data.name) ?? void 0,
		balance,
		alert: unlimited ? { level: "normal", metric: "remaining-percent", value: 100 } : balanceAlert(balance, spec.monitor.warning),
		source: "token",
		quotaUnit: unit,
		quotaUnitFallback: quotaUnit.fallback
	};
}

function amountWindow(kind, usedValue, limitValue, remainingValue, resetsAt) {
	const limit = numberOrNull(limitValue);
	if (limit === null || limit <= 0) return null;
	const remaining = numberOrNull(remainingValue);
	const used = numberOrNull(usedValue) ?? (remaining === null ? null : limit - remaining);
	if (used === null) return null;
	const usedPercent = round1(Math.max(0, Math.min(100, used / limit * 100)));
	const reset = toIso(resetsAt);
	return {
		kind,
		usedPercent,
		remainingPercent: round1(100 - usedPercent),
		...(reset === null ? {} : { resetsAt: reset })
	};
}

function sub2ApiWindowKind(value) {
	const kind = nonEmptyString(value) ?? "quota";
	if (kind === "5h") return "session";
	if (kind === "1d") return "daily";
	if (kind === "7d") return "weekly";
	return kind;
}

function sub2ApiSubscription(spec, body, now) {
	const windows = [];
	if (body.mode === "quota_limited") {
		const quota = body.quota;
		if (quota === null || typeof quota !== "object" || Array.isArray(quota)) {
			throw statusError("invalid-response", "Sub2API quota response is missing quota");
		}
		const total = amountWindow("quota", quota.used, quota.limit, quota.remaining, body.expires_at);
		if (total !== null) windows.push(total);
		for (const entry of Array.isArray(body.rate_limits) ? body.rate_limits : []) {
			if (entry === null || typeof entry !== "object" || Array.isArray(entry)) continue;
			const window = amountWindow(sub2ApiWindowKind(entry.window), entry.used, entry.limit, entry.remaining, entry.reset_at);
			if (window !== null) windows.push(window);
		}
	} else {
		const subscription = body.subscription;
		if (subscription === null || typeof subscription !== "object" || Array.isArray(subscription)) {
			throw statusError("invalid-response", "Sub2API subscription response is missing subscription limits");
		}
		for (const period of ["daily", "weekly", "monthly"]) {
			const window = amountWindow(
				period,
				subscription[`${period}_usage_usd`],
				subscription[`${period}_limit_usd`],
				null,
				null
			);
			if (window !== null) windows.push(window);
		}
	}
	if (windows.length === 0) throw statusError("invalid-response", "Sub2API response has no usable quota windows");
	return {
		...baseSnapshot(spec, "ok", now),
		mode: "subscription",
		plan: nonEmptyString(body.planName) ?? nonEmptyString(body.plan_name) ?? "Sub2API",
		windows,
		alert: subscriptionAlert(windows)
	};
}

async function querySub2Api(spec, credential, deps, now) {
	const body = await requestJson(new URL("/v1/usage", spec.baseURL).href, {
		headers: { authorization: `Bearer ${credential}`, accept: "application/json" }
	}, deps);
	if (body === null || typeof body !== "object" || Array.isArray(body)) throw statusError("invalid-response", "Sub2API response must be an object");
	if (body.isValid === false || body.is_active === false) throw statusError("unauthorized", "Sub2API key is invalid");
	const hasSubscription = body.subscription !== null && typeof body.subscription === "object" && !Array.isArray(body.subscription);
	if (body.mode === "quota_limited" || hasSubscription) return sub2ApiSubscription(spec, body, now);
	const remaining = numberOrNull(body.balance ?? body.remaining);
	if (remaining === null) throw statusError("invalid-response", "Sub2API response is missing a numeric balance");
	const balance = {
		remaining,
		currency: nonEmptyString(body.unit) ?? "USD",
		unlimited: false,
		expiresAt: toIso(body.expires_at)
	};
	return {
		...baseSnapshot(spec, "ok", now),
		mode: "balance",
		plan: nonEmptyString(body.planName) ?? nonEmptyString(body.plan_name) ?? void 0,
		balance,
		alert: balanceAlert(balance, spec.monitor.warning)
	};
}

function customBalance(spec, body, now) {
	const extract = spec.monitor.extract;
	const root = jsonPointer(body, extract.root ?? "");
	if (root === void 0) throw statusError("invalid-response", "custom response root is missing");
	const valid = mapped(root, extract.valid);
	if (valid === false) throw statusError("invalid-response", String(mapped(root, extract.invalidMessage) ?? "custom response is marked invalid"));
	const divisor = numberOrNull(extract.divisor) ?? 1;
	const remainingRaw = numberOrNull(mapped(root, extract.remaining) ?? mapped(root, extract.total));
	if (remainingRaw === null) throw statusError("invalid-response", "custom response is missing a numeric balance");
	const usedRaw = numberOrNull(mapped(root, extract.used));
	const totalRaw = numberOrNull(mapped(root, extract.total));
	const balance = {
		remaining: remainingRaw / divisor,
		...(usedRaw === null ? {} : { used: usedRaw / divisor }),
		...(totalRaw === null ? {} : { total: totalRaw / divisor }),
		currency: nonEmptyString(mapped(root, extract.currency)) ?? nonEmptyString(extract.currencyValue) ?? "USD",
		unlimited: booleanOrNull(mapped(root, extract.unlimited)) === true,
		expiresAt: toIso(mapped(root, extract.expiresAt))
	};
	return { ...baseSnapshot(spec, "ok", now), plan: nonEmptyString(mapped(root, extract.plan)) ?? void 0, balance, alert: balanceAlert(balance, spec.monitor.warning) };
}

function customSubscription(spec, body, now) {
	const extract = spec.monitor.extract;
	const root = jsonPointer(body, extract.root ?? "");
	const items = mapped(root, extract.items);
	if (!Array.isArray(items)) throw statusError("invalid-response", "custom response items must be an array");
	const windows = [];
	for (const item of items) {
		const used = numberOrNull(mapped(item, extract.usedPercent));
		const remaining = numberOrNull(mapped(item, extract.remainingPercent));
		if (used === null && remaining === null) continue;
		const usedPercent = round1(Math.max(0, Math.min(100, used ?? 100 - remaining)));
		const remainingPercent = round1(Math.max(0, Math.min(100, remaining ?? 100 - used)));
		windows.push({
			kind: nonEmptyString(mapped(item, extract.kind)) ?? "quota",
			usedPercent,
			remainingPercent,
			...(toIso(mapped(item, extract.resetsAt)) === null ? {} : { resetsAt: toIso(mapped(item, extract.resetsAt)) })
		});
	}
	if (windows.length === 0) throw statusError("invalid-response", "custom response has no usable quota windows");
	return { ...baseSnapshot(spec, "ok", now), plan: nonEmptyString(mapped(root, extract.plan)) ?? void 0, windows, alert: subscriptionAlert(windows) };
}

async function queryDeclarative(spec, credentials, deps, now) {
	const ref = spec.monitor.request.auth?.credentialRef ?? spec.apiKeyRef;
	const credential = await resolveCredential(credentials, ref);
	if (spec.monitor.request.auth !== void 0 && credential === "") return unavailableSnapshot(spec, "not-configured", now, { missingCredentials: ref === void 0 ? [] : [ref] });
	const body = await requestJson(customURL(spec), { method: "GET", headers: customHeaders(spec, credential) }, deps);
	return spec.mode === "subscription" ? customSubscription(spec, body, now) : customBalance(spec, body, now);
}

/** Decode a JWT payload without verifying the signature (public claims only). */
function decodeJwtPayload(token) {
	const parts = String(token).split(".");
	if (parts.length < 2) return null;
	let b64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
	while (b64.length % 4 !== 0) b64 += "=";
	try {
		const bytes = Uint8Array.from(atob(b64), (c) => c.charCodeAt(0));
		return JSON.parse(new TextDecoder().decode(bytes));
	} catch {
		return null;
	}
}

function randomToken(bytes = 32) {
	return randomBytes(bytes).toString("base64url");
}

function pkceChallenge(verifier) {
	return createHash("sha256").update(verifier).digest("base64url");
}

function redirectLocation(response) {
	const direct = response?.headers?.get?.("location");
	if (typeof direct === "string" && direct !== "") return direct;
	if (typeof response?.headers?.location === "string" && response.headers.location !== "") return response.headers.location;
	return null;
}

/** Minimal per-host cookie jar for Hydra's CSRF cookie across the login flow. */
function createCookieJar() {
	const jars = new Map();
	function capture(response, url) {
		const setCookies = response?.headers?.getSetCookie?.();
		if (!Array.isArray(setCookies) || setCookies.length === 0) return;
		const host = new URL(url).hostname;
		if (!jars.has(host)) jars.set(host, new Map());
		const jar = jars.get(host);
		for (const entry of setCookies) {
			const pair = String(entry).split(";")[0];
			const eq = pair.indexOf("=");
			if (eq <= 0) continue;
			jar.set(pair.slice(0, eq).trim(), pair.slice(eq + 1).trim());
		}
	}
	function cookieHeader(url) {
		const jar = jars.get(new URL(url).hostname);
		if (jar === void 0 || jar.size === 0) return null;
		return [...jar.entries()].map(([name, value]) => `${name}=${value}`).join("; ");
	}
	return { capture, cookieHeader };
}

async function requestRaw(url, init, deps, jar = null) {
	const headers = { ...(init?.headers ?? {}) };
	const cookie = jar === null ? null : jar.cookieHeader(url);
	if (cookie !== null && cookie !== void 0 && cookie !== "") headers.cookie = cookie;
	const response = await (deps.fetch ?? fetch)(url, {
		...init,
		headers,
		redirect: "manual",
		signal: AbortSignal.timeout(deps.timeoutMs ?? DEFAULT_TIMEOUT_MS)
	});
	if (jar !== null) jar.capture(response, url);
	return response;
}

/**
 * SenseNova console auth is a Hydra-style authorization-code + PKCE flow that
 * frontends with a username/password POST. The console access token is
 * short-lived, so the password login is only the bootstrap: the token endpoint
 * also returns a refresh token that is used to renew the access token until the
 * refresh token itself is rejected.
 */
async function sensenovaLogin(username, password, deps) {
	const verifier = randomToken();
	const state = randomToken();
	const jar = createCookieJar();
	const authorize = new URL(SENSENOVA_AUTHORIZE);
	authorize.searchParams.set("client_id", SENSENOVA_CLIENT_ID);
	authorize.searchParams.set("response_type", "code");
	authorize.searchParams.set("redirect_uri", SENSENOVA_REDIRECT_URI);
	authorize.searchParams.set("scope", SENSENOVA_SCOPE);
	authorize.searchParams.set("state", state);
	authorize.searchParams.set("code_challenge", pkceChallenge(verifier));
	authorize.searchParams.set("code_challenge_method", "S256");

	const authorizeResponse = await requestRaw(authorize.href, { method: "GET" }, deps, jar);
	const loginLocation = redirectLocation(authorizeResponse);
	if (loginLocation === null) throw statusError("invalid-response", "SenseNova login flow did not redirect to a login challenge");
	const loginChallenge = new URL(loginLocation).searchParams.get("login_challenge");
	if (loginChallenge === null) throw statusError("invalid-response", "SenseNova login flow did not include a login challenge");

	const challengeCheck = await requestJson(`${SENSENOVA_IAM}/iam/authn/v1/auth/checkChallenge?challenge=${encodeURIComponent(loginChallenge)}`, { method: "GET", headers: { accept: "application/json" } }, deps);
	if (challengeCheck?.is_valid !== true) throw statusError("invalid-response", "SenseNova login challenge is invalid");

	const loginBody = JSON.stringify({ username, password, challenge: loginChallenge });
	const loginResponse = await requestJson(`${SENSENOVA_IAM}/iam/authn/v1/auth/nova/login`, {
		method: "POST",
		headers: { "content-type": "application/json", accept: "application/json" },
		body: loginBody
	}, deps);
	const next = nonEmptyString(loginResponse?.redirect);
	if (next === null) throw statusError("invalid-response", "SenseNova login response is missing a redirect");

	// Follow the Hydra login-verifier redirect chain (carrying the CSRF cookie
	// issued by the initial authorize request) until the authorization code
	// appears in the callback URL.
	let code = null;
	let cursor = next;
	for (let hop = 0; hop < 6 && code === null; hop++) {
		const candidate = new URL(cursor).searchParams.get("code");
		if (candidate !== null) { code = candidate; break; }
		const response = await requestRaw(cursor, { method: "GET" }, deps, jar);
		const location = redirectLocation(response);
		if (location === null) break;
		cursor = new URL(location, cursor).href;
	}
	if (code === null) throw statusError("invalid-response", "SenseNova login flow did not produce an authorization code");

	const tokenResponse = await requestJson(`${SENSENOVA_ISSUER}/oauth2/token`, {
		method: "POST",
		headers: { "content-type": "application/x-www-form-urlencoded", accept: "application/json" },
		body: new URLSearchParams({
			grant_type: "authorization_code",
			code,
			redirect_uri: SENSENOVA_REDIRECT_URI,
			client_id: SENSENOVA_CLIENT_ID,
			code_verifier: verifier
		}).toString()
	}, deps);
	const accessToken = nonEmptyString(tokenResponse?.access_token);
	if (accessToken === null) throw statusError("invalid-response", "SenseNova token response is missing access_token");
	const refreshToken = nonEmptyString(tokenResponse?.refresh_token) ?? "";
	const payload = decodeJwtPayload(accessToken);
	const expiresAt = payload?.exp !== void 0
		? Number(payload.exp) * 1000
		: (deps.now ?? Date.now)() + (numberOrNull(tokenResponse?.expires_in) ?? 10800) * 1000;
	return { accessToken, refreshToken, expiresAt };
}

async function sensenovaRefresh(refreshToken, deps) {
	const tokenResponse = await requestJson(`${SENSENOVA_ISSUER}/oauth2/token`, {
		method: "POST",
		headers: { "content-type": "application/x-www-form-urlencoded", accept: "application/json" },
		body: new URLSearchParams({
			grant_type: "refresh_token",
			client_id: SENSENOVA_CLIENT_ID,
			refresh_token: refreshToken
		}).toString()
	}, deps);
	const accessToken = nonEmptyString(tokenResponse?.access_token);
	if (accessToken === null) throw statusError("invalid-response", "SenseNova refresh response is missing access_token");
	const payload = decodeJwtPayload(accessToken);
	const expiresAt = payload?.exp !== void 0
		? Number(payload.exp) * 1000
		: (deps.now ?? Date.now)() + (numberOrNull(tokenResponse?.expires_in) ?? 10800) * 1000;
	return { accessToken, refreshToken: nonEmptyString(tokenResponse?.refresh_token) ?? refreshToken, expiresAt };
}

async function senseNovaAccessToken(spec, credentials, deps, now) {
	const direct = await resolveCredential(credentials, SENSENOVA_CONSOLE_TOKEN_REF);
	if (direct !== "") return { accessToken: direct, expiresAt: Number.MAX_SAFE_INTEGER };
	const username = await resolveCredential(credentials, SENSENOVA_USERNAME_REF);
	const password = await resolveCredential(credentials, SENSENOVA_PASSWORD_REF);
	const missing = [
		username === "" ? SENSENOVA_USERNAME_REF : void 0,
		password === "" ? SENSENOVA_PASSWORD_REF : void 0
	].filter((ref) => ref !== void 0);
	if (missing.length > 0) {
		sensenovaTokenCache.delete(spec.id);
		return { error: "not-configured", missingCredentials: missing };
	}
	const cached = sensenovaTokenCache.get(spec.id);
	if (cached !== void 0 && cached.expiresAt - now > SENSENOVA_TOKEN_SKEW_MS) return cached;
	if (cached !== void 0 && cached.refreshToken !== "") {
		try {
			const token = await sensenovaRefresh(cached.refreshToken, deps);
			sensenovaTokenCache.set(spec.id, token);
			return token;
		} catch (error) {
			// Refresh token is gone; fall back to a fresh password login.
		}
	}
	const token = await sensenovaLogin(username, password, deps);
	sensenovaTokenCache.set(spec.id, token);
	return token;
}

/**
 * SenseNova 已从「按模型百分比」升级为「积分制」：配额按积分池（通用池 /
 * Flash-Lite 专属池）划分，每个池有 5h 滚动窗口与 7 天窗口的积分额度，
 * 以及活动固定积分（grant，30 天有效）。控制台新接口
 * `/lite/console/v1/tokenplan/pool-usage` 返回池级数据；旧接口
 * `/lite/console/v1/user/coding-plan/usages`（按模型剩余百分比）仍可用，
 * 作为旧平台的回退。
 */
const SENSENOVA_TOKENPLAN_USAGE = `${SENSENOVA_PLATFORM_ORIGIN}/lite/console/v1/tokenplan/pool-usage`;

async function querySenseNovaPools(accessToken, spec, deps, now) {
	const body = await requestJson(SENSENOVA_TOKENPLAN_USAGE, { method: "GET", headers: { authorization: `Bearer ${accessToken}`, accept: "application/json" } }, deps);
	const pools = Array.isArray(body?.pools) ? body.pools : null;
	if (pools === null || pools.length === 0) throw statusError("invalid-response", "SenseNova pool usage response is missing pools");
	const windows = [];
	for (const pool of pools) {
		if (pool === null || typeof pool !== "object" || Array.isArray(pool)) continue;
		const poolName = nonEmptyString(pool.name) ?? "积分池";
		const poolType = nonEmptyString(pool.pool_type) ?? "default";
		const modelCount = Array.isArray(pool.model_ids) ? pool.model_ids.length : 0;
		const grantBalance = numberOrNull(pool.grant_balance);
		const grantExpiryRaw = numberOrNull(pool.nearest_grant_expiry);
		const grantExpiryAt = grantExpiryRaw !== null && grantExpiryRaw > 0 ? toIso(grantExpiryRaw) : null;
		for (const [winKey, winType, winLabel] of [["window_5h", "5h", "5h 窗口"], ["window_7d", "7d", "7天窗口"]]) {
			const w = pool[winKey];
			if (w === null || typeof w !== "object" || Array.isArray(w)) continue;
			const limit = numberOrNull(w?.limit);
			const used = numberOrNull(w?.used);
			const remaining = numberOrNull(w?.remaining);
			if (limit === null || limit <= 0 || used === null || remaining === null) continue;
			const resetsAt = toIso(numberOrNull(w?.reset_at));
			windows.push({
				kind: `${poolName} · ${winLabel}`,
				usedPercent: round1(Math.max(0, Math.min(100, used / limit * 100))),
				remainingPercent: round1(Math.max(0, Math.min(100, remaining / limit * 100))),
				...(resetsAt === null ? {} : { resetsAt }),
				// 积分制扩展字段：池名/池类型/窗口类型/积分绝对值/模型数/活动积分。
				poolName,
				poolType,
				windowType: winType,
				limit,
				used,
				remaining,
				modelCount,
				...(grantBalance === null ? {} : { grantBalance }),
				...(grantExpiryAt === null ? {} : { grantExpiryAt })
			});
		}
	}
	if (windows.length === 0) throw statusError("invalid-response", "SenseNova pool usage response has no usable quota windows");
	return { ...baseSnapshot(spec, "ok", now), plan: nonEmptyString(body?.plan?.name) ?? "Token Plan", windows, alert: subscriptionAlert(windows) };
}

async function querySenseNovaLegacy(accessToken, spec, deps, now) {
	const payload = decodeJwtPayload(accessToken);
	const tenantId = nonEmptyString(payload?.ext?.tenant_id) ?? nonEmptyString(payload?.tenant_id);
	if (tenantId === null) throw statusError("invalid-response", "SenseNova token does not contain tenant_id");
	const url = `${SENSENOVA_PLATFORM_ORIGIN}/lite/console/v1/user/coding-plan/usages?account_id=${encodeURIComponent(tenantId)}`;
	const body = await requestJson(url, { method: "GET", headers: { authorization: `Bearer ${accessToken}`, accept: "application/json" } }, deps);
	if (body === null || typeof body !== "object" || Array.isArray(body)) throw statusError("invalid-response", "SenseNova usage response must be an object");
	const pct = body.model_remaining_percent;
	if (pct === null || typeof pct !== "object" || Array.isArray(pct)) throw statusError("invalid-response", "SenseNova usage response is missing model_remaining_percent");
	const windows = [];
	for (const [kind, raw] of Object.entries(pct)) {
		const rem = numberOrNull(raw);
		if (rem === null) continue;
		const remainingPercent = round1(Math.max(0, Math.min(100, rem)));
		windows.push({
			kind: nonEmptyString(kind) ?? "unknown",
			usedPercent: round1(Math.max(0, Math.min(100, 100 - remainingPercent))),
			remainingPercent
		});
	}
	if (windows.length === 0) throw statusError("invalid-response", "SenseNova usage response has no usable quota windows");
	return { ...baseSnapshot(spec, "ok", now), plan: "Token Plan", windows, alert: subscriptionAlert(windows) };
}

async function querySenseNova(spec, credentials, deps, now) {
	const token = await senseNovaAccessToken(spec, credentials, deps, now);
	if (token.error === "not-configured") return unavailableSnapshot(spec, "not-configured", now, { missingCredentials: token.missingCredentials });
	try {
		return await querySenseNovaPools(token.accessToken, spec, deps, now);
	} catch (error) {
		// 新积分池接口在旧平台上不存在（404/405 → unsupported）时回退旧接口。
		if (error?.providerStatus !== "unsupported") throw error;
		return await querySenseNovaLegacy(token.accessToken, spec, deps, now);
	}
}

/** Query one adapter and return a secret-free normalized account snapshot. */
export async function queryAccount(spec, credentials, deps = {}) {
	const now = (deps.now ?? Date.now)();
	if (spec === null || spec === void 0 || spec.adapter === null || spec.mode === null) return unavailableSnapshot(spec ?? { id: "unknown", displayName: "Unknown", adapter: null, mode: "balance" }, "unsupported", now);
	try {
		const safeDeps = deps.fetch === void 0 ? { ...deps, fetch: (url, init) => pinnedFetch(url, init, spec, deps) } : deps;
		if (spec.adapter === "declarative") return await queryDeclarative(spec, credentials, safeDeps, now);
		const credential = await resolveCredential(credentials, spec.apiKeyRef);
		if (spec.adapter !== "opencode-go" && spec.adapter !== "sensenova-token-plan" && credential === "") return unavailableSnapshot(spec, "not-configured", now, { missingCredentials: spec.apiKeyRef === void 0 ? [] : [spec.apiKeyRef] });
		if (schemeOfAdapter(spec.adapter) !== null) return await queryBuiltInBalance(spec, credential, safeDeps, now);
		if (spec.adapter === "general") return await queryGeneral(spec, credential, safeDeps, now);
		if (spec.adapter === "new-api") return await queryNewApi(spec, credentials, credential, safeDeps, now);
		if (spec.adapter === "sub2api") return await querySub2Api(spec, credential, safeDeps, now);
		if (spec.adapter === "sensenova-token-plan") return await querySenseNova(spec, credentials, safeDeps, now);
		const subscriptionId = spec.adapter === "zai-token-plan" ? "zai"
			: spec.adapter === "kimi-token-plan" ? "kimi"
				: spec.adapter === "minimax-token-plan" ? "minimax"
					: "opencode-go";
		const provider = await collectSubscription(subscriptionId, credentials, {
			apiKeyRef: spec.apiKeyRef,
			region: spec.monitor.region
				?? (spec.adapter === "zai-token-plan" && String(spec.baseURL ?? "").includes("bigmodel.cn") ? "bigmodel-cn" : void 0)
				?? (spec.adapter === "minimax-token-plan" && String(spec.baseURL ?? "").includes("minimaxi.com") ? "cn" : void 0),
			baseURL: spec.monitor.usageBaseURL
		}, safeDeps);
		const windows = Array.isArray(provider.windows) ? provider.windows : [];
		return { ...baseSnapshot(spec, provider.status, now), plan: provider.plan, windows, alert: subscriptionAlert(windows), ...(provider.missingCredentials === void 0 ? {} : { missingCredentials: provider.missingCredentials }) };
	} catch (error) {
		return unavailableSnapshot(spec, statusOf(error), now);
	}
}

function isTransient(status) {
	return status === "unavailable" || status === "rate-limited" || status === "invalid-response";
}

function withStaleData(previous, current) {
	if (previous?.status !== "ok" || !isTransient(current.status)) return current;
	return {
		...previous,
		status: current.status,
		fetchedAt: current.fetchedAt,
		lastSuccessAt: previous.lastSuccessAt ?? previous.fetchedAt,
		stale: true
	};
}

/**
 * In-memory account cache with per-provider single-flight and forced bulk
 * refresh. Background scheduling is owned by the server plugin so it can also
 * refresh local token-usage aggregation in the same five-minute cycle.
 */
export function createAccountService({ credentials, getProviders, config = { monitors: {} }, deps = {} }) {
	const cache = new Map();
	const inflight = new Map();
	const refreshMs = deps.refreshMs ?? DEFAULT_REFRESH_MS;

	async function specs() {
		const providers = [...await getProviders()];
		if (deps.includeLegacyProviders !== false) {
			if (!providers.some((provider) => provider.id === "opencode-go")) providers.push({ id: "opencode-go", displayName: "OpenCode Go", apiKeyEnv: "OPENCODE_GO_API_KEY" });
			if (!providers.some((provider) => provider.id === "zai" || provider.id === "zai-coding-cn")) providers.push({ id: "zai", displayName: "Z.ai", apiKeyEnv: "ZAI_API_KEY", baseURL: "https://api.z.ai" });
		}
		const known = new Set(providers.map((provider) => provider.id));
		const unknown = Object.keys(config.monitors ?? {}).filter((providerId) => !known.has(providerId));
		if (unknown.length > 0) throw new Error(`account monitor references unknown provider: ${unknown.join(", ")}`);
		return providers.map((provider) => resolveAccountSpec(provider, config));
	}

	async function specById(providerId) {
		return (await specs()).find((spec) => spec.id === providerId) ?? null;
	}

	async function refresh(spec) {
		const existing = inflight.get(spec.id);
		if (existing !== void 0) return existing;
		const promise = queryAccount(spec, credentials, deps).then((current) => {
			const next = withStaleData(cache.get(spec.id)?.account, current);
			cache.set(spec.id, { configKey: spec.configKey, account: next });
			return next;
		}).finally(() => inflight.delete(spec.id));
		inflight.set(spec.id, promise);
		return promise;
	}

	async function get(providerId, { force = false } = {}) {
		const spec = await specById(providerId);
		if (spec === null) return null;
		const hit = cache.get(providerId);
		const age = (deps.now ?? Date.now)() - (hit?.account?.fetchedAt ?? 0);
		if (!force && hit?.configKey === spec.configKey && age >= 0 && age < refreshMs) return hit.account;
		return refresh(spec);
	}

	async function refreshAll() {
		const all = await specs();
		return Promise.all(all.filter((spec) => spec.adapter !== null).map(refresh));
	}

	async function providerViews() {
		return Promise.all((await specs()).map(async (spec) => {
			const account = cache.get(spec.id)?.account;
			const credentialConfigured = account === void 0 && spec.apiKeyRef !== void 0
				? await resolveCredential(credentials, spec.apiKeyRef) !== ""
				: false;
			return {
				id: spec.id,
				displayName: spec.displayName,
				accountMode: account?.mode ?? spec.mode,
				adapter: spec.adapter,
				configured: account === void 0 ? credentialConfigured : account.status !== "not-configured",
				status: account?.status ?? "pending",
				fetchedAt: account?.fetchedAt ?? null,
				alert: account?.alert ?? null
			};
		}));
	}

	async function subscriptionAccounts() {
		const all = await specs();
		const accounts = await Promise.all(all.filter((spec) => spec.mode === "subscription" || spec.adapter === "sub2api").map((spec) => get(spec.id)));
		return accounts.filter((account) => account?.mode === "subscription");
	}

	return {
		get,
		refreshAll,
		providerViews,
		subscriptionAccounts,
		validate: async () => { await specs(); },
		cached: (providerId) => cache.get(providerId)?.account ?? null
	};
}

export const ACCOUNT_REFRESH_MS = DEFAULT_REFRESH_MS;
