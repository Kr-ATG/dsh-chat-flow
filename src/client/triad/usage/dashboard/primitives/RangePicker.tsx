/**
 * RangePicker — 用量查询范围选择器（左栏平铺网格按钮形态）。
 *
 * 预设直接平铺（今日 / 昨日 / 近7天 / 近30天 / 本月 / 上月 / 今年 / 全部 /
 * 自定义），选中蓝底胶囊；选「自定义」时下方展开起止日期输入。
 */

import { resolveRange, type DateRange, type RangePreset } from '../range'
import { css } from '../hub'

const PRESETS: Array<{ key: RangePreset; label: string }> = [
  { key: 'today', label: '今日' },
  { key: 'yesterday', label: '昨日' },
  { key: '7d', label: '近 7 天' },
  { key: '30d', label: '近 30 天' },
  { key: 'month', label: '本月' },
  { key: 'lastMonth', label: '上月' },
  { key: 'year', label: '今年' },
  { key: 'all', label: '全部' },
  { key: 'custom', label: '自定义' },
]

export interface RangePickerProps {
  preset: RangePreset
  custom: DateRange | null
  onChangePreset: (preset: RangePreset) => void
  onChangeCustom: (range: DateRange) => void
}

export function RangePicker({ preset, custom, onChangePreset, onChangeCustom }: RangePickerProps): JSX.Element {
  const { range } = resolveRange(preset, custom)
  return (
    <>
      <div className={css.rangeGrid} role="group" aria-label="查询范围">
        {PRESETS.map(p => (
          <button
            key={p.key}
            type="button"
            className={css.rangeBtn}
            data-active={preset === p.key || undefined}
            aria-pressed={preset === p.key}
            onClick={() => { onChangePreset(p.key) }}
          >
            {p.label}
          </button>
        ))}
      </div>
      {preset === 'custom' && (
        <div className={css.rangeCustom}>
          <span className={css.rangeDateRow}>
            <input
              type="date"
              className={css.rangeDate}
              value={range.start}
              max={range.end}
              aria-label="开始日期"
              onChange={e => { if (e.target.value !== '') onChangeCustom({ start: e.target.value, end: range.end < e.target.value ? e.target.value : range.end }) }}
            />
            <span className={css.rangeDateSep}>~</span>
            <input
              type="date"
              className={css.rangeDate}
              value={range.end}
              min={range.start}
              aria-label="结束日期"
              onChange={e => { if (e.target.value !== '') onChangeCustom({ start: range.start > e.target.value ? e.target.value : range.start, end: e.target.value }) }}
            />
          </span>
        </div>
      )}
    </>
  )
}
