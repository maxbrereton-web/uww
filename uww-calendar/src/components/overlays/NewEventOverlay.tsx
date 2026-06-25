import type React from 'react';
import { X } from 'lucide-react';
import { useStore } from '../../store';
import type { EventType, Priority, NewEventForm } from '../../types';
import { EVENT_TYPES, AGE_RANGES, REGIONS } from '../../data/seed';
import { eventTypeLabel, compTypesFor, eventHasAge, compHasRegion } from '../../data/utils';

const condensed: React.CSSProperties = {
  fontStretch: '75%', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.02em',
};

const PRIORITIES: Priority[] = ['top', 'mid', 'low'];
const SWATCHES = ['#F58220', '#0089CF', '#9B5DE5', '#22C55E', '#E0A100', '#EF4444'];

const labelStyle: React.CSSProperties = {
  ...condensed, fontSize: 11, color: 'var(--text-muted)', display: 'block', marginBottom: 6,
};

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '9px 11px', background: 'var(--field)', color: 'var(--text)',
  border: '1px solid var(--border)', borderRadius: 8, fontSize: 13, outline: 'none',
};

export default function NewEventOverlay() {
  const form = useStore(s => s.newEventForm);
  const update = useStore(s => s.updateNewEventForm);
  const submit = useStore(s => s.submitNewEvent);
  const close = useStore(s => s.closeNewEvent);
  const openImport = useStore(s => s.openImport);

  const segBtn = (active: boolean): React.CSSProperties => ({
    ...condensed, flex: 1, padding: '8px 6px', fontSize: 11, cursor: 'pointer',
    border: '1px solid var(--border)', borderRadius: 7,
    background: active ? 'var(--accent)' : 'var(--control)',
    color: active ? '#fff' : 'var(--text)',
  });

  const onPickType = (et: EventType) => {
    update({ eventType: et, competitionType: '', ageRange: '', location: '' });
  };

  const onPickComp = (c: string) => {
    const patch: Partial<NewEventForm> = { competitionType: c };
    if (c === 'Ranking Series') patch.ageRange = 'Senior';
    if (!compHasRegion(c)) patch.location = '';
    update(patch);
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
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
          <div style={{ ...condensed, fontSize: 16, color: 'var(--text)' }}>New Event</div>
          <button
            onClick={close}
            style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 4 }}
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        <div style={{ marginBottom: 16 }}>
          <label style={labelStyle}>Event Name</label>
          <input
            style={inputStyle}
            value={form.name}
            placeholder="Event name"
            onChange={e => update({ name: e.target.value })}
          />
        </div>

        <div style={{ marginBottom: 16 }}>
          <label style={labelStyle}>Priority</label>
          <div style={{ display: 'flex', gap: 6 }}>
            {PRIORITIES.map(p => (
              <button key={p} style={segBtn(form.priority === p)} onClick={() => update({ priority: p })}>
                {p}
              </button>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: 16 }}>
          <label style={labelStyle}>Event Type</label>
          <select style={inputStyle} value={form.eventType} onChange={e => onPickType(e.target.value as EventType)}>
            {EVENT_TYPES.map(t => <option key={t} value={t}>{eventTypeLabel(t)}</option>)}
          </select>
        </div>

        {compTypesFor(form.eventType).length > 0 && (
          <div style={{ marginBottom: 16 }}>
            <label style={labelStyle}>Competition Type</label>
            <select style={{ ...inputStyle, color: form.competitionType ? 'var(--text)' : 'var(--text-muted)' }} value={form.competitionType} onChange={e => onPickComp(e.target.value)}>
              <option value="">Competition type…</option>
              {compTypesFor(form.eventType).map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        )}

        {compHasRegion(form.competitionType) && (
          <div style={{ marginBottom: 16 }}>
            <label style={labelStyle}>Region</label>
            <select style={{ ...inputStyle, color: form.location ? 'var(--text)' : 'var(--text-muted)' }} value={form.location} onChange={e => update({ location: e.target.value })}>
              <option value="">Region…</option>
              {REGIONS.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
        )}

        {eventHasAge(form.eventType) && (
          <div style={{ marginBottom: 16 }}>
            <label style={labelStyle}>Age Range</label>
            {form.competitionType === 'Ranking Series' ? (
              <select style={inputStyle} value="Senior" disabled>
                <option value="Senior">Senior (Ranking Series)</option>
              </select>
            ) : (
              <select style={{ ...inputStyle, color: form.ageRange ? 'var(--text)' : 'var(--text-muted)' }} value={form.ageRange} onChange={e => update({ ageRange: e.target.value })}>
                <option value="">Age range…</option>
                {AGE_RANGES.map(a => <option key={a} value={a}>{a}</option>)}
              </select>
            )}
          </div>
        )}

        <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
          <div style={{ flex: 1 }}>
            <label style={labelStyle}>Start Date</label>
            <input type="date" style={inputStyle} value={form.start} onChange={e => update({ start: e.target.value })} />
          </div>
          <div style={{ flex: 1 }}>
            <label style={labelStyle}>End Date</label>
            <input type="date" style={inputStyle} value={form.end} onChange={e => update({ end: e.target.value })} />
          </div>
        </div>

        <div style={{ marginBottom: 22 }}>
          <label style={labelStyle}>Bar Color</label>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            {SWATCHES.map(c => (
              <button
                key={c}
                onClick={() => update({ barColor: c })}
                aria-label={`Color ${c}`}
                style={{
                  width: 28, height: 28, borderRadius: '50%', background: c, cursor: 'pointer',
                  border: form.barColor === c ? '2px solid var(--text)' : '1px solid var(--border)',
                }}
              />
            ))}
            <input
              type="color"
              value={form.barColor || '#F58220'}
              onChange={e => update({ barColor: e.target.value })}
              style={{ width: 34, height: 30, padding: 0, border: '1px solid var(--border)', borderRadius: 7, background: 'var(--field)', cursor: 'pointer' }}
            />
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
          <button
            onClick={close}
            style={{ ...condensed, fontSize: 12, padding: '9px 16px', cursor: 'pointer', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--control)', color: 'var(--text)' }}
          >
            Cancel
          </button>
          <button
            onClick={submit}
            disabled={!form.name.trim()}
            style={{
              ...condensed, fontSize: 12, padding: '9px 20px', borderRadius: 8, border: 'none',
              background: form.name.trim() ? 'var(--accent)' : 'var(--control)',
              color: form.name.trim() ? '#fff' : 'var(--text-faint)',
              cursor: form.name.trim() ? 'pointer' : 'not-allowed',
            }}
          >
            Create
          </button>
        </div>

        <div
          onClick={() => { close(); openImport(); }}
          style={{ marginTop: 12, textAlign: 'center', fontSize: 12, color: 'var(--text-muted)', cursor: 'pointer', textDecoration: 'underline' }}
        >
          Import from UWW.org
        </div>
      </div>
    </div>
  );
}
