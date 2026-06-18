import type React from 'react';
import { useState } from 'react';
import { Plus, X, Pencil, Copy, Trash2 } from 'lucide-react';
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

const iconBtn: React.CSSProperties = {
  display: 'inline-flex', alignItems: 'center', gap: 5, ...condensed, fontSize: 10,
  padding: '6px 10px', borderRadius: 7, border: '1px solid var(--border)',
  background: 'var(--control)', color: 'var(--text)', cursor: 'pointer',
};

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
  background: 'var(--panel)', border: '1px solid var(--border)', borderRadius: 12,
  padding: 16, display: 'flex', flexDirection: 'column', gap: 10,
};

const metaRow: React.CSSProperties = {
  display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 12, color: 'var(--text-muted)',
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
    addTemplate('events', { id: genId('et'), name: 'New Template', eventType: '', competitionType: '', ageRange: '', priority: 'mid', barColor: '' });
  }

  function newDocTemplate() {
    addTemplate('docs', { id: genId('dt'), name: 'New Document', content: '' });
  }

  const sectionHead = (title: string, onNew: () => void) => (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
      <div style={{ ...condensed, fontSize: 15, color: 'var(--text)' }}>{title}</div>
      <button
        onClick={onNew}
        style={{ display: 'inline-flex', alignItems: 'center', gap: 6, ...condensed, fontSize: 11, padding: '8px 14px', borderRadius: 8, border: 'none', background: 'var(--accent)', color: '#fff', cursor: 'pointer' }}
      >
        <Plus size={15} /> New
      </button>
    </div>
  );

  return (
    <div style={{ padding: 22, overflow: 'auto', height: '100%' }}>
      <div style={{ ...condensed, fontSize: 20, color: 'var(--text)', marginBottom: 22 }}>Templates</div>

      <section style={{ marginBottom: 30 }}>
        {sectionHead('Event Templates', newEventTemplate)}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 14 }}>
          {templates.events.map(t => (
            <div key={t.id} style={cardStyle}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <PriorityDot priority={t.priority} />
                <span style={{ ...condensed, fontSize: 13, color: 'var(--text)' }}>{t.name}</span>
              </div>
              <div style={metaRow}>
                <span>Type</span>
                <span style={{ color: 'var(--text)' }}>{t.eventType === '' ? '—' : eventTypeLabel(t.eventType)}</span>
              </div>
              <div style={metaRow}>
                <span>Competition</span>
                <span style={{ color: 'var(--text)' }}>{t.competitionType || '—'}</span>
              </div>
              <div style={metaRow}>
                <span>Age Range</span>
                <span style={{ color: 'var(--text)' }}>{t.ageRange || '—'}</span>
              </div>
              <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
                <button style={iconBtn} onClick={() => setEditEvent(t)}><Pencil size={12} /> Edit</button>
                <button style={iconBtn} onClick={() => duplicateTemplate('events', t.id)}><Copy size={12} /> Duplicate</button>
                <button style={{ ...iconBtn, color: '#EF4444' }} onClick={() => deleteTemplate('events', t.id)}><Trash2 size={12} /> Delete</button>
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
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 14 }}>
          {templates.docs.map(t => (
            <div key={t.id} style={cardStyle}>
              <div style={{ ...condensed, fontSize: 13, color: 'var(--text)' }}>{t.name}</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {t.content ? t.content.slice(0, 60) : 'Empty document'}
              </div>
              <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
                <button style={iconBtn} onClick={() => setEditDoc(t)}><Pencil size={12} /> Edit</button>
                <button style={iconBtn} onClick={() => duplicateTemplate('docs', t.id)}><Copy size={12} /> Duplicate</button>
                <button style={{ ...iconBtn, color: '#EF4444' }} onClick={() => deleteTemplate('docs', t.id)}><Trash2 size={12} /> Delete</button>
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
