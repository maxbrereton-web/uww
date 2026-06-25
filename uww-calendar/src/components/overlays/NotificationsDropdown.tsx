import type React from 'react';
import { useState } from 'react';
import { Plane, FileText, Users, Inbox, Tag, MessageSquare, AtSign, Bell } from 'lucide-react';
import { useStore, currentUser } from '../../store';
import type { Notification, NotifKind } from '../../types';
import { priorityColor, priorityRank } from '../../data/utils';

const condensed: React.CSSProperties = {
  fontStretch: '75%', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.02em',
};

const ICONS: Record<NotifKind, React.ComponentType<{ size?: number }>> = {
  flight: Plane, info: FileText, staff: Users, request: Inbox, roles: Tag, reply: MessageSquare, mention: AtSign,
};

export default function NotificationsDropdown() {
  const notifications = useStore(s => s.notifications);
  const events = useStore(s => s.events);
  const archivedEvents = useStore(s => s.archivedEvents);
  const role = useStore(s => s.role);
  const cu = useStore(currentUser);
  const selectEvent = useStore(s => s.selectEvent);
  const setPage = useStore(s => s.setPage);
  const actionNotif = useStore(s => s.actionNotif);
  const clearNotif = useStore(s => s.clearNotif);
  const clearAllNotifs = useStore(s => s.clearAllNotifs);
  const toggleNotifications = useStore(s => s.toggleNotifications);

  const [sortMode, setSortMode] = useState<'priority' | 'newest'>('priority');

  const allEvents = [...events, ...archivedEvents];
  const hasEvent = (id: string) => allEvents.some(e => e.id === id);
  const headerFor = (n: Notification) =>
    hasEvent(n.eventId) ? allEvents.find(e => e.id === n.eventId)!.name : (n.kind === 'mention' ? 'Mention' : 'Event');

  // role-filtered, un-cleared
  const filtered = notifications.filter(n =>
    !n.cleared
    && (n.forRole === 'both' || n.forRole === role)
    && (!n.mentionFor || n.mentionFor === cu),
  );
  const sorted = [...filtered];
  if (sortMode === 'priority') {
    sorted.sort((a, b) => (a.actioned === b.actioned ? priorityRank(a.pri) - priorityRank(b.pri) : a.actioned ? 1 : -1));
  } else {
    sorted.reverse();
  }

  const allActioned = sorted.length > 0 && sorted.every(n => n.actioned);

  const onItem = (n: Notification) => {
    if (n.actioned) return;
    actionNotif(n.id);
    if (hasEvent(n.eventId)) selectEvent(n.eventId, n.targetTab);
    else if (n.kind === 'mention') { selectEvent(null); setPage('chat'); }
    toggleNotifications();
  };

  return (
    <>
      <div style={{ position: 'fixed', inset: 0, background: 'transparent', zIndex: 89 }} onClick={toggleNotifications} />
      <div
        className="uww-overlay"
        style={{
          position: 'fixed', top: 60, right: 24, width: 360, maxHeight: '78vh', display: 'flex', flexDirection: 'column',
          background: 'var(--panel)', border: '1px solid var(--border-strong)', borderRadius: 14,
          boxShadow: 'var(--shadow)', overflow: 'hidden', zIndex: 90,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', borderBottom: '1px solid var(--border)' }}>
          <div style={{ ...condensed, fontSize: 15, letterSpacing: '.04em' }}>Notifications</div>
          <div
            onClick={() => setSortMode(m => (m === 'priority' ? 'newest' : 'priority'))}
            style={{ cursor: 'pointer', fontSize: 11.5, fontWeight: 700, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 5 }}
          >
            Sort: {sortMode === 'priority' ? 'Priority' : 'Newest'} ⇅
          </div>
        </div>

        {sorted.length === 0 ? (
          <div style={{ padding: '32px 16px', textAlign: 'center', color: 'var(--text-muted)', fontSize: 13 }}>
            You're all caught up.
          </div>
        ) : (
          <div style={{ padding: 10, display: 'flex', flexDirection: 'column', gap: 8, overflow: 'auto' }}>
            {sorted.map(n => {
              const Icon = ICONS[n.kind] || Bell;
              const dot = n.actioned ? 'var(--text-faint)' : priorityColor(n.pri);
              const urgent = !!n.deadlineLabel && (n.deadlineLabel.toLowerCase().includes('day') || n.deadlineLabel === 'Today');
              const shortDeadline = (n.deadlineLabel || '').replace(/\s*remaining$/i, '');
              return (
                <div
                  key={n.id}
                  onClick={() => onItem(n)}
                  style={{
                    display: 'flex', flexDirection: 'column', gap: 9, padding: '12px 13px', borderRadius: 10,
                    cursor: n.actioned ? 'default' : 'pointer', background: 'var(--panel-2)', border: '1px solid var(--border)',
                    opacity: n.actioned ? 0.45 : 1,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ width: 7, height: 7, borderRadius: '50%', background: dot, flex: '0 0 7px', ...(n.pri === 'top' && !n.actioned ? { animation: 'goldRipple 2.2s ease-out infinite, goldGlow 2.2s ease-in-out infinite' } : {}) }} />
                    <div style={{ flex: 1, minWidth: 0, fontSize: 12, fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {headerFor(n)}
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
                    <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 30, height: 30, borderRadius: 8, flex: '0 0 30px', background: 'var(--field)', color: n.actioned ? 'var(--text-faint)' : priorityColor(n.pri) }}>
                      <Icon size={16} />
                    </span>
                    <div style={{ flex: 1, minWidth: 0, fontSize: 13.5, fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {n.title}
                    </div>
                    {n.actioned && (
                      <div
                        onClick={e => { e.stopPropagation(); clearNotif(n.id); }}
                        style={{ fontSize: 10.5, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.05em', color: 'var(--accent)', cursor: 'pointer', padding: '4px 8px', border: '1px solid var(--border-strong)', borderRadius: 6, whiteSpace: 'nowrap' }}
                      >
                        Clear
                      </div>
                    )}
                    {n.deadlineLabel && (
                      <span style={{ background: n.actioned ? 'var(--control)' : (urgent ? '#ED1C24' : '#9e3535'), color: n.actioned ? 'var(--text-faint)' : '#fff', fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.03em', padding: '3px 8px', borderRadius: 6, whiteSpace: 'nowrap', flex: '0 0 auto' }}>
                        {shortDeadline}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {allActioned && (
          <div style={{ padding: '10px 16px', borderTop: '1px solid var(--border)' }}>
            <button
              type="button"
              onClick={clearAllNotifs}
              style={{ ...condensed, fontSize: 11, width: '100%', padding: 8, cursor: 'pointer', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--control)', color: 'var(--text)' }}
            >
              Clear all
            </button>
          </div>
        )}
      </div>
    </>
  );
}
