import type React from 'react';
import { Paperclip } from 'lucide-react';
import { useStore, isAdmin, currentUser } from '../../../store';
import type { Comment } from '../../../types';
import Avatar from '../../common/Avatar';

const composerInput: React.CSSProperties = {
  flex: 1, background: 'var(--field)', border: '1px solid var(--border-strong)', borderRadius: 9,
  color: 'var(--text)', fontSize: 13.5, padding: '11px 14px', outline: 'none', fontFamily: 'inherit',
};

const clipBtn: React.CSSProperties = {
  display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 42, height: 42,
  borderRadius: 9, background: 'var(--field)', border: '1px solid var(--border-strong)',
  color: 'var(--text-muted)', cursor: 'pointer', flex: '0 0 auto',
};

const orangeBtn: React.CSSProperties = {
  background: 'var(--accent-deep)', color: '#fff', border: 'none', borderRadius: 9,
  padding: '11px 18px', cursor: 'pointer', fontWeight: 800, fontSize: 12.5, whiteSpace: 'nowrap',
};

export default function CommentsTab({ eventId }: { eventId: string }) {
  const detail = useStore(s => s.detail[eventId]);
  const admin = useStore(isAdmin);
  const cu = useStore(currentUser);
  const staff = useStore(s => s.staff);
  const addCommentReply = useStore(s => s.addCommentReply);
  const resolveComment = useStore(s => s.resolveComment);
  const reopenComment = useStore(s => s.reopenComment);
  const setCommentDraft = useStore(s => s.setCommentDraft);
  const setNewRequest = useStore(s => s.setNewRequest);
  const addNewRequest = useStore(s => s.addNewRequest);
  const openDmWith = useStore(s => s.openDmWith);

  if (!detail) return null;
  const nameOf = (id: string) => staff.find(m => m.id === id)?.name || id;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      {detail.requests.map((thread: Comment) => {
        const resolved = thread.status === 'resolved';
        const openedTime = thread.messages[0]?.time || '';
        const badgeColor = resolved ? '#2e9e5b' : '#E0A100';
        return (
          <div key={thread.id} style={{ border: '1px solid var(--border)', borderRadius: 12, padding: 18 }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 13 }}>
              <span style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '.07em', fontWeight: 700 }}>
                {nameOf(thread.from)} · opened {openedTime}
              </span>
              <span style={{ fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.04em', color: badgeColor, background: `color-mix(in srgb, ${badgeColor} 16%, transparent)`, padding: '3px 9px', borderRadius: 6 }}>
                {resolved ? 'Resolved' : 'Open'}
              </span>
            </div>

            {/* Messages */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
              {thread.messages.map((msg, i) => {
                const own = msg.from === cu;
                return (
                  <div key={i} style={{ display: 'flex', gap: 9, flexDirection: own ? 'row-reverse' : 'row' }}>
                    <Avatar staffId={msg.from} size={30} onClick={own ? undefined : () => openDmWith(msg.from)} />
                    <div
                      style={{
                        maxWidth: '78%', background: own ? 'var(--accent-deep)' : 'var(--panel-2)',
                        border: own ? 'none' : '1px solid var(--border)', borderRadius: 10, padding: '9px 13px',
                      }}
                    >
                      <div style={{ fontSize: 11, color: own ? 'rgba(255,255,255,.8)' : 'var(--text-muted)', marginBottom: 3 }}>
                        {nameOf(msg.from)} · {msg.time}
                      </div>
                      <div style={{ fontSize: 13.5, lineHeight: 1.5, color: own ? '#fff' : 'var(--text)', whiteSpace: 'pre-wrap' }}>
                        {msg.text}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Reply composer / re-open */}
            {!resolved ? (
              <div style={{ display: 'flex', gap: 9, alignItems: 'center', marginTop: 13 }}>
                <input
                  style={composerInput}
                  placeholder="Write a reply…"
                  value={thread.draft}
                  onChange={e => setCommentDraft(eventId, thread.id, e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter' && thread.draft.trim()) addCommentReply(eventId, thread.id, thread.draft.trim()); }}
                />
                <button type="button" style={clipBtn} title="Attach a file"><Paperclip size={17} /></button>
                <button type="button" style={orangeBtn} disabled={!thread.draft.trim()} onClick={() => thread.draft.trim() && addCommentReply(eventId, thread.id, thread.draft.trim())}>
                  Reply
                </button>
                {admin && (
                  <button
                    type="button"
                    onClick={() => resolveComment(eventId, thread.id)}
                    style={{ background: 'color-mix(in srgb, #2e9e5b 18%, transparent)', color: '#2e9e5b', border: '1px solid #2e9e5b', borderRadius: 9, padding: '11px 16px', cursor: 'pointer', fontWeight: 800, fontSize: 12.5, whiteSpace: 'nowrap' }}
                  >
                    Resolve
                  </button>
                )}
              </div>
            ) : admin && (
              <button
                type="button"
                onClick={() => reopenComment(eventId, thread.id)}
                style={{ marginTop: 12, background: 'var(--control)', border: '1px solid var(--border-strong)', borderRadius: 8, padding: '7px 14px', cursor: 'pointer', fontSize: 12, fontWeight: 700, color: 'var(--text-muted)' }}
              >
                Re-open
              </button>
            )}
          </div>
        );
      })}

      {/* New comment composer */}
      <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
        <input
          style={composerInput}
          placeholder="Message the admin team…"
          value={detail.newRequest}
          onChange={e => setNewRequest(eventId, e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter' && detail.newRequest.trim()) addNewRequest(eventId, detail.newRequest.trim()); }}
        />
        <button type="button" style={clipBtn} title="Attach a file"><Paperclip size={17} /></button>
        <button type="button" style={orangeBtn} disabled={!detail.newRequest.trim()} onClick={() => detail.newRequest.trim() && addNewRequest(eventId, detail.newRequest.trim())}>
          Send
        </button>
      </div>
    </div>
  );
}
