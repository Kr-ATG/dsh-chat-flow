/**
 * dsh-chat-flow — 壳窗口控制联动（shell chrome bridge）。
 *
 * 桌面壳（Electron 无边框窗口）右上角自绘 最小化 / 最大化·还原 / 关闭 三枚
 * 窗口控制按钮（合计约 96px 宽）。本模块只在「页面被带窗口控制的壳承载」时
 * 生效，走一次能力握手（旧壳不应答 → 一切不动，绝不留 100px 空档）：
 *
 *   插件（iframe 内）postMessage { type: 'dsh:shell-hello' } → 父窗口
 *   壳（topbar renderer）应答 { type: 'dsh:shell-chrome' }（并在 iframe
 *   load 时主动推一次，双向兜底覆盖时序）
 *
 * 收到应答后做两件事：
 *  1. 给 <html> 挂 dsh-in-shell 类 → styles.ts 的「壳窗口控制留位」规则把
 *     会话 header 右侧控制簇（工作区按钮 / 更多 / 侧栏展开 / 对话·轨迹
 *     标签）整体左移 100px，为壳按钮让出右上角；浏览器直开零影响。
 *  2. 观察官方主题属性 <body data-ds-dark-theme>（ui-theme boot 脚本与
 *     ThemePresenter 共同维护），把 { type: 'dsh:theme', theme } postMessage
 *     给父窗口，壳按钮颜色随界面主题（而非仅系统主题）同步切换。
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
let confirmed = false

/** 握手成功：挂留位类 + 开始主题上报（属性变化实时推给壳）。 */
function onShellConfirmed(): void {
  if (confirmed) return
  confirmed = true
  try {
    document.documentElement.classList.add('dsh-in-shell')
  } catch { /* 拿不到 documentElement：留位规则不生效，按钮仍可点 */ }

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
    } catch { /* 观察失败：主题同步退化为初始值一次 */ }
  }

  if (document.body) start()
  else document.addEventListener('DOMContentLoaded', start, { once: true })
}

export function mountShellChrome(): void {
  if (mounted || typeof document === 'undefined') return
  if (!embeddedInShell()) return
  mounted = true

  window.addEventListener('message', (event: MessageEvent) => {
    const data = event?.data as { type?: unknown } | null
    if (data && data.type === 'dsh:shell-chrome') onShellConfirmed()
  })

  // 打招呼 + 短重试：覆盖「插件 boot 晚于壳的 load 推送」的时序；壳应答幂等，
  // 多打几次无副作用（onShellConfirmed 自带 once）。
  postToParent({ type: 'dsh:shell-hello' })
  if (typeof setTimeout !== 'undefined') {
    setTimeout(() => { if (!confirmed) postToParent({ type: 'dsh:shell-hello' }) }, 600)
    setTimeout(() => { if (!confirmed) postToParent({ type: 'dsh:shell-hello' }) }, 2000)
  }
}
