import type React from 'react';
import { useState } from 'react';
import { X, Loader2, Search, Link2 } from 'lucide-react';
import { useStore } from '../../store';

const condensed: React.CSSProperties = {
  fontStretch: '75%', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.02em',
};

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '9px 11px', background: 'var(--field)', color: 'var(--text)',
  border: '1px solid var(--border)', borderRadius: 8, fontSize: 13, outline: 'none',
};

export default function LinkSetup() {
  const item = useStore(s => s.linkSetupItem);
  const eventId = useStore(s => s.selectedEventId);
  const saveLink = useStore(s => s.saveLink);
  const close = useStore(s => s.closeLinkSetup);

  const [tab, setTab] = useState<'auto' | 'manual'>('auto');
  const [searching, setSearching] = useState(false);
  const [foundUrl, setFoundUrl] = useState('');
  const [manualUrl, setManualUrl] = useState('');

  if (!item || !eventId) return null;

  const slug = item.name.toLowerCase().replace(/\s+/g, '-');
  const mockUrl = `https://uww.org/events/${slug}`;

  const runSearch = () => {
    setSearching(true);
    setFoundUrl('');
    setTimeout(() => {
      setSearching(false);
      setFoundUrl(mockUrl);
    }, 1000);
  };

  const tabBtn = (active: boolean): React.CSSProperties => ({
    ...condensed, flex: 1, fontSize: 11, padding: '9px 6px', cursor: 'pointer',
    border: '1px solid var(--border)', borderRadius: 8,
    background: active ? 'var(--accent)' : 'var(--control)',
    color: active ? '#fff' : 'var(--text)',
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6,
  });

  const confirmBtn: React.CSSProperties = {
    ...condensed, fontSize: 12, padding: '9px 20px', cursor: 'pointer', borderRadius: 8,
    border: 'none', background: 'var(--accent)', color: '#fff',
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
          width: 440, maxWidth: '100%', background: 'var(--panel)', border: '1px solid var(--border-strong)',
          borderRadius: 14, boxShadow: 'var(--shadow)', padding: 22,
        }}
        onClick={e => e.stopPropagation()}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
          <div style={{ ...condensed, fontSize: 15, color: 'var(--text)' }}>Set Link — {item.name}</div>
          <button onClick={close} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 4 }} aria-label="Close">
            <X size={18} />
          </button>
        </div>

        <div style={{ display: 'flex', gap: 8, marginBottom: 18 }}>
          <button style={tabBtn(tab === 'auto')} onClick={() => setTab('auto')}><Search size={14} />Find automatically</button>
          <button style={tabBtn(tab === 'manual')} onClick={() => setTab('manual')}><Link2 size={14} />Paste manually</button>
        </div>

        {tab === 'auto' ? (
          <div>
            {!foundUrl && !searching && (
              <button
                onClick={runSearch}
                style={{ ...condensed, fontSize: 12, width: '100%', padding: '10px', cursor: 'pointer', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--control)', color: 'var(--text)' }}
              >
                Find event automatically
              </button>
            )}
            {searching && (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, padding: '20px 0', color: 'var(--text-muted)' }}>
                <Loader2 className="uww-spin" size={20} />
                <span style={{ ...condensed, fontSize: 12 }}>Searching UWW.org…</span>
              </div>
            )}
            {foundUrl && (
              <div>
                <label style={{ ...condensed, fontSize: 11, color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>Found URL</label>
                <input style={{ ...inputStyle, marginBottom: 16 }} value={foundUrl} readOnly />
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <button style={confirmBtn} onClick={() => saveLink(eventId, item.id, foundUrl)}>Confirm</button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div>
            <label style={{ ...condensed, fontSize: 11, color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>Link URL</label>
            <input
              style={{ ...inputStyle, marginBottom: 16 }}
              value={manualUrl}
              placeholder="https://…"
              onChange={e => setManualUrl(e.target.value)}
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button
                style={{ ...confirmBtn, opacity: manualUrl.trim() ? 1 : 0.5, cursor: manualUrl.trim() ? 'pointer' : 'not-allowed' }}
                disabled={!manualUrl.trim()}
                onClick={() => saveLink(eventId, item.id, manualUrl.trim())}
              >
                Confirm
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
