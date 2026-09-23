/**
 * hub — 用量工作台「Skills Hub 风格」共享视觉层。
 *
 * 与 SkillsPanel 的 skm-* 同一套设计语言（白底卡片、左侧分类导航、
 * 圆渐变图标 + 光点统计卡、搜索/排序工具栏、胶囊分段按钮）：
 *  - 骨架：左侧分类导航（图标 + 名称 + 计数，选中蓝底）+ 主区统计行 + 工具栏 + 内容；
 *  - 统计卡：左圆形渐变图标 + 光点，右侧 label / 大数；desc 不再常驻占位，
 *    hover 时以悬浮气泡出现；点击卡片展开下方明细块（点统计卡展示）；
 *  - 面板尺寸按视口自动夹紧（popover-shell 已处理），此处只定类名与视觉。
 *
 * 前缀 usm-（usage workbench）避免与宿主/skm 冲突；样式注入幂等。
 */

import type { CSSProperties, ReactNode } from 'react'

const STYLE_ID = 'dsh-usage-hub-styles'

/* 注入式 CSS 红线：注释内部不得出现「星号紧跟正斜杠」两字符闭合序列，
   本块注释均已回避该写法。 */
const SHEET = `
@keyframes usm-card-in {
  from { opacity: 0; transform: translateY(8px) scale(0.99); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}
@keyframes usm-form-in {
  from { opacity: 0; transform: translateY(-4px); }
  to { opacity: 1; transform: translateY(0); }
}
/* ── 骨架：主区 + 左栏（与 skm-hub 一致：面板底色 bg-base） ── */
.usm-hub { flex: 1 1 auto; min-height: 0; min-width: 0; display: flex; background: var(--dsw-alias-bg-base, #fff); }
.usm-side {
  flex: none; width: 216px; box-sizing: border-box; padding: 16px 14px 16px 16px;
  border-right: 1px solid var(--dsw-alias-border-l1, rgba(0, 0, 0, 0.05));
  background: var(--dsw-alias-bg-base, #fff);
  overflow-y: auto; display: flex; flex-direction: column; gap: 2px;
}
.usm-cat-title { flex: none; margin: 0 6px 10px; font-size: 13px; font-weight: 700; line-height: 18px; color: var(--dsw-alias-label-primary, #1f2430); }
.usm-cat-list { flex: none; display: flex; flex-direction: column; gap: 4px; }
.usm-cat-item {
  flex: none; display: flex; align-items: center; gap: 10px; width: 100%; box-sizing: border-box;
  border: 1px solid transparent; border-radius: 10px; padding: 8px 10px; background: transparent;
  cursor: pointer; font-family: inherit; color: var(--dsw-alias-label-secondary, #61666b);
  transition: background 140ms ease, border-color 140ms ease, color 140ms ease, box-shadow 140ms ease;
}
.usm-cat-item:hover { background: var(--dsw-alias-interactive-bg-hover, rgba(0, 0, 0, 0.03)); color: var(--dsw-alias-label-primary, #1f2430); }
.usm-cat-item[data-active] {
  background: color-mix(in srgb, var(--dsw-alias-state-business-primary, #4176e6) 13%, transparent);
  border-color: color-mix(in srgb, var(--dsw-alias-state-business-primary, #4176e6) 32%, transparent);
  color: var(--dsw-alias-state-business-primary, #4176e6);
}
.usm-cat-icon { flex: none; display: inline-flex; width: 18px; height: 18px; align-items: center; justify-content: center; color: var(--dsw-alias-label-caption, #adb2b8); transition: color 140ms ease; }
.usm-cat-icon[data-active] { color: var(--dsw-alias-state-business-primary, #4176e6); }
.usm-cat-label { flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; text-align: left; font-size: 13px; font-weight: 500; line-height: 18px; }
.usm-cat-item[data-active] .usm-cat-label { font-weight: 600; }
.usm-cat-count { flex: none; font-size: 12px; line-height: 16px; color: var(--dsw-alias-label-caption, #adb2b8); }
.usm-cat-item[data-active] .usm-cat-count { color: var(--dsw-alias-state-business-primary, #4176e6); }
.usm-cat-count[data-warn] { color: var(--dsw-alias-state-warn-primary, #f59e0b); font-weight: 600; }
.usm-filters-title { flex: none; margin: 18px 6px 8px; font-size: 13px; font-weight: 700; line-height: 18px; color: var(--dsw-alias-label-primary, #1f2430); }
/* ── 查询范围：左栏平铺网格按钮（选中蓝底） ── */
.usm-range-grid { flex: none; display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 6px; padding: 0 2px; }
.usm-range-btn {
  flex: none; display: inline-flex; align-items: center; justify-content: center; height: 30px;
  box-sizing: border-box; border: 1px solid var(--dsw-alias-border-l2, rgba(0, 0, 0, 0.1));
  border-radius: 999px; background: var(--dsw-alias-bg-base, #fff); padding: 0 8px;
  font-size: 12px; line-height: 17px; font-family: inherit; white-space: nowrap; cursor: pointer;
  color: var(--dsw-alias-label-secondary, #61666b);
  transition: background 140ms ease, color 140ms ease, border-color 140ms ease, box-shadow 140ms ease, transform 140ms ease;
}
.usm-range-btn:hover { color: var(--dsw-alias-label-primary, #1f2430); border-color: var(--dsw-alias-border-l3, rgba(0, 0, 0, 0.16)); }
.usm-range-btn:active { transform: scale(0.96); }
/* 选中态与技能面板选中按钮一致：品牌蓝底白字（两种主题下均成立） */
.usm-range-btn[data-active] {
  background: #3d6be5;
  border-color: #3d6be5;
  color: #fff;
  box-shadow: 0 2px 6px color-mix(in srgb, #3d6be5 30%, transparent);
}
.usm-range-custom { flex: none; display: flex; flex-direction: column; gap: 6px; margin-top: 10px; animation: usm-form-in 160ms ease-out; }
.usm-range-date-row { display: flex; align-items: center; gap: 6px; padding: 0 2px; }
.usm-range-date-sep { flex: none; font-size: 12px; color: var(--dsw-alias-label-tertiary, #81858c); }
.usm-range-date {
  flex: 1; min-width: 0; height: 30px; box-sizing: border-box; border: 1px solid var(--dsw-alias-border-l2, rgba(0, 0, 0, 0.1));
  border-radius: 8px; background: var(--dsw-alias-bg-base, #fff); padding: 0 8px; font-size: 12px;
  color: var(--dsw-alias-label-primary, #1f2430); font-family: inherit; color-scheme: dark light; outline: none;
}
.usm-range-date:focus { border-color: var(--dsw-alias-state-business-primary, #4176e6); }
/* ── 趋势页 KPI 方块图标（data-shape=square：圆角方块 + 色调浅底） ── */
.usm-stat-icon[data-shape='square'] { width: 34px; height: 34px; border-radius: 10px; }
.usm-stat-icon[data-shape='square'][data-tone='blue'] { background: color-mix(in srgb, var(--dsw-alias-state-business-primary, #4176e6) 14%, var(--dsw-alias-bg-base, #fff)); }
.usm-stat-icon[data-shape='square'][data-tone='green'] { background: color-mix(in srgb, var(--dsw-alias-state-success-primary, #22c55e) 14%, var(--dsw-alias-bg-base, #fff)); }
.usm-stat-icon[data-shape='square'][data-tone='violet'] { background: color-mix(in srgb, #7c5cf0 14%, var(--dsw-alias-bg-base, #fff)); }
.usm-stat-icon[data-shape='square'][data-tone='orange'] { background: color-mix(in srgb, var(--dsw-alias-state-warn-primary, #f59e0b) 16%, var(--dsw-alias-bg-base, #fff)); }
/* ── 图表卡分段控件（小时/天/7天/30天） ── */
.usm-seg { flex: none; display: inline-flex; gap: 2px; padding: 2px; border: 1px solid var(--dsw-alias-border-l2, rgba(0, 0, 0, 0.1)); border-radius: 8px; background: var(--dsw-alias-bg-base, #fff); }
.usm-seg-btn { flex: none; height: 22px; padding: 0 9px; border: none; border-radius: 6px; background: transparent; font-size: 11px; line-height: 1; color: var(--dsw-alias-label-secondary, #61666b); cursor: pointer; font-family: inherit; white-space: nowrap; transition: background 140ms ease, color 140ms ease, box-shadow 140ms ease; }
.usm-seg-btn:hover { color: var(--dsw-alias-label-primary, #1f2430); background: var(--dsw-alias-interactive-bg-hover, rgba(0, 0, 0, 0.04)); }
.usm-seg-btn[data-active] { background: color-mix(in srgb, var(--dsw-alias-state-business-primary, #4176e6) 16%, transparent); color: var(--dsw-alias-state-business-primary, #4176e6); font-weight: 600; }
/* ── 概览瓦片（今日概览） ── */
.usm-ov-grid { flex: none; display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 10px; }
.usm-ov-tile { flex: none; box-sizing: border-box; border: 1px solid var(--dsw-alias-border-l1, rgba(0, 0, 0, 0.06)); border-radius: 12px; background: var(--dsw-alias-bg-module-platform, #fff); padding: 10px 12px; display: flex; flex-direction: column; gap: 4px; min-width: 0; opacity: 0; animation: usm-card-in 300ms cubic-bezier(0.2, 0.7, 0.3, 1.06) forwards; transition: box-shadow 160ms ease, transform 160ms ease, border-color 160ms ease; }
.usm-ov-tile:hover { box-shadow: 0 6px 18px color-mix(in srgb, var(--dsw-alias-label-primary, #0f1115) 10%, transparent); transform: translateY(-1px); border-color: var(--dsw-alias-border-l3, rgba(0, 0, 0, 0.13)); }
.usm-ov-label { font-size: 11px; line-height: 16px; color: var(--dsw-alias-label-secondary, #8f96a3); }
.usm-ov-value { font-size: 17px; line-height: 23px; font-weight: 600; color: var(--dsw-alias-label-primary, #0f1115); font-variant-numeric: tabular-nums; white-space: nowrap; }
/* ── 供应商用量排行行 ── */
.usm-prov-row { display: flex; align-items: center; gap: 8px; padding: 6px 6px; margin: 0 -6px; border-radius: 8px; transition: background 120ms ease; }
.usm-prov-row:hover { background: var(--dsw-alias-interactive-bg-hover, rgba(0, 0, 0, 0.04)); }
/* ── 头部刷新按钮（spin 态） ── */
.usm-refresh { flex: none; display: inline-flex; align-items: center; justify-content: center; width: 28px; height: 28px; border: none; border-radius: 8px; padding: 0; background: transparent; cursor: pointer; color: var(--dsw-alias-label-secondary, #bbb); transition: background 140ms ease, color 140ms ease, transform 140ms ease; }
.usm-refresh:hover { background: var(--dsw-alias-interactive-bg-hover, rgba(0, 0, 0, 0.06)); color: var(--dsw-alias-label-primary, #eee); }
.usm-refresh:active { transform: scale(0.94); }
.usm-refresh[data-spin] svg { animation: usm-spin 700ms linear infinite; }
@keyframes usm-spin { to { transform: rotate(360deg); } }
/* ── 统计卡行（宽卡）：hover 悬浮 desc、点击展开明细 ── */
.usm-stats-row { flex: none; display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 12px; padding: 12px 14px 0; }
.usm-stat {
  position: relative; min-width: 0; display: flex; align-items: center; gap: 12px; box-sizing: border-box;
  border: 1px solid var(--dsw-alias-border-l2, rgba(0, 0, 0, 0.08)); border-radius: 12px;
  background: var(--dsw-alias-bg-base, #fff); padding: 11px 13px;
  box-shadow: 0 1px 2px color-mix(in srgb, var(--dsw-alias-label-primary, #0f1115) 6%, transparent);
  opacity: 0; animation: usm-card-in 260ms cubic-bezier(0.2, 0.7, 0.3, 1.06) forwards;
  transition: box-shadow 160ms ease, transform 160ms ease, border-color 160ms ease;
  cursor: pointer; text-align: left; font-family: inherit;
}
.usm-stat:hover { box-shadow: 0 6px 18px color-mix(in srgb, var(--dsw-alias-label-primary, #0f1115) 12%, transparent); transform: translateY(-1px); border-color: var(--dsw-alias-border-l3, rgba(0, 0, 0, 0.13)); }
.usm-stat[data-open] {
  border-color: color-mix(in srgb, var(--dsw-alias-state-business-primary, #4176e6) 45%, transparent);
  box-shadow: 0 0 0 2px color-mix(in srgb, var(--dsw-alias-state-business-primary, #4176e6) 14%, transparent);
}
.usm-stat-icon-col { flex: none; width: 34px; display: flex; flex-direction: column; align-items: center; gap: 7px; }
.usm-stat-icon { flex: none; width: 34px; height: 34px; border-radius: 50%; display: flex; align-items: center; justify-content: center; }
/* 渐变圆随主题着色：浅色=浅彩，深色=深彩（color-mix 与背景混合） */
.usm-stat-icon[data-tone='blue'] { background: radial-gradient(circle at 34% 26%, color-mix(in srgb, var(--dsw-alias-state-business-primary, #4176e6) 22%, var(--dsw-alias-bg-base, #fff)) 0%, color-mix(in srgb, var(--dsw-alias-state-business-primary, #4176e6) 34%, var(--dsw-alias-bg-base, #fff)) 55%, color-mix(in srgb, var(--dsw-alias-state-business-primary, #4176e6) 46%, var(--dsw-alias-bg-base, #fff)) 100%); }
.usm-stat-icon[data-tone='green'] { background: radial-gradient(circle at 34% 26%, color-mix(in srgb, var(--dsw-alias-state-success-primary, #22c55e) 18%, var(--dsw-alias-bg-base, #fff)) 0%, color-mix(in srgb, var(--dsw-alias-state-success-primary, #22c55e) 30%, var(--dsw-alias-bg-base, #fff)) 55%, color-mix(in srgb, var(--dsw-alias-state-success-primary, #22c55e) 42%, var(--dsw-alias-bg-base, #fff)) 100%); }
.usm-stat-icon[data-tone='violet'] { background: radial-gradient(circle at 34% 26%, color-mix(in srgb, #7c5cf0 20%, var(--dsw-alias-bg-base, #fff)) 0%, color-mix(in srgb, #7c5cf0 32%, var(--dsw-alias-bg-base, #fff)) 55%, color-mix(in srgb, #7c5cf0 44%, var(--dsw-alias-bg-base, #fff)) 100%); }
.usm-stat-icon[data-tone='orange'] { background: radial-gradient(circle at 34% 26%, color-mix(in srgb, var(--dsw-alias-state-warn-primary, #f59e0b) 18%, var(--dsw-alias-bg-base, #fff)) 0%, color-mix(in srgb, var(--dsw-alias-state-warn-primary, #f59e0b) 28%, var(--dsw-alias-bg-base, #fff)) 55%, color-mix(in srgb, var(--dsw-alias-state-warn-primary, #f59e0b) 38%, var(--dsw-alias-bg-base, #fff)) 100%); }
.usm-stat-icon svg { color: var(--dsw-alias-state-business-primary, #4176e6); }
.usm-stat-icon[data-tone='green'] svg { color: var(--dsw-alias-state-success-primary, #22c55e); }
.usm-stat-icon[data-tone='violet'] svg { color: #7c5cf0; }
.usm-stat-icon[data-tone='orange'] svg { color: var(--dsw-alias-state-warn-primary, #f59e0b); }
.usm-stat-glow { flex: none; width: 3px; height: 9px; border-radius: 99px; }
.usm-stat-glow[data-tone='blue'] { background: linear-gradient(to bottom, color-mix(in srgb, var(--dsw-alias-state-business-primary, #4176e6) 70%, transparent), transparent); }
.usm-stat-glow[data-tone='green'] { background: linear-gradient(to bottom, color-mix(in srgb, var(--dsw-alias-state-success-primary, #22c55e) 65%, transparent), transparent); }
.usm-stat-glow[data-tone='violet'] { background: linear-gradient(to bottom, color-mix(in srgb, #7c5cf0 65%, transparent), transparent); }
.usm-stat-glow[data-tone='orange'] { background: linear-gradient(to bottom, color-mix(in srgb, var(--dsw-alias-state-warn-primary, #f59e0b) 65%, transparent), transparent); }
.usm-stat-body { flex: 1; min-width: 0; display: flex; flex-direction: column; align-items: stretch; }
.usm-stat-label { font-size: 12px; line-height: 17px; color: var(--dsw-alias-label-secondary, #8f96a3); }
.usm-stat-value { font-size: 21px; font-weight: 700; line-height: 26px; letter-spacing: -0.2px; color: var(--dsw-alias-label-primary, #0f1115); font-variant-numeric: tabular-nums; white-space: nowrap; }
.usm-stat-value[data-tone='warn'] { color: var(--dsw-alias-state-warn-primary, #f59e0b); }
/* desc 悬浮气泡：hover 出现，不占布局 */
.usm-stat-sub { display: flex; align-items: center; gap: 4px; margin-top: 3px; font-size: 11px; line-height: 15px; color: var(--dsw-alias-label-tertiary, #81858c); font-variant-numeric: tabular-nums; white-space: nowrap; animation: usm-form-in 260ms ease-out backwards; }
.usm-stat-sub[data-tone='up'] { color: var(--dsw-alias-state-success-primary, #22c55e); }
.usm-stat-sub[data-tone='down'] { color: var(--dsw-alias-state-error-primary, #ef4444); }
.usm-stat-desc {
  position: absolute; left: 18px; right: 18px; top: calc(100% - 8px); z-index: 6;
  box-sizing: border-box; border: 1px solid var(--dsw-alias-border-l2, rgba(0, 0, 0, 0.1));
  border-radius: 10px; background: var(--dsw-alias-bg-layer-1, #fff);
  box-shadow: 0 8px 22px color-mix(in srgb, var(--dsw-alias-label-primary, #0f1115) 16%, transparent); padding: 7px 10px;
  font-size: 12px; line-height: 17px; color: var(--dsw-alias-label-secondary, #61666b);
  opacity: 0; transform: translateY(6px); pointer-events: none;
  transition: opacity 150ms ease, transform 150ms ease;
}
.usm-stat:hover .usm-stat-desc, .usm-stat:focus-visible .usm-stat-desc { opacity: 1; transform: translateY(0); }
/* 统计行下展开明细块 */
.usm-stat-detail {
  flex: none; margin: 10px 14px 0; box-sizing: border-box;
  border: 1px solid color-mix(in srgb, var(--dsw-alias-state-business-primary, #4176e6) 28%, transparent);
  border-radius: 14px;
  background: linear-gradient(178deg, color-mix(in srgb, var(--dsw-alias-state-business-primary, #4176e6) 12%, var(--dsw-alias-bg-base, #fff)) 0%, color-mix(in srgb, var(--dsw-alias-state-business-primary, #4176e6) 6%, var(--dsw-alias-bg-base, #fff)) 100%);
  padding: 12px 16px; display: flex; flex-direction: column; gap: 10px;
  animation: usm-form-in 200ms ease-out;
}
.usm-stat-detail-title { font-size: 13px; font-weight: 700; line-height: 18px; color: var(--dsw-alias-label-primary, #1f2430); }
.usm-breakdown { display: flex; flex-direction: column; gap: 4px; }
.usm-breakdown-row { display: flex; align-items: center; gap: 8px; min-width: 0; }
.usm-breakdown-label { flex: none; font-size: 12px; line-height: 18px; color: var(--dsw-alias-label-secondary, #61666b); }
.usm-breakdown-value { margin-left: auto; flex: none; font-size: 13px; line-height: 18px; font-weight: 600; color: var(--dsw-alias-label-primary, #1f2430); font-variant-numeric: tabular-nums; }
/* ── 工具栏 ── */
.usm-toolbar { flex: none; display: flex; align-items: center; gap: 8px; padding: 12px 16px 4px; flex-wrap: wrap; }
.usm-search-box {
  flex: 1; min-width: 170px; display: flex; align-items: center; gap: 8px; height: 36px; box-sizing: border-box;
  border: 1px solid var(--dsw-alias-border-l2, rgba(0, 0, 0, 0.12)); border-radius: 10px;
  background: var(--dsw-alias-bg-base, #fff); padding: 0 12px; color: var(--dsw-alias-label-caption, #adb2b8);
  transition: border-color 140ms ease, box-shadow 140ms ease;
}
.usm-search-box:focus-within { border-color: var(--dsw-alias-state-business-primary, #4176e6); box-shadow: 0 0 0 3px color-mix(in srgb, var(--dsw-alias-state-business-primary, #4176e6) 16%, transparent); }
.usm-search-input { flex: 1; min-width: 0; border: none; outline: none; background: transparent; font-size: 13px; line-height: 18px; color: var(--dsw-alias-label-primary, #0f1115); font-family: inherit; }
.usm-search-input::placeholder { color: var(--dsw-alias-label-caption, #adb2b8); }
.usm-search-clear {
  flex: none; width: 18px; height: 18px; border: none; border-radius: 999px; padding: 0; cursor: pointer;
  display: inline-flex; align-items: center; justify-content: center;
  background: color-mix(in srgb, var(--dsw-alias-label-tertiary, #81858c) 20%, transparent);
  color: var(--dsw-alias-label-secondary, #61666b); font-size: 11px; line-height: 1;
}
.usm-tool-button {
  flex: none; display: inline-flex; align-items: center; gap: 6px; height: 36px; box-sizing: border-box;
  border: 1px solid var(--dsw-alias-border-l2, rgba(0, 0, 0, 0.12)); border-radius: 10px;
  background: var(--dsw-alias-bg-base, #fff); color: var(--dsw-alias-label-secondary, #61666b);
  font-size: 13px; line-height: 18px; font-family: inherit; padding: 0 12px; cursor: pointer;
  transition: border-color 140ms ease, background 140ms ease, color 140ms ease, transform 140ms ease;
}
.usm-tool-button:hover { background: var(--dsw-alias-interactive-bg-hover-solid, #f7f8f9); color: var(--dsw-alias-label-primary, #0f1115); }
.usm-tool-button:active { transform: scale(0.97); }
.usm-tool-button:disabled { opacity: 0.5; cursor: default; }
.usm-toolbar-spacer { flex: 1 1 12px; }
.usm-toolbar-meta { flex: none; font-size: 12px; line-height: 18px; color: var(--dsw-alias-label-tertiary, #81858c); white-space: nowrap; }
/* ── 下拉菜单（排序等） ── */
.usm-drop-wrap { position: relative; flex: none; }
.usm-bulk-overlay { position: fixed; inset: 0; z-index: 995; border: none; background: transparent; cursor: default; padding: 0; }
.usm-drop-menu {
  position: absolute; top: calc(100% + 4px); left: 0; z-index: 996; min-width: 180px; box-sizing: border-box;
  border: 1px solid var(--dsw-alias-border-l2, rgba(0, 0, 0, 0.12)); border-radius: 10px;
  background: var(--dsw-alias-bg-layer-1, #fff);
  box-shadow: 0 6px 20px color-mix(in srgb, var(--dsw-alias-label-primary, #0f1115) 14%, transparent);
  padding: 4px; display: flex; flex-direction: column; gap: 2px; animation: usm-form-in 140ms ease-out;
}
.usm-drop-item {
  display: flex; align-items: center; gap: 8px; border: none; border-radius: 8px; padding: 7px 10px;
  background: transparent; font-size: 13px; line-height: 18px; color: var(--dsw-alias-label-secondary, #61666b);
  cursor: pointer; font-family: inherit; text-align: left; white-space: nowrap;
  transition: background 120ms ease, color 120ms ease;
}
.usm-drop-item:hover { background: var(--dsw-alias-interactive-bg-hover, rgba(0, 0, 0, 0.04)); color: var(--dsw-alias-label-primary, #0f1115); }
.usm-drop-item[aria-checked='true'] { color: var(--dsw-alias-label-primary, #0f1115); font-weight: 600; }
.usm-drop-check { flex: none; width: 16px; height: 16px; display: inline-flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 700; color: var(--dsw-alias-state-business-primary, #4176e6); opacity: 0; transform: scale(0.6); transition: opacity 140ms ease, transform 140ms ease; }
.usm-drop-check[data-on] { opacity: 1; transform: scale(1); }
/* ── 内容区 ── */
.usm-main-scroll { flex: 1; min-height: 0; overflow-y: auto; padding: 12px 14px 18px; display: flex; flex-direction: column; gap: 10px; }
.usm-section { display: flex; flex-direction: column; min-width: 0; gap: 8px; }
.usm-section-head { display: flex; align-items: center; gap: 8px; min-width: 0; padding: 2px 4px 0; }
.usm-section-title { flex: none; font-size: 13px; font-weight: 700; line-height: 18px; color: var(--dsw-alias-label-primary, #1f2430); white-space: nowrap; }
.usm-section-meta { flex: 1; min-width: 0; font-size: 12px; line-height: 18px; color: var(--dsw-alias-label-tertiary, #81858c); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.usm-section-action { flex: none; }
.usm-empty {
  flex: none; box-sizing: border-box; border: 1px dashed var(--dsw-alias-border-l3, rgba(0, 0, 0, 0.18));
  border-radius: 12px; padding: 18px; text-align: center; font-size: 12px; line-height: 18px;
  color: var(--dsw-alias-label-tertiary, #81858c);
}
/* ── 底部说明横幅（热力图说明） ── */
.usm-note {
  flex: none; display: flex; align-items: flex-start; gap: 10px; box-sizing: border-box;
  border: 1px solid color-mix(in srgb, var(--dsw-alias-state-business-primary, #4176e6) 16%, transparent);
  border-radius: 12px; padding: 12px 14px;
  background: linear-gradient(180deg, color-mix(in srgb, var(--dsw-alias-state-business-primary, #4176e6) 7%, var(--dsw-alias-bg-base, #fff)) 0%, color-mix(in srgb, var(--dsw-alias-state-business-primary, #4176e6) 3%, var(--dsw-alias-bg-base, #fff)) 100%);
  opacity: 0; animation: usm-card-in 260ms cubic-bezier(0.2, 0.7, 0.3, 1.06) 200ms forwards;
}
.usm-note-icon { flex: none; width: 18px; height: 18px; display: inline-flex; align-items: center; justify-content: center; border-radius: 50%; color: var(--dsw-alias-state-business-primary, #4176e6); background: color-mix(in srgb, var(--dsw-alias-state-business-primary, #4176e6) 12%, transparent); }
.usm-note-body { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 3px; }
.usm-note-title { font-size: 13px; font-weight: 700; line-height: 18px; color: var(--dsw-alias-label-primary, #1f2430); }
.usm-note-text { font-size: 12px; line-height: 18px; color: var(--dsw-alias-label-secondary, #61666b); }
/* ── 顶栏：分类横排 + 查询范围（取代旧左栏；主区纵向排布） ── */
.usm-hub { flex-direction: column; }
.usm-topbar { flex: none; display: flex; align-items: center; gap: 10px; flex-wrap: wrap; padding: 12px 16px; border-bottom: 1px solid var(--dsw-alias-border-l1, rgba(0, 0, 0, 0.05)); background: var(--dsw-alias-bg-base, #fff); }
.usm-cat-row { flex: 1 1 auto; min-width: 200px; display: flex; align-items: center; gap: 6px; flex-wrap: wrap; }
.usm-cat-row .usm-cat-item { flex: none; width: auto; }
.usm-top-range { flex: none; display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
.usm-top-range .usm-drop-wrap .usm-tool-button { height: 30px; border-radius: 999px; font-size: 12px; }
.usm-top-range .usm-drop-menu { left: auto; right: 0; }
.usm-top-range .usm-range-grid { display: flex; flex-wrap: wrap; gap: 6px; padding: 0; }
.usm-top-range .usm-range-custom { margin-top: 0; }
/* ── 移动端：左栏转横向导航 ── */
@media (max-width: 767.98px) {
  .usm-hub { flex-direction: column; }
  .usm-side { width: 100%; flex-direction: row; align-items: center; gap: 8px; padding: 8px 12px; overflow-x: auto; overflow-y: hidden; border-right: none; border-bottom: 1px solid var(--dsw-alias-border-l1, rgba(0, 0, 0, 0.05)); scrollbar-width: none; }
  .usm-side::-webkit-scrollbar { display: none; }
  .usm-cat-title, .usm-filters-title { display: none; }
  .usm-cat-list { flex-direction: row; gap: 4px; }
  .usm-cat-item { width: auto; max-width: 130px; }
  .usm-range-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); min-width: 260px; }
  .usm-stats-row { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px; padding: 12px 12px 0; }
  .usm-toolbar { padding: 12px 12px 4px; }
  .usm-main-scroll { padding: 12px 12px 20px; }
}
@media (prefers-reduced-motion: reduce) {
  .usm-stat { animation: none; opacity: 1; transition: none; }
  .usm-stat-desc { transition: none; }
  .usm-range-btn { transition: none; }
  .usm-drop-menu, .usm-stat-detail, .usm-range-custom { animation: none; }
}
`

/** 类名表（与 SkillsPanel 的 skm- 语言对齐）。 */
export const css = {
  hub: 'usm-hub',
  side: 'usm-side',
  topbar: 'usm-topbar',
  catRow: 'usm-cat-row',
  topRange: 'usm-top-range',
  catTitle: 'usm-cat-title',
  catList: 'usm-cat-list',
  catItem: 'usm-cat-item',
  catIcon: 'usm-cat-icon',
  catLabel: 'usm-cat-label',
  catCount: 'usm-cat-count',
  filtersTitle: 'usm-filters-title',
  rangeGrid: 'usm-range-grid',
  rangeBtn: 'usm-range-btn',
  rangeCustom: 'usm-range-custom',
  rangeDateRow: 'usm-range-date-row',
  rangeDateSep: 'usm-range-date-sep',
  rangeDate: 'usm-range-date',
  statsRow: 'usm-stats-row',
  stat: 'usm-stat',
  statIconCol: 'usm-stat-icon-col',
  statIcon: 'usm-stat-icon',
  statGlow: 'usm-stat-glow',
  statBody: 'usm-stat-body',
  statLabel: 'usm-stat-label',
  statValue: 'usm-stat-value',
  statDesc: 'usm-stat-desc',
  statSub: 'usm-stat-sub',
  statDetail: 'usm-stat-detail',
  statDetailTitle: 'usm-stat-detail-title',
  breakdown: 'usm-breakdown',
  breakdownRow: 'usm-breakdown-row',
  breakdownLabel: 'usm-breakdown-label',
  breakdownValue: 'usm-breakdown-value',
  toolbar: 'usm-toolbar',
  searchBox: 'usm-search-box',
  searchInput: 'usm-search-input',
  searchClear: 'usm-search-clear',
  toolButton: 'usm-tool-button',
  toolbarSpacer: 'usm-toolbar-spacer',
  toolbarMeta: 'usm-toolbar-meta',
  dropWrap: 'usm-drop-wrap',
  bulkOverlay: 'usm-bulk-overlay',
  dropMenu: 'usm-drop-menu',
  dropItem: 'usm-drop-item',
  dropCheck: 'usm-drop-check',
  mainScroll: 'usm-main-scroll',
  section: 'usm-section',
  sectionHead: 'usm-section-head',
  sectionTitle: 'usm-section-title',
  sectionMeta: 'usm-section-meta',
  sectionAction: 'usm-section-action',
  empty: 'usm-empty',
  note: 'usm-note',
  noteIcon: 'usm-note-icon',
  noteBody: 'usm-note-body',
  noteTitle: 'usm-note-title',
  noteText: 'usm-note-text',
  seg: 'usm-seg',
  segBtn: 'usm-seg-btn',
  ovGrid: 'usm-ov-grid',
  ovTile: 'usm-ov-tile',
  ovLabel: 'usm-ov-label',
  ovValue: 'usm-ov-value',
  provRow: 'usm-prov-row',
  refresh: 'usm-refresh',
}

/** 幂等注入 hub 样式。 */
export function ensureHubStyles(): void {
  if (typeof document === 'undefined') return
  if (document.getElementById(STYLE_ID) !== null) return
  const tag = document.createElement('style')
  tag.id = STYLE_ID
  tag.dataset.plugin = 'dsh-triad'
  tag.textContent = SHEET
  document.head.appendChild(tag)
}

/* ─────────────────────────────── 组件 ─────────────────────────────── */

/** 线性图标集（feather 风，与导航/技能面板同款描边）。 */
export function trendIcon(size = 16, stroke = 1.8): JSX.Element {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
      <polyline points="17 6 23 6 23 12" />
    </svg>
  )
}

export function detailIcon(size = 16, stroke = 1.8): JSX.Element {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="3" width="7" height="7" />
      <rect x="14" y="3" width="7" height="7" />
      <rect x="14" y="14" width="7" height="7" />
      <rect x="3" y="14" width="7" height="7" />
    </svg>
  )
}

export function signalIcon(size = 16, stroke = 1.8): JSX.Element {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.7 21a2 2 0 0 1-3.4 0" />
    </svg>
  )
}

export function walletIcon(size = 16, stroke = 1.8): JSX.Element {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2" y="5" width="20" height="15" rx="2" />
      <path d="M2 10h20" />
      <path d="M16 15h2" />
    </svg>
  )
}

export function tokensIcon(size = 18, stroke = 1.8): JSX.Element {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <ellipse cx="12" cy="5" rx="8" ry="3" />
      <path d="M4 5v14c0 1.7 3.6 3 8 3s8-1.3 8-3V5" />
      <path d="M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3" />
    </svg>
  )
}

export function inputIcon(size = 18, stroke = 1.8): JSX.Element {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 3v12" />
      <path d="m7 10 5 5 5-5" />
      <path d="M4 21h16" />
    </svg>
  )
}

export function outputIcon(size = 18, stroke = 1.8): JSX.Element {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 21V9" />
      <path d="m7 14 5-5 5 5" />
      <path d="M4 3h16" />
    </svg>
  )
}

export function callsIcon(size = 18, stroke = 1.8): JSX.Element {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 12h4l3 7 4-14 3 7h4" />
    </svg>
  )
}

export function modelsIcon(size = 18, stroke = 1.8): JSX.Element {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3.5 2" />
    </svg>
  )
}

export function hitIcon(size = 18, stroke = 1.8): JSX.Element {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="4.5" />
      <circle cx="12" cy="12" r="0.5" fill="currentColor" />
    </svg>
  )
}

export function daysIcon(size = 18, stroke = 1.8): JSX.Element {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="4" width="18" height="17" rx="2" />
      <path d="M16 2v4M8 2v4M3 10h18" />
    </svg>
  )
}

/* ── 通用小尺寸 SVG 图标（替代 ✓ ✕ ⚠ ▲ ▼ ↑ ↓ 等文本符号，跨 tab 共用） ── */

/** 对勾（下拉选中态）。 */
export function CheckIcon({ size = 12, stroke = 2.4 }: { size?: number; stroke?: number }): JSX.Element {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ flex: 'none' }}>
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}

/** 关闭叉（搜索清除 / 弹窗关闭）。 */
export function CloseIcon({ size = 12, stroke = 2.2 }: { size?: number; stroke?: number }): JSX.Element {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ flex: 'none' }}>
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  )
}

/** 告警三角（错误卡 / 配额告警）。 */
export function WarnIcon({ size = 14, stroke = 1.8 }: { size?: number; stroke?: number }): JSX.Element {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ flex: 'none' }}>
      <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  )
}

/** 上涨箭头（环比上升，替代 ▲ ↑）。 */
export function RiseIcon({ size = 10, stroke = 2.4 }: { size?: number; stroke?: number }): JSX.Element {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ flex: 'none' }}>
      <line x1="12" y1="19" x2="12" y2="5" />
      <polyline points="5 12 12 5 19 12" />
    </svg>
  )
}

/** 下跌箭头（环比下降，替代 ▼ ↓）。 */
export function FallIcon({ size = 10, stroke = 2.4 }: { size?: number; stroke?: number }): JSX.Element {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ flex: 'none' }}>
      <line x1="12" y1="5" x2="12" y2="19" />
      <polyline points="19 12 12 19 5 12" />
    </svg>
  )
}

/** tone → 实色（统计卡标签前简化色块用）。 */
function toneSolid(tone: 'blue' | 'green' | 'violet' | 'orange'): string {
  switch (tone) {
    case 'blue': return 'var(--dsw-alias-state-business-primary, #4176e6)'
    case 'green': return 'var(--dsw-alias-state-success-primary, #22c55e)'
    case 'violet': return '#7c5cf0'
    case 'orange': return 'var(--dsw-alias-state-warn-primary, #f59e0b)'
  }
}

/** 左栏分类项。 */
export function HubCatItem({ active, icon, label, count, warn, onClick, children }: {
  active: boolean
  icon: ReactNode
  label: string
  count?: string
  warn?: boolean
  onClick: () => void
  children?: ReactNode
}): JSX.Element {
  return (
    <button type="button" className={css.catItem} data-active={active || undefined} onClick={onClick}>
      <span className={css.catIcon} data-active={active || undefined}>{icon}</span>
      <span className={css.catLabel}>{label}</span>
      {count !== undefined && count !== '' && (
        <span className={css.catCount} data-warn={warn || undefined} title={warn ? '有异常，点击查看' : undefined}>{count}</span>
      )}
      {children}
    </button>
  )
}

/** 统计卡：两行内容（标签+主值同行 / 副行另起）+ hover 悬浮 desc + 点击展开明细（无徽章图标，标签前仅简化色块；icon/iconShape 参数兼容保留）。 */
export function HubStat({ tone, icon, label, value, valueWarn, sub, subTone, desc, open, onToggle, delay, iconShape = 'circle' }: {
  tone: 'blue' | 'green' | 'violet' | 'orange'
  icon: ReactNode
  label: string
  value: string
  valueWarn?: boolean
  /** 主值下方常驻副行（精确值 / 较昨日等）。 */
  sub?: ReactNode
  subTone?: 'up' | 'down' | 'flat'
  /** 悬浮气泡文案（hover 时才出现，不占位）。 */
  desc?: string
  open?: boolean
  onToggle?: () => void
  delay?: number
  /** 图标形态：circle = 渐变圆（默认），square = 圆角方块 + 色调浅底。 */
  iconShape?: 'circle' | 'square'
}): JSX.Element {
  const style: CSSProperties = { animationDelay: `${delay ?? 0}ms` }
  void icon
  void iconShape
  return (
    <button type="button" className={css.stat} style={style} data-open={open || undefined} onClick={onToggle}>
      <span className={css.statBody}>
        <span style={{ display: 'flex', alignItems: 'baseline', gap: 8, minWidth: 0 }}>
          <span className={css.statLabel} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, flex: 'none' }}>
            <svg width={9} height={9} viewBox="0 0 9 9" aria-hidden="true" style={{ flex: 'none' }}>
              <rect width={9} height={9} rx={2.5} fill={toneSolid(tone)} opacity={0.9} />
            </svg>
            {label}
          </span>
          <span className={css.statValue} data-tone={valueWarn ? 'warn' : undefined} style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{value}</span>
        </span>
        {sub !== undefined && <span className={css.statSub} data-tone={subTone !== 'flat' ? subTone : undefined}>{sub}</span>}
      </span>
      {desc !== undefined && <span className={css.statDesc} role="note">{desc}</span>}
    </button>
  )
}

/** 统计明细块：标题 + 分解行。 */
export function HubStatDetail({ title, rows, children }: {
  title: string
  rows?: Array<{ label: string; value: string }>
  children?: ReactNode
}): JSX.Element {
  return (
    <div className={css.statDetail} role="region">
      <span className={css.statDetailTitle}>{title}</span>
      {rows !== undefined && rows.length > 0 && (
        <div className={css.breakdown}>
          {rows.map((row) => (
            <div key={row.label} className={css.breakdownRow}>
              <span className={css.breakdownLabel}>{row.label}</span>
              <span className={css.breakdownValue}>{row.value}</span>
            </div>
          ))}
        </div>
      )}
      {children}
    </div>
  )
}

/** 分区：标题 + meta + action + 内容。 */
export function HubSection({ title, meta, action, children }: {
  title: string
  meta?: ReactNode
  action?: ReactNode
  children: ReactNode
}): JSX.Element {
  return (
    <section className={css.section}>
      <div className={css.sectionHead}>
        <span className={css.sectionTitle}>{title}</span>
        {meta !== undefined && <span className={css.sectionMeta}>{meta}</span>}
        {action !== undefined && <span className={css.sectionAction}>{action}</span>}
      </div>
      {children}
    </section>
  )
}
