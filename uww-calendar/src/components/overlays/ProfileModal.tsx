import type React from 'react';
import { useRef, useState } from 'react';
import { X, Camera, AtSign, LogOut } from 'lucide-react';
import { useStore, currentUser, effectiveView } from '../../store';
import type { Role } from '../../types';

const condensed: React.CSSProperties = {
  fontStretch: '75%', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.02em',
};

const labelStyle: React.CSSProperties = {
  fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '.08em',
  fontWeight: 700, display: 'block', marginBottom: 7,
};

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '11px 13px', background: 'var(--field)', color: 'var(--text)',
  border: '1px solid var(--border-strong)', borderRadius: 9, fontSize: 14, outline: 'none', fontFamily: 'inherit',
};

function cropSquare(file: File, cb: (dataUrl: string) => void) {
  const reader = new FileReader();
  reader.onload = () => {
    const img = new Image();
    img.onload = () => {
      const side = Math.min(img.width, img.height);
      const sx = (img.width - side) / 2;
      const sy = (img.height - side) / 2;
      const size = 256;
      const canvas = document.createElement('canvas');
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      ctx.drawImage(img, sx, sy, side, side, 0, 0, size, size);
      cb(canvas.toDataURL('image/jpeg', 0.9));
    };
    img.src = reader.result as string;
  };
  reader.readAsDataURL(file);
}

export default function ProfileModal() {
  const cu = useStore(currentUser);
  const member = useStore(s => s.staff.find(m => m.id === cu));
  const usernameRaw = useStore(s => s.usernames[cu] || '');
  const instagram = useStore(s => s.instagram[cu] || '');
  const updateStaff = useStore(s => s.updateStaff);
  const setUsername = useStore(s => s.setUsername);
  const setInstagram = useStore(s => s.setInstagram);
  const openTutorial = useStore(s => s.openTutorial);
  const close = useStore(s => s.closeProfile);
  const isMobile = useStore(effectiveView) === 'mobile';
  const isSuperAdmin = useStore(s => s.isSuperAdmin);
  const role = useStore(s => s.role);
  const setRole = useStore(s => s.setRole);
  const theme = useStore(s => s.theme);
  const toggleTheme = useStore(s => s.toggleTheme);
  const logout = useStore(s => s.logout);
  const fileRef = useRef<HTMLInputElement>(null);

  const [editingEmail, setEditingEmail] = useState(false);
  const [editingPassword, setEditingPassword] = useState(false);
  const [password, setPassword] = useState('••••••••••••');

  if (!member) return null;

  const spaceIdx = member.name.indexOf(' ');
  const first = spaceIdx === -1 ? member.name : member.name.slice(0, spaceIdx);
  const last = spaceIdx === -1 ? '' : member.name.slice(spaceIdx + 1);
  const handle = usernameRaw || member.name.toLowerCase().replace(/[^a-z0-9]/g, '');

  const setName = (f: string, l: string) => updateStaff(cu, { name: `${f} ${l}`.trim() });

  const onFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) cropSquare(file, dataUrl => updateStaff(cu, { photo: dataUrl }));
  };

  const changeLink: React.CSSProperties = {
    ...condensed, fontSize: 11, color: 'var(--accent)', background: 'transparent', border: 'none', cursor: 'pointer', whiteSpace: 'nowrap', flex: '0 0 auto',
  };

  return (
    <div
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.5)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}
      onClick={close}
    >
      <div
        className="uww-overlay"
        style={{
          width: 510, maxWidth: '100%', maxHeight: '92vh', overflowY: 'auto',
          background: 'var(--panel)', border: '1px solid var(--border-strong)',
          borderRadius: 16, boxShadow: 'var(--shadow)', padding: 28,
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 22 }}>
          <div style={{ ...condensed, fontSize: 19 }}>My Profile</div>
          <button onClick={close} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 4 }} aria-label="Close">
            <X size={20} />
          </button>
        </div>

        {/* Avatar + name */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 24 }}>
          <div
            onClick={() => fileRef.current?.click()}
            style={{
              position: 'relative', width: 96, height: 96, borderRadius: '50%', cursor: 'pointer',
              border: '2px solid var(--border-strong)',
              background: member.photo ? `center/cover no-repeat url(${member.photo})` : 'var(--control)',
            }}
            title="Change photo"
          >
            <div style={{ position: 'absolute', right: -2, bottom: -2, width: 30, height: 30, borderRadius: '50%', background: 'var(--accent-deep)', border: '3px solid var(--panel)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
              <Camera size={14} />
            </div>
          </div>
          <input ref={fileRef} type="file" accept="image/*" onChange={onFile} style={{ display: 'none' }} />
          <div style={{ ...condensed, fontSize: 20, marginTop: 14 }}>{member.name}</div>
        </div>

        {/* First / Last */}
        <div style={{ display: 'flex', gap: 14, marginBottom: 16 }}>
          <div style={{ flex: 1 }}>
            <label style={labelStyle}>First Name</label>
            <input style={inputStyle} value={first} onChange={e => setName(e.target.value, last)} />
          </div>
          <div style={{ flex: 1 }}>
            <label style={labelStyle}>Last Name</label>
            <input style={inputStyle} value={last} onChange={e => setName(first, e.target.value)} />
          </div>
        </div>

        {/* Username */}
        <div style={{ marginBottom: 16 }}>
          <label style={labelStyle}>Username</label>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'var(--field)', border: '1px solid var(--border-strong)', borderRadius: 9, padding: '0 13px' }}>
            <AtSign size={16} color="var(--accent)" />
            <input
              value={handle}
              onChange={e => setUsername(cu, e.target.value.replace(/[^a-z0-9._]/gi, ''))}
              style={{ flex: 1, background: 'transparent', border: 'none', color: 'var(--text)', fontSize: 14, padding: '11px 0', outline: 'none', fontFamily: 'inherit' }}
            />
          </div>
        </div>

        {/* Instagram */}
        <div style={{ marginBottom: 16 }}>
          <label style={labelStyle}>Instagram Handle</label>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'var(--field)', border: '1px solid var(--border-strong)', borderRadius: 9, padding: '0 13px' }}>
            <AtSign size={16} color="var(--accent)" />
            <input
              value={instagram}
              placeholder="handle"
              onChange={e => setInstagram(cu, e.target.value.replace(/[^a-z0-9._]/gi, ''))}
              style={{ flex: 1, background: 'transparent', border: 'none', color: 'var(--text)', fontSize: 14, padding: '11px 0', outline: 'none', fontFamily: 'inherit' }}
            />
          </div>
        </div>

        {/* Login */}
        <label style={labelStyle}>Login</label>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 22 }}>
          {/* Email */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'var(--field)', border: '1px solid var(--border-strong)', borderRadius: 9, padding: '6px 13px' }}>
            {editingEmail ? (
              <input
                type="email"
                autoFocus
                value={member.email}
                onChange={e => updateStaff(cu, { email: e.target.value })}
                onKeyDown={e => { if (e.key === 'Enter') setEditingEmail(false); }}
                style={{ flex: 1, background: 'transparent', border: 'none', color: 'var(--text)', fontSize: 14, padding: '7px 0', outline: 'none', fontFamily: 'inherit' }}
              />
            ) : (
              <span style={{ flex: 1, fontSize: 14, color: 'var(--text)' }}>{member.email}</span>
            )}
            <button onClick={() => setEditingEmail(v => !v)} style={changeLink}>{editingEmail ? 'Done' : 'Change ›'}</button>
          </div>
          {/* Password */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'var(--field)', border: '1px solid var(--border-strong)', borderRadius: 9, padding: '6px 13px' }}>
            {editingPassword ? (
              <input
                type="text"
                autoFocus
                placeholder="New password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') setEditingPassword(false); }}
                style={{ flex: 1, background: 'transparent', border: 'none', color: 'var(--text)', fontSize: 14, padding: '7px 0', outline: 'none', fontFamily: 'inherit' }}
              />
            ) : (
              <span style={{ flex: 1, fontSize: 14, color: 'var(--text)', letterSpacing: '.15em' }}>••••••••••••</span>
            )}
            <button
              onClick={() => { if (!editingPassword) setPassword(''); setEditingPassword(v => !v); }}
              style={changeLink}
            >
              {editingPassword ? 'Done' : 'Change ›'}
            </button>
          </div>
        </div>

        {/* Role/theme/logout (mobile only — desktop has these in the sidebar) */}
        {isMobile && (
          <div style={{ marginBottom: 22 }}>
            {/* Role toggle: super-admin test account only */}
            {isSuperAdmin && (
              <>
                <label style={labelStyle}>Role</label>
                <div style={{ display: 'flex', background: 'var(--control)', borderRadius: 10, padding: 4, gap: 4, marginBottom: 12 }}>
                  {(['admin', 'staff', 'freelance'] as Role[]).map(r => {
                    const on = role === r;
                    return (
                      <button
                        key={r}
                        onClick={() => setRole(r)}
                        style={{
                          flex: 1, padding: '11px 0', borderRadius: 7, cursor: 'pointer', border: 'none',
                          background: on ? 'var(--accent-deep)' : 'transparent',
                          color: on ? '#fff' : 'var(--text-muted)',
                          ...condensed, fontSize: 13,
                        }}
                      >
                        {r === 'admin' ? 'Admin' : r === 'staff' ? 'Staff' : 'Freelance'}
                      </button>
                    );
                  })}
                </div>
              </>
            )}

            {/* Dark / light mode */}
            <button
              onClick={toggleTheme}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', background: 'var(--control)', border: 'none', borderRadius: 10, padding: '14px 16px', cursor: 'pointer', marginBottom: 12 }}
            >
              <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)' }}>
                {theme === 'dark' ? 'Dark mode' : 'Light mode'}
              </span>
              <span
                style={{
                  position: 'relative', width: 50, height: 28, borderRadius: 999, flex: '0 0 auto',
                  background: theme === 'light' ? 'var(--accent-deep)' : 'var(--field)',
                  border: '1px solid var(--border-strong)', transition: 'background .15s',
                }}
              >
                <span
                  style={{
                    position: 'absolute', top: 2, left: theme === 'light' ? 24 : 2,
                    width: 22, height: 22, borderRadius: '50%', background: '#fff', transition: 'left .15s',
                  }}
                />
              </span>
            </button>

            {/* Log out */}
            <button
              onClick={() => { close(); logout(); }}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, width: '100%', background: 'transparent', border: '1px solid var(--border-strong)', borderRadius: 10, padding: '13px 16px', cursor: 'pointer', ...condensed, fontSize: 12, color: 'var(--text-muted)' }}
            >
              <LogOut size={15} /> Log out
            </button>
          </div>
        )}

        {/* Watch Tutorial CTA */}
        <button
          onClick={() => { close(); openTutorial(); }}
          style={{ ...condensed, fontSize: 16, width: '100%', padding: '15px', cursor: 'pointer', borderRadius: 11, border: 'none', background: 'var(--accent-deep)', color: '#fff', boxShadow: '0 6px 16px rgba(241,90,34,.32)' }}
        >
          Watch Tutorial
        </button>
      </div>
    </div>
  );
}
