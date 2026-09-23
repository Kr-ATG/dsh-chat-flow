/**
 * 凭据配置弹窗：createPortal 挂到 body（避免祖先 backdrop-filter/transform
 * 把 fixed 后代钉进局部坐标系），z-index 统一 1200；开合带过渡动效，
 * Esc / 点遮罩关闭。
 */
import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { CloseIcon } from '../hub'

const STYLE_ID = 'dsh-cred-modal-styles'
const SHEET = `
@keyframes dsh-cred-overlay-in {
  from { opacity: 0; }
  to { opacity: 1; }
}
@keyframes dsh-cred-card-in {
  from { opacity: 0; transform: translate3d(0, 14px, 0) scale(0.97); }
  to { opacity: 1; transform: translate3d(0, 0, 0) scale(1); }
}
.dsh-cred-overlay {
  position: fixed;
  inset: 0;
  z-index: 1200;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(8, 10, 14, 0.5);
  backdrop-filter: blur(2px);
  -webkit-backdrop-filter: blur(2px);
  animation: dsh-cred-overlay-in 180ms ease-out both;
}
.dsh-cred-card {
  width: 420px;
  max-width: calc(100vw - 48px);
  border-radius: 14px;
  overflow: hidden;
  box-shadow: 0 24px 64px rgba(0, 0, 0, 0.5);
  border: 1px solid var(--dsw-alias-border-l1);
  animation: dsh-cred-card-in 240ms cubic-bezier(0.2, 0.8, 0.2, 1) both;
}
@media (prefers-reduced-motion: reduce) {
  .dsh-cred-overlay, .dsh-cred-card { animation: none; }
}
`

/** 实底样式：玻璃质感开启时凭据弹窗也保持不透明（data-solid 豁免玻璃规则）。 */
const CRED_SOLID_ID = 'dsh-cred-card-solid-styles'
const CRED_SOLID_SHEET = [
  '.dsh-cred-card{background:var(--dsw-alias-bg-layer-2)}',
  'html[data-dsh-glass] .dsh-cred-card[data-solid]{background:var(--dsw-static-neutral-bluish-00,#fff);backdrop-filter:none;-webkit-backdrop-filter:none}',
  'html[data-dsh-glass] body[data-ds-dark-theme] .dsh-cred-card[data-solid]{background:var(--dsw-static-neutral-bluish-850,#2c2c2e)}',
].join('\n')

function ensureStyles(): void {
  if (typeof document === 'undefined') return
  if (document.getElementById(STYLE_ID) === null) {
    const tag = document.createElement('style')
    tag.id = STYLE_ID
    tag.textContent = SHEET
    document.head.appendChild(tag)
  }
  if (document.getElementById(CRED_SOLID_ID) === null) {
    const tag = document.createElement('style')
    tag.id = CRED_SOLID_ID
    tag.textContent = CRED_SOLID_SHEET
    document.head.appendChild(tag)
  }
}

const headerStyle: React.CSSProperties = {
  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
  padding: '14px 16px', borderBottom: '1px solid var(--dsw-alias-border-l1)',
  fontSize: 14, fontWeight: 600, color: 'var(--dsw-alias-label-primary)',
}
const bodyStyle: React.CSSProperties = { display: 'flex', flexDirection: 'column', gap: 12, padding: 16 }
const inputStyle: React.CSSProperties = {
  width: '100%', boxSizing: 'border-box', padding: '7px 10px', fontSize: 13, borderRadius: 8,
  border: '1px solid var(--dsw-alias-border-l1)', background: 'var(--dsw-alias-bg-base)',
  color: 'var(--dsw-alias-label-primary)',
  transition: 'border-color .18s cubic-bezier(.2,.8,.2,1)',
}
const btnBase: React.CSSProperties = {
  padding: '6px 14px', fontSize: 12, borderRadius: 8, border: '1px solid var(--dsw-alias-border-l1)',
  background: 'transparent', color: 'var(--dsw-alias-label-primary)', cursor: 'pointer',
}

export function CredentialModal({ providerName, onClose, onSave }: {
  providerName: string; onClose: () => void; onSave: (value: string) => Promise<void>
}): JSX.Element {
  const [value, setValue] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [closing, setClosing] = useState(false)

  useEffect(() => { ensureStyles() }, [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent): void => {
      if (e.key === 'Escape') close()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const close = (): void => {
    if (closing) return
    setClosing(true)
    window.setTimeout(onClose, 160)
  }

  const modal = (
    <div className="dsh-cred-overlay" onClick={close}>
      <div className="dsh-cred-card" data-solid="" style={closing ? { opacity: 0, transform: 'translate3d(0, 8px, 0) scale(0.98)', transition: 'opacity 160ms ease, transform 160ms ease' } : undefined}
        onClick={e => e.stopPropagation()}>
        <div style={headerStyle}>
          <span>配置 {providerName} 凭据</span>
          <button type="button" aria-label="关闭" onClick={close}
            style={{ border: 'none', background: 'transparent', color: 'var(--dsw-alias-label-secondary)', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 24, height: 24 }}>
            <CloseIcon size={13} />
          </button>
        </div>
        <div style={bodyStyle}>
          <div style={{ fontSize: 12, color: 'var(--dsw-alias-label-secondary)' }}>输入 API Key（仅 SENSENOVA_* 引用可写，存于安全凭据存储）</div>
          <input type="password" value={value} onChange={e => setValue(e.target.value)} placeholder="API Key" style={inputStyle} autoFocus />
          {error && <div style={{ fontSize: 12, color: 'var(--dsw-alias-state-error-primary)' }}>{error}</div>}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
            <button type="button" onClick={close} style={btnBase}>取消</button>
            <button type="button" disabled={value.trim() === '' || saving}
              onClick={async () => {
                setSaving(true); setError(null)
                try { await onSave(value.trim()); close() } catch (e: unknown) { setError(e instanceof Error ? e.message : String(e)) } finally { setSaving(false) }
              }}
              style={{ ...btnBase, background: saving ? 'var(--dsw-alias-border-l2)' : 'var(--dsw-alias-state-business-primary)', color: '#fff', border: 'none', opacity: value.trim() === '' ? 0.6 : 1 }}>
              {saving ? '保存中…' : '保存'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )

  return typeof document !== 'undefined' ? createPortal(modal, document.body) : modal
}
