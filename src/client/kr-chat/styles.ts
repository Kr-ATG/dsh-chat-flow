/**
 * dsh-chat-flow — KR 对话双栏布局与执行大盘独立样式表。
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
body[data-dsh-kr-chat="true"] [data-turn-process] {
  display: none !important;
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
   * 三层表面刻意拉开：底板微沉、卡片浮起、描边可辨。
   *
   * 早前 canvas / surface / card 三者都取 --dsw-alias-bg-layer-*，而浅色主题下
   * layer-1/2/3 全部是 #fff —— 面板、滚动区、卡片糊成一整片纯白，只靠 4% 黑的
   * 描边区分，观感就是「平、脏、没层次」。
   *
   * 这里不再借用 --dsw-specific-tip：浅色下它是 #f5f6f7（比卡片暗，正确），
   * 但深色下是 #353638（比卡片 #232324 还亮），会让卡片在深色主题里「陷下去」。
   * 也不混 --dsw-alias-label-primary —— 它浅色是近黑、深色是近白，方向会反过来。
   * 固定朝纯黑混 6%：两种主题下底板都恰好比卡片沉一档，卡片始终是浮起的那层。
   */
  --kr-card-bg: var(--dsw-alias-bg-layer-1, #ffffff);
  --kr-surface-bg: var(--dsw-alias-bg-layer-1, #ffffff);
  --kr-canvas-bg: color-mix(in srgb, var(--kr-card-bg) 94%, #000000);
  /* 描边从 border-l1（4% 黑，几乎看不见）提到 l2（10%），卡片边界才成立 */
  --kr-card-border: var(--dsw-alias-border-l2, rgba(0, 0, 0, 0.1));
  --kr-card-hover: var(--dsw-alias-border-l3, rgba(0, 0, 0, 0.16));
  --kr-hairline: var(--dsw-alias-border-l1, rgba(0, 0, 0, 0.06));
  --kr-hover-bg: var(--dsw-alias-interactive-bg-hover, rgba(38, 49, 72, 0.06));
  --kr-fill-bg: var(--dsw-alias-interactive-bg-active, rgba(38, 49, 72, 0.1));
  --kr-card-shadow: 0 1px 2px rgba(16, 24, 40, 0.04);
  --kr-card-shadow-hover: 0 2px 8px rgba(16, 24, 40, 0.07);
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
  /* 分隔靠一根 hairline 即可；原来的 -4px/24px 重投影在浅色下脏且抢戏 */
  border-left: 1px solid var(--kr-hairline);
  background: var(--kr-canvas-bg);
  position: relative;
  z-index: 10;
  transition: width 0.26s cubic-bezier(0.16, 1, 0.3, 1), transform 0.26s cubic-bezier(0.16, 1, 0.3, 1);
  overflow: hidden;
}

.kr-split__side--fullscreen {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  width: 100% !important;
  max-width: none !important;
  z-index: 50;
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
  background: var(--kr-surface-bg);
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

/* ══ 统计指标药丸（展开时以单行整洁展示，附带关闭按钮） ═════════════════ */
.kr-pills-row {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  animation: kr-fade-in 0.18s ease;
}

@keyframes kr-fade-in {
  from { opacity: 0; transform: translateY(-4px); }
  to { opacity: 1; transform: translateY(0); }
}

.kr-pills-row .kr-pills {
  flex: 1;
  min-width: 0;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 6px;
}

.kr-pill {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  padding: 6px 3px;
  background: var(--kr-surface-bg);
  border: 1px solid var(--kr-card-border);
  border-radius: 6px;
  font-size: 11.5px;
  color: var(--dsw-alias-label-secondary);
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  box-shadow: none;
}

.kr-pill svg {
  width: 13px;
  height: 13px;
  flex: none;
  opacity: 0.8;
}

.kr-pill--fail {
  background: var(--kr-surface-bg);
  border-color: var(--kr-card-border);
  color: var(--kr-error, #ef4444);
}

.kr-pills-close-btn {
  flex: none;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--kr-surface-bg);
  border: 1px solid var(--kr-card-border);
  border-radius: 6px;
  color: var(--dsw-alias-label-tertiary);
  cursor: pointer;
  padding: 0;
  transition: all 0.15s ease;
  box-shadow: none;
}

.kr-pills-close-btn:hover {
  background: var(--dsw-alias-interactive-bg-hover, rgba(127, 127, 127, 0.15));
  color: var(--dsw-alias-label-primary);
  border-color: var(--kr-card-hover);
}

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

.kr-card__open-drawer-btn {
  background: var(--kr-hover-bg);
  border: 1px solid var(--kr-card-border);
  color: var(--dsw-alias-label-secondary);
  border-radius: 4px;
  padding: 1px 6px;
  font-size: 11px;
  cursor: pointer;
  margin-left: auto;
  margin-right: 4px;
  font-weight: 500;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  transition: all 0.15s ease;
}

.kr-card__open-drawer-btn:hover {
  background: var(--dsw-alias-interactive-bg-hover, rgba(127, 127, 127, 0.18));
  color: var(--dsw-alias-label-primary);
  border-color: var(--kr-card-hover);
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

.kr-reasoning-row {
  display: flex;
  gap: 6px;
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
  box-shadow: var(--kr-card-shadow);
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

/* ══ 收起后浮动展开胶囊 ════════════════════════════════════════════════════ */
.kr-expand-capsule {
  position: absolute;
  top: 14px;
  right: 18px;
  z-index: 25;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 14px;
  border-radius: 20px;
  background: var(--dsw-alias-bg-module-platform, rgba(30, 34, 42, 0.85));
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid var(--kr-card-border);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
  color: var(--dsw-alias-label-primary);
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  animation: kr-fade-in 0.24s ease-out;
}

.kr-expand-capsule:hover {
  border-color: var(--kr-accent);
  color: var(--kr-accent);
  transform: translateY(-1px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.25);
}

.kr-expand-capsule svg {
  width: 15px;
  height: 15px;
  color: var(--kr-accent);
}

@keyframes kr-fade-in {
  from { opacity: 0; transform: translateY(-4px); }
  to { opacity: 1; transform: translateY(0); }
}

/* ══ 左侧对话流卡片化（去除旧折叠） ════════════════════════════════════════ */
/* 结构化思考过程卡片 */
.kr-flow-thought-card {
  margin: 8px 0;
  padding: 12px 14px;
  border-radius: 12px;
  background: var(--dsw-alias-bg-layer-1, rgba(255,255,255,0.03));
  border: 1px solid var(--kr-card-border);
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.kr-flow-thought-card__header {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  font-weight: 600;
  color: var(--kr-accent);
}

.kr-flow-thought-card__body {
  font-size: 13px;
  line-height: 1.6;
  color: var(--dsw-alias-label-secondary);
}

/* 正在执行状态卡片 */
.kr-flow-executing-card {
  margin: 8px 0;
  padding: 10px 14px;
  border-radius: 12px;
  background: color-mix(in srgb, var(--kr-accent) 8%, transparent);
  border: 1px solid color-mix(in srgb, var(--kr-accent) 22%, transparent);
  display: flex;
  align-items: center;
  gap: 10px;
}

.kr-flow-executing-card__spinner {
  width: 18px;
  height: 18px;
  border: 2px solid color-mix(in srgb, var(--kr-accent) 30%, transparent);
  border-top-color: var(--kr-accent);
  border-radius: 50%;
  animation: kr-spin 0.8s linear infinite;
  flex: none;
}

@keyframes kr-spin {
  to { transform: rotate(360deg); }
}

.kr-flow-executing-card__info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.kr-flow-executing-card__title {
  font-size: 13px;
  font-weight: 600;
  color: var(--kr-accent);
}

.kr-flow-executing-card__subtitle {
  font-size: 12px;
  color: var(--dsw-alias-label-tertiary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.kr-flow-executing-card__time {
  font-size: 12px;
  font-weight: 500;
  color: var(--kr-accent);
  font-variant-numeric: tabular-nums;
  flex: none;
}

/* ══ 隐藏原生 DSH 任务列表/Plan卡片（KR模式下收敛至右侧大盘） ═══════════════ */
body[data-dsh-kr-chat="true"] [data-testid="todo-panel"],
body[data-dsh-kr-chat="true"] [data-plan-artifacts="true"],
body[data-dsh-kr-chat="true"] [data-plan-card],
body[data-dsh-kr-chat="true"] [data-chat-flow-kind="plan"] {
  display: none !important;
}
`

/** 注入 KR 对话样式表 */
export function injectKrStyles(): void {
  const STYLE_ID = 'dsh-kr-chat-styles'
  if (typeof document === 'undefined') return
  if (document.getElementById(STYLE_ID)) return
  const tag = document.createElement('style')
  tag.id = STYLE_ID
  tag.textContent = KR_STYLES
  document.head.appendChild(tag)
}
