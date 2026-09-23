import { useEffect, useState, type CSSProperties } from 'react'
import { usageApi, type AccountSnapshot, type ProviderInfo } from '../api'
import { relativeTime } from '../format'
import { alertColor } from '../theme'
import { QuotaWindowRow } from './QuotaWindowRow'
import { PoolQuotaPanel } from './PoolQuotaPanel'
import { WarnIcon } from '../hub'

/**
 * 供应商余额/订阅卡片（网格布局，替代官方列表行）。
 * 头部：状态点（辉光，critical 脉冲）+ 名称 + 模式徽标 + 告警徽标 + 更新时间 + 单卡刷新；
 * 正文：余额 / 订阅窗口 / SenseNova 积分池面板 / 配置凭据 / 错误重试。
 */

const nameStyle: CSSProperties = {
  fontWeight: 600, color: 'var(--dsw-alias-label-primary)', fontSize: 13,
  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', minWidth: 0,
}

const modeTagStyle: CSSProperties = {
  fontSize: 11, color: 'var(--dsw-alias-label-secondary)',
  background: 'var(--dsw-alias-interactive-bg-hover)',
  borderRadius: 6, padding: '1px 7px', flex: 'none',
}

const alertStyle = (level: 'critical' | 'warning'): CSSProperties => ({
  fontSize: 11, fontWeight: 500, padding: '1px 8px', borderRadius: 6, flex: 'none',
  background: level === 'critical'
    ? 'color-mix(in srgb, var(--dsw-alias-state-error-primary) 14%, transparent)'
    : 'color-mix(in srgb, var(--dsw-alias-state-warn-primary) 14%, transparent)',
  color: alertColor(level),
})

const iconButtonStyle: CSSProperties = {
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  width: 24, height: 24, borderRadius: 7, flex: 'none',
  border: '1px solid var(--dsw-alias-border-l2)', background: 'transparent',
  color: 'var(--dsw-alias-label-secondary)', cursor: 'pointer',
  transition: 'color .18s cubic-bezier(.2,.8,.2,1), border-color .18s cubic-bezier(.2,.8,.2,1)',
}

export interface ProviderGroupProps {
  provider: ProviderInfo
  onRequireCredential: (id: string) => void
  refreshKey: number
  /** 卡片序号：决定入场错峰延迟。 */
  index: number
}

export function ProviderGroup({ provider, onRequireCredential, refreshKey, index }: ProviderGroupProps): JSX.Element {
  const [account, setAccount] = useState<AccountSnapshot | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const load = (refresh = false): void => {
    setLoading(true); setError(null)
    usageApi.account(provider.id, refresh).then(p => {
      if (p.ok) setAccount(p.account); else setError(p.message ?? '获取失败')
    }).catch((e: unknown) => setError(e instanceof Error ? e.message : String(e)))
      .finally(() => setLoading(false))
  }
  useEffect(() => { load() }, [provider.id, refreshKey]) // eslint-disable-line react-hooks/exhaustive-deps

  const level = account?.alert?.level ?? provider.alert?.level ?? 'unknown'
  const statusColor = provider.status === 'ok' ? 'var(--dsw-alias-state-success-primary)'
    : provider.status === 'critical' ? 'var(--dsw-alias-state-error-primary)'
    : provider.status === 'warning' ? 'var(--dsw-alias-state-warn-primary)'
    : 'var(--dsw-alias-label-tertiary)'

  const needsCredential = provider.status === 'unauthorized' || provider.status === 'not-configured'
  const plan = account?.plan
  const hasPlan = typeof plan === 'string' && plan.trim() !== '' && plan.trim() !== '—' && plan.trim() !== '-'
  const hasWindows = (account?.windows?.length ?? 0) > 0
  const hasAlert = level === 'critical' || level === 'warning'
  const isPoolQuota = hasWindows && (account?.windows?.some(w => w.poolType !== undefined) ?? false)

  return (
    <div className="dsh-acc-card" style={{ animationDelay: `${index * 60}ms` }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0, marginBottom: 10 }}>
        <span
          className="dsh-acc-dot"
          data-critical={provider.status === 'critical'}
          style={{ background: statusColor, color: statusColor }}
        />
        <span style={nameStyle}>{provider.displayName}</span>
        {provider.accountMode !== null && <span style={modeTagStyle}>{isPoolQuota ? '积分制' : provider.accountMode === 'subscription' ? '订阅' : '余额'}</span>}
        {hasPlan && !isPoolQuota && <span style={modeTagStyle}>{plan}</span>}
        <span style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8, flex: 'none' }}>
          {!needsCredential && account !== null && (
            <span style={{ fontSize: 11, color: 'var(--dsw-alias-label-tertiary)', whiteSpace: 'nowrap' }}>
              {relativeTime(account.fetchedAt)}
            </span>
          )}
          {!needsCredential && (
            <button type="button" aria-label="刷新" onClick={() => load(true)} style={iconButtonStyle}>
              <svg width="12" height="12" viewBox="0 0 16 16" fill="none" aria-hidden>
                <path d="M13.5 8a5.5 5.5 0 1 1-1.6-3.9M13.5 1.8v3.2h-3.2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          )}
        </span>
      </div>

      {hasAlert && (
        <div style={{ marginBottom: 10 }}>
          <span style={{ ...alertStyle(level as 'critical' | 'warning'), display: 'inline-flex', alignItems: 'center', gap: 5 }}>
            <WarnIcon size={11} /> 剩余 {account?.alert?.value ?? provider.alert?.value ?? 0}%
          </span>
        </div>
      )}

      <div style={{ minWidth: 0 }}>
        {needsCredential ? (
          <button type="button" onClick={() => onRequireCredential(provider.id)}
            style={{
              width: '100%', padding: '7px 12px', fontSize: 12, borderRadius: 8, cursor: 'pointer',
              border: '1px dashed var(--dsw-alias-border-l2)',
              background: 'var(--dsw-alias-interactive-bg-hover)',
              color: 'var(--dsw-alias-label-secondary)',
              transition: 'color .18s cubic-bezier(.2,.8,.2,1), border-color .18s cubic-bezier(.2,.8,.2,1)',
            }}>
            配置凭据
          </button>
        ) : loading ? (
          <div style={{ height: 5, borderRadius: 3, background: 'var(--dsw-alias-border-l2)', overflow: 'hidden', maxWidth: 480 }}>
            <div style={{ width: '40%', height: '100%', background: 'var(--dsw-alias-border-l1)', animation: 'pulse 1.2s infinite' }} />
          </div>
        ) : error ? (
          <div style={{ fontSize: 12, color: 'var(--dsw-alias-state-error-primary)', display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', minWidth: 0 }}>{error}</span>
            <button type="button" onClick={() => load(true)}
              style={{ border: 'none', background: 'transparent', color: 'var(--dsw-alias-state-error-primary)', cursor: 'pointer', fontSize: 12, flex: 'none' }}>
              重试
            </button>
          </div>
        ) : account === null ? (
          <div style={{ fontSize: 12, color: 'var(--dsw-alias-label-tertiary)' }}>等待首次获取</div>
        ) : isPoolQuota ? (
          <PoolQuotaPanel windows={account.windows!} plan={account.plan} />
        ) : hasWindows ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxWidth: 560 }}>
            {account.windows!.map((w, wi) => (
              <QuotaWindowRow key={w.kind} window={w} delay={wi * 60} />
            ))}
          </div>
        ) : (
          <div style={{ fontSize: 12, color: 'var(--dsw-alias-label-secondary)', display: 'flex', alignItems: 'baseline', gap: 4, minWidth: 0 }}>
            {hasPlan ? (
              <>
                <span style={{ color: 'var(--dsw-alias-label-tertiary)', flex: 'none' }}>方案</span>
                <span style={{ color: 'var(--dsw-alias-label-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{plan}</span>
              </>
            ) : (
              <span style={{ color: 'var(--dsw-alias-label-tertiary)' }}>暂无方案信息</span>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
