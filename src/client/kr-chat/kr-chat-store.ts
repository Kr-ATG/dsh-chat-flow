/**
 * dsh-chat-plus — KR 对话状态管理 Store。
 *
 * 管理 KR 对话双栏界面的关键交互状态：
 * 1. 右侧 Agent 轨迹大盘开合状态（panelOpen，默认展开，可持久化）；
 * 2. 当前选中的查看轮次（selectedTurn: number | null，null 表示跟随最新活跃轮次）；
 * 3. 历史对话联动与最新轮次自动跟随机制。
 *
 * KR 整体已被 KR_CHAT_ENABLED 关闭（只隐藏不删除，见 enabled.ts）：关闭时初始
 * activeTab 直接是 'chat'，于是 isKrMode 全链路为 false —— 不写 data-dsh-kr-chat、
 * 不隐藏左侧工具树、插件「对话」呈现回到 KR 之前的形态。改回 true 即恢复。
 */

import { KR_CHAT_ENABLED } from './enabled.ts'

const STORAGE_KEY_PANEL_OPEN = 'dsh.kr_chat.panel_open'

export type KrTabType = 'kr' | 'chat' | 'trajectory'

export interface KrChatState {
  readonly panelOpen: boolean
  readonly selectedTurn: number | null
  readonly fullscreen: boolean
  readonly activeTab: KrTabType
}

type Listener = () => void

class KrChatStore {
  private _panelOpen: boolean
  private _selectedTurn: number | null = null
  private _fullscreen: boolean = false
  // KR 关闭时初始即 'chat'：没有「KR对话」标签可点，绝不能停在 'kr' 上 ——
  // 那会让 isKrMode 为 true 却又不挂右侧大盘，左侧工具树被 CSS 隐藏后无处可看。
  private _activeTab: KrTabType = KR_CHAT_ENABLED ? 'kr' : 'chat'
  private _cachedSnapshot: KrChatState | null = null
  private readonly _listeners = new Set<Listener>()

  constructor() {
    // 默认右侧面板展开
    if (typeof localStorage !== 'undefined') {
      try {
        const stored = localStorage.getItem(STORAGE_KEY_PANEL_OPEN)
        this._panelOpen = stored === null ? true : stored === 'true'
      } catch {
        this._panelOpen = true
      }
    } else {
      this._panelOpen = true
    }
    this.updateSnapshot()
    // 初始化同步 body 属性（KR 关闭时按 'chat' 走，绝不写 data-dsh-kr-chat）
    this.syncBodyAttribute(this._activeTab)
  }

  get snapshot(): KrChatState {
    if (!this._cachedSnapshot) {
      this.updateSnapshot()
    }
    return this._cachedSnapshot!
  }

  private updateSnapshot(): void {
    this._cachedSnapshot = {
      panelOpen: this._panelOpen,
      selectedTurn: this._selectedTurn,
      fullscreen: this._fullscreen,
      activeTab: this._activeTab,
    }
  }

  setActiveTab(tab: KrTabType, force = false): void {
    if (!force && this._activeTab === tab) {
      this.syncBodyAttribute(tab)
      return
    }
    this._activeTab = tab
    this.updateSnapshot()
    this.syncBodyAttribute(tab)
    this.notify()
  }

  private syncBodyAttribute(tab: KrTabType): void {
    if (typeof document !== 'undefined') {
      const hasActiveChat = Boolean(
        document.querySelector('header [role="tablist"]') ||
        document.querySelectorAll('[data-chat-turn]').length > 0
      )
      if (tab === 'kr' && hasActiveChat) {
        if (document.body.getAttribute('data-dsh-kr-chat') !== 'true') {
          document.body.setAttribute('data-dsh-kr-chat', 'true')
        }
      } else {
        if (document.body.getAttribute('data-dsh-kr-chat') !== null) {
          document.body.removeAttribute('data-dsh-kr-chat')
        }
      }
    }
  }

  setPanelOpen(open: boolean): void {
    if (this._panelOpen === open) return
    this._panelOpen = open
    try {
      localStorage.setItem(STORAGE_KEY_PANEL_OPEN, String(open))
    } catch { /* ignore */ }
    this.updateSnapshot()
    this.notify()
  }

  togglePanel(): void {
    this.setPanelOpen(!this._panelOpen)
  }

  setSelectedTurn(turn: number | null): void {
    if (this._selectedTurn === turn) return
    this._selectedTurn = turn
    this.updateSnapshot()
    this.notify()
  }

  setFullscreen(fs: boolean): void {
    if (this._fullscreen === fs) return
    this._fullscreen = fs
    this.updateSnapshot()
    this.notify()
  }

  toggleFullscreen(): void {
    this.setFullscreen(!this._fullscreen)
  }

  subscribe(listener: Listener): () => void {
    this._listeners.add(listener)
    return () => {
      this._listeners.delete(listener)
    }
  }

  private notify(): void {
    for (const listener of this._listeners) {
      try {
        listener()
      } catch (err) {
        console.error('[kr-chat-store] listener error', err)
      }
    }
  }
}

let storeInstance: KrChatStore | null = null

export function getKrChatStore(): KrChatStore {
  if (!storeInstance) {
    storeInstance = new KrChatStore()
  }
  return storeInstance
}
