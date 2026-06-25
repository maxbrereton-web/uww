import type React from 'react';
import { X } from 'lucide-react';
import { useStore } from '../../store';
import type { EventType, Priority, NewEventForm } from '../../types';
import { EVENT_TYPES, AGE_RANGES, REGIONS } from '../../data/seed';
import { eventTypeLabel, compTypesFor, eventHasAge, compHasRegion } from '../../data/utils';

const condensed: React.CSSProperties = {
  fontStretch: '75%', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.02em',
};

const PRIORITIES: Priority[] = ['low', 'mid', 'top'];

const labelStyle: React.CSSProperties = {
  fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '.08em',
  fontWeight: 700, display: 'block', marginBottom: 9,
};

const fieldStyle: React.CSSProperties = {
  width: '100%', padding: '13px 15px', background: 'var(--field)', color: 'var(--text)',
  border: '1px solid var(--border-strong)', borderRadius: 10, fontSize: 14.5, outline: 'none', fontFamily: 'inherit',
};

const selectStyle: React.CSSProperties = { ...fieldStyle, cursor: 'pointer' };

export default function NewEventOverlay() {
  const form = useStore(s => s.newEventForm);
  const update = useStore(s => s.updateNewEventForm);
  const submit = useStore(s => s.submitNewEvent);
  const close = useStore(s => s.closeNewEvent);
  const openImport = useStore(s => s.openImport);

  const onPickType = (et: EventType | '') => update({ eventType: et, competitionType: '', ageRange: '', location: '' });
  const onPickComp = (c: string) => {
    const patch: Partial<NewEventForm> = { competitionType: c };
    if (c === 'Ranking Series') patch.ageRange = 'Senior';
    if (!compHasRegion(c)) patch.location = '';
    update(patch);
  };

  const showComp = form.eventType !== 'documentary' && form.eventType !== 'devcamp';
  const compOpts = compTypesFor(form.eventType);
  const showAge = eventHasAge(form.eventType);
  const showRegion = compHasRegion(form.competitionType);
  const canSubmit = !!form.name.trim();

  return (
    <div
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.5)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}
      onClick={close}
    >
      <div
        className="uww-overlay"
        style={{ width: 480, maxWidth: '100%', maxHeight: '92vh', overflowY: 'auto', background: 'var(--panel)', border: '1px solid var(--border-strong)', borderRadius: 16, boxShadow: 'var(--shadow)', padding: 26 }}
        onClick={e => e.stopPropagation()}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <div style={{ ...condensed, fontSize: 19 }}>New Event</div>
          <button onClick={close} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 4 }} aria-label="Close"><X size={20} /></button>
        </div>

        <input
          style={{ ...fieldStyle, marginBottom: 18 }}
          value={form.name}
          placeholder="Event name…"
          onChange={e => update({ name: e.target.value })}
        />

        <label style={labelStyle}>Event Priority</label>
        <div style={{ display: 'flex', gap: 12, marginBottom: 18 }}>
          {PRIORITIES.map(p => {
            const on = form.priority === p;
            return (
              <button
                key={p}
                onClick={() => update({ priority: p })}
                style={{ ...condensed, flex: 1, padding: '13px 6px', fontSize: 13, cursor: 'pointer', borderRadius: 10, border: '1px solid ' + (on ? '#c9ccd6' : 'var(--border-strong)'), background: on ? '#c9ccd6' : 'transparent', color: on ? '#13162a' : 'var(--text)' }}
              >
                {p}
              </button>
            );
          })}
        </div>

        <select style={{ ...selectStyle, marginBottom: 14, color: form.eventType ? 'var(--text)' : 'var(--text-muted)' }} value={form.eventType} onChange={e => onPickType(e.target.value as EventType | '')}>
          <option value="">Event type…</option>
          {EVENT_TYPES.map(t => <option key={t} value={t}>{eventTypeLabel(t)}</option>)}
        </select>

        {showComp && (
          <select style={{ ...selectStyle, marginBottom: 14, color: form.competitionType ? 'var(--text)' : 'var(--text-muted)' }} value={form.competitionType} onChange={e => onPickComp(e.target.value)} disabled={compOpts.length === 0}>
            <option value="">Competition type…</option>
            {compOpts.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        )}

        {showRegion && (
          <select style={{ ...selectStyle, marginBottom: 14, color: form.location ? 'var(--text)' : 'var(--text-muted)' }} value={form.location} onChange={e => update({ location: e.target.value })}>
            <option value="">Region…</option>
            {REGIONS.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
        )}

        {showAge && (
          form.competitionType === 'Ranking Series' ? (
            <select style={{ ...selectStyle, marginBottom: 14, opacity: 0.6 }} value="Senior" disabled>
              <option value="Senior">Senior (Ranking Series)</option>
            </select>
          ) : (
            <select style={{ ...selectStyle, marginBottom: 14, color: form.ageRange ? 'var(--text)' : 'var(--text-muted)' }} value={form.ageRange} onChange={e => update({ ageRange: e.target.value })}>
              <option value="">Age range…</option>
              {AGE_RANGES.map(a => <option key={a} value={a}>{a}</option>)}
            </select>
          )
        )}

        <div style={{ display: 'flex', gap: 14, marginBottom: 22 }}>
          <div style={{ flex: 1 }}>
            <label style={labelStyle}>Date Start</label>
            <input type="date" style={fieldStyle} value={form.start} onChange={e => update({ start: e.target.value })} />
          </div>
          <div style={{ flex: 1 }}>
            <label style={labelStyle}>Date End</label>
            <input type="date" style={fieldStyle} value={form.end} onChange={e => update({ end: e.target.value })} />
          </div>
        </div>

        <button
          onClick={submit}
          disabled={!canSubmit}
          style={{
            ...condensed, fontSize: 15, width: '100%', padding: '15px', borderRadius: 11, border: 'none',
            background: canSubmit ? 'var(--accent-deep)' : 'var(--control)',
            color: canSubmit ? '#fff' : 'var(--text-faint)',
            cursor: canSubmit ? 'pointer' : 'not-allowed',
            boxShadow: canSubmit ? '0 6px 16px rgba(241,90,34,.32)' : 'none',
          }}
        >
          Create Event
        </button>

        <div
          onClick={() => { close(); openImport(); }}
          style={{ marginTop: 14, textAlign: 'center', fontSize: 13, color: 'var(--text-muted)', cursor: 'pointer', textDecoration: 'underline' }}
        >
          Import from UWW.org
        </div>
      </div>
    </div>
  );
}
