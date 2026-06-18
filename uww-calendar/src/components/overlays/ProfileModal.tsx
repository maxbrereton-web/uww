import type React from 'react';
import { useRef } from 'react';
import { X, Camera, Moon, Sun, PlayCircle } from 'lucide-react';
import { useStore, currentUser } from '../../store';

const condensed: React.CSSProperties = {
  fontStretch: '75%', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.02em',
};

const labelStyle: React.CSSProperties = {
  ...condensed, fontSize: 11, color: 'var(--text-muted)', display: 'block', marginBottom: 6,
};

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '9px 11px', background: 'var(--field)', color: 'var(--text)',
  border: '1px solid var(--border)', borderRadius: 8, fontSize: 13, outline: 'none',
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
  const username = useStore(s => s.usernames[cu] || '');
  const instagram = useStore(s => s.instagram[cu] || '');
  const theme = useStore(s => s.theme);
  const updateStaff = useStore(s => s.updateStaff);
  const setUsername = useStore(s => s.setUsername);
  const setInstagram = useStore(s => s.setInstagram);
  const toggleTheme = useStore(s => s.toggleTheme);
  const openTutorial = useStore(s => s.openTutorial);
  const close = useStore(s => s.closeProfile);
  const fileRef = useRef<HTMLInputElement>(null);

  if (!member) return null;

  const spaceIdx = member.name.indexOf(' ');
  const first = spaceIdx === -1 ? member.name : member.name.slice(0, spaceIdx);
  const last = spaceIdx === -1 ? '' : member.name.slice(spaceIdx + 1);

  const setName = (f: string, l: string) => updateStaff(cu, { name: `${f} ${l}`.trim() });

  const onFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) cropSquare(file, dataUrl => updateStaff(cu, { photo: dataUrl }));
  };

  return (
    <div
      style={{
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,.5)', zIndex: 100,
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20,
      }}
      onClick={close}
    >
      <div
        className="uww-overlay"
        style={{
          width: 460, maxWidth: '100%', maxHeight: '90vh', overflowY: 'auto',
          background: 'var(--panel)', border: '1px solid var(--border-strong)',
          borderRadius: 14, boxShadow: 'var(--shadow)', padding: 22,
        }}
        onClick={e => e.stopPropagation()}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <div style={{ ...condensed, fontSize: 16, color: 'var(--text)' }}>Profile</div>
          <button onClick={close} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 4 }} aria-label="Close">
            <X size={18} />
          </button>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
          <div
            onClick={() => fileRef.current?.click()}
            style={{
              position: 'relative', width: 84, height: 84, borderRadius: '50%', cursor: 'pointer',
              border: '2px solid var(--border-strong)', overflow: 'hidden',
              background: member.photo ? `center/cover no-repeat url(${member.photo})` : 'var(--control)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
            title="Change photo"
          >
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,.35)', color: '#fff' }}>
              <Camera size={20} />
            </div>
          </div>
          <input ref={fileRef} type="file" accept="image/*" onChange={onFile} style={{ display: 'none' }} />
        </div>

        <div style={{ display: 'flex', gap: 12, marginBottom: 14 }}>
          <div style={{ flex: 1 }}>
            <label style={labelStyle}>First Name</label>
            <input style={inputStyle} value={first} onChange={e => setName(e.target.value, last)} />
          </div>
          <div style={{ flex: 1 }}>
            <label style={labelStyle}>Last Name</label>
            <input style={inputStyle} value={last} onChange={e => setName(first, e.target.value)} />
          </div>
        </div>

        <div style={{ marginBottom: 14 }}>
          <label style={labelStyle}>Username</label>
          <input style={inputStyle} value={username} placeholder="@handle" onChange={e => setUsername(cu, e.target.value)} />
        </div>

        <div style={{ marginBottom: 14 }}>
          <label style={labelStyle}>Instagram</label>
          <input style={inputStyle} value={instagram} placeholder="handle" onChange={e => setInstagram(cu, e.target.value)} />
        </div>

        <div style={{ display: 'flex', gap: 12, marginBottom: 14 }}>
          <div style={{ flex: 1 }}>
            <label style={labelStyle}>Email</label>
            <input style={{ ...inputStyle, opacity: 0.6 }} value={member.email} disabled />
          </div>
          <div style={{ flex: 1 }}>
            <label style={labelStyle}>Password</label>
            <input style={{ ...inputStyle, opacity: 0.6 }} value={'••••••••'} disabled />
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', marginBottom: 6 }}>
          <span style={{ ...condensed, fontSize: 12, color: 'var(--text)' }}>Theme</span>
          <button
            onClick={toggleTheme}
            style={{ ...condensed, fontSize: 11, padding: '7px 12px', cursor: 'pointer', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--control)', color: 'var(--text)', display: 'inline-flex', alignItems: 'center', gap: 6 }}
          >
            {theme === 'dark' ? <Moon size={14} /> : <Sun size={14} />}
            {theme}
          </button>
        </div>

        <button
          onClick={openTutorial}
          style={{ ...condensed, fontSize: 12, width: '100%', padding: '10px', cursor: 'pointer', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--control)', color: 'var(--text)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 18 }}
        >
          <PlayCircle size={16} />Watch Tutorial
        </button>

        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button
            onClick={close}
            style={{ ...condensed, fontSize: 12, padding: '9px 22px', cursor: 'pointer', borderRadius: 8, border: 'none', background: 'var(--accent)', color: '#fff' }}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
