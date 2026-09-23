/**
 * mcp-recommended — MCP Server 推荐数据源（host 半身）。
 *
 * GET /api/mcp-recommended
 *
 * 数据来源（按序合并、去重，最多 40 条）：
 *   1. 官方   — modelcontextprotocol/servers 仓库 README（参考实现/SDK 清单，Markdown 解析）
 *   2. 社区   — MCP Registry 官方 API `https://registry.modelcontextprotocol.io/v0/servers`
 *               （开放注册的 Server 目录，结构化 JSON，limit=40）
 *
 * 稳定性：单源超时 8s + 一次重试（500ms 后）；双源全部失败才回退内置
 * FALLBACK（source='offline'）；成功时 source='official+community'。
 * 模块级缓存 5 分钟，避免每次开面板都打外网。
 *
 * 只读：不写 DSH 任何目录。
 */

import type { Context } from '@deepseek-ai/cordis'

const ROUTE_PATH = '/api/mcp-recommended'
const FETCH_TIMEOUT_MS = 8000
const CACHE_TTL_MS = 5 * 60 * 1000

interface RecommendedServer {
  id: string
  name: string
  description: string
  url?: string
  tag: 'official' | 'community'
  category: string
}

interface RecommendedResponse {
  source: 'official+community' | 'offline'
  updatedAt: string
  servers: RecommendedServer[]
}

/** 离线兜底：与早期内置清单一致（字段结构对齐远端条目）。 */
const FALLBACK: RecommendedServer[] = [
  { id: 'filesystem', name: 'Filesystem MCP', description: '提供安全的文件系统访问能力，支持读取、写入、搜索文件。', url: 'https://github.com/modelcontextprotocol/servers/tree/main/src/filesystem', tag: 'official', category: '文件' },
  { id: 'websearch', name: 'Web Search MCP', description: '集成网络搜索能力，获取实时信息和网页内容。', url: 'https://github.com/modelcontextprotocol/servers/tree/main/src/web-search', tag: 'official', category: '搜索' },
  { id: 'github', name: 'GitHub MCP', description: '访问 GitHub 仓库、Issue、管理代码、Pull Request 等。', url: 'https://github.com/github/github-mcp-server', tag: 'official', category: '开发' },
  { id: 'database', name: 'Database MCP', description: '连接并查询多种数据库，支持 SQL 执行和数据分析。', url: 'https://github.com/designcomputer/mysql_mcp_server', tag: 'community', category: '数据' },
  { id: 'slack', name: 'Slack MCP', description: '与 Slack 工作区集成，发送消息、读取频道和管理通知。', url: 'https://github.com/modelcontextprotocol/servers/tree/main/src/slack', tag: 'official', category: '协作' },
]

const OFFICIAL_SOURCE = 'https://raw.githubusercontent.com/modelcontextprotocol/servers/main/README.md'
/** 社区大目录：awesome-mcp-servers（GitHub 社区精选，上千条）。 */
const AWESOME_SOURCE = 'https://raw.githubusercontent.com/wong2/awesome-mcp-servers/main/README.md'
/** MCP Registry 官方 API（开放注册 Server 目录）。 */
const REGISTRY_SOURCE = 'https://registry.modelcontextprotocol.io/v0/servers?limit=40'
const SEARCH_ROUTE = '/api/mcp-recommended/search'
const RESOLVE_ROUTE = '/api/mcp-recommended/resolve'

/** 搜索条目（GitHub 仓库 / Registry Server）。 */
interface SearchItem {
  source: 'github' | 'registry'
  id: string
  name: string
  description: string
  url?: string
  stars?: number
}

/** GitHub 仓库搜索：短语「mcp server」+ 关键词，按 star 排序；只保留 MCP 相关仓库。 */
async function gitHubSearch(q: string): Promise<SearchItem[]> {
  const url = `https://api.github.com/search/repositories?q=${encodeURIComponent(`"mcp server" ${q}`)}&sort=stars&per_page=10`
  const raw = await fetchWithTimeout(url)
  const parsed = JSON.parse(raw) as { items?: Array<{ full_name?: unknown; description?: unknown; html_url?: unknown; stargazers_count?: unknown }> }
  const items = Array.isArray(parsed.items) ? parsed.items : []
  return items
    .filter((item) => typeof item.full_name === 'string' && item.full_name !== '')
    .filter((item) => {
      const text = `${item.full_name as string} ${typeof item.description === 'string' ? item.description : ''}`
      return /mcp/i.test(text)
    })
    .map((item): SearchItem => ({
      source: 'github',
      id: `gh-${(item.full_name as string).toLowerCase()}`,
      name: item.full_name as string,
      description: typeof item.description === 'string' ? item.description : '',
      url: typeof item.html_url === 'string' ? item.html_url : `https://github.com/${item.full_name as string}`,
      stars: typeof item.stargazers_count === 'number' ? item.stargazers_count : undefined,
    }))
}

/** Registry 搜索：search 参数（未命中时按关键字本地过滤）。 */
async function registrySearch(q: string): Promise<SearchItem[]> {
  const raw = await fetchWithTimeout(`${REGISTRY_SOURCE}&search=${encodeURIComponent(q)}`)
  const parsed = JSON.parse(raw) as { servers?: RegistryEntry[] }
  const entries = Array.isArray(parsed.servers) ? parsed.servers : []
  const rows: SearchItem[] = []
  const ql = q.toLowerCase()
  for (const entry of entries) {
    const server = entry.server ?? {}
    const name = typeof server.title === 'string' && server.title !== '' ? server.title : typeof server.name === 'string' ? server.name : ''
    if (name === '') continue
    const description = typeof server.description === 'string' ? server.description : ''
    if (ql !== '' && !name.toLowerCase().includes(ql) && !description.toLowerCase().includes(ql)) continue
    let url: string | undefined
    for (const remote of Array.isArray(server.remotes) ? server.remotes : []) {
      if (typeof remote.url === 'string' && /^https?:/.test(remote.url)) { url = remote.url; break }
    }
    rows.push({ source: 'registry', id: `registry-${name.toLowerCase().replace(/[^a-z0-9-]/g, '-').slice(0, 48)}`, name, description, url })
    if (rows.length >= 10) break
  }
  return rows
}

/** 搜索缓存：关键词 → 结果（60s），GitHub 匿名限 10 req/min。 */
const SEARCH_CACHE_TTL_MS = 60 * 1000
const searchCache = new Map<string, { at: number; value: SearchItem[] }>()

async function searchServers(qRaw: string): Promise<SearchItem[]> {
  const q = qRaw.trim()
  if (q.length < 2) return []
  const key = q.toLowerCase()
  const hit = searchCache.get(key)
  if (hit !== undefined && Date.now() - hit.at < SEARCH_CACHE_TTL_MS) return hit.value
  const merged: SearchItem[] = []
  const seen = new Set<string>()
  for (const results of await Promise.allSettled([gitHubSearch(q), registrySearch(q), awesomeSearch(q)])) {
    if (results.status !== 'fulfilled') continue
    for (const item of results.value as SearchItem[]) {
      const k = item.name.toLowerCase()
      if (seen.has(k)) continue
      seen.add(k)
      merged.push(item)
      if (merged.length >= 16) break
    }
  }
  searchCache.set(key, { at: Date.now(), value: merged })
  return merged
}

/* ── 一键添加：解析 GitHub 仓库 README 的连接方式 ────────────────────── */

/** 解析结果：识别出 stdio 命令或 http/sse 端点。 */
export interface ResolvedServer {
  ok: boolean
  type?: 'stdio' | 'http' | 'sse'
  command?: string
  url?: string
}

/** 常见安装片段 → stdio 命令（JSON command 优先取含包名的候选，其次裸命令行）。 */
function resolveCommand(readme: string): string | undefined {
  const jsonCandidates = Array.from(readme.matchAll(/"command"\s*:\s*"([^"]+)"/g))
    .map((match) => match[1].trim())
    .filter((command) => command.length > 4 && /^(npx|uvx|uv|python|deno|bunx|node|pipx)/.test(command))
  if (jsonCandidates.length > 0) {
    return jsonCandidates.sort((a, b) => b.length - a.length)[0]
  }
  const bare = /(?:^|\n)\s*(npx\s+-y\s+\S+|uvx\s+\S+|uv\s+run\s+\S+|python\s+-m\s+\S+|deno\s+run\s+\S+|bunx\s+\S+)[^\r\n"<]*/.exec(readme)
  if (bare) return bare[1].trim()
  return undefined
}

/** http/sse 端点：README 中形如 .../mcp 或 .../sse 的 URL（排除徽章/图片/仓库页链接）。 */
function resolveEndpoint(readme: string): { url: string; type: 'http' | 'sse' } | undefined {
  const badHost = /img\.shields\.io|raw\.githubusercontent|github\.com\/|user-images|badge/i
  const sse = /https?:\/\/[^\s"'<>()]+(?:\/sse)[^\s"'<>()]*/.exec(readme)
  if (sse && !badHost.test(sse[0])) return { url: sse[0], type: 'sse' }
  const http = /https?:\/\/[^\s"'<>()]+(?:\/mcp)[^\s"'<>()]*/.exec(readme)
  if (http && !badHost.test(http[0])) return { url: http[0], type: 'http' }
  return undefined
}

/** 拉取仓库 README（HEAD 分支）并解析连接方式。 */
async function resolveServer(repoUrl: string): Promise<ResolvedServer> {
  const match = /github\.com\/([^/]+)\/([^/#?]+)/.exec(repoUrl)
  if (match === null) return { ok: false }
  const fullName = `${match[1]}/${match[2].replace(/\.git$/, '')}`
  let readme = ''
  for (const name of ['README.md', 'README.MD', 'readme.md', 'README.rst']) {
    try {
      readme = await fetchWithTimeout(`https://raw.githubusercontent.com/${fullName}/HEAD/${name}`)
      break
    } catch {
      /* 尝试下一个文件名 */
    }
  }
  if (readme === '') return { ok: false }
  const command = resolveCommand(readme)
  if (command !== undefined) return { ok: true, type: 'stdio', command }
  const endpoint = resolveEndpoint(readme)
  if (endpoint !== undefined) return { ok: true, type: endpoint.type, url: endpoint.url }
  return { ok: false }
}

/** 按描述关键词粗分类（未命中 → 精选）。 */
function categorize(description: string): string {
  const text = description.toLowerCase()
  if (/file|filesystem|文件|目录/.test(text)) return '文件'
  if (/search|搜索|browser|网页|web\s/.test(text)) return '搜索'
  if (/git|github|code|repo|repo|代码|开发/.test(text)) return '开发'
  if (/db|database|sql|postgres|mysql|mongo|数据/.test(text)) return '数据'
  if (/slack|teams|notion|calendar|mail|协作|会议|通知/.test(text)) return '协作'
  if (/cloud|aws|gcp|azure|云/.test(text)) return '云'
  return '精选'
}

/** 取 Markdown 链接/加粗符号内的文本。 */
function plainText(cell: string): string {
  return cell
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/^\s*\*+\s*/, '')
    .trim()
}

/** 从一行表格单元格里提取 url（含 http 的单元格，或第一个链接参数）。 */
function extractUrl(cell: string): string | undefined {
  const direct = /(https?:\/\/[^\s)|]+)/.exec(cell)
  if (direct) return direct[1]
  const linkParam = /\(([^)]+)\)/.exec(cell)
  if (linkParam && /^https?:/.test(linkParam[1])) return linkParam[1]
  return undefined
}

/** 解析 Markdown：表格行优先，兜底 `- [name](url) · desc` 列表行。 */
function parseReadme(raw: string): Array<{ name: string; description: string; url?: string }> {
  const out: Array<{ name: string; description: string; url?: string }> = []
  const lines = raw.split(/\r?\n/)
  for (const line of lines) {
    const trimmed = line.trim()
    if (trimmed === '' || /^\|?[\s|:-]+$/.test(trimmed) || /^#{1,6}\s/.test(trimmed)) continue
    const table = /^\|\s*(.*?)\s*\|\s*$/.exec(trimmed)
    if (table) {
      const cells = table[1].split('|').map(plainText)
      const name = cells[0]
      if (name === '' || /^(name|名称|server|repository|repo)$/i.test(name)) continue
      let description = ''
      let url: string | undefined
      for (const cell of cells) {
        const u = extractUrl(cell) ?? extractUrl(table[1].split('|')[cells.indexOf(cell)] ?? '')
        if (u !== undefined && url === undefined) url = u
        if (cell.length > description.length && !/^https?:/i.test(cell)) description = cell
      }
      const fallbackUrl = extractUrl(table[1])
      out.push({ name, description: description === name ? '' : description, url: url ?? fallbackUrl })
      continue
    }
    // 列表行：- [name](url) — desc / - **name** — desc / - **[name](url)** — desc
    const bullet = /^\s*[-*]\s+(.*)$/.exec(trimmed)
    if (!bullet) continue
    const body = bullet[1]
    const boldLink = /^\*\*\[([^\]]+)\]\(([^)]+)\)\*\*\s*[-—:.]*\s*(.*)$/.exec(body)
    if (boldLink) {
      const name = plainText(boldLink[1])
      if (name === '' || /^(name|名称)$/i.test(name)) continue
      out.push({ name, description: plainText(boldLink[3]), url: /^https?:/.test(boldLink[2]) ? boldLink[2] : undefined })
      continue
    }
    const link = /^\[([^\]]+)\]\(([^)]+)\)\s*[-—:.]*\s*(.*)$/.exec(body)
    if (link) {
      const name = plainText(link[1])
      if (name === '' || /^(name|名称)$/i.test(name)) continue
      out.push({ name, description: plainText(link[3]), url: /^https?:/.test(link[2]) ? link[2] : undefined })
      continue
    }
    const bold = /^\*\*([^*]+)\*\*\s*[-—:.]*\s*(.*)$/.exec(body)
    if (bold) {
      out.push({ name: plainText(bold[1]), description: plainText(bold[2]) })
      continue
    }
  }
  return out
}

async function fetchWithTimeout(url: string): Promise<string> {
  let lastError: unknown = null
  for (let attempt = 0; attempt < 2; attempt += 1) {
    const controller = new AbortController()
    const timer = setTimeout(() => { controller.abort() }, FETCH_TIMEOUT_MS)
    try {
      const res = await fetch(url, {
        signal: controller.signal,
        redirect: 'follow',
        // GitHub API 强制要求 User-Agent（缺失返回 403）。
        headers: { 'user-agent': 'dsh-triad' },
      })
      if (!res.ok) throw new Error(`http ${res.status}`)
      return await res.text()
    } catch (error) {
      lastError = error
      if (attempt === 0) await new Promise((resolve) => setTimeout(resolve, 500))
    } finally {
      clearTimeout(timer)
    }
  }
  throw lastError instanceof Error ? lastError : new Error('fetch failed')
}

/** 拉取一个 Markdown 来源并规范化（官方源过滤 SDK 库，只留参考实现）。 */
async function fetchSource(url: string, tag: 'official' | 'community'): Promise<RecommendedServer[]> {
  const raw = await fetchWithTimeout(url)
  return parseReadme(raw)
    .filter((item) => item.name !== '' && !/\bSDK\b/i.test(item.name))
    .map((item, index) => ({
      id: `${tag}-${item.name.toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-').slice(0, 48) || String(index)}`,
      name: item.name,
      description: item.description ?? '',
      url: item.url,
      tag,
      category: categorize(item.description),
    }))
}

/** MCP Registry API 条目形状（宽松取字段）。 */
interface RegistryEntry {
  server?: {
    name?: unknown
    title?: unknown
    description?: unknown
    remotes?: Array<{ url?: unknown }>
  }
}

/** awesome 大目录解析缓存（与推荐缓存同周期共用一次抓取）。 */
let awesomeCache: { at: number; rows: RecommendedServer[] } | null = null

async function fetchAwesome(): Promise<RecommendedServer[]> {
  if (awesomeCache !== null && Date.now() - awesomeCache.at < CACHE_TTL_MS) return awesomeCache.rows
  const rows = await fetchSource(AWESOME_SOURCE, 'community')
  awesomeCache = { at: Date.now(), rows }
  return rows
}

async function awesomeSearch(q: string): Promise<RecommendedServer[]> {
  const rows = await fetchAwesome()
  const ql = q.toLowerCase()
  return rows.filter((row) => row.name.toLowerCase().includes(ql) || row.description.toLowerCase().includes(ql))
}

/** 拉取 MCP Registry（结构化 JSON，社区/开放注册目录）。 */
async function fetchRegistry(): Promise<RecommendedServer[]> {
  const raw = await fetchWithTimeout(REGISTRY_SOURCE)
  const parsed = JSON.parse(raw) as { servers?: RegistryEntry[] }
  const entries = Array.isArray(parsed.servers) ? parsed.servers : []
  const rows: RecommendedServer[] = []
  for (const entry of entries) {
    const server = entry.server ?? {}
    const name = typeof server.title === 'string' && server.title !== ''
      ? server.title
      : typeof server.name === 'string' && server.name !== ''
        ? server.name
        : ''
    if (name === '') continue
    const description = typeof server.description === 'string' ? server.description : ''
    let url: string | undefined
    for (const remote of Array.isArray(server.remotes) ? server.remotes : []) {
      if (typeof remote.url === 'string' && /^https?:/.test(remote.url)) { url = remote.url; break }
    }
    rows.push({
      id: `community-${name.toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-').slice(0, 48)}`,
      name,
      description,
      url,
      tag: 'community',
      category: categorize(description),
    })
  }
  return rows
}

/** 构建推荐列表：社区大目录 + Registry + 官方参考合并去重，失败回退离线。 */
async function buildRecommended(): Promise<RecommendedResponse> {
  const [awesome, official, community] = await Promise.allSettled([
    fetchAwesome(),
    fetchSource(OFFICIAL_SOURCE, 'official'),
    fetchRegistry(),
  ])
  const awesomeRows = awesome.status === 'fulfilled' ? awesome.value : []
  const officialRows = official.status === 'fulfilled' ? official.value : []
  const communityRows = community.status === 'fulfilled' ? community.value : []
  if (awesomeRows.length === 0 && communityRows.length === 0 && officialRows.length === 0) {
    return { source: 'offline', updatedAt: new Date().toISOString(), servers: FALLBACK }
  }
  const seen = new Set<string>()
  const merged: RecommendedServer[] = []
  // 社区大目录优先（最多 60 条），Registry 与官方参考补充。
  for (const row of [...awesomeRows, ...communityRows, ...officialRows]) {
    const key = row.name.toLowerCase()
    if (seen.has(key)) continue
    seen.add(key)
    merged.push(row)
    if (merged.length >= 60) break
  }
  return { source: 'official+community', updatedAt: new Date().toISOString(), servers: merged }
}

/** 模块级缓存：5 分钟内复用最近一次构建结果。 */
let cache: { at: number; value: RecommendedResponse } | null = null

async function getRecommended(): Promise<RecommendedResponse> {
  if (cache !== null && Date.now() - cache.at < CACHE_TTL_MS) return cache.value
  const value = await buildRecommended()
  cache = { at: Date.now(), value }
  return value
}

/* ── HTTP 路由（与 skill-health 同款 loopback 校验） ────────────────── */

function isLoopbackAddress(address: string | undefined): boolean {
  if (typeof address !== 'string') return false
  const a = address.toLowerCase()
  if (a === '::1') return true
  const ipv4 = a.startsWith('::ffff:') ? a.slice(7) : a
  const octets = ipv4.split('.')
  return octets.length === 4 && octets[0] === '127' && octets.every((part) => /^\d{1,3}$/.test(part) && Number(part) <= 255)
}

function hostNameOf(value: string | undefined): string | null {
  if (typeof value !== 'string') return null
  const host = value.trim().toLowerCase()
  if (host.startsWith('[')) {
    const close = host.indexOf(']')
    if (close <= 1) return null
    const suffix = host.slice(close + 1)
    if (suffix !== '' && !/^:\d+$/.test(suffix)) return null
    return host.slice(1, close)
  }
  const firstColon = host.indexOf(':')
  const lastColon = host.lastIndexOf(':')
  if (firstColon !== lastColon) return null
  return firstColon === -1 ? host : host.slice(0, firstColon)
}

export function loopbackAllowed(req: { socket: { remoteAddress?: string }; headers: { host?: string } }): boolean {
  if (!isLoopbackAddress(req.socket.remoteAddress)) return false
  const host = hostNameOf(req.headers.host)
  if (host === null) return false
  return host === 'localhost' || host === '127.0.0.1' || host === '::1'
}

export function writeJsonResponse(res: { writeHead: (status: number, headers: Record<string, string>) => void; end: (body: string) => void }, status: number, value: unknown): void {
  res.writeHead(status, {
    'content-type': 'application/json; charset=utf-8',
    'cache-control': 'no-cache',
  })
  res.end(JSON.stringify(value))
}

/** 注册 GET /api/mcp-recommended 与搜索子路由。 */
export function applyMcpRecommended(ctx: Context): void {
  ctx.effect(() => ctx.webServer.register({
    kind: 'prefix',
    path: ROUTE_PATH,
    handler: (req: { socket: { remoteAddress?: string }; headers: { host?: string } }, res: { writeHead: (status: number, headers: Record<string, string>) => void; end: (body: string) => void }) => {
      void (async () => {
        if (!loopbackAllowed(req)) {
          writeJsonResponse(res, 403, { error: 'loopback-only' })
          return
        }
        const url = new URL(req.url ?? '/', 'http://localhost')
        if (url.pathname === ROUTE_PATH || url.pathname === `${ROUTE_PATH}/`) {
          writeJsonResponse(res, 200, await getRecommended())
          return
        }
        if (url.pathname === SEARCH_ROUTE || url.pathname === `${SEARCH_ROUTE}/`) {
          const q = url.searchParams.get('q') ?? ''
          writeJsonResponse(res, 200, { query: q, servers: await searchServers(q) })
          return
        }
        if (url.pathname === RESOLVE_ROUTE || url.pathname === `${RESOLVE_ROUTE}/`) {
          const repo = url.searchParams.get('repo') ?? ''
          if (!/^https?:\/\//.test(repo)) {
            writeJsonResponse(res, 400, { ok: false, error: 'repo required' })
            return
          }
          writeJsonResponse(res, 200, await resolveServer(repo))
          return
        }
        writeJsonResponse(res, 404, { error: `no route for ${req.method ?? 'GET'} ${url.pathname}` })
      })()
    },
  }), 'dsh-mcp-recommended: routes')
}
