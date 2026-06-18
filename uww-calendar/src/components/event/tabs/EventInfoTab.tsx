import type React from 'react';
import { useState } from 'react';
import { FileText, Link2, ExternalLink, X, Plus } from 'lucide-react';
import { useStore, isAdmin } from '../../../store';
import type { Priority, EventType, InfoItem } from '../../../types';
import PriorityDot from '../../common/PriorityDot';
import Avatar from '../../common/Avatar';
import { formatDateFull, eventTypeLabel, priorityLabel } from '../../../data/utils';
import {
  EVENT_TYPES, AGE_RANGES, COMPETITION_TYPES_WRESTLING, COMPETITION_TYPES_CONTINENTAL,
} from '../../../data/seed';

const condensed: React.CSSProperties = {
  fontStretch: '75%',
  fontWeight: 800,
  textTransform: 'uppercase',
  letterSpacing: '.02em',
};

const PRIORITIES: Priority[] = ['top', 'mid', 'low'];

const chipStyle: React.CSSProperties = {
  background: 'var(--panel-2)',
  border: '1px solid var(--border)',
  borderRadius: 8,
  padding: '8px 12px',
  display: 'inline-flex',
  alignItems: 'center',
  gap: 8,
};

const chipLabel: React.CSSProperties = { ...condensed, fontSize: 10, color: 'var(--text-muted)' };
const chipValue: React.CSSProperties = { fontSize: 13, color: 'var(--text)' };

const sectionHeading: React.CSSProperties = { ...condensed, fontSize: 13, color: 'var(--text)', margin: '22px 0 10px' };

const fieldStyle: React.CSSProperties = {
  background: 'var(--field)',
  border: '1px solid var(--border)',
  borderRadius: 6,
  color: 'var(--text)',
  fontSize: 13,
  padding: '4px 8px',
};

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

  const [editing, setEditing] = useState<string | null>(null);
  const [addMenuOpen, setAddMenuOpen] = useState(false);
  const [adminAddOpen, setAdminAddOpen] = useState(false);

  if (!ev) return null;

  const compOptions = ev.eventType === 'continental' ? COMPETITION_TYPES_CONTINENTAL : COMPETITION_TYPES_WRESTLING;
  const eventAdmins = ev.eventAdmins || [];
  const infoItems = detail?.infoItems || [];

  const cyclePriority = () => {
    const i = PRIORITIES.indexOf(ev.priority);
    updateEvent(eventId, { priority: PRIORITIES[(i + 1) % PRIORITIES.length] });
  };

  return (
    <div>
      {/* Info chips */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
        {/* Priority */}
        <div
          style={{ ...chipStyle, cursor: admin ? 'pointer' : 'default' }}
          onClick={admin ? cyclePriority : undefined}
          title={admin ? 'Click to change priority' : undefined}
        >
          <span style={chipLabel}>Priority</span>
          <PriorityDot priority={ev.priority} />
          <span style={chipValue}>{priorityLabel(ev.priority)}</span>
        </div>

        {/* Type */}
        <div style={chipStyle}>
          <span style={chipLabel}>Type</span>
          {admin && editing === 'type' ? (
            <select
              autoFocus
              style={fieldStyle}
              value={ev.eventType}
              onChange={e => { updateEvent(eventId, { eventType: e.target.value as EventType }); setEditing(null); }}
              onBlur={() => setEditing(null)}
            >
              {EVENT_TYPES.map(t => <option key={t} value={t}>{eventTypeLabel(t)}</option>)}
            </select>
          ) : (
            <span
              style={{ ...chipValue, cursor: admin ? 'pointer' : 'default' }}
              onClick={admin ? () => setEditing('type') : undefined}
            >
              {eventTypeLabel(ev.eventType)}
            </span>
          )}
        </div>

        {/* Competition */}
        <div style={chipStyle}>
          <span style={chipLabel}>Competition</span>
          {admin && editing === 'comp' ? (
            <select
              autoFocus
              style={fieldStyle}
              value={ev.competitionType}
              onChange={e => { updateEvent(eventId, { competitionType: e.target.value }); setEditing(null); }}
              onBlur={() => setEditing(null)}
            >
              {compOptions.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          ) : (
            <span
              style={{ ...chipValue, cursor: admin ? 'pointer' : 'default' }}
              onClick={admin ? () => setEditing('comp') : undefined}
            >
              {ev.competitionType}
            </span>
          )}
        </div>

        {/* Category / Age */}
        <div style={chipStyle}>
          <span style={chipLabel}>Category</span>
          {admin && editing === 'age' ? (
            <select
              autoFocus
              style={fieldStyle}
              value={ev.ageRange}
              onChange={e => { updateEvent(eventId, { ageRange: e.target.value }); setEditing(null); }}
              onBlur={() => setEditing(null)}
            >
              {AGE_RANGES.map(a => <option key={a} value={a}>{a}</option>)}
            </select>
          ) : (
            <span
              style={{ ...chipValue, cursor: admin ? 'pointer' : 'default' }}
              onClick={admin ? () => setEditing('age') : undefined}
            >
              {ev.ageRange}
            </span>
          )}
        </div>

        {/* Dates */}
        <div style={chipStyle}>
          <span style={chipLabel}>Dates</span>
          {admin && editing === 'dates' ? (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <input
                type="date"
                style={fieldStyle}
                value={ev.start}
                onChange={e => updateEvent(eventId, { start: e.target.value })}
              />
              <span style={{ color: 'var(--text-faint)' }}>–</span>
              <input
                type="date"
                style={fieldStyle}
                value={ev.end}
                onChange={e => updateEvent(eventId, { end: e.target.value })}
                onBlur={() => setEditing(null)}
              />
            </span>
          ) : (
            <span
              style={{ ...chipValue, cursor: admin ? 'pointer' : 'default' }}
              onClick={admin ? () => setEditing('dates') : undefined}
            >
              {formatDateFull(ev.start)} – {formatDateFull(ev.end)}
            </span>
          )}
        </div>

        {/* Location */}
        {(admin || ev.location) && (
          <div style={chipStyle}>
            <span style={chipLabel}>Location</span>
            {admin && editing === 'loc' ? (
              <input
                autoFocus
                type="text"
                style={fieldStyle}
                value={ev.location}
                placeholder="Location…"
                onChange={e => updateEvent(eventId, { location: e.target.value })}
                onBlur={() => setEditing(null)}
              />
            ) : (
              <span
                style={{ ...chipValue, cursor: admin ? 'pointer' : 'default' }}
                onClick={admin ? () => setEditing('loc') : undefined}
              >
                {ev.location || '—'}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Important Info */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={sectionHeading}>Important Info</div>
        {admin && (
          <div style={{ position: 'relative' }}>
            <button
              type="button"
              onClick={() => setAddMenuOpen(o => !o)}
              style={{
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                width: 24, height: 24, borderRadius: 6, border: '1px solid var(--border)',
                background: 'var(--control)', color: 'var(--text)', cursor: 'pointer',
              }}
              title="Add info item"
            >
              <Plus size={14} />
            </button>
            {addMenuOpen && (
              <div
                style={{
                  position: 'absolute', top: '100%', left: 0, marginTop: 4, zIndex: 20,
                  background: 'var(--panel)', border: '1px solid var(--border-strong)',
                  borderRadius: 8, boxShadow: 'var(--shadow)', minWidth: 160, overflow: 'hidden',
                }}
              >
                <button
                  type="button"
                  onClick={() => { addInfoItem(eventId, { id: 'doc' + Date.now(), kind: 'doc', name: 'New Document', content: '' }); setAddMenuOpen(false); }}
                  style={menuItemStyle}
                >
                  New document
                </button>
                <button
                  type="button"
                  onClick={() => { addInfoItem(eventId, { id: 'lnk' + Date.now(), kind: 'link', name: 'New Link', url: '' }); setAddMenuOpen(false); }}
                  style={menuItemStyle}
                >
                  Add link
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
        {infoItems.length === 0 && <div style={{ color: 'var(--text-muted)', fontSize: 13 }}>No info items.</div>}
        {infoItems.map(item => (
          <InfoCard
            key={item.id}
            item={item}
            admin={admin}
            onClick={() => {
              if (item.kind === 'doc') openDocEditor(item);
              else if (!item.url) openLinkSetup(item);
              else window.open(item.url, '_blank');
            }}
            onRemove={() => removeInfoItem(eventId, item.id)}
          />
        ))}
      </div>

      {/* Event Admin */}
      <div style={sectionHeading}>Event Admin</div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, position: 'relative' }}>
        {eventAdmins.map(id => {
          const m = staff.find(x => x.id === id);
          return (
            <div key={id} style={{ ...pillStyle }}>
              <Avatar staffId={id} size={22} />
              <span style={{ fontSize: 13, color: 'var(--text)' }}>{m?.name || id}</span>
              {admin && (
                <button type="button" onClick={() => removeEventAdmin(eventId, id)} style={pillRemoveStyle} title="Remove">
                  <X size={12} />
                </button>
              )}
            </div>
          );
        })}
        {eventAdmins.length === 0 && !admin && (
          <div style={{ color: 'var(--text-muted)', fontSize: 13 }}>No event admins assigned.</div>
        )}
        {admin && (
          <div style={{ position: 'relative' }}>
            <button
              type="button"
              onClick={() => setAdminAddOpen(o => !o)}
              style={{ ...pillStyle, cursor: 'pointer', color: 'var(--text-muted)' }}
              title="Add event admin"
            >
              <Plus size={14} />
              <span style={{ ...condensed, fontSize: 11 }}>Add</span>
            </button>
            {adminAddOpen && (
              <div
                style={{
                  position: 'absolute', bottom: '100%', left: 0, marginBottom: 4, zIndex: 20,
                  background: 'var(--panel)', border: '1px solid var(--border-strong)',
                  borderRadius: 8, boxShadow: 'var(--shadow)', minWidth: 200, maxHeight: 240,
                  overflowY: 'auto',
                }}
              >
                {staff.filter(m => !eventAdmins.includes(m.id)).map(m => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => { addEventAdmin(eventId, m.id); setAdminAddOpen(false); }}
                    style={{ ...menuItemStyle, display: 'flex', alignItems: 'center', gap: 8 }}
                  >
                    <Avatar staffId={m.id} size={20} />
                    {m.name}
                  </button>
                ))}
                {staff.filter(m => !eventAdmins.includes(m.id)).length === 0 && (
                  <div style={{ padding: '8px 12px', color: 'var(--text-muted)', fontSize: 13 }}>All staff are admins.</div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

const menuItemStyle: React.CSSProperties = {
  display: 'block',
  width: '100%',
  textAlign: 'left',
  padding: '8px 12px',
  border: 'none',
  background: 'transparent',
  color: 'var(--text)',
  fontSize: 13,
  cursor: 'pointer',
};

const pillStyle: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 8,
  background: 'var(--panel-2)',
  border: '1px solid var(--border)',
  borderRadius: 999,
  padding: '4px 10px 4px 4px',
};

const pillRemoveStyle: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 18,
  height: 18,
  borderRadius: '50%',
  border: 'none',
  background: 'var(--control)',
  color: 'var(--text-muted)',
  cursor: 'pointer',
};

function InfoCard({ item, admin, onClick, onRemove }: { item: InfoItem; admin: boolean; onClick: () => void; onRemove: () => void }) {
  const isDoc = item.kind === 'doc';
  const hasLink = item.kind === 'link' && !!item.url;
  return (
    <div
      style={{
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        background: 'var(--panel)',
        border: '1px solid var(--border)',
        borderRadius: 8,
        padding: '10px 30px 10px 12px',
        cursor: 'pointer',
        minWidth: 140,
      }}
      onClick={onClick}
      title={item.name}
    >
      {isDoc ? <FileText size={16} color="var(--accent)" /> : (hasLink ? <ExternalLink size={16} color="var(--accent)" /> : <Link2 size={16} color="var(--text-muted)" />)}
      <span style={{ fontSize: 13, color: 'var(--text)' }}>{item.name}</span>
      {admin && (
        <button
          type="button"
          onClick={e => { e.stopPropagation(); onRemove(); }}
          style={{
            position: 'absolute', top: 6, right: 6, display: 'inline-flex',
            alignItems: 'center', justifyContent: 'center', width: 18, height: 18,
            borderRadius: '50%', border: 'none', background: 'var(--control)',
            color: 'var(--text-muted)', cursor: 'pointer',
          }}
          title="Remove"
        >
          <X size={11} />
        </button>
      )}
    </div>
  );
}
