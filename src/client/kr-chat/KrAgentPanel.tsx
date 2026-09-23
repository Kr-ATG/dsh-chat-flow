/**
 * dsh-chat-plus — KR 对话右侧 Agent 实时执行与轨迹大盘。
 */
import { memo, useCallback, useEffect, useMemo, useState, useSyncExternalStore } from 'react'
import type { ChatNode } from '@deepseek-ai/dsh-client-ui-chat/client'
import { activityStore } from '../tool-summary/activity-drawer.tsx'
import { latestChatSnapshot, latestChatSessionId, collectTurnNodes, subscribeLatestChatSnapshot } from '../tool-summary/TurnProcessShadowView.tsx'
import { callDurationMs, callName, computeStats, formatDuration, isRunning } from '../tool-summary/tool-stats.ts'
import { rowTitle, toolArgsRaw, argFields, resultParagraphs, rawResultJson, executionFacts } from '../tool-summary/activity-view-model.ts'
import { useNow } from '../tool-summary/use-now.ts'
import { getKrChatStore } from './kr-chat-store.ts'
import { KrTaskOverviewCard, type DshTaskItem } from './KrTaskOverviewCard.tsx'
import { KrReasoningCard } from './KrReasoningCard.tsx'
import { KrToolCallsCard, type ToolCallItemView } from './KrToolCallsCard.tsx'
import { ShotPanel } from '../shot/Panel.tsx'
import { collectMessages, deriveCurrentDialogueTitle, type ShotRange, type ShotMessage } from '../shot/collect.ts'
import { useModalClose } from '../modal-animation.ts'
import { getLiveDshTodos, subscribeLiveDshTodos } from './kr-todo-bridge.ts'

export interface KrAgentPanelProps {
  readonly latestTurn: number
  readonly isTurnRunning: boolean
  readonly onCollapse: () => void
}

export const KrAgentPanel = memo(function KrAgentPanel({
  latestTurn,
  isTurnRunning,
  onCollapse,
}: KrAgentPanelProps) {
  const store = getKrChatStore()
  const krState = useSyncExternalStore(
    (cb) => store.subscribe(cb),
    () => store.snapshot,
  )

  // 监听快照更新（实时响应新提问、流式输出与会话切换）
  const [snapTick, setSnapTick] = useState(0)
  useEffect(() => {
    return subscribeLatestChatSnapshot(() => setSnapTick((t) => t + 1))
  }, [])

  // 动态计算当前会话真实的最新轮次（以会话快照与 DOM 节点为准，绝不被历史缓存干扰）
  const snapshot = latestChatSnapshot || (typeof window !== 'undefined' ? (window as any).__dshLatestChatSnapshot__ : null)
  const snapTurns = snapshot?.navigation?.current?.map((n: any) => n.turn).filter((n: any) => typeof n === 'number' && n > 0) || []
  const domTurns = typeof document !== 'undefined'
    ? Array.from(document.querySelectorAll('[data-chat-turn]')).map(el => parseInt(el.getAttribute('data-chat-turn') || '0', 10)).filter(n => Number.isFinite(n) && n > 0)
    : []
  const effectiveLatestTurn = snapTurns.length > 0
    ? Math.max(...snapTurns)
    : (domTurns.length > 0 ? Math.max(...domTurns) : (latestTurn > 0 ? latestTurn : 1))

  // 若选中的轮次超出当前会话最大轮次（如切到只有1轮的新会话），立即自动解除越界选中
  const validSelectedTurn = (krState.selectedTurn !== null && krState.selectedTurn <= effectiveLatestTurn)
    ? krState.selectedTurn
    : null

  useEffect(() => {
    if (krState.selectedTurn !== null && krState.selectedTurn > effectiveLatestTurn) {
      store.setSelectedTurn(null)
    }
  }, [krState.selectedTurn, effectiveLatestTurn, store])

  // 决定当前展示哪个轮次：若用户点击了历史轮次则显示历史轮次，否则跟随最新轮次
  const displayTurn = validSelectedTurn ?? effectiveLatestTurn
  const isViewingHistory = validSelectedTurn !== null && validSelectedTurn !== effectiveLatestTurn
  const currentRunning = isTurnRunning && !isViewingHistory

  // 监听活动总线数据
  const actStore = activityStore()
  const [actTick, setActTick] = useState(0)
  useEffect(() => {
    return actStore.subscribe(() => setActTick((t) => t + 1))
  }, [actStore])

  // 监听官方 todos 实时投影更新
  const [todoTick, setTodoTick] = useState(0)
  useEffect(() => {
    return subscribeLiveDshTodos(() => setTodoTick((t) => t + 1))
  }, [])

  // 数据源：优先从 latestChatSnapshot 实时提取，回退到 actStore.get
  const turnData = useMemo(() => {
    const snap = latestChatSnapshot || (typeof window !== 'undefined' ? (window as any).__dshLatestChatSnapshot__ : null)
    if (snap) {
      try {
        const collected = collectTurnNodes(snap, displayTurn)
        return {
          tools: collected.tools,
          reasoning: collected.reasoning,
          tasks: collected.tasks,
          turnStart: collected.turnStart,
          turnEnd: collected.turnEnd,
          durationMs: collected.durationMs,
        }
      } catch (err) {
        console.warn('[kr-agent-panel] collectTurnNodes error', err)
      }
    }
    return actStore.get(displayTurn)
  }, [displayTurn, actTick, snapTick])

  const now = useNow(isTurnRunning && !isViewingHistory)

  // 思考文本提取
  const reasoningTexts = useMemo<readonly string[]>(() => {
    return (turnData?.reasoning ?? []).map((r) => r.text).filter((t) => t.trim() !== '')
  }, [turnData, actTick, snapTick])

  // 工具调用数据转换
  const tools = useMemo<readonly ChatNode<'tool-call'>[]>(() => {
    return turnData?.tools ?? []
  }, [turnData, actTick, snapTick])

  const toolNames = useMemo<readonly string[]>(() => {
    return tools.map((t) => {
      try {
        return callName(t.data.root)
      } catch {
        return 'tool'
      }
    })
  }, [tools])

  // 耗时计算：精确优先从真实轮次生命周期中获取
  const turnStart = turnData?.turnStart
  const turnEnd = turnData?.turnEnd
  let elapsedMs: number

  if (currentRunning && turnStart) {
    elapsedMs = Math.max(0, now - turnStart)
  } else if (typeof turnData?.durationMs === 'number' && turnData.durationMs > 0) {
    elapsedMs = turnData.durationMs
  } else if (typeof turnStart === 'number' && typeof turnEnd === 'number' && turnEnd >= turnStart) {
    elapsedMs = turnEnd - turnStart
  } else {
    // 兜底计算：汇总工具调用实际耗时
    let toolsDuration = 0
    for (const t of tools) {
      try {
        const d = callDurationMs(t.data.root, now)
        if (d && d > 0) toolsDuration += d
      } catch {}
    }
    elapsedMs = toolsDuration > 0 ? toolsDuration : (tools.length * 800 + 1500)
  }
  const elapsedSec = elapsedMs / 1000
  const durationText = formatDuration(elapsedMs)

  // 工具列表构建
  const toolViews: ToolCallItemView[] = tools.map((node, index) => {
    let name = 'tool'
    let title = '执行工具操作'
    let duration = '20ms'
    let status: 'success' | 'running' | 'failed' = 'success'
    let errorMsg: string | undefined
    let callId: string | undefined
    let argsRaw: string | undefined
    let args: Record<string, unknown> | undefined
    let resultText: string | undefined
    let rawJson: string | undefined
    let exitCode: number | undefined
    let signal: string | undefined

    try {
      const root = node.data.root
      callId = ('callId' in root ? (root as any).callId : undefined) || node.key
      name = callName(root)
      title = rowTitle(root)
      argsRaw = toolArgsRaw(root)
      args = argFields(argsRaw)
      resultText = resultParagraphs(root)
      rawJson = rawResultJson(root)
      const facts = executionFacts(root)
      exitCode = facts.exitCode
      signal = facts.signal

      const ms = callDurationMs(root, now)
      duration = ms !== undefined ? `${Math.round(ms)}ms` : '10ms'
      if (isRunning(root)) {
        status = 'running'
      } else {
        // 检查退出码或错误
        const r = root.result
        const isErr = root.isError || (r && (r.error || (typeof r.exitCode === 'number' && r.exitCode !== 0))) || (exitCode !== undefined && exitCode !== 0)
        if (isErr) {
          status = 'failed'
          errorMsg = typeof r?.error === 'string' ? r.error : (typeof (root as any).error === 'string' ? (root as any).error : ((root as any).error?.message || '工具执行返回非零状态或异常'))
        }
      }
    } catch {
      title = `工具调用 #${index + 1}`
    }

    return {
      id: node.key || `tool-${index}`,
      callId,
      name,
      description: title,
      durationText: duration,
      status,
      errorMessage: errorMsg,
      argsRaw,
      args,
      resultText,
      rawResultJson: rawJson,
      exitCode,
      signal,
    }
  })

  // 任务数据源提取：优先使用本轮已记录的 todo_write / submitted-plan，当前未结轮次可回退到 live todos
  const tasks = useMemo<readonly DshTaskItem[]>(() => {
    if (turnData?.tasks && turnData.tasks.length > 0) {
      return turnData.tasks
    }
    if (!isViewingHistory) {
      const live = getLiveDshTodos()
      if (live && live.length > 0) {
        return live.map((item, idx) => ({
          id: `live-${idx}`,
          content: item.content,
          status: item.status,
        }))
      }
    }
    return []
  }, [turnData, isViewingHistory, todoTick, snapTick])

  // 本轮/本会话是否已有可展示内容。新会话空白期一律走干净空态，
  // 绝不回落到 activityStore 里上一会话的缓存。
  // 回合已在执行（哪怕工具/思考尚未落盘）也算内容，避免空白新会话刚发起
  // 提问时错误地显示「等待本次对话开始」。
  const hasContent = currentRunning || tasks.length > 0 || reasoningTexts.length > 0 || tools.length > 0

  // 大盘副标题
  const subtitle = useMemo(() => {
    if (tasks.length > 0) {
      const done = tasks.filter((t) => t.status === 'completed').length
      return `${done}/${tasks.length} 项任务已完成`
    }
    if (currentRunning) return '正在执行工具调用…'
    if (tools.length > 0) return `${tools.length} 次工具调用 · 耗时 ${durationText}`
    return hasContent ? '对话已就绪' : '等待本次对话开始…'
  }, [tasks, currentRunning, tools.length, durationText, hasContent])

  // 对话截图弹窗控制
  const [shotOpen, setShotOpen] = useState(false)
  const { closing: shotClosing, requestClose: requestShotClose } = useModalClose(shotOpen, () => { setShotOpen(false) })

  // 会话切换（新建 / 切换 / 离开）时重置本面板的本地视图状态，
  // 避免「截图弹窗开着」被带到新会话。
  useEffect(() => {
    setShotOpen(false)
  }, [latestChatSessionId])

  const collectForShot = useCallback((range: ShotRange): ShotMessage[] => {
    if (!latestChatSnapshot) return []
    return collectMessages(latestChatSnapshot, displayTurn, range)
  }, [displayTurn])

  const dialogueTitle = useMemo(() => {
    const snap = latestChatSnapshot || (typeof window !== 'undefined' ? (window as any).__dshLatestChatSnapshot__ : null)
    // 1. 优先直接从官方快照的 navigation.current 提取真实提问 Prompt
    if (snap?.navigation?.current && Array.isArray(snap.navigation.current)) {
      const navItem = snap.navigation.current.find((n: any) => n.turn === displayTurn)
      if (navItem?.prompt && typeof navItem.prompt === 'string' && navItem.prompt.trim() !== '') {
        const p = navItem.prompt.trim()
        return p.length > 60 ? `${p.slice(0, 60)}…` : p
      }
    }
    // 2. 从 deriveCurrentDialogueTitle 中基于消息节点深入提取
    if (snap) {
      try {
        const title = deriveCurrentDialogueTitle(snap, displayTurn)
        if (title && title.trim() !== '') {
          return title
        }
      } catch (err) {
        console.warn('[kr-agent-panel] deriveCurrentDialogueTitle error', err)
      }
    }
    // 3. DOM 兜底：直接从左侧对话流中查找该轮的用户提问或主要文字
    if (typeof document !== 'undefined') {
      try {
        const userEl = document.querySelector<HTMLElement>(`[data-chat-turn="${displayTurn}"][data-chat-flow-kind="user"], [data-chat-turn="${displayTurn}"] [data-chat-flow-kind="user"]`)
        if (userEl) {
          const text = userEl.textContent?.trim()
          if (text) {
            const clean = text.replace(/\d+月\d+日\s+\d+:\d+.*$/, '').trim()
            if (clean) return clean.length > 60 ? `${clean.slice(0, 60)}…` : clean
          }
        }
        const turnEls = document.querySelectorAll<HTMLElement>(`[data-chat-turn="${displayTurn}"]`)
        for (const el of turnEls) {
          const kind = el.getAttribute('data-chat-flow-kind')
          if (kind === 'assistant-step') {
            const text = el.textContent?.trim()
            if (text) {
              const clean = text.replace(/^本轮完成.*?[Git\d]+/, '').trim()
              if (clean) return clean.length > 60 ? `${clean.slice(0, 60)}…` : clean
            }
          }
        }
      } catch {}
    }
    return ''
  }, [displayTurn, actTick, snapTick])

  // 大盘顶栏标题：直接展示选中的对话内容/标题，而不是“第几轮”
  const headerTitle = useMemo(() => {
    if (dialogueTitle && dialogueTitle.trim() !== '') {
      return dialogueTitle
    }
    if (currentRunning) return 'Agent 执行中'
    if (validSelectedTurn !== null) return '已选对话'
    return hasContent ? '任务已完成' : '新对话'
  }, [dialogueTitle, currentRunning, validSelectedTurn, hasContent])

  return (
    <div className={`kr-split__side ${krState.fullscreen ? 'kr-split__side--fullscreen' : ''}`}>
      {/* 顶部 Header */}
      <div className="kr-panel__header">
        <div className="kr-panel__avatar">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="4" y="8" width="16" height="12" rx="2" />
            <path d="M12 2v6M9 5h6M8 14h.01M16 14h.01M10 17h4" />
          </svg>
        </div>

        <div className="kr-panel__titles">
          <div className="kr-panel__title-row">
            <span className={`kr-panel__status-dot ${currentRunning ? 'kr-panel__status-dot--running' : ''}`} />
            <span className="kr-panel__title" title={headerTitle}>
              {headerTitle}
            </span>
            {validSelectedTurn !== null && (
              <span style={{ fontSize: 11, padding: '1px 6px', borderRadius: 4, background: 'rgba(127, 127, 127, 0.12)', color: 'var(--dsw-alias-label-secondary)', border: '1px solid var(--kr-card-border)', fontWeight: 500, flex: 'none' }}>
                已选对话
              </span>
            )}
          </div>
          {/* 统计副标题：纯展示，不可点击（统计指标按钮与药丸行已按要求移除） */}
          <div className="kr-panel__subtitle" title={subtitle}>
            {subtitle}
          </div>
        </div>

        <div className="kr-panel__actions">
          <button
            type="button"
            className="kr-panel__action-btn"
            onClick={() => setShotOpen(true)}
            title="生成对话截图"
            aria-label="生成对话截图"
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3">
              <path
                d="M9.75 2.5H6.25L4.85 4.5H3C2.17 4.5 1.5 5.17 1.5 6V12.5C1.5 13.33 2.17 14 3 14H13C13.83 14 14.5 13.33 14.5 12.5V6C14.5 5.17 13.83 4.5 13 4.5H11.15L9.75 2.5Z"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle cx="8" cy="9.25" r="2.25" />
            </svg>
          </button>
          <button
            type="button"
            className="kr-panel__action-btn"
            onClick={onCollapse}
            title="收起右侧大盘"
            aria-label="收起右侧大盘"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M2 2l10 10M12 2L2 12" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </div>

      {/* 滚动卡片列表 */}
      <div className="kr-panel__scroll">
        {/* 空态：本次对话尚无任何内容（新会话空白期）。显式渲染，
            不依赖各卡片自行 return null —— 避免上一会话的缓存数据漏进来。 */}
        {!hasContent && !isViewingHistory && (
          <div className="kr-panel__empty">
            <div className="kr-panel__empty-icon">
              <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
                <rect x="4" y="8" width="16" height="12" rx="2" />
                <path d="M12 2v6M9 5h6M8 14h.01M16 14h.01M10 17h4" />
              </svg>
            </div>
            <div className="kr-panel__empty-title">等待本次对话开始</div>
            <div className="kr-panel__empty-desc">发送消息后，任务、思考与工具调用会实时显示在这里</div>
          </div>
        )}

        {/* 对话查看提示 */}
        {validSelectedTurn !== null && (
          <div className="kr-panel__turn-hint">
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 220 }} title={dialogueTitle || '已选对话'}>
              已选对话：{dialogueTitle || '当前对话'}
            </span>
            <button
              type="button"
              className="kr-panel__turn-hint-btn"
              onClick={() => store.setSelectedTurn(null)}
              title="解除指定对话，自动跟随最新对话"
            >
              {isViewingHistory ? '返回最新对话' : '跟随最新对话'}
            </button>
          </div>
        )}

        {/* 任务概览卡片：有真实任务时展示，若该轮无任务则自动返回 null */}
        <KrTaskOverviewCard tasks={tasks} isRunning={currentRunning} />

        {/* 思考过程卡片 */}
        <KrReasoningCard reasoningTexts={reasoningTexts} running={currentRunning} />

        {/* 工具调用卡片 */}
        <KrToolCallsCard
          tools={toolViews}
          onInspectCall={(callId) => {
            try {
              actStore.handlers().inspectCall(callId)
            } catch (err) {
              console.warn('[kr-agent-panel] inspectCall error', err)
            }
          }}
        />
      </div>

      {shotOpen && (
        <ShotPanel
          closing={shotClosing}
          onClose={requestShotClose}
          collect={collectForShot}
          initialRange="turn"
          title={dialogueTitle || '对话记录'}
          dialogueTitle={dialogueTitle}
          sessionTitle={dialogueTitle}
          cwd=""
        />
      )}
    </div>
  )
})
