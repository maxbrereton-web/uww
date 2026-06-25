import type React from 'react';
import { useState } from 'react';
import { FileText, Link2, X, Plus } from 'lucide-react';
import { useStore, isAdmin } from '../../../store';
import type { EventType, InfoItem } from '../../../types';
import Avatar from '../../common/Avatar';
import {
  formatDayMon, eventTypeLabel, priorityColor, priorityLabel, eventSolidColor,
  compTypesFor, eventHasAge, compHasRegion,
} from '../../../data/utils';
import { EVENT_TYPES, AGE_RANGES, REGIONS } from '../../../data/seed';

const condensed: React.CSSProperties = {
  fontStretch: '75%', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.02em',
};

const sectionLabel: React.CSSProperties = {
  fontSize: 12, color: 'var(--text-muted)', textTransform: 'uppercase',
  letterSpacing: '.09em', fontWeight: 700,
};

interface ChipDef {
  k: string;
  value: string;
  dot?: string;
  dotAnimated?: boolean;
  editor?: 'select' | 'dates';
  selectVal?: string;
  opts?: { value: string; label: string }[];
  onChange?: (v: string) => void;
}

export default function EventInfoTab({ eventId }: { eventId: string }) {
  const ev = useStore(s => s.events.find(e => e.id === eventId) || s.archivedEvents.find(e => e.id === eventId));
  const detail = useStore(s => s.detail[eventId]);
  const admin = useStore(isAdmin);
  const staff = useStore(s => s.staff);
  const updateEvent = useStore(s => s.updateEvent);
  const addInfoItem = useStore(s => s.addInfoItem);
  const removeInfoItem = useStore(s => s.removeInfoItem);
  const addEventAdmin = useStore(s => s.addEventAdmin);
  const removeEventAdmin = useStore(s => s.removeEventAdmin);
  const openDocEditor = useStore(s => s.openDocEditor);
  const openLinkSetup = useStore(s => s.openLinkSetup);

  const [addMenuOpen, setAddMenuOpen] = useState(false);
  const [adminAddOpen, setAdminAddOpen] = useState(false);

  if (!ev) return null;

  const compOptions = compTypesFor(ev.eventType);
  const infoItems = detail?.infoItems || [];
  const accent = eventSolidColor(ev);

  // Standard (global) admins are always listed; extra event-admins appended.
  const stdAdminIds = staff.filter(p => p.admin).map(p => p.id);
  const extraAdminIds = (ev.eventAdmins || []).filter(id => !stdAdminIds.includes(id));
  const adminIds = [...new Set([...stdAdminIds, ...extraAdminIds])];
  const addableAdmins = staff.filter(p => !p.admin && !(ev.eventAdmins || []).includes(p.id));

  const chips: ChipDef[] = [
    {
      k: 'Priority', value: priorityLabel(ev.priority), dot: priorityColor(ev.priority),
      dotAnimated: ev.priority === 'top', editor: 'select', selectVal: ev.priority,
      opts: [{ value: 'low', label: 'Low' }, { value: 'mid', label: 'Mid' }, { value: 'top', label: 'Top' }],
      onChange: v => updateEvent(eventId, { priority: v as 'top' | 'mid' | 'low' }),
    },
    {
      k: 'Event Type', value: eventTypeLabel(ev.eventType), dot: accent,
      editor: 'select', selectVal: ev.eventType,
      opts: EVENT_TYPES.map(t => ({ value: t, label: eventTypeLabel(t) })),
      onChange: v => updateEvent(eventId, { eventType: v as EventType, competitionType: '' }),
    },
  ];
  if (compOptions.length > 0) {
    chips.push({
      k: 'Competition', value: ev.competitionType || '—', editor: 'select', selectVal: ev.competitionType,
      opts: compOptions.map(c => ({ value: c, label: c })),
      onChange: v => updateEvent(eventId, { competitionType: v, ...(v === 'Ranking Series' ? { ageRange: 'Senior' } : {}), ...(compHasRegion(v) ? {} : { location: '' }) }),
    });
  }
  if (compHasRegion(ev.competitionType)) {
    chips.push({
      k: 'Region', value: ev.location || '—', editor: 'select', selectVal: ev.location,
      opts: REGIONS.map(l => ({ value: l, label: l })),
      onChange: v => updateEvent(eventId, { location: v }),
    });
  }
  if (eventHasAge(ev.eventType)) {
    chips.push({
      k: 'Age Range', value: ev.competitionType === 'Ranking Series' ? 'Senior' : (ev.ageRange || '—'),
      editor: ev.competitionType === 'Ranking Series' ? undefined : 'select', selectVal: ev.ageRange,
      opts: AGE_RANGES.map(a => ({ value: a, label: a })),
      onChange: v => updateEvent(eventId, { ageRange: v }),
    });
  }
  chips.push({
    k: 'Dates', value: `${formatDayMon(ev.start)} – ${formatDayMon(ev.end)}`, editor: 'dates',
  });

  return (
    <div>
      {/* Accent bar + name */}
      <div style={{ height: 4, width: 60, borderRadius: 3, background: accent, marginBottom: 16 }} />
      <div style={{ ...condensed, fontSize: 26, marginBottom: 20 }}>{ev.name}</div>

      {/* Info chip cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))',
          gap: 12,
          marginBottom: 28,
        }}
      >
        {chips.map(c => (
          <div
            key={c.k}
            style={{
              position: 'relative',
              background: 'var(--panel-2)',
              border: '1px solid var(--border)',
              borderRadius: 10,
              padding: '13px 15px',
              cursor: admin ? 'pointer' : 'default',
            }}
          >
            <div style={{ fontSize: 10.5, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 5 }}>
              {c.k}
            </div>
            <div style={{ fontSize: 14.5, fontWeight: 700, textTransform: 'capitalize', display: 'flex', alignItems: 'center' }}>
              {c.dot && (
                <span
                  style={{
                    width: 9, height: 9, borderRadius: '50%', background: c.dot, display: 'inline-block', marginRight: 7,
                    ...(c.dotAnimated ? { animation: 'goldRipple 2.2s ease-out infinite, goldGlow 2.2s ease-in-out infinite' } : {}),
                  }}
                />
              )}
              <span style={{ flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.value}</span>
              {admin && <span style={{ color: 'var(--text-muted)', fontSize: 11, marginLeft: 6 }}>▾</span>}
            </div>

            {/* Admin inline editors (invisible overlays) */}
            {admin && c.editor === 'select' && (
              <select
                value={c.selectVal}
                onChange={e => c.onChange?.(e.target.value)}
                title={`Change ${c.k}`}
                style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }}
              >
                {c.opts?.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            )}
            {admin && c.editor === 'dates' && (
              <>
                <input
                  type="date" value={ev.start} title="Start date"
                  onChange={e => updateEvent(eventId, { start: e.target.value })}
                  style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '50%', opacity: 0, cursor: 'pointer' }}
                />
                <input
                  type="date" value={ev.end} title="End date"
                  onChange={e => updateEvent(eventId, { end: e.target.value })}
                  style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: '50%', opacity: 0, cursor: 'pointer' }}
                />
              </>
            )}
          </div>
        ))}
      </div>

      {/* Important Info header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--border)', paddingTop: 18, marginBottom: 14 }}>
        <div style={sectionLabel}>Important Info</div>
        {admin && (
          <div style={{ position: 'relative' }}>
            <button
              type="button"
              onClick={() => setAddMenuOpen(o => !o)}
              title="Add info"
              style={{
                width: 32, height: 32, borderRadius: 8, background: 'var(--accent-deep)', color: '#fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                boxShadow: '0 5px 14px rgba(241,90,34,.3)',
              }}
            >
              <Plus size={18} />
            </button>
            {addMenuOpen && (
              <>
                <div onClick={() => setAddMenuOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 15 }} />
                <div
                  style={{
                    position: 'absolute', top: 40, right: 0, zIndex: 20, width: 190,
                    background: 'var(--panel)', border: '1px solid var(--border-strong)',
                    borderRadius: 11, boxShadow: 'var(--shadow)', overflow: 'hidden',
                  }}
                >
                  <button
                    type="button"
                    onClick={() => { addInfoItem(eventId, { id: 'doc' + Date.now(), kind: 'doc', name: 'New Document', content: '' }); setAddMenuOpen(false); }}
                    style={menuItemStyle}
                  >
                    <FileText size={15} /> New document
                  </button>
                  <button
                    type="button"
                    onClick={() => { addInfoItem(eventId, { id: 'lnk' + Date.now(), kind: 'link', name: 'New Link', url: '' }); setAddMenuOpen(false); }}
                    style={{ ...menuItemStyle, borderTop: '1px solid var(--border)' }}
                  >
                    <Link2 size={15} /> Add link
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* Important Info cards */}
      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
        {infoItems.map(item => (
          <InfoCard
            key={item.id}
            item={item}
            admin={admin}
            onClick={() => {
              if (item.kind === 'doc') openDocEditor(item);
              else if (!item.url) { if (admin) openLinkSetup(item); }
              else window.open(item.url, '_blank');
            }}
            onRemove={() => removeInfoItem(eventId, item.id)}
          />
        ))}
      </div>

      {/* Event Admin */}
      <div style={{ borderTop: '1px solid var(--border)', marginTop: 18, paddingTop: 18 }}>
        <div style={{ ...sectionLabel, marginBottom: 12 }}>Event Admin</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 9, flexWrap: 'wrap' }}>
          {adminIds.map(id => {
            const m = staff.find(x => x.id === id);
            const removable = admin && !m?.admin;
            return (
              <div key={id} style={pillStyle}>
                <Avatar staffId={id} size={26} />
                <span style={{ fontSize: 12.5, fontWeight: 700 }}>{m?.name || id}</span>
                {removable && (
                  <button type="button" onClick={() => removeEventAdmin(eventId, id)} style={pillRemoveStyle} title="Remove as event admin">
                    <X size={12} />
                  </button>
                )}
              </div>
            );
          })}
          {admin && (
            <div style={{ position: 'relative' }}>
              <button
                type="button"
                onClick={() => setAdminAddOpen(o => !o)}
                title="Add event admin"
                style={{
                  width: 32, height: 32, borderRadius: '50%', background: 'var(--accent-deep)', color: '#fff',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                  boxShadow: '0 5px 14px rgba(241,90,34,.3)',
                }}
              >
                <Plus size={17} />
              </button>
              {adminAddOpen && (
                <>
                  <div onClick={() => setAdminAddOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 15 }} />
                  <div
                    style={{
                      position: 'absolute', bottom: 40, left: 0, zIndex: 20, width: 240,
                      background: 'var(--panel)', border: '1px solid var(--border-strong)',
                      borderRadius: 11, boxShadow: 'var(--shadow)', overflow: 'hidden',
                    }}
                  >
                    <div style={{ padding: '9px 13px 6px', fontSize: 10, color: 'var(--text-faint)', textTransform: 'uppercase', letterSpacing: '.08em', fontWeight: 700 }}>
                      Make event admin
                    </div>
                    <div style={{ maxHeight: 220, overflow: 'auto' }}>
                      {addableAdmins.map(m => (
                        <button
                          key={m.id}
                          type="button"
                          onClick={() => { addEventAdmin(eventId, m.id); setAdminAddOpen(false); }}
                          style={{ ...menuItemStyle, padding: '8px 13px' }}
                        >
                          <Avatar staffId={m.id} size={28} />
                          <span style={{ fontSize: 13, fontWeight: 700 }}>{m.name}</span>
                        </button>
                      ))}
                      {addableAdmins.length === 0 && (
                        <div style={{ padding: 14, textAlign: 'center', color: 'var(--text-faint)', fontSize: 12.5 }}>
                          Everyone's already an event admin.
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const menuItemStyle: React.CSSProperties = {
  display: 'flex', alignItems: 'center', gap: 10, width: '100%', textAlign: 'left',
  padding: '11px 14px', border: 'none', background: 'transparent', color: 'var(--text)',
  fontSize: 13, fontWeight: 600, cursor: 'pointer',
};

const pillStyle: React.CSSProperties = {
  display: 'flex', alignItems: 'center', gap: 8,
  background: 'var(--panel-2)', border: '1px solid var(--border-strong)',
  borderRadius: 20, padding: '4px 11px 4px 4px',
};

const pillRemoveStyle: React.CSSProperties = {
  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
  width: 18, height: 18, border: 'none', background: 'transparent',
  color: 'var(--text-faint)', cursor: 'pointer',
};

function InfoCard({ item, admin, onClick, onRemove }: { item: InfoItem; admin: boolean; onClick: () => void; onRemove: () => void }) {
  const isDoc = item.kind === 'doc';
  const empty = isDoc ? !(item.content || '').trim() : !(item.url || '').trim();
  const active = !empty;
  const sub = isDoc
    ? (empty ? (admin ? 'Tap to write the brief' : 'Not added yet') : 'Document')
    : (empty ? (admin ? 'Tap to set link' : 'Not added yet') : (item.url || '').replace(/^https?:\/\//, ''));
  const isSeed = item.id === 'doc1' || item.id === 'lnk-photo' || item.id === 'lnk-arena';
  const showRemove = admin && !isSeed;

  const iconBg = isDoc
    ? (active ? 'color-mix(in srgb, #2B579A 85%, #000)' : 'var(--field)')
    : (active ? 'color-mix(in srgb, var(--accent-deep) 16%, transparent)' : 'var(--field)');

  return (
    <div
      onClick={onClick}
      title={item.name}
      style={{
        position: 'relative', display: 'flex', alignItems: 'center', gap: 11,
        minWidth: 190, maxWidth: 240, padding: '11px 13px', borderRadius: 11,
        background: 'var(--panel-2)', border: '1px solid ' + (empty ? 'var(--border)' : 'var(--border-strong)'),
        cursor: 'pointer', opacity: empty && !admin ? 0.55 : 1,
      }}
    >
      <div
        style={{
          width: 40, height: 40, borderRadius: 9, flex: '0 0 40px', display: 'flex',
          alignItems: 'center', justifyContent: 'center', background: iconBg,
          filter: empty ? 'grayscale(.6)' : 'none', opacity: empty ? 0.7 : 1,
          color: isDoc && active ? '#fff' : (active ? 'var(--accent)' : 'var(--text-muted)'),
        }}
      >
        {isDoc ? <FileText size={18} /> : <Link2 size={18} />}
      </div>
      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.name}</div>
        <div style={{ fontSize: 10.5, color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{sub}</div>
      </div>
      {showRemove && (
        <button
          type="button"
          onClick={e => { e.stopPropagation(); onRemove(); }}
          style={{ position: 'absolute', top: 6, right: 6, border: 'none', background: 'transparent', color: 'var(--text-faint)', cursor: 'pointer', display: 'inline-flex' }}
          title="Remove"
        >
          <X size={13} />
        </button>
      )}
    </div>
  );
}
