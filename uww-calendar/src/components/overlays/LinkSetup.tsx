import type React from 'react';
import { useEffect, useMemo, useState } from 'react';
import { X, Loader2 } from 'lucide-react';
import { useStore } from '../../store';

const condensed: React.CSSProperties = {
  fontStretch: '75%', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.02em',
};

function slugify(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

/** Work out the most likely official page for this link, based on the link's name. */
function resolveLink(eventName: string, itemName: string): { title: string; url: string; source: string } {
  const slug = slugify(eventName);
  const n = itemName.toLowerCase();
  if (n.includes('photo')) {
    return { title: `${eventName} — Official Photo Gallery`, url: `https://photo.uww.org/galleries/${slug}`, source: 'photo.uww.org' };
  }
  if (n.includes('arena') || n.includes('bracket') || n.includes('result') || n.includes('draw')) {
    return { title: `${eventName} — Brackets & Results`, url: `https://uww.org/event/${slug}/brackets`, source: 'uww.org' };
  }
  return { title: `${eventName} — ${itemName}`, url: `https://uww.org/event/${slug}`, source: 'uww.org' };
}

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '11px 13px', background: 'var(--field)', color: 'var(--text)',
  border: '1px solid var(--border-strong)', borderRadius: 9, fontSize: 14, outline: 'none', fontFamily: 'inherit',
};

export default function LinkSetup() {
  const item = useStore(s => s.linkSetupItem);
  const eventId = useStore(s => s.selectedEventId);
  const ev = useStore(s => s.events.find(e => e.id === eventId) || s.archivedEvents.find(e => e.id === eventId));
  const saveLink = useStore(s => s.saveLink);
  const close = useStore(s => s.closeLinkSetup);

  const eventName = ev?.name || '';
  const result = useMemo(() => resolveLink(eventName, item?.name || ''), [eventName, item?.name]);

  const [phase, setPhase] = useState<'searching' | 'found' | 'manual'>('searching');
  const [manualUrl, setManualUrl] = useState('');
  const [searchKey, setSearchKey] = useState(0);

  // Auto-run the "search" whenever the overlay opens or "Search again" is pressed.
  useEffect(() => {
    const t = setTimeout(() => setPhase('found'), 1300);
    return () => clearTimeout(t);
  }, [item?.id, searchKey]);

  const runSearch = () => { setPhase('searching'); setSearchKey(k => k + 1); };

  if (!item || !eventId || !ev) return null;

  const prettySource = result.source.replace('uww.org', 'UWW.org');

  return (
    <div
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.5)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}
      onClick={close}
    >
      <div
        className="uww-overlay"
        style={{ width: 440, maxWidth: '100%', background: 'var(--panel)', border: '1px solid var(--border-strong)', borderRadius: 16, boxShadow: 'var(--shadow)', padding: 26 }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 18 }}>
          <div>
            <div style={{ ...condensed, fontSize: 18, color: 'var(--text)' }}>Set {item.name} Link</div>
            <div style={{ fontSize: 13.5, color: 'var(--text-muted)', marginTop: 4 }}>{eventName}</div>
          </div>
          <button onClick={close} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 4 }} aria-label="Close">
            <X size={20} />
          </button>
        </div>

        {phase === 'searching' && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14, padding: '28px 0 22px' }}>
            <Loader2 className="uww-spin" size={36} color="var(--accent)" />
            <div style={{ ...condensed, fontSize: 15, color: 'var(--text)' }}>Searching {prettySource}…</div>
            <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>Looking for “{eventName}”</div>
          </div>
        )}

        {phase === 'found' && (
          <div>
            <div style={{ ...condensed, fontSize: 12, color: '#22C55E', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
              ✓ Match found
            </div>
            <div style={{ border: '1px solid var(--border-strong)', borderRadius: 12, padding: 16, marginBottom: 16, background: 'var(--panel-2)' }}>
              <div style={{ fontSize: 15, fontWeight: 800, color: 'var(--text)', lineHeight: 1.35, marginBottom: 8 }}>{result.title}</div>
              <a href={result.url} target="_blank" rel="noreferrer" style={{ fontSize: 13.5, color: 'var(--accent)', wordBreak: 'break-all', lineHeight: 1.4 }}>{result.url}</a>
              <div style={{ ...condensed, fontSize: 10.5, color: 'var(--text-faint)', marginTop: 10 }}>Source · {result.source.toUpperCase()}</div>
            </div>
            <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 16 }}>Is this the right page? Confirm to attach it.</div>
            <div style={{ display: 'flex', gap: 12 }}>
              <button
                onClick={runSearch}
                style={{ ...condensed, fontSize: 12, padding: '13px 18px', cursor: 'pointer', borderRadius: 11, border: '1px solid var(--border-strong)', background: 'var(--control)', color: 'var(--text)', flex: '0 0 auto' }}
              >
                Search again
              </button>
              <button
                onClick={() => saveLink(eventId, item.id, result.url)}
                style={{ ...condensed, fontSize: 13, padding: '13px 18px', cursor: 'pointer', borderRadius: 11, border: 'none', background: 'var(--accent-deep)', color: '#fff', flex: 1, boxShadow: '0 6px 16px rgba(241,90,34,.32)' }}
              >
                Confirm Link
              </button>
            </div>
            <button
              onClick={() => { setManualUrl(result.url); setPhase('manual'); }}
              style={{ ...condensed, fontSize: 10.5, width: '100%', padding: '12px 0 0', cursor: 'pointer', border: 'none', background: 'transparent', color: 'var(--text-muted)' }}
            >
              Or paste a link manually
            </button>
          </div>
        )}

        {phase === 'manual' && (
          <div>
            <label style={{ ...condensed, fontSize: 11, color: 'var(--text-muted)', display: 'block', marginBottom: 8 }}>Link URL</label>
            <input
              style={{ ...inputStyle, marginBottom: 16 }}
              value={manualUrl}
              placeholder="https://…"
              autoFocus
              onChange={e => setManualUrl(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && manualUrl.trim()) saveLink(eventId, item.id, manualUrl.trim()); }}
            />
            <div style={{ display: 'flex', gap: 12 }}>
              <button
                onClick={runSearch}
                style={{ ...condensed, fontSize: 12, padding: '13px 18px', cursor: 'pointer', borderRadius: 11, border: '1px solid var(--border-strong)', background: 'var(--control)', color: 'var(--text)', flex: '0 0 auto' }}
              >
                Back
              </button>
              <button
                disabled={!manualUrl.trim()}
                onClick={() => manualUrl.trim() && saveLink(eventId, item.id, manualUrl.trim())}
                style={{ ...condensed, fontSize: 13, padding: '13px 18px', cursor: manualUrl.trim() ? 'pointer' : 'not-allowed', borderRadius: 11, border: 'none', background: 'var(--accent-deep)', color: '#fff', flex: 1, opacity: manualUrl.trim() ? 1 : 0.5 }}
              >
                Confirm Link
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
