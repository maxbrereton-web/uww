import type React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useStore, eventNotifCount, visibleEvents } from '../../store';
import type { NotifTab } from '../../types';
import PriorityDot from '../common/PriorityDot';
import { formatDateFull, eventTypeLabel } from '../../data/utils';
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
  { tab: 'schedule', label: 'Schedule' },
  { tab: 'staffRoles', label: 'Event Team' },
  { tab: 'posting', label: 'Posting' },
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

  const chevBtn = (enabled: boolean): React.CSSProperties => ({
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 32,
    height: 32,
    borderRadius: 8,
    border: '1px solid var(--border)',
    background: 'var(--control)',
    color: enabled ? 'var(--text)' : 'var(--text-faint)',
    cursor: enabled ? 'pointer' : 'default',
    flex: '0 0 auto',
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
    <div style={{ padding: 22, maxWidth: 1100, margin: '0 auto', width: '100%', overflow: 'auto', boxSizing: 'border-box' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
        <button
          type="button"
          style={chevBtn(!!prevId)}
          onClick={() => prevId && selectEvent(prevId)}
          disabled={!prevId}
          title="Previous event"
        >
          <ChevronLeft size={18} />
        </button>
        <div style={{ ...condensed, fontSize: 24, color: 'var(--text)', flex: 1, lineHeight: 1.1 }}>
          {ev.name}
        </div>
        <button
          type="button"
          style={chevBtn(!!nextId)}
          onClick={() => nextId && selectEvent(nextId)}
          disabled={!nextId}
          title="Next event"
        >
          <ChevronRight size={18} />
        </button>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16, color: 'var(--text-muted)' }}>
        <PriorityDot priority={ev.priority} />
        <span style={{ ...condensed, fontSize: 12 }}>{eventTypeLabel(ev.eventType)}</span>
        <span style={{ color: 'var(--text-faint)' }}>·</span>
        <span style={{ fontSize: 13 }}>{formatDateFull(ev.start)} – {formatDateFull(ev.end)}</span>
      </div>

      <div
        style={{
          display: 'flex',
          gap: 6,
          overflowX: 'auto',
          borderBottom: '1px solid var(--border)',
          marginBottom: 18,
          paddingBottom: 2,
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
                ...condensed,
                fontSize: 12,
                whiteSpace: 'nowrap',
                padding: '8px 12px',
                border: 'none',
                borderBottom: active ? '2px solid var(--accent)' : '2px solid transparent',
                background: 'transparent',
                color: active ? 'var(--text)' : 'var(--text-muted)',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
              }}
            >
              {label}
              {tab === 'notifications' && notifCount > 0 && (
                <span
                  style={{
                    background: 'var(--accent)',
                    color: '#fff',
                    borderRadius: 999,
                    fontSize: 10,
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

      <div>{renderTab()}</div>
    </div>
  );
}
