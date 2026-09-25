/**
 * dsh-chat-plus — KR 对话双栏布局与执行大盘独立样式表。
 */

export const KR_STYLES = `
/* ══ 当处于 KR 对话模式时，外层 conversation-content 成为双栏 row 布局 ══════ */
body[data-dsh-kr-chat="true"] [data-conversation-content] {
  flex-direction: row !important;
  display: flex !important;
  width: 100% !important;
  height: 100% !important;
  position: relative !important;
  overflow: hidden !important;
}

body[data-dsh-kr-chat="true"] [data-conversation-scroll] {
  flex: 1 1 0 !important;
  min-width: 0 !important;
  height: 100% !important;
  position: relative !important;
  display: flex !important;
  flex-direction: column !important;
}

/* 隐藏旧的折叠行与折叠 chip，以及在 KR 模式下左侧隐藏原生工具树与紧凑控制行（详情收敛至右侧大盘） */
body[data-dsh-kr-chat="true"] .dts__process,
body[data-dsh-kr-chat="true"] .dts__entry,
body[data-dsh-kr-chat="true"] .dtt__chip,
body[data-dsh-kr-chat="true"] [data-chat-call-id],
body[data-dsh-kr-chat="true"] [data-chat-anchor-key^="call:"],
body[data-dsh-kr-chat="true"] [data-step-process],
body[data-dsh-kr-chat="true"] [data-turn-process],
/*
 * 官方把「同一个 assistant-step 节点」投影成两份 DOM：
 *   [data-turn-process-member] 过程投影（groupPart=reasoning）
 *   [data-turn-process-answer] 答案投影（groupPart=response）
 * 本插件注册在 conversation.chat.node / assistant-step 上，不区分投影，
 * 于是思考卡与总结卡在两份里各渲染一次。
 *
 * 官方只在折叠态隐藏过程投影（processHidden = foldable && processMember && !processOpen），
 * 所以一旦展开（processOpen=true，包括 processMember 时自动 setOpen(true)），
 * 两份同时可见 → 左侧每张卡都重复一遍（用户报的「点开思考到总结时出现两个」）。
 *
 * KR 模式下左侧只该留答案投影：过程内容由本插件自己的思考卡承接，工具明细收敛
 * 到右侧大盘，所以把过程投影整个隐掉。实测每轮可见块数正好减半，且过程投影的
 * 每一块在答案投影里都有同文副本（唯一内容丢失 0 条）。
 */
body[data-dsh-kr-chat="true"] [data-turn-process-member] {
  display: none !important;
}

/* 实时活动卡借用 turn-process 的 per-turn 座位，但KR 模式要让它可见。
   :has 只命中含新卡的那一个过程投影，不把官方过程内容/重复节点放回来。 */
body[data-dsh-kr-chat="true"] [data-turn-process]:has(.kr-agent-mini-shell),
body[data-dsh-kr-chat="true"] [data-turn-process-member]:has(.kr-agent-mini-shell) {
  display: block !important;
}

/* response group 是最终答案投影：即使 DSH 尚未把 live turn 切到 answer
   状态，也先让它的可见正文显示出来；reasoning group 仍隐藏，由活动卡承接。 */
body[data-dsh-kr-chat="true"] [data-turn-process-member][data-chat-group-part="response"] {
  display: block !important;
}

/* ══ KR 模式下左侧对话流交互（无染色视觉，点击即可直接选中联动大盘） ═════════ */
body[data-dsh-kr-chat="true"] [data-conversation-scroll] [data-chat-turn] {
  cursor: pointer;
}

body[data-dsh-kr-chat="true"] [data-conversation-scroll] [data-chat-turn] p,
body[data-dsh-kr-chat="true"] [data-conversation-scroll] [data-chat-turn] pre,
body[data-dsh-kr-chat="true"] [data-conversation-scroll] [data-chat-turn] code,
body[data-dsh-kr-chat="true"] [data-conversation-scroll] [data-chat-turn] a {
  cursor: text;
}

/* ══ 头部 KR 对话分类标签（与官方原生标签保持完全一致的块级排版与基线） ════════ */
.kr-tab-btn {
  display: block;
  padding: 0 0 9px;
  border: none;
  background: transparent;
  font-family: inherit;
  font-size: 13px;
  font-weight: 500;
  line-height: 16px;
  cursor: pointer;
  position: relative;
  transition: color .18s ease;
  color: var(--dsw-alias-label-tertiary);
  outline: none;
  user-select: none;
}

.kr-tab-btn::after {
  content: '';
  position: absolute;
  right: 0;
  bottom: -1px;
  left: 0;
  height: 2px;
  border-radius: 2px;
  background: transparent;
  transform: scaleX(0);
  transform-origin: 50% 100%;
  transition: transform .22s cubic-bezier(.2, .8, .2, 1), background-color .18s ease;
}

.kr-tab-btn:hover {
  color: var(--dsw-alias-label-primary);
}

.kr-tab-btn:hover::after {
  background: var(--dsw-alias-border-l2, rgba(127,127,127,.28));
  transform: scaleX(1);
}

.kr-tab-btn--active {
  color: var(--dsw-alias-state-business-primary, #4176e6) !important;
  font-weight: 500 !important;
}

.kr-tab-btn--active::after {
  background: var(--dsw-alias-state-business-primary, #4176e6) !important;
  transform: scaleX(1) !important;
}

/* 当处于 KR 模式时，原生的“对话”与“轨迹”按钮不要显示激活高亮与下划线 */
body[data-dsh-kr-chat="true"] header [role="tablist"] > button[role="tab"]:not(#kr-chat-tab-btn)::after {
  transform: scaleX(0) !important;
  background: transparent !important;
}
body[data-dsh-kr-chat="true"] header [role="tablist"] > button[role="tab"]:not(#kr-chat-tab-btn) {
  color: var(--dsw-alias-label-tertiary) !important;
  font-weight: 500 !important;
}
body[data-dsh-kr-chat="true"] header [role="tablist"] > button[role="tab"]:not(#kr-chat-tab-btn):hover {
  color: var(--dsw-alias-label-primary) !important;
}
body[data-dsh-kr-chat="true"] header [role="tablist"] #kr-chat-tab-btn {
  color: var(--dsw-alias-state-business-primary, #4176e6) !important;
  font-weight: 500 !important;
}
body[data-dsh-kr-chat="true"] header [role="tablist"] #kr-chat-tab-btn::after {
  transform: scaleX(1) !important;
  background: var(--dsw-alias-state-business-primary, #4176e6) !important;
}

:root,
body[data-dsh-kr-chat="true"],
.kr-split,
.kr-split__side {
  --kr-accent: var(--dsw-alias-state-business-primary, #4176e6);
  --kr-success: #10b981;
  --kr-warning: #f59e0b;
  --kr-error: #ef4444;
  /*
   * 表面策略：**整个右栏不投投影**，卡片也一律贴平。
   *
   * 大盘与左侧官方侧边栏同色（见下方 --kr-canvas-bg），两者是同一层 chrome，
   * 靠一根发丝分隔线划界即可；曾经那层「只往左投」的悬浮投影是大盘还纯白、
   * 与左栏一灰一白时的做法，同色之后不再成立。
   *
   * 卡片同理不投影：底板是浅灰 #f9fafb、卡片是白 layer-1，浅色下自带约 5 的
   * 亮度差就够分层；再叠投影会变成「灰底上浮一层白卡又投一层影」。投影只留给
   * hover 做瞬时反馈。
   */
  --kr-card-bg: var(--dsw-alias-bg-layer-1, #ffffff);
  --kr-surface-bg: var(--dsw-alias-bg-layer-1, #ffffff);
  --kr-canvas-bg: var(--dsw-specific-sidebar-fill, var(--dsw-alias-bg-base, #ffffff));
  /* 描边退到发丝级：浅色 4% 黑 / 深色 6% 白（l1 自带主题感知）。
     卡片不再靠投影浮起，边界感全交给这根描边。 */
  --kr-card-border: var(--dsw-alias-border-l1, rgba(0, 0, 0, 0.06));
  --kr-card-hover: var(--dsw-alias-border-l2, rgba(0, 0, 0, 0.16));
  --kr-hairline: var(--dsw-alias-border-l1, rgba(0, 0, 0, 0.06));
  --kr-hover-bg: var(--dsw-alias-interactive-bg-hover, rgba(38, 49, 72, 0.06));
  --kr-fill-bg: var(--dsw-alias-interactive-bg-active, rgba(38, 49, 72, 0.1));
  /* 卡片常态不投影（贴在大盘上）；hover 才轻微浮起一档做反馈。 */
  --kr-card-shadow: none;
  --kr-card-shadow-hover: 0 1px 3px rgba(16, 24, 40, 0.08), 0 4px 12px rgba(16, 24, 40, 0.07);
}

/* 深色主题：卡片(layer-1 #232324)本就比大盘底亮，靠色差分层即可，
   同样不给常态投影。 */
body[data-ds-dark-theme],
body[data-ds-dark-theme] .kr-split__side {
  --kr-card-border: rgba(255, 255, 255, 0.07);
  --kr-card-shadow: none;
  --kr-card-shadow-hover: 0 1px 2px rgba(0, 0, 0, 0.4), 0 4px 12px rgba(0, 0, 0, 0.3);
}

.kr-split {
  display: flex;
  width: 100%;
  height: 100%;
  min-height: 0;
  position: relative;
  overflow: hidden;
}

/* 左侧主对话流 */
.kr-split__main {
  flex: 1 1 0;
  min-width: 0;
  height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
  transition: flex 0.26s cubic-bezier(0.16, 1, 0.3, 1);
}

/* 右侧 Agent 轨迹大盘 */
.kr-split__side {
  width: 440px;
  min-width: 360px;
  max-width: 520px;
  flex: none;
  height: 100%;
  display: flex;
  flex-direction: column;
  /* 与左侧官方侧边栏同色（--kr-canvas-bg），两者是同一层 chrome，
     因此**不投悬浮投影**——只留一根发丝分隔线划出边界。
     （历史上加过「只往左投」的悬浮投影，那是大盘还是纯白底、与左栏一灰一白
     时的做法；同色之后那层投影不再成立，反而像贴了张浮纸。） */
  border-left: 1px solid var(--kr-hairline);
  background: var(--kr-canvas-bg);
  position: relative;
  z-index: 10;
  transition: width 0.26s cubic-bezier(0.16, 1, 0.3, 1), transform 0.26s cubic-bezier(0.16, 1, 0.3, 1);
  overflow: hidden;
}

/* 拖拽中：关掉宽度过渡（过渡会跟手打架，拖起来一顿一顿的），全局换 col-resize。 */
.kr-split__side[data-dragging="true"] {
  transition: none;
}
body[data-kr-resizing="true"] {
  cursor: col-resize !important;
  user-select: none !important;
}
body[data-kr-resizing="true"] * {
  cursor: col-resize !important;
}

/* 左边缘拖拽手柄：宽 7px 的命中区，视觉上只有 1px 发丝线加粗一下。
   absolute 覆盖在容器左边缘上（容器 overflow:hidden 已裁剪），不参与 flex。 */
.kr-panel__resize-handle {
  position: absolute;
  top: 0;
  bottom: 0;
  left: -3px;
  width: 7px;
  cursor: col-resize;
  z-index: 60;
  touch-action: none;
}
/* 悬停/拖拽时亮一条竖线，提示「这里可以拖」。 */
.kr-panel__resize-handle::before {
  content: '';
  position: absolute;
  top: 0;
  bottom: 0;
  left: 3px;
  width: 1px;
  background: transparent;
  transition: background 0.15s ease;
}
.kr-panel__resize-handle:hover::before,
.kr-split__side[data-dragging="true"] .kr-panel__resize-handle::before {
  background: var(--kr-accent);
}

/* 全屏态铺满整个 split：无投影，此规则保留作显式声明，
   防止将来有人给基础态加投影时漏掉这一态。 */
.kr-split__side--fullscreen {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  width: 100% !important;
  max-width: none !important;
  z-index: 50;
  box-shadow: none;
}

/* ══ 右栏顶部 Header ═══════════════════════════════════════════════════════ */
.kr-panel__header {
  height: 60px;
  padding: 0 14px;
  display: flex;
  align-items: center;
  gap: 10px;
  border-bottom: 1px solid var(--kr-hairline);
  flex: none;
  /* 顶栏是面板级 chrome（横贯整个右栏），跟大盘底板同色。
     不能取 --kr-surface-bg —— 那个 token 是给卡片/药丸内部小元素的
     「白底」用的（它们要浮在灰底上分层），顶栏用它就会在这条 60px 上
     留一道白色，与左右两栏的侧边栏色对不上。 */
  background: var(--kr-canvas-bg);
}

.kr-panel__close-btn {
  width: 28px;
  height: 28px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  color: var(--dsw-alias-label-tertiary);
  cursor: pointer;
  transition: background-color 0.15s, color 0.15s;
  flex: none;
}

.kr-panel__close-btn:hover {
  background: var(--dsw-alias-interactive-bg-hover, rgba(127,127,127,0.15));
  color: var(--dsw-alias-label-primary);
}

.kr-panel__avatar {
  width: 30px;
  height: 30px;
  border-radius: 8px;
  background: var(--kr-fill-bg);
  border: none;
  color: var(--dsw-alias-label-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
  flex: none;
}

.kr-panel__avatar svg {
  width: 18px;
  height: 18px;
}

/* ══ 空态：本次对话尚无内容（新会话空白期） ══════════════════════════════ */
.kr-panel__empty {
  flex: 1 1 auto;
  min-height: 220px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 32px 24px;
  text-align: center;
  color: var(--dsw-alias-label-tertiary);
}

.kr-panel__empty-icon {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--kr-surface-bg);
  border: 1px solid var(--kr-card-border);
  color: var(--dsw-alias-label-tertiary);
  margin-bottom: 2px;
}

.kr-panel__empty-title {
  font-size: 13px;
  font-weight: 600;
  color: var(--dsw-alias-label-secondary);
}

.kr-panel__empty-desc {
  font-size: 12px;
  line-height: 1.6;
  color: var(--dsw-alias-label-tertiary);
  max-width: 240px;
}

.kr-panel__titles {
  flex: 1 1 auto;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.kr-panel__title-row {
  display: flex;
  align-items: center;
  gap: 6px;
  min-width: 0;
}

.kr-panel__status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--dsw-alias-label-tertiary);
  flex: none;
}

.kr-panel__status-dot--running {
  background: var(--dsw-alias-label-primary);
  animation: kr-pulse 1.8s infinite;
}

@keyframes kr-pulse {
  0% { transform: scale(0.9); opacity: 0.8; }
  50% { transform: scale(1.3); opacity: 1; }
  100% { transform: scale(0.9); opacity: 0.8; }
}

.kr-panel__title {
  font-size: 14px;
  font-weight: 600;
  color: var(--dsw-alias-label-primary);
  letter-spacing: -0.01em;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  min-width: 0;
}

.kr-panel__subtitle {
  font-size: 12px;
  color: var(--dsw-alias-label-tertiary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.kr-panel__actions {
  display: flex;
  align-items: center;
  gap: 4px;
  flex: none;
}

.kr-panel__action-btn {
  width: 26px;
  height: 26px;
  border-radius: 6px;
  border: none;
  background: transparent;
  color: var(--dsw-alias-label-tertiary);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.15s;
}

.kr-panel__action-btn:hover {
  background: var(--dsw-alias-interactive-bg-hover, rgba(127,127,127,0.15));
  color: var(--dsw-alias-label-primary);
}

.kr-panel__action-btn--active {
  color: var(--kr-accent);
  background: var(--kr-fill-bg);
}

.kr-panel__subtitle--clickable {
  cursor: pointer;
  transition: color 0.15s;
}

.kr-panel__subtitle--clickable:hover {
  color: var(--dsw-alias-label-primary);
}

/* ══ 右栏内容滚动区 ════════════════════════════════════════════════════════ */
.kr-panel__scroll {
  flex: 1 1 0;
  min-height: 0;
  overflow-y: auto;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  background: var(--kr-canvas-bg);
}

/* 历史轮次提示胶囊 */
.kr-panel__turn-hint {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 6px 12px;
  background: var(--kr-surface-bg);
  border: 1px solid var(--kr-card-border);
  border-radius: 8px;
  font-size: 12px;
  color: var(--dsw-alias-label-secondary);
}

.kr-panel__turn-hint-btn {
  background: var(--kr-fill-bg);
  color: var(--dsw-alias-label-primary);
  border: 1px solid var(--kr-card-border);
  border-radius: 4px;
  padding: 2px 8px;
  font-size: 11px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.15s ease;
}

.kr-panel__turn-hint-btn:hover {
  background: var(--dsw-alias-interactive-bg-hover, rgba(127, 127, 127, 0.22));
}

/* ══ 统计指标药丸已移除 ════════════════════════════════════════════════════
   顶部「查看执行统计指标」按钮与它展开的药丸行（第 N 轮 / N 次工具调用 /
   N 次失败 / 耗时）按用户要求整体去掉，相关样式随之删除。
   @keyframes kr-fade-in 仍被工具详情面板使用，保留在文件下方定义处。 */

/* ══ 通用卡片容器（高雅纯白、轻柔投影、精细微边框） ══════════════════════════ */
.kr-card {
  background: var(--kr-card-bg);
  border: 1px solid var(--kr-card-border);
  border-radius: 10px;
  box-shadow: var(--kr-card-shadow);
  padding: 12px 14px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
}

.kr-card:hover {
  border-color: var(--kr-card-hover);
  box-shadow: var(--kr-card-shadow-hover);
}

.kr-card__header {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  user-select: none;
}

.kr-card__icon {
  width: 18px;
  height: 18px;
  color: var(--dsw-alias-label-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
}

.kr-card__title {
  font-size: 13px;
  font-weight: 600;
  color: var(--dsw-alias-label-primary);
  flex: 1;
}

/* 工具调用卡标题行右端的「展开 N 次调用」提示：与标题同在一行，
   次要色弱化（展开动作的主角是整行头部点击区）。 */
.kr-tools-expand-hint {
  flex: none;
  font-size: 11px;
  color: var(--dsw-alias-label-tertiary);
  white-space: nowrap;
}

.kr-card__badge {
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 4px;
}

.kr-card__badge--running {
  background: var(--kr-fill-bg);
  color: var(--dsw-alias-label-primary);
  border: 1px solid var(--kr-card-border);
}

.kr-card__badge--done {
  background: var(--kr-hover-bg);
  color: var(--dsw-alias-label-tertiary);
}

.kr-card__chevron {
  color: var(--dsw-alias-label-caption);
  transition: transform 0.2s ease;
}

.kr-card__chevron[data-collapsed="true"] {
  transform: rotate(180deg);
}

/* ══ 任务概览卡片（单卡片原生极简设计）═════════════════════════════════════ */
.kr-card--task {
  padding: 12px 14px;
}

/* 极简细平滑进度条（2.5px，轻量雅致，不割裂界面） */
.kr-task-progress-line {
  height: 2.5px;
  background: var(--kr-fill-bg);
  border-radius: 999px;
  overflow: hidden;
  margin: 4px 0 6px;
}

.kr-task-progress-line__fill {
  height: 100%;
  background: var(--dsw-alias-label-secondary, #61666b);
  border-radius: 999px;
  transition: width 0.35s cubic-bezier(0.16, 1, 0.3, 1);
}

/* 任务列表 */
.kr-task-list {
  display: flex;
  flex-direction: column;
  gap: 1px;
}

/* 任务行：轻盈、透气、微反馈 */
.kr-task-item {
  display: flex;
  align-items: flex-start;
  gap: 9px;
  padding: 6px 8px;
  border-radius: 6px;
  transition: background-color 0.12s ease;
}

.kr-task-item:hover {
  background: var(--dsw-alias-interactive-bg-hover, rgba(127, 127, 127, 0.07));
}

.kr-task-item__icon {
  width: 14px;
  height: 14px;
  flex: none;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 2px;
  color: var(--dsw-alias-label-tertiary);
}

.kr-task-item--completed .kr-task-item__icon {
  color: var(--dsw-alias-label-secondary);
}

.kr-task-item--in_progress .kr-task-item__icon {
  color: var(--dsw-alias-state-business-primary, #4176e6);
}

.kr-task-item__content {
  flex: 1;
  min-width: 0;
  font-size: 12.5px;
  line-height: 1.45;
  color: var(--dsw-alias-label-primary);
  word-break: break-word;
}

.kr-task-item--completed .kr-task-item__content {
  color: var(--dsw-alias-label-secondary);
}

.kr-task-item__tag {
  font-size: 11px;
  font-weight: 500;
  padding: 1px 6px;
  border-radius: 4px;
  flex: none;
  margin-top: 1px;
  white-space: nowrap;
}

.kr-task-item__tag--running {
  color: var(--dsw-alias-state-business-primary, #4176e6);
  background: rgba(65, 118, 230, 0.1);
}

/* ══ 思考过程卡片 ══════════════════════════════════════════════════════════ */
.kr-reasoning-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  font-size: 12px;
  line-height: 1.6;
  color: var(--dsw-alias-label-secondary);
}

/*
 * 有界视口：行数上限由组件传入的 --kr-reasoning-rows 驱动
 * （见 KrReasoningCard 的 REASONING_MAX_ROWS），行高 12px × 1.6 = 19.2px。
 * 超出部分在视口内滚动，卡片不再被思考内容撑成长条。
 * 上下缘按滚动位置渐隐，与左侧实时轨道同一套做法（data-edges）。
 */
.kr-reasoning-view {
  --kr-reasoning-line: 19.2px;
  --kr-reasoning-rows: 25;
  max-height: calc(var(--kr-reasoning-line) * var(--kr-reasoning-rows));
  overflow-y: auto;
  overscroll-behavior-y: contain;
  scroll-behavior: auto;
  overflow-anchor: none;
  padding-right: 2px;
  scrollbar-width: thin;
  scrollbar-color: var(--dsw-alias-scrollbar-bg-l2, rgba(127, 127, 127, .4)) transparent;
}

.kr-reasoning-inner {
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 0;
}

.kr-reasoning-view[data-edges="both"] {
  -webkit-mask-image: linear-gradient(transparent 0, black 18px, black calc(100% - 18px), transparent 100%);
  mask-image: linear-gradient(transparent 0, black 18px, black calc(100% - 18px), transparent 100%);
}

.kr-reasoning-view[data-edges="top"] {
  -webkit-mask-image: linear-gradient(transparent 0, black 18px, black 100%);
  mask-image: linear-gradient(transparent 0, black 18px, black 100%);
}

.kr-reasoning-view[data-edges="bottom"] {
  -webkit-mask-image: linear-gradient(black 0, black calc(100% - 18px), transparent 100%);
  mask-image: linear-gradient(black 0, black calc(100% - 18px), transparent 100%);
}

.kr-reasoning-view:focus-visible {
  outline: 2px solid var(--kr-accent);
  outline-offset: -2px;
}

.kr-reasoning-view::-webkit-scrollbar {
  width: 4px;
  height: 4px;
}

.kr-reasoning-view::-webkit-scrollbar-track {
  background: transparent;
}

.kr-reasoning-view::-webkit-scrollbar-thumb {
  background: var(--dsw-alias-scrollbar-bg-l2, rgba(127, 127, 127, .4));
  border-radius: 2px;
}

@media (forced-colors: active) {
  .kr-reasoning-view { -webkit-mask-image: none !important; mask-image: none !important; }
}

/* 跟随状态提示（只在截停时出现，给用户明确反馈） */
.kr-card__follow {
  flex: none;
  font-size: 11px;
  padding: 1px 6px;
  border-radius: 4px;
  color: var(--dsw-alias-label-tertiary);
  background: var(--kr-hover-bg);
  white-space: nowrap;
}

.kr-reasoning-row {
  display: flex;
  gap: 6px;
  white-space: pre-wrap;
  word-break: break-word;
}

.kr-reasoning-num {
  color: var(--kr-accent);
  font-weight: 600;
  flex: none;
}

.kr-expand-btn {
  background: transparent;
  border: none;
  color: var(--dsw-alias-label-secondary);
  font-size: 12px;
  cursor: pointer;
  padding: 4px 0;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  margin-top: 4px;
  transition: color 0.15s ease;
}

.kr-expand-btn:hover {
  color: var(--dsw-alias-label-primary);
  text-decoration: none;
}

/* ══ 工具调用卡片与点击展开交互 ═════════════════════════════════════════════ */
.kr-tools-list {
  display: flex;
  flex-direction: column;
  gap: 2px;
  margin-top: 2px;
}

.kr-tool-card-item {
  border-radius: 6px;
  background: transparent;
  border: 1px solid transparent;
  overflow: hidden;
  transition: all 0.15s ease;
}

.kr-tool-card-item:hover {
  background: var(--kr-hover-bg);
}

.kr-tool-card-item--expanded {
  background: var(--kr-surface-bg);
  border: 1px solid var(--kr-card-border);
  /* 展开态是卡片内部的一块高亮区，用描边区分即可；
     再投一层阴影就会在卡片里叠出第三层「悬浮」。 */
  box-shadow: none;
  margin: 2px 0;
  border-radius: 8px;
}

.kr-tool-card-item--failed {
  border-color: rgba(239, 68, 68, 0.25);
}

/* 概览行：整体可点击 */
.kr-tool-row {
  display: flex;
  align-items: center;
  gap: 9px;
  padding: 8px;
  font-size: 12px;
  color: var(--dsw-alias-label-primary);
  cursor: pointer;
  user-select: none;
  border-radius: 6px;
  transition: background-color 0.15s ease;
}

.kr-tool-icon {
  width: 16px;
  height: 16px;
  color: var(--dsw-alias-label-tertiary);
  flex: none;
  display: flex;
  align-items: center;
  justify-content: center;
}

.kr-tool-name {
  font-weight: 500;
  font-family: var(--ds-font-family-code, monospace);
  font-size: 11.5px;
  color: var(--dsw-alias-label-primary);
  flex: none;
}

.kr-tool-detail {
  flex: 1;
  color: var(--dsw-alias-label-secondary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.kr-tool-time {
  font-size: 11px;
  color: var(--dsw-alias-label-caption);
  font-variant-numeric: tabular-nums;
  flex: none;
}

.kr-tool-status {
  width: 14px;
  height: 14px;
  flex: none;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--dsw-alias-label-secondary);
}

.kr-tool-status--done {
  color: var(--dsw-alias-label-secondary);
}

.kr-tool-status--fail {
  color: var(--dsw-alias-label-primary);
}

.kr-tool-row__chevron {
  color: var(--dsw-alias-label-caption);
  flex: none;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s ease;
}

.kr-tool-row__chevron--open {
  transform: rotate(180deg);
}

/* 展开的详情面板 */
.kr-tool-detail-panel {
  padding: 10px 12px;
  border-top: 1px solid var(--kr-card-border);
  background: var(--dsw-alias-bg-module-platform, rgba(0, 0, 0, 0.1));
  display: flex;
  flex-direction: column;
  gap: 10px;
  animation: kr-fade-in 0.2s ease-out;
}

/* 台账信息标签 */
.kr-tool-detail__ledger {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px;
  font-size: 11px;
}

.kr-tool-detail__badge {
  padding: 2px 7px;
  border-radius: 5px;
  background: var(--kr-surface-bg);
  border: 1px solid var(--kr-card-border);
  color: var(--dsw-alias-label-secondary);
}

.kr-tool-detail__badge--err {
  background: var(--kr-hover-bg);
  border-color: var(--kr-card-border);
  color: var(--dsw-alias-label-primary);
  font-weight: 500;
}

/* 页签栏 */
.kr-tool-detail__tabs {
  display: flex;
  align-items: center;
  gap: 4px;
  border-bottom: 1px solid var(--kr-card-border);
  padding-bottom: 4px;
}

.kr-tool-detail__tab {
  background: transparent;
  border: none;
  border-radius: 5px;
  padding: 3px 8px;
  font-size: 11.5px;
  color: var(--dsw-alias-label-tertiary);
  cursor: pointer;
  font-weight: 500;
  transition: all 0.15s ease;
}

.kr-tool-detail__tab:hover {
  color: var(--dsw-alias-label-primary);
  background: var(--dsw-alias-interactive-bg-hover, rgba(127, 127, 127, 0.1));
}

.kr-tool-detail__tab--active {
  color: var(--dsw-alias-label-primary) !important;
  background: var(--dsw-alias-interactive-bg-hover, rgba(127, 127, 127, 0.14)) !important;
}

/* 页签内容 */
.kr-tool-detail__content {
  display: flex;
  flex-direction: column;
}

.kr-tool-detail__section {
  display: flex;
  flex-direction: column;
}

/* 代码/文本框 */
.kr-tool-code-box {
  border-radius: 7px;
  border: 1px solid var(--kr-card-border);
  background: var(--dsw-alias-bg-layer-1, rgba(0, 0, 0, 0.2));
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.kr-tool-code-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 4px 8px;
  background: var(--kr-hover-bg);
  border-bottom: 1px solid var(--kr-card-border);
  font-size: 11px;
  color: var(--dsw-alias-label-caption);
}

.kr-tool-copy-btn {
  background: transparent;
  border: 1px solid transparent;
  border-radius: 4px;
  color: var(--dsw-alias-label-tertiary);
  font-size: 11px;
  cursor: pointer;
  padding: 1px 6px;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  transition: all 0.15s;
}

.kr-tool-copy-btn:hover {
  background: var(--dsw-alias-interactive-bg-hover, rgba(127, 127, 127, 0.15));
  color: var(--dsw-alias-label-primary);
  border-color: var(--kr-card-border);
}

.kr-tool-code-pre {
  margin: 0;
  padding: 8px 10px;
  font-size: 11.5px;
  line-height: 1.5;
  font-family: var(--ds-font-family-code, monospace);
  color: var(--dsw-alias-label-secondary);
  white-space: pre-wrap;
  word-break: break-word;
  max-height: 220px;
  overflow-y: auto;
}

.kr-tool-path-row {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 6px;
  font-size: 11.5px;
}

.kr-tool-path-label {
  color: var(--dsw-alias-label-tertiary);
}

.kr-tool-path-code {
  padding: 2px 6px;
  border-radius: 4px;
  background: var(--kr-surface-bg);
  border: 1px solid var(--kr-card-border);
  color: var(--dsw-alias-label-primary);
  font-family: var(--ds-font-family-code, monospace);
  font-size: 11px;
  word-break: break-all;
}

.kr-tool-empty-note {
  padding: 8px;
  font-size: 11.5px;
  color: var(--dsw-alias-label-tertiary);
  text-align: center;
}

/* 底部操作条 */
.kr-tool-detail__footer {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
  padding-top: 4px;
  border-top: 1px solid color-mix(in srgb, var(--kr-card-border) 60%, transparent);
}

.kr-tool-footer-btn {
  background: var(--kr-surface-bg);
  border: 1px solid var(--kr-card-border);
  color: var(--dsw-alias-label-secondary);
  border-radius: 5px;
  padding: 3px 8px;
  font-size: 11px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  transition: all 0.15s ease;
}

.kr-tool-footer-btn:hover {
  background: var(--dsw-alias-interactive-bg-hover, rgba(127, 127, 127, 0.15));
  color: var(--dsw-alias-label-primary);
  border-color: var(--kr-card-hover);
}

.kr-tool-footer-btn--link {
  color: var(--dsw-alias-label-secondary);
  border-color: var(--kr-card-border);
  background: var(--kr-surface-bg);
}

.kr-tool-footer-btn--link:hover {
  background: var(--dsw-alias-interactive-bg-hover, rgba(127, 127, 127, 0.15));
  color: var(--dsw-alias-label-primary);
  border-color: var(--kr-card-hover);
}

/* 失败提示条（只陈述失败原因，不提供重试动作） */
.kr-fail-card {
  padding: 10px 12px;
  border-radius: 8px;
  background: var(--kr-hover-bg);
  border: 1px solid var(--kr-card-border);
  display: flex;
  align-items: center;
  gap: 10px;
}

.kr-fail-text {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: var(--dsw-alias-label-primary);
}

/* ══ 执行结果卡片 ══════════════════════════════════════════════════════════ */
.kr-result-content {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: var(--dsw-alias-label-secondary);
}

.kr-result-icon {
  color: var(--dsw-alias-label-secondary);
  flex: none;
}

/* ══ 标签行最右侧的「Agent 轨迹大盘」开关 ══════════════════════════════════
   座位是 header [role="tablist"] 的最后一个子节点：margin-left:auto 把它顶到
   KR对话 / 对话 / 轨迹 这一行的最右端，与三个 tab 同行、同基线。
   （旧版 .kr-expand-capsule 是 position:absolute + 阴影 + backdrop-filter 的
   浮动胶囊，浮在正文右上角压内容；这里改为行内座位，不再悬浮。）

   常态一律中性灰、无底色：开/关不靠颜色区分（用户明确不要这里出现颜色），
   大盘在不在屏幕上本身就是状态指示，开关只提供 hover 反馈与 tooltip 文案。 */
.kr-panel-toggle {
  margin-left: auto;
  align-self: center;
  flex: none;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 24px;
  padding: 0 10px;
  border: 1px solid transparent;
  border-radius: 6px;
  background: transparent;
  color: var(--dsw-alias-label-tertiary);
  font-family: inherit;
  font-size: 13px;
  font-weight: 500;
  line-height: 1;
  white-space: nowrap;
  cursor: pointer;
  outline: none;
  user-select: none;
  transition: color .18s ease, background-color .18s ease, border-color .18s ease;
}

.kr-panel-toggle svg {
  width: 15px;
  height: 15px;
  flex: none;
  color: currentColor;
}

.kr-panel-toggle:hover {
  color: var(--dsw-alias-label-primary);
  background: var(--dsw-alias-interactive-bg-hover, rgba(127, 127, 127, .12));
}

.kr-panel-toggle:focus-visible {
  border-color: var(--kr-accent);
}

@media (prefers-reduced-motion: reduce) {
  .kr-panel-toggle { transition: none; }
}

@keyframes kr-fade-in {
  from { opacity: 0; transform: translateY(-4px); }
  to { opacity: 1; transform: translateY(0); }
}

/* ══ 记忆卡片停靠区（固定右栏底部）═══════════════════════════════════════
   记忆卡不再是 .kr-panel__scroll 的子节点，而是滚动区之下的独立 flex footer：
   滚动区（flex:1 1 0）高度自动让位，记忆卡永远钉在右栏最下方——无论内容
   多少、无论滚动位置。旧方案是滚动区内的 sticky bottom:0，内容少时卡片
   跟在三张卡后面悬在中间，做不到「永远在下方」，已废弃。 */
.kr-panel__memory-dock {
  flex: none;
  padding: 0 12px 12px;
  background: var(--kr-canvas-bg);
  display: flex;
  flex-direction: column;
}

.kr-card--memory {
  /* 上边发丝线：把「常驻区」与上面的滚动内容划开（描边比其余三面重一档）。 */
  border-top-color: var(--kr-card-hover);
}

.kr-memory__body {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.kr-memory__section {
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
}

.kr-memory__section + .kr-memory__section {
  border-top: 1px solid var(--kr-hairline);
  padding-top: 8px;
}

.kr-memory__section-head {
  display: flex;
  align-items: center;
  gap: 4px;
  min-width: 0;
}

.kr-memory__section-title {
  flex: 1;
  min-width: 0;
  display: flex;
  align-items: baseline;
  gap: 5px;
  font-size: 11.5px;
  font-weight: 600;
  color: var(--dsw-alias-label-secondary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.kr-memory__count {
  font-weight: 500;
  color: var(--dsw-alias-label-tertiary);
}

/* 工作区别名的副标题（目录名/项目别名），超出省略 */
.kr-memory__scope {
  font-weight: 400;
  color: var(--dsw-alias-label-tertiary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* 标题行内的文字按钮（选择 / 展开其余 / 删除 / 确认 / 取消） */
.kr-memory__link {
  flex: none;
  background: transparent;
  border: none;
  border-radius: 4px;
  padding: 1px 5px;
  font-family: inherit;
  font-size: 11px;
  color: var(--dsw-alias-label-tertiary);
  cursor: pointer;
  transition: color 0.15s ease, background-color 0.15s ease;
}

.kr-memory__link:hover {
  color: var(--dsw-alias-label-primary);
  background: var(--dsw-alias-interactive-bg-hover, rgba(127, 127, 127, 0.12));
}

/* 删除/确认：主操作，但刻意不做成红色实心——大盘整体是中性灰，
   破坏性操作靠「二次确认」而不是靠颜色吓人。 */
.kr-memory__link--danger {
  color: var(--dsw-alias-label-primary);
  background: var(--kr-fill-bg);
  border: 1px solid var(--kr-card-border);
}

.kr-memory__link:disabled {
  opacity: 0.45;
  cursor: default;
}

.kr-memory__selected {
  flex: none;
  font-size: 11px;
  color: var(--dsw-alias-label-tertiary);
  white-space: nowrap;
  font-variant-numeric: tabular-nums;
}

.kr-memory__list {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
  /* 兜底封顶：展开「其余 N 条」后也不允许把右栏顶穿，超出在内部滚动。 */
  max-height: 46vh;
  overflow-y: auto;
  overscroll-behavior-y: contain;
  scrollbar-width: thin;
  scrollbar-color: var(--dsw-alias-scrollbar-bg-l2, rgba(127, 127, 127, 0.4)) transparent;
}

/* 挤压态：思考卡已被压到最小档、右栏仍然装不下时，记忆卡自己再让一档，
   绝不上涨把思考卡彻底顶没（用户要的是「都能看见」而不是「记忆卡看全」）。 */
.kr-card--memory[data-squeezed="true"] .kr-memory__list {
  max-height: 30vh;
}

.kr-memory__row {
  display: flex;
  align-items: flex-start;
  gap: 7px;
  padding: 6px 6px 5px;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.12s ease;
}

.kr-memory__row:hover {
  background: var(--dsw-alias-interactive-bg-hover, rgba(127, 127, 127, 0.07));
}

.kr-memory__row[data-selected="true"] {
  background: var(--kr-fill-bg);
}

.kr-memory__check {
  flex: none;
  margin: 2px 0 0;
  accent-color: var(--kr-accent);
  cursor: pointer;
}

/* 置顶图标占位：未置顶的行也留同一个 11px 槽，文本左边缘才对得齐 */
.kr-memory__pin {
  flex: none;
  width: 11px;
  margin-top: 3px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--dsw-alias-label-tertiary);
}

.kr-memory__pin[role="button"] {
  cursor: pointer;
  border-radius: 3px;
}

.kr-memory__pin[role="button"]:hover {
  color: var(--dsw-alias-label-primary);
  background: var(--dsw-alias-interactive-bg-hover, rgba(127, 127, 127, 0.12));
}

.kr-memory__body-col {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 3px;
}

/* 单条默认 1-2 行 + 省略号：默认全展开会把大盘撑爆，全文点条目再看 */
.kr-memory__text {
  font-size: 12px;
  line-height: 1.5;
  color: var(--dsw-alias-label-primary);
  word-break: break-word;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
}

.kr-memory__text[data-open="true"] {
  display: block;
  -webkit-line-clamp: unset;
  overflow: visible;
}

.kr-memory__meta {
  display: flex;
  align-items: center;
  gap: 5px;
  min-width: 0;
  font-size: 10.5px;
  color: var(--dsw-alias-label-tertiary);
  white-space: nowrap;
  overflow: hidden;
}

/* 相对时间推到行尾：徽章（类型/标签）靠左，时间靠右，一行两端各有归属，
   不再挤成一坨灰色小字。 */
.kr-memory__time {
  margin-left: auto;
  flex: none;
  font-variant-numeric: tabular-nums;
}

.kr-memory__tag {
  flex: none;
  padding: 0 4px;
  border-radius: 3px;
  background: var(--kr-hover-bg);
  color: var(--dsw-alias-label-tertiary);
}

.kr-memory__note {
  padding: 4px 2px;
  font-size: 11.5px;
  color: var(--dsw-alias-label-tertiary);
}

/* 删除失败等行内错误（不动用模态弹窗，也不打断多选态） */
.kr-memory__err {
  padding: 2px 6px 3px;
  font-size: 11px;
  color: var(--dsw-alias-label-primary);
}

/* ══ KR 极简 Agent 状态卡：只显示一句当前动作 + 可配置头像 ═══════════════ */
.kr-agent-mini-shell {
  position: relative;
  display: grid;
  grid-template-rows: 1fr;
  width: 100%;
  min-width: 0;
  max-height: 260px;
  margin: -4px 0;
  overflow: visible;
}

.kr-agent-mini-card {
  position: relative;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
  width: min(440px, 100%);
  min-height: 50px;
  padding: 7px 14px 7px 7px;
  border: 1px solid var(--dsw-alias-border-l3, rgba(127, 127, 127, .16));
  border-radius: 14px;
  background: #FFFFFF;
  box-shadow: 0 1px 2px rgba(15, 17, 21, .04), 0 8px 24px -18px rgba(15, 17, 21, .28);
  cursor: pointer;
  transform-origin: 0 50%;
  animation: kr-agent-mini-in .38s cubic-bezier(.16, 1, .3, 1) both;
}

.kr-agent-mini-card:focus-visible {
  outline: 2px solid color-mix(in srgb, var(--kr-accent) 48%, transparent);
  outline-offset: 2px;
}

.kr-agent-mini-card:hover {
  border-color: color-mix(in srgb, var(--kr-accent) 24%, var(--kr-card-border));
}

.kr-agent-mini-chevron {
  display: grid;
  place-items: center;
  width: 20px;
  height: 20px;
  flex: none;
  color: var(--dsw-alias-label-tertiary);
  transition: transform .22s cubic-bezier(.16, 1, .3, 1);
}

.kr-agent-mini-chevron svg {
  width: 15px;
  height: 15px;
}

.kr-agent-mini-chevron[data-open="true"] {
  transform: rotate(180deg);
}

.kr-agent-mini-shell[data-closing="true"]:not([data-committed="true"]) .kr-agent-mini-card {
  opacity: .42;
  transform: translateY(-3px);
}

.kr-agent-mini-shell[data-closing="true"][data-committed="true"] {
  max-height: 0;
  margin-top: 0;
  margin-bottom: 0;
  overflow: hidden;
  pointer-events: none;
  animation: kr-agent-mini-exit 980ms cubic-bezier(.22, 1, .36, 1) both;
}

.kr-agent-mini-details {
  display: grid;
  grid-template-rows: 1fr;
  min-height: 0;
  opacity: 1;
  transition: grid-template-rows .34s cubic-bezier(.16, 1, .3, 1), opacity .24s ease, margin .34s cubic-bezier(.16, 1, .3, 1);
}

.kr-agent-mini-details > .kr-agent-mini-details__inner {
  min-height: 0;
  overflow: hidden;
}

.kr-agent-mini-details[data-open="true"] {
  margin-top: 7px;
}

.kr-agent-mini-details:not([data-open="true"]) {
  grid-template-rows: 0fr;
  margin-top: 0;
  opacity: 0;
}

.kr-agent-mini-details__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 0 3px 6px;
  color: var(--dsw-alias-label-tertiary);
  font-size: 10px;
  line-height: 15px;
}

.kr-agent-mini-details__head span:first-child {
  color: var(--dsw-alias-label-secondary);
  font-size: 11px;
  font-weight: 600;
}

.kr-agent-mini-details__grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 7px;
}

.kr-agent-node-card {
  position: relative;
  min-width: 0;
  overflow: hidden;
  border: 1px solid var(--dsw-alias-border-l3, rgba(127, 127, 127, .16));
  border-radius: 14px;
  background: #FFFFFF;
  box-shadow: 0 1px 2px rgba(15, 17, 21, .04), 0 8px 24px -18px rgba(15, 17, 21, .28);
}

.kr-agent-node-card__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 6px;
  border-bottom: 1px solid var(--dsw-alias-border-l3, rgba(127, 127, 127, .12));
  padding: 10px 12px 8px;
  color: var(--dsw-alias-label-tertiary);
  font-size: 9.5px;
  line-height: 14px;
}

.kr-agent-node-card__head span:first-child {
  color: var(--dsw-alias-label-secondary);
  font-size: 10.5px;
  font-weight: 600;
}

.kr-agent-node-card__head span:last-child {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.kr-agent-node-card__value {
  display: -webkit-box;
  min-height: 38px;
  margin: 0;
  overflow: hidden;
  padding: 11px 12px 12px;
  color: var(--dsw-alias-label-secondary);
  font-size: 11px;
  line-height: 16px;
  text-overflow: ellipsis;
  white-space: normal;
  overflow-wrap: anywhere;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}

.kr-agent-mini-avatar {
  position: relative;
  display: grid;
  place-items: center;
  width: 34px;
  height: 34px;
  flex: none;
  overflow: visible;
  border: 1px solid color-mix(in srgb, var(--kr-accent) 18%, var(--kr-card-border));
  border-radius: 50%;
  padding: 0;
  background: color-mix(in srgb, var(--kr-accent) 7%, var(--dsw-alias-bg-layer-1));
  color: var(--kr-accent);
  cursor: pointer;
  transition: border-color .16s ease, transform .16s ease;
}

.kr-agent-mini-avatar:hover {
  border-color: color-mix(in srgb, var(--kr-accent) 42%, var(--kr-card-border));
}

.kr-agent-mini-avatar:active {
  transform: scale(.96);
}

.kr-agent-mini-avatar:focus-visible {
  outline: 2px solid color-mix(in srgb, var(--kr-accent) 52%, transparent);
  outline-offset: 2px;
}

.kr-agent-mini-avatar > img,
.kr-agent-mini-avatar__default {
  width: 100%;
  height: 100%;
  border-radius: 50%;
}

.kr-agent-mini-avatar > img {
  display: block;
  object-fit: cover;
}

.kr-agent-mini-avatar__default {
  display: grid;
  place-items: center;
}

.kr-agent-mini-avatar__default svg {
  width: 23px;
  height: 23px;
}

.kr-agent-mini-avatar__status {
  position: absolute;
  right: -1px;
  bottom: -1px;
  width: 8px;
  height: 8px;
  border: 2px solid var(--dsw-alias-bg-layer-1, var(--dsw-alias-bg-base));
  border-radius: 50%;
  background: var(--kr-accent);
  animation: kr-agent-mini-pulse 1.6s ease-in-out infinite;
}

.kr-agent-mini-copy {
  min-width: 0;
  flex: 1 1 auto;
  overflow: hidden;
}

.kr-agent-mini-action {
  display: block;
  min-width: 0;
  overflow: hidden;
  color: var(--dsw-alias-label-primary);
  font-size: 13px;
  font-weight: 550;
  line-height: 20px;
  text-overflow: ellipsis;
  white-space: nowrap;
  animation: kr-agent-mini-action-in .36s cubic-bezier(.16, 1, .3, 1) both;
}

.kr-agent-avatar-menu {
  position: absolute;
  top: calc(100% + 7px);
  left: 0;
  z-index: 40;
  display: grid;
  gap: 3px;
  width: 188px;
  box-sizing: border-box;
  border: 1px solid var(--kr-card-border);
  border-radius: 9px;
  padding: 8px;
  background: var(--dsw-alias-bg-layer-1, var(--dsw-alias-bg-base));
  box-shadow: 0 10px 28px rgba(15, 17, 21, .10);
}

.kr-agent-avatar-menu__title {
  padding: 2px 4px 6px;
  color: var(--dsw-alias-label-primary);
  font-size: 12px;
  font-weight: 600;
}

.kr-agent-avatar-menu__action {
  width: 100%;
  border: 0;
  border-radius: 5px;
  padding: 7px 8px;
  background: transparent;
  color: var(--dsw-alias-label-secondary);
  font: inherit;
  font-size: 12px;
  text-align: left;
  cursor: pointer;
}

.kr-agent-avatar-menu__action:hover:not(:disabled) {
  background: var(--kr-hover-bg);
  color: var(--dsw-alias-label-primary);
}

.kr-agent-avatar-menu__action:disabled {
  opacity: .42;
  cursor: default;
}

.kr-agent-avatar-menu__action:focus-visible {
  outline: 2px solid color-mix(in srgb, var(--kr-accent) 48%, transparent);
  outline-offset: -1px;
}

.kr-agent-avatar-menu__hint,
.kr-agent-avatar-menu__error {
  padding: 4px 4px 1px;
  font-size: 10px;
  line-height: 14px;
}

.kr-agent-avatar-menu__hint {
  color: var(--dsw-alias-label-tertiary);
}

.kr-agent-avatar-menu__error {
  color: var(--kr-error);
}

.kr-agent-avatar-input {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
  clip-path: inset(50%);
  white-space: nowrap;
}

/* 仍被 KR 任务卡 / 执行结果卡的行内 spinner 复用。 */
@keyframes kr-spin {
  to { transform: rotate(360deg); }
}

@keyframes kr-agent-mini-in {
  from { opacity: 0; transform: translateY(7px) scale(.99); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}

@keyframes kr-agent-mini-action-in {
  from { opacity: 0; transform: translateY(9px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes kr-agent-mini-exit {
  0% { max-height: 260px; margin-top: -4px; margin-bottom: -4px; opacity: 1; transform: translateY(0) scale(1); }
  65% { max-height: 220px; margin-top: -2px; margin-bottom: -2px; opacity: .92; transform: translateY(-12px) scale(.992); }
  100% { max-height: 0; margin-top: 0; margin-bottom: 0; opacity: 0; transform: translateY(-28px) scale(.985); }
}

@keyframes kr-agent-mini-pulse {
  0%, 100% { opacity: .55; }
  50% { opacity: 1; }
}

@media (max-width: 520px) {
  .kr-agent-mini-shell {
    width: 100%;
  }

  .kr-agent-mini-details__grid {
    grid-template-columns: 1fr;
  }
}

@media (prefers-reduced-motion: reduce) {
  .kr-agent-mini-card,
  .kr-agent-mini-action,
  .kr-agent-mini-shell[data-closing="true"][data-committed="true"],
  .kr-agent-mini-avatar__status {
    animation: none !important;
  }
}

/* ══ 隐藏原生 DSH 任务列表/Plan卡片（KR模式下收敛至右侧大盘） ═══════════════ */
body[data-dsh-kr-chat="true"] [data-testid="todo-panel"],
body[data-dsh-kr-chat="true"] [data-plan-artifacts="true"],
body[data-dsh-kr-chat="true"] [data-plan-card],
body[data-dsh-kr-chat="true"] [data-chat-flow-kind="plan"] {
  display: none !important;
}
`

/**
 * 注入 KR 对话样式表。
 *
 * 幂等但「可刷新」：DSH 的 client HMR（patchReload: live）会重新执行 apply()，
 * 此时 KR_STYLES 常量可能已经变了；旧实现只认「标签已存在就返回」，新规则永远
 * 进不来，页面上会一直挂着上一版 CSS（表现为新座位完全没有样式）。因此这里
 * 在内容不一致时原地刷新 textContent。
 */
export function injectKrStyles(): void {
  const STYLE_ID = 'dsh-kr-chat-styles'
  if (typeof document === 'undefined') return
  const existing = document.getElementById(STYLE_ID)
  if (existing) {
    if (existing.textContent !== KR_STYLES) existing.textContent = KR_STYLES
    return
  }
  const tag = document.createElement('style')
  tag.id = STYLE_ID
  tag.textContent = KR_STYLES
  document.head.appendChild(tag)
}
