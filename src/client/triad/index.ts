/**
 * dsh-triad client 半身（搬迁进 dsh-chat-plus，四工作台融合）。
 *
 * 挂载四个模块，每个独立 try/catch，一个失败不拖垮其他：
 *
 *  - automation → sidebar nav row（第一行）+ scheduled-tasks panel + notifier
 *  - memory     → sidebar nav row + panel + composer inject toggle
 *  - usage      → sidebar nav row（第二行）+ workbench（usage / trend / accounts / signal）
 *  - skills     → sidebar nav row + panel + `/` slash source + skill tool row
 *
 * 座位与命名空间（slot id / order / locale namespace / 路由前缀）原样保留，
 * dsh-triad 退役后用户零迁移。所有数据经 host 半身的 loopback-only HTTP
 * 路由以 same-origin fetch 获取，不修改任何 DSH 源码。
 *
 * 与 dsh-chat-plus 主入口的关系：主线程在 `src/client/index.ts` 里调用
 * `applyTriadClient(ctx)`；`inject` 白名单由主线程统一声明，此处不导出。
 */

import type { ClientContext } from '@deepseek-ai/dsh-client-runtime/client'
import { applyMemoryClient } from './memory/index.js'
import { apply as applyUsageEntries } from './usage/entry.js'
import { applyAutomation } from './automation/index.js'
import { apply as applySkillSource } from './skill-source/index.js'
import { buildActivityGrid, activityColor, ACTIVITY_COLUMNS } from './usage/dashboard/ActivityGrid.js'

/** Run one module's apply, logging and swallowing any failure. */
function safe(label: string, run: (ctx: ClientContext) => void, ctx: ClientContext): void {
  try {
    run(ctx)
  } catch (error) {
    console.error(`[dsh-chat-plus] triad ${label} failed:`, error)
  }
}

/** Apply the dsh-triad browser half (four isolated modules). */
export function applyTriadClient(ctx: ClientContext): void {
  safe('automation', applyAutomation, ctx)
  safe('memory', applyMemoryClient, ctx)
  safe('usage', applyUsageEntries, ctx)
  safe('skills', applySkillSource, ctx)
}

/** 纯逻辑导出：供 smoke 测试直接断言「Token 活动」贡献热力模型。 */
export { buildActivityGrid, activityColor, ACTIVITY_COLUMNS }
