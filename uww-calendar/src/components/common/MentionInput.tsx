import type React from 'react';
import { useRef, useState } from 'react';
import { useStore, currentUser } from '../../store';
import { defaultHandle } from '../../data/mentions';
import Avatar from './Avatar';

interface Props {
  value: string;
  onChange: (v: string) => void;
  onEnter?: () => void;
  placeholder?: string;
  multiline?: boolean;
  rows?: number;
  style?: React.CSSProperties;
  autoFocus?: boolean;
  disabled?: boolean;
}

const condensedLabel: React.CSSProperties = {
  fontStretch: '75%', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.08em',
  fontSize: 10, color: 'var(--text-muted)', padding: '10px 14px 6px',
};

/**
 * Text field (input or textarea) with an @-mention autocomplete.
 * Typing "@" opens a "Notify someone" picker; choosing a person inserts
 * their @handle. Mentions are turned into notifications by the store when
 * the message is actually sent.
 */
export default function MentionInput({
  value, onChange, onEnter, placeholder, multiline, rows = 1, style, autoFocus, disabled,
}: Props) {
  const staff = useStore(s => s.staff);
  const usernames = useStore(s => s.usernames);
  const cu = useStore(currentUser);
  const ref = useRef<HTMLInputElement | HTMLTextAreaElement | null>(null);

  // query === null → dropdown closed. Otherwise it's the text typed after "@".
  const [query, setQuery] = useState<string | null>(null);
  const [sel, setSel] = useState(0);

  const handleOf = (id: string, name: string) => usernames[id] || defaultHandle(name);

  const candidates = query === null ? [] : staff
    .filter(m => m.id !== cu)
    .filter(m => {
      const q = query.toLowerCase();
      return handleOf(m.id, m.name).toLowerCase().includes(q) || m.name.toLowerCase().includes(q);
    })
    .slice(0, 6);

  const detect = (val: string, caret: number) => {
    const upto = val.slice(0, caret);
    const m = /(?:^|\s)@([a-z0-9._]*)$/i.exec(upto);
    if (m) { setQuery(m[1]); setSel(0); } else setQuery(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const val = e.target.value;
    onChange(val);
    detect(val, e.target.selectionStart ?? val.length);
  };

  const insert = (id: string, name: string) => {
    const el = ref.current;
    const caret = el?.selectionStart ?? value.length;
    const upto = value.slice(0, caret);
    const after = value.slice(caret);
    const m = /(?:^|\s)@([a-z0-9._]*)$/i.exec(upto);
    if (!m) { setQuery(null); return; }
    const start = caret - m[1].length - 1; // index of the "@"
    const handle = handleOf(id, name);
    const newVal = `${value.slice(0, start)}@${handle} ${after}`;
    onChange(newVal);
    setQuery(null);
    const newCaret = start + handle.length + 2;
    requestAnimationFrame(() => { el?.focus(); el?.setSelectionRange(newCaret, newCaret); });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (query !== null && candidates.length > 0) {
      if (e.key === 'ArrowDown') { e.preventDefault(); setSel(s => (s + 1) % candidates.length); return; }
      if (e.key === 'ArrowUp') { e.preventDefault(); setSel(s => (s - 1 + candidates.length) % candidates.length); return; }
      if (e.key === 'Enter' || e.key === 'Tab') { e.preventDefault(); insert(candidates[sel].id, candidates[sel].name); return; }
      if (e.key === 'Escape') { e.preventDefault(); setQuery(null); return; }
    }
    if (e.key === 'Enter' && !multiline && !e.shiftKey) {
      e.preventDefault();
      onEnter?.();
    }
  };

  const common = {
    ref: ref as never,
    value,
    placeholder,
    autoFocus,
    disabled,
    onChange: handleChange,
    onKeyDown: handleKeyDown,
    onBlur: () => setTimeout(() => setQuery(null), 130),
    style,
  };

  return (
    <div style={{ position: 'relative', flex: style?.flex ?? 1, minWidth: 0 }}>
      {query !== null && candidates.length > 0 && (
        <div
          style={{
            position: 'absolute', bottom: 'calc(100% + 8px)', left: 0, minWidth: 240, maxWidth: 320, zIndex: 200,
            background: 'var(--panel)', border: '1px solid var(--border-strong)', borderRadius: 14,
            boxShadow: 'var(--shadow)', overflow: 'hidden',
          }}
        >
          <div style={condensedLabel}>Notify someone</div>
          <div style={{ paddingBottom: 6 }}>
            {candidates.map((m, i) => (
              <div
                key={m.id}
                onMouseDown={e => { e.preventDefault(); insert(m.id, m.name); }}
                onMouseEnter={() => setSel(i)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 11, padding: '8px 14px', cursor: 'pointer',
                  background: i === sel ? 'var(--control)' : 'transparent',
                }}
              >
                <Avatar staffId={m.id} size={34} />
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 800, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{m.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>@{handleOf(m.id, m.name)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      {multiline
        ? <textarea {...common} rows={rows} />
        : <input {...common} />}
    </div>
  );
}
