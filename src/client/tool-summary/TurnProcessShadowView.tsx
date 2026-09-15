/**
 * Official turn-process control, shadowed (dsh-chat-flow).
 *
 * 紧凑模式下官方 control 行与插件自有行会渲染出两行完全一样的
 * 「N 次工具调用 › / 已思考 ›」（control 在前、插件行在成员位），因此把
 * control 键整个接管：同一位置只留一行，文案/DOM 与官方逐字一致，
 * 点击行为一分为二——
 *
 * - 行正文：打开共享活动抽屉（有工具进工具分区，否则进思考分区；
 *   抽屉里没有东西的回合整行保持官方行为）；
 * - 尾部 chevron：保留官方内联折叠开关（stopPropagation，不进抽屉）。
 *
 * 成员槽位（思考 chip / 工具入口）以 `turnProcess.foldable` 判断 control
 * 是否接管：接管时只登记抽屉数据、不占行；无 control（非紧凑模式、
 * 流式回合、旧 host）时回退到原来的自有行，抽屉照常可进。
 */

import { memo, useEffect } from 'react'
import type { ChatNode, ChatNodeViewProps } from '@deepseek-ai/dsh-client-ui-chat/client'
// Type-only: activates the ui-chat / ui-tool SlotMap augmentation so
// ChatNodeViewProps resolves its owner/keyed share.
import type {} from '@deepseek-ai/dsh-client-ui-chat/client'
import type {} from '@deepseek-ai/dsh-client-ui-tool/client'
import { IconChevronDownOutline14 } from '@deepseek-ai/dsh-client-ui-primitives'
import { activityStore } from './activity-drawer.tsx'
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
    for (const key of snapshot.locations.getTurn(turn)) {
      const candidate = snapshot.nodes.get(key)
      if (candidate === undefined) continue
      if (candidate.kind === 'tool-call') {
        tools += 1
        try {
          const block = (candidate as ChatNode<'tool-call'>).data.root
          if (isRunning(block)) toolsRunning = true
        } catch { /* 块形状未知时按未运行处理 */ }
      } else if (candidate.kind === 'assistant-step') {
        const step = candidate as ChatNode<'assistant-step'>
        if (step.data.status === 'running') streaming = true
        for (const block of step.data.blocks) {
          if (block.kind === 'reasoning') reasoning += 1
        }
      }
    }
    return { tools, reasoning, streaming, toolsRunning }
  })
}

/** This turn can offer the drawer (and on which tab), or null = keep official behavior. */
function drawerTabFor(counts: { readonly tools: number; readonly reasoning: number }): 'tools' | 'reasoning' | null {
  if (counts.tools > 0) return 'tools'
  return counts.reasoning > 0 ? 'reasoning' : null
}

/** Single per-turn row at the official control position (priority -100 shadows builtin). */
export const TurnProcessShadowView = memo(function TurnProcessShadowView(props: ChatNodeViewProps<'turn-process'>) {
  const { node, useChat, turnProcess, t } = props
  const store = activityStore()
  const counts = useTurnActivityCounts(node.data.turn, useChat)
  const drawerTab = drawerTabFor(counts)
  if (turnProcess === undefined) return null
  if (!turnProcess.foldable) return null
  const open = turnProcess.open
  // 实时思考预览堆叠（最多 2 张）：锚点在「本轮仍在干活」时常驻——思考流式
  // 中 + tool 间隙（思考已停、工具还在跑）都保留旧卡，等第 2 张叠下面；
  // 整轮收口（既无思考流、也无工具跑）才清锚点，悬浮堆叠逐张回收。
  // 流式回合 control 不 foldable 的场景走不到这里；foldable 且流式时官方
  // 行也还在，这里只负责登记预览锚点。
  const activeThinking = counts.reasoning > 0 && (counts.streaming === true || counts.toolsRunning === true)
  useEffect(() => {
    // 本轮有思考且仍在干活时，把 control 行登记为预览锚点；收口后清掉
    // （悬浮堆叠自己播 stagger 回收，不一下全收）。
    if (activeThinking) {
      const row = document.querySelector('[data-turn-process="' + node.data.turn + '"].' + NS + '__process')
      store.setPreviewAnchor((row as HTMLElement) ?? undefined, node.data.turn)
    } else {
      store.setPreviewAnchor(undefined, null)
    }
    return () => { if (activeThinking) store.setPreviewAnchor(undefined, null) }
  }, [activeThinking, node.data.turn, store])
  // 只显示工具和思考：官方文案里的消息/subagent 计数不要（用户没要过）。
  const data = node.data
  const labels: string[] = []
  if (data.toolCallCount > 0) labels.push(t(data.toolCallCount === 1 ? 'message.turnProcess.toolCalls.one' : 'message.turnProcess.toolCalls.other', { count: data.toolCallCount }))
  // 思考数缀在官方文案后面（`N 次工具调用 · 思考 M`，与抽屉页签同口径）；
  // 纯思考回合保持官方「已思考」不动。点哪段开哪个分区，弹窗居中打开。
  const thinkingLabel = labels.length > 0 && counts.reasoning > 0 ? `${counts.reasoning} 次思考` : undefined
  const label = labels.length === 0
    ? t('message.turnProcess.thoughtForAWhile')
    : labels.filter(l => l !== thinkingLabel).join(t('message.turnProcess.separator'))
  const toggle = (): void => { turnProcess.setOpen(!open) }
  const openFor = (mode: 'tools' | 'reasoning'): void => {
    store.open(data.turn, mode)
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
      onClick={drawerTab !== null
        ? () => { openFor(counts.reasoning > 0 ? 'reasoning' : drawerTab) }
        : undefined}
    >
      <span className={`${NS}__process-label`}>{label}</span>
      {thinkingLabel !== undefined && (
        <span
          className={`${NS}__process-think`}
          role="button"
          tabIndex={0}
          title={`查看${counts.reasoning} 次思考`}
          aria-label={`查看${counts.reasoning} 次思考`}
          onClick={(event) => {
            event.stopPropagation()
            store.open(data.turn, 'reasoning')
          }}
          onKeyDown={(event) => {
            if (event.key === 'Enter' || event.key === ' ') {
              event.preventDefault()
              event.stopPropagation()
              store.open(data.turn, 'reasoning')
            }
          }}
        >
          {t('message.turnProcess.separator')}{thinkingLabel}
        </span>
      )}
      {drawerTab !== null ? (
        <span
          className={`${NS}__process-chevronbtn`}
          role="button"
          tabIndex={0}
          title={open ? '折叠本轮原文' : '展开本轮原文'}
          aria-label={open ? '折叠本轮原文' : '展开本轮原文'}
          onClick={(event) => { event.stopPropagation(); toggle() }}
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
      ) : (
        <IconChevronDownOutline14 className={`${NS}__process-chevron`} />
      )}
    </button>
  )
})
