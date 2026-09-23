/**
 * dsh-chat-plus — KR 对话双栏主视图（KrChatView）。
 *
 * 架构：
 * 1. 左栏：直接挂载原生 ChatView（包含完整的历史消息流、虚拟滚动、Markdown 渲染与底部输入框），
 *    在 KR 模式下通过卡片化呈现去除旧折叠条；
 * 2. 右栏：全高 Agent 实时执行轨迹大盘（KrAgentPanel），通过 Portal 挂载在外层 content 容器，与左侧滚动区并列形成双栏；
 * 3. 收起交互：点击顶部 × 收起右栏，左栏自适应充满 100%，右上角浮现微型展开胶囊，点击即可一键滑出大盘。
 */
import { memo, useEffect, useMemo, useState, useSyncExternalStore } from 'react'
import { createPortal } from 'react-dom'
import { getKrChatStore } from './kr-chat-store.ts'
import { KrAgentPanel } from './KrAgentPanel.tsx'
import { injectKrStyles } from './styles.ts'

export const KrChatView = memo(function KrChatView({
  OriginalChatView,
  ...props
}: any) {
  // 注入 KR 对话样式
  useEffect(() => {
    injectKrStyles()
  }, [])

  const store = getKrChatStore()
  const krState = useSyncExternalStore(
    (cb) => store.subscribe(cb),
    () => store.snapshot,
  )

  // 监听当前会话的最新轮次和运行状态
  const useSession = props.useSession
  const useChat = props.useChat
  const sessionRunning = useSession ? useSession((s: any) => s.running) : false

  // 从 timeline 或 locations 中推导当前最新轮次
  const latestTurn = useChat
    ? useChat((snapshot: any) => {
        const items = snapshot?.navigation?.items?.()
        if (items && items.length > 0) {
          return items[items.length - 1].turn
        }
        return 1
      })
    : 1

  // 标记当前处于 KR 对话视图中，供子组件和样式做针对性优化
  useEffect(() => {
    document.body.setAttribute('data-dsh-kr-chat', 'true')
    return () => {
      document.body.removeAttribute('data-dsh-kr-chat')
    }
  }, [])

  // 挂载右栏大盘的目标宿主：优先挂载在 [data-conversation-content]
  const [contentContainer, setContentContainer] = useState<HTMLElement | null>(null)
  useEffect(() => {
    const el = document.querySelector('[data-conversation-content]') as HTMLElement | null
    if (el) {
      setContentContainer(el)
    } else {
      // 延迟重试以防初次挂载时 DOM 尚未准备好
      const timer = setTimeout(() => {
        const lateEl = document.querySelector('[data-conversation-content]') as HTMLElement | null
        if (lateEl) setContentContainer(lateEl)
      }, 50)
      return () => clearTimeout(timer)
    }
  }, [])

  // 渲染原生聊天内容
  const chatNode = OriginalChatView ? <OriginalChatView {...props} /> : null

  // 右侧大盘组件树
  const rightSideNode = krState.panelOpen ? (
    <KrAgentPanel
      latestTurn={latestTurn}
      isTurnRunning={sessionRunning}
      onCollapse={() => store.setPanelOpen(false)}
    />
  ) : (
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

  return (
    <>
      {/* 左侧消息流：直接渲染官方完整 ChatView，拥有全部多轮历史与输入框 */}
      {chatNode}

      {/* 右侧面板：Portal 挂在 [data-conversation-content] 作为平级栏目 */}
      {contentContainer ? createPortal(rightSideNode, contentContainer) : rightSideNode}
    </>
  )
})
