import type React from 'react';
import { useStore, isAdmin, effectiveView } from '../../../store';
import type { PostingItem } from '../../../types';
import { eventDayList } from '../../../data/utils';
import { POST_TYPES } from '../../../data/seed';

const condensed: React.CSSProperties = {
  fontStretch: '75%', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.02em',
};

function normalizeUrl(u: string): string {
  const t = u.trim();
  return /^https?:\/\//i.test(t) ? t : `https://${t}`;
}

function ExternalLinkIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  );
}

const GRID = '70px 130px 1.3fr 1.3fr 1fr 1.6fr 40px';

const cellInput: React.CSSProperties = {
  width: '100%', background: 'transparent', border: 'none', color: 'var(--text)',
  fontSize: 12.5, fontFamily: 'inherit', outline: 'none', padding: '2px 0',
};

const headStyle: React.CSSProperties = {
  display: 'grid', gridTemplateColumns: GRID, background: 'var(--panel-2)',
  borderBottom: '1px solid var(--border)', fontSize: 10.5, color: 'var(--text-muted)',
  textTransform: 'uppercase', letterSpacing: '.07em', fontWeight: 700,
};

export default function PostingScheduleTab({ eventId }: { eventId: string }) {
  const ev = useStore(s => s.events.find(e => e.id === eventId) || s.archivedEvents.find(e => e.id === eventId));
  const detail = useStore(s => s.detail[eventId]);
  const admin = useStore(isAdmin);
  const isMobile = useStore(effectiveView) === 'mobile';
  const postingDayIdx = useStore(s => s.postingDayIdx);
  const setPostingDayIdx = useStore(s => s.setPostingDayIdx);
  const addPostingRow = useStore(s => s.addPostingRow);
  const updatePostingRow = useStore(s => s.updatePostingRow);
  const removePostingRow = useStore(s => s.removePostingRow);

  if (!ev) return null;

  const days = ['Pre-Event', ...eventDayList(ev.start, ev.end), 'Post-Event'];
  const idx = Math.min(Math.max(postingDayIdx, 0), days.length - 1);
  const dayKey = days[idx];
  const rows = detail?.posting[dayKey] || [];
  const ro = !admin;

  const tabLabel = (d: string, i: number) => (d === 'Pre-Event' || d === 'Post-Event') ? d : `Day ${i}`;
  const set = (rowIdx: number, patch: Partial<PostingItem>) => updatePostingRow(eventId, dayKey, rowIdx, patch);

  return (
    <div>
      {/* Day tabs */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7, justifyContent: 'center', marginBottom: 18 }}>
        {days.map((d, i) => {
          const active = i === idx;
          return (
            <button
              key={d}
              onClick={() => setPostingDayIdx(i)}
              style={{
                ...condensed, fontSize: 11, padding: '7px 13px', borderRadius: 8, cursor: 'pointer',
                border: '1px solid ' + (active ? 'var(--accent-deep)' : 'var(--border-strong)'),
                background: active ? 'var(--accent-deep)' : 'var(--control)',
                color: active ? '#fff' : 'var(--text-muted)',
              }}
            >
              {tabLabel(d, i)}
            </button>
          );
        })}
      </div>

      {isMobile ? (
        <MobilePosts
          rows={rows}
          ro={ro}
          admin={admin}
          set={set}
          onRemove={(i) => removePostingRow(eventId, dayKey, i)}
        />
      ) : (
      <div style={{ border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden' }}>
        <div style={headStyle}>
          <div style={{ padding: '11px 12px' }}>Posted</div>
          <div style={{ padding: '11px 12px' }}>Post Type</div>
          <div style={{ padding: '11px 12px' }}>Name</div>
          <div style={{ padding: '11px 12px' }}>Link</div>
          <div style={{ padding: '11px 12px' }}>Athlete</div>
          <div style={{ padding: '11px 12px' }}>Caption</div>
          <div />
        </div>

        {rows.map((row, i) => (
          <div key={i} style={{ display: 'grid', gridTemplateColumns: GRID, borderBottom: '1px solid var(--border)', alignItems: 'center' }}>
            <div style={{ padding: '10px 12px' }}>
              <div
                onClick={ro ? undefined : () => set(i, { posted: !row.posted })}
                style={{
                  width: 20, height: 20, borderRadius: 5, border: '1.5px solid var(--border-strong)',
                  background: row.posted ? '#2e9e5b' : 'transparent', display: 'flex', alignItems: 'center',
                  justifyContent: 'center', color: '#fff', fontSize: 12, cursor: ro ? 'default' : 'pointer',
                }}
              >
                {row.posted ? '✓' : ''}
              </div>
            </div>
            <div style={{ padding: '10px 12px' }}>
              <select
                value={row.type}
                disabled={ro}
                onChange={e => set(i, { type: e.target.value })}
                style={{ width: '100%', background: 'var(--field)', border: '1px solid var(--border)', borderRadius: 6, padding: '5px 6px', color: 'var(--text)', fontSize: 12, fontFamily: 'inherit' }}
              >
                {POST_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div style={{ padding: '10px 12px' }}>
              <input value={row.name} readOnly={ro} placeholder="Post name..." onChange={e => set(i, { name: e.target.value })} style={cellInput} />
            </div>
            <div style={{ padding: '10px 12px', display: 'flex', alignItems: 'center', gap: 6 }}>
              <input value={row.link} readOnly={ro} placeholder="Paste Dropbox link..." onChange={e => set(i, { link: e.target.value })} style={cellInput} />
              {row.link.trim() && (
                <a
                  href={normalizeUrl(row.link)}
                  target="_blank"
                  rel="noreferrer"
                  title="Open link"
                  onClick={e => e.stopPropagation()}
                  style={{ flex: '0 0 auto', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 26, height: 26, borderRadius: 6, background: 'color-mix(in srgb, var(--accent-deep) 16%, transparent)', color: 'var(--accent)' }}
                >
                  <ExternalLinkIcon size={14} />
                </a>
              )}
            </div>
            <div style={{ padding: '10px 12px' }}>
              <input value={row.athlete} readOnly={ro} placeholder="Athlete..." onChange={e => set(i, { athlete: e.target.value })} style={cellInput} />
            </div>
            <div style={{ padding: '10px 12px' }}>
              <textarea value={row.caption} readOnly={ro} placeholder="Caption..." rows={1} onChange={e => set(i, { caption: e.target.value })} style={{ ...cellInput, resize: 'none', lineHeight: 1.4, minHeight: 20 }} />
            </div>
            <div style={{ padding: '10px 12px' }}>
              {admin && (
                <span onClick={() => removePostingRow(eventId, dayKey, i)} style={{ cursor: 'pointer', color: 'var(--text-faint)', fontSize: 15 }}>×</span>
              )}
            </div>
          </div>
        ))}

        {rows.length === 0 && (
          <div style={{ padding: 26, textAlign: 'center', color: 'var(--text-faint)', fontSize: 13 }}>
            No posts scheduled for this day yet.
          </div>
        )}
      </div>
      )}

      {admin && (
        <div
          onClick={() => addPostingRow(eventId, dayKey)}
          style={{
            marginTop: 12, display: 'inline-flex', alignItems: 'center', gap: 7,
            background: 'var(--control)', border: '1px solid var(--border-strong)', borderRadius: 8,
            padding: '8px 14px', cursor: 'pointer', fontSize: 12.5, fontWeight: 700,
          }}
        >
          + Add post
        </div>
      )}
    </div>
  );
}

/* ---- Mobile: each post becomes a stacked card so every field is readable ---- */
const fieldLabel: React.CSSProperties = {
  ...condensed, fontSize: 10, color: 'var(--text-muted)', letterSpacing: '.07em', marginBottom: 3,
};
const mobInput: React.CSSProperties = {
  width: '100%', background: 'var(--field)', border: '1px solid var(--border)', borderRadius: 7,
  padding: '8px 9px', color: 'var(--text)', fontSize: 13, fontFamily: 'inherit', outline: 'none',
};

function MobilePosts({
  rows, ro, admin, set, onRemove,
}: {
  rows: PostingItem[];
  ro: boolean;
  admin: boolean;
  set: (rowIdx: number, patch: Partial<PostingItem>) => void;
  onRemove: (rowIdx: number) => void;
}) {
  if (rows.length === 0) {
    return (
      <div style={{ border: '1px solid var(--border)', borderRadius: 12, padding: 26, textAlign: 'center', color: 'var(--text-faint)', fontSize: 13 }}>
        No posts scheduled for this day yet.
      </div>
    );
  }
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {rows.map((row, i) => (
        <div key={i} style={{ border: '1px solid var(--border)', borderRadius: 12, padding: 14, background: 'var(--panel-2)' }}>
          {/* Posted toggle + remove */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <div
              onClick={ro ? undefined : () => set(i, { posted: !row.posted })}
              style={{ display: 'flex', alignItems: 'center', gap: 9, cursor: ro ? 'default' : 'pointer' }}
            >
              <div
                style={{
                  width: 22, height: 22, borderRadius: 5, border: '1.5px solid var(--border-strong)',
                  background: row.posted ? '#2e9e5b' : 'transparent', display: 'flex', alignItems: 'center',
                  justifyContent: 'center', color: '#fff', fontSize: 13,
                }}
              >
                {row.posted ? '✓' : ''}
              </div>
              <span style={{ ...condensed, fontSize: 11, color: row.posted ? '#2e9e5b' : 'var(--text-muted)' }}>
                {row.posted ? 'Posted' : 'Not posted'}
              </span>
            </div>
            {admin && (
              <span onClick={() => onRemove(i)} style={{ cursor: 'pointer', color: 'var(--text-faint)', fontSize: 20, lineHeight: 1, padding: '0 4px' }}>×</span>
            )}
          </div>

          <div style={{ marginBottom: 11 }}>
            <div style={fieldLabel}>Post Type</div>
            <select
              value={row.type}
              disabled={ro}
              onChange={e => set(i, { type: e.target.value })}
              style={mobInput}
            >
              {POST_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>

          <div style={{ marginBottom: 11 }}>
            <div style={fieldLabel}>Name</div>
            <input value={row.name} readOnly={ro} placeholder="Post name..." onChange={e => set(i, { name: e.target.value })} style={mobInput} />
          </div>

          <div style={{ marginBottom: 11 }}>
            <div style={fieldLabel}>Link</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
              <input value={row.link} readOnly={ro} placeholder="Paste Dropbox link..." onChange={e => set(i, { link: e.target.value })} style={{ ...mobInput, flex: 1, minWidth: 0 }} />
              {row.link.trim() && (
                <a
                  href={normalizeUrl(row.link)}
                  target="_blank"
                  rel="noreferrer"
                  title="Open link"
                  style={{ flex: '0 0 auto', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 38, height: 38, borderRadius: 8, background: 'color-mix(in srgb, var(--accent-deep) 16%, transparent)', color: 'var(--accent)' }}
                >
                  <ExternalLinkIcon size={16} />
                </a>
              )}
            </div>
          </div>

          <div style={{ marginBottom: 11 }}>
            <div style={fieldLabel}>Athlete</div>
            <input value={row.athlete} readOnly={ro} placeholder="Athlete..." onChange={e => set(i, { athlete: e.target.value })} style={mobInput} />
          </div>

          <div>
            <div style={fieldLabel}>Caption</div>
            <textarea value={row.caption} readOnly={ro} placeholder="Caption..." rows={3} onChange={e => set(i, { caption: e.target.value })} style={{ ...mobInput, resize: 'vertical', lineHeight: 1.4, minHeight: 56 }} />
          </div>
        </div>
      ))}
    </div>
  );
}
