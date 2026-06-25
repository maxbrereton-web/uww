import type React from 'react';
import { useStore, eventNotifCount, visibleEvents } from '../../store';
import type { NotifTab } from '../../types';
import EventInfoTab from './tabs/EventInfoTab';
import EventScheduleTab from './tabs/EventScheduleTab';
import EventTeamTab from './tabs/EventTeamTab';
import PostingScheduleTab from './tabs/PostingScheduleTab';
import AvailabilityTab from './tabs/AvailabilityTab';
import NotificationsTab from './tabs/NotificationsTab';
import CommentsTab from './tabs/CommentsTab';

const condensed: React.CSSProperties = {
  fontStretch: '75%',
  fontWeight: 800,
  textTransform: 'uppercase',
  letterSpacing: '.02em',
};

const TABS: { tab: NotifTab; label: string }[] = [
  { tab: 'info', label: 'Event Info' },
  { tab: 'schedule', label: 'Event Schedule' },
  { tab: 'posting', label: 'Posting Schedule' },
  { tab: 'staffRoles', label: 'Event Team' },
  { tab: 'flights', label: 'Availability & Flights' },
  { tab: 'notifications', label: 'Notifications' },
  { tab: 'requests', label: 'Comments' },
];

export default function EventDetail() {
  const ev = useStore(s => s.events.find(e => e.id === s.selectedEventId) || s.archivedEvents.find(e => e.id === s.selectedEventId));
  const activeTab = useStore(s => s.eventTab);
  const setEventTab = useStore(s => s.setEventTab);
  const selectEvent = useStore(s => s.selectEvent);
  const vis = useStore(visibleEvents);
  const notifCount = useStore(s => (ev ? eventNotifCount(ev.id, s) : 0));

  if (!ev) {
    return (
      <div style={{ padding: 24, color: 'var(--text-muted)' }}>
        No event selected.
      </div>
    );
  }

  const idx = vis.findIndex(e => e.id === ev.id);
  const prevId = idx > 0 ? vis[idx - 1].id : null;
  const nextId = idx >= 0 && idx < vis.length - 1 ? vis[idx + 1].id : null;

  const chev = (enabled: boolean): React.CSSProperties => ({
    flex: '0 0 auto',
    fontSize: 24,
    lineHeight: 1,
    padding: '0 6px',
    background: 'none',
    color: enabled ? 'var(--text-muted)' : 'var(--text-faint)',
    cursor: enabled ? 'pointer' : 'default',
    userSelect: 'none',
  });

  const renderTab = () => {
    switch (activeTab) {
      case 'info': return <EventInfoTab eventId={ev.id} />;
      case 'schedule': return <EventScheduleTab eventId={ev.id} />;
      case 'staffRoles': return <EventTeamTab eventId={ev.id} />;
      case 'posting': return <PostingScheduleTab eventId={ev.id} />;
      case 'flights': return <AvailabilityTab eventId={ev.id} />;
      case 'notifications': return <NotificationsTab eventId={ev.id} />;
      case 'requests': return <CommentsTab eventId={ev.id} />;
      default: return <EventInfoTab eventId={ev.id} />;
    }
  };

  return (
    <div style={{ padding: '20px 24px 28px', width: '100%', boxSizing: 'border-box' }}>
      {/* Title row: ‹ centered-name › */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 18 }}>
        <button
          type="button"
          style={chev(!!prevId)}
          onClick={() => prevId && selectEvent(prevId)}
          disabled={!prevId}
          title="Previous event"
        >
          ‹
        </button>
        <div style={{ ...condensed, fontSize: 19, color: 'var(--text)', flex: 1, textAlign: 'center', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {ev.name}
        </div>
        <button
          type="button"
          style={chev(!!nextId)}
          onClick={() => nextId && selectEvent(nextId)}
          disabled={!nextId}
          title="Next event"
        >
          ›
        </button>
      </div>

      {/* Panel: tab bar + content */}
      <div
        style={{
          background: 'var(--panel)',
          border: '1px solid var(--border)',
          borderRadius: 14,
          overflow: 'hidden',
          boxShadow: 'var(--shadow)',
        }}
      >
        <div
          style={{
            display: 'flex',
            background: 'var(--panel-2)',
            borderBottom: '1px solid var(--border)',
            overflowX: 'auto',
          }}
        >
          {TABS.map(({ tab, label }) => {
            const active = activeTab === tab;
            return (
              <button
                key={tab}
                type="button"
                onClick={() => setEventTab(tab)}
                style={{
                  flex: 1,
                  textAlign: 'center',
                  padding: '13px 6px',
                  fontSize: 12.5,
                  fontWeight: 700,
                  whiteSpace: 'nowrap',
                  cursor: 'pointer',
                  color: active ? 'var(--text)' : 'var(--text-muted)',
                  background: active ? 'var(--panel)' : 'transparent',
                  borderBottom: active ? '2px solid var(--accent)' : '2px solid transparent',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 6,
                }}
              >
                {label}
                {tab === 'notifications' && notifCount > 0 && (
                  <span
                    style={{
                      background: '#ED1C24',
                      color: '#fff',
                      borderRadius: 6,
                      fontSize: 10,
                      fontWeight: 800,
                      minWidth: 16,
                      height: 16,
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '0 5px',
                    }}
                  >
                    {notifCount}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <div style={{ padding: 24 }}>{renderTab()}</div>
      </div>
    </div>
  );
}
