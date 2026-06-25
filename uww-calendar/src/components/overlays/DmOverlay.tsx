import { useState } from 'react';
import { X, Paperclip } from 'lucide-react';
import { useStore, currentUser } from '../../store';
import Avatar from '../common/Avatar';

function dmKey(a: string, b: string): string {
  return [a, b].sort().join('|');
}

function MaximizeIcon({ size = 17 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <polyline points="15 3 21 3 21 9" />
      <polyline points="9 21 3 21 3 15" />
      <line x1="21" y1="3" x2="14" y2="10" />
      <line x1="3" y1="21" x2="10" y2="14" />
    </svg>
  );
}

export default function DmOverlay() {
  const userId = useStore(s => s.dmOverlay);
  const cu = useStore(currentUser);
  const staff = useStore(s => s.staff);
  const dms = useStore(s => s.dms);
  const sendDm = useStore(s => s.sendDm);
  const close = useStore(s => s.closeDmOverlay);
  const setPage = useStore(s => s.setPage);
  const setChatActive = useStore(s => s.setChatActive);
  const selectEvent = useStore(s => s.selectEvent);
  const [text, setText] = useState('');

  if (!userId || userId === cu) return null;
  const member = staff.find(m => m.id === userId);
  if (!member) return null;

  const messages = dms[dmKey(cu, userId)] || [];
  const nameOf = (id: string) => staff.find(m => m.id === id)?.name || id;

  const send = () => { const v = text.trim(); if (!v) return; sendDm(userId, v); setText(''); };
  const maximize = () => {
    close();
    selectEvent(null);
    setChatActive(userId);
    setPage('chat');
  };

  return (
    <div
      style={{
        position: 'fixed', right: 20, bottom: 20, zIndex: 130, width: 360, maxWidth: 'calc(100vw - 32px)',
        height: 540, maxHeight: 'calc(100vh - 40px)', display: 'flex', flexDirection: 'column',
        background: 'var(--panel)', border: '1px solid var(--border-strong)', borderRadius: 14,
        boxShadow: 'var(--shadow)', overflow: 'hidden',
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '12px 14px', borderBottom: '1px solid var(--border)' }}>
        <Avatar staffId={userId} size={34} />
        <div style={{ flex: 1, minWidth: 0, fontSize: 15, fontWeight: 800, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{member.name}</div>
        <button onClick={maximize} title="Open in Chat" style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 5, display: 'inline-flex' }}>
          <MaximizeIcon size={17} />
        </button>
        <button onClick={close} title="Close" style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 5, display: 'inline-flex' }}>
          <X size={18} />
        </button>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: 'auto', padding: 14, display: 'flex', flexDirection: 'column', gap: 10 }}>
        {messages.map((msg, i) => {
          const own = msg.from === cu;
          return (
            <div key={i} style={{ display: 'flex', justifyContent: own ? 'flex-end' : 'flex-start' }}>
              <div style={{ maxWidth: '78%' }}>
                <div style={{ fontSize: 10.5, color: 'var(--text-muted)', marginBottom: 3, textAlign: own ? 'right' : 'left' }}>{own ? 'You' : nameOf(msg.from)} · {msg.time}</div>
                <div style={{ padding: '9px 13px', borderRadius: 12, fontSize: 13.5, background: own ? 'var(--accent-deep)' : 'var(--panel-2)', color: own ? '#fff' : 'var(--text)', border: own ? 'none' : '1px solid var(--border)' }}>
                  {msg.text}
                  {msg.att && <div style={{ marginTop: 4, fontSize: 11, opacity: 0.85, textDecoration: 'underline' }}>{msg.att.name}</div>}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Composer */}
      <div style={{ display: 'flex', gap: 9, padding: 12, borderTop: '1px solid var(--border)', alignItems: 'center' }}>
        <input
          value={text}
          placeholder="Write a message…"
          onChange={e => setText(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); send(); } }}
          style={{ flex: 1, padding: '11px 13px', background: 'var(--field)', color: 'var(--text)', border: '1px solid var(--border-strong)', borderRadius: 9, fontSize: 13.5, outline: 'none', fontFamily: 'inherit' }}
        />
        <button type="button" title="Attach a file" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 42, height: 42, borderRadius: 9, background: 'var(--field)', border: '1px solid var(--border-strong)', color: 'var(--text-muted)', cursor: 'pointer', flex: '0 0 auto' }}>
          <Paperclip size={17} />
        </button>
        <button onClick={send} style={{ fontStretch: '75%', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.02em', fontSize: 13, padding: '0 18px', height: 42, borderRadius: 9, border: 'none', background: 'var(--accent-deep)', color: '#fff', cursor: 'pointer', flex: '0 0 auto' }}>
          Send
        </button>
      </div>
    </div>
  );
}
