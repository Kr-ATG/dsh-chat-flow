/**
 * mcp-config — 真实 MCP Server 状态 + 启用/禁用/删除（host 半身）。
 *
 * GET  /api/triad/mcp-status  只读：注册工具（ctx.tools 中 mcp__*）∪ 配置文件
 *                             （~/.dsh/profiles/web/cordis.patch.yml 的
 *                             mcp-client 条目，含 disabled 标记）。
 * POST /api/triad/mcp-config  写：三种动作（默认 toggle 兼容旧客户端）：
 *                             - 无 action → disabled=true/false 标记（禁用/启用）；
 *                             - action: remove → 删除该 mcp-client 整个条目
 *                               （连同所属单条目 insert 容器，保留上方注释）。
 *                             文本级编辑，保留注释与其余行；改前自动备份到
 *                             cordis.patch.yml.bak-last-toggle。web profile 为
 *                             patchReload: live，写完后 DSH 热重载配置：
 *                             禁用→工具立即注销，启用→重新注册，删除→条目消失。
 */

import { readFileSync, writeFileSync, copyFileSync, existsSync } from 'node:fs'
import { homedir } from 'node:os'
import { join } from 'node:path'
import type { Context } from '@deepseek-ai/cordis'
import { loopbackAllowed, writeJsonResponse } from './mcp-recommended.ts'

const STATUS_ROUTE = '/api/triad/mcp-status'
const CONFIG_ROUTE = '/api/triad/mcp-config'
const MCP_CLIENT_PKG = '@deepseek-ai/dsh-mcp-client'
const PROFILE_NAME = 'web'
/** 备份文件名（固定名，覆盖式；保留最近一次切换前的版本）。 */
const BACKUP_SUFFIX = '.bak-last-toggle'

function dshHome(): string {
  const fromEnv = process.env['DSH_HOME']
  return fromEnv !== undefined && fromEnv.trim() !== '' ? fromEnv.trim() : join(homedir(), '.dsh')
}

/** 面板管理的补丁文件：默认 web profile 的 cordis.patch.yml。 */
function patchFilePath(): string {
  return join(dshHome(), 'profiles', PROFILE_NAME, 'cordis.patch.yml')
}

interface PatchMcpEntry {
  /** 文件中的条目 id（编辑定位用）。 */
  entryId: string
  serverName: string
  disabled: boolean
  /** streamable-http 端点（存在即远程服务型，watchdog 候选）。 */
  url: string
  /** 行号（文件行索引，编辑用）。 */
  idLine: number
  nameLine: number
  serverNameLine: number
  disabledLine: number
}

/**
 * 扫描补丁文件中所有 `@deepseek-ai/dsh-mcp-client` 条目。
 * 逐行解析：`- id:` 开头的条目，后续数行内找 name 行与 serverName 行。
 */
function scanPatchEntries(content: string): PatchMcpEntry[] {
  const lines = content.split(/\r?\n/)
  const entries: PatchMcpEntry[] = []
  for (let i = 0; i < lines.length; i += 1) {
    const trimmed = lines[i].trimStart()
    if (!trimmed.startsWith('- id:')) continue
    const idMatch = /^- id:\s*([A-Za-z0-9_-]+)/.exec(trimmed)
    if (idMatch === null) continue
    const idLine = i
    let nameLine = -1
    let serverNameLine = -1
    let serverName = ''
    let entryUrl = ''
    for (let j = i + 1; j < lines.length && j <= i + 10; j += 1) {
      const line = lines[j].trimStart()
      if (line.startsWith('- ')) break
      if (nameLine === -1 && line.startsWith('name:') && line.includes(MCP_CLIENT_PKG)) nameLine = j
      if (nameLine !== -1 && serverNameLine === -1 && line.startsWith('serverName:')) {
        const m = /^serverName:\s*([A-Za-z0-9_-]+)/.exec(line)
        if (m !== null) {
          serverNameLine = j
          serverName = m[1]
        }
      }
      if (nameLine !== -1 && entryUrl === '' && line.startsWith('url:')) {
        const m = /^url:\s*(.+?)\s*$/.exec(line)
        if (m !== null) entryUrl = m[1]
      }
    }
    if (nameLine === -1 || serverNameLine === -1) continue
    let disabledLine = -1
    for (let j = i + 1; j < lines.length && j <= i + 10; j += 1) {
      const line = lines[j].trimStart()
      if (line.startsWith('- ')) break
      if (line.startsWith('disabled:')) { disabledLine = j; break }
    }
    entries.push({ entryId: idMatch[1], serverName, disabled: disabledLine >= 0, url: entryUrl, idLine, nameLine, serverNameLine, disabledLine })
  }
  return entries
}

function defaultLineEnding(content: string): string {
  return content.includes('\r\n') ? '\r\n' : '\n'
}

/** 编辑条目：disabled=true 在 name 行后插入 disabled 行，false 删除既有行（保留注释）。 */
function applyToggle(content: string, entry: PatchMcpEntry, disabled: boolean): string {
  const eol = defaultLineEnding(content)
  const lines = content.split(/\r?\n/)
  if (entry.disabled === disabled) return content
  if (disabled) {
    const indent = /^\s*/.exec(lines[entry.nameLine])?.[0] ?? '      '
    lines.splice(entry.nameLine + 1, 0, `${indent}disabled: true`)
  } else if (entry.disabledLine >= 0) {
    lines.splice(entry.disabledLine, 1)
  }
  return lines.join(eol)
}

function readPatchContent(): string {
  const path = patchFilePath()
  if (!existsSync(path)) return ''
  return readFileSync(path, 'utf8')
}

/** 只读：合并配置文件条目与运行时注册工具。 */
function collectMcpStatus(ctx: Context): Record<string, unknown> {
  const path = patchFilePath()
  const content = readPatchContent()
  const patchEntries = content === '' ? [] : scanPatchEntries(content)
  const groups = new Map<string, Array<{ name: string; description: string }>>()
  for (const schema of ctx.tools.schemas()) {
    if (typeof schema.name !== 'string' || !schema.name.startsWith('mcp__')) continue
    const rest = schema.name.slice('mcp__'.length)
    const sep = rest.indexOf('__')
    if (sep <= 0) continue
    const serverName = rest.slice(0, sep)
    const list = groups.get(serverName)
    const tool = { name: schema.name, description: typeof schema.description === 'string' ? schema.description : '' }
    if (list === undefined) groups.set(serverName, [tool])
    else list.push(tool)
  }

  const seen = new Set<string>()
  const servers: Array<Record<string, unknown>> = []
  for (const entry of patchEntries) {
    seen.add(entry.serverName)
    const tools = groups.get(entry.serverName) ?? []
    servers.push({
      serverName: entry.serverName,
      toolCount: tools.length,
      tools,
      config: { entryId: entry.entryId, disabled: entry.disabled, editable: true },
    })
  }
  // 注册了工具但没有配置条目（手工改过文件等情况）：只读展示。
  for (const [serverName, tools] of groups) {
    if (seen.has(serverName)) continue
    servers.push({
      serverName,
      toolCount: tools.length,
      tools,
      config: { entryId: null, disabled: false, editable: false },
    })
  }
  servers.sort((a, b) => String(a.serverName).localeCompare(String(b.serverName)))
  return {
    at: new Date().toISOString(),
    serverCount: servers.length,
    toolCount: servers.reduce((sum, server) => sum + (server.toolCount as number), 0),
    patchFile: path,
    servers,
  }
}

/** 写：标记 disabled。成功返回新状态；失败返回 error（不改文件）。 */
function togglePatchEntry(serverName: string, disabled: boolean): { ok: boolean; error?: string; entryId?: string; disabled?: boolean } {
  const path = patchFilePath()
  const content = readPatchContent()
  if (content === '') return { ok: false, error: `patch file not found: ${path}` }
  const entries = scanPatchEntries(content)
  const entry = entries.find((item) => item.serverName === serverName)
  if (entry === undefined) return { ok: false, error: `no mcp-client entry for serverName "${serverName}" in ${path}` }
  const next = applyToggle(content, entry, disabled)
  if (next === content) return { ok: true, entryId: entry.entryId, disabled: entry.disabled }
  try {
    copyFileSync(path, `${path}${BACKUP_SUFFIX}`)
    writeFileSync(path, next, 'utf8')
  } catch (error) {
    return { ok: false, error: `write failed: ${error instanceof Error ? error.message : String(error)}` }
  }
  return { ok: true, entryId: entry.entryId, disabled }
}

/**
 * 写：从 patch 文件中删除指定 serverName 的完整 mcp-client 条目。
 *
 * 以 YAML 缩进界定块边界（避开注释归属问题）：
 *  - 条目块 = `- id:` 行 + 其下全部缩进行，到下一个 0 缩进行（注释/空行/下一
 *    顶层条目）或文件尾止；
 *  - 向上找最近一个 `- ` 行：是 `- insert:` 且其内只剩当前一条 → 连同该
 *    `- insert:` 整块（按同样缩进边界）删；是 `- id:` 或顶层 → 只删条目块；
 *  - 条目上方注释按本文件惯例保留（删项留注释存档），不并入删除范围。
 * 改前自动备份到 cordis.patch.yml.bak-last-toggle。
 */
function removePatchEntry(serverName: string): { ok: boolean; error?: string; entryId?: string } {
  const path = patchFilePath()
  const content = readPatchContent()
  if (content === '') return { ok: false, error: `patch file not found: ${path}` }
  const entries = scanPatchEntries(content)
  const entry = entries.find((item) => item.serverName === serverName)
  if (entry === undefined) return { ok: false, error: `no mcp-client entry for serverName "${serverName}" in ${path}` }
  const lines = content.split(/\r?\n/)
  /** 块尾：line 之后第一个 0 缩进行（注释/空行/下一个顶层条目）或文件尾。 */
  const blockEndOf = (line: number): number => {
    for (let j = line + 1; j < lines.length; j += 1) {
      const current = lines[j]
      if (current.length === 0) return j
      if (!/^[ \t]/.test(current)) return j
    }
    return lines.length
  }
  // 条目所属容器：向上最近的一个 `- ` 行（可能是 `- insert:`、同 insert 的前一条目，或顶层条目）。
  let insertLine = -1
  for (let k = entry.idLine - 1; k >= 0; k -= 1) {
    const trimmed = lines[k].trimStart()
    if (trimmed.startsWith('- ')) { insertLine = k; break }
  }
  let removeFrom = entry.idLine
  let removeTo = blockEndOf(entry.idLine)
  if (insertLine >= 0 && lines[insertLine].trimStart().startsWith('- insert:')) {
    let itemCount = 0
    for (let k = insertLine + 1; k < removeTo; k += 1) {
      if (lines[k].trimStart().startsWith('- id:')) itemCount += 1
    }
    // 该 insert 仅含此一条：连 `- insert:` 一起删，不留空容器。
    if (itemCount === 1) {
      removeFrom = insertLine
      removeTo = blockEndOf(insertLine)
    }
  }
  const next = lines.slice(0, removeFrom).concat(lines.slice(removeTo)).join(defaultLineEnding(content))
  try {
    copyFileSync(path, `${path}${BACKUP_SUFFIX}`)
    writeFileSync(path, next, 'utf8')
  } catch (error) {
    return { ok: false, error: `write failed: ${error instanceof Error ? error.message : String(error)}` }
  }
  return { ok: true, entryId: entry.entryId }
}

/* ── 自动守护（watchdog）：MCP 会话被服务端回收后自动重建，DSH 永不卡死 ──
 *
 * 原理：neo（claw-server）正常回收闲置 MCP 会话；回收后它的 REST
 * /api/v1/sessions 中该客户端（slug=dsh-mcp-client）的 status 由 live
 * 落为 done（sessions.rs: contract_status(task.status, live.is_some()),
 * 会话对象消失即非 live）。本守护每隔 WATCHDOG_INTERVAL_MS 探活一次：
 * 未发现 live 的 dsh-mcp-client 会话 → 对该 serverName 执行
 * disabled 切换（禁→启, 与面板开关同机制,HMR 重建拿新会话）。
 *
 * 防误伤：启动后宽限期不进圈；最近一次修复 90s 内不重复；每次探活失败
 * 只是跳过（neo 未运行时也无副作用, 因为条目未 enabled 时禁用切换而已）。
 */

const WATCHDOG_INTERVAL_MS = 60_000
const WATCHDOG_GRACE_MS = 150_000
const WATCHDOG_RETRY_GAP_MS = 90_000
const WATCHDOG_CLIENT_SLUG = 'dsh-mcp-client'

let watchdogStartedAt = 0
let watchdogLastHealAt = 0
let watchdogHealing = false

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => { setTimeout(resolve, ms) })
}

/** 探活一个远程 MCP 服务：其 REST sessions 里是否有本客户端 live 会话。 */
async function remoteSessionAlive(entryUrl: string): Promise<boolean | null> {
  const base = /^(https?:\/\/[^/]+)/.exec(entryUrl)?.[1]
  if (base === undefined) return null
  try {
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), 5000)
    try {
      const response = await fetch(`${base}/api/v1/sessions`, { headers: { accept: 'application/json' }, signal: controller.signal })
      if (!response.ok) return null
      const body = await response.json() as { items?: Array<{ slug?: unknown; status?: unknown }> }
      if (!Array.isArray(body.items)) return null
      return body.items.some((item) => item.slug === WATCHDOG_CLIENT_SLUG && item.status === 'live')
    } finally {
      clearTimeout(timer)
    }
  } catch {
    return null
  }
}

/** 一轮探活：收集远程型条目（streamable-http url 存在且未 disabled）。 */
async function watchdogTick(): Promise<void> {
  if (watchdogHealing) return
  const content = readPatchContent()
  if (content === '') return
  const entries = scanPatchEntries(content).filter((entry) => entry.url !== '' && !entry.disabled)
  for (const entry of entries) {
    const alive = await remoteSessionAlive(entry.url)
    if (alive !== null && !alive) {
      // 会话被回收 → 自动重连：禁→启（与面板开关同机制）。
      watchdogHealing = true
      try {
        const before = Date.now()
        if (before - watchdogLastHealAt < WATCHDOG_RETRY_GAP_MS) continue
        watchdogLastHealAt = before
        const disable = togglePatchEntry(entry.serverName, true)
        if (disable.ok) {
          await sleep(2500)
          togglePatchEntry(entry.serverName, false)
          console.log(`[dsh-triad] mcp watchdog: session for ${entry.serverName} reclaimed by server; reconnected (disabled toggle)`)
        }
      } finally {
        watchdogHealing = false
      }
    }
  }
}

/** 注册自动守护（周期探活;effect 清理时释放计时器）。 */
function startWatchdog(): () => void {
  watchdogStartedAt = Date.now()
  const timer = setInterval(() => {
    if (Date.now() - watchdogStartedAt < WATCHDOG_GRACE_MS) return
    void watchdogTick()
  }, WATCHDOG_INTERVAL_MS)
  timer.unref?.()
  return () => clearInterval(timer)
}

/** 注册 GET /api/triad/mcp-status 与 POST /api/triad/mcp-config。 */
export function applyMcpStatus(ctx: Context): void {
  ctx.effect(() => ctx.webServer.register({
    kind: 'prefix',
    path: STATUS_ROUTE,
    handler: (req: { socket: { remoteAddress?: string }; headers: { host?: string } }, res: { writeHead: (status: number, headers: Record<string, string>) => void; end: (body: string) => void }) => {
      if (!loopbackAllowed(req)) {
        writeJsonResponse(res, 403, { error: 'loopback-only' })
        return
      }
      writeJsonResponse(res, 200, collectMcpStatus(ctx))
    },
  }), 'dsh-mcp-status: routes')

  ctx.effect(() => ctx.webServer.register({
    kind: 'prefix',
    path: CONFIG_ROUTE,
    handler: (req: { socket: { remoteAddress?: string }; headers: { host?: string }; method?: string }, res: { writeHead: (status: number, headers: Record<string, string>) => void; end: (body: string) => void }) => {
      void (async () => {
        if (!loopbackAllowed(req)) {
          writeJsonResponse(res, 403, { error: 'loopback-only' })
          return
        }
        let body = ''
        for await (const chunk of req as unknown as AsyncIterable<Uint8Array>) {
          body += Buffer.from(chunk).toString('utf8')
        }
        let parsed: { serverName?: unknown; disabled?: unknown; action?: unknown }
        try {
          parsed = JSON.parse(body) as { serverName?: unknown; disabled?: unknown; action?: unknown }
        } catch {
          writeJsonResponse(res, 400, { ok: false, error: 'invalid json' })
          return
        }
        const serverName = typeof parsed.serverName === 'string' ? parsed.serverName : ''
        if (serverName === '') {
          writeJsonResponse(res, 400, { ok: false, error: 'serverName required' })
          return
        }
        const result = parsed.action === 'remove'
          ? removePatchEntry(serverName)
          : togglePatchEntry(serverName, parsed.disabled === true)
        writeJsonResponse(res, result.ok ? 200 : 400, result)
      })()
    },
  }), 'dsh-mcp-config: routes')

  // ── 自动守护：会话被服务端回收后自动重建（免重启 DSH）──────────
  ctx.effect(() => startWatchdog(), 'dsh-mcp-watchdog: interval')
}
