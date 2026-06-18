import type React from 'react';
import { X, Plus } from 'lucide-react';
import { useStore, isAdmin } from '../../../store';
import { eventDayList, formatDateFull } from '../../../data/utils';

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
  padding: '5px 8px',
};

export default function EventScheduleTab({ eventId }: { eventId: string }) {
  const ev = useStore(s => s.events.find(e => e.id === eventId) || s.archivedEvents.find(e => e.id === eventId));
  const detail = useStore(s => s.detail[eventId]);
  const admin = useStore(isAdmin);
  const addScheduleItem = useStore(s => s.addScheduleItem);
  const updateScheduleItem = useStore(s => s.updateScheduleItem);
  const removeScheduleItem = useStore(s => s.removeScheduleItem);

  if (!ev) return null;
  const days = eventDayList(ev.start, ev.end);

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: 14,
      }}
    >
      {days.map(day => {
        const rows = detail?.schedule[day] || [];
        return (
          <div key={day} style={{ background: 'var(--panel)', border: '1px solid var(--border)', borderRadius: 10, padding: 14 }}>
            <div style={{ ...condensed, fontSize: 12, color: 'var(--text)', marginBottom: 10 }}>{formatDateFull(day)}</div>

            {rows.length === 0 && !admin && (
              <div style={{ color: 'var(--text-muted)', fontSize: 13 }}>No sessions scheduled.</div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {rows.map((it, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  {admin ? (
                    <>
                      <input
                        type="time"
                        style={{ ...inputStyle, width: 100 }}
                        value={it.time}
                        onChange={e => updateScheduleItem(eventId, day, idx, { time: e.target.value })}
                      />
                      <input
                        type="text"
                        placeholder="Session…"
                        style={{ ...inputStyle, flex: 1, minWidth: 0 }}
                        value={it.label}
                        onChange={e => updateScheduleItem(eventId, day, idx, { label: e.target.value })}
                      />
                      <button
                        type="button"
                        onClick={() => removeScheduleItem(eventId, day, idx)}
                        style={removeBtn}
                        title="Remove"
                      >
                        <X size={13} />
                      </button>
                    </>
                  ) : (
                    <>
                      <span style={{ ...condensed, fontSize: 12, color: 'var(--accent)', width: 52 }}>{it.time}</span>
                      <span style={{ fontSize: 13, color: 'var(--text)' }}>{it.label || '—'}</span>
                    </>
                  )}
                </div>
              ))}
            </div>

            {admin && (
              <button
                type="button"
                onClick={() => addScheduleItem(eventId, day)}
                style={{
                  ...condensed,
                  fontSize: 11,
                  marginTop: 10,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  border: '1px solid var(--border)',
                  borderRadius: 6,
                  background: 'var(--control)',
                  color: 'var(--text-muted)',
                  padding: '5px 10px',
                  cursor: 'pointer',
                }}
              >
                <Plus size={13} /> Add session
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}

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
  flex: '0 0 auto',
};
