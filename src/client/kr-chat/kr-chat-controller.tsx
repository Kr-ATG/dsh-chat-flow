/**
 * dsh-chat-flow — KR 对话系统控制器（kr-chat-controller）。
 *
 * 核心职能：
 * 1. 顶栏三标签：在 header [role="tablist"] 注入 [ KR对话 ]，与官方 [ 对话 ] [ 轨迹 ] 齐平；
 * 2. 默认进入 KR 分类：开箱即为 KR 对话，保持官方底层 chat 视图，确保多轮历史与输入框完整；
 * 3. 双栏大盘：在 [data-conversation-content] 渲染右侧可收起的大盘 KrAgentPanel；
 * 4. 右侧收起/展开：收起后左侧填满，并浮现微型胶囊方便随时展开；
 * 5. 视图联动：点击 [ 对话 ] 切回标准单栏；点击 [ 轨迹 ] 切到原生轨迹；点击 [ KR对话 ] 恢复双栏大盘。
 */

import { useEffect, useState, useSyncExternalStore } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { getKrChatStore } from './kr-chat-store.ts'
import { KrAgentPanel } from './KrAgentPanel.tsx'
import { activityStore } from '../tool-summary/activity-drawer.tsx'
import { latestChatSnapshot, latestChatSessionId, clearLatestChatSnapshot, subscribeLatestChatSnapshot } from '../tool-summary/TurnProcessShadowView.tsx'

let isSwitchingToKr = false

/**
 * 当前会话的最新轮次号。
 *
 * 空白新会话没有任何 navigation 条目，此时返回 1（面板随即走空态），
 * 绝不能沿用上一会话遗留的轮次号。数据源优先取实时快照，其次 DOM。
 */
function resolveLatestTurn(): number {
  const snap = latestChatSnapshot || (typeof window !== 'undefined' ? (window as any).__dshLatestChatSnapshot__ : null)
  const snapTurns = snap?.navigation?.current?.map((n: any) => n.turn).filter((n: any) => typeof n === 'number' && n > 0) || []
  if (snapTurns.length > 0) return Math.max(...snapTurns)
  const domTurns = typeof document !== 'undefined'
    ? Array.from(document.querySelectorAll('[data-chat-turn]'))
      .map(el => parseInt(el.getAttribute('data-chat-turn') || '0', 10))
      .filter(n => Number.isFinite(n) && n > 0)
    : []
  return domTurns.length > 0 ? Math.max(...domTurns) : 1
}

/** 同步顶部 Tab 按钮（纯 DOM 级稳定注入，与官方原生按钮像素级对齐） */
function syncKrTab(tablist: HTMLElement): void {
  const store = getKrChatStore()
  const isKr = store.snapshot.activeTab === 'kr'
  let btn = document.getElementById('kr-chat-tab-btn') as HTMLButtonElement | null

  // 动态提取原生按钮的基础类名（如 wSkVaW_tab），保证 100% 继承官方排版基线
  const chatBtn = Array.from(tablist.querySelectorAll<HTMLButtonElement>('button[role="tab"]')).find((b) => b.id !== 'kr-chat-tab-btn')
  const siblingClass = chatBtn?.className || ''
  const baseClass = siblingClass.split(' ').find((c) => c.includes('tab') && !c.includes('Active')) || 'wSkVaW_tab'
  const activeClass = 'wSkVaW_tabActive'

  if (!btn || !btn.isConnected || btn.parentElement !== tablist) {
    if (btn) {
      try { btn.remove() } catch {}
    }
    btn = document.createElement('button')
    btn.type = 'button'
    btn.role = 'tab'
    btn.id = 'kr-chat-tab-btn'
    btn.textContent = 'KR对话'
    btn.onclick = (e) => {
      e.stopPropagation()
      isSwitchingToKr = true
      try {
        store.setActiveTab('kr')
        // 仅当当前处于原生“轨迹”视图时，才需要触发原生“对话”按钮切回底层 chat 流
        const trajectoryBtn = Array.from(tablist.querySelectorAll<HTMLButtonElement>('button[role="tab"]'))
          .find(b => b.id !== 'kr-chat-tab-btn' && b.textContent?.trim().includes('轨迹'))
        const isTrajectoryActive = trajectoryBtn?.getAttribute('aria-selected') === 'true'
          || trajectoryBtn?.className.includes('Active')
        if (isTrajectoryActive) {
          const chatBtn = Array.from(tablist.querySelectorAll<HTMLButtonElement>('button[role="tab"]'))
            .find(b => b.id !== 'kr-chat-tab-btn' && b.textContent?.trim().includes('对话'))
          chatBtn?.click()
        }
      } finally {
        setTimeout(() => { isSwitchingToKr = false }, 100)
      }
      syncKrTab(tablist)
    }
    tablist.insertBefore(btn, tablist.firstChild)
  }

  btn.className = isKr ? `${baseClass} ${activeClass} kr-tab-btn kr-tab-btn--active` : `${baseClass} kr-tab-btn`
  btn.setAttribute('aria-selected', isKr ? 'true' : 'false')

  // 当处于 KR 模式时，原生“对话”按钮不显示激活线；切回对话时恢复
  if (chatBtn && chatBtn.textContent?.trim().includes('对话')) {
    if (isKr) {
      chatBtn.classList.remove(activeClass)
      chatBtn.setAttribute('aria-selected', 'false')
    } else if (store.snapshot.activeTab === 'chat') {
      chatBtn.classList.add(activeClass)
      chatBtn.setAttribute('aria-selected', 'true')
    }
  }
}

/** KR 对话右侧大盘与展开胶囊 React 根组件 */
export function KrPanelSystem() {
  const store = getKrChatStore()
  const krState = useSyncExternalStore(
    (cb) => store.subscribe(cb),
    () => store.snapshot,
  )

  const [, setActTick] = useState(0)
  useEffect(() => {
    return activityStore().subscribe(() => setActTick((t) => t + 1))
  }, [])

  const [, setSnapTick] = useState(0)
  useEffect(() => {
    return subscribeLatestChatSnapshot(() => setSnapTick((t) => t + 1))
  }, [])

  // 是否已绑定到真实会话。
  //
  // 「新建会话首页」（尚未创建会话）时 input.dock 座位不渲染，会话 id 为 null，
  // 大盘整体不出现；一旦进入某个会话（哪怕是还没发消息的空白新会话），
  // 会话 id 就会登记上来，此时渲染大盘并显示干净空态 —— 因此判据不能再用
  // 「有没有 tablist / 有没有对话轮次」：空白新会话里 tablist 与轮次都不存在，
  // 那正是本次要修的场景。
  const hasBoundSession = latestChatSessionId !== null
    || (typeof document !== 'undefined' && Boolean(
      document.querySelector('header [role="tablist"]') ||
      document.querySelectorAll('[data-chat-turn]').length > 0
    ))

  if (krState.activeTab !== 'kr' || !hasBoundSession) {
    return null
  }

  // 最新轮次：空白新会话没有 navigation 条目，按 1 处理（面板会走空态）。
  const latestTurn = Math.max(1, resolveLatestTurn())

  const isRunning = typeof document !== 'undefined' && Boolean(
    document.querySelector('.kr-flow-executing-card') ||
    document.querySelector('[data-turn-process] [data-running="true"]') ||
    document.querySelector('.dtt__assistant[data-running="true"]')
  )

  if (krState.panelOpen) {
    return (
      <KrAgentPanel
        latestTurn={latestTurn}
        isTurnRunning={isRunning}
        onCollapse={() => store.setPanelOpen(false)}
      />
    )
  }

  return (
    <button
      type="button"
      className="kr-expand-capsule"
      onClick={() => store.setPanelOpen(true)}
      title="展开 Agent 实时轨迹大盘"
    >
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.38-1 1.72V7h4a3 3 0 0 1 3 3v8a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3v-8a3 3 0 0 1 3-3h4V5.72A2 2 0 0 1 10 4a2 2 0 0 1 2-2zm-5 7a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1v-8a1 1 0 0 0-1-1H7zm2 3a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3zm6 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3z"/>
      </svg>
      <span>Agent 轨迹大盘</span>
    </button>
  )
}

let mounted = false
let panelRoot: Root | null = null
let currentContainer: HTMLElement | null = null
/** 上次已交给 React 根渲染的会话 id，用于会话切换时强制整树刷新。 */
let lastRenderedSessionId: string | null | undefined = undefined

export function mountKrChatController(): void {
  if (mounted || typeof document === 'undefined') return
  mounted = true

  const store = getKrChatStore()
  store.setActiveTab('kr')

  // 全局事件委托：监听原生「对话」与「轨迹」按钮的点击事件，同步 activeTab 状态
  document.addEventListener('click', (e: MouseEvent) => {
    if (isSwitchingToKr || !e.isTrusted) return
    const target = (e.target as HTMLElement)?.closest<HTMLButtonElement>('header [role="tablist"] button[role="tab"]')
    if (!target || target.id === 'kr-chat-tab-btn') return

    const text = target.textContent?.trim() || ''
    if (text.includes('轨迹')) {
      store.setActiveTab('trajectory')
    } else if (text.includes('对话')) {
      store.setActiveTab('chat')
    }

    const tablist = document.querySelector<HTMLElement>('header [role="tablist"]')
    if (tablist) syncKrTab(tablist)
  }, true)

  // 监听侧边栏「新会话」点击：立即清掉当前大盘（不等新会话数据到位），
  // 随后再同步 DOM，保证点下的一瞬间右侧就已清空。
  document.addEventListener('click', (e: MouseEvent) => {
    const target = e.target as HTMLElement | null
    if (!target) return
    const btn = target.closest('button, div, span, a')
    if (btn && btn.textContent?.trim() === '新会话') {
      try { clearLatestChatSnapshot() } catch {}
      setTimeout(syncDom, 0)
      setTimeout(syncDom, 50)
      setTimeout(syncDom, 200)
    }
  }, true)

  window.addEventListener('popstate', () => {
    setTimeout(syncDom, 50)
  })

  // 监听对话流区域内的点击：点击任意对话内容（用户提问、AI回复、思考卡等），
  // 右侧大盘立即联动切换展示该对话轮次的执行大盘与指标
  document.addEventListener('click', (e: MouseEvent) => {
    const state = store.snapshot
    if (state.activeTab !== 'kr') return

    const target = e.target as HTMLElement | null
    if (!target) return

    // 如果用户正在选中文本（例如正在进行复制操作），不拦截触发切换
    const sel = window.getSelection()
    if (sel && sel.toString().trim().length > 0) {
      return
    }

    // 忽略右侧大盘内部、顶栏导航、模态弹窗以及可交互控件（按钮、超链接、输入框、下拉菜单等）
    if (target.closest('#dsh-kr-panel-container, header, button, a, input, textarea, select, [role="button"], [role="menuitem"], .tsh-panel, .tsh-mask')) {
      return
    }

    // 向上查找所属的对话轮次
    const turnEl = target.closest<HTMLElement>('[data-conversation-scroll] [data-chat-turn], [data-conversation-scroll] [data-turn-tail]')
    if (!turnEl) return

    const rawTurn = turnEl.getAttribute('data-chat-turn') || turnEl.getAttribute('data-turn-tail')
    if (!rawTurn) return

    const turn = parseInt(rawTurn, 10)
    if (Number.isFinite(turn) && turn > 0) {
      store.setSelectedTurn(turn)
      store.setPanelOpen(true)
    }
  }, true)

  const syncDom = () => {
    const tablist = document.querySelector<HTMLElement>('header [role="tablist"]')
    const turns = document.querySelectorAll('[data-chat-turn]')
    // 与 KrPanelSystem 同口径：会话 id 已登记即视为绑定了真实会话
    // （空白新会话没有 tablist、也没有轮次，但会话 id 存在）。
    const hasActiveChat = latestChatSessionId !== null || Boolean(tablist || turns.length > 0)

    // 1. 同步顶部 Tab 按钮
    if (tablist) {
      syncKrTab(tablist)
    }

    const isKr = store.snapshot.activeTab === 'kr' && hasActiveChat

    if (isKr) {
      document.body.setAttribute('data-dsh-kr-chat', 'true')
    } else {
      document.body.removeAttribute('data-dsh-kr-chat')
    }

    // 若当前脱离了会话（如回到新会话页），重置已选轮次
    if (!hasActiveChat && store.snapshot.selectedTurn !== null) {
      store.setSelectedTurn(null)
    }

    // 2. 同步左侧当前选中的对话轮次高亮视觉
    const selectedTurn = store.snapshot.selectedTurn
    const activeClass = 'kr-turn-selected'
    document.querySelectorAll(`.${activeClass}`).forEach(el => {
      if (!isKr || el.getAttribute('data-chat-turn') !== String(selectedTurn)) {
        el.classList.remove(activeClass)
      }
    })
    if (isKr && selectedTurn !== null && selectedTurn > 0) {
      document.querySelectorAll(`[data-chat-turn="${selectedTurn}"]`).forEach(el => {
        if (!el.classList.contains(activeClass)) {
          el.classList.add(activeClass)
        }
      })
    }

    // 3. 同步右侧大盘容器
    const content = document.querySelector<HTMLElement>('[data-conversation-content]')
    if (!content) return

    let container = document.getElementById('dsh-kr-panel-container')
    if (!hasActiveChat) {
      if (container) {
        container.style.display = 'none'
      }
      return
    }

    // 会话身份变化时，令常驻的 React 根重新读取会话状态。
    // 否则空白新会话期间大盘由上一会话的渲染结果继续挂在屏幕上。
    if (lastRenderedSessionId !== latestChatSessionId) {
      lastRenderedSessionId = latestChatSessionId
      if (panelRoot) {
        panelRoot.render(<KrPanelSystem />)
      }
    }

    if (!container || !container.isConnected || container.parentElement !== content) {
      if (container) {
        try { container.remove() } catch {}
      }
      container = document.createElement('div')
      container.id = 'dsh-kr-panel-container'
      container.style.display = 'contents'
      content.appendChild(container)

      if (panelRoot) {
        try { panelRoot.unmount() } catch {}
        panelRoot = null
      }
    } else {
      container.style.display = 'contents'
    }

    if (!panelRoot && container) {
      panelRoot = createRoot(container)
      panelRoot.render(<KrPanelSystem />)
      currentContainer = container
    }
  }

  syncDom()
  setInterval(syncDom, 250)
}
