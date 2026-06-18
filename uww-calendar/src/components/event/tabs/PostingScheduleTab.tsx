import type React from 'react';
import { X, Plus } from 'lucide-react';
import { useStore, isAdmin } from '../../../store';
import type { PostingItem } from '../../../types';
import { eventDayList, formatDateFull } from '../../../data/utils';
import { POST_TYPES } from '../../../data/seed';

const condensed: React.CSSProperties = {
  fontStretch: '75%',
  fontWeight: 800,
  textTransform: 'uppercase',
  letterSpacing: '.02em',
};

const inputStyle: React.CSSProperties = {
  background: 'var(--field)',
  border: '1px solid var(--border)',
  borderRadius: 6,
  color: 'var(--text)',
  fontSize: 13,
  padding: '5px 7px',
  width: '100%',
  boxSizing: 'border-box',
};

const COLUMNS: { key: keyof PostingItem; label: string }[] = [
  { key: 'type', label: 'Type' },
  { key: 'name', label: 'Name' },
  { key: 'link', label: 'Link' },
  { key: 'athlete', label: 'Athlete' },
  { key: 'caption', label: 'Caption' },
];

export default function PostingScheduleTab({ eventId }: { eventId: string }) {
  const ev = useStore(s => s.events.find(e => e.id === eventId) || s.archivedEvents.find(e => e.id === eventId));
  const detail = useStore(s => s.detail[eventId]);
  const admin = useStore(isAdmin);
  const viewMode = useStore(s => s.viewMode);
  const postingDayIdx = useStore(s => s.postingDayIdx);
  const setPostingDayIdx = useStore(s => s.setPostingDayIdx);
  const addPostingRow = useStore(s => s.addPostingRow);
  const updatePostingRow = useStore(s => s.updatePostingRow);
  const removePostingRow = useStore(s => s.removePostingRow);

  if (!ev) return null;

  const days = ['Pre-Event', ...eventDayList(ev.start, ev.end), 'Post-Event'];
  const safeIdx = Math.min(Math.max(postingDayIdx, 0), days.length - 1);
  const dayKey = days[safeIdx];
  const rows = detail?.posting[dayKey] || [];
  const ro = !admin;

  const labelFor = (d: string) => (d === 'Pre-Event' || d === 'Post-Event') ? d : formatDateFull(d);

  return (
    <div>
      {/* Day navigator */}
      <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 8, marginBottom: 14 }}>
        {days.map((d, i) => {
          const active = i === safeIdx;
          return (
            <button
              key={d}
              type="button"
              onClick={() => setPostingDayIdx(i)}
              style={{
                ...condensed,
                fontSize: 11,
                whiteSpace: 'nowrap',
                padding: '6px 12px',
                borderRadius: 8,
                border: active ? '1px solid var(--accent)' : '1px solid var(--border)',
                background: active ? 'var(--accent)' : 'var(--control)',
                color: active ? '#fff' : 'var(--text-muted)',
                cursor: 'pointer',
              }}
            >
              {labelFor(d)}
            </button>
          );
        })}
      </div>

      {viewMode === 'mobile' ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {rows.map((row, idx) => (
            <div key={idx} style={{ background: 'var(--panel)', border: '1px solid var(--border)', borderRadius: 10, padding: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <input
                  type="checkbox"
                  checked={row.posted}
                  disabled={ro}
                  onChange={e => updatePostingRow(eventId, dayKey, idx, { posted: e.target.checked })}
                />
                <span style={{ ...condensed, fontSize: 11, color: 'var(--text-muted)' }}>Posted</span>
                {admin && (
                  <button type="button" onClick={() => removePostingRow(eventId, dayKey, idx)} style={{ ...removeBtn, marginLeft: 'auto' }} title="Remove">
                    <X size={13} />
                  </button>
                )}
              </div>
              {COLUMNS.map(col => (
                <div key={col.key} style={{ marginBottom: 8 }}>
                  <div style={{ ...condensed, fontSize: 10, color: 'var(--text-muted)', marginBottom: 3 }}>{col.label}</div>
                  {col.key === 'type' ? (
                    <select
                      style={inputStyle}
                      disabled={ro}
                      value={row.type}
                      onChange={e => updatePostingRow(eventId, dayKey, idx, { type: e.target.value })}
                    >
                      {POST_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  ) : (
                    <input
                      type="text"
                      style={inputStyle}
                      readOnly={ro}
                      value={String(row[col.key])}
                      onChange={e => updatePostingRow(eventId, dayKey, idx, { [col.key]: e.target.value } as Partial<PostingItem>)}
                    />
                  )}
                </div>
              ))}
            </div>
          ))}
          {rows.length === 0 && <div style={{ color: 'var(--text-muted)', fontSize: 13 }}>No posts for this day.</div>}
        </div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr>
                <th style={thStyle}>Posted</th>
                {COLUMNS.map(c => <th key={c.key} style={thStyle}>{c.label}</th>)}
                <th style={thStyle}></th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, idx) => (
                <tr key={idx} style={{ borderTop: '1px solid var(--border)' }}>
                  <td style={tdStyle}>
                    <input
                      type="checkbox"
                      checked={row.posted}
                      disabled={ro}
                      onChange={e => updatePostingRow(eventId, dayKey, idx, { posted: e.target.checked })}
                    />
                  </td>
                  <td style={tdStyle}>
                    <select
                      style={inputStyle}
                      disabled={ro}
                      value={row.type}
                      onChange={e => updatePostingRow(eventId, dayKey, idx, { type: e.target.value })}
                    >
                      {POST_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </td>
                  <td style={tdStyle}>
                    <input type="text" style={inputStyle} readOnly={ro} value={row.name} onChange={e => updatePostingRow(eventId, dayKey, idx, { name: e.target.value })} />
                  </td>
                  <td style={tdStyle}>
                    <input type="text" style={inputStyle} readOnly={ro} value={row.link} onChange={e => updatePostingRow(eventId, dayKey, idx, { link: e.target.value })} />
                  </td>
                  <td style={tdStyle}>
                    <input type="text" style={inputStyle} readOnly={ro} value={row.athlete} onChange={e => updatePostingRow(eventId, dayKey, idx, { athlete: e.target.value })} />
                  </td>
                  <td style={tdStyle}>
                    <input type="text" style={inputStyle} readOnly={ro} value={row.caption} onChange={e => updatePostingRow(eventId, dayKey, idx, { caption: e.target.value })} />
                  </td>
                  <td style={tdStyle}>
                    {admin && (
                      <button type="button" onClick={() => removePostingRow(eventId, dayKey, idx)} style={removeBtn} title="Remove">
                        <X size={13} />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr><td colSpan={7} style={{ ...tdStyle, color: 'var(--text-muted)' }}>No posts for this day.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {admin && (
        <button
          type="button"
          onClick={() => addPostingRow(eventId, dayKey)}
          style={{
            ...condensed, fontSize: 11, marginTop: 12,
            display: 'inline-flex', alignItems: 'center', gap: 6,
            border: '1px solid var(--border)', borderRadius: 6,
            background: 'var(--control)', color: 'var(--text-muted)',
            padding: '6px 12px', cursor: 'pointer',
          }}
        >
          <Plus size={13} /> Add post
        </button>
      )}
    </div>
  );
}

const thStyle: React.CSSProperties = {
  ...condensed,
  fontSize: 10,
  color: 'var(--text-muted)',
  textAlign: 'left',
  padding: '6px 8px',
};

const tdStyle: React.CSSProperties = {
  padding: '6px 8px',
  verticalAlign: 'middle',
};

const removeBtn: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 24,
  height: 24,
  borderRadius: 6,
  border: '1px solid var(--border)',
  background: 'var(--control)',
  color: 'var(--text-muted)',
  cursor: 'pointer',
};
