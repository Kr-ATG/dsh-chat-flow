/**
 * UsageTab — 明细 tab（按视觉稿重构）。
 *
 * 六张 KPI 卡（范围合计 / 输入 / 输出 / 缓存命中直显 / 模型数 / 活跃天数，
 * 输入输出独立成卡、缓存命中值与缓存量常驻副行）+ 工具栏（搜索 + 指标下拉）+ 内容区：
 * Token 活动 52 周滚动热力（每周/累计口径 + 月份/星期标签）、月热力（日用量）+
 * 年热力（每月汇总）、当日模型明细、模型消耗排行、每日明细表，底部热力图说明。
 */

import { useEffect, useState } from 'react'
import { usageApi } from './api'
import { averageCacheHitRate, filterDaysByProvider, modelRank, splitModelKey, sumTokens, type UsageDay } from './aggregate'
import { filterDays, fromDayStr, toDayStr, type DateRange } from './range'
import { formatExact, formatHitRate, formatUnits } from './format'
import { Heatmap } from './charts/Heatmap'
import { MonthCalendar, type MonthCell } from './charts/MonthCalendar'
import { ErrorCard } from './primitives/ErrorCard'
import { useIsMobile } from '../../responsive'
import { ActivityGrid, type ActivityMetric, type ActivityMode, metricValueOf } from './ActivityGrid'
import { modalStaggerClass } from '../../triad-modal-animation'
import { css, HubStat, HubStatDetail, HubSection, modelsIcon, daysIcon, hitIcon, tokensIcon, inputIcon, outputIcon, RiseIcon, FallIcon } from './hub'

export interface UsageTabProps {
  range: DateRange
  rangeLabel: string
  refreshTick?: number
  /** 顶栏供应商筛选（'all' = 全部供应商），与工具栏文本搜索叠加生效。 */
  provider?: string
}

const MONO = 'ui-monospace, SFMono-Regular, Menlo, monospace'

const STYLE_ID = 'dsh-usage-search-styles'

/* ── 搜索交互样式：行入场淡入 + 输入框聚焦光效。
   注释刻意用文字描述「星号紧跟正斜杠」，不写出该两字符序列，防止整串被提前闭合。 ── */
const SHEET = `
@keyframes dsh-usage-row-in {
  from { opacity: 0; transform: translateY(4px); }
  to { opacity: 1; transform: translateY(0); }
}
.dsh-usage-row-in { animation: dsh-usage-row-in 240ms cubic-bezier(0.2, 0.8, 0.2, 1) backwards; }
@media (prefers-reduced-motion: reduce) {
  .dsh-usage-row-in { animation: none; }
}
`

/** 幂等注入搜索样式；返回移除函数。 */
function ensureSearchStyle(): () => void {
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

/** `.rowCard`：描边行卡片。 */
const rowCard: React.CSSProperties = {
  border: '1px solid var(--dsw-alias-border-l2)',
  borderRadius: 12,
  padding: '12px 14px',
  display: 'flex',
  flexDirection: 'column',
  gap: 12,
  minWidth: 0,
}

/** `.rowHead`：卡头。 */
function CardHead({ name, meta }: { name: string; meta?: string }): JSX.Element {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <span style={{ fontSize: 14, lineHeight: '22px', fontWeight: 500, color: 'var(--dsw-alias-label-primary)' }}>{name}</span>
      {meta !== undefined && <span style={{ fontSize: 12, lineHeight: '18px', color: 'var(--dsw-alias-label-tertiary)' }}>{meta}</span>}
    </div>
  )
}

/** DSH 表格单元格通用样式。 */
const thStyle: React.CSSProperties = {
  textAlign: 'left',
  padding: '6px 8px',
  fontSize: 12,
  lineHeight: '18px',
  fontWeight: 500,
  color: 'var(--dsw-alias-label-secondary)',
  borderBottom: '1px solid var(--dsw-alias-border-l2)',
  whiteSpace: 'nowrap',
}
const tdStyle: React.CSSProperties = {
  padding: '6px 8px',
  fontSize: 13,
  lineHeight: '20px',
  color: 'var(--dsw-alias-label-primary)',
}
const tdMono: React.CSSProperties = { ...tdStyle, fontFamily: MONO }

/** 每日明细行（按天汇总）。 */
interface DetailRow {
  key: string
  date: string
  input: number
  output: number
  cache: number
  total: number
  hitRate: number | null
}

/** 由范围数据构建按天汇总的明细行。 */
function buildDetailRows(days: UsageDay[]): DetailRow[] {
  return days.map(d => {
    const s = sumTokens([d])
    return {
      key: d.date, date: d.date,
      input: s.input, output: s.output, cache: s.cache, total: s.total,
      hitRate: d.cacheHitRate ?? null,
    }
  })
}

/** 一天内的不同模型数（模型明细为空时 = 0）。 */
function distinctModels(day: UsageDay | undefined): number {
  return day === undefined ? 0 : (day.models?.length ?? 0)
}

/** 「较昨日」副行：count 口径（+N / N / 0）。 */
function deltaSubCount(delta: number | null): { text: string; tone: 'up' | 'down' | 'flat' } {
  if (delta === null) return { text: '较昨日 —', tone: 'flat' }
  if (delta > 0) return { text: `较昨日 +${delta}`, tone: 'up' }
  if (delta < 0) return { text: `较昨日 ${delta}`, tone: 'down' }
  return { text: '较昨日 0', tone: 'flat' }
}

/** 「较昨日」副行：百分比口径（SVG 涨跌箭头 + x.xx%）。 */
function deltaSubPercent(delta: number | null): { text: React.ReactNode; tone: 'up' | 'down' | 'flat' } {
  if (delta === null) return { text: '较昨日 —', tone: 'flat' }
  if (delta > 0) return { text: (<span style={{ display: 'inline-flex', alignItems: 'center', gap: 3 }}>较昨日 <RiseIcon size={10} /> {delta.toFixed(2)}%</span>), tone: 'up' }
  if (delta < 0) return { text: (<span style={{ display: 'inline-flex', alignItems: 'center', gap: 3 }}>较昨日 <FallIcon size={10} /> {Math.abs(delta).toFixed(2)}%</span>), tone: 'down' }
  return { text: '较昨日 0.00%', tone: 'flat' }
}

export function UsageTab({ range, rangeLabel, refreshTick, provider = 'all' }: UsageTabProps): JSX.Element {
  const [usage, setUsage] = useState<UsageDay[] | null>(null)
  const [selectedDay, setSelectedDay] = useState<string | null>(null)
  const [activityMode, setActivityMode] = useState<ActivityMode>('day')
  const [metric, setMetric] = useState<ActivityMetric>('tokens')
  const [openStat, setOpenStat] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [retryTick, setRetryTick] = useState(0)
  const isMobile = useIsMobile()

  useEffect(() => {
    let alive = true
    setError(null)
    usageApi.usage().then((p) => {
      if (!alive) return
      if (p.ok !== true) throw new Error('用量数据加载失败')
      setUsage(p.days)
    }).catch((e: unknown) => { if (alive) setError(e instanceof Error ? e.message : String(e)) })
    return () => { alive = false }
  }, [refreshTick, retryTick])

  useEffect(() => ensureSearchStyle(), [])

  useEffect(() => { setSelectedDay(null) }, [provider])

  if (error) {
    return <ErrorCard message={error} onRetry={() => setRetryTick(t => t + 1)} />
  }
  if (usage === null) return <div style={{ padding: '24px 0', textAlign: 'center', fontSize: 13, color: 'var(--dsw-alias-label-tertiary)' }}>加载中…</div>

  const now = new Date()
  const year = now.getFullYear()
  const month = now.getMonth() + 1
  const monthPrefix = `${year}-${String(month).padStart(2, '0')}`

  const scoped = filterDaysByProvider(usage, provider)
  const filtered = [...filterDays(scoped, range)].sort((a, b) => a.date.localeCompare(b.date))
  const filteredSorted = [...filtered].sort((a, b) => b.date.localeCompare(a.date))

  const modelRankData = modelRank(filtered).map(row => {
    const { provider, model } = splitModelKey(row.label)
    return { ...row, provider, model: model === provider ? row.label : model }
  })
  const sortedRank = modelRankData

  const detailRows = buildDetailRows(filteredSorted)
  const provActive = provider.trim() !== '' && provider.trim() !== 'all'
  const provName = provider.trim()
  const scopeLabel = `${rangeLabel}${provActive ? ` · ${provName}` : ''}`
  const noMatchHint = `没有匹配「${provName}」供应商的数据`
  const inRangeSum = sumTokens(filtered)
  const hitRate = averageCacheHitRate(filtered)

  // ── KPI「较昨日」：范围最后一天 vs 前一天 ──
  const usageByDate = new Map<string, UsageDay>()
  for (const d of scoped) usageByDate.set(d.date, d)
  const lastDay = filtered.length > 0 ? filtered[filtered.length - 1] : null
  const prevDay = lastDay === null ? undefined : usageByDate.get(toDayStr(new Date(fromDayStr(lastDay.date).getTime() - 86_400_000)))
  const modelsDelta = lastDay === null ? null : distinctModels(lastDay) - distinctModels(prevDay)
  const activeDelta = lastDay === null ? null : ((lastDay.tokens ?? 0) > 0 ? 1 : 0) - ((prevDay?.tokens ?? 0) > 0 ? 1 : 0)
  const hitDelta = lastDay === null || prevDay === undefined || lastDay.cacheHitRate == null || prevDay.cacheHitRate == null
    ? null
    : lastDay.cacheHitRate - prevDay.cacheHitRate
  const modelsSub = deltaSubCount(modelsDelta)
  const activeSub = deltaSubCount(activeDelta)
  const hitSub = deltaSubPercent(hitDelta)

  // ── 热力数据（随指标口径） ──
  const heatDays = scoped
  const daysInMonth = new Date(year, month, 0).getDate()
  const monthCells: MonthCell[] = Array.from({ length: daysInMonth }, (_, i) => {
    const dateStr = `${monthPrefix}-${String(i + 1).padStart(2, '0')}`
    const hit = heatDays.find(d => d.date === dateStr)
    return {
      key: dateStr,
      day: i + 1,
      value: metricValueOf(hit, metric),
      input: hit?.inputTokens ?? 0,
      output: hit?.outputTokens ?? 0,
      cache: (hit?.cacheReadTokens ?? 0) + (hit?.cacheWriteTokens ?? 0),
      hitRate: hit?.cacheHitRate ?? null,
    }
  })
  const yearCells = Array.from({ length: 12 }, (_, i) => {
    const key = `${year}-${String(i + 1).padStart(2, '0')}`
    const days = heatDays.filter(d => d.date.startsWith(key))
    const sum = sumTokens(days)
    const value = metric === 'tokens' ? sum.total
      : metric === 'input' ? sum.input
        : metric === 'output' ? sum.output
          : metric === 'cache' ? sum.cache
            : days.reduce((acc, d) => acc + (d.requests ?? 0), 0)
    return {
      key, label: `${i + 1} 月`, short: `${i + 1}月`, value,
      input: sum.input,
      output: sum.output,
      cache: sum.cache,
      hitRate: days.length > 0 ? days.reduce((acc, d) => acc + (d.cacheHitRate ?? 0), 0) / days.length : undefined,
    }
  })

  const toggleStat = (key: string): void => { setOpenStat(v => v === key ? null : key) }

  return (
    <>
      {/* ── KPI 统计行（范围合计/输入/输出/缓存命中/模型数/活跃天数，输入输出独立成卡、缓存命中直显） ── */}
      <div className={css.statsRow} style={{ gridTemplateColumns: isMobile ? 'repeat(2, minmax(0, 1fr))' : 'repeat(6, minmax(0, 1fr))' }}>
        <HubStat
          tone="blue"
          icon={tokensIcon(18)}
          label="范围合计"
          value={formatUnits(inRangeSum.total)}
          sub={<span>≈ {formatExact(inRangeSum.total)}</span>}
          desc={`输入 ${formatUnits(inRangeSum.input)} · 输出 ${formatUnits(inRangeSum.output)} · 缓存 ${formatUnits(inRangeSum.cache)}`}
          open={openStat === 'total'}
          onToggle={() => { toggleStat('total') }}
          delay={0}
        />
        <HubStat
          tone="violet"
          icon={inputIcon(18)}
          label="输入"
          value={formatUnits(inRangeSum.input)}
          sub={<span>≈ {formatExact(inRangeSum.input)}</span>}
          desc={`输入精确 ${formatExact(inRangeSum.input)} · 占总量 ${inRangeSum.total > 0 ? Math.round((inRangeSum.input / inRangeSum.total) * 100) : 0}%`}
          open={openStat === 'input'}
          onToggle={() => { toggleStat('input') }}
          delay={30}
        />
        <HubStat
          tone="orange"
          icon={outputIcon(18)}
          label="输出"
          value={formatUnits(inRangeSum.output)}
          sub={<span>≈ {formatExact(inRangeSum.output)}</span>}
          desc={`输出精确 ${formatExact(inRangeSum.output)} · 占总量 ${inRangeSum.total > 0 ? Math.round((inRangeSum.output / inRangeSum.total) * 100) : 0}%`}
          open={openStat === 'output'}
          onToggle={() => { toggleStat('output') }}
          delay={60}
        />
        <HubStat
          tone="green"
          icon={hitIcon(18)}
          label="缓存命中"
          value={formatHitRate(hitRate)}
          sub={(<span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>缓存 {formatUnits(inRangeSum.cache)} · {hitSub.text}</span>)}
          subTone={hitSub.tone}
          desc={`缓存读占提示词比重 · 左右平均 · ${hitDelta === null ? '较昨日 —' : hitDelta > 0 ? `较昨日 +${hitDelta.toFixed(2)}%` : hitDelta < 0 ? `较昨日 -${Math.abs(hitDelta).toFixed(2)}%` : '较昨日 0.00%'}`}
          open={openStat === 'hit'}
          onToggle={() => { toggleStat('hit') }}
          delay={90}
        />
        <HubStat
          tone="violet"
          icon={modelsIcon(18)}
          label="模型数"
          value={String(modelRankData.length)}
          sub={modelsSub.text}
          subTone={modelsSub.tone}
          desc={`范围内用到 ${modelRankData.length} 个不同模型`}
          open={openStat === 'models'}
          onToggle={() => { toggleStat('models') }}
          delay={120}
        />
        <HubStat
          tone="green"
          icon={daysIcon(18)}
          label="活跃天数"
          value={String(filtered.filter(d => (d.tokens ?? 0) > 0).length)}
          sub={activeSub.text}
          subTone={activeSub.tone}
          desc={`${filtered.length} 天位于所选范围`}
          open={openStat === 'days'}
          onToggle={() => { toggleStat('days') }}
          delay={150}
        />
      </div>

      {openStat !== null && (
        <HubStatDetail
          title={`${openStat === 'total' ? '范围合计' : openStat === 'input' ? '输入' : openStat === 'output' ? '输出' : openStat === 'hit' ? '缓存命中' : openStat === 'models' ? '模型数' : '活跃天数'} · ${rangeLabel}`}
          rows={openStat === 'total'
            ? [
              { label: '输入', value: formatUnits(inRangeSum.input) },
              { label: '输出', value: formatUnits(inRangeSum.output) },
              { label: '缓存', value: formatUnits(inRangeSum.cache) },
            ]
            : openStat === 'input'
              ? [
                { label: '输入', value: formatUnits(inRangeSum.input) },
                { label: '精确值', value: formatExact(inRangeSum.input) },
                { label: '占总量', value: `${inRangeSum.total > 0 ? Math.round((inRangeSum.input / inRangeSum.total) * 100) : 0}%` },
              ]
              : openStat === 'output'
                ? [
                  { label: '输出', value: formatUnits(inRangeSum.output) },
                  { label: '精确值', value: formatExact(inRangeSum.output) },
                  { label: '占总量', value: `${inRangeSum.total > 0 ? Math.round((inRangeSum.output / inRangeSum.total) * 100) : 0}%` },
                ]
                : openStat === 'hit'
                  ? [
                    { label: '缓存命中', value: formatHitRate(hitRate) },
                    { label: '缓存量', value: formatUnits(inRangeSum.cache) },
                    { label: '输入', value: formatUnits(inRangeSum.input) },
                  ]
                  : openStat === 'models'
                    ? modelRankData.slice(0, 5).map(r => ({ label: r.model, value: formatUnits(r.value) }))
                    : [
                      { label: '范围天数', value: `${filtered.length} 天` },
                      { label: '有量天数', value: `${filtered.filter(d => (d.tokens ?? 0) > 0).length} 天` },
                      { label: '空白天数', value: `${filtered.filter(d => (d.tokens ?? 0) === 0).length} 天` },
                    ]}
        />
      )}

      <div className={`${css.mainScroll} ${modalStaggerClass}`}>
        {/* Token 活动：52 周滚动热力（每周 = 逐日着色 / 累计） */}
        <ActivityGrid
          days={heatDays}
          mode={activityMode}
          onMode={setActivityMode}
          metric={metric}
          onMetricChange={setMetric}
          metricPicker
          selectedKey={selectedDay}
          onSelect={setSelectedDay}
        />

        {/* 热力行：月热力（日用量）+ 年热力（每月汇总） */}
        <HubSection title="热力">
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 12, alignItems: 'start' }}>
            <div style={rowCard}>
              <CardHead name={`${year} 年 ${month} 月热力（日用量）`} meta="点击日查看当日模型明细" />
              <MonthCalendar year={year} month={month} cells={monthCells} onSelect={c => setSelectedDay(c.key)} />
            </div>
            <div style={rowCard}>
              <CardHead name={`${year} 年度热力（每月汇总）`} meta="1-6 月 / 7-12 月" />
              <Heatmap cells={yearCells} rows={2} cellText="both" />
            </div>
          </div>
        </HubSection>

        {/* 点热力格子：当日模型明细 */}
        {selectedDay !== null && (
          <HubSection title={`${selectedDay} 模型明细`}>
            <div style={rowCard}>
              <DayDetailTable day={scoped.find(d => d.date === selectedDay)} />
            </div>
          </HubSection>
        )}

        {/* 模型消耗排行（输入/输出/缓存命中直显） */}
        <HubSection title="模型消耗排行" meta={`${scopeLabel} · ${sortedRank.length} 个模型`}>
          <div style={rowCard}>
            {sortedRank.length === 0
              ? <div className={css.empty}>{provActive ? noMatchHint : '该范围暂无用量'}</div>
              : (
                <div style={{ maxHeight: 320, overflowY: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead style={{ position: 'sticky', top: 0, background: 'var(--dsw-alias-bg-layer-2)', zIndex: 1 }}>
                      <tr>{['排名', '模型', '输入', '输出', '缓存', '合计', '缓存命中'].map(h => <th key={h} style={thStyle}>{h}</th>)}</tr>
                    </thead>
                    <tbody>
                      {sortedRank.map((r, i) => (
                        <tr key={r.label} className="dsh-usage-row-in" style={{ borderBottom: '1px solid var(--dsw-alias-border-l1)' }}>
                          <td style={{ ...tdStyle, fontFamily: MONO, color: 'var(--dsw-alias-label-tertiary)' }}>{i + 1}</td>
                          <td style={{ ...tdStyle, maxWidth: isMobile ? 140 : 240, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={r.label}>{r.model}</td>
                          <td style={tdMono}>{formatUnits(r.input ?? 0)}</td>
                          <td style={tdMono}>{formatUnits(r.output ?? 0)}</td>
                          <td style={tdMono}>{formatUnits(r.cache ?? 0)}</td>
                          <td style={tdMono}>{formatUnits(r.value)}</td>
                          <td style={tdStyle}>{formatHitRate(r.hitRate)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
          </div>
        </HubSection>

        {/* 每日明细 */}
        <HubSection title="每日明细" meta={`${scopeLabel} · ${filteredSorted.length} 天`}>
          <div style={rowCard}>
            {filteredSorted.length === 0 ? (
              <div className={css.empty}>该范围暂无用量</div>
            ) : detailRows.length === 0 ? (
              <div className={css.empty}>{noMatchHint}</div>
            ) : (
              <div style={{ maxHeight: 320, overflowY: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead style={{ position: 'sticky', top: 0, background: 'var(--dsw-alias-bg-layer-2)', zIndex: 1 }}>
                    <tr>{['日期', '输入', '输出', '缓存', '合计', '缓存命中'].map(h => <th key={h} style={thStyle}>{h}</th>)}</tr>
                  </thead>
                  <tbody>
                    {detailRows.map(r => (
                      <tr key={r.key} className="dsh-usage-row-in"
                        style={{ cursor: 'pointer', borderBottom: '1px solid var(--dsw-alias-border-l1)' }}
                        onClick={() => setSelectedDay(r.date)}>
                        <td style={tdStyle}>{r.date}</td>
                        <td style={tdMono}>{formatUnits(r.input)}</td>
                        <td style={tdMono}>{formatUnits(r.output)}</td>
                        <td style={tdMono}>{formatUnits(r.cache)}</td>
                        <td style={tdMono}>{formatUnits(r.total)}</td>
                        <td style={tdStyle}>{formatHitRate(r.hitRate)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </HubSection>

        {/* 热力图说明 */}
        <div className={css.note} role="note">
          <span className={css.noteIcon} aria-hidden="true">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
              <circle cx="12" cy="12" r="9" />
              <path d="M12 11v5" />
              <path d="M12 8h.01" />
            </svg>
          </span>
          <span className={css.noteBody}>
            <span className={css.noteTitle}>热力图说明</span>
            <span className={css.noteText}>颜色越深代表用量越高，支持查看每周/累计用量及模型分布明细。</span>
          </span>
        </div>
      </div>
    </>
  )
}

function DayDetailTable({ day }: { day?: UsageDay }): JSX.Element | null {
  if (day === undefined) return null
  const rows = [...(day.models ?? [])].sort((a, b) => b.tokens - a.tokens)
  return (
    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
      <thead><tr>{['模型', '输入', '输出', '缓存', '合计', '缓存命中'].map(h => <th key={h} style={thStyle}>{h}</th>)}</tr></thead>
      <tbody>
        {rows.map(r => (
          <tr key={r.model} style={{ borderBottom: '1px solid var(--dsw-alias-border-l1)' }}>
            <td style={tdStyle}>{r.model}</td>
            <td style={tdMono}>{formatUnits(r.inputTokens)}</td>
            <td style={tdMono}>{formatUnits(r.outputTokens)}</td>
            <td style={tdMono}>{formatUnits((r.cacheReadTokens ?? 0) + (r.cacheWriteTokens ?? 0))}</td>
            <td style={tdMono}>{formatUnits(r.tokens)}</td>
            <td style={tdStyle}>{formatHitRate(r.cacheHitRate)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
