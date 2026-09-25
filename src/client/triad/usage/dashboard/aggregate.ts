/**
 * 用量数据模型 + 基础聚合。
 *
 * 精简前的聚合工具（模型排行 / 供应商占比 / 按供应商过滤 / 调用时长汇总）只服务
 * 已下线的趋势页与明细表，这里只留热力图与 token 汇总真正用到的四件。
 */

/** 某一天的用量聚合。 */
export interface UsageDay {
  date: string
  inputTokens: number
  outputTokens: number
  cacheReadTokens: number
  cacheWriteTokens: number
  tokens: number
  cacheHitRate: number
  /** 当天模型调用次数（assistant/message 计数）。 */
  requests?: number
  /** 当天累计工作时长（step 耗时，毫秒）。 */
  workMs?: number
  models?: Array<{ model: string; inputTokens: number; outputTokens: number; cacheReadTokens: number; cacheWriteTokens: number; tokens: number; cacheHitRate: number }>
}

/** /api/usage-stats/usage 响应体。 */
export interface UsagePayload { ok: boolean; days: UsageDay[]; hours?: unknown[]; updatedAt?: number }

/** 区间合计：输入 / 输出 / 缓存（读+写）/ 总量。 */
export function sumTokens(days: UsageDay[]): { input: number; output: number; cache: number; total: number } {
  let input = 0, output = 0, cache = 0
  for (const d of days) {
    input += d.inputTokens ?? 0
    output += d.outputTokens ?? 0
    cache += (d.cacheReadTokens ?? 0) + (d.cacheWriteTokens ?? 0)
  }
  return { input, output, cache, total: input + output + cache }
}

/** 范围内平均缓存命中率（百分数，保留小数由 formatHitRate 统一格式化）。 */
export function averageCacheHitRate(days: UsageDay[]): number {
  if (days.length === 0) return 0
  const sum = days.reduce((acc, d) => acc + (d.cacheHitRate ?? 0), 0)
  return sum / days.length
}
