/**
 * 余额/配额页卡片网格的共享样式：卡片入场、悬浮光晕、状态点辉光、
 * 骨架屏 shimmer、刷新旋转、空态入场。
 *
 * 注入式 CSS 红线：本块内不写任何注释（注释闭合序列会把后续规则拖成
 * 非法选择器整条丢弃），类名全部带 dsh-acc- 前缀避免与宿主冲突。
 */

export const ACC_STYLE_ID = 'dsh-accounts-sheet'

export const ACC_SHEET = `
@keyframes dsh-acc-in {
  from { opacity: 0; transform: translate3d(0, 12px, 0) scale(0.985); }
  to { opacity: 1; transform: translate3d(0, 0, 0) scale(1); }
}
@keyframes dsh-acc-win-in {
  from { opacity: 0; transform: translate3d(0, 6px, 0); }
  to { opacity: 1; transform: translate3d(0, 0, 0); }
}
@keyframes dsh-acc-shimmer {
  from { background-position: 200% 0; }
  to { background-position: -200% 0; }
}
@keyframes dsh-acc-pulse {
  0%, 100% { box-shadow: 0 0 0 0 color-mix(in srgb, var(--dsw-alias-state-error-primary) 45%, transparent); }
  50% { box-shadow: 0 0 0 5px color-mix(in srgb, var(--dsw-alias-state-error-primary) 0%, transparent); }
}
@keyframes dsh-acc-spin {
  to { transform: rotate(360deg); }
}
.dsh-acc-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(330px, 1fr));
  gap: 12px;
  align-items: start;
}
.dsh-acc-card {
  position: relative;
  border: 1px solid var(--dsw-alias-border-l1);
  border-radius: 14px;
  background: var(--dsw-alias-bg-layer-2);
  padding: 14px 16px;
  opacity: 0;
  animation: dsh-acc-in 360ms cubic-bezier(0.2, 0.8, 0.2, 1) both;
  transition: transform 180ms cubic-bezier(0.2, 0.8, 0.2, 1), border-color 180ms cubic-bezier(0.2, 0.8, 0.2, 1), box-shadow 180ms cubic-bezier(0.2, 0.8, 0.2, 1);
}
.dsh-acc-card:hover {
  transform: translateY(-2px);
  border-color: color-mix(in srgb, var(--dsw-alias-state-business-primary) 42%, var(--dsw-alias-border-l2));
  box-shadow: 0 10px 30px color-mix(in srgb, var(--dsw-alias-state-business-primary) 14%, transparent), 0 2px 8px rgba(0, 0, 0, 0.22);
}
.dsh-acc-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex: none;
  box-shadow: 0 0 6px currentColor;
}
.dsh-acc-dot[data-critical="true"] {
  animation: dsh-acc-pulse 2.2s ease-in-out infinite;
}
.dsh-acc-skel {
  height: 92px;
  border-radius: 14px;
  border: 1px solid var(--dsw-alias-border-l1);
  background:
    linear-gradient(90deg, var(--dsw-alias-bg-layer-2) 25%, var(--dsw-alias-bg-layer-1) 50%, var(--dsw-alias-bg-layer-2) 75%);
  background-size: 200% 100%;
  animation: dsh-acc-shimmer 1.4s linear infinite;
}
.dsh-acc-win {
  opacity: 0;
  animation: dsh-acc-win-in 300ms cubic-bezier(0.2, 0.8, 0.2, 1) both;
}
.dsh-acc-spin {
  animation: dsh-acc-spin 0.8s linear infinite;
}
.dsh-acc-chip {
  font-size: 11px;
  line-height: 18px;
  border-radius: 6px;
  padding: 0 7px;
  flex: none;
  white-space: nowrap;
}
@keyframes dsh-acc-drawer-in {
  from { opacity: 0; transform: translate3d(26px, 0, 0); }
  to { opacity: 1; transform: translate3d(0, 0, 0); }
}
@keyframes dsh-acc-drawer-out {
  from { opacity: 1; transform: translate3d(0, 0, 0); }
  to { opacity: 0; transform: translate3d(18px, 0, 0); }
}
@keyframes dsh-acc-dwrap-in {
  from { width: 0; }
  to { width: 316px; }
}
@keyframes dsh-acc-dwrap-out {
  from { width: 316px; }
  to { width: 0; }
}
.dsh-acc-kpi {
  display: flex;
  align-items: center;
  gap: 12px;
  border: 1px solid var(--dsw-alias-border-l1);
  border-radius: 14px;
  background: var(--dsw-alias-bg-layer-2);
  padding: 14px 16px;
  opacity: 0;
  animation: dsh-acc-in 360ms cubic-bezier(0.2, 0.8, 0.2, 1) both;
  transition: transform 180ms cubic-bezier(0.2, 0.8, 0.2, 1), border-color 180ms cubic-bezier(0.2, 0.8, 0.2, 1), box-shadow 180ms cubic-bezier(0.2, 0.8, 0.2, 1);
}
.dsh-acc-kpi:hover {
  transform: translateY(-2px);
  border-color: color-mix(in srgb, var(--dsw-alias-state-business-primary) 42%, var(--dsw-alias-border-l2));
  box-shadow: 0 10px 30px color-mix(in srgb, var(--dsw-alias-state-business-primary) 14%, transparent), 0 2px 8px rgba(0, 0, 0, 0.22);
}
.dsh-acc-kpi-icon {
  width: 38px;
  height: 38px;
  border-radius: 11px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex: none;
}
.dsh-acc-banner {
  display: flex;
  align-items: center;
  gap: 12px;
  border: 1px solid color-mix(in srgb, var(--dsw-alias-state-success-primary) 34%, var(--dsw-alias-border-l2));
  background: color-mix(in srgb, var(--dsw-alias-state-success-primary) 6%, var(--dsw-alias-bg-layer-2));
  border-radius: 14px;
  padding: 12px 16px;
  opacity: 0;
  animation: dsh-acc-in 360ms cubic-bezier(0.2, 0.8, 0.2, 1) both;
  animation-delay: 80ms;
}
.dsh-acc-banner[data-tone="warn"] {
  border-color: color-mix(in srgb, var(--dsw-alias-state-warn-primary) 48%, var(--dsw-alias-border-l2));
  background: color-mix(in srgb, var(--dsw-alias-state-warn-primary) 7%, var(--dsw-alias-bg-layer-2));
}
.dsh-acc-search {
  display: flex;
  align-items: center;
  gap: 7px;
  border: 1px solid var(--dsw-alias-border-l1);
  background: var(--dsw-alias-bg-layer-2);
  border-radius: 10px;
  padding: 0 10px;
  height: 32px;
  transition: border-color 180ms cubic-bezier(0.2, 0.8, 0.2, 1), box-shadow 180ms cubic-bezier(0.2, 0.8, 0.2, 1);
}
.dsh-acc-search:focus-within {
  border-color: color-mix(in srgb, var(--dsw-alias-state-business-primary) 55%, var(--dsw-alias-border-l2));
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--dsw-alias-state-business-primary) 14%, transparent);
}
.dsh-acc-search input {
  border: none;
  outline: none;
  background: transparent;
  color: var(--dsw-alias-label-primary);
  font: inherit;
  font-size: 12px;
  width: 150px;
}
.dsh-acc-search input::placeholder { color: var(--dsw-alias-label-tertiary); }
.dsh-acc-logo {
  width: 30px;
  height: 30px;
  border-radius: 9px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 700;
  flex: none;
}
.dsh-acc-tlist {
  border: 1px solid var(--dsw-alias-border-l1);
  border-radius: 14px;
  background: var(--dsw-alias-bg-layer-2);
  overflow: hidden;
}
.dsh-acc-thead {
  display: grid;
  grid-template-columns: minmax(200px, 2.1fr) 90px minmax(168px, 1.5fr) minmax(132px, 1.3fr) 88px;
  gap: 8px;
  align-items: center;
  padding: 10px 16px 9px;
  font-size: 11px;
  color: var(--dsw-alias-label-tertiary);
  border-bottom: 1px solid var(--dsw-alias-border-l1);
}
.dsh-acc-trow {
  display: grid;
  grid-template-columns: minmax(200px, 2.1fr) 90px minmax(168px, 1.5fr) minmax(132px, 1.3fr) 88px;
  gap: 8px;
  align-items: center;
  padding: 11px 16px;
  border-bottom: 1px solid var(--dsw-alias-border-l1);
  cursor: pointer;
  opacity: 0;
  animation: dsh-acc-in 320ms cubic-bezier(0.2, 0.8, 0.2, 1) both;
  transition: background 160ms cubic-bezier(0.2, 0.8, 0.2, 1), box-shadow 200ms cubic-bezier(0.2, 0.8, 0.2, 1);
}
.dsh-acc-trow:last-child { border-bottom: none; }
.dsh-acc-trow:hover { background: var(--dsw-alias-bg-layer-1); }
.dsh-acc-trow[data-selected="true"] {
  background: color-mix(in srgb, var(--dsw-alias-state-business-primary) 6%, var(--dsw-alias-bg-layer-2));
  box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--dsw-alias-state-business-primary) 42%, transparent);
}
.dsh-acc-drawer-wrap {
  width: 316px;
  flex: none;
  overflow: hidden;
  animation: dsh-acc-dwrap-in 280ms cubic-bezier(0.2, 0.8, 0.2, 1) both;
}
.dsh-acc-drawer-wrap[data-closing="true"] {
  animation: dsh-acc-dwrap-out 220ms cubic-bezier(0.4, 0, 0.2, 1) forwards;
}
.dsh-acc-drawer {
  width: 316px;
  height: 100%;
  border: 1px solid var(--dsw-alias-border-l1);
  border-radius: 14px;
  background: var(--dsw-alias-bg-layer-2);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  opacity: 0;
  animation: dsh-acc-drawer-in 280ms cubic-bezier(0.2, 0.8, 0.2, 1) both;
}
.dsh-acc-drawer[data-closing="true"] {
  animation: dsh-acc-drawer-out 220ms cubic-bezier(0.4, 0, 0.2, 1) forwards;
}
@media (prefers-reduced-motion: reduce) {
  .dsh-acc-card, .dsh-acc-win, .dsh-acc-skel, .dsh-acc-dot[data-critical="true"], .dsh-acc-spin {
    animation: none;
    opacity: 1;
  }
  .dsh-acc-kpi, .dsh-acc-banner, .dsh-acc-trow, .dsh-acc-drawer-wrap, .dsh-acc-drawer { animation: none; }
  .dsh-acc-kpi, .dsh-acc-banner, .dsh-acc-trow, .dsh-acc-drawer { opacity: 1; }
  .dsh-acc-card { transition: none; }
  .dsh-acc-kpi { transition: none; }
}
`

export function ensureAccountsStyles(): () => void {
  if (typeof document === 'undefined') return () => {}
  let tag = document.getElementById(ACC_STYLE_ID) as HTMLStyleElement | null
  if (tag === null) {
    tag = document.createElement('style')
    tag.id = ACC_STYLE_ID
    tag.dataset.plugin = 'dsh-triad'
    tag.textContent = ACC_SHEET
    document.head.appendChild(tag)
  }
  return () => { tag?.remove() }
}
