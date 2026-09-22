/**
 * Official turn-process control, shadowed (dsh-chat-flow).
 *
 * 紧凑模式下官方 control 行与插件自有行会渲染出两行完全一样的
 * 「N 次工具调用 › / 已思考 ›」（control 在前、插件行在成员位），因此把
 * control 键整个接管：同一位置只留一行，文案/DOM 与官方逐字一致，
 * 点击行为一分为二——
 *
 * - 行正文：点击始终打开共享活动抽屉（有工具进工具分区、纯思考进思考分区，
 *   两边都有时页签可自由切换）；
 * - 尾部 chevron：保留官方内联折叠开关（stopPropagation，仅用于折叠/展开原生流）。
 *
 * 成员槽位（思考 chip / 工具入口）以 `turnProcess.foldable` 判断 control
 * 是否接管：接管时只登记抽屉数据、不占行；无 control（非紧凑模式、
 * 流式回合、旧 host）时回退到原来的自有行，抽屉照常可进。
 */

import { memo, useEffect, useRef } from 'react'
import type { ChatNode, ChatNodeViewProps } from '@deepseek-ai/dsh-client-ui-chat/client'
// Type-only: activates the ui-chat / ui-tool SlotMap augmentation so
// ChatNodeViewProps resolves its owner/keyed share.
import type {} from '@deepseek-ai/dsh-client-ui-chat/client'
import type {} from '@deepseek-ai/dsh-client-ui-tool/client'
import { IconChevronDownOutlineRegular } from '@deepseek-ai/dsh-client-ui-primitives'
import { activityStore, type ActivityReasoningItem, type ViewMode } from './activity-drawer.tsx'
import { isRunning } from './tool-stats.ts'
import { getKrChatStore } from '../kr-chat/kr-chat-store.ts'
import { clearLiveDshTodos } from '../kr-chat/kr-todo-bridge.ts'

const NS = 'dts'

export let latestChatSnapshot: any = null
/**
 * 当前活动会话 id（由 session 作用域座位登记；null = 尚无会话身份）。
 *
 * 之所以把会话身份显式登记：快照本身不带 sessionId，新建/切换会话时
 * navigation.current 为空，旧的启发式（首条输入锚点）根本不会触发，
 * 于是上一会话的快照被一直沿用、右侧大盘显示的是上一次对话的内容。
 */
export let latestChatSessionId: string | null = null
const snapshotListeners = new Set<() => void>()
let currentSessionKey: string | null = null
let notifyScheduled = false

export function subscribeLatestChatSnapshot(cb: () => void): () => void {
  snapshotListeners.add(cb)
  return () => {
    snapshotListeners.delete(cb)
  }
}

/**
 * 通知延迟到微任务。
 *
 * 快照发布点基本都在 React 渲染期（useChat selector）。若同步 notify，
 * 订阅者的 setState 会落在「渲染另一个组件期间」，React 直接丢弃该更新，
 * 右侧大盘于是只能等下一次无关重渲染才刷新 —— 表现就是「不实时」。
 * 放到当前同步渲染任务结束之后再广播，更新必然生效。
 */
function scheduleNotify(): void {
  if (notifyScheduled) return
  notifyScheduled = true
  const flush = (): void => {
    notifyScheduled = false
    for (const cb of [...snapshotListeners]) {
      try { cb() } catch { /* 单个订阅者异常不得阻断其余订阅者 */ }
    }
  }
  if (typeof queueMicrotask === 'function') queueMicrotask(flush)
  else setTimeout(flush, 0)
}

/** 清空上一会话残留：抽屉缓存、live todos、已选轮次。 */
function resetSessionCaches(): void {
  try { activityStore().clear() } catch {}
  try { clearLiveDshTodos() } catch {}
  try { getKrChatStore().setSelectedTurn(null) } catch {}
}

/**
 * 登记（或切换）当前会话身份。id 变化即视为「新建 / 切换 / 离开会话」：
 * 立刻丢弃旧快照并清掉缓存，右侧大盘不得复用上一会话的数据。
 *
 * 由 conversation.input.dock 座位（KrTodoBridge）在每次 sessionId 变化时调用 ——
 * 该座位在新会话的空白 Hero 态同样渲染，因此空白新会话也能即时完成清空。
 */
/** 读取当前已登记的会话 id（供座位卸载时做「是否仍是我登记的」判断）。 */
export function getLatestChatSessionId(): string | null {
  return latestChatSessionId
}

export function setLatestChatSessionId(id: string | null): void {
  if (id === latestChatSessionId) return
  latestChatSessionId = id
  if (typeof window !== 'undefined') {
    // 诊断镜像：控制台可直接查当前已登记的会话 id。
    (window as any).__dshLatestChatSessionId__ = id
  }
  clearLatestChatSnapshot()
  resetSessionCaches()
  scheduleNotify()
}

/** 显式清空快照（不改会话身份）。 */
export function clearLatestChatSnapshot(): void {
  latestChatSnapshot = null
  if (typeof window !== 'undefined') {
    (window as any).__dshLatestChatSnapshot__ = null
  }
  scheduleNotify()
}

if (typeof window !== 'undefined') {
  // KrTodoBridge 经 window 总线登记会话身份：插件内两侧互不 import，避免循环依赖。
  (window as any).__dshSetActiveSessionId__ = setLatestChatSessionId
}

export function setLatestChatSnapshot(snapshot: any, sessionId?: string | null): void {
  // 会话身份优先走显式参数。座位先登记 id、节点视图随后发布快照；
  // 若节点视图先于座位 effect 到达，这里就地采纳该 id（避免空面板）。
  if (sessionId !== undefined && sessionId !== null && sessionId !== latestChatSessionId) {
    setLatestChatSessionId(sessionId)
  }

  latestChatSnapshot = snapshot
  if (typeof window !== 'undefined') {
    (window as any).__dshLatestChatSnapshot__ = snapshot
  }

  // 兜底启发式（宿主未提供会话 id 座位时）：首条输入锚点变化即视为换会话
  const firstInputKey = snapshot?.navigation?.current?.[0]?.anchorKey
    || snapshot?.order?.find((k: string) => typeof k === 'string' && k.includes('input-message'))
    || null

  if (firstInputKey && firstInputKey !== currentSessionKey) {
    currentSessionKey = firstInputKey
    resetSessionCaches()
  }

  // 广播通知大盘与抽屉重新渲染
  scheduleNotify()
}

/** Per-turn activity counts (tool-call nodes + reasoning blocks, drawer 口径一致）. */
export function useTurnActivityCounts(turn: number, useChat: ChatNodeViewProps<'tool-call'>['useChat']): {
  readonly tools: number
  readonly reasoning: number
  /** 本轮仍有 assistant-step 在流式输出。 */
  readonly streaming: boolean
  /** 本轮仍有 tool-call 在执行（含 tool 间隙：思考已停但工具还在跑）。 */
  readonly toolsRunning: boolean
} {
  return useChat((snapshot) => {
    let tools = 0
    let reasoning = 0
    let streaming = false
    let toolsRunning = false
    const keys = snapshot?.locations?.getTurn?.(turn) ?? []
    for (const key of keys) {
      const candidate = snapshot?.nodes?.get?.(key)
      if (candidate === undefined) continue
      if (candidate.kind === 'tool-call') {
        tools += 1
        try {
          const block = (candidate as ChatNode<'tool-call'>).data.root
          if (isRunning(block)) toolsRunning = true
        } catch { /* 块形状未知时按未运行处理 */ }
      } else if (candidate.kind === 'assistant-step' || candidate.kind === 'assistant') {
        const step = candidate as any
        if (step.data?.status === 'running' || step.status === 'running') streaming = true
        const blocks = step.data?.blocks ?? step.blocks ?? []
        for (const block of blocks) {
          const isReasoning = block?.kind === 'reasoning' || block?.type === 'reasoning'
          const text = typeof block?.text === 'string' ? block.text : typeof block?.content === 'string' ? block.content : ''
          if (isReasoning && text.trim() !== '') reasoning += 1
        }
      }
    }
    return { tools, reasoning, streaming, toolsRunning }
  }, (a, b) => a.tools === b.tools && a.reasoning === b.reasoning && a.streaming === b.streaming && a.toolsRunning === b.toolsRunning)
}

/**
 * 完整收集一轮的活动节点（tool-call + assistant-step/reasoning）：
 * 优先从 locations.getTurn 读，若收口或折叠后被官方隐藏，则从 snapshot.nodes.values()
 * 中基于 location.turn 或 data.turn 补齐隐藏成员，确保收口后依然有料可看、能开抽屉。
 * 纯读取函数，仅在用户点击打开抽屉时按需执行，绝不在 render / effect 循环执行。
 */
export interface TurnTaskItem {
  readonly id: string
  readonly content: string
  readonly status: 'pending' | 'in_progress' | 'completed'
}

export function collectTurnNodes(snapshot: any, turn: number): {
  readonly tools: readonly ChatNode<'tool-call'>[]
  readonly reasoning: readonly ActivityReasoningItem[]
  readonly tasks: readonly TurnTaskItem[]
  readonly turnStart?: number | undefined
  readonly turnEnd?: number | undefined
  readonly durationMs?: number | undefined
} {
  const toolMap = new Map<string, ChatNode<'tool-call'>>()
  const reasoningList: ActivityReasoningItem[] = []
  let turnTasks: TurnTaskItem[] = []

  if (snapshot === null || snapshot === undefined) {
    return { tools: [], reasoning: [], tasks: [] }
  }

  const addNode = (candidate: any): void => {
    if (candidate === undefined || candidate === null) return
    if (candidate.kind === 'tool-call') {
      const toolNode = candidate as ChatNode<'tool-call'>
      if (toolNode.key && !toolMap.has(toolNode.key)) {
        toolMap.set(toolNode.key, toolNode)
      }
      try {
        const root = (toolNode as any).data?.root
        const tName = root?.call?.name || root?.toolName || root?.name || (toolNode as any).data?.call?.name
        if (tName === 'todo_write') {
          const raw = root?.call?.argsRaw || root?.arguments || (toolNode as any).data?.call?.argsRaw
          const parsed = typeof raw === 'string' ? JSON.parse(raw) : raw
          if (parsed && Array.isArray(parsed.todos) && parsed.todos.length > 0) {
            turnTasks = parsed.todos.map((item: any, idx: number) => ({
              id: `todo-${turn}-${idx}`,
              content: String(item.content ?? ''),
              status: (item.status === 'completed' || item.status === 'in_progress' || item.status === 'pending') ? item.status : 'pending',
            }))
          }
        }
      } catch {}
    } else if (candidate.kind === 'submitted-plan') {
      try {
        const planData = candidate.data
        if (planData && typeof planData.title === 'string' && turnTasks.length === 0) {
          const markdown = planData.markdown || ''
          const mdLines = markdown.split('\n')
          const mdTasks: TurnTaskItem[] = []
          for (const line of mdLines) {
            const checkMatch = line.match(/^[\s\*\-]*\[([ xX])\]\s*(.+)/)
            if (checkMatch) {
              mdTasks.push({
                id: `plan-task-${turn}-${mdTasks.length}`,
                content: checkMatch[2].trim(),
                status: checkMatch[1].toLowerCase() === 'x' ? 'completed' : 'pending',
              })
            }
          }
          if (mdTasks.length > 0) {
            turnTasks = mdTasks
          } else {
            turnTasks = [{
              id: `plan-${turn}-0`,
              content: planData.title,
              status: 'completed',
            }]
          }
        }
      } catch {}
    } else if (candidate.kind === 'assistant-step' || candidate.kind === 'assistant') {
      const step = candidate as any
      const blocks = step.data?.blocks ?? step.blocks ?? []
      for (const block of blocks) {
        const isReasoning = block?.kind === 'reasoning' || block?.type === 'reasoning'
        const text = typeof block?.text === 'string' ? block.text : typeof block?.content === 'string' ? block.content : ''
        if (isReasoning && text.trim() !== '') {
          const stepNum = step.data?.step ?? step.step ?? 0
          if (!reasoningList.some(r => r.step === stepNum && r.text === text)) {
            reasoningList.push({
              text,
              running: step.data?.status === 'running' || step.status === 'running',
              step: stepNum,
            })
          }
        }
      }
    }
  }

  // 1. 优先从 locations.getTurn 收集本轮可见键
  try {
    const turnKeys = snapshot?.locations?.getTurn?.(turn)
    if (Array.isArray(turnKeys)) {
      for (const key of turnKeys) {
        addNode(snapshot?.nodes?.get?.(key))
      }
    }
  } catch { /* ignore */ }

  // 2. 穿透扫描全量节点表（补齐 compact/折叠时被过滤掉的 tool-call 与 assistant-step）
  const scanCandidate = (node: any): void => {
    if (!node) return
    const loc = node.location
    const candTurn = node.data?.turn
      ?? (typeof loc?.turn === 'number' ? loc.turn : loc?.turn?.turn)
    if (candTurn !== undefined && candTurn == turn) {
      addNode(node)
    }
  }

  try {
    if (typeof snapshot?.nodes?.values === 'function') {
      for (const node of snapshot.nodes.values()) {
        scanCandidate(node)
      }
    }
  } catch { /* ignore */ }

  try {
    if (Array.isArray(snapshot?.order)) {
      for (const key of snapshot.order) {
        scanCandidate(snapshot?.nodes?.get?.(key))
      }
    }
  } catch { /* ignore */ }

  const tools = [...toolMap.values()].sort((a, b) => (a.anchorSeq ?? 0) - (b.anchorSeq ?? 0))
  reasoningList.sort((a, b) => (a.step ?? 0) - (b.step ?? 0))

  let turnStart: number | undefined
  let turnEnd: number | undefined
  let durationMs: number | undefined

  // 3. 提取真实生命周期耗时：优先从 snapshot.timeline.turns 读取
  try {
    const turnsMap = snapshot?.timeline?.turns
    const t = turnsMap?.get ? turnsMap.get(turn) : turnsMap?.[turn]
    if (t) {
      if (typeof t.start?.time === 'number') turnStart = t.start.time
      if (typeof t.end?.time === 'number') turnEnd = t.end.time
      if (turnStart !== undefined && turnEnd !== undefined) {
        durationMs = Math.max(0, turnEnd - turnStart)
      }
    }
  } catch { /* ignore */ }

  // 4. 次选从 turn-tail 节点的 location.turn 读取
  if (durationMs === undefined) {
    try {
      for (const key of (snapshot?.order ?? [])) {
        const node = snapshot?.nodes?.get?.(key)
        if (node?.kind === 'turn-tail' && (node.data?.turn === turn || node.location?.turn?.turn === turn)) {
          const locTurn = node.location?.turn
          const s = locTurn?.start?.time
          const e = locTurn?.end?.time
          if (typeof s === 'number') turnStart = s
          if (typeof e === 'number') turnEnd = e
          if (typeof s === 'number' && typeof e === 'number') {
            durationMs = Math.max(0, e - s)
          }
          break
        }
      }
    } catch { /* ignore */ }
  }

  // 5. 兜底兼容 legacy startTime
  if (turnStart === undefined) {
    turnStart = snapshot?.legacy?.turnTimings?.get?.(turn)?.startTime
  }

  return { tools, reasoning: reasoningList, tasks: turnTasks, turnStart, turnEnd, durationMs }
}

/** Single per-turn row at the official control position (priority -100 shadows builtin). */
export const TurnProcessShadowView = memo(function TurnProcessShadowView(props: ChatNodeViewProps<'turn-process'>) {
  const { node, useChat, turnProcess, t, cwd, openFile, inspectCall } = props
  const store = activityStore()
  const turn = node.data.turn

  // 1. 获取计数（浅比较，避免非必要重渲染）
  const counts = useTurnActivityCounts(turn, useChat)

  // 2. 捕获最新 snapshot 引用供读取（返回值恒定为 0，永不触发重渲染）
  const snapshotRef = useRef<any>(null)
  useChat((snapshot) => {
    snapshotRef.current = snapshot
    latestChatSnapshot = snapshot
    return 0
  })

  // 实时思考预览堆叠
  const activeThinking = counts.reasoning > 0 && (counts.streaming === true || counts.toolsRunning === true)
  useEffect(() => {
    if (activeThinking) {
      const row = document.querySelector('[data-turn-process="' + turn + '"].' + NS + '__process')
      store.setPreviewAnchor((row as HTMLElement) ?? undefined, turn)
    } else {
      store.setPreviewAnchor(undefined, null)
    }
    return () => { if (activeThinking) store.setPreviewAnchor(undefined, null) }
  }, [activeThinking, turn, store])

  if (turnProcess === undefined) return null
  if (!turnProcess.foldable) return null
  // 当处于 KR 对话模式时，彻底去除狭窄的折叠条，右侧大盘已完整呈现
  if (typeof document !== 'undefined' && document.body.hasAttribute('data-dsh-kr-chat')) {
    return null
  }

  const open = turnProcess.open
  const data = node.data
  const labels: string[] = []
  if (data.toolCallCount > 0) {
    labels.push(t(data.toolCallCount === 1 ? 'message.turnProcess.toolCalls.one' : 'message.turnProcess.toolCalls.other', { count: data.toolCallCount }))
  }

  const thinkingLabel = labels.length > 0 && (counts.reasoning > 0 || data.inlineReasoning)
    ? (counts.reasoning > 0 ? `${counts.reasoning} 次思考` : '思考')
    : undefined
  const label = labels.length === 0
    ? t('message.turnProcess.thoughtForAWhile')
    : labels.filter(l => l !== thinkingLabel).join(t('message.turnProcess.separator'))

  const hasTools = data.toolCallCount > 0 || counts.tools > 0
  const tab: ViewMode = hasTools ? 'tools' : 'reasoning'
  const toggle = (): void => { turnProcess.setOpen(!open) }

  // 仅在用户主动点击时收集数据并注入 store，绝不在 render/effect 阶段触发
  const handleOpen = (mode: ViewMode): void => {
    const snapshot = snapshotRef.current
    if (snapshot) {
      const collected = collectTurnNodes(snapshot, turn)
      if (collected.tools.length > 0) {
        store.setTools(turn, collected.tools, cwd, collected.turnStart)
      }
      if (collected.reasoning.length > 0) {
        store.setReasoning(turn, collected.reasoning)
      }
    }
    if (openFile && inspectCall) {
      store.setHandlers({ openFile, inspectCall })
    }
    store.open(turn, mode)
  }

  return (
    <button
      type="button"
      className={`${NS}__process`}
      data-open={open || undefined}
      data-turn-process={data.turn}
      data-turn-process-tool-calls={data.toolCallCount}
      data-turn-process-messages={data.messageCount}
      data-turn-process-subagents={data.subagentCount}
      aria-expanded={open}
      aria-label={[label, thinkingLabel].filter(Boolean).join(' ')}
      onClick={() => { handleOpen(tab) }}
    >
      <span className={`${NS}__process-label`}>{label}</span>
      {thinkingLabel !== undefined && (
        <span
          className={`${NS}__process-think`}
          role="button"
          tabIndex={0}
          title={counts.reasoning > 0 ? `查看${counts.reasoning} 次思考` : '查看思考过程'}
          aria-label={counts.reasoning > 0 ? `查看${counts.reasoning} 次思考` : '查看思考过程'}
          onClick={(event) => {
            event.stopPropagation()
            handleOpen('reasoning')
          }}
          onKeyDown={(event) => {
            if (event.key === 'Enter' || event.key === ' ') {
              event.preventDefault()
              event.stopPropagation()
              handleOpen('reasoning')
            }
          }}
        >
          {t('message.turnProcess.separator')}{thinkingLabel}
        </span>
      )}
      <span
        className={`${NS}__process-chevronbtn`}
        role="button"
        tabIndex={0}
        title={open ? '折叠本轮原文' : '展开本轮原文'}
        aria-label={open ? '折叠本轮原文' : '展开本轮原文'}
        onClick={(event) => {
          event.stopPropagation()
          toggle()
        }}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault()
            event.stopPropagation()
            toggle()
          }
        }}
      >
        <IconChevronDownOutlineRegular size={14} className={`${NS}__process-chevron`} />
      </span>
    </button>
  )
})
