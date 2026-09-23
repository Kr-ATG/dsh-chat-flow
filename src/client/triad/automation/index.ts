/**
 * automation — 模块入口：把「自动化」接入 triad client。
 *
 * 导航按钮经 sidebar-nav 的 automation 槽位 portal（与用量/能力/记忆同 host、
 * 同一行布局表），不再自建 DOM host；全局完成通知（Notifier）经
 * shell.overlay 常驻插槽挂载。
 */

import { createElement } from 'react'
import { createRoot } from 'react-dom/client'
import type { ClientContext } from '@deepseek-ai/dsh-client-runtime/client'
import { AutomationApp } from './AutomationApp.tsx'
import { applyAutomationNotifier } from './Notifier.tsx'
import { ensureNavMount } from '../sidebar-nav.js'

/** 在 client 上下文中挂载自动化模块；随插件卸载自动清理。 */
export function applyAutomation(ctx: ClientContext): void {
  ctx.effect(() => {
    ensureNavMount()
    // React 根挂在游离容器上；导航按钮经 NavPortal 落到 automation 槽位，
    // 面板 portal 到 body（与用量/能力/记忆入口同一模式）。
    const holder = document.createElement('div')
    const root = createRoot(holder)
    root.render(createElement(AutomationApp, { ctx }))
    return () => { root.unmount() }
  }, 'triad: automation nav entry')
  try {
    applyAutomationNotifier(ctx)
  } catch {
    // shell.overlay 插槽不可用时跳过全局通知（面板内仍可查看运行记录）。
  }
}
