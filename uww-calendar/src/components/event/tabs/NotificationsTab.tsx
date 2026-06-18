import type React from 'react';
import { useStore, ROLE_USER } from '../../../store';
import PriorityDot from '../../common/PriorityDot';

const condensed: React.CSSProperties = {
  fontStretch: '75%',
  fontWeight: 800,
  textTransform: 'uppercase',
  letterSpacing: '.02em',
};

export default function NotificationsTab({ eventId }: { eventId: string }) {
  const notifs = useStore(s => s.notifications.filter(n =>
    n.eventId === eventId && !n.cleared && (
      n.forRole === 'both'
      || (s.role === 'admin' ? n.forRole === 'admin' : n.forRole === 'staff')
      || n.mentionFor === ROLE_USER[s.role]
    )
  ));
  const actionNotif = useStore(s => s.actionNotif);
  const setEventTab = useStore(s => s.setEventTab);
  const clearNotif = useStore(s => s.clearNotif);
  const clearAllNotifs = useStore(s => s.clearAllNotifs);

  if (notifs.length === 0) {
    return (
      <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '40px 0', ...condensed, fontSize: 13 }}>
        You're all caught up.
      </div>
    );
  }

  const allActioned = notifs.every(n => n.actioned);

  return (
    <div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {notifs.map(n => (
          <div
            key={n.id}
            style={{
              display: 'flex', alignItems: 'center', gap: 10,
              background: 'var(--panel)', border: '1px solid var(--border)', borderRadius: 10,
              padding: '12px 14px', opacity: n.actioned ? 0.45 : 1,
              cursor: 'pointer',
            }}
            onClick={() => { actionNotif(n.id); setEventTab(n.targetTab); }}
          >
            <PriorityDot priority={n.pri} />
            <span style={{ fontSize: 13, color: 'var(--text)', flex: 1 }}>{n.title}</span>
            {n.deadlineLabel && (
              <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{n.deadlineLabel}</span>
            )}
            {n.actioned && (
              <button
                type="button"
                onClick={e => { e.stopPropagation(); clearNotif(n.id); }}
                style={{
                  ...condensed, fontSize: 11, border: '1px solid var(--border)', borderRadius: 6,
                  background: 'var(--control)', color: 'var(--text-muted)', padding: '4px 10px', cursor: 'pointer',
                }}
              >
                Clear
              </button>
            )}
          </div>
        ))}
      </div>

      {allActioned && (
        <div style={{ marginTop: 14 }}>
          <button
            type="button"
            onClick={() => clearAllNotifs()}
            style={{
              ...condensed, fontSize: 11, border: '1px solid var(--border)', borderRadius: 6,
              background: 'var(--control)', color: 'var(--text-muted)', padding: '6px 14px', cursor: 'pointer',
            }}
          >
            Clear all
          </button>
        </div>
      )}
    </div>
  );
}
