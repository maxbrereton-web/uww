import type React from 'react';
import { useStore, isAdmin } from '../../../store';
import type { PostingItem } from '../../../types';
import { eventDayList, formatDayMon } from '../../../data/utils';
import { POST_TYPES } from '../../../data/seed';

const condensed: React.CSSProperties = {
  fontStretch: '75%', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.02em',
};

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

  const dayLabel = (dayKey === 'Pre-Event' || dayKey === 'Post-Event')
    ? dayKey
    : `Day ${idx} · ${formatDayMon(dayKey)}`;

  const set = (rowIdx: number, patch: Partial<PostingItem>) => updatePostingRow(eventId, dayKey, rowIdx, patch);

  return (
    <div>
      {/* Centered day navigator */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 18, marginBottom: 18 }}>
        <span
          onClick={() => setPostingDayIdx(Math.max(0, idx - 1))}
          style={{ cursor: 'pointer', fontSize: 18, color: 'var(--text-muted)', userSelect: 'none' }}
        >
          ‹
        </span>
        <span style={{ ...condensed, fontSize: 17, minWidth: 170, textAlign: 'center' }}>{dayLabel}</span>
        <span
          onClick={() => setPostingDayIdx(Math.min(days.length - 1, idx + 1))}
          style={{ cursor: 'pointer', fontSize: 18, color: 'var(--text-muted)', userSelect: 'none' }}
        >
          ›
        </span>
      </div>

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
            <div style={{ padding: '10px 12px' }}>
              <input value={row.link} readOnly={ro} placeholder="Paste Dropbox link..." onChange={e => set(i, { link: e.target.value })} style={cellInput} />
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
