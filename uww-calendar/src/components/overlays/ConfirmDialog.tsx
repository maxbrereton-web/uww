import type React from 'react';
import { useStore } from '../../store';

const condensed: React.CSSProperties = {
  fontStretch: '75%', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.02em',
};

export default function ConfirmDialog() {
  const confirm = useStore(s => s.confirm);
  const close = useStore(s => s.closeConfirm);

  if (!confirm) return null;
  const danger = confirm.danger ?? true;

  const run = () => { confirm.onConfirm(); close(); };

  return (
    <div
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.5)', zIndex: 400, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}
      onClick={close}
    >
      <div
        className="uww-overlay"
        style={{ width: 380, maxWidth: '100%', background: 'var(--panel)', border: '1px solid var(--border-strong)', borderRadius: 16, boxShadow: 'var(--shadow)', padding: 24 }}
        onClick={e => e.stopPropagation()}
      >
        <div style={{ ...condensed, fontSize: 16, color: 'var(--text)', marginBottom: 10 }}>
          {confirm.title || 'Are you sure?'}
        </div>
        <div style={{ fontSize: 13.5, color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: 22 }}>
          {confirm.message}
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <button
            onClick={close}
            style={{ ...condensed, fontSize: 12, flex: 1, padding: '13px 0', cursor: 'pointer', borderRadius: 11, border: '1px solid var(--border-strong)', background: 'var(--control)', color: 'var(--text)' }}
          >
            Cancel
          </button>
          <button
            onClick={run}
            style={{ ...condensed, fontSize: 12, flex: 1, padding: '13px 0', cursor: 'pointer', borderRadius: 11, border: 'none', background: danger ? '#ED1C24' : 'var(--accent-deep)', color: '#fff' }}
          >
            {confirm.confirmLabel || 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
}
