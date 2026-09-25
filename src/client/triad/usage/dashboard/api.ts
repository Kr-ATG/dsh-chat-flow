/**
 * 用量数据请求（loopback-only 同源路由）。
 *
 * 精简后前端只消费 /api/usage-stats/usage 一条：热力图与 token 汇总都基于它。
 * 其余路由（signal / providers / account / subscriptions / budget / day-sessions）
 * 仍由 host 半身注册并对外可用，但已没有客户端消费者，故这里不再保留封装。
 */
import type { UsagePayload } from './aggregate'

async function fetchJson<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(path, { cache: 'no-store', ...init, headers: { accept: 'application/json', ...init?.headers } })
  return res.json() as Promise<T>
}

export const usageApi = {
  /**
   * `force` 走 `?refresh=1`：host 侧会同步重算一轮再返回，而不是把可能已经
   * 落后的快照丢回来。只给「用户主动点了刷新」用——普通打开应当拿后台
   * 已经预热好的快照。
   */
  usage: (opts?: { force?: boolean }) => fetchJson<UsagePayload>(`/api/usage-stats/usage${opts?.force === true ? '?refresh=1' : ''}`),
}
