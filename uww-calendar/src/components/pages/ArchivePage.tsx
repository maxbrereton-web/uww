import type React from 'react';
import { RotateCcw } from 'lucide-react';
import { useStore } from '../../store';
import { eventTypeLabel, formatDate } from '../../data/utils';
import PriorityDot from '../common/PriorityDot';
import Avatar from '../common/Avatar';

const condensed: React.CSSProperties = {
  fontStretch: '75%', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.02em',
};

export default function ArchivePage() {
  const archivedEvents = useStore(s => s.archivedEvents);
  const restoreEvent = useStore(s => s.restoreEvent);
  const selectEvent = useStore(s => s.selectEvent);

  const headCell: React.CSSProperties = {
    ...condensed, fontSize: 10, color: 'var(--text-muted)', padding: '10px 12px', textAlign: 'left',
  };
  const bodyCell: React.CSSProperties = {
    padding: 12, borderTop: '1px solid var(--border)', fontSize: 12, color: 'var(--text)', verticalAlign: 'middle',
  };

  return (
    <div style={{ padding: 22, overflow: 'auto', height: '100%' }}>
      <div style={{ ...condensed, fontSize: 20, color: 'var(--text)', marginBottom: 18 }}>Archive</div>

      {archivedEvents.length === 0 ? (
        <div style={{ padding: 40, textAlign: 'center', ...condensed, fontSize: 13, color: 'var(--text-muted)' }}>
          No archived events.
        </div>
      ) : (
        <div style={{ background: 'var(--panel)', border: '1px solid var(--border)', borderRadius: 12, overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 760 }}>
            <thead>
              <tr style={{ background: 'var(--panel-2)' }}>
                <th style={{ ...headCell, width: 44 }}>Pri</th>
                <th style={headCell}>Event</th>
                <th style={headCell}>Type</th>
                <th style={headCell}>Competition</th>
                <th style={headCell}>Dates</th>
                <th style={headCell}>Staff</th>
                <th style={{ ...headCell, width: 100 }}>Restore</th>
              </tr>
            </thead>
            <tbody>
              {archivedEvents.map(ev => (
                <tr key={ev.id} onClick={() => selectEvent(ev.id)} style={{ cursor: 'pointer' }}>
                  <td style={bodyCell}><PriorityDot priority={ev.priority} /></td>
                  <td style={{ ...bodyCell, ...condensed, fontSize: 12 }}>{ev.name}</td>
                  <td style={{ ...bodyCell, color: 'var(--text-muted)' }}>{eventTypeLabel(ev.eventType)}</td>
                  <td style={{ ...bodyCell, color: 'var(--text-muted)' }}>{ev.competitionType}</td>
                  <td style={{ ...bodyCell, color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                    {formatDate(ev.start)}{ev.end && ev.end !== ev.start ? `–${formatDate(ev.end)}` : ''}
                  </td>
                  <td style={bodyCell}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      {ev.staff.slice(0, 5).map((sid, i) => (
                        <span key={sid} style={{ marginLeft: i === 0 ? 0 : -6 }}>
                          <Avatar staffId={sid} size={22} confirmed />
                        </span>
                      ))}
                      {ev.staff.length > 5 && (
                        <span style={{ ...condensed, fontSize: 10, color: 'var(--text-muted)', marginLeft: 6 }}>
                          +{ev.staff.length - 5}
                        </span>
                      )}
                    </div>
                  </td>
                  <td style={bodyCell}>
                    <button
                      onClick={e => { e.stopPropagation(); restoreEvent(ev.id); }}
                      style={{ display: 'inline-flex', alignItems: 'center', gap: 6, ...condensed, fontSize: 10, padding: '6px 12px', borderRadius: 7, border: '1px solid var(--border)', background: 'var(--control)', color: 'var(--text)', cursor: 'pointer' }}
                    >
                      <RotateCcw size={13} /> Restore
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
