/**
 * error-boundary —— 把「气泡渲染崩溃」关进笼子。
 *
 * 为什么必须要有︰活动抽屉是 `createRoot` 挂出来的独立 React 根，React 18
 * 对渲染期异常的默认处理是**卸载整个根**——气泡里一个行抛错，
 * 整个抽屉根被卸载，而聊天流里的 chip 按钮活在另一棵树里毫毫不动：
 * 点击后 store 状态变了却没人渲染，表现就是「点击工具调用/思考没有弹出气泡」，
 * 而且不留任何画面痕迹（宿主 DOM 还在、只是空了）。`ctx.effect`
 * 外的 `guarded()` 只能包住同步的 apply()，拦不到渲染期异常。
 *
 * 因此气泡面板要单独包一层：崩了只收起这一个气泡，根保住、下次点击可重开，
 * 同时把真实错误和组件栈打到控制台，便于定位。
 */

import { Component, type ErrorInfo, type ReactNode } from 'react'

/** 边界属性。 */
export interface ErrorBoundaryProps {
  /** 出错时打在日志里的名字。 */
  label: string
  /** 崩溃后的替代内容。 */
  fallback?: ReactNode
  /** 捕获到错误时的回调。 */
  onError?: (error: Error) => void
  children: ReactNode
}

interface ErrorBoundaryState {
  error: Error | null
}

/** 只兜渲染/生命周期异常的错误边界（不兜事件回调与异步）。 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  override state: ErrorBoundaryState = { error: null }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error }
  }

  override componentDidCatch(error: Error, info: ErrorInfo): void {
    // 打出组件栈：没有它，崩溃只会表现为「气泡点不开」，无从下手。
    console.error("[dsh-chat-flow] " + this.props.label + " 渲染崩溃：", error, info.componentStack ?? '')
    try {
      this.props.onError?.(error)
    } catch (callbackError) {
      console.error('[dsh-chat-flow] 错误边界回调失败：', callbackError)
    }
  }

  override render(): ReactNode {
    if (this.state.error !== null) return this.props.fallback ?? null
    return this.props.children
  }
}
