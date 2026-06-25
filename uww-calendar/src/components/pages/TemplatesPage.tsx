import type React from 'react';
import { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { useStore } from '../../store';
import type { EventTemplate, DocTemplate, EventType, Priority } from '../../types';
import { eventTypeLabel, genId } from '../../data/utils';
import PriorityDot from '../common/PriorityDot';

const condensed: React.CSSProperties = {
  fontStretch: '75%', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.02em',
};

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '9px 11px', background: 'var(--field)', color: 'var(--text)',
  border: '1px solid var(--border)', borderRadius: 8, fontSize: 13, outline: 'none',
};

const labelStyle: React.CSSProperties = {
  ...condensed, fontSize: 11, color: 'var(--text-muted)', display: 'block', marginBottom: 6,
};

const EVENT_TYPE_OPTS: Array<EventType | ''> = ['', 'wrestling', 'continental', 'rankingseries', 'documentary', 'devcamp'];
const PRIORITIES: Priority[] = ['top', 'mid', 'low'];

function modalShell(title: string, onClose: () => void, body: React.ReactNode, footer: React.ReactNode) {
  return (
    <div
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.5)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}
      onClick={onClose}
    >
      <div
        className="uww-overlay"
        style={{ width: 440, maxWidth: '100%', maxHeight: '90vh', overflowY: 'auto', background: 'var(--panel)', border: '1px solid var(--border-strong)', borderRadius: 14, boxShadow: 'var(--shadow)', padding: 22 }}
        onClick={e => e.stopPropagation()}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
          <div style={{ ...condensed, fontSize: 16, color: 'var(--text)' }}>{title}</div>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 4 }} aria-label="Close">
            <X size={18} />
          </button>
        </div>
        {body}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 22 }}>{footer}</div>
      </div>
    </div>
  );
}

function EditEventTemplateModal({ tpl, onClose }: { tpl: EventTemplate; onClose: () => void }) {
  const updateTemplate = useStore(s => s.updateTemplate);
  const [name, setName] = useState(tpl.name);
  const [eventType, setEventType] = useState<EventType | ''>(tpl.eventType);
  const [competitionType, setCompetitionType] = useState(tpl.competitionType);
  const [ageRange, setAgeRange] = useState(tpl.ageRange);
  const [priority, setPriority] = useState<Priority>(tpl.priority);

  const save = () => {
    updateTemplate('events', tpl.id, { name: name.trim() || 'Untitled', eventType, competitionType, ageRange, priority });
    onClose();
  };

  return modalShell('Edit Template', onClose, (
    <>
      <div style={{ marginBottom: 14 }}>
        <label style={labelStyle}>Name</label>
        <input style={inputStyle} value={name} onChange={e => setName(e.target.value)} />
      </div>
      <div style={{ marginBottom: 14 }}>
        <label style={labelStyle}>Priority</label>
        <div style={{ display: 'flex', gap: 6 }}>
          {PRIORITIES.map(p => (
            <button
              key={p}
              onClick={() => setPriority(p)}
              style={{ ...condensed, flex: 1, padding: '8px 6px', fontSize: 11, cursor: 'pointer', border: '1px solid var(--border)', borderRadius: 7, background: priority === p ? 'var(--accent)' : 'var(--control)', color: priority === p ? '#fff' : 'var(--text)' }}
            >
              {p}
            </button>
          ))}
        </div>
      </div>
      <div style={{ marginBottom: 14 }}>
        <label style={labelStyle}>Event Type</label>
        <select style={inputStyle} value={eventType} onChange={e => setEventType(e.target.value as EventType | '')}>
          {EVENT_TYPE_OPTS.map(t => <option key={t || 'none'} value={t}>{t === '' ? '—' : eventTypeLabel(t)}</option>)}
        </select>
      </div>
      <div style={{ marginBottom: 14 }}>
        <label style={labelStyle}>Competition Type</label>
        <input style={inputStyle} value={competitionType} placeholder="Competition type" onChange={e => setCompetitionType(e.target.value)} />
      </div>
      <div>
        <label style={labelStyle}>Age Range</label>
        <input style={inputStyle} value={ageRange} placeholder="Age range" onChange={e => setAgeRange(e.target.value)} />
      </div>
    </>
  ), (
    <>
      <button onClick={onClose} style={{ ...condensed, fontSize: 12, padding: '9px 16px', cursor: 'pointer', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--control)', color: 'var(--text)' }}>Cancel</button>
      <button onClick={save} style={{ ...condensed, fontSize: 12, padding: '9px 20px', borderRadius: 8, border: 'none', background: 'var(--accent)', color: '#fff', cursor: 'pointer' }}>Save</button>
    </>
  ));
}

function EditDocTemplateModal({ tpl, onClose }: { tpl: DocTemplate; onClose: () => void }) {
  const updateTemplate = useStore(s => s.updateTemplate);
  const [name, setName] = useState(tpl.name);
  const [content, setContent] = useState(tpl.content);

  const save = () => {
    updateTemplate('docs', tpl.id, { name: name.trim() || 'Untitled', content });
    onClose();
  };

  return modalShell('Edit Document', onClose, (
    <>
      <div style={{ marginBottom: 14 }}>
        <label style={labelStyle}>Name</label>
        <input style={inputStyle} value={name} onChange={e => setName(e.target.value)} />
      </div>
      <div>
        <label style={labelStyle}>Content</label>
        <textarea
          value={content}
          onChange={e => setContent(e.target.value)}
          placeholder="Document content"
          rows={8}
          style={{ ...inputStyle, resize: 'vertical', fontFamily: 'inherit', minHeight: 140 }}
        />
      </div>
    </>
  ), (
    <>
      <button onClick={onClose} style={{ ...condensed, fontSize: 12, padding: '9px 16px', cursor: 'pointer', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--control)', color: 'var(--text)' }}>Cancel</button>
      <button onClick={save} style={{ ...condensed, fontSize: 12, padding: '9px 20px', borderRadius: 8, border: 'none', background: 'var(--accent)', color: '#fff', cursor: 'pointer' }}>Save</button>
    </>
  ));
}

const cardStyle: React.CSSProperties = {
  background: 'var(--panel-2)', border: '1px solid var(--border)', borderRadius: 14,
  padding: 18, display: 'flex', flexDirection: 'column', gap: 14, maxWidth: 420,
};

const sectionLabel: React.CSSProperties = {
  fontSize: 12, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '.1em', fontWeight: 700,
};

const actionBtn: React.CSSProperties = {
  ...condensed, fontSize: 12, padding: '10px 20px', borderRadius: 9,
  border: '1px solid var(--border-strong)', background: 'var(--control)', color: 'var(--text)', cursor: 'pointer',
};

const removeBtn: React.CSSProperties = {
  padding: '8px 14px', borderRadius: 9, border: '1px solid var(--border-strong)',
  background: 'var(--control)', color: '#ED1C24', cursor: 'pointer', fontSize: 16, lineHeight: 1,
};

export default function TemplatesPage() {
  const role = useStore(s => s.role);
  const templates = useStore(s => s.templates);
  const addTemplate = useStore(s => s.addTemplate);
  const duplicateTemplate = useStore(s => s.duplicateTemplate);
  const deleteTemplate = useStore(s => s.deleteTemplate);

  const [editEvent, setEditEvent] = useState<EventTemplate | null>(null);
  const [editDoc, setEditDoc] = useState<DocTemplate | null>(null);

  if (role !== 'admin') {
    return (
      <div style={{ padding: 24, height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ ...condensed, fontSize: 14, color: 'var(--text-muted)' }}>Admins only</div>
      </div>
    );
  }

  function newEventTemplate() {
    addTemplate('events', { id: genId('et'), name: 'New Event Template', eventType: '', competitionType: '', ageRange: '', priority: 'mid', barColor: '' });
  }

  function newDocTemplate() {
    addTemplate('docs', { id: genId('dt'), name: 'New Document', content: '' });
  }

  const sectionHead = (title: string, onNew: () => void) => (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
      <div style={sectionLabel}>{title}</div>
      <button
        onClick={onNew}
        style={{ display: 'inline-flex', alignItems: 'center', gap: 6, ...condensed, fontSize: 12, padding: '9px 16px', borderRadius: 9, border: 'none', background: 'var(--accent-deep)', color: '#fff', cursor: 'pointer', boxShadow: '0 6px 16px rgba(241,90,34,.32)' }}
      >
        <Plus size={15} /> New
      </button>
    </div>
  );

  return (
    <div style={{ padding: '20px 24px 28px', overflow: 'auto', height: '100%' }}>
      <section style={{ marginBottom: 34 }}>
        {sectionHead('Event Templates', newEventTemplate)}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {templates.events.map(t => (
            <div key={t.id} style={cardStyle}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <PriorityDot priority={t.priority} />
                <span style={{ fontSize: 16, fontWeight: 800 }}>{t.name}</span>
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <button style={actionBtn} onClick={() => setEditEvent(t)}>Edit</button>
                <button style={actionBtn} onClick={() => duplicateTemplate('events', t.id)}>Duplicate</button>
                <button style={removeBtn} title="Delete" onClick={() => deleteTemplate('events', t.id)}>×</button>
              </div>
            </div>
          ))}
          {templates.events.length === 0 && (
            <div style={{ color: 'var(--text-faint)', fontSize: 13 }}>No event templates.</div>
          )}
        </div>
      </section>

      <section>
        {sectionHead('Document Templates', newDocTemplate)}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {templates.docs.map(t => (
            <div key={t.id} style={cardStyle}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
                <div style={{ width: 28, height: 28, borderRadius: 8, background: '#0089CF', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 800, flex: '0 0 28px' }}>D</div>
                <span style={{ fontSize: 16, fontWeight: 800 }}>{t.name}</span>
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <button style={actionBtn} onClick={() => setEditDoc(t)}>Edit</button>
                <button style={actionBtn} onClick={() => duplicateTemplate('docs', t.id)}>Duplicate</button>
                <button style={removeBtn} title="Delete" onClick={() => deleteTemplate('docs', t.id)}>×</button>
              </div>
            </div>
          ))}
          {templates.docs.length === 0 && (
            <div style={{ color: 'var(--text-faint)', fontSize: 13 }}>No document templates.</div>
          )}
        </div>
      </section>

      {editEvent && <EditEventTemplateModal tpl={editEvent} onClose={() => setEditEvent(null)} />}
      {editDoc && <EditDocTemplateModal tpl={editDoc} onClose={() => setEditDoc(null)} />}
    </div>
  );
}
