import type React from 'react';
import { useEffect, useRef, useState } from 'react';
import { Plus, X, AlignLeft, AlignCenter, AlignRight } from 'lucide-react';
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
  const ref = useRef<HTMLDivElement>(null);
  const [name, setName] = useState(tpl.name);
  const [active, setActive] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (ref.current) ref.current.innerHTML = tpl.content || '';
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const refreshActive = () => {
    try {
      setActive({
        bold: document.queryCommandState('bold'),
        italic: document.queryCommandState('italic'),
        underline: document.queryCommandState('underline'),
        strike: document.queryCommandState('strikeThrough'),
        left: document.queryCommandState('justifyLeft'),
        center: document.queryCommandState('justifyCenter'),
        right: document.queryCommandState('justifyRight'),
      });
    } catch { /* ignore */ }
  };

  const exec = (cmd: string, value?: string) => {
    ref.current?.focus();
    document.execCommand(cmd, false, value);
    refreshActive();
  };

  const save = () => {
    updateTemplate('docs', tpl.id, { name: name.trim() || 'Untitled', content: ref.current?.innerHTML || '' });
    onClose();
  };

  const tbBtn = (on?: boolean): React.CSSProperties => ({
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center', minWidth: 36, height: 36,
    padding: '0 9px', borderRadius: 8, cursor: 'pointer', fontSize: 15, fontWeight: 800,
    border: '1px solid ' + (on ? 'var(--accent-deep)' : 'var(--border-strong)'),
    background: on ? 'color-mix(in srgb, var(--accent-deep) 28%, var(--control))' : 'var(--control)',
    color: 'var(--text)',
  });
  const sep = <div style={{ width: 1, height: 24, background: 'var(--border-strong)', margin: '0 4px', alignSelf: 'center' }} />;
  const selStyle: React.CSSProperties = { height: 36, borderRadius: 8, border: '1px solid var(--border-strong)', background: 'var(--control)', color: 'var(--text)', fontSize: 13, padding: '0 10px', cursor: 'pointer' };

  return (
    <div
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.6)', zIndex: 120, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '24px 16px', overflowY: 'auto' }}
      onClick={onClose}
    >
      <div className="uww-overlay" style={{ width: '100%', maxWidth: 1000, display: 'flex', flexDirection: 'column', gap: 12 }} onClick={e => e.stopPropagation()}>
        {/* Header bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, background: 'var(--panel)', border: '1px solid var(--border-strong)', borderRadius: 12, padding: 14 }}>
          <div style={{ width: 36, height: 36, borderRadius: 9, background: '#0089CF', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 800, flex: '0 0 36px' }}>D</div>
          <input
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Template name"
            style={{ flex: 1, padding: '12px 14px', background: 'var(--field)', color: 'var(--text)', border: '1px solid var(--border-strong)', borderRadius: 9, fontSize: 16, fontWeight: 700, outline: 'none', fontFamily: 'inherit' }}
          />
          <button onClick={save} style={{ ...condensed, fontSize: 15, padding: '0 26px', height: 44, borderRadius: 9, border: 'none', background: 'var(--accent-deep)', color: '#fff', cursor: 'pointer', boxShadow: '0 6px 16px rgba(241,90,34,.32)' }}>Save</button>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 6 }} aria-label="Close"><X size={22} /></button>
        </div>

        {/* Toolbar */}
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 6, background: 'var(--panel)', border: '1px solid var(--border-strong)', borderRadius: 12, padding: 10 }}>
          <select defaultValue="P" title="Text style" onChange={e => exec('formatBlock', e.target.value)} style={selStyle}>
            <option value="P">Style</option>
            <option value="P">Paragraph</option>
            <option value="H1">Heading 1</option>
            <option value="H2">Heading 2</option>
            <option value="H3">Heading 3</option>
          </select>
          <select defaultValue="3" title="Font size" onChange={e => exec('fontSize', e.target.value)} style={selStyle}>
            <option value="3">Size</option>
            <option value="1">XS</option>
            <option value="2">S</option>
            <option value="3">M</option>
            <option value="4">L</option>
            <option value="5">XL</option>
            <option value="6">XXL</option>
          </select>
          {sep}
          <button style={tbBtn(active.bold)} title="Bold" onMouseDown={e => { e.preventDefault(); exec('bold'); }}>B</button>
          <button style={{ ...tbBtn(active.italic), fontStyle: 'italic' }} title="Italic" onMouseDown={e => { e.preventDefault(); exec('italic'); }}>I</button>
          <button style={{ ...tbBtn(active.underline), textDecoration: 'underline' }} title="Underline" onMouseDown={e => { e.preventDefault(); exec('underline'); }}>U</button>
          <button style={{ ...tbBtn(active.strike), textDecoration: 'line-through' }} title="Strikethrough" onMouseDown={e => { e.preventDefault(); exec('strikeThrough'); }}>S</button>
          {sep}
          <button style={tbBtn(active.left)} title="Align left" onMouseDown={e => { e.preventDefault(); exec('justifyLeft'); }}><AlignLeft size={16} /></button>
          <button style={tbBtn(active.center)} title="Align center" onMouseDown={e => { e.preventDefault(); exec('justifyCenter'); }}><AlignCenter size={16} /></button>
          <button style={tbBtn(active.right)} title="Align right" onMouseDown={e => { e.preventDefault(); exec('justifyRight'); }}><AlignRight size={16} /></button>
          {sep}
          <button style={tbBtn()} title="Bulleted list" onMouseDown={e => { e.preventDefault(); exec('insertUnorderedList'); }}>•</button>
          <button style={tbBtn()} title="Numbered list" onMouseDown={e => { e.preventDefault(); exec('insertOrderedList'); }}>1.</button>
          {sep}
          <button style={tbBtn()} title="Quote" onMouseDown={e => { e.preventDefault(); exec('formatBlock', 'blockquote'); }}>“</button>
          <button style={tbBtn()} title="Divider" onMouseDown={e => { e.preventDefault(); exec('insertHorizontalRule'); }}>—</button>
          <button style={tbBtn()} title="Clear formatting" onMouseDown={e => { e.preventDefault(); exec('removeFormat'); }}>✕</button>
        </div>

        {/* White page */}
        <div
          ref={ref}
          contentEditable
          suppressContentEditableWarning
          onKeyUp={refreshActive}
          onMouseUp={refreshActive}
          style={{ background: '#fff', color: '#111', fontFamily: 'Georgia, "Times New Roman", serif', width: '100%', minHeight: '64vh', padding: 44, borderRadius: 8, outline: 'none', lineHeight: 1.6, fontSize: 16, marginBottom: 8 }}
        />
      </div>
    </div>
  );
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
