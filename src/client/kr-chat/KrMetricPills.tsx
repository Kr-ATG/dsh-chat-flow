import { memo } from 'react'

export interface MetricPillsProps {
  readonly turnNumber: number
  readonly toolCount: number
  readonly failCount: number
  readonly durationText: string
  readonly onClose?: () => void
}

export const KrMetricPills = memo(function KrMetricPills({
  turnNumber,
  toolCount,
  failCount,
  durationText,
  onClose,
}: MetricPillsProps) {
  return (
    <div className="kr-pills-row">
      <div className="kr-pills">
        {/* 轮数 */}
        <div className="kr-pill" title={`当前查看第 ${turnNumber} 轮`}>
          <svg viewBox="0 0 16 16" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
            <path d="M8 2.5 14 5.5 8 8.5 2 5.5z" />
            <path d="M2 8.5 8 11.5 14 8.5" />
            <path d="M2 11.5 8 14.5 14 11.5" />
          </svg>
          <span>第 {turnNumber} 轮</span>
        </div>

        {/* 工具数 */}
        <div className="kr-pill" title={`本轮共发起 ${toolCount} 次工具调用`}>
          <svg viewBox="0 0 16 16" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10 2a3 3 0 0 0-3 3v1L3.5 9.5a1.414 1.414 0 0 0 2 2L9 8h1a3 3 0 0 0 3-3V2z" />
          </svg>
          <span>{toolCount} 次工具调用</span>
        </div>

        {/* 失败数 */}
        <div className={`kr-pill ${failCount > 0 ? 'kr-pill--fail' : ''}`} title={failCount > 0 ? `存在 ${failCount} 次执行失败` : '无执行失败'}>
          <svg viewBox="0 0 16 16" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="8" cy="8" r="6" />
            <path d="M5.5 5.5 10.5 10.5M10.5 5.5 5.5 10.5" />
          </svg>
          <span>{failCount} 次失败</span>
        </div>

        {/* 耗时 */}
        <div className="kr-pill" title={`本轮执行耗时 ${durationText}`}>
          <svg viewBox="0 0 16 16" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="8" cy="8" r="6" />
            <path d="M8 4.5v3.8l2.5 1.5" />
          </svg>
          <span>耗时 {durationText}</span>
        </div>
      </div>

      {onClose && (
        <button
          type="button"
          className="kr-pills-close-btn"
          onClick={onClose}
          title="收起指标（直接消失）"
          aria-label="收起指标"
        >
          <svg width="12" height="12" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.6">
            <path d="M2 2l10 10M12 2L2 12" strokeLinecap="round" />
          </svg>
        </button>
      )}
    </div>
  )
})
