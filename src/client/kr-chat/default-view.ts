/**
 * dsh-chat-flow — KR 对话默认激活控制器。
 *
 * 保证新会话或用户进入会话时，默认选中「KR对话」分类，
 * 同时允许用户主动点击右上角切换到「对话」或「轨迹」。
 */

const OVERRIDE_KEY_PREFIX = 'dsh.kr_chat.manual.'

export function mountDefaultKrView(): void {
  if (typeof window === 'undefined') return

  /** 提取当前 session id */
  const getCurrentSessionId = (): string | null => {
    const hash = window.location.hash
    const m = hash.match(/session\/([a-zA-Z0-9_-]+)/)
    return m ? m[1] : null
  }

  /** 尝试程序化激活 KR 对话 tab */
  const activateKrTab = (): void => {
    const sessionId = getCurrentSessionId()
    if (!sessionId) return

    // 检查用户是否在此会话中手动切换到其他 tab
    try {
      const manual = sessionStorage.getItem(`${OVERRIDE_KEY_PREFIX}${sessionId}`)
      if (manual && manual !== 'kr-chat') {
        return // 用户主动选过其他视图，尊重用户意愿
      }
    } catch { /* ignore */ }

    // 1. 同步 localStorage 中的默认 view
    try {
      const storeKey = `dsh.conversation.${sessionId}`
      const raw = localStorage.getItem(storeKey)
      if (raw === null) {
        localStorage.setItem(storeKey, JSON.stringify({ draft: '', view: 'kr-chat' }))
      } else {
        const parsed = JSON.parse(raw)
        if (!parsed.view || parsed.view === 'chat') {
          parsed.view = 'kr-chat'
          localStorage.setItem(storeKey, JSON.stringify(parsed))
        }
      }
    } catch { /* ignore */ }

    // 2. 如果 header 中的 tablist 已就绪，触发激活
    const tabs = document.querySelectorAll<HTMLButtonElement>("header [role='tablist'] [role='tab']")
    for (const tab of tabs) {
      const text = tab.textContent?.trim()
      if (text === 'KR对话' && tab.getAttribute('aria-selected') !== 'true') {
        tab.click()
        break
      }
    }
  }

  // 监听用户在 tab 上的主动点击，记录手动切换
  const handleTabClick = (e: MouseEvent) => {
    const target = (e.target as HTMLElement)?.closest("[role='tab']") as HTMLButtonElement | null
    if (!target) return
    const sessionId = getCurrentSessionId()
    if (!sessionId) return

    const label = target.textContent?.trim()
    try {
      if (label === 'KR对话') {
        sessionStorage.setItem(`${OVERRIDE_KEY_PREFIX}${sessionId}`, 'kr-chat')
      } else if (label === '对话') {
        sessionStorage.setItem(`${OVERRIDE_KEY_PREFIX}${sessionId}`, 'chat')
      } else if (label === '轨迹') {
        sessionStorage.setItem(`${OVERRIDE_KEY_PREFIX}${sessionId}`, 'trajectory')
      }
    } catch { /* ignore */ }
  }

  document.addEventListener('click', handleTabClick, { capture: true })
  window.addEventListener('hashchange', () => {
    setTimeout(activateKrTab, 30)
    setTimeout(activateKrTab, 150)
  })

  // 初始启动与 DOM 就绪检查
  setTimeout(activateKrTab, 50)
  setTimeout(activateKrTab, 200)
  setTimeout(activateKrTab, 600)
}
