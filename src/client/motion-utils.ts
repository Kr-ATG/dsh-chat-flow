/**
 * dsh-chat-flow — client/motion-utils.ts
 *
 * 动效常量与小 hook，移植自 github:aa2246740/dsh-better-display（MIT）：
 * - `REASON_HOLD / REASON_STEP / REASON_LINES`：思考跟随的「840ms 停顿、
 *   500ms 走两行」节拍（见其 DESIGN.md「Long reasoning」与
 *   reasoning-follow.ts）。
 * - `MOTION_EASING`：两家统一的缓动曲线 cubic-bezier(.22,1,.36,1)。
 * - `useMotionAllowed`：总开关 + 系统「减少动态效果」的与结果。
 * - `useSteppedFollow`：文本增长时分步跟随到底（两行一步），用户上翻即停、
 *   滚回底部自动恢复；减少动态效果时直接跳到底。
 * - `useHeightAnimation`：展开/收起的高度补间（WAAPI），元素常驻 DOM，
 *   收起态加 inert（焦点不掉进去）。
 */

import { useEffect, useLayoutEffect, useRef, useState } from 'react'

/** Upstream reasoning-follow 节拍：停顿 840ms，走两行，单步 500ms。 */
export const REASON_HOLD = 840
export const REASON_STEP = 500
export const REASON_LINES = 2

/** 两家统一的缓动曲线（Transitions.dev 系）。 */
export const MOTION_EASING = 'cubic-bezier(.22,1,.36,1)'

/** 260ms 展开/收起（上游 ProcessFragment 同值）。 */
export const EXPAND_MS = 260

/** 插件总开关与系统偏好都允许时才做动效。 */
export function useMotionAllowed(enabled: boolean): boolean {
  const [reduced, setReduced] = useState(() => {
    try {
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches
    } catch {
      return true
    }
  })
  useEffect(() => {
    try {
      const query = window.matchMedia('(prefers-reduced-motion: reduce)')
      const change = (): void => { setReduced(query.matches) }
      query.addEventListener('change', change)
      return () => query.removeEventListener('change', change)
    } catch {
      return undefined
    }
  }, [])
  return enabled && !reduced
}

/**
 * 分步跟随到底：`text` 增长且读者停在底部（≤24px）时，按两行一步、
 * `REASON_STEP` 节拍向上游 ease 滚动到底；中途新文本只重定目标不加速
 * （burst 不追赶 unread 行）。返回 ref（挂滚动容器）与滚动事件回调。
 */
export type FollowEdges = 'none' | 'top' | 'bottom' | 'both'

/**
 * 分步跟随到底：`text` 增长且跟随意图仍在、读者停在底部（≤24px）时，
 * 按两行一步、`REASON_STEP` 节拍向上游 ease 滚动到底；中途新文本只重定
 * 目标不加速（burst 不追赶 unread 行）。上翻/选中/显式暂停即停，滚回底部
 * 或点「跟随最新」恢复；同时报告视口溢出与边缘位置（供渐隐遮罩）。
 */
export function useSteppedFollow(text: string, running: boolean, motion: boolean): {
  readonly ref: React.MutableRefObject<HTMLDivElement | null>
  readonly onScroll: (event: React.UIEvent<HTMLDivElement>) => void
  readonly onWheel: () => void
  readonly edges: FollowEdges
  readonly overflow: boolean
  readonly following: boolean
  readonly setFollowing: (value: boolean) => void
} {
  const ref = useRef<HTMLDivElement | null>(null)
  const pinnedRef = useRef(true)
  const followingRef = useRef(true)
  const targetRef = useRef(0)
  const rafRef = useRef(0)
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  // 最近一次程序化写入的 scrollTop：跟随动画自己的滚动会派发 scroll 事件，
  // 必须认出来（否则半路被当成用户上翻，钉住标志翻转、动画自杀）。
  const lastWrittenRef = useRef<number | null>(null)
  const [edges, setEdges] = useState<FollowEdges>('none')
  const [overflow, setOverflow] = useState(false)
  const [following, setFollowingState] = useState(true)
  const [kick, setKick] = useState(0)

  const cancel = (): void => {
    cancelAnimationFrame(rafRef.current)
    rafRef.current = 0
    if (timerRef.current !== undefined) {
      clearTimeout(timerRef.current)
      timerRef.current = undefined
    }
  }

  useEffect(() => cancel, [])

  /** 程序化滚动统一入口：写位留痕，供 onScroll 识别。 */
  const writeTop = (el: HTMLDivElement, top: number): void => {
    el.scrollTop = top
    lastWrittenRef.current = el.scrollTop
  }

  const measure = (): void => {
    const el = ref.current
    if (el === null) return
    const max = Math.max(0, el.scrollHeight - el.clientHeight)
    setOverflow(el.scrollHeight > el.clientHeight + 1)
    const top = el.scrollTop > 1
    const bottom = max - el.scrollTop > 1
    setEdges(top ? (bottom ? 'both' : 'top') : (bottom ? 'bottom' : 'none'))
  }

  const setFollowing = (value: boolean): void => {
    followingRef.current = value
    setFollowingState(value)
    if (!value) {
      cancel()
    } else {
      // 显式恢复：先认领钉底（否则守卫直接拦），再踢一脚重新跟随。
      pinnedRef.current = true
      const el = ref.current
      if (el !== null) targetRef.current = el.scrollHeight
      // 显式恢复：即使文本没变也踢一脚重新跟随。
      setKick(kick => kick + 1)
    }
  }

  const onScroll = (event: React.UIEvent<HTMLDivElement>): void => {
    const el = event.currentTarget
    // 自己写进去的滚动不算数（跟随动画进行中）；消费一次后重新布防。
    if (lastWrittenRef.current !== null && Math.abs(el.scrollTop - lastWrittenRef.current) < 2) {
      lastWrittenRef.current = null
      measure()
      return
    }
    lastWrittenRef.current = null
    const pinned = el.scrollHeight - el.scrollTop - el.clientHeight <= 24
    pinnedRef.current = pinned
    // 手动上翻即停；滚回底部自动恢复（与显式按钮同一意图）。
    if (followingRef.current !== pinned) {
      followingRef.current = pinned
      setFollowingState(pinned)
    }
    if (!pinned) cancel()
    measure()
  }

  /** 滚轮手势优先：第一下即暂停跟随（页面照常滚动，不拦截）。 */
  const onWheel = (): void => {
    if (followingRef.current) {
      followingRef.current = false
      setFollowingState(false)
      cancel()
    }
  }

  // 选中即停（上游同款：选区释放前不再跟随，避免跟随拽走选区）。
  useEffect(() => {
    const onSelection = (): void => {
      const el = ref.current
      if (el === null) return
      try {
        const selection = document.getSelection()
        if (selection !== null && !selection.isCollapsed && selection.anchorNode !== null && el.contains(selection.anchorNode)) {
          followingRef.current = false
          setFollowingState(false)
          cancel()
        }
      } catch { /* 选择区不可读时忽略 */ }
    }
    document.addEventListener('selectionchange', onSelection)
    return () => document.removeEventListener('selectionchange', onSelection)
  }, [])

  useLayoutEffect(() => {
    measure()
    if (!running || !followingRef.current) { cancel(); return }
    const el = ref.current
    if (el === null) return
    const distance = el.scrollHeight - el.scrollTop - el.clientHeight
    if (!pinnedRef.current && distance > 24) return
    const lineHeight = parseFloat(getComputedStyle(el).lineHeight) || 20
    targetRef.current = el.scrollHeight
    if (!motion) {
      writeTop(el, el.scrollHeight)
      measure()
      return
    }
    const stepPx = Math.max(1, lineHeight) * REASON_LINES
    // 已在跑：只把目标推到最新到底，不加速、不重排。
    if (rafRef.current !== 0 || timerRef.current !== undefined) return
    const tick = (): void => {
      rafRef.current = 0
      const node = ref.current
      if (node === null) return
      if (!pinnedRef.current || !followingRef.current) return
      const remain = targetRef.current - node.scrollTop
      if (remain <= 1) { writeTop(node, targetRef.current); measure(); return }
      const from = node.scrollTop
      const to = Math.min(targetRef.current, from + stepPx)
      const began = performance.now()
      const frame = (now: number): void => {
        rafRef.current = 0
        const current = ref.current
        if (current === null || !pinnedRef.current || !followingRef.current) return
        const t = Math.min(1, (now - began) / REASON_STEP)
        // ease 与 CSS 侧同曲线族（out-cubic 近似，短步进肉眼无差）。
        const eased = 1 - Math.pow(1 - t, 3)
        writeTop(current, from + (to - from) * eased)
        if (t < 1) {
          rafRef.current = requestAnimationFrame(frame)
        } else {
          targetRef.current = current.scrollHeight
          measure()
          if (targetRef.current - current.scrollTop > 1) {
            timerRef.current = setTimeout(() => {
              timerRef.current = undefined
              tick()
            }, REASON_HOLD)
          }
        }
      }
      rafRef.current = requestAnimationFrame(frame)
    }
    timerRef.current = setTimeout(() => {
      timerRef.current = undefined
      tick()
    }, 0)
    return cancel
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text, running, motion, kick])

  return { ref, onScroll, onWheel, edges, overflow, following, setFollowing }
}

/**
 * 高度展开/收起补间：`open` 翻转时在 `scrollHeight ↔ 0` 之间做
 * `EXPAND_MS` 动画；/`motion` 关闭或首帧直接落位。收起动画播完才卸载
 * （返回的 `present` 为 false 时调用方不渲染），收起态叠加 inert +
 * aria-hidden（由调用方写）。
 */
export function useHeightAnimation(open: boolean, motion: boolean): {
  readonly ref: React.MutableRefObject<HTMLDivElement | null>
  readonly present: boolean
} {
  const ref = useRef<HTMLDivElement | null>(null)
  const running = useRef<Animation | null>(null)
  const previous = useRef(open)
  const [present, setPresent] = useState(open)
  useLayoutEffect(() => {
    const el = ref.current
    if (el === null) {
      // 尚未挂载：只有要求打开时才挂载（下一轮 effect 再做补间）。
      if (open) setPresent(true)
      return
    }
    const from = running.current !== null ? el.getBoundingClientRect().height : previous.current ? el.scrollHeight : 0
    running.current?.cancel()
    running.current = null
    const changed = previous.current !== open
    previous.current = open
    if (open) setPresent(true)
    el.style.height = open ? 'auto' : '0px'
    el.style.overflow = open ? '' : 'hidden'
    const target = open ? el.scrollHeight : 0
    if (!motion || !changed || Math.abs(from - target) < 1) {
      setPresent(open)
      return
    }
    try {
      const animation = el.animate(
        [{ height: `${from}px` }, { height: `${target}px` }],
        { duration: EXPAND_MS, easing: MOTION_EASING, fill: 'both' },
      )
      running.current = animation
      animation.onfinish = () => {
        if (running.current !== animation) return
        running.current = null
        animation.cancel()
        setPresent(open)
      }
    } catch {
      /* WAAPI 不可用（如测试桩 DOM）：直接落位即可 */
      setPresent(open)
    }
  }, [open, motion, present])
  useEffect(() => () => { running.current?.cancel() }, [])
  return { ref, present }
}
