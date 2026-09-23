/**
 * dsh-chat-plus — KR 右栏「记忆」卡片。
 *
 * 用户要的三件事：
 *  1. **常驻**：卡片 sticky 贴在 `.kr-panel__scroll` 底部（见 styles.ts 的
 *     `.kr-card--memory`），滚动时一直看得见，随时可以删；
 *  2. **口径 = 本会话新增**（用户明确纠正过）：两个分区都只列 `createdAt` 不早于
 *     「进入本会话的时刻」的条目，为的是「一眼看清这次对话新记了哪些」，不是把
 *     记忆库全量铺开。工作区分区再叠加当前 cwd 对应 projectHash 的限定，全局
 *     分区即 scope=global。cwd→hash 不自己算 sha1（host 的 projectHashOf 是
 *     sha1(path).slice(0,12)，算法细节不该在前端复刻一遍），而是拿
 *     `/api/dsh-memory/list` 一起返回的 projects 注册表按 path 匹配；
 *     每个分区另有一个「全部 N」逃生口——点开才看该分区全量历史，默认永远收回
 *     本会话口径，免得用户以为记忆丢了；
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

/** 每个分区默认 preview 的条数（超出点「展开其余」，避免一屏全是记忆）。 */
const SECTION_PREVIEW_COUNT = 8

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
  /**
   * 口径：`session` = 只列本会话新增（默认），`all` = 该分区全量历史。
   *
   * 之所以默认 session：用户要的是「清晰看到这个会话增加了哪些记忆」；全量铺开
   * 反而看不出这次记了什么。「全部 N」按钮才翻到 all，再点翻回来。
   */
  mode: 'session' | 'all'
  selected: ReadonlySet<string>
}

/**
 * 基线的时钟冗余（毫秒）。
 *
 * host 写 `createdAt` 用的是宿主 Node 进程的时钟，与浏览器时钟可能存在偏差
 * （时区、NTP 同步窗口）。少了这个冗余，刚提取出来的记忆会因几毫秒到几秒的差
 * 被判定为「早于基线」而漏显示——那正是用户最想看到的那几条。
 *
 * 放宽到 5 分钟而不是 60s：用户常见操作是「让模型记一条 → 顺手刷新页面」，
 * 刷新前的写入要仍算本会话新增；5 分钟足够覆盖这类间隔，又不至于把半小时前
 * 的历史混进来。
 */
const BASELINE_CLOCK_SKEW_MS = 5 * 60_000

/**
 * 基线持久化 key（localStorage）。
 *
 * 为什么必须持久化：基线原本存在 React state 里，F5 刷新就丢，重挂载时只能用
 * `Date.now()` 重新取——于是「刷新前刚写的记忆」被判成历史，本会话新增变成 0
 * （真机踩过：用户让加一条全局记忆，刷新后就看不见了）。
 *
 * 持久化后语义变成「这个会话我是从什么时候开始看的」：
 *  - 刷新页面 → 读回同一个基线，刷新前写入的记忆照样算本会话新增；
 *  - 切到另一会话 → 那个会话有自己的条目；没有就新建并写入；
 *  - 切回老会话 → 读回它当时的基线，不会把之前的记忆算成新的。
 */
const BASELINE_STORAGE_KEY = 'dsh.kr_chat.memory_baseline'

/** 只保留最近这么多会话的基线，避免 localStorage 无限增长。 */
const BASELINE_KEEP_SESSIONS = 50

interface BaselineStore {
  readonly [sessionId: string]: number
}

/** 读某个会话的基线；没有（或存储不可用）返回 null。 */
function readStoredBaseline(sessionId: string): number | null {
  if (sessionId === '' || typeof localStorage === 'undefined') return null
  try {
    const raw = localStorage.getItem(BASELINE_STORAGE_KEY)
    if (raw === null) return null
    const parsed: unknown = JSON.parse(raw)
    if (typeof parsed !== 'object' || parsed === null) return null
    const value = (parsed as BaselineStore)[sessionId]
    return typeof value === 'number' && Number.isFinite(value) ? value : null
  } catch {
    return null
  }
}

/** 写某个会话的基线（顺带按 LRU 裁掉最老的会话）。 */
function writeStoredBaseline(sessionId: string, at: number): void {
  if (sessionId === '' || typeof localStorage === 'undefined') return
  try {
    const raw = localStorage.getItem(BASELINE_STORAGE_KEY)
    const previous: BaselineStore = (() => {
      if (raw === null) return {}
      const parsed: unknown = JSON.parse(raw)
      return typeof parsed === 'object' && parsed !== null ? (parsed as BaselineStore) : {}
    })()
    // 先删后插：让本条成为最新，裁剪时留最近的。
    delete previous[sessionId]
    previous[sessionId] = at
    const keys = Object.keys(previous)
    if (keys.length > BASELINE_KEEP_SESSIONS) {
      for (const stale of keys.slice(0, keys.length - BASELINE_KEEP_SESSIONS)) {
        delete previous[stale]
      }
    }
    localStorage.setItem(BASELINE_STORAGE_KEY, JSON.stringify(previous))
  } catch {
    // 存储满 / 隐私模式：基线退回内存态，功能降级但不报错。
  }
}

const EMPTY_SECTION: SectionState = {
  selecting: false,
  confirming: false,
  busy: false,
  error: '',
  showAll: false,
  mode: 'session',
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
  /**
   * 本会话基线时刻（ms）：这个会话「我是从什么时候开始看的」。
   *
   * 首次进入某会话取 Date.now() 并写进 localStorage；刷新页面后从 localStorage
   * 读回同一个值（不重置），所以刷新前写入的记忆仍算本会话新增。切到别的会话
   * 再切回来也读回各自当时的值。
   */
  const [baselineMs, setBaselineMs] = useState<number>(() => {
    const id = getLatestChatSessionId() ?? ''
    return readStoredBaseline(id) ?? Date.now()
  })
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

  // 会话切换：取该会话自己的基线（首次进入 = 现在，并落盘供刷新后读回），
  // 同时清掉上一个会话/工作区的记忆。绝不能等新数据到位才换——那半秒里右栏
  // 挂的会是**别的项目**的记忆，还可能被误删。
  useEffect(() => {
    const stored = readStoredBaseline(sessionKey)
    const next = stored ?? Date.now()
    if (stored === null) writeStoredBaseline(sessionKey, next)
    setBaselineMs(next)
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
   * 「本会话新增」子集：createdAt 不早于基线（含时钟冗余）。
   *
   * 时间解析失败的条目按「不算本会话」处理——宁可少显示一条，也不把几年历史的
   * 旧记忆当成这次新记的混进来（那会让用户以为本次对话乱记东西）。
   */
  const sessionNewEntries = useMemo(() => {
    const cutoff = baselineMs - BASELINE_CLOCK_SKEW_MS
    const isNew = (entry: MemoryEntryView): boolean => {
      const at = Date.parse(entry.createdAt)
      return Number.isFinite(at) && at >= cutoff
    }
    return {
      workspace: workspaceEntries.filter(isNew),
      global: globalEntries.filter(isNew),
    }
  }, [workspaceEntries, globalEntries, baselineMs])

  // 内容量变化 → 通知大盘重测「是否需要挤压思考卡」。
  const contentSignature = [
    status,
    sessionNewEntries.workspace.length,
    sessionNewEntries.global.length,
    sections.workspace.showAll ? 1 : 0,
    sections.global.showAll ? 1 : 0,
    sections.workspace.mode === 'all' ? 1 : 0,
    sections.global.mode === 'all' ? 1 : 0,
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

  /** 「全部 N」/「回到本会话」：切换分区口径，同时清掉多选与展开态。 */
  const toggleMode = useCallback((key: SectionKey) => {
    setSections((previous) => {
      const nextMode = previous[key].mode === 'session' ? 'all' : 'session'
      return replaceSection(previous, key, {
        ...previous[key],
        mode: nextMode,
        showAll: false,
        selecting: false,
        confirming: false,
        selected: new Set<string>(),
      })
    })
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

  const totalCount = workspaceEntries.length + globalEntries.length

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

  const renderSection = (key: SectionKey): JSX.Element => {
    const all = key === 'workspace' ? workspaceEntries : globalEntries
    const sessionList = sessionNewEntries[key]
    const state = sections[key]
    // 口径开关：默认只给本会话新增；「全部 N」点开才给该分区全量历史。
    const list = state.mode === 'all' ? all : sessionList
    const title = key === 'workspace' ? '工作区记忆' : '全局记忆'
    /** 当前口径下的条数（标题括号里的数字，跟着口径走）。 */
    const count = list.length
    const scopeLabel = key === 'workspace'
      ? (workspaceProject === null ? '' : (workspaceProject.alias ?? dirName(workspaceProject.path)))
      : ''
    const visible = state.showAll ? list : list.slice(0, SECTION_PREVIEW_COUNT)
    const hiddenCount = list.length - visible.length

    const emptyHint = state.mode === 'all'
      ? (key === 'workspace'
        ? (workspaceHash === null
          ? (cwd === '' ? '未取到当前工作区路径' : '未匹配到当前工作区的记忆项目')
          : '当前工作区还没有任何项目记忆')
        : '暂无全局记忆')
      : (key === 'workspace'
        ? (workspaceHash === null
          ? (cwd === '' ? '本会话暂无新记忆' : '未匹配到当前工作区的记忆项目')
          : '本会话暂无新记忆')
        : '本会话暂无新记忆')

    return (
      <section className="kr-memory__section">
        <div className="kr-memory__section-head">
          <span className="kr-memory__section-title" title={scopeLabel !== '' ? `${title} · ${scopeLabel}` : title}>
            {title}
            <span className="kr-memory__count">({count})</span>
            {state.mode === 'session' && <span className="kr-memory__scope">本会话新增</span>}
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
              {state.mode === 'session' && all.length > sessionList.length && (
                <button
                  type="button"
                  className="kr-memory__link"
                  title="查看这个分区的全部历史记忆（含本会话之前）"
                  onClick={(event) => { event.stopPropagation(); toggleMode(key) }}
                >
                  全部 {all.length}
                </button>
              )}
              {state.mode === 'all' && (
                <button
                  type="button"
                  className="kr-memory__link"
                  title="回到「只显示本会话新增」"
                  onClick={(event) => { event.stopPropagation(); toggleMode(key) }}
                >
                  回到本会话
                </button>
              )}
              {list.length > 0 && (
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

        {list.length === 0 ? (
          <div className="kr-memory__note">{emptyHint}</div>
        ) : (
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
                      {kind !== '' && <span className="kr-memory__tag">{kind}</span>}
                      {entry.tags.slice(0, 2).map((tag) => (
                        <span className="kr-memory__tag" key={tag}>#{tag}</span>
                      ))}
                      <span>{formatWhen(entry.updatedAt)}</span>
                      {entry.version > 1 && <span>v{entry.version}</span>}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
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
        <span className="kr-card__badge kr-card__badge--done">
          {firstLoading ? '加载中…' : `${totalCount} 条`}
        </span>
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
          ) : (
            <>
              {renderSection('workspace')}
              {renderSection('global')}
            </>
          )}
        </div>
      )}
    </div>
  )
})
