/**
 * AccountDrawer — 余额/配额页右侧供应商详情抽屉（仅展示积分池配额内容）。
 *
 * 按用户要求「点击出来只显示这些内容」：不再渲染头部/状态行/模型使用/最近
 * 活动/管理操作，只保留配额主体——积分池面板（PoolQuotaPanel，隐藏规则
 * 折叠）或订阅窗口行；无窗口时给一行「暂无方案信息」。收起交互：再次点击
 * 选中行即可（由 AccountsTab toggle 处理）。
 */

import { useEffect, useState } from 'react'
import type { AccountSnapshot } from '../api'
import { PoolQuotaPanel } from './PoolQuotaPanel'
import { QuotaWindowRow } from './QuotaWindowRow'
import { ensureAccountsStyles } from './accounts-sheet'

export interface AccountDrawerProps {
  account: AccountSnapshot | null
  closing: boolean
}

export function AccountDrawer({ account, closing }: AccountDrawerProps): JSX.Element {
  const [mounted, setMounted] = useState(false)
  useEffect(() => { ensureAccountsStyles() }, [])
  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true))
    return () => cancelAnimationFrame(id)
  }, [])

  const windows = account?.windows ?? []
  const isPool = windows.length > 0 && windows.some(w => w.poolType !== undefined)

  return (
    <div className="dsh-acc-drawer-wrap" data-closing={closing}>
      <aside className="dsh-acc-drawer" data-closing={closing} aria-label="供应商配额详情">
        <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: 16 }}>
          {!mounted || account === null ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[0, 1].map(i => <div key={i} className="dsh-acc-skel" style={{ height: 96 }} />)}
            </div>
          ) : isPool ? (
            <PoolQuotaPanel windows={windows} plan={account.plan} showRules={false} />
          ) : windows.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {windows.map((w, wi) => <QuotaWindowRow key={w.kind} window={w} delay={wi * 60} active={mounted} />)}
            </div>
          ) : (
            <div style={{ fontSize: 12, lineHeight: '20px', color: 'var(--dsw-alias-label-tertiary)' }}>暂无方案信息</div>
          )}
        </div>
      </aside>
    </div>
  )
}
