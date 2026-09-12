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
import { memo, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { Fragment } from 'react'
import {
  DisclosureRow,
  IconChevronDownOutline14,
  IconThinkOutline14,
  JsonBlock,
  MarkdownText,
} from '@deepseek-ai/dsh-client-ui-primitives'
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

const EMPTY_STEPS: readonly ChatNode<'assistant-step'>[] = []
const EMPTY_TOOLS: readonly ChatNode<'tool-call'>[] = []

function firstLine(text: string): string {
  const newline = text.indexOf('\n')
  return newline === -1 ? text : text.slice(0, newline)
}

function latestLine(text: string): string {
  const visible = text.trimEnd()
  const newline = visible.lastIndexOf('\n')
  return newline === -1 ? visible : visible.slice(newline + 1)
}

/** 官方原生思考行组件（思考灯泡 + 思考摘要 + 点击折叠展开） */
export const ReasoningRow = memo(function ReasoningRow({
  text,
  running,
  t,
}: {
  readonly text: string
  readonly running: boolean
  readonly t: ChatViewSlotProps['t']
}) {
  const [expanded, setExpanded] = useState(false)
  const summary = (running ? latestLine(text) : firstLine(text)).replaceAll('**', '')

  return (
    <div
      className="dtt__reasoning-root"
      data-variant="think"
      data-state={running ? 'running' : 'ok'}
      data-expanded={expanded || undefined}
    >
      <DisclosureRow
        rowClassName="dtt__reasoning-row"
        leadingClassName="dtt__reasoning-leading"
        titleClassName="dtt__reasoning-title"
        chevronClassName="dtt__reasoning-chevron"
        icon={<IconThinkOutline14 size={14} />}
        title={t('message.think')}
        open={expanded}
        expandable={true}
        expandOnRowClick={true}
        onToggle={() => { setExpanded(v => !v) }}
        collapsedContent={
          <>
            <span className="dtt__reasoning-sep" aria-hidden="true" />
            <span className="dtt__reasoning-summary" data-follow-end={running || undefined}>
              <span className="dtt__reasoning-summary-text">{summary}</span>
            </span>
          </>
        }
      >
        <div className="dtt__reasoning-body">
          {text}
        </div>
      </DisclosureRow>
    </div>
  )
})

const NOOP = (): void => {}

/** 官方同款 searchable-hidden hook：折叠隐藏但在页面 Ctrl+F 搜索到内容时自动触发展开。 */
function useSearchableHidden(hidden: boolean | undefined, reveal: () => void) {
  const ref = useRef<HTMLDivElement>(null)
  useLayoutEffect(() => {
    const el = ref.current
    if (el === null) return
    if (hidden && el.contains(el.ownerDocument?.activeElement ?? null)) {
      reveal()
      return
    }
    if (hidden) el.setAttribute('hidden', 'until-found')
    else el.removeAttribute('hidden')
  }, [hidden, reveal])
  useEffect(() => {
    const el = ref.current
    if (el === null) return
    el.addEventListener('beforematch', reveal)
    return () => {
      el.removeEventListener('beforematch', reveal)
    }
  }, [reveal])
  return ref
}

function ProcessReasoning({
  hidden,
  reveal,
  children,
}: {
  readonly hidden?: boolean | undefined
  readonly reveal?: (() => void) | undefined
  readonly children: ReactNode
}) {
  const ref = useSearchableHidden(hidden, reveal ?? NOOP)
  return (
    <div ref={ref} data-turn-process-inline={hidden || undefined}>
      {children}
    </div>
  )
}

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
}

type AssistantBlockLike = AssistantBlock

/** 助手正文：text 走官方 MarkdownText、reasoning 走官方 ReasoningRow（受折叠控制）、image 走官方槽、未知块 JsonBlock。 */
function AssistantBody({
  blocks,
  streaming,
  interrupted,
  renderMessageImages,
  reasoningHidden = false,
  revealProcess,
  mentions,
  labels,
  t,
}: {
  blocks: readonly AssistantBlockLike[]
  streaming: boolean
  interrupted?: boolean | undefined
  renderMessageImages: RenderMessageImages
  reasoningHidden?: boolean | undefined
  revealProcess?: (() => void) | undefined
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
              rendered.push(<DiagramCard key={`${key}-dg${subIndex}`} spec={sub.spec} />)
            } else if (sub.text !== '') {
              rendered.push(
                <MarkdownText key={`${key}-md${subIndex}`} text={sub.text} streaming={streaming} labels={labels} fileMentions={mentions} />,
              )
            }
          })
        }
        const parts = splitProtoTabs(block.text)
        if (parts.length === 1 && parts[0]?.kind === 'md' && parts[0].text.indexOf('diagram') < 0) {
          rendered.push(
            <MarkdownText key={index} text={block.text} streaming={streaming} labels={labels} fileMentions={mentions} />,
          )
        } else {
          parts.forEach((part, partIndex) => {
            if (part.kind === 'card') {
              rendered.push(<ProtoTabsCard key={`${index}-${partIndex}`} spec={part.spec} />)
            } else {
              pushMd(`${index}-${partIndex}`, part.text)
            }
          })
        }
        break
      }
      case 'reasoning':
        // 官方原生思考行（折叠态由 ProcessReasoning 隐藏，展开态展示）
        rendered.push(
          <ProcessReasoning key={index} hidden={reasoningHidden} reveal={revealProcess}>
            <ReasoningRow
              text={block.text}
              running={streaming && index === coalesced.length - 1}
              t={t}
            />
          </ProcessReasoning>,
        )
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
          <Fragment key={start}>
            {renderMessageImages({
              images: group.map(({ attachment }) => ({ attachment })),
              align: 'start',
            })}
          </Fragment>,
        )
        break
      }
      // 聚合进工具 chip（tool-call 槽位）；此处跳过。
      case 'tool-call':
        break
      default:
        rendered.push(
          <JsonBlock
            key={index}
            label={t('message.unknownBlock')}
            payload={block.block}
            truncatedLabel={total => t('json.truncated', { total })}
          />,
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
      .map(block => ({ text: block.text, running: stepRunning }))
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

  // 思考材料登记（首步负责）：抽屉里仍可查看思考分区
  useEffect(() => {
    if (isFirstStep && reasoningItems.length > 0 && turnNumber !== undefined) {
      activityStore().setReasoning(turnNumber, reasoningItems)
    }
  }, [isFirstStep, reasoningItems, turnNumber])

  // 本轮 git 相关调用：扫工具节点参数里的 git <动词>（见 tool-stats.gitVerbOf）。
  const gitVerbs = useMemo(() => {
    const verbs: string[] = []
    for (const node of toolNodes) {
      const verb = gitVerbOf(node.data.root)
      if (verb !== undefined) verbs.push(verb)
    }
    return verbs
  }, [toolNodes])
  const gitDetail = useMemo(() => [...new Set(gitVerbs)].join(' · '), [gitVerbs])
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
      durationMs: start !== undefined && end !== undefined ? Math.max(0, end - start) : undefined,
      steps: steps.length,
      tools: toolNodes.length,
      thinking: reasoningItems.length,
      git: gitVerbs.length > 0 ? gitVerbs.length : undefined,
      gitDetail: gitDetail !== '' ? gitDetail : undefined,
    }
  }, [showCard, reasoningItems.length, steps.length, timing, toolNodes.length, gitVerbs, gitDetail])
  const labels = useMemo(() => markdownLabelsFrom(t), [t])

  // 官方折叠规则：如果是紧凑折叠回合的最终回复步且未展开，隐藏思考行
  const reasoningHidden = turnProcess !== undefined
    && turnProcess.foldable
    && turnProcess.spec.answerStep === data.step
    && turnProcess.spec.inlineReasoning
    && !turnProcess.open
  const revealProcess = useCallback(() => {
    turnProcess?.setOpen(true)
  }, [turnProcess])

  const { hasVisible, rendered } = AssistantBody({
    blocks: data.blocks,
    streaming,
    interrupted,
    renderMessageImages,
    reasoningHidden,
    revealProcess,
    mentions,
    labels,
    t,
  })
  if (!hasVisible && gallery === undefined) return null

  return (
    <div className="dtt__assistant" data-streaming={streaming || undefined}>
      <div className="dtt__assistant-body">
        {rendered.length > 0 && (variant !== undefined
          ? <FlowCard variant={variant} meta={cardMeta} interrupted={interrupted}>{rendered}{gallery}</FlowCard>
          : <>{rendered}{gallery}</>)}
        {rendered.length === 0 && gallery}
        {interrupted && variant === undefined && <span className="dtt__stopped">已中断</span>}
      </div>
    </div>
  )
})
