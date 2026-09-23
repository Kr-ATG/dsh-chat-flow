/**
 * ProviderLines — 供应商趋势对比（多线图）。
 *
 * Top N 供应商在范围内每日用量各画一条平滑线：网格 + X 日期标签 +
 * hover 十字线（portal tooltip 列出各家数值）+ 图例点击显隐 +
 * 入场画线动画（pathLength 归一描边）。单点退化为圆点。
 */

import { useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { formatExact, formatUnits } from '../format'
import { providerPalette } from '../theme'
import { ChartTooltip } from './ChartTooltip'
import { axisLabel, niceTicks } from './AreaChart'

export interface ProviderLineSeries {
  provider: string
  values: number[]
}

export function ProviderLines({ series, labels, height = 240, format = formatUnits }: {
  series: ProviderLineSeries[]
  /** 与 values 等长的 X 轴键（YYYY-MM-DD）。 */
  labels: string[]
  height?: number
  format?: (n: number) => string
}): JSX.Element {
  const [hover, setHover] = useState<{ index: number; x: number; y: number } | null>(null)
  const [hidden, setHidden] = useState<ReadonlySet<string>>(new Set())
  const wrapRef = useRef<HTMLDivElement>(null)
  const [wrapW, setWrapW] = useState(0)
  const palette = providerPalette()

  useEffect(ensureLineStyles, [])
  useEffect(() => {
    const el = wrapRef.current
    if (el === null || typeof ResizeObserver === 'undefined') return
    const ro = new ResizeObserver(() => { setWrapW(el.clientWidth) })
    ro.observe(el)
    setWrapW(el.clientWidth)
    return () => { ro.disconnect() }
  }, [])

  const visible = series.filter(s => !hidden.has(s.provider))
  const W = 800, H = height
  const PAD = { l: 48, r: 16, t: 16, b: 26 }
  const renderH = wrapW > 0 ? Math.max(120, Math.round((wrapW * H) / W)) : H

  const maxVal = useMemo(() => {
    let m = 0
    for (const s of visible) for (const v of s.values) if (v > m) m = v
    return m
  }, [visible])
  const ticks = useMemo(() => niceTicks(maxVal || 1), [maxVal])
  const chartMax = ticks[ticks.length - 1] || 1

  const n = labels.length
  const x = (i: number): number => n <= 1 ? (W - PAD.l - PAD.r) / 2 + PAD.l : PAD.l + (i / (n - 1)) * (W - PAD.l - PAD.r)
  const y = (v: number): number => H - PAD.b - (v / chartMax) * (H - PAD.t - PAD.b)
  const clampY = (v: number): number => Math.max(PAD.t, Math.min(H - PAD.b, y(v)))

  const colorOf = (p: string): string => palette[series.findIndex(s => s.provider === p) % palette.length]

  const toggle = (p: string): void => {
    setHidden(prev => {
      const next = new Set(prev)
      if (next.has(p)) next.delete(p)
      else if (visible.length > 1) next.add(p)
      return next
    })
  }

  const labelStep = Math.max(1, Math.ceil(n / Math.max(1, Math.floor((W - PAD.l - PAD.r) / 76))))
  const hoverLabel = hover !== null ? labels[hover.index] : undefined

  if (series.length === 0 || n === 0) {
    return <div style={{ height, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--dsw-alias-label-tertiary)', fontSize: 13 }}>暂无数据</div>
  }

  return (
    <div ref={wrapRef} className="dsh-prov-lines" style={{ position: 'relative', paddingTop: 22 }}>
      {/* 图例（点击显隐，至少保留一条） */}
      <div style={{ position: 'absolute', top: 0, right: 0, display: 'flex', gap: 12, flexWrap: 'wrap', maxWidth: '100%' }}>
        {series.map(s => {
          const off = hidden.has(s.provider)
          const total = s.values.reduce((a, v) => a + v, 0)
          return (
            <button
              key={s.provider}
              type="button"
              onClick={() => { toggle(s.provider) }}
              title={off ? '点击显示' : '点击隐藏'}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 5, border: 'none', background: 'transparent',
                cursor: 'pointer', fontFamily: 'inherit', fontSize: 11, padding: 0,
                color: off ? 'var(--dsw-alias-label-tertiary)' : 'var(--dsw-alias-label-secondary)',
                opacity: off ? 0.55 : 1, transition: 'opacity 140ms ease',
              }}
            >
              <span style={{ width: 14, height: 3, borderRadius: 2, background: colorOf(s.provider), flex: 'none' }} />
              <span style={{ textDecoration: off ? 'line-through' : undefined }}>{s.provider}</span>
              <span style={{ fontFamily: 'ui-monospace, monospace', color: 'var(--dsw-alias-label-tertiary)' }}>{format(total)}</span>
            </button>
          )
        })}
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} width="100%" height={renderH}>
        {ticks.map(v => (
          <g key={v}>
            <line x1={PAD.l} x2={W - PAD.r} y1={y(v)} y2={y(v)} stroke="var(--dsw-alias-border-l1)" strokeDasharray="4 4" />
            <text x={PAD.l - 8} y={y(v) + 3.5} fontSize={10.5} fill="var(--dsw-alias-label-tertiary)" textAnchor="end">{formatUnits(v)}</text>
          </g>
        ))}
        <line x1={PAD.l} x2={W - PAD.r} y1={H - PAD.b} y2={H - PAD.b} stroke="var(--dsw-alias-border-l2)" />

        {visible.map(s => {
          const pts = s.values.map((v, i) => ({ x: x(i), y: clampY(v) }))
          const d = pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(2)} ${p.y.toFixed(2)}`).join(' ')
          return (
            <g key={s.provider}>
              <path d={d} fill="none" stroke={colorOf(s.provider)} strokeWidth={2}
                strokeLinejoin="round" strokeLinecap="round" pathLength={1} className="dsh-prov-line" />
              {n <= 1 && pts.map((p, i) => (
                <circle key={i} cx={p.x} cy={p.y} r={4} fill={colorOf(s.provider)} />
              ))}
            </g>
          )
        })}

        {hover !== null && (
          <g className="dsh-prov-hover">
            <line x1={x(hover.index)} x2={x(hover.index)} y1={PAD.t} y2={H - PAD.b} stroke="var(--dsw-alias-border-l3)" strokeDasharray="3 3" />
            {visible.map(s => (
              <circle key={s.provider} cx={x(hover.index)} cy={clampY(s.values[hover.index])} r={4}
                fill="var(--dsw-alias-bg-layer-2)" stroke={colorOf(s.provider)} strokeWidth={2} />
            ))}
          </g>
        )}

        {labels.map((lb, i) => (i % labelStep === 0 || i === n - 1) ? (
          <text key={`${lb}-${i}`} x={x(i)} y={H - 8} fontSize={10.5} fill="var(--dsw-alias-label-tertiary)"
            textAnchor={i === 0 ? 'start' : i === n - 1 ? 'end' : 'middle'}>{axisLabel(lb)}</text>
        ) : null)}

        <rect x={PAD.l} y={PAD.t} width={W - PAD.l - PAD.r} height={H - PAD.t - PAD.b} fill="transparent"
          onMouseMove={(e) => {
            const r = e.currentTarget.getBoundingClientRect()
            const t = Math.min(1, Math.max(0, (e.clientX - r.left) / r.width))
            const index = n <= 1 ? 0 : Math.min(n - 1, Math.round(t * (n - 1)))
            setHover({ index, x: e.clientX, y: e.clientY })
          }}
          onMouseLeave={() => setHover(null)}
        />
      </svg>

      {hover !== null && hoverLabel !== undefined && typeof document !== 'undefined' && createPortal(
        <ChartTooltip x={hover.x} y={hover.y} placement={hover.y < 200 ? 'bottom' : 'top'}>
          <div style={{ fontWeight: 600, color: 'var(--dsw-alias-label-primary)', marginBottom: 4 }}>{hoverLabel}</div>
          {visible.map(s => (
            <div key={s.provider} className="dsh-chart-tip-row" style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 170 }}>
              <span style={{ width: 8, height: 8, borderRadius: 2, background: colorOf(s.provider), flex: 'none' }} />
              <span style={{ color: 'var(--dsw-alias-label-secondary)' }}>{s.provider}</span>
              <span style={{ marginLeft: 'auto', color: 'var(--dsw-alias-label-primary)', fontFamily: 'ui-monospace, monospace' }}>
                {format(s.values[hover.index])} <span style={{ color: 'var(--dsw-alias-label-tertiary)', fontSize: 11 }}>({formatExact(s.values[hover.index])})</span>
              </span>
            </div>
          ))}
        </ChartTooltip>,
        document.body,
      )}
    </div>
  )
}

const STYLE_ID = 'dsh-usage-prov-lines-styles'

const ANIM_SHEET = `
@keyframes dsh-prov-draw { from { stroke-dashoffset: 1; } to { stroke-dashoffset: 0; } }
@keyframes dsh-prov-rise { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
.dsh-prov-lines { animation: var(--dsh-chart-anim, dsh-prov-rise .5s cubic-bezier(.2,.8,.2,1)); }
.dsh-prov-lines .dsh-prov-line { stroke-dasharray: 1; animation: dsh-prov-draw .9s cubic-bezier(.3,.7,.3,1); }
.dsh-prov-lines .dsh-prov-hover { opacity: 0; transition: opacity .15s ease; }
.dsh-prov-lines:hover .dsh-prov-hover { opacity: 1; }
@media (max-width: 767.98px) {
  .dsh-chart-tip-row { min-width: 0 !important; flex-wrap: wrap; }
}
@media (prefers-reduced-motion: reduce) {
  .dsh-prov-lines, .dsh-prov-lines .dsh-prov-line { animation: none; }
}
`

function ensureLineStyles(): void {
  if (typeof document === 'undefined' || document.getElementById(STYLE_ID) !== null) return
  const tag = document.createElement('style')
  tag.id = STYLE_ID
  tag.dataset.plugin = 'dsh-triad'
  tag.textContent = ANIM_SHEET
  document.head.appendChild(tag)
}
