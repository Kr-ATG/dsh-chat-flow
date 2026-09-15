/**
 * dsh-chat-flow — 壳窗口控制联动（shell chrome bridge）。
 *
 * 桌面壳（Electron 无边框窗口）在右上角自绘 最小化 / 最大化 / 关闭 三枚
 * 窗口控制按钮（合计约 96px 宽）。本模块只在「页面被壳承载」时生效
 * （window.self !== window.top，即壳的 iframe 内），做两件事：
 *  1. 给 <html> 挂 dsh-in-shell 类 → styles.ts 的「壳窗口控制留位」规则把
 *     会话 header 右侧控制簇（工作区按钮 / 更多 / 侧栏展开 / 对话·轨迹
 *     标签）整体左移 100px，为壳按钮让出右上角；浏览器直开零影响。
 *  2. 观察官方主题属性 <body data-ds-dark-theme>（ui-theme boot 脚本与
 *     ThemePresenter 共同维护），把 { type: 'dsh:theme', theme } postMessage
 *     给父窗口，壳按钮颜色随界面主题（而非仅系统主题）同步切换。
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

function postTheme(theme: 'dark' | 'light'): void {
  try {
    window.parent.postMessage({ type: 'dsh:theme', theme }, '*')
  } catch { /* 父窗口不接收：忽略 */ }
}

let mounted = false

export function mountShellChrome(): void {
  if (mounted || typeof document === 'undefined') return
  if (!embeddedInShell()) return
  mounted = true
  try {
    document.documentElement.classList.add('dsh-in-shell')
  } catch { /* 拿不到 documentElement：留位规则不生效，按钮仍可点 */ }

  let last: 'dark' | 'light' | '' = ''
  const report = (): void => {
    const theme = currentTheme()
    if (theme === last) return
    last = theme
    postTheme(theme)
  }

  const start = (): void => {
    report()
    if (typeof MutationObserver === 'undefined' || !document.body) return
    try {
      new MutationObserver(report).observe(document.body, {
        attributes: true,
        attributeFilter: [THEME_ATTR],
      })
    } catch { /* 观察失败：主题同步退化为初始值一次 */ }
  }

  if (document.body) start()
  else document.addEventListener('DOMContentLoaded', start, { once: true })
}
