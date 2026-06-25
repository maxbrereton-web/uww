import type React from 'react';
import { Plane, FileText, Users, Inbox, Tag, MessageSquare, AtSign, Bell } from 'lucide-react';
import { useStore, currentUser } from '../../../store';
import type { NotifKind } from '../../../types';
import { priorityColor } from '../../../data/utils';

const ICONS: Record<NotifKind, React.ComponentType<{ size?: number }>> = {
  flight: Plane,
  info: FileText,
  staff: Users,
  request: Inbox,
  roles: Tag,
  reply: MessageSquare,
  mention: AtSign,
};

export default function NotificationsTab({ eventId }: { eventId: string }) {
  const notifications = useStore(s => s.notifications);
  const role = useStore(s => s.role);
  const cu = useStore(currentUser);
  const actionNotif = useStore(s => s.actionNotif);
  const setEventTab = useStore(s => s.setEventTab);

  const rows = notifications.filter(n =>
    n.eventId === eventId
    && !n.cleared
    && (n.forRole === 'both' || n.forRole === role)
    && (!n.mentionFor || n.mentionFor === cu),
  );

  if (rows.length === 0) {
    return (
      <div style={{ padding: 30, textAlign: 'center', color: 'var(--text-faint)', fontSize: 13 }}>
        No notifications for this event.
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
      {rows.map(n => {
        const Icon = ICONS[n.kind] || Bell;
        const dot = priorityColor(n.pri);
        const urgent = !!n.deadlineLabel && (n.deadlineLabel.toLowerCase().includes('day') || n.deadlineLabel === 'Today');
        return (
          <div
            key={n.id}
            onClick={() => { actionNotif(n.id); setEventTab(n.targetTab); }}
            style={{
              display: 'flex', alignItems: 'center', gap: 12, padding: '13px 15px', borderRadius: 10,
              background: 'var(--panel-2)', border: '1px solid var(--border)',
              opacity: n.actioned ? 0.4 : 1, cursor: 'pointer',
            }}
          >
            <span
              style={{
                width: 7, height: 7, borderRadius: '50%', background: dot, flex: '0 0 7px',
                ...(n.pri === 'top' && !n.actioned ? { animation: 'goldRipple 2.2s ease-out infinite, goldGlow 2.2s ease-in-out infinite' } : {}),
              }}
            />
            <span
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', width: 32, height: 32,
                borderRadius: 8, flex: '0 0 32px', background: 'var(--field)', color: dot,
              }}
            >
              <Icon size={17} />
            </span>
            <div style={{ flex: 1, fontSize: 14, fontWeight: 700 }}>{n.title}</div>
            {n.deadlineLabel && (
              <span style={{ color: urgent ? '#ED1C24' : 'var(--text-muted)', fontSize: 11, fontWeight: 700, whiteSpace: 'nowrap', flex: '0 0 auto' }}>
                {n.deadlineLabel}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}
