/**
 * dsh-chat-flow — 实时思考预览堆叠（2 卡窗口）。
 *
 * 需求：
 * - 第 1 次思考完成后仍保留第 1 张预览；第 2 次思考出现第 2 张
 *   （最多同时 2 张，纵向堆叠）。
 * - 第 3 次思考把第 1 张「往上逐渐消散」收回，第 4/5 次以此类推
 *   （滑动窗口，只保留最近 2 段）。
 * - 新预览出现时淡入；对话结束开始总结时不一下全收，要有 staggered
 *   回收动画（一张一张往上收）。
 *
 * 实现：
 * - 调用方把本轮全部非空思考段按时间顺序传进来
 *   `items: [{ text, step, running }]`，本组件内部只取最后 2 个做窗口。
 * - key 用全局序号（过滤后数组下标）保证稳定：流式追加文字时不重挂，
 *   不会重播淡入；只有新段挂载才播淡入。
 * - 被挤出窗口的旧卡保留在 DOM 里播 `leaving`（往上消散）420ms 再卸载。
 * - `closing=true`（回合 closed / 开始总结）时快照当前窗口，逐张加
 *   `animation-delay` 播 `reclaim` 再整体卸载；closing 期间忽略新 items。
 * - `prefers-reduced-motion` 时经 `useMotionAllowed` 直接落位、无延迟。
 */

import { memo, useEffect, useLayoutEffect, useRef, useState } from 'react'
import type { CSSProperties, ReactNode } from 'react'
import { useMotionAllowed, useSteppedFollow } from '../motion-utils.ts'

export interface LiveThinkingItem {
  readonly text: string
  readonly step: number
  readonly running: boolean
}

/** 同时可见的最大预览数（用户定值：2）。 */
export const LIVE_STACK_MAX = 2
/** 挤出消散时长（与 CSS dtt-live-dissolve 对齐，刻意放慢到可见）。 */
export const LIVE_LEAVE_MS = 560
/** 回收单卡时长（与 CSS dtt-live-reclaim 对齐，总结时要看清逐张收）。 */
export const LIVE_RECLAIM_MS = 700
/** 回收时相邻两卡的 stagger 间隔（2 张错峰，肉眼能数出两拍）。 */
export const LIVE_RECLAIM_STAGGER = 280
/** 内联行被 control 接管 / 悬浮锚点清除后，保留挂载播完回收的总时长 + 余量。 */
export const LIVE_RECLAIM_UNMOUNT_MS =
  LIVE_RECLAIM_MS + LIVE_RECLAIM_STAGGER * (LIVE_STACK_MAX - 1) + 220
const LEAVE_MS = LIVE_LEAVE_MS
const RECLAIM_MS = LIVE_RECLAIM_MS
const RECLAIM_STAGGER = LIVE_RECLAIM_STAGGER

export type LiveCardState = 'enter' | 'visible' | 'leaving' | 'reclaim'

/**
 * 堆叠槽位：负责高度收放，内卡负责淡入淡出位移。
 * - enter：挂载先塌着，下一帧张开，下面的总结卡被平滑顶下去。
 * - collapse：挂载先撑着，下一帧塌掉（高度/opacity/margin 一起收），
 *   下面的总结卡一路平滑滑上来，而不是最后咯噔一下。
 * 高度走 grid 0fr/1fr 过渡（Chromium 系），stagger 由 transition-delay 给，
 * 与内卡 animation-delay 同拍。
 */
const LiveSlot = memo(function LiveSlot({ anim, kind, delayMs, motion, children }: {
  readonly anim: 'enter' | 'collapse'
  readonly kind?: 'leave' | 'reclaim' | undefined
  readonly delayMs?: number | undefined
  readonly motion: boolean
  readonly children: ReactNode
}) {
  const [open, setOpen] = useState(anim === 'collapse')
  useLayoutEffect(() => {
    if (!motion) { setOpen(anim === 'collapse' ? false : true); return undefined }
    if (anim === 'enter') {
      setOpen(false)
      const raf = requestAnimationFrame(() => { setOpen(true) })
      return () => { cancelAnimationFrame(raf) }
    }
    setOpen(true)
    const raf = requestAnimationFrame(() => { setOpen(false) })
    return () => { cancelAnimationFrame(raf) }
  }, [anim, motion])
  const delay = motion && delayMs !== undefined && delayMs > 0
    ? { transitionDelay: `${delayMs}ms` } as CSSProperties
    : undefined
  return (
    <div
      className="dtt__live-slot"
      data-anim={anim}
      data-kind={kind}
      data-open={open ? 'true' : 'false'}
      style={delay}
    >
      {children}
    </div>
  )
})

/**
 * 单张实时思考预览卡（chip 行与工具行共用）：分步跟随（上游节拍）+ 边缘渐隐。
 * 无底部控制按钮：上翻/选中/点按即停，滚回底部自动恢复跟随。
 */
export const LiveThinkingCard = memo(function LiveThinkingCard({ text, step, running = true, state, style }: {
  readonly text: string
  readonly step: number
  readonly running?: boolean | undefined
  readonly state?: LiveCardState | undefined
  readonly style?: CSSProperties | undefined
}) {
  const motion = useMotionAllowed(true)
  // 跟随最新：只有正在跑的那张才跟随；已完成 / 正在消散 / 回收中的卡一律静止
  // （避免后台滚动把消散动画拽走）。
  const followActive = running && (state === undefined || state === 'enter' || state === 'visible')
  const { ref, onScroll, onWheel, edges, overflow, following, setFollowing } = useSteppedFollow(text, followActive, motion)
  const dataState = state === 'enter' || state === undefined ? undefined : state
  return (
    <div
      className="dtt__reasoning-live-card"
      data-following={following && followActive ? true : undefined}
      data-overflow={overflow || undefined}
      data-running={running ? 'true' : 'false'}
      data-state={dataState}
      style={style}
    >
      <div className="dtt__reasoning-live-head">
        <span className="dtt__reasoning-live-title">
          {running && <span className="dtt__live-dot" aria-hidden />}
          {running ? '思考中' : '思考'}
        </span>
        <span className="dtt__reasoning-live-step">步骤 {step}{running ? ' · 进行中' : ' · 已完成'}</span>
      </div>
      <div
        className="dtt__reasoning-live"
        data-edges={edges}
        ref={ref}
        onScroll={onScroll}
        onWheel={onWheel}
        role="region"
        aria-label={`${running ? '正在思考' : '已完成的思考'}${overflow ? '，可滚动阅读' : ''}`}
        tabIndex={overflow ? 0 : undefined}
        onPointerDown={() => { if (following && followActive) setFollowing(false) }}
        aria-live={running ? 'polite' : 'off'}
      >
        {text}
      </div>
    </div>
  )
})

interface DisplayEntry {
  readonly key: string
  readonly item: LiveThinkingItem
}

/**
 * 2 卡堆叠：`items` 为本轮全部非空思考段（时间序），`closing` 为回合已结束
 * （开始总结）。closing 由调用方按 `locationTurn.status === 'closed'` 传入；
 * 思考中途的 tool 间隙（running=false 但回合未关）不算 closing，旧卡保留。
 */
export const LiveThinkingStack = memo(function LiveThinkingStack({ items, closing, compact }: {
  readonly items: readonly LiveThinkingItem[]
  readonly closing: boolean
  /** 悬浮预览（fixed 容器）时收紧视口高度，2 张不至于撑满屏。 */
  readonly compact?: boolean | undefined
}) {
  const motion = useMotionAllowed(true)
  const leaveMs = motion ? LEAVE_MS : 0
  const reclaimTotal = (count: number): number => (motion ? RECLAIM_MS + RECLAIM_STAGGER * Math.max(0, count - 1) : 0)

  // 正在消散的被挤出卡（key → 快照，播完卸载）。
  const [leaving, setLeaving] = useState<readonly DisplayEntry[]>([])
  // 回收中快照：closing 置 true 的瞬间冻结当前窗口，stagger 播完再整体卸载。
  const [reclaim, setReclaim] = useState<readonly DisplayEntry[] | null>(null)
  const prevVisibleRef = useRef<readonly string[]>([])
  const prevItemsRef = useRef<ReadonlyMap<string, LiveThinkingItem>>(new Map())
  const timersRef = useRef<readonly ReturnType<typeof setTimeout>[]>([])
  useEffect(() => () => {
    for (const id of timersRef.current) clearTimeout(id)
    timersRef.current = []
  }, [])
  const later = (ms: number, fn: () => void): void => {
    if (ms <= 0) { fn(); return }
    const id = setTimeout(() => {
      timersRef.current = timersRef.current.filter(other => other !== id)
      fn()
    }, ms)
    timersRef.current = [...timersRef.current, id]
  }

  // 全局序号 key：过滤后数组下标天然稳定（只有追加 + 末尾文字增长）。
  const entries: readonly DisplayEntry[] = items.map((item, index) => ({ key: String(index), item }))
  const visible: readonly DisplayEntry[] = entries.slice(-LIVE_STACK_MAX)
  const visibleKeys = visible.map(entry => entry.key).join('|')

  // 挤出检测：上次窗口里、这次不在窗口里、且不在回收中的 key → 进入 leaving。
  // 用 layout effect：同一帧内把被顶掉的旧卡转成消散态，避免先闪掉再出现。
  useLayoutEffect(() => {
    if (reclaim !== null) return
    if (closing) return
    const prevKeys = prevVisibleRef.current
    const nextKeys = new Set(visible.map(entry => entry.key))
    const evicted = prevKeys.filter(key => !nextKeys.has(key))
    if (evicted.length > 0) {
      const snapshots = evicted
        .map(key => {
          const item = prevItemsRef.current.get(key)
          return item === undefined ? undefined : ({ key, item } as DisplayEntry)
        })
        .filter((entry): entry is DisplayEntry => entry !== undefined)
      if (snapshots.length > 0) {
        setLeaving(prev => {
          const known = new Set(prev.map(entry => entry.key))
          const fresh = snapshots.filter(entry => !known.has(entry.key) && !nextKeys.has(entry.key))
          return fresh.length === 0 ? prev : [...prev, ...fresh]
        })
        for (const entry of snapshots) {
          later(leaveMs, () => {
            setLeaving(prev => prev.filter(other => other.key !== entry.key))
          })
        }
      }
    }
    prevVisibleRef.current = visible.map(entry => entry.key)
    prevItemsRef.current = new Map(entries.map(entry => [entry.key, entry.item]))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visibleKeys, closing, reclaim, leaveMs])

  // 回收：closing 由 false → true 的瞬间冻结「窗口 + 正在消散」一起 stagger 收。
  // 用 layout effect：closing 那一帧直接冻结快照，不先闪空一帧。
  const closingRef = useRef(closing)
  useLayoutEffect(() => {
    const was = closingRef.current
    closingRef.current = closing
    if (!closing || was) return
    if (reclaim !== null) return
    const frozen: readonly DisplayEntry[] = [
      ...leaving,
      ...visible,
    ].slice(-LIVE_STACK_MAX)
    if (frozen.length === 0) return
    prevVisibleRef.current = []
    setLeaving([])
    setReclaim(frozen)
    later(reclaimTotal(frozen.length) + 30, () => { setReclaim(null) })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [closing, visibleKeys])

  // 新回合（items 清空且 closing 回落）时清回收态，下一轮淡入不受污染。
  useEffect(() => {
    if (!closing && items.length === 0 && reclaim !== null) setReclaim(null)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [closing, items.length])

  if (reclaim !== null) {
    if (reclaim.length === 0) return null
    return (
      <div className="dtt__reasoning-live-stack" data-compact={compact || undefined} data-closing="true" aria-live="off">
        {reclaim.map((entry, index) => (
          <LiveSlot
            key={entry.key}
            anim="collapse"
            kind="reclaim"
            delayMs={motion ? index * RECLAIM_STAGGER : 0}
            motion={motion}
          >
            <LiveThinkingCard
              text={entry.item.text}
              step={entry.item.step}
              running={false}
              state="reclaim"
              style={motion ? { animationDelay: `${index * RECLAIM_STAGGER}ms` } : undefined}
            />
          </LiveSlot>
        ))}
      </div>
    )
  }
  if (closing) return null
  if (visible.length === 0 && leaving.length === 0) return null
  return (
    <div className="dtt__reasoning-live-stack" data-compact={compact || undefined}>
      {leaving.map(entry => (
        <LiveSlot key={`leaving:${entry.key}`} anim="collapse" kind="leave" motion={motion}>
          <LiveThinkingCard
            text={entry.item.text}
            step={entry.item.step}
            running={false}
            state="leaving"
          />
        </LiveSlot>
      ))}
      {visible.map(entry => (
        <LiveSlot key={entry.key} anim="enter" motion={motion}>
          <LiveThinkingCard
            text={entry.item.text}
            step={entry.item.step}
            running={entry.item.running}
            state="enter"
          />
        </LiveSlot>
      ))}
    </div>
  )
})
