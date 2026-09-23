/**
 * dsh-chat-plus — 执行结果卡片。
 */
import { memo } from 'react'

export interface ExecutionResultCardProps {
  readonly resultText?: string
  readonly isRunning: boolean
}

export const KrExecutionResultCard = memo(function KrExecutionResultCard({
  resultText,
  isRunning,
}: ExecutionResultCardProps) {
  const display = resultText || (isRunning ? '正在验证修改结果…' : '本轮执行已顺利达成目标。')

  return (
    <div className="kr-card kr-card--result">
      <div className="kr-card__header">
        <span className="kr-card__icon">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="8" cy="8" r="6.5" />
            <path d="M5 8.2 7 10.2 11 6" />
          </svg>
        </span>
        <span className="kr-card__title">执行结果</span>
      </div>
      <div className="kr-result-content">
        <span className="kr-result-icon">
          {isRunning ? (
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ animation: 'kr-spin 1s linear infinite' }}>
              <circle cx="8" cy="8" r="6" strokeDasharray="9 9" />
            </svg>
          ) : (
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3.5 8.2 6.2 10.9 12.5 4.6" />
            </svg>
          )}
        </span>
        <span>{display}</span>
      </div>
    </div>
  )
})
