/**
 * dsh-chat-plus — KR 右栏「记忆」卡片。
 *
 * 用户要的三件事：
 *  1. **常驻底部**：卡片挂在滚动区之下的独立 flex footer（.kr-panel__memory-dock，
 *     见 KrAgentPanel 与 styles.ts），永远钉在右栏最下方——无论内容多少、无论
 *     滚动位置，随时可以删；
 *  2. **口径 = 本会话新增，有新增才显示**：两个分区（工作区 / 全局）都只列
 *     「这个会话写下 / 更新过」的条目，为的是「一眼看清这次对话新记了哪些」。
 *     没有新增的分区**整个不出现**（连「暂无」占位行都不留），两个分区都无新增
 *     时卡体收成一行头部。工作区分区再叠加当前 cwd 对应 projectHash 的限定
 *     （path 匹配，不自己复刻 sha1 算法）。
 *
 *     「这个会话写下」按**条目溯源**判定：host 在写入/更新条目时把
 *     `provenance.sessionId` 一并落盘（自动提取、memory_remember / memory_revise
 *     都填），前端拿当前 sessionId 做纯等值比较——不掺任何时间口径。旧实现按
 *     「进入会话的时间基线」猜（localStorage + 5 分钟时钟冗余），时钟偏差、刷新
 *     时机、切会话都会把别的会话的记忆误判成本会话的，已被替换。
 *
 *  3. **可批量删**：分区标题行「选择」进多选态，勾若干条一次删完，删除前有
 *     一次行内二次确认（不做模态弹窗，避免打断大盘阅读）。
 *
 * 记忆模块不可用（fetch 失败 / 404 / 旧 host 没挂路由）时整卡不崩：降级成一行
 * 「记忆模块未就绪」，其余卡片照常工作。
 *
 * 之所以把「内容变了要重新测量」上报给 KrAgentPanel：记忆卡条目数直接决定右栏
 * 溢出程度，而挤压自适应（use-adaptive-rows.ts）需要知道这件事才重算思考卡行数。
 */
import { memo, useCallback, useEffect, useMemo, useState } from 'react'
import {
  deleteMemoryBatch,
  listMemory,
  listProjects,
  memoryKindLabel,
  pinMemoryEntry,
  type MemoryEntryView,
  type ProjectView,
} from './memory-api.ts'
import { getLatestChatSessionId, subscribeLatestChatSnapshot } from '../tool-summary/TurnProcessShadowView.tsx'

/** 两个分区的 key。 */
type SectionKey = 'workspace' | 'global'

/** 每个分区默认 preview 的条数（超出点「展开其余」，避免一屏全是记忆）。
 *  与 .kr-memory__list 的 max-height 成对维护：只抬条数会被封顶裁掉，只抬封顶
 *  则条数不够撑不满，两边一起抬记忆卡的默认高度才真翻一倍。 */
const SECTION_PREVIEW_COUNT = 16

/** 单个分区的交互态（选择 / 二次确认 / 请求中 / 行内报错 / 展开 / 已选）。 */
interface SectionState {
  /** 多选态：每行出现 checkbox，标题行换成「已选 N 条 · 删除 · 取消」。 */
  selecting: boolean
  /** 二次确认态：删除按钮变成「确认删除 N 条？」+ 确认/取消。 */
  confirming: boolean
  busy: boolean
  error: string
  /** 是否展开全部条目（默认只 preview 前几条）。 */
  showAll: boolean
  selected: ReadonlySet<string>
}

const EMPTY_SECTION: SectionState = {
  selecting: false,
  confirming: false,
  busy: false,
  error: '',
  showAll: false,
  selected: new Set<string>(),
}

/**
 * 替换 records[key]。
 *
 * 之所以不用 `{ ...record, [key]: value }`：key 是联合字面量类型时，TS 的计算
 * 属性只会产出字符串索引签名，赋不回具名的 Record<SectionKey, …>。显式写死两个
 * key 最稳，也只有两行。
 */
function replaceSection(
  record: Record<SectionKey, SectionState>,
  key: SectionKey,
  value: SectionState,
): Record<SectionKey, SectionState> {
  return key === 'workspace'
    ? { workspace: value, global: record.global }
    : { workspace: record.workspace, global: value }
}

/** 按更新时间倒序（新的在前）。时间解析失败排最后。 */
function byUpdatedDesc(a: MemoryEntryView, b: MemoryEntryView): number {
  const ta = Date.parse(a.updatedAt)
  const tb = Date.parse(b.updatedAt)
  if (!Number.isFinite(ta) && !Number.isFinite(tb)) return 0
  if (!Number.isFinite(ta)) return 1
  if (!Number.isFinite(tb)) return -1
  return tb - ta
}

/** 归一化路径：统一分隔符、去尾部斜杠（Windows 会话 cwd 常带 `\`，host 存的是原样）。 */
function normalizeMemoryPath(value: string): string {
  return value.replace(/[\\/]+/g, '/').replace(/\/+$/, '')
}

/** 是否 Windows 盘符 / UNC 路径（这些大小写不敏感，其余平台大小写敏感）。 */
function isWindowsMemoryPath(value: string): boolean {
  return /^[a-z]:\//i.test(value) || value.startsWith('//')
}

/** 两条路径是否指向同一个目录。 */
function sameMemoryPath(a: string, b: string): boolean {
  const na = normalizeMemoryPath(a)
  const nb = normalizeMemoryPath(b)
  if (na === '' || nb === '') return false
  if (na === nb) return true
  if (isWindowsMemoryPath(na) && isWindowsMemoryPath(nb)) return na.toLowerCase() === nb.toLowerCase()
  return false
}

/**
 * 从项目注册表里挑出「当前 cwd 对应的项目」。
 *
 * 先找全等；找不到再退一步找「项目路径是 cwd 的前缀」里最长的那条——会话常
 * 从仓库子目录发起，而 host 记忆挂在仓库根 hash 上，纯全等会漏。
 * 取最长前缀是为了在「多个项目互为父子」时选最贴近的那个；同时要求前缀必须
 * 落在目录边界上，否则 `D:/AI/Dsh2` 会误匹配 `D:/AI/Dsh`。
 */
function pickWorkspaceProject(projects: readonly ProjectView[], cwd: string): ProjectView | null {
  const target = normalizeMemoryPath(cwd)
  if (target === '') return null
  const exact = projects.find((project) => sameMemoryPath(project.path, target))
  if (exact !== undefined) return exact
  let best: ProjectView | null = null
  let bestLength = -1
  for (const project of projects) {
    const base = normalizeMemoryPath(project.path)
    if (base === '') continue
    const insensitive = isWindowsMemoryPath(target) && isWindowsMemoryPath(base)
    const needle = insensitive ? target.toLowerCase() : target
    const prefix = insensitive ? base.toLowerCase() : base
    if (!needle.startsWith(prefix)) continue
    const next = needle[prefix.length]
    if (next !== undefined && next !== '/') continue
    if (base.length > bestLength) {
      best = project
      bestLength = base.length
    }
  }
  return best
}

/** 当前会话的工作目录（读 client ctx 上的 sessions 快照；取不到返回空串）。 */
function resolveCurrentCwd(sessionId: string | null): string {
  try {
    const ctx = (window as unknown as { __dshClientCtx__?: { get?: (name: string) => unknown } }).__dshClientCtx__
    const sessions = ctx?.get?.('sessions') as
      | { list?: { getSnapshot?: () => { byId?: Record<string, { cwd?: string } | undefined> } } }
      | undefined
    const byId = sessions?.list?.getSnapshot?.()?.byId
    const cwd = sessionId !== null ? byId?.[sessionId]?.cwd : undefined
    return typeof cwd === 'string' ? cwd : ''
  } catch {
    return ''
  }
}

/** 相对时间：3 分钟内「刚刚」，之后分/时/天，超过一周退回具体日期。 */
function formatWhen(iso: string): string {
  const at = Date.parse(iso)
  if (!Number.isFinite(at)) return ''
  const diff = Date.now() - at
  if (diff < 60_000) return '刚刚'
  if (diff < 3_600_000) return `${Math.floor(diff / 60_000)} 分钟前`
  if (diff < 86_400_000) return `${Math.floor(diff / 3_600_000)} 小时前`
  if (diff < 7 * 86_400_000) return `${Math.floor(diff / 86_400_000)} 天前`
  const date = new Date(at)
  const pad = (value: number): string => String(value).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
}

/** 目录名（分区副标题用；取不到就回落整串路径）。 */
function dirName(path: string): string {
  const normalized = normalizeMemoryPath(path)
  if (normalized === '') return ''
  const parts = normalized.split('/')
  return parts[parts.length - 1] || normalized
}

export interface KrMemoryCardProps {
  /** 右栏高度输入变化时通知大盘重算思考卡行数（见 use-adaptive-rows.ts）。 */
  readonly onContentChange?: () => void
  /** 右栏是否已被挤压（思考卡行数低于默认）：挤压态下记忆列表进一步让步。 */
  readonly squeezed?: boolean
}

/** 记忆卡片（常驻右栏底部）。 */
export const KrMemoryCard = memo(function KrMemoryCard({
  onContentChange,
  squeezed = false,
}: KrMemoryCardProps) {
  const [sessionKey, setSessionKey] = useState<string>(() => getLatestChatSessionId() ?? '')
  const [reloadToken, setReloadToken] = useState(0)
  const [status, setStatus] = useState<'loading' | 'ready' | 'unavailable'>('loading')
  const [entries, setEntries] = useState<readonly MemoryEntryView[]>([])
  const [projects, setProjects] = useState<readonly ProjectView[]>([])
  const [cwd, setCwd] = useState('')
  const [workspaceHash, setWorkspaceHash] = useState<string | null>(null)
  const [collapsed, setCollapsed] = useState(false)
  const [openedIds, setOpenedIds] = useState<ReadonlySet<string>>(() => new Set())
  const [sections, setSections] = useState<Record<SectionKey, SectionState>>({
    workspace: EMPTY_SECTION,
    global: EMPTY_SECTION,
  })

  // 会话身份变化才重新拉记忆（subscriber 在流式期间每秒触发多次，绝不能跟着重拉）。
  useEffect(() => {
    return subscribeLatestChatSnapshot(() => {
      const id = getLatestChatSessionId() ?? ''
      setSessionKey((previous) => (previous === id ? previous : id))
    })
  }, [])

  // 会话切换：清掉上一个会话/工作区的记忆，等新数据到位再渲染。绝不能复用
  // 旧 state——那半秒里右栏挂的会是别的项目的记忆，还可能被误删。
  useEffect(() => {
    setEntries([])
    setProjects([])
    setWorkspaceHash(null)
    setCwd('')
    setOpenedIds(new Set<string>())
    setSections({ workspace: EMPTY_SECTION, global: EMPTY_SECTION })
  }, [sessionKey])

  // 拉全量 + 解析当前工作区。reloadToken 用于删除成功后与 host 对齐。
  useEffect(() => {
    let cancelled = false
    setStatus('loading')
    void (async () => {
      try {
        const workspaceCwd = resolveCurrentCwd(sessionKey === '' ? null : sessionKey)
        const response = await listMemory()
        if (cancelled) return
        let registry = response.projects
        if (registry.length === 0) {
          // 旧 host 的 /list 可能不返回 projects：补拉一次注册表，否则工作区
          // 分区永远匹配不上（拿不到 path → hash 的映射）。
          try {
            registry = await listProjects()
          } catch {
            registry = []
          }
        }
        if (cancelled) return
        const workspace = pickWorkspaceProject(registry, workspaceCwd)
        setCwd(workspaceCwd)
        setProjects(registry)
        setEntries(response.entries)
        setWorkspaceHash(workspace?.hash ?? null)
        setSections({ workspace: EMPTY_SECTION, global: EMPTY_SECTION })
        setStatus('ready')
      } catch (error) {
        if (cancelled) return
        console.warn('[kr-memory-card] 记忆模块加载失败', error)
        setEntries([])
        setProjects([])
        setWorkspaceHash(null)
        setStatus('unavailable')
      }
    })()
    return () => { cancelled = true }
  }, [sessionKey, reloadToken])

  const workspaceProject = useMemo(
    () => projects.find((project) => project.hash === workspaceHash) ?? null,
    [projects, workspaceHash],
  )

  const workspaceEntries = useMemo(
    () => entries.filter(
      (entry) => entry.scope === 'project' && workspaceHash !== null && entry.projectHash === workspaceHash,
    ).sort(byUpdatedDesc),
    [entries, workspaceHash],
  )

  const globalEntries = useMemo(
    () => entries.filter((entry) => entry.scope === 'global').sort(byUpdatedDesc),
    [entries],
  )

  /**
   * 「本会话新增」子集：按条目溯源判定。
   *
   * host 在写入/更新条目时把 `provenance.sessionId` 一并落盘（自动提取、
   * memory_remember / memory_revise 都填），这里与当前 sessionId 做纯等值
   * 比较——不掺任何时间口径，时钟偏差 / 刷新时机 / 切会话都不再影响结果。
   *
   * 旧 host 还没重启（不返回 provenance）时该分区会一直显示「暂无」而不是
   * 错误数据：宁可少显示，也不把别的会话的记忆混进来。挺过这个窗口只需重启
   * DSH 让新 host 半身生效。
   */
  const sessionNewEntries = useMemo(() => {
    if (sessionKey === '') {
      return { workspace: [], global: [] } as {
        workspace: readonly MemoryEntryView[]
        global: readonly MemoryEntryView[]
      }
    }
    const isNew = (entry: MemoryEntryView): boolean =>
      entry.provenance?.sessionId === sessionKey
    return {
      workspace: workspaceEntries.filter(isNew),
      global: globalEntries.filter(isNew),
    }
  }, [workspaceEntries, globalEntries, sessionKey])

  // 内容量变化 → 通知大盘重测「是否需要挤压思考卡」。
  const contentSignature = [
    status,
    sessionNewEntries.workspace.length,
    sessionNewEntries.global.length,
    sections.workspace.showAll ? 1 : 0,
    sections.global.showAll ? 1 : 0,
    sections.workspace.selecting ? 1 : 0,
    sections.global.selecting ? 1 : 0,
    openedIds.size,
    collapsed ? 0 : 1,
  ].join('|')
  useEffect(() => {
    onContentChange?.()
    // 只认内容指纹：父组件传的回调必须是用 useCallback 稳住的，否则这里会自激。
  }, [contentSignature, onContentChange])

  const patchSection = useCallback((key: SectionKey, patch: Partial<SectionState>) => {
    setSections((previous) => replaceSection(previous, key, { ...previous[key], ...patch }))
  }, [])

  const enterSelect = useCallback((key: SectionKey) => {
    patchSection(key, { selecting: true, confirming: false, error: '' })
  }, [patchSection])

  const cancelSelect = useCallback((key: SectionKey) => {
    patchSection(key, { selecting: false, confirming: false, error: '', selected: new Set<string>() })
  }, [patchSection])

  const toggleShowAll = useCallback((key: SectionKey) => {
    setSections((previous) => replaceSection(previous, key, { ...previous[key], showAll: !previous[key].showAll }))
  }, [])

  const toggleOpened = useCallback((id: string) => {
    setOpenedIds((previous) => {
      const next = new Set(previous)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }, [])

  const toggleSelected = useCallback((key: SectionKey, id: string) => {
    setSections((previous) => {
      const next = new Set(previous[key].selected)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return replaceSection(previous, key, { ...previous[key], selected: next })
    })
  }, [])

  /** 单条置顶（可选能力；host 不支持时只报一行错，不影响其余交互）。 */
  const togglePin = useCallback(async (entry: MemoryEntryView) => {
    const nextPinned = !entry.pinned
    const key: SectionKey = entry.scope === 'global' ? 'global' : 'workspace'
    // 乐观更新：先翻图标，失败再翻回来
    setEntries((previous) => previous.map((item) => (item.id === entry.id ? { ...item, pinned: nextPinned } : item)))
    try {
      await pinMemoryEntry(entry.id, nextPinned)
    } catch (error) {
      setEntries((previous) => previous.map((item) => (item.id === entry.id ? { ...item, pinned: entry.pinned } : item)))
      patchSection(key, { error: error instanceof Error ? error.message : '置顶失败' })
    }
  }, [patchSection])

  /**
   * 批量删除：乐观摘掉本地条目 → 请求 → 失败整份回滚 + 留在确认态。
   *
   * 之所以乐观：删 10 条不该等 10 次往返才有反馈；而回滚用整份快照而不是逐条
   * 补回，避免「删到一半失败」把列表补成半新半旧。
   */
  const confirmDelete = useCallback(async (key: SectionKey) => {
    const state = sections[key]
    if (state.selected.size === 0 || state.busy) return
    const ids = [...state.selected]
    const snapshot = entries
    setEntries((previous) => previous.filter((entry) => !ids.includes(entry.id)))
    patchSection(key, { busy: true, confirming: false, error: '' })
    try {
      await deleteMemoryBatch(ids)
      patchSection(key, { busy: false, selecting: false, selected: new Set<string>() })
      // 与 host 对齐（missing / 并发删除造成的差异），顺带刷新置顶态
      setReloadToken((value) => value + 1)
    } catch (error) {
      setEntries(snapshot)
      patchSection(key, {
        busy: false,
        confirming: true,
        error: error instanceof Error ? error.message : '删除失败',
      })
    }
  }, [entries, patchSection, sections])

  // 首屏加载中（一条都还没拿到）时不给分区占位：否则会先闪一下
  // 「未取到当前工作区路径」，像出了错一样。
  const firstLoading = status === 'loading' && entries.length === 0 && projects.length === 0

  if (status === 'unavailable') {
    return (
      <div className="kr-card kr-card--memory">
        <div className="kr-card__header" onClick={() => setCollapsed(!collapsed)}>
          <span className="kr-card__icon">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
              <path d="M8 1.8a2.4 2.4 0 0 0-2.4 2.4v.6H4.2A1.8 1.8 0 0 0 2.4 6.6v5.4a1.8 1.8 0 0 0 1.8 1.8h7.6a1.8 1.8 0 0 0 1.8-1.8V6.6a1.8 1.8 0 0 0-1.8-1.8h-1.4v-.6A2.4 2.4 0 0 0 8 1.8z" />
              <path d="M6.6 7.8h2.8M8 6.4v2.8" />
            </svg>
          </span>
          <span className="kr-card__title">记忆</span>
          <span className="kr-card__chevron" data-collapsed={collapsed ? 'true' : 'false'}>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.6">
              <path d="M2.5 4.5 6 8 9.5 4.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </div>
        {!collapsed && <div className="kr-memory__note">记忆模块未就绪</div>}
      </div>
    )
  }

  const renderSection = (key: SectionKey): JSX.Element | null => {
    const sessionList = sessionNewEntries[key]
    const state = sections[key]
    const title = key === 'workspace' ? '工作区记忆' : '全局记忆'
    /** 本会话新增条数（分区随它出现/消失）。 */
    const count = sessionList.length
    const scopeLabel = key === 'workspace'
      ? (workspaceProject === null ? '' : (workspaceProject.alias ?? dirName(workspaceProject.path)))
      : ''
    const visible = state.showAll ? sessionList : sessionList.slice(0, SECTION_PREVIEW_COUNT)
    const hiddenCount = sessionList.length - visible.length

    // 口径只有一种：本会话新增。分区**有新增才渲染，没有整个不出现**——
    // 「本会话暂无新记忆」的占位行本身就是噪音，两张空分区把常驻 footer
    // 撑得老高。两个分区都没新增时整个卡体收成一行头部。

    return (
      <section className="kr-memory__section">
        <div className="kr-memory__section-head">
          <span className="kr-memory__section-title" title={scopeLabel !== '' ? `${title} · ${scopeLabel}` : title}>
            {title}
            <span className="kr-memory__count">({count})</span>
            {scopeLabel !== '' && <span className="kr-memory__scope">{scopeLabel}</span>}
          </span>

          {state.selecting ? (
            <>
              <span className="kr-memory__selected">
                {state.confirming ? `确认删除 ${state.selected.size} 条？` : `已选 ${state.selected.size} 条`}
              </span>
              {state.confirming ? (
                <>
                  <button
                    type="button"
                    className="kr-memory__link kr-memory__link--danger"
                    disabled={state.busy || state.selected.size === 0}
                    onClick={(event) => { event.stopPropagation(); void confirmDelete(key) }}
                  >
                    {state.busy ? '删除中…' : '确认'}
                  </button>
                  <button
                    type="button"
                    className="kr-memory__link"
                    disabled={state.busy}
                    onClick={(event) => { event.stopPropagation(); patchSection(key, { confirming: false }) }}
                  >
                    取消
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    className="kr-memory__link kr-memory__link--danger"
                    disabled={state.selected.size === 0}
                    onClick={(event) => { event.stopPropagation(); patchSection(key, { confirming: true, error: '' }) }}
                  >
                    删除
                  </button>
                  <button
                    type="button"
                    className="kr-memory__link"
                    onClick={(event) => { event.stopPropagation(); cancelSelect(key) }}
                  >
                    取消
                  </button>
                </>
              )}
            </>
          ) : (
            <>
              {hiddenCount > 0 && (
                <button
                  type="button"
                  className="kr-memory__link"
                  onClick={(event) => { event.stopPropagation(); toggleShowAll(key) }}
                >
                  {state.showAll ? '收起' : `展开其余 ${hiddenCount} 条`}
                </button>
              )}
              {sessionList.length > 0 && (
                <button
                  type="button"
                  className="kr-memory__link"
                  onClick={(event) => { event.stopPropagation(); enterSelect(key) }}
                >
                  选择
                </button>
              )}
            </>
          )}
        </div>

        {state.error !== '' && <div className="kr-memory__err">{state.error}</div>}

        <div className="kr-memory__list">
          {visible.map((entry) => {
            const opened = openedIds.has(entry.id)
            const checked = state.selected.has(entry.id)
            const kind = memoryKindLabel(entry.kind)
            return (
              <div
                className="kr-memory__row"
                key={entry.id}
                data-selected={checked ? 'true' : undefined}
                role="button"
                tabIndex={0}
                title={opened ? undefined : entry.content}
                onClick={() => { if (state.selecting) toggleSelected(key, entry.id); else toggleOpened(entry.id) }}
                onKeyDown={(event) => {
                  if (event.key !== 'Enter' && event.key !== ' ') return
                  event.preventDefault()
                  if (state.selecting) toggleSelected(key, entry.id)
                  else toggleOpened(entry.id)
                }}
              >
                {state.selecting && (
                  <input
                    type="checkbox"
                    className="kr-memory__check"
                    checked={checked}
                    aria-label="选择这条记忆"
                    onClick={(event) => event.stopPropagation()}
                    onChange={() => toggleSelected(key, entry.id)}
                  />
                )}

                {/* 置顶标记：点一下取消置顶（置顶入口在 triad 记忆面板，
                    这里只做「看见 + 撤销」，不重复一套新增 pinned 的 UI） */}
                <span
                  className="kr-memory__pin"
                  role={entry.pinned ? 'button' : undefined}
                  title={entry.pinned ? '取消置顶' : undefined}
                  aria-label={entry.pinned ? '取消置顶' : undefined}
                  onClick={entry.pinned ? (event) => { event.stopPropagation(); void togglePin(entry) } : undefined}
                >
                  {entry.pinned && (
                    <svg width="11" height="11" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M9.6 1.8 14.2 6.4l-2.1.7-2.6 3.9.4 3.2-2.3-1.4-3 2.6.2-3.5-3.6-2.3 3.3-.4 1-3.5 3.1 1.1z" />
                    </svg>
                  )}
                </span>

                <div className="kr-memory__body-col">
                  {/* 默认 1-2 行 + 省略号，点条目展开全文 */}
                  <div className="kr-memory__text" data-open={opened ? 'true' : undefined}>
                    {entry.content}
                  </div>
                  <div className="kr-memory__meta">
                    {/* 只留有信息量的部分：类型/标签徽章 + 相对时间。
                        版本号 vN 在记忆工作台详情里看，右栏不堆。 */}
                    {kind !== '' && <span className="kr-memory__tag">{kind}</span>}
                    {entry.tags.slice(0, 2).map((tag) => (
                      <span className="kr-memory__tag" key={tag}>#{tag}</span>
                    ))}
                    <span className="kr-memory__time">{formatWhen(entry.updatedAt)}</span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </section>
    )
  }

  return (
    <div className="kr-card kr-card--memory" data-squeezed={squeezed ? 'true' : undefined}>
      <div className="kr-card__header" onClick={() => setCollapsed(!collapsed)}>
        <span className="kr-card__icon">
          {/* 大脑/记忆线框图标，与任务/思考/工具三张卡同规格（16px 线性） */}
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 2.6A2.6 2.6 0 0 0 3.4 5.2 2.4 2.4 0 0 0 2 6.2a2.4 2.4 0 0 0 .8 3.9 2.6 2.6 0 0 0 2.2 2.7c.2 1.2 1.2 2 2.4 2 .9 0 1.6-.4 2-1 .4.6 1.1 1 2 1 1.2 0 2.2-.8 2.4-2a2.6 2.6 0 0 0 2.2-2.7A2.4 2.4 0 0 0 14 6.2a2.4 2.4 0 0 0-.8-1 2.6 2.6 0 0 0-2.6-2.6c-.7-.7-1.7-1.1-2.7-1.1-1.2 0-2.3.5-2.9 1.1z" />
            <path d="M6.6 6.4h2.8M6.6 9.2h2.8" />
          </svg>
        </span>
        <span className="kr-card__title">记忆</span>
        {/* 头部不再放计数徽章：每个分区标题自带 (N)，头部再放一个「N 新增」
            是同一数字说两遍。没新增时右栏安静，有新增直接看分区内容。 */}
        <span className="kr-card__chevron" data-collapsed={collapsed ? 'true' : 'false'}>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.6">
            <path d="M2.5 4.5 6 8 9.5 4.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </div>

      {!collapsed && (
        <div className="kr-memory__body">
          {firstLoading ? (
            <div className="kr-memory__note">加载中…</div>
          ) : (sessionNewEntries.workspace.length + sessionNewEntries.global.length) === 0 ? (
            /* 两个分区都没有本会话新增：不再渲染空分区占位，只留一行说明。
               卡体收成一行头部 + 这行注，footer 高度降到最低。 */
            <div className="kr-memory__note">本会话暂无新增记忆</div>
          ) : (
            <>
              {/* 分区按「有新增才显示」渲染：没有新增的分区整个不出现，
                  而不是占一行「本会话暂无新记忆」。 */}
              {sessionNewEntries.workspace.length > 0 && renderSection('workspace')}
              {sessionNewEntries.global.length > 0 && renderSection('global')}
            </>
          )}
        </div>
      )}
    </div>
  )
})
