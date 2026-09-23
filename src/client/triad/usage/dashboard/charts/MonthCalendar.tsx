/**
 * MonthCalendar — 月热力（日用量）日历块。
 *
 * 与参考稿一致：表头 日一二三四五六，首日前导空格；每个日格显示「日号 +
 * 指标值」，按热力色阶着色；点击日格下钻当日模型明细；悬浮出明细 tooltip
 * （合计/输入/输出/缓存/命中率）。入场按列错峰，悬浮有放大光效，配色/空态
 * 与 Heatmap 同一套色阶。
 */
import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { formatHitRate, formatUnits } from '../format'
import { heatLevel, heatPalette } from './Heatmap'

export interface MonthCell {
  key: string
  /** 日号（1..N）。 */
  day: number
  /** 当前指标口径下的展示值（tokens/input/output/cache/requests）。 */
  value: number
  input: number
  output: number
  cache: number
  hitRate?: number | null
}

const STYLE_ID = 'dsh-month-calendar-styles'
const TIP_GAP = 8

const SHEET = `
@keyframes dsh-month-cell-in {
  from { opacity: 0; transform: translate3d(0, 4px, 0) scale(0.92); }
  to { opacity: 1; transform: translate3d(0, 0, 0) scale(1); }
}
.dsh-month-cell {
  border: 0;
  border-radius: 9px;
  aspect-ratio: 1;
  min-width: 0;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
  padding: 0;
  font-family: inherit;
  cursor: pointer;
  opacity: 0;
  animation: dsh-month-cell-in 320ms cubic-bezier(0.2, 0.8, 0.2, 1) both;
  transition: transform 160ms cubic-bezier(0.2, 0.8, 0.2, 1), box-shadow 160ms cubic-bezier(0.2, 0.8, 0.2, 1), background-color 240ms cubic-bezier(0.2, 0.8, 0.2, 1), color 240ms cubic-bezier(0.2, 0.8, 0.2, 1);
}
.dsh-month-cell:hover {
  z-index: 2;
  transform: translateY(-2px);
  box-shadow: 0 0 0 1px var(--dsw-alias-state-business-primary), 0 8px 18px color-mix(in srgb, var(--dsw-alias-state-business-primary) 34%, transparent);
}
.dsh-month-cell[data-empty="true"] { cursor: default; }
.dsh-month-cell[data-empty="true"]:hover { transform: none; box-shadow: none; }
@media (prefers-reduced-motion: reduce) {
  .dsh-month-cell { animation: none; opacity: 1; }
  .dsh-month-cell:hover { transform: none; }
}
`

function ensureStyles(): () => void {
  if (typeof document === 'undefined') return () => {}
  let tag = document.getElementById(STYLE_ID) as HTMLStyleElement | null
  if (tag === null) {
    tag = document.createElement('style')
    tag.id = STYLE_ID
    tag.dataset.plugin = 'dsh-triad'
    tag.textContent = SHEET
    document.head.appendChild(tag)
  }
  return () => { tag?.remove() }
}

export function MonthCalendar({ year, month, cells, onSelect }: {
  year: number
  month: number
  /** 当月每一天的热力格（新 -> 旧不要求顺序；按 day 对齐）。 */
  cells: MonthCell[]
  onSelect?: (cell: MonthCell) => void
}): JSX.Element {
  const [hover, setHover] = useState<{ cell: MonthCell; left: number; top: number } | null>(null)
  useEffect(() => ensureStyles(), [])

  const byDay = new Map<number, MonthCell>()
  for (const c of cells) byDay.set(c.day, c)
  const firstWeekday = new Date(year, month - 1, 1).getDay() // 0 = 周日
  const daysInMonth = new Date(year, month, 0).getDate()
  const blanks = Array.from({ length: firstWeekday })
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1)
  const today = new Date()
  const todayDay = today.getFullYear() === year && today.getMonth() + 1 === month ? today.getDate() : null

  return (
    <div>
      {/* 表头：日一二三四五六 */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, minmax(0, 1fr))', gap: 6, marginBottom: 6 }}>
        {['日', '一', '二', '三', '四', '五', '六'].map(w => (
          <span key={w} style={{ fontSize: 11, lineHeight: '16px', textAlign: 'center', color: 'var(--dsw-alias-label-tertiary)' }}>{w}</span>
        ))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, minmax(0, 1fr))', gap: 6 }}>
        {blanks.map((_, i) => (
          <span key={`b${i}`} style={{ aspectRatio: '1' }} aria-hidden="true" />
        ))}
        {days.map(d => {
          const cell = byDay.get(d)
          const value = cell?.value ?? 0
          const active = value > 0
          const idx = active ? Math.min(9, heatLevel(value)) : 0
          const bg = active ? heatPalette[idx - 1] : 'color-mix(in srgb, var(--dsw-alias-border-l2) 55%, transparent)'
          const fg = active ? 'rgba(255,255,255,0.96)' : 'var(--dsw-alias-label-secondary)'
          return (
            <button
              key={d}
              type="button"
              className="dsh-month-cell"
              data-today={todayDay === d || undefined}
              aria-label={`${year}-${String(month).padStart(2, '0')}-${String(d).padStart(2, '0')}${active ? ` · ${formatUnits(value)}` : ''}`}
              style={{
                background: bg,
                color: fg,
                animationDelay: `${(d - 1) % 7 * 18 + Math.floor((d - 1) / 7) * 8}ms`,
                boxShadow: todayDay === d ? '0 0 0 1px var(--dsw-alias-state-business-primary)' : undefined,
              }}
              onClick={() => cell !== undefined && onSelect?.(cell)}
              onMouseEnter={(e) => {
                if (cell === undefined) return
                const r = e.currentTarget.getBoundingClientRect()
                setHover({ cell, left: r.left, top: r.top })
              }}
              onMouseLeave={() => setHover(null)}
            >
              <span style={{ fontSize: 11, lineHeight: '13px', fontWeight: 600, opacity: active ? 1 : 0.85 }}>{d}</span>
              {active && (
                <span style={{ fontSize: 10, lineHeight: '12px', fontWeight: 600, fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap', maxWidth: '100%', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {formatUnits(value)}
                </span>
              )}
            </button>
          )
        })}
      </div>

      {hover !== null && typeof document !== 'undefined' && createPortal(
        <div style={{
          position: 'fixed',
          bottom: typeof window !== 'undefined' ? window.innerHeight - hover.top + TIP_GAP : 0,
          left: hover.left,
          background: 'var(--dsw-alias-bg-layer-3)',
          border: '1px solid var(--dsw-alias-border-l1)',
          borderRadius: 10,
          padding: '9px 12px',
          fontSize: 12,
          lineHeight: '18px',
          color: 'var(--dsw-alias-label-secondary)',
          zIndex: 6100,
          boxShadow: '0 8px 24px rgba(0,0,0,.35)',
          pointerEvents: 'none',
        }}>
          <div style={{ fontWeight: 600, marginBottom: 2, color: 'var(--dsw-alias-label-primary)' }}>{hover.cell.key}</div>
          <div>合计 {formatUnits(hover.cell.value)}</div>
          {hover.cell.input + hover.cell.output + hover.cell.cache > 0 && (
            <div style={{ marginTop: 4, display: 'flex', flexDirection: 'column', gap: 2 }}>
              <span>输入 {formatUnits(hover.cell.input)} · 输出 {formatUnits(hover.cell.output)}</span>
              <span>缓存 {formatUnits(hover.cell.cache)}{hover.cell.hitRate !== undefined && hover.cell.hitRate !== null ? ` · 命中 ${formatHitRate(hover.cell.hitRate)}` : ''}</span>
            </div>
          )}
        </div>,
        document.body,
      )}
    </div>
  )
}
