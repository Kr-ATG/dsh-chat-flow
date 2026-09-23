import { useEffect, useMemo, useState, type CSSProperties } from 'react'
import type { QuotaWindow } from '../api'
import { relativeTime, formatUnits } from '../format'
import { QuotaWindowRow } from './QuotaWindowRow'
import { ensureAccountsStyles } from './accounts-sheet'

/**
 * SenseNova 积分制配额面板：把 pool-usage 接口返回的积分池（通用池 /
 * Flash-Lite 专属池 × 5h/7天窗口 × 活动积分）渲染成左侧色条 + 淡色底的分区，
 * 窗口行用统一的「名称/数值 两行式」结构，进度条与百分比按已用比例分级配色；
 * 底部以虚线与块内容分隔，展示扣减顺序；规则明细折叠在面板末尾。
 */

const STYLE_ID = 'dsh-pool-quota-styles'

/**
 * 注入式 CSS 红线：本块内不写任何注释（注释闭合序列会把后续规则拖成
 * 非法选择器整条丢弃），类名全部带 dsh-pool- 前缀避免与宿主冲突。
 */
const SHEET = `
@keyframes dsh-pool-in {
  from { opacity: 0; transform: translate3d(0, 8px, 0); }
  to { opacity: 1; transform: translate3d(0, 0, 0); }
}
.dsh-pool-block {
  border-left: 3px solid var(--dsh-pool-accent, var(--dsw-alias-state-business-primary));
  border-radius: 10px;
  background: color-mix(in srgb, var(--dsh-pool-accent, var(--dsw-alias-state-business-primary)) 6%, var(--dsw-alias-bg-layer-1));
  padding: 10px 12px;
  opacity: 0;
  animation: dsh-pool-in 320ms cubic-bezier(0.2, 0.8, 0.2, 1) both;
  transition: background 180ms cubic-bezier(0.2, 0.8, 0.2, 1);
}
.dsh-pool-block:hover {
  background: color-mix(in srgb, var(--dsh-pool-accent, var(--dsw-alias-state-business-primary)) 9%, var(--dsw-alias-bg-layer-1));
}
.dsh-pool-row {
  opacity: 0;
  animation: dsh-pool-in 300ms cubic-bezier(0.2, 0.8, 0.2, 1) both;
}
.dsh-pool-foot {
  margin-top: 9px;
  padding-top: 8px;
  border-top: 1px dashed var(--dsw-alias-border-l2);
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  line-height: 16px;
  color: var(--dsw-alias-label-tertiary);
}
.dsh-pool-rules {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows 260ms cubic-bezier(0.2, 0.8, 0.2, 1);
}
.dsh-pool-rules[data-open="true"] { grid-template-rows: 1fr; }
.dsh-pool-rules-inner { min-height: 0; overflow: hidden; }
.dsh-pool-chevron {
  transition: transform 240ms cubic-bezier(0.2, 0.8, 0.2, 1);
}
.dsh-pool-chevron[data-open="true"] { transform: rotate(180deg); }
@media (prefers-reduced-motion: reduce) {
  .dsh-pool-block, .dsh-pool-row { animation: none; opacity: 1; }
  .dsh-pool-block { transition: none; }
}
`

export function ensurePoolQuotaStyles(): () => void {
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

interface PoolGroup {
  poolName: string
  poolType: string
  modelCount: number
  grantBalance: number | null
  grantExpiryAt: string | null
  windows: QuotaWindow[]
}

function groupPools(windows: QuotaWindow[]): PoolGroup[] {
  const groups: PoolGroup[] = []
  const index = new Map<string, PoolGroup>()
  for (const w of windows) {
    const name = w.poolName ?? w.kind
    let g = index.get(name)
    if (g === undefined) {
      g = {
        poolName: name,
        poolType: w.poolType ?? 'default',
        modelCount: w.modelCount ?? 0,
        grantBalance: w.grantBalance ?? null,
        grantExpiryAt: w.grantExpiryAt ?? null,
        windows: [],
      }
      index.set(name, g)
      groups.push(g)
    }
    g.windows.push(w)
  }
  return groups
}

function poolAccent(poolType: string): string {
  return poolType === 'dedicated'
    ? 'var(--dsw-alias-state-warn-primary)'
    : 'var(--dsw-alias-state-business-primary)'
}

function poolLabel(poolType: string): string {
  return poolType === 'dedicated' ? '专属池' : '通用池'
}

function deductionNote(poolType: string): string {
  return poolType === 'dedicated'
    ? '扣减顺序：专属池周期 → 通用池周期 → 通用池活动'
    : '扣减顺序：通用池周期 → 通用池活动'
}

const rulesRows: Array<{ title: string; body: string }> = [
  { title: 'Flash-lite 模型', body: '专属池周期积分 → 通用池周期积分 → 通用池活动固定积分' },
  { title: '其他模型', body: '通用池周期积分 → 通用池活动固定积分' },
  { title: '5h 窗口约束', body: '各池消耗受滚动 5 小时窗口额度上限约束，达上限自动顺延至下一池扣减' },
  { title: '活动回充', body: '活动期间 Flash-lite 专属池实际消耗按 1:1 折算回充为通用池活动积分，到账后 30 天有效' },
]

export function PoolQuotaPanel({ windows, plan, showRules = true }: { windows: QuotaWindow[]; plan?: string; showRules?: boolean }): JSX.Element {
  const [rulesOpen, setRulesOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  useEffect(() => { ensurePoolQuotaStyles(); ensureAccountsStyles() }, [])
  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true))
    return () => cancelAnimationFrame(id)
  }, [])

  const pools = useMemo(() => groupPools(windows), [windows])

  const sectionStyle: CSSProperties = { display: 'flex', flexDirection: 'column', gap: 8 }

  const hasPlan = typeof plan === 'string' && plan.trim() !== '' && plan.trim() !== '—' && plan.trim() !== '-'

  return (
    <div style={sectionStyle}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: 'var(--dsw-alias-label-tertiary)', flexWrap: 'wrap' }}>
        <span style={{ fontWeight: 600, color: 'var(--dsw-alias-label-secondary)', letterSpacing: 0.3 }}>积分制配额</span>
        {hasPlan && (
          <span style={{ color: 'var(--dsw-alias-label-secondary)' }}>
            · {plan}
          </span>
        )}
        <span style={{ fontVariantNumeric: 'tabular-nums' }}>· {pools.length} 个积分池</span>
      </div>

      {pools.map((pool, poolIndex) => {
        const accent = poolAccent(pool.poolType)
        const sorted = [...pool.windows].sort((a, b) => {
          const av = a.windowType === '5h' ? 0 : 1
          const bv = b.windowType === '5h' ? 0 : 1
          return av - bv
        })
        return (
          <div
            key={pool.poolName}
            className="dsh-pool-block"
            style={{ '--dsh-pool-accent': accent, animationDelay: `${poolIndex * 70}ms` } as CSSProperties}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 9, flexWrap: 'wrap' }}>
              <span style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--dsw-alias-label-primary)' }}>{pool.poolName}</span>
              <span className="dsh-acc-chip" style={{ color: accent, background: `color-mix(in srgb, ${accent} 12%, transparent)` }}>{poolLabel(pool.poolType)}</span>
              {pool.modelCount > 0 && (
                <span className="dsh-acc-chip" style={{ color: 'var(--dsw-alias-label-tertiary)', background: 'var(--dsw-alias-fill-l2)' }}>
                  {pool.modelCount} 个模型
                </span>
              )}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {sorted.map((w, wi) => (
                <QuotaWindowRow
                  key={w.kind}
                  window={w}
                  delay={poolIndex * 70 + 50 + wi * 60}
                  active={mounted}
                />
              ))}

              {pool.grantBalance !== null && pool.grantBalance > 0 && (
                <div className="dsh-pool-row" style={{ animationDelay: `${poolIndex * 70 + 130}ms` }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: 'var(--dsw-alias-label-secondary)' }}>
                    <span style={{ flex: 'none', width: 6, height: 6, borderRadius: 3, background: accent }} />
                    <span style={{ color: 'var(--dsw-alias-label-primary)', fontWeight: 500 }}>活动积分（固定）</span>
                    <span style={{ fontVariantNumeric: 'tabular-nums', color: 'var(--dsw-alias-label-secondary)' }}>{formatUnits(pool.grantBalance)}</span>
                    {pool.grantExpiryAt !== null && (
                      <span style={{ color: 'var(--dsw-alias-label-tertiary)' }}>· 最近到期 {relativeTime(new Date(pool.grantExpiryAt).getTime())}</span>
                    )}
                  </div>
                </div>
              )}

              <div className="dsh-pool-foot">
                <svg width="11" height="11" viewBox="0 0 16 16" fill="none" aria-hidden style={{ flex: 'none' }}>
                  <path d="M4 12V7a3 3 0 0 1 3-3h5M9.5 6.5L12 4 9.5 1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span>{deductionNote(pool.poolType)}</span>
              </div>
            </div>
          </div>
        )
      })}

      {showRules && (
        <div style={{ marginTop: 2 }}>
          <button
            type="button"
            onClick={() => setRulesOpen(o => !o)}
            style={{
              display: 'flex', alignItems: 'center', gap: 6, border: 'none', background: 'transparent',
              padding: '6px 2px', cursor: 'pointer', fontSize: 11, color: 'var(--dsw-alias-label-secondary)',
            }}
          >
            <svg className="dsh-pool-chevron" data-open={rulesOpen} width="12" height="12" viewBox="0 0 16 16" fill="none" aria-hidden>
              <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            积分扣减规则与 5h 窗口约束
          </button>
          <div className="dsh-pool-rules" data-open={rulesOpen}>
            <div className="dsh-pool-rules-inner">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 7, padding: '4px 0 10px 18px' }}>
                {rulesRows.map(r => (
                  <div key={r.title} style={{ fontSize: 11, lineHeight: 17 }}>
                    <span style={{ color: 'var(--dsw-alias-label-primary)', fontWeight: 500, marginRight: 8 }}>{r.title}</span>
                    <span style={{ color: 'var(--dsw-alias-label-secondary)' }}>{r.body}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
