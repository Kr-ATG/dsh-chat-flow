window.__ModuleLoader__.load({ id: "dsh-chat-flow", factory: (require) => {
var module = { exports: {} };
var exports = module.exports;
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);

// src/client/index.ts
var index_exports = {};
__export(index_exports, {
  apply: () => apply,
  getOfficialAssistantNodeView: () => getOfficialAssistantNodeView,
  inject: () => inject,
  officialAssistantNodeView: () => officialAssistantNodeView
});
module.exports = __toCommonJS(index_exports);

// src/client/tool-summary/styles.ts
var CSS = `
/* Collapse flow slots that render nothing (aggregated tool groups + reasoning
   groups leave empty node slots behind; the transcript column's flex gap
   would otherwise turn each into a blank strip). */
[data-chat-flow-key]:has(> [data-slot]:empty) {
  display: none;
}

/* \u2500\u2500 \u8BBE\u8BA1\u57FA\u7EBF \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
 * \u5F3A\u8C03\u8272\u4E00\u5F8B\u8D70 --dts-accent\uFF08= \u5B98\u65B9\u54C1\u724C\u84DD state-business-primary\uFF09\uFF1B\u7EDD\u4E0D\u7528
 * --dsw-alias-brand-primary\uFF08\u6D45\u8272\u4E0B\u662F\u9ED1\u3001\u6DF1\u8272\u4E0B\u662F\u767D\u7684\u53CD\u8272 token\uFF09\u3002
 * \u8868\u9762/\u63CF\u8FB9\u53EA\u7528 design-platform.css \u91CC\u771F\u5B9E\u5B58\u5728\u7684 token\uFF1Abg-layer-1/2\u3001
 * bg-module-platform\u3001border-l2/l3\u3001label-*\u3001state-*\u3002
 * \u5185\u90E8\u586B\u5145\u9762\u7EDF\u4E00\u7ECF --dts-fill / --dts-fill-strong \u95F4\u63A5\u5F15\u7528\uFF0C\u73BB\u7483\u8D28\u611F\u4E3B\u9898
 * \u53EA\u9700\u8986\u76D6\u8FD9\u4E24\u4E2A\u53D8\u91CF\u5373\u53EF\u6574\u4F53\u6362\u6210\u300C\u4E2D\u6027\u534A\u900F\u660E\u62AC\u5347\u300D\uFF0C\u4E0D\u5FC5\u9010\u6761\u91CD\u5199\u89C4\u5219\u3002
 * \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */

/* ===== \u56DE\u5408\u8FC7\u7A0B\u884C\u5BB9\u5668\uFF08\u5B98\u65B9 turn-process \u884C\u540C\u6B3E\uFF0C\u89C1 .dts__process\uFF09===== */
.dts__entry-wrap {
  --dts-accent: var(--dsw-alias-state-business-primary, #4176e6);
  --dts-fill: var(--dsh-flow-veil, color-mix(in srgb, var(--dsw-alias-label-primary) 5%, transparent));
  /* \u5B9E\u65F6\u5361\u7247\uFF08\u4E0B\u8F7D/\u957F\u547D\u4EE4\uFF09\u8868\u9762\u8D70\u53D8\u91CF\uFF0C\u73BB\u7483\u8D28\u611F\u53EA\u9700\u8986\u76D6\u5B83\u3002 */
  --dts-chip-surface: var(--dsw-alias-bg-layer-1, rgba(127,127,127,.05));
  --dts-chip-border: var(--dsw-alias-border-l2, rgba(127,127,127,.22));
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 8px;
  max-width: 100%;
}

/* ===== \u56DE\u5408\u8FC7\u7A0B\u884C\uFF08\u4E0E\u5B98\u65B9 TurnProcessNodeView.module.css \u9010\u9879\u4E00\u81F4\uFF09========
 * \u7C7B\u540D\u6362\u524D\u7F00\uFF08\u5B98\u65B9 hash \u4F1A\u53D8\uFF0C\u8DDF\u7C7B\u540D\u8D70\u5FC5\u65AD\uFF09\uFF0C\u58F0\u660E\u7167\u6284\u5B98\u65B9\uFF1A\u6574\u5BBD\u6587\u5B57\u6309\u94AE
 * + \u5E95\u90E8\u53D1\u4E1D\u7EBF + \u5DE6\u6307 chevron\uFF08data-open \u65F6\u8F6C\u4E0B\u6765\uFF09\u3002\u8FD0\u884C\u4E2D\u6587\u5B57\u67D3\u54C1\u724C\u84DD
 * \uFF08\u5B98\u65B9\u884C\u5728\u6D41\u5F0F\u671F\u4E0D\u5B58\u5728\uFF0C\u8FD9\u91CC\u7ED9\u4E2A\u6D3B\u6307\u793A\uFF09\u3002 */
.dts__process {
  box-sizing: border-box;
  display: flex;
  align-items: center;
  width: 100%;
  min-width: 0;
  height: 33px;
  margin: 0;
  /* \u4E0A\u4E0B\u7559\u767D\u5E73\u8861\uFF1A\u5B98\u65B9\u662F padding: 0 0 8px\uFF0C\u4E8E\u662F 24px \u884C\u76D2\u88AB\u9876\u5230\u884C\u4E0A\u6CBF
     \uFF08\u5B9E\u6D4B\u6587\u5B57\u4E0A 6px / \u4E0B\u5230\u53D1\u4E1D\u7EBF 14px\uFF0C\u7EBF\u50CF\u60AC\u7740\uFF09\u3002\u6539\u6210 0\uFF0C\u8BA9\u884C\u76D2\u5728
     32.5px \u5185\u5BB9\u533A\u91CC\u5C45\u4E2D\uFF08\u4E0A\u4E0B\u5404 ~10px\uFF09\u3002\u884C\u603B\u9AD8 33px \u4E0E margin-bottom
     8px \u90FD\u4E0D\u52A8 \u2192 \u6574\u5757\u5360\u4F4D\u4E0D\u53D8\uFF0C\u865A\u62DF\u5217\u8868\u4F9D\u65E7\u4E0D\u8DF3\u4F4D\u3002 */
  padding: 0;
  border: none;
  border-bottom: .5px solid var(--dsw-alias-border-l2);
  background: 0 0;
  color: var(--dsw-alias-label-secondary);
  cursor: pointer;
  text-align: left;
  /* \u5E38\u9A7B 8px\uFF1A\u5B98\u65B9\u662F \uFF1Anot([data-open]) \u624D\u6709\u2014\u2014\u9AD8\u5EA6\u4E00\u53D8\u865A\u62DF\u5217\u8868\u5C31\u8DF3\u4F4D\u3002 */
  margin-bottom: 8px;
}

/* \u601D\u8003\u5206\u6BB5\uFF1A\u884C\u5185\u7B2C\u4E8C\u4E2A\u53EF\u70B9\u70ED\u533A\uFF08\u70B9\u5DE5\u5177\u6BB5\u8D70\u884C\u672C\u4F53\uFF09\u3002
   line-height \u663E\u5F0F\u5BF9\u9F50 label \u7684 24px \u884C\u76D2\u2014\u2014\u4E24\u6BB5\u90FD\u662F flex \u9879\u3001\u5404\u81EA\u6309\u81EA\u5DF1\u7684
   \u884C\u76D2\u5C45\u4E2D\uFF0C\u4E0D\u5199\u6B7B\u5C31\u4F1A\u51FA\u73B0\u300C\xB7 7 \u6B21\u601D\u8003\u300D\u6BD4\u524D\u9762\u534A\u53E5\u9AD8/\u4F4E\u534A\u50CF\u7D20\u7684\u9519\u4F4D\u3002 */
.dts__process-think {
  line-height: 24px;
  cursor: pointer;
  color: var(--dsw-alias-label-secondary);
  transition: color .15s ease;
}

.dts__process-think:hover {
  color: var(--dsw-alias-label-primary);
}

.dts__process-think:focus-visible {
  outline: 2px solid color-mix(in srgb, var(--dts-accent) 55%, transparent);
  outline-offset: 1px;
  border-radius: 3px;
}

.dts__process:focus-visible {
  outline: 2px solid color-mix(in srgb, var(--dts-accent) 55%, transparent);
  outline-offset: 2px;
}

.dts__process-label {
  min-width: 0;
  overflow: hidden;
  font-size: 14px;
  line-height: 24px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.dts__process[data-running="true"] .dts__process-label {
  color: var(--dts-accent);
  font-variant-numeric: tabular-nums;
}

.dts__process-chevron {
  flex: none;
  width: 16px;
  height: 16px;
  margin-left: 6px;
  color: var(--dsw-alias-label-tertiary);
  transform: rotate(-90deg);
  transition: transform .1s;
}

.dts__process[data-open] .dts__process-chevron {
  transform: rotate(0);
}

/* control \u5F71\u5B50\u884C\u7684 chevron \u72EC\u7ACB\u70ED\u533A\uFF1A\u70B9\u6B63\u6587\u8FDB\u62BD\u5C49\u3001\u70B9\u8FD9\u91CC\u8D70\u5B98\u65B9\u6298\u53E0\u3002
   \u76D2\u5B50\u653E\u5927\u5230 24px \u597D\u70B9\u4E2D\uFF0C\u5149\u5B66\u4F4D\u7F6E\u4E0E\u5B98\u65B9 16px \u56FE\u6807\u4E00\u81F4\uFF08\u5DE6 2px \u504F\u79FB
   \u62B5\u6389\u534A\u8FB9\u589E\u91CF\uFF09\uFF0C\u9759\u6B62\u6001\u4E0E\u5B98\u65B9\u65E0\u5DEE\u522B\u3002 */
.dts__process-chevronbtn {
  display: inline-grid;
  place-items: center;
  flex: none;
  width: 24px;
  height: 24px;
  margin: -4px -4px -4px 2px;
  border: 0;
  border-radius: 6px;
  padding: 0;
  background: none;
  color: inherit;
  cursor: pointer;
}

.dts__process-chevronbtn:hover {
  background: var(--dsw-alias-interactive-bg-hover, rgba(127,127,127,.1));
}

.dts__process-chevronbtn:focus-visible {
  outline: 2px solid color-mix(in srgb, var(--dts-accent) 55%, transparent);
  outline-offset: 1px;
}

.dts__process-chevronbtn .dts__process-chevron {
  margin-left: 0;
}



/* ===== \u5BF9\u8BDD\u6D41\u5185\u7684\u5B9E\u65F6\u5361\u7247\uFF08\u4E0B\u8F7D / \u957F\u547D\u4EE4\uFF09============================== */
.dts__entry-live {
  --dts-accent: var(--dsw-alias-state-business-primary, #4176e6);
  display: inline-flex;
  align-items: center;
  gap: 8px;
  height: 26px;
  padding: 0 12px;
  border: 1px solid var(--dsw-alias-border-l2, rgba(127,127,127,.22));
  border-radius: 999px;
  background: var(--dts-chip-surface, transparent);
  color: var(--dts-accent);
  font-size: 11px;
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
}

.dts__download-card {
  --dts-accent: var(--dsw-alias-state-business-primary, #4176e6);
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 280px;
  max-width: 100%;
  padding: 10px 12px;
  border: 1px solid var(--dsw-alias-border-l2, rgba(127,127,127,.22));
  border-radius: 12px;
  background: var(--dts-fill, rgba(127,127,127,.05));
  box-shadow: 0 1px 3px rgba(15,17,21,.05);
}

.dts__download-head {
  display: flex;
  align-items: center;
  gap: 7px;
  color: var(--dts-accent);
  font-size: 12px;
  font-weight: 600;
}

.dts__download-head > svg {
  flex: none;
}

.dts__download-title {
  font-variant-numeric: tabular-nums;
}

.dts__download-url {
  min-width: 0;
  overflow: hidden;
  color: var(--dsw-alias-label-secondary);
  font-family: var(--ds-font-family-code, monospace);
  font-size: 11px;
  line-height: 18px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.dts__download-dest {
  min-width: 0;
  overflow: hidden;
  color: var(--dsw-alias-label-tertiary);
  font-size: 11px;
  line-height: 18px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.dts__download-dest code {
  border-radius: 4px;
  padding: 0 4px;
  background: var(--dsw-alias-interactive-bg-hover, rgba(127,127,127,.1));
  color: var(--dsw-alias-label-secondary);
  font-family: var(--ds-font-family-code, monospace);
}

.dts__download-progress {
  margin-top: 2px;
}

.dts__download-progress .dts__progress {
  width: 100%;
}

/* \u4E0D\u5B9A\u91CF\u8FDB\u5EA6\u6761\uFF1A\u6DE1\u8272\u8F68\u9053 + \u4E24\u7AEF\u6E10\u9690\u7684\u5F3A\u8C03\u8272\u6E38\u6807\uFF08\u770B\u8D77\u6765\u5728\u6ED1\u52A8\u800C\u975E\u8DF3\u52A8\uFF09\u3002 */
.dts__progress {
  position: relative;
  width: 52px;
  height: 4px;
  overflow: hidden;
  border-radius: 999px;
  background: color-mix(in srgb, var(--dts-accent, #4176e6) 16%, var(--dsw-alias-interactive-bg-hover, rgba(127,127,127,.12)));
}

.dts__progress::after {
  content: '';
  position: absolute;
  top: 0;
  bottom: 0;
  width: 45%;
  border-radius: 999px;
  background: linear-gradient(90deg, transparent, var(--dts-accent, #4176e6), transparent);
  animation: dts-progress-slide 1.15s cubic-bezier(.4, 0, .6, 1) infinite;
}

@keyframes dts-progress-slide {
  from { left: -45%; }
  to { left: 100%; }
}

/* ===== \u5C45\u4E2D\u6D3B\u52A8\u5F39\u7A97\uFF08\u601D\u8003 + \u5DE5\u5177\uFF09\uFF1A\u622A\u56FE\u9762\u677F\u540C\u6B3E\u6846\u67B6 ==================
   \u4EE5\u524D\u662F\u8D34\u884C\u951A\u5B9A\u7684\u5C0F\u6C14\u6CE1\uFF08480px + JS \u5B9E\u65F6\u5B9A\u4F4D + \u5C3E\u5DF4\u4E09\u89D2\uFF09\uFF1B\u73B0\u6539\u5C45\u4E2D\u5BF9\u8BDD\u6846\uFF1A
   body \u7EA7\u6302\u8F7D + \u906E\u7F69 + \u8FDB\u51FA\u573A\u8D70\u5171\u4EAB modal-animation\uFF08dsh-modal-slide/mask\uFF09\uFF0C
   \u5B9A\u4F4D/\u5C3E\u5DF4/\u81EA\u6551\u67E5\u627E\u4EE3\u7801\u4E00\u5E76\u5220\u9664\u3002\u6CE8\u610F\u5C45\u4E2D\u7528 inset + margin:auto\uFF0C\u4E0D\u7528
   translate(-50%,-50%)\u2014\u2014\u5426\u5219\u4F1A\u88AB\u6ED1\u5165\u6ED1\u51FA\u52A8\u753B\u7684 transform \u8986\u76D6\u5BFC\u81F4\u8DF3\u4F4D\u3002 */
.dts__dialog-mask {
  position: fixed;
  inset: 0;
  z-index: 9989;
  background: var(--dsw-alias-bg-mask-1, rgba(0, 0, 0, .45));
}

/* \u8FDB\u51FA\u573A\u653E\u6162\uFF1A\u906E\u7F69\u4E0E\u7A97\u53E3\u7EDF\u4E00 420ms\uFF08\u5171\u4EAB modal-animation \u9ED8\u8BA4 240ms \u592A\u8D76\uFF0C
   \u53EA\u6539\u672C\u5F39\u7A97\uFF0C\u4E0D\u52A8\u622A\u56FE\u9762\u677F\u7B49\u5176\u4ED6\u5171\u7528\u65B9\uFF09\u3002 */
.dts__dialog-mask.dsh-modal-mask-in,
.dts__dialog-mask.dsh-modal-mask-out {
  animation-duration: 420ms;
}

.dts__dialog.dsh-modal-slide-in,
.dts__dialog.dsh-modal-slide-out {
  animation-duration: 420ms;
}

.dts__dialog {
  --dts-accent: var(--dsw-alias-state-business-primary, #4176e6);
  --dts-fill: var(--dsh-flow-veil, color-mix(in srgb, var(--dsw-alias-label-primary) 5%, transparent));
  --dts-fill-strong: color-mix(in srgb, var(--dsw-alias-label-primary) 8%, transparent);
  position: fixed;
  inset: 0;
  z-index: 9990;
  margin: auto;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  width: min(700px, calc(100vw - 48px));
  height: min(780px, calc(100vh - 96px));
  border: 1px solid var(--dsw-alias-border-l2, rgba(127,127,127,.22));
  border-radius: 14px;
  background: var(--dsw-alias-bg-layer-1, #fff);
  /* \u53BB\u5916\u9634\u5F71\uFF1A\u53EA\u7559\u8FB9\u6846\u5B9A\u754C\uFF0C\u906E\u7F69\u672C\u8EAB\u5DF2\u538B\u6697\u80CC\u666F\u3002 */
  box-shadow: none;
  overflow: hidden;
}

@media (max-width: 767.98px) {
  .dts__dialog {
    width: calc(100vw - 24px);
    height: calc(100vh - 48px);
  }
}

/* \u5FD9\u788C\u6807\u7B7E\u5FAE\u5149\uFF08\u4E0A\u6E38 think shimmer \u7684\u5355\u5C42\u7B49\u4EF7\uFF1A\u5E95\u8272\u5E38\u9A7B + 2s \u9AD8\u5149\u5E26\u626B\u8FC7\uFF1B
   \u4E0A\u6E38\u662F\u53CC\u5C42\u5B9E\u73B0\uFF0C\u8FD9\u91CC\u4E00\u5C42\u641E\u5B9A\uFF0C\u51CF\u5F31\u52A8\u6001/\u9AD8\u5BF9\u6BD4\u4E0B\u56DE\u5230\u7EAF\u8272\uFF09\u3002 */
@supports (background-clip: text) or (-webkit-background-clip: text) {
  .dts__process[data-running="true"] .dts__process-label {
    background-image: linear-gradient(90deg, var(--dts-accent, #4176e6) 0%, var(--dts-accent, #4176e6) 40%, var(--dsw-alias-label-primary) 50%, var(--dts-accent, #4176e6) 60%, var(--dts-accent, #4176e6) 100%);
    background-size: 400% 100%;
    background-repeat: no-repeat;
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
    -webkit-text-fill-color: transparent;
    animation: dts-think-shimmer 2s linear infinite;
  }
}

@keyframes dts-think-shimmer {
  0% { background-position: 100% 0; }
  100% { background-position: 0% 0; }
}

.dts__modal-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  flex-wrap: wrap;
  row-gap: 8px;
  padding: 13px 14px 13px 18px;
  border-bottom: 1px solid var(--dsw-alias-border-l3, rgba(127,127,127,.16));
}

.dts__modal-title {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: var(--dsw-alias-label-primary);
  font-size: 13px;
  font-weight: 600;
}

.dts__modal-title svg {
  color: var(--dts-accent);
}

.dts__modal-close {
  display: grid;
  place-items: center;
  flex: none;
  width: 26px;
  height: 26px;
  margin: 0;
  border: 0;
  padding: 0;
  border-radius: 50%;
  background: none;
  color: var(--dsw-alias-label-tertiary);
  cursor: pointer;
  font-size: 13px;
  line-height: 1;
  transition: background-color .15s ease, color .15s ease;
}

.dts__modal-close:hover {
  background: var(--dsw-alias-interactive-bg-hover, rgba(127,127,127,.12));
  color: var(--dsw-alias-label-primary);
}

/* \u5206\u533A\u9875\u7B7E\uFF08\u601D\u8003/\u5DE5\u5177\u90FD\u6709\u5185\u5BB9\u65F6\u624D\u51FA\u73B0\uFF09\uFF1A\u65E0\u5E95\u65E0\u6846\u4E0B\u5212\u7EBF\u5F0F\uFF0C\u9009\u4E2D\u6001\u4E00\u6761\u8D34\u5B57
   \u6A2A\u7EBF + left/width \u8FC7\u6E21\uFF0C\u6765\u56DE\u70B9\u51FB\u6A2A\u7EBF\u201C\u4F20\u9012\u201D\u8FC7\u53BB\u3002 */
.dts__tabs {
  position: relative;
  display: inline-flex;
  align-items: center;
  flex: none;
  gap: 2px;
  margin-left: auto;
  margin-right: 8px;
  border: 0;
  padding: 0 2px 5px;
  background: none;
}

.dts__tab {
  display: inline-flex;
  align-items: center;
  flex: none;
  gap: 5px;
  margin: 0;
  border: 0;
  padding: 2px 10px;
  background: none;
  color: var(--dsw-alias-label-secondary);
  cursor: pointer;
  font-size: 12px;
  font-variant-numeric: tabular-nums;
  line-height: 22px;
  white-space: nowrap;
  transition: color .15s ease;
}

.dts__tab:hover {
  color: var(--dsw-alias-label-primary);
}

.dts__tab[data-active="true"] {
  color: var(--dsw-alias-label-primary);
  font-weight: 600;
}

.dts__tab:focus-visible {
  outline: 2px solid color-mix(in srgb, var(--dts-accent) 55%, transparent);
  outline-offset: 1px;
}



.dts__modal-scroll {
  flex: 1 1 auto;
  min-height: 0;
  overflow-y: auto;
  padding: 16px 18px 22px;
  scrollbar-width: thin;
  scrollbar-color: var(--dsw-alias-scrollbar-bg-l2, rgba(127,127,127,.4)) transparent;
}

.dts__modal-scroll::-webkit-scrollbar {
  width: 4px;
  height: 4px;
}

.dts__modal-scroll::-webkit-scrollbar-track {
  background: transparent;
}

.dts__modal-scroll::-webkit-scrollbar-thumb {
  background: var(--dsw-alias-scrollbar-bg-l2, rgba(127,127,127,.4));
  border-radius: 2px;
}

.dts__modal-scroll::-webkit-scrollbar-thumb:hover {
  background: var(--dsw-alias-scrollbar-hover-l2, rgba(127,127,127,.6));
}

/* ---- \u4E24\u4E2A\u5206\u533A\uFF1A\u601D\u8003 / \u5DE5\u5177 ---- */
.dts__modal-panel {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.dts__modal-panel + .dts__modal-panel {
  margin-top: 18px;
  padding-top: 16px;
  border-top: 1px solid var(--dsw-alias-border-l3, rgba(127,127,127,.16));
}

.dts__modal-panel-head {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  font-weight: 600;
  color: var(--dsw-alias-label-primary);
}

.dts__modal-panel-title {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.dts__modal-panel-title svg {
  color: var(--dts-accent);
}

.dts__modal-panel-count {
  margin-left: auto;
  border-radius: 999px;
  padding: 0 8px;
  background: var(--dsw-alias-interactive-bg-hover, rgba(127,127,127,.12));
  color: var(--dsw-alias-label-secondary);
  font-size: 11px;
  font-weight: 600;
  line-height: 18px;
}

.dts__modal-panel-live {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-left: auto;
  border-radius: 999px;
  padding: 0 9px;
  background: color-mix(in srgb, var(--dts-accent) 12%, transparent);
  color: var(--dts-accent);
  font-size: 11px;
  font-weight: 600;
  line-height: 19px;
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
}

/* ---- \u601D\u8003\u6B63\u6587\uFF1A\u6309\u7C7B\u522B\u6210\u7EC4\uFF0C\u6BCF\u6761\u662F\u72EC\u7ACB\u5C0F\u5361 ---- */
.dts__modal-reasoning {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.dts__modal-reasoning-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.dts__modal-reasoning-group-title {
  display: inline-flex;
  align-self: flex-start;
  align-items: center;
  gap: 6px;
  border: 1px solid var(--dsw-alias-border-l3, rgba(127,127,127,.16));
  border-radius: 999px;
  padding: 0 10px;
  background: var(--dts-fill, rgba(127,127,127,.05));
  color: var(--dsw-alias-label-secondary);
  font-size: 12px;
  font-weight: 600;
  line-height: 22px;
}


.dts__modal-reasoning-item {
  border-left: 2px solid var(--dsw-alias-border-l2, rgba(127,127,127,.2));
  border-radius: 0 8px 8px 0;
  padding: 6px 12px;
  color: var(--dsw-alias-label-secondary);
  font-size: 13px;
  line-height: 22px;
  scroll-margin-top: 10px;
  transition: background-color .18s ease, border-color .18s ease;
}

.dts__modal-reasoning-item[data-active="true"] {
  border-left-color: var(--dts-accent);
  background: color-mix(in srgb, var(--dts-accent) 7%, transparent);
}

.dts__modal-reasoning-item[data-running="true"] {
  color: var(--dsw-alias-label-primary);
}

.dts__summary-errors {
  color: var(--dsw-alias-state-error-primary, #e5484d);
}

.dts__modal-reasoning-item-text {
  min-width: 0;
  flex: 1 1 auto;
  white-space: pre-wrap;
  word-break: break-word;
}

/* ---- \u5DE5\u5177\u603B\u7ED3\u5361\uFF08\u586B\u5145\u9762\uFF0C\u4E0E\u4E0B\u65B9\u8C03\u7528\u5217\u8868\u533A\u5206\uFF09---- */
.dts__summary {
  display: flex;
  flex-direction: column;
  gap: 8px;
  border-radius: 12px;
  padding: 12px 14px;
  background: var(--dts-fill-strong, rgba(127,127,127,.07));
}

.dts__summary-title {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: var(--dsw-alias-label-primary);
  font-size: 12px;
  font-weight: 600;
}

.dts__summary-title svg {
  color: var(--dts-accent);
}

.dts__summary-line {
  color: var(--dsw-alias-label-secondary);
  font-size: 12px;
  line-height: 20px;
}

.dts__summary-line b {
  color: var(--dsw-alias-label-primary);
  font-weight: 600;
}

.dts__chips,
.dts__files {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
}

.dts__chip {
  border-radius: 999px;
  padding: 0 9px;
  background: var(--dsw-alias-interactive-bg-hover, rgba(127,127,127,.1));
  color: var(--dsw-alias-label-secondary);
  font-size: 11px;
  line-height: 20px;
  white-space: nowrap;
}

/* \u6D89\u53CA\u6587\u4EF6/URL pill\uFF1A\u4E2D\u6027\u4E3B\u9898\u8272\uFF08\u4E0D\u518D\u6574\u7247\u54C1\u724C\u84DD\uFF09\uFF0CURL \u53BB\u67E5\u8BE2\u540E\u4ECD\u53EF\u80FD\u957F\uFF0C
   max-width + ellipsis \u515C\u5E95\uFF0C\u7EDD\u4E0D\u8D8A\u51FA\u603B\u7ED3\u5361\u3002 */
.dts__file {
  box-sizing: border-box;
  margin: 0;
  min-width: 0;
  max-width: 100%;
  border: 1px solid var(--dts-chip-border, var(--dsw-alias-border-l2, rgba(127,127,127,.22)));
  border-radius: 999px;
  padding: 0 9px;
  background: var(--dts-fill, rgba(127,127,127,.04));
  color: var(--dsw-alias-label-secondary);
  cursor: pointer;
  font-family: var(--ds-font-family-code, monospace);
  font-size: 11px;
  line-height: 20px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  transition: background-color .15s ease, border-color .15s ease, color .15s ease;
}

.dts__file:hover {
  border-color: var(--dsw-alias-border-l3, rgba(127,127,127,.34));
  background: var(--dsw-alias-interactive-bg-hover, rgba(127,127,127,.1));
  color: var(--dsw-alias-label-primary);
}

/* ---- \u8C03\u7528\u5217\u8868 ---- */
.dts__modal-tools {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

/* ===== \u5F39\u7A97\u5185\u5DE5\u5177\u5361\u7247\uFF1A\u56FE\u6807 + \u53D8\u4F53\u6807\u9898 + \u4E00\u884C\u6458\u8981 + \u9636\u6BB5\u5FBD\u6807 ============
   \u6807\u9898\u884C\u70B9\u6574\u884C\u5C55\u5F00\uFF1B\u5C55\u5F00\u540E\u662F\u53F0\u8D26 + \u7ED3\u679C/\u8F93\u5165/\u539F\u59CB\u6570\u636E\u9875\u7B7E\uFF1B\u5B50\u8C03\u7528\u6CBF\u5DE6\u5BFC\u8F68\u3002 */
.dts__tcall {
  display: flex;
  flex-direction: column;
  min-width: 0;
  border-radius: 10px;
  color: var(--dsw-alias-label-secondary);
}

.dts__trow {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  box-sizing: border-box;
  margin: 0;
  border: 0;
  border-radius: 10px;
  padding: 9px 10px;
  background: transparent;
  color: inherit;
  font: inherit;
  text-align: left;
  cursor: pointer;
}

.dts__trow:hover {
  background: var(--dsw-alias-interactive-bg-hover, rgba(127,127,127,.08));
}

.dts__trow:focus-visible {
  outline: 2px solid color-mix(in srgb, var(--dts-accent) 55%, transparent);
  outline-offset: 1px;
}

.dts__trow-icon {
  display: inline-flex;
  flex: none;
  color: var(--dsw-alias-label-tertiary);
}

.dts__tcall[data-state="error"] .dts__trow-icon {
  color: var(--dsw-alias-state-error-primary, #e5484d);
}

.dts__trow-main {
  display: flex;
  flex: 1 1 auto;
  align-items: baseline;
  gap: 8px;
  min-width: 0;
}

.dts__trow-title {
  flex: none;
  color: var(--dsw-alias-label-primary);
  font-size: 13px;
  font-weight: 600;
  line-height: 20px;
  white-space: nowrap;
}

.dts__trow-summary {
  flex: 1 1 auto;
  min-width: 0;
  overflow: hidden;
  color: var(--dsw-alias-label-tertiary);
  font-size: 12px;
  line-height: 20px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.dts__trow-time {
  flex: none;
  color: var(--dsw-alias-label-tertiary);
  font-size: 11px;
  font-variant-numeric: tabular-nums;
  line-height: 20px;
  white-space: nowrap;
}

.dts__trow-badge {
  flex: none;
  border-radius: 999px;
  padding: 1px 8px;
  font-size: 11px;
  font-weight: 600;
  line-height: 18px;
  white-space: nowrap;
}

.dts__trow-badge[data-phase="running"] {
  background: color-mix(in srgb, var(--dts-accent) 14%, transparent);
  color: var(--dts-accent);
}

.dts__trow-badge[data-phase="failed"] {
  background: color-mix(in srgb, var(--dsw-alias-state-error-primary, #e5484d) 12%, transparent);
  color: var(--dsw-alias-state-error-primary, #e5484d);
}

.dts__trow-badge[data-phase="interrupted"] {
  background: var(--dsw-alias-interactive-bg-hover, rgba(127,127,127,.1));
  color: var(--dsw-alias-label-secondary);
}

.dts__trow-go {
  display: inline-grid;
  flex: none;
  place-items: center;
  width: 24px;
  height: 24px;
  margin: 0;
  border: 0;
  border-radius: 6px;
  padding: 0;
  background: none;
  color: var(--dsw-alias-label-tertiary);
  cursor: pointer;
  /* \u5E73\u65F6\u9690\u85CF\uFF08\u907F\u514D\u4E0E\u6298\u53E0\u7BAD\u5934\u5E76\u6392\u6210\u201C\u53CC\u7BAD\u5934\u201D\uFF09\uFF1A\u60AC\u505C/\u805A\u7126/\u5C55\u5F00\u65F6\u51FA\u73B0\uFF0C\u539F\u751F\u884C\u540C\u6B3E\u3002 */
  opacity: 0;
  transition: opacity .15s ease, color .15s ease, background-color .15s ease;
}

.dts__trow:hover .dts__trow-go,
.dts__trow:focus-within .dts__trow-go,
.dts__trow-go:focus-visible,
.dts__tcall[data-expanded] .dts__trow-go {
  opacity: 1;
}

.dts__trow-go:hover {
  background: var(--dsw-alias-interactive-bg-hover, rgba(127,127,127,.14));
  color: var(--dts-accent);
}

.dts__trow-go:focus-visible {
  outline: 2px solid color-mix(in srgb, var(--dts-accent) 55%, transparent);
  outline-offset: 1px;
}

.dts__trow-chevron {
  flex: none;
  color: var(--dsw-alias-label-caption, #94a3b8);
  transform: rotate(-90deg);
  transition: transform .2s cubic-bezier(.22, 1, .36, 1);
}

.dts__trow-chevron[data-open] {
  transform: rotate(0);
}

.dts__tdetail {
  margin: 2px 0 4px 26px;
  border: 1px solid var(--dsw-alias-border-l2, rgba(127,127,127,.2));
  border-radius: 10px;
  background: var(--dsw-alias-bg-base, transparent);
  overflow: hidden;
}

.dts__tledger {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 4px 12px;
  padding: 10px 14px 0;
  color: var(--dsw-alias-label-secondary);
  font-size: 11px;
  font-variant-numeric: tabular-nums;
  line-height: 18px;
}

.dts__tengine {
  font-family: var(--ds-font-family-code, ui-monospace, SFMono-Regular, Menlo, monospace);
}

.dts__tprog {
  height: 3px;
  margin: 8px 14px 0;
  border-radius: 2px;
  background: var(--dsw-alias-interactive-bg-hover, rgba(127,127,127,.14));
  overflow: hidden;
}

.dts__tprog-fill {
  display: block;
  height: 100%;
  border-radius: 2px;
  background: var(--dts-accent);
  transition: width .3s ease;
}

.dts__ttabs {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 6px 10px 0;
}

.dts__ttabs > button {
  margin: 0;
  border: 0;
  border-bottom: 2px solid transparent;
  padding: 7px 10px 5px;
  background: none;
  color: var(--dsw-alias-label-secondary);
  cursor: pointer;
  font-size: 12px;
  line-height: 20px;
  white-space: nowrap;
  transition: color .15s ease, border-color .15s ease;
}

.dts__ttabs > button:hover {
  color: var(--dsw-alias-label-primary);
}

.dts__ttabs > button[aria-selected="true"] {
  border-bottom-color: var(--dts-accent);
  color: var(--dsw-alias-label-primary);
  font-weight: 600;
}

.dts__ttabs > button:focus-visible {
  outline: 2px solid color-mix(in srgb, var(--dts-accent) 55%, transparent);
  outline-offset: -1px;
}

.dts__tpanel {
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-width: 0;
  padding: 12px 14px 14px;
  font-size: 13px;
  line-height: 22px;
}

.dts__tpanel:focus-visible {
  outline: 2px solid color-mix(in srgb, var(--dts-accent) 55%, transparent);
  outline-offset: -3px;
}

.dts__tnote {
  margin: 0;
  color: var(--dsw-alias-label-secondary);
  font-size: 12px;
  line-height: 20px;
}

.dts__tdoc {
  min-width: 0;
  font-size: 13px;
  line-height: 22px;
}

.dts__traw-label {
  margin: 0;
  color: var(--dsw-alias-label-secondary);
  font-size: 12px;
  font-weight: 600;
  line-height: 20px;
}

.dts__traw {
  max-height: 320px;
  margin: 0;
  overflow: auto;
  border-radius: 8px;
  padding: 10px 12px;
  background: var(--dts-fill, rgba(127,127,127,.05));
  color: var(--dsw-alias-label-primary);
  font-family: var(--ds-font-family-code, ui-monospace, SFMono-Regular, Menlo, monospace);
  font-size: 12px;
  line-height: 20px;
  white-space: pre-wrap;
  overflow-wrap: anywhere;
  scrollbar-width: thin;
}

.dts__tall {
  color: var(--dsw-alias-label-secondary);
  font-size: 13px;
  line-height: 22px;
}

.dts__tall > summary {
  cursor: pointer;
  padding: 2px 0;
}

.dts__tsub {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin: 0 0 10px 22px;
  border-left: 1px solid var(--dsw-alias-border-l2, rgba(127,127,127,.2));
  padding-left: 12px;
}

.dts__drawer-call {
  display: flex;
  flex-direction: column;
  min-width: 0;
  border-radius: 10px;
}

.dts__row-time {
  flex: none;
  color: var(--dsw-alias-label-caption, #94a3b8);
  font-size: 11px;
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
}

.dts__row-time[data-running="true"] {
  color: var(--dts-accent, #4176e6);
}

/* \u8FD0\u884C\u4E2D\u7684\u4E0B\u8F7D/\u957F\u547D\u4EE4\uFF1A\u884C\u5185\u8FDB\u5EA6\u6761 + \u8D70\u79D2\u65F6\u949F\uFF0C\u957F\u4EFB\u52A1\u4E0D\u4F1A\u770B\u8D77\u6765\u5361\u6B7B\u3002 */
.dts__row-live {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  flex: none;
  color: var(--dts-accent, #4176e6);
  font-size: 11px;
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
}

.dts__empty {
  border-radius: 12px;
  padding: 18px;
  background: var(--dts-fill, rgba(127,127,127,.04));
  color: var(--dsw-alias-label-tertiary);
  font-size: 12px;
  text-align: center;
}

/* \u603B\u7ED3\u533A\u7684 chip \u7EE7\u627F\u6240\u5C5E\u5DE5\u5177\u7684 kind \u914D\u8272 */
.dts__chip[data-kind] {
  background: color-mix(in srgb, var(--dts-kind-color, #64748b) 13%, transparent);
  color: var(--dts-kind-color, #64748b);
}

/* per-kind \u914D\u8272\uFF08badge + chip \u5171\u7528\u540C\u4E00\u4E2A CSS \u53D8\u91CF\uFF09 */
.dts__chip[data-kind="git-push"] { --dts-kind-color: #a855f7; }
.dts__chip[data-kind="git-commit"] { --dts-kind-color: #22c55e; }
.dts__chip[data-kind="git-pull"] { --dts-kind-color: #3b82f6; }
.dts__chip[data-kind="git-clone"] { --dts-kind-color: #0ea5e9; }
.dts__chip[data-kind="git"] { --dts-kind-color: #16a34a; }
.dts__chip[data-kind="gh"] { --dts-kind-color: #8b5cf6; }
.dts__chip[data-kind="install"] { --dts-kind-color: #f97316; }
.dts__chip[data-kind="build"] { --dts-kind-color: #f59e0b; }
.dts__chip[data-kind="test"] { --dts-kind-color: #06b6d4; }
.dts__chip[data-kind="run"] { --dts-kind-color: #6366f1; }
.dts__chip[data-kind="read"] { --dts-kind-color: #64748b; }
.dts__chip[data-kind="write"] { --dts-kind-color: #10b981; }
.dts__chip[data-kind="edit"] { --dts-kind-color: #14b8a6; }
.dts__chip[data-kind="delete"] { --dts-kind-color: #ef4444; }
.dts__chip[data-kind="search"] { --dts-kind-color: #8b5cf6; }
.dts__chip[data-kind="fetch"] { --dts-kind-color: #0ea5e9; }
.dts__chip[data-kind="download"] { --dts-kind-color: #0ea5e9; }
.dts__chip[data-kind="browser"] { --dts-kind-color: #14b8a6; }
.dts__chip[data-kind="image"] { --dts-kind-color: #ec4899; }
.dts__chip[data-kind="vision"] { --dts-kind-color: #d946ef; }
.dts__chip[data-kind="memory"] { --dts-kind-color: #eab308; }
.dts__chip[data-kind="todo"] { --dts-kind-color: #84cc16; }
.dts__chip[data-kind="subagent"] { --dts-kind-color: #0ea5e9; }
.dts__chip[data-kind="question"] { --dts-kind-color: #f43f5e; }
.dts__chip[data-kind="command"] { --dts-kind-color: #94a3b8; }
.dts__chip[data-kind="other"] { --dts-kind-color: #94a3b8; }

/* ---- \u517C\u5BB9\u4FDD\u7559\uFF1A\u975E\u805A\u5408\u8DEF\u5F84\u7684\u5185\u8054\u5DE5\u5177\u7EC4\uFF08\u5F53\u524D\u672A\u6302\u8F7D\uFF0C\u914D\u8272\u5BF9\u9F50\u65B0\u8BED\u8A00\uFF09---- */
.dts__group {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border: 1px solid var(--dsw-alias-border-l2, rgba(127,127,127,.22));
  border-radius: 12px;
  background: var(--dsw-alias-bg-layer-1, transparent);
}

.dts__head {
  display: flex;
  align-items: center;
  gap: 8px;
  min-height: 32px;
  padding: 4px 12px;
  color: var(--dsw-alias-label-primary);
  cursor: pointer;
  user-select: none;
}

.dts__head:hover {
  background: var(--dsw-alias-interactive-bg-hover, rgba(127,127,127,.08));
}

.dts__head-icon {
  flex: none;
  font-size: 13px;
  line-height: 1;
}

.dts__head-title {
  flex: 0 1 auto;
  min-width: 0;
  overflow: hidden;
  font-size: 13px;
  font-weight: 500;
  line-height: 24px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.dts__head-running {
  color: var(--dsw-alias-state-business-primary);
}

.dts__head-errors {
  flex: none;
  border-radius: 999px;
  padding: 0 8px;
  background: color-mix(in srgb, var(--dsw-alias-state-error-primary, #e5484d) 14%, transparent);
  color: var(--dsw-alias-state-error-primary, #e5484d);
  font-size: 11px;
  line-height: 18px;
}

.dts__body {
  display: flex;
  flex-direction: column;
  border-top: 1px solid var(--dsw-alias-border-l3, rgba(127,127,127,.16));
}

.dts__tool-list {
  display: flex;
  flex-direction: column;
  padding: 4px 0;
}

.dts__generic {
  display: flex;
  align-items: baseline;
  gap: 8px;
  min-height: 28px;
  padding: 3px 4px;
  color: var(--dsw-alias-label-secondary);
  font-size: 12px;
}

.dts__generic-name {
  flex: none;
  color: var(--dsw-alias-label-primary);
  font-weight: 600;
}

.dts__generic-args {
  min-width: 0;
  overflow: hidden;
  color: var(--dsw-alias-label-tertiary);
  font-family: var(--ds-font-family-code, monospace);
  font-size: 11px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.dts__toggle {
  align-self: flex-start;
  margin: 2px 8px 8px;
  border: 0;
  border-radius: 999px;
  padding: 2px 10px;
  background: var(--dsw-alias-interactive-bg-hover, rgba(127,127,127,.1));
  color: var(--dsw-alias-label-secondary);
  cursor: pointer;
  font-size: 11px;
  line-height: 20px;
}

.dts__toggle:hover {
  color: var(--dsw-alias-label-primary);
}

/* \u2500\u2500 \u79FB\u52A8\u7AEF\uFF1A\u6D3B\u52A8\u5F39\u7A97\u5168\u5C4F\u3001\u5BF9\u8BDD\u6D41\u5185\u4E0B\u8F7D\u5361\u7247\u4E0D\u8BBE\u6700\u5C0F\u5BBD \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */
@media (max-width: 767.98px) {
  .dts__download-card{min-width:0}
}

/* \u2500\u2500 \u5C0A\u91CD\u7CFB\u7EDF\u300C\u51CF\u5C11\u52A8\u6001\u6548\u679C\u300D\uFF1A\u9AD8\u5149/\u547C\u5438/\u6ED1\u52A8\u52A8\u753B\u4E00\u5F8B\u505C \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */
@media (prefers-reduced-motion: reduce) {
  .dts__tab[data-active="true"]::after,
  .dts__process-chevron,
  .dts__progress::after,
  .dts__tprog-fill,
  .dts__trow-chevron,
  .dts__trow-go,
  .dts__dialog,
  .dts__dialog-mask,
  .dts__process[data-running="true"] .dts__process-label {
    animation: none;
    transition: none;
  }
  .dts__process[data-running="true"] .dts__process-label {
    color: var(--dts-accent);
    -webkit-text-fill-color: currentcolor;
  }
}

@media (forced-colors: active) {
  .dts__process[data-running="true"] .dts__process-label {
    animation: none;
    color: CanvasText;
    -webkit-text-fill-color: currentcolor;
  }
}

`;
function injectStyles() {
  if (typeof document === "undefined") return;
  const existing = document.getElementById("dsh-tool-summary-styles");
  if (existing !== null) {
    if (existing.textContent !== CSS) existing.textContent = CSS;
    return;
  }
  const style = document.createElement("style");
  style.id = "dsh-tool-summary-styles";
  style.textContent = CSS;
  document.head.appendChild(style);
}

// src/client/styles.ts
var CSS2 = `
/* \u7A7A\u767D\u69FD\u4F4D\u6298\u53E0\uFF1A\u805A\u5408\u540E\u5DE5\u5177/\u601D\u8003\u8282\u70B9\u7559\u4E0B\u7684\u7A7A [data-slot] \u4E0D\u518D\u4EA7\u751F\u7A7A\u767D\u6761\u3002 */
[data-chat-flow-key]:has(> [data-slot]:empty) {
  display: none;
}

/* \u2500\u2500 \u52A9\u624B\u6B63\u6587\u5BB9\u5668\uFF1A\u4E0E\u5B98\u65B9 AssistantMarkdown \u540C\u4E00\u5957\u5B57\u7EA7\u4E0E\u8282\u594F \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
   \u5B98\u65B9 MarkdownText \u81EA\u5E26\u6392\u7248\uFF0C\u8FD9\u91CC\u53EA\u8865\u5BB9\u5668\u5C42\uFF08\u5B57\u53F7\u8F74 + \u5757\u95F4 gap + \u5BBD\u8868\u5916\u6EA2\uFF09\u3002 */
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

/* \u5BBD\u8868\u5916\u6EA2\uFF08\u4E0E\u5B98\u65B9 .body :global(.md-table-wide) \u540C\u89C4\u5219\uFF09 */
.dtt__assistant-body :global(.md-table-wide) {
  --dsh-table-spare: max(0px, calc((100cqw - var(--dsh-chat-content-width)) / 2));
  --dsh-table-lead: calc(var(--dsh-table-spare) + min(var(--dsh-chat-content-width), 100cqw) - 100%);
  box-sizing: border-box;
  width: calc(100% + var(--dsh-table-lead) + var(--dsh-table-spare));
  max-width: none;
  margin-left: calc(-1 * var(--dsh-table-lead));
  padding-left: var(--dsh-table-lead);
}

/* \u4E2D\u65AD\u56DE\u5408\u7684\u6536\u5C3E\u6807\u8BB0\uFF08\u5B98\u65B9 .stopped \u540C\u6B3E\u9759\u9ED8\u5C0F\u7B7E\uFF09\u3002 */
.dtt__stopped {
  align-self: flex-start;
  border-radius: 6px;
  padding: 0 6px;
  background: var(--dsw-alias-interactive-bg-hover);
  color: var(--dsw-alias-label-tertiary);
  font-size: 11px;
  line-height: 18px;
}

/* \u2550\u2550 \u5BF9\u8BDD\u6D41\u5361\u7247\uFF08\u81EA webui flow-card \u79FB\u690D\uFF1B\u56DE\u5408\u7ED3\u675F\u540E\u624D\u51FA\u73B0\uFF09\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550
   --step\uFF1A\u56DE\u5408\u4E2D\u95F4\u7684\u5DF2\u5B8C\u6210\u7247\u6BB5\u3002\u5DE6\u4FA7\u4E00\u6761\u7AD6\u7EBF + \u6781\u6DE1\u7EB1\uFF0C\u5708\u51FA\u300C\u4E00\u6B65\u300D\u3002
   --reply\uFF1A\u56DE\u5408\u6700\u7EC8\u56DE\u590D\uFF08\u603B\u7ED3\u5361\uFF09\u3002\u63CF\u8FB9 + \u9876\u90E8\u9AD8\u5149 + \u5B8C\u6210\u6807\u8BB0\u4E0E\u7EDF\u8BA1 chip\u3002
   \u5171\u540C\u89C4\u5219\uFF1A\u8DDF\u968F\u6587\u5B57\u8272\u7684\u4E2D\u6027\u534A\u900F\u660E\u7EB1\uFF08\u6D45\u8272=\u6DE1\u9ED1\u3001\u6DF1\u8272=\u6DE1\u767D\uFF0C\u4E00\u6761\u89C4\u5219\u901A\u5403
   \u4E24\u4E2A\u4E3B\u9898\uFF09\u3002\u26A0 \u4E0D\u52A0 backdrop-filter\uFF1A\u6D88\u606F\u6D41\u91CC\u6BCF\u6761\u56DE\u590D\u90FD\u662F\u4E00\u5F20\u5361\uFF0C\u957F\u4F1A\u8BDD
   \u4E0B\u5927\u9762\u79EF\u6A21\u7CCA\u4F1A\u62D6\u57AE\u6EDA\u52A8\u6027\u80FD\u3002 */
.dtt__card {
  min-width: 0;
  border-radius: 14px;
  animation: dtt-card-in .48s cubic-bezier(.22, 1, .36, 1) both;
}

/* \u4E2D\u95F4\u6B65\u9AA4\uFF1A\u8F7B\u91CF\u7AD6\u7EBF\u5361 */
.dtt__card--step {
  display: flex;
  flex-direction: column;
  gap: 12px;
  border-left: 2px solid var(--dsw-alias-border-l2, rgba(127,127,127,.22));
  border-radius: 0 12px 12px 0;
  padding: 10px 14px;
  background: color-mix(in srgb, var(--dsw-alias-label-primary) 2.5%, transparent);
}

/* \u6700\u7EC8\u56DE\u590D\uFF1A\u603B\u7ED3\u5361 */
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

/* \u9876\u8FB9\u4E00\u6761\u54C1\u724C\u84DD\u6E10\u9690\u7EC6\u7EBF\uFF1A\u53EA\u5728\u603B\u7ED3\u5361\u51FA\u73B0\uFF0C\u4F5C\u4E3A\u300C\u672C\u8F6E\u6536\u5C3E\u300D\u7684\u89C6\u89C9\u951A\u70B9\u3002 */
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

/* \u5934\u90E8\uFF1A\u5B8C\u6210\u6807\u8BB0 + \u7EDF\u8BA1 chip \u884C */
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

/* \u5FBD\u7AE0\u91CC\u53EA\u7559\u5BF9\u52FE\u4E00\u7B14\u8BED\u4E49\u7EFF\uFF08\u4E2D\u65AD\u6001\u8DDF\u968F\u7425\u73C0\u8272\uFF09\u3002 */
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

/* \u65B9\u6848A\uFF1A\u6807\u7B7E\u5F31\u5316 + \u6570\u503C\u52A0\u5F3A + \u72B6\u6001\u5706\u70B9\uFF0C\u626B\u4E00\u773C\u5148\u770B\u5230\u6570\u5B57\u3002 */
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

/* \u2500\u2500 \u56DE\u5408\u8FC7\u7A0B\u884C\uFF08\u5B98\u65B9 turn-process \u884C\u540C\u6B3E\uFF0C\u89C1 .dtt__process\uFF09\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
   \u6574\u5BBD\u6587\u5B57\u6309\u94AE + \u5E95\u90E8\u53D1\u4E1D\u7EBF + \u5DE6\u6307 chevron\uFF08data-open \u65F6\u8F6C\u4E0B\u6765\uFF09\u3002
   --dtt-rea-accent \u53EA\u5728\u672C\u7EC4\u4EF6\u6839\u4E0A\u58F0\u660E\u4E00\u6B21\uFF0C\u5B50\u5143\u7D20\u7EE7\u627F\u3002 */
.dtt__reasoning {
  --dtt-rea-accent: var(--dsw-alias-state-business-primary, #4176e6);
  --dtt-rea-fill: var(--dsh-flow-veil, color-mix(in srgb, var(--dsw-alias-label-primary) 5%, transparent));
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 8px;
  max-width: 100%;
}

/* \u4E0E\u5B98\u65B9 TurnProcessNodeView.module.css \u9010\u9879\u4E00\u81F4\uFF08\u7C7B\u540D\u6362\u524D\u7F00\uFF09\uFF0C\u540C dts__process\u3002 */
.dtt__process {
  box-sizing: border-box;
  display: flex;
  align-items: center;
  width: 100%;
  min-width: 0;
  height: 33px;
  margin: 0;
  /* \u4E0E dts__process \u540C\u6B65\u7684\u4E0A\u4E0B\u5E73\u8861\u4FEE\u6B63\uFF1A\u5B98\u65B9 padding: 0 0 8px \u8BA9\u6587\u5B57\u8D34\u884C\u4E0A\u6CBF
     \uFF08\u5B9E\u6D4B\u4E0A 6px / \u4E0B\u5230\u53D1\u4E1D\u7EBF 14px\uFF09\u3002\u8FD9\u91CC\u5F52\u96F6\uFF0C\u884C\u76D2\u5728 32.5px \u5185\u5BB9\u533A\u5C45\u4E2D
     \uFF08\u4E0A\u4E0B\u5404 ~10px\uFF09\uFF1B\u884C\u603B\u9AD8\u4E0E margin-bottom \u4E0D\u53D8\uFF0C\u5360\u4F4D\u4E0E\u865A\u62DF\u5217\u8868\u90FD\u4E0D\u53D7\u5F71\u54CD\u3002 */
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
/* \u5B9E\u65F6\u9884\u89C8\u8F68\u9053\uFF1A\u5DE6\u4FA7\u4E00\u6761\u7AD6\u6761 + \u53F3\u4FA7\u5355\u89C6\u53E3\u6587\u672C\u6D41\uFF08\u65E0\u5361\u7247\u94EC\uFF09\u3002
 * \u5168\u90E8\u601D\u8003\u6BB5\u5171\u7528\u4E00\u4E2A\u6709\u754C\u89C6\u53E3\uFF0C\u65B0\u5185\u5BB9\u5728\u5E95\u90E8\u957F\u51FA\u6765\u3001\u89C6\u53E3\u5206\u6B65\u8DDF\u968F\u6EDA\u52A8\uFF0C
 * \u65E7\u884C\u4ECE\u9876\u90E8\u9010\u884C\u9876\u51FA\u88C1\u6389\u2014\u2014\u201C\u51FA\u6765\u4E00\u884C\u9876\u4E00\u884C\u201D\uFF0C\u4E0D\u518D\u6709\u6574\u5361\u6D88\u6563/\u5378\u8F7D\u3002 */
.dtt__reasoning-live-stack {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 0;
  min-width: 0;
  align-self: stretch;
}

/* \u56DE\u6536\u69FD\u4F4D\uFF1A\u6574\u8F68\u9AD8\u5EA6\u5408\u62E2\uFF08grid 0fr/1fr \u8FC7\u6E21\uFF09\uFF0C\u5185\u8F68\u8D1F\u8D23\u6DE1\u51FA\u4E0A\u6536\u3002 */
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

.dtt__live-slot > .dtt__reasoning-live-rail {
  min-height: 0;
}

/* \u65B0\u8F68\u5C55\u5F00\uFF1A\u6302\u8F7D\u5148\u584C\u7740\uFF0C\u4E0B\u4E00\u5E27\u5F20\u5F00\uFF08JS \u5207 data-open\uFF09\uFF0C\u9AD8\u5EA6 .45s\u3002 */
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

/* \u6574\u8F68\u56DE\u6536\u5408\u62E2\uFF1A\u6302\u8F7D\u5148\u6491\u7740\uFF0C\u4E0B\u4E00\u5E27\u584C\u6389\uFF1Bmargin \u4E5F\u6536\u5230 0\u3002 */
.dtt__live-slot[data-anim="collapse"][data-open="true"] {
  grid-template-rows: 1fr;
  opacity: 1;
}

.dtt__live-slot[data-anim="collapse"][data-open="false"] {
  grid-template-rows: 0fr;
  opacity: 0;
  margin-bottom: 0;
  transition: grid-template-rows .35s cubic-bezier(.22, 1, .36, 1), opacity .3s ease, margin-bottom .35s ease;
}

/* \u5B9E\u65F6\u9884\u89C8\u8F68\u9053\u672C\u4F53\uFF1A\u5DE6\u7AD6\u6761 + \u53F3\u6587\u672C\u6D41\uFF0C\u65E0\u63CF\u8FB9\u5361\u7247\u5E95\u8272\u3002 */
.dtt__reasoning-live-rail {
  display: flex;
  align-items: stretch;
  gap: 10px;
  min-width: 0;
  align-self: stretch;
}

.dtt__reasoning-live-rail-bar {
  flex: none;
  width: 3px;
  border-radius: 2px;
  background: color-mix(in srgb, var(--dsw-alias-state-business-primary, #4176e6) 55%, var(--dsw-alias-border-l2, rgba(127,127,127,.22)));
  opacity: .85;
}

/* \u8FD0\u884C\u4E2D\u7AD6\u6761\u547C\u5438\uFF08\u53EA\u52A8\u900F\u660E\u5EA6\uFF0C\u4E0D\u5360\u5E03\u5C40\uFF09\u3002 */
.dtt__reasoning-live-rail[data-running="true"] .dtt__reasoning-live-rail-bar {
  animation: dtt-rail-pulse 1.8s ease-in-out infinite;
}

@keyframes dtt-rail-pulse {
  0%, 100% { opacity: .55; }
  50% { opacity: 1; }
}

/* \u65B0\u6BB5\u6DE1\u5165\uFF1A\u6302\u8F7D\u5373\u64AD\uFF08\u540C key \u7684\u6D41\u5F0F\u8FFD\u52A0\u4E0D\u91CD\u6302\u3001\u4E0D\u91CD\u64AD\uFF09\u3002 */
.dtt__reasoning-live-seg {
  animation: dtt-seg-in .3s cubic-bezier(.22, 1, .36, 1) both;
}

@keyframes dtt-seg-in {
  from { opacity: 0; transform: translateY(6px); }
  to { opacity: 1; transform: none; }
}

/* \u5BF9\u8BDD\u7ED3\u675F\u5F00\u59CB\u603B\u7ED3\uFF1Aticker \u5F0F\u9010\u884C\u6ED1\u51FA\u2014\u2014\u89C6\u53E3\u9AD8\u5EA6\u9489\u4F4F\u4E0D\u52A8\uFF0C\u5185\u5C42\u5300\u901F\u4E0A\u79FB\uFF0C
   \u6BCF\u884C\u4F9D\u6B21\u7ECF\u8FC7\u89C6\u53E3\u518D\u4ECE\u9876\u90E8\u88C1\u6389\uFF08\u65F6\u957F\u884C\u5185\u6309\u6BB5\u6570\u7ED9\uFF0C\u4FDD\u8BC1\u6BCF\u884C\u9732\u8138\uFF09\uFF1B
   \u6ED1\u5B8C\u540E\u69FD\u4F4D\u518D\u5408\u62E2\u7A7A\u76D2\uFF08transition-delay \u4E0E\u6ED1\u51FA\u540C\u62CD\uFF0C\u89C1 live-stack.tsx\uFF09\u3002 */
.dtt__reasoning-live-rail[data-closing="true"] {
  pointer-events: none;
}

.dtt__reasoning-live-rail-view[data-reclaim="true"] {
  overflow: hidden;
  -webkit-mask-image: linear-gradient(transparent 0, black 28px, black calc(100% - 28px), transparent 100%);
  mask-image: linear-gradient(transparent 0, black 28px, black calc(100% - 28px), transparent 100%);
}

.dtt__reasoning-live-rail-inner[data-reclaim="true"] {
  animation-name: dtt-rail-scroll-out;
  animation-timing-function: linear;
  animation-fill-mode: both;
}

@keyframes dtt-rail-scroll-out {
  from { opacity: 1; transform: translateY(0); }
  80% { opacity: 1; }
  100% { opacity: 0; transform: translateY(-100%); }
}

/* \u56DE\u6536\u843D\u70B9\uFF1A\u8F68\u9053\u6ED1\u5B8C\u51B2\u7740 chip \u884C\u53BB\uFF0C\u884C\u5728\u843D\u5730\u65F6\u8F7B\u8DF3\u4E00\u4E0B\u201C\u63A5\u4F4F\u201D
  \uFF08transform \u4E0D\u5360\u5E03\u5C40\uFF0C\u53EA\u52A8\u89C6\u89C9\uFF1B\u65F6\u957F 1.2s\uFF0Cdip \u843D\u5728\u6ED1\u51FA\u5C3E\u6BB5\u9644\u8FD1\uFF09\u3002 */
.dtt__reasoning[data-reclaim="true"] .dtt__process,
.dts__entry-wrap[data-reclaim="true"] .dts__process {
  animation: dtt-chip-catch 1.2s cubic-bezier(.22, 1, .36, 1);
}

@keyframes dtt-chip-catch {
  0%, 78% { transform: translateY(0); }
  88% { transform: translateY(-4px); }
  100% { transform: translateY(0); }
}

/* \u2500\u2500 \u91CD\u8BD5\u884C\u5F71\u5B50\uFF08\u5B98\u65B9 model-retry \u884C\u540C\u6B3E\uFF0C\u7C7B\u540D\u6362\u524D\u7F00\uFF09\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
   \u6D41\u5F0F\u671F\u539F\u6837\u663E\u793A\uFF1B\u51FA\u603B\u7ED3\u5361\uFF08\u56DE\u5408 closed\uFF09\u65F6\u5F71\u5B50\u7EC4\u4EF6\u76F4\u63A5\u8FD4\u56DE null\uFF0C
   \u7A7A\u69FD\u4F4D\u7531\u65E2\u6709\u6298\u53E0\u89C4\u5219\u6536\u6389\uFF0C\u4E0D\u7559\u7A7A\u767D\u6761\u3002 */
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

/* \u5DF2\u5B8C\u6210\u7684\u65E7\u6BB5\u7565\u6536\u6DE1\u3002\u6BB5\u5934\u662F 11px \u9759\u9ED8\u5C0F\u5B57\uFF08\u601D\u8003 + \u6570\u5B57\u6807\u7B7E \xB7 \u8FDB\u884C\u4E2D/\u5DF2\u5B8C\u6210\uFF09\u3002 */
.dtt__reasoning-live-seg[data-running="false"] .dtt__reasoning-live-seg-text {
  opacity: .88;
}

.dtt__reasoning-live-seg-meta {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 2px;
  color: var(--dsw-alias-label-tertiary);
  font-size: 11px;
  line-height: 16px;
  font-variant-numeric: tabular-nums;
  overflow: hidden;
  white-space: nowrap;
}

.dtt__reasoning-live-seg-meta > span:last-child {
  overflow: hidden;
  text-overflow: ellipsis;
}

/* \u6BB5\u5E8F\u53F7\u6807\u7B7E\uFF1A\u5C0F pill\uFF0C\u8DD1\u7740\u7684\u90A3\u6BB5\u7528\u4E3B\u9898\u8272\u63D0\u4EAE\u3002 */
.dtt__reasoning-live-seg-tag {
  flex: none;
  box-sizing: border-box;
  min-width: 18px;
  height: 16px;
  padding: 0 5px;
  border-radius: 8px;
  background: color-mix(in srgb, var(--dsw-alias-label-tertiary, #888) 16%, transparent);
  color: var(--dsw-alias-label-secondary);
  font-size: 10px;
  line-height: 16px;
  text-align: center;
}

.dtt__reasoning-live-seg[data-running="true"] .dtt__reasoning-live-seg-tag {
  background: color-mix(in srgb, var(--dsw-alias-state-business-primary, #4176e6) 16%, transparent);
  color: var(--dsw-alias-state-business-primary, #4176e6);
}

/* \u6BB5\u95F4\u5206\u9694\uFF1A\u65E0\u5361\u7247\uFF0C\u7528\u53D1\u4E1D\u865A\u7EBF\u533A\u5206\u7B2C N \u6B21\u601D\u8003\u3002 */
.dtt__reasoning-live-seg + .dtt__reasoning-live-seg {
  margin-top: 8px;
  padding-top: 8px;
  border-top: 1px dashed var(--dsw-alias-border-l2, rgba(127,127,127,.22));
}

/* \u60AC\u6D6E\u8F68\u9053\uFF08\u7D27\u51D1\u6A21\u5F0F fixed \u5BB9\u5668\uFF09\u6536\u7D27\u89C6\u53E3\uFF0C\u4E0D\u81F3\u4E8E\u6491\u6EE1\u5C4F\u3002 */
.dtt__reasoning-live-stack[data-compact] .dtt__reasoning-live-rail-view {
  max-height: 220px;
}

/* \u5355\u89C6\u53E3\uFF1A\u5E73\u65F6 352px\uFF08\u7EA6\u4E24\u6BB5\u601D\u8003\uFF09\uFF0C\u8D85\u9AD8\u540E\u5185\u90E8\u6EDA\u52A8\u4E0A\u9876\uFF1B
   \u4E0A\u4E0B\u7F18\u6309\u6EDA\u52A8\u4F4D\u7F6E\u6E10\u9690\u3002 */
.dtt__reasoning-live-rail-view {
  flex: 1;
  min-width: 0;
  position: relative;
  max-height: 352px;
  overflow-y: auto;
  overscroll-behavior-y: contain;
  scroll-behavior: auto;
  overflow-anchor: none;
  border: 0;
  border-radius: 0;
  padding: 2px 4px 6px 0;
  background: transparent;
  scrollbar-width: thin;
  scrollbar-color: var(--dsw-alias-scrollbar-bg-l2, rgba(127,127,127,.4)) transparent;
}

.dtt__reasoning-live-rail-inner {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.dtt__reasoning-live-seg-text {
  color: var(--dsw-alias-label-secondary);
  font-size: 12px;
  line-height: 20px;
  white-space: pre-wrap;
  word-break: break-word;
}

.dtt__reasoning-live-rail-view[data-edges="both"],
.dtt__reasoning-live-rail[data-following][data-overflow] .dtt__reasoning-live-rail-view {
  -webkit-mask-image: linear-gradient(transparent 0, black 28px, black calc(100% - 28px), transparent 100%);
  mask-image: linear-gradient(transparent 0, black 28px, black calc(100% - 28px), transparent 100%);
}

.dtt__reasoning-live-rail-view[data-edges="top"] {
  -webkit-mask-image: linear-gradient(transparent 0, black 28px, black 100%);
  mask-image: linear-gradient(transparent 0, black 28px, black 100%);
}

.dtt__reasoning-live-rail-view[data-edges="bottom"] {
  -webkit-mask-image: linear-gradient(black 0, black calc(100% - 28px), transparent 100%);
  mask-image: linear-gradient(black 0, black calc(100% - 28px), transparent 100%);
}

.dtt__reasoning-live-rail-view:focus-visible {
  outline: 2px solid var(--dsw-alias-state-business-primary, #4176e6);
  outline-offset: -2px;
}

@media (forced-colors: active) {
  .dtt__reasoning-live-rail-view { -webkit-mask-image: none !important; mask-image: none !important; }
}

/* \u517C\u5BB9\u522B\u540D\uFF1A\u65E7\u5355\u5361\u7C7B\u540D\u5DF2\u4E0D\u518D\u6E32\u67D3\uFF0C\u6B8B\u7559 DOM\uFF08HMR \u95F4\u9699\uFF09\u6309\u65E0\u94EC\u6587\u672C\u515C\u5E95\u3002 */
.dtt__reasoning-live,
.dtt__reasoning-live-card {
  border: 0;
  border-radius: 0;
  background: transparent;
  box-shadow: none;
}

/* \u62BD\u5C49\u7684\u6D41\u5F0F\u60AC\u6D6E\u9884\u89C8\uFF08\u7D27\u51D1\u6A21\u5F0F control \u884C\u4E0B\u65B9\u6D6E\u5C42\uFF09\uFF1A\u8F68\u9053\u672C\u8EAB\u65E0\u5E95\uFF0C
   \u6D6E\u5C42\u5E95\u7531\u5916\u5C42\u5BB9\u5668\u7ED9\uFF0C\u4E0E\u89C6\u53E3\u89E3\u8026\u3002 */
.dtt__reasoning-live-rail.dts__preview {
  border: 1px solid var(--dsw-alias-border-l2, rgba(127,127,127,.22));
  border-radius: 12px;
  background: var(--dsw-alias-bg-layer-1, #fff);
  box-shadow: 0 8px 24px rgba(15, 17, 21, .18);
  padding: 10px 14px;
  z-index: 9991;
}

/* \u60AC\u6D6E\u5806\u53E0\u5BB9\u5668\uFF08fixed \u5B9A\u4F4D\u7531\u884C\u5185 style \u7ED9 top/left\uFF0C\u8FD9\u91CC\u53EA\u7BA1\u7EB5\u5411\u5806 + \u5C42\u7EA7 + \u5BBD\u5EA6\uFF09\u3002
   pointer-events:none\uFF1A\u60AC\u6D6E\u5C42\u76D6\u5728\u6B63\u6587\u884C\u4E4B\u4E0A\uFF0C\u5FC5\u987B\u70B9\u900F\uFF0C\u5426\u5219\u4F1A\u5403\u6389\u4E0B\u9762
   \u300C\u601D\u8003 / \u5DE5\u5177\u8C03\u7528\u300D\u884C\u7684\u70B9\u51FB\uFF08\u70B9\u4E86\u6CA1\u5F39\u7A97\uFF09\u3002\u4EE3\u4EF7\u662F\u60AC\u6D6E\u5361\u4E0D\u53EF\u6EDA\u52A8\uFF0C
   \u8981\u770B\u5168\u6587\u70B9\u884C\u8FDB\u62BD\u5C49\u2014\u2014\u60AC\u6D6E\u53EA\u662F transient \u9884\u89C8\uFF0C\u53EF\u63A5\u53D7\u3002 */
.dts__preview-stack {
  display: flex;
  flex-direction: column;
  gap: 8px;
  z-index: 9991;
  max-width: min(520px, calc(100vw - 32px));
  min-width: min(320px, calc(100vw - 32px));
  pointer-events: none;
}
.dts__preview-stack .dtt__reasoning-live-rail {
  background: var(--dsw-alias-bg-layer-1, #fff);
  box-shadow: 0 8px 24px rgba(15, 17, 21, .18);
  border-radius: 12px;
  padding: 10px 14px 10px 12px;
}

.dtt__reasoning-live-rail-view::-webkit-scrollbar {
  width: 4px;
  height: 4px;
}

.dtt__reasoning-live-rail-view::-webkit-scrollbar-track {
  background: transparent;
}

.dtt__reasoning-live-rail-view::-webkit-scrollbar-thumb {
  background: var(--dsw-alias-scrollbar-bg-l2, rgba(127,127,127,.4));
  border-radius: 2px;
}

.dtt__reasoning-live-rail-view::-webkit-scrollbar-thumb:hover {
  background: var(--dsw-alias-scrollbar-hover-l2, rgba(127,127,127,.6));
}

/* \u2550\u2550 \u79FB\u690D\u52A8\u6548\uFF08github:aa2246740/dsh-better-display\uFF0CMIT\uFF09\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550
   1) \u65B0\u6587\u5B57\u6DE1\u5165\uFF1A\u6D41\u5F0F\u671F\u65B0\u6302\u8F7D\u5757 opacity + blur \u67D4\u548C\u663E\u73B0\uFF08\u4E0A\u6E38 word-motion
      \u7684\u5757\u7EA7\u8FD1\u4F3C\u2014\u2014\u4E0A\u6E38\u9010\u5B57\u5F62\u505A motion\uFF0C\u8FD9\u91CC\u5B98\u65B9 MarkdownText \u6574\u5757\u6E32\u67D3\uFF0C
      \u53EA\u80FD\u505A\u5230\u65B0\u6302\u8F7D\u5757\u6DE1\u5165\uFF1B\u5DF2\u663E\u793A\u7684\u65E7\u8282\u70B9\u7EDD\u4E0D\u52A8\uFF09\u3002
   2) \u5FD9\u788C\u6807\u7B7E\u5FAE\u5149\uFF1A\u8FD0\u884C\u4E2D\u6587\u6848 2s \u9AD8\u5149\u5E26\u626B\u8FC7\uFF08\u4E0A\u6E38 think shimmer \u7684\u5355\u5C42
      \u7B49\u4EF7\uFF1A\u5E95\u8272\u5E38\u9A7B + \u5149\u5E26\uFF1B\u6570\u5B57\u4ECD\u7B49\u5BBD\uFF09\u3002 */
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

/* \u5C0A\u91CD\u7CFB\u7EDF\u300C\u51CF\u5C11\u52A8\u6001\u6548\u679C\u300D\u504F\u597D */
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
  .dtt__reasoning-live-seg,
  .dtt__reasoning-live-rail-inner[data-reclaim="true"],
  .dtt__reasoning-live-rail[data-running="true"] .dtt__reasoning-live-rail-bar { animation: none; }
  .dtt__reasoning[data-reclaim="true"] .dtt__process,
  .dts__entry-wrap[data-reclaim="true"] .dts__process { animation: none; }
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

/* \u2500\u2500 \u751F\u56FE\u753B\u5ECA\u6761\uFF08dgi__\uFF1ASummaryCard \u6B63\u6587\u533A\uFF0Cgenerate_image \u7ED3\u679C\uFF09\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
   \u9ED8\u8BA4\u5355\u56FE\uFF08\u4FDD\u6301\u539F\u6BD4\u4F8B\u3001\u2264360px\uFF09\uFF1Bstrip--multi \u65F6\u5E76\u6392\u7F29\u7565\u56FE\uFF084:3 \u88C1\u526A\u3001
   \u5E8F\u53F7\u89D2\u6807\uFF09\u3002\u70B9\u51FB\u5F39\u5168\u5C4F Lightbox\uFF08z-index 1200 \u4E3A\u4F1A\u8BDD\u7EA7\u906E\u7F69\u7EDF\u4E00\u503C\uFF09\u3002 */
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

/* \u591A\u56FE\u5E76\u6392\uFF1A\u5F39\u6027\u7F29\u7565\u56FE\uFF08\u653E\u4E0D\u4E0B\u81EA\u52A8\u6362\u884C\uFF09 */
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
  /* \u4E0D\u7528 backdrop-filter\uFF1A\u5168\u63D2\u4EF6\u53BB\u9AD8\u65AF\u6A21\u7CCA\uFF0C\u5E95\u8272\u52A0\u6DF1\u4FDD\u8BC1\u53EF\u8BFB\u3002 */
  background: rgba(10, 12, 16, .85);
  color: rgba(255, 255, 255, .92);
  font-size: 11px;
  line-height: 16px;
  font-variant-numeric: tabular-nums;
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
  /* \u4E0D\u7528 backdrop-filter\uFF1A\u5168\u63D2\u4EF6\u53BB\u9AD8\u65AF\u6A21\u7CCA\uFF0C\u5E95\u8272\u52A0\u6DF1\u4FDD\u8BC1\u53EF\u8BFB\u3002 */
  background: rgba(20, 24, 32, .92);
  color: rgba(255, 255, 255, .92);
  font-size: 12px;
  line-height: 18px;
  cursor: pointer;
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

/* \u7528\u6237\u8981\u6C42\uFF1A\u5BF9\u8BDD\u6D41\u5361\u7247\u53BB\u5168\u90E8\u5E95\u8272\u65E0\u8FB9\u6846\uFF08\u53EA\u7559\u9634\u5F71/\u6587\u5B57/\u52A8\u6548\uFF1Bhover \u53CD\u9988\u4FDD\u7559\uFF09\u3002 */
.dtt__card--step, .dtt__card--reply { background: transparent !important; }
/* \u8D85\u7EC6\u8FB9\u6761\uFF1A1px \u53D1\u4E1D\u63CF\u8FB9\uFF08\u6D45\u8272 l3 / \u6DF1\u8272\u767D 10%\uFF09\uFF0C\u9634\u5F71\u56DE\u5230 v0.4.7 \u7684\u8F7B\u6863\u3002 */
.dtt__card--reply { border: 1px solid var(--dsw-alias-border-l3, rgba(127,127,127,.16)) !important; }
.dtt__card--reply::before, .dtt__card--reply[data-interrupted]::before { display: none !important; }
.dtt__card--step { border: none !important; }
.dtt__card-chip { border-color: transparent !important; }
.dtt__card-chip:hover { border-color: color-mix(in srgb, var(--dsw-alias-state-business-primary, #4176e6) 45%, transparent) !important; }
.dtt__card-badge, .dtt__card-badge[data-interrupted] { background: transparent !important; }
.dtt__card-chip, .dtt__card-chip[data-kind="git"] { background: transparent !important; }
body[data-ds-dark-theme] .dtt__card--reply { box-shadow: 0 12px 32px rgba(0,0,0,.55) !important; border-color: rgba(255,255,255,.10) !important; }

/* \u2550\u2550 \u4F1A\u8BDD\u5934\u90E8\u89C6\u56FE\u6807\u7B7E\uFF08\u5BF9\u8BDD / \u8F68\u8FF9\uFF09\u79FB\u5230\u53F3\u4E0A\u89D2 \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550
   \u5B98\u65B9 ui-conversation \u628A tablist \u4F5C\u4E3A header \u7684\u7B2C\u4E8C\u4E2A\u5757\u7EA7\u5B50\u5143\u7D20\uFF0C\u72EC\u5360\u6807\u9898\u884C
   \u4E0B\u65B9\u4E00\u6574\u6761\uFF08header \u5B9E\u6D4B 76px\uFF09\u3002\u8FD9\u91CC\u628A header \u6539\u6210\u5355\u884C flex\uFF1A\u6807\u9898\u884C
   flex:1 1 auto + min-width:0 \u8D1F\u8D23\u6536\u7F29\u622A\u65AD\uFF0Ctablist flex:none \u9760 margin-left:auto
   \u9489\u5230\u53F3\u4E0A\u89D2\uFF0C\u4E0E\u6807\u9898\u5782\u76F4\u540C\u884C\uFF1Bheader \u6536\u56DE 45px\uFF0C\u7701\u4E0B\u7684 31px \u5168\u8FD8\u7ED9\u6B63\u6587\u3002
   \u9009\u62E9\u5668\u53EA\u7528\u7A33\u5B9A\u94A9\u5B50\uFF1Aheader \u6807\u7B7E\u3001role=tablist\u3001CSS Module \u7684 _titleRow /
   _tab \u540E\u7F00\uFF08\u524D\u7F00 wSkVaW_ \u662F\u6784\u5EFA hash\uFF0C\u4F1A\u53D8\uFF0C\u4E00\u5F8B\u4E0D\u5199\u6B7B\uFF09\u3002
   \u5355\u884C\u7EDF\u4E00\u9AD8\u5EA6 44px + \u5782\u76F4\u5C45\u4E2D\uFF0C\u4E0E\u684C\u9762\u58F3\u7A97\u53E3\u63A7\u5236\u6309\u94AE\u4E2D\u5FC3\u7EBF\uFF08y=22px\uFF09\u7CBE\u51C6\u5E73\u9F50\u3002 */
header:has(> [class*='_titleRow']) {
  display: flex;
  align-items: center;
  min-height: 44px;
  height: 44px;
  padding-top: 0;
  padding-bottom: 0;
  box-sizing: border-box;
}

header:has(> [role='tablist']) {
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

/* \u6807\u7B7E\u672C\u4F53\uFF1A\u4E0B\u5212\u7EBF\u6536\u56DE\u5230\u8D34\u7740\u6587\u5B57\uFF08\u5B98\u65B9 11px \u5E95\u886C\u662F\u7ED9\u6574\u884C\u8D34\u8FB9\u7528\u7684\uFF09\uFF0C
   hover \u63D0\u8272 + \u4E0B\u5212\u7EBF\u4ECE\u4E2D\u5FC3\u5C55\u5F00\uFF0C\u9009\u4E2D\u6001\u5E38\u9A7B\u84DD\u8272\u4E0B\u5212\u7EBF\u3002 */
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

/* \u2550\u2550 \u58F3\u7A97\u53E3\u63A7\u5236\uFF1A\u5168\u89C6\u53E3\u539F\u6837\u5448\u73B0\uFF08\u4E0D\u518D\u4E3A\u53F3\u4E0A\u89D2\u4FDD\u7559\u7559\u4F4D\u7A7A\u6863\uFF09 \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550 */
`;
function injectStyles2() {
  if (typeof document === "undefined") return;
  if (document.getElementById("dsh-chat-flow-styles") !== null) return;
  const style = document.createElement("style");
  style.id = "dsh-chat-flow-styles";
  style.textContent = CSS2;
  document.head.appendChild(style);
}
var injectGalleryStyles = injectStyles2;

// src/client/diagram/styles.ts
var CSS3 = [
  "/* \u5BB9\u5668\uFF1A\u603B\u7ED3\u5361\u6B63\u6587\u5185\u7684\u56FE\u7EB8\u5361\uFF0CSVG \u968F\u5BBD\u81EA\u9002\u5E94 */",
  ".dtt-diagram {",
  "  margin: 12px 0 4px;",
  "  border: 1px solid var(--dsw-alias-border-l2, rgba(127,127,127,.22));",
  "  border-radius: 12px;",
  "  padding: 16px 12px 8px;",
  "  background: var(--dsw-alias-bg-layer-1, rgba(127,127,127,.04));",
  "  animation: dtt-proto-rise .45s cubic-bezier(.2,.8,.25,1) both;",
  "}",
  ".dtt-diagram svg { display: block; width: 100%; height: auto; }",
  ".dtt-diagram--compact { padding: 10px 8px 4px; }",
  ".dtt-diagram { position: relative; }",
  ".dtt-diagram--large { overflow-x: auto; }",
  "/* \u7528\u6237\u8981\u6C42\uFF1A\u53BB\u5E95\u8272\uFF08\u6BD4\u4F8B\u5207\u6362\u5668\u662F\u63A7\u4EF6\uFF0C\u4FDD\u7559\uFF09\u3002 */",
  ".dtt-diagram { background: transparent !important; }",
  ".dtt-dg-scale { position: absolute; top: 8px; right: 8px; display: flex; gap: 2px; background: var(--dsw-alias-bg-layer-2, rgba(127,127,127,.12)); border-radius: 999px; padding: 2px; }",
  ".dtt-dg-scale-btn { border: 0; background: transparent; font-size: 11px; line-height: 20px; min-width: 24px; padding: 0 6px; border-radius: 999px; cursor: pointer; color: inherit; opacity: .6; font-family: inherit; transition: all .2s ease; }",
  ".dtt-dg-scale-btn:hover { opacity: 1; transform: translateY(-1px); }",
  ".dtt-dg-scale-btn--active { background: var(--dsw-alias-bg-layer-1, #fff); opacity: 1; font-weight: 700; box-shadow: 0 1px 6px rgba(20,40,90,.18); }",
  "@media (prefers-reduced-motion: reduce) { .dtt-diagram { animation: none; } }",
  ".dtt-diagram { border: 1px solid var(--dsw-alias-border-l3, rgba(127,127,127,.16)) !important; box-shadow: 0 8px 30px rgba(20,40,90,.07) !important; }",
  "body[data-ds-dark-theme] .dtt-diagram { border-color: rgba(255,255,255,.10) !important; box-shadow: 0 10px 30px rgba(0,0,0,.55) !important; }"
].join("\n");
function injectDiagramStyles() {
  if (typeof document === "undefined") return;
  if (document.getElementById("dsh-chat-flow-diagram-styles") !== null) return;
  const style = document.createElement("style");
  style.id = "dsh-chat-flow-diagram-styles";
  style.textContent = CSS3;
  document.head.appendChild(style);
}

// src/client/proto/styles.ts
var CSS4 = [
  "/* \u5BB9\u5668\uFF1A\u603B\u7ED3\u5361\u6B63\u6587\u5185\u7684\u72EC\u7ACB\u5361\u7247\uFF0C\u7559\u767D breathing room */",
  ".dtt-proto {",
  "  --dtp-accent: var(--dsw-alias-state-business-primary, #4176e6);",
  "  margin: 12px 0 4px;",
  "  border: 1px solid var(--dsw-alias-border-l2, rgba(127,127,127,.22));",
  "  border-radius: 16px;",
  "  padding: 16px 16px 12px;",
  "  background: var(--dsw-alias-bg-layer-1, rgba(127,127,127,.04));",
  "  animation: dtt-proto-rise .45s cubic-bezier(.2,.8,.25,1) both;",
  "}",
  "@keyframes dtt-proto-rise {",
  "  from { opacity: 0; transform: translateY(10px) }",
  "  to { opacity: 1; transform: none }",
  "}",
  ".dtt-proto__head {",
  "  display: flex; align-items: center; justify-content: space-between;",
  "  gap: 10px; flex-wrap: wrap;",
  "  padding-bottom: 12px; margin-bottom: 12px;",
  "  border-bottom: 1px solid var(--dsw-alias-border-l2, rgba(127,127,127,.18));",
  "}",
  ".dtt-proto__title { display: flex; align-items: center; gap: 8px; font-size: 12px; opacity: .65 }",
  ".dtt-proto__dot { width: 7px; height: 7px; border-radius: 50%; background: var(--dtp-accent); box-shadow: 0 0 0 4px color-mix(in srgb, var(--dtp-accent) 15%, transparent) }",
  ".dtt-proto__tabs { display: flex; gap: 6px; background: var(--dsw-alias-bg-layer-2, rgba(127,127,127,.09)); padding: 3px; border-radius: 999px; flex-wrap: wrap }",
  ".dtt-proto__tab { border: 0; background: transparent; font-size: 12px; padding: 6px 12px; border-radius: 999px; cursor: pointer; color: inherit; opacity: .65; font-family: inherit; transition: all .22s ease }",
  ".dtt-proto__tab:hover { opacity: 1; color: var(--dtp-accent); transform: translateY(-1px) }",
  ".dtt-proto__tab--active { background: var(--dsw-alias-bg-layer-1, #fff); opacity: 1; color: var(--dtp-accent); font-weight: 700; box-shadow: 0 2px 10px rgba(65,118,230,.20) }",
  ".dtt-proto__panel { animation: dtt-proto-fade .32s cubic-bezier(.2,.8,.25,1) both }",
  "@keyframes dtt-proto-fade {",
  "  from { opacity: 0; transform: translateY(8px) }",
  "  to { opacity: 1; transform: none }",
  "}",
  ".dtt-proto__heading { display: flex; align-items: center; gap: 8px; font-size: 12px; font-weight: 600; color: #4caf50; margin: 2px 0 10px }",
  '.dtt-proto__heading::before { content: ""; width: 6px; height: 6px; border-radius: 50%; background: currentColor }',
  "/* pill \u884C\uFF1Ahover \u4E0A\u6D6E + \u8F89\u5149 */",
  ".dtt-proto__pill { display: flex; align-items: center; gap: 10px; border: 1.5px solid color-mix(in srgb, var(--dtp-accent) 25%, transparent); border-radius: 999px; padding: 10px 14px; cursor: pointer; transition: all .25s ease }",
  ".dtt-proto__pill:hover { border-color: var(--dtp-accent); box-shadow: 0 6px 22px rgba(65,118,230,.18); transform: translateY(-1px) scale(1.004) }",
  ".dtt-proto__bulb { width: 30px; height: 30px; flex: none; border-radius: 50%; background: radial-gradient(circle at 35% 30%, color-mix(in srgb, var(--dtp-accent) 55%, #fff), color-mix(in srgb, var(--dtp-accent) 12%, transparent)) }",
  ".dtt-proto__tag { font-weight: 700; font-size: 12px; padding: 2px 9px; border-radius: 6px; white-space: nowrap; background: color-mix(in srgb, var(--dtp-accent) 13%, transparent); color: var(--dtp-accent) }",
  ".dtt-proto__tag--dark { background: rgba(147,197,253,.16); color: #93c5fd }",
  ".dtt-proto__desc { flex: 1; font-size: 12px; opacity: .65; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; min-width: 0 }",
  ".dtt-proto__desc--dark { color: #94a3b8; opacity: 1 }",
  ".dtt-proto__arrow { opacity: .4; transition: transform .25s ease }",
  ".dtt-proto__arrow--open { transform: rotate(90deg) }",
  ".dtt-proto__arrow--dark { color: #64748b; opacity: 1 }",
  ".dtt-proto__detail { margin-top: 10px; font-size: 12.5px; padding: 12px 14px; border-radius: 10px; border: 1px dashed color-mix(in srgb, var(--dtp-accent) 40%, transparent); background: color-mix(in srgb, var(--dtp-accent) 6%, transparent); animation: dtt-proto-fade .3s ease both }",
  "/* \u53EF\u5C55\u5F00\u5361\u7247 */",
  ".dtt-proto__expand { border: 1.5px solid color-mix(in srgb, var(--dtp-accent) 25%, transparent); border-radius: 13px; overflow: hidden; transition: all .25s ease }",
  ".dtt-proto__expand:hover { box-shadow: 0 8px 24px rgba(65,118,230,.15); transform: translateY(-2px) }",
  ".dtt-proto__expand-head { display: flex; align-items: center; gap: 10px; padding: 12px 14px; cursor: pointer }",
  ".dtt-proto__expand-body { padding: 2px 14px 14px; font-size: 12.5px; border-top: 1px dashed color-mix(in srgb, var(--dtp-accent) 30%, transparent); padding-top: 12px; margin: 0 14px 14px; padding-left: 0; padding-right: 0; animation: dtt-proto-fade .3s ease both }",
  "/* \u6D41\u5149 */",
  ".dtt-proto__glow { border-radius: 999px; padding: 2px; background: linear-gradient(110deg, #60a5fa, #a78bfa, #34d399, #60a5fa); background-size: 250% 100%; animation: dtt-proto-flow 4s linear infinite; cursor: pointer; transition: transform .25s ease }",
  ".dtt-proto__glow:hover { transform: translateY(-2px) scale(1.008) }",
  "@keyframes dtt-proto-flow { to { background-position: 250% 0 } }",
  ".dtt-proto__glow-inner { background: #0f172a; color: #e2e8f0; border-radius: 999px; padding: 10px 14px; display: flex; align-items: center; gap: 10px }",
  ".dtt-proto__spark { color: #fbbf24 }",
  "/* \u4E09\u5C0F\u5361 */",
  ".dtt-proto__minis { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin-top: 12px }",
  "@media (max-width: 560px) { .dtt-proto__minis { grid-template-columns: 1fr } }",
  ".dtt-proto__mini { border: 1px solid var(--dsw-alias-border-l2, rgba(127,127,127,.2)); border-radius: 10px; padding: 10px 12px; font-size: 12px; opacity: .9; transition: all .25s ease }",
  ".dtt-proto__mini:hover { transform: translateY(-3px) scale(1.015); box-shadow: 0 10px 24px rgba(65,118,230,.15); border-color: color-mix(in srgb, var(--dtp-accent) 45%, transparent) }",
  ".dtt-proto__mini b { display: block; color: var(--dtp-accent); font-size: 12.5px; margin-bottom: 2px }",
  ".dtt-proto__hint { font-size: 11px; opacity: .45; margin-top: 10px; text-align: center }",
  "/* \u7528\u6237\u8981\u6C42\uFF1A\u53BB\u5168\u90E8\u5E95\u8272\uFF08\u6D41\u5149\u63CF\u8FB9\u4E0E hover \u53CD\u9988\u4FDD\u7559\uFF09\u3002 */",
  ".dtt-proto, .dtt-proto__tabs, .dtt-proto__tab--active, .dtt-proto__tag, .dtt-proto__detail, .dtt-proto__expand, .dtt-proto__expand-body, .dtt-proto__mini, .dtt-proto__glow-inner { background: transparent !important; }",
  ".dtt-proto { border: 1px solid var(--dsw-alias-border-l3, rgba(127,127,127,.16)) !important; box-shadow: 0 8px 30px rgba(20,40,90,.07) !important; }",
  "body[data-ds-dark-theme] .dtt-proto { border-color: rgba(255,255,255,.10) !important; box-shadow: 0 10px 30px rgba(0,0,0,.55) !important; }",
  "@media (prefers-reduced-motion: reduce) {",
  "  .dtt-proto, .dtt-proto__panel, .dtt-proto__detail, .dtt-proto__expand-body { animation: none }",
  "  .dtt-proto__glow { animation: none }",
  "  .dtt-proto__tab, .dtt-proto__pill, .dtt-proto__expand, .dtt-proto__glow, .dtt-proto__mini { transition: none }",
  "}"
].join("\n");
function injectProtoStyles() {
  if (typeof document === "undefined") return;
  if (document.getElementById("dsh-chat-flow-proto-styles") !== null) return;
  const style = document.createElement("style");
  style.id = "dsh-chat-flow-proto-styles";
  style.textContent = CSS4;
  document.head.appendChild(style);
}

// src/client/download/styles.ts
var CSS5 = [
  "/* ===== download \u6D3B\u8FDB\u5EA6\u5361\u7247\uFF08\u5BF9\u8BDD\u6D41\u539F\u5B50\u884C + \u62BD\u5C49\u5171\u7528\uFF09================== */",
  ".dtt-dl__card {",
  "  --dts-accent: var(--dsw-alias-state-business-primary, #4176e6);",
  "  --dtt-dl-surface: var(--dsh-flow-veil, color-mix(in srgb, var(--dsw-alias-label-primary) 5%, transparent));",
  "  display: flex;",
  "  flex-direction: column;",
  "  gap: 6px;",
  "  min-width: 300px;",
  "  max-width: 560px;",
  "  margin: 4px 0;",
  "  padding: 10px 12px;",
  "  border: 1px solid color-mix(in srgb, var(--dts-accent) 24%, var(--dsw-alias-border-l2, rgba(127,127,127,.22)));",
  "  border-radius: 12px;",
  "  background: linear-gradient(180deg, color-mix(in srgb, var(--dts-accent) 8%, transparent), transparent 62%), var(--dtt-dl-surface);",
  "  box-shadow: 0 1px 3px rgba(15,17,21,.05);",
  "  animation: dtt-dl-rise .32s cubic-bezier(.2,.8,.25,1) both;",
  "  transition: border-color .2s ease, box-shadow .2s ease;",
  "}",
  '.dtt-dl__card[data-state="running"] {',
  "  border-color: color-mix(in srgb, var(--dts-accent) 38%, var(--dsw-alias-border-l2, rgba(127,127,127,.22)));",
  "  box-shadow: 0 2px 10px color-mix(in srgb, var(--dts-accent) 14%, rgba(15,17,21,.06));",
  "  animation: dtt-dl-rise .32s cubic-bezier(.2,.8,.25,1) both, dtt-dl-breathe 2.4s ease-in-out .4s infinite;",
  "}",
  '.dtt-dl__card[data-state="failed"], .dtt-dl__card[data-state="cancelled"] {',
  "  --dts-accent: var(--dsw-alias-state-error-primary, #e5484d);",
  "}",
  "@keyframes dtt-dl-rise { from { opacity: 0; transform: translateY(3px); } to { opacity: 1; transform: none; } }",
  "@keyframes dtt-dl-breathe { 0%, 100% { box-shadow: 0 2px 10px color-mix(in srgb, var(--dts-accent) 14%, rgba(15,17,21,.06)); } 50% { box-shadow: 0 2px 14px color-mix(in srgb, var(--dts-accent) 26%, rgba(15,17,21,.06)); } }",
  "",
  ".dtt-dl__head {",
  "  display: flex;",
  "  align-items: center;",
  "  gap: 7px;",
  "  min-width: 0;",
  "  color: var(--dts-accent);",
  "  font-size: 12px;",
  "  font-weight: 600;",
  "}",
  ".dtt-dl__head > svg { flex: none; }",
  ".dtt-dl__title {",
  "  min-width: 0;",
  "  overflow: hidden;",
  "  font-variant-numeric: tabular-nums;",
  "  text-overflow: ellipsis;",
  "  white-space: nowrap;",
  "}",
  ".dtt-dl__elapsed { color: var(--dsw-alias-label-tertiary); font-weight: 400; font-variant-numeric: tabular-nums; }",
  ".dtt-dl__stats {",
  "  display: inline-flex;",
  "  gap: 8px;",
  "  flex: none;",
  "  margin-left: auto;",
  "  color: var(--dsw-alias-label-secondary);",
  "  font-size: 11px;",
  "  font-weight: 400;",
  "  font-variant-numeric: tabular-nums;",
  "}",
  ".dtt-dl__speed { color: var(--dts-accent); }",
  "",
  ".dtt-dl__url {",
  "  min-width: 0;",
  "  overflow: hidden;",
  "  color: var(--dsw-alias-label-tertiary);",
  "  font-family: var(--ds-font-family-code, monospace);",
  "  font-size: 11px;",
  "  line-height: 17px;",
  "  text-overflow: ellipsis;",
  "  white-space: nowrap;",
  "}",
  "",
  "/* \u8F68\u9053\uFF1A\u786E\u5B9A\u6001=\u6BD4\u4F8B\u586B\u5145\uFF1B\u4E0D\u5B9A\u6001=\u6E38\u6807\u6ED1\u52A8\u3002 */",
  ".dtt-dl__track {",
  "  position: relative;",
  "  height: 5px;",
  "  overflow: hidden;",
  "  border-radius: 999px;",
  "  background: color-mix(in srgb, var(--dts-accent, #4176e6) 14%, var(--dsw-alias-interactive-bg-hover, rgba(127,127,127,.12)));",
  "}",
  ".dtt-dl__fill {",
  "  position: absolute;",
  "  top: 0;",
  "  bottom: 0;",
  "  left: 0;",
  "  border-radius: 999px;",
  "  background: linear-gradient(90deg, color-mix(in srgb, var(--dts-accent) 72%, transparent), var(--dts-accent));",
  "  transition: width .45s cubic-bezier(.25,.7,.3,1);",
  "}",
  ".dtt-dl__fill::after {",
  "  content: '';",
  "  position: absolute;",
  "  top: 0;",
  "  bottom: 0;",
  "  right: 0;",
  "  width: 26px;",
  "  background: linear-gradient(90deg, transparent, rgba(255,255,255,.55));",
  "  animation: dtt-dl-gleam 1.5s ease-in-out infinite;",
  "}",
  "@keyframes dtt-dl-gleam { 0%, 100% { opacity: .35; } 50% { opacity: 1; } }",
  ".dtt-dl__cursor {",
  "  position: absolute;",
  "  top: 0;",
  "  bottom: 0;",
  "  width: 42%;",
  "  border-radius: 999px;",
  "  background: linear-gradient(90deg, transparent, var(--dts-accent), transparent);",
  "  animation: dtt-dl-slide 1.15s cubic-bezier(.4, 0, .6, 1) infinite;",
  "}",
  "@keyframes dtt-dl-slide { from { left: -42%; } to { left: 100%; } }",
  "",
  ".dtt-dl__foot {",
  "  display: flex;",
  "  align-items: center;",
  "  gap: 8px;",
  "  min-width: 0;",
  "  font-size: 11px;",
  "  line-height: 17px;",
  "}",
  ".dtt-dl__pct { flex: none; color: var(--dts-accent); font-weight: 700; font-variant-numeric: tabular-nums; }",
  ".dtt-dl__eta { flex: none; color: var(--dsw-alias-label-tertiary); font-variant-numeric: tabular-nums; }",
  ".dtt-dl__dest {",
  "  min-width: 0;",
  "  overflow: hidden;",
  "  color: var(--dsw-alias-label-tertiary);",
  "  font-family: var(--ds-font-family-code, monospace);",
  "  text-overflow: ellipsis;",
  "  white-space: nowrap;",
  "}",
  ".dtt-dl__error { color: var(--dsw-alias-state-error-primary, #e5484d); }",
  ".dtt-dl__open {",
  "  flex: none;",
  "  margin-left: auto;",
  "  border: 1px solid var(--dsw-alias-border-l2, rgba(127,127,127,.22));",
  "  border-radius: 999px;",
  "  padding: 0 9px;",
  "  background: transparent;",
  "  color: var(--dsw-alias-label-secondary);",
  "  font-size: 11px;",
  "  line-height: 18px;",
  "  cursor: pointer;",
  "  transition: all .16s ease;",
  "}",
  ".dtt-dl__open:hover {",
  "  border-color: color-mix(in srgb, var(--dts-accent) 40%, transparent);",
  "  color: var(--dts-accent);",
  "  transform: translateY(-1px);",
  "  box-shadow: 0 2px 8px rgba(15,17,21,.08);",
  "}",
  "",
  "@media (prefers-reduced-motion: reduce) {",
  "  .dtt-dl__card, .dtt-dl__fill, .dtt-dl__fill::after, .dtt-dl__cursor, .dtt-dl__open { animation: none !important; transition: none !important; }",
  "}"
].join("\n");
function injectDownloadStyles() {
  if (typeof document === "undefined") return;
  if (document.getElementById("dsh-chat-flow-download-styles") !== null) return;
  const style = document.createElement("style");
  style.id = "dsh-chat-flow-download-styles";
  style.textContent = CSS5;
  document.head.appendChild(style);
}

// src/client/download/DownloadCard.tsx
var import_react = require("react");
var import_dsh_client_ui_primitives = require("@deepseek-ai/dsh-client-ui-primitives");

// src/client/tool-summary/tool-stats.ts
function callViewOf(block) {
  const view = block.callView;
  if (view === null || view === void 0) return null;
  return typeof view === "object" ? view : null;
}
var READONLY_TOOLS = /* @__PURE__ */ new Set([
  "read",
  "grep",
  "glob",
  "web_search",
  "web_fetch",
  "search",
  "ls",
  "find",
  "list"
]);
function callName(block) {
  return "kind" in block ? block.call?.name ?? "" : block.name;
}
function isRunning(block) {
  return !("kind" in block);
}
function argsPath(argsRaw) {
  if (argsRaw === "") return void 0;
  try {
    const parsed = JSON.parse(argsRaw);
    if (typeof parsed !== "object" || parsed === null) return void 0;
    const record = parsed;
    for (const key of [
      "TargetFile",
      "target_file",
      "targetFile",
      "file_path",
      "filePath",
      "path",
      "AbsolutePath",
      "absolute_path",
      "dir",
      "url"
    ]) {
      const value = record[key];
      if (typeof value === "string" && value !== "") return value;
    }
    return void 0;
  } catch {
    return void 0;
  }
}
function resultText(block) {
  if (!("kind" in block)) return "";
  const parts = [];
  for (const content of block.content) {
    const c = content;
    if (c.type === "text" && typeof c.text === "string") parts.push(c.text);
  }
  return parts.join("\n");
}
function computeStats(blocks) {
  const counts = /* @__PURE__ */ new Map();
  const files = /* @__PURE__ */ new Set();
  let total = 0;
  let running = 0;
  let errors = 0;
  let readOnly = 0;
  for (const block of blocks) {
    const name = callName(block);
    total += 1;
    counts.set(name, (counts.get(name) ?? 0) + 1);
    if (isRunning(block)) running += 1;
    else if (block.isError) errors += 1;
    if (READONLY_TOOLS.has(name)) readOnly += 1;
    const path = argsPath("kind" in block ? block.call?.argsRaw ?? "" : block.argsRaw);
    if (path !== void 0) files.add(path);
  }
  const byTool = [...counts.entries()].map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
  return { total, running, errors, byTool, files: [...files], readOnly };
}
function gitVerbOf(block) {
  if (callName(block).toLowerCase().includes("git")) return "git";
  const raw = "kind" in block ? block.call?.argsRaw ?? "" : block.argsRaw;
  if (typeof raw !== "string" || raw === "") return void 0;
  const match = /\bgit\s+([a-z-]+)/i.exec(raw);
  return match?.[1]?.toLowerCase();
}
function shortenPath(path, cwd) {
  if (cwd !== void 0 && cwd !== "") {
    const normPath = path.replace(/\\/g, "/");
    const normCwd = cwd.replace(/\\/g, "/").replace(/\/+$/, "");
    if (normPath.toLowerCase().startsWith(normCwd.toLowerCase())) {
      const rest = normPath.slice(normCwd.length).replace(/^\/+/, "");
      return rest === "" ? path : rest;
    }
  }
  return path;
}
function isUrlEntry(entry) {
  return /^https?:\/\//i.test(entry);
}
function shortenEntry(entry, cwd) {
  if (isUrlEntry(entry)) {
    try {
      const url = new URL(entry);
      const host = url.hostname.replace(/^www\./i, "");
      const pathname = url.pathname.replace(/^\/+|\/+$/g, "");
      return pathname === "" ? host : `${host}/${pathname}`;
    } catch {
    }
  }
  return shortenPath(entry, cwd);
}
function formatDuration(ms) {
  if (!Number.isFinite(ms) || ms < 0) return "--";
  const seconds = ms / 1e3;
  if (seconds < 1) return `${Math.round(ms)}ms`;
  if (seconds < 60) return `${seconds.toFixed(1)}s`;
  const minutes = Math.floor(seconds / 60);
  const rest = Math.round(seconds - minutes * 60);
  return `${minutes}m ${rest.toString().padStart(2, "0")}s`;
}
function callDurationMs(block, now) {
  if (isRunning(block)) return Math.max(0, (now ?? Date.now()) - block.time);
  if (block.callTime === null) return void 0;
  return Math.max(0, block.time - block.callTime);
}
var SHELL_DOWNLOAD_RE = /(?:^|[\s('"])(?:curl(?:\.exe)?|wget|aria2c)\b|Invoke-WebRequest|\biwr\b|Start-BitsTransfer|\bbitsadmin\b|WebClient|DownloadFile\s*\(/i;
function classifyActivity(block) {
  const name = callName(block);
  const raw = "kind" in block ? block.call?.argsRaw ?? "" : block.argsRaw;
  if (/download/i.test(name)) return "download";
  if (SHELL_DOWNLOAD_RE.test(raw)) return "download";
  const view = callViewOf(block);
  if (view !== null && view.card === "terminal") return "command";
  if (view !== null && view.card === "generic" && view.kind === "execute") return "command";
  if (/^(bash|sh|pwsh|powershell|cmd|zsh)$/i.test(name)) return "command";
  return "other";
}
function collectRunningCalls(block) {
  const out = [];
  const walk = (current) => {
    if (isRunning(current)) out.push(current);
    for (const child of current.subCalls) walk(child);
  };
  walk(block);
  return out;
}
function parseDownload(block) {
  const raw = "kind" in block ? block.call?.argsRaw ?? "" : block.argsRaw;
  if (raw === "") return void 0;
  if (!/download/i.test(callName(block)) && !SHELL_DOWNLOAD_RE.test(raw)) return void 0;
  let output = "";
  const out = /(?<![\w-])(?:--output-document|--output|-o|-O)(?![\w-])[=\s]+(?:"([^"]+)"|'([^']+)'|(\S+))/i.exec(raw);
  if (out !== null) output = out[1] ?? out[2] ?? out[3] ?? "";
  if (output === "") {
    const psOut = /(?<![\w-])-OutFile(?![\w-])[=\s]+(?:"([^"]+)"|'([^']+)'|(\S+))/i.exec(raw) ?? /-d[=\s]+(?:"([^"]+)"|'([^']+)'|(\S+))\s+(?:--out|-o)[=\s]+(?:"([^"]+)"|'([^']+)'|(\S+))/i.exec(raw);
    if (psOut !== null) {
      const first = psOut[1] ?? psOut[2] ?? psOut[3];
      const second = psOut[4] ?? psOut[5] ?? psOut[6];
      const dir = first !== void 0 && psOut[0].startsWith("-d") ? first : "";
      const file = psOut[0].startsWith("-d") ? second : first;
      output = dir !== "" && file !== void 0 ? joinDisplay(dir, file) : file ?? first ?? "";
    }
  }
  if (output === "") {
    const df = /DownloadFile\s*\(\s*[^,()]+,\s*(?:"([^"]+)"|'([^']+)'|([\w.:\\\/-]+))/i.exec(raw);
    if (df !== null) output = df[1] ?? df[2] ?? df[3] ?? "";
  }
  let url = "";
  const urls = raw.match(/https?:\/\/[^\s"']+/gi);
  if (urls !== null && urls.length > 0) url = urls[urls.length - 1] ?? "";
  if (url === "" && output === "") return void 0;
  return { url, output };
}
function joinDisplay(dir, file) {
  return dir.replace(/[\\/]+$/, "") + "\\" + file;
}

// src/client/download/DownloadCard.tsx
var import_jsx_runtime = require("react/jsx-runtime");
var NS = "dtt-dl";
function settledRatio(meta) {
  if (meta === null) return null;
  const bytes = typeof meta.bytes === "number" ? meta.bytes : void 0;
  const total = typeof meta.totalBytes === "number" && meta.totalBytes > 0 ? meta.totalBytes : void 0;
  if (bytes === void 0 || total === void 0) return null;
  return Math.min(1, bytes / total);
}
function formatBytes(n) {
  if (!Number.isFinite(n) || n < 0) return "?";
  if (n < 1024) return `${Math.round(n)} B`;
  if (n < 1024 ** 2) return `${(n / 1024).toFixed(1)} KB`;
  if (n < 1024 ** 3) return `${(n / 1024 ** 2).toFixed(1)} MB`;
  return `${(n / 1024 ** 3).toFixed(2)} GB`;
}
function formatSpeed(bps) {
  if (!Number.isFinite(bps) || bps <= 0) return "\u2014";
  return `${formatBytes(bps)}/s`;
}
function parseShellDownload(command) {
  let output = "";
  const psOut = /(?<![\w-])-OutFile(?![\w-])[=\s]+(?:"([^"]+)"|'([^']+)'|([^\s"]+))/i.exec(command);
  if (psOut !== null) output = psOut[1] ?? psOut[2] ?? psOut[3] ?? "";
  if (output === "") {
    const curlOut = /(?<![\w-])(?:--output-document|--output|-o|-O)(?![\w-])[=\s]+(?:"([^"]+)"|'([^']+)'|([^\s"]+))/i.exec(command);
    if (curlOut !== null) output = curlOut[1] ?? curlOut[2] ?? curlOut[3] ?? "";
  }
  if (output === "") {
    const df = /DownloadFile\s*\(\s*[^,()]+,\s*(?:"([^"]+)"|'([^']+)'|([\w.:\\\/-]+))/i.exec(command);
    if (df !== null) output = df[1] ?? df[2] ?? df[3] ?? "";
  }
  let url = "";
  const urls = command.match(/https?:\/\/[^\s"']+/gi);
  if (urls !== null && urls.length > 0) url = urls[urls.length - 1] ?? "";
  if (url === "" && output === "") return void 0;
  if (url === "" && !/(?:^|[\s('"])(?:curl(?:\.exe)?|wget|aria2c)\b|Invoke-WebRequest|\biwr\b|Start-BitsTransfer|\bbitsadmin\b|WebClient|DownloadFile\s*\(/i.test(command)) return void 0;
  return { url, output };
}
var LiveDownloadCard = (0, import_react.memo)(function LiveDownloadCard2({
  callId,
  url,
  startedAt,
  outputPath
}) {
  const [state, setState] = (0, import_react.useState)(null);
  const [now, setNow] = (0, import_react.useState)(() => Date.now());
  const aliveRef = (0, import_react.useRef)(true);
  const watchTriedRef = (0, import_react.useRef)(false);
  (0, import_react.useEffect)(() => {
    aliveRef.current = true;
    let timer = null;
    const tick = async () => {
      if (!aliveRef.current) return;
      try {
        const res = await fetch(`/api/chat-flow/download/progress?callId=${encodeURIComponent(callId)}`, { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          if (aliveRef.current) setState(data.download ?? null);
          if (data.download === null && outputPath !== void 0 && outputPath !== "" && !watchTriedRef.current) {
            watchTriedRef.current = true;
            void fetch("/api/chat-flow/download/watch", {
              method: "POST",
              headers: { "content-type": "application/json" },
              body: JSON.stringify({ callId, path: outputPath, url })
            }).catch(() => {
            });
          }
        }
      } catch {
      }
      if (aliveRef.current) timer = setTimeout(() => {
        void tick();
      }, 700);
    };
    void tick();
    const clock = setInterval(() => {
      if (aliveRef.current) setNow(Date.now());
    }, 500);
    return () => {
      aliveRef.current = false;
      if (timer !== null) clearTimeout(timer);
      clearInterval(clock);
    };
  }, [callId]);
  const elapsed = Math.max(0, now - startedAt);
  const total = state?.totalBytes ?? null;
  const received = state?.receivedBytes ?? 0;
  const ratio = total !== null && total > 0 ? Math.min(1, received / total) : null;
  const speed = state?.speedBps ?? 0;
  const eta = ratio !== null && speed > 0 && ratio < 1 ? Math.max(0, Math.round((1 - ratio) * total / speed)) : null;
  const status = state?.status ?? "running";
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: `${NS}__card`, "data-state": status, "data-determinate": ratio !== null || void 0, children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: `${NS}__head`, children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_dsh_client_ui_primitives.IconDownloadOutline16, { size: 14, "aria-hidden": true }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { className: `${NS}__title`, children: [
        status === "running" ? "\u4E0B\u8F7D\u4E2D" : status === "completed" ? "\u4E0B\u8F7D\u5B8C\u6210" : status === "cancelled" ? "\u5DF2\u53D6\u6D88" : "\u4E0B\u8F7D\u5931\u8D25",
        status === "running" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { className: `${NS}__elapsed`, children: [
          " \xB7 ",
          formatDuration(elapsed)
        ] })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { className: `${NS}__stats`, children: [
        speed > 0 && status === "running" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: `${NS}__speed`, children: formatSpeed(speed) }),
        total !== null && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { className: `${NS}__bytes`, children: [
          formatBytes(received),
          " / ",
          formatBytes(total)
        ] }),
        total === null && received > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: `${NS}__bytes`, children: formatBytes(received) })
      ] })
    ] }),
    url !== "" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: `${NS}__url`, title: url, children: url }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      "div",
      {
        className: `${NS}__track`,
        role: ratio !== null ? "progressbar" : void 0,
        "aria-valuenow": ratio !== null ? Math.round(ratio * 100) : void 0,
        "aria-valuemin": 0,
        "aria-valuemax": 100,
        children: ratio !== null ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: `${NS}__fill`, style: { width: `${Math.round(ratio * 100)}%` } }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: `${NS}__cursor` })
      }
    ),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: `${NS}__foot`, children: [
      ratio !== null && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { className: `${NS}__pct`, children: [
        Math.round(ratio * 100),
        "%"
      ] }),
      eta !== null && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { className: `${NS}__eta`, children: [
        "\u5269\u4F59\u7EA6 ",
        eta < 60 ? `${eta}s` : `${Math.floor(eta / 60)}m${(eta % 60).toString().padStart(2, "0")}s`
      ] }),
      status === "failed" && state?.error !== void 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: `${NS}__error`, children: state.error }),
      state?.dest !== void 0 && state.dest !== "" && (status === "completed" || status === "running") && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { className: `${NS}__dest`, title: state.dest, children: [
        "\u2192 ",
        state.dest
      ] })
    ] })
  ] });
});
var DownloadCard = (0, import_react.memo)(function DownloadCard2(props) {
  const { block, callId, openFile } = props;
  const running = !("kind" in block);
  if (running) {
    const raw = block.argsRaw;
    let url = "";
    let outputPath;
    try {
      const parsed = JSON.parse(raw);
      if (typeof parsed?.url === "string") url = parsed.url;
      if (typeof parsed?.dest === "string" && parsed.dest !== "") outputPath = parsed.dest;
      if (typeof parsed?.command === "string" && parsed.command !== "") {
        const shell = parseShellDownload(parsed.command);
        if (shell !== void 0) {
          if (shell.url !== "") url = shell.url;
          if (shell.output !== "") outputPath = shell.output;
        }
      }
    } catch {
    }
    return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LiveDownloadCard, { callId, url, startedAt: block.time, outputPath });
  }
  const meta = block.meta !== null && typeof block.meta === "object" ? block.meta : null;
  const isError = block.isError;
  const path = typeof meta?.path === "string" ? meta.path : null;
  const bytes = typeof meta?.bytes === "number" ? meta.bytes : null;
  const durationMs = typeof meta?.durationMs === "number" ? meta.durationMs : null;
  const ratio = settledRatio(meta);
  const text = block.content.map((part) => part.type === "text" && typeof part.text === "string" ? part.text : "").join("\n");
  const reveal2 = () => {
    if (path === null) return;
    openFile(path);
  };
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: `${NS}__card`, "data-state": isError ? "failed" : "completed", "data-determinate": ratio !== null || void 0, children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: `${NS}__head`, children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_dsh_client_ui_primitives.IconDownloadOutline16, { size: 14, "aria-hidden": true }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: `${NS}__title`, children: isError ? "\u4E0B\u8F7D\u5931\u8D25" : "\u4E0B\u8F7D\u5B8C\u6210" }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { className: `${NS}__stats`, children: [
        bytes !== null && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: `${NS}__bytes`, children: formatBytes(bytes) }),
        durationMs !== null && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { className: `${NS}__elapsed`, children: [
          " \xB7 ",
          formatDuration(durationMs)
        ] })
      ] })
    ] }),
    !isError && ratio !== null && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: `${NS}__track`, children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: `${NS}__fill`, style: { width: `${Math.round(ratio * 100)}%` } }) }),
    (path !== null || text !== "") && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: `${NS}__foot`, children: [
      path !== null && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { className: `${NS}__dest`, title: path, children: [
          "\u2192 ",
          path
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { type: "button", className: `${NS}__open`, onClick: reveal2, children: "\u6253\u5F00" })
      ] }),
      path === null && text !== "" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: `${NS}__error`, children: text.slice(0, 160) })
    ] })
  ] });
});

// src/client/tool-summary/activity-drawer.tsx
var import_react11 = require("react");
var import_client = require("react-dom/client");
var import_dsh_client_ui_primitives4 = require("@deepseek-ai/dsh-client-ui-primitives");

// src/client/tool-summary/activity-kind.ts
function kind(key, label) {
  return { key, label };
}
var K = {
  gitPush: kind("git-push", "\u63A8\u9001"),
  gitCommit: kind("git-commit", "\u63D0\u4EA4"),
  gitPull: kind("git-pull", "\u62C9\u53D6"),
  gitClone: kind("git-clone", "\u514B\u9686"),
  git: kind("git", "Git"),
  gh: kind("gh", "GitHub"),
  install: kind("install", "\u5B89\u88C5"),
  build: kind("build", "\u6784\u5EFA"),
  test: kind("test", "\u6D4B\u8BD5"),
  run: kind("run", "\u8FD0\u884C"),
  read: kind("read", "\u8BFB\u53D6"),
  write: kind("write", "\u5199\u5165"),
  edit: kind("edit", "\u7F16\u8F91"),
  delete: kind("delete", "\u5220\u9664"),
  search: kind("search", "\u641C\u7D22"),
  fetch: kind("fetch", "\u6293\u53D6"),
  download: kind("download", "\u4E0B\u8F7D"),
  browser: kind("browser", "\u6D4F\u89C8\u5668"),
  image: kind("image", "\u751F\u56FE"),
  vision: kind("vision", "\u8BC6\u56FE"),
  memory: kind("memory", "\u8BB0\u5FC6"),
  todo: kind("todo", "\u5F85\u529E"),
  subagent: kind("subagent", "\u5B50\u4EE3\u7406"),
  question: kind("question", "\u8BE2\u95EE"),
  command: kind("command", "\u547D\u4EE4"),
  other: kind("other", "\u5DE5\u5177")
};
var TOOL_BADGE = {
  read: K.read,
  write: K.write,
  edit: K.edit,
  grep: K.search,
  glob: K.search,
  search: K.search,
  web_search: K.search,
  web_fetch: K.fetch,
  generate_image: K.image,
  vision_describe: K.vision,
  todo_write: K.todo,
  ask_user_question: K.question,
  create_goal: K.todo,
  update_goal: K.todo,
  get_goal: K.todo,
  workflow: K.subagent,
  ralph: K.subagent,
  // Shell tools: when a command string is present it wins; these are the
  // fallback for an empty command.
  bash: K.command,
  sh: K.command,
  pwsh: K.command,
  powershell: K.command,
  cmd: K.command,
  zsh: K.command,
  fish: K.command
};
var GENERIC_KIND_BADGE = {
  read: K.read,
  edit: K.edit,
  delete: K.delete,
  move: K.edit,
  search: K.search,
  execute: K.command,
  fetch: K.fetch,
  other: K.other
};
function rawOf(block) {
  return "kind" in block ? block.call?.argsRaw ?? "" : block.argsRaw;
}
function nameOf(block) {
  return "kind" in block ? block.call?.name ?? "" : block.name;
}
function commandText(block) {
  const view = callViewOf(block);
  if (view !== null && view.card === "terminal") return view.title ?? "";
  const raw = rawOf(block);
  if (raw === "") return "";
  try {
    const parsed = JSON.parse(raw);
    if (typeof parsed !== "object" || parsed === null) return "";
    const command = parsed.command;
    return typeof command === "string" ? command : "";
  } catch {
    return "";
  }
}
function classifyToolName(name) {
  if (name === "") return void 0;
  const lower = name.toLowerCase();
  const exact = TOOL_BADGE[lower];
  if (exact !== void 0) return exact;
  if (lower.startsWith("browser")) return K.browser;
  if (lower.startsWith("memory")) return K.memory;
  if (lower.startsWith("subagent")) return K.subagent;
  return void 0;
}
function classifyCommand(text) {
  const cmd = text.trim().replace(/^[$>]\s*/, "");
  if (cmd === "") return K.command;
  let m = /^git\s+(\S+)/i.exec(cmd);
  if (m !== null) {
    const sub = (m[1] ?? "").toLowerCase();
    if (sub === "push") return K.gitPush;
    if (sub === "commit") return K.gitCommit;
    if (sub === "pull" || sub === "fetch") return K.gitPull;
    if (sub === "clone") return K.gitClone;
    return K.git;
  }
  if (/^gh\b/i.test(cmd)) return K.gh;
  m = /^(npm|pnpm|yarn|bun)\s+(\S+)/i.exec(cmd);
  if (m !== null) {
    const sub = (m[2] ?? "").toLowerCase();
    if (sub === "install" || sub === "i" || sub === "add") return K.install;
    if (sub === "remove" || sub === "uninstall" || sub === "rm") return K.install;
    if (sub === "build" || sub === "compile") return K.build;
    if (sub === "test" || sub === "t") return K.test;
    if (sub === "dev" || sub === "start" || sub === "serve" || sub === "preview") return K.run;
    if (sub === "run") {
      const rest = cmd.slice((m[0] ?? "").length);
      if (/\b(build|compile|bundle)\b/i.test(rest)) return K.build;
      if (/\b(test|vitest|jest|playwright|cypress|mocha)\b/i.test(rest)) return K.test;
      return K.run;
    }
    return K.command;
  }
  if (/^npx\b/i.test(cmd)) return K.run;
  if (/^(curl|wget)\b/i.test(cmd)) return K.download;
  if (/^(tsc|vite|webpack|esbuild|rollup|make|cmake|cargo|go|dotnet)\b/i.test(cmd)) {
    if (/\b(build|compile|bundle)\b/i.test(cmd)) return K.build;
    if (/\b(test)\b/i.test(cmd)) return K.test;
    return K.run;
  }
  if (/\b(build|compile|bundle|transpile)\b/i.test(cmd)) return K.build;
  if (/\b(vitest|jest|pytest|mocha|playwright|cypress)\b/i.test(cmd)) return K.test;
  if (/^(node|python|python3|tsx|ts-node|deno)\b/i.test(cmd)) return K.run;
  return K.command;
}
function classifyKind(block) {
  const command = commandText(block);
  if (command !== "") return classifyCommand(command);
  const byName = classifyToolName(nameOf(block));
  if (byName !== void 0) return byName;
  const view = callViewOf(block);
  if (view !== null) {
    if (view.card === "diff") return K.write;
    if (view.card === "generic" && view.kind !== void 0) {
      const mapped = GENERIC_KIND_BADGE[view.kind];
      if (mapped !== void 0) return mapped;
    }
  }
  return K.other;
}
function kindByToolName(blocks) {
  const map = /* @__PURE__ */ new Map();
  for (const block of blocks) {
    const name = nameOf(block);
    if (name === "" || map.has(name)) continue;
    map.set(name, classifyKind(block));
  }
  return map;
}

// src/client/tool-summary/icons.tsx
var import_jsx_runtime2 = require("react/jsx-runtime");
var ICONS = {
  "git-push": /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(import_jsx_runtime2.Fragment, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("path", { d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" }),
    /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("polyline", { points: "17 8 12 3 7 8" }),
    /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("line", { x1: "12", y1: "3", x2: "12", y2: "15" })
  ] }),
  "git-commit": /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(import_jsx_runtime2.Fragment, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("circle", { cx: "12", cy: "12", r: "3" }),
    /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("line", { x1: "3", y1: "12", x2: "9", y2: "12" }),
    /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("line", { x1: "15", y1: "12", x2: "21", y2: "12" })
  ] }),
  "git-pull": /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(import_jsx_runtime2.Fragment, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("path", { d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" }),
    /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("polyline", { points: "7 10 12 15 17 10" }),
    /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("line", { x1: "12", y1: "15", x2: "12", y2: "3" })
  ] }),
  "git-clone": /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(import_jsx_runtime2.Fragment, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("rect", { x: "8", y: "8", width: "14", height: "14", rx: "2" }),
    /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("path", { d: "M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" })
  ] }),
  git: /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(import_jsx_runtime2.Fragment, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("line", { x1: "6", y1: "3", x2: "6", y2: "15" }),
    /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("circle", { cx: "18", cy: "6", r: "3" }),
    /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("circle", { cx: "6", cy: "18", r: "3" }),
    /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("path", { d: "M18 9a9 9 0 0 1-9 9" })
  ] }),
  gh: /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(import_jsx_runtime2.Fragment, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("path", { d: "M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" }),
    /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("path", { d: "M9 18c-4.51 2-5-2-7-2" })
  ] }),
  install: /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(import_jsx_runtime2.Fragment, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("path", { d: "m7.5 4.27 9 5.15" }),
    /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("path", { d: "M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" }),
    /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("path", { d: "m3.3 7 8.7 5 8.7-5" }),
    /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("path", { d: "M12 22V12" })
  ] }),
  build: /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(import_jsx_runtime2.Fragment, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("path", { d: "m15 12-8.373 8.373a1 1 0 1 1-3-3L12 9" }),
    /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("path", { d: "m18 15 4-4" }),
    /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("path", { d: "m21.5 11.5-1.914-1.914A2 2 0 0 1 19 8.172V7l-2.26-2.26a6 6 0 0 0-4.202-1.756L9 2.96l.92.82A6.18 6.18 0 0 1 12 8.4V10l2 2h1.172a2 2 0 0 1 1.414.586L18.5 14.5" })
  ] }),
  test: /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(import_jsx_runtime2.Fragment, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("path", { d: "M10 2v7.527a2 2 0 0 1-.211.896L4.72 20.55a1 1 0 0 0 .9 1.45h12.76a1 1 0 0 0 .9-1.45l-5.069-10.127A2 2 0 0 1 14 9.527V2" }),
    /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("path", { d: "M8.5 2h7" }),
    /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("path", { d: "M7 16h10" })
  ] }),
  run: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("polygon", { points: "6 3 20 12 6 21 6 3" }),
  read: /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(import_jsx_runtime2.Fragment, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("path", { d: "M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" }),
    /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("path", { d: "M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" })
  ] }),
  write: /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(import_jsx_runtime2.Fragment, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("path", { d: "M12 20h9" }),
    /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("path", { d: "M16.376 3.622a1 1 0 0 1 3.002 3.002L7.368 18.635a2 2 0 0 1-.855.506l-2.872.838a.5.5 0 0 1-.62-.62l.838-2.872a2 2 0 0 1 .506-.854z" })
  ] }),
  edit: /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(import_jsx_runtime2.Fragment, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("path", { d: "M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" }),
    /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("path", { d: "m15 5 4 4" })
  ] }),
  delete: /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(import_jsx_runtime2.Fragment, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("path", { d: "M3 6h18" }),
    /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("path", { d: "M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" }),
    /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("path", { d: "M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" }),
    /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("line", { x1: "10", y1: "11", x2: "10", y2: "17" }),
    /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("line", { x1: "14", y1: "11", x2: "14", y2: "17" })
  ] }),
  search: /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(import_jsx_runtime2.Fragment, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("circle", { cx: "11", cy: "11", r: "8" }),
    /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("path", { d: "m21 21-4.3-4.3" })
  ] }),
  fetch: /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(import_jsx_runtime2.Fragment, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("circle", { cx: "12", cy: "12", r: "10" }),
    /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("path", { d: "M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" }),
    /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("path", { d: "M2 12h20" })
  ] }),
  download: /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(import_jsx_runtime2.Fragment, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("path", { d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" }),
    /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("polyline", { points: "7 10 12 15 17 10" }),
    /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("line", { x1: "12", y1: "15", x2: "12", y2: "3" })
  ] }),
  browser: /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(import_jsx_runtime2.Fragment, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("circle", { cx: "12", cy: "12", r: "10" }),
    /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("polygon", { points: "16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" })
  ] }),
  image: /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(import_jsx_runtime2.Fragment, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("rect", { x: "3", y: "3", width: "18", height: "18", rx: "2" }),
    /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("circle", { cx: "9", cy: "9", r: "2" }),
    /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("path", { d: "m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" })
  ] }),
  vision: /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(import_jsx_runtime2.Fragment, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("path", { d: "M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" }),
    /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("circle", { cx: "12", cy: "12", r: "3" })
  ] }),
  memory: /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(import_jsx_runtime2.Fragment, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("ellipse", { cx: "12", cy: "5", rx: "9", ry: "3" }),
    /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("path", { d: "M3 5V19A9 3 0 0 0 21 19V5" }),
    /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("path", { d: "M3 12A9 3 0 0 0 21 12" })
  ] }),
  todo: /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(import_jsx_runtime2.Fragment, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("path", { d: "m3 17 2 2 4-4" }),
    /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("path", { d: "m3 7 2 2 4-4" }),
    /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("path", { d: "M13 6h8" }),
    /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("path", { d: "M13 12h8" }),
    /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("path", { d: "M13 18h8" })
  ] }),
  subagent: /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(import_jsx_runtime2.Fragment, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("path", { d: "M12 8V4H8" }),
    /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("rect", { x: "4", y: "8", width: "16", height: "12", rx: "2" }),
    /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("path", { d: "M2 14h2" }),
    /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("path", { d: "M20 14h2" }),
    /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("path", { d: "M15 13v2" }),
    /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("path", { d: "M9 13v2" })
  ] }),
  question: /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(import_jsx_runtime2.Fragment, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("circle", { cx: "12", cy: "12", r: "10" }),
    /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("path", { d: "M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" }),
    /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("path", { d: "M12 17h.01" })
  ] }),
  command: /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(import_jsx_runtime2.Fragment, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("polyline", { points: "4 17 10 11 4 5" }),
    /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("line", { x1: "12", y1: "19", x2: "20", y2: "19" })
  ] }),
  other: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("path", { d: "M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" }),
  /* ── 思考分类（reasoning-classify 的 ReasoningIconKey）──────────────── */
  pen: /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(import_jsx_runtime2.Fragment, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("path", { d: "M12 20h9" }),
    /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("path", { d: "M16.376 3.622a1 1 0 0 1 3.002 3.002L7.368 18.635a2 2 0 0 1-.855.506l-2.872.838a.5.5 0 0 1-.62-.62l.838-2.872a2 2 0 0 1 .506-.854z" })
  ] }),
  "search-question": /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(import_jsx_runtime2.Fragment, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("circle", { cx: "11", cy: "11", r: "8" }),
    /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("path", { d: "m21 21-4.3-4.3" }),
    /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("path", { d: "M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" }),
    /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("path", { d: "M11.5 17h.01" })
  ] }),
  check: /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(import_jsx_runtime2.Fragment, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("circle", { cx: "12", cy: "12", r: "10" }),
    /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("path", { d: "m8.5 12.5 2.5 2.5 4.8-5.5" })
  ] }),
  clipboard: /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(import_jsx_runtime2.Fragment, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("rect", { x: "8", y: "2", width: "8", height: "4", rx: "1" }),
    /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("path", { d: "M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" }),
    /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("path", { d: "M9 12h6" }),
    /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("path", { d: "M9 16h4" })
  ] }),
  scales: /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(import_jsx_runtime2.Fragment, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("path", { d: "m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z" }),
    /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("path", { d: "m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z" }),
    /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("path", { d: "M7 21h10" }),
    /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("path", { d: "M12 3v18" }),
    /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("path", { d: "M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2" })
  ] }),
  note: /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(import_jsx_runtime2.Fragment, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("path", { d: "M4 4h16v12l-4 4H4z" }),
    /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("path", { d: "M16 20v-4h4" })
  ] }),
  chat: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(import_jsx_runtime2.Fragment, { children: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("path", { d: "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" }) })
};
function KindIcon({ kind: kind2, size = 14 }) {
  return /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
    "svg",
    {
      width: size,
      height: size,
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: 2,
      strokeLinecap: "round",
      strokeLinejoin: "round",
      "aria-hidden": "true",
      children: ICONS[kind2] ?? ICONS.other
    }
  );
}

// src/client/tool-summary/use-now.ts
var import_react2 = require("react");
function useNow(active, intervalMs = 1e3) {
  const [now, setNow] = (0, import_react2.useState)(() => Date.now());
  (0, import_react2.useEffect)(() => {
    if (!active) return;
    setNow(Date.now());
    const id = setInterval(() => {
      setNow(Date.now());
    }, intervalMs);
    return () => {
      clearInterval(id);
    };
  }, [active, intervalMs]);
  return now;
}

// src/client/tool-summary/reasoning-classify.ts
var CATEGORIES = [
  {
    label: "\u5B9E\u65BD\u7F16\u5199",
    icon: "pen",
    patterns: [
      /修改/,
      /写入/,
      /实现/,
      /编辑/,
      /创建/,
      /新增/,
      /构建/,
      /重写/,
      /重构/,
      /覆盖/,
      /调用(一?下)?工具|调用generate_image|调用\d+次/,
      /写(代码|文件|脚本|函数|组件|插件|一个|好|完|下)/,
      /建(文件|目录|项目|一个)/,
      /加入|添加/,
      /定义|声明/,
      /删除|清理/,
      /生成结果|产出/
    ]
  },
  {
    label: "\u539F\u56E0\u6392\u67E5",
    icon: "search-question",
    patterns: [
      /为什么/,
      /原因/,
      /这是因为/,
      /根本原因/,
      /导致/,
      /引发/,
      /起因/,
      /溯源/,
      /排查/,
      /诊断/,
      /定位问题/,
      /根因/,
      /为何/,
      /怎么会/,
      /哪里出(错|问题|问)/,
      /问题出在/,
      /报错|错误|异常/,
      /失败(了|原因)?/,
      /原因(是|在|何)/,
      /(找|查)(出|到|一下|一?个)?(原因|问题|根|源头)/,
      /解释一下/
    ]
  },
  {
    label: "\u9A8C\u8BC1\u786E\u8BA4",
    icon: "check",
    patterns: [
      /验证/,
      /确认(了|下)?/,
      /测试/,
      /试验/,
      /成功后|成功了/,
      /完美/,
      /生效/,
      /没问题/,
      /通过/,
      /结果[:：]|输出[:：]/,
      /运行结果/,
      /实测/,
      /工作正常/,
      /验证通过/
    ]
  },
  {
    label: "\u89C4\u5212\u65B9\u6848",
    icon: "clipboard",
    patterns: [
      /计划/,
      /方案/,
      /步骤/,
      /打算/,
      /思路/,
      /策略/,
      /规划/,
      /设计/,
      /着手/,
      /大致/,
      /拆分|分步/,
      /准备(先|要)?/,
      /接下来/,
      /先(写|建|看|试|做|处理)/,
      /应该(用|先|直接)/
    ]
  },
  {
    label: "\u51B3\u7B56\u6743\u8861",
    icon: "scales",
    patterns: [
      /选择/,
      /决定/,
      /权衡/,
      /考虑/,
      /或者/,
      /对比/,
      /倾向于/,
      /取舍/,
      /到底|究竟/,
      /两个(方案|选择)/
    ]
  },
  {
    label: "\u603B\u7ED3\u6C47\u62A5",
    icon: "note",
    patterns: [
      /总结/,
      /汇报/,
      /结论/,
      /提交/,
      /推送/,
      /上传/,
      /发布/,
      /收尾/,
      /搞定/,
      /完成(了|时)?|全部(完成|搞定)/,
      /完成情况/,
      /回顾/
    ]
  },
  {
    label: "\u63A2\u7D22\u5206\u6790",
    icon: "search",
    patterns: [
      /搜索/,
      /查找/,
      /看看/,
      /找找/,
      /检查/,
      /查看/,
      /寻找/,
      /定位/,
      /遍历/,
      /目录|结构/,
      /可能(在|是)?/,
      /在哪里/,
      /位置/,
      /配置|环境/,
      /是否|有无/,
      /没(有|看到|找到)/,
      /(更|更)广/,
      /排除/,
      /了解|认识/,
      /读(一下|取|文件|内容)/
    ]
  }
];
var FALLBACK = { label: "\u5176\u4ED6", icon: "chat" };
function classifyReasoning(text) {
  let best = FALLBACK;
  let bestScore = 0;
  for (const category of CATEGORIES) {
    let score = 0;
    for (const pattern of category.patterns) {
      const global = new RegExp(pattern.source, "g");
      const matches = text.match(global);
      if (matches !== null) score += matches.length;
    }
    if (score > bestScore) {
      best = { label: category.label, icon: category.icon };
      bestScore = score;
    }
  }
  return best;
}
function groupReasoning(items) {
  const order = [];
  const map = /* @__PURE__ */ new Map();
  for (const item of items) {
    const category = classifyReasoning(item.text);
    let list = map.get(category.label);
    if (list === void 0) {
      list = [];
      map.set(category.label, list);
      order.push(category);
    }
    list.push(item);
  }
  return order.map((category) => ({ category, items: map.get(category.label) ?? [] }));
}

// src/client/tool-summary/ToolGroupNodeView.tsx
var import_react8 = require("react");
var import_dsh_client_ui_primitives3 = require("@deepseek-ai/dsh-client-ui-primitives");

// src/client/tool-summary/activity-view-model.ts
var PHASE_LABEL = {
  running: "\u6267\u884C\u4E2D",
  returned: "\u5DF2\u8FD4\u56DE",
  succeeded: "\u5DF2\u5B8C\u6210",
  failed: "\u5931\u8D25",
  interrupted: "\u5DF2\u4E2D\u65AD"
};
function recordOf(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value) ? value : null;
}
function str(record, ...keys) {
  if (record === null) return void 0;
  for (const key of keys) {
    const value = record[key];
    if (typeof value === "string" && value !== "") return value;
  }
  return void 0;
}
function argFields(raw) {
  try {
    return recordOf(JSON.parse(raw)) ?? {};
  } catch {
    return {};
  }
}
function toolArgsRaw(block) {
  return "kind" in block ? block.call?.argsRaw ?? "" : block.argsRaw;
}
function classifyCategory(name) {
  if (/^(write|edit|apply_patch|patch|str_replace_editor)$/.test(name)) return "write";
  if (/^(read|read_file)$/.test(name)) return "read";
  if (/^(bash|shell|terminal|terminal_send|exec_command|pwsh)$/.test(name)) return "terminal";
  if (/^(grep|glob|find|search)$/.test(name)) return "search";
  if (/^(web_search|web_fetch|web_open)$/.test(name)) return "web";
  return "other";
}
function rowTitle(name, category) {
  if (name === "skill") return "Skill";
  if (name === "edit") return "Edit";
  if (name === "pwsh") return "Pwsh";
  if (category === "other") return name === "" ? "Tool call" : name;
  return category === "write" ? "Write" : category === "read" ? "Read" : category === "terminal" ? "Bash" : category === "search" ? "Search" : "Tool call";
}
function firstLine(text) {
  const nl = text.indexOf("\n");
  return nl === -1 ? text : text.slice(0, nl);
}
function rowSummary(name, category, args, raw) {
  const file = str(args, "file_path", "path", "filename", "filePath")?.split(/[/\\]/).at(-1);
  const command = str(args, "command", "cmd", "script");
  const description = str(args, "description");
  const query = str(args, "query", "pattern", "url");
  switch (category) {
    case "write":
      return file !== void 0 ? `${name === "write" ? "\u5199\u5165" : "\u4FEE\u6539"} ${file}` : name === "apply_patch" ? "\u4EE3\u7801\u8865\u4E01" : name;
    case "read":
      return file !== void 0 ? `\u8BFB\u53D6 ${file}` : query ?? name;
    case "terminal":
      return description ?? command ?? name;
    case "search":
      return name === "glob" ? "\u67E5\u627E\u6587\u4EF6" : query ?? name;
    case "web":
      return name === "web_search" ? "\u641C\u7D22\u7F51\u9875" : query ?? "\u8BFB\u53D6\u7F51\u9875";
    default: {
      if (name === "skill") {
        const skill = str(args, "name") ?? raw;
        return firstLine(skill);
      }
      const picked = str(args, "file_path", "path", "command", "url", "query", "pattern");
      if (picked !== void 0) return `${name} \xB7 ${firstLine(picked)}`;
      if (raw !== "") return firstLine(raw).slice(0, 80);
      return name === "" ? "\u5DE5\u5177\u8C03\u7528" : name;
    }
  }
}
function executionFacts(block) {
  if (!("kind" in block)) return {};
  const meta = recordOf(block.meta);
  const code = meta?.exitCode ?? meta?.exit_code;
  const text = block.content.length === 1 && typeof block.content[0]?.text === "string" ? block.content[0].text : "";
  const exit = /\n\[exit code: (\d+)\]$/.exec(text);
  const signal = /\n\[killed by signal: ([^\]\n]+)\]$/.exec(text);
  const parsed = exit?.[1] === void 0 ? void 0 : Number(exit[1]);
  return {
    exitCode: typeof code === "number" && Number.isFinite(code) ? code : parsed,
    signal: str(meta, "signal") ?? signal?.[1]
  };
}
function viewPhase(block) {
  if (isRunning(block)) return "running";
  if (block.error?.code === "ABORTED" || block.error?.code === "interrupted") return "interrupted";
  const facts = executionFacts(block);
  if (block.isError || facts.signal !== void 0 || facts.exitCode !== void 0 && facts.exitCode !== 0) return "failed";
  if (facts.exitCode === 0) return "succeeded";
  return "returned";
}
function resultParagraphs(block) {
  if (!("kind" in block)) return "";
  const parts = [];
  for (const content of block.content) {
    const c = content;
    if (c.type === "text" && typeof c.text === "string") parts.push(c.text);
  }
  return parts.join("\n");
}
function resultExtraCount(block) {
  if (!("kind" in block)) return 0;
  let count = 0;
  for (const content of block.content) {
    if (content.type !== "text") count += 1;
  }
  return count;
}
function rawResultJson(block) {
  if (!("kind" in block)) return "";
  try {
    return JSON.stringify({ content: block.content, isError: block.isError, meta: block.meta }, null, 2);
  } catch {
    return "";
  }
}
function readWindowLines(value) {
  if (!Array.isArray(value)) return null;
  const lines = [];
  for (const item of value) {
    const row = recordOf(item);
    if (typeof row?.number !== "number" || !Number.isInteger(row.number) || typeof row.text !== "string") return null;
    lines.push({ number: row.number, text: row.text });
  }
  return lines;
}
function readWindowOf(block) {
  if (!("kind" in block)) return null;
  const meta = recordOf(block.meta);
  const lines = readWindowLines(meta?.lines);
  if (typeof meta?.path !== "string" || typeof meta.totalLines !== "number" || lines === null) return null;
  return {
    path: meta.path,
    lang: typeof meta.lang === "string" ? meta.lang : void 0,
    lines,
    totalLines: meta.totalLines
  };
}
function diffHunksOf(block) {
  if (!("kind" in block)) return null;
  const value = recordOf(block.meta)?.diffs;
  if (!Array.isArray(value) || value.length === 0) return null;
  const diffs = [];
  for (const item of value) {
    const row = recordOf(item);
    if (typeof row?.path !== "string" || row.oldText !== null && typeof row.oldText !== "string" || typeof row.newText !== "string") return null;
    diffs.push({ path: row.path, oldText: row.oldText, newText: row.newText });
  }
  return diffs;
}
function searchViewOf(block) {
  if (!("kind" in block)) return null;
  const meta = recordOf(block.meta);
  if (typeof meta?.total !== "number" || typeof meta.truncated !== "boolean") return null;
  if (meta.shape === "paths" && Array.isArray(meta.paths) && meta.paths.every((path) => typeof path === "string")) {
    return { shape: "paths", paths: meta.paths, total: meta.total, truncated: meta.truncated };
  }
  if (meta.shape === "matches" && Array.isArray(meta.files)) {
    const files = [];
    for (const item of meta.files) {
      const row = recordOf(item);
      if (typeof row?.path !== "string" || !Array.isArray(row.matches)) return null;
      const matches = [];
      for (const m of row.matches) {
        const match = recordOf(m);
        if (typeof match?.lineNumber !== "number" || !Number.isInteger(match.lineNumber) || typeof match.line !== "string") return null;
        matches.push({ lineNumber: match.lineNumber, line: match.line });
      }
      files.push({ path: row.path, matches });
    }
    return { shape: "matches", files, total: meta.total, truncated: meta.truncated };
  }
  return null;
}
function webViewOf(name, block) {
  if (!("kind" in block)) return null;
  const meta = recordOf(block.meta);
  if (typeof meta?.truncated !== "boolean") return null;
  if (name === "web_fetch" && typeof meta.url === "string" && typeof meta.statusCode === "number") {
    return { shape: "fetch", url: meta.url, statusCode: meta.statusCode, truncated: meta.truncated };
  }
  if (name === "web_search" && Array.isArray(meta.sources)) {
    const sources = [];
    for (const item of meta.sources) {
      const source = recordOf(item);
      if (typeof source?.url !== "string") return null;
      sources.push({
        url: source.url,
        ...typeof source.title === "string" ? { title: source.title } : {},
        ...typeof source.snippet === "string" ? { snippet: source.snippet } : {},
        ...typeof source.publishedAt === "string" ? { publishedAt: source.publishedAt } : {}
      });
    }
    return {
      shape: "search",
      sources,
      truncated: meta.truncated,
      ...typeof meta.answer === "string" ? { answer: meta.answer } : {}
    };
  }
  return null;
}

// src/client/motion-utils.ts
var import_react3 = require("react");
var MOTION_EASING = "cubic-bezier(.22,1,.36,1)";
var EXPAND_MS = 260;
function useMotionAllowed(enabled) {
  const [reduced, setReduced] = (0, import_react3.useState)(() => {
    try {
      return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    } catch {
      return true;
    }
  });
  (0, import_react3.useEffect)(() => {
    try {
      const query = window.matchMedia("(prefers-reduced-motion: reduce)");
      const change = () => {
        setReduced(query.matches);
      };
      query.addEventListener("change", change);
      return () => query.removeEventListener("change", change);
    } catch {
      return void 0;
    }
  }, []);
  return enabled && !reduced;
}
function useSteppedFollow(text, running, _motion) {
  const ref = (0, import_react3.useRef)(null);
  const pinnedRef = (0, import_react3.useRef)(true);
  const followingRef = (0, import_react3.useRef)(true);
  const selectingRef = (0, import_react3.useRef)(false);
  const [edges, setEdges] = (0, import_react3.useState)("none");
  const [overflow, setOverflow] = (0, import_react3.useState)(false);
  const [following, setFollowingState] = (0, import_react3.useState)(true);
  const measure = () => {
    const el = ref.current;
    if (el === null) return;
    const max = Math.max(0, el.scrollHeight - el.clientHeight);
    setOverflow(el.scrollHeight > el.clientHeight + 1);
    const top = el.scrollTop > 1;
    const bottom = max - el.scrollTop > 1;
    setEdges(top ? bottom ? "both" : "top" : bottom ? "bottom" : "none");
  };
  const scrollToBottom = () => {
    const el = ref.current;
    if (el === null) return;
    el.scrollTop = el.scrollHeight;
    measure();
  };
  const setFollowing = (value) => {
    followingRef.current = value;
    pinnedRef.current = value;
    setFollowingState(value);
    if (value) {
      scrollToBottom();
    }
  };
  const onScroll = (event) => {
    const el = event.currentTarget;
    const distance = el.scrollHeight - el.scrollTop - el.clientHeight;
    const pinned = distance <= 24;
    pinnedRef.current = pinned;
    if (followingRef.current !== pinned) {
      followingRef.current = pinned;
      setFollowingState(pinned);
    }
    measure();
  };
  const onWheel = () => {
  };
  (0, import_react3.useEffect)(() => {
    const onSelection = () => {
      const el = ref.current;
      if (el === null) return;
      try {
        const selection = document.getSelection();
        const active = selection !== null && !selection.isCollapsed && selection.anchorNode !== null && el.contains(selection.anchorNode);
        selectingRef.current = active;
      } catch {
      }
    };
    document.addEventListener("selectionchange", onSelection);
    return () => document.removeEventListener("selectionchange", onSelection);
  }, []);
  (0, import_react3.useLayoutEffect)(() => {
    measure();
    if (!running || !pinnedRef.current || selectingRef.current) return;
    scrollToBottom();
  }, [text, running]);
  (0, import_react3.useEffect)(() => {
    const el = ref.current;
    if (el === null || typeof ResizeObserver === "undefined") return void 0;
    let rafId = 0;
    const ro = new ResizeObserver(() => {
      if (rafId !== 0) return;
      rafId = requestAnimationFrame(() => {
        rafId = 0;
        measure();
        if (!running || !pinnedRef.current || selectingRef.current) return;
        scrollToBottom();
      });
    });
    if (el.firstElementChild) {
      ro.observe(el.firstElementChild);
    }
    ro.observe(el);
    return () => {
      if (rafId !== 0) cancelAnimationFrame(rafId);
      ro.disconnect();
    };
  }, [running]);
  return { ref, onScroll, onWheel, edges, overflow, following, setFollowing };
}
function useHeightAnimation(open, motion) {
  const ref = (0, import_react3.useRef)(null);
  const running = (0, import_react3.useRef)(null);
  const previous = (0, import_react3.useRef)(open);
  const [present, setPresent] = (0, import_react3.useState)(open);
  (0, import_react3.useLayoutEffect)(() => {
    const el = ref.current;
    if (el === null) {
      if (open) setPresent(true);
      return;
    }
    const from = running.current !== null ? el.getBoundingClientRect().height : previous.current ? el.scrollHeight : 0;
    running.current?.cancel();
    running.current = null;
    const changed = previous.current !== open;
    previous.current = open;
    if (open) setPresent(true);
    el.style.height = open ? "auto" : "0px";
    el.style.overflow = open ? "" : "hidden";
    const target = open ? el.scrollHeight : 0;
    if (!motion || !changed || Math.abs(from - target) < 1) {
      setPresent(open);
      return;
    }
    try {
      const animation = el.animate(
        [{ height: `${from}px` }, { height: `${target}px` }],
        { duration: EXPAND_MS, easing: MOTION_EASING, fill: "both" }
      );
      running.current = animation;
      animation.onfinish = () => {
        if (running.current !== animation) return;
        running.current = null;
        animation.cancel();
        setPresent(open);
      };
    } catch {
      setPresent(open);
    }
  }, [open, motion, present]);
  (0, import_react3.useEffect)(() => () => {
    running.current?.cancel();
  }, []);
  return { ref, present };
}

// src/client/thinking/live-stack.tsx
var import_react4 = require("react");
var import_jsx_runtime3 = require("react/jsx-runtime");
var LIVE_RECLAIM_MS = 1100;
var LIVE_RECLAIM_COLLAPSE_MS = 350;
var LIVE_RECLAIM_UNMOUNT_MS = LIVE_RECLAIM_MS + LIVE_RECLAIM_COLLAPSE_MS + 220;
var RECLAIM_COLLAPSE_MS = LIVE_RECLAIM_COLLAPSE_MS;
function reclaimTiming(count, motion) {
  if (!motion) return { scroll: 0, collapse: 0 };
  const scroll = Math.min(1800, Math.max(800, 700 + count * 180));
  return { scroll, collapse: RECLAIM_COLLAPSE_MS };
}
var LiveSlot = (0, import_react4.memo)(function LiveSlot2({ anim, kind: kind2, delayMs, motion, children }) {
  const [open, setOpen] = (0, import_react4.useState)(anim === "collapse");
  (0, import_react4.useLayoutEffect)(() => {
    if (!motion) {
      setOpen(anim === "collapse" ? false : true);
      return void 0;
    }
    if (anim === "enter") {
      setOpen(false);
      const raf2 = requestAnimationFrame(() => {
        setOpen(true);
      });
      return () => {
        cancelAnimationFrame(raf2);
      };
    }
    setOpen(true);
    const raf = requestAnimationFrame(() => {
      setOpen(false);
    });
    return () => {
      cancelAnimationFrame(raf);
    };
  }, [anim, motion]);
  const delay = motion && delayMs !== void 0 && delayMs > 0 ? { transitionDelay: `${delayMs}ms` } : void 0;
  return /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
    "div",
    {
      className: "dtt__live-slot",
      "data-anim": anim,
      "data-kind": kind2,
      "data-open": open ? "true" : "false",
      style: delay,
      children
    }
  );
});
var LiveThinkingCard = (0, import_react4.memo)(function LiveThinkingCard2({ text, step, running = true, state, style }) {
  const dataState = state === "enter" || state === void 0 ? void 0 : state;
  return /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)(
    "div",
    {
      className: "dtt__reasoning-live-rail",
      "data-single": "true",
      "data-running": running ? "true" : "false",
      "data-state": dataState,
      style,
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("span", { className: "dtt__reasoning-live-rail-bar", "aria-hidden": true }),
        /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { className: "dtt__reasoning-live-rail-static", children: /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("section", { className: "dtt__reasoning-live-seg", "data-running": running ? "true" : "false", children: [
          /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { className: "dtt__reasoning-live-seg-meta", children: [
            /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("span", { children: "\u601D\u8003" }),
            /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("span", { className: "dtt__reasoning-live-seg-tag", children: step }),
            /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("span", { children: running ? " \xB7 \u8FDB\u884C\u4E2D" : " \xB7 \u5DF2\u5B8C\u6210" })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { className: "dtt__reasoning-live-seg-text", children: text })
        ] }) })
      ]
    }
  );
});
var RailSeg = (0, import_react4.memo)(function RailSeg2({ entry }) {
  return /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)(
    "section",
    {
      className: "dtt__reasoning-live-seg",
      "data-running": entry.item.running ? "true" : "false",
      "data-seg": entry.key,
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { className: "dtt__reasoning-live-seg-meta", children: [
          /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("span", { children: "\u601D\u8003" }),
          /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("span", { className: "dtt__reasoning-live-seg-tag", children: entry.item.step }),
          /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("span", { children: entry.item.running ? " \xB7 \u8FDB\u884C\u4E2D" : " \xB7 \u5DF2\u5B8C\u6210" })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { className: "dtt__reasoning-live-seg-text", children: entry.item.text })
      ]
    }
  );
});
var LiveThinkingStack = (0, import_react4.memo)(function LiveThinkingStack2({ items, closing, compact }) {
  const motion = useMotionAllowed(true);
  const entries = (0, import_react4.useMemo)(
    () => items.map((item, index) => ({ key: String(index), item })),
    [items]
  );
  const probe = (0, import_react4.useMemo)(
    () => items.map((item) => `${item.step}:${item.running ? "1" : "0"}:${item.text}`).join("\0"),
    [items]
  );
  const anyRunning = (0, import_react4.useMemo)(() => items.some((item) => item.running), [items]);
  const followActive = !closing;
  const { ref, onScroll, onWheel, edges, overflow, following, setFollowing } = useSteppedFollow(probe, followActive, motion);
  const [reclaim, setReclaim] = (0, import_react4.useState)(null);
  const timersRef = (0, import_react4.useRef)([]);
  (0, import_react4.useEffect)(() => () => {
    for (const id of timersRef.current) clearTimeout(id);
    timersRef.current = [];
  }, []);
  const later = (ms, fn) => {
    if (ms <= 0) {
      fn();
      return;
    }
    const id = setTimeout(() => {
      timersRef.current = timersRef.current.filter((other) => other !== id);
      fn();
    }, ms);
    timersRef.current = [...timersRef.current, id];
  };
  const closingRef = (0, import_react4.useRef)(closing);
  (0, import_react4.useLayoutEffect)(() => {
    const was = closingRef.current;
    closingRef.current = closing;
    if (!closing || was) return;
    if (reclaim !== null) return;
    if (entries.length === 0) return;
    setReclaim(entries);
    const timing = reclaimTiming(entries.length, motion);
    later(timing.scroll + timing.collapse + 30, () => {
      setReclaim(null);
    });
  }, [closing, entries, motion]);
  (0, import_react4.useEffect)(() => {
    if (!closing && items.length === 0 && reclaim !== null) setReclaim(null);
  }, [closing, items.length]);
  if (reclaim !== null) {
    if (reclaim.length === 0) return null;
    const timing = reclaimTiming(reclaim.length, motion);
    const innerStyle = motion && timing.scroll > 0 ? { animationDuration: `${timing.scroll}ms` } : void 0;
    return /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { className: "dtt__reasoning-live-stack", "data-closing": "true", "aria-live": "off", children: /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(LiveSlot, { anim: "collapse", kind: "reclaim", delayMs: timing.scroll, motion, children: /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)(
      "div",
      {
        className: "dtt__reasoning-live-rail",
        "data-closing": "true",
        "data-compact": compact || void 0,
        children: [
          /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("span", { className: "dtt__reasoning-live-rail-bar", "aria-hidden": true }),
          /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { className: "dtt__reasoning-live-rail-view", "data-reclaim": "true", children: /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
            "div",
            {
              className: "dtt__reasoning-live-rail-inner",
              "data-reclaim": "true",
              style: innerStyle,
              children: reclaim.map((entry) => /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(RailSeg, { entry }, entry.key))
            }
          ) })
        ]
      }
    ) }) });
  }
  if (closing) return null;
  if (entries.length === 0) return null;
  return /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { className: "dtt__reasoning-live-stack", "data-compact": compact || void 0, children: /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)(
    "div",
    {
      className: "dtt__reasoning-live-rail",
      "data-running": anyRunning ? "true" : "false",
      "data-compact": compact || void 0,
      "data-following": following && followActive ? true : void 0,
      "data-overflow": overflow || void 0,
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("span", { className: "dtt__reasoning-live-rail-bar", "aria-hidden": true }),
        /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
          "div",
          {
            className: "dtt__reasoning-live-rail-view",
            "data-edges": edges,
            ref,
            onScroll,
            onWheel,
            role: "region",
            "aria-label": anyRunning ? "\u6B63\u5728\u601D\u8003\uFF0C\u53EF\u6EDA\u52A8\u9605\u8BFB" : "\u5DF2\u5B8C\u6210\u7684\u601D\u8003\uFF0C\u53EF\u6EDA\u52A8\u9605\u8BFB",
            tabIndex: overflow ? 0 : void 0,
            "aria-live": anyRunning ? "polite" : "off",
            children: /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { className: "dtt__reasoning-live-rail-inner", children: entries.map((entry) => /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(RailSeg, { entry }, entry.key)) })
          }
        )
      ]
    }
  ) });
});

// src/client/tool-summary/TurnProcessShadowView.tsx
var import_react6 = require("react");
var import_dsh_client_ui_primitives2 = require("@deepseek-ai/dsh-client-ui-primitives");

// src/client/kr-chat/kr-chat-store.ts
var STORAGE_KEY_PANEL_OPEN = "dsh.kr_chat.panel_open";
var KrChatStore = class {
  constructor() {
    __publicField(this, "_panelOpen");
    __publicField(this, "_selectedTurn", null);
    __publicField(this, "_fullscreen", false);
    __publicField(this, "_activeTab", "kr");
    __publicField(this, "_cachedSnapshot", null);
    __publicField(this, "_listeners", /* @__PURE__ */ new Set());
    if (typeof localStorage !== "undefined") {
      try {
        const stored = localStorage.getItem(STORAGE_KEY_PANEL_OPEN);
        this._panelOpen = stored === null ? true : stored === "true";
      } catch {
        this._panelOpen = true;
      }
    } else {
      this._panelOpen = true;
    }
    this.updateSnapshot();
    this.syncBodyAttribute("kr");
  }
  get snapshot() {
    if (!this._cachedSnapshot) {
      this.updateSnapshot();
    }
    return this._cachedSnapshot;
  }
  updateSnapshot() {
    this._cachedSnapshot = {
      panelOpen: this._panelOpen,
      selectedTurn: this._selectedTurn,
      fullscreen: this._fullscreen,
      activeTab: this._activeTab
    };
  }
  setActiveTab(tab, force = false) {
    if (!force && this._activeTab === tab) {
      this.syncBodyAttribute(tab);
      return;
    }
    this._activeTab = tab;
    this.updateSnapshot();
    this.syncBodyAttribute(tab);
    this.notify();
  }
  syncBodyAttribute(tab) {
    if (typeof document !== "undefined") {
      const hasActiveChat = Boolean(
        document.querySelector('header [role="tablist"]') || document.querySelectorAll("[data-chat-turn]").length > 0
      );
      if (tab === "kr" && hasActiveChat) {
        document.body.setAttribute("data-dsh-kr-chat", "true");
      } else {
        document.body.removeAttribute("data-dsh-kr-chat");
      }
    }
  }
  setPanelOpen(open) {
    if (this._panelOpen === open) return;
    this._panelOpen = open;
    try {
      localStorage.setItem(STORAGE_KEY_PANEL_OPEN, String(open));
    } catch {
    }
    this.updateSnapshot();
    this.notify();
  }
  togglePanel() {
    this.setPanelOpen(!this._panelOpen);
  }
  setSelectedTurn(turn) {
    if (this._selectedTurn === turn) return;
    this._selectedTurn = turn;
    this.updateSnapshot();
    this.notify();
  }
  setFullscreen(fs) {
    if (this._fullscreen === fs) return;
    this._fullscreen = fs;
    this.updateSnapshot();
    this.notify();
  }
  toggleFullscreen() {
    this.setFullscreen(!this._fullscreen);
  }
  subscribe(listener) {
    this._listeners.add(listener);
    return () => {
      this._listeners.delete(listener);
    };
  }
  notify() {
    for (const listener of this._listeners) {
      try {
        listener();
      } catch (err) {
        console.error("[kr-chat-store] listener error", err);
      }
    }
  }
};
var storeInstance = null;
function getKrChatStore() {
  if (!storeInstance) {
    storeInstance = new KrChatStore();
  }
  return storeInstance;
}

// src/client/kr-chat/kr-todo-bridge.ts
var import_react5 = require("react");
var liveTodos = [];
var listeners = /* @__PURE__ */ new Set();
function getLiveDshTodos() {
  return liveTodos;
}
function setLiveDshTodos(todos) {
  liveTodos = Array.isArray(todos) ? todos : [];
  for (const fn of listeners) {
    try {
      fn();
    } catch {
    }
  }
}
if (typeof window !== "undefined") {
  window.__dshSetLiveTodos__ = setLiveDshTodos;
}
function clearLiveDshTodos() {
  liveTodos = [];
  for (const fn of listeners) {
    try {
      fn();
    } catch {
    }
  }
}
function subscribeLiveDshTodos(listener) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}
function KrTodoBridge(props) {
  const todos = props?.useProjection ? props.useProjection("todos") : null;
  const sessionId = typeof props?.sessionId === "string" ? props.sessionId : null;
  (0, import_react5.useEffect)(() => {
    setLatestChatSessionId(sessionId);
    return () => {
      if (getLatestChatSessionId() === sessionId) setLatestChatSessionId(null);
    };
  }, [sessionId]);
  const snap = props?.useChat ? props.useChat((s) => s) : void 0;
  (0, import_react5.useEffect)(() => {
    if (snap === void 0 || snap === null) return;
    setLatestChatSnapshot(snap, sessionId);
  }, [snap, sessionId]);
  (0, import_react5.useEffect)(() => {
    liveTodos = Array.isArray(todos) ? todos : [];
    for (const fn of listeners) {
      try {
        fn();
      } catch {
      }
    }
  }, [todos]);
  return null;
}

// src/client/tool-summary/TurnProcessShadowView.tsx
var import_jsx_runtime4 = require("react/jsx-runtime");
var NS2 = "dts";
var latestChatSnapshot = null;
var latestChatSessionId = null;
var snapshotListeners = /* @__PURE__ */ new Set();
var currentSessionKey = null;
var notifyScheduled = false;
function subscribeLatestChatSnapshot(cb) {
  snapshotListeners.add(cb);
  return () => {
    snapshotListeners.delete(cb);
  };
}
function scheduleNotify() {
  if (notifyScheduled) return;
  notifyScheduled = true;
  const flush = () => {
    notifyScheduled = false;
    for (const cb of [...snapshotListeners]) {
      try {
        cb();
      } catch {
      }
    }
  };
  if (typeof queueMicrotask === "function") queueMicrotask(flush);
  else setTimeout(flush, 0);
}
function resetSessionCaches() {
  try {
    activityStore().clear();
  } catch {
  }
  try {
    clearLiveDshTodos();
  } catch {
  }
  try {
    getKrChatStore().setSelectedTurn(null);
  } catch {
  }
}
function getLatestChatSessionId() {
  return latestChatSessionId;
}
function setLatestChatSessionId(id) {
  if (id === latestChatSessionId) return;
  latestChatSessionId = id;
  if (typeof window !== "undefined") {
    window.__dshLatestChatSessionId__ = id;
  }
  clearLatestChatSnapshot();
  resetSessionCaches();
  scheduleNotify();
}
function clearLatestChatSnapshot() {
  latestChatSnapshot = null;
  if (typeof window !== "undefined") {
    window.__dshLatestChatSnapshot__ = null;
  }
  scheduleNotify();
}
if (typeof window !== "undefined") {
  window.__dshSetActiveSessionId__ = setLatestChatSessionId;
}
function setLatestChatSnapshot(snapshot, sessionId) {
  if (sessionId !== void 0 && sessionId !== null && sessionId !== latestChatSessionId) {
    setLatestChatSessionId(sessionId);
  }
  latestChatSnapshot = snapshot;
  if (typeof window !== "undefined") {
    window.__dshLatestChatSnapshot__ = snapshot;
  }
  const firstInputKey = snapshot?.navigation?.current?.[0]?.anchorKey || snapshot?.order?.find((k) => typeof k === "string" && k.includes("input-message")) || null;
  if (firstInputKey && firstInputKey !== currentSessionKey) {
    currentSessionKey = firstInputKey;
    resetSessionCaches();
  }
  scheduleNotify();
}
function useTurnActivityCounts(turn, useChat) {
  return useChat((snapshot) => {
    let tools = 0;
    let reasoning = 0;
    let streaming = false;
    let toolsRunning = false;
    const keys = snapshot?.locations?.getTurn?.(turn) ?? [];
    for (const key of keys) {
      const candidate = snapshot?.nodes?.get?.(key);
      if (candidate === void 0) continue;
      if (candidate.kind === "tool-call") {
        tools += 1;
        try {
          const block = candidate.data.root;
          if (isRunning(block)) toolsRunning = true;
        } catch {
        }
      } else if (candidate.kind === "assistant-step" || candidate.kind === "assistant") {
        const step = candidate;
        if (step.data?.status === "running" || step.status === "running") streaming = true;
        const blocks = step.data?.blocks ?? step.blocks ?? [];
        for (const block of blocks) {
          const isReasoning = block?.kind === "reasoning" || block?.type === "reasoning";
          const text = typeof block?.text === "string" ? block.text : typeof block?.content === "string" ? block.content : "";
          if (isReasoning && text.trim() !== "") reasoning += 1;
        }
      }
    }
    return { tools, reasoning, streaming, toolsRunning };
  }, (a, b) => a.tools === b.tools && a.reasoning === b.reasoning && a.streaming === b.streaming && a.toolsRunning === b.toolsRunning);
}
function collectTurnNodes(snapshot, turn) {
  const toolMap = /* @__PURE__ */ new Map();
  const reasoningList = [];
  let turnTasks = [];
  if (snapshot === null || snapshot === void 0) {
    return { tools: [], reasoning: [], tasks: [] };
  }
  const addNode = (candidate) => {
    if (candidate === void 0 || candidate === null) return;
    if (candidate.kind === "tool-call") {
      const toolNode = candidate;
      if (toolNode.key && !toolMap.has(toolNode.key)) {
        toolMap.set(toolNode.key, toolNode);
      }
      try {
        const root = toolNode.data?.root;
        const tName = root?.call?.name || root?.toolName || root?.name || toolNode.data?.call?.name;
        if (tName === "todo_write") {
          const raw = root?.call?.argsRaw || root?.arguments || toolNode.data?.call?.argsRaw;
          const parsed = typeof raw === "string" ? JSON.parse(raw) : raw;
          if (parsed && Array.isArray(parsed.todos) && parsed.todos.length > 0) {
            turnTasks = parsed.todos.map((item, idx) => ({
              id: `todo-${turn}-${idx}`,
              content: String(item.content ?? ""),
              status: item.status === "completed" || item.status === "in_progress" || item.status === "pending" ? item.status : "pending"
            }));
          }
        }
      } catch {
      }
    } else if (candidate.kind === "submitted-plan") {
      try {
        const planData = candidate.data;
        if (planData && typeof planData.title === "string" && turnTasks.length === 0) {
          const markdown = planData.markdown || "";
          const mdLines = markdown.split("\n");
          const mdTasks = [];
          for (const line of mdLines) {
            const checkMatch = line.match(/^[\s\*\-]*\[([ xX])\]\s*(.+)/);
            if (checkMatch) {
              mdTasks.push({
                id: `plan-task-${turn}-${mdTasks.length}`,
                content: checkMatch[2].trim(),
                status: checkMatch[1].toLowerCase() === "x" ? "completed" : "pending"
              });
            }
          }
          if (mdTasks.length > 0) {
            turnTasks = mdTasks;
          } else {
            turnTasks = [{
              id: `plan-${turn}-0`,
              content: planData.title,
              status: "completed"
            }];
          }
        }
      } catch {
      }
    } else if (candidate.kind === "assistant-step" || candidate.kind === "assistant") {
      const step = candidate;
      const blocks = step.data?.blocks ?? step.blocks ?? [];
      for (const block of blocks) {
        const isReasoning = block?.kind === "reasoning" || block?.type === "reasoning";
        const text = typeof block?.text === "string" ? block.text : typeof block?.content === "string" ? block.content : "";
        if (isReasoning && text.trim() !== "") {
          const stepNum = step.data?.step ?? step.step ?? 0;
          if (!reasoningList.some((r) => r.step === stepNum && r.text === text)) {
            reasoningList.push({
              text,
              running: step.data?.status === "running" || step.status === "running",
              step: stepNum
            });
          }
        }
      }
    }
  };
  try {
    const turnKeys = snapshot?.locations?.getTurn?.(turn);
    if (Array.isArray(turnKeys)) {
      for (const key of turnKeys) {
        addNode(snapshot?.nodes?.get?.(key));
      }
    }
  } catch {
  }
  const scanCandidate = (node) => {
    if (!node) return;
    const loc = node.location;
    const candTurn = node.data?.turn ?? (typeof loc?.turn === "number" ? loc.turn : loc?.turn?.turn);
    if (candTurn !== void 0 && candTurn == turn) {
      addNode(node);
    }
  };
  try {
    if (typeof snapshot?.nodes?.values === "function") {
      for (const node of snapshot.nodes.values()) {
        scanCandidate(node);
      }
    }
  } catch {
  }
  try {
    if (Array.isArray(snapshot?.order)) {
      for (const key of snapshot.order) {
        scanCandidate(snapshot?.nodes?.get?.(key));
      }
    }
  } catch {
  }
  const tools = [...toolMap.values()].sort((a, b) => (a.anchorSeq ?? 0) - (b.anchorSeq ?? 0));
  reasoningList.sort((a, b) => (a.step ?? 0) - (b.step ?? 0));
  let turnStart;
  let turnEnd;
  let durationMs;
  try {
    const turnsMap = snapshot?.timeline?.turns;
    const t = turnsMap?.get ? turnsMap.get(turn) : turnsMap?.[turn];
    if (t) {
      if (typeof t.start?.time === "number") turnStart = t.start.time;
      if (typeof t.end?.time === "number") turnEnd = t.end.time;
      if (turnStart !== void 0 && turnEnd !== void 0) {
        durationMs = Math.max(0, turnEnd - turnStart);
      }
    }
  } catch {
  }
  if (durationMs === void 0) {
    try {
      for (const key of snapshot?.order ?? []) {
        const node = snapshot?.nodes?.get?.(key);
        if (node?.kind === "turn-tail" && (node.data?.turn === turn || node.location?.turn?.turn === turn)) {
          const locTurn = node.location?.turn;
          const s = locTurn?.start?.time;
          const e = locTurn?.end?.time;
          if (typeof s === "number") turnStart = s;
          if (typeof e === "number") turnEnd = e;
          if (typeof s === "number" && typeof e === "number") {
            durationMs = Math.max(0, e - s);
          }
          break;
        }
      }
    } catch {
    }
  }
  if (turnStart === void 0) {
    turnStart = snapshot?.legacy?.turnTimings?.get?.(turn)?.startTime;
  }
  return { tools, reasoning: reasoningList, tasks: turnTasks, turnStart, turnEnd, durationMs };
}
var TurnProcessShadowView = (0, import_react6.memo)(function TurnProcessShadowView2(props) {
  const { node, useChat, turnProcess, t, cwd, openFile, inspectCall } = props;
  const store = activityStore();
  const turn = node.data.turn;
  const counts = useTurnActivityCounts(turn, useChat);
  const snapshotRef = (0, import_react6.useRef)(null);
  useChat((snapshot) => {
    snapshotRef.current = snapshot;
    latestChatSnapshot = snapshot;
    return 0;
  });
  const activeThinking = counts.reasoning > 0 && (counts.streaming === true || counts.toolsRunning === true);
  (0, import_react6.useEffect)(() => {
    if (activeThinking) {
      const row = document.querySelector('[data-turn-process="' + turn + '"].' + NS2 + "__process");
      store.setPreviewAnchor(row ?? void 0, turn);
    } else {
      store.setPreviewAnchor(void 0, null);
    }
    return () => {
      if (activeThinking) store.setPreviewAnchor(void 0, null);
    };
  }, [activeThinking, turn, store]);
  if (turnProcess === void 0) return null;
  if (!turnProcess.foldable) return null;
  if (typeof document !== "undefined" && document.body.hasAttribute("data-dsh-kr-chat")) {
    return null;
  }
  const open = turnProcess.open;
  const data = node.data;
  const labels = [];
  if (data.toolCallCount > 0) {
    labels.push(t(data.toolCallCount === 1 ? "message.turnProcess.toolCalls.one" : "message.turnProcess.toolCalls.other", { count: data.toolCallCount }));
  }
  const thinkingLabel = labels.length > 0 && (counts.reasoning > 0 || data.inlineReasoning) ? counts.reasoning > 0 ? `${counts.reasoning} \u6B21\u601D\u8003` : "\u601D\u8003" : void 0;
  const label = labels.length === 0 ? t("message.turnProcess.thoughtForAWhile") : labels.filter((l) => l !== thinkingLabel).join(t("message.turnProcess.separator"));
  const hasTools = data.toolCallCount > 0 || counts.tools > 0;
  const tab = hasTools ? "tools" : "reasoning";
  const toggle = () => {
    turnProcess.setOpen(!open);
  };
  const handleOpen = (mode) => {
    const snapshot = snapshotRef.current;
    if (snapshot) {
      const collected = collectTurnNodes(snapshot, turn);
      if (collected.tools.length > 0) {
        store.setTools(turn, collected.tools, cwd, collected.turnStart);
      }
      if (collected.reasoning.length > 0) {
        store.setReasoning(turn, collected.reasoning);
      }
    }
    if (openFile && inspectCall) {
      store.setHandlers({ openFile, inspectCall });
    }
    store.open(turn, mode);
  };
  return /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)(
    "button",
    {
      type: "button",
      className: `${NS2}__process`,
      "data-open": open || void 0,
      "data-turn-process": data.turn,
      "data-turn-process-tool-calls": data.toolCallCount,
      "data-turn-process-messages": data.messageCount,
      "data-turn-process-subagents": data.subagentCount,
      "aria-expanded": open,
      "aria-label": [label, thinkingLabel].filter(Boolean).join(" "),
      onClick: () => {
        handleOpen(tab);
      },
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("span", { className: `${NS2}__process-label`, children: label }),
        thinkingLabel !== void 0 && /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)(
          "span",
          {
            className: `${NS2}__process-think`,
            role: "button",
            tabIndex: 0,
            title: counts.reasoning > 0 ? `\u67E5\u770B${counts.reasoning} \u6B21\u601D\u8003` : "\u67E5\u770B\u601D\u8003\u8FC7\u7A0B",
            "aria-label": counts.reasoning > 0 ? `\u67E5\u770B${counts.reasoning} \u6B21\u601D\u8003` : "\u67E5\u770B\u601D\u8003\u8FC7\u7A0B",
            onClick: (event) => {
              event.stopPropagation();
              handleOpen("reasoning");
            },
            onKeyDown: (event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                event.stopPropagation();
                handleOpen("reasoning");
              }
            },
            children: [
              t("message.turnProcess.separator"),
              thinkingLabel
            ]
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
          "span",
          {
            className: `${NS2}__process-chevronbtn`,
            role: "button",
            tabIndex: 0,
            title: open ? "\u6298\u53E0\u672C\u8F6E\u539F\u6587" : "\u5C55\u5F00\u672C\u8F6E\u539F\u6587",
            "aria-label": open ? "\u6298\u53E0\u672C\u8F6E\u539F\u6587" : "\u5C55\u5F00\u672C\u8F6E\u539F\u6587",
            onClick: (event) => {
              event.stopPropagation();
              toggle();
            },
            onKeyDown: (event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                event.stopPropagation();
                toggle();
              }
            },
            children: /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(import_dsh_client_ui_primitives2.IconChevronDownOutline14, { className: `${NS2}__process-chevron` })
          }
        )
      ]
    }
  );
});

// src/client/download/api.ts
var import_react7 = require("react");
function downloadPercent(state) {
  if (state === null || state.totalBytes === null || state.totalBytes <= 0) return null;
  return Math.min(100, Math.max(0, Math.floor(100 * state.receivedBytes / state.totalBytes)));
}
function useDownloadState(callId, active) {
  const [state, setState] = (0, import_react7.useState)(null);
  (0, import_react7.useEffect)(() => {
    if (!active || callId === void 0 || callId === "") {
      setState(null);
      return;
    }
    let alive = true;
    let timer = null;
    const tick = async () => {
      if (!alive) return;
      try {
        const res = await fetch(`/api/chat-flow/download/progress?callId=${encodeURIComponent(callId)}`, { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          if (alive) setState(data.download ?? null);
        }
      } catch {
      }
      if (alive) timer = setTimeout(() => {
        void tick();
      }, 700);
    };
    void tick();
    return () => {
      alive = false;
      if (timer !== null) clearTimeout(timer);
    };
  }, [callId, active]);
  return state;
}

// src/client/tool-summary/ToolGroupNodeView.tsx
var import_jsx_runtime5 = require("react/jsx-runtime");
var NS3 = "dts";
var MD_LABELS = {
  code: { copyLabel: "\u590D\u5236", copiedLabel: "\u5DF2\u590D\u5236" },
  footnotes: "\u811A\u6CE8"
};
var READ_LABELS = {
  window: (shown, total) => `\u663E\u793A ${shown} / ${total} \u884C`,
  copy: "\u590D\u5236",
  copied: "\u5DF2\u590D\u5236",
  collapseAria: "\u6536\u8D77\u6587\u4EF6\u5185\u5BB9",
  expandAria: (hidden) => `\u5C55\u5F00\u5176\u4F59 ${hidden} \u884C`,
  collapse: "\u6536\u8D77",
  expand: (hidden) => `\u5C55\u5F00\u5176\u4F59 ${hidden} \u884C`
};
var TERMINAL_LABELS = {
  signal: (signal) => `\u4FE1\u53F7 ${signal}`,
  exitCode: (code) => `\u9000\u51FA\u7801 ${code}`,
  running: "\u6267\u884C\u4E2D",
  failed: "\u5931\u8D25",
  done: "\u5DF2\u5B8C\u6210",
  copy: "\u590D\u5236",
  copied: "\u5DF2\u590D\u5236",
  noOutput: "\u6CA1\u6709\u8F93\u51FA",
  collapseAria: "\u6536\u8D77\u547D\u4EE4\u8F93\u51FA",
  collapse: "\u6536\u8D77",
  expandAria: (hidden) => `\u5C55\u5F00\u5176\u4F59 ${hidden} \u884C`,
  expand: (hidden) => `\u5C55\u5F00\u5176\u4F59 ${hidden} \u884C`
};
var DIFF_LABELS = {
  copy: "\u590D\u5236",
  copied: "\u5DF2\u590D\u5236",
  collapseAria: "\u6536\u8D77\u5DEE\u5F02",
  collapse: "\u6536\u8D77",
  expandAria: (hidden) => `\u5C55\u5F00\u5176\u4F59 ${hidden} \u884C`,
  expand: (hidden) => `\u5C55\u5F00\u5176\u4F59 ${hidden} \u884C`,
  files: (count) => `${count} \u4E2A\u6587\u4EF6`
};
var SEARCH_LABELS = {
  pathsSummary: (shown, total, truncated) => `${shown} / ${total} \u4E2A\u8DEF\u5F84${truncated ? "\uFF08\u7ED3\u679C\u5DF2\u622A\u65AD\uFF09" : ""}`,
  matchesSummary: (shown, total, files, truncated) => `${shown} / ${total} \u5904\u5339\u914D \xB7 ${files} \u4E2A\u6587\u4EF6${truncated ? "\uFF08\u7ED3\u679C\u5DF2\u622A\u65AD\uFF09" : ""}`,
  copy: "\u590D\u5236",
  copied: "\u5DF2\u590D\u5236",
  noResults: "\u6CA1\u6709\u7ED3\u679C",
  collapseAria: "\u6536\u8D77\u641C\u7D22\u7ED3\u679C",
  collapse: "\u6536\u8D77",
  expandAria: (hidden) => `\u5C55\u5F00\u5176\u4F59 ${hidden} \u884C`,
  expand: (hidden) => `\u5C55\u5F00\u5176\u4F59 ${hidden} \u884C`
};
var WEB_LABELS = {
  noResults: "\u6CA1\u6709\u7ED3\u679C",
  sourcesTruncated: "\u6765\u6E90\u5DF2\u622A\u65AD",
  http: "HTTP",
  contentTruncated: "\u5185\u5BB9\u5DF2\u622A\u65AD",
  markdown: MD_LABELS
};
var JSON_LABELS = {
  copyValue: "\u590D\u5236\u503C",
  copyJson: "\u590D\u5236 JSON",
  copyPath: "\u590D\u5236\u8DEF\u5F84",
  copyPrettyJson: "\u590D\u5236\u683C\u5F0F\u5316 JSON",
  copyCompactJson: "\u590D\u5236\u7D27\u51D1 JSON",
  copied: "\u5DF2\u590D\u5236",
  copyFailed: "\u590D\u5236\u5931\u8D25",
  collapseNode: "\u6536\u8D77\u8282\u70B9",
  expandNode: "\u5C55\u5F00\u8282\u70B9",
  copyButtonTitle: (action) => action
};
var CATEGORY_ICONS = {
  write: import_dsh_client_ui_primitives3.IconEditOutline16,
  read: import_dsh_client_ui_primitives3.IconBrowseOutline16,
  terminal: import_dsh_client_ui_primitives3.IconApiOutline14,
  search: import_dsh_client_ui_primitives3.IconSearchOutline16,
  web: import_dsh_client_ui_primitives3.IconSearchOutline16,
  other: import_dsh_client_ui_primitives3.IconSparkle16
};
var languageOf = (path) => path?.split(".").at(-1);
var elapsedText = (ms) => ms < 1e3 ? `${Math.round(ms)} \u6BEB\u79D2` : `${(ms / 1e3).toFixed(ms < 1e4 ? 1 : 0)} \u79D2`;
var EMPTY = [];
function turnNumber(node) {
  const location = node.location;
  if (location === void 0) return void 0;
  if (location.kind === "turn" || location.kind === "step") return location.turn?.turn;
  return void 0;
}
function ToolInputView({ name, args, raw }) {
  const command = typeof args.command === "string" && args.command !== "" ? args.command : typeof args.cmd === "string" && args.cmd !== "" ? args.cmd : typeof args.script === "string" && args.script !== "" ? args.script : void 0;
  const cwd = typeof args.workdir === "string" && args.workdir !== "" ? args.workdir : typeof args.cwd === "string" && args.cwd !== "" ? args.cwd : void 0;
  const content = typeof args.content === "string" && args.content !== "" ? args.content : typeof args.new_string === "string" && args.new_string !== "" ? args.new_string : typeof args.newText === "string" && args.newText !== "" ? args.newText : typeof args.file_text === "string" && args.file_text !== "" ? args.file_text : void 0;
  const target = typeof args.file_path === "string" && args.file_path !== "" ? args.file_path : typeof args.path === "string" && args.path !== "" ? args.path : void 0;
  if ((name === "render_ui" || name === "show_widget") && typeof args.html === "string") {
    return /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)(import_jsx_runtime5.Fragment, { children: [
      /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("p", { className: `${NS3}__tnote`, children: "\u4EA4\u4E92\u5F0F\u7EC4\u4EF6\u5728\u5F39\u7A97\u91CC\u4EE5\u8F93\u5165 JSON \u5C55\u793A\uFF0C\u5B8C\u6574\u4EA4\u4E92\u89C1\u539F\u8F68\u8FF9\u3002" }),
      /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(import_dsh_client_ui_primitives3.JsonTree, { data: args, label: "\u5DE5\u5177\u8F93\u5165", labels: JSON_LABELS })
    ] });
  }
  if (command !== void 0) {
    return /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)(import_jsx_runtime5.Fragment, { children: [
      /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("p", { className: `${NS3}__tnote`, children: "\u63D0\u4EA4\u7684\u547D\u4EE4" }),
      /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(import_dsh_client_ui_primitives3.TerminalBlock, { command, cwd, labels: TERMINAL_LABELS }),
      /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("details", { className: `${NS3}__tall`, children: [
        /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("summary", { children: "\u5168\u90E8\u8F93\u5165\u5B57\u6BB5" }),
        /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(import_dsh_client_ui_primitives3.JsonTree, { data: args, label: "\u8F93\u5165\u5B57\u6BB5", labels: JSON_LABELS })
      ] })
    ] });
  }
  if (content !== void 0) {
    const lines = content.split("\n").map((text, index) => ({ number: index + 1, text }));
    const visible = lines.slice(0, 1600);
    return /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)(import_jsx_runtime5.Fragment, { children: [
      /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("p", { className: `${NS3}__tnote`, children: [
        "\u5DE5\u5177\u8F93\u5165\u4E2D\u7684\u6587\u4EF6\u5185\u5BB9",
        lines.length > visible.length ? " \xB7 \u9884\u89C8\u524D 1,600 \u884C\uFF0C\u5B8C\u6574\u5185\u5BB9\u5728\u539F\u59CB\u6570\u636E\u4E2D" : ""
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(import_dsh_client_ui_primitives3.ReadBlock, { label: target ?? "\u6587\u4EF6\u5185\u5BB9", lang: languageOf(target), lines: visible, totalLines: lines.length, maxLines: 16, labels: READ_LABELS }),
      /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("details", { className: `${NS3}__tall`, children: [
        /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("summary", { children: "\u5168\u90E8\u8F93\u5165\u5B57\u6BB5" }),
        /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(import_dsh_client_ui_primitives3.JsonTree, { data: args, label: "\u8F93\u5165\u5B57\u6BB5", labels: JSON_LABELS })
      ] })
    ] });
  }
  return /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(import_dsh_client_ui_primitives3.JsonTree, { data: args, label: raw === "" ? "\u8F93\u5165\u5C1A\u672A\u5230\u8FBE" : "\u5DE5\u5177\u8F93\u5165", labels: JSON_LABELS });
}
function ToolResultView({ name, category, block, text }) {
  if (!("kind" in block)) {
    return /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)(import_jsx_runtime5.Fragment, { children: [
      /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("p", { className: `${NS3}__tnote`, children: "\u5DE5\u5177\u5DF2\u5F00\u59CB\u6267\u884C\uFF0C\u6B63\u5728\u7B49\u5F85\u7ED3\u679C\u3002" }),
      /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(ToolInputView, { name, args: argFields(toolArgsRaw(block)), raw: toolArgsRaw(block) })
    ] });
  }
  if (block.error?.code === "ABORTED" || block.error?.code === "interrupted") {
    return /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)(import_jsx_runtime5.Fragment, { children: [
      /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("p", { className: `${NS3}__tnote`, children: "\u5DE5\u5177\u5DF2\u53D6\u6D88\uFF0C\u672A\u6B63\u5E38\u5B8C\u6210\u3002\u8F93\u5165\u548C\u539F\u59CB\u8FD4\u56DE\u8BB0\u5F55\u4ECD\u53EF\u67E5\u770B\u3002" }),
      /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("pre", { className: `${NS3}__traw`, children: text })
    ] });
  }
  if (category === "terminal") {
    const facts = executionFacts(block);
    const output = text.replace(/\n\[(?:exit code: \d+|killed by signal: [^\]\n]+)\]$/, "");
    const args = argFields(toolArgsRaw(block));
    const command = typeof args.command === "string" && args.command !== "" ? args.command : typeof args.cmd === "string" && args.cmd !== "" ? args.cmd : name;
    const cwd = typeof args.workdir === "string" && args.workdir !== "" ? args.workdir : typeof args.cwd === "string" && args.cwd !== "" ? args.cwd : void 0;
    return /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(import_dsh_client_ui_primitives3.TerminalBlock, { command, cwd, output, exitCode: facts.exitCode, signal: facts.signal, maxLines: 18, labels: TERMINAL_LABELS });
  }
  if (category === "read") {
    const window2 = readWindowOf(block);
    if (window2 !== null) {
      return /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(import_dsh_client_ui_primitives3.ReadBlock, { label: window2.path, lang: window2.lang, lines: window2.lines, totalLines: window2.totalLines, maxLines: 18, labels: READ_LABELS });
    }
  }
  if (category === "write") {
    const diffs = diffHunksOf(block);
    if (diffs !== null) return /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(import_dsh_client_ui_primitives3.DiffBlock, { diffs, maxLines: 18, labels: DIFF_LABELS });
  }
  if (category === "search") {
    const view = searchViewOf(block);
    if (view !== null && view.shape === "paths") {
      return /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(import_dsh_client_ui_primitives3.SearchBlock, { kind: "paths", paths: view.paths, total: view.total, truncated: view.truncated, maxLines: 18, labels: SEARCH_LABELS });
    }
    if (view !== null && view.shape === "matches") {
      return /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(import_dsh_client_ui_primitives3.SearchBlock, { kind: "matches", files: view.files, total: view.total, truncated: view.truncated, maxLines: 18, labels: SEARCH_LABELS });
    }
  }
  if (category === "web") {
    const view = webViewOf(name, block);
    if (view !== null && view.shape === "fetch") {
      return /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(import_dsh_client_ui_primitives3.WebBlock, { kind: "fetch", url: view.url, statusCode: view.statusCode, truncated: view.truncated, labels: WEB_LABELS });
    }
    if (view !== null && view.shape === "search") {
      return /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(import_dsh_client_ui_primitives3.WebBlock, { kind: "search", sources: view.sources, answer: view.answer, truncated: view.truncated, labels: WEB_LABELS });
    }
  }
  if (text !== "") {
    return /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("div", { className: `${NS3}__tdoc`, children: /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(import_dsh_client_ui_primitives3.MarkdownText, { text, streaming: false, labels: MD_LABELS }) });
  }
  if (resultExtraCount(block) > 0) return /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("p", { className: `${NS3}__tnote`, children: "\u56FE\u7247\u6216\u6269\u5C55\u5185\u5BB9\u5DF2\u5728\u8F68\u8FF9\u89C6\u56FE\u4E2D\u5355\u72EC\u5C55\u793A\u3002" });
  return /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("p", { className: `${NS3}__tnote`, children: "\u5DE5\u5177\u6CA1\u6709\u8FD4\u56DE\u53EF\u5C55\u793A\u7684\u5185\u5BB9\u3002" });
}
var SimpleToolRow = (0, import_react8.memo)(function SimpleToolRow2({
  block,
  selected,
  cwd,
  openFile,
  inspectCall
}) {
  void cwd;
  void openFile;
  const [open, setOpen] = (0, import_react8.useState)(false);
  const [tab, setTab] = (0, import_react8.useState)("result");
  const panelId = (0, import_react8.useId)();
  const tabRefs = (0, import_react8.useRef)([]);
  const rowMotion = useMotionAllowed(true);
  const { ref: rowBodyRef, present: rowBodyPresent } = useHeightAnimation(open, rowMotion);
  const running = isRunning(block);
  const name = callName(block);
  const raw = toolArgsRaw(block);
  const args = (0, import_react8.useMemo)(() => argFields(raw), [raw]);
  const category = classifyCategory(name);
  const title = rowTitle(name, category);
  const summary = rowSummary(name, category, args, raw);
  const phase = viewPhase(block);
  const facts = executionFacts(block);
  const text = resultParagraphs(block);
  const Icon = name === "skill" ? import_dsh_client_ui_primitives3.IconSkillOutline16 : CATEGORY_ICONS[category];
  const showBadge = phase === "running" || phase === "failed" || phase === "interrupted";
  const now = useNow(running);
  const duration = callDurationMs(block, now);
  const dlState = useDownloadState(running && classifyActivity(block) === "download" ? block.callId : void 0, running);
  const dlPct = downloadPercent(dlState);
  const tabs = (0, import_react8.useMemo)(() => [
    { id: "result", label: "\u7ED3\u679C" },
    { id: "input", label: "\u8F93\u5165" },
    { id: "raw", label: "\u539F\u59CB\u6570\u636E" }
  ], []);
  const activateTab = (index) => {
    const next = tabs[(index + tabs.length) % tabs.length];
    if (next === void 0) return;
    setTab(next.id);
    tabRefs.current[(index + tabs.length) % tabs.length]?.focus();
  };
  const toggle = () => {
    setOpen((value) => !value);
  };
  return /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)(
    "div",
    {
      className: `${NS3}__tcall`,
      "data-selected": selected || void 0,
      "data-state": phase === "failed" ? "error" : phase === "running" ? "running" : phase === "interrupted" ? "stopped" : "ok",
      "data-expanded": open || void 0,
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)(
          "div",
          {
            className: `${NS3}__trow`,
            role: "button",
            tabIndex: 0,
            "aria-expanded": open,
            "aria-label": `${title}\uFF1A${summary}`,
            onClick: toggle,
            onKeyDown: (event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                toggle();
              }
            },
            children: [
              /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("span", { className: `${NS3}__trow-icon`, "aria-hidden": true, children: /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(Icon, { size: 14 }) }),
              /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("span", { className: `${NS3}__trow-main`, children: [
                /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("span", { className: `${NS3}__trow-title`, children: title }),
                /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("span", { className: `${NS3}__trow-summary`, title: summary, children: summary })
              ] }),
              !running && duration !== void 0 && /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("span", { className: `${NS3}__trow-time`, title: "\u8017\u65F6", children: formatDuration(duration) }),
              showBadge && /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("span", { className: `${NS3}__trow-badge`, "data-phase": phase, children: PHASE_LABEL[phase] }),
              /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
                "button",
                {
                  type: "button",
                  className: `${NS3}__trow-go`,
                  title: "\u5728\u8F68\u8FF9\u4E2D\u67E5\u770B",
                  "aria-label": `\u5728\u8F68\u8FF9\u4E2D\u67E5\u770B ${name}`,
                  onClick: (event) => {
                    event.stopPropagation();
                    inspectCall(block.callId);
                  },
                  children: /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(import_dsh_client_ui_primitives3.IconChevronRightOutline14, { size: 13, "aria-hidden": true })
                }
              ),
              /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(import_dsh_client_ui_primitives3.IconChevronDownOutline14, { size: 14, "aria-hidden": true, className: `${NS3}__trow-chevron`, "data-open": open || void 0 })
            ]
          }
        ),
        rowBodyPresent && /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)(
          "div",
          {
            ref: rowBodyRef,
            className: `${NS3}__tdetail`,
            "data-open": open || void 0,
            "aria-hidden": !open,
            ...!open ? { inert: "" } : {},
            children: [
              /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { className: `${NS3}__tledger`, "aria-live": "off", children: [
                /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("span", { children: [
                  "\u5DE5\u5177 \xB7 ",
                  /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("span", { className: `${NS3}__tengine`, children: name === "" ? block.callId : name })
                ] }),
                running && dlPct !== null && /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("span", { children: [
                  "\u4E0B\u8F7D\u4E2D \xB7 ",
                  dlPct,
                  "%",
                  duration !== void 0 ? ` \xB7 ${formatDuration(duration)}` : ""
                ] }),
                running && dlPct === null && /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("span", { children: [
                  "\u5DF2\u63D0\u4EA4 \xB7 \u7B49\u5F85\u5DE5\u5177\u8FD4\u56DE",
                  duration !== void 0 && duration > 1e3 ? ` \xB7 ${formatDuration(duration)}` : ""
                ] }),
                !running && phase === "interrupted" && /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("span", { children: "\u5DF2\u505C\u6B62 \xB7 \u8F93\u5165\u8BB0\u5F55\u4FDD\u7559" }),
                !running && phase !== "interrupted" && duration !== void 0 && /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("span", { children: [
                  "\u6267\u884C ",
                  elapsedText(duration)
                ] }),
                facts.exitCode !== void 0 && /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("span", { children: [
                  "\u9000\u51FA\u7801 ",
                  facts.exitCode
                ] }),
                facts.signal !== void 0 && facts.signal !== "" && /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("span", { children: [
                  "\u4FE1\u53F7 ",
                  facts.signal
                ] })
              ] }),
              running && dlPct !== null && /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("div", { className: `${NS3}__tprog`, "aria-hidden": true, children: /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("span", { className: `${NS3}__tprog-fill`, style: { width: `${dlPct}%` } }) }),
              /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
                "div",
                {
                  className: `${NS3}__ttabs`,
                  role: "tablist",
                  "aria-label": `${title}\u7684\u6267\u884C\u6570\u636E`,
                  onKeyDown: (event) => {
                    const index = tabs.findIndex((item) => item.id === tab);
                    if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
                      event.preventDefault();
                      activateTab(index + (event.key === "ArrowRight" ? 1 : -1));
                    } else if (event.key === "Home" || event.key === "End") {
                      event.preventDefault();
                      activateTab(event.key === "Home" ? 0 : tabs.length - 1);
                    }
                  },
                  children: tabs.map((item, index) => /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
                    "button",
                    {
                      ref: (element) => {
                        tabRefs.current[index] = element;
                      },
                      type: "button",
                      role: "tab",
                      id: `${panelId}-${item.id}`,
                      "aria-selected": tab === item.id,
                      "aria-controls": `${panelId}-panel`,
                      tabIndex: tab === item.id ? 0 : -1,
                      onClick: () => {
                        setTab(item.id);
                      },
                      children: item.label
                    },
                    item.id
                  ))
                }
              ),
              /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { id: `${panelId}-panel`, className: `${NS3}__tpanel`, role: "tabpanel", "aria-labelledby": `${panelId}-${tab}`, tabIndex: 0, children: [
                tab === "result" && /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(ToolResultView, { name, category, block, text }),
                tab === "input" && /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(ToolInputView, { name, args, raw }),
                tab === "raw" && /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)(import_jsx_runtime5.Fragment, { children: [
                  /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("p", { className: `${NS3}__tnote`, children: "\u5B8C\u6574\u8BB0\u5F55 \xB7 \u53EA\u8BFB \xB7 \u4E0D\u6267\u884C\u5176\u4E2D\u7684\u4EE3\u7801" }),
                  /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("h4", { className: `${NS3}__traw-label`, children: "\u5DE5\u5177\u8F93\u5165" }),
                  /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("pre", { className: `${NS3}__traw`, children: raw === "" ? "\u8F93\u5165\u5C1A\u672A\u5230\u8FBE" : raw }),
                  rawResultJson(block) !== "" && /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)(import_jsx_runtime5.Fragment, { children: [
                    /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("h4", { className: `${NS3}__traw-label`, children: "\u5DE5\u5177\u7ED3\u679C" }),
                    /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("pre", { className: `${NS3}__traw`, children: rawResultJson(block) })
                  ] })
                ] })
              ] })
            ]
          }
        )
      ]
    }
  );
});
function ToolCallTreeList({ block, cwd, openFile, inspectCall }) {
  return /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { className: `${NS3}__drawer-call`, children: [
    /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
      SimpleToolRow,
      {
        block,
        selected: false,
        cwd,
        openFile,
        inspectCall
      }
    ),
    block.subCalls.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("div", { className: `${NS3}__tsub`, "data-subcalls": true, "aria-label": "\u5B50\u8C03\u7528", children: block.subCalls.map((child) => /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(ToolCallTreeList, { block: child, cwd, openFile, inspectCall }, child.callId)) })
  ] });
}
var ToolEntry = (0, import_react8.memo)(function ToolEntry2({
  nodes,
  turn,
  turnStart,
  cwd,
  openFile,
  inspectCall,
  t,
  turnProcess,
  useChat,
  closed
}) {
  const store = activityStore();
  (0, import_react8.useEffect)(() => {
    store.setTools(turn, nodes, cwd, turnStart);
    store.setHandlers({ openFile, inspectCall });
  }, [store, turn, nodes, cwd, turnStart, openFile, inspectCall]);
  const stats = (0, import_react8.useMemo)(() => computeStats(nodes.map((node) => node.data.root)), [nodes]);
  const activity = useTurnActivityCounts(turn, useChat);
  const running = stats.running > 0;
  const controlActive = turnProcess?.foldable === true;
  const drawerOpen = useDrawerOpen(turn);
  const now = useNow(running);
  const toolStart = (0, import_react8.useMemo)(() => {
    let earliest;
    for (const node of nodes) {
      const block = node.data.root;
      if (isRunning(block) && (earliest === void 0 || block.time < earliest)) earliest = block.time;
    }
    return earliest;
  }, [nodes]);
  const elapsed = toolStart !== void 0 ? Math.max(0, now - toolStart) : void 0;
  const liveStackItems = useChat((snapshot) => {
    if (turn === void 0) return [];
    const out = [];
    for (const key of snapshot.locations.getTurn(turn)) {
      const candidate = snapshot.nodes.get(key);
      if (candidate === void 0 || candidate.kind !== "assistant-step") continue;
      const step = candidate;
      const stepRunning = step.data.status === "running";
      for (const block of step.data.blocks) {
        if (block.kind === "reasoning" && block.text !== "") {
          out.push({ text: block.text, step: step.data.step, running: stepRunning });
        }
      }
    }
    return out;
  });
  const liveActivity = (0, import_react8.useMemo)(() => {
    let hasDownload = false;
    let hasCommand = false;
    let downloadInfo;
    for (const node of nodes) {
      const block = node.data.root;
      if (!isRunning(block)) continue;
      const activity2 = classifyActivity(block);
      if (activity2 === "download") {
        hasDownload = true;
        if (downloadInfo === void 0) downloadInfo = parseDownload(block);
      } else if (activity2 === "command") {
        hasCommand = true;
      }
    }
    return { hasDownload, hasCommand, downloadInfo };
  }, [nodes]);
  const liveDownloadCalls = (0, import_react8.useMemo)(
    () => nodes.flatMap((node) => collectRunningCalls(node.data.root)).map((block) => {
      const isTool = callName(block) === "download";
      const info = isTool || classifyActivity(block) === "download" ? parseDownload(block) : void 0;
      return {
        block,
        url: info?.url ?? "",
        outputPath: isTool ? void 0 : info?.output || void 0
      };
    }).filter(({ block, outputPath }) => callName(block) === "download" || outputPath !== void 0).slice(0, 3),
    [nodes]
  );
  const showDownload = running && liveActivity.hasDownload && liveDownloadCalls.length === 0;
  const showCommand = running && !liveActivity.hasDownload && liveDownloadCalls.length === 0 && liveActivity.hasCommand && (elapsed ?? 0) > 1e3;
  const resting = t(stats.total === 1 ? "message.turnProcess.toolCalls.one" : "message.turnProcess.toolCalls.other", { count: stats.total });
  const label = running ? elapsed !== void 0 ? `\u5DE5\u5177\u8C03\u7528\u4E2D \xB7 ${formatDuration(elapsed)}` : "\u5DE5\u5177\u8C03\u7528\u4E2D" : activity.reasoning > 0 ? `${resting}${t("message.turnProcess.separator")}${activity.reasoning} \u6B21\u601D\u8003` : resting;
  const entryMotion = useMotionAllowed(true);
  const [deferredControl, setDeferredControl] = (0, import_react8.useState)(controlActive);
  (0, import_react8.useEffect)(() => {
    if (!controlActive) {
      setDeferredControl(false);
      return void 0;
    }
    if (liveStackItems.length === 0) {
      setDeferredControl(true);
      return void 0;
    }
    setDeferredControl(false);
    if (!entryMotion) {
      setDeferredControl(true);
      return void 0;
    }
    const id = window.setTimeout(() => {
      setDeferredControl(true);
    }, LIVE_RECLAIM_UNMOUNT_MS);
    return () => {
      window.clearTimeout(id);
    };
  }, [controlActive, liveStackItems.length, entryMotion]);
  const isKrMode = typeof document !== "undefined" && document.body.hasAttribute("data-dsh-kr-chat");
  if (isKrMode) return null;
  if (deferredControl) return null;
  if (controlActive) {
    return /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("div", { className: `${NS3}__entry-wrap`, "data-reclaim": "true", children: /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(LiveThinkingStack, { items: liveStackItems, closing: true }) });
  }
  return /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { className: `${NS3}__entry-wrap`, "data-reclaim": closed || void 0, children: [
    /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)(
      "button",
      {
        type: "button",
        className: `${NS3}__process`,
        "data-open": drawerOpen || void 0,
        "data-running": running || void 0,
        "data-turn-process": turn,
        "data-turn-process-tool-calls": stats.total,
        "data-turn-process-messages": 0,
        "data-turn-process-subagents": 0,
        "aria-expanded": drawerOpen,
        "aria-label": label,
        onClick: () => {
          store.open(turn, "tools");
        },
        children: [
          /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("span", { className: `${NS3}__process-label`, children: label }),
          /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(import_dsh_client_ui_primitives3.IconChevronDownOutline14, { className: `${NS3}__process-chevron` })
        ]
      }
    ),
    /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(LiveThinkingStack, { items: liveStackItems, closing: closed }),
    liveDownloadCalls.map(({ block, url, outputPath }) => /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(LiveDownloadCard, { callId: block.callId, url, startedAt: block.time, outputPath }, block.callId)),
    showDownload && /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { className: `${NS3}__download-card`, children: [
      /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { className: `${NS3}__download-head`, children: [
        /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(import_dsh_client_ui_primitives3.IconDownloadOutline16, { size: 14, "aria-hidden": true }),
        /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("span", { className: `${NS3}__download-title`, children: [
          "\u4E0B\u8F7D\u4E2D \xB7 ",
          formatDuration(elapsed ?? 0)
        ] })
      ] }),
      liveActivity.downloadInfo?.url !== void 0 && liveActivity.downloadInfo.url !== "" && /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("div", { className: `${NS3}__download-url`, title: liveActivity.downloadInfo.url, children: liveActivity.downloadInfo.url }),
      liveActivity.downloadInfo?.output !== void 0 && liveActivity.downloadInfo.output !== "" && /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { className: `${NS3}__download-dest`, title: liveActivity.downloadInfo.output, children: [
        "\u4FDD\u5B58\u5230 ",
        /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("code", { children: liveActivity.downloadInfo.output })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("div", { className: `${NS3}__download-progress`, children: /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("span", { className: `${NS3}__progress`, "aria-hidden": true }) })
    ] }),
    showCommand && /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { className: `${NS3}__entry-live`, "data-kind": "command", children: [
      /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("span", { className: `${NS3}__progress`, "aria-hidden": true }),
      /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("span", { children: [
        "\u6267\u884C\u4E2D \xB7 ",
        formatDuration(elapsed ?? 0)
      ] })
    ] })
  ] });
});
var ToolGroupNodeView = (0, import_react8.memo)(function ToolGroupNodeView2(props) {
  const isKrMode = typeof document !== "undefined" && document.body?.getAttribute("data-dsh-kr-chat") === "true";
  if (isKrMode) return null;
  const { node, useChat, cwd, openFile, inspectCall, t, turnProcess } = props;
  const turn = turnNumber(node);
  const nodes = useChat((snapshot) => {
    if (turn === void 0) return EMPTY;
    return snapshot.locations.getTurn(turn).map((key) => snapshot.nodes.get(key)).filter((candidate) => candidate !== void 0 && candidate.kind === "tool-call");
  });
  const turnStart = useChat((snapshot) => {
    if (turn === void 0) return void 0;
    return snapshot.legacy.turnTimings.get(turn)?.startTime;
  });
  if (nodes.length === 0) return null;
  if (node.key !== nodes[0]?.key) return null;
  const loc = node.location;
  const closed = loc !== void 0 && (loc.kind === "turn" || loc.kind === "step") && loc.turn?.status === "closed";
  return /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
    ToolEntry,
    {
      nodes,
      turn,
      turnStart,
      cwd,
      openFile,
      inspectCall,
      t,
      turnProcess,
      useChat,
      closed: closed === true
    }
  );
});

// src/client/error-boundary.tsx
var import_react9 = require("react");
var ErrorBoundary = class extends import_react9.Component {
  constructor() {
    super(...arguments);
    __publicField(this, "state", { error: null });
  }
  static getDerivedStateFromError(error) {
    return { error };
  }
  componentDidCatch(error, info) {
    console.error("[dsh-chat-flow] " + this.props.label + " \u6E32\u67D3\u5D29\u6E83\uFF1A", error, info.componentStack ?? "");
    try {
      this.props.onError?.(error);
    } catch (callbackError) {
      console.error("[dsh-chat-flow] \u9519\u8BEF\u8FB9\u754C\u56DE\u8C03\u5931\u8D25\uFF1A", callbackError);
    }
  }
  render() {
    if (this.state.error !== null) return this.props.fallback ?? null;
    return this.props.children;
  }
};

// src/client/modal-animation.ts
var import_react10 = require("react");
var MODAL_ANIM_MS = 240;
var STYLE_ID = "dsh-modal-animation-styles";
var SHEET = `
@keyframes dsh-modal-slide-in {
  from { opacity: 0; transform: translateY(24px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes dsh-modal-slide-out {
  from { opacity: 1; transform: translateY(0); }
  to { opacity: 0; transform: translateY(24px); }
}
@keyframes dsh-modal-side-in {
  from { opacity: 0; transform: translateX(-14px); }
  to { opacity: 1; transform: translateX(0); }
}
@keyframes dsh-modal-side-out {
  from { opacity: 1; transform: translateX(0); }
  to { opacity: 0; transform: translateX(-10px); }
}
@keyframes dsh-modal-rise-in {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes dsh-modal-mask-in {
  from { opacity: 0; }
  to { opacity: 1; }
}
@keyframes dsh-modal-mask-out {
  from { opacity: 1; }
  to { opacity: 0; }
}
.dsh-modal-slide-in { animation: dsh-modal-slide-in ${MODAL_ANIM_MS}ms cubic-bezier(0.2, 0.8, 0.2, 1); }
.dsh-modal-slide-out { animation: dsh-modal-slide-out ${MODAL_ANIM_MS}ms cubic-bezier(0.4, 0, 0.2, 1) forwards; }
.dsh-modal-side-in { animation: dsh-modal-side-in ${MODAL_ANIM_MS}ms cubic-bezier(0.2, 0.8, 0.2, 1); }
.dsh-modal-side-out { animation: dsh-modal-side-out ${MODAL_ANIM_MS}ms cubic-bezier(0.4, 0, 0.2, 1) forwards; }
/* \u5185\u5BB9\u9519\u843D\uFF1A\u5361\u7247\u64AD\u653E\u6ED1\u5165\uFF08\u5E95\u90E8\u4E0A\u6ED1 / \u53F3\u4FA7\u6ED1\u5165\u5747\u53EF\uFF09\u65F6\u751F\u6548\uFF0C\u5173\u95ED\u65F6\u968F\u5361\u7247\u6574\u4F53\u6536\u56DE\u3002
   fill-mode \u5FC5\u987B\u7528 backwards\uFF08\u5EF6\u8FDF\u671F\u5E94\u7528 from \u5E27\u9690\u85CF\uFF09\u800C\u975E both\u2014\u2014both \u4F1A\u5728\u52A8\u753B
   \u7ED3\u675F\u540E\u6B8B\u7559 to \u5E27 transform\uFF08\u5373\u4F7F translateY(0)\uFF09\uFF0C\u4F7F\u8BE5\u5BB9\u5668\u6210\u4E3A\u540E\u4EE3 position:fixed
   \u5143\u7D20\uFF08\u56FE\u8868 tooltip\uFF09\u7684\u5305\u542B\u5757\uFF0C\u6D6E\u5C42\u6574\u4F53\u504F\u79FB\u3002 */
.dsh-modal-slide-in .dsh-modal-stagger,
.dsh-modal-side-in .dsh-modal-stagger {
  animation: dsh-modal-rise-in ${MODAL_ANIM_MS}ms cubic-bezier(0.2, 0.8, 0.2, 1) backwards;
  animation-delay: 60ms;
}
.dsh-modal-mask-in { animation: dsh-modal-mask-in ${MODAL_ANIM_MS}ms ease; }
.dsh-modal-mask-out { animation: dsh-modal-mask-out ${MODAL_ANIM_MS}ms ease forwards; }
@media (prefers-reduced-motion: reduce) {
  .dsh-modal-slide-in, .dsh-modal-slide-out, .dsh-modal-side-in, .dsh-modal-side-out,
  .dsh-modal-mask-in, .dsh-modal-mask-out { animation: none; }
  .dsh-modal-slide-in .dsh-modal-stagger, .dsh-modal-side-in .dsh-modal-stagger { animation: none; }
}
`;
function ensureModalAnimStyles() {
  if (typeof document === "undefined") return;
  if (document.getElementById(STYLE_ID) !== null) return;
  const tag = document.createElement("style");
  tag.id = STYLE_ID;
  tag.textContent = SHEET;
  document.head.appendChild(tag);
}
function modalAnimClass(closing) {
  return closing ? "dsh-modal-slide-out" : "dsh-modal-slide-in";
}
function modalMaskAnimClass(closing) {
  return closing ? "dsh-modal-mask-out" : "dsh-modal-mask-in";
}
var modalStaggerClass = "dsh-modal-stagger";
function useModalClose(open, onClose, durationMs = MODAL_ANIM_MS) {
  const [closing, setClosing] = (0, import_react10.useState)(false);
  const timerRef = (0, import_react10.useRef)(null);
  const closingRef = (0, import_react10.useRef)(false);
  (0, import_react10.useLayoutEffect)(() => {
    if (open) {
      closingRef.current = false;
      setClosing(false);
    }
  }, [open]);
  const requestClose = (0, import_react10.useCallback)(() => {
    if (closingRef.current) return;
    closingRef.current = true;
    setClosing(true);
    timerRef.current = window.setTimeout(() => {
      onClose();
    }, durationMs);
  }, [onClose, durationMs]);
  (0, import_react10.useEffect)(() => () => {
    if (timerRef.current !== null) window.clearTimeout(timerRef.current);
  }, []);
  return { closing, requestClose };
}

// src/client/tool-summary/activity-drawer.tsx
var import_jsx_runtime6 = require("react/jsx-runtime");
var DRAWER_ANIM_MS = 420;
var STORE_KEY = "__dshActivityDrawerStore__";
function activityStore() {
  const globalObj = globalThis;
  const existing = globalObj[STORE_KEY];
  if (existing !== void 0) return existing;
  const listeners2 = /* @__PURE__ */ new Set();
  const data = /* @__PURE__ */ new Map();
  let openTurn = null;
  let activeMode = null;
  let previewAnchorEl;
  let previewTurn = null;
  let handlers = { openFile: () => {
  }, inspectCall: () => {
  } };
  const notify = () => {
    for (const fn of [...listeners2]) {
      try {
        fn();
      } catch {
      }
    }
  };
  const store = {
    get openTurn() {
      return openTurn;
    },
    get activeMode() {
      return activeMode;
    },
    get previewAnchorEl() {
      return previewAnchorEl;
    },
    get previewTurn() {
      return previewTurn;
    },
    setPreviewAnchor: (el, turn) => {
      if (previewAnchorEl === el && previewTurn === turn) return;
      previewAnchorEl = el;
      previewTurn = turn;
      notify();
    },
    open: (turn, mode) => {
      try {
        ensureDrawerMounted();
      } catch (healError) {
        console.warn("[dsh-chat-flow] \u5F39\u7A97 open \u524D\u81EA\u6108\u6302\u8F7D\u5931\u8D25\uFF1A", healError);
      }
      openTurn = turn;
      activeMode = mode;
      notify();
      if (listeners2.size === 0) {
        try {
          mountActivityDrawer(true);
        } catch (healError) {
          console.warn("[dsh-chat-flow] \u5F39\u7A97\u65E0\u8BA2\u9605\u8005\u5F3A\u5236\u91CD\u6302\u5931\u8D25\uFF1A", healError);
        }
      }
      try {
        console.log("[dsh-chat-flow] \u5F39\u7A97 open\uFF1A\u7B2C " + turn + " \u8F6E / " + mode);
      } catch {
      }
    },
    close: (reason) => {
      void reason;
      openTurn = null;
      activeMode = null;
      notify();
    },
    setReasoning: (turn, items) => {
      data.set(turn, { ...data.get(turn) ?? {}, reasoning: items });
      notify();
    },
    setTools: (turn, nodes, cwd, turnStart) => {
      data.set(turn, { ...data.get(turn) ?? {}, tools: nodes, toolsCwd: cwd, turnStart });
      notify();
    },
    setHandlers: (next) => {
      handlers = next;
    },
    subscribe: (fn) => {
      listeners2.add(fn);
      return () => {
        listeners2.delete(fn);
      };
    },
    get: (turn) => data.get(turn),
    getLatestTurn: () => {
      const keys = [...data.keys()];
      return keys.length > 0 ? Math.max(...keys) : 1;
    },
    clear: () => {
      data.clear();
      openTurn = null;
      activeMode = null;
      previewAnchorEl = void 0;
      previewTurn = null;
      notify();
    },
    handlers: () => handlers
  };
  globalObj[STORE_KEY] = store;
  return store;
}
function useDrawerOpen(turn) {
  const store = activityStore();
  return (0, import_react11.useSyncExternalStore)(store.subscribe, () => store.openTurn === turn);
}
function DrawerToolSummary({ stats, cwd, openFile, kinds }) {
  return /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("div", { className: "dts__summary", children: [
    /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("div", { className: "dts__summary-title", children: [
      /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(import_dsh_client_ui_primitives4.IconApiOutline14, { size: 13, "aria-hidden": true }),
      " \u5DE5\u5177\u8C03\u7528\u603B\u7ED3"
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("div", { className: "dts__summary-line", children: [
      "\u5171 ",
      /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("b", { children: stats.total }),
      " \u6B21\u8C03\u7528",
      stats.running > 0 && /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)(import_jsx_runtime6.Fragment, { children: [
        " \xB7 ",
        /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("b", { children: stats.running }),
        " \u6B21\u8FDB\u884C\u4E2D"
      ] }),
      stats.errors > 0 && /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)(import_jsx_runtime6.Fragment, { children: [
        " \xB7 ",
        /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("span", { className: "dts__summary-errors", children: [
          /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("b", { children: stats.errors }),
          " \u6B21\u5931\u8D25"
        ] })
      ] })
    ] }),
    stats.byTool.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("div", { className: "dts__chips", children: stats.byTool.map(({ name, count }) => /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("span", { className: "dts__chip", "data-tool": name, "data-kind": kinds.get(name)?.key, children: [
      name,
      " \xD7",
      count
    ] }, name)) }),
    stats.files.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("div", { className: "dts__files", children: stats.files.map((path) => {
      const url = isUrlEntry(path);
      return /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(
        "button",
        {
          type: "button",
          className: "dts__file",
          title: path,
          onClick: () => {
            if (url) window.open(path, "_blank", "noopener,noreferrer");
            else openFile(path);
          },
          children: shortenEntry(path, cwd)
        },
        path
      );
    }) })
  ] });
}
function ReasoningGroups({ items, activeIndex }) {
  const groups = (0, import_react11.useMemo)(() => groupReasoning(items), [items]);
  let cursor = 0;
  return /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("div", { className: "dts__modal-reasoning", children: groups.map((group) => {
    const firstIndex = cursor;
    cursor += group.items.length;
    return /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("div", { className: "dts__modal-reasoning-group", "data-reasoning-category": group.category.label, children: [
      /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("div", { className: "dts__modal-reasoning-group-title", children: [
        /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(KindIcon, { kind: group.category.icon, size: 12 }),
        " ",
        group.category.label,
        " (",
        group.items.length,
        ")"
      ] }),
      group.items.map((item) => {
        const globalIndex = firstIndex + group.items.indexOf(item);
        return /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(
          "div",
          {
            "data-reasoning-index": globalIndex,
            "data-active": activeIndex === globalIndex || void 0,
            className: "dts__modal-reasoning-item",
            "data-running": item.running || void 0,
            children: /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("span", { className: "dts__modal-reasoning-item-text", children: item.text })
          },
          globalIndex
        );
      })
    ] }, group.category.label);
  }) });
}
function DrawerPanel({ turn, data, store, openFile, inspectCall, closing }) {
  const reasoning = data?.reasoning ?? [];
  const toolNodes = data?.tools ?? [];
  const blocks = (0, import_react11.useMemo)(() => toolNodes.map((node) => node.data.root), [toolNodes]);
  const stats = (0, import_react11.useMemo)(() => computeStats(blocks), [blocks]);
  const kinds = (0, import_react11.useMemo)(() => kindByToolName(blocks), [blocks]);
  const close = () => {
    store.close();
  };
  const mode = store.activeMode;
  const [tab, setTab] = (0, import_react11.useState)(mode ?? (reasoning.length > 0 ? "reasoning" : "tools"));
  (0, import_react11.useEffect)(() => {
    if (mode !== null) setTab(mode);
  }, [mode]);
  const showTabs = reasoning.length > 0 && toolNodes.length > 0;
  const reasoningRunning = reasoning.some((item) => item.running);
  const toolsRunning = stats.running > 0;
  const anyRunning = reasoningRunning || toolsRunning;
  const now = useNow(anyRunning);
  const turnStart = data?.turnStart;
  const elapsed = turnStart !== void 0 ? Math.max(0, now - turnStart) : void 0;
  const toolsElapsed = (0, import_react11.useMemo)(() => {
    let earliest;
    for (const node of toolNodes) {
      const block = node.data.root;
      if (isRunning(block) && (earliest === void 0 || block.time < earliest)) earliest = block.time;
    }
    return earliest !== void 0 ? Math.max(0, now - earliest) : void 0;
  }, [toolNodes, now]);
  const scrollRef = (0, import_react11.useRef)(null);
  const pinnedRef = (0, import_react11.useRef)(true);
  const onScrollPin = (0, import_react11.useCallback)((event) => {
    const el = event.currentTarget;
    pinnedRef.current = el.scrollHeight - el.scrollTop - el.clientHeight <= 24;
  }, []);
  (0, import_react11.useEffect)(() => {
    if (!anyRunning) return;
    const el = scrollRef.current;
    if (el === null) return;
    const distance = el.scrollHeight - el.scrollTop - el.clientHeight;
    if (!pinnedRef.current && distance > 24) return;
    el.scrollTop = el.scrollHeight;
  }, [anyRunning, now, reasoning, toolNodes]);
  const [activeIndex] = (0, import_react11.useState)(null);
  return /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)(import_jsx_runtime6.Fragment, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("div", { className: `dts__dialog-mask ${modalMaskAnimClass(closing)}`, onClick: close, "aria-hidden": true }),
    /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("div", { className: `dts__dialog ${modalAnimClass(closing)}`, role: "dialog", "aria-modal": "true", "aria-label": `\u7B2C ${turn} \u8F6E\u6D3B\u52A8\u8BE6\u60C5`, children: [
      /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("header", { className: "dts__modal-head", children: [
        /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("span", { className: "dts__modal-title", children: [
          "\u7B2C ",
          turn,
          " \u8F6E",
          !showTabs && tab === "reasoning" && /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)(import_jsx_runtime6.Fragment, { children: [
            " \xB7 ",
            /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(import_dsh_client_ui_primitives4.IconThinkOutline14, { size: 14, "aria-hidden": true }),
            " ",
            reasoning.length
          ] }),
          !showTabs && tab === "tools" && /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)(import_jsx_runtime6.Fragment, { children: [
            " \xB7 ",
            /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(import_dsh_client_ui_primitives4.IconApiOutline14, { size: 14, "aria-hidden": true }),
            " ",
            toolNodes.length
          ] })
        ] }),
        showTabs && /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("span", { className: "dts__tabs", role: "tablist", "aria-label": "\u5206\u533A", children: [
          /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)(
            "button",
            {
              type: "button",
              role: "tab",
              "aria-selected": tab === "reasoning",
              className: "dts__tab",
              "data-active": tab === "reasoning" || void 0,
              onClick: () => {
                setTab("reasoning");
              },
              children: [
                /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(import_dsh_client_ui_primitives4.IconThinkOutline14, { size: 13, "aria-hidden": true }),
                " ",
                reasoning.length,
                " \u6B21\u601D\u8003"
              ]
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)(
            "button",
            {
              type: "button",
              role: "tab",
              "aria-selected": tab === "tools",
              className: "dts__tab",
              "data-active": tab === "tools" || void 0,
              onClick: () => {
                setTab("tools");
              },
              children: [
                /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(import_dsh_client_ui_primitives4.IconApiOutline14, { size: 13, "aria-hidden": true }),
                " \u5DE5\u5177 ",
                toolNodes.length
              ]
            }
          )
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("button", { type: "button", className: "dts__modal-close", onClick: close, "aria-label": "\u5173\u95ED", children: /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("svg", { width: "12", height: "12", viewBox: "0 0 12 12", fill: "none", stroke: "currentColor", strokeWidth: "1.5", strokeLinecap: "round", children: /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("path", { d: "M2.5 2.5l7 7M9.5 2.5l-7 7" }) }) })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("div", { className: `dts__modal-scroll ${modalStaggerClass}`, ref: scrollRef, onScroll: onScrollPin, children: [
        tab === "reasoning" && reasoning.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("div", { className: "dts__modal-panel", children: [
          /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("header", { className: "dts__modal-panel-head", children: [
            /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("span", { className: "dts__modal-panel-title", children: [
              /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(import_dsh_client_ui_primitives4.IconThinkOutline14, { size: 14, "aria-hidden": true }),
              " \u601D\u8003\u8FC7\u7A0B"
            ] }),
            reasoningRunning && elapsed !== void 0 && /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("span", { className: "dts__modal-panel-live", children: [
              "\u601D\u8003\u4E2D \xB7 ",
              formatDuration(elapsed)
            ] })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(ReasoningGroups, { items: reasoning, activeIndex })
        ] }),
        tab === "tools" && toolNodes.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("div", { className: "dts__modal-panel", children: [
          /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("header", { className: "dts__modal-panel-head", children: [
            /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("span", { className: "dts__modal-panel-title", children: [
              /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(import_dsh_client_ui_primitives4.IconApiOutline14, { size: 14, "aria-hidden": true }),
              " \u5DE5\u5177\u8C03\u7528"
            ] }),
            toolsRunning && toolsElapsed !== void 0 && /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("span", { className: "dts__modal-panel-live", children: [
              "\u8FDB\u884C\u4E2D \xB7 ",
              formatDuration(toolsElapsed)
            ] })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(DrawerToolSummary, { stats, cwd: data?.toolsCwd, openFile, kinds }),
          /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("div", { className: "dts__modal-tools", children: toolNodes.map((node) => /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(
            ToolCallTreeList,
            {
              block: node.data.root,
              cwd: data?.toolsCwd,
              openFile,
              inspectCall
            },
            node.key
          )) })
        ] }),
        tab === "reasoning" && reasoning.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("div", { className: "dts__empty", children: "\u8FD9\u4E00\u8F6E\u6CA1\u6709\u53EF\u663E\u793A\u7684\u601D\u8003\u8FC7\u7A0B" }),
        tab === "tools" && toolNodes.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("div", { className: "dts__empty", children: "\u8FD9\u4E00\u8F6E\u6CA1\u6709\u53EF\u663E\u793A\u7684\u5DE5\u5177\u8C03\u7528" })
      ] })
    ] })
  ] });
}
function DrawerApp() {
  const [openTurn, setOpenTurn] = (0, import_react11.useState)(null);
  const [lastTurn, setLastTurn] = (0, import_react11.useState)(null);
  const [openMode, setOpenMode] = (0, import_react11.useState)(null);
  const [data, setData] = (0, import_react11.useState)(void 0);
  const [closing, setClosing] = (0, import_react11.useState)(false);
  const openTurnRef = (0, import_react11.useRef)(null);
  const closeTimerRef = (0, import_react11.useRef)(void 0);
  (0, import_react11.useEffect)(() => () => {
    if (closeTimerRef.current !== void 0) window.clearTimeout(closeTimerRef.current);
  }, []);
  (0, import_react11.useEffect)(() => {
    const store2 = activityStore();
    const render2 = () => {
      const turn2 = store2.openTurn;
      if (turn2 === null) {
        if (openTurnRef.current !== null) {
          openTurnRef.current = null;
          if (closeTimerRef.current !== void 0) window.clearTimeout(closeTimerRef.current);
          setOpenTurn(null);
          setClosing(true);
          closeTimerRef.current = window.setTimeout(() => {
            setClosing(false);
          }, DRAWER_ANIM_MS);
        }
        return;
      }
      openTurnRef.current = turn2;
      if (closeTimerRef.current !== void 0) {
        window.clearTimeout(closeTimerRef.current);
        closeTimerRef.current = void 0;
      }
      setOpenTurn(turn2);
      setClosing(false);
      setLastTurn(turn2);
      setOpenMode(store2.activeMode);
      setData(store2.get(turn2));
    };
    render2();
    return store2.subscribe(render2);
  }, []);
  (0, import_react11.useEffect)(() => {
    if (openTurn === null) return;
    const onKey = (event) => {
      if (event.key === "Escape") activityStore().close();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
    };
  }, [openTurn]);
  const [preview, setPreview] = (0, import_react11.useState)(null);
  const [reclaimPreview, setReclaimPreview] = (0, import_react11.useState)(null);
  const reclaimTimerRef = (0, import_react11.useRef)(void 0);
  const previewRef = (0, import_react11.useRef)(null);
  previewRef.current = preview;
  (0, import_react11.useEffect)(() => () => {
    if (reclaimTimerRef.current !== void 0) window.clearTimeout(reclaimTimerRef.current);
  }, []);
  (0, import_react11.useEffect)(() => {
    const store2 = activityStore();
    const sameItems = (a, b) => a.length === b.length && a.every((entry, idx) => entry.text === b[idx]?.text && entry.running === b[idx]?.running && entry.step === b[idx]?.step);
    const update = () => {
      const el = store2.previewAnchorEl;
      const turn2 = store2.previewTurn;
      const turnData = turn2 === null ? void 0 : store2.get(turn2);
      const reasoning = turnData?.reasoning ?? [];
      const items = [];
      for (let index = 0; index < reasoning.length; index += 1) {
        const item = reasoning[index];
        if (item === void 0 || item.text === "") continue;
        items.push({
          text: item.text,
          step: item.step ?? index + 1,
          running: item.running
        });
      }
      const usable = el !== void 0 && el.isConnected && turn2 !== null && items.length > 0;
      if (!usable) {
        if (reclaimTimerRef.current !== void 0) return;
        const prev2 = previewRef.current;
        if (prev2 === null) return;
        setReclaimPreview({ top: prev2.top, left: prev2.left, turn: prev2.turn, items: prev2.items });
        reclaimTimerRef.current = window.setTimeout(() => {
          reclaimTimerRef.current = void 0;
          setReclaimPreview(null);
        }, LIVE_RECLAIM_UNMOUNT_MS);
        setPreview(null);
        return;
      }
      const box = el.getBoundingClientRect();
      if (box.bottom < 0 || box.top > window.innerHeight) return;
      const top = box.bottom + 2;
      const left = el.getBoundingClientRect().left;
      setReclaimPreview(null);
      if (reclaimTimerRef.current !== void 0) {
        window.clearTimeout(reclaimTimerRef.current);
        reclaimTimerRef.current = void 0;
      }
      const prev = previewRef.current;
      if (prev !== null && prev.turn === turn2 && prev.top === top && prev.left === left && sameItems(prev.items, items)) return;
      setPreview({ top, left, turn: turn2, items });
    };
    update();
    const unsubscribe = store2.subscribe(() => {
      update();
    });
    const onMove = () => {
      requestAnimationFrame(update);
    };
    window.addEventListener("scroll", onMove, { passive: true, capture: true });
    window.addEventListener("resize", onMove);
    const id = window.setInterval(update, 500);
    return () => {
      unsubscribe();
      window.removeEventListener("scroll", onMove, { capture: true });
      window.removeEventListener("resize", onMove);
      window.clearInterval(id);
    };
  }, []);
  const floating = preview !== null ? { ...preview, closing: false } : reclaimPreview !== null ? { ...reclaimPreview, closing: true } : null;
  const floatingNode = floating === null ? null : /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("div", { className: "dts__preview-stack", style: { position: "fixed", top: floating.top, left: floating.left }, "aria-live": "polite", children: /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(LiveThinkingStack, { items: floating.items, closing: floating.closing, compact: true }, floating.turn) });
  const store = activityStore();
  const shownTurn = openTurn ?? lastTurn;
  if (shownTurn === null || openTurn === null && !closing) {
    return floatingNode;
  }
  const turn = shownTurn;
  const handlers = store.handlers();
  const closeAll = () => {
    store.close();
  };
  return /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)(import_jsx_runtime6.Fragment, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(
      ErrorBoundary,
      {
        label: "\u6D3B\u52A8\u5F39\u7A97\uFF08\u7B2C " + turn + " \u8F6E\uFF09",
        fallback: /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)(
          "div",
          {
            className: "dts__dialog",
            role: "dialog",
            "aria-modal": "true",
            "aria-label": "\u7B2C " + turn + " \u8F6E\u6D3B\u52A8\u8BE6\u60C5",
            children: [
              /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("header", { className: "dts__modal-head", children: [
                /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("span", { className: "dts__modal-title", children: [
                  "\u7B2C ",
                  turn,
                  " \u8F6E"
                ] }),
                /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("button", { type: "button", className: "dts__modal-close", onClick: closeAll, "aria-label": "\u5173\u95ED", children: /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("svg", { width: "12", height: "12", viewBox: "0 0 12 12", fill: "none", stroke: "currentColor", strokeWidth: "1.5", strokeLinecap: "round", children: /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("path", { d: "M2.5 2.5l7 7M9.5 2.5l-7 7" }) }) })
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("div", { className: "dts__modal-scroll", children: /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("div", { className: "dts__empty", children: "\u5F39\u7A97\u6E32\u67D3\u5931\u8D25\uFF0C\u8BE6\u60C5\u89C1\u63A7\u5236\u53F0\uFF08F12\uFF09\u3002\u5173\u95ED\u540E\u6362\u4E00\u8F6E\u91CD\u5F00\u53EF\u91CD\u8BD5\u3002" }) })
            ]
          }
        ),
        children: /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(
          DrawerPanel,
          {
            turn,
            data,
            store,
            openFile: handlers.openFile,
            inspectCall: handlers.inspectCall,
            closing
          }
        )
      },
      turn + ":" + (openMode ?? "")
    ),
    floatingNode
  ] });
}
var mounted = false;
var drawerRoot = null;
var mountGen = 0;
function ensureDrawerMounted() {
  if (typeof document === "undefined") return;
  const host = document.getElementById("dsh-activity-drawer-root");
  if (host !== null && host.childNodes.length > 0) return;
  mountActivityDrawer();
}
function mountActivityDrawer(force) {
  if (typeof document === "undefined") return;
  let host = document.getElementById("dsh-activity-drawer-root");
  if (!force && host !== null && host.childNodes.length > 0) {
    mounted = true;
    return;
  }
  if (host === null) {
    host = document.createElement("div");
    host.id = "dsh-activity-drawer-root";
    document.body.appendChild(host);
  }
  try {
    drawerRoot?.unmount();
  } catch {
  }
  drawerRoot = (0, import_client.createRoot)(host);
  mountGen += 1;
  const gen = mountGen;
  drawerRoot.render(
    /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(
      ErrorBoundary,
      {
        label: "\u6D3B\u52A8\u62BD\u5C49\u6839",
        fallback: null,
        onError: () => {
          try {
            console.error("[dsh-chat-flow] \u6D3B\u52A8\u62BD\u5C49\u6839\u5D29\u6E83\uFF0C\u6B63\u5728\u81EA\u6108\u91CD\u6302\u2026");
          } catch {
          }
          queueMicrotask(() => {
            try {
              mountActivityDrawer();
            } catch (remountError) {
              try {
                console.error("[dsh-chat-flow] \u6D3B\u52A8\u62BD\u5C49\u6839\u81EA\u6108\u91CD\u6302\u5931\u8D25\uFF1A", remountError);
              } catch {
              }
            }
          });
        },
        children: /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(DrawerApp, {})
      },
      gen
    )
  );
  mounted = true;
  try {
    ;
    globalThis.__dshChatFlowDrawer = {
      remount: mountActivityDrawer,
      ensure: ensureDrawerMounted,
      store: activityStore()
    };
  } catch {
  }
}

// src/client/thinking/ThinkingStepNodeView.tsx
var import_react16 = require("react");
var import_dsh_client_ui_primitives5 = require("@deepseek-ai/dsh-client-ui-primitives");

// src/client/flow-card.tsx
var import_jsx_runtime7 = require("react/jsx-runtime");
function formatSpan(ms) {
  if (!Number.isFinite(ms) || ms < 0) return "";
  const seconds = ms / 1e3;
  if (seconds < 10) return `${Math.round(seconds * 10) / 10}s`;
  if (seconds < 60) return `${Math.round(seconds)}s`;
  const minutes = Math.floor(seconds / 60);
  const rest = Math.round(seconds - minutes * 60);
  if (minutes < 60) return `${minutes}m${rest.toString().padStart(2, "0")}s`;
  const hours = Math.floor(minutes / 60);
  return `${hours}h${(minutes % 60).toString().padStart(2, "0")}m`;
}
function CheckIcon() {
  return /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("svg", { width: "12", height: "12", viewBox: "0 0 12 12", "aria-hidden": true, children: /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("path", { d: "M2.5 6.4 4.7 8.6 9.5 3.8", fill: "none", stroke: "currentColor", strokeWidth: "1.6", strokeLinecap: "round", strokeLinejoin: "round" }) });
}
function Chip({ label, value, kind: kind2, title }) {
  return /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("span", { className: "dtt__card-chip", "data-kind": kind2, title: title ?? `${label} ${value}`, children: [
    /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("span", { className: "dtt__card-chip-label", children: label }),
    /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("span", { className: "dtt__card-chip-value", children: value })
  ] });
}
function FlowCard({ variant, meta, interrupted, children }) {
  if (variant === "step") {
    return /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("div", { className: "dtt__card dtt__card--step", children });
  }
  const duration = meta?.durationMs !== void 0 && meta.durationMs > 0 ? formatSpan(meta.durationMs) : "";
  const steps = meta?.steps ?? 0;
  const git = meta?.git;
  const gitDetail = meta?.gitDetail;
  return /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)(
    "div",
    {
      className: "dtt__card dtt__card--reply",
      "data-interrupted": interrupted === true ? "" : void 0,
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)(
          "div",
          {
            className: "dtt__card-head",
            onClick: () => {
              if (meta?.turnNumber !== void 0 && typeof document !== "undefined" && document.body.hasAttribute("data-dsh-kr-chat")) {
                const s = getKrChatStore();
                s.setSelectedTurn(meta.turnNumber);
                s.setPanelOpen(true);
              }
            },
            title: meta?.turnNumber !== void 0 ? `\u70B9\u51FB\u5728\u53F3\u4FA7\u5927\u76D8\u67E5\u770B\u7B2C ${meta.turnNumber} \u8F6E\u8BE6\u7EC6\u8F68\u8FF9` : void 0,
            style: { cursor: meta?.turnNumber !== void 0 ? "pointer" : void 0 },
            children: [
              /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("span", { className: "dtt__card-badge", "data-interrupted": interrupted === true ? "" : void 0, children: [
                /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(CheckIcon, {}),
                interrupted === true ? "\u5DF2\u4E2D\u65AD" : "\u672C\u8F6E\u5B8C\u6210"
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("span", { className: "dtt__card-chips", children: [
                duration !== "" && /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(Chip, { label: "\u7528\u65F6", value: duration, kind: "time" }),
                steps > 1 && /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(Chip, { label: "\u6B65\u9AA4", value: String(steps), kind: "steps" }),
                git !== void 0 && git > 0 && /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(Chip, { label: "Git", value: String(git), kind: "git", title: gitDetail !== void 0 && gitDetail !== "" ? `Git \u64CD\u4F5C ${git} \u6B21\uFF08${gitDetail}\uFF09` : `Git \u64CD\u4F5C ${git} \u6B21` })
              ] })
            ]
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("div", { className: "dtt__card-body", children })
      ]
    }
  );
}

// src/client/diagram/parse.ts
var TICK = String.fromCharCode(96);
var FENCE = new RegExp(TICK.repeat(3) + "diagram\\s*\\n([\\s\\S]*?)" + TICK.repeat(3), "g");
var MAX_NODES = 9;
var MAX_EDGES = 12;
var VW = 800;
var VH = 1e3;
function num(v, lo, hi, fallback) {
  return typeof v === "number" && Number.isFinite(v) ? Math.min(hi, Math.max(lo, v)) : fallback;
}
function str2(v, max) {
  if (typeof v !== "string") return "";
  const t = v.trim();
  return t.length > max ? t.slice(0, max) : t;
}
function asSpec(raw) {
  if (typeof raw !== "object" || raw === null) return void 0;
  const obj = raw;
  if (obj.type !== "flowchart") return void 0;
  const rawNodes = obj.nodes;
  const rawEdges = obj.edges;
  if (!Array.isArray(rawNodes) || rawNodes.length === 0 || rawNodes.length > MAX_NODES) return void 0;
  if (!Array.isArray(rawEdges) || rawEdges.length > MAX_EDGES) return void 0;
  const nodes = [];
  const ids = /* @__PURE__ */ new Set();
  for (const item of rawNodes) {
    if (typeof item !== "object" || item === null) return void 0;
    const it = item;
    if (typeof it.id !== "string" || it.id === "" || ids.has(it.id)) return void 0;
    if (it.shape !== "oval" && it.shape !== "rect" && it.shape !== "diamond") return void 0;
    ids.add(it.id);
    nodes.push({
      id: it.id,
      shape: it.shape,
      x: num(it.x, 0, VW, 0),
      y: num(it.y, 0, VH, 0),
      w: num(it.w, 40, 400, 160),
      h: num(it.h, 32, 200, 56),
      name: str2(it.name, 14),
      sub: str2(it.sub, 24),
      focal: it.focal === true
    });
  }
  const edges = [];
  for (const item of rawEdges) {
    if (typeof item !== "object" || item === null) return void 0;
    const it = item;
    if (typeof it.from !== "string" || typeof it.to !== "string") return void 0;
    if (!ids.has(it.from) || !ids.has(it.to)) return void 0;
    const pts = [];
    if (Array.isArray(it.pts)) {
      for (const p of it.pts) {
        if (!Array.isArray(p) || typeof p[0] !== "number" || typeof p[1] !== "number") return void 0;
        if (!Number.isFinite(p[0]) || !Number.isFinite(p[1])) return void 0;
        pts.push([Math.min(VW, Math.max(0, p[0])), Math.min(VH, Math.max(0, p[1]))]);
      }
    }
    if (pts.length < 2 || pts.length > 8) return void 0;
    edges.push({
      from: it.from,
      to: it.to,
      label: str2(it.label, 8),
      accent: it.accent === true,
      pts
    });
  }
  return {
    title: str2(obj.title, 40) || "\u6D41\u7A0B\u56FE",
    desc: str2(obj.desc, 80),
    size: obj.size === "compact" ? "compact" : "full",
    nodes,
    edges
  };
}
function splitDiagram(text) {
  if (!text.includes("diagram")) return [{ kind: "md", text }];
  const parts = [];
  let cursor = 0;
  FENCE.lastIndex = 0;
  for (; ; ) {
    const match = FENCE.exec(text);
    if (match === null) break;
    const head = text.slice(cursor, match.index);
    if (head !== "") parts.push({ kind: "md", text: head });
    let spec;
    try {
      spec = asSpec(JSON.parse(match[1]));
    } catch {
      spec = void 0;
    }
    if (spec === void 0) {
      parts.push({ kind: "md", text: match[0] });
    } else {
      parts.push({ kind: "diagram", spec });
    }
    cursor = match.index + match[0].length;
  }
  const tail = text.slice(cursor);
  if (tail !== "") parts.push({ kind: "md", text: tail });
  return parts.length > 0 ? parts : [{ kind: "md", text }];
}

// src/client/diagram/DiagramCard.tsx
var import_react12 = require("react");
var import_jsx_runtime8 = require("react/jsx-runtime");
var INK = "var(--dsw-alias-label-primary, #2d3142)";
var MUTED = "var(--dsw-alias-label-secondary, #4f5d75)";
var SOFT = "var(--dsw-alias-label-tertiary, #7a8399)";
var PAPER = "var(--dsw-alias-bg-layer-1, #ffffff)";
var STROKE = "var(--dsw-alias-border-l2, rgba(127,127,127,.35))";
var ACCENT = "#eb6c36";
var ACCENT_TINT = "rgba(235,108,54,.10)";
var SANS = "'Geist','PingFang SC','Microsoft YaHei',sans-serif";
var MONO = "'Geist Mono','PingFang SC','Microsoft YaHei',monospace";
function roundedPath(pts, r) {
  if (pts.length < 2) return "";
  const first = pts[0];
  let d = "M " + first[0] + " " + first[1];
  for (let i = 1; i < pts.length - 1; i += 1) {
    const prev = pts[i - 1];
    const cur = pts[i];
    const next = pts[i + 1];
    const v1x = cur[0] - prev[0];
    const v1y = cur[1] - prev[1];
    const v2x = next[0] - cur[0];
    const v2y = next[1] - cur[1];
    const l1 = Math.hypot(v1x, v1y) || 1;
    const l2 = Math.hypot(v2x, v2y) || 1;
    const rr = Math.min(r, l1 / 2, l2 / 2);
    const p1x = cur[0] - v1x / l1 * rr;
    const p1y = cur[1] - v1y / l1 * rr;
    const p2x = cur[0] + v2x / l2 * rr;
    const p2y = cur[1] + v2y / l2 * rr;
    d += " L " + p1x.toFixed(1) + " " + p1y.toFixed(1) + " Q " + cur[0] + " " + cur[1] + " " + p2x.toFixed(1) + " " + p2y.toFixed(1);
  }
  const last = pts[pts.length - 1];
  return d + " L " + last[0] + " " + last[1];
}
function EdgeView({ edge, marker }) {
  const d = (0, import_react12.useMemo)(() => roundedPath(edge.pts, 8), [edge]);
  const mid = edge.pts[Math.floor(edge.pts.length / 2)];
  const horizontal = edge.pts.length === 2 ? Math.abs(edge.pts[0][1] - edge.pts[1][1]) < 1 : true;
  const color = edge.accent ? ACCENT : void 0;
  return /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)("g", { children: [
    /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("path", { d, fill: "none", stroke: color ?? MUTED, strokeWidth: edge.accent ? 1.4 : 1.2, markerEnd: "url(#" + marker + ")" }),
    edge.label !== "" && horizontal && /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)("g", { children: [
      /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("rect", { x: mid[0] - 18, y: mid[1] - 20, width: 36, height: 12, rx: 2, fill: PAPER }),
      /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("text", { x: mid[0], y: mid[1] - 11, fill: SOFT, fontSize: 8, fontFamily: MONO, textAnchor: "middle", children: edge.label })
    ] })
  ] });
}
function NodeView({ node, compact }) {
  const fill = node.focal ? ACCENT_TINT : PAPER;
  const stroke = node.focal ? ACCENT : STROKE;
  const sw = node.focal ? 1.6 : 1;
  const cx = node.x + node.w / 2;
  const cy = node.y + node.h / 2;
  return /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)("g", { children: [
    node.shape === "diamond" ? /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)("g", { children: [
      /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("polygon", { points: cx + "," + node.y + " " + (node.x + node.w) + "," + cy + " " + cx + "," + (node.y + node.h) + " " + node.x + "," + cy, fill: PAPER }),
      /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("polygon", { points: cx + "," + node.y + " " + (node.x + node.w) + "," + cy + " " + cx + "," + (node.y + node.h) + " " + node.x + "," + cy, fill, stroke, strokeWidth: sw })
    ] }) : /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)("g", { children: [
      /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("rect", { x: node.x, y: node.y, width: node.w, height: node.h, rx: node.shape === "oval" ? Math.min(20, node.h / 2) : 6, fill: PAPER }),
      /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("rect", { x: node.x, y: node.y, width: node.w, height: node.h, rx: node.shape === "oval" ? Math.min(20, node.h / 2) : 6, fill, stroke, strokeWidth: sw })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("text", { x: cx, y: node.shape === "diamond" ? cy + 4 : cy + 2, fill: INK, fontSize: 12, fontWeight: 600, fontFamily: SANS, textAnchor: "middle", children: node.name }),
    !compact && node.shape !== "diamond" && node.sub !== "" && /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("text", { x: cx, y: cy + 18, fill: MUTED, fontSize: 9, fontFamily: MONO, textAnchor: "middle", children: node.sub })
  ] });
}
var DiagramCard = (0, import_react12.memo)(function DiagramCard2({ spec }) {
  const uid = (0, import_react12.useId)().replace(/:/g, "");
  const marker = "dg-arr-" + uid;
  const markerA = "dg-arrA-" + uid;
  const [mode, setMode] = (0, import_react12.useState)(spec.size === "compact" ? "compact" : "full");
  const compact = mode === "compact";
  let minX = Infinity;
  let minY = Infinity;
  let maxX = 0;
  let maxY = 0;
  const eat = (x, y) => {
    if (x < minX) minX = x;
    if (y < minY) minY = y;
    if (x > maxX) maxX = x;
    if (y > maxY) maxY = y;
  };
  for (const n of spec.nodes) {
    eat(n.x, n.y);
    eat(n.x + n.w, n.y + n.h);
  }
  for (const e of spec.edges) for (const p of e.pts) eat(p[0], p[1]);
  const legendY = maxY + 40;
  const shapes = new Set(spec.nodes.map((n) => n.shape));
  const items = [];
  if (shapes.has("oval")) items.push({ kind: "oval", label: "START/END" });
  if (shapes.has("rect")) items.push({ kind: "rect", label: "STEP" });
  if (shapes.has("diamond")) items.push({ kind: "diamond", label: "DECIDE" });
  if (spec.nodes.some((n) => n.focal)) items.push({ kind: "focal", label: "FOCAL" });
  const legendContent = 204 + items.length * 160;
  const contentW = maxX - minX + 48;
  const vbW = Math.ceil(compact ? contentW : Math.max(contentW, legendContent));
  const vx = Math.floor(minX - (vbW - (maxX - minX)) / 2);
  const vy = minY - 16;
  const vbH = Math.min(1200, Math.ceil((compact ? maxY + 24 : legendY + 48) - vy));
  return /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)("figure", { className: "dtt-diagram" + (mode === "compact" ? " dtt-diagram--compact" : mode === "large" ? " dtt-diagram--large" : ""), children: [
    /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("div", { className: "dtt-dg-scale", role: "group", "aria-label": "\u6E32\u67D3\u6BD4\u4F8B", children: [["compact", "\u7D27", "\u7D27\u51D1"], ["full", "\u6807", "\u6807\u51C6"], ["large", "\u5927", "\u653E\u5927"]].map(([value, short, tip]) => /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(
      "button",
      {
        type: "button",
        "aria-pressed": mode === value,
        title: tip,
        onClick: () => {
          setMode(value);
        },
        className: mode === value ? "dtt-dg-scale-btn dtt-dg-scale-btn--active" : "dtt-dg-scale-btn",
        children: short
      },
      value
    )) }),
    /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)("svg", { viewBox: vx + " " + vy + " " + vbW + " " + vbH, style: mode === "large" ? { width: "100%", maxWidth: vbW, margin: "0 auto", minWidth: 1e3 } : { width: "100%", maxWidth: vbW, margin: "0 auto" }, role: "img", "aria-labelledby": uid + "-t " + uid + "-d", children: [
      /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("title", { id: uid + "-t", children: spec.title }),
      /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("desc", { id: uid + "-d", children: spec.desc !== "" ? spec.desc : spec.title }),
      /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)("defs", { children: [
        /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("marker", { id: marker, markerWidth: "8", markerHeight: "6", refX: "7", refY: "3", orient: "auto", children: /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("polygon", { points: "0 0, 8 3, 0 6", fill: MUTED }) }),
        /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("marker", { id: markerA, markerWidth: "8", markerHeight: "6", refX: "7", refY: "3", orient: "auto", children: /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("polygon", { points: "0 0, 8 3, 0 6", fill: ACCENT }) })
      ] }),
      spec.edges.map((e, i) => /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(EdgeView, { edge: e, marker: e.accent ? markerA : marker }, i)),
      spec.nodes.map((n) => /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(NodeView, { node: n, compact }, n.id)),
      !compact && /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)("g", { children: [
        /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("line", { x1: vx + 24, y1: legendY, x2: vx + vbW - 24, y2: legendY, stroke: STROKE, strokeWidth: 0.8 }),
        /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("text", { x: vx + 24, y: legendY + 20, fill: SOFT, fontSize: 8, fontFamily: MONO, letterSpacing: "0.14em", children: "LEGEND" }),
        items.map((it, i) => /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)("g", { transform: "translate(" + (vx + 120 + i * 160) + "," + (legendY + 8) + ")", children: [
          it.kind === "diamond" ? /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("polygon", { points: "20,0 32,10 20,20 8,10", fill: PAPER, stroke: STROKE }) : /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("rect", { x: "0", y: "0", width: "40", height: "20", rx: it.kind === "oval" ? 10 : 6, fill: it.kind === "focal" ? ACCENT_TINT : PAPER, stroke: it.kind === "focal" ? ACCENT : STROKE, strokeWidth: it.kind === "focal" ? 1.6 : 1 }),
          /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("text", { x: "48", y: "14", fill: SOFT, fontSize: 8, fontFamily: MONO, children: it.label })
        ] }, it.kind))
      ] })
    ] })
  ] });
});

// src/client/proto/parse.ts
var TICK2 = String.fromCharCode(96);
var FENCE2 = new RegExp(TICK2.repeat(3) + "proto-tabs\\s*\\n([\\s\\S]*?)" + TICK2.repeat(3), "g");
function asSpec2(raw) {
  if (typeof raw !== "object" || raw === null) return void 0;
  const obj = raw;
  const tabs = obj.tabs;
  if (!Array.isArray(tabs) || tabs.length === 0 || tabs.length > 4) return void 0;
  const clean = [];
  for (const item of tabs) {
    if (typeof item !== "object" || item === null) return void 0;
    const it = item;
    const pill = it.pill;
    if (typeof it.label !== "string" || typeof it.heading !== "string") return void 0;
    if (typeof pill !== "object" || pill === null) return void 0;
    if (typeof pill.tag !== "string" || typeof pill.desc !== "string" || typeof pill.detail !== "string") return void 0;
    const minis = Array.isArray(it.minis) ? it.minis : [];
    if (minis.length > 4) return void 0;
    const minisClean = [];
    for (const m of minis) {
      if (typeof m !== "object" || m === null) return void 0;
      const mm = m;
      if (typeof mm.t !== "string" || typeof mm.d !== "string") return void 0;
      minisClean.push({ t: mm.t, d: mm.d });
    }
    const variant = it.variant;
    clean.push({
      label: it.label,
      heading: it.heading,
      variant: variant === "pill" || variant === "expand" || variant === "glow" ? variant : void 0,
      pill: { tag: pill.tag, desc: pill.desc, detail: pill.detail },
      minis: minisClean
    });
  }
  return {
    title: typeof obj.title === "string" && obj.title !== "" ? obj.title : "\u4EA4\u4E92\u5F0F\u539F\u578B",
    tabs: clean
  };
}
function splitProtoTabs(text) {
  if (!text.includes("proto-tabs")) return [{ kind: "md", text }];
  const parts = [];
  let cursor = 0;
  FENCE2.lastIndex = 0;
  for (; ; ) {
    const match = FENCE2.exec(text);
    if (match === null) break;
    const head = text.slice(cursor, match.index);
    if (head !== "") parts.push({ kind: "md", text: head });
    let spec;
    try {
      spec = asSpec2(JSON.parse(match[1]));
    } catch {
      spec = void 0;
    }
    if (spec === void 0) {
      parts.push({ kind: "md", text: match[0] });
    } else {
      parts.push({ kind: "card", spec });
    }
    cursor = match.index + match[0].length;
  }
  const tail = text.slice(cursor);
  if (tail !== "") parts.push({ kind: "md", text: tail });
  return parts.length > 0 ? parts : [{ kind: "md", text }];
}

// src/client/proto/ProtoTabsCard.tsx
var import_react13 = require("react");
var import_jsx_runtime9 = require("react/jsx-runtime");
function variantOf(tab) {
  if (tab.variant !== void 0) return tab.variant;
  return "pill";
}
function Minis({ tab }) {
  if (tab.minis.length === 0) return null;
  return /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("div", { className: "dtt-proto__minis", children: tab.minis.map((m, i) => /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("div", { className: "dtt-proto__mini", children: [
    /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("b", { children: m.t }),
    /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("span", { children: m.d })
  ] }, i)) });
}
var ProtoTabsCard = (0, import_react13.memo)(function ProtoTabsCard2({ spec }) {
  const [active, setActive] = (0, import_react13.useState)(0);
  const [open, setOpen] = (0, import_react13.useState)(false);
  const safeActive = active < spec.tabs.length ? active : 0;
  const tab = spec.tabs[safeActive];
  if (tab === void 0) return null;
  const variant = variantOf(tab);
  const pick = (i) => {
    setActive(i);
    setOpen(false);
  };
  return /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("div", { className: "dtt-proto", children: [
    /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("div", { className: "dtt-proto__head", children: [
      /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("div", { className: "dtt-proto__title", children: [
        /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("span", { className: "dtt-proto__dot", "aria-hidden": true }),
        /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("span", { children: spec.title })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("div", { className: "dtt-proto__tabs", role: "tablist", children: spec.tabs.map((t, i) => /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(
        "button",
        {
          type: "button",
          role: "tab",
          "aria-selected": i === safeActive,
          className: i === safeActive ? "dtt-proto__tab dtt-proto__tab--active" : "dtt-proto__tab",
          onClick: () => {
            pick(i);
          },
          children: t.label
        },
        i
      )) })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("div", { className: "dtt-proto__panel", children: [
      /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("div", { className: "dtt-proto__heading", children: tab.heading }),
      variant === "pill" && /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("div", { children: [
        /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)(
          "div",
          {
            className: open ? "dtt-proto__pill dtt-proto__pill--open" : "dtt-proto__pill",
            onClick: () => {
              setOpen(!open);
            },
            role: "button",
            tabIndex: 0,
            onKeyDown: (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                setOpen(!open);
              }
            },
            children: [
              /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("span", { className: "dtt-proto__bulb", "aria-hidden": true }),
              /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("span", { className: "dtt-proto__tag", children: tab.pill.tag }),
              /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("span", { className: "dtt-proto__desc", children: tab.pill.desc }),
              /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("span", { className: "dtt-proto__arrow", "aria-hidden": true, children: "\u203A" })
            ]
          }
        ),
        open && /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("div", { className: "dtt-proto__detail", children: tab.pill.detail })
      ] }),
      variant === "expand" && /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("div", { className: "dtt-proto__expand", children: [
        /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)(
          "div",
          {
            className: "dtt-proto__expand-head",
            onClick: () => {
              setOpen(!open);
            },
            role: "button",
            tabIndex: 0,
            onKeyDown: (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                setOpen(!open);
              }
            },
            children: [
              /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("span", { className: "dtt-proto__bulb", "aria-hidden": true }),
              /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("span", { className: "dtt-proto__tag", children: tab.pill.tag }),
              /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("span", { className: "dtt-proto__desc", children: tab.pill.desc }),
              /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("span", { className: open ? "dtt-proto__arrow dtt-proto__arrow--open" : "dtt-proto__arrow", "aria-hidden": true, children: "\u203A" })
            ]
          }
        ),
        open && /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("div", { className: "dtt-proto__expand-body", children: tab.pill.detail })
      ] }),
      variant === "glow" && /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("div", { children: [
        /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(
          "div",
          {
            className: "dtt-proto__glow",
            onClick: () => {
              setOpen(!open);
            },
            role: "button",
            tabIndex: 0,
            onKeyDown: (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                setOpen(!open);
              }
            },
            children: /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("div", { className: "dtt-proto__glow-inner", children: [
              /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("span", { className: "dtt-proto__spark", "aria-hidden": true, children: "\u2726" }),
              /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("span", { className: "dtt-proto__tag dtt-proto__tag--dark", children: tab.pill.tag }),
              /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("span", { className: "dtt-proto__desc dtt-proto__desc--dark", children: tab.pill.desc }),
              /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("span", { className: "dtt-proto__arrow dtt-proto__arrow--dark", "aria-hidden": true, children: "\u203A" })
            ] })
          }
        ),
        open && /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("div", { className: "dtt-proto__detail", children: tab.pill.detail })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(Minis, { tab })
    ] }, safeActive),
    /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("div", { className: "dtt-proto__hint", children: "Tab / \u5361\u7247\u90FD\u53EF\u4EE5\u76F4\u63A5\u70B9\u51FB\u4F53\u9A8C" })
  ] });
});

// src/client/generated-images/GeneratedImageStrip.tsx
var import_react14 = require("react");
var import_react_dom = require("react-dom");

// src/client/generated-images/parse.ts
function pushUnique(list, url, model) {
  if (url === "") return;
  if (!list.some((entry) => entry.url === url)) list.push({ url, model });
}
function collectFromData(data, model, list) {
  if (!Array.isArray(data)) return;
  for (const item of data) {
    if (typeof item !== "object" || item === null) continue;
    const record = item;
    if (typeof record.b64_json === "string" && record.b64_json !== "") {
      const b64 = record.b64_json.replace(/\s+/g, "");
      pushUnique(list, `data:image/png;base64,${b64}`, model);
    } else if (typeof record.url === "string" && record.url !== "") {
      pushUnique(list, record.url, model);
    }
  }
}
function parseGeneratedImageText(text) {
  const list = [];
  if (typeof text !== "string" || text.trim() === "") return list;
  let parsed;
  try {
    parsed = JSON.parse(text);
  } catch {
    return list;
  }
  if (typeof parsed !== "object" || parsed === null) return list;
  const record = parsed;
  if (record.ok !== true) return list;
  const model = typeof record.model === "string" && record.model !== "" ? record.model : null;
  const data = record.data;
  if (typeof data === "object" && data !== null) {
    collectFromData(data.data, model, list);
  }
  if (Array.isArray(record.imageUrls)) {
    for (const item of record.imageUrls) {
      if (typeof item === "string" && item !== "") pushUnique(list, item, model);
    }
  }
  for (const key of ["imageUrl", "imageDataUrl"]) {
    const value = record[key];
    if (typeof value === "string" && value !== "") pushUnique(list, value, model);
  }
  return list;
}
var SPILL_LOCATOR_RE = /Full formatted result stored at: ([^\s]+?)\.\s+Use read with offset\/limit/i;
function findSpillLocator(text) {
  if (typeof text !== "string") return void 0;
  const match = SPILL_LOCATOR_RE.exec(text);
  const locator = match?.[1];
  return locator !== void 0 && locator !== "" ? locator : void 0;
}

// src/client/generated-images/GeneratedImageStrip.tsx
var import_jsx_runtime10 = require("react/jsx-runtime");
var NS4 = "dgi";
var cls = {
  strip: `${NS4}__strip`,
  stripMulti: `${NS4}__strip--multi`,
  row: `${NS4}__row`,
  item: `${NS4}__item`,
  thumb: `${NS4}__thumb`,
  badge: `${NS4}__badge`,
  backdrop: `${NS4}__backdrop`,
  stage: `${NS4}__stage`,
  saveButton: `${NS4}__save-button`,
  saveIcon: `${NS4}__save-icon`,
  broken: `${NS4}__broken`,
  full: `${NS4}__full`,
  metaLine: `${NS4}__meta-line`,
  model: `${NS4}__model`,
  hintLine: `${NS4}__hint-line`
};
var L = {
  open: "\u70B9\u51FB\u67E5\u770B\u5927\u56FE",
  broken: "\u56FE\u7247\u52A0\u8F7D\u5931\u8D25",
  lightboxAria: "\u751F\u56FE\u7ED3\u679C",
  save: "\u4FDD\u5B58",
  saving: "\u4FDD\u5B58\u4E2D\u2026",
  saved: "\u5DF2\u4FDD\u5B58",
  saveFailed: "\u4FDD\u5B58\u5931\u8D25",
  hint: "\u70B9\u51FB\u7A7A\u767D\u5904\u6216\u6309 Esc \u5173\u95ED",
  head: (count) => `\u751F\u56FE\u7ED3\u679C \xB7 ${count} \u5F20`
};
function filenameFrom(url, index) {
  try {
    const last = new URL(url).pathname.split("/").pop() ?? "";
    if (/\.(png|jpe?g|webp|gif)$/i.test(last)) return last;
  } catch {
  }
  return `gallery-${index + 1}.png`;
}
async function downloadFallback(url, filename) {
  try {
    const response = await fetch(url, { mode: "cors" });
    if (!response.ok) return false;
    const blob = await response.blob();
    if (blob.size === 0) return false;
    const objectUrl = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = objectUrl;
    anchor.download = filename;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    setTimeout(() => URL.revokeObjectURL(objectUrl), 6e4);
    return true;
  } catch {
    return false;
  }
}
async function saveImage(url, filename) {
  if (typeof window.showSaveFilePicker === "function") {
    let handle;
    try {
      handle = await window.showSaveFilePicker({ suggestedName: filename });
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return "canceled";
      return await downloadFallback(url, filename) ? "saved" : "failed";
    }
    try {
      const response = await fetch(url, { mode: "cors" });
      if (!response.ok) return await downloadFallback(url, filename) ? "saved" : "failed";
      const blob = await response.blob();
      if (blob.size === 0) return await downloadFallback(url, filename) ? "saved" : "failed";
      const writable = await handle.createWritable();
      await writable.write(blob);
      await writable.close();
      return "saved";
    } catch {
      return await downloadFallback(url, filename) ? "saved" : "failed";
    }
  }
  return await downloadFallback(url, filename) ? "saved" : "failed";
}
function GeneratedImageStrip({ images, model }) {
  const [openIndex, setOpenIndex] = (0, import_react14.useState)(null);
  const [broken, setBroken] = (0, import_react14.useState)(/* @__PURE__ */ new Set());
  const [saveState, setSaveState] = (0, import_react14.useState)("idle");
  (0, import_react14.useEffect)(() => {
    injectGalleryStyles();
  }, []);
  (0, import_react14.useEffect)(() => {
    if (openIndex === null) return;
    const onKey = (event) => {
      if (event.key === "Escape") setOpenIndex(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [openIndex]);
  const open = openIndex !== null ? images[openIndex] : void 0;
  const onSave = async () => {
    if (open === void 0 || saveState === "saving") return;
    setSaveState("saving");
    const result = await saveImage(open, filenameFrom(open, openIndex));
    setSaveState(result === "canceled" ? "idle" : result);
  };
  const markBroken = (index) => {
    setBroken((prev) => new Set(prev).add(index));
  };
  const multi = images.length > 1;
  return /* @__PURE__ */ (0, import_jsx_runtime10.jsxs)("div", { className: `${cls.strip}${multi ? ` ${cls.stripMulti}` : ""}`, children: [
    /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("div", { className: cls.row, children: images.map((url, index) => /* @__PURE__ */ (0, import_jsx_runtime10.jsxs)(
      "button",
      {
        type: "button",
        className: cls.item,
        onClick: () => {
          setOpenIndex(index);
          setSaveState("idle");
        },
        title: L.open,
        children: [
          /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(
            "img",
            {
              src: url,
              alt: `${L.head(images.length)} ${index + 1}`,
              loading: "lazy",
              decoding: "async",
              referrerPolicy: "no-referrer",
              draggable: false,
              className: cls.thumb,
              onError: () => markBroken(index)
            }
          ),
          multi && /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("span", { className: cls.badge, children: index + 1 })
        ]
      },
      `${url.slice(0, 48)}:${index}`
    )) }),
    open !== void 0 && (0, import_react_dom.createPortal)(
      /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(
        "div",
        {
          className: cls.backdrop,
          role: "dialog",
          "aria-modal": "true",
          "aria-label": `${L.lightboxAria} ${openIndex + 1}`,
          onClick: () => setOpenIndex(null),
          children: /* @__PURE__ */ (0, import_jsx_runtime10.jsxs)("div", { className: cls.stage, onClick: (event) => event.stopPropagation(), children: [
            /* @__PURE__ */ (0, import_jsx_runtime10.jsxs)(
              "button",
              {
                type: "button",
                className: cls.saveButton,
                onClick: (event) => {
                  event.stopPropagation();
                  void onSave();
                },
                disabled: saveState === "saving",
                "aria-label": L.save,
                children: [
                  /* @__PURE__ */ (0, import_jsx_runtime10.jsxs)("svg", { className: cls.saveIcon, viewBox: "0 0 16 16", width: "14", height: "14", "aria-hidden": "true", children: [
                    /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("path", { d: "M8 1v8m0 0L4.5 5.5M8 9l3.5-3.5", stroke: "currentColor", strokeWidth: "2", fill: "none", strokeLinecap: "round", strokeLinejoin: "round" }),
                    /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("path", { d: "M2.5 11.5v2h11v-2", stroke: "currentColor", strokeWidth: "2", fill: "none", strokeLinecap: "round" })
                  ] }),
                  /* @__PURE__ */ (0, import_jsx_runtime10.jsxs)("span", { children: [
                    saveState === "idle" && L.save,
                    saveState === "saving" && L.saving,
                    saveState === "saved" && L.saved,
                    saveState === "failed" && L.saveFailed
                  ] })
                ]
              }
            ),
            broken.has(openIndex) ? /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("div", { className: cls.broken, children: L.broken }) : /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(
              "img",
              {
                src: open,
                alt: `${L.lightboxAria} ${openIndex + 1}`,
                className: cls.full,
                onError: () => markBroken(openIndex)
              }
            ),
            /* @__PURE__ */ (0, import_jsx_runtime10.jsxs)("div", { className: cls.metaLine, children: [
              /* @__PURE__ */ (0, import_jsx_runtime10.jsxs)("span", { children: [
                "#",
                openIndex + 1
              ] }),
              model !== null && model !== void 0 && model !== "" && /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("span", { className: cls.model, children: model })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("div", { className: cls.hintLine, children: L.hint })
          ] })
        }
      ),
      document.body
    )
  ] });
}

// src/client/generated-images/use-generated-images.ts
var import_react15 = require("react");
var EMPTY2 = { urls: [], model: null };
var inlineCache = /* @__PURE__ */ new WeakMap();
var spillCache = /* @__PURE__ */ new Map();
var spillPending = /* @__PURE__ */ new Map();
function collectBlocks(root) {
  const out = [root];
  for (const child of root.subCalls) out.push(...collectBlocks(child));
  return out;
}
function inlineOf(block) {
  const hit = inlineCache.get(block);
  if (hit !== void 0) return hit;
  const entries = parseGeneratedImageText(resultText(block));
  inlineCache.set(block, entries);
  return entries;
}
async function loadSpill(callId, locator) {
  const hit = spillCache.get(callId);
  if (hit !== void 0) return hit;
  const running = spillPending.get(callId);
  if (running !== void 0) {
    await running;
    return spillCache.get(callId) ?? EMPTY2;
  }
  const pending = (async () => {
    let state = EMPTY2;
    try {
      const response = await fetch(
        `/api/chat-flow/generated-images?file=${encodeURIComponent(locator)}`
      );
      const data = response.ok ? await response.json() : null;
      if (typeof data === "object" && data !== null) {
        const record = data;
        const urls = Array.isArray(record.urls) ? record.urls.filter((url) => typeof url === "string" && url !== "") : [];
        state = {
          urls,
          model: typeof record.model === "string" && record.model !== "" ? record.model : null
        };
      }
    } catch {
      state = EMPTY2;
    }
    spillCache.set(callId, state);
  })();
  spillPending.set(callId, pending);
  await pending;
  spillPending.delete(callId);
  return spillCache.get(callId) ?? EMPTY2;
}
function mergeImages(states) {
  const urls = [];
  let model = null;
  for (const state of states) {
    for (const url of state.urls) if (!urls.includes(url)) urls.push(url);
    if (model === null && state.model !== null) model = state.model;
  }
  return { urls, model };
}
function useGeneratedImages(toolNodes) {
  const scan = (0, import_react15.useMemo)(() => {
    const inline = [];
    const locators = [];
    for (const tool of toolNodes) {
      const root = tool.data?.root;
      if (root === void 0) continue;
      for (const block of collectBlocks(root)) {
        if (callName(block) !== "generate_image") continue;
        if (!("kind" in block) || block.isError) continue;
        const entries = inlineOf(block);
        if (entries.length > 0) {
          for (const entry of entries) {
            if (!inline.some((candidate) => candidate.url === entry.url)) inline.push(entry);
          }
        } else {
          const locator = findSpillLocator(resultText(block));
          if (locator !== void 0 && !locators.some((item) => item.callId === block.callId)) {
            locators.push({ callId: block.callId, locator });
          }
        }
      }
    }
    return { inline, locators, key: locators.map((item) => item.callId).join("|") };
  }, [toolNodes]);
  const [spill, setSpill] = (0, import_react15.useState)(EMPTY2);
  (0, import_react15.useEffect)(() => {
    if (scan.locators.length === 0) {
      setSpill(EMPTY2);
      return;
    }
    let cancelled = false;
    void (async () => {
      const cached = [];
      const miss = [];
      for (const item of scan.locators) {
        const hit = spillCache.get(item.callId);
        if (hit !== void 0) cached.push(hit);
        else miss.push(item);
      }
      let pending = mergeImages(cached);
      if (miss.length > 0) {
        const loaded = await Promise.all(miss.map((item) => loadSpill(item.callId, item.locator)));
        if (!cancelled) pending = mergeImages([...cached, ...loaded]);
      }
      if (!cancelled) setSpill(pending);
    })();
    return () => {
      cancelled = true;
    };
  }, [scan.key]);
  return (0, import_react15.useMemo)(() => {
    const states = [spill];
    if (scan.inline.length > 0) {
      states.push({ urls: scan.inline.map((entry) => entry.url), model: scan.inline[0]?.model ?? null });
    }
    return mergeImages(states);
  }, [scan, spill]);
}

// src/client/thinking/ThinkingStepNodeView.tsx
var import_jsx_runtime11 = require("react/jsx-runtime");
var EMPTY_STEPS = [];
var EMPTY_TOOLS = [];
function markdownLabelsFrom(t) {
  return {
    code: { copyLabel: t("copy"), copiedLabel: t("copied") },
    footnotes: t("markdown.footnotes")
  };
}
function KrFlowThoughtCard({
  items,
  turnNumber: turnNumber2
}) {
  const points = (0, import_react16.useMemo)(() => {
    const text = items.map((i) => i.text).join("\n");
    const lines = text.split("\n").map((l) => l.trim()).filter((l) => l.length > 0);
    const numbered = lines.filter((l) => /^\d+[\.、\s]/.test(l));
    if (numbered.length > 0) return numbered;
    return lines.slice(0, 3);
  }, [items]);
  if (points.length === 0) return null;
  const store = getKrChatStore();
  return /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)(
    "div",
    {
      className: "kr-flow-thought-card",
      onClick: () => {
        if (turnNumber2 !== void 0) {
          store.setSelectedTurn(turnNumber2);
          store.setPanelOpen(true);
        }
      },
      style: { cursor: "pointer" },
      title: "\u70B9\u51FB\u5728\u53F3\u4FA7\u5927\u76D8\u4E2D\u67E5\u770B\u5B8C\u6574\u8F68\u8FF9",
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)("div", { className: "kr-flow-thought-card__header", children: [
          /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("svg", { width: "15", height: "15", viewBox: "0 0 16 16", fill: "currentColor", children: /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("path", { d: "M2 6a6 6 0 1 1 10.174 4.31c-.203.196-.359.4-.453.619l-.762 1.769A.5.5 0 0 1 10.5 13a.5.5 0 0 1 0 1 .5.5 0 0 1 0 1l-.224.447a1 1 0 0 1-.894.553H6.618a1 1 0 0 1-.894-.553L5.5 15a.5.5 0 0 1 0-1 .5.5 0 0 1 0-1 .5.5 0 0 1-.46-.302l-.761-1.77a1.964 1.964 0 0 0-.453-.618A5.984 5.984 0 0 1 2 6zm6-5a5 5 0 0 0-3.479 8.592c.263.254.514.564.676.941L5.83 12h4.342l.632-1.467c.162-.377.413-.687.676-.941A5 5 0 0 0 8 1z" }) }),
          /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)("span", { children: [
            "\u601D\u8003\u8FC7\u7A0B (",
            points.length,
            ")"
          ] })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("div", { className: "kr-flow-thought-card__body", children: points.map((p, idx) => /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("div", { style: { marginBottom: 3 }, children: p }, idx)) })
      ]
    }
  );
}
function KrFlowExecutingCard({
  subtitle,
  elapsed,
  turnNumber: turnNumber2
}) {
  const store = getKrChatStore();
  return /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)(
    "div",
    {
      className: "kr-flow-executing-card",
      onClick: () => {
        if (turnNumber2 !== void 0) {
          store.setSelectedTurn(turnNumber2);
          store.setPanelOpen(true);
        }
      },
      style: { cursor: "pointer" },
      title: "\u70B9\u51FB\u5728\u53F3\u4FA7\u5927\u76D8\u67E5\u770B\u5B9E\u65F6\u5DE5\u5177\u8C03\u7528",
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("div", { className: "kr-flow-executing-card__spinner" }),
        /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)("div", { className: "kr-flow-executing-card__info", children: [
          /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("div", { className: "kr-flow-executing-card__title", children: "Agent \u6B63\u5728\u6267\u884C" }),
          /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("div", { className: "kr-flow-executing-card__subtitle", children: subtitle || "\u6B63\u5728\u63A8\u8FDB\u5404\u9879\u4EFB\u52A1\u6B65\u9AA4\u4E0E\u5DE5\u5177\u8C03\u7528\u2026" })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("div", { className: "kr-flow-executing-card__time", children: elapsed })
      ]
    }
  );
}
function ReasoningChip({ items, running, turn, thinkingStart, t, turnProcess, closed }) {
  const store = activityStore();
  const now = useNow(running);
  const elapsed = thinkingStart !== void 0 ? Math.max(0, now - thinkingStart) : void 0;
  const drawerOpen = useDrawerOpen(turn);
  const controlActive = turnProcess?.foldable === true;
  const label = running ? elapsed !== void 0 ? `\u601D\u8003\u4E2D \xB7 ${formatDuration(elapsed)}` : "\u601D\u8003\u4E2D\u2026" : t("message.turnProcess.thoughtForAWhile");
  const stackItems = (0, import_react16.useMemo)(() => items.filter((item) => item.text !== "").map((item) => ({ text: item.text, step: item.step, running: item.running })), [items]);
  const motion = useMotionAllowed(true);
  const [deferredControl, setDeferredControl] = (0, import_react16.useState)(controlActive);
  (0, import_react16.useEffect)(() => {
    if (!controlActive) {
      setDeferredControl(false);
      return void 0;
    }
    if (stackItems.length === 0) {
      setDeferredControl(true);
      return void 0;
    }
    setDeferredControl(false);
    if (!motion) {
      setDeferredControl(true);
      return void 0;
    }
    const id = window.setTimeout(() => {
      setDeferredControl(true);
    }, LIVE_RECLAIM_UNMOUNT_MS);
    return () => {
      window.clearTimeout(id);
    };
  }, [controlActive, stackItems.length, motion]);
  if (deferredControl) return null;
  if (controlActive) {
    return /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("div", { className: "dtt__reasoning", "data-reclaim": "true", children: /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(LiveThinkingStack, { items: stackItems, closing: true }) });
  }
  return /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)(
    "div",
    {
      className: "dtt__reasoning",
      "data-running": running || void 0,
      "data-reclaim": closed || void 0,
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)(
          "button",
          {
            type: "button",
            className: "dtt__process",
            "data-open": drawerOpen || void 0,
            "data-running": running || void 0,
            "data-turn-process": turn,
            "data-turn-process-tool-calls": 0,
            "data-turn-process-messages": 0,
            "data-turn-process-subagents": 0,
            "aria-expanded": drawerOpen,
            "aria-label": label,
            onClick: () => {
              store.open(turn, "reasoning");
            },
            children: [
              /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("span", { className: "dtt__process-label", children: label }),
              /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(import_dsh_client_ui_primitives5.IconChevronDownOutline14, { className: "dtt__process-chevron" })
            ]
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(LiveThinkingStack, { items: stackItems, closing: closed })
      ]
    }
  );
}
function Fresh({ live, freshKey, children }) {
  if (!live) return /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(import_jsx_runtime11.Fragment, { children });
  return /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("span", { className: "dtt__fresh", "data-fresh": true, children }, freshKey);
}
function AssistantBody({ blocks, streaming, interrupted, renderMessageImages, mentions, labels, t }) {
  const hasVisible = streaming || interrupted === true || blocks.some((block) => block.kind !== "tool-call");
  const rendered = [];
  if (!hasVisible) return { hasVisible, rendered };
  const coalesced = [];
  for (const source of blocks) {
    const prev = coalesced[coalesced.length - 1];
    if (source.kind === "text" && prev !== void 0 && prev.kind === "text") {
      coalesced[coalesced.length - 1] = { ...prev, text: prev.text + source.text };
    } else {
      coalesced.push(source);
    }
  }
  for (let index = 0; index < coalesced.length; index += 1) {
    const block = coalesced[index];
    if (block === void 0) continue;
    switch (block.kind) {
      case "text": {
        const pushMd = (key, text) => {
          if (text === "") return;
          splitDiagram(text).forEach((sub, subIndex) => {
            if (sub.kind === "diagram") {
              rendered.push(/* @__PURE__ */ (0, import_jsx_runtime11.jsx)(Fresh, { live: streaming, freshKey: `${key}-dg${subIndex}`, children: /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(DiagramCard, { spec: sub.spec }) }));
            } else if (sub.text !== "") {
              rendered.push(
                /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(Fresh, { live: streaming, freshKey: `${key}-md${subIndex}`, children: /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(import_dsh_client_ui_primitives5.MarkdownText, { text: sub.text, streaming, labels, fileMentions: mentions }) })
              );
            }
          });
        };
        const parts = splitProtoTabs(block.text);
        if (parts.length === 1 && parts[0]?.kind === "md" && parts[0].text.indexOf("diagram") < 0) {
          rendered.push(
            /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(Fresh, { live: streaming, freshKey: `md${index}`, children: /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(import_dsh_client_ui_primitives5.MarkdownText, { text: block.text, streaming, labels, fileMentions: mentions }) })
          );
        } else {
          parts.forEach((part, partIndex) => {
            if (part.kind === "card") {
              rendered.push(/* @__PURE__ */ (0, import_jsx_runtime11.jsx)(Fresh, { live: streaming, freshKey: `proto${index}-${partIndex}`, children: /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(ProtoTabsCard, { spec: part.spec }) }));
            } else {
              pushMd(`${index}-${partIndex}`, part.text);
            }
          });
        }
        break;
      }
      case "reasoning":
        break;
      case "image": {
        const start = index;
        const group = [block];
        while (index + 1 < coalesced.length) {
          const next = coalesced[index + 1];
          if (next === void 0 || next.kind !== "image") break;
          group.push(next);
          index += 1;
        }
        rendered.push(
          /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(Fresh, { live: streaming, freshKey: `img${start}`, children: renderMessageImages({
            images: group.map(({ attachment }) => ({ attachment })),
            align: "start"
          }) })
        );
        break;
      }
      // 聚合进工具 chip（tool-call 槽位）；此处跳过。
      case "tool-call":
        break;
      default:
        rendered.push(
          /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(Fresh, { live: streaming, freshKey: `unknown${index}`, children: /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(
            import_dsh_client_ui_primitives5.JsonBlock,
            {
              label: t("message.unknownBlock"),
              payload: block.block,
              truncatedLabel: (total) => t("json.truncated", { total })
            }
          ) })
        );
    }
  }
  return { hasVisible, rendered };
}
var ThinkingStepNodeView = (0, import_react16.memo)(function ThinkingStepNodeView2(props) {
  const { node, useTurnData, useChat, openFile, renderMessageImages, fileMentions, t, turnProcess } = props;
  const krStore = getKrChatStore();
  const krState = (0, import_react16.useSyncExternalStore)(
    (cb) => krStore.subscribe(cb),
    () => krStore.snapshot
  );
  const isKrMode = krState.activeTab === "kr";
  const data = node.data;
  const locationTurn = node.location.kind === "turn" || node.location.kind === "step" ? node.location.turn : void 0;
  const tail = useTurnData("turn-tail");
  const owner = (0, import_react16.useMemo)(() => {
    if (locationTurn?.status !== "closed" || data.finalNode === void 0) return void 0;
    if (tail?.closing?.finalNode.seq !== data.finalNode.seq) return void 0;
    return { turn: locationTurn, seq: data.finalNode.seq, openFile };
  }, [data.finalNode, openFile, tail, locationTurn]);
  const mentions = (0, import_react16.useMemo)(
    () => owner === void 0 ? void 0 : fileMentions(owner),
    [fileMentions, owner]
  );
  const turnNumber2 = locationTurn?.turn;
  const steps = useChat((snapshot) => {
    setLatestChatSnapshot(snapshot);
    if (turnNumber2 === void 0) return EMPTY_STEPS;
    return snapshot.locations.getTurn(turnNumber2).map((key) => snapshot.nodes.get(key)).filter((candidate) => candidate !== void 0 && candidate.kind === "assistant-step");
  });
  const toolNodes = useChat((snapshot) => {
    if (turnNumber2 === void 0) return EMPTY_TOOLS;
    return snapshot.locations.getTurn(turnNumber2).map((key) => snapshot.nodes.get(key)).filter((candidate) => candidate !== void 0 && candidate.kind === "tool-call");
  });
  const reasoningItems = (0, import_react16.useMemo)(() => steps.flatMap((step) => {
    const stepRunning = step.data.status === "running";
    return step.data.blocks.filter((block) => block.kind === "reasoning").map((block) => ({ text: block.text, running: stepRunning, step: step.data.step }));
  }), [steps]);
  const isFirstStep = steps.length > 0 && node.key === steps[0]?.key;
  const turnRunning = steps.some((step) => step.data.status === "running");
  const generated = useGeneratedImages(toolNodes);
  const galleryStepKey = useChat((snapshot) => {
    if (turnNumber2 === void 0 || generated.urls.length === 0) return void 0;
    let lastStep;
    for (const key of snapshot.locations.getTurn(turnNumber2)) {
      const candidate = snapshot.nodes.get(key);
      if (candidate === void 0) continue;
      if (candidate.kind === "assistant-step") lastStep = key;
    }
    return lastStep;
  });
  const gallery = generated.urls.length > 0 && node.key === galleryStepKey ? /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(GeneratedImageStrip, { images: generated.urls, model: generated.model }) : void 0;
  const thinkingStart = (0, import_react16.useMemo)(() => {
    const runningStep = steps.find((step) => step.data.status === "running");
    return runningStep?.data.time;
  }, [steps]);
  const visibleBlocks = (0, import_react16.useMemo)(
    () => data.blocks.filter((block) => block.kind !== "reasoning"),
    [data.blocks]
  );
  const toolCount = useChat((snapshot) => {
    if (turnNumber2 === void 0) return 0;
    let count = 0;
    for (const key of snapshot.locations.getTurn(turnNumber2)) {
      if (snapshot.nodes.get(key)?.kind === "tool-call") count += 1;
    }
    return count;
  });
  (0, import_react16.useEffect)(() => {
    if (isKrMode && isFirstStep && reasoningItems.length > 0 && turnNumber2 !== void 0) {
      activityStore().setReasoning(turnNumber2, reasoningItems);
    }
  }, [isKrMode, isFirstStep, reasoningItems, turnNumber2]);
  const now = useNow(turnRunning);
  const turnElapsed = thinkingStart !== void 0 ? Math.max(0, now - thinkingStart) : 1e3;
  const turnElapsedText = formatDuration(turnElapsed);
  const gitVerbs = (0, import_react16.useMemo)(() => {
    const verbs = [];
    for (const node2 of toolNodes) {
      const verb = gitVerbOf(node2.data.root);
      if (verb !== void 0) verbs.push(verb);
    }
    return verbs;
  }, [toolNodes]);
  const gitDetail = (0, import_react16.useMemo)(() => [...new Set(gitVerbs)].join(" \xB7 "), [gitVerbs]);
  const krThoughtCard = isKrMode && isFirstStep && reasoningItems.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(KrFlowThoughtCard, { items: reasoningItems, turnNumber: turnNumber2 }) : void 0;
  const krExecutingCard = isKrMode && isFirstStep && turnRunning ? /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(KrFlowExecutingCard, { subtitle: gitDetail || void 0, elapsed: turnElapsedText, turnNumber: turnNumber2 }) : void 0;
  const folded = toolCount > 0;
  const turnClosedEarly = locationTurn?.status === "closed";
  const chip = isKrMode ? void 0 : isFirstStep && reasoningItems.length > 0 && !folded ? /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(
    ReasoningChip,
    {
      items: reasoningItems,
      running: turnRunning,
      turn: turnNumber2,
      thinkingStart,
      t,
      turnProcess,
      closed: turnClosedEarly === true
    }
  ) : void 0;
  const timing = useChat((snapshot) => {
    if (turnNumber2 === void 0) return void 0;
    return snapshot.legacy.turnTimings.get(turnNumber2);
  });
  const streaming = data.status === "running";
  const interrupted = data.status === "interrupted";
  const turnClosed = locationTurn?.status === "closed";
  const showCard = turnClosed === true || interrupted;
  const isClosingReply = owner !== void 0;
  const isSummary = isClosingReply || interrupted;
  const variant = !showCard ? void 0 : isSummary ? "reply" : "step";
  const cardMeta = (0, import_react16.useMemo)(() => {
    if (!showCard) return void 0;
    const start = timing?.startTime;
    const end = timing?.endTime;
    return {
      turnNumber: turnNumber2,
      durationMs: start !== void 0 && end !== void 0 ? Math.max(0, end - start) : void 0,
      steps: steps.length,
      tools: toolCount,
      thinking: reasoningItems.length,
      git: gitVerbs.length > 0 ? gitVerbs.length : void 0,
      gitDetail: gitDetail !== "" ? gitDetail : void 0
    };
  }, [showCard, reasoningItems.length, steps.length, timing, toolCount, gitVerbs, gitDetail]);
  const labels = (0, import_react16.useMemo)(() => markdownLabelsFrom(t), [t]);
  const OfficialComp = getOfficialAssistantNodeView();
  if (!isKrMode && OfficialComp) {
    return /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(OfficialComp, { ...props });
  }
  const { hasVisible, rendered } = AssistantBody({
    blocks: visibleBlocks,
    streaming,
    interrupted,
    renderMessageImages,
    mentions,
    labels,
    t
  });
  if (!hasVisible && chip === void 0 && gallery === void 0) return null;
  return /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("div", { className: "dtt__assistant", "data-streaming": streaming || void 0, children: /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)("div", { className: "dtt__assistant-body", children: [
    chip,
    krThoughtCard,
    krExecutingCard,
    rendered.length > 0 && (variant !== void 0 ? /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)(FlowCard, { variant, meta: cardMeta, interrupted, children: [
      rendered,
      gallery
    ] }) : /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)(import_jsx_runtime11.Fragment, { children: [
      rendered,
      gallery
    ] })),
    rendered.length === 0 && gallery,
    interrupted && /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("span", { className: "dtt__stopped", children: t("message.stopped") })
  ] }) });
});

// src/client/shot/index.tsx
var import_react18 = require("react");

// src/shared/title.ts
function deriveTitle(text, role) {
  const lines = text.replace(/\r\n/g, "\n").split("\n");
  let inFence = false;
  for (const line of lines) {
    const trimmed = line.trim();
    if (inFence) {
      if (trimmed.startsWith("```")) inFence = false;
      continue;
    }
    if (trimmed.startsWith("```")) {
      inFence = true;
      continue;
    }
    if (trimmed === "") continue;
    if (/^(-{3,}|\*{3,}|_{3,})$/.test(trimmed)) continue;
    if (trimmed.startsWith("|")) continue;
    const cleaned = trimmed.replace(/^#{1,6}\s+/, "").replace(/^>\s*/, "").replace(/^[-*+]\s+/, "").replace(/^\d+[.)]\s+/, "").replace(/^\[[ xX]\]\s+/, "").replace(/!\[[^\]]*\]\([^)]*\)/g, "").replace(/\[([^\]]*)\]\([^)]*\)/g, "$1").replace(/[*_~`]/g, "").replace(/\s+/g, " ").trim();
    if (cleaned !== "") {
      const limit = 64;
      return cleaned.length > limit ? `${cleaned.slice(0, limit)}\u2026` : cleaned;
    }
  }
  return role === "user" ? "\u6211\u7684\u63D0\u95EE" : "AI \u56DE\u590D";
}

// src/client/shot/collect.ts
function assistantText(data) {
  const blocks = data.closing?.blocks ?? [];
  return blocks.filter((block) => block.kind === "text" && typeof block.text === "string").map((block) => block.text).join("");
}
function userText(data) {
  const content = data.content ?? [];
  return content.filter((block) => block.type === "text" && typeof block.text === "string").map((block) => block.text).join("");
}
function toMessage(node) {
  if (node === void 0) return null;
  if (node.kind === "user" || node.kind === "steering") {
    const text = userText(node.data);
    return text.trim() === "" ? null : { role: "user", text };
  }
  if (node.kind === "turn-tail") {
    const text = assistantText(node.data);
    return text.trim() === "" ? null : { role: "assistant", text };
  }
  if (node.kind === "assistant-step") {
    const data = node.data;
    const blocks = data.blocks ?? [];
    const text = blocks.filter((b) => b.kind === "text" && typeof b.text === "string").map((b) => b.text).join("");
    return text.trim() === "" ? null : { role: "assistant", text };
  }
  return null;
}
function locateTail(snapshot, messageIdOrTurn) {
  if (typeof messageIdOrTurn === "number") {
    for (const key of snapshot.order) {
      const node = snapshot.nodes.get(key);
      if (node === void 0 || node.kind !== "turn-tail") continue;
      const data = node.data;
      if (data.turn === messageIdOrTurn) {
        return { key, turn: messageIdOrTurn };
      }
    }
    const turnKeys = snapshot?.locations?.getTurn?.(messageIdOrTurn);
    if (turnKeys && turnKeys.length > 0) {
      const lastKey = turnKeys[turnKeys.length - 1];
      return { key: lastKey, turn: messageIdOrTurn };
    }
  }
  let fallback = null;
  for (const key of snapshot.order) {
    const node = snapshot.nodes.get(key);
    if (node === void 0 || node.kind !== "turn-tail") continue;
    const data = node.data;
    const tail = { key, turn: typeof data.turn === "number" ? data.turn : -1 };
    if (data.closing?.finalNode?.messageId === messageIdOrTurn) return tail;
    if (data.closing?.finalNode !== void 0) fallback = tail;
  }
  return fallback;
}
function collectMessages(snapshot, messageId, range) {
  const located = locateTail(snapshot, messageId);
  if (range === "reply") {
    if (located === null) return [];
    const message = toMessage(snapshot.nodes.get(located.key));
    return message === null ? [] : [message];
  }
  if (range === "turn") {
    if (located === null || located.turn < 0) return [];
    const out2 = [];
    const turnKeys = snapshot.locations.getTurn(located.turn);
    const hasTurnTail = turnKeys.some((k) => snapshot.nodes.get(k)?.kind === "turn-tail");
    for (const key of turnKeys) {
      const node = snapshot.nodes.get(key);
      if (!node) continue;
      if (hasTurnTail && node.kind === "assistant-step") continue;
      const message = toMessage(node);
      if (message !== null) out2.push(message);
    }
    return out2;
  }
  const out = [];
  const hasTurnTailMap = /* @__PURE__ */ new Set();
  for (const key of snapshot.order) {
    const node = snapshot.nodes.get(key);
    if (node?.kind === "turn-tail" && typeof node.data?.turn === "number") {
      hasTurnTailMap.add(node.data.turn);
    }
  }
  for (const key of snapshot.order) {
    const node = snapshot.nodes.get(key);
    if (!node) continue;
    const turn = node.data?.turn;
    if (node.kind === "assistant-step" && typeof turn === "number" && hasTurnTailMap.has(turn)) {
      continue;
    }
    const message = toMessage(node);
    if (message !== null) out.push(message);
  }
  return out;
}
function deriveCurrentDialogueTitle(snapshot, messageId) {
  const located = locateTail(snapshot, messageId);
  if (located !== null && located.turn >= 0) {
    for (const key of snapshot.locations.getTurn(located.turn)) {
      const node = snapshot.nodes.get(key);
      if (node !== void 0 && (node.kind === "user" || node.kind === "steering")) {
        const text = userText(node.data);
        if (text.trim() !== "") {
          return deriveTitle(text, "user");
        }
      }
    }
  }
  if (located !== null) {
    const node = snapshot.nodes.get(located.key);
    if (node !== void 0) {
      const text = assistantText(node.data);
      if (text.trim() !== "") {
        return deriveTitle(text, "assistant");
      }
    }
  }
  return "";
}

// src/client/shot/Panel.tsx
var import_react17 = require("react");
var import_react_dom2 = require("react-dom");

// src/client/shot/api.ts
var ROUTE = "/api/chat-flow/screenshot";
async function post(path, body) {
  const res = await fetch(`${ROUTE}${path}`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body)
  });
  const data = await res.json();
  if (data.ok !== true) throw new Error(typeof data.error === "string" ? data.error : `\u8BF7\u6C42\u5931\u8D25\uFF08HTTP ${res.status}\uFF09`);
  return data;
}
async function render(request) {
  return await post("/render", request);
}
async function save(id) {
  return await post("/save", { id });
}
async function reveal() {
  await post("/reveal", {});
}

// src/shot/presets.ts
var ASPECT_RATIO = {
  "16:9": 16 / 9,
  "4:3": 4 / 3,
  "1:1": 1,
  "9:16": 9 / 16,
  "3:4": 3 / 4
};
var WIDTH_PRESETS = [540, 720, 960, 1200, 1440];
var DEFAULT_WIDTH = 960;
var WIDTH_LABELS = {
  540: "540 \u624B\u673A",
  720: "720 \u7D27\u51D1",
  960: "960 \u6807\u51C6",
  1200: "1200 \u5BBD\u5C4F",
  1440: "1440 \u8D85\u5BBD"
};
function qualityScale(quality, width) {
  const isNarrow = width <= 640;
  if (quality === "1080p") return 2;
  if (quality === "4k") return isNarrow ? 4 : 3;
  return isNarrow ? 3 : 2;
}
var QUALITY_LABEL = {
  "1080p": "1080P",
  "2k": "2K",
  "4k": "4K"
};

// src/shot/theme.ts
function metrics(width) {
  const ratio = Math.max(0, Math.min(1, (width - 480) / 800));
  const round = (from, to) => Math.round(from + (to - from) * ratio);
  return {
    pad: round(22, 50),
    title: round(20, 30),
    body: round(15, 19),
    radius: round(18, 24),
    // 卡片外的画布留白：手机版几乎贴边，电脑版留出投影空间。
    outer: round(14, 40),
    brand: round(13, 15)
  };
}
function canvasPad(width) {
  return metrics(width).outer;
}

// src/client/shot/styles.ts
var STYLE_ID2 = "dsh-chat-flow-shot-styles";
var cls2 = {
  btn: "tsh-btn",
  btnBusy: "tsh-btn-busy",
  mask: "tsh-mask",
  panel: "tsh-panel",
  head: "tsh-head",
  title: "tsh-title",
  close: "tsh-close",
  bar: "tsh-bar",
  group: "tsh-group",
  label: "tsh-label",
  seg: "tsh-seg",
  segItem: "tsh-seg-item",
  segItemOn: "tsh-seg-item-on",
  widthBox: "tsh-width-box",
  widthInput: "tsh-width-input",
  unit: "tsh-unit",
  select: "tsh-select",
  input: "tsh-input",
  stage: "tsh-stage",
  canvas: "tsh-canvas",
  img: "tsh-img",
  spinner: "tsh-spinner",
  hint: "tsh-hint",
  error: "tsh-error",
  editBar: "tsh-edit-bar",
  editHint: "tsh-edit-hint",
  editCount: "tsh-edit-count",
  editSpacer: "tsh-edit-spacer",
  editor: "tsh-editor",
  frame: "tsh-frame",
  foot: "tsh-foot",
  meta: "tsh-meta",
  actions: "tsh-actions",
  action: "tsh-action",
  primary: "tsh-primary",
  toast: "tsh-toast"
};
var SHEET2 = `
/* \u2500\u2500 \u6D88\u606F\u64CD\u4F5C\u680F\u76F8\u673A\u6309\u94AE\uFF08\u4E0E\u5B98\u65B9 IconActions \u540C\u89C4\u683C\uFF09\u2500\u2500 */
.tsh-btn{box-sizing:border-box;flex:none;display:inline-flex;align-items:center;justify-content:center;width:28px;height:28px;padding:6px;border:none;border-radius:8px;background:transparent;color:var(--dsw-alias-label-tertiary,#888);cursor:pointer;transition:color .12s,background .12s}
.tsh-btn:hover{background:var(--dsw-alias-interactive-bg-hover,rgba(255,255,255,.06));color:var(--dsw-alias-label-primary,#eee)}
.tsh-btn-busy{color:var(--dsw-alias-state-business-primary,#4176e6);cursor:default;pointer-events:none}

/* \u2500\u2500 \u906E\u7F69 + \u9762\u677F \u2500\u2500 */
.tsh-mask{position:fixed;inset:0;z-index:1399;background:var(--dsw-alias-bg-mask-1,rgba(0,0,0,.45))}
.tsh-panel{position:fixed;z-index:1400;left:50%;top:50%;transform:translate(-50%,-50%);display:flex;flex-direction:column;box-sizing:border-box;width:min(calc(100vw - 48px),2160px);height:min(calc(100vh - 40px),1720px);border:1px solid var(--dsw-alias-border-l2,rgba(255,255,255,.14));border-radius:14px;background:var(--dsw-specific-menu,var(--dsw-alias-bg-layer-2,#16181d));box-shadow:var(--dsw-shadow-lv3,0 8px 40px rgba(0,0,0,.5));overflow:hidden}
/* \u5C45\u4E2D\u9762\u677F\u7684\u5F00\u5408\u52A8\u753B\u81EA\u5E26 translate(-50%,-50%)\uFF0C\u4E0D\u80FD\u590D\u7528\u901A\u7528\u6ED1\u5165\u7C7B\uFF08\u4F1A\u8986\u76D6\u5B9A\u4F4D\uFF09\u3002 */
.tsh-panel[data-anim='in']{animation:tsh-panel-in 240ms cubic-bezier(.2,.8,.2,1)}
.tsh-panel[data-anim='out']{animation:tsh-panel-out 240ms cubic-bezier(.4,0,.2,1) both}
@keyframes tsh-panel-in{from{opacity:0;transform:translate(-50%,calc(-50% + 18px))}to{opacity:1;transform:translate(-50%,-50%)}}
@keyframes tsh-panel-out{from{opacity:1;transform:translate(-50%,-50%)}to{opacity:0;transform:translate(-50%,calc(-50% + 18px))}}

/* \u2500\u2500 \u5934\u90E8 \u2500\u2500 */
.tsh-head{flex:none;display:flex;align-items:center;gap:8px;padding:12px 16px 10px;border-bottom:1px solid var(--dsw-alias-border-l1,rgba(255,255,255,.08))}
.tsh-title{flex:1;min-width:0;font-size:15px;font-weight:600;line-height:22px;color:var(--dsw-alias-label-primary,#eee)}
.tsh-close{flex:none;display:inline-flex;align-items:center;justify-content:center;width:28px;height:28px;border:none;border-radius:8px;padding:0;background:transparent;color:var(--dsw-alias-label-secondary,#bbb);cursor:pointer}
.tsh-close:hover{background:var(--dsw-alias-interactive-bg-hover,rgba(255,255,255,.06));color:var(--dsw-alias-label-primary,#eee)}

/* \u2500\u2500 \u9009\u9879\u6761 \u2500\u2500 */
.tsh-bar{flex:none;display:flex;align-items:center;gap:18px;flex-wrap:wrap;padding:12px 16px;border-bottom:1px solid var(--dsw-alias-border-l1,rgba(255,255,255,.08))}
.tsh-group{display:flex;align-items:center;gap:8px;min-width:0}
.tsh-label{flex:none;font-size:12px;color:var(--dsw-alias-label-secondary,#bbb)}
/* \u5206\u6BB5\u9009\u62E9\uFF1A\u6574\u4F53\u4E00\u679A 32px \u9AD8\u7684\u80F6\u56CA\uFF0C\u9009\u4E2D\u9879\u8D70\u54C1\u724C\u84DD\u5E95 */
.tsh-seg{display:inline-flex;align-items:center;height:32px;padding:2px;gap:2px;border:1px solid var(--dsw-alias-border-l2,#333);border-radius:8px;background:var(--dsw-alias-bg-layer-1,transparent)}
.tsh-seg-item{display:inline-flex;align-items:center;height:26px;padding:0 12px;border:none;border-radius:6px;background:transparent;color:var(--dsw-alias-label-secondary,#bbb);font-size:13px;line-height:1;cursor:pointer;white-space:nowrap;transition:background .12s,color .12s}
.tsh-seg-item:hover{color:var(--dsw-alias-label-primary,#eee)}
.tsh-seg-item-on{background:var(--dsw-alias-state-business-primary,#4176e6);color:#fff}
.tsh-seg-item-on:hover{color:#fff}
/* \u81EA\u5B9A\u4E49\u5BBD\u5EA6\u8F93\u5165\u6846\uFF1A\u9AD8\u5EA6 32px\uFF0C\u5185\u5D4C px \u5355\u4F4D */
.tsh-width-box{display:inline-flex;align-items:center;height:32px;padding:0 8px 0 10px;gap:4px;border:1px solid var(--dsw-alias-border-l2,#333);border-radius:8px;background:var(--dsw-alias-bg-layer-1,transparent);transition:border-color .12s}
.tsh-width-box:focus-within{border-color:var(--dsw-alias-state-business-primary,#4176e6)}
.tsh-width-input{width:46px;height:24px;border:none;background:transparent;color:var(--dsw-alias-label-primary,#eee);font-size:13px;font-weight:500;text-align:right;padding:0;outline:none;-moz-appearance:textfield}
.tsh-width-input::-webkit-outer-spin-button,.tsh-width-input::-webkit-inner-spin-button{-webkit-appearance:none;margin:0}
.tsh-unit{font-size:12px;color:var(--dsw-alias-label-tertiary,#888);user-select:none}
/* \u6587\u672C\u8F93\u5165\uFF08\u6807\u9898/\u5FBD\u7AE0\u53EF\u7F16\u8F91\uFF09\uFF1A\u5B98\u65B9\u8F93\u5165\u6846\u89C4\u683C 32px / \u5706\u89D2 8 */
.tsh-input{height:32px;padding:0 10px;font-size:14px;line-height:22px;border-radius:8px;border:1px solid var(--dsw-alias-border-l2,#333);background-color:var(--dsw-alias-bg-layer-1,transparent);color:var(--dsw-alias-label-primary,#eee);min-width:0}
.tsh-input:focus{outline:none;border-color:var(--dsw-alias-state-business-primary,#4176e6)}
.tsh-input::placeholder{color:var(--dsw-alias-label-tertiary,#888)}
.tsh-group .tsh-input{width:190px}
.tsh-select{height:32px;padding:0 32px 0 10px;font-size:14px;line-height:22px;border-radius:8px;border:1px solid var(--dsw-alias-border-l2,#333);background-color:var(--dsw-alias-bg-layer-1,transparent);color:var(--dsw-alias-label-primary,#eee);max-width:200px;appearance:none;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath d='M2.5 4.5L6 8l3.5-3.5' fill='none' stroke='%2381858C' stroke-width='1.4' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");background-repeat:no-repeat;background-position:right 12px center;cursor:pointer}

/* \u2500\u2500 \u9884\u89C8\u53F0 \u2500\u2500 */
.tsh-stage{flex:1;min-height:0;display:flex;align-items:flex-start;justify-content:center;overflow:auto;padding:18px;background:var(--dsw-alias-bg-module-platform,rgba(255,255,255,.02));scrollbar-width:thin}
.tsh-stage::-webkit-scrollbar{width:8px;height:8px}
.tsh-stage::-webkit-scrollbar-thumb{background:var(--dsw-alias-scrollbar-bg-l2,#333);border-radius:4px}
.tsh-canvas{display:flex;align-items:center;justify-content:center;min-height:100%;width:100%}
.tsh-img{max-width:100%;height:auto;display:block;border-radius:10px;box-shadow:0 10px 34px rgba(0,0,0,.28);margin:auto}
.tsh-spinner{width:26px;height:26px;border-radius:50%;border:2px solid var(--dsw-alias-border-l2,#333);border-top-color:var(--dsw-alias-state-business-primary,#4176e6);animation:tsh-spin .8s linear infinite}
@keyframes tsh-spin{to{transform:rotate(360deg)}}
.tsh-hint{display:flex;flex-direction:column;align-items:center;gap:10px;font-size:13px;color:var(--dsw-alias-label-tertiary,#888)}
.tsh-error{max-width:520px;font-size:13px;line-height:1.6;color:var(--dsw-alias-state-error-primary,#e5484d);text-align:center;word-break:break-word}

/* \u2500\u2500 \u5143\u7D20\u5220\u9664\u7F16\u8F91\u6A21\u5F0F \u2500\u2500 */
/* \u7F16\u8F91\u4E2D\uFF1A\u9009\u9879\u6761\u6574\u4F53\u51CF\u6DE1\u5E76\u7981\u6B62\u4EA4\u4E92\uFF08\u6539\u4E86\u9009\u9879\u4F1A\u8131\u79BB\u7F16\u8F91\uFF0C\u9700\u8981\u5148\u9000\u51FA\u91CD\u6E32\u67D3\uFF09\u3002 */
.tsh-panel[data-editing] .tsh-bar{opacity:.55;pointer-events:none}
/* \u7F16\u8F91\u5DE5\u5177\u6761\uFF1A\u4F4D\u4E8E\u9009\u9879\u6761\u4E0B\u65B9\u3001\u9884\u89C8\u53F0\u4E0A\u65B9\uFF0C\u6ED1\u5165\u52A8\u753B\u3002 */
.tsh-edit-bar{flex:none;box-sizing:border-box;width:100%;display:flex;align-items:center;gap:12px;padding:9px 16px;background:var(--dsw-specific-menu,var(--dsw-alias-bg-layer-2,#16181d));border-bottom:1px solid var(--dsw-alias-border-l1,rgba(255,255,255,.08));animation:tsh-editbar-in 180ms ease}
@keyframes tsh-editbar-in{from{opacity:0;transform:translateY(-6px)}to{opacity:1;transform:none}}
.tsh-edit-hint{font-size:12px;line-height:1.5;color:var(--dsw-alias-label-secondary,#bbb);min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.tsh-edit-count{flex:none;font-size:12px;color:var(--dsw-alias-label-tertiary,#888);white-space:nowrap}
.tsh-edit-count[data-n]{color:var(--dsw-alias-state-error-primary,#e5484d);font-weight:600}
.tsh-edit-spacer{flex:1}
/* \u7F16\u8F91\u753B\u5E03\uFF1Aiframe \u4E0E\u666E\u901A\u9884\u89C8\u56FE\u4FDD\u6301\u5B8C\u5168\u76F8\u540C\u7684\u5C3A\u5BF8\u3001\u9634\u5F71\u3001\u5706\u89D2\u4E0E\u5C45\u4E2D\u6392\u7248\u3002 */
.tsh-frame{display:block;box-sizing:border-box;border:none;border-radius:10px;box-shadow:0 10px 34px rgba(0,0,0,.28);background:transparent;margin:auto;flex:none}
.tsh-frame:focus{outline:none}

/* \u2500\u2500 \u5E95\u680F \u2500\u2500 */
.tsh-foot{flex:none;display:flex;align-items:center;gap:12px;padding:12px 16px;border-top:1px solid var(--dsw-alias-border-l1,rgba(255,255,255,.08))}
.tsh-meta{flex:1;min-width:0;font-size:12px;color:var(--dsw-alias-label-tertiary,#888);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.tsh-actions{flex:none;display:flex;align-items:center;gap:8px}
.tsh-action{display:inline-flex;align-items:center;justify-content:center;height:36px;padding:0 14px;border:1px solid var(--dsw-alias-border-l2,#333);border-radius:18px;background:transparent;color:var(--dsw-alias-label-primary,#eee);font-size:14px;cursor:pointer;transition:border-color .12s,color .12s,opacity .12s;text-decoration:none}
.tsh-action:hover{border-color:var(--dsw-alias-state-business-primary,#4176e6);color:var(--dsw-alias-state-business-primary,#4176e6)}
.tsh-primary{display:inline-flex;align-items:center;justify-content:center;height:36px;padding:0 18px;border:1px solid transparent;border-radius:18px;background:var(--dsw-alias-button-primary-fill,#111);color:var(--dsw-alias-label-primary-foreground,#fff);font-size:14px;font-weight:600;cursor:pointer;transition:opacity .12s}
.tsh-primary:hover{opacity:.86}
.tsh-action:disabled,.tsh-primary:disabled{opacity:.45;cursor:default;pointer-events:none}
/* \u4FDD\u5B58/\u590D\u5236\u7ED3\u679C\u63D0\u793A\uFF08\u5E95\u680F\u5DE6\u4FA7\u539F\u5730\u66FF\u6362 meta \u6587\u6848\uFF0C\u907F\u514D\u989D\u5916\u6D6E\u5C42\uFF09 */
.tsh-toast{color:var(--dsw-alias-state-success-primary,#3fb950)}
@media (prefers-reduced-motion:reduce){
  .tsh-panel{animation:none!important}
  .tsh-spinner{animation:none}
  .tsh-edit-bar{animation:none}
}
`;
function ensureStyles() {
  if (typeof document === "undefined") return;
  if (document.getElementById(STYLE_ID2) !== null) return;
  const tag = document.createElement("style");
  tag.id = STYLE_ID2;
  tag.dataset.plugin = "dsh-chat-flow";
  tag.textContent = SHEET2;
  document.head.appendChild(tag);
}

// src/client/shot/Panel.tsx
var import_jsx_runtime12 = require("react/jsx-runtime");
var RANGE_LABEL = {
  reply: "\u672C\u6761\u56DE\u590D",
  turn: "\u8FD9\u4E00\u8F6E\u95EE\u7B54",
  all: "\u6574\u6BB5\u4F1A\u8BDD"
};
var THEME_LABEL = {
  light: "\u6D45\u8272",
  reader: "\u9605\u8BFB\u7248",
  dark: "\u6DF1\u8272",
  glass: "\u73BB\u7483",
  "glass-dark": "\u73BB\u7483\u6DF1\u8272"
};
function currentTheme() {
  const dark = document.body.hasAttribute("data-ds-dark-theme");
  let glass = false;
  try {
    glass = localStorage.getItem("dsh-webui.appearance.glass") === "1";
  } catch {
  }
  return glass ? dark ? "glass-dark" : "glass" : dark ? "dark" : "light";
}
function humanBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}
function EditableText(props) {
  const [draft, setDraft] = (0, import_react17.useState)(props.value);
  (0, import_react17.useEffect)(() => {
    setDraft(props.value);
  }, [props.value]);
  const commit = () => {
    const next = draft.trim();
    if (next !== props.value.trim()) props.onCommit(next);
  };
  return /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)("div", { className: cls2.group, children: [
    /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("span", { className: cls2.label, children: props.label }),
    /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(
      "input",
      {
        className: cls2.input,
        value: draft,
        placeholder: props.placeholder,
        maxLength: 80,
        onChange: (event) => {
          setDraft(event.target.value);
        },
        onBlur: commit,
        onKeyDown: (event) => {
          if (event.key === "Enter") {
            event.currentTarget.blur();
          }
          if (event.key === "Escape") {
            setDraft(props.value);
            event.currentTarget.blur();
          }
        }
      }
    )
  ] });
}
function ShotPanel({ closing, onClose, collect, title, dialogueTitle, sessionTitle, cwd = "", initialRange }) {
  const [range, setRange] = (0, import_react17.useState)(() => initialRange ?? "reply");
  const [theme, setTheme] = (0, import_react17.useState)(() => currentTheme());
  const [cardWidth, setCardWidth] = (0, import_react17.useState)(DEFAULT_WIDTH);
  const [widthDraft, setWidthDraft] = (0, import_react17.useState)(String(DEFAULT_WIDTH));
  const [quality, setQuality] = (0, import_react17.useState)("2k");
  const [titleText, setTitleText] = (0, import_react17.useState)(title);
  const userEditedTitleRef = (0, import_react17.useRef)(false);
  const [labelText, setLabelText] = (0, import_react17.useState)("Kr");
  const [busy, setBusy] = (0, import_react17.useState)(false);
  const [result, setResult] = (0, import_react17.useState)(null);
  const [error, setError] = (0, import_react17.useState)(null);
  const [toast, setToast] = (0, import_react17.useState)(null);
  const [savedPath, setSavedPath] = (0, import_react17.useState)(null);
  const [editing, setEditing] = (0, import_react17.useState)(false);
  const [baseHtml, setBaseHtml] = (0, import_react17.useState)(null);
  const [editHtml, setEditHtml] = (0, import_react17.useState)(null);
  const [marked, setMarked] = (0, import_react17.useState)(0);
  const [frameHeight, setFrameHeight] = (0, import_react17.useState)(null);
  const tokenRef = (0, import_react17.useRef)(0);
  const editorRef = (0, import_react17.useRef)(null);
  const scale = qualityScale(quality, cardWidth);
  const viewportWidth = cardWidth + canvasPad(cardWidth) * 2;
  const displayWidth = result ? Math.round(result.width / scale) : viewportWidth;
  const messages = (0, import_react17.useMemo)(() => collect(range), [collect, range]);
  const run = (0, import_react17.useCallback)(() => {
    const token = tokenRef.current + 1;
    tokenRef.current = token;
    if (messages.length === 0) {
      setResult(null);
      setError("\u8FD9\u4E2A\u8303\u56F4\u91CC\u6CA1\u6709\u53EF\u622A\u56FE\u7684\u6587\u672C\u5185\u5BB9");
      return;
    }
    setBusy(true);
    setError(null);
    setSavedPath(null);
    setToast(null);
    render({ messages, theme, width: cardWidth, quality, title: titleText, label: labelText, cwd }).then((next) => {
      if (tokenRef.current !== token) return;
      setResult(next);
    }).catch((cause) => {
      if (tokenRef.current !== token) return;
      setResult(null);
      setError(cause instanceof Error ? cause.message : String(cause));
    }).finally(() => {
      if (tokenRef.current !== token) return;
      setBusy(false);
    });
  }, [messages, theme, cardWidth, quality, titleText, labelText, cwd]);
  (0, import_react17.useEffect)(() => {
    run();
  }, [run]);
  (0, import_react17.useEffect)(() => {
    if (closing) return void 0;
    const onKey = (event) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
    };
  }, [closing, onClose]);
  const startEdit = (0, import_react17.useCallback)(() => {
    const html = result?.html;
    if (typeof html !== "string" || html === "") return;
    if (html.includes('class="mermaid"') || html.includes("class='mermaid'")) {
      setError("\u8BE5\u622A\u56FE\u5305\u542B\u6D41\u7A0B\u56FE\uFF08mermaid\uFF09\uFF0C\u6682\u4E0D\u652F\u6301\u5143\u7D20\u5220\u9664");
      return;
    }
    setBaseHtml(html);
    setEditHtml(html);
    if (result !== null) {
      setFrameHeight(Math.round(result.height / scale));
    }
    setMarked(0);
    setEditing(true);
    setError(null);
  }, [result, scale]);
  const resetEdit = (0, import_react17.useCallback)(() => {
    if (baseHtml === null) return;
    setEditHtml(baseHtml);
    setMarked(0);
    if (result !== null && typeof result.html === "string" && result.html !== baseHtml) {
      const token = tokenRef.current + 1;
      tokenRef.current = token;
      setBusy(true);
      setError(null);
      render({
        messages,
        theme,
        width: cardWidth,
        quality,
        title: titleText,
        label: labelText,
        html: baseHtml,
        cwd
      }).then((nextResult) => {
        if (tokenRef.current !== token) return;
        setResult(nextResult);
        setFrameHeight(Math.round(nextResult.height / scale));
      }).catch((cause) => {
        if (tokenRef.current !== token) return;
        setError(cause instanceof Error ? cause.message : String(cause));
      }).finally(() => {
        if (tokenRef.current !== token) return;
        setBusy(false);
      });
    }
  }, [baseHtml, result, messages, theme, cardWidth, quality, titleText, labelText, scale, cwd]);
  const stopEdit = (0, import_react17.useCallback)(() => {
    setEditing(false);
    setBaseHtml(null);
    setEditHtml(null);
    setMarked(0);
  }, []);
  (0, import_react17.useEffect)(() => {
    if (!editing || editHtml === null) return void 0;
    const frame = editorRef.current;
    if (frame === null) return void 0;
    let disposed = false;
    const syncHeight = (doc) => {
      if (disposed) return;
      const body = doc.body;
      const root = doc.documentElement;
      if (body === null || root === null) return;
      const h = Math.max(body.scrollHeight, root.scrollHeight);
      if (h > 0) setFrameHeight(h);
    };
    const attach = () => {
      if (disposed) return;
      const doc = frame.contentDocument;
      if (doc === null || doc.body === null) return;
      if (doc.getElementById("webui-shot-editor-style") !== null) return;
      const style = doc.createElement("style");
      style.id = "webui-shot-editor-style";
      style.textContent = [
        "html, body { overflow: hidden !important; }",
        ".webui-shot-hover{outline:2px dashed #e5484d !important;outline-offset:2px !important;cursor:crosshair !important}",
        ".webui-shot-mark{outline:2px solid #e5484d !important;outline-offset:2px !important;position:relative !important;opacity:0.45 !important;overflow:visible !important;cursor:pointer !important}",
        '.webui-shot-mark::after{content:"\u5DF2\u9009 \xB7 \u70B9\u51FB\u53D6\u6D88";position:absolute;top:-20px;left:0;z-index:9999;padding:1px 6px;border-radius:4px;background:#e5484d;color:#fff;font:11px/16px sans-serif;pointer-events:none;white-space:nowrap;opacity:1 !important}'
      ].join("\n");
      doc.head.appendChild(style);
      syncHeight(doc);
      let ro = null;
      if (typeof ResizeObserver !== "undefined" && doc.body !== null) {
        ro = new ResizeObserver(() => {
          syncHeight(doc);
        });
        ro.observe(doc.body);
      }
      const onOver = (event) => {
        const target = event.target;
        if (target === null || target === doc.body || target === doc.documentElement || target.classList.contains("card")) return;
        doc.querySelectorAll(".webui-shot-hover").forEach((el) => el.classList.remove("webui-shot-hover"));
        if (!target.closest(".webui-shot-mark")) target.classList.add("webui-shot-hover");
      };
      const onOut = () => {
        doc.querySelectorAll(".webui-shot-hover").forEach((el) => el.classList.remove("webui-shot-hover"));
      };
      const onClick = (event) => {
        const target = event.target;
        if (target === null || target === doc.body || target === doc.documentElement || target.classList.contains("card")) return;
        event.preventDefault();
        event.stopPropagation();
        const existingMark = target.closest(".webui-shot-mark");
        if (existingMark !== null) {
          existingMark.classList.remove("webui-shot-mark");
        } else {
          target.classList.remove("webui-shot-hover");
          target.classList.add("webui-shot-mark");
        }
        setMarked(doc.querySelectorAll(".webui-shot-mark").length);
      };
      doc.addEventListener("mouseover", onOver);
      doc.addEventListener("mouseout", onOut);
      doc.addEventListener("click", onClick, true);
      setMarked(doc.querySelectorAll(".webui-shot-mark").length);
    };
    frame.addEventListener("load", attach);
    let tries = 0;
    const timer = window.setInterval(() => {
      tries += 1;
      if (frame.contentDocument?.body != null) {
        window.clearInterval(timer);
        attach();
      } else if (tries > 100) {
        window.clearInterval(timer);
      }
    }, 10);
    return () => {
      disposed = true;
      frame.removeEventListener("load", attach);
      window.clearInterval(timer);
    };
  }, [editing, editHtml]);
  const applyDelete = (0, import_react17.useCallback)(() => {
    const frame = editorRef.current;
    const doc = frame?.contentDocument;
    if (doc == null || doc.body === null) return;
    const marks = doc.querySelectorAll(".webui-shot-mark");
    if (marks.length === 0) {
      setError("\u8FD8\u6CA1\u6709\u6807\u8BB0\u4EFB\u4F55\u5143\u7D20\u2014\u2014\u5148\u70B9\u51FB\u60F3\u5220\u9664\u7684\u90E8\u5206");
      return;
    }
    doc.querySelectorAll(".webui-shot-hover").forEach((el) => el.classList.remove("webui-shot-hover"));
    doc.getElementById("webui-shot-editor-style")?.remove();
    marks.forEach((el) => el.remove());
    const next = `<!DOCTYPE html>${doc.documentElement.outerHTML}`;
    const token = tokenRef.current + 1;
    tokenRef.current = token;
    setBusy(true);
    setError(null);
    render({
      messages,
      theme,
      width: cardWidth,
      quality,
      title: titleText,
      label: labelText,
      html: next,
      cwd
    }).then((nextResult) => {
      if (tokenRef.current !== token) return;
      setResult(nextResult);
      if (typeof nextResult.html === "string") {
        setEditHtml(nextResult.html);
        setFrameHeight(Math.round(nextResult.height / scale));
        setMarked(0);
      }
    }).catch((cause) => {
      if (tokenRef.current !== token) return;
      setError(cause instanceof Error ? cause.message : String(cause));
    }).finally(() => {
      if (tokenRef.current !== token) return;
      setBusy(false);
    });
  }, [messages, theme, cardWidth, quality, titleText, labelText, scale, cwd]);
  const switchRange = (0, import_react17.useCallback)((next) => {
    setRange(next);
    if (!userEditedTitleRef.current) {
      if (next === "all") {
        if (sessionTitle && sessionTitle.trim() !== "") {
          setTitleText(sessionTitle);
        }
      } else {
        if (dialogueTitle && dialogueTitle.trim() !== "") {
          setTitleText(dialogueTitle);
        }
      }
    }
  }, [dialogueTitle, sessionTitle]);
  const onSave = (0, import_react17.useCallback)(() => {
    if (result === null) return;
    save(result.id).then((saved) => {
      setSavedPath(saved.path);
      setToast("\u5DF2\u4FDD\u5B58\u5230\u672C\u5730");
    }).catch((cause) => {
      setError(cause instanceof Error ? cause.message : String(cause));
    });
  }, [result]);
  const onCopy = (0, import_react17.useCallback)(() => {
    if (result === null) return;
    const write = async () => {
      const blob = await (await fetch(result.imageUrl, { cache: "no-store" })).blob();
      await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);
    };
    write().then(() => {
      setToast("\u56FE\u7247\u5DF2\u590D\u5236\u5230\u526A\u8D34\u677F");
    }).catch(() => {
      setError("\u590D\u5236\u5931\u8D25\uFF1A\u6D4F\u89C8\u5668\u62D2\u7EDD\u4E86\u526A\u8D34\u677F\u5199\u5165\uFF0C\u8BF7\u6539\u7528\u300C\u4E0B\u8F7D PNG\u300D");
    });
  }, [result]);
  const onCopyPath = (0, import_react17.useCallback)(() => {
    if (savedPath === null) return;
    navigator.clipboard?.writeText(savedPath).then(() => {
      setToast("\u8DEF\u5F84\u5DF2\u590D\u5236");
    }).catch(() => {
    });
  }, [savedPath]);
  const anim = closing ? "out" : "in";
  const meta = savedPath !== null ? savedPath : result !== null ? `${result.width} \xD7 ${result.height} px \xB7 ${humanBytes(result.bytes)} \xB7 ${messages.length} \u6761\u6D88\u606F` : "";
  return (0, import_react_dom2.createPortal)(
    /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)(import_jsx_runtime12.Fragment, { children: [
      /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("div", { className: cls2.mask, "aria-hidden": "true", onClick: onClose }),
      /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)("div", { className: cls2.panel, "data-anim": anim, "data-editing": editing || void 0, role: "dialog", "aria-modal": "true", "aria-label": "\u5BF9\u8BDD\u622A\u56FE", children: [
        /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)("div", { className: cls2.head, children: [
          /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("span", { className: cls2.title, children: "\u5BF9\u8BDD\u622A\u56FE" }),
          /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("button", { type: "button", className: cls2.close, "aria-label": "\u5173\u95ED", onClick: onClose, children: /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("svg", { width: "15", height: "15", viewBox: "0 0 16 16", fill: "none", "aria-hidden": "true", children: /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("path", { d: "M4 4l8 8M12 4l-8 8", stroke: "currentColor", strokeWidth: "1.6", strokeLinecap: "round" }) }) })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)("div", { className: cls2.bar, children: [
          /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)("div", { className: cls2.group, children: [
            /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("span", { className: cls2.label, children: "\u8303\u56F4" }),
            /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("div", { className: cls2.seg, role: "group", "aria-label": "\u622A\u56FE\u8303\u56F4", children: ["reply", "turn", "all"].map((item) => /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(
              "button",
              {
                type: "button",
                className: item === range ? `${cls2.segItem} ${cls2.segItemOn}` : cls2.segItem,
                "aria-pressed": item === range,
                onClick: () => {
                  switchRange(item);
                },
                children: RANGE_LABEL[item]
              },
              item
            )) })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)("div", { className: cls2.group, children: [
            /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("span", { className: cls2.label, children: "\u5BBD\u5EA6" }),
            /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("div", { className: cls2.seg, role: "group", "aria-label": "\u5361\u7247\u5BBD\u5EA6", children: WIDTH_PRESETS.map((w) => /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(
              "button",
              {
                type: "button",
                className: cardWidth === w ? `${cls2.segItem} ${cls2.segItemOn}` : cls2.segItem,
                "aria-pressed": cardWidth === w,
                onClick: () => {
                  setCardWidth(w);
                  setWidthDraft(String(w));
                },
                children: WIDTH_LABELS[w]
              },
              w
            )) }),
            /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)("div", { className: cls2.widthBox, title: "\u81EA\u5B9A\u4E49\u5BBD\u5EA6 (360~2560 px)", children: [
              /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(
                "input",
                {
                  type: "number",
                  className: cls2.widthInput,
                  value: widthDraft,
                  min: 360,
                  max: 2560,
                  step: 10,
                  "aria-label": "\u81EA\u5B9A\u4E49\u5361\u7247\u5BBD\u5EA6",
                  onChange: (event) => {
                    setWidthDraft(event.target.value);
                  },
                  onBlur: () => {
                    const parsed = parseInt(widthDraft, 10);
                    if (!Number.isNaN(parsed)) {
                      const clamped = Math.max(360, Math.min(2560, parsed));
                      setCardWidth(clamped);
                      setWidthDraft(String(clamped));
                    } else {
                      setWidthDraft(String(cardWidth));
                    }
                  },
                  onKeyDown: (event) => {
                    if (event.key === "Enter") {
                      event.currentTarget.blur();
                    } else if (event.key === "Escape") {
                      setWidthDraft(String(cardWidth));
                      event.currentTarget.blur();
                    }
                  }
                }
              ),
              /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("span", { className: cls2.unit, children: "px" })
            ] })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)("div", { className: cls2.group, children: [
            /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("span", { className: cls2.label, children: "\u753B\u8D28" }),
            /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("div", { className: cls2.seg, role: "group", "aria-label": "\u8F93\u51FA\u753B\u8D28", children: Object.keys(QUALITY_LABEL).map((item) => /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(
              "button",
              {
                type: "button",
                className: item === quality ? `${cls2.segItem} ${cls2.segItemOn}` : cls2.segItem,
                "aria-pressed": item === quality,
                onClick: () => {
                  setQuality(item);
                },
                children: QUALITY_LABEL[item]
              },
              item
            )) })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)("div", { className: cls2.group, children: [
            /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("span", { className: cls2.label, children: "\u4E3B\u9898" }),
            /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(
              "select",
              {
                className: cls2.select,
                value: theme,
                "aria-label": "\u622A\u56FE\u4E3B\u9898",
                disabled: editing,
                onChange: (event) => {
                  setTheme(event.target.value);
                },
                children: Object.keys(THEME_LABEL).map((item) => /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("option", { value: item, children: THEME_LABEL[item] }, item))
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)("div", { className: cls2.bar, children: [
          /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(
            EditableText,
            {
              label: "\u6807\u9898",
              value: titleText,
              placeholder: "\u7559\u7A7A\u5219\u4ECE\u6D88\u606F\u6B63\u6587\u81EA\u52A8\u63A8\u5BFC",
              onCommit: (val) => {
                userEditedTitleRef.current = true;
                setTitleText(val);
              }
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(
            EditableText,
            {
              label: "\u5FBD\u7AE0",
              value: labelText,
              placeholder: "\u5982\uFF1AKr",
              onCommit: setLabelText
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)("span", { className: cls2.meta, children: [
            "\u8F93\u51FA\u5BBD\u7EA6 ",
            cardWidth * scale,
            " px"
          ] })
        ] }),
        editing && editHtml !== null && /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)("div", { className: cls2.editBar, children: [
          /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("span", { className: cls2.editHint, children: "\u70B9\u51FB\u9875\u9762\u4E0A\u7684\u5143\u7D20\u8FDB\u884C\u5220\u9664\uFF1B\u70B9\u51FB\u5DF2\u6807\u8BB0\u7684\u5143\u7D20\u53D6\u6D88\u6807\u8BB0" }),
          /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)("span", { className: cls2.editCount, "data-n": marked > 0 ? "" : void 0, children: [
            "\u5DF2\u6807\u8BB0 ",
            marked,
            " \u4E2A"
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("span", { className: cls2.editSpacer }),
          /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(
            "button",
            {
              type: "button",
              className: cls2.action,
              disabled: busy,
              onClick: resetEdit,
              children: "\u91CD\u7F6E"
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(
            "button",
            {
              type: "button",
              className: cls2.action,
              disabled: busy,
              onClick: stopEdit,
              children: "\u9000\u51FA\u7F16\u8F91"
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)(
            "button",
            {
              type: "button",
              className: cls2.primary,
              disabled: busy || marked === 0,
              onClick: applyDelete,
              children: [
                "\u5220\u9664 ",
                marked > 0 ? `${marked} \u4E2A` : "",
                "\u5E76\u91CD\u65B0\u751F\u6210"
              ]
            }
          )
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("div", { className: cls2.stage, children: /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)("div", { className: cls2.canvas, children: [
          busy && /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)("div", { className: cls2.hint, children: [
            /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("span", { className: cls2.spinner }),
            /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("span", { children: "\u6B63\u5728\u6E32\u67D3\u2026" })
          ] }),
          !busy && error !== null && /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("div", { className: cls2.error, children: error }),
          !busy && error === null && (editing && editHtml !== null ? /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(
            "iframe",
            {
              ref: editorRef,
              className: cls2.frame,
              srcDoc: editHtml,
              sandbox: "allow-same-origin",
              title: "\u622A\u56FE\u7F16\u8F91\u9884\u89C8",
              style: {
                width: `${displayWidth}px`,
                maxWidth: "100%",
                height: frameHeight ? `${frameHeight}px` : void 0
              }
            }
          ) : result !== null && /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(
            "img",
            {
              className: cls2.img,
              src: result.imageUrl,
              alt: "\u622A\u56FE\u9884\u89C8",
              style: {
                width: `${displayWidth}px`,
                maxWidth: "100%"
              }
            }
          ))
        ] }) }),
        /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)("div", { className: cls2.foot, children: [
          /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("span", { className: toast !== null ? `${cls2.meta} ${cls2.toast}` : cls2.meta, children: toast !== null ? toast : meta }),
          /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)("div", { className: cls2.actions, children: [
            /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("button", { type: "button", className: cls2.action, disabled: busy, onClick: () => {
              if (editing) stopEdit();
              run();
            }, children: "\u91CD\u65B0\u6E32\u67D3" }),
            result !== null && typeof result.html === "string" && !editing && /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("button", { type: "button", className: cls2.action, disabled: busy, onClick: startEdit, children: "\u5143\u7D20\u5220\u9664" }),
            savedPath !== null && /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("button", { type: "button", className: cls2.action, onClick: onCopyPath, children: "\u590D\u5236\u8DEF\u5F84" }),
            /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("button", { type: "button", className: cls2.action, disabled: result === null, onClick: onCopy, children: "\u590D\u5236\u56FE\u7247" }),
            /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(
              "a",
              {
                className: cls2.action,
                href: result?.imageUrl ?? "#",
                download: "dsh-screenshot.png",
                "aria-disabled": result === null,
                onClick: (event) => {
                  if (result === null) event.preventDefault();
                },
                children: "\u4E0B\u8F7D PNG"
              }
            ),
            /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("button", { type: "button", className: cls2.action, onClick: () => {
              void reveal();
            }, children: "\u6253\u5F00\u76EE\u5F55" }),
            /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("button", { type: "button", className: cls2.primary, disabled: result === null, onClick: onSave, children: "\u4FDD\u5B58" })
          ] })
        ] })
      ] })
    ] }),
    document.body
  );
}

// src/client/shot/index.tsx
var import_jsx_runtime13 = require("react/jsx-runtime");
function CameraIcon() {
  return /* @__PURE__ */ (0, import_jsx_runtime13.jsxs)("svg", { width: "16", height: "16", viewBox: "0 0 16 16", fill: "none", "aria-hidden": "true", children: [
    /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(
      "path",
      {
        d: "M9.75 2.5H6.25L4.85 4.5H3C2.17 4.5 1.5 5.17 1.5 6V12.5C1.5 13.33 2.17 14 3 14H13C13.83 14 14.5 13.33 14.5 12.5V6C14.5 5.17 13.83 4.5 13 4.5H11.15L9.75 2.5Z",
        stroke: "currentColor",
        strokeWidth: "1.3",
        strokeLinecap: "round",
        strokeLinejoin: "round"
      }
    ),
    /* @__PURE__ */ (0, import_jsx_runtime13.jsx)("circle", { cx: "8", cy: "9.25", r: "2.25", stroke: "currentColor", strokeWidth: "1.3" }),
    /* @__PURE__ */ (0, import_jsx_runtime13.jsx)("circle", { cx: "12", cy: "6.75", r: "0.6", fill: "currentColor" })
  ] });
}
function AssistantScreenshotAction(props) {
  const { messageId, useChat, useSessions, sessionId } = props;
  const [open, setOpen] = (0, import_react18.useState)(false);
  const { closing, requestClose } = useModalClose(open, () => {
    setOpen(false);
  });
  const snapRef = (0, import_react18.useRef)(null);
  useChat((snapshot) => {
    setLatestChatSnapshot(snapshot);
    snapRef.current = snapshot;
    return 0;
  });
  const collect = (0, import_react18.useCallback)((range) => {
    const snapshot = snapRef.current;
    return snapshot === null ? [] : collectMessages(snapshot, messageId, range);
  }, [messageId]);
  const sessionTitle = useSessions((list) => {
    const byId = list.byId ?? {};
    return byId[String(sessionId)]?.displayTitle ?? "";
  });
  const cwd = useSessions((list) => {
    const byId = list.byId ?? {};
    return byId[String(sessionId)]?.cwd ?? "";
  });
  const dialogueTitle = snapRef.current ? deriveCurrentDialogueTitle(snapRef.current, messageId) : "";
  const defaultTitle = dialogueTitle || sessionTitle;
  const krStore = getKrChatStore();
  const krState = (0, import_react18.useSyncExternalStore)((cb) => krStore.subscribe(cb), () => krStore.snapshot);
  if (krState.activeTab !== "kr") {
    return null;
  }
  return /* @__PURE__ */ (0, import_jsx_runtime13.jsxs)(import_jsx_runtime13.Fragment, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(
      "button",
      {
        type: "button",
        className: open ? `${cls2.btn} ${cls2.btnBusy}` : cls2.btn,
        "aria-label": "\u622A\u56FE\u4E3A\u56FE\u7247",
        onClick: () => {
          setOpen(true);
        },
        children: /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(CameraIcon, {})
      }
    ),
    open && /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(
      ShotPanel,
      {
        closing,
        onClose: requestClose,
        collect,
        title: defaultTitle,
        dialogueTitle,
        sessionTitle,
        cwd
      }
    )
  ] });
}
function applyMessageScreenshot(ctx) {
  ensureStyles();
  ensureModalAnimStyles();
  ctx.slots.inject("conversation.chat.assistant-actions", () => ctx.slots.register({
    name: "conversation.chat.assistant-actions",
    id: "chat-flow-screenshot",
    order: 5
  }, AssistantScreenshotAction));
}

// src/client/shell-chrome.ts
var THEME_ATTR = "data-ds-dark-theme";
function embeddedInShell() {
  try {
    return window.self !== window.top;
  } catch {
    return true;
  }
}
function currentTheme2() {
  try {
    return document.body?.hasAttribute(THEME_ATTR) ? "dark" : "light";
  } catch {
    return "light";
  }
}
function postToParent(payload) {
  try {
    window.parent.postMessage(payload, "*");
  } catch {
  }
}
var mounted2 = false;
function mountShellChrome() {
  if (mounted2 || typeof document === "undefined") return;
  if (!embeddedInShell()) return;
  mounted2 = true;
  let last = "";
  const report = () => {
    const theme = currentTheme2();
    if (theme === last) return;
    last = theme;
    postToParent({ type: "dsh:theme", theme });
  };
  const start = () => {
    report();
    if (typeof MutationObserver === "undefined" || !document.body) return;
    try {
      new MutationObserver(report).observe(document.body, {
        attributes: true,
        attributeFilter: [THEME_ATTR]
      });
    } catch {
    }
  };
  if (document.body) start();
  else document.addEventListener("DOMContentLoaded", start, { once: true });
}

// src/client/kr-chat/styles.ts
var KR_STYLES = `
/* \u2550\u2550 \u5F53\u5904\u4E8E KR \u5BF9\u8BDD\u6A21\u5F0F\u65F6\uFF0C\u5916\u5C42 conversation-content \u6210\u4E3A\u53CC\u680F row \u5E03\u5C40 \u2550\u2550\u2550\u2550\u2550\u2550 */
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

/* \u9690\u85CF\u65E7\u7684\u6298\u53E0\u884C\u4E0E\u6298\u53E0 chip\uFF0C\u4EE5\u53CA\u5728 KR \u6A21\u5F0F\u4E0B\u5DE6\u4FA7\u9690\u85CF\u539F\u751F\u5DE5\u5177\u6811\u4E0E\u7D27\u51D1\u63A7\u5236\u884C\uFF08\u8BE6\u60C5\u6536\u655B\u81F3\u53F3\u4FA7\u5927\u76D8\uFF09 */
body[data-dsh-kr-chat="true"] .dts__process,
body[data-dsh-kr-chat="true"] .dts__entry,
body[data-dsh-kr-chat="true"] .dtt__chip,
body[data-dsh-kr-chat="true"] [data-chat-call-id],
body[data-dsh-kr-chat="true"] [data-chat-anchor-key^="call:"],
body[data-dsh-kr-chat="true"] [data-turn-process] {
  display: none !important;
}

/* \u2550\u2550 KR \u6A21\u5F0F\u4E0B\u5DE6\u4FA7\u5BF9\u8BDD\u6D41\u4EA4\u4E92\uFF08\u65E0\u67D3\u8272\u89C6\u89C9\uFF0C\u70B9\u51FB\u5373\u53EF\u76F4\u63A5\u9009\u4E2D\u8054\u52A8\u5927\u76D8\uFF09 \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550 */
body[data-dsh-kr-chat="true"] [data-conversation-scroll] [data-chat-turn] {
  cursor: pointer;
}

body[data-dsh-kr-chat="true"] [data-conversation-scroll] [data-chat-turn] p,
body[data-dsh-kr-chat="true"] [data-conversation-scroll] [data-chat-turn] pre,
body[data-dsh-kr-chat="true"] [data-conversation-scroll] [data-chat-turn] code,
body[data-dsh-kr-chat="true"] [data-conversation-scroll] [data-chat-turn] a {
  cursor: text;
}

/* \u2550\u2550 \u5934\u90E8 KR \u5BF9\u8BDD\u5206\u7C7B\u6807\u7B7E\uFF08\u4E0E\u5B98\u65B9\u539F\u751F\u6807\u7B7E\u4FDD\u6301\u5B8C\u5168\u4E00\u81F4\u7684\u5757\u7EA7\u6392\u7248\u4E0E\u57FA\u7EBF\uFF09 \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550 */
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

/* \u5F53\u5904\u4E8E KR \u6A21\u5F0F\u65F6\uFF0C\u539F\u751F\u7684\u201C\u5BF9\u8BDD\u201D\u4E0E\u201C\u8F68\u8FF9\u201D\u6309\u94AE\u4E0D\u8981\u663E\u793A\u6FC0\u6D3B\u9AD8\u4EAE\u4E0E\u4E0B\u5212\u7EBF */
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
   * \u4E09\u5C42\u8868\u9762\u523B\u610F\u62C9\u5F00\uFF1A\u5E95\u677F\u5FAE\u6C89\u3001\u5361\u7247\u6D6E\u8D77\u3001\u63CF\u8FB9\u53EF\u8FA8\u3002
   *
   * \u65E9\u524D canvas / surface / card \u4E09\u8005\u90FD\u53D6 --dsw-alias-bg-layer-*\uFF0C\u800C\u6D45\u8272\u4E3B\u9898\u4E0B
   * layer-1/2/3 \u5168\u90E8\u662F #fff \u2014\u2014 \u9762\u677F\u3001\u6EDA\u52A8\u533A\u3001\u5361\u7247\u7CCA\u6210\u4E00\u6574\u7247\u7EAF\u767D\uFF0C\u53EA\u9760 4% \u9ED1\u7684
   * \u63CF\u8FB9\u533A\u5206\uFF0C\u89C2\u611F\u5C31\u662F\u300C\u5E73\u3001\u810F\u3001\u6CA1\u5C42\u6B21\u300D\u3002
   *
   * \u8FD9\u91CC\u4E0D\u518D\u501F\u7528 --dsw-specific-tip\uFF1A\u6D45\u8272\u4E0B\u5B83\u662F #f5f6f7\uFF08\u6BD4\u5361\u7247\u6697\uFF0C\u6B63\u786E\uFF09\uFF0C
   * \u4F46\u6DF1\u8272\u4E0B\u662F #353638\uFF08\u6BD4\u5361\u7247 #232324 \u8FD8\u4EAE\uFF09\uFF0C\u4F1A\u8BA9\u5361\u7247\u5728\u6DF1\u8272\u4E3B\u9898\u91CC\u300C\u9677\u4E0B\u53BB\u300D\u3002
   * \u4E5F\u4E0D\u6DF7 --dsw-alias-label-primary \u2014\u2014 \u5B83\u6D45\u8272\u662F\u8FD1\u9ED1\u3001\u6DF1\u8272\u662F\u8FD1\u767D\uFF0C\u65B9\u5411\u4F1A\u53CD\u8FC7\u6765\u3002
   * \u56FA\u5B9A\u671D\u7EAF\u9ED1\u6DF7 6%\uFF1A\u4E24\u79CD\u4E3B\u9898\u4E0B\u5E95\u677F\u90FD\u6070\u597D\u6BD4\u5361\u7247\u6C89\u4E00\u6863\uFF0C\u5361\u7247\u59CB\u7EC8\u662F\u6D6E\u8D77\u7684\u90A3\u5C42\u3002
   */
  --kr-card-bg: var(--dsw-alias-bg-layer-1, #ffffff);
  --kr-surface-bg: var(--dsw-alias-bg-layer-1, #ffffff);
  --kr-canvas-bg: color-mix(in srgb, var(--kr-card-bg) 94%, #000000);
  /* \u63CF\u8FB9\u4ECE border-l1\uFF084% \u9ED1\uFF0C\u51E0\u4E4E\u770B\u4E0D\u89C1\uFF09\u63D0\u5230 l2\uFF0810%\uFF09\uFF0C\u5361\u7247\u8FB9\u754C\u624D\u6210\u7ACB */
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

/* \u5DE6\u4FA7\u4E3B\u5BF9\u8BDD\u6D41 */
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

/* \u53F3\u4FA7 Agent \u8F68\u8FF9\u5927\u76D8 */
.kr-split__side {
  width: 440px;
  min-width: 360px;
  max-width: 520px;
  flex: none;
  height: 100%;
  display: flex;
  flex-direction: column;
  /* \u5206\u9694\u9760\u4E00\u6839 hairline \u5373\u53EF\uFF1B\u539F\u6765\u7684 -4px/24px \u91CD\u6295\u5F71\u5728\u6D45\u8272\u4E0B\u810F\u4E14\u62A2\u620F */
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

/* \u2550\u2550 \u53F3\u680F\u9876\u90E8 Header \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550 */
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

/* \u2550\u2550 \u7A7A\u6001\uFF1A\u672C\u6B21\u5BF9\u8BDD\u5C1A\u65E0\u5185\u5BB9\uFF08\u65B0\u4F1A\u8BDD\u7A7A\u767D\u671F\uFF09 \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550 */
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

/* \u2550\u2550 \u53F3\u680F\u5185\u5BB9\u6EDA\u52A8\u533A \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550 */
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

/* \u5386\u53F2\u8F6E\u6B21\u63D0\u793A\u80F6\u56CA */
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

/* \u2550\u2550 \u7EDF\u8BA1\u6307\u6807\u836F\u4E38\uFF08\u5C55\u5F00\u65F6\u4EE5\u5355\u884C\u6574\u6D01\u5C55\u793A\uFF0C\u9644\u5E26\u5173\u95ED\u6309\u94AE\uFF09 \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550 */
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

/* \u2550\u2550 \u901A\u7528\u5361\u7247\u5BB9\u5668\uFF08\u9AD8\u96C5\u7EAF\u767D\u3001\u8F7B\u67D4\u6295\u5F71\u3001\u7CBE\u7EC6\u5FAE\u8FB9\u6846\uFF09 \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550 */
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

/* \u2550\u2550 \u4EFB\u52A1\u6982\u89C8\u5361\u7247\uFF08\u5355\u5361\u7247\u539F\u751F\u6781\u7B80\u8BBE\u8BA1\uFF09\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550 */
.kr-card--task {
  padding: 12px 14px;
}

/* \u6781\u7B80\u7EC6\u5E73\u6ED1\u8FDB\u5EA6\u6761\uFF082.5px\uFF0C\u8F7B\u91CF\u96C5\u81F4\uFF0C\u4E0D\u5272\u88C2\u754C\u9762\uFF09 */
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

/* \u4EFB\u52A1\u5217\u8868 */
.kr-task-list {
  display: flex;
  flex-direction: column;
  gap: 1px;
}

/* \u4EFB\u52A1\u884C\uFF1A\u8F7B\u76C8\u3001\u900F\u6C14\u3001\u5FAE\u53CD\u9988 */
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

/* \u2550\u2550 \u601D\u8003\u8FC7\u7A0B\u5361\u7247 \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550 */
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

/* \u2550\u2550 \u5DE5\u5177\u8C03\u7528\u5361\u7247\u4E0E\u70B9\u51FB\u5C55\u5F00\u4EA4\u4E92 \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550 */
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

/* \u6982\u89C8\u884C\uFF1A\u6574\u4F53\u53EF\u70B9\u51FB */
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

/* \u5C55\u5F00\u7684\u8BE6\u60C5\u9762\u677F */
.kr-tool-detail-panel {
  padding: 10px 12px;
  border-top: 1px solid var(--kr-card-border);
  background: var(--dsw-alias-bg-module-platform, rgba(0, 0, 0, 0.1));
  display: flex;
  flex-direction: column;
  gap: 10px;
  animation: kr-fade-in 0.2s ease-out;
}

/* \u53F0\u8D26\u4FE1\u606F\u6807\u7B7E */
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

/* \u9875\u7B7E\u680F */
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

/* \u9875\u7B7E\u5185\u5BB9 */
.kr-tool-detail__content {
  display: flex;
  flex-direction: column;
}

.kr-tool-detail__section {
  display: flex;
  flex-direction: column;
}

/* \u4EE3\u7801/\u6587\u672C\u6846 */
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

/* \u5E95\u90E8\u64CD\u4F5C\u6761 */
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

/* \u5931\u8D25\u63D0\u793A\u6761\uFF08\u53EA\u9648\u8FF0\u5931\u8D25\u539F\u56E0\uFF0C\u4E0D\u63D0\u4F9B\u91CD\u8BD5\u52A8\u4F5C\uFF09 */
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

/* \u2550\u2550 \u6267\u884C\u7ED3\u679C\u5361\u7247 \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550 */
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

/* \u2550\u2550 \u6536\u8D77\u540E\u6D6E\u52A8\u5C55\u5F00\u80F6\u56CA \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550 */
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

/* \u2550\u2550 \u5DE6\u4FA7\u5BF9\u8BDD\u6D41\u5361\u7247\u5316\uFF08\u53BB\u9664\u65E7\u6298\u53E0\uFF09 \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550 */
/* \u7ED3\u6784\u5316\u601D\u8003\u8FC7\u7A0B\u5361\u7247 */
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

/* \u6B63\u5728\u6267\u884C\u72B6\u6001\u5361\u7247 */
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

/* \u2550\u2550 \u9690\u85CF\u539F\u751F DSH \u4EFB\u52A1\u5217\u8868/Plan\u5361\u7247\uFF08KR\u6A21\u5F0F\u4E0B\u6536\u655B\u81F3\u53F3\u4FA7\u5927\u76D8\uFF09 \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550 */
body[data-dsh-kr-chat="true"] [data-testid="todo-panel"],
body[data-dsh-kr-chat="true"] [data-plan-artifacts="true"],
body[data-dsh-kr-chat="true"] [data-plan-card],
body[data-dsh-kr-chat="true"] [data-chat-flow-kind="plan"] {
  display: none !important;
}
`;
function injectKrStyles() {
  const STYLE_ID3 = "dsh-kr-chat-styles";
  if (typeof document === "undefined") return;
  if (document.getElementById(STYLE_ID3)) return;
  const tag = document.createElement("style");
  tag.id = STYLE_ID3;
  tag.textContent = KR_STYLES;
  document.head.appendChild(tag);
}

// src/client/kr-chat/kr-chat-controller.tsx
var import_react24 = require("react");
var import_client2 = require("react-dom/client");

// src/client/kr-chat/KrAgentPanel.tsx
var import_react23 = require("react");

// src/client/kr-chat/KrMetricPills.tsx
var import_react19 = require("react");
var import_jsx_runtime14 = require("react/jsx-runtime");
var KrMetricPills = (0, import_react19.memo)(function KrMetricPills2({
  turnNumber: turnNumber2,
  toolCount,
  failCount,
  durationText,
  onClose
}) {
  return /* @__PURE__ */ (0, import_jsx_runtime14.jsxs)("div", { className: "kr-pills-row", children: [
    /* @__PURE__ */ (0, import_jsx_runtime14.jsxs)("div", { className: "kr-pills", children: [
      /* @__PURE__ */ (0, import_jsx_runtime14.jsxs)("div", { className: "kr-pill", title: `\u5F53\u524D\u67E5\u770B\u7B2C ${turnNumber2} \u8F6E`, children: [
        /* @__PURE__ */ (0, import_jsx_runtime14.jsxs)("svg", { viewBox: "0 0 16 16", width: "13", height: "13", fill: "none", stroke: "currentColor", strokeWidth: "1.4", strokeLinecap: "round", strokeLinejoin: "round", children: [
          /* @__PURE__ */ (0, import_jsx_runtime14.jsx)("path", { d: "M8 2.5 14 5.5 8 8.5 2 5.5z" }),
          /* @__PURE__ */ (0, import_jsx_runtime14.jsx)("path", { d: "M2 8.5 8 11.5 14 8.5" }),
          /* @__PURE__ */ (0, import_jsx_runtime14.jsx)("path", { d: "M2 11.5 8 14.5 14 11.5" })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime14.jsxs)("span", { children: [
          "\u7B2C ",
          turnNumber2,
          " \u8F6E"
        ] })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime14.jsxs)("div", { className: "kr-pill", title: `\u672C\u8F6E\u5171\u53D1\u8D77 ${toolCount} \u6B21\u5DE5\u5177\u8C03\u7528`, children: [
        /* @__PURE__ */ (0, import_jsx_runtime14.jsx)("svg", { viewBox: "0 0 16 16", width: "13", height: "13", fill: "none", stroke: "currentColor", strokeWidth: "1.4", strokeLinecap: "round", strokeLinejoin: "round", children: /* @__PURE__ */ (0, import_jsx_runtime14.jsx)("path", { d: "M10 2a3 3 0 0 0-3 3v1L3.5 9.5a1.414 1.414 0 0 0 2 2L9 8h1a3 3 0 0 0 3-3V2z" }) }),
        /* @__PURE__ */ (0, import_jsx_runtime14.jsxs)("span", { children: [
          toolCount,
          " \u6B21\u5DE5\u5177\u8C03\u7528"
        ] })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime14.jsxs)("div", { className: `kr-pill ${failCount > 0 ? "kr-pill--fail" : ""}`, title: failCount > 0 ? `\u5B58\u5728 ${failCount} \u6B21\u6267\u884C\u5931\u8D25` : "\u65E0\u6267\u884C\u5931\u8D25", children: [
        /* @__PURE__ */ (0, import_jsx_runtime14.jsxs)("svg", { viewBox: "0 0 16 16", width: "13", height: "13", fill: "none", stroke: "currentColor", strokeWidth: "1.4", strokeLinecap: "round", strokeLinejoin: "round", children: [
          /* @__PURE__ */ (0, import_jsx_runtime14.jsx)("circle", { cx: "8", cy: "8", r: "6" }),
          /* @__PURE__ */ (0, import_jsx_runtime14.jsx)("path", { d: "M5.5 5.5 10.5 10.5M10.5 5.5 5.5 10.5" })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime14.jsxs)("span", { children: [
          failCount,
          " \u6B21\u5931\u8D25"
        ] })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime14.jsxs)("div", { className: "kr-pill", title: `\u672C\u8F6E\u6267\u884C\u8017\u65F6 ${durationText}`, children: [
        /* @__PURE__ */ (0, import_jsx_runtime14.jsxs)("svg", { viewBox: "0 0 16 16", width: "13", height: "13", fill: "none", stroke: "currentColor", strokeWidth: "1.4", strokeLinecap: "round", strokeLinejoin: "round", children: [
          /* @__PURE__ */ (0, import_jsx_runtime14.jsx)("circle", { cx: "8", cy: "8", r: "6" }),
          /* @__PURE__ */ (0, import_jsx_runtime14.jsx)("path", { d: "M8 4.5v3.8l2.5 1.5" })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime14.jsxs)("span", { children: [
          "\u8017\u65F6 ",
          durationText
        ] })
      ] })
    ] }),
    onClose && /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(
      "button",
      {
        type: "button",
        className: "kr-pills-close-btn",
        onClick: onClose,
        title: "\u6536\u8D77\u6307\u6807\uFF08\u76F4\u63A5\u6D88\u5931\uFF09",
        "aria-label": "\u6536\u8D77\u6307\u6807",
        children: /* @__PURE__ */ (0, import_jsx_runtime14.jsx)("svg", { width: "12", height: "12", viewBox: "0 0 14 14", fill: "none", stroke: "currentColor", strokeWidth: "1.6", children: /* @__PURE__ */ (0, import_jsx_runtime14.jsx)("path", { d: "M2 2l10 10M12 2L2 12", strokeLinecap: "round" }) })
      }
    )
  ] });
});

// src/client/kr-chat/KrTaskOverviewCard.tsx
var import_react20 = require("react");
var import_jsx_runtime15 = require("react/jsx-runtime");
var KrTaskOverviewCard = (0, import_react20.memo)(function KrTaskOverviewCard2({
  tasks,
  isRunning: isRunning2 = false
}) {
  const [collapsed, setCollapsed] = (0, import_react20.useState)(false);
  if (!tasks || tasks.length === 0) {
    return null;
  }
  const doneCount = tasks.filter((t) => t.status === "completed").length;
  const activeCount = tasks.filter((t) => t.status === "in_progress").length;
  const allDone = doneCount === tasks.length;
  const percent = Math.round(doneCount / tasks.length * 100);
  const progressText = allDone ? `${tasks.length} \u9879\u5DF2\u5B8C\u6210` : activeCount > 0 ? `${doneCount}/${tasks.length} \u5B8C\u6210 \xB7 \u8FDB\u884C\u4E2D` : `${doneCount}/${tasks.length} \u5B8C\u6210`;
  return /* @__PURE__ */ (0, import_jsx_runtime15.jsxs)("div", { className: "kr-card kr-card--task", children: [
    /* @__PURE__ */ (0, import_jsx_runtime15.jsxs)("div", { className: "kr-card__header", onClick: () => setCollapsed(!collapsed), children: [
      /* @__PURE__ */ (0, import_jsx_runtime15.jsx)("span", { className: "kr-card__icon", children: /* @__PURE__ */ (0, import_jsx_runtime15.jsxs)("svg", { width: "14", height: "14", viewBox: "0 0 14 14", fill: "none", "aria-hidden": "true", children: [
        /* @__PURE__ */ (0, import_jsx_runtime15.jsx)("path", { d: "M13.328 9.7v1.28H7.28V9.7h6.048zM13.328 2.97v1.28H7.28V2.97h6.048z", fill: "currentColor" }),
        /* @__PURE__ */ (0, import_jsx_runtime15.jsx)("path", { d: "M4.645 10.336a1.283 1.283 0 1 1-2.566 0 1.283 1.283 0 0 1 2.566 0zm1.28 0c0 1.415-1.148 2.563-2.563 2.563A2.563 2.563 0 0 1 .8 10.336c0-1.415 1.147-2.562 2.562-2.562 1.415 0 2.563 1.147 2.563 2.562z", fill: "currentColor" }),
        /* @__PURE__ */ (0, import_jsx_runtime15.jsx)("path", { d: "M4.645 3.612a1.283 1.283 0 1 1-2.565 0 1.283 1.283 0 0 1 2.565 0zm1.28 0C5.925 5.027 4.778 6.175 3.362 6.175A2.563 2.563 0 0 1 .8 3.612C.8 2.197 1.947 1.05 3.362 1.05c1.416 0 2.563 1.147 2.563 2.562z", fill: "currentColor" })
      ] }) }),
      /* @__PURE__ */ (0, import_jsx_runtime15.jsx)("span", { className: "kr-card__title", children: "\u4EFB\u52A1\u6982\u89C8" }),
      /* @__PURE__ */ (0, import_jsx_runtime15.jsx)("span", { className: `kr-card__badge ${isRunning2 || activeCount > 0 ? "kr-card__badge--running" : "kr-card__badge--done"}`, children: progressText }),
      /* @__PURE__ */ (0, import_jsx_runtime15.jsx)("span", { className: "kr-card__chevron", "data-collapsed": collapsed ? "true" : "false", children: /* @__PURE__ */ (0, import_jsx_runtime15.jsx)("svg", { width: "12", height: "12", viewBox: "0 0 12 12", fill: "none", stroke: "currentColor", strokeWidth: "1.5", children: /* @__PURE__ */ (0, import_jsx_runtime15.jsx)("path", { d: "M2.5 4.5 6 8 9.5 4.5", strokeLinecap: "round", strokeLinejoin: "round" }) }) })
    ] }),
    !collapsed && /* @__PURE__ */ (0, import_jsx_runtime15.jsx)("div", { className: "kr-task-progress-line", children: /* @__PURE__ */ (0, import_jsx_runtime15.jsx)(
      "div",
      {
        className: "kr-task-progress-line__fill",
        style: { width: `${percent}%` }
      }
    ) }),
    !collapsed && /* @__PURE__ */ (0, import_jsx_runtime15.jsx)("div", { className: "kr-task-list", children: tasks.map((task, index) => {
      const isCompleted = task.status === "completed";
      const isInProgress = task.status === "in_progress";
      return /* @__PURE__ */ (0, import_jsx_runtime15.jsxs)(
        "div",
        {
          className: `kr-task-item kr-task-item--${task.status}`,
          children: [
            /* @__PURE__ */ (0, import_jsx_runtime15.jsx)("span", { className: "kr-task-item__icon", children: isCompleted ? /* @__PURE__ */ (0, import_jsx_runtime15.jsxs)("svg", { width: "14", height: "14", viewBox: "0 0 14 14", fill: "none", "aria-hidden": "true", children: [
              /* @__PURE__ */ (0, import_jsx_runtime15.jsx)("circle", { cx: "7", cy: "7", r: "6.2", stroke: "currentColor", strokeWidth: "1.2" }),
              /* @__PURE__ */ (0, import_jsx_runtime15.jsx)(
                "path",
                {
                  d: "M10.963 5.714L7.702 8.976c-.222.221-.424.425-.61.574-.194.157-.429.303-.728.35a1.29 1.29 0 0 1-.479 0c-.3-.047-.534-.193-.729-.35-.185-.149-.387-.353-.61-.574L3.035 7.464l.928-.928 1.512 1.512c.242.242.387.386.504.48.107.086.13.079.111.076.045.007.091.007.136 0-.019.003.004-.004.111-.076.117-.094.262-.238.504-.48l3.262-3.262.928.928z",
                  fill: "currentColor"
                }
              )
            ] }) : isInProgress ? /* @__PURE__ */ (0, import_jsx_runtime15.jsx)("svg", { width: "14", height: "14", viewBox: "0 0 14 14", fill: "none", style: { animation: "kr-spin 1.2s linear infinite" }, children: /* @__PURE__ */ (0, import_jsx_runtime15.jsx)("circle", { cx: "7", cy: "7", r: "6.2", stroke: "currentColor", strokeWidth: "1.2", strokeDasharray: "7 7" }) }) : /* @__PURE__ */ (0, import_jsx_runtime15.jsx)("svg", { width: "14", height: "14", viewBox: "0 0 14 14", fill: "none", children: /* @__PURE__ */ (0, import_jsx_runtime15.jsx)("circle", { cx: "7", cy: "7", r: "6.2", stroke: "currentColor", strokeWidth: "1.2", strokeDasharray: "2.4 2.4" }) }) }),
            /* @__PURE__ */ (0, import_jsx_runtime15.jsx)("div", { className: "kr-task-item__content", children: task.content }),
            isInProgress && /* @__PURE__ */ (0, import_jsx_runtime15.jsx)("span", { className: "kr-task-item__tag kr-task-item__tag--running", children: "\u8FDB\u884C\u4E2D" })
          ]
        },
        task.id || index
      );
    }) })
  ] });
});

// src/client/kr-chat/KrReasoningCard.tsx
var import_react21 = require("react");
var import_jsx_runtime16 = require("react/jsx-runtime");
var KrReasoningCard = (0, import_react21.memo)(function KrReasoningCard2({
  reasoningTexts,
  running
}) {
  const [collapsed, setCollapsed] = (0, import_react21.useState)(false);
  const [expandedDetail, setExpandedDetail] = (0, import_react21.useState)(false);
  const points = (0, import_react21.useMemo)(() => {
    const full = reasoningTexts.join("\n");
    if (!full.trim()) return [];
    const lines = full.split("\n").map((l) => l.trim()).filter((l) => l.length > 0);
    const numbered = lines.filter((l) => /^\d+[\.、\s]/.test(l));
    if (numbered.length > 0) return numbered;
    return lines.slice(0, 4);
  }, [reasoningTexts]);
  if (reasoningTexts.length === 0 && !running) return null;
  return /* @__PURE__ */ (0, import_jsx_runtime16.jsxs)("div", { className: "kr-card kr-card--reasoning", children: [
    /* @__PURE__ */ (0, import_jsx_runtime16.jsxs)("div", { className: "kr-card__header", onClick: () => setCollapsed(!collapsed), children: [
      /* @__PURE__ */ (0, import_jsx_runtime16.jsx)("span", { className: "kr-card__icon", children: /* @__PURE__ */ (0, import_jsx_runtime16.jsx)("svg", { width: "16", height: "16", viewBox: "0 0 16 16", fill: "none", stroke: "currentColor", strokeWidth: "1.4", strokeLinecap: "round", strokeLinejoin: "round", children: /* @__PURE__ */ (0, import_jsx_runtime16.jsx)("path", { d: "M6 13h4M6.5 15h3M6 10.5c-.7-.7-1.5-1.7-1.5-3a4.5 4.5 0 1 1 9 0c0 1.3-.8 2.3-1.5 3-.5.5-.8 1.2-.8 2h-4.4c0-.8-.3-1.5-.8-2z" }) }) }),
      /* @__PURE__ */ (0, import_jsx_runtime16.jsxs)("span", { className: "kr-card__title", children: [
        "\u601D\u8003\u8FC7\u7A0B ",
        points.length > 0 ? `(${points.length})` : running ? "(\u601D\u8003\u4E2D\u2026)" : ""
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime16.jsx)("span", { className: "kr-card__chevron", "data-collapsed": collapsed ? "true" : "false", children: /* @__PURE__ */ (0, import_jsx_runtime16.jsx)("svg", { width: "12", height: "12", viewBox: "0 0 12 12", fill: "none", stroke: "currentColor", strokeWidth: "1.6", children: /* @__PURE__ */ (0, import_jsx_runtime16.jsx)("path", { d: "M2.5 4.5 6 8 9.5 4.5", strokeLinecap: "round", strokeLinejoin: "round" }) }) })
    ] }),
    !collapsed && /* @__PURE__ */ (0, import_jsx_runtime16.jsxs)("div", { className: "kr-reasoning-list", children: [
      points.length > 0 ? (expandedDetail ? points : points.slice(0, 3)).map((item, idx) => /* @__PURE__ */ (0, import_jsx_runtime16.jsx)("div", { className: "kr-reasoning-row", children: /* @__PURE__ */ (0, import_jsx_runtime16.jsx)("span", { children: item }) }, idx)) : /* @__PURE__ */ (0, import_jsx_runtime16.jsx)("div", { style: { color: "var(--dsw-alias-label-tertiary)" }, children: running ? "\u6B63\u5728\u6DF1\u5165\u63A8\u6F14\u9700\u6C42\u4E0E\u5B9E\u65BD\u65B9\u6848\u2026" : "\u672C\u8F6E\u65E0\u72EC\u7ACB\u601D\u8003\u8BB0\u5F55" }),
      points.length > 3 && /* @__PURE__ */ (0, import_jsx_runtime16.jsx)("div", { children: /* @__PURE__ */ (0, import_jsx_runtime16.jsxs)(
        "button",
        {
          type: "button",
          className: "kr-expand-btn",
          onClick: () => setExpandedDetail(!expandedDetail),
          children: [
            /* @__PURE__ */ (0, import_jsx_runtime16.jsx)("span", { children: expandedDetail ? "\u6536\u8D77\u8BE6\u60C5" : `\u5C55\u5F00\u5176\u4F59 ${points.length - 3} \u9879\u8981\u70B9` }),
            /* @__PURE__ */ (0, import_jsx_runtime16.jsx)(
              "svg",
              {
                width: "10",
                height: "10",
                viewBox: "0 0 12 12",
                fill: "none",
                stroke: "currentColor",
                strokeWidth: "1.6",
                strokeLinecap: "round",
                strokeLinejoin: "round",
                style: {
                  transform: expandedDetail ? "rotate(180deg)" : "none",
                  transition: "transform 0.15s ease"
                },
                children: /* @__PURE__ */ (0, import_jsx_runtime16.jsx)("path", { d: "M2.5 4.5 6 8 9.5 4.5" })
              }
            )
          ]
        }
      ) })
    ] })
  ] });
});

// src/client/kr-chat/KrToolCallsCard.tsx
var import_react22 = require("react");
var import_jsx_runtime17 = require("react/jsx-runtime");
var KrToolCallsCard = (0, import_react22.memo)(function KrToolCallsCard2({
  tools,
  turn,
  onInspectCall
}) {
  const [collapsed, setCollapsed] = (0, import_react22.useState)(false);
  const [expandedIds, setExpandedIds] = (0, import_react22.useState)(/* @__PURE__ */ new Set());
  const [activeTabs, setActiveTabs] = (0, import_react22.useState)({});
  const [copiedKey, setCopiedKey] = (0, import_react22.useState)(null);
  if (tools.length === 0) return null;
  const toggleExpand = (id, e) => {
    e.stopPropagation();
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };
  const handleCopy = (key, text, e) => {
    e.stopPropagation();
    try {
      navigator.clipboard.writeText(text);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 1800);
    } catch {
    }
  };
  const openDrawer = (e) => {
    e.stopPropagation();
    if (typeof turn === "number" && turn > 0) {
      activityStore().open(turn, "tools");
    }
  };
  const renderToolIcon = (name) => {
    const n = name.toLowerCase();
    if (n.includes("code") || n.includes("bash") || n.includes("terminal") || n.includes("cmd") || n.includes("pwsh")) {
      return /* @__PURE__ */ (0, import_jsx_runtime17.jsx)("svg", { viewBox: "0 0 16 16", width: "14", height: "14", fill: "none", stroke: "currentColor", strokeWidth: "1.4", strokeLinecap: "round", strokeLinejoin: "round", children: /* @__PURE__ */ (0, import_jsx_runtime17.jsx)("path", { d: "m4.5 5.5-3 3 3 3M11.5 5.5l3 3-3 3M9.5 3.5l-3 9" }) });
    }
    if (n.includes("read") || n.includes("browse") || n.includes("cat") || n.includes("view")) {
      return /* @__PURE__ */ (0, import_jsx_runtime17.jsxs)("svg", { viewBox: "0 0 16 16", width: "14", height: "14", fill: "none", stroke: "currentColor", strokeWidth: "1.4", strokeLinecap: "round", strokeLinejoin: "round", children: [
        /* @__PURE__ */ (0, import_jsx_runtime17.jsx)("path", { d: "M2.5 3.5A1.5 1.5 0 0 1 4 2h8a1.5 1.5 0 0 1 1.5 1.5v9A1.5 1.5 0 0 1 12 14H4a1.5 1.5 0 0 1-1.5-1.5v-9z" }),
        /* @__PURE__ */ (0, import_jsx_runtime17.jsx)("path", { d: "M5.5 5.5h5M5.5 8h5M5.5 10.5h3" })
      ] });
    }
    if (n.includes("edit") || n.includes("write") || n.includes("replace") || n.includes("patch")) {
      return /* @__PURE__ */ (0, import_jsx_runtime17.jsx)("svg", { viewBox: "0 0 16 16", width: "14", height: "14", fill: "none", stroke: "currentColor", strokeWidth: "1.4", strokeLinecap: "round", strokeLinejoin: "round", children: /* @__PURE__ */ (0, import_jsx_runtime17.jsx)("path", { d: "M11 2l3 3-8.5 8.5H2.5v-3L11 2z" }) });
    }
    if (n.includes("search") || n.includes("grep") || n.includes("find") || n.includes("glob")) {
      return /* @__PURE__ */ (0, import_jsx_runtime17.jsxs)("svg", { viewBox: "0 0 16 16", width: "14", height: "14", fill: "none", stroke: "currentColor", strokeWidth: "1.4", strokeLinecap: "round", strokeLinejoin: "round", children: [
        /* @__PURE__ */ (0, import_jsx_runtime17.jsx)("circle", { cx: "6.5", cy: "6.5", r: "4.5" }),
        /* @__PURE__ */ (0, import_jsx_runtime17.jsx)("path", { d: "m10 10 3.5 3.5" })
      ] });
    }
    return /* @__PURE__ */ (0, import_jsx_runtime17.jsxs)("svg", { viewBox: "0 0 16 16", width: "14", height: "14", fill: "none", stroke: "currentColor", strokeWidth: "1.4", strokeLinecap: "round", strokeLinejoin: "round", children: [
      /* @__PURE__ */ (0, import_jsx_runtime17.jsx)("circle", { cx: "8", cy: "8", r: "3" }),
      /* @__PURE__ */ (0, import_jsx_runtime17.jsx)("path", { d: "M8 1.5v2M8 12.5v2M1.5 8h2M12.5 8h2M3.4 3.4l1.4 1.4M11.2 11.2l1.4 1.4M3.4 12.6l1.4-1.4M11.2 4.8l1.4-1.4" })
    ] });
  };
  return /* @__PURE__ */ (0, import_jsx_runtime17.jsxs)("div", { className: "kr-card kr-card--tools", children: [
    /* @__PURE__ */ (0, import_jsx_runtime17.jsxs)("div", { className: "kr-card__header", onClick: () => setCollapsed(!collapsed), children: [
      /* @__PURE__ */ (0, import_jsx_runtime17.jsx)("span", { className: "kr-card__icon", children: /* @__PURE__ */ (0, import_jsx_runtime17.jsx)("svg", { width: "16", height: "16", viewBox: "0 0 16 16", fill: "none", stroke: "currentColor", strokeWidth: "1.4", strokeLinecap: "round", strokeLinejoin: "round", children: /* @__PURE__ */ (0, import_jsx_runtime17.jsx)("path", { d: "M14.7 10.8a2 2 0 0 0-2.8-2.8l-1.4 1.4-2.8-2.8 1.4-1.4a2 2 0 0 0-2.8-2.8L4.8 3.9a5 5 0 0 0-.9 5.3L1.2 12a1 1 0 0 0 1.4 1.4l2.8-2.7a5 5 0 0 0 5.3-.9l1.5-1.5z" }) }) }),
      /* @__PURE__ */ (0, import_jsx_runtime17.jsxs)("span", { className: "kr-card__title", children: [
        "\u5DE5\u5177\u8C03\u7528 (",
        tools.length,
        ")"
      ] }),
      typeof turn === "number" && turn > 0 && /* @__PURE__ */ (0, import_jsx_runtime17.jsxs)(
        "button",
        {
          type: "button",
          className: "kr-card__open-drawer-btn",
          title: "\u5728\u5C45\u4E2D\u5F39\u7A97\u4E2D\u67E5\u770B\u5B8C\u6574\u53F0\u8D26",
          onClick: openDrawer,
          children: [
            /* @__PURE__ */ (0, import_jsx_runtime17.jsx)("span", { children: "\u53F0\u8D26" }),
            /* @__PURE__ */ (0, import_jsx_runtime17.jsx)("svg", { width: "10", height: "10", viewBox: "0 0 12 12", fill: "none", stroke: "currentColor", strokeWidth: "1.5", children: /* @__PURE__ */ (0, import_jsx_runtime17.jsx)("path", { d: "M3.5 2.5h6v6M9.5 2.5l-6 6", strokeLinecap: "round", strokeLinejoin: "round" }) })
          ]
        }
      ),
      /* @__PURE__ */ (0, import_jsx_runtime17.jsx)("span", { className: "kr-card__chevron", "data-collapsed": collapsed ? "true" : "false", children: /* @__PURE__ */ (0, import_jsx_runtime17.jsx)("svg", { width: "12", height: "12", viewBox: "0 0 12 12", fill: "none", stroke: "currentColor", strokeWidth: "1.6", children: /* @__PURE__ */ (0, import_jsx_runtime17.jsx)("path", { d: "M2.5 4.5 6 8 9.5 4.5", strokeLinecap: "round", strokeLinejoin: "round" }) }) })
    ] }),
    !collapsed && /* @__PURE__ */ (0, import_jsx_runtime17.jsx)("div", { className: "kr-tools-list", children: tools.map((tool) => {
      const isExpanded = expandedIds.has(tool.id);
      const isFailed = tool.status === "failed";
      const isRunning2 = tool.status === "running";
      const tab = activeTabs[tool.id] ?? (isFailed ? "result" : tool.resultText ? "result" : tool.argsRaw ? "input" : "result");
      const command = typeof tool.args?.command === "string" ? tool.args.command : typeof tool.args?.cmd === "string" ? tool.args.cmd : typeof tool.args?.script === "string" ? tool.args.script : void 0;
      const filePath = typeof tool.args?.path === "string" ? tool.args.path : typeof tool.args?.file_path === "string" ? tool.args.file_path : void 0;
      return /* @__PURE__ */ (0, import_jsx_runtime17.jsxs)(
        "div",
        {
          className: `kr-tool-card-item ${isExpanded ? "kr-tool-card-item--expanded" : ""} ${isFailed ? "kr-tool-card-item--failed" : ""}`,
          children: [
            /* @__PURE__ */ (0, import_jsx_runtime17.jsxs)(
              "div",
              {
                className: "kr-tool-row",
                onClick: (e) => toggleExpand(tool.id, e),
                role: "button",
                tabIndex: 0,
                "aria-expanded": isExpanded,
                title: "\u70B9\u51FB\u5C55\u5F00/\u6536\u8D77\u8C03\u7528\u660E\u7EC6",
                children: [
                  /* @__PURE__ */ (0, import_jsx_runtime17.jsx)("span", { className: "kr-tool-icon", children: renderToolIcon(tool.name) }),
                  /* @__PURE__ */ (0, import_jsx_runtime17.jsx)("span", { className: "kr-tool-name", children: tool.name }),
                  /* @__PURE__ */ (0, import_jsx_runtime17.jsx)("span", { className: "kr-tool-detail", title: tool.description, children: tool.description }),
                  /* @__PURE__ */ (0, import_jsx_runtime17.jsx)("span", { className: "kr-tool-time", children: tool.durationText }),
                  /* @__PURE__ */ (0, import_jsx_runtime17.jsx)("span", { className: `kr-tool-status ${isFailed ? "kr-tool-status--fail" : "kr-tool-status--done"}`, children: isFailed ? /* @__PURE__ */ (0, import_jsx_runtime17.jsx)("svg", { width: "12", height: "12", viewBox: "0 0 12 12", fill: "none", stroke: "currentColor", strokeWidth: "1.6", children: /* @__PURE__ */ (0, import_jsx_runtime17.jsx)("path", { d: "M2.5 2.5l7 7M9.5 2.5l-7 7", strokeLinecap: "round" }) }) : isRunning2 ? /* @__PURE__ */ (0, import_jsx_runtime17.jsx)("svg", { width: "12", height: "12", viewBox: "0 0 12 12", fill: "none", stroke: "currentColor", strokeWidth: "1.6", children: /* @__PURE__ */ (0, import_jsx_runtime17.jsx)("circle", { cx: "6", cy: "6", r: "4.5", strokeDasharray: "3 3" }) }) : /* @__PURE__ */ (0, import_jsx_runtime17.jsx)("svg", { width: "12", height: "12", viewBox: "0 0 12 12", fill: "none", stroke: "currentColor", strokeWidth: "1.6", children: /* @__PURE__ */ (0, import_jsx_runtime17.jsx)("path", { d: "M2.5 6.2 4.8 8.5 9.5 3.8", strokeLinecap: "round", strokeLinejoin: "round" }) }) }),
                  /* @__PURE__ */ (0, import_jsx_runtime17.jsx)("span", { className: `kr-tool-row__chevron ${isExpanded ? "kr-tool-row__chevron--open" : ""}`, children: /* @__PURE__ */ (0, import_jsx_runtime17.jsx)("svg", { width: "11", height: "11", viewBox: "0 0 12 12", fill: "none", stroke: "currentColor", strokeWidth: "1.8", children: /* @__PURE__ */ (0, import_jsx_runtime17.jsx)("path", { d: "M2.5 4.5 6 8 9.5 4.5", strokeLinecap: "round", strokeLinejoin: "round" }) }) })
                ]
              }
            ),
            isExpanded && /* @__PURE__ */ (0, import_jsx_runtime17.jsxs)("div", { className: "kr-tool-detail-panel", children: [
              /* @__PURE__ */ (0, import_jsx_runtime17.jsxs)("div", { className: "kr-tool-detail__ledger", children: [
                /* @__PURE__ */ (0, import_jsx_runtime17.jsxs)("span", { className: "kr-tool-detail__badge", children: [
                  "\u72B6\u6001: ",
                  isFailed ? "\u6267\u884C\u5931\u8D25" : isRunning2 ? "\u6267\u884C\u4E2D" : "\u6267\u884C\u5B8C\u6BD5"
                ] }),
                /* @__PURE__ */ (0, import_jsx_runtime17.jsxs)("span", { className: "kr-tool-detail__badge", children: [
                  "\u8017\u65F6: ",
                  tool.durationText
                ] }),
                tool.exitCode !== void 0 && /* @__PURE__ */ (0, import_jsx_runtime17.jsxs)("span", { className: `kr-tool-detail__badge ${tool.exitCode !== 0 ? "kr-tool-detail__badge--err" : ""}`, children: [
                  "\u9000\u51FA\u7801: ",
                  tool.exitCode
                ] }),
                tool.signal && /* @__PURE__ */ (0, import_jsx_runtime17.jsxs)("span", { className: "kr-tool-detail__badge kr-tool-detail__badge--err", children: [
                  "\u4FE1\u53F7: ",
                  tool.signal
                ] })
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime17.jsxs)("div", { className: "kr-tool-detail__tabs", role: "tablist", children: [
                /* @__PURE__ */ (0, import_jsx_runtime17.jsx)(
                  "button",
                  {
                    type: "button",
                    role: "tab",
                    "aria-selected": tab === "result",
                    className: `kr-tool-detail__tab ${tab === "result" ? "kr-tool-detail__tab--active" : ""}`,
                    onClick: (e) => {
                      e.stopPropagation();
                      setActiveTabs((prev) => ({ ...prev, [tool.id]: "result" }));
                    },
                    children: "\u6267\u884C\u7ED3\u679C"
                  }
                ),
                /* @__PURE__ */ (0, import_jsx_runtime17.jsx)(
                  "button",
                  {
                    type: "button",
                    role: "tab",
                    "aria-selected": tab === "input",
                    className: `kr-tool-detail__tab ${tab === "input" ? "kr-tool-detail__tab--active" : ""}`,
                    onClick: (e) => {
                      e.stopPropagation();
                      setActiveTabs((prev) => ({ ...prev, [tool.id]: "input" }));
                    },
                    children: "\u8C03\u7528\u5165\u53C2"
                  }
                ),
                /* @__PURE__ */ (0, import_jsx_runtime17.jsx)(
                  "button",
                  {
                    type: "button",
                    role: "tab",
                    "aria-selected": tab === "raw",
                    className: `kr-tool-detail__tab ${tab === "raw" ? "kr-tool-detail__tab--active" : ""}`,
                    onClick: (e) => {
                      e.stopPropagation();
                      setActiveTabs((prev) => ({ ...prev, [tool.id]: "raw" }));
                    },
                    children: "\u539F\u59CB\u6570\u636E"
                  }
                )
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime17.jsxs)("div", { className: "kr-tool-detail__content", children: [
                tab === "result" && /* @__PURE__ */ (0, import_jsx_runtime17.jsxs)("div", { className: "kr-tool-detail__section", children: [
                  isFailed && /* @__PURE__ */ (0, import_jsx_runtime17.jsx)("div", { className: "kr-fail-card", style: { marginBottom: 8 }, children: /* @__PURE__ */ (0, import_jsx_runtime17.jsxs)("div", { className: "kr-fail-text", children: [
                    /* @__PURE__ */ (0, import_jsx_runtime17.jsxs)("svg", { width: "14", height: "14", viewBox: "0 0 14 14", fill: "none", stroke: "currentColor", strokeWidth: "1.5", strokeLinecap: "round", strokeLinejoin: "round", children: [
                      /* @__PURE__ */ (0, import_jsx_runtime17.jsx)("circle", { cx: "7", cy: "7", r: "5.5" }),
                      /* @__PURE__ */ (0, import_jsx_runtime17.jsx)("path", { d: "M7 4.5v3M7 9.8h.01" })
                    ] }),
                    /* @__PURE__ */ (0, import_jsx_runtime17.jsx)("span", { children: tool.errorMessage || "\u5DE5\u5177\u8C03\u7528\u6267\u884C\u5931\u8D25" })
                  ] }) }),
                  tool.resultText ? /* @__PURE__ */ (0, import_jsx_runtime17.jsxs)("div", { className: "kr-tool-code-box", children: [
                    /* @__PURE__ */ (0, import_jsx_runtime17.jsxs)("div", { className: "kr-tool-code-header", children: [
                      /* @__PURE__ */ (0, import_jsx_runtime17.jsx)("span", { children: "\u8F93\u51FA\u6587\u672C" }),
                      /* @__PURE__ */ (0, import_jsx_runtime17.jsx)(
                        "button",
                        {
                          type: "button",
                          className: "kr-tool-copy-btn",
                          onClick: (e) => handleCopy(`res-${tool.id}`, tool.resultText, e),
                          children: copiedKey === `res-${tool.id}` ? /* @__PURE__ */ (0, import_jsx_runtime17.jsxs)(import_jsx_runtime17.Fragment, { children: [
                            /* @__PURE__ */ (0, import_jsx_runtime17.jsx)("svg", { width: "10", height: "10", viewBox: "0 0 12 12", fill: "none", stroke: "currentColor", strokeWidth: "1.5", strokeLinecap: "round", strokeLinejoin: "round", children: /* @__PURE__ */ (0, import_jsx_runtime17.jsx)("path", { d: "M2 6.5 4.5 9 10 3" }) }),
                            /* @__PURE__ */ (0, import_jsx_runtime17.jsx)("span", { children: "\u5DF2\u590D\u5236" })
                          ] }) : /* @__PURE__ */ (0, import_jsx_runtime17.jsxs)(import_jsx_runtime17.Fragment, { children: [
                            /* @__PURE__ */ (0, import_jsx_runtime17.jsxs)("svg", { width: "10", height: "10", viewBox: "0 0 12 12", fill: "none", stroke: "currentColor", strokeWidth: "1.4", strokeLinecap: "round", strokeLinejoin: "round", children: [
                              /* @__PURE__ */ (0, import_jsx_runtime17.jsx)("rect", { x: "3.5", y: "3.5", width: "6.5", height: "6.5", rx: "1.2" }),
                              /* @__PURE__ */ (0, import_jsx_runtime17.jsx)("path", { d: "M8.5 3.5V2.2A1.2 1.2 0 0 0 7.3 1H2.2A1.2 1.2 0 0 0 1 2.2V7.3a1.2 1.2 0 0 0 1.2 1.2h1.3" })
                            ] }),
                            /* @__PURE__ */ (0, import_jsx_runtime17.jsx)("span", { children: "\u590D\u5236" })
                          ] })
                        }
                      )
                    ] }),
                    /* @__PURE__ */ (0, import_jsx_runtime17.jsx)("pre", { className: "kr-tool-code-pre", children: tool.resultText })
                  ] }) : !isFailed ? /* @__PURE__ */ (0, import_jsx_runtime17.jsx)("div", { className: "kr-tool-empty-note", children: isRunning2 ? "\u6B63\u5728\u7B49\u5F85\u5DE5\u5177\u8FD4\u56DE\u6267\u884C\u7ED3\u679C\u2026" : "\u5DE5\u5177\u8C03\u7528\u5DF2\u6210\u529F\u8FD4\u56DE\uFF0C\u65E0\u7EAF\u6587\u672C\u8F93\u51FA\uFF08\u53EF\u80FD\u4E3A\u53EA\u8BFB\u6587\u4EF6\u52A0\u8F7D\u6216\u5916\u90E8\u64CD\u4F5C\uFF09\u3002" }) : null
                ] }),
                tab === "input" && /* @__PURE__ */ (0, import_jsx_runtime17.jsxs)("div", { className: "kr-tool-detail__section", children: [
                  command && /* @__PURE__ */ (0, import_jsx_runtime17.jsxs)("div", { className: "kr-tool-code-box", style: { marginBottom: 8 }, children: [
                    /* @__PURE__ */ (0, import_jsx_runtime17.jsxs)("div", { className: "kr-tool-code-header", children: [
                      /* @__PURE__ */ (0, import_jsx_runtime17.jsx)("span", { children: "\u547D\u4EE4\u884C\u6267\u884C" }),
                      /* @__PURE__ */ (0, import_jsx_runtime17.jsx)(
                        "button",
                        {
                          type: "button",
                          className: "kr-tool-copy-btn",
                          onClick: (e) => handleCopy(`cmd-${tool.id}`, command, e),
                          children: copiedKey === `cmd-${tool.id}` ? /* @__PURE__ */ (0, import_jsx_runtime17.jsxs)(import_jsx_runtime17.Fragment, { children: [
                            /* @__PURE__ */ (0, import_jsx_runtime17.jsx)("svg", { width: "10", height: "10", viewBox: "0 0 12 12", fill: "none", stroke: "currentColor", strokeWidth: "1.5", strokeLinecap: "round", strokeLinejoin: "round", children: /* @__PURE__ */ (0, import_jsx_runtime17.jsx)("path", { d: "M2 6.5 4.5 9 10 3" }) }),
                            /* @__PURE__ */ (0, import_jsx_runtime17.jsx)("span", { children: "\u5DF2\u590D\u5236" })
                          ] }) : /* @__PURE__ */ (0, import_jsx_runtime17.jsxs)(import_jsx_runtime17.Fragment, { children: [
                            /* @__PURE__ */ (0, import_jsx_runtime17.jsxs)("svg", { width: "10", height: "10", viewBox: "0 0 12 12", fill: "none", stroke: "currentColor", strokeWidth: "1.4", strokeLinecap: "round", strokeLinejoin: "round", children: [
                              /* @__PURE__ */ (0, import_jsx_runtime17.jsx)("rect", { x: "3.5", y: "3.5", width: "6.5", height: "6.5", rx: "1.2" }),
                              /* @__PURE__ */ (0, import_jsx_runtime17.jsx)("path", { d: "M8.5 3.5V2.2A1.2 1.2 0 0 0 7.3 1H2.2A1.2 1.2 0 0 0 1 2.2V7.3a1.2 1.2 0 0 0 1.2 1.2h1.3" })
                            ] }),
                            /* @__PURE__ */ (0, import_jsx_runtime17.jsx)("span", { children: "\u590D\u5236" })
                          ] })
                        }
                      )
                    ] }),
                    /* @__PURE__ */ (0, import_jsx_runtime17.jsxs)("pre", { className: "kr-tool-code-pre", style: { color: "var(--kr-accent)" }, children: [
                      "$ ",
                      command
                    ] })
                  ] }),
                  filePath && /* @__PURE__ */ (0, import_jsx_runtime17.jsxs)("div", { className: "kr-tool-path-row", children: [
                    /* @__PURE__ */ (0, import_jsx_runtime17.jsx)("span", { className: "kr-tool-path-label", children: "\u8DEF\u5F84:" }),
                    /* @__PURE__ */ (0, import_jsx_runtime17.jsx)("code", { className: "kr-tool-path-code", children: filePath })
                  ] }),
                  tool.argsRaw ? /* @__PURE__ */ (0, import_jsx_runtime17.jsxs)("div", { className: "kr-tool-code-box", children: [
                    /* @__PURE__ */ (0, import_jsx_runtime17.jsxs)("div", { className: "kr-tool-code-header", children: [
                      /* @__PURE__ */ (0, import_jsx_runtime17.jsx)("span", { children: "\u8F93\u5165\u53C2\u6570 JSON" }),
                      /* @__PURE__ */ (0, import_jsx_runtime17.jsx)(
                        "button",
                        {
                          type: "button",
                          className: "kr-tool-copy-btn",
                          onClick: (e) => handleCopy(`arg-${tool.id}`, tool.argsRaw, e),
                          children: copiedKey === `arg-${tool.id}` ? /* @__PURE__ */ (0, import_jsx_runtime17.jsxs)(import_jsx_runtime17.Fragment, { children: [
                            /* @__PURE__ */ (0, import_jsx_runtime17.jsx)("svg", { width: "10", height: "10", viewBox: "0 0 12 12", fill: "none", stroke: "currentColor", strokeWidth: "1.5", strokeLinecap: "round", strokeLinejoin: "round", children: /* @__PURE__ */ (0, import_jsx_runtime17.jsx)("path", { d: "M2 6.5 4.5 9 10 3" }) }),
                            /* @__PURE__ */ (0, import_jsx_runtime17.jsx)("span", { children: "\u5DF2\u590D\u5236" })
                          ] }) : /* @__PURE__ */ (0, import_jsx_runtime17.jsxs)(import_jsx_runtime17.Fragment, { children: [
                            /* @__PURE__ */ (0, import_jsx_runtime17.jsxs)("svg", { width: "10", height: "10", viewBox: "0 0 12 12", fill: "none", stroke: "currentColor", strokeWidth: "1.4", strokeLinecap: "round", strokeLinejoin: "round", children: [
                              /* @__PURE__ */ (0, import_jsx_runtime17.jsx)("rect", { x: "3.5", y: "3.5", width: "6.5", height: "6.5", rx: "1.2" }),
                              /* @__PURE__ */ (0, import_jsx_runtime17.jsx)("path", { d: "M8.5 3.5V2.2A1.2 1.2 0 0 0 7.3 1H2.2A1.2 1.2 0 0 0 1 2.2V7.3a1.2 1.2 0 0 0 1.2 1.2h1.3" })
                            ] }),
                            /* @__PURE__ */ (0, import_jsx_runtime17.jsx)("span", { children: "\u590D\u5236" })
                          ] })
                        }
                      )
                    ] }),
                    /* @__PURE__ */ (0, import_jsx_runtime17.jsx)("pre", { className: "kr-tool-code-pre", children: tool.argsRaw })
                  ] }) : /* @__PURE__ */ (0, import_jsx_runtime17.jsx)("div", { className: "kr-tool-empty-note", children: "\u65E0\u8F93\u5165\u53C2\u6570" })
                ] }),
                tab === "raw" && /* @__PURE__ */ (0, import_jsx_runtime17.jsx)("div", { className: "kr-tool-detail__section", children: /* @__PURE__ */ (0, import_jsx_runtime17.jsxs)("div", { className: "kr-tool-code-box", children: [
                  /* @__PURE__ */ (0, import_jsx_runtime17.jsxs)("div", { className: "kr-tool-code-header", children: [
                    /* @__PURE__ */ (0, import_jsx_runtime17.jsx)("span", { children: "\u5B8C\u6574\u4E0A\u4E0B\u6587\u8F7D\u8377 (\u53EA\u8BFB)" }),
                    /* @__PURE__ */ (0, import_jsx_runtime17.jsx)(
                      "button",
                      {
                        type: "button",
                        className: "kr-tool-copy-btn",
                        onClick: (e) => handleCopy(`raw-${tool.id}`, tool.rawResultJson || tool.argsRaw || "{}", e),
                        children: copiedKey === `raw-${tool.id}` ? /* @__PURE__ */ (0, import_jsx_runtime17.jsxs)(import_jsx_runtime17.Fragment, { children: [
                          /* @__PURE__ */ (0, import_jsx_runtime17.jsx)("svg", { width: "10", height: "10", viewBox: "0 0 12 12", fill: "none", stroke: "currentColor", strokeWidth: "1.5", strokeLinecap: "round", strokeLinejoin: "round", children: /* @__PURE__ */ (0, import_jsx_runtime17.jsx)("path", { d: "M2 6.5 4.5 9 10 3" }) }),
                          /* @__PURE__ */ (0, import_jsx_runtime17.jsx)("span", { children: "\u5DF2\u590D\u5236" })
                        ] }) : /* @__PURE__ */ (0, import_jsx_runtime17.jsxs)(import_jsx_runtime17.Fragment, { children: [
                          /* @__PURE__ */ (0, import_jsx_runtime17.jsxs)("svg", { width: "10", height: "10", viewBox: "0 0 12 12", fill: "none", stroke: "currentColor", strokeWidth: "1.4", strokeLinecap: "round", strokeLinejoin: "round", children: [
                            /* @__PURE__ */ (0, import_jsx_runtime17.jsx)("rect", { x: "3.5", y: "3.5", width: "6.5", height: "6.5", rx: "1.2" }),
                            /* @__PURE__ */ (0, import_jsx_runtime17.jsx)("path", { d: "M8.5 3.5V2.2A1.2 1.2 0 0 0 7.3 1H2.2A1.2 1.2 0 0 0 1 2.2V7.3a1.2 1.2 0 0 0 1.2 1.2h1.3" })
                          ] }),
                          /* @__PURE__ */ (0, import_jsx_runtime17.jsx)("span", { children: "\u590D\u5236" })
                        ] })
                      }
                    )
                  ] }),
                  /* @__PURE__ */ (0, import_jsx_runtime17.jsx)("pre", { className: "kr-tool-code-pre", children: tool.rawResultJson || tool.argsRaw || '{\n  "status": "ready"\n}' })
                ] }) })
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime17.jsxs)("div", { className: "kr-tool-detail__footer", children: [
                /* @__PURE__ */ (0, import_jsx_runtime17.jsx)(
                  "button",
                  {
                    type: "button",
                    className: "kr-tool-footer-btn",
                    onClick: (e) => handleCopy(`all-${tool.id}`, `[\u5DE5\u5177\u8C03\u7528] ${tool.name}
[\u6458\u8981] ${tool.description}
[\u8017\u65F6] ${tool.durationText}
[\u5165\u53C2]
${tool.argsRaw || ""}
[\u7ED3\u679C]
${tool.resultText || tool.errorMessage || ""}`, e),
                    children: copiedKey === `all-${tool.id}` ? /* @__PURE__ */ (0, import_jsx_runtime17.jsxs)(import_jsx_runtime17.Fragment, { children: [
                      /* @__PURE__ */ (0, import_jsx_runtime17.jsx)("svg", { width: "11", height: "11", viewBox: "0 0 12 12", fill: "none", stroke: "currentColor", strokeWidth: "1.5", strokeLinecap: "round", strokeLinejoin: "round", children: /* @__PURE__ */ (0, import_jsx_runtime17.jsx)("path", { d: "M2 6.5 4.5 9 10 3" }) }),
                      /* @__PURE__ */ (0, import_jsx_runtime17.jsx)("span", { children: "\u5DF2\u590D\u5236\u5168\u90E8\u660E\u7EC6" })
                    ] }) : /* @__PURE__ */ (0, import_jsx_runtime17.jsxs)(import_jsx_runtime17.Fragment, { children: [
                      /* @__PURE__ */ (0, import_jsx_runtime17.jsxs)("svg", { width: "11", height: "11", viewBox: "0 0 12 12", fill: "none", stroke: "currentColor", strokeWidth: "1.4", strokeLinecap: "round", strokeLinejoin: "round", children: [
                        /* @__PURE__ */ (0, import_jsx_runtime17.jsx)("rect", { x: "3.5", y: "3.5", width: "6.5", height: "6.5", rx: "1.2" }),
                        /* @__PURE__ */ (0, import_jsx_runtime17.jsx)("path", { d: "M8.5 3.5V2.2A1.2 1.2 0 0 0 7.3 1H2.2A1.2 1.2 0 0 0 1 2.2V7.3a1.2 1.2 0 0 0 1.2 1.2h1.3" })
                      ] }),
                      /* @__PURE__ */ (0, import_jsx_runtime17.jsx)("span", { children: "\u590D\u5236\u660E\u7EC6" })
                    ] })
                  }
                ),
                tool.callId && onInspectCall && /* @__PURE__ */ (0, import_jsx_runtime17.jsxs)(
                  "button",
                  {
                    type: "button",
                    className: "kr-tool-footer-btn kr-tool-footer-btn--link",
                    onClick: (e) => {
                      e.stopPropagation();
                      onInspectCall(tool.callId);
                    },
                    title: "\u5728\u5B98\u65B9\u8F68\u8FF9\u89C6\u56FE\u4E2D\u5B9A\u4F4D\u672C\u6761\u8C03\u7528",
                    children: [
                      /* @__PURE__ */ (0, import_jsx_runtime17.jsxs)("svg", { width: "11", height: "11", viewBox: "0 0 12 12", fill: "none", stroke: "currentColor", strokeWidth: "1.4", strokeLinecap: "round", strokeLinejoin: "round", children: [
                        /* @__PURE__ */ (0, import_jsx_runtime17.jsx)("circle", { cx: "5", cy: "5", r: "3.5" }),
                        /* @__PURE__ */ (0, import_jsx_runtime17.jsx)("path", { d: "M7.8 7.8 11 11" })
                      ] }),
                      /* @__PURE__ */ (0, import_jsx_runtime17.jsx)("span", { children: "\u8F68\u8FF9\u5B9A\u4F4D" }),
                      /* @__PURE__ */ (0, import_jsx_runtime17.jsx)("svg", { width: "9", height: "9", viewBox: "0 0 12 12", fill: "none", stroke: "currentColor", strokeWidth: "1.4", strokeLinecap: "round", strokeLinejoin: "round", children: /* @__PURE__ */ (0, import_jsx_runtime17.jsx)("path", { d: "M3.5 2.5h6v6M9.5 2.5l-6 6" }) })
                    ]
                  }
                ),
                typeof turn === "number" && turn > 0 && /* @__PURE__ */ (0, import_jsx_runtime17.jsxs)(
                  "button",
                  {
                    type: "button",
                    className: "kr-tool-footer-btn kr-tool-footer-btn--link",
                    onClick: openDrawer,
                    title: "\u5728\u5C45\u4E2D\u5F39\u7A97\u4E2D\u67E5\u770B\u672C\u8F6E\u5168\u90E8\u8C03\u7528\u8BE6\u60C5",
                    children: [
                      /* @__PURE__ */ (0, import_jsx_runtime17.jsxs)("svg", { width: "11", height: "11", viewBox: "0 0 12 12", fill: "none", stroke: "currentColor", strokeWidth: "1.4", strokeLinecap: "round", strokeLinejoin: "round", children: [
                        /* @__PURE__ */ (0, import_jsx_runtime17.jsx)("rect", { x: "1.5", y: "2", width: "9", height: "8", rx: "1.2" }),
                        /* @__PURE__ */ (0, import_jsx_runtime17.jsx)("path", { d: "M1.5 4.5h9" })
                      ] }),
                      /* @__PURE__ */ (0, import_jsx_runtime17.jsx)("span", { children: "\u5F39\u7A97\u5B8C\u6574\u53F0\u8D26" }),
                      /* @__PURE__ */ (0, import_jsx_runtime17.jsx)("svg", { width: "9", height: "9", viewBox: "0 0 12 12", fill: "none", stroke: "currentColor", strokeWidth: "1.4", strokeLinecap: "round", strokeLinejoin: "round", children: /* @__PURE__ */ (0, import_jsx_runtime17.jsx)("path", { d: "M3.5 2.5h6v6M9.5 2.5l-6 6" }) })
                    ]
                  }
                )
              ] })
            ] })
          ]
        },
        tool.id
      );
    }) })
  ] });
});

// src/client/kr-chat/KrAgentPanel.tsx
var import_jsx_runtime18 = require("react/jsx-runtime");
var KrAgentPanel = (0, import_react23.memo)(function KrAgentPanel2({
  latestTurn,
  isTurnRunning,
  onCollapse
}) {
  const store = getKrChatStore();
  const krState = (0, import_react23.useSyncExternalStore)(
    (cb) => store.subscribe(cb),
    () => store.snapshot
  );
  const [snapTick, setSnapTick] = (0, import_react23.useState)(0);
  (0, import_react23.useEffect)(() => {
    return subscribeLatestChatSnapshot(() => setSnapTick((t) => t + 1));
  }, []);
  const snapshot = latestChatSnapshot || (typeof window !== "undefined" ? window.__dshLatestChatSnapshot__ : null);
  const snapTurns = snapshot?.navigation?.current?.map((n) => n.turn).filter((n) => typeof n === "number" && n > 0) || [];
  const domTurns = typeof document !== "undefined" ? Array.from(document.querySelectorAll("[data-chat-turn]")).map((el) => parseInt(el.getAttribute("data-chat-turn") || "0", 10)).filter((n) => Number.isFinite(n) && n > 0) : [];
  const effectiveLatestTurn = snapTurns.length > 0 ? Math.max(...snapTurns) : domTurns.length > 0 ? Math.max(...domTurns) : latestTurn > 0 ? latestTurn : 1;
  const validSelectedTurn = krState.selectedTurn !== null && krState.selectedTurn <= effectiveLatestTurn ? krState.selectedTurn : null;
  (0, import_react23.useEffect)(() => {
    if (krState.selectedTurn !== null && krState.selectedTurn > effectiveLatestTurn) {
      store.setSelectedTurn(null);
    }
  }, [krState.selectedTurn, effectiveLatestTurn, store]);
  const displayTurn = validSelectedTurn ?? effectiveLatestTurn;
  const isViewingHistory = validSelectedTurn !== null && validSelectedTurn !== effectiveLatestTurn;
  const currentRunning = isTurnRunning && !isViewingHistory;
  const actStore = activityStore();
  const [actTick, setActTick] = (0, import_react23.useState)(0);
  (0, import_react23.useEffect)(() => {
    return actStore.subscribe(() => setActTick((t) => t + 1));
  }, [actStore]);
  const [todoTick, setTodoTick] = (0, import_react23.useState)(0);
  (0, import_react23.useEffect)(() => {
    return subscribeLiveDshTodos(() => setTodoTick((t) => t + 1));
  }, []);
  const turnData = (0, import_react23.useMemo)(() => {
    const snap = latestChatSnapshot || (typeof window !== "undefined" ? window.__dshLatestChatSnapshot__ : null);
    if (snap) {
      try {
        const collected = collectTurnNodes(snap, displayTurn);
        return {
          tools: collected.tools,
          reasoning: collected.reasoning,
          tasks: collected.tasks,
          turnStart: collected.turnStart,
          turnEnd: collected.turnEnd,
          durationMs: collected.durationMs
        };
      } catch (err) {
        console.warn("[kr-agent-panel] collectTurnNodes error", err);
      }
    }
    return actStore.get(displayTurn);
  }, [displayTurn, actTick, snapTick]);
  const now = useNow(isTurnRunning && !isViewingHistory);
  const reasoningTexts = (0, import_react23.useMemo)(() => {
    return (turnData?.reasoning ?? []).map((r) => r.text).filter((t) => t.trim() !== "");
  }, [turnData, actTick, snapTick]);
  const tools = (0, import_react23.useMemo)(() => {
    return turnData?.tools ?? [];
  }, [turnData, actTick, snapTick]);
  const toolNames = (0, import_react23.useMemo)(() => {
    return tools.map((t) => {
      try {
        return callName(t.data.root);
      } catch {
        return "tool";
      }
    });
  }, [tools]);
  const turnStart = turnData?.turnStart;
  const turnEnd = turnData?.turnEnd;
  let elapsedMs;
  if (currentRunning && turnStart) {
    elapsedMs = Math.max(0, now - turnStart);
  } else if (typeof turnData?.durationMs === "number" && turnData.durationMs > 0) {
    elapsedMs = turnData.durationMs;
  } else if (typeof turnStart === "number" && typeof turnEnd === "number" && turnEnd >= turnStart) {
    elapsedMs = turnEnd - turnStart;
  } else {
    let toolsDuration = 0;
    for (const t of tools) {
      try {
        const d = callDurationMs(t.data.root, now);
        if (d && d > 0) toolsDuration += d;
      } catch {
      }
    }
    elapsedMs = toolsDuration > 0 ? toolsDuration : tools.length * 800 + 1500;
  }
  const elapsedSec = elapsedMs / 1e3;
  const durationText = formatDuration(elapsedMs);
  let failCount = 0;
  const toolViews = tools.map((node, index) => {
    let name = "tool";
    let title = "\u6267\u884C\u5DE5\u5177\u64CD\u4F5C";
    let duration = "20ms";
    let status = "success";
    let errorMsg;
    let callId;
    let argsRaw;
    let args;
    let resultText2;
    let rawJson;
    let exitCode;
    let signal;
    try {
      const root = node.data.root;
      callId = ("callId" in root ? root.callId : void 0) || node.key;
      name = callName(root);
      title = rowTitle(root);
      argsRaw = toolArgsRaw(root);
      args = argFields(argsRaw);
      resultText2 = resultParagraphs(root);
      rawJson = rawResultJson(root);
      const facts = executionFacts(root);
      exitCode = facts.exitCode;
      signal = facts.signal;
      const ms = callDurationMs(root, now);
      duration = ms !== void 0 ? `${Math.round(ms)}ms` : "10ms";
      if (isRunning(root)) {
        status = "running";
      } else {
        const r = root.result;
        const isErr = root.isError || r && (r.error || typeof r.exitCode === "number" && r.exitCode !== 0) || exitCode !== void 0 && exitCode !== 0;
        if (isErr) {
          status = "failed";
          failCount += 1;
          errorMsg = typeof r?.error === "string" ? r.error : typeof root.error === "string" ? root.error : root.error?.message || "\u5DE5\u5177\u6267\u884C\u8FD4\u56DE\u975E\u96F6\u72B6\u6001\u6216\u5F02\u5E38";
        }
      }
    } catch {
      title = `\u5DE5\u5177\u8C03\u7528 #${index + 1}`;
    }
    return {
      id: node.key || `tool-${index}`,
      callId,
      name,
      description: title,
      durationText: duration,
      status,
      errorMessage: errorMsg,
      argsRaw,
      args,
      resultText: resultText2,
      rawResultJson: rawJson,
      exitCode,
      signal
    };
  });
  const tasks = (0, import_react23.useMemo)(() => {
    if (turnData?.tasks && turnData.tasks.length > 0) {
      return turnData.tasks;
    }
    if (!isViewingHistory) {
      const live = getLiveDshTodos();
      if (live && live.length > 0) {
        return live.map((item, idx) => ({
          id: `live-${idx}`,
          content: item.content,
          status: item.status
        }));
      }
    }
    return [];
  }, [turnData, isViewingHistory, todoTick, snapTick]);
  const hasContent = currentRunning || tasks.length > 0 || reasoningTexts.length > 0 || tools.length > 0;
  const subtitle = (0, import_react23.useMemo)(() => {
    if (tasks.length > 0) {
      const done = tasks.filter((t) => t.status === "completed").length;
      return `${done}/${tasks.length} \u9879\u4EFB\u52A1\u5DF2\u5B8C\u6210`;
    }
    if (currentRunning) return "\u6B63\u5728\u6267\u884C\u5DE5\u5177\u8C03\u7528\u2026";
    if (tools.length > 0) return `${tools.length} \u6B21\u5DE5\u5177\u8C03\u7528 \xB7 \u8017\u65F6 ${durationText}`;
    return hasContent ? "\u5BF9\u8BDD\u5DF2\u5C31\u7EEA" : "\u7B49\u5F85\u672C\u6B21\u5BF9\u8BDD\u5F00\u59CB\u2026";
  }, [tasks, currentRunning, tools.length, durationText, hasContent]);
  const [showMetrics, setShowMetrics] = (0, import_react23.useState)(false);
  const [shotOpen, setShotOpen] = (0, import_react23.useState)(false);
  const { closing: shotClosing, requestClose: requestShotClose } = useModalClose(shotOpen, () => {
    setShotOpen(false);
  });
  (0, import_react23.useEffect)(() => {
    setShowMetrics(false);
    setShotOpen(false);
  }, [latestChatSessionId]);
  const collectForShot = (0, import_react23.useCallback)((range) => {
    if (!latestChatSnapshot) return [];
    return collectMessages(latestChatSnapshot, displayTurn, range);
  }, [displayTurn]);
  const dialogueTitle = (0, import_react23.useMemo)(() => {
    const snap = latestChatSnapshot || (typeof window !== "undefined" ? window.__dshLatestChatSnapshot__ : null);
    if (snap?.navigation?.current && Array.isArray(snap.navigation.current)) {
      const navItem = snap.navigation.current.find((n) => n.turn === displayTurn);
      if (navItem?.prompt && typeof navItem.prompt === "string" && navItem.prompt.trim() !== "") {
        const p = navItem.prompt.trim();
        return p.length > 60 ? `${p.slice(0, 60)}\u2026` : p;
      }
    }
    if (snap) {
      try {
        const title = deriveCurrentDialogueTitle(snap, displayTurn);
        if (title && title.trim() !== "") {
          return title;
        }
      } catch (err) {
        console.warn("[kr-agent-panel] deriveCurrentDialogueTitle error", err);
      }
    }
    if (typeof document !== "undefined") {
      try {
        const userEl = document.querySelector(`[data-chat-turn="${displayTurn}"][data-chat-flow-kind="user"], [data-chat-turn="${displayTurn}"] [data-chat-flow-kind="user"]`);
        if (userEl) {
          const text = userEl.textContent?.trim();
          if (text) {
            const clean = text.replace(/\d+月\d+日\s+\d+:\d+.*$/, "").trim();
            if (clean) return clean.length > 60 ? `${clean.slice(0, 60)}\u2026` : clean;
          }
        }
        const turnEls = document.querySelectorAll(`[data-chat-turn="${displayTurn}"]`);
        for (const el of turnEls) {
          const kind2 = el.getAttribute("data-chat-flow-kind");
          if (kind2 === "assistant-step") {
            const text = el.textContent?.trim();
            if (text) {
              const clean = text.replace(/^本轮完成.*?[Git\d]+/, "").trim();
              if (clean) return clean.length > 60 ? `${clean.slice(0, 60)}\u2026` : clean;
            }
          }
        }
      } catch {
      }
    }
    return "";
  }, [displayTurn, actTick, snapTick]);
  const headerTitle = (0, import_react23.useMemo)(() => {
    if (dialogueTitle && dialogueTitle.trim() !== "") {
      return dialogueTitle;
    }
    if (currentRunning) return "Agent \u6267\u884C\u4E2D";
    if (validSelectedTurn !== null) return "\u5DF2\u9009\u5BF9\u8BDD";
    return hasContent ? "\u4EFB\u52A1\u5DF2\u5B8C\u6210" : "\u65B0\u5BF9\u8BDD";
  }, [dialogueTitle, currentRunning, validSelectedTurn, hasContent]);
  return /* @__PURE__ */ (0, import_jsx_runtime18.jsxs)("div", { className: `kr-split__side ${krState.fullscreen ? "kr-split__side--fullscreen" : ""}`, children: [
    /* @__PURE__ */ (0, import_jsx_runtime18.jsxs)("div", { className: "kr-panel__header", children: [
      /* @__PURE__ */ (0, import_jsx_runtime18.jsx)("div", { className: "kr-panel__avatar", children: /* @__PURE__ */ (0, import_jsx_runtime18.jsxs)("svg", { viewBox: "0 0 24 24", width: "18", height: "18", fill: "none", stroke: "currentColor", strokeWidth: "1.5", strokeLinecap: "round", strokeLinejoin: "round", children: [
        /* @__PURE__ */ (0, import_jsx_runtime18.jsx)("rect", { x: "4", y: "8", width: "16", height: "12", rx: "2" }),
        /* @__PURE__ */ (0, import_jsx_runtime18.jsx)("path", { d: "M12 2v6M9 5h6M8 14h.01M16 14h.01M10 17h4" })
      ] }) }),
      /* @__PURE__ */ (0, import_jsx_runtime18.jsxs)("div", { className: "kr-panel__titles", children: [
        /* @__PURE__ */ (0, import_jsx_runtime18.jsxs)("div", { className: "kr-panel__title-row", children: [
          /* @__PURE__ */ (0, import_jsx_runtime18.jsx)("span", { className: `kr-panel__status-dot ${currentRunning ? "kr-panel__status-dot--running" : ""}` }),
          /* @__PURE__ */ (0, import_jsx_runtime18.jsx)("span", { className: "kr-panel__title", title: headerTitle, children: headerTitle }),
          validSelectedTurn !== null && /* @__PURE__ */ (0, import_jsx_runtime18.jsx)("span", { style: { fontSize: 11, padding: "1px 6px", borderRadius: 4, background: "rgba(127, 127, 127, 0.12)", color: "var(--dsw-alias-label-secondary)", border: "1px solid var(--kr-card-border)", fontWeight: 500, flex: "none" }, children: "\u5DF2\u9009\u5BF9\u8BDD" })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime18.jsx)(
          "div",
          {
            className: "kr-panel__subtitle kr-panel__subtitle--clickable",
            title: `${subtitle}\uFF08\u70B9\u51FB\u67E5\u770B/\u6536\u8D77\u6267\u884C\u7EDF\u8BA1\u6307\u6807\uFF09`,
            onClick: () => setShowMetrics((v) => !v),
            children: subtitle
          }
        )
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime18.jsxs)("div", { className: "kr-panel__actions", children: [
        /* @__PURE__ */ (0, import_jsx_runtime18.jsx)(
          "button",
          {
            type: "button",
            className: `kr-panel__action-btn ${showMetrics ? "kr-panel__action-btn--active" : ""}`,
            onClick: () => setShowMetrics((v) => !v),
            title: showMetrics ? "\u6536\u8D77\u6267\u884C\u7EDF\u8BA1\u6307\u6807\uFF08\u76F4\u63A5\u6D88\u5931\uFF09" : `\u67E5\u770B\u6267\u884C\u7EDF\u8BA1\u6307\u6807 (${tools.length} \u6B21\u5DE5\u5177 \xB7 \u8017\u65F6 ${durationText})`,
            "aria-label": "\u67E5\u770B\u6267\u884C\u7EDF\u8BA1\u6307\u6807",
            children: /* @__PURE__ */ (0, import_jsx_runtime18.jsxs)("svg", { width: "14", height: "14", viewBox: "0 0 16 16", fill: "none", stroke: "currentColor", strokeWidth: "1.4", strokeLinecap: "round", strokeLinejoin: "round", children: [
              /* @__PURE__ */ (0, import_jsx_runtime18.jsx)("path", { d: "M8 2.5 14 5.5 8 8.5 2 5.5z" }),
              /* @__PURE__ */ (0, import_jsx_runtime18.jsx)("path", { d: "M2 8.5 8 11.5 14 8.5" }),
              /* @__PURE__ */ (0, import_jsx_runtime18.jsx)("path", { d: "M2 11.5 8 14.5 14 11.5" })
            ] })
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime18.jsx)(
          "button",
          {
            type: "button",
            className: "kr-panel__action-btn",
            onClick: () => setShotOpen(true),
            title: "\u751F\u6210\u5BF9\u8BDD\u622A\u56FE",
            "aria-label": "\u751F\u6210\u5BF9\u8BDD\u622A\u56FE",
            children: /* @__PURE__ */ (0, import_jsx_runtime18.jsxs)("svg", { width: "14", height: "14", viewBox: "0 0 16 16", fill: "none", stroke: "currentColor", strokeWidth: "1.3", children: [
              /* @__PURE__ */ (0, import_jsx_runtime18.jsx)(
                "path",
                {
                  d: "M9.75 2.5H6.25L4.85 4.5H3C2.17 4.5 1.5 5.17 1.5 6V12.5C1.5 13.33 2.17 14 3 14H13C13.83 14 14.5 13.33 14.5 12.5V6C14.5 5.17 13.83 4.5 13 4.5H11.15L9.75 2.5Z",
                  strokeLinecap: "round",
                  strokeLinejoin: "round"
                }
              ),
              /* @__PURE__ */ (0, import_jsx_runtime18.jsx)("circle", { cx: "8", cy: "9.25", r: "2.25" })
            ] })
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime18.jsx)(
          "button",
          {
            type: "button",
            className: "kr-panel__action-btn",
            onClick: onCollapse,
            title: "\u6536\u8D77\u53F3\u4FA7\u5927\u76D8",
            "aria-label": "\u6536\u8D77\u53F3\u4FA7\u5927\u76D8",
            children: /* @__PURE__ */ (0, import_jsx_runtime18.jsx)("svg", { width: "14", height: "14", viewBox: "0 0 14 14", fill: "none", stroke: "currentColor", strokeWidth: "1.8", children: /* @__PURE__ */ (0, import_jsx_runtime18.jsx)("path", { d: "M2 2l10 10M12 2L2 12", strokeLinecap: "round" }) })
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime18.jsxs)("div", { className: "kr-panel__scroll", children: [
      !hasContent && !isViewingHistory && /* @__PURE__ */ (0, import_jsx_runtime18.jsxs)("div", { className: "kr-panel__empty", children: [
        /* @__PURE__ */ (0, import_jsx_runtime18.jsx)("div", { className: "kr-panel__empty-icon", children: /* @__PURE__ */ (0, import_jsx_runtime18.jsxs)("svg", { viewBox: "0 0 24 24", width: "26", height: "26", fill: "none", stroke: "currentColor", strokeWidth: "1.3", strokeLinecap: "round", strokeLinejoin: "round", children: [
          /* @__PURE__ */ (0, import_jsx_runtime18.jsx)("rect", { x: "4", y: "8", width: "16", height: "12", rx: "2" }),
          /* @__PURE__ */ (0, import_jsx_runtime18.jsx)("path", { d: "M12 2v6M9 5h6M8 14h.01M16 14h.01M10 17h4" })
        ] }) }),
        /* @__PURE__ */ (0, import_jsx_runtime18.jsx)("div", { className: "kr-panel__empty-title", children: "\u7B49\u5F85\u672C\u6B21\u5BF9\u8BDD\u5F00\u59CB" }),
        /* @__PURE__ */ (0, import_jsx_runtime18.jsx)("div", { className: "kr-panel__empty-desc", children: "\u53D1\u9001\u6D88\u606F\u540E\uFF0C\u4EFB\u52A1\u3001\u601D\u8003\u4E0E\u5DE5\u5177\u8C03\u7528\u4F1A\u5B9E\u65F6\u663E\u793A\u5728\u8FD9\u91CC" })
      ] }),
      validSelectedTurn !== null && /* @__PURE__ */ (0, import_jsx_runtime18.jsxs)("div", { className: "kr-panel__turn-hint", children: [
        /* @__PURE__ */ (0, import_jsx_runtime18.jsxs)("span", { style: { overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 220 }, title: dialogueTitle || "\u5DF2\u9009\u5BF9\u8BDD", children: [
          "\u5DF2\u9009\u5BF9\u8BDD\uFF1A",
          dialogueTitle || "\u5F53\u524D\u5BF9\u8BDD"
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime18.jsx)(
          "button",
          {
            type: "button",
            className: "kr-panel__turn-hint-btn",
            onClick: () => store.setSelectedTurn(null),
            title: "\u89E3\u9664\u6307\u5B9A\u5BF9\u8BDD\uFF0C\u81EA\u52A8\u8DDF\u968F\u6700\u65B0\u5BF9\u8BDD",
            children: isViewingHistory ? "\u8FD4\u56DE\u6700\u65B0\u5BF9\u8BDD" : "\u8DDF\u968F\u6700\u65B0\u5BF9\u8BDD"
          }
        )
      ] }),
      showMetrics && /* @__PURE__ */ (0, import_jsx_runtime18.jsx)(
        KrMetricPills,
        {
          turnNumber: displayTurn,
          toolCount: tools.length,
          failCount,
          durationText,
          onClose: () => setShowMetrics(false)
        }
      ),
      /* @__PURE__ */ (0, import_jsx_runtime18.jsx)(KrTaskOverviewCard, { tasks, isRunning: currentRunning }),
      /* @__PURE__ */ (0, import_jsx_runtime18.jsx)(KrReasoningCard, { reasoningTexts, running: currentRunning }),
      /* @__PURE__ */ (0, import_jsx_runtime18.jsx)(
        KrToolCallsCard,
        {
          tools: toolViews,
          turn: displayTurn,
          onInspectCall: (callId) => {
            try {
              actStore.handlers().inspectCall(callId);
            } catch (err) {
              console.warn("[kr-agent-panel] inspectCall error", err);
            }
          }
        }
      )
    ] }),
    shotOpen && /* @__PURE__ */ (0, import_jsx_runtime18.jsx)(
      ShotPanel,
      {
        closing: shotClosing,
        onClose: requestShotClose,
        collect: collectForShot,
        initialRange: "turn",
        title: dialogueTitle || "\u5BF9\u8BDD\u8BB0\u5F55",
        dialogueTitle,
        sessionTitle: dialogueTitle,
        cwd: ""
      }
    )
  ] });
});

// src/client/kr-chat/kr-chat-controller.tsx
var import_jsx_runtime19 = require("react/jsx-runtime");
var isSwitchingToKr = false;
function resolveLatestTurn() {
  const snap = latestChatSnapshot || (typeof window !== "undefined" ? window.__dshLatestChatSnapshot__ : null);
  const snapTurns = snap?.navigation?.current?.map((n) => n.turn).filter((n) => typeof n === "number" && n > 0) || [];
  if (snapTurns.length > 0) return Math.max(...snapTurns);
  const domTurns = typeof document !== "undefined" ? Array.from(document.querySelectorAll("[data-chat-turn]")).map((el) => parseInt(el.getAttribute("data-chat-turn") || "0", 10)).filter((n) => Number.isFinite(n) && n > 0) : [];
  return domTurns.length > 0 ? Math.max(...domTurns) : 1;
}
function syncKrTab(tablist) {
  const store = getKrChatStore();
  const isKr = store.snapshot.activeTab === "kr";
  let btn = document.getElementById("kr-chat-tab-btn");
  const chatBtn = Array.from(tablist.querySelectorAll('button[role="tab"]')).find((b) => b.id !== "kr-chat-tab-btn");
  const siblingClass = chatBtn?.className || "";
  const baseClass = siblingClass.split(" ").find((c) => c.includes("tab") && !c.includes("Active")) || "wSkVaW_tab";
  const activeClass = "wSkVaW_tabActive";
  if (!btn || !btn.isConnected || btn.parentElement !== tablist) {
    if (btn) {
      try {
        btn.remove();
      } catch {
      }
    }
    btn = document.createElement("button");
    btn.type = "button";
    btn.role = "tab";
    btn.id = "kr-chat-tab-btn";
    btn.textContent = "KR\u5BF9\u8BDD";
    btn.onclick = (e) => {
      e.stopPropagation();
      isSwitchingToKr = true;
      try {
        store.setActiveTab("kr");
        const trajectoryBtn = Array.from(tablist.querySelectorAll('button[role="tab"]')).find((b) => b.id !== "kr-chat-tab-btn" && b.textContent?.trim().includes("\u8F68\u8FF9"));
        const isTrajectoryActive = trajectoryBtn?.getAttribute("aria-selected") === "true" || trajectoryBtn?.className.includes("Active");
        if (isTrajectoryActive) {
          const chatBtn2 = Array.from(tablist.querySelectorAll('button[role="tab"]')).find((b) => b.id !== "kr-chat-tab-btn" && b.textContent?.trim().includes("\u5BF9\u8BDD"));
          chatBtn2?.click();
        }
      } finally {
        setTimeout(() => {
          isSwitchingToKr = false;
        }, 100);
      }
      syncKrTab(tablist);
    };
    tablist.insertBefore(btn, tablist.firstChild);
  }
  btn.className = isKr ? `${baseClass} ${activeClass} kr-tab-btn kr-tab-btn--active` : `${baseClass} kr-tab-btn`;
  btn.setAttribute("aria-selected", isKr ? "true" : "false");
  if (chatBtn && chatBtn.textContent?.trim().includes("\u5BF9\u8BDD")) {
    if (isKr) {
      chatBtn.classList.remove(activeClass);
      chatBtn.setAttribute("aria-selected", "false");
    } else if (store.snapshot.activeTab === "chat") {
      chatBtn.classList.add(activeClass);
      chatBtn.setAttribute("aria-selected", "true");
    }
  }
}
function KrPanelSystem() {
  const store = getKrChatStore();
  const krState = (0, import_react24.useSyncExternalStore)(
    (cb) => store.subscribe(cb),
    () => store.snapshot
  );
  const [, setActTick] = (0, import_react24.useState)(0);
  (0, import_react24.useEffect)(() => {
    return activityStore().subscribe(() => setActTick((t) => t + 1));
  }, []);
  const [, setSnapTick] = (0, import_react24.useState)(0);
  (0, import_react24.useEffect)(() => {
    return subscribeLatestChatSnapshot(() => setSnapTick((t) => t + 1));
  }, []);
  const hasBoundSession = latestChatSessionId !== null || typeof document !== "undefined" && Boolean(
    document.querySelector('header [role="tablist"]') || document.querySelectorAll("[data-chat-turn]").length > 0
  );
  if (krState.activeTab !== "kr" || !hasBoundSession) {
    return null;
  }
  const latestTurn = Math.max(1, resolveLatestTurn());
  const isRunning2 = typeof document !== "undefined" && Boolean(
    document.querySelector(".kr-flow-executing-card") || document.querySelector('[data-turn-process] [data-running="true"]') || document.querySelector('.dtt__assistant[data-running="true"]')
  );
  if (krState.panelOpen) {
    return /* @__PURE__ */ (0, import_jsx_runtime19.jsx)(
      KrAgentPanel,
      {
        latestTurn,
        isTurnRunning: isRunning2,
        onCollapse: () => store.setPanelOpen(false)
      }
    );
  }
  return /* @__PURE__ */ (0, import_jsx_runtime19.jsxs)(
    "button",
    {
      type: "button",
      className: "kr-expand-capsule",
      onClick: () => store.setPanelOpen(true),
      title: "\u5C55\u5F00 Agent \u5B9E\u65F6\u8F68\u8FF9\u5927\u76D8",
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime19.jsx)("svg", { viewBox: "0 0 24 24", fill: "currentColor", children: /* @__PURE__ */ (0, import_jsx_runtime19.jsx)("path", { d: "M12 2a2 2 0 0 1 2 2c0 .74-.4 1.38-1 1.72V7h4a3 3 0 0 1 3 3v8a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3v-8a3 3 0 0 1 3-3h4V5.72A2 2 0 0 1 10 4a2 2 0 0 1 2-2zm-5 7a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1v-8a1 1 0 0 0-1-1H7zm2 3a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3zm6 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3z" }) }),
        /* @__PURE__ */ (0, import_jsx_runtime19.jsx)("span", { children: "Agent \u8F68\u8FF9\u5927\u76D8" })
      ]
    }
  );
}
var mounted3 = false;
var panelRoot = null;
var currentContainer = null;
var lastRenderedSessionId = void 0;
function mountKrChatController() {
  if (mounted3 || typeof document === "undefined") return;
  mounted3 = true;
  const store = getKrChatStore();
  store.setActiveTab("kr");
  document.addEventListener("click", (e) => {
    if (isSwitchingToKr || !e.isTrusted) return;
    const target = e.target?.closest('header [role="tablist"] button[role="tab"]');
    if (!target || target.id === "kr-chat-tab-btn") return;
    const text = target.textContent?.trim() || "";
    if (text.includes("\u8F68\u8FF9")) {
      store.setActiveTab("trajectory");
    } else if (text.includes("\u5BF9\u8BDD")) {
      store.setActiveTab("chat");
    }
    const tablist = document.querySelector('header [role="tablist"]');
    if (tablist) syncKrTab(tablist);
  }, true);
  document.addEventListener("click", (e) => {
    const target = e.target;
    if (!target) return;
    const btn = target.closest("button, div, span, a");
    if (btn && btn.textContent?.trim() === "\u65B0\u4F1A\u8BDD") {
      try {
        clearLatestChatSnapshot();
      } catch {
      }
      setTimeout(syncDom, 0);
      setTimeout(syncDom, 50);
      setTimeout(syncDom, 200);
    }
  }, true);
  window.addEventListener("popstate", () => {
    setTimeout(syncDom, 50);
  });
  document.addEventListener("click", (e) => {
    const state = store.snapshot;
    if (state.activeTab !== "kr") return;
    const target = e.target;
    if (!target) return;
    const sel = window.getSelection();
    if (sel && sel.toString().trim().length > 0) {
      return;
    }
    if (target.closest('#dsh-kr-panel-container, header, button, a, input, textarea, select, [role="button"], [role="menuitem"], .tsh-panel, .tsh-mask')) {
      return;
    }
    const turnEl = target.closest("[data-conversation-scroll] [data-chat-turn], [data-conversation-scroll] [data-turn-tail]");
    if (!turnEl) return;
    const rawTurn = turnEl.getAttribute("data-chat-turn") || turnEl.getAttribute("data-turn-tail");
    if (!rawTurn) return;
    const turn = parseInt(rawTurn, 10);
    if (Number.isFinite(turn) && turn > 0) {
      store.setSelectedTurn(turn);
      store.setPanelOpen(true);
    }
  }, true);
  const syncDom = () => {
    const tablist = document.querySelector('header [role="tablist"]');
    const turns = document.querySelectorAll("[data-chat-turn]");
    const hasActiveChat = latestChatSessionId !== null || Boolean(tablist || turns.length > 0);
    if (tablist) {
      syncKrTab(tablist);
    }
    const isKr = store.snapshot.activeTab === "kr" && hasActiveChat;
    if (isKr) {
      document.body.setAttribute("data-dsh-kr-chat", "true");
    } else {
      document.body.removeAttribute("data-dsh-kr-chat");
    }
    if (!hasActiveChat && store.snapshot.selectedTurn !== null) {
      store.setSelectedTurn(null);
    }
    const selectedTurn = store.snapshot.selectedTurn;
    const activeClass = "kr-turn-selected";
    document.querySelectorAll(`.${activeClass}`).forEach((el) => {
      if (!isKr || el.getAttribute("data-chat-turn") !== String(selectedTurn)) {
        el.classList.remove(activeClass);
      }
    });
    if (isKr && selectedTurn !== null && selectedTurn > 0) {
      document.querySelectorAll(`[data-chat-turn="${selectedTurn}"]`).forEach((el) => {
        if (!el.classList.contains(activeClass)) {
          el.classList.add(activeClass);
        }
      });
    }
    const content = document.querySelector("[data-conversation-content]");
    if (!content) return;
    let container = document.getElementById("dsh-kr-panel-container");
    if (!hasActiveChat) {
      if (container) {
        container.style.display = "none";
      }
      return;
    }
    if (lastRenderedSessionId !== latestChatSessionId) {
      lastRenderedSessionId = latestChatSessionId;
      if (panelRoot) {
        panelRoot.render(/* @__PURE__ */ (0, import_jsx_runtime19.jsx)(KrPanelSystem, {}));
      }
    }
    if (!container || !container.isConnected || container.parentElement !== content) {
      if (container) {
        try {
          container.remove();
        } catch {
        }
      }
      container = document.createElement("div");
      container.id = "dsh-kr-panel-container";
      container.style.display = "contents";
      content.appendChild(container);
      if (panelRoot) {
        try {
          panelRoot.unmount();
        } catch {
        }
        panelRoot = null;
      }
    } else {
      container.style.display = "contents";
    }
    if (!panelRoot && container) {
      panelRoot = (0, import_client2.createRoot)(container);
      panelRoot.render(/* @__PURE__ */ (0, import_jsx_runtime19.jsx)(KrPanelSystem, {}));
      currentContainer = container;
    }
  };
  syncDom();
  setInterval(syncDom, 250);
}

// src/client/index.ts
var inject = ["slots"];
function guarded(ctx, label, mount) {
  try {
    mount();
  } catch (error) {
    console.warn(`[dsh-chat-flow] ${label} \u6302\u8F7D\u5931\u8D25\uFF1A${error instanceof Error ? error.message : String(error)}`);
  }
}
var savedCtx = null;
var officialAssistantNodeView = null;
function getOfficialAssistantNodeView() {
  if (officialAssistantNodeView) return officialAssistantNodeView;
  if (savedCtx) {
    try {
      const entries = savedCtx.slots.entries("conversation.chat.node");
      const assistantEntry = entries.find((e) => e.options?.key === "assistant-step" && (e.options?.priority ?? 0) >= 0);
      if (assistantEntry?.component) {
        officialAssistantNodeView = assistantEntry.component;
      }
    } catch {
    }
  }
  return officialAssistantNodeView;
}
function apply(ctx) {
  savedCtx = ctx;
  if (typeof window !== "undefined") {
    window.__dshClientCtx__ = ctx;
  }
  guarded(ctx, "tool-summary styles", injectStyles);
  guarded(ctx, "chat-flow styles", injectStyles2);
  guarded(ctx, "proto card styles", injectProtoStyles);
  guarded(ctx, "diagram styles", injectDiagramStyles);
  guarded(ctx, "download card styles", injectDownloadStyles);
  guarded(ctx, "activity drawer", mountActivityDrawer);
  guarded(ctx, "shell chrome", mountShellChrome);
  guarded(ctx, "screenshot seat", () => {
    applyMessageScreenshot(ctx);
  });
  try {
    const entries = ctx.slots.entries("conversation.chat.node");
    const assistantEntry = entries.find((e) => e.options?.key === "assistant-step" && (e.options?.priority ?? 0) >= 0);
    if (assistantEntry?.component) {
      officialAssistantNodeView = assistantEntry.component;
    }
  } catch (error) {
    console.warn("[dsh-chat-flow] \u6355\u83B7\u5B98\u65B9 assistant-step \u5931\u8D25\uFF1A", error);
  }
  guarded(ctx, "assistant-step seat", () => {
    ctx.slots.inject("conversation.chat.node", () => ctx.slots.register({
      name: "conversation.chat.node",
      key: "assistant-step",
      priority: -100,
      locale: "chat"
    }, ThinkingStepNodeView));
  });
  guarded(ctx, "download toolview seat", () => {
    ctx.slots.inject("tool.call.toolview", () => ctx.slots.register(
      { name: "tool.call.toolview", key: "download" },
      DownloadCard
    ));
  });
  guarded(ctx, "kr-chat styles", injectKrStyles);
  guarded(ctx, "kr-chat controller", mountKrChatController);
  guarded(ctx, "kr-todo bridge", () => {
    ctx.slots.inject("conversation.input.dock", () => ctx.slots.register(
      { name: "conversation.input.dock", id: "kr-todo-bridge", order: 999 },
      KrTodoBridge
    ));
  });
}
return module.exports; } });
//# sourceMappingURL=client.js.map
