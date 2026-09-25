/**
 * dsh-chat-plus — KR 对话内的极简 Agent 状态卡。
 *
 * 只展示“正在做什么”，不把思考全文、工具参数或调用树塞进左侧消息流。
 * 头像可点击上传并持久化到 localStorage；图片会裁切为 128×128。
 */
import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { ChangeEvent, KeyboardEvent as ReactKeyboardEvent, MouseEvent as ReactMouseEvent } from 'react'
import type { ChatNode } from '@deepseek-ai/dsh-client-ui-chat/client'
import type {} from '@deepseek-ai/dsh-client-ui-chat/client'
import type {} from '@deepseek-ai/dsh-client-ui-tool/client'
import { callName, isRunning } from '../tool-summary/tool-stats.ts'
import { argFields, toolArgsRaw } from '../tool-summary/activity-view-model.ts'
import { useMotionAllowed } from '../motion-utils.ts'

const EXIT_MS = 980
const AVATAR_STORAGE_KEY = 'dsh.kr_chat.agent_avatar.v1'

export interface KrActivityReasoningItem {
  readonly text: string
  readonly running: boolean
  readonly step: number
  readonly time?: number | undefined
  readonly order?: number | undefined
}

function readStoredAvatar(): string | null {
  if (typeof localStorage === 'undefined') return null
  try {
    const value = localStorage.getItem(AVATAR_STORAGE_KEY)
    return value !== null && value.startsWith('data:image/') ? value : null
  } catch {
    return null
  }
}

function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image()
    image.onload = () => { resolve(image) }
    image.onerror = () => { reject(new Error('avatar decode failed')) }
    image.src = url
  })
}

/** 上传图中心裁切为正方形，避免 localStorage 被原图撑爆。 */
async function cropAvatar(file: File): Promise<string> {
  const objectUrl = URL.createObjectURL(file)
  try {
    const image = await loadImage(objectUrl)
    const side = 128
    const canvas = document.createElement('canvas')
    canvas.width = side
    canvas.height = side
    const context = canvas.getContext('2d')
    if (context === null) throw new Error('canvas unavailable')
    const crop = Math.min(image.naturalWidth, image.naturalHeight)
    const sourceX = (image.naturalWidth - crop) / 2
    const sourceY = (image.naturalHeight - crop) / 2
    context.drawImage(image, sourceX, sourceY, crop, crop, 0, 0, side, side)
    return canvas.toDataURL('image/webp', .88)
  } finally {
    URL.revokeObjectURL(objectUrl)
  }
}

function toolVerb(name: string): string {
  const lower = name.toLowerCase()
  if (/^(read|read_file|view|open_file)$/.test(lower)) return '读取文件'
  if (/^(write|edit|apply_patch|str_replace_editor)$/.test(lower)) return '修改文件'
  if (/^(bash|pwsh|shell|terminal|exec_command|run_code)$/.test(lower)) return '执行命令'
  if (/^(grep|glob|find|search)$/.test(lower)) return '搜索文件'
  if (/^(web_search|web_fetch|web_open)$/.test(lower)) return '检索网页'
  if (lower === 'skill') return '加载技能'
  if (/memory|summar/.test(lower)) return '整理记忆'
  return `调用 ${name || '工具'}`
}

function compactText(text: string, limit = 150): string {
  const value = text.replace(/\s+/g, ' ').trim()
  return value.length > limit ? `${value.slice(0, limit - 1)}…` : value
}

function changedFileName(block: any): string | null {
  const name = String(callName(block) ?? '').toLowerCase()
  if (!/^(write|edit|apply_patch|str_replace_editor|patch)$/.test(name)) return null
  try {
    const args = argFields(toolArgsRaw(block))
    const value = args.file_path ?? args.path ?? args.filename ?? args.filePath
    if (typeof value !== 'string' || value.trim() === '') return null
    return value.split(/[\\/]/).filter(Boolean).at(-1) ?? null
  } catch {
    return null
  }
}

function MiniNodeCard({
  label,
  meta,
  value,
}: {
  readonly label: string
  readonly meta: string
  readonly value: string
}) {
  return (
    <div className="kr-agent-node-card">
      <div className="kr-agent-node-card__head">
        <span>{label}</span>
        <span>{meta}</span>
      </div>
      <div className="kr-agent-node-card__value">{value}</div>
    </div>
  )
}

function defaultAvatar() {
  return (
    <span className="kr-agent-mini-avatar__default" aria-hidden>
      <svg viewBox="0 0 32 32" fill="none">
        <path d="M8 9.5 16 5l8 4.5v8.7c0 4.2-2.8 7.3-8 8.8-5.2-1.5-8-4.6-8-8.8V9.5Z" stroke="currentColor" strokeWidth="1.5" />
        <path d="m12 13 4 3 4-3M16 16v5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  )
}

export const KrLiveActivityCard = memo(function KrLiveActivityCard({
  turn,
  reasoning,
  tools,
  active,
  closing,
  committed,
  onExited,
}: {
  readonly turn: number
  readonly reasoning: readonly KrActivityReasoningItem[]
  readonly tools: readonly ChatNode<'tool-call'>[]
  readonly active: boolean
  readonly closing: boolean
  readonly committed: boolean
  readonly onExited?: (() => void) | undefined
}) {
  const motion = useMotionAllowed(true)
  const rootRef = useRef<HTMLDivElement | null>(null)
  const inputRef = useRef<HTMLInputElement | null>(null)
  const onExitedRef = useRef(onExited)
  onExitedRef.current = onExited
  const [present, setPresent] = useState(active)
  const [avatar, setAvatar] = useState<string | null>(readStoredAvatar)
  const [avatarMenu, setAvatarMenu] = useState(false)
  const [avatarError, setAvatarError] = useState(false)
  const [expanded, setExpanded] = useState(true)

  const runningTool = useMemo(() => {
    for (let index = tools.length - 1; index >= 0; index -= 1) {
      const node = tools[index]
      try {
        if (isRunning(node.data.root)) return callName(node.data.root) || '工具'
      } catch { /* 未知工具形状跳过 */ }
    }
    return null
  }, [tools])
  const analysisValue = useMemo(() => {
    const latest = [...reasoning].reverse().find((item) => item.text.trim() !== '')
    if (latest !== undefined) return compactText(latest.text)
    return active ? '正在分析需求' : '本轮暂无分析记录'
  }, [active, reasoning])
  const toolValue = useMemo(() => {
    const recent = tools.slice(-3).reverse()
    if (recent.length === 0) return '暂未调用工具'
    return recent.map((node) => {
      try { return toolVerb(callName(node.data.root) || '工具') } catch { return '调用工具' }
    }).join(' · ')
  }, [tools])
  const fileNames = useMemo(() => {
    const names = new Set<string>()
    for (const node of tools) {
      try {
        const name = changedFileName(node.data.root)
        if (name !== null) names.add(name)
      } catch { /* 未知工具形状跳过 */ }
    }
    return [...names]
  }, [tools])
  const fileValue = fileNames.length > 0 ? fileNames.slice(0, 3).join('、') : '暂无文件变更'
  const thinking = reasoning.some((item) => item.running)
  const action = closing
    ? 'Agent 正在总结'
    : runningTool !== null
      ? `Agent 正在${toolVerb(runningTool)}`
      : thinking
        ? 'Agent 正在思考'
        : active ? 'Agent 正在分析' : 'Agent 正在整理结果'

  useEffect(() => {
    const onStorage = (event: StorageEvent): void => {
      if (event.key === AVATAR_STORAGE_KEY) setAvatar(readStoredAvatar())
    }
    window.addEventListener('storage', onStorage)
    return () => { window.removeEventListener('storage', onStorage) }
  }, [])

  useEffect(() => {
    if (!avatarMenu) return undefined
    const onPointerDown = (event: PointerEvent): void => {
      if (rootRef.current?.contains(event.target as Node) !== true) setAvatarMenu(false)
    }
    const onKeyDown = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') setAvatarMenu(false)
    }
    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [avatarMenu])

  useEffect(() => {
    if (closing) setAvatarMenu(false)
  }, [closing])

  useEffect(() => {
    if (!closing) {
      setPresent(active)
      return undefined
    }
    if (!committed) return undefined
    if (!motion) {
      setPresent(false)
      onExitedRef.current?.()
      return undefined
    }
    const id = window.setTimeout(() => {
      setPresent(false)
      onExitedRef.current?.()
    }, EXIT_MS)
    return () => { window.clearTimeout(id) }
  }, [active, closing, committed, motion])

  const chooseAvatar = useCallback(async (event: ChangeEvent<HTMLInputElement>): Promise<void> => {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (file === undefined) return
    try {
      const value = await cropAvatar(file)
      localStorage.setItem(AVATAR_STORAGE_KEY, value)
      setAvatar(value)
      setAvatarError(false)
      setAvatarMenu(false)
    } catch {
      setAvatarError(true)
    }
  }, [])

  const resetAvatar = useCallback((): void => {
    try { localStorage.removeItem(AVATAR_STORAGE_KEY) } catch { /* storage 不可用时仅改内存 */ }
    setAvatar(null)
    setAvatarError(false)
    setAvatarMenu(false)
  }, [])

  const toggleExpanded = useCallback((): void => {
    setExpanded((value) => !value)
  }, [])
  const handleCardClick = useCallback((event: ReactMouseEvent<HTMLElement>): void => {
    if ((event.target as HTMLElement).closest('button, input') !== null) return
    toggleExpanded()
  }, [toggleExpanded])
  const handleCardKeyDown = useCallback((event: ReactKeyboardEvent<HTMLElement>): void => {
    if (event.key !== 'Enter' && event.key !== ' ') return
    event.preventDefault()
    toggleExpanded()
  }, [toggleExpanded])

  if (!present) return null

  return (
    <div
      ref={rootRef}
      className="kr-agent-mini-shell"
      data-turn={turn}
      data-active={active || undefined}
      data-closing={closing || undefined}
      data-committed={committed || undefined}
      data-expanded={expanded || undefined}
    >
      <section
        className="kr-agent-mini-card"
        role="button"
        tabIndex={0}
        aria-label="Agent 当前状态"
        aria-expanded={expanded}
        aria-live={active && !closing ? 'polite' : 'off'}
        onClick={handleCardClick}
        onKeyDown={handleCardKeyDown}
      >
        <button
          type="button"
          className="kr-agent-mini-avatar"
          onClick={(event) => {
            event.stopPropagation()
            setAvatarMenu((open) => !open)
            setAvatarError(false)
          }}
          title="设置 Agent 头像"
          aria-label="设置 Agent 头像"
          aria-expanded={avatarMenu}
        >
          {avatar === null ? defaultAvatar() : <img src={avatar} alt="" />}
          <span className="kr-agent-mini-avatar__status" aria-hidden />
        </button>

        <div className="kr-agent-mini-copy">
          <span key={action} className="kr-agent-mini-action">{action}</span>
        </div>

        <span className="kr-agent-mini-chevron" data-open={expanded || undefined} aria-hidden>
          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
            <path d="m5 6 3 3 3-3" />
          </svg>
        </span>

        {avatarMenu && (
          <div
            className="kr-agent-avatar-menu"
            role="dialog"
            aria-label="Agent 头像设置"
            onClick={(event) => { event.stopPropagation() }}
          >
            <div className="kr-agent-avatar-menu__title">Agent 头像</div>
            <button type="button" className="kr-agent-avatar-menu__action" onClick={() => { inputRef.current?.click() }}>
              上传图片
            </button>
            <button
              type="button"
              className="kr-agent-avatar-menu__action"
              onClick={resetAvatar}
              disabled={avatar === null}
            >
              恢复默认
            </button>
            <div className="kr-agent-avatar-menu__hint">自动居中裁切为 128 × 128</div>
            {avatarError && <div className="kr-agent-avatar-menu__error">图片无法读取，请换一张</div>}
          </div>
        )}

        <input
          ref={inputRef}
          className="kr-agent-avatar-input"
          type="file"
          accept="image/png,image/jpeg,image/webp,image/gif"
          onChange={(event) => { void chooseAvatar(event) }}
          tabIndex={-1}
        />
      </section>

      <div className="kr-agent-mini-details" data-open={expanded || undefined} aria-hidden={!expanded}>
        <div className="kr-agent-mini-details__inner">
          <div className="kr-agent-mini-details__head">
            <span>关键节点</span>
            <span>点击上方状态卡收起</span>
          </div>
          <div className="kr-agent-mini-details__grid">
            <MiniNodeCard label="分析" meta={`${reasoning.length} 条思考`} value={analysisValue} />
            <MiniNodeCard label="工具" meta={`${tools.length} 次调用`} value={toolValue} />
            <MiniNodeCard label="文件" meta={`${fileNames.length} 个变更`} value={fileValue} />
          </div>
        </div>
      </div>
    </div>
  )
})

interface KrActivityCardGateProps {
  readonly turn: number
  readonly reasoning: readonly KrActivityReasoningItem[]
  readonly tools: readonly ChatNode<'tool-call'>[]
  readonly active: boolean
  readonly closing: boolean
  readonly committed: boolean
}

/** closed 历史轮次不挂载真实卡片，避免每轮安装全局监听或退场计时器。 */
export const KrActivityCardGate = memo(function KrActivityCardGate({
  turn,
  reasoning,
  tools,
  active,
  closing,
  committed,
}: KrActivityCardGateProps) {
  const wasActiveRef = useRef(active)
  const [mounted, setMounted] = useState(active)

  useEffect(() => {
    if (active) {
      wasActiveRef.current = true
      setMounted(true)
    } else if (closing && wasActiveRef.current) {
      setMounted(true)
    }
  }, [active, closing, turn])

  const handleExited = useCallback(() => {
    wasActiveRef.current = false
    setMounted(false)
  }, [])

  if (!mounted) return null
  return (
    <KrLiveActivityCard
      turn={turn}
      reasoning={reasoning}
      tools={tools}
      active={active}
      closing={closing}
      committed={committed}
      onExited={handleExited}
    />
  )
})
