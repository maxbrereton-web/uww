import type React from 'react';
import { useRef, useState } from 'react';
import { X, Paperclip } from 'lucide-react';
import { useStore, currentUser } from '../../store';
import Avatar from '../common/Avatar';
import AttachmentCard from '../common/AttachmentCard';
import MentionInput from '../common/MentionInput';
import { buildHandleMap, renderMentionText } from '../../data/mentions';

type Att = { name: string; url: string };

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
  const usernames = useStore(s => s.usernames);
  const dms = useStore(s => s.dms);
  const sendDm = useStore(s => s.sendDm);
  const close = useStore(s => s.closeDmOverlay);
  const setPage = useStore(s => s.setPage);
  const setChatActive = useStore(s => s.setChatActive);
  const selectEvent = useStore(s => s.selectEvent);
  const [text, setText] = useState('');
  const [att, setAtt] = useState<Att | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  if (!userId || userId === cu) return null;
  const member = staff.find(m => m.id === userId);
  if (!member) return null;

  const messages = dms[dmKey(cu, userId)] || [];
  const nameOf = (id: string) => staff.find(m => m.id === id)?.name || id;
  const handleMap = buildHandleMap(staff, usernames);

  const send = () => {
    const v = text.trim();
    if (!v && !att) return;
    sendDm(userId, v, att || undefined);
    setText('');
    setAtt(null);
  };
  const onFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setAtt({ name: file.name, url: reader.result as string });
    reader.readAsDataURL(file);
    e.target.value = '';
  };
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
                <div style={{ fontSize: 10.5, color: 'var(--text-muted)', marginBottom: 3, textAlign: own ? 'right' : 'left' }}>{own ? 'You' : nameOf(msg.from)}</div>
                <div style={{ padding: '9px 13px', borderRadius: 12, fontSize: 13.5, background: own ? 'var(--accent-deep)' : 'var(--panel-2)', color: own ? '#fff' : 'var(--text)', border: own ? 'none' : '1px solid var(--border)', whiteSpace: 'pre-wrap' }}>
                  {msg.text && <div>{renderMentionText(msg.text, handleMap, own)}</div>}
                  {msg.att && <AttachmentCard att={msg.att} own={own} spaced={!!msg.text} />}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Composer */}
      <div style={{ padding: 12, borderTop: '1px solid var(--border)' }}>
        {att && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 9, padding: '7px 11px', background: 'var(--field)', border: '1px solid var(--border-strong)', borderRadius: 9 }}>
            <Paperclip size={14} color="var(--accent)" />
            <span style={{ flex: 1, minWidth: 0, fontSize: 12.5, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{att.name}</span>
            <X size={15} style={{ cursor: 'pointer', color: 'var(--text-muted)', flex: '0 0 auto' }} onClick={() => setAtt(null)} />
          </div>
        )}
        <div style={{ display: 'flex', gap: 9, alignItems: 'center' }}>
          <MentionInput
            value={text}
            onChange={setText}
            onEnter={send}
            placeholder="Write a message…  (@ to tag)"
            style={{ width: '100%', padding: '11px 13px', background: 'var(--field)', color: 'var(--text)', border: '1px solid var(--border-strong)', borderRadius: 9, fontSize: 13.5, outline: 'none', fontFamily: 'inherit' }}
          />
          <input ref={fileRef} type="file" onChange={onFile} style={{ display: 'none' }} />
          <button type="button" title="Attach a file" onClick={() => fileRef.current?.click()} style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 42, height: 42, borderRadius: 9, background: att ? 'color-mix(in srgb, var(--accent-deep) 20%, var(--field))' : 'var(--field)', border: '1px solid ' + (att ? 'var(--accent-deep)' : 'var(--border-strong)'), color: att ? 'var(--accent)' : 'var(--text-muted)', cursor: 'pointer', flex: '0 0 auto' }}>
            <Paperclip size={17} />
          </button>
          <button onClick={send} style={{ fontStretch: '75%', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.02em', fontSize: 13, padding: '0 18px', height: 42, borderRadius: 9, border: 'none', background: 'var(--accent-deep)', color: '#fff', cursor: 'pointer', flex: '0 0 auto' }}>
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
