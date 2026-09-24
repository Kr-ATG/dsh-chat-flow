/**
 * dsh-memory 变更通知：入口 badge 的未读计数。
 * 未读状态存 localStorage（已读 change id 集合），badge 显示当日未读数；
 * 打开面板（变更 Tab）时标记已读。
 * badge 显隐偏好同样存 localStorage（设置 Tab「界面」分组里开关）。
 */

import { useCallback, useEffect, useRef, useState } from 'react'
import type { ChangeView, MemoryApi } from './api.js'

/** localStorage key（未读集合）。 */
const READ_KEY = 'dsh-memory:read'

/** localStorage key（badge 显隐偏好；'off' = 隐藏角标，缺省/其它 = 显示）。 */
export const BADGE_PREF_KEY = 'dsh-memory:unread-badge'

/**
 * 已读 id 上限：change id 只增不减，无上限会让这条 localStorage 记录
 * 无界增长（每天几十条，一年上万个 id）。只保留最近 N 个——更早的变更
 * 早已滚出当日窗口，不会再被算进未读。
 */
const READ_ID_CAP = 800

/** 读取已读 id 集合。 */
function readIds(): Set<string> {
  try {
    const raw = localStorage.getItem(READ_KEY)
    if (raw === null) return new Set()
    const parsed = JSON.parse(raw) as unknown
    if (!Array.isArray(parsed)) return new Set()
    return new Set(parsed.filter((value): value is string => typeof value === 'string'))
  } catch {
    return new Set()
  }
}

/** 写回已读 id 集合（保留最近 READ_ID_CAP 个）。 */
function writeIds(ids: Set<string>): void {
  try {
    const list = [...ids]
    localStorage.setItem(READ_KEY, JSON.stringify(list.slice(Math.max(0, list.length - READ_ID_CAP))))
  } catch {
    // localStorage 不可用（隐私模式等）时静默降级：badge 每轮都显示。
  }
}

/**
 * 轮询当日变更并计算未读数。
 * @param api - 面板 API。
 * @param pollMs - 轮询间隔（默认 60s）。
 * @returns 未读数、刷新与标记已读方法。
 */
export function useUnreadChanges(api: MemoryApi, pollMs = 60_000): {
  count: number
  refresh: () => Promise<void>
  markRead: () => void
} {
  const [count, setCount] = useState(0)
  const idsRef = useRef<Set<string>>(readIds())
  // 最近一次拉到的变更 id（markRead 用）。放 ref 而非 state：markRead 不需要
  // 因它变化而重建，避免闭包拿到过期列表。
  const seenRef = useRef<string[]>([])
  // 固定 api 引用：slots inject 每次渲染返回新对象，若进依赖会导致
  // useEffect 每次渲染都重建 setInterval + 立即请求（请求风暴）。
  const apiRef = useRef(api)
  apiRef.current = api

  const refresh = useCallback(async () => {
    try {
      const response = await apiRef.current.changes()
      seenRef.current = response.changes.map(change => change.id)
      setCount(response.changes.filter(change => !idsRef.current.has(change.id)).length)
    } catch {
      // 静默：通知是尽力而为的副产物。
    }
  }, [])

  useEffect(() => {
    void refresh()
    const timer = window.setInterval(() => { void refresh() }, pollMs)
    return () => { window.clearInterval(timer) }
  }, [refresh, pollMs])

  const markRead = useCallback(() => {
    const ids = new Set(idsRef.current)
    for (const id of seenRef.current) ids.add(id)
    idsRef.current = ids
    writeIds(ids)
    setCount(0)
  }, [])

  return { count, refresh, markRead }
}

/** badge 显隐偏好订阅（设置 Tab 开关 ↔ 入口 badge 双向联动）。 */
const badgePrefListeners = new Set<() => void>()

/** 读 badge 显隐偏好：缺省显示。 */
export function readBadgePref(): boolean {
  try {
    return localStorage.getItem(BADGE_PREF_KEY) !== 'off'
  } catch {
    return true
  }
}

/** 写 badge 显隐偏好并广播给所有订阅者（入口与设置 Tab 可能挂在不同 React 根上）。 */
export function writeBadgePref(show: boolean): void {
  try {
    if (show) localStorage.removeItem(BADGE_PREF_KEY)
    else localStorage.setItem(BADGE_PREF_KEY, 'off')
  } catch {
    // localStorage 不可用：偏好退回内存态，本次会话内仍生效。
  }
  for (const fn of badgePrefListeners) {
    try { fn() } catch {}
  }
}

/**
 * 订阅 badge 显隐偏好（useSyncExternalStore 语义：返回当前值，变化触发重渲染）。
 *
 * 之所以不用 props/context 传递：入口导航行与设置 Tab 是两棵不相交的组件树
 * （各自 createRoot/portal 挂载），没有公共祖先可放 context；localStorage +
 * 显式订阅是最小实现。
 */
export function useBadgePref(): boolean {
  const [show, setShow] = useState(readBadgePref)
  useEffect(() => {
    const sync = (): void => { setShow(readBadgePref()) }
    badgePrefListeners.add(sync)
    // 跨标签页 / 同页其它根改了偏好时也跟上。
    window.addEventListener('storage', sync)
    return () => {
      badgePrefListeners.delete(sync)
      window.removeEventListener('storage', sync)
    }
  }, [])
  return show
}

/** 变更类型再导出（入口只需要类型，不再需要动作文案——已迁到 Panel 的 changeActionLabel）。 */
export type { ChangeView }
