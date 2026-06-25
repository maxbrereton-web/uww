import type React from 'react';
import { Calendar, Users, Archive, FileText, MessageSquare } from 'lucide-react';
import { useStore } from '../../store';
import type { Page } from '../../types';

interface NavDef {
  page: Page;
  label: string;
  icon: React.ComponentType<{ size?: number }>;
  adminOnly?: boolean;
}

const NAV: NavDef[] = [
  { page: 'calendar', label: 'Calendar', icon: Calendar },
  { page: 'chat', label: 'Chat', icon: MessageSquare },
  { page: 'staff', label: 'Staff', icon: Users, adminOnly: true },
  { page: 'templates', label: 'Templates', icon: FileText, adminOnly: true },
  { page: 'archive', label: 'Archive', icon: Archive, adminOnly: true },
];

export default function MobileTabBar() {
  const role = useStore(s => s.role);
  const page = useStore(s => s.page);
  const selectedEventId = useStore(s => s.selectedEventId);
  const setPage = useStore(s => s.setPage);
  const selectEvent = useStore(s => s.selectEvent);

  const items = NAV.filter(n => !n.adminOnly || role === 'admin');

  return (
    <nav
      style={{
        position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)',
        width: '100%', maxWidth: 430, zIndex: 60,
        display: 'flex', justifyContent: 'space-around', alignItems: 'stretch',
        background: 'var(--sidebar)', borderTop: '1px solid var(--border)',
        padding: '6px 4px calc(env(safe-area-inset-bottom, 8px) + 4px)',
        boxShadow: '0 -6px 18px rgba(0,0,0,.35)',
      }}
    >
      {items.map(item => {
        const Icon = item.icon;
        const active = page === item.page && !selectedEventId;
        return (
          <button
            key={item.page}
            data-tut={`nav-${item.page}`}
            onClick={() => { selectEvent(null); setPage(item.page); }}
            style={{
              flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
              padding: '6px 2px', background: 'transparent', border: 'none', cursor: 'pointer',
              color: active ? 'var(--accent)' : 'var(--text-muted)',
            }}
          >
            <Icon size={21} />
            <span style={{ fontStretch: '75%', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.02em', fontSize: 10 }}>
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
