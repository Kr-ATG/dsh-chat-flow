/**
 * ConfirmDialog — 替代 window.confirm 的主题化确认弹窗（记忆面板专用）。
 *
 * 背景：window.confirm 在 Electron 里是系统样式的灰底弹窗（标题还是窗口名
 * dsh-shell），跟 DSH/插件主题完全脱离，且无法定制。本组件提供同语义替代：
 *
 *  - createPortal 到 body：祖先容器（玻璃质感 backdrop-filter / transform）
 *    会把 position:fixed 钉进局部坐标系，遮罩必须挂到 document.body；
 *  - z-index 1200：全屏弹层惯例（高于 popover-shell 的 mask 999 / card 1000）；
 *  - 开合动画复用 modal-animation：mask 淡入淡出 + 卡片自底部 24px 上滑弹出、
 *    反向收回，内容无错落（确认弹窗内容短，不需要 stagger），
 *    并遵守 prefers-reduced-motion；
 *  - 交互：Esc / 点遮罩 = 取消；确认钮 autoFocus（回车即确认）；点确认后先
 *    播收回动画、240ms 后再卸载（onClose），执行动作与动画并行不阻塞；
 *  - danger 变体：破坏性操作（删除/清空/回滚）确认按钮用警示红
 *    （--dsw-alias-state-error-primary），与面板 iconActionDanger 同款色。
 *
 * 样式独立注入（STYLE_ID 幂等），类名前缀 mcd-，不依赖 popover-shell 内部类。
 */

import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { Button } from '@deepseek-ai/dsh-client-ui-primitives'
import {
  ensureModalAnimStyles,
  modalAnimClass,
  modalMaskAnimClass,
  useModalClose,
} from '../triad-modal-animation.js'
const STYLE_ID = 'dsh-memory-confirm-dialog-styles'

const SHEET = `
/* ── 遮罩：固定全屏，点击=取消 ── */
.mcd-mask{position:fixed;inset:0;z-index:1200;background:var(--dsw-alias-bg-mask-1,rgba(0,0,0,.45))}
/* 居中容器：flex 定位，卡片动画的 transform 不与其冲突 */
.mcd-wrap{position:fixed;inset:0;z-index:1201;display:flex;align-items:center;justify-content:center;pointer-events:none}
/* ── 卡片：实底（玻璃模式也不透）、圆角 14、l3 投影 ── */
.mcd-card{
  pointer-events:auto;display:flex;flex-direction:column;
  width:min(420px,calc(100vw - 48px));max-height:calc(100vh - 96px);
  box-sizing:border-box;border:1px solid var(--dsw-alias-border-l2,rgba(255,255,255,.14));
  border-radius:14px;
  box-shadow:var(--dsw-shadow-lv3,0 8px 40px rgba(0,0,0,.5));
  overflow:hidden}
/* 实底：玻璃质感开启时也保持不透明表面（同 popover-shell 的 data-solid 规则：
   静态 token + html[data-dsh-glass] 前缀压过 glass.ts 的 transparent 规则） */
.mcd-card,html[data-dsh-glass] .mcd-card{
  background:var(--dsw-static-neutral-bluish-00,#fff);
  backdrop-filter:none;-webkit-backdrop-filter:none}
body[data-ds-dark-theme] .mcd-card,html[data-dsh-glass] body[data-ds-dark-theme] .mcd-card{
  background:var(--dsw-static-neutral-bluish-850,#2c2c2e)}
/* ── 内容 ── */
.mcd-title{flex:none;padding:14px 18px 8px;font-size:15px;font-weight:600;line-height:22px;color:var(--dsw-alias-label-primary,#eee)}
.mcd-body{flex:none;min-height:0;padding:0 18px 16px;overflow-y:auto;font-size:13px;line-height:20px;color:var(--dsw-alias-label-secondary,#bbb);word-break:break-word}
.mcd-actions{flex:none;display:flex;justify-content:flex-end;gap:8px;padding:12px 14px;border-top:1px solid var(--dsw-alias-border-l1,rgba(255,255,255,.06))}
/* danger 变体：警示红确认按钮（outline 底 + 红字红框，hover 加深） */
.mcd-btn-danger{
  border-color:var(--dsw-alias-state-error-primary,#e0434b)!important;
  color:var(--dsw-alias-state-error-primary,#e0434b)!important}
.mcd-btn-danger:hover{
  background:var(--dsw-alias-interactive-bg-hover-danger,rgba(224,67,75,.12))!important;
  border-color:var(--dsw-alias-state-error-primary,#e0434b)!important;
  color:var(--dsw-alias-state-error-primary,#e0434b)!important}
@media (prefers-reduced-motion:reduce){
  .mcd-mask,.mcd-card{animation:none!important}
}
`

/** 注入确认弹窗样式（幂等）。 */
function ensureDialogStyles(): void {
  if (typeof document === 'undefined') return
  if (document.getElementById(STYLE_ID) !== null) return
  const tag = document.createElement('style')
  tag.id = STYLE_ID
  tag.dataset.plugin = 'dsh-triad'
  tag.textContent = SHEET
  document.head.appendChild(tag)
}

/** ConfirmDialog 属性。 */
export interface ConfirmDialogProps {
  open: boolean
  /** 标题（短名词，如「请确认」）。 */
  title: string
  /** 说明文案（已渲染好的字符串，含参数时由调用方 t() 展开）。 */
  message: string
  confirmLabel: string
  cancelLabel: string
  /** 破坏性操作：确认按钮警示红。 */
  danger?: boolean
  /** 点确认：立即执行（与收回动画并行）。 */
  onConfirm: () => void
  /** 真正关闭（收回动画播完后触发；调用方在此清 state）。 */
  onClose: () => void
}

/**
 * 主题化确认弹窗。调用方以 `open` 控制显示：
 * 条件渲染 `{req !== null && <ConfirmDialog open ... />}` 时，
 * open 恒为 true，挂载即弹入；onClose 里把 req 置 null 即卸载。
 */
export function ConfirmDialog({
  open, title, message, confirmLabel, cancelLabel, danger = false, onConfirm, onClose,
}: ConfirmDialogProps): JSX.Element | null {
  ensureModalAnimStyles()
  ensureDialogStyles()
  const { closing, requestClose } = useModalClose(open, onClose)

  // Esc = 取消（与遮罩点击等价）。
  useEffect(() => {
    if (!open) return undefined
    const onKey = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') requestClose()
    }
    document.addEventListener('keydown', onKey)
    return () => { document.removeEventListener('keydown', onKey) }
  }, [open, requestClose])

  if (!open) return null

  const handleConfirm = (): void => {
    onConfirm()
    requestClose()
  }
  const handleCancel = (): void => {
    requestClose()
  }

  return createPortal(
    <>
      <div className={`mcd-mask ${modalMaskAnimClass(closing)}`} aria-hidden="true" onClick={handleCancel} />
      <div className="mcd-wrap">
        <div className={`mcd-card ${modalAnimClass(closing)}`} role="dialog" aria-modal="true" aria-label={title}>
          <div className="mcd-title">{title}</div>
          <div className="mcd-body">{message}</div>
          <div className="mcd-actions">
            <Button variant="outline" size="sm" onClick={handleCancel}>{cancelLabel}</Button>
            <Button
              variant={danger ? 'outline' : 'primary'}
              size="sm"
              autoFocus
              className={danger ? 'mcd-btn-danger' : undefined}
              onClick={handleConfirm}
            >
              {confirmLabel}
            </Button>
          </div>
        </div>
      </div>
    </>,
    document.body,
  )
}
