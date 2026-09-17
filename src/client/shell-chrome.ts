/**
 * dsh-chat-flow — 壳窗口控制联动（shell chrome bridge）。
 *
 * 观察官方主题属性 <body data-ds-dark-theme>（ui-theme boot 脚本与
 * ThemePresenter 共同维护），把 { type: 'dsh:theme', theme } postMessage
 * 给父窗口（壳），壳界面颜色随 WebUI 主题同步切换。
 *
 * 零依赖、幂等、整体容错：任何异常只 console.warn，不拖累插件其他模块。
 */

const THEME_ATTR = 'data-ds-dark-theme'

/** 页面是否被壳（iframe）承载。引用比较跨源安全，不触发 SecurityError。 */
function embeddedInShell(): boolean {
  try {
    return window.self !== window.top
  } catch {
    return true // 连 top 都读不到：必然是跨源嵌入上下文
  }
}

function currentTheme(): 'dark' | 'light' {
  try {
    return document.body?.hasAttribute(THEME_ATTR) ? 'dark' : 'light'
  } catch {
    return 'light'
  }
}

function postToParent(payload: Record<string, unknown>): void {
  try {
    window.parent.postMessage(payload, '*')
  } catch { /* 父窗口不接收：忽略 */ }
}

let mounted = false

export function mountShellChrome(): void {
  if (mounted || typeof document === 'undefined') return
  if (!embeddedInShell()) return
  mounted = true

  let last: 'dark' | 'light' | '' = ''
  const report = (): void => {
    const theme = currentTheme()
    if (theme === last) return
    last = theme
    postToParent({ type: 'dsh:theme', theme })
  }

  const start = (): void => {
    report()
    if (typeof MutationObserver === 'undefined' || !document.body) return
    try {
      new MutationObserver(report).observe(document.body, {
        attributes: true,
        attributeFilter: [THEME_ATTR],
      })
    } catch { /* 观察失败：保持初始值一次 */ }
  }

  if (document.body) start()
  else document.addEventListener('DOMContentLoaded', start, { once: true })
}
