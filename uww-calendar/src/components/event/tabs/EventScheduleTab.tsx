import type React from 'react';
import { useStore, isAdmin } from '../../../store';
import { eventDayList, parseDateISO } from '../../../data/utils';

const condensed: React.CSSProperties = {
  fontStretch: '75%', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.02em',
};

function dayDateLabel(iso: string): string {
  return parseDateISO(iso).toLocaleDateString('en-GB', { weekday: 'short', day: '2-digit', month: 'short' });
}

export default function EventScheduleTab({ eventId }: { eventId: string }) {
  const ev = useStore(s => s.events.find(e => e.id === eventId) || s.archivedEvents.find(e => e.id === eventId));
  const detail = useStore(s => s.detail[eventId]);
  const admin = useStore(isAdmin);
  const addScheduleItem = useStore(s => s.addScheduleItem);
  const updateScheduleItem = useStore(s => s.updateScheduleItem);

  if (!ev) return null;
  const days = eventDayList(ev.start, ev.end);

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
      {days.map((day, i) => {
        const rows = detail?.schedule[day] || [];
        return (
          <div key={day} style={{ background: 'var(--panel-2)', border: '1px solid var(--border)', borderRadius: 12, padding: 15 }}>
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 12 }}>
              <div style={{ ...condensed, fontSize: 15 }}>Day {i + 1}</div>
              <div style={{ fontSize: 11.5, color: 'var(--text-muted)' }}>{dayDateLabel(day)}</div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {rows.map((it, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    background: 'var(--field)', border: '1px solid var(--border)', borderRadius: 8, padding: '7px 10px',
                  }}
                >
                  <input
                    value={it.time}
                    readOnly={!admin}
                    onChange={e => updateScheduleItem(eventId, day, idx, { time: e.target.value })}
                    style={{ width: 54, background: 'transparent', border: 'none', color: 'var(--accent)', fontWeight: 800, fontSize: 13, outline: 'none' }}
                  />
                  <input
                    value={it.label}
                    readOnly={!admin}
                    onChange={e => updateScheduleItem(eventId, day, idx, { label: e.target.value })}
                    style={{ flex: 1, background: 'transparent', border: 'none', color: 'var(--text)', fontSize: 13, outline: 'none' }}
                  />
                </div>
              ))}
              {rows.length === 0 && !admin && (
                <div style={{ color: 'var(--text-faint)', fontSize: 12.5 }}>No sessions scheduled.</div>
              )}
            </div>

            {admin && (
              <div
                onClick={() => addScheduleItem(eventId, day)}
                style={{ marginTop: 10, fontSize: 12, color: 'var(--accent)', cursor: 'pointer', fontWeight: 700 }}
              >
                + Add session
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
