/**
 * 已用比例 → 语义色（与进度条同源）：
 * 已用 ≥85% 错误红，≥60% 警告黄，否则成功绿——「绿=安全，红=告警」。
 * 数值越大风险越高，与真实直觉一致。
 */
export function usageTone(percent: number): string {
  const p = Math.max(0, Math.min(100, percent))
  if (p >= 85) return 'var(--dsw-alias-state-error-primary)'
  if (p >= 60) return 'var(--dsw-alias-state-warn-primary)'
  return 'var(--dsw-alias-state-success-primary)'
}

/**
 * 用量进度条：percent 表示**已用**百分比（不是剩余）。
 * 颜色按已用比例分级：已用越高越接近告警色；满格红条 = 额度用光。
 */
export function ProgressBar({ percent, height = 6 }: {
  percent: number; height?: number
}): JSX.Element {
  const p = Math.max(0, Math.min(100, percent))
  return (
    <div style={{ width: '100%', height, borderRadius: height / 2, background: 'var(--dsw-alias-border-l2)', overflow: 'hidden' }}>
      <div style={{ height: '100%', width: `${p}%`, background: usageTone(p), borderRadius: height / 2, transition: 'width .3s ease' }} />
    </div>
  )
}
