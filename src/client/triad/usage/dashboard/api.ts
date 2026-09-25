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
  usage: () => fetchJson<UsagePayload>('/api/usage-stats/usage'),
}
