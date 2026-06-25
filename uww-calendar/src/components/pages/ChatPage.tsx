import type React from 'react';
import { useEffect, useRef, useState } from 'react';
import { Search, Users, X, ArrowLeft, Paperclip, Camera } from 'lucide-react';
import { useStore, currentUser, effectiveView } from '../../store';
import type { Message } from '../../types';
import Avatar from '../common/Avatar';
import AttachmentCard from '../common/AttachmentCard';

function InstagramIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

const condensed: React.CSSProperties = {
  fontStretch: '75%', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.02em',
};

const sectionLabel: React.CSSProperties = {
  fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '.1em',
  fontWeight: 700, padding: '14px 14px 8px',
};

const modalLabel: React.CSSProperties = {
  fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '.08em',
  fontWeight: 700, display: 'block', marginBottom: 9,
};

function dmKey(a: string, b: string): string {
  return [a, b].sort().join('|');
}

function cropSquare(file: File, cb: (dataUrl: string) => void) {
  const reader = new FileReader();
  reader.onload = () => {
    const img = new Image();
    img.onload = () => {
      const side = Math.min(img.width, img.height);
      const sx = (img.width - side) / 2;
      const sy = (img.height - side) / 2;
      const canvas = document.createElement('canvas');
      canvas.width = 256; canvas.height = 256;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      ctx.drawImage(img, sx, sy, side, side, 0, 0, 256, 256);
      cb(canvas.toDataURL('image/jpeg', 0.9));
    };
    img.src = reader.result as string;
  };
  reader.readAsDataURL(file);
}

function NewGroupModal() {
  const staff = useStore(s => s.staff);
  const events = useStore(s => s.events);
  const detail = useStore(s => s.detail);
  const cu = useStore(currentUser);
  const setNewGroupModal = useStore(s => s.setNewGroupModal);
  const newGroupName = useStore(s => s.newGroupName);
  const setNewGroupName = useStore(s => s.setNewGroupName);
  const newGroupMembers = useStore(s => s.newGroupMembers);
  const setNewGroupMembers = useStore(s => s.setNewGroupMembers);
  const createGroup = useStore(s => s.createGroup);

  const others = staff.filter(m => m.id !== cu);
  const [photo, setPhoto] = useState<string | undefined>(undefined);
  const [eventId, setEventId] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  // default: everyone ticked
  useEffect(() => {
    if (newGroupMembers.length === 0) setNewGroupMembers(others.map(m => m.id));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleMember = (id: string) => {
    setNewGroupMembers(newGroupMembers.includes(id) ? newGroupMembers.filter(m => m !== id) : [...newGroupMembers, id]);
  };

  const onPickEvent = (id: string) => {
    setEventId(id);
    if (!id) return;
    const ev = events.find(e => e.id === id);
    if (!ev) return;
    const team = (detail[id]?.members?.map(m => m.id) ?? ev.staff).filter(mid => mid !== cu);
    setNewGroupMembers([...new Set(team)]);
    setNewGroupName(ev.name);
  };

  const onFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) cropSquare(file, setPhoto);
  };

  const create = () => {
    if (newGroupMembers.length === 0) return;
    createGroup(newGroupName.trim() || 'New Group', [cu, ...newGroupMembers], photo);
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.5)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }} onClick={() => setNewGroupModal(false)}>
      <div className="uww-overlay" style={{ width: 480, maxWidth: '100%', maxHeight: '92vh', overflowY: 'auto', background: 'var(--panel)', border: '1px solid var(--border-strong)', borderRadius: 16, boxShadow: 'var(--shadow)', padding: 26 }} onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 22 }}>
          <div style={{ ...condensed, fontSize: 19 }}>New Group</div>
          <button onClick={() => setNewGroupModal(false)} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 4 }} aria-label="Close"><X size={20} /></button>
        </div>

        {/* Icon + name */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 22 }}>
          <div
            onClick={() => fileRef.current?.click()}
            title="Upload group icon"
            style={{ position: 'relative', width: 64, height: 64, borderRadius: '50%', flex: '0 0 64px', cursor: 'pointer', background: photo ? `center/cover no-repeat url(${photo})` : 'var(--accent-deep)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            {!photo && <span style={{ color: '#fff', fontSize: 30, fontWeight: 800 }}>#</span>}
            <div style={{ position: 'absolute', right: -2, bottom: -2, width: 24, height: 24, borderRadius: '50%', background: 'var(--accent-deep)', border: '3px solid var(--panel)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
              <Camera size={11} />
            </div>
          </div>
          <input ref={fileRef} type="file" accept="image/*" onChange={onFile} style={{ display: 'none' }} />
          <input value={newGroupName} placeholder="Group name" onChange={e => setNewGroupName(e.target.value)} style={{ flex: 1, padding: '13px 15px', background: 'var(--field)', color: 'var(--text)', border: '1px solid var(--border-strong)', borderRadius: 10, fontSize: 15, outline: 'none', fontFamily: 'inherit' }} />
        </div>

        {/* Create from event */}
        <label style={modalLabel}>Create from event</label>
        <select value={eventId} onChange={e => onPickEvent(e.target.value)} style={{ width: '100%', padding: '13px 14px', background: 'var(--field)', color: eventId ? 'var(--text)' : 'var(--text-muted)', border: '1px solid var(--border-strong)', borderRadius: 10, fontSize: 14, fontFamily: 'inherit', marginBottom: 22, cursor: 'pointer' }}>
          <option value="">Choose event</option>
          {events.map(ev => <option key={ev.id} value={ev.id}>{ev.name}</option>)}
        </select>

        {/* Members */}
        <label style={modalLabel}>Add members</label>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 24 }}>
          {others.map(m => {
            const checked = newGroupMembers.includes(m.id);
            return (
              <div key={m.id} onClick={() => toggleMember(m.id)} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '8px 4px', cursor: 'pointer' }}>
                <div style={{ width: 22, height: 22, borderRadius: 6, border: '1.5px solid ' + (checked ? 'var(--border-strong)' : 'var(--border-strong)'), background: checked ? 'var(--field)' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text)', fontSize: 13, flex: '0 0 22px' }}>
                  {checked ? '✓' : ''}
                </div>
                <Avatar staffId={m.id} size={34} />
                <span style={{ fontSize: 14.5, fontWeight: 700 }}>{m.name}</span>
              </div>
            );
          })}
        </div>

        <button onClick={create} disabled={newGroupMembers.length === 0} style={{ ...condensed, fontSize: 15, width: '100%', padding: '15px', borderRadius: 11, border: 'none', background: newGroupMembers.length ? 'var(--accent-deep)' : 'var(--control)', color: newGroupMembers.length ? '#fff' : 'var(--text-faint)', cursor: newGroupMembers.length ? 'pointer' : 'not-allowed', boxShadow: newGroupMembers.length ? '0 6px 16px rgba(241,90,34,.32)' : 'none' }}>
          Create Group
        </button>
      </div>
    </div>
  );
}

function EditGroupModal() {
  const groups = useStore(s => s.groups);
  const staff = useStore(s => s.staff);
  const cu = useStore(currentUser);
  const editGroupId = useStore(s => s.editGroupId);
  const setEditGroupModal = useStore(s => s.setEditGroupModal);
  const editGroup = useStore(s => s.editGroup);
  const deleteGroup = useStore(s => s.deleteGroup);

  const group = groups.find(g => g.id === editGroupId);
  const others = staff.filter(m => m.id !== cu);
  const fileRef = useRef<HTMLInputElement>(null);
  const [name, setName] = useState(group?.name || '');
  const [photo, setPhoto] = useState<string | undefined>(group?.photo);
  const [members, setMembers] = useState<string[]>((group?.members || []).filter(id => id !== cu));
  const [confirmDelete, setConfirmDelete] = useState(false);

  if (!group) return null;

  const toggle = (id: string) => setMembers(members.includes(id) ? members.filter(m => m !== id) : [...members, id]);
  const onFile = (e: React.ChangeEvent<HTMLInputElement>) => { const f = e.target.files?.[0]; if (f) cropSquare(f, setPhoto); };
  const save = () => editGroup(group.id, name.trim() || group.name, [cu, ...members], photo);

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.5)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }} onClick={() => setEditGroupModal(null)}>
      <div className="uww-overlay" style={{ width: 480, maxWidth: '100%', maxHeight: '92vh', overflowY: 'auto', background: 'var(--panel)', border: '1px solid var(--border-strong)', borderRadius: 16, boxShadow: 'var(--shadow)', padding: 26 }} onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 22 }}>
          <div style={{ ...condensed, fontSize: 19 }}>Edit Group</div>
          <button onClick={() => setEditGroupModal(null)} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 4 }} aria-label="Close"><X size={20} /></button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 22 }}>
          <div onClick={() => fileRef.current?.click()} title="Upload group icon" style={{ position: 'relative', width: 64, height: 64, borderRadius: '50%', flex: '0 0 64px', cursor: 'pointer', background: photo ? `center/cover no-repeat url(${photo})` : 'var(--accent-deep)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {!photo && <span style={{ color: '#fff', fontSize: 30, fontWeight: 800 }}>#</span>}
            <div style={{ position: 'absolute', right: -2, bottom: -2, width: 24, height: 24, borderRadius: '50%', background: 'var(--accent-deep)', border: '3px solid var(--panel)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}><Camera size={11} /></div>
          </div>
          <input ref={fileRef} type="file" accept="image/*" onChange={onFile} style={{ display: 'none' }} />
          <input value={name} placeholder="Group name" onChange={e => setName(e.target.value)} style={{ flex: 1, padding: '13px 15px', background: 'var(--field)', color: 'var(--text)', border: '1px solid var(--border-strong)', borderRadius: 10, fontSize: 15, outline: 'none', fontFamily: 'inherit' }} />
        </div>

        <label style={modalLabel}>Members</label>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 24 }}>
          {others.map(m => {
            const checked = members.includes(m.id);
            return (
              <div key={m.id} onClick={() => toggle(m.id)} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '8px 4px', cursor: 'pointer' }}>
                <div style={{ width: 22, height: 22, borderRadius: 6, border: '1.5px solid var(--border-strong)', background: checked ? 'var(--field)' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text)', fontSize: 13, flex: '0 0 22px' }}>{checked ? '✓' : ''}</div>
                <Avatar staffId={m.id} size={34} />
                <span style={{ fontSize: 14.5, fontWeight: 700 }}>{m.name}</span>
              </div>
            );
          })}
        </div>

        <button onClick={save} style={{ ...condensed, fontSize: 15, width: '100%', padding: '15px', borderRadius: 11, border: 'none', background: 'var(--accent-deep)', color: '#fff', cursor: 'pointer', boxShadow: '0 6px 16px rgba(241,90,34,.32)' }}>
          Save Changes
        </button>

        {/* Delete group */}
        {confirmDelete ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 14, padding: '12px 14px', border: '1px solid #ED1C24', borderRadius: 11, background: 'color-mix(in srgb, #ED1C24 10%, transparent)' }}>
            <span style={{ flex: 1, fontSize: 13, color: 'var(--text)' }}>Delete this group for everyone?</span>
            <button onClick={() => deleteGroup(group.id)} style={{ ...condensed, fontSize: 12, padding: '8px 14px', borderRadius: 8, border: 'none', background: '#ED1C24', color: '#fff', cursor: 'pointer' }}>Delete</button>
            <button onClick={() => setConfirmDelete(false)} style={{ ...condensed, fontSize: 12, padding: '8px 14px', borderRadius: 8, border: '1px solid var(--border-strong)', background: 'var(--control)', color: 'var(--text-muted)', cursor: 'pointer' }}>Cancel</button>
          </div>
        ) : (
          <button onClick={() => setConfirmDelete(true)} style={{ ...condensed, fontSize: 12, width: '100%', padding: '12px', marginTop: 10, borderRadius: 11, border: '1px solid var(--border-strong)', background: 'transparent', color: '#ED1C24', cursor: 'pointer' }}>
            Delete Group
          </button>
        )}
      </div>
    </div>
  );
}

type Att = { name: string; url: string };

function Composer({ onSend }: { onSend: (text: string, att?: Att) => void }) {
  const [text, setText] = useState('');
  const [att, setAtt] = useState<Att | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const send = () => {
    const v = text.trim();
    if (!v && !att) return;
    onSend(v, att || undefined);
    setText('');
    setAtt(null);
  };
  const onFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setAtt({ name: file.name, url: reader.result as string });
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  return (
    <div style={{ padding: 14, borderTop: '1px solid var(--border)' }}>
      {att && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 9, padding: '7px 11px', background: 'var(--field)', border: '1px solid var(--border-strong)', borderRadius: 9 }}>
          <Paperclip size={14} color="var(--accent)" />
          <span style={{ flex: 1, minWidth: 0, fontSize: 12.5, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{att.name}</span>
          <X size={15} style={{ cursor: 'pointer', color: 'var(--text-muted)', flex: '0 0 auto' }} onClick={() => setAtt(null)} />
        </div>
      )}
      <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
        <input
          value={text}
          placeholder="Write a message…"
          onChange={e => setText(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); send(); } }}
          style={{ flex: 1, padding: '12px 14px', background: 'var(--field)', color: 'var(--text)', border: '1px solid var(--border-strong)', borderRadius: 9, fontSize: 13.5, outline: 'none', fontFamily: 'inherit' }}
        />
        <input ref={fileRef} type="file" onChange={onFile} style={{ display: 'none' }} />
        <button type="button" title="Attach a file" onClick={() => fileRef.current?.click()} style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 44, height: 44, borderRadius: 9, background: att ? 'color-mix(in srgb, var(--accent-deep) 20%, var(--field))' : 'var(--field)', border: '1px solid ' + (att ? 'var(--accent-deep)' : 'var(--border-strong)'), color: att ? 'var(--accent)' : 'var(--text-muted)', cursor: 'pointer', flex: '0 0 auto' }}>
          <Paperclip size={17} />
        </button>
        <button onClick={send} style={{ ...condensed, fontSize: 13, padding: '0 22px', height: 44, borderRadius: 9, border: 'none', background: 'var(--accent-deep)', color: '#fff', cursor: 'pointer', flex: '0 0 auto' }}>
          Send
        </button>
      </div>
    </div>
  );
}

export default function ChatPage() {
  const viewMode = useStore(effectiveView);
  const staff = useStore(s => s.staff);
  const groups = useStore(s => s.groups);
  const dms = useStore(s => s.dms);
  const chatActive = useStore(s => s.chatActive);
  const cu = useStore(currentUser);
  const usernames = useStore(s => s.usernames);
  const instagram = useStore(s => s.instagram);
  const newGroupModal = useStore(s => s.newGroupModal);
  const editGroupModal = useStore(s => s.editGroupModal);

  const setChatActive = useStore(s => s.setChatActive);
  const sendDm = useStore(s => s.sendDm);
  const sendGroup = useStore(s => s.sendGroup);
  const setNewGroupModal = useStore(s => s.setNewGroupModal);
  const setEditGroupModal = useStore(s => s.setEditGroupModal);

  const [filter, setFilter] = useState('');

  const q = filter.trim().toLowerCase();
  const handleOf = (id: string) => usernames[id] || (staff.find(m => m.id === id)?.name || id).toLowerCase().replace(/[^a-z0-9]/g, '');
  const dmStaff = staff
    .filter(m => m.id !== cu)
    .filter(m => {
      if (!q) return true;
      if (m.name.toLowerCase().includes(q)) return true;
      const arr = dms[dmKey(cu, m.id)] || [];
      return arr.some(msg => msg.text.toLowerCase().includes(q));
    });
  const myGroups = groups.filter(g => g.members.includes(cu)).filter(g => !q || g.name.toLowerCase().includes(q));

  const isGroup = !!chatActive && chatActive.startsWith('g:');
  const activeGroup = isGroup ? groups.find(g => g.id === chatActive!.slice(2)) : undefined;
  const activeStaff = chatActive && !isGroup ? staff.find(m => m.id === chatActive) : undefined;

  // Auto-select the first conversation on web
  useEffect(() => {
    if (viewMode !== 'mobile' && !chatActive && dmStaff.length > 0) setChatActive(dmStaff[0].id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [viewMode]);

  const threadMessages: Message[] = isGroup ? (activeGroup?.messages || []) : (activeStaff ? (dms[dmKey(cu, activeStaff.id)] || []) : []);
  const lastDmPreview = (otherId: string): string => {
    const arr = dms[dmKey(cu, otherId)];
    return arr && arr.length ? arr[arr.length - 1].text : 'Start a conversation';
  };
  const onSend = (txt: string, att?: Att) => {
    if (isGroup && activeGroup) sendGroup(activeGroup.id, txt, att);
    else if (activeStaff) sendDm(activeStaff.id, txt, att);
  };

  const renderSidebar = () => (
    <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
      <div style={sectionLabel}>Direct Messages</div>
      {dmStaff.map(m => {
        const active = chatActive === m.id;
        return (
          <div
            key={m.id}
            onClick={() => setChatActive(m.id)}
            style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '10px 12px', margin: '0 8px', borderRadius: 10, cursor: 'pointer', background: active ? 'var(--control)' : 'transparent', border: active ? '1px solid var(--border-strong)' : '1px solid transparent' }}
          >
            <Avatar staffId={m.id} size={36} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13.5, fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{m.name}</div>
              <div style={{ fontSize: 11.5, color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{lastDmPreview(m.id)}</div>
            </div>
          </div>
        );
      })}

      <div style={{ borderTop: '1px solid var(--border)', marginTop: 10 }} />
      <div style={sectionLabel}>Groups</div>
      {myGroups.map(g => {
        const active = chatActive === 'g:' + g.id;
        return (
          <div key={g.id} onClick={() => setChatActive('g:' + g.id)} style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '10px 12px', margin: '0 8px', borderRadius: 10, cursor: 'pointer', background: active ? 'var(--control)' : 'transparent', border: active ? '1px solid var(--border-strong)' : '1px solid transparent' }}>
            {g.photo ? (
              <div style={{ width: 36, height: 36, borderRadius: '50%', backgroundImage: `url(${g.photo})`, backgroundSize: 'cover', backgroundPosition: 'center', flex: '0 0 auto', border: '1.5px solid var(--border-strong)' }} />
            ) : (
              <div style={{ width: 36, height: 36, borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: 'var(--control)', border: '1.5px solid var(--border-strong)', flex: '0 0 auto' }}>
                <Users size={17} color="var(--text-muted)" />
              </div>
            )}
            <div style={{ fontSize: 13.5, fontWeight: 700 }}>{g.name}</div>
          </div>
        );
      })}
      {myGroups.length === 0 && (
        <div style={{ padding: '18px 12px', fontSize: 12, color: 'var(--text-faint)', textAlign: 'center' }}>No groups yet.</div>
      )}
    </div>
  );

  const threadTitle = isGroup ? (activeGroup?.name || 'Group') : (activeStaff?.name || '');
  const activeIg = activeStaff ? instagram[activeStaff.id] : undefined;

  const firstName = (id: string) => (staff.find(m => m.id === id)?.name || id).split(' ')[0];
  const groupMemberNames = activeGroup ? activeGroup.members.map(firstName).join(', ') : '';

  const renderThreadPane = (withBack: boolean) => (
    <>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', borderBottom: '1px solid var(--border)' }}>
        {withBack && (
          <button onClick={() => setChatActive(null)} aria-label="Back" style={{ background: 'transparent', border: 'none', color: 'var(--text)', cursor: 'pointer', padding: 4 }}><ArrowLeft size={18} /></button>
        )}
        {!isGroup && activeStaff && <Avatar staffId={activeStaff.id} size={34} />}
        {isGroup && (
          activeGroup?.photo ? (
            <div style={{ width: 38, height: 38, borderRadius: '50%', backgroundImage: `url(${activeGroup.photo})`, backgroundSize: 'cover', backgroundPosition: 'center', flex: '0 0 38px' }} />
          ) : (
            <div style={{ width: 38, height: 38, borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: 'var(--accent-deep)', flex: '0 0 38px' }}><span style={{ color: '#fff', fontSize: 18, fontWeight: 800 }}>#</span></div>
          )
        )}
        {isGroup ? (
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 15, fontWeight: 800, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{threadTitle}</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{groupMemberNames}</div>
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 9, flex: 1, minWidth: 0 }}>
            <span style={{ fontSize: 15, fontWeight: 800 }}>{threadTitle}</span>
            {activeStaff && <span style={{ fontSize: 12.5, color: 'var(--accent)', fontWeight: 600 }}>@{handleOf(activeStaff.id)}</span>}
          </div>
        )}
        {isGroup && activeGroup && (
          <button onClick={() => setEditGroupModal(activeGroup.id)} style={{ ...condensed, fontSize: 12, padding: '8px 14px', borderRadius: 9, border: '1px solid var(--border-strong)', background: 'var(--control)', color: 'var(--text)', cursor: 'pointer', flex: '0 0 auto', whiteSpace: 'nowrap' }}>
            Edit group
          </button>
        )}
        {!isGroup && activeIg && (
          <a href={`https://instagram.com/${activeIg}`} target="_blank" rel="noreferrer" title={`@${activeIg} on Instagram`} style={{ color: 'var(--text-muted)', display: 'inline-flex' }}>
            <InstagramIcon size={18} />
          </a>
        )}
      </div>
      <div style={{ flex: 1, overflowY: 'auto', padding: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
        {threadMessages.map((msg, i) => {
          const own = msg.from === cu;
          const nameOf = (id: string) => staff.find(m => m.id === id)?.name || id;
          return (
            <div key={i} style={{ display: 'flex', justifyContent: own ? 'flex-end' : 'flex-start' }}>
              <div style={{ maxWidth: '72%' }}>
                <div style={{ fontSize: 10.5, color: 'var(--text-muted)', marginBottom: 3, textAlign: own ? 'right' : 'left' }}>{own ? 'You' : nameOf(msg.from)}</div>
                <div style={{ padding: '9px 13px', borderRadius: 12, fontSize: 13.5, background: own ? 'var(--accent-deep)' : 'var(--panel-2)', color: own ? '#fff' : 'var(--text)', border: own ? 'none' : '1px solid var(--border)' }}>
                  {msg.text && <div>{msg.text}</div>}
                  {msg.att && <AttachmentCard att={msg.att} own={own} spaced={!!msg.text} />}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <Composer onSend={onSend} />
    </>
  );

  const toolbar = (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 8, padding: '0 14px', background: 'var(--field)', border: '1px solid var(--border-strong)', borderRadius: 10, height: 40 }}>
        <Search size={16} color="var(--text-muted)" />
        <input value={filter} onChange={e => setFilter(e.target.value)} placeholder="Search…" style={{ flex: 1, border: 'none', outline: 'none', background: 'transparent', color: 'var(--text)', fontSize: 13.5 }} />
      </div>
      <button onClick={() => setNewGroupModal(true)} style={{ ...condensed, fontSize: 12, display: 'inline-flex', alignItems: 'center', gap: 8, padding: '0 16px', height: 40, borderRadius: 10, border: 'none', background: 'var(--accent-deep)', color: '#fff', cursor: 'pointer', boxShadow: '0 6px 16px rgba(241,90,34,.32)' }}>
        + New group
      </button>
    </div>
  );

  // Mobile: single column
  if (viewMode === 'mobile') {
    return (
      <div style={{ padding: '18px 16px', height: '100%', display: 'flex', flexDirection: 'column' }}>
        {!chatActive && toolbar}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'var(--panel)', border: '1px solid var(--border)', borderRadius: 14, overflow: 'hidden', minHeight: 0 }}>
          {chatActive ? renderThreadPane(true) : renderSidebar()}
        </div>
        {newGroupModal && <NewGroupModal />}
        {editGroupModal && <EditGroupModal />}
      </div>
    );
  }

  // Web: toolbar + two bordered panels
  return (
    <div style={{ padding: '18px 24px', height: '100%', display: 'flex', flexDirection: 'column', boxSizing: 'border-box' }}>
      {toolbar}
      <div style={{ flex: 1, display: 'flex', gap: 14, minHeight: 0 }}>
        <div style={{ width: 300, flex: '0 0 300px', display: 'flex', flexDirection: 'column', background: 'var(--panel)', border: '1px solid var(--border)', borderRadius: 14, overflow: 'hidden' }}>
          {renderSidebar()}
        </div>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, background: 'var(--panel)', border: '1px solid var(--border)', borderRadius: 14, overflow: 'hidden' }}>
          {chatActive ? renderThreadPane(false) : (
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-faint)', fontSize: 13 }}>Select a conversation</div>
          )}
        </div>
      </div>
      {newGroupModal && <NewGroupModal />}
      {editGroupModal && <EditGroupModal />}
    </div>
  );
}
