import type React from 'react';
import { useRef, useState } from 'react';
import { AtSign, Camera, Eye, EyeOff } from 'lucide-react';
import { useStore } from '../../store';

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
      const sx = (img.width - side) / 2;
      const sy = (img.height - side) / 2;
      const canvas = document.createElement('canvas');
      canvas.width = 256; canvas.height = 256;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      ctx.drawImage(img, sx, sy, side, side, 0, 0, 256, 256);
      cb(canvas.toDataURL('image/jpeg', 0.9));
    };
    img.src = reader.result as string;
  };
  reader.readAsDataURL(file);
}

export default function LoginScreen() {
  const login = useStore(s => s.login);
  const completeInvite = useStore(s => s.completeInvite);
  const staff = useStore(s => s.staff);

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  // When an invited user logs in, we switch to the account-setup form.
  const [setupId, setSetupId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [photo, setPhoto] = useState<string | undefined>(undefined);
  const fileRef = useRef<HTMLInputElement>(null);

  const setupMember = setupId ? staff.find(m => m.id === setupId) : undefined;

  const submitLogin = async () => {
    if (busy) return;
    setError('');
    setBusy(true);
    const res = await login(identifier, password);
    setBusy(false);
    if (res.ok) return;
    if (res.needsSetup) {
      const m = staff.find(x => x.id === res.needsSetup);
      setSetupId(res.needsSetup);
      setName(m?.name || '');
      setUsername('');
      setPhoto(m?.photo);
      setPassword('');
      return;
    }
    setError(res.error || 'Could not sign in.');
  };

  const submitSetup = () => {
    if (!setupId) return;
    if (!password.trim()) { setError('Choose a password.'); return; }
    completeInvite(setupId, { name, username, password, photo });
  };

  const onFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) cropSquare(file, setPhoto);
  };

  return (
    <div style={{ minHeight: '100vh', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, background: 'var(--bg)', color: 'var(--text)' }}>
      <div
        className="uww-overlay"
        style={{ width: 400, maxWidth: '100%', background: 'var(--panel)', border: '1px solid var(--border-strong)', borderRadius: 18, boxShadow: 'var(--shadow)', padding: 30 }}
      >
        {/* Brand */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 26 }}>
          <img src="/assets/uww-emblem.svg" alt="UWW" style={{ height: 52, width: 'auto', marginBottom: 12 }} />
          <div style={{ ...condensed, fontSize: 18, color: 'var(--accent)', textAlign: 'center', lineHeight: 1.2 }}>
            UWW Event Calendar
          </div>
        </div>

        {setupId ? (
          /* ---------- Invited user: set up account ---------- */
          <>
            <div style={{ fontSize: 13.5, color: 'var(--text-muted)', marginBottom: 20, textAlign: 'center', lineHeight: 1.5 }}>
              Welcome! You've been invited{setupMember?.email ? ` (${setupMember.email})` : ''}. Set up your account to get started.
            </div>

            {/* Photo */}
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 18 }}>
              <div
                onClick={() => fileRef.current?.click()}
                title="Add a photo"
                style={{ position: 'relative', width: 84, height: 84, borderRadius: '50%', cursor: 'pointer', border: '2px solid var(--border-strong)', background: photo ? `center/cover no-repeat url(${photo})` : 'var(--control)' }}
              >
                <div style={{ position: 'absolute', right: -2, bottom: -2, width: 28, height: 28, borderRadius: '50%', background: 'var(--accent-deep)', border: '3px solid var(--panel)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                  <Camera size={13} />
                </div>
              </div>
              <input ref={fileRef} type="file" accept="image/*" onChange={onFile} style={{ display: 'none' }} />
            </div>

            <div style={{ marginBottom: 14 }}>
              <label style={labelStyle}>Name</label>
              <input style={inputStyle} value={name} placeholder="Your name" onChange={e => setName(e.target.value)} />
            </div>

            <div style={{ marginBottom: 14 }}>
              <label style={labelStyle}>Tag (username)</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'var(--field)', border: '1px solid var(--border-strong)', borderRadius: 10, padding: '0 13px' }}>
                <AtSign size={16} color="var(--accent)" />
                <input
                  value={username}
                  placeholder="yourtag"
                  onChange={e => setUsername(e.target.value.replace(/[^a-z0-9._]/gi, ''))}
                  style={{ flex: 1, background: 'transparent', border: 'none', color: 'var(--text)', fontSize: 15, padding: '13px 0', outline: 'none', fontFamily: 'inherit' }}
                />
              </div>
            </div>

            <div style={{ marginBottom: 18 }}>
              <label style={labelStyle}>Password</label>
              <PasswordField value={password} onChange={setPassword} show={showPw} toggle={() => setShowPw(v => !v)} onEnter={submitSetup} />
            </div>

            {error && <div style={{ color: '#ED1C24', fontSize: 13, marginBottom: 14, textAlign: 'center' }}>{error}</div>}

            <button onClick={submitSetup} style={primaryBtn}>Create account</button>
            <button onClick={() => { setSetupId(null); setError(''); setPassword(''); }} style={linkBtn}>Back to sign in</button>
          </>
        ) : (
          /* ---------- Sign in ---------- */
          <>
            <div style={{ marginBottom: 14 }}>
              <label style={labelStyle}>Email or username</label>
              <input
                style={inputStyle}
                value={identifier}
                placeholder="you@email.com  or  @yourtag"
                autoFocus
                onChange={e => setIdentifier(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') submitLogin(); }}
              />
            </div>

            <div style={{ marginBottom: 20 }}>
              <label style={labelStyle}>Password</label>
              <PasswordField value={password} onChange={setPassword} show={showPw} toggle={() => setShowPw(v => !v)} onEnter={submitLogin} />
            </div>

            {error && <div style={{ color: '#ED1C24', fontSize: 13, marginBottom: 14, textAlign: 'center' }}>{error}</div>}

            <button onClick={submitLogin} disabled={busy} style={{ ...primaryBtn, opacity: busy ? 0.7 : 1, cursor: busy ? 'default' : 'pointer' }}>
              {busy ? 'Signing in…' : 'Log in'}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

const primaryBtn: React.CSSProperties = {
  ...condensed, fontSize: 14, width: '100%', padding: '15px', cursor: 'pointer', borderRadius: 11,
  border: 'none', background: 'var(--accent-deep)', color: '#fff', boxShadow: '0 6px 16px rgba(241,90,34,.32)',
};

const linkBtn: React.CSSProperties = {
  ...condensed, fontSize: 11, width: '100%', padding: '12px 0 0', cursor: 'pointer',
  border: 'none', background: 'transparent', color: 'var(--text-muted)',
};

function PasswordField({ value, onChange, show, toggle, onEnter }: {
  value: string; onChange: (v: string) => void; show: boolean; toggle: () => void; onEnter: () => void;
}) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'var(--field)', border: '1px solid var(--border-strong)', borderRadius: 10, padding: '0 13px' }}>
      <input
        type={show ? 'text' : 'password'}
        value={value}
        placeholder="Password"
        onChange={e => onChange(e.target.value)}
        onKeyDown={e => { if (e.key === 'Enter') onEnter(); }}
        style={{ flex: 1, background: 'transparent', border: 'none', color: 'var(--text)', fontSize: 15, padding: '13px 0', outline: 'none', fontFamily: 'inherit' }}
      />
      <button type="button" onClick={toggle} aria-label="Toggle password" style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'inline-flex', padding: 4 }}>
        {show ? <EyeOff size={17} /> : <Eye size={17} />}
      </button>
    </div>
  );
}
