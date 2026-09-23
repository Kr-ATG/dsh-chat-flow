/**
 * dsh-chat-plus — DSH 原生 todo 投影桥接器。
 * 注入至 conversation.input.dock 槽位，静默获取官方 useProjection('todos') 实时数据并广播。
 *
 * 该座位同时是插件的「会话身份登记点」：input.dock 是 session 作用域且在新建
 * 会话的空白 Hero 态照常渲染，因此 sessionId 变化（新建 / 切换 / 离开）能第一
 * 时间被捕获，用于清空右侧大盘的上一会话残留数据。
 */
import { useEffect } from 'react'
import {
  setLatestChatSessionId,
  getLatestChatSessionId,
  setLatestChatSnapshot,
} from '../tool-summary/TurnProcessShadowView.tsx'

export interface DshTodoItem {
  readonly content: string
  readonly status: 'pending' | 'in_progress' | 'completed'
}

let liveTodos: readonly DshTodoItem[] = []
const listeners = new Set<() => void>()

export function getLiveDshTodos(): readonly DshTodoItem[] {
  return liveTodos
}

export function setLiveDshTodos(todos: readonly DshTodoItem[]): void {
  liveTodos = Array.isArray(todos) ? todos : []
  for (const fn of listeners) {
    try { fn() } catch {}
  }
}

if (typeof window !== 'undefined') {
  (window as any).__dshSetLiveTodos__ = setLiveDshTodos
}

export function clearLiveDshTodos(): void {
  liveTodos = []
  for (const fn of listeners) {
    try { fn() } catch {}
  }
}

export function subscribeLiveDshTodos(listener: () => void): () => void {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

export function KrTodoBridge(props: any) {
  const todos = props?.useProjection ? props.useProjection('todos') : null
  const sessionId = typeof props?.sessionId === 'string' ? props.sessionId : null

  // 会话身份变化 → 立即注销旧快照与缓存（右侧大盘不得复用上一会话内容）。
  // 卸载（离开会话回新建页）时同样注销；若新的座位已经登记了别的会话 id，
  // 说明本实例只是被替换，则不动它。
  useEffect(() => {
    setLatestChatSessionId(sessionId)
    return () => {
      if (getLatestChatSessionId() === sessionId) setLatestChatSessionId(null)
    }
  }, [sessionId])

  // 本座位按会话渲染，因此由它持续发布「当前会话」的快照：
  // 切回某个已有会话、或新会话发出首条消息时，第一个到达的快照就是正确的。
  // 节点视图的发布带有「只有 assistant-step 挂载时才会触发」的前提，
  // 单靠它会让清空后的右侧大盘迟迟等不到数据回填。
  const snap = props?.useChat ? props.useChat((s: any) => s) : undefined
  useEffect(() => {
    if (snap === undefined || snap === null) return
    setLatestChatSnapshot(snap, sessionId)
  }, [snap, sessionId])

  useEffect(() => {
    liveTodos = Array.isArray(todos) ? todos : []
    for (const fn of listeners) {
      try {
        fn()
      } catch {
        // ignore
      }
    }
  }, [todos])

  return null
}
