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
import { IconChevronDownOutline14 } from '@deepseek-ai/dsh-client-ui-primitives'
import { activityStore, type ActivityReasoningItem, type ViewMode } from './activity-drawer.tsx'
import { isRunning } from './tool-stats.ts'

const NS = 'dts'

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
export function collectTurnNodes(snapshot: any, turn: number): {
  readonly tools: readonly ChatNode<'tool-call'>[]
  readonly reasoning: readonly ActivityReasoningItem[]
  readonly turnStart?: number | undefined
} {
  const toolMap = new Map<string, ChatNode<'tool-call'>>()
  const reasoningList: ActivityReasoningItem[] = []

  if (snapshot === null || snapshot === undefined) {
    return { tools: [], reasoning: [] }
  }

  const addNode = (candidate: any): void => {
    if (candidate === undefined || candidate === null) return
    if (candidate.kind === 'tool-call') {
      const toolNode = candidate as ChatNode<'tool-call'>
      if (toolNode.key && !toolMap.has(toolNode.key)) {
        toolMap.set(toolNode.key, toolNode)
      }
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
  const turnStart = snapshot?.legacy?.turnTimings?.get?.(turn)?.startTime

  return { tools, reasoning: reasoningList, turnStart }
}

/** Single per-turn row at the official control position (priority -100 shadows builtin). */
export const TurnProcessShadowView = memo(function TurnProcessShadowView(props: ChatNodeViewProps<'turn-process'>) {
  const { node, useChat, turnProcess, t, cwd, openFile, inspectCall } = props
  const store = activityStore()
  const turn = node.data.turn

  // 1. 获取计数（浅比较，避免非必要重渲染）
  const counts = useTurnActivityCounts(turn, useChat)

  // 2. 捕获最新 snapshot 引用供点击时读取（返回值恒定为 0，永不触发重渲染）
  const snapshotRef = useRef<any>(null)
  useChat((snapshot) => {
    snapshotRef.current = snapshot
    return 0
  })

  if (turnProcess === undefined) return null
  if (!turnProcess.foldable) return null
  const open = turnProcess.open

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
        <IconChevronDownOutline14 className={`${NS}__process-chevron`} />
      </span>
    </button>
  )
})
