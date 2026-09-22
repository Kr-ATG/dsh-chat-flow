/**
 * dsh-chat-flow — 回合级思考 chip + 对话流卡片（assistant-step 槽位替换）。
 *
 * 移植自 dsh-webui 的 BETTER assistant 渲染（_tmp-webui/src/client/markdown/
 * renderer.tsx 的 ReasoningEntry + BetterAssistantNodeView），两点关键差异：
 *
 *  1. **正文链路保持官方**：text 块用官方 `MarkdownText`（ui-primitives）、
 *     image 块走官方 `renderMessageImages` 槽——不引入 markstream/shiki/katex，
 *     流式输出与官方渲染完全一致（「流式输出就没了」是本次移植的第一约束）。
 *  2. **卡片只在回合结束后出现**：回合仍在进行（含中间步骤已定型）时一律不包
 *     卡，流式正文直接平铺；turn.status === 'closed'（或中断）后，中间片段变
 *     轻量步骤卡、最终回复变总结卡（本轮完成徽章 + 用时/步骤/工具/思考统计）。
 *
 * 思考材料按「回合」聚合：第一个 assistant-step 渲染一枚 chip（思考中实时
 * 时长 + 实时文字滚动预览），点击打开共享活动抽屉看全文；同一回合其余步骤
 * 只渲染自己的正文。think 块一律不内联展示（避免长思考链拖拽滚动）。
 */
import { memo, useEffect, useMemo, useState, useSyncExternalStore } from 'react'
import type { ReactNode } from 'react'
import { IconChevronDownOutlineRegular, JsonBlock, MarkdownText } from '@deepseek-ai/dsh-client-ui-primitives'
import type { MarkdownFileMentions, MarkdownLabels } from '@deepseek-ai/dsh-client-ui-primitives'
import type {
  AssistantChatData, ChatNode, ChatNodeViewProps, ChatViewSlotProps, TurnTailOwnerProps,
} from '@deepseek-ai/dsh-client-ui-chat/client'
import type { AssistantBlock, RenderMessageImages } from '@deepseek-ai/dsh-client-ui-conversation/client'
// Type-only: activates the ui-chat SlotMap augmentation ('assistant-step' keyed
// Seat props) so ChatNodeViewProps resolves its owner / hooks / session share.
import type {} from '@deepseek-ai/dsh-client-ui-chat/client'
import type {} from '@deepseek-ai/dsh-client-ui-tool/client'
import { activityStore, useDrawerOpen, type ActivityReasoningItem } from '../tool-summary/activity-drawer.tsx'
import { LiveThinkingStack, LiveThinkingCard as StackLiveCard, LIVE_RECLAIM_UNMOUNT_MS, type LiveThinkingItem } from './live-stack.tsx'
import { useMotionAllowed } from '../motion-utils.ts'
import { formatDuration } from '../tool-summary/tool-stats.ts'
import { useNow } from '../tool-summary/use-now.ts'
import { FlowCard, type ReplyCardMeta } from '../flow-card.tsx'
import { splitDiagram } from '../diagram/parse.ts'
import { DiagramCard } from '../diagram/DiagramCard.tsx'
import { splitProtoTabs } from '../proto/parse.ts'
import { ProtoTabsCard } from '../proto/ProtoTabsCard.tsx'
import { gitVerbOf } from '../tool-summary/tool-stats.ts'
import { GeneratedImageStrip } from '../generated-images/GeneratedImageStrip.tsx'
import { useGeneratedImages } from '../generated-images/use-generated-images.ts'
import { getKrChatStore } from '../kr-chat/kr-chat-store.ts'
import { KR_CHAT_ENABLED } from '../kr-chat/enabled.ts'
import { getOfficialAssistantNodeView } from '../index.ts'
import { latestChatSnapshot, setLatestChatSnapshot } from '../tool-summary/TurnProcessShadowView.tsx'

const EMPTY_STEPS: readonly ChatNode<'assistant-step'>[] = []
const EMPTY_TOOLS: readonly ChatNode<'tool-call'>[] = []

/** Localized copy adapters for Cordis-free Markdown primitives（官方同款）。 */
function markdownLabelsFrom(t: ChatViewSlotProps['t']): MarkdownLabels {
  return {
    code: { copyLabel: t('copy'), copiedLabel: t('copied') },
    footnotes: t('markdown.footnotes'),
  }
}

/** One reasoning entry inside the turn-level group. */
interface ReasoningItem {
  readonly text: string
  /** Whether its owning step is still streaming. */
  readonly running: boolean
  /** The owning assistant step number (for the live card heading). */
  readonly step: number
}

/** KR 对话卡片化思考过程（去掉旧折叠，直观展现步骤） */
function KrFlowThoughtCard({
  items,
  turnNumber,
}: {
  readonly items: readonly ReasoningItem[]
  readonly turnNumber?: number
}) {
  const points = useMemo(() => {
    const text = items.map((i) => i.text).join('\n')
    const lines = text.split('\n').map((l) => l.trim()).filter((l) => l.length > 0)
    const numbered = lines.filter((l) => /^\d+[\.、\s]/.test(l))
    if (numbered.length > 0) return numbered
    return lines.slice(0, 3)
  }, [items])

  if (points.length === 0) return null
  const store = getKrChatStore()

  return (
    <div
      className="kr-flow-thought-card"
      onClick={() => {
        if (turnNumber !== undefined) {
          store.setSelectedTurn(turnNumber)
          store.setPanelOpen(true)
        }
      }}
      style={{ cursor: 'pointer' }}
      title="点击在右侧大盘中查看完整轨迹"
    >
      <div className="kr-flow-thought-card__header">
        <svg width="15" height="15" viewBox="0 0 16 16" fill="currentColor">
          <path d="M2 6a6 6 0 1 1 10.174 4.31c-.203.196-.359.4-.453.619l-.762 1.769A.5.5 0 0 1 10.5 13a.5.5 0 0 1 0 1 .5.5 0 0 1 0 1l-.224.447a1 1 0 0 1-.894.553H6.618a1 1 0 0 1-.894-.553L5.5 15a.5.5 0 0 1 0-1 .5.5 0 0 1 0-1 .5.5 0 0 1-.46-.302l-.761-1.77a1.964 1.964 0 0 0-.453-.618A5.984 5.984 0 0 1 2 6zm6-5a5 5 0 0 0-3.479 8.592c.263.254.514.564.676.941L5.83 12h4.342l.632-1.467c.162-.377.413-.687.676-.941A5 5 0 0 0 8 1z" />
        </svg>
        <span>思考过程 ({points.length})</span>
      </div>
      <div className="kr-flow-thought-card__body">
        {points.map((p, idx) => (
          <div key={idx} style={{ marginBottom: 3 }}>
            {p}
          </div>
        ))}
      </div>
    </div>
  )
}

/** KR 对话 Agent 正在执行卡片 */
function KrFlowExecutingCard({
  subtitle,
  elapsed,
  turnNumber,
}: {
  readonly subtitle?: string
  readonly elapsed: string
  readonly turnNumber?: number
}) {
  const store = getKrChatStore()

  return (
    <div
      className="kr-flow-executing-card"
      onClick={() => {
        if (turnNumber !== undefined) {
          store.setSelectedTurn(turnNumber)
          store.setPanelOpen(true)
        }
      }}
      style={{ cursor: 'pointer' }}
      title="点击在右侧大盘查看实时工具调用"
    >
      <div className="kr-flow-executing-card__spinner" />
      <div className="kr-flow-executing-card__info">
        <div className="kr-flow-executing-card__title">Agent 正在执行</div>
        <div className="kr-flow-executing-card__subtitle">{subtitle || '正在推进各项任务步骤与工具调用…'}</div>
      </div>
      <div className="kr-flow-executing-card__time">{elapsed}</div>
    </div>
  )
}

/**
 * Turn-level reasoning ENTRY: instead of rendering reasoning inline (and
 * fighting the transcript scroll), one compact chip per turn opens the shared
 * activity dialog with the full reasoning material. While the turn is still
 * thinking the chip labels itself "思考中…" with a live transcript card
 * below it (upstream better-display ReasoningCard language: bounded viewport
 * with edge fades; no footer controls).
 */
function ReasoningChip({ items, running, turn, thinkingStart, t, turnProcess, closed }: {
  items: readonly ReasoningItem[]
  running: boolean
  turn: number
  thinkingStart?: number | undefined
  t: ChatViewSlotProps['t']
  turnProcess?: { readonly foldable: boolean } | undefined
  /** 回合已结束（开始总结）：轨道逐行滑出再合拢，而不是一下全收。 */
  closed: boolean
}) {
  const store = activityStore()
  // 思考材料登记挪到父组件（本轮有工具调用时 chip 不挂载、不占行，
  // 抽屉里仍要有思考分区）。
  const now = useNow(running)
  const elapsed = thinkingStart !== undefined ? Math.max(0, now - thinkingStart) : undefined
  // 抽屉开合态：与官方 turn-process 行同行（data-open 把 chevron 转下来）。
  const drawerOpen = useDrawerOpen(turn)
  // 官方 control 行接管时（紧凑模式 closed 回合）本行让位：control 影子行是
  // 唯一的入口（running 与接管互斥，接管要求回合 closed，见工具入口同注释）。
  const controlActive = turnProcess?.foldable === true
  // 无工具调用的回合只剩这一行：文案取官方 turn-process 的「已思考」。
  const label = running
    ? elapsed !== undefined ? `思考中 · ${formatDuration(elapsed)}` : '思考中…'
    : t('message.turnProcess.thoughtForAWhile')
  // 堆叠输入：本轮全部非空思考段（时间序）。running=false 的中途 tool 间隙
  // 不算结束，旧段保留等第 2 段；只有回合 closed 才逐行滑出回收。
  const stackItems = useMemo<readonly LiveThinkingItem[]>(() => (
    items
      .filter(item => item.text !== '')
      .map(item => ({ text: item.text, step: item.step, running: item.running }))
  ), [items])
  // 总结瞬间 control 接管不能直接卸载：否则堆叠来不及播回收，看起来“一瞬间
  // 就没了”。接管后保留挂载播完回收（只剩堆叠、按钮已让位），再彻底让位。
  const motion = useMotionAllowed(true)
  const [deferredControl, setDeferredControl] = useState(controlActive)
  useEffect(() => {
    if (!controlActive) { setDeferredControl(false); return undefined }
    if (stackItems.length === 0) { setDeferredControl(true); return undefined }
    setDeferredControl(false)
    if (!motion) { setDeferredControl(true); return undefined }
    const id = window.setTimeout(() => { setDeferredControl(true) }, LIVE_RECLAIM_UNMOUNT_MS)
    return () => { window.clearTimeout(id) }
  }, [controlActive, stackItems.length, motion])
  if (deferredControl) return null
  // 接管过渡期（controlActive 但尚未让位）：按钮已是 control 影子行的，不再渲染，
  // 轨道按 closing 逐行滑出回收，保证总结动画看得见。
  if (controlActive) {
    return (
      <div className="dtt__reasoning" data-reclaim="true">
        <LiveThinkingStack items={stackItems} closing />
      </div>
    )
  }
  return (
    <div
      className="dtt__reasoning"
      data-running={running || undefined}
      data-reclaim={closed || undefined}
    >
      <button
        type="button"
        className="dtt__process"
        data-open={drawerOpen || undefined}
        data-running={running || undefined}
        data-turn-process={turn}
        data-turn-process-tool-calls={0}
        data-turn-process-messages={0}
        data-turn-process-subagents={0}
        aria-expanded={drawerOpen}
        aria-label={label}
        onClick={() => { store.open(turn, 'reasoning') }}
      >
        <span className="dtt__process-label">{label}</span>
        <IconChevronDownOutlineRegular className="dtt__process-chevron" />
      </button>
      <LiveThinkingStack items={stackItems} closing={closed} />
    </div>
  )
}

/**
 * 兼容 re-export：工具行仍 `import { LiveThinkingCard } from
 * '../thinking/ThinkingStepNodeView.tsx'`，新实现在 live-stack.tsx。
 */
export { StackLiveCard as LiveThinkingCard }
export type { LiveThinkingItem }

/**
 * 旧单卡实现已迁移到 live-stack.tsx（堆叠 + 淡入/消散/回收）。
 * 此处保留注释占位，避免外部按行号引用的文档失效。
 */

type AssistantBlockLike = AssistantBlock

/**
 * 新挂载内容在流式期柔和显现（上游 better-display word-motion 的块级近似：
 * 上游逐字形做 opacity/blur，这里官方 MarkdownText 整块渲染，只能做到
 * 新挂载块级节点淡入——已显示的旧节点绝不动）。
 */
function Fresh({ live, freshKey, children }: { live: boolean; freshKey: string; children: ReactNode }): ReactNode {
  if (!live) return <>{children}</>
  return <span className="dtt__fresh" data-fresh key={freshKey}>{children}</span>
}

/** 助手正文：text 走官方 MarkdownText、image 走官方槽、未知块 JsonBlock。 */
function AssistantBody({ blocks, streaming, interrupted, renderMessageImages, mentions, labels, t }: {
  blocks: readonly AssistantBlockLike[]
  streaming: boolean
  interrupted?: boolean | undefined
  renderMessageImages: RenderMessageImages
  mentions?: MarkdownFileMentions | undefined
  labels: MarkdownLabels
  t: ChatViewSlotProps['t']
}): { hasVisible: boolean; rendered: ReactNode[] } {
  const hasVisible = streaming
    || interrupted === true
    || blocks.some(block => block.kind !== 'tool-call')
  const rendered: ReactNode[] = []
  if (!hasVisible) return { hasVisible, rendered }
  // 连续 text 块先拼成整段：长围栏（proto-tabs 单行 JSON 很长）会被流式
  // 切成多个块，单块正则永远匹配不上，只能原样显示代码块。用空串拼接
  // 精确还原（JSON 字符串内不能插入换行，只能无缝拼）。
  const coalesced: AssistantBlockLike[] = []
  for (const source of blocks) {
    const prev = coalesced[coalesced.length - 1]
    if (source.kind === 'text' && prev !== undefined && prev.kind === 'text') {
      coalesced[coalesced.length - 1] = { ...prev, text: prev.text + source.text }
    } else {
      coalesced.push(source)
    }
  }
  for (let index = 0; index < coalesced.length; index += 1) {
    const block = coalesced[index]
    if (block === undefined) continue
    switch (block.kind) {
      case 'text': {
        // proto-tabs / diagram 围栏 → 卡片组件，其余仍走官方 MarkdownText。
        const pushMd = (key: string, text: string): void => {
          if (text === '') return
          splitDiagram(text).forEach((sub, subIndex) => {
            if (sub.kind === 'diagram') {
              rendered.push(<Fresh live={streaming} freshKey={`${key}-dg${subIndex}`}><DiagramCard spec={sub.spec} /></Fresh>)
            } else if (sub.text !== '') {
              rendered.push(
                <Fresh live={streaming} freshKey={`${key}-md${subIndex}`}><MarkdownText text={sub.text} streaming={streaming} labels={labels} fileMentions={mentions} /></Fresh>,
              )
            }
          })
        }
        const parts = splitProtoTabs(block.text)
        if (parts.length === 1 && parts[0]?.kind === 'md' && parts[0].text.indexOf('diagram') < 0) {
          rendered.push(
            <Fresh live={streaming} freshKey={`md${index}`}><MarkdownText text={block.text} streaming={streaming} labels={labels} fileMentions={mentions} /></Fresh>,
          )
        } else {
          parts.forEach((part, partIndex) => {
            if (part.kind === 'card') {
              rendered.push(<Fresh live={streaming} freshKey={`proto${index}-${partIndex}`}><ProtoTabsCard spec={part.spec} /></Fresh>)
            } else {
              pushMd(`${index}-${partIndex}`, part.text)
            }
          })
        }
        break
      }
      case 'reasoning':
        // 回合级聚合进 chip；此处不渲染任何内联思考。
        break
      case 'image': {
        const start = index
        const group = [block]
        while (index + 1 < coalesced.length) {
          const next = coalesced[index + 1]
          if (next === undefined || next.kind !== 'image') break
          group.push(next)
          index += 1
        }
        rendered.push(
          <Fresh live={streaming} freshKey={`img${start}`}>
            {renderMessageImages({
              images: group.map(({ attachment }) => ({ attachment })),
              align: 'start',
            })}
          </Fresh>,
        )
        break
      }
      // 聚合进工具 chip（tool-call 槽位）；此处跳过。
      case 'tool-call':
        break
      default:
        rendered.push(
          <Fresh live={streaming} freshKey={`unknown${index}`}>
            <JsonBlock
              label={t('message.unknownBlock')}
              payload={block.block}
              truncatedLabel={total => t('json.truncated', { total })}
            />
          </Fresh>,
        )
    }
  }
  return { hasVisible, rendered }
}

/**
 * Turn-level reasoning chip + 卡片门控：第一个 assistant-step 渲染 chip
 * （思考材料进共享活动抽屉）；片段正文按「回合是否结束」决定包卡形态。
 */
export const ThinkingStepNodeView = memo(function ThinkingStepNodeView(
  props: ChatNodeViewProps<'assistant-step'>,
) {
  const { node, useTurnData, useChat, openFile, renderMessageImages, fileMentions, t, turnProcess } = props
  const krStore = getKrChatStore()
  const krState = useSyncExternalStore(
    (cb) => krStore.subscribe(cb),
    () => krStore.snapshot,
  )
  const isKrMode = krState.activeTab === 'kr'
  /**
   * 本视图是否由插件自己渲染。
   *
   * KR 开启时（历史设计）：只有 KR 视图走插件渲染，「对话」委托回官方
   * AssistantNodeView 原生渲染 —— 增强呈现只属于 KR 那一栏。
   * KR 关闭后（KR_CHAT_ENABLED = false）：没有 KR 视图可去，「对话」本身就是
   * 插件渲染，回到 KR 之前的形态（思考 chip / 步骤卡 / proto-tabs / diagram）。
   */
  const pluginRenders = !KR_CHAT_ENABLED || isKrMode
  const data = node.data
  const locationTurn = node.location.kind === 'turn' || node.location.kind === 'step'
    ? node.location.turn
    : undefined
  const tail = useTurnData('turn-tail')
  const owner = useMemo<TurnTailOwnerProps | undefined>(() => {
    if (locationTurn?.status !== 'closed' || data.finalNode === undefined) return undefined
    if (tail?.closing?.finalNode.seq !== data.finalNode.seq) return undefined
    return { turn: locationTurn, seq: data.finalNode.seq, openFile }
  }, [data.finalNode, openFile, tail, locationTurn])
  const mentions = useMemo(
    () => owner === undefined ? undefined : fileMentions(owner),
    [fileMentions, owner],
  )

  // Aggregate reasoning across every assistant step of this turn.
  const turnNumber = locationTurn?.turn
  const steps = useChat(snapshot => {
    setLatestChatSnapshot(snapshot)
    if (turnNumber === undefined) return EMPTY_STEPS
    return snapshot.locations.getTurn(turnNumber)
      .map(key => snapshot.nodes.get(key))
      .filter((candidate): candidate is ChatNode<'assistant-step'> => (
        candidate !== undefined && candidate.kind === 'assistant-step'
      ))
  })
  const toolNodes = useChat(snapshot => {
    if (turnNumber === undefined) return EMPTY_TOOLS
    return snapshot.locations.getTurn(turnNumber)
      .map(key => snapshot.nodes.get(key))
      .filter((candidate): candidate is ChatNode<'tool-call'> => (
        candidate !== undefined && candidate.kind === 'tool-call'
      ))
  })
  const reasoningItems = useMemo<readonly ReasoningItem[]>(() => steps.flatMap(step => {
    const stepRunning = step.data.status === 'running'
    return step.data.blocks
      .filter((block): block is Extract<AssistantBlockLike, { kind: 'reasoning' }> => block.kind === 'reasoning')
      .map(block => ({ text: block.text, running: stepRunning, step: step.data.step }))
  }), [steps])
  const isFirstStep = steps.length > 0 && node.key === steps[0]?.key
  const turnRunning = steps.some(step => step.data.status === 'running')

  // ── 本回合生图结果（generate_image）→ 画廊条 ──────────────────────────
  // 数据源是工具结果：小结果内联 JSON（b64_json → data URL），大结果被
  // DSH spill 成「preview + locator」，由 host 路由读回完整图片（见
  // use-generated-images.ts）。不依赖正文 markdown，因此模型只写路径
  // 文字时图片也会直接显示。
  const generated = useGeneratedImages(toolNodes)
  // 画廊挂在回合内「最后一个 assistant-step」：回合进行中 = 生图后最新的
  // 步骤（图即时可见），回合收口后即最终回复总结卡（用户期望的位置）。
  const galleryStepKey = useChat(snapshot => {
    if (turnNumber === undefined || generated.urls.length === 0) return undefined
    let lastStep: string | undefined
    for (const key of snapshot.locations.getTurn(turnNumber)) {
      const candidate = snapshot.nodes.get(key)
      if (candidate === undefined) continue
      if (candidate.kind === 'assistant-step') lastStep = key
    }
    return lastStep
  })
  const gallery = generated.urls.length > 0 && node.key === galleryStepKey
    ? <GeneratedImageStrip images={generated.urls} model={generated.model} />
    : undefined

  // "当前思考"的起点：取仍在流式输出的那个 step 的首个可见内容时间
  // （data.time），而不是整轮的 turn 开始时间，这样计时才是这段思考的时长。
  const thinkingStart = useMemo(() => {
    const runningStep = steps.find(step => step.data.status === 'running')
    return runningStep?.data.time
  }, [steps])

  const visibleBlocks = useMemo(
    () => data.blocks.filter(block => block.kind !== 'reasoning'),
    [data.blocks],
  )
  // 本轮工具调用次数与耗时：复用已有的会话投影（无新增订阅）。
  const toolCount = useChat((snapshot) => {
    if (turnNumber === undefined) return 0
    let count = 0
    for (const key of snapshot.locations.getTurn(turnNumber)) {
      if (snapshot.nodes.get(key)?.kind === 'tool-call') count += 1
    }
    return count
  })
  // 思考材料登记（首步负责）：本轮有工具调用时思考行并入工具行（与官方
  // turn-process 一致，推理折叠不单独占行），chip 不挂载也得登记，抽屉里
  // 才有思考分区。
  useEffect(() => {
    if (pluginRenders && isFirstStep && reasoningItems.length > 0 && turnNumber !== undefined) {
      activityStore().setReasoning(turnNumber, reasoningItems)
    }
  }, [pluginRenders, isFirstStep, reasoningItems, turnNumber])
  const now = useNow(turnRunning)
  const turnElapsed = thinkingStart !== undefined ? Math.max(0, now - thinkingStart) : 1000
  const turnElapsedText = formatDuration(turnElapsed)

  // 本轮 git 相关调用：扫工具节点参数里的 git <动词>（见 tool-stats.gitVerbOf）。
  // ⚠ 必须在下面的 krExecutingCard 之前求值 —— 之前 gitDetail 声明在使用点之后，
  // 触发 TDZ（Cannot access 'gitDetail' before initialization），
  // 让整个 conversation.chat.node 槽位崩溃、退化成官方渲染（总结卡随之消失）。
  const gitVerbs = useMemo(() => {
    const verbs: string[] = []
    for (const node of toolNodes) {
      const verb = gitVerbOf(node.data.root)
      if (verb !== undefined) verbs.push(verb)
    }
    return verbs
  }, [toolNodes])
  const gitDetail = useMemo(() => [...new Set(gitVerbs)].join(' · '), [gitVerbs])

  const krThoughtCard = isKrMode && isFirstStep && reasoningItems.length > 0
    ? <KrFlowThoughtCard items={reasoningItems} turnNumber={turnNumber as number} />
    : undefined

  const krExecutingCard = isKrMode && isFirstStep && turnRunning
    ? <KrFlowExecutingCard subtitle={gitDetail || undefined} elapsed={turnElapsedText} turnNumber={turnNumber as number} />
    : undefined

  const folded = toolCount > 0
  const turnClosedEarly = locationTurn?.status === 'closed'
  // KR 视图里思考由 KrFlowThoughtCard 承接，chip 让位；KR 关闭后「对话」就是
  // 插件渲染，chip 照常出现（= KR 之前的形态）。
  const chip = isKrMode
    ? undefined
    : (isFirstStep && reasoningItems.length > 0 && !folded
        ? <ReasoningChip
            items={reasoningItems}
            running={turnRunning}
            turn={turnNumber as number}
            thinkingStart={thinkingStart}
            t={t}
            turnProcess={turnProcess}
            closed={turnClosedEarly === true}
          />
        : undefined)
  const timing = useChat((snapshot) => {
    if (turnNumber === undefined) return undefined
    return snapshot.legacy.turnTimings.get(turnNumber)
  })
  const streaming = data.status === 'running'
  const interrupted = data.status === 'interrupted'
  // 卡片只在「回合已结束」时出现（含中断）：流式期不包卡，保住流式输出；
  // 中间步骤要等整轮收口才变轻量步骤卡，最终回复变总结卡。
  const turnClosed = locationTurn?.status === 'closed'
  const showCard = turnClosed === true || interrupted
  const isClosingReply = owner !== undefined
  const isSummary = isClosingReply || interrupted
  const variant: 'reply' | 'step' | undefined = !showCard
    ? undefined
    : isSummary ? 'reply' : 'step'
  const cardMeta = useMemo<ReplyCardMeta | undefined>(() => {
    if (!showCard) return undefined
    const start = timing?.startTime
    const end = timing?.endTime
    return {
      turnNumber: turnNumber as number,
      durationMs: start !== undefined && end !== undefined ? Math.max(0, end - start) : undefined,
      steps: steps.length,
      tools: toolCount,
      thinking: reasoningItems.length,
      git: gitVerbs.length > 0 ? gitVerbs.length : undefined,
      gitDetail: gitDetail !== '' ? gitDetail : undefined,
    }
  }, [showCard, reasoningItems.length, steps.length, timing, toolCount, gitVerbs, gitDetail])
  const labels = useMemo(() => markdownLabelsFrom(t), [t])

  const OfficialComp = getOfficialAssistantNodeView()
  if (!pluginRenders && OfficialComp) {
    const defaultUsePresentation = (selector: (policy: any) => any) => selector({
      mode: 'detailed',
      foldCompletedTurns: true,
      stepGrouping: 'collapsed',
      liveProcessDetail: true,
      settledReasoningPreview: true,
    })
    const usePresentation = typeof (props as any).usePresentation === 'function'
      ? (props as any).usePresentation
      : defaultUsePresentation
    return <OfficialComp {...props} usePresentation={usePresentation} />
  }

  const { hasVisible, rendered } = AssistantBody({
    blocks: visibleBlocks,
    streaming,
    interrupted,
    renderMessageImages,
    mentions,
    labels,
    t,
  })
  if (!hasVisible && chip === undefined && gallery === undefined) return null

  return (
    <div className="dtt__assistant" data-streaming={streaming || undefined}>
      <div className="dtt__assistant-body">
        {chip}
        {krThoughtCard}
        {krExecutingCard}
        {rendered.length > 0 && (variant !== undefined
          ? <FlowCard variant={variant} meta={cardMeta} interrupted={interrupted}>{rendered}{gallery}</FlowCard>
          : <>{rendered}{gallery}</>)}
        {rendered.length === 0 && gallery}
        {interrupted && <span className="dtt__stopped">{t('message.stopped')}</span>}
      </div>
    </div>
  )
})
