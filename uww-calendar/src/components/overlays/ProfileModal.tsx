import type React from 'react';
import { useRef } from 'react';
import { X, Camera, AtSign } from 'lucide-react';
import { useStore, currentUser } from '../../store';

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
  const fileRef = useRef<HTMLInputElement>(null);

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

  const changeEmail = () => {
    const next = window.prompt('Update your login email', member.email);
    if (next) updateStaff(cu, { email: next });
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
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--field)', border: '1px solid var(--border-strong)', borderRadius: 9, padding: '13px' }}>
            <span style={{ fontSize: 14, color: 'var(--text)' }}>{member.email}</span>
            <button onClick={changeEmail} style={{ ...condensed, fontSize: 11, color: 'var(--text-muted)', background: 'transparent', border: 'none', cursor: 'pointer' }}>Change ›</button>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--field)', border: '1px solid var(--border-strong)', borderRadius: 9, padding: '13px' }}>
            <span style={{ fontSize: 14, color: 'var(--text)', letterSpacing: '.15em' }}>••••••••••••</span>
            <button onClick={() => window.prompt('Set a new password')} style={{ ...condensed, fontSize: 11, color: 'var(--text-muted)', background: 'transparent', border: 'none', cursor: 'pointer' }}>Change ›</button>
          </div>
        </div>

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
