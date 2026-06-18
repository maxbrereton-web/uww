import type React from 'react';
import { ChevronLeft, Bell } from 'lucide-react';
import { useStore, roleNotifs } from '../../store';
import NotificationsDropdown from '../overlays/NotificationsDropdown';

const condLabel: React.CSSProperties = {
  fontStretch: '75%',
  fontWeight: 800,
  textTransform: 'uppercase',
  letterSpacing: '.02em',
};

export default function TopBar() {
  const selectedEventId = useStore(s => s.selectedEventId);
  const showNotifications = useStore(s => s.showNotifications);
  const notifCount = useStore(s => roleNotifs(s).filter(n => !n.actioned).length);
  const selectEvent = useStore(s => s.selectEvent);
  const toggleNotifications = useStore(s => s.toggleNotifications);

  return (
    <div
      style={{
        height: 64,
        background: 'var(--topbar)',
        borderBottom: '1px solid var(--border)',
        display: 'flex',
        alignItems: 'center',
        padding: '0 18px',
        position: 'relative',
        flexShrink: 0,
      }}
    >
      {/* Left */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', zIndex: 1 }}>
        {selectedEventId && (
          <button
            onClick={() => selectEvent(null)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              padding: '8px 12px',
              borderRadius: 8,
              cursor: 'pointer',
              background: 'var(--control)',
              color: 'var(--text)',
              ...condLabel,
              fontSize: 12,
            }}
          >
            <ChevronLeft size={16} />
            <span>Calendar</span>
          </button>
        )}
      </div>

      {/* Center title (absolutely centered) */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          textAlign: 'center',
          pointerEvents: 'none',
          ...condLabel,
          fontSize: 16,
          color: 'var(--text)',
        }}
      >
        UWW Event Calendar
      </div>

      {/* Right */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', zIndex: 1 }}>
        <button
          onClick={toggleNotifications}
          title="Notifications"
          style={{
            position: 'relative',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 38,
            height: 38,
            borderRadius: 8,
            cursor: 'pointer',
            background: 'var(--control)',
            color: 'var(--text)',
          }}
        >
          <Bell size={18} />
          <span
            style={{
              position: 'absolute',
              top: -4,
              right: -4,
              minWidth: 18,
              height: 18,
              padding: '0 5px',
              borderRadius: 999,
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 10,
              fontWeight: 800,
              fontStretch: '75%',
              background: notifCount > 0 ? '#ef4444' : 'var(--control-hover)',
              color: notifCount > 0 ? '#fff' : 'var(--text-muted)',
              border: '1.5px solid var(--topbar)',
            }}
          >
            {notifCount}
          </span>
        </button>
      </div>

      {showNotifications && <NotificationsDropdown />}
    </div>
  );
}
