import type React from 'react';
import { useStore, isAdmin, currentUser } from '../../../store';
import type { Comment } from '../../../types';

const condensed: React.CSSProperties = {
  fontStretch: '75%',
  fontWeight: 800,
  textTransform: 'uppercase',
  letterSpacing: '.02em',
};

const textareaStyle: React.CSSProperties = {
  background: 'var(--field)',
  border: '1px solid var(--border)',
  borderRadius: 8,
  color: 'var(--text)',
  fontSize: 13,
  padding: '8px 10px',
  width: '100%',
  boxSizing: 'border-box',
  resize: 'vertical',
  minHeight: 56,
  fontFamily: 'inherit',
};

function sendBtn(enabled: boolean): React.CSSProperties {
  return {
    ...condensed, fontSize: 11, border: 'none', borderRadius: 6,
    background: enabled ? 'var(--accent)' : 'var(--control)',
    color: enabled ? '#fff' : 'var(--text-faint)',
    padding: '6px 14px', cursor: enabled ? 'pointer' : 'default',
  };
}

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

  if (!detail) return null;
  const nameOf = (id: string) => staff.find(m => m.id === id)?.name || id;

  return (
    <div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {detail.requests.length === 0 && (
          <div style={{ color: 'var(--text-muted)', fontSize: 13 }}>No comments yet.</div>
        )}
        {detail.requests.map((thread: Comment) => {
          const resolved = thread.status === 'resolved';
          return (
            <div
              key={thread.id}
              style={{
                background: 'var(--panel)', border: '1px solid var(--border)', borderRadius: 10,
                padding: 14, opacity: resolved ? 0.7 : 1,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                <span style={{ ...condensed, fontSize: 11, color: 'var(--text-muted)' }}>
                  Thread · {nameOf(thread.from)}
                </span>
                {resolved && (
                  <span style={{ ...condensed, fontSize: 10, color: '#fff', background: '#22C55E', borderRadius: 999, padding: '2px 8px' }}>
                    Resolved
                  </span>
                )}
                {admin && (
                  <button
                    type="button"
                    onClick={() => resolved ? reopenComment(eventId, thread.id) : resolveComment(eventId, thread.id)}
                    style={{
                      ...condensed, fontSize: 11, marginLeft: 'auto',
                      border: '1px solid var(--border)', borderRadius: 6, background: 'var(--control)',
                      color: 'var(--text-muted)', padding: '4px 10px', cursor: 'pointer',
                    }}
                  >
                    {resolved ? 'Re-open' : 'Resolve'}
                  </button>
                )}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 12 }}>
                {thread.messages.map((msg, i) => {
                  const own = msg.from === cu;
                  return (
                    <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: own ? 'flex-end' : 'flex-start' }}>
                      <div style={{ ...condensed, fontSize: 10, color: 'var(--text-faint)', marginBottom: 2 }}>
                        {nameOf(msg.from)} · {msg.time}
                      </div>
                      <div
                        style={{
                          maxWidth: '80%',
                          background: own ? 'var(--accent)' : 'var(--panel-2)',
                          color: own ? '#fff' : 'var(--text)',
                          borderRadius: 10,
                          padding: '8px 12px',
                          fontSize: 13,
                          whiteSpace: 'pre-wrap',
                        }}
                      >
                        {msg.text}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Reply composer */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <textarea
                  style={textareaStyle}
                  placeholder="Reply…"
                  value={thread.draft}
                  onChange={e => setCommentDraft(eventId, thread.id, e.target.value)}
                />
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <button
                    type="button"
                    disabled={!thread.draft.trim()}
                    style={sendBtn(!!thread.draft.trim())}
                    onClick={() => thread.draft.trim() && addCommentReply(eventId, thread.id, thread.draft.trim())}
                  >
                    Send
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* New comment composer */}
      <div style={{ marginTop: 18, borderTop: '1px solid var(--border)', paddingTop: 16 }}>
        <div style={{ ...condensed, fontSize: 12, color: 'var(--text)', marginBottom: 8 }}>New comment</div>
        <textarea
          style={textareaStyle}
          placeholder="Start a new comment thread…"
          value={detail.newRequest}
          onChange={e => setNewRequest(eventId, e.target.value)}
        />
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 8 }}>
          <button
            type="button"
            disabled={!detail.newRequest.trim()}
            style={sendBtn(!!detail.newRequest.trim())}
            onClick={() => detail.newRequest.trim() && addNewRequest(eventId, detail.newRequest.trim())}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
