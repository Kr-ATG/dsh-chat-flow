/**
 * dsh-chat-plus — 思考过程卡片（带电灯泡图标、要点、展开详情）。
 */
import { memo, useMemo, useState } from 'react'

export interface ReasoningCardProps {
  readonly reasoningTexts: readonly string[]
  readonly running: boolean
}

export const KrReasoningCard = memo(function KrReasoningCard({
  reasoningTexts,
  running,
}: ReasoningCardProps) {
  const [collapsed, setCollapsed] = useState(false)
  const [expandedDetail, setExpandedDetail] = useState(false)

  // 提取思考要点行
  const points = useMemo(() => {
    const full = reasoningTexts.join('\n')
    if (!full.trim()) return []

    const lines = full.split('\n').map((l) => l.trim()).filter((l) => l.length > 0)
    // 优先寻找以数字开头的要点，如 "1. 分析需求: ..."
    const numbered = lines.filter((l) => /^\d+[\.、\s]/.test(l))
    if (numbered.length > 0) return numbered

    // 否则取前 4 行简明要点
    return lines.slice(0, 4)
  }, [reasoningTexts])

  if (reasoningTexts.length === 0 && !running) return null

  return (
    <div className="kr-card kr-card--reasoning">
      <div className="kr-card__header" onClick={() => setCollapsed(!collapsed)}>
        <span className="kr-card__icon">
          {/* 电灯泡线框无色彩矢量图标 */}
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 13h4M6.5 15h3M6 10.5c-.7-.7-1.5-1.7-1.5-3a4.5 4.5 0 1 1 9 0c0 1.3-.8 2.3-1.5 3-.5.5-.8 1.2-.8 2h-4.4c0-.8-.3-1.5-.8-2z" />
          </svg>
        </span>
        <span className="kr-card__title">
          思考过程 {points.length > 0 ? `(${points.length})` : running ? '(思考中…)' : ''}
        </span>
        <span className="kr-card__chevron" data-collapsed={collapsed ? 'true' : 'false'}>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.6">
            <path d="M2.5 4.5 6 8 9.5 4.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </div>

      {!collapsed && (
        <div className="kr-reasoning-list">
          {points.length > 0 ? (
            (expandedDetail ? points : points.slice(0, 3)).map((item, idx) => (
              <div className="kr-reasoning-row" key={idx}>
                <span>{item}</span>
              </div>
            ))
          ) : (
            <div style={{ color: 'var(--dsw-alias-label-tertiary)' }}>
              {running ? '正在深入推演需求与实施方案…' : '本轮无独立思考记录'}
            </div>
          )}

          {points.length > 3 && (
            <div>
              <button
                type="button"
                className="kr-expand-btn"
                onClick={() => setExpandedDetail(!expandedDetail)}
              >
                <span>{expandedDetail ? '收起详情' : `展开其余 ${points.length - 3} 项要点`}</span>
                <svg
                  width="10"
                  height="10"
                  viewBox="0 0 12 12"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{
                    transform: expandedDetail ? 'rotate(180deg)' : 'none',
                    transition: 'transform 0.15s ease',
                  }}
                >
                  <path d="M2.5 4.5 6 8 9.5 4.5" />
                </svg>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
})
