/**
 * Shared activity drawer: a window-level bus that collects one turn's
 * reasoning and tool-call material from the two shadow plugins, plus the
 * right-side drawer panel that renders it on demand.
 *
 * dsh-better-markdown publishes `reasoning` entries; dsh-tool-summary
 * publishes `tools` and hosts the panel. Both read the same window key, so
 * the bus is created lazily by whichever plugin touches it first.
 */

import { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } from 'react'
import { createRoot } from 'react-dom/client'
import { IconApiOutline14, IconThinkOutline14 } from '@deepseek-ai/dsh-client-ui-primitives'
import type { ChatNode } from '@deepseek-ai/dsh-client-ui-chat/client'
import type { ToolCallBlock } from '@deepseek-ai/dsh-client-runtime/client'
import { computeStats, formatDuration, isRunning, shortenPath, type ToolStats } from './tool-stats.ts'
import { kindByToolName, type ActivityKind } from './activity-kind.ts'
import { KindIcon } from './icons.tsx'
import { useNow } from './use-now.ts'
import { groupReasoning } from './reasoning-classify.ts'
import { ToolCallTreeList } from './ToolGroupNodeView.tsx'

/** One reasoning block stranded in the drawer. */
export interface ActivityReasoningItem {
  readonly text: string
  readonly running: boolean
}

/** Everything the drawer can show for one turn. */
export interface ActivityTurnData {
  readonly reasoning?: readonly ActivityReasoningItem[]
  readonly tools?: readonly ChatNode<'tool-call'>[]
  readonly toolsCwd?: string | undefined
  readonly turnStart?: number | undefined
}

/** The cross-plugin bus shape. */
export type ViewMode = 'reasoning' | 'tools'

export interface ActivityHandlers {
  readonly openFile: (path: string) => void
  readonly inspectCall: (callId: string) => void
}

/** Click-position anchor: the popover slides out beside this rect. */
export interface PopoverAnchor {
  readonly top: number
  readonly left: number
  readonly right: number
  readonly bottom: number
}

export interface ActivityStore {
  readonly openTurn: number | null
  readonly activeMode: ViewMode | null
  readonly openAnchor: PopoverAnchor | undefined
  open(turn: number, mode: ViewMode, anchor?: PopoverAnchor): void
  close(): void
  setReasoning(turn: number, items: readonly ActivityReasoningItem[]): void
  setTools(turn: number, nodes: readonly ChatNode<'tool-call'>[], cwd: string | undefined, turnStart: number | undefined): void
  setHandlers(handlers: ActivityHandlers): void
  subscribe(fn: () => void): () => void
  get(turn: number): ActivityTurnData | undefined
  handlers(): ActivityHandlers
}

const STORE_KEY = '__dshActivityDrawerStore__'

/** Create-or-read the shared window bus. */
export function activityStore(): ActivityStore {
  const globalObj = globalThis as Record<string, unknown>
  const existing = globalObj[STORE_KEY] as ActivityStore | undefined
  if (existing !== undefined) return existing
  const listeners = new Set<() => void>()
  const data = new Map<number, ActivityTurnData>()
  let openTurn: number | null = null
  let activeMode: ViewMode | null = null
  let openAnchor: PopoverAnchor | undefined
  let handlers: ActivityHandlers = { openFile: () => {}, inspectCall: () => {} }
  const notify = (): void => {
    for (const fn of [...listeners]) {
      try { fn() } catch { /* a dying listener must not kill the bus */ }
    }
  }
  const store: ActivityStore = {
    get openTurn() { return openTurn },
    get activeMode() { return activeMode },
    get openAnchor() { return openAnchor },
    open: (turn, mode, anchor) => { openTurn = turn; activeMode = mode; openAnchor = anchor; notify() },
    close: () => { openTurn = null; activeMode = null; openAnchor = undefined; notify() },
    setReasoning: (turn, items) => {
      data.set(turn, { ...(data.get(turn) ?? {}), reasoning: items })
      notify()
    },
    setTools: (turn, nodes, cwd, turnStart) => {
      data.set(turn, { ...(data.get(turn) ?? {}), tools: nodes, toolsCwd: cwd, turnStart })
      notify()
    },
    setHandlers: (next) => { handlers = next },
    subscribe: (fn) => {
      listeners.add(fn)
      return () => { listeners.delete(fn) }
    },
    get: (turn) => data.get(turn),
    handlers: () => handlers,
  }
  globalObj[STORE_KEY] = store
  return store
}

/**
 * Whether the shared drawer is currently open for one turn. Entry rows bind
 * it to `data-open` so the chevron mirrors the official turn-process row
 * (closed = chevron points left, open = points down).
 */
/** Drawer tab: which panel the modal shows (row click picks the initial one). */
export type DrawerTab = ViewMode

export function useDrawerOpen(turn: number): boolean {
  const store = activityStore()
  return useSyncExternalStore(store.subscribe, () => store.openTurn === turn)
}

/** Summary card for the drawer's tool section. */
function DrawerToolSummary({ stats, cwd, openFile, kinds }: {
  readonly stats: ToolStats
  readonly cwd?: string | undefined
  readonly openFile: (path: string) => void
  readonly kinds: ReadonlyMap<string, ActivityKind>
}) {
  return (
    <div className="dts__summary">
      <div className="dts__summary-title"><IconApiOutline14 size={13} aria-hidden /> 工具调用总结</div>
      <div className="dts__summary-line">
        共 <b>{stats.total}</b> 次调用
        {stats.running > 0 && <> · <b>{stats.running}</b> 次进行中</>}
        {stats.errors > 0 && <> · ⚠ <b>{stats.errors}</b> 次失败</>}
      </div>
      {stats.byTool.length > 0 && (
        <div className="dts__chips">
          {stats.byTool.map(({ name, count }) => (
            <span key={name} className="dts__chip" data-tool={name} data-kind={kinds.get(name)?.key}>{name} ×{count}</span>
          ))}
        </div>
      )}
      {stats.files.length > 0 && (
        <div className="dts__files">
          {stats.files.map(path => (
            <button
              key={path}
              type="button"
              className="dts__file"
              title={path}
              onClick={() => { openFile(path) }}
            >
              {shortenPath(path, cwd)}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

/** Classified reasoning blocks with per-category headings. */
function ReasoningGroups({ items, activeIndex }: {
  readonly items: readonly ActivityReasoningItem[]
  readonly activeIndex: number | null
}) {
  const groups = useMemo(() => groupReasoning(items), [items])
  let cursor = 0
  return (
    <div className="dts__modal-reasoning">
      {groups.map(group => {
        const firstIndex = cursor
        cursor += group.items.length
        return (
          <div key={group.category.label} className="dts__modal-reasoning-group" data-reasoning-category={group.category.label}>
            <div className="dts__modal-reasoning-group-title">
              <KindIcon kind={group.category.icon} size={12} /> {group.category.label} ({group.items.length})
            </div>
            {group.items.map((item) => {
              const globalIndex = firstIndex + group.items.indexOf(item)
              return (
                <div
                  key={globalIndex}
                  data-reasoning-index={globalIndex}
                  data-active={activeIndex === globalIndex || undefined}
                  className="dts__modal-reasoning-item"
                  data-running={item.running || undefined}
                >
                  <span className="dts__modal-reasoning-item-index" aria-hidden>{globalIndex + 1}</span>
                  <span className="dts__modal-reasoning-item-text">{item.text}</span>
                </div>
              )
            })}
          </div>
        )
      })}
    </div>
  )
}

/** The anchored popover: two separate panels — thinking and tools. */
function DrawerPanel({ turn, data, store, anchor, openFile, inspectCall }: {
  readonly turn: number
  readonly data: ActivityTurnData | undefined
  readonly store: ActivityStore
  readonly anchor: PopoverAnchor | undefined
  readonly openFile: (path: string) => void
  readonly inspectCall: (callId: string) => void
}) {
  const reasoning = data?.reasoning ?? []
  const toolNodes = data?.tools ?? []
  const blocks = useMemo(() => toolNodes.map(node => node.data.root), [toolNodes])
  const stats = useMemo(() => computeStats(blocks), [blocks])
  const kinds = useMemo(() => kindByToolName(blocks), [blocks])
  const close = (): void => { store.close() }
  const mode = store.activeMode
  // 分区页签：行点击只决定初始分区（工具有工具、纯思考进思考），两个分区
  // 都有内容时页签常驻可切——单行合并后不能再让思考“消失”。面板按 key=turn
  // 重挂，mode 变化（同轮重开）时跟随。
  const [tab, setTab] = useState<DrawerTab>(mode ?? (reasoning.length > 0 ? 'reasoning' : 'tools'))
  useEffect(() => { if (mode !== null) setTab(mode) }, [mode])
  const showTabs = reasoning.length > 0 && toolNodes.length > 0
  // 下划线用选中页签自己的 ::after 画（纯 CSS，见 styles），切换时新线展开
  // 0.22s——不量位置、不插指示条元素，任何环境都不会走样。

  // Live elapsed time + auto-scroll while the turn is still working.
  const reasoningRunning = reasoning.some(item => item.running)
  const toolsRunning = stats.running > 0
  const anyRunning = reasoningRunning || toolsRunning
  const now = useNow(anyRunning)
  const turnStart = data?.turnStart
  const elapsed = turnStart !== undefined ? Math.max(0, now - turnStart) : undefined
  // "当前工具"的时长：取仍在运行的最早一个 tool/call 时间，而非整轮 turn 总时长。
  const toolsElapsed = useMemo(() => {
    let earliest: number | undefined
    for (const node of toolNodes) {
      const block = node.data.root
      if (isRunning(block) && (earliest === undefined || block.time < earliest)) earliest = block.time
    }
    return earliest !== undefined ? Math.max(0, now - earliest) : undefined
  }, [toolNodes, now])
  const scrollRef = useRef<HTMLDivElement | null>(null)
  // 打开的卡片不强制压着读者走：仅在读者钉在底部时跟随新内容滚到底；
  // 向上翻阅即停止自动滚动（想看哪里自己滚），滚回底部（≤24px）自动恢复。
  // 阈值与 ChatView 的 FOLLOW_THRESHOLD 一致；滚动事件记录「是否钉底」，
  // 纯几何判断无法区分「内容自己长高」和「读者上翻」，必须有这面旗子。
  const pinnedRef = useRef(true)
  const onScrollPin = useCallback((event: React.UIEvent<HTMLDivElement>): void => {
    const el = event.currentTarget
    pinnedRef.current = el.scrollHeight - el.scrollTop - el.clientHeight <= 24
  }, [])
  useEffect(() => {
    if (!anyRunning) return
    const el = scrollRef.current
    if (el === null) return
    const distance = el.scrollHeight - el.scrollTop - el.clientHeight
    // 双保险：滚动事件尚未派发的一帧内，几何距离也能拦住一次误跟随。
    if (!pinnedRef.current && distance > 24) return
    el.scrollTop = el.scrollHeight
  }, [anyRunning, now, reasoning, toolNodes])

  // Jump navigation over reasoning items (querySelector over refs: refs get
  // cleared by effects and are unreliable across re-renders).
  const [activeIndex] = useState<number | null>(null)

  // 气泡定位：从点击文字后面（右缘 + 8px 缝）钻出来，气泡顶与文字顶对齐
  // （尾巴指向文字行中心）；右侧放不下就贴窗口右缘。没有锚点时贴右缘兜底。
  const POPOVER_WIDTH = 420
  const GAP = 8
  const viewportW = typeof window !== 'undefined' ? window.innerWidth : 1440
  const viewportH = typeof window !== 'undefined' ? window.innerHeight : 900
  const anchorTop = Math.max(8, Math.min((anchor?.top ?? 80) - 6, viewportH - 120))
  const anchorLeft = Math.max(8, Math.min(
    (anchor?.right ?? viewportW - 24) + GAP,
    viewportW - POPOVER_WIDTH - 8,
  ))
  const maxH = Math.min(640, viewportH - anchorTop - 24)
  const popHeight = maxH > 280 ? maxH : 320

  return (
    <>
      <div className="dts__popover-veil" onClick={close} aria-hidden />
      <div className="dts__popover" role="dialog" aria-label={`第 ${turn} 轮活动详情`} style={{ top: anchorTop, left: anchorLeft, height: popHeight, ['--dts-pop-tail' as string]: `${Math.max(10, Math.min((anchor?.top ?? 80) - anchorTop + 4, popHeight - 40))}px` }}>
        <header className="dts__modal-head">
          <span className="dts__modal-title">
            第 {turn} 轮
            {!showTabs && tab === 'reasoning' && (
              <> · <IconThinkOutline14 size={14} aria-hidden /> {reasoning.length}</>
            )}
            {!showTabs && tab === 'tools' && (
              <> · <IconApiOutline14 size={14} aria-hidden /> {toolNodes.length}</>
            )}
          </span>
          {showTabs && (
            <span className="dts__tabs" role="tablist" aria-label="分区">
              <button
                type="button"
                role="tab"
                aria-selected={tab === 'reasoning'}
                className="dts__tab"
                data-active={tab === 'reasoning' || undefined}
                onClick={() => { setTab('reasoning') }}
              >
                <IconThinkOutline14 size={13} aria-hidden /> 思考 {reasoning.length}
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={tab === 'tools'}
                className="dts__tab"
                data-active={tab === 'tools' || undefined}
                onClick={() => { setTab('tools') }}
              >
                <IconApiOutline14 size={13} aria-hidden /> 工具 {toolNodes.length}
              </button>
            </span>
          )}
          <button type="button" className="dts__modal-close" onClick={close} aria-label="关闭">✕</button>
        </header>
        <div className="dts__modal-scroll" ref={scrollRef} onScroll={onScrollPin}>
          {tab === 'reasoning' && reasoning.length > 0 && (
            <div className="dts__modal-panel">
              <header className="dts__modal-panel-head">
                <span className="dts__modal-panel-title"><IconThinkOutline14 size={14} aria-hidden /> 思考过程</span>
                {reasoningRunning && elapsed !== undefined && (
                  <span className="dts__modal-panel-live">思考中 · {formatDuration(elapsed)}</span>
                )}
              </header>
              <ReasoningGroups items={reasoning} activeIndex={activeIndex} />
            </div>
          )}
          {tab === 'tools' && toolNodes.length > 0 && (
            <div className="dts__modal-panel">
              <header className="dts__modal-panel-head">
                <span className="dts__modal-panel-title"><IconApiOutline14 size={14} aria-hidden /> 工具调用</span>
                {toolsRunning && toolsElapsed !== undefined && (
                  <span className="dts__modal-panel-live">进行中 · {formatDuration(toolsElapsed)}</span>
                )}
              </header>
              <DrawerToolSummary stats={stats} cwd={data?.toolsCwd} openFile={openFile} kinds={kinds} />
              <div className="dts__modal-tools">
                {toolNodes.map(node => (
                  <ToolCallTreeList
                    key={node.key}
                    block={node.data.root}
                    cwd={data?.toolsCwd}
                    openFile={openFile}
                    inspectCall={inspectCall}
                  />
                ))}
              </div>
            </div>
          )}
          {reasoning.length === 0 && toolNodes.length === 0 && (
            <div className="dts__empty">这一轮没有可显示的思考或工具调用</div>
          )}
        </div>
      </div>
    </>
  )
}

/** Drawer app: subscribes to the bus and renders the panel when open. */
function DrawerApp() {
  const [openTurn, setOpenTurn] = useState<number | null>(null)
  const [data, setData] = useState<ActivityTurnData | undefined>(undefined)
  const [anchor, setAnchor] = useState<PopoverAnchor | undefined>(undefined)
  useEffect(() => {
    const store = activityStore()
    const render = (): void => {
      const turn = store.openTurn
      setOpenTurn(turn)
      setData(turn === null ? undefined : store.get(turn))
      setAnchor(turn === null ? undefined : store.openAnchor)
    }
    render()
    return store.subscribe(render)
  }, [])
  // Esc 关气泡。
  useEffect(() => {
    if (openTurn === null) return
    const onKey = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') activityStore().close()
    }
    window.addEventListener('keydown', onKey)
    return () => { window.removeEventListener('keydown', onKey) }
  }, [openTurn])
  // 滚动时气泡跟着锚走：锚是打开瞬间的屏幕坐标，列表一滚气泡必须收起
  // （跟手但不跟随，避免每帧重算的抖动——官方 popover 也是这个策略）。
  useEffect(() => {
    if (openTurn === null) return
    const onScroll = (): void => { activityStore().close() }
    window.addEventListener('scroll', onScroll, { passive: true, capture: true })
    return () => { window.removeEventListener('scroll', onScroll, { capture: true } as EventListenerOptions) }
  }, [openTurn])
  if (openTurn === null) return null
  const store = activityStore()
  const handlers = store.handlers()
  return (
    <DrawerPanel
      key={openTurn}
      turn={openTurn}
      data={data}
      store={store}
      anchor={anchor}
      openFile={handlers.openFile}
      inspectCall={handlers.inspectCall}
    />
  )
}

let mounted = false

/** Mount the drawer root once (idempotent). */
export function mountActivityDrawer(): void {
  if (mounted) return
  mounted = true
  if (typeof document === 'undefined') return
  if (document.getElementById('dsh-activity-drawer-root') !== null) return
  const host = document.createElement('div')
  host.id = 'dsh-activity-drawer-root'
  document.body.appendChild(host)
  createRoot(host).render(<DrawerApp />)
}