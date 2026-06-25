import type React from 'react';
import { Calendar, Users, Archive, FileText, MessageSquare, Sun, Moon } from 'lucide-react';
import { useStore, currentUser } from '../../store';
import type { Page, Role } from '../../types';
import Avatar from '../common/Avatar';

const condLabel: React.CSSProperties = {
  fontStretch: '75%',
  fontWeight: 800,
  textTransform: 'uppercase',
  letterSpacing: '.02em',
};

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

const ROLE_LABEL: Record<Role, string> = {
  admin: 'Admin',
  staff: 'Staff',
  freelance: 'Freelance',
};

export default function Sidebar() {
  const role = useStore(s => s.role);
  const page = useStore(s => s.page);
  const selectedEventId = useStore(s => s.selectedEventId);
  const viewMode = useStore(s => s.viewMode);
  const theme = useStore(s => s.theme);
  const cu = useStore(currentUser);
  const me = useStore(s => s.staff.find(m => m.id === cu));

  const setPage = useStore(s => s.setPage);
  const setViewMode = useStore(s => s.setViewMode);
  const setRole = useStore(s => s.setRole);
  const openProfile = useStore(s => s.openProfile);
  const toggleTheme = useStore(s => s.toggleTheme);

  const isAdminRole = role === 'admin';

  const navItems = NAV.filter(n => !n.adminOnly || isAdminRole);

  return (
    <div
      className="uww-sidebar"
      style={{
        width: 232,
        height: '100vh',
        position: 'sticky',
        top: 0,
        display: 'flex',
        flexDirection: 'column',
        background: 'var(--sidebar)',
        borderRight: '1px solid var(--border)',
        flexShrink: 0,
      }}
    >
      <div className="uww-sidebar-top">
        {/* Logo / wordmark */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: '18px 16px 14px',
          }}
        >
          <img src="/assets/uww-emblem.svg" alt="UWW" style={{ height: 34, width: 'auto', flex: '0 0 auto' }} />
          <div style={{ ...condLabel, color: 'var(--accent)', fontSize: 11, lineHeight: 1.15 }}>
            <div>United World</div>
            <div>Wrestling</div>
          </div>
        </div>

        {/* Nav */}
        <div className="uww-nav" style={{ display: 'flex', flexDirection: 'column', gap: 4, padding: '4px 10px' }}>
          {navItems.map(item => {
            const Icon = item.icon;
            const active = page === item.page && !selectedEventId;
            return (
              <button
                key={item.page}
                className="uww-nav-item"
                data-tut={`nav-${item.page}`}
                onClick={() => setPage(item.page)}
                style={{
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '10px 14px',
                  borderRadius: 8,
                  cursor: 'pointer',
                  background: active ? 'var(--control)' : 'transparent',
                  color: active ? 'var(--text)' : 'var(--text-muted)',
                  ...condLabel,
                  fontSize: 12,
                  textAlign: 'left',
                  width: '100%',
                }}
              >
                {active && (
                  <span
                    className="uww-nav-accent"
                    style={{
                      position: 'absolute',
                      left: 0,
                      top: 0,
                      bottom: 0,
                      width: 3,
                      background: 'var(--accent)',
                      borderRadius: '0 3px 3px 0',
                    }}
                  />
                )}
                <Icon size={17} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Bottom controls */}
      <div
        className="uww-sidebar-bottom-controls"
        style={{
          marginTop: 'auto',
          padding: 14,
          borderTop: '1px solid var(--border)',
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
        }}
      >
        {/* Web / Mobile segmented toggle */}
        <div
          style={{
            display: 'flex',
            background: 'var(--control)',
            borderRadius: 8,
            padding: 3,
            gap: 3,
          }}
        >
          {(['web', 'mobile'] as const).map(m => {
            const on = viewMode === m;
            return (
              <button
                key={m}
                onClick={() => setViewMode(m)}
                style={{
                  flex: 1,
                  padding: '6px 0',
                  borderRadius: 6,
                  cursor: 'pointer',
                  background: on ? 'var(--accent)' : 'transparent',
                  color: on ? '#fff' : 'var(--text-muted)',
                  ...condLabel,
                  fontSize: 11,
                }}
              >
                {m === 'web' ? 'Web' : 'Mobile'}
              </button>
            );
          })}
        </div>

        {/* Admin / Staff / Freelance segmented toggle */}
        <div
          style={{
            display: 'flex',
            background: 'var(--control)',
            borderRadius: 8,
            padding: 3,
            gap: 3,
          }}
        >
          {(['admin', 'staff', 'freelance'] as const).map(r => {
            const on = role === r;
            return (
              <button
                key={r}
                onClick={() => setRole(r)}
                style={{
                  flex: 1,
                  padding: '6px 0',
                  borderRadius: 6,
                  cursor: 'pointer',
                  background: on ? 'var(--control-hover)' : 'transparent',
                  color: on ? 'var(--text)' : 'var(--text-muted)',
                  ...condLabel,
                  fontSize: 10,
                }}
              >
                {ROLE_LABEL[r]}
              </button>
            );
          })}
        </div>

        {/* User profile row */}
        <button
          onClick={openProfile}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: '8px 6px',
            borderRadius: 8,
            cursor: 'pointer',
            background: 'transparent',
            textAlign: 'left',
            width: '100%',
          }}
        >
          <Avatar staffId={cu} size={32} />
          <div style={{ minWidth: 0, flex: 1 }}>
            <div
              style={{
                ...condLabel,
                fontSize: 12,
                color: 'var(--text)',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {me?.name || cu}
            </div>
            <div style={{ ...condLabel, fontSize: 10, color: 'var(--text-muted)' }}>{ROLE_LABEL[role]}</div>
          </div>
        </button>

        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '8px 12px',
            borderRadius: 8,
            cursor: 'pointer',
            background: 'var(--control)',
            width: '100%',
          }}
        >
          <span style={{ ...condLabel, fontSize: 11, color: 'var(--text-muted)' }}>Theme</span>
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              width: 52,
              height: 22,
              borderRadius: 999,
              background: 'var(--field)',
              border: '1px solid var(--border)',
              padding: '0 4px',
              justifyContent: theme === 'dark' ? 'flex-start' : 'flex-end',
            }}
          >
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 16,
                height: 16,
                borderRadius: '50%',
                background: 'var(--accent)',
                color: '#fff',
              }}
            >
              {theme === 'dark' ? <Moon size={10} /> : <Sun size={10} />}
            </span>
          </span>
        </button>
      </div>
    </div>
  );
}
