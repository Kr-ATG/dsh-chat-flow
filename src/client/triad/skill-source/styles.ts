/** skill-source 的 SkillRow 注入样式(自内核 ui-skill 的 SkillRow.module.css 转写,类名加 triad- 前缀防冲突)。 */

const CSS = `
.triad-skill-card {
  display: flex;
  flex-direction: column;
}

.triad-skill-row {
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  height: 24px;
  min-width: 0;
}

.triad-skill-row[data-expandable] {
  cursor: pointer;
}

.triad-skill-card[data-state='running'] .triad-skill-row::after {
  content: '';
  position: absolute;
  inset: 0 auto 0 0;
  width: 300px;
  background: linear-gradient(
    90deg,
    transparent 0%,
    color-mix(in srgb, var(--dsw-alias-bg-base) 60%, transparent) 55%,
    transparent 100%
  );
  animation: dsh-triad-skill-row-sweep 2.6s ease-out infinite;
  pointer-events: none;
}

@keyframes dsh-triad-skill-row-sweep {
  0% { left: -300px; }
  90%, 100% { left: 100%; }
}

.triad-skill-leading {
  position: relative;
  flex: none;
  width: 16px;
  height: 16px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-right: 6px;
  color: var(--dsw-alias-label-tertiary);
}

.triad-skill-chevron {
  color: var(--dsw-alias-label-secondary);
}

.triad-skill-iconIdle {
  display: inline-flex;
  opacity: 1;
  transition: opacity 100ms ease;
}

.triad-skill-chevronHover {
  position: absolute;
  inset: 0;
  margin: auto;
  opacity: 0;
  transition: opacity 100ms ease;
}

.triad-skill-row:hover .triad-skill-iconIdle {
  opacity: 0;
}

.triad-skill-row:hover .triad-skill-chevronHover {
  opacity: 1;
}

.triad-skill-title {
  flex: none;
  font-size: 14px;
  line-height: 24px;
  color: var(--dsw-alias-label-secondary);
}

.triad-skill-separator {
  flex: none;
  width: 2px;
  height: 2px;
  border-radius: 1px;
  margin: 0 8px;
  background: var(--dsw-alias-label-caption);
}

.triad-skill-summary {
  flex: 1 1 auto;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 14px;
  line-height: 24px;
  color: var(--dsw-alias-label-tertiary);
}

.triad-skill-errorSummary {
  color: var(--dsw-alias-state-error-primary);
}

.triad-skill-bodyWrap {
  display: flex;
  flex-direction: column;
}

.triad-skill-instructionsCard {
  display: flex;
  flex-direction: column;
  max-height: 260px;
  margin: 4px 0 4px 4px;
  overflow: hidden;
  border: 1px solid var(--dsw-alias-border-l1);
  border-radius: 12px;
  background: var(--dsw-alias-markdown-code-block);
}

.triad-skill-instructionsHeader {
  flex: none;
  padding: 8px 12px;
  border-bottom: 1px solid var(--dsw-alias-border-l2);
  background: var(--dsw-alias-markdown-code-block-banner);
  font-size: 11px;
  font-weight: 500;
  line-height: 16px;
  color: var(--dsw-alias-label-caption);
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.triad-skill-instructions {
  min-height: 0;
  margin: 0;
  padding: 10px 12px 12px;
  overflow: auto;
  white-space: pre-wrap;
  overflow-wrap: anywhere;
  font: var(--dsw-font-markdown-code-block-small);
  color: var(--dsw-alias-label-secondary);
}

.triad-skill-instructions[data-error] {
  color: var(--dsw-alias-state-error-primary);
}

.triad-skill-instructions::-webkit-scrollbar-thumb {
  border: 2px solid transparent;
  background-clip: padding-box;
  border-radius: 6px;
}

.triad-skill-instructions::-webkit-scrollbar-track {
  margin: 6px 0;
}

.triad-skill-inspectButton {
  display: inline-flex;
  align-self: flex-start;
  align-items: center;
  gap: 4px;
  margin: 4px 0 2px 4px;
  padding: 2px 8px;
  border: 1px solid var(--dsw-alias-border-l2);
  border-radius: 999px;
  background: var(--dsw-alias-bg-base);
  color: var(--dsw-alias-label-secondary);
  font-size: 11px;
  line-height: 16px;
  cursor: pointer;
  opacity: 0;
  transition: opacity 100ms ease;
}

.triad-skill-card:hover .triad-skill-inspectButton,
.triad-skill-inspectButton:focus-visible {
  opacity: 1;
}

.triad-skill-inspectButton:hover {
  background: var(--dsw-alias-interactive-bg-hover-solid);
  color: var(--dsw-alias-label-primary);
}

.triad-skill-visuallyHidden {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
  white-space: nowrap;
}

@media (prefers-reduced-motion: reduce) {
  .triad-skill-card[data-state='running'] .triad-skill-row::after {
    animation: none;
    display: none;
  }

  .triad-skill-iconIdle,
  .triad-skill-chevronHover,
  .triad-skill-inspectButton {
    transition: none;
  }
}
`

/** 注入 SkillRow 样式一次(幂等)。 */
export function injectSkillRowStyles(): void {
  if (typeof document === 'undefined') return
  if (document.getElementById('dsh-triad-skill-source-styles') !== null) return
  const style = document.createElement('style')
  style.id = 'dsh-triad-skill-source-styles'
  style.textContent = CSS
  document.head.appendChild(style)
}

/** SkillRow 类名字典(与注入 CSS 的 triad- 前缀类一一对应)。 */
export const skillCss = {
  card: 'triad-skill-card',
  row: 'triad-skill-row',
  leading: 'triad-skill-leading',
  chevron: 'triad-skill-chevron',
  iconIdle: 'triad-skill-iconIdle',
  chevronHover: 'triad-skill-chevronHover',
  title: 'triad-skill-title',
  separator: 'triad-skill-separator',
  summary: 'triad-skill-summary',
  errorSummary: 'triad-skill-errorSummary',
  bodyWrap: 'triad-skill-bodyWrap',
  instructionsCard: 'triad-skill-instructionsCard',
  instructionsHeader: 'triad-skill-instructionsHeader',
  instructions: 'triad-skill-instructions',
  inspectButton: 'triad-skill-inspectButton',
  visuallyHidden: 'triad-skill-visuallyHidden',
}