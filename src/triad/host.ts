/**
 * dsh-chat-plus — dsh-triad host half (fusion后由主插件在 apply 内调用).
 *
 * 原 dsh-triad 的 host 半身整体平移到 `src/triad/` 下；`vendor/` 平移到
 * `src/vendor/`，因此本文件相对它的位置与 dsh-triad 的 `src/host.ts`
 * 相对 `<repo>/vendor/` 的位置同构，所有相对 import 保持原样可解析：
 *
 *   src/triad/host.ts                    → ../vendor/usage-skill/index.js
 *   src/triad/memory/engine/*.ts         → ../../../vendor/dsh-llm/index.js
 *   src/triad/memory/tools.ts            → ../../vendor/dsh-tools/schema.js
 *   src/triad/automation/{tool,executor} → ../../vendor/dsh-{tools,dsh-llm}/index.js
 *
 * 四个模块，各自独立 try/catch——一个挂载失败只 warn，绝不影响其他模块：
 *
 *  - memory     → 本地记忆引擎（LLM 抽取、embedding 检索、
 *                 `agent/pre-step` 注入、工具、`/api/dsh-memory/*`）
 *  - automation → 定时任务：store + 60s 调度 + llm executor + agent 工具 +
 *                 `/api/triad-automation/*`（移植自 dsh-webui）
 *  - usage+skills → 用量统计 + 供应商余额（`/api/usage-stats/*`）与技能包
 *                 管理（`/api/skill-manager/*`），即 vendor 化的
 *                 dsh-usage-skill host
 *  - skill-toggles / skill-health / mcp-recommended / mcp-status
 *               → `/api/skill-toggles/*`、`/api/skill-health`、
 *                 `/api/mcp-recommended`、`/api/triad/mcp-status`
 *
 * 不导出 `name` / `inject` / `apply`：这三个名字由主插件
 * （`src/host.ts`）独占，避免与 dsh-chat-plus 主插件契约冲突。主插件只需
 * 在 apply 里 `await applyTriadHost(ctx, config)`，并把需要的 service 合进
 * 自己的 inject（见下方 REQUIRED_SERVICES 注释）。
 */

import type { Context } from '@deepseek-ai/cordis'
import { applyMemory } from './memory/index.js'
// @ts-expect-error — vendored JS half (no type declarations shipped)
import { apply as applyUsageHost } from '../vendor/usage-skill/index.js'
import { applyAutomationHost } from './automation/index.js'
import { apply as applySkillToggles } from './skill-toggles.js'
import { applySkillHealth } from './skill-health.js'
import { applyMcpRecommended } from './mcp-recommended.js'
import { applyMcpStatus } from './mcp-status.js'
import type { MemoryConfig } from './memory/types.js'

/**
 * Host services the four modules touch. 本文件不导出 `inject`——合并后的
 * 数组由主插件在 `src/host.ts` 统一声明（并集）：
 *
 *  - dsh-chat-plus 现有：webServer, tools
 *  - dsh-triad 全部：
 *      memory     → webServer, tools
 *      automation → webServer, tools, llm
 *      usage      → webServer, credentials, sessions, sessionPersistence,
 *                   settings, llm
 *      skills     → webServer
 *
 * 并集：webServer, tools, credentials, sessions, sessionPersistence,
 *       settings, llm（7 个，与 dsh-triad 原 inject 完全一致）。
 */

/** Runtime config shape（通过主插件的 cordis.patch.yml 传入）。 */
export interface TriadConfig {
  /** Memory engine overrides；未给的键回落到 DEFAULT_CONFIG。 */
  memory?: Partial<MemoryConfig>
  /** Usage/account overrides，转发给 vendor 的 usage host。 */
  usage?: Record<string, unknown>
}

/**
 * memory config 覆盖层的解析：客端只给想改的键，剩下的交给
 * `memory/types.ts` 的 applyConfigOverrides。这里只做形状归一化，
 * 与 dsh-triad 原行为逐字一致。
 */
export function resolveConfig(config: TriadConfig = {}): {
  memory: Partial<MemoryConfig> | undefined
  usage: Record<string, unknown>
} {
  return {
    memory: config.memory,
    usage: config.usage ?? {},
  }
}

/**
 * 装配 dsh-triad 的四个模块。任何单个模块抛错都只记录 warn 后继续。
 *
 * @param ctx    主插件的 Cordis Context（已合并 inject）。
 * @param config 可选配置；memory 覆盖层走 resolveConfig。
 */
export async function applyTriadHost(ctx: Context, config: TriadConfig = {}): Promise<void> {
  const resolved = resolveConfig(config)

  // ── 记忆引擎 ────────────────────────────────────────────────────────
  try {
    applyMemory(ctx, resolved.memory)
    ctx.logger?.info?.('[dsh-chat-plus] triad memory engine mounted')
  } catch (error) {
    ctx.logger?.warn?.(
      `[dsh-chat-plus] triad memory engine failed to mount: ${error instanceof Error ? (error.stack ?? error.message) : String(error)}`,
    )
  }

  // ── 自动化（定时任务：存储 + 调度 + 执行 + 工具 + 路由）──────────────
  // /api/triad-automation/*：侧边栏首行「自动化」入口的数据面。
  try {
    applyAutomationHost(ctx)
    ctx.logger?.info?.('[dsh-chat-plus] triad automation mounted')
  } catch (error) {
    ctx.logger?.warn?.(
      `[dsh-chat-plus] triad automation failed to mount: ${error instanceof Error ? (error.stack ?? error.message) : String(error)}`,
    )
  }

  // ── 用量 + 技能 ─────────────────────────────────────────────────────
  try {
    await applyUsageHost(ctx, resolved.usage)
    ctx.logger?.info?.('[dsh-chat-plus] triad usage + skills host mounted')
  } catch (error) {
    ctx.logger?.warn?.(
      `[dsh-chat-plus] triad usage host failed to mount: ${error instanceof Error ? (error.stack ?? error.message) : String(error)}`,
    )
  }

  // ── 技能开关 + 技能健康 + MCP 推荐/状态 ────────────────────────────
  // 四个小模块各自一个独立 try/catch（与 dsh-triad 原粒度一致）：任一
  // 失败只 warn，其余三个照样挂载。
  try {
    await applySkillToggles(ctx)
    ctx.logger?.info?.('[dsh-chat-plus] triad skill toggles mounted')
  } catch (error) {
    ctx.logger?.warn?.(
      `[dsh-chat-plus] triad skill toggles failed to mount: ${error instanceof Error ? (error.stack ?? error.message) : String(error)}`,
    )
  }
  try {
    applySkillHealth(ctx)
    ctx.logger?.info?.('[dsh-chat-plus] triad skill health mounted')
  } catch (error) {
    ctx.logger?.warn?.(
      `[dsh-chat-plus] triad skill health failed to mount: ${error instanceof Error ? (error.stack ?? error.message) : String(error)}`,
    )
  }
  try {
    applyMcpRecommended(ctx)
    ctx.logger?.info?.('[dsh-chat-plus] triad mcp recommended mounted')
  } catch (error) {
    ctx.logger?.warn?.(
      `[dsh-chat-plus] triad mcp recommended failed to mount: ${error instanceof Error ? (error.stack ?? error.message) : String(error)}`,
    )
  }
  try {
    applyMcpStatus(ctx)
    ctx.logger?.info?.('[dsh-chat-plus] triad mcp status mounted')
  } catch (error) {
    ctx.logger?.warn?.(
      `[dsh-chat-plus] triad mcp status failed to mount: ${error instanceof Error ? (error.stack ?? error.message) : String(error)}`,
    )
  }
}
