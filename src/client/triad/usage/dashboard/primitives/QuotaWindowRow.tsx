import type { CSSProperties } from 'react'
import type { QuotaWindow } from '../api'
import { relativeTime, formatUnits } from '../format'
import { ProgressBar, usageTone } from '../charts/ProgressBar'

/**
 * 配额窗口行（余额/配额页通用）：
 *   行 1：窗口名（左）…… 已用 X / Y 积分 · N 后重置（右，次要信息）
 *   行 2：进度条（flex 撑满）…… 已用百分比（右，颜色随阈值分级）
 * 两行式结构替代原来「一行塞满全部数字」的写法，避免窄卡内折行。
 * 积分池窗口（5h/7天）与订阅窗口（percent-only）共用。
 */
export function QuotaWindowRow({ window: w, delay = 0, active = true }: {
  window: QuotaWindow
  /** 入场错峰延迟（ms）。 */
  delay?: number
  /** false 时进度条停留在 0，用于挂载后统一动画到目标值。 */
  active?: boolean
}): JSX.Element {
  const used = w.used ?? 0
  const limit = w.limit ?? 0
  const hasAmounts = typeof w.used === 'number' && typeof w.limit === 'number' && w.limit > 0
  const pct = Math.max(0, Math.min(100, w.usedPercent ?? 0))
  const resetTs = w.resetsAt ? new Date(w.resetsAt).getTime() : null

  const label = w.windowType === '5h' ? '5h 滚动窗口'
    : w.windowType === '7d' ? '7天窗口'
    : w.kind

  const meta: CSSProperties = {
    display: 'flex', alignItems: 'baseline', gap: 6, flex: 'none',
    fontSize: 11, fontVariantNumeric: 'tabular-nums',
    color: 'var(--dsw-alias-label-tertiary)', whiteSpace: 'nowrap',
  }

  return (
    <div className="dsh-acc-win" style={{ animationDelay: `${delay}ms` }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 10, marginBottom: 5 }}>
        <span style={{ flex: 'none', fontSize: 11, fontWeight: 500, color: 'var(--dsw-alias-label-primary)' }}>
          {label}
        </span>
        <span style={meta}>
          <span style={{ color: 'var(--dsw-alias-label-secondary)' }}>
            {hasAmounts
              ? `已用 ${formatUnits(used)} / ${formatUnits(limit)} 积分`
              : `已用 ${pct}%`}
          </span>
          {resetTs !== null && <span>· {relativeTime(resetTs)}重置</span>}
        </span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <ProgressBar percent={active ? pct : 0} height={6} />
        </div>
        <span
          title={hasAmounts ? `已用 ${formatUnits(used)} / ${formatUnits(limit)} 积分` : '已用'}
          style={{ flex: 'none', fontSize: 11, fontWeight: 600, fontVariantNumeric: 'tabular-nums', color: usageTone(pct) }}
        >
          {pct}%
        </span>
      </div>
    </div>
  )
}
