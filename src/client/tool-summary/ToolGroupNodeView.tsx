/**
 * Tool entry node: shadows the built-in `tool-call` chat node at a lower slot
 * priority. Instead of rendering the whole tool tree inline, it collapses one
 * turn's calls into a single clickable chip; clicking opens the shared
 * activity drawer with the full call list and a summary card.
 *
 * The chip renders for the FIRST tool-call node of the turn (by the chat node
 * order); every sibling node of the same turn renders null.
 */

import { memo, useEffect, useMemo, useState } from 'react'
import type { ToolCallBlock } from '@deepseek-ai/dsh-client-runtime/client'
import type { ChatNode, ChatNodeViewProps, ChatViewSlotProps } from '@deepseek-ai/dsh-client-ui-chat/client'
// Type-only: activates the ui-chat / ui-tool SlotMap augmentation so ChatNodeViewProps
// resolves its owner/keyed share (selectedCallId, cwd, openFile, inspectCall…).
import type {} from '@deepseek-ai/dsh-client-ui-chat/client'
import type {} from '@deepseek-ai/dsh-client-ui-tool/client'
import { IconChevronDownOutline14, IconDownloadOutline16 } from '@deepseek-ai/dsh-client-ui-primitives'
import { callDurationMs, callName, callSummary, classifyActivity, collectRunningCalls, computeStats, formatDuration, isRunning, parseDownload, resultText, type DownloadInfo } from './tool-stats.ts'
import { classifyKind, type ActivityKind } from './activity-kind.ts'
import { KindIcon } from './icons.tsx'
import { useNow } from './use-now.ts'
import { activityStore, useDrawerOpen, type ActivityHandlers, type ActivityStore } from './activity-drawer.tsx'
import { LiveDownloadCard } from '../download/DownloadCard.tsx'
import { downloadPercent, useDownloadState } from '../download/api.ts'

const NS = 'dts'

const EMPTY: readonly ChatNode<'tool-call'>[] = []

/** One colored activity badge (SVG glyph + label), keyed by `data-kind` for CSS. */
function KindBadge({ kind }: { readonly kind: ActivityKind }) {
  return (
    <span className={`${NS}__badge`} data-kind={kind.key} title={kind.label}>
      <span className={`${NS}__badge-icon`} aria-hidden><KindIcon kind={kind.key} size={12} /></span>
      <span className={`${NS}__badge-text`}>{kind.label}</span>
    </span>
  )
}

/** Turn number owning one chat node, or undefined outside a turn/step location. */
function turnNumber(node: {
  readonly location?: { readonly kind?: string; readonly turn?: { readonly turn?: number } }
}): number | undefined {
  const location = node.location
  if (location === undefined) return undefined
  if (location.kind === 'turn' || location.kind === 'step') return location.turn?.turn
  return undefined
}

/** Handoff props the drawer needs from the seat (registered into the store). */
type HandoffProps = ActivityHandlers

/**
 * One simplified tool row used INSIDE the drawer: state dot, name, one-line
 * summary, and truncated expandable output. Also exported for the drawer.
 */
export const SimpleToolRow = memo(function SimpleToolRow({
  block, selected, cwd, openFile, inspectCall,
}: {
  readonly block: ToolCallBlock
  readonly selected: boolean
  readonly cwd?: string | undefined
  readonly openFile: (path: string) => void
  readonly inspectCall: (callId: string) => void
}) {
  const [open, setOpen] = useState(false)
  const running = isRunning(block)
  const name = callName(block)
  const argsRaw = 'kind' in block ? (block.call?.argsRaw ?? '') : block.argsRaw
  const summary = callSummary(block)
  const output = resultText(block)
  const failed = !running && block.isError
  const stopped = !running && !block.isError && block.error !== undefined
  const state = running ? 'running' : failed ? 'error' : stopped ? 'stopped' : 'ok'
  const now = useNow(running)
  const duration = callDurationMs(block, now)
  const activity = classifyActivity(block)
  const kind = classifyKind(block)
  // download 活动的运行中行：轮询真实进度（工具直查进度表；shell 的看护由
  // 流卡片注册，这里轮询同一 callId 即可看到百分比），抽屉里也能看到。
  const dlState = useDownloadState(running && activity === 'download' ? block.callId : undefined, running)
  const dlPct = downloadPercent(dlState)

  return (
    <div
      className={`${NS}__call`}
      data-selected={selected || undefined}
      data-state={state}
    >
      <div
        className={`${NS}__row`}
        role="button"
        tabIndex={0}
        aria-expanded={open}
        onClick={() => { setOpen(value => !value) }}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault()
            setOpen(value => !value)
          }
        }}
      >
        <span className={`${NS}__dot`} data-state={state} aria-hidden />
        <span className={`${NS}__row-name`}>{name || block.callId}</span>
        <KindBadge kind={kind} />
        <span className={`${NS}__row-summary`} title={summary}>{summary}</span>
        {running && duration !== undefined && activity === 'download' && (
          <span className={`${NS}__row-live`} data-kind="download" title="下载中">
            <span className={`${NS}__progress`} aria-hidden />
            <span>下载中{dlPct !== null ? ` · ${dlPct}%` : ''} · {formatDuration(duration)}</span>
          </span>
        )}
        {running && duration !== undefined && activity === 'command' && duration > 1000 && (
          <span className={`${NS}__row-live`} data-kind="command" title="执行中">
            <span className={`${NS}__progress`} aria-hidden />
            <span>执行中 · {formatDuration(duration)}</span>
          </span>
        )}
        {running && duration !== undefined
          && !(activity === 'download' || (activity === 'command' && duration > 1000)) && (
          <span className={`${NS}__row-time`} data-running title="耗时">
            ⏳ {formatDuration(duration)}
          </span>
        )}
        {!running && duration !== undefined && (
          <span className={`${NS}__row-time`} title="耗时">{formatDuration(duration)}</span>
        )}
        <button
          type="button"
          className={`${NS}__inspect`}
          title="在轨迹中查看"
          aria-label={`在轨迹中查看 ${name}`}
          onClick={(event) => {
            event.stopPropagation()
            inspectCall(block.callId)
          }}
        >
          ⤴
        </button>
        <span className={`${NS}__chevron`} data-open={open || undefined} aria-hidden>▶</span>
      </div>
      {open && (
        <div className={`${NS}__row-body`}>
          {argsRaw !== '' && (
            <div className={`${NS}__row-args`}>
              <span className={`${NS}__row-label`}>参数</span>
              <code>{argsRaw}</code>
            </div>
          )}
          {output !== '' && (
            <div className={`${NS}__row-output`}>
              <span className={`${NS}__row-label`}>输出</span>
              <pre className={`${NS}__row-pre`}>{output}</pre>
            </div>
          )}
          {argsRaw === '' && output === '' && (
            <div className={`${NS}__row-empty`}>{running ? '执行中…' : '无输出'}</div>
          )}
        </div>
      )}
    </div>
  )
})

/** Recursive call list for the drawer (root + subcalls). */
export function ToolCallTreeList({ block, cwd, openFile, inspectCall }: {
  readonly block: ToolCallBlock
  readonly cwd?: string | undefined
  readonly openFile: (path: string) => void
  readonly inspectCall: (callId: string) => void
}) {
  return (
    <div className={`${NS}__drawer-call`}>
      <SimpleToolRow
        block={block}
        selected={false}
        cwd={cwd}
        openFile={openFile}
        inspectCall={inspectCall}
      />
      {block.subCalls.length > 0 && (
        <div className={`${NS}__subcalls`} data-subcalls>
          {block.subCalls.map(child => (
            <ToolCallTreeList key={child.callId} block={child} cwd={cwd} openFile={openFile} inspectCall={inspectCall} />
          ))}
        </div>
      )}
    </div>
  )
}

/**
 * The entry chip: one compact line that opens the drawer. Registered into the
 * shared store so the drawer can render the full material without re-reading
 * the conversation projection.
 */
const ToolEntry = memo(function ToolEntry({
  nodes, turn, turnStart, cwd, openFile, inspectCall, t, turnProcess,
}: {
  readonly nodes: readonly ChatNode<'tool-call'>[]
  readonly turn: number
  readonly turnStart?: number | undefined
  readonly cwd?: string | undefined
  readonly openFile: (path: string) => void
  readonly inspectCall: (callId: string) => void
  readonly t: ChatViewSlotProps['t']
  readonly turnProcess?: { readonly foldable: boolean } | undefined
}) {
  const store: ActivityStore = activityStore()
  useEffect(() => {
    store.setTools(turn, nodes, cwd, turnStart)
    store.setHandlers({ openFile, inspectCall })
  }, [store, turn, nodes, cwd, turnStart, openFile, inspectCall])
  const stats = useMemo(() => computeStats(nodes.map(node => node.data.root)), [nodes])
  const running = stats.running > 0
  // 官方 control 行接管时（紧凑模式 closed 回合）本行让位：只登记抽屉数据，
  // 不占行（control 影子行是唯一的入口）。running 与接管互斥（接管要求回合
  // closed，运行时 control 不 foldable），因此直接整体返回 null 即可，实时卡
  // 片只在运行时出现、不受影响。
  const controlActive = turnProcess?.foldable === true
  // 抽屉开合态：官方 turn-process 行靠 data-open 把 chevron 转下来，这里同行。
  const drawerOpen = useDrawerOpen(turn)
  const now = useNow(running)
  // "当前工具"的时长：取仍在运行的最早一个 tool/call 时间，而不是整轮 turn 开始时间。
  const toolStart = useMemo(() => {
    let earliest: number | undefined
    for (const node of nodes) {
      const block = node.data.root
      if (isRunning(block) && (earliest === undefined || block.time < earliest)) earliest = block.time
    }
    return earliest
  }, [nodes])
  const elapsed = toolStart !== undefined ? Math.max(0, now - toolStart) : undefined
  // 统计仍在运行的工具类型，决定是否在对话流外面直接显示下载/执行进度卡片。
  const liveActivity = useMemo(() => {
    let hasDownload = false
    let hasCommand = false
    let downloadInfo: DownloadInfo | undefined
    for (const node of nodes) {
      const block = node.data.root
      if (!isRunning(block)) continue
      const activity = classifyActivity(block)
      if (activity === 'download') {
        hasDownload = true
        if (downloadInfo === undefined) downloadInfo = parseDownload(block)
      } else if (activity === 'command') {
        hasCommand = true
      }
    }
    return { hasDownload, hasCommand, downloadInfo }
  }, [nodes])
  // 运行中的下载调用（root 或 run_code 子调用）：download 工具走 host 进度表；
  // shell 下载（curl/iwr -OutFile/-o 等解析出落盘路径）注册文件看护——host stat
  // 字节增长合成同形进度，真实速度/百分比。无落盘路径的 API 抓取回落不定长卡。
  const liveDownloadCalls = useMemo(
    () => nodes
      .flatMap(node => collectRunningCalls(node.data.root))
      .map(block => {
        const isTool = callName(block) === 'download'
        // 只给「确实是下载」的调用挂卡：跑构建/改文件的 shell 命令不算。
        const info = isTool || classifyActivity(block) === 'download' ? parseDownload(block) : undefined
        return {
          block,
          url: info?.url ?? '',
          outputPath: isTool ? undefined : (info?.output || undefined),
        }
      })
      .filter(({ block, outputPath }) => callName(block) === 'download' || outputPath !== undefined)
      .slice(0, 3),
    [nodes],
  )
  const showDownload = running && liveActivity.hasDownload && liveDownloadCalls.length === 0
  const showCommand = running && !liveActivity.hasDownload && liveDownloadCalls.length === 0 && liveActivity.hasCommand && (elapsed ?? 0) > 1000
  // 文案与官方 TurnProcessNodeView 逐字一致（同 chat locale 键）；运行中保持
  // 原有的实时时长（官方行在流式期不存在，进抽屉前给个活指示）。
  const label = running
    ? elapsed !== undefined ? `工具调用中 · ${formatDuration(elapsed)}` : '工具调用中'
    : t(stats.total === 1 ? 'message.turnProcess.toolCalls.one' : 'message.turnProcess.toolCalls.other', { count: stats.total })
  if (controlActive) return null

  return (
    <div className={`${NS}__entry-wrap`}>
      <button
        type="button"
        className={`${NS}__process`}
        data-open={drawerOpen || undefined}
        data-running={running || undefined}
        data-turn-process={turn}
        data-turn-process-tool-calls={stats.total}
        data-turn-process-messages={0}
        data-turn-process-subagents={0}
        aria-expanded={drawerOpen}
        aria-label={label}
        onClick={(event) => {
          event.currentTarget.focus()
          store.open(turn, 'tools')
        }}
      >
        <span className={`${NS}__process-label`}>{label}</span>
        <IconChevronDownOutline14 className={`${NS}__process-chevron`} />
      </button>
      {liveDownloadCalls.map(({ block, url, outputPath }) => (
        <LiveDownloadCard key={block.callId} callId={block.callId} url={url} startedAt={block.time} outputPath={outputPath} />
      ))}
      {showDownload && (
        <div className={`${NS}__download-card`}>
          <div className={`${NS}__download-head`}>
            <IconDownloadOutline16 size={14} aria-hidden />
            <span className={`${NS}__download-title`}>下载中 · {formatDuration(elapsed ?? 0)}</span>
          </div>
          {liveActivity.downloadInfo?.url !== undefined && liveActivity.downloadInfo.url !== '' && (
            <div className={`${NS}__download-url`} title={liveActivity.downloadInfo.url}>{liveActivity.downloadInfo.url}</div>
          )}
          {liveActivity.downloadInfo?.output !== undefined && liveActivity.downloadInfo.output !== '' && (
            <div className={`${NS}__download-dest`} title={liveActivity.downloadInfo.output}>保存到 <code>{liveActivity.downloadInfo.output}</code></div>
          )}
          <div className={`${NS}__download-progress`}><span className={`${NS}__progress`} aria-hidden /></div>
        </div>
      )}
      {showCommand && (
        <div className={`${NS}__entry-live`} data-kind="command">
          <span className={`${NS}__progress`} aria-hidden />
          <span>执行中 · {formatDuration(elapsed ?? 0)}</span>
        </div>
      )}
    </div>
  )
})

/** Shadows the built-in `tool-call` renderer: one chip per turn, drawer on click. */
export const ToolGroupNodeView = memo(function ToolGroupNodeView(props: ChatNodeViewProps<'tool-call'>) {
  const { node, useChat, cwd, openFile, inspectCall, t, turnProcess } = props
  const turn = turnNumber(node)
  const nodes = useChat(snapshot => {
    if (turn === undefined) return EMPTY
    return snapshot.locations.getTurn(turn)
      .map(key => snapshot.nodes.get(key))
      .filter((candidate): candidate is ChatNode<'tool-call'> => (
        candidate !== undefined && candidate.kind === 'tool-call'
      ))
  })
  const turnStart = useChat(snapshot => {
    if (turn === undefined) return undefined
    return snapshot.legacy.turnTimings.get(turn)?.startTime
  })
  if (nodes.length === 0) return null
  // Only the first node of the turn renders the chip; siblings render empty.
  if (node.key !== nodes[0]?.key) return null
  return (
    <ToolEntry
      nodes={nodes}
      turn={turn as number}
      turnStart={turnStart}
      cwd={cwd}
      openFile={openFile}
      inspectCall={inspectCall}
      t={t}
      turnProcess={turnProcess}
    />
  )
})