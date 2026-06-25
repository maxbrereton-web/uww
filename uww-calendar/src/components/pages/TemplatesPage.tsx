import type React from 'react';
import { useEffect, useRef, useState } from 'react';
import { Plus, X, AlignLeft, AlignCenter, AlignRight } from 'lucide-react';
import { useStore } from '../../store';
import type { EventTemplate, DocTemplate, EventType, Priority } from '../../types';
import { eventTypeLabel, genId, compTypesFor, eventHasAge, compHasRegion } from '../../data/utils';
import { AGE_RANGES, REGIONS, EVENT_TYPES } from '../../data/seed';
import PriorityDot from '../common/PriorityDot';

const BAR_COLORS = [
  '#F15A22', '#F7941E', '#ED1C24', '#0089CF', '#1d6fae', '#AB2A4D', '#4a9460', '#2e9e5b', '#14b8a6', '#46439e',
  '#7c3aed', '#d6457f', '#CFA63A', '#b0490c', '#64748b', '#13162a', '#c9ccd6',
];

const tplLabel: React.CSSProperties = {
  fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '.08em',
  fontWeight: 700, display: 'block', marginBottom: 9,
};

const tplSelect: React.CSSProperties = {
  width: '100%', padding: '13px 14px', background: 'var(--field)', color: 'var(--text)',
  border: '1px solid var(--border-strong)', borderRadius: 10, fontSize: 14, outline: 'none',
  fontFamily: 'inherit', cursor: 'pointer',
};

const condensed: React.CSSProperties = {
  fontStretch: '75%', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.02em',
};

const PRIORITIES: Priority[] = ['top', 'mid', 'low'];

function EditEventTemplateModal({ tpl, onClose }: { tpl: EventTemplate; onClose: () => void }) {
  const updateTemplate = useStore(s => s.updateTemplate);
  const [name, setName] = useState(tpl.name);
  const [eventType, setEventType] = useState<EventType>((tpl.eventType || 'wrestling') as EventType);
  const [competitionType, setCompetitionType] = useState(tpl.competitionType);
  const [ageRange, setAgeRange] = useState(tpl.ageRange || 'Senior');
  const [region, setRegion] = useState(tpl.region || '');
  const [priority, setPriority] = useState<Priority>(tpl.priority);
  const [barColor, setBarColor] = useState(tpl.barColor || '');

  const compOpts = compTypesFor(eventType);
  const showComp = compOpts.length > 0;
  const showAge = eventHasAge(eventType);
  const rankingLocked = competitionType === 'Ranking Series';
  const showRegion = compHasRegion(competitionType);

  const pickType = (et: EventType) => { setEventType(et); setCompetitionType(''); setRegion(''); };
  const pickComp = (c: string) => {
    setCompetitionType(c);
    if (c === 'Ranking Series') setAgeRange('Senior');
    if (!compHasRegion(c)) setRegion('');
  };

  const save = () => {
    updateTemplate('events', tpl.id, {
      name: name.trim() || 'Untitled', eventType,
      competitionType: showComp ? competitionType : '',
      ageRange: showAge ? ageRange : '',
      region: showRegion ? region : '',
      priority, barColor,
    });
    onClose();
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.5)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }} onClick={onClose}>
      <div className="uww-overlay" style={{ width: 480, maxWidth: '100%', maxHeight: '92vh', overflowY: 'auto', background: 'var(--panel)', border: '1px solid var(--border-strong)', borderRadius: 16, boxShadow: 'var(--shadow)', padding: 26 }} onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <div style={{ ...condensed, fontSize: 19 }}>Event Template</div>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 4 }} aria-label="Close"><X size={20} /></button>
        </div>

        <input value={name} placeholder="Template name" onChange={e => setName(e.target.value)} style={{ width: '100%', padding: '13px 15px', background: 'var(--field)', color: 'var(--text)', border: '1px solid var(--border-strong)', borderRadius: 10, fontSize: 15, outline: 'none', fontFamily: 'inherit', marginBottom: 18 }} />

        <label style={tplLabel}>Priority</label>
        <div style={{ display: 'flex', gap: 12, marginBottom: 18 }}>
          {PRIORITIES.map(p => {
            const on = priority === p;
            return (
              <button
                key={p}
                onClick={() => setPriority(p)}
                style={{ ...condensed, flex: 1, padding: '13px 6px', fontSize: 13, cursor: 'pointer', borderRadius: 10, border: '1px solid ' + (on ? '#c9ccd6' : 'var(--border-strong)'), background: on ? '#c9ccd6' : 'transparent', color: on ? '#13162a' : 'var(--text)' }}
              >
                {p}
              </button>
            );
          })}
        </div>

        <select value={eventType} onChange={e => pickType(e.target.value as EventType)} style={{ ...tplSelect, marginBottom: 14 }}>
          {EVENT_TYPES.map(t => <option key={t} value={t}>{eventTypeLabel(t)}</option>)}
        </select>

        {showComp && (
          <select value={competitionType} onChange={e => pickComp(e.target.value)} style={{ ...tplSelect, marginBottom: 14, color: competitionType ? 'var(--text)' : 'var(--text-muted)' }}>
            <option value="">Competition type…</option>
            {compOpts.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        )}

        {showRegion && (
          <select value={region} onChange={e => setRegion(e.target.value)} style={{ ...tplSelect, marginBottom: 14, color: region ? 'var(--text)' : 'var(--text-muted)' }}>
            <option value="">Region…</option>
            {REGIONS.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
        )}

        {showAge && (
          rankingLocked ? (
            <select value="Senior" disabled style={{ ...tplSelect, marginBottom: 18, opacity: 0.6 }}>
              <option value="Senior">Senior (Ranking Series)</option>
            </select>
          ) : (
            <select value={ageRange} onChange={e => setAgeRange(e.target.value)} style={{ ...tplSelect, marginBottom: 18, color: ageRange ? 'var(--text)' : 'var(--text-muted)' }}>
              <option value="">Age range…</option>
              {AGE_RANGES.map(a => <option key={a} value={a}>{a}</option>)}
            </select>
          )
        )}

        <label style={tplLabel}>Calendar Bar Colour</label>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 22 }}>
          {BAR_COLORS.map(c => {
            const on = barColor === c;
            return (
              <div
                key={c}
                onClick={() => setBarColor(on ? '' : c)}
                title={c}
                style={{ width: 34, height: 34, borderRadius: 9, cursor: 'pointer', background: c, border: on ? '3px solid var(--text)' : '1px solid var(--border-strong)', boxShadow: on ? '0 0 0 2px var(--panel) inset' : 'none' }}
              />
            );
          })}
        </div>

        <button onClick={save} style={{ ...condensed, fontSize: 15, width: '100%', padding: '15px', borderRadius: 11, border: 'none', background: 'var(--accent-deep)', color: '#fff', cursor: 'pointer', boxShadow: '0 6px 16px rgba(241,90,34,.32)' }}>
          Save Template
        </button>
      </div>
    </div>
  );
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
