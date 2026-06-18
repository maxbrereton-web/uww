import type React from 'react';
import { useEffect, useRef } from 'react';
import {
  Bold, Italic, Underline, Strikethrough, AlignLeft, AlignCenter, AlignRight,
  List, ListOrdered, Quote, Minus, RemoveFormatting, Heading, X,
} from 'lucide-react';
import { useStore } from '../../store';

const condensed: React.CSSProperties = {
  fontStretch: '75%', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.02em',
};

// execCommand is deprecated but acceptable for this prototype.
function exec(cmd: string, value?: string) {
  document.execCommand(cmd, false, value);
}

export default function DocEditor() {
  const item = useStore(s => s.docEditorItem);
  const eventId = useStore(s => s.selectedEventId);
  const saveDoc = useStore(s => s.saveDoc);
  const close = useStore(s => s.closeDocEditor);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current && item) {
      ref.current.innerHTML = item.content || '';
    }
    // run once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!item || !eventId) return null;

  const tbBtn: React.CSSProperties = {
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
    width: 32, height: 32, borderRadius: 6, cursor: 'pointer',
    border: '1px solid var(--border)', background: 'var(--control)', color: 'var(--text)',
  };

  const onSave = () => {
    saveDoc(eventId, item.id, ref.current?.innerHTML || '');
  };

  return (
    <div
      style={{
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,.6)', zIndex: 120,
        display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '24px 16px', overflowY: 'auto',
      }}
    >
      <div
        className="uww-overlay"
        style={{ width: '100%', maxWidth: 880, display: 'flex', flexDirection: 'column', gap: 12 }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ ...condensed, fontSize: 14, color: '#fff' }}>{item.name}</div>
          <button onClick={close} style={{ background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer', padding: 4 }} aria-label="Close">
            <X size={20} />
          </button>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, background: 'var(--panel)', border: '1px solid var(--border-strong)', borderRadius: 10, padding: 8 }}>
          <button style={tbBtn} title="Heading" onMouseDown={e => { e.preventDefault(); exec('formatBlock', 'H2'); }}><Heading size={16} /></button>
          <select
            defaultValue="3"
            title="Font size"
            onChange={e => exec('fontSize', e.target.value)}
            style={{ height: 32, borderRadius: 6, border: '1px solid var(--border)', background: 'var(--field)', color: 'var(--text)', fontSize: 12, padding: '0 6px', cursor: 'pointer' }}
          >
            <option value="1">XS</option>
            <option value="2">S</option>
            <option value="3">M</option>
            <option value="4">L</option>
            <option value="5">XL</option>
            <option value="6">XXL</option>
          </select>
          <button style={tbBtn} title="Bold" onMouseDown={e => { e.preventDefault(); exec('bold'); }}><Bold size={16} /></button>
          <button style={tbBtn} title="Italic" onMouseDown={e => { e.preventDefault(); exec('italic'); }}><Italic size={16} /></button>
          <button style={tbBtn} title="Underline" onMouseDown={e => { e.preventDefault(); exec('underline'); }}><Underline size={16} /></button>
          <button style={tbBtn} title="Strikethrough" onMouseDown={e => { e.preventDefault(); exec('strikeThrough'); }}><Strikethrough size={16} /></button>
          <button style={tbBtn} title="Align left" onMouseDown={e => { e.preventDefault(); exec('justifyLeft'); }}><AlignLeft size={16} /></button>
          <button style={tbBtn} title="Align center" onMouseDown={e => { e.preventDefault(); exec('justifyCenter'); }}><AlignCenter size={16} /></button>
          <button style={tbBtn} title="Align right" onMouseDown={e => { e.preventDefault(); exec('justifyRight'); }}><AlignRight size={16} /></button>
          <button style={tbBtn} title="Bulleted list" onMouseDown={e => { e.preventDefault(); exec('insertUnorderedList'); }}><List size={16} /></button>
          <button style={tbBtn} title="Numbered list" onMouseDown={e => { e.preventDefault(); exec('insertOrderedList'); }}><ListOrdered size={16} /></button>
          <button style={tbBtn} title="Blockquote" onMouseDown={e => { e.preventDefault(); exec('formatBlock', 'blockquote'); }}><Quote size={16} /></button>
          <button style={tbBtn} title="Divider" onMouseDown={e => { e.preventDefault(); exec('insertHorizontalRule'); }}><Minus size={16} /></button>
          <button style={tbBtn} title="Clear formatting" onMouseDown={e => { e.preventDefault(); exec('removeFormat'); }}><RemoveFormatting size={16} /></button>
        </div>

        <div
          ref={ref}
          contentEditable
          suppressContentEditableWarning
          style={{
            background: '#fff', color: '#111', fontFamily: 'Georgia, "Times New Roman", serif',
            maxWidth: 800, width: '100%', minHeight: '70vh', margin: '0 auto', padding: 40,
            borderRadius: 6, outline: 'none', lineHeight: 1.6, fontSize: 16,
          }}
        />

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, paddingBottom: 8 }}>
          <button
            onClick={close}
            style={{ ...condensed, fontSize: 12, padding: '9px 16px', cursor: 'pointer', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--control)', color: 'var(--text)' }}
          >
            Cancel
          </button>
          <button
            onClick={onSave}
            style={{ ...condensed, fontSize: 12, padding: '9px 20px', cursor: 'pointer', borderRadius: 8, border: 'none', background: 'var(--accent)', color: '#fff' }}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
