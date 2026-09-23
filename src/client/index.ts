/**
 * dsh-chat-plus — client 半身入口（思考 chip + 工具调用聚合 + 对话流卡片
 * + 对话截图）。
 *
 * 自 dsh-webui 的 dsh-better-markdown（思考 chip 部分）+ dsh-tool-summary
 * 拆分为独立插件，三点行为差异见 thinking/ThinkingStepNodeView.tsx 头注释：
 *  1. 正文链路保持官方（MarkdownText / renderMessageImages），不引入 markstream；
 *  2. 对话流卡片只在回合结束后出现（流式期不包卡，保住流式输出）；
 *  3. 思考与工具共用同一个活动抽屉（window 级总线，键名与 webui 相同，
 *     与 webui 并存时按 last-write-wins 共享同一抽屉）。
 * 另含对话截图：assistant 消息操作栏相机按钮（conversation.chat.assistant-actions，
 * id chat-flow-screenshot），与 webui 的截图按钮 id 不同、互不冲突。
 */
import type { Context as ClientContext } from '@deepseek-ai/dsh-client-runtime/client'
// Type-only: 拉入 ui-chat / ui-tool / ui-session 的 SlotMap 与标准 props 合并
// 声明（assistant-step / tool-call keyed 槽位 + assistant-actions 槽位的
// useChat/useSessions 契约）+ ui-slots 的 slots 服务声明 + dsh-client-locale
// 的 common 词汇合并（t 的共享键域，markdown 标签用）。
import type {} from '@deepseek-ai/dsh-client-ui-slots'
import type {} from '@deepseek-ai/dsh-client-ui-renderer/client'
import type {} from '@deepseek-ai/dsh-client-ui-chat/client'
import type {} from '@deepseek-ai/dsh-client-ui-tool/client'
import type {} from '@deepseek-ai/dsh-client-ui-session/client'
import type {} from '@deepseek-ai/dsh-client-locale/client'
import { injectStyles as injectToolSummaryStyles } from './tool-summary/styles.ts'
import { injectStyles as injectBaseStyles } from './styles.ts'
import { injectDiagramStyles } from './diagram/styles.ts'
import { injectProtoStyles } from './proto/styles.ts'
import { injectDownloadStyles } from './download/styles.ts'
import { DownloadCard } from './download/DownloadCard.tsx'
import { mountActivityDrawer } from './tool-summary/activity-drawer.tsx'
import { ToolGroupNodeView } from './tool-summary/ToolGroupNodeView.tsx'
import { TurnProcessShadowView } from './tool-summary/TurnProcessShadowView.tsx'
import { ThinkingStepNodeView } from './thinking/ThinkingStepNodeView.tsx'
import { RetryShadowView } from './retry/RetryShadowView.tsx'
import { applyMessageScreenshot } from './shot/index.tsx'
import { mountShellChrome } from './shell-chrome.ts'
import { injectKrStyles } from './kr-chat/styles.ts'
import { mountKrChatController } from './kr-chat/kr-chat-controller.tsx'
import { KrTodoBridge } from './kr-chat/kr-todo-bridge.ts'
import { KR_CHAT_ENABLED } from './kr-chat/enabled.ts'

/** 顶层服务依赖（client boot graph 用）。 */
export const inject = ['slots']

/** 单个模块失败不拖垮插件整体。 */
function guarded(ctx: ClientContext, label: string, mount: () => void): void {
  try {
    mount()
  } catch (error) {
    console.warn(`[dsh-chat-plus] ${label} 挂载失败：${error instanceof Error ? error.message : String(error)}`)
  }
}

let savedCtx: ClientContext | null = null
export let officialAssistantNodeView: any = null

export function getOfficialAssistantNodeView(): any {
  if (officialAssistantNodeView) return officialAssistantNodeView
  if (savedCtx) {
    try {
      const entries = savedCtx.slots.entries('conversation.chat.node')
      const assistantEntry = entries.find((e: any) => e.options?.key === 'assistant-step' && (e.options?.priority ?? 0) >= 0)
      if (assistantEntry?.component) {
        officialAssistantNodeView = assistantEntry.component
      }
    } catch {
      // ignore
    }
  }
  return officialAssistantNodeView
}

export function apply(ctx: ClientContext): void {
  savedCtx = ctx
  if (typeof window !== 'undefined') {
    (window as any).__dshClientCtx__ = ctx
  }
  // 样式：工具聚合（dts__）、思考/流卡（dtt__）两枚 + 截图面板（tsh__）独立
  // <style>，幂等注入。
  guarded(ctx, 'tool-summary styles', injectToolSummaryStyles)
  guarded(ctx, 'chat-flow styles', injectBaseStyles)
  guarded(ctx, 'proto card styles', injectProtoStyles)
  guarded(ctx, 'diagram styles', injectDiagramStyles)
  guarded(ctx, 'download card styles', injectDownloadStyles)
  // 共享活动抽屉：思考与工具调用的详情面板（body 级宿主，只挂一次）。
  guarded(ctx, 'activity drawer', mountActivityDrawer)

  // 壳窗口控制联动：壳内（iframe）检测 + header 右簇左移留位 + 主题上报。
  // 浏览器直开时整模块 no-op。
  guarded(ctx, 'shell chrome', mountShellChrome)

  // 对话截图：assistant 消息操作栏相机按钮 → 截图面板（独立 id，KR模式生效）。
  guarded(ctx, 'screenshot seat', () => { applyMessageScreenshot(ctx) })

  // 捕获官方原生的 assistant-step 渲染组件，普通「对话」模式下直接由官方接管
  try {
    const entries = ctx.slots.entries('conversation.chat.node')
    const assistantEntry = entries.find((e: any) => e.options?.key === 'assistant-step' && (e.options?.priority ?? 0) >= 0)
    if (assistantEntry?.component) {
      officialAssistantNodeView = assistantEntry.component
    }
  } catch (error) {
    console.warn('[dsh-chat-plus] 捕获官方 assistant-step 失败：', error)
  }

  // 思考与步骤呈现：在 KR 模式下呈现 KrFlowThoughtCard / KrFlowExecutingCard，
  // 在普通「对话」模式下委托回官方 AssistantNodeView 原生渲染。
  guarded(ctx, 'assistant-step seat', () => {
    const entries = ctx.slots.entries('conversation.chat.node')
    const assistantEntry = entries.find((e: any) => e.options?.key === 'assistant-step' && (e.options?.priority ?? 0) >= 0)
    ctx.slots.inject('conversation.chat.node', () => ctx.slots.register({
      name: 'conversation.chat.node',
      key: 'assistant-step',
      priority: -100,
      locale: 'chat',
      ...(assistantEntry?.options?.inject ? { inject: assistantEntry.options.inject } : {}),
    }, ThinkingStepNodeView))
  })
  // download 原子卡片：接管内置 download 工具行（keyed tool.call.toolview，
  // key = wire 工具名）。host 半身注册 download 工具 + 进度路由；运行中约
  // 700ms 轮询真实进度（字节/速度/ETA），完成态读 meta 摘要。host 未就绪或
  // 旧版本时优雅降级为时长显示。
  guarded(ctx, 'download toolview seat', () => {
    ctx.slots.inject('tool.call.toolview', () => ctx.slots.register(
      { name: 'tool.call.toolview', key: 'download' },
      DownloadCard,
    ))
  })

  // KR 对话双栏布局与执行大盘（视图分类「KR对话」+ 右侧 Agent 轨迹大盘）。
  //
  // 已被 KR_CHAT_ENABLED 关闭 —— 只隐藏、不删除：控制器、样式、面板组件全部
  // 原样留在 kr-chat/ 下，把 enabled.ts 里的开关改回 true 即完整恢复。
  if (KR_CHAT_ENABLED) {
    guarded(ctx, 'kr-chat styles', injectKrStyles)
    guarded(ctx, 'kr-chat controller', mountKrChatController)
  }

  // 桥接官方 todos 投影，供右侧大盘实时展示真实任务。
  //
  // 大盘已隐藏，但这个座位同时是「会话身份登记点」：它在 session 作用域、
  // 空白 Hero 态照常渲染，会话 id 一变即清空活动抽屉 / live todos / 已选轮次，
  // 免得切会话后抽屉里还留着上一会话的思考与工具树。与 KR 的可见 UI 无关，
  // 因此不随开关关闭。
  guarded(ctx, 'kr-todo bridge', () => {
    ctx.slots.inject('conversation.input.dock', () => ctx.slots.register(
      { name: 'conversation.input.dock', id: 'kr-todo-bridge', order: 999 },
      KrTodoBridge,
    ))
  })
}
