import type React from 'react';
import { useEffect, useState } from 'react';
import { X, Loader2 } from 'lucide-react';
import { useStore } from '../../store';
import type { Priority } from '../../types';
import { IMPORT_EVENTS } from '../../data/seed';
import { formatDate } from '../../data/utils';

const condensed: React.CSSProperties = {
  fontStretch: '75%', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.02em',
};

const PRIORITIES: Priority[] = ['low', 'mid', 'top'];

export default function ImportOverlay() {
  const [loading, setLoading] = useState(true);
  const events = useStore(s => s.events);
  const archivedEvents = useStore(s => s.archivedEvents);
  const importDeleted = useStore(s => s.importDeleted);
  const importPriorities = useStore(s => s.importPriorities);
  const setImportPriority = useStore(s => s.setImportPriority);
  const deleteImportEvent = useStore(s => s.deleteImportEvent);
  const confirmImport = useStore(s => s.confirmImport);
  const close = useStore(s => s.closeImport);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 900);
    return () => clearTimeout(t);
  }, []);

  const existing = new Set([...events, ...archivedEvents].map(e => e.name));
  const visible = IMPORT_EVENTS.filter(
    e => !existing.has(e.name) && !importDeleted.includes(e.id),
  );

  const priBtn = (active: boolean): React.CSSProperties => ({
    ...condensed, fontSize: 10, padding: '4px 8px', cursor: 'pointer', borderRadius: 6,
    border: '1px solid var(--border)',
    background: active ? 'var(--accent)' : 'var(--control)',
    color: active ? '#fff' : 'var(--text-muted)',
  });

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
          width: 540, maxWidth: '100%', maxHeight: '88vh', display: 'flex', flexDirection: 'column',
          background: 'var(--panel)', border: '1px solid var(--border-strong)',
          borderRadius: 14, boxShadow: 'var(--shadow)',
        }}
        onClick={e => e.stopPropagation()}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 22px', borderBottom: '1px solid var(--border)' }}>
          <div style={{ ...condensed, fontSize: 16, color: 'var(--text)' }}>Import from UWW.org</div>
          <button onClick={close} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 4 }} aria-label="Close">
            <X size={18} />
          </button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: 16 }}>
          {loading ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, padding: '48px 0', color: 'var(--text-muted)' }}>
              <Loader2 className="uww-spin" size={28} />
              <div style={{ ...condensed, fontSize: 12 }}>Loading events…</div>
            </div>
          ) : visible.length === 0 ? (
            <div style={{ ...condensed, fontSize: 12, color: 'var(--text-muted)', textAlign: 'center', padding: '40px 0' }}>
              No new events to import.
            </div>
          ) : (
            visible.map(ev => {
              const pri = importPriorities[ev.id] || ev.priority;
              return (
                <div
                  key={ev.id}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 12, padding: '12px 12px',
                    background: 'var(--cell)', border: '1px solid var(--border)', borderRadius: 10, marginBottom: 8,
                  }}
                >
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {ev.name}
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--text-faint)', marginTop: 2 }}>
                      {formatDate(ev.start)}{ev.end ? `–${formatDate(ev.end)}` : ''}
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 4 }}>
                    {PRIORITIES.map(p => (
                      <button key={p} style={priBtn(pri === p)} onClick={() => setImportPriority(ev.id, p)}>
                        {p}
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={() => deleteImportEvent(ev.id)}
                    aria-label="Remove"
                    style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 4, display: 'flex' }}
                  >
                    <X size={16} />
                  </button>
                </div>
              );
            })
          )}
        </div>

        <div style={{ padding: '14px 22px', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'flex-end' }}>
          <button
            onClick={confirmImport}
            disabled={loading || visible.length === 0}
            style={{
              ...condensed, fontSize: 12, padding: '10px 20px', borderRadius: 8, border: 'none',
              background: !loading && visible.length > 0 ? 'var(--accent)' : 'var(--control)',
              color: !loading && visible.length > 0 ? '#fff' : 'var(--text-faint)',
              cursor: !loading && visible.length > 0 ? 'pointer' : 'not-allowed',
            }}
          >
            Add {visible.length} events
          </button>
        </div>
      </div>
    </div>
  );
}
