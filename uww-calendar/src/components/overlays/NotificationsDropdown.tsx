import type React from 'react';
import { useStore, roleNotifs } from '../../store';
import type { Notification } from '../../types';
import PriorityDot from '../common/PriorityDot';

const condensed: React.CSSProperties = {
  fontStretch: '75%', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.02em',
};

export default function NotificationsDropdown() {
  const notifs = useStore(s => roleNotifs(s));
  const events = useStore(s => s.events);
  const archivedEvents = useStore(s => s.archivedEvents);
  const selectEvent = useStore(s => s.selectEvent);
  const actionNotif = useStore(s => s.actionNotif);
  const clearNotif = useStore(s => s.clearNotif);
  const clearAllNotifs = useStore(s => s.clearAllNotifs);
  const toggleNotifications = useStore(s => s.toggleNotifications);

  const allEvents = [...events, ...archivedEvents];
  const eventName = (id: string) => allEvents.find(e => e.id === id)?.name || 'Event';

  const groups: Record<string, Notification[]> = {};
  const order: string[] = [];
  for (const n of notifs) {
    if (!groups[n.eventId]) { groups[n.eventId] = []; order.push(n.eventId); }
    groups[n.eventId].push(n);
  }

  const visible = notifs;
  const allActioned = visible.length > 0 && visible.every(n => n.actioned);

  const onItem = (n: Notification) => {
    if (n.actioned) return;
    actionNotif(n.id);
    selectEvent(n.eventId, n.targetTab);
    toggleNotifications();
  };

  return (
    <>
      <div
        style={{ position: 'fixed', inset: 0, background: 'transparent', zIndex: 89 }}
        onClick={toggleNotifications}
      />
      <div
        className="uww-overlay"
        style={{
          position: 'fixed', top: 64, right: 16, width: 340, maxHeight: '70vh', overflowY: 'auto',
          background: 'var(--panel)', border: '1px solid var(--border-strong)', borderRadius: 12,
          boxShadow: 'var(--shadow)', zIndex: 90,
        }}
      >
        <div style={{ ...condensed, fontSize: 13, color: 'var(--text)', padding: '14px 16px', borderBottom: '1px solid var(--border)' }}>
          Notifications
        </div>

        {visible.length === 0 ? (
          <div style={{ padding: '32px 16px', textAlign: 'center', color: 'var(--text-muted)', fontSize: 13 }}>
            You're all caught up.
          </div>
        ) : (
          <div style={{ padding: '6px 0' }}>
            {order.map(eid => (
              <div key={eid}>
                <div style={{ ...condensed, fontSize: 10, color: 'var(--text-faint)', padding: '8px 16px 4px' }}>
                  {eventName(eid)}
                </div>
                {groups[eid].map(n => (
                  <div
                    key={n.id}
                    onClick={() => onItem(n)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 10, padding: '9px 16px',
                      cursor: n.actioned ? 'default' : 'pointer',
                      opacity: n.actioned ? 0.45 : 1,
                    }}
                  >
                    <PriorityDot priority={n.pri} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, color: 'var(--text)', fontWeight: 600 }}>{n.title}</div>
                      {n.deadlineLabel && (
                        <div style={{ fontSize: 11, color: 'var(--text-faint)', marginTop: 1 }}>{n.deadlineLabel}</div>
                      )}
                    </div>
                    {n.actioned && (
                      <button
                        onClick={e => { e.stopPropagation(); clearNotif(n.id); }}
                        style={{ ...condensed, fontSize: 10, padding: '4px 8px', cursor: 'pointer', borderRadius: 6, border: '1px solid var(--border)', background: 'var(--control)', color: 'var(--text-muted)' }}
                      >
                        Clear
                      </button>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}

        {allActioned && (
          <div style={{ padding: '10px 16px', borderTop: '1px solid var(--border)' }}>
            <button
              onClick={clearAllNotifs}
              style={{ ...condensed, fontSize: 11, width: '100%', padding: '8px', cursor: 'pointer', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--control)', color: 'var(--text)' }}
            >
              Clear all
            </button>
          </div>
        )}
      </div>
    </>
  );
}
