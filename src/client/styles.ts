/**
 * dsh-chat-flow — 注入式样式（思考 chip + 对话流卡片）。
 *
 * 命名空间 `dtt__`（dsh-chat-flow），与 webui 的 dsh-better-markdown__/
 * dsh-reply-card__ 不冲突；工具聚合的 dts__ 样式在 tool-summary/styles.ts。
 *
 * ⚠ 注入式 CSS 注释红线：注释内部严禁出现「星号紧跟正斜杠」的两字符闭合序列
 * （包括 token 名里混写星号再跟正斜杠的写法），否则注释提前闭合，
 * 残骸文本会把下一条规则拖成非法选择器整条丢弃。
 */

const CSS = `
/* 空白槽位折叠：聚合后工具/思考节点留下的空 [data-slot] 不再产生空白条。 */
[data-chat-flow-key]:has(> [data-slot]:empty) {
  display: none;
}

/* ── 助手正文容器：与官方 AssistantMarkdown 同一套字级与节奏 ────────────
   官方 MarkdownText 自带排版，这里只补容器层（字号轴 + 块间 gap + 宽表外溢）。 */
.dtt__assistant {
  display: flex;
  flex-direction: column;
  min-width: 0;
  font-size: var(--dsh-content-font-size, 14px);
  line-height: calc(24px + var(--dsh-content-font-delta, 0px));
  color: var(--dsw-alias-label-primary);
}

.dtt__assistant-body {
  display: flex;
  flex-direction: column;
  gap: 16px;
  min-width: 0;
}

/* 宽表外溢（与官方 .body :global(.md-table-wide) 同规则） */
.dtt__assistant-body :global(.md-table-wide) {
  --dsh-table-spare: max(0px, calc((100cqw - var(--dsh-chat-content-width)) / 2));
  --dsh-table-lead: calc(var(--dsh-table-spare) + min(var(--dsh-chat-content-width), 100cqw) - 100%);
  box-sizing: border-box;
  width: calc(100% + var(--dsh-table-lead) + var(--dsh-table-spare));
  max-width: none;
  margin-left: calc(-1 * var(--dsh-table-lead));
  padding-left: var(--dsh-table-lead);
}

/* 中断回合的收尾标记（官方 .stopped 同款静默小签）。 */
.dtt__stopped {
  align-self: flex-start;
  border-radius: 6px;
  padding: 0 6px;
  background: var(--dsw-alias-interactive-bg-hover);
  color: var(--dsw-alias-label-tertiary);
  font-size: 11px;
  line-height: 18px;
}

/* ══ 对话流卡片（自 webui flow-card 移植；回合结束后才出现）══════════════
   --step：回合中间的已完成片段。左侧一条竖线 + 极淡纱，圈出「一步」。
   --reply：回合最终回复（总结卡）。描边 + 顶部高光 + 完成标记与统计 chip。
   共同规则：跟随文字色的中性半透明纱（浅色=淡黑、深色=淡白，一条规则通吃
   两个主题）。⚠ 不加 backdrop-filter：消息流里每条回复都是一张卡，长会话
   下大面积模糊会拖垮滚动性能。 */
.dtt__card {
  min-width: 0;
  border-radius: 14px;
  animation: dtt-card-in .48s cubic-bezier(.22, 1, .36, 1) both;
}

/* 中间步骤：轻量竖线卡 */
.dtt__card--step {
  display: flex;
  flex-direction: column;
  gap: 12px;
  border-left: 2px solid var(--dsw-alias-border-l2, rgba(127,127,127,.22));
  border-radius: 0 12px 12px 0;
  padding: 10px 14px;
  background: color-mix(in srgb, var(--dsw-alias-label-primary) 2.5%, transparent);
}

/* 最终回复：总结卡 */
.dtt__card--reply {
  position: relative;
  overflow: hidden;
  border: 1px solid var(--dsw-alias-border-l3, rgba(127,127,127,.16));
  padding: 0;
  background:
    linear-gradient(180deg, color-mix(in srgb, var(--dsw-alias-bg-base) 26%, transparent), transparent 42%),
    var(--dsh-flow-veil, color-mix(in srgb, var(--dsw-alias-label-primary) 4%, transparent));
  box-shadow: 0 1px 2px rgba(15, 17, 21, .04), 0 8px 24px -18px rgba(15, 17, 21, .28);
}

/* 顶边一条品牌蓝渐隐细线：只在总结卡出现，作为「本轮收尾」的视觉锚点。 */
.dtt__card--reply::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(
    90deg,
    var(--dsw-alias-state-business-primary, #4176e6) 0%,
    color-mix(in srgb, var(--dsw-alias-state-business-primary, #4176e6) 35%, transparent) 42%,
    transparent 100%
  );
  opacity: .75;
  pointer-events: none;
}

.dtt__card--reply[data-interrupted]::before {
  background: linear-gradient(
    90deg,
    var(--dsw-alias-state-warn-primary, #f59e0b) 0%,
    transparent 100%
  );
}

/* 头部：完成标记 + 统计 chip 行 */
.dtt__card-head {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
  border-bottom: 1px solid var(--dsw-alias-border-l3, rgba(127,127,127,.12));
  padding: 10px 16px;
}

.dtt__card-badge {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  flex: none;
  height: 22px;
  border-radius: 11px;
  padding: 0 9px;
  background: var(--dsh-flow-veil, color-mix(in srgb, var(--dsw-alias-label-primary) 5%, transparent));
  color: var(--dsw-alias-label-secondary);
  font-size: 12px;
  font-weight: 600;
  line-height: 22px;
  white-space: nowrap;
}

.dtt__card-badge[data-interrupted] {
  background: color-mix(in srgb, var(--dsw-alias-state-warn-primary, #f59e0b) 14%, transparent);
  color: var(--dsw-alias-state-warn-label, #b45309);
}

/* 徽章里只留对勾一笔语义绿（中断态跟随琥珀色）。 */
.dtt__card-badge > svg {
  color: var(--dsw-alias-state-success-primary, #2f9e44);
}

.dtt__card-badge[data-interrupted] > svg {
  color: inherit;
}

.dtt__card-chips {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
  min-width: 0;
}

.dtt__card-chip {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  height: 22px;
  border: 1px solid var(--dsw-alias-border-l3, rgba(127,127,127,.16));
  border-radius: 7px;
  padding: 0 8px;
  color: var(--dsw-alias-label-tertiary);
  font-size: 11px;
  line-height: 22px;
  white-space: nowrap;
  transition: transform .22s ease, box-shadow .22s ease, border-color .22s ease;
}

/* 方案A：标签弱化 + 数值加强 + 状态圆点，扫一眼先看到数字。 */
.dtt__card-chip::before {
  content: "";
  width: 5px;
  height: 5px;
  flex: none;
  border-radius: 50%;
  background: currentColor;
  opacity: .3;
}

.dtt__card-chip:hover {
  transform: translateY(-2px);
  border-color: var(--dsw-alias-border-l2, rgba(127,127,127,.3));
  box-shadow: 0 6px 16px rgba(15,17,21,.1);
}

.dtt__card-chip-value {
  color: var(--dsw-alias-label-primary);
  font-variant-numeric: tabular-nums;
  font-size: 12px;
  font-weight: 700;
}


.dtt__card-body {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 14px 16px;
}

@keyframes dtt-card-in {
  from { opacity: 0; transform: translateY(20px) scale(.99); filter: blur(2px); }
  to { opacity: 1; transform: none; filter: none; }
}

/* ── 回合过程行（官方 turn-process 行同款，见 .dtt__process）──────────────
   整宽文字按钮 + 底部发丝线 + 左指 chevron（data-open 时转下来）。
   --dtt-rea-accent 只在本组件根上声明一次，子元素继承。 */
.dtt__reasoning {
  --dtt-rea-accent: var(--dsw-alias-state-business-primary, #4176e6);
  --dtt-rea-fill: var(--dsh-flow-veil, color-mix(in srgb, var(--dsw-alias-label-primary) 5%, transparent));
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 8px;
  max-width: 100%;
}

/* 与官方 TurnProcessNodeView.module.css 逐项一致（类名换前缀），同 dts__process。 */
.dtt__process {
  box-sizing: border-box;
  display: flex;
  align-items: center;
  width: 100%;
  min-width: 0;
  height: 33px;
  margin: 0;
  /* 与 dts__process 同步的上下平衡修正：官方 padding: 0 0 8px 让文字贴行上沿
     （实测上 6px / 下到发丝线 14px）。这里归零，行盒在 32.5px 内容区居中
     （上下各 ~10px）；行总高与 margin-bottom 不变，占位与虚拟列表都不受影响。 */
  padding: 0;
  border: none;
  border-bottom: .5px solid var(--dsw-alias-border-l2);
  background: 0 0;
  color: var(--dsw-alias-label-secondary);
  cursor: pointer;
  text-align: left;
  margin-bottom: 8px;
}

.dtt__process:focus-visible {
  outline: 2px solid color-mix(in srgb, var(--dtt-rea-accent) 55%, transparent);
  outline-offset: 2px;
}

.dtt__process-label {
  min-width: 0;
  overflow: hidden;
  font-size: 14px;
  line-height: 24px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.dtt__process[data-running="true"] .dtt__process-label {
  color: var(--dtt-rea-accent);
  font-variant-numeric: tabular-nums;
}

.dtt__process-chevron {
  flex: none;
  width: 16px;
  height: 16px;
  margin-left: 6px;
  color: var(--dsw-alias-label-tertiary);
  transform: rotate(-90deg);
  transition: transform .1s;
}

.dtt__process[data-open] .dtt__process-chevron {
  transform: rotate(0);
}
/* 实时预览堆叠：最多 2 张纵向排列（第 3 段把第 1 张顶掉，第 4/5 张以此类推）。
   间距由槽位 margin 承担（不用 flex gap），收起时 margin 一起收到 0，
   下面的总结卡才是一路平滑滑上去，而不是最后 8px 咯噔一下。 */
.dtt__reasoning-live-stack {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 0;
  min-width: 0;
  align-self: stretch;
}

/* 堆叠槽位：负责高度收放（grid 0fr/1fr 过渡），内卡负责淡入淡出位移。
   高度一帧帧塌下去，上面的消散和下面的总结卡上滑是同一拍。 */
.dtt__live-slot {
  display: grid;
  grid-template-rows: 1fr;
  opacity: 1;
  min-width: 0;
  margin-bottom: 8px;
}

.dtt__live-slot:last-child {
  margin-bottom: 0;
}

.dtt__live-slot > .dtt__reasoning-live-card {
  min-height: 0;
}

/* 新卡展开：挂载先塌着，下一帧张开（JS 切 data-open），高度 .45s。 */
.dtt__live-slot[data-anim="enter"][data-open="false"] {
  grid-template-rows: 0fr;
  opacity: 0;
  margin-bottom: 0;
}

.dtt__live-slot[data-anim="enter"][data-open="true"] {
  grid-template-rows: 1fr;
  opacity: 1;
  transition: grid-template-rows .45s cubic-bezier(.22, 1, .36, 1), opacity .38s ease, margin-bottom .45s ease;
}

/* 挤出 / 回收合拢：挂载先撑着，下一帧塌掉；margin 也收到 0。 */
.dtt__live-slot[data-anim="collapse"][data-open="true"] {
  grid-template-rows: 1fr;
  opacity: 1;
}

.dtt__live-slot[data-anim="collapse"][data-open="false"] {
  grid-template-rows: 0fr;
  opacity: 0;
  margin-bottom: 0;
  transition: grid-template-rows .56s cubic-bezier(.22, 1, .36, 1), opacity .42s ease, margin-bottom .56s ease;
}

/* 回收更慢一拍（与内卡 .7s 对齐，stagger 由行内 transition-delay 给）。 */
.dtt__live-slot[data-anim="collapse"][data-kind="reclaim"][data-open="false"] {
  transition-duration: .7s, .5s, .7s;
}

/* 实时预览卡片（上游 better-display ReasoningCard 同款：标题 + 有界视口 +
   边缘渐隐；无底部控制按钮，上翻即停、滚回底部自动恢复跟随）。 */
.dtt__reasoning-live-card {
  align-self: stretch;
  min-width: 0;
  overflow: hidden;
  border: 1px solid var(--dsw-alias-border-l2, rgba(127,127,127,.22));
  border-radius: 12px;
  background: var(--dsw-alias-bg-module-platform, transparent);
}

/* 新卡淡入：挂载即播（同 key 的流式追加不重挂、不重播）。卡包在槽位里，
   不再是堆叠的直接子节点。 */
.dtt__live-slot > .dtt__reasoning-live-card:not([data-state]) {
  animation: dtt-live-in .38s cubic-bezier(.22, 1, .36, 1) both;
}

@keyframes dtt-live-in {
  from { opacity: 0; transform: translateY(10px) scale(.985); filter: blur(2px); }
  to { opacity: 1; transform: none; filter: none; }
}

/* 被第 3 张顶掉的第 1 张：往上逐渐消散（保持占位播完再卸载，避免下卡跳位）。 */
.dtt__reasoning-live-card[data-state="leaving"] {
  animation: dtt-live-dissolve .56s cubic-bezier(.4, 0, .6, 1) both;
  pointer-events: none;
}

@keyframes dtt-live-dissolve {
  0% { opacity: 1; transform: translateY(0) scale(1); filter: blur(0); }
  100% { opacity: 0; transform: translateY(-22px) scale(.96); filter: blur(7px); }
}

/* 对话结束开始总结：不一下全收，逐张往上回收（stagger 由行内 animation-delay 给，
   单卡 .7s + 间隔 .28s，2 张约 1s，肉眼能数出两拍）。 */
.dtt__reasoning-live-card[data-state="reclaim"] {
  animation: dtt-live-reclaim .7s cubic-bezier(.22, 1, .36, 1) both;
  pointer-events: none;
}

@keyframes dtt-live-reclaim {
  0% { opacity: 1; transform: translateY(0) scale(1); filter: blur(0); }
  60% { opacity: .55; transform: translateY(-12px) scale(.975); filter: blur(2px); }
  100% { opacity: 0; transform: translateY(-20px) scale(.94); filter: blur(5px); }
}

/* ── 重试行影子（官方 model-retry 行同款，类名换前缀）────────────────────
   流式期原样显示；出总结卡（回合 closed）时影子组件直接返回 null，
   空槽位由既有折叠规则收掉，不留空白条。 */
.dtt__retry-row {
  color: var(--dsw-alias-label-tertiary);
  font-size: var(--dsh-content-font-size-secondary, 13px);
  line-height: calc(20px + var(--dsh-content-font-delta-secondary, 0px));
}

.dtt__retry-summary {
  width: fit-content;
  color: inherit;
  cursor: pointer;
  user-select: none;
  border-radius: 3px;
  align-items: center;
  gap: 7px;
  padding: 2px 0;
  list-style: none;
  display: inline-flex;
}

.dtt__retry-summary::-webkit-details-marker {
  display: none;
}

.dtt__retry-summary::after {
  content: "";
  opacity: .8;
  border-bottom: 1.5px solid;
  border-right: 1.5px solid;
  width: 6px;
  height: 6px;
  transition: transform .12s;
  transform: rotate(-45deg);
}

.dtt__retry-summary:hover {
  color: var(--dsw-alias-label-secondary);
}

.dtt__retry-summary:focus-visible {
  outline: 1.5px solid var(--dsw-alias-button-info-fill);
  outline-offset: 2px;
}

.dtt__retry-text {
  color: inherit;
}

.dtt__retry-row[data-active] .dtt__retry-text {
  background: linear-gradient(90deg, var(--dsw-alias-label-tertiary) 0%, var(--dsw-alias-label-tertiary) 40%, var(--dsw-alias-label-secondary) 50%, var(--dsw-alias-label-tertiary) 60%, var(--dsw-alias-label-tertiary) 100%);
  color: transparent;
  background-position: 100% 0;
  background-size: 200% 100%;
  background-clip: text;
  -webkit-background-clip: text;
  animation: dtt-retry-shimmer 1.6s ease-in-out infinite;
}

@keyframes dtt-retry-shimmer {
  0% { background-position: 100% 0; }
  100% { background-position: 0 0; }
}

.dtt__retry-row[open] .dtt__retry-summary::after {
  transform: rotate(45deg);
}

.dtt__retry-details {
  overflow-wrap: anywhere;
  font-size: var(--dsh-content-font-size-secondary, 13px);
  line-height: calc(18px + var(--dsh-content-font-delta-secondary, 0px));
  gap: 2px;
  margin-top: 3px;
  padding-left: 14px;
  display: grid;
}

.dtt__retry-detail-label {
  color: var(--dsw-alias-label-secondary);
}

/* 已完成的旧卡略收淡，正在跑的卡描边提亮 + 标题呼吸点。 */
.dtt__reasoning-live-card[data-running="false"] {
  opacity: .9;
}

.dtt__reasoning-live-card[data-running="true"] {
  border-color: color-mix(in srgb, var(--dsw-alias-state-business-primary, #4176e6) 38%, var(--dsw-alias-border-l2, rgba(127,127,127,.22)));
}

.dtt__live-dot {
  display: inline-block;
  width: 6px;
  height: 6px;
  margin-right: 6px;
  border-radius: 50%;
  background: var(--dsw-alias-state-business-primary, #4176e6);
  vertical-align: 1px;
  animation: dtt-live-dot-pulse 1.6s ease-in-out infinite;
}

@keyframes dtt-live-dot-pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: .45; transform: scale(.8); }
}

/* 悬浮堆叠（紧凑模式 fixed 容器）收紧单卡视口，2 张不至于撑满屏。 */
.dtt__reasoning-live-stack[data-compact] .dtt__reasoning-live {
  max-height: 140px;
}

.dtt__reasoning-live-head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 12px;
  padding: 10px 16px 0;
  color: var(--dsw-alias-label-secondary);
  font-size: 12px;
  line-height: 20px;
  font-variant-numeric: tabular-nums;
}

.dtt__reasoning-live-title { font-weight: 500; }

.dtt__reasoning-live-step { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

/* 有界视口：平时 224px 预览；上下缘按滚动位置渐隐。 */
.dtt__reasoning-live {
  align-self: stretch;
  position: relative;
  max-height: 224px;
  overflow-y: auto;
  overscroll-behavior-y: contain;
  scroll-behavior: auto;
  overflow-anchor: none;
  border: 0;
  border-radius: 0;
  padding: 8px 16px 16px;
  background: transparent;
  color: var(--dsw-alias-label-secondary);
  font-size: 12px;
  line-height: 20px;
  white-space: pre-wrap;
  word-break: break-word;
  scrollbar-width: thin;
  scrollbar-color: var(--dsw-alias-scrollbar-bg-l2, rgba(127,127,127,.4)) transparent;
}

.dtt__reasoning-live[data-edges="both"],
.dtt__reasoning-live-card[data-following][data-overflow] .dtt__reasoning-live {
  -webkit-mask-image: linear-gradient(transparent 0, black 28px, black calc(100% - 28px), transparent 100%);
  mask-image: linear-gradient(transparent 0, black 28px, black calc(100% - 28px), transparent 100%);
}

.dtt__reasoning-live[data-edges="top"] {
  -webkit-mask-image: linear-gradient(transparent 0, black 28px, black 100%);
  mask-image: linear-gradient(transparent 0, black 28px, black 100%);
}

.dtt__reasoning-live[data-edges="bottom"] {
  -webkit-mask-image: linear-gradient(black 0, black calc(100% - 28px), transparent 100%);
  mask-image: linear-gradient(black 0, black calc(100% - 28px), transparent 100%);
}

.dtt__reasoning-live:focus-visible {
  outline: 2px solid var(--dsw-alias-state-business-primary, #4176e6);
  outline-offset: -2px;
}

@media (forced-colors: active) {
  .dtt__reasoning-live { -webkit-mask-image: none !important; mask-image: none !important; }
}

/* 抽屉的流式悬浮预览（紧凑模式 control 行下方浮层）：独立描边，与卡片视口解耦。 */
.dtt__reasoning-live.dts__preview {
  border: 1px solid var(--dsw-alias-border-l2, rgba(127,127,127,.22));
  border-radius: 12px;
  background: var(--dsw-alias-bg-layer-1, #fff);
  box-shadow: 0 8px 24px rgba(15, 17, 21, .18);
  padding: 10px 14px;
  z-index: 9991;
}

/* 悬浮堆叠容器（fixed 定位由行内 style 给 top/left，这里只管纵向堆 + 层级 + 宽度）。 */
.dts__preview-stack {
  display: flex;
  flex-direction: column;
  gap: 8px;
  z-index: 9991;
  max-width: min(520px, calc(100vw - 32px));
  min-width: min(320px, calc(100vw - 32px));
}
.dts__preview-stack .dtt__reasoning-live-card {
  background: var(--dsw-alias-bg-layer-1, #fff);
  box-shadow: 0 8px 24px rgba(15, 17, 21, .18);
}

.dtt__reasoning-live::-webkit-scrollbar {
  width: 4px;
  height: 4px;
}

.dtt__reasoning-live::-webkit-scrollbar-track {
  background: transparent;
}

.dtt__reasoning-live::-webkit-scrollbar-thumb {
  background: var(--dsw-alias-scrollbar-bg-l2, rgba(127,127,127,.4));
  border-radius: 2px;
}

.dtt__reasoning-live::-webkit-scrollbar-thumb:hover {
  background: var(--dsw-alias-scrollbar-hover-l2, rgba(127,127,127,.6));
}

/* ══ 移植动效（github:aa2246740/dsh-better-display，MIT）════════════════
   1) 新文字淡入：流式期新挂载块 opacity + blur 柔和显现（上游 word-motion
      的块级近似——上游逐字形做 motion，这里官方 MarkdownText 整块渲染，
      只能做到新挂载块淡入；已显示的旧节点绝不动）。
   2) 忙碌标签微光：运行中文案 2s 高光带扫过（上游 think shimmer 的单层
      等价：底色常驻 + 光带；数字仍等宽）。 */
.dtt__fresh[data-fresh] {
  display: block;
  animation: dtt-fresh-in .3s cubic-bezier(.22, 1, .36, 1);
}

@keyframes dtt-fresh-in {
  from { opacity: .15; filter: blur(2px); }
  to { opacity: 1; filter: none; }
}

@supports (background-clip: text) or (-webkit-background-clip: text) {
  .dtt__process[data-running="true"] .dtt__process-label {
    background-image: linear-gradient(90deg, var(--dtt-rea-accent, #4176e6) 0%, var(--dtt-rea-accent, #4176e6) 40%, var(--dsw-alias-label-primary) 50%, var(--dtt-rea-accent, #4176e6) 60%, var(--dtt-rea-accent, #4176e6) 100%);
    background-size: 400% 100%;
    background-repeat: no-repeat;
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
    -webkit-text-fill-color: transparent;
    animation: dtt-think-shimmer 2s linear infinite;
  }
}

@keyframes dtt-think-shimmer {
  0% { background-position: 100% 0; }
  100% { background-position: 0% 0; }
}

.dtt__visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  margin: -1px;
  clip: rect(0 0 0 0);
  white-space: nowrap;
}

/* 尊重系统「减少动态效果」偏好 */
@media (prefers-reduced-motion: reduce) {
  .dtt__card { animation: none; }
  .dtt__live-slot[data-anim][data-open] { transition: none; }
  .dtt__process-chevron {
    animation: none;
    transition: none;
  }
  .dtt__card-chip { transition: none; }
  .dtt__card-chip:hover { transform: none; }
  .dtt__fresh[data-fresh] { animation: none; }
  .dtt__live-slot > .dtt__reasoning-live-card:not([data-state]),
  .dtt__reasoning-live-card[data-state="leaving"],
  .dtt__reasoning-live-card[data-state="reclaim"],
  .dtt__live-dot { animation: none; }
  .dtt__retry-row[data-active] .dtt__retry-text {
    animation: none;
    color: inherit;
    background: none;
    -webkit-text-fill-color: currentcolor;
  }
  .dtt__process[data-running="true"] .dtt__process-label {
    animation: none;
    color: var(--dtt-rea-accent);
    -webkit-text-fill-color: currentcolor;
  }
}

@media (forced-colors: active) {
  .dtt__process[data-running="true"] .dtt__process-label {
    animation: none;
    color: CanvasText;
    -webkit-text-fill-color: currentcolor;
  }
}

/* ── 生图画廊条（dgi__：SummaryCard 正文区，generate_image 结果）────────
   默认单图（保持原比例、≤360px）；strip--multi 时并排缩略图（4:3 裁剪、
   序号角标）。点击弹全屏 Lightbox（z-index 1200 为会话级遮罩统一值）。 */
.dgi__strip {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 2px;
  min-width: 0;
}

.dgi__row {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  min-width: 0;
}

.dgi__item {
  appearance: none;
  padding: 0;
  border: 0;
  background: transparent;
  cursor: zoom-in;
  position: relative;
  display: block;
  flex: 0 0 auto;
  width: auto;
  height: auto;
  max-width: 360px;
  border-radius: 8px;
  overflow: hidden;
  line-height: 0;
}

/* 多图并排：弹性缩略图（放不下自动换行） */
.dgi__strip--multi .dgi__item {
  flex: 1 1 0;
  min-width: 96px;
  max-width: 220px;
  aspect-ratio: 4 / 3;
}

.dgi__thumb {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: contain;
  max-width: 100%;
  max-height: 100%;
  border-radius: 8px;
  transition: transform .15s ease, filter .15s ease;
}

.dgi__strip--multi .dgi__thumb {
  object-fit: cover;
}

.dgi__item:hover .dgi__thumb {
  transform: scale(1.02);
  filter: brightness(1.04);
}

.dgi__item:focus-visible {
  outline: 2px solid var(--dsw-alias-accent, #7aa2f7);
  outline-offset: 2px;
}

.dgi__badge {
  position: absolute;
  left: 6px;
  bottom: 6px;
  padding: 2px 6px;
  border-radius: 4px;
  background: rgba(10, 12, 16, .72);
  color: rgba(255, 255, 255, .92);
  font-size: 11px;
  line-height: 16px;
  font-variant-numeric: tabular-nums;
  backdrop-filter: blur(4px);
}

.dgi__backdrop {
  position: fixed;
  inset: 0;
  z-index: 1200;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(8, 10, 14, .92);
  animation: dgi-fade-in .18s ease;
}

.dgi__stage {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 92vw;
  max-height: 88vh;
  color: rgba(255, 255, 255, .92);
}

.dgi__full {
  display: block;
  max-width: 92vw;
  max-height: 80vh;
  object-fit: contain;
  border-radius: 8px;
  box-shadow: 0 24px 64px rgba(0, 0, 0, .5);
  animation: dgi-zoom-in .2s ease;
}

.dgi__save-button {
  position: absolute;
  top: 12px;
  right: 12px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border: 1px solid rgba(255, 255, 255, .18);
  border-radius: 999px;
  background: rgba(20, 24, 32, .78);
  color: rgba(255, 255, 255, .92);
  font-size: 12px;
  line-height: 18px;
  cursor: pointer;
  backdrop-filter: blur(6px);
  transition: background .15s ease, border-color .15s ease;
}

.dgi__save-button:hover {
  background: rgba(32, 38, 50, .88);
  border-color: rgba(255, 255, 255, .32);
}

.dgi__save-button:disabled {
  opacity: .6;
  cursor: default;
}

.dgi__save-icon { display: block; }

.dgi__broken {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 200px;
  min-height: 160px;
  border-radius: 8px;
  background: rgba(255, 255, 255, .06);
  color: rgba(255, 255, 255, .72);
  font-size: 13px;
}

.dgi__meta-line {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 10px;
  font-size: 12px;
  line-height: 18px;
  font-variant-numeric: tabular-nums;
  color: rgba(255, 255, 255, .8);
}

.dgi__model {
  opacity: .75;
  font-family: var(--dsh-font-mono, ui-monospace, SFMono-Regular, Menlo, monospace);
}

.dgi__hint-line {
  margin-top: 4px;
  font-size: 11px;
  line-height: 16px;
  color: rgba(255, 255, 255, .5);
}

@keyframes dgi-fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes dgi-zoom-in {
  from { transform: scale(.96); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}

@media (prefers-reduced-motion: reduce) {
  .dgi__backdrop,
  .dgi__full,
  .dgi__thumb { animation: none; transition: none; }
  .dgi__item:hover .dgi__thumb { transform: none; }
}

/* 用户要求：对话流卡片去全部底色无边框（只留阴影/文字/动效；hover 反馈保留）。 */
.dtt__card--step, .dtt__card--reply { background: transparent !important; }
/* 超细边条：1px 发丝描边（浅色 l3 / 深色白 10%），阴影回到 v0.4.7 的轻档。 */
.dtt__card--reply { border: 1px solid var(--dsw-alias-border-l3, rgba(127,127,127,.16)) !important; }
.dtt__card--reply::before, .dtt__card--reply[data-interrupted]::before { display: none !important; }
.dtt__card--step { border: none !important; }
.dtt__card-chip { border-color: transparent !important; }
.dtt__card-chip:hover { border-color: color-mix(in srgb, var(--dsw-alias-state-business-primary, #4176e6) 45%, transparent) !important; }
.dtt__card-badge, .dtt__card-badge[data-interrupted] { background: transparent !important; }
.dtt__card-chip, .dtt__card-chip[data-kind="git"] { background: transparent !important; }
body[data-ds-dark-theme] .dtt__card--reply { box-shadow: 0 12px 32px rgba(0,0,0,.55) !important; border-color: rgba(255,255,255,.10) !important; }

/* ══ 会话头部视图标签（对话 / 轨迹）移到右上角 ═══════════════════════════
   官方 ui-conversation 把 tablist 作为 header 的第二个块级子元素，独占标题行
   下方一整条（header 实测 76px）。这里把 header 改成单行 flex：标题行
   flex:1 1 auto + min-width:0 负责收缩截断，tablist flex:none 靠 margin-left:auto
   钉到右上角，与标题垂直同行；header 收回 45px，省下的 31px 全还给正文。
   选择器只用稳定钩子：header 标签、role=tablist、CSS Module 的 _titleRow /
   _tab 后缀（前缀 wSkVaW_ 是构建 hash，会变，一律不写死）。
   :has 只在真的渲染出 tablist（视图数 1 时官方不渲染）时生效，单视图零影响。 */
header:has(> [role='tablist']) {
  display: flex;
  align-items: center;
  gap: 18px;
}

header:has(> [role='tablist']) > [class*='_titleRow'] {
  flex: 1 1 auto;
  min-width: 0;
}

header:has(> [role='tablist']) > [role='tablist'] {
  flex: none;
  gap: 22px;
  margin: 0 0 0 auto;
  padding-left: 0;
}

/* 标签本体：下划线收回到贴着文字（官方 11px 底衬是给整行贴边用的），
   hover 提色 + 下划线从中心展开，选中态常驻蓝色下划线。 */
header > [role='tablist'] > [class*='_tab'] {
  padding: 2px 0 8px;
  transition: color .18s ease;
}

header > [role='tablist'] > [class*='_tab']:hover {
  color: var(--dsw-alias-label-primary);
}

header > [role='tablist'] > [class*='_tab']::after {
  right: 0;
  bottom: 2px;
  left: 0;
  transform: scaleX(0);
  transform-origin: 50% 100%;
  transition: transform .22s cubic-bezier(.2, .8, .2, 1), background-color .18s ease;
}

header > [role='tablist'] > [class*='_tab']:hover::after {
  background: var(--dsw-alias-border-l2, rgba(127,127,127,.28));
  transform: scaleX(1);
}

header > [role='tablist'] > [class*='_tab'][class*='_tabActive']::after {
  background: var(--dsw-alias-state-business-primary, #4176e6);
  transform: scaleX(1);
}

@media (prefers-reduced-motion: reduce) {
  header > [role='tablist'] > [class*='_tab'],
  header > [role='tablist'] > [class*='_tab']::after { transition: none; }
}
`

/** Inject the stylesheet once. */
export function injectStyles(): void {
  if (typeof document === 'undefined') return
  if (document.getElementById('dsh-chat-flow-styles') !== null) return
  const style = document.createElement('style')
  style.id = 'dsh-chat-flow-styles'
  style.textContent = CSS
  document.head.appendChild(style)
}

/** 生图画廊样式：与主样式同模板，幂等注入（别名，供组件内部调用）。 */
export const injectGalleryStyles = injectStyles
