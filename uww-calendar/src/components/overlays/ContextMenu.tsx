import type React from 'react';
import { useStore } from '../../store';

const condensed: React.CSSProperties = {
  fontStretch: '75%', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.02em',
};

export default function ContextMenu() {
  const menu = useStore(s => s.contextMenu);
  const role = useStore(s => s.role);
  const openNewEvent = useStore(s => s.openNewEvent);
  const archiveEvent = useStore(s => s.archiveEvent);
  const removeEvent = useStore(s => s.removeEvent);
  const requestJoin = useStore(s => s.requestJoin);
  const close = useStore(s => s.closeContextMenu);

  if (!menu) return null;
  const isAdminUser = role === 'admin';

  const items: Array<{ label: string; onClick: () => void; danger?: boolean }> = [];
  if (menu.type === 'day' && isAdminUser) {
    items.push({ label: 'Start event from here', onClick: () => { openNewEvent(menu.date); close(); } });
  } else if (menu.type === 'event' && isAdminUser) {
    items.push({ label: 'Archive event', onClick: () => { if (menu.eventId) archiveEvent(menu.eventId); close(); } });
    items.push({ label: 'Delete event', danger: true, onClick: () => { if (menu.eventId) removeEvent(menu.eventId); close(); } });
  } else if (menu.type === 'event' && !isAdminUser) {
    items.push({ label: 'Request to join event', onClick: () => { if (menu.eventId) requestJoin(menu.eventId); close(); } });
  }

  if (items.length === 0) return null;

  const itemStyle = (danger?: boolean): React.CSSProperties => ({
    ...condensed, fontSize: 12, width: '100%', textAlign: 'left', padding: '10px 14px',
    cursor: 'pointer', border: 'none', background: 'transparent', color: danger ? '#ED1C24' : 'var(--text)',
  });

  return (
    <>
      <div style={{ position: 'fixed', inset: 0, background: 'transparent', zIndex: 94 }} onClick={close} />
      <div
        style={{
          position: 'fixed', left: menu.x, top: menu.y, minWidth: 180,
          background: 'var(--panel)', border: '1px solid var(--border-strong)', borderRadius: 8,
          boxShadow: 'var(--shadow)', zIndex: 95, overflow: 'hidden', padding: '4px 0',
        }}
      >
        {items.map((it, i) => (
          <button
            key={i}
            style={itemStyle(it.danger)}
            onClick={it.onClick}
            onMouseEnter={e => { e.currentTarget.style.background = 'var(--control-hover)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
          >
            {it.label}
          </button>
        ))}
      </div>
    </>
  );
}
