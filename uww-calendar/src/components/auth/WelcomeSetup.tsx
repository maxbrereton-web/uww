import type React from 'react';
import { useRef, useState } from 'react';
import { AtSign, Camera, Eye, EyeOff } from 'lucide-react';
import { useStore, currentUser } from '../../store';
import { defaultHandle } from '../../data/mentions';

const condensed: React.CSSProperties = {
  fontStretch: '75%', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.02em',
};
const labelStyle: React.CSSProperties = {
  fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '.08em',
  fontWeight: 700, display: 'block', marginBottom: 7,
};
const inputStyle: React.CSSProperties = {
  width: '100%', padding: '13px 14px', background: 'var(--field)', color: 'var(--text)',
  border: '1px solid var(--border-strong)', borderRadius: 10, fontSize: 15, outline: 'none', fontFamily: 'inherit',
};

function cropSquare(file: File, cb: (dataUrl: string) => void) {
  const reader = new FileReader();
  reader.onload = () => {
    const img = new Image();
    img.onload = () => {
      const side = Math.min(img.width, img.height);
      const canvas = document.createElement('canvas');
      canvas.width = 256; canvas.height = 256;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      ctx.drawImage(img, (img.width - side) / 2, (img.height - side) / 2, side, side, 0, 0, 256, 256);
      cb(canvas.toDataURL('image/jpeg', 0.9));
    };
    img.src = reader.result as string;
  };
  reader.readAsDataURL(file);
}

export default function WelcomeSetup({ onDone }: { onDone: () => void }) {
  const cu = useStore(currentUser);
  const member = useStore(s => s.staff.find(m => m.id === cu));
  const usernameRaw = useStore(s => s.usernames[cu] || '');
  const setAuthPassword = useStore(s => s.setAuthPassword);
  const updateStaff = useStore(s => s.updateStaff);
  const setUsername = useStore(s => s.setUsername);

  const [name, setName] = useState(member?.name || '');
  const [tag, setTag] = useState(usernameRaw || (member ? defaultHandle(member.name) : ''));
  const [photo, setPhoto] = useState<string | undefined>(member?.photo);
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const save = async () => {
    if (busy) return;
    if (password.length < 6) { setError('Choose a password of at least 6 characters.'); return; }
    setBusy(true);
    setError('');
    const res = await setAuthPassword(password);
    setBusy(false);
    if (!res.ok) { setError(res.error || 'Could not set your password.'); return; }
    if (name.trim()) updateStaff(cu, { name: name.trim() });
    if (photo !== member?.photo) updateStaff(cu, { photo });
    if (tag.trim()) setUsername(cu, tag.trim().replace(/^@/, ''));
    onDone();
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'var(--bg)', zIndex: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, color: 'var(--text)' }}>
      <div className="uww-overlay" style={{ width: 400, maxWidth: '100%', background: 'var(--panel)', border: '1px solid var(--border-strong)', borderRadius: 18, boxShadow: 'var(--shadow)', padding: 30 }}>
        <div style={{ textAlign: 'center', marginBottom: 22 }}>
          <img src="/assets/uww-emblem.svg" alt="UWW" style={{ height: 46, width: 'auto', marginBottom: 12 }} />
          <div style={{ ...condensed, fontSize: 17, color: 'var(--accent)' }}>Welcome to UWW</div>
          <div style={{ fontSize: 13.5, color: 'var(--text-muted)', marginTop: 6, lineHeight: 1.5 }}>
            Set a password and finish your profile so you can sign in any time.
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 18 }}>
          <div
            onClick={() => fileRef.current?.click()}
            title="Add a photo"
            style={{ position: 'relative', width: 80, height: 80, borderRadius: '50%', cursor: 'pointer', border: '2px solid var(--border-strong)', background: photo ? `center/cover no-repeat url(${photo})` : 'var(--control)' }}
          >
            <div style={{ position: 'absolute', right: -2, bottom: -2, width: 26, height: 26, borderRadius: '50%', background: 'var(--accent-deep)', border: '3px solid var(--panel)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
              <Camera size={12} />
            </div>
          </div>
          <input ref={fileRef} type="file" accept="image/*" onChange={e => { const f = e.target.files?.[0]; if (f) cropSquare(f, setPhoto); }} style={{ display: 'none' }} />
        </div>

        <div style={{ marginBottom: 14 }}>
          <label style={labelStyle}>Name</label>
          <input style={inputStyle} value={name} placeholder="Your name" onChange={e => setName(e.target.value)} />
        </div>

        <div style={{ marginBottom: 14 }}>
          <label style={labelStyle}>Tag (username)</label>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'var(--field)', border: '1px solid var(--border-strong)', borderRadius: 10, padding: '0 13px' }}>
            <AtSign size={16} color="var(--accent)" />
            <input value={tag} placeholder="yourtag" onChange={e => setTag(e.target.value.replace(/[^a-z0-9._]/gi, ''))} style={{ flex: 1, background: 'transparent', border: 'none', color: 'var(--text)', fontSize: 15, padding: '13px 0', outline: 'none', fontFamily: 'inherit' }} />
          </div>
        </div>

        <div style={{ marginBottom: 18 }}>
          <label style={labelStyle}>Choose a password</label>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'var(--field)', border: '1px solid var(--border-strong)', borderRadius: 10, padding: '0 13px' }}>
            <input
              type={showPw ? 'text' : 'password'}
              value={password}
              placeholder="Password"
              onChange={e => setPassword(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') save(); }}
              style={{ flex: 1, background: 'transparent', border: 'none', color: 'var(--text)', fontSize: 15, padding: '13px 0', outline: 'none', fontFamily: 'inherit' }}
            />
            <button type="button" onClick={() => setShowPw(v => !v)} aria-label="Toggle password" style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'inline-flex', padding: 4 }}>
              {showPw ? <EyeOff size={17} /> : <Eye size={17} />}
            </button>
          </div>
        </div>

        {error && <div style={{ color: '#ED1C24', fontSize: 13, marginBottom: 14, textAlign: 'center' }}>{error}</div>}

        <button
          onClick={save}
          disabled={busy}
          style={{ ...condensed, fontSize: 14, width: '100%', padding: '15px', cursor: busy ? 'default' : 'pointer', borderRadius: 11, border: 'none', background: 'var(--accent-deep)', color: '#fff', boxShadow: '0 6px 16px rgba(241,90,34,.32)', opacity: busy ? 0.7 : 1 }}
        >
          {busy ? 'Saving…' : 'Save & continue'}
        </button>
        <button onClick={onDone} style={{ ...condensed, fontSize: 11, width: '100%', padding: '12px 0 0', cursor: 'pointer', border: 'none', background: 'transparent', color: 'var(--text-muted)' }}>
          Do this later
        </button>
      </div>
    </div>
  );
}
