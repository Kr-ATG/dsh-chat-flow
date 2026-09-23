/**
 * AccountsTab — 余额/配额 tab（新版设计稿布局）。
 *
 * 页面头（标题/副标题 + 搜索/刷新/凭据）→ KPI 四格（供应商总数/已配置/积分池/告警）
 * → 状态横幅（正常/告警，可跳信号中心）→ 主体（供应商列表表格 + 右侧详情抽屉）。
 * 行为：行点击/添加方案打开抽屉（宽 316px，滑入滑出动效），未配置行「立即配置」
 * 弹凭据弹窗；搜索为本地过滤；「刷新数据」全量刷新账户快照。
 */

import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { usageApi, type AccountSnapshot, type ProviderInfo } from './api'
import { formatUnits } from './format'
import { providerPalette } from './theme'
import { ProgressBar } from './charts/ProgressBar'
import { AccountDrawer } from './primitives/AccountDrawer'
import { CredentialModal } from './primitives/CredentialModal'
import { ErrorCard } from './primitives/ErrorCard'
import { ensureAccountsStyles } from './primitives/accounts-sheet'
import { modalStaggerClass } from '../../triad-modal-animation'

export interface AccountsTabProps {
  refreshTick?: number
  /** 跳转信号 tab（横幅「查看信号中心」）。 */
  onJumpSignal?: () => void
}

/* ── 页面排版 ─────────────────────────────────────────────── */

const HEAD: CSSProperties = { display: 'flex', alignItems: 'flex-start', gap: 12, flexWrap: 'wrap' }
const HEAD_TITLE: CSSProperties = { display: 'flex', flexDirection: 'column', gap: 3, minWidth: 0, flex: 1 }
const ICON_BTN: CSSProperties = {
  display: 'flex', alignItems: 'center', justifyContent: 'center', width: 32, height: 32,
  borderRadius: 10, border: '1px solid var(--dsw-alias-border-l1)', background: 'var(--dsw-alias-bg-layer-2)',
  color: 'var(--dsw-alias-label-secondary)', cursor: 'pointer',
  transition: 'color 180ms cubic-bezier(0.2, 0.8, 0.2, 1), border-color 180ms cubic-bezier(0.2, 0.8, 0.2, 1), transform 180ms cubic-bezier(0.2, 0.8, 0.2, 1)',
}
const REFRESH_BTN: CSSProperties = {
  display: 'flex', alignItems: 'center', gap: 6, height: 32, padding: '0 12px',
  borderRadius: 10, border: '1px solid var(--dsw-alias-border-l1)', background: 'var(--dsw-alias-bg-layer-2)',
  color: 'var(--dsw-alias-label-secondary)', cursor: 'pointer', fontSize: 12,
  transition: 'color 180ms cubic-bezier(0.2, 0.8, 0.2, 1), border-color 180ms cubic-bezier(0.2, 0.8, 0.2, 1)',
}

function kpiTone(color: string, alpha = 13): string {
  return `color-mix(in srgb, ${color} ${alpha}%, transparent)`
}

function KpiTile({ color, icon, label, value, sub, delay }: {
  color: string; icon: JSX.Element; label: string; value: string; sub: string; delay: number
}): JSX.Element {
  return (
    <div className="dsh-acc-kpi" style={{ animationDelay: `${delay}ms` }}>
      <div className="dsh-acc-kpi-icon" style={{ background: kpiTone(color, 14), color }}>
        {icon}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 1, minWidth: 0 }}>
        <span style={{ fontSize: 12, lineHeight: '18px', color: 'var(--dsw-alias-label-secondary)' }}>{label}</span>
        <span style={{ fontSize: 20, lineHeight: '28px', fontWeight: 600, color: 'var(--dsw-alias-label-primary)', fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace', fontVariantNumeric: 'tabular-nums' }}>
          {value}
        </span>
        <span style={{ fontSize: 11, lineHeight: '16px', color: 'var(--dsw-alias-label-tertiary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{sub}</span>
      </div>
    </div>
  )
}

function statusMeta(p: ProviderInfo): { label: string; color: string } {
  switch (p.status) {
    case 'ok': return { label: '正常', color: 'var(--dsw-alias-state-success-primary)' }
    case 'critical': return { label: '紧急', color: 'var(--dsw-alias-state-error-primary)' }
    case 'warning': return { label: '警告', color: 'var(--dsw-alias-state-warn-primary)' }
    case 'not-configured':
    case 'unauthorized': return { label: '未配置', color: 'var(--dsw-alias-state-warn-primary)' }
    case 'pending': return { label: '等待', color: 'var(--dsw-alias-label-tertiary)' }
    default: return { label: '未知', color: 'var(--dsw-alias-label-tertiary)' }
  }
}

const COL = 'minmax(200px, 2.1fr) 90px minmax(168px, 1.5fr) minmax(132px, 1.3fr) 88px'

function LogoMark({ name, color, size = 30 }: { name: string; color: string; size?: number }): JSX.Element {
  const initial = name.trim().slice(0, 1).toUpperCase() || '?'
  return (
    <span className="dsh-acc-logo" style={{ width: size, height: size, background: kpiTone(color, 16), color }}>
      {initial}
    </span>
  )
}

export function AccountsTab({ refreshTick, onJumpSignal }: AccountsTabProps): JSX.Element {
  const [providers, setProviders] = useState<ProviderInfo[]>([])
  const [accounts, setAccounts] = useState<Record<string, AccountSnapshot>>({})
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [drawerClosing, setDrawerClosing] = useState(false)
  const [search, setSearch] = useState('')
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [credentialFor, setCredentialFor] = useState<string | null>(null)
  const [loaded, setLoaded] = useState(false)
  const closeTimer = useRef<number | null>(null)

  useEffect(() => ensureAccountsStyles(), [])

  useEffect(() => () => {
    if (closeTimer.current !== null) window.clearTimeout(closeTimer.current)
  }, [])

  const load = (): void => {
    setError(null)
    usageApi.providers().then(p => {
      if (p.ok !== true) throw new Error('供应商数据加载失败')
      setProviders(p.providers)
      setAccounts(prev => {
        // 只保留仍存在的供应商，避免选中项漂移。
        const keep: Record<string, AccountSnapshot> = {}
        for (const id of Object.keys(prev)) if (p.providers.some(x => x.id === id)) keep[id] = prev[id]!
        return keep
      })
      // 并行拉取账户快照（读后台刷新缓存，成本低）。
      void Promise.all(p.providers.map(pr => usageApi.account(pr.id).then(resp => {
        if (resp.ok) setAccounts(prev => ({ ...prev, [resp.account.id]: resp.account }))
      }).catch(() => null)))
    }).catch((e: unknown) => setError(e instanceof Error ? e.message : String(e)))
      .finally(() => setLoaded(true))
  }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { load() }, [refreshTick])

  const refreshAll = (): void => {
    setRefreshing(true); setError(null)
    Promise.all(providers.map(p => usageApi.account(p.id, true).catch(() => null)))
      .then(() => load())
      .finally(() => setRefreshing(false))
  }

  const saveCredential = async (value: string): Promise<void> => {
    const res = await fetch('/api/usage-stats/credentials', {
      method: 'POST', headers: { 'content-type': 'application/json', accept: 'application/json' },
      body: JSON.stringify({ ref: 'SENSENOVA_API_KEY', value }),
    })
    const payload = await res.json()
    if (!res.ok || payload.ok !== true) throw new Error(payload?.message ?? `HTTP ${res.status}`)
    load()
  }

  if (error) {
    return <ErrorCard message={error} onRetry={load} />
  }

  const select = (id: string): void => {
    if (closeTimer.current !== null) window.clearTimeout(closeTimer.current)
    setDrawerClosing(false)
    setSelectedId(id)
  }
  const closeDrawer = (): void => {
    if (drawerClosing) return
    setDrawerClosing(true)
    closeTimer.current = window.setTimeout(() => {
      setSelectedId(null)
      setDrawerClosing(false)
    }, 230)
  }
  const toggleSelect = (id: string): void => {
    if (selectedId === id && !drawerClosing) closeDrawer()
    else select(id)
  }

  const palette = providerPalette()
  const indexOf = (id: string): number => {
    const i = providers.findIndex(p => p.id === id)
    return i === -1 ? 0 : i
  }

  const q = search.trim().toLowerCase()
  const visible = loaded ? providers.filter(p => q === '' || p.displayName.toLowerCase().includes(q)) : []

  const alertCount = providers.filter(p => p.status === 'critical' || p.status === 'warning').length
  const configuredCount = providers.filter(p => p.configured).length
  const poolProviders = providers.filter(p => p.adapter === 'sensenova-token-plan')
  const poolNames = new Set<string>()
  for (const p of poolProviders) {
    for (const w of accounts[p.id]?.windows ?? []) {
      const name = w.poolName ?? (w.kind ?? '').split(' · ')[0]
      if (name !== '') poolNames.add(name)
    }
  }
  const poolGroups = poolNames.size

  const selectedProvider = selectedId !== null ? providers.find(p => p.id === selectedId) ?? null : null

  const rowUsage = (p: ProviderInfo): { pct: number; text: string | null } | null => {
    const wins = accounts[p.id]?.windows ?? []
    if (wins.length === 0) return null
    // 取已用比例最高的窗口作为该行代表（5h 空窗口不抢镜）。
    const w = wins.slice().sort((a, b) => (b.usedPercent ?? 0) - (a.usedPercent ?? 0) || ((b.limit ?? 0) - (a.limit ?? 0)))[0]!
    const pct = Math.max(0, Math.min(100, w.usedPercent ?? 0))
    const text = (w.limit ?? 0) > 0 && w.used !== undefined
      ? `${formatUnits(w.used)} / ${formatUnits(w.limit)}`
      : null
    return { pct, text }
  }

  const quotaType = (p: ProviderInfo): string | null => {
    const wins = accounts[p.id]?.windows ?? []
    if (wins.length > 0) {
      const names = new Set(wins.map(w => w.poolName ?? (w.kind ?? '').split(' · ')[0]).filter(Boolean))
      if (names.size <= 1) {
        const base = [...names][0] ?? '积分池'
        return `${base} · ${wins.length} 个窗口`
      }
      return `${names.size} 个池 · ${wins.length} 个窗口`
    }
    if (p.accountMode === 'balance') return '余额'
    if (p.accountMode === 'subscription') return '订阅'
    return null
  }

  const planMeta = (p: ProviderInfo): string | null => {
    const plan = accounts[p.id]?.plan
    const hasPlan = typeof plan === 'string' && plan.trim() !== '' && plan.trim() !== '—' && plan.trim() !== '-'
    const modelCount = (accounts[p.id]?.windows ?? []).find(w => (w.modelCount ?? 0) > 0)?.modelCount ?? null
    if (!hasPlan && modelCount === null) return null
    return `${hasPlan ? plan : ''}${hasPlan && modelCount !== null ? ' · ' : ''}${modelCount !== null ? `${modelCount} 个模型` : ''}`
  }

  const drawer = selectedProvider !== null ? (
    <AccountDrawer
      key={selectedProvider.id}
      account={accounts[selectedProvider.id] ?? null}
      closing={drawerClosing}
    />
  ) : null

  return (
    <div className={modalStaggerClass} style={{ display: 'flex', flexDirection: 'column', gap: 12, height: '100%', minHeight: 0, padding: '18px 20px 20px' }}>
      {/* ── 页面头 ── */}
      <div style={HEAD}>
        <div style={HEAD_TITLE}>
          <span style={{ fontSize: 18, lineHeight: '26px', fontWeight: 600, color: 'var(--dsw-alias-label-primary)' }}>余额 / 配额</span>
          <span style={{ fontSize: 12, lineHeight: '18px', color: 'var(--dsw-alias-label-tertiary)' }}>监控所有 AI 供应商的额度使用情况与配额状态</span>
        </div>
        <label className="dsh-acc-search" style={{ marginLeft: 'auto' }}>
          <svg width="13" height="13" viewBox="0 0 16 16" fill="none" aria-hidden="true" style={{ color: 'var(--dsw-alias-label-tertiary)', flex: 'none' }}>
            <circle cx="7" cy="7" r="4.6" stroke="currentColor" strokeWidth="1.4" />
            <path d="M10.6 10.6 14 14" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
          </svg>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="搜索供应商" aria-label="搜索供应商" />
        </label>
        <button type="button" style={REFRESH_BTN} onClick={refreshAll} disabled={refreshing || providers.length === 0} aria-label="刷新数据">
          <svg className={refreshing ? 'dsh-acc-spin' : undefined} width="13" height="13" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M13.5 8a5.5 5.5 0 1 1-1.6-3.9M13.5 1.8v3.2h-3.2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {refreshing ? '刷新中' : '刷新数据'}
        </button>
        <button
          type="button" style={ICON_BTN} aria-label="管理凭据"
          onClick={() => setCredentialFor(poolProviders[0]?.id ?? providers[0]?.id ?? null)}
          title="管理凭据"
        >
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <circle cx="8" cy="8" r="2.2" stroke="currentColor" strokeWidth="1.4" />
            <path d="M8 1.6v1.9M8 12.5v1.9M1.6 8h1.9M12.5 8h1.9M3.5 3.5l1.4 1.4M11.1 11.1l1.4 1.4M12.5 3.5l-1.4 1.4M4.9 11.1l-1.4 1.4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      {/* ── KPI 四格 ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12 }}>
        <KpiTile color="#4f8cff" delay={0} label="供应商总数" value={loaded ? String(providers.length) : '—'} sub={loaded ? '全部' : '加载中…'}
          icon={<svg width="18" height="18" viewBox="0 0 16 16" fill="none" aria-hidden="true"><rect x="1.8" y="2.2" width="12.4" height="4.2" rx="1.4" stroke="currentColor" strokeWidth="1.4" /><rect x="1.8" y="9.6" width="12.4" height="4.2" rx="1.4" stroke="currentColor" strokeWidth="1.4" /></svg>} />
        <KpiTile color="#51cf66" delay={50} label="已配置" value={loaded ? String(configuredCount) : '—'} sub={loaded && providers.length > 0 ? `${((configuredCount / providers.length) * 100).toFixed(1)}%` : '—'}
          icon={<svg width="18" height="18" viewBox="0 0 16 16" fill="none" aria-hidden="true"><circle cx="8" cy="8" r="6.2" stroke="currentColor" strokeWidth="1.4" /><path d="M5.2 8.2 7.2 10.2 10.8 6.2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>} />
        <KpiTile color="#7c6bff" delay={100} label="积分池" value={loaded ? String(poolProviders.length) : '—'} sub={loaded ? `${poolGroups > 0 ? poolGroups : 0} 个池` : '加载中…'}
          icon={<svg width="18" height="18" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M8 2 14 5.2 8 8.4 2 5.2 8 2Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" /><path d="M2 8.4 8 11.6l6-3.2M2 11.4 8 14.6l6-3.2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" opacity="0.6" /></svg>} />
        <KpiTile color="#ffa94d" delay={150} label="告警" value={loaded ? String(alertCount) : '—'} sub={loaded ? (alertCount > 0 ? `${alertCount} 个供应商受影响` : '暂无告警') : '加载中…'}
          icon={<svg width="18" height="18" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M8 2.2a4.4 4.4 0 0 0-4.4 4.4c0 3-.9 4.2-1.6 4.8h12c-.7-.6-1.6-1.8-1.6-4.8A4.4 4.4 0 0 0 8 2.2Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" /><path d="M6.6 13.6a1.5 1.5 0 0 0 2.8 0" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" /></svg>} />
      </div>

      {/* ── 状态横幅 ── */}
      {loaded && (
        <div className="dsh-acc-banner" data-tone={alertCount > 0 ? 'warn' : 'ok'}>
          <span style={{ display: 'flex', flex: 'none' }}>
            {alertCount > 0 ? (
              <svg width="17" height="17" viewBox="0 0 16 16" fill="none" aria-hidden="true" style={{ color: 'var(--dsw-alias-state-warn-primary)' }}>
                <path d="M8 1.8 14.6 13.4H1.4L8 1.8Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
                <path d="M8 6.4v3.2M8 11.4v.4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
              </svg>
            ) : (
              <svg width="17" height="17" viewBox="0 0 16 16" fill="none" aria-hidden="true" style={{ color: 'var(--dsw-alias-state-success-primary)' }}>
                <circle cx="8" cy="8" r="6.2" stroke="currentColor" strokeWidth="1.5" />
                <path d="M5.2 8.2 7.2 10.2 10.8 6.2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </span>
          <div style={{ minWidth: 0, display: 'flex', flexDirection: 'column', gap: 1, flex: 1 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: alertCount > 0 ? 'var(--dsw-alias-state-warn-primary)' : 'var(--dsw-alias-state-success-primary)' }}>
              {alertCount > 0 ? `检测到 ${alertCount} 项告警` : '所有系统运行正常'}
            </span>
            <span style={{ fontSize: 11, lineHeight: '16px', color: 'var(--dsw-alias-label-tertiary)' }}>
              {alertCount > 0 ? '部分供应商处于警告或紧急状态' : '当前没有需要处理的告警或异常'}
            </span>
          </div>
          <button
            type="button" onClick={onJumpSignal}
            style={{ flex: 'none', display: 'flex', alignItems: 'center', gap: 4, border: 'none', background: 'transparent', cursor: 'pointer', padding: '5px 8px', borderRadius: 8, fontSize: 12, color: 'var(--dsw-alias-label-secondary)', transition: 'background 160ms cubic-bezier(0.2, 0.8, 0.2, 1)' }}
          >
            查看信号中心
            <svg width="12" height="12" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M6 3.5 10.5 8 6 12.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      )}

      {/* ── 主体：表格 + 抽屉 ── */}
      <div style={{ flex: 1, minHeight: 0, display: 'flex', gap: 12, alignItems: 'stretch' }}>
        <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 10, minHeight: 0 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, flex: 'none' }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--dsw-alias-label-primary)' }}>供应商列表</span>
            <span style={{ fontSize: 12, color: 'var(--dsw-alias-label-tertiary)' }}>({loaded ? providers.length : '—'})</span>
            {q !== '' && <span style={{ fontSize: 11, color: 'var(--dsw-alias-label-tertiary)' }}>· {visible.length} 项匹配</span>}
          </div>

          {!loaded ? (
            <div className="dsh-acc-tlist" style={{ flex: 1, minHeight: 0 }}>
              {[0, 1, 2, 3, 4].map(i => <div key={i} className="dsh-acc-skel" style={{ height: 64, border: 'none', borderRadius: 0 }} />)}
            </div>
          ) : visible.length === 0 ? (
            <div className="dsh-acc-tlist" style={{ flex: 1, minHeight: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 32, fontSize: 12, color: 'var(--dsw-alias-label-tertiary)' }}>
              {q !== '' ? '没有匹配的供应商' : '暂无可展示的余额/订阅数据'}
            </div>
          ) : (
            <div className="dsh-acc-tlist" style={{ flex: 1, minHeight: 0, overflow: 'auto' }}>
              <div className="dsh-acc-thead" style={{ position: 'sticky', top: 0, zIndex: 1, background: 'var(--dsw-alias-bg-layer-2)' }}>
                <span>供应商</span>
                <span>状态</span>
                <span>使用情况</span>
                <span>配额类型</span>
                <span>操作</span>
              </div>
              {visible.map((p, i) => {
                const acc = accounts[p.id] ?? null
                const wins = acc?.windows ?? []
                const hasWindows = wins.length > 0
                const meta = statusMeta(p)
                const usage = rowUsage(p)
                const qtype = quotaType(p)
                const plan = planMeta(p)
                const selected = selectedId === p.id && !drawerClosing
                const needsCredential = p.status === 'unauthorized' || p.status === 'not-configured'
                const color = palette[indexOf(p.id) % palette.length]
                return (
                  <div
                    key={p.id}
                    className="dsh-acc-trow"
                    data-selected={selected}
                    style={{ gridTemplateColumns: COL, animationDelay: `${Math.min(i * 26, 260)}ms` }}
                    role="button" tabIndex={0}
                    onClick={() => { toggleSelect(p.id) }}
                    onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleSelect(p.id) } }}
                  >
                    {/* 供应商 */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
                      <LogoMark name={p.displayName} color={color} />
                      <div style={{ minWidth: 0, display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: 13, fontWeight: 600, color: 'var(--dsw-alias-label-primary)' }}>{p.displayName}</span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 6, minWidth: 0, overflow: 'hidden' }}>
                          {hasWindows && <span className="dsh-acc-chip" style={{ color: 'var(--dsw-alias-state-business-primary)', background: kpiTone('var(--dsw-alias-state-business-primary)', 12) }}>积分池</span>}
                          {plan !== null && <span style={{ fontSize: 11, color: 'var(--dsw-alias-label-tertiary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{plan}</span>}
                        </span>
                      </div>
                    </div>
                    {/* 状态 */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, minWidth: 0 }}>
                      <span className="dsh-acc-dot" data-critical={p.status === 'critical'} style={{ background: meta.color, color: meta.color }} />
                      <span style={{ fontSize: 12, color: 'var(--dsw-alias-label-secondary)', whiteSpace: 'nowrap' }}>{meta.label}</span>
                    </div>
                    {/* 使用情况 */}
                    <div style={{ minWidth: 0, display: 'flex', flexDirection: 'column', gap: 3 }}>
                      {usage === null ? (
                        <>
                          <span style={{ fontSize: 12, color: 'var(--dsw-alias-label-secondary)' }}>—</span>
                          <span style={{ fontSize: 11, color: 'var(--dsw-alias-label-tertiary)' }}>暂无方案</span>
                        </>
                      ) : (
                        <>
                          <span style={{ display: 'flex', alignItems: 'baseline', gap: 6, minWidth: 0 }}>
                            <span style={{ fontSize: 12, fontWeight: 600, fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace', color: 'var(--dsw-alias-label-primary)' }}>{usage.pct}%</span>
                            {usage.text !== null && <span style={{ fontSize: 11, color: 'var(--dsw-alias-label-tertiary)', fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{usage.text}</span>}
                          </span>
                          <div style={{ width: 96, flex: 'none' }}><ProgressBar percent={usage.pct} height={5} /></div>
                        </>
                      )}
                    </div>
                    {/* 配额类型 */}
                    <span style={{ fontSize: 12, color: 'var(--dsw-alias-label-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {qtype ?? '—'}
                    </span>
                    {/* 操作 */}
                    <div style={{ display: 'flex', justifyContent: 'flex-end', minWidth: 0 }}>
                      {hasWindows ? (
                        <span style={{ display: 'flex', alignItems: 'center', color: selected ? 'var(--dsw-alias-state-business-primary)' : 'var(--dsw-alias-label-tertiary)', transition: 'color 180ms cubic-bezier(0.2, 0.8, 0.2, 1)' }}>
                          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true" style={{ transform: selected ? 'rotate(90deg)' : undefined, transition: 'transform 200ms cubic-bezier(0.2, 0.8, 0.2, 1)' }}>
                            <path d="M6 3.5 10.5 8 6 12.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </span>
                      ) : needsCredential ? (
                        <button
                          type="button" onClick={e => { e.stopPropagation(); setCredentialFor(p.id) }}
                          style={{ border: '1px solid var(--dsw-alias-border-l1)', background: 'transparent', color: 'var(--dsw-alias-label-secondary)', fontSize: 12, padding: '4px 10px', borderRadius: 8, cursor: 'pointer', transition: 'color 160ms cubic-bezier(0.2, 0.8, 0.2, 1), border-color 160ms cubic-bezier(0.2, 0.8, 0.2, 1)' }}
                        >
                          立即配置
                        </button>
                      ) : (
                        <button
                          type="button" onClick={e => { e.stopPropagation(); select(p.id) }}
                          style={{ border: '1px solid var(--dsw-alias-border-l1)', background: 'transparent', color: 'var(--dsw-alias-label-secondary)', fontSize: 12, padding: '4px 10px', borderRadius: 8, cursor: 'pointer', transition: 'color 160ms cubic-bezier(0.2, 0.8, 0.2, 1), border-color 160ms cubic-bezier(0.2, 0.8, 0.2, 1)' }}
                        >
                          添加方案
                        </button>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {drawer}
      </div>

      {credentialFor !== null && (
        <CredentialModal
          providerName={providers.find(p => p.id === credentialFor)?.displayName ?? credentialFor}
          onClose={() => setCredentialFor(null)}
          onSave={saveCredential}
        />
      )}
    </div>
  )
}
