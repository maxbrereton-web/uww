import type React from 'react';
import { useStore } from '../../store';

const condensed: React.CSSProperties = {
  fontStretch: '75%', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.02em',
};

const TYPE_OPTS: Array<{ v: string; label: string }> = [
  { v: 'all', label: 'All' },
  { v: 'wrestling', label: 'Wrestling' },
  { v: 'continental', label: 'Continental' },
  { v: 'rankingseries', label: 'Ranking Series' },
  { v: 'documentary', label: 'Documentary' },
  { v: 'devcamp', label: 'Dev Camp' },
];

const PRI_OPTS: Array<{ v: string; label: string }> = [
  { v: 'all', label: 'All' },
  { v: 'top', label: 'Top' },
  { v: 'mid', label: 'Mid' },
  { v: 'low', label: 'Low' },
];

export default function FilterPopup() {
  const filterType = useStore(s => s.filterType);
  const filterPriority = useStore(s => s.filterPriority);
  const setFilterType = useStore(s => s.setFilterType);
  const setFilterPriority = useStore(s => s.setFilterPriority);
  const close = useStore(s => s.closeFilter);

  const btn = (active: boolean): React.CSSProperties => ({
    ...condensed, fontSize: 11, padding: '6px 11px', cursor: 'pointer', borderRadius: 7,
    border: '1px solid var(--border)',
    background: active ? 'var(--accent)' : 'var(--control)',
    color: active ? '#fff' : 'var(--text)',
  });

  return (
    <>
      <div style={{ position: 'fixed', inset: 0, background: 'transparent', zIndex: 89 }} onClick={close} />
      <div
        className="uww-overlay"
        style={{
          position: 'fixed', top: 110, right: 16, width: 280,
          background: 'var(--panel)', border: '1px solid var(--border-strong)', borderRadius: 12,
          boxShadow: 'var(--shadow)', zIndex: 90, padding: 16,
        }}
      >
        <div style={{ ...condensed, fontSize: 11, color: 'var(--text-muted)', marginBottom: 8 }}>Type</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 16 }}>
          {TYPE_OPTS.map(o => (
            <button key={o.v} style={btn(filterType === o.v)} onClick={() => setFilterType(o.v)}>{o.label}</button>
          ))}
        </div>

        <div style={{ ...condensed, fontSize: 11, color: 'var(--text-muted)', marginBottom: 8 }}>Priority</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 16 }}>
          {PRI_OPTS.map(o => (
            <button key={o.v} style={btn(filterPriority === o.v)} onClick={() => setFilterPriority(o.v)}>{o.label}</button>
          ))}
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10 }}>
          <button
            onClick={() => { setFilterType('all'); setFilterPriority('all'); }}
            style={{ ...condensed, fontSize: 11, padding: '8px 12px', cursor: 'pointer', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--control)', color: 'var(--text-muted)' }}
          >
            Clear filters
          </button>
          <button
            onClick={close}
            style={{ ...condensed, fontSize: 11, padding: '8px 16px', cursor: 'pointer', borderRadius: 8, border: 'none', background: 'var(--accent)', color: '#fff' }}
          >
            Close
          </button>
        </div>
      </div>
    </>
  );
}
