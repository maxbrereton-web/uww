import type React from 'react';
import { useEffect, useState } from 'react';
import { Search, Users, X, ArrowLeft, Paperclip } from 'lucide-react';
import { useStore, currentUser } from '../../store';
import type { Message } from '../../types';
import Avatar from '../common/Avatar';

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

function dmKey(a: string, b: string): string {
  return [a, b].sort().join('|');
}

function NewGroupModal() {
  const staff = useStore(s => s.staff);
  const setNewGroupModal = useStore(s => s.setNewGroupModal);
  const newGroupName = useStore(s => s.newGroupName);
  const setNewGroupName = useStore(s => s.setNewGroupName);
  const newGroupMembers = useStore(s => s.newGroupMembers);
  const setNewGroupMembers = useStore(s => s.setNewGroupMembers);
  const createGroup = useStore(s => s.createGroup);

  const toggleMember = (id: string) => {
    setNewGroupMembers(newGroupMembers.includes(id) ? newGroupMembers.filter(m => m !== id) : [...newGroupMembers, id]);
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.5)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }} onClick={() => setNewGroupModal(false)}>
      <div className="uww-overlay" style={{ width: 420, maxWidth: '100%', maxHeight: '90vh', overflowY: 'auto', background: 'var(--panel)', border: '1px solid var(--border-strong)', borderRadius: 14, boxShadow: 'var(--shadow)', padding: 22 }} onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
          <div style={{ ...condensed, fontSize: 16 }}>New Group</div>
          <button onClick={() => setNewGroupModal(false)} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 4 }} aria-label="Close"><X size={18} /></button>
        </div>
        <div style={{ marginBottom: 16 }}>
          <label style={{ ...sectionLabel, padding: 0, marginBottom: 6, display: 'block' }}>Group Name</label>
          <input value={newGroupName} placeholder="Group name" onChange={e => setNewGroupName(e.target.value)} style={{ width: '100%', padding: '10px 12px', background: 'var(--field)', color: 'var(--text)', border: '1px solid var(--border-strong)', borderRadius: 9, fontSize: 13, outline: 'none' }} />
        </div>
        <div style={{ marginBottom: 22 }}>
          <label style={{ ...sectionLabel, padding: 0, marginBottom: 8, display: 'block' }}>Members</label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {staff.map(m => {
              const checked = newGroupMembers.includes(m.id);
              return (
                <label key={m.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '6px 8px', borderRadius: 8, cursor: 'pointer', background: checked ? 'var(--control)' : 'transparent' }}>
                  <input type="checkbox" checked={checked} onChange={() => toggleMember(m.id)} style={{ cursor: 'pointer' }} />
                  <Avatar staffId={m.id} size={26} />
                  <span style={{ fontSize: 13, fontWeight: 700 }}>{m.name}</span>
                </label>
              );
            })}
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
          <button onClick={() => setNewGroupModal(false)} style={{ ...condensed, fontSize: 12, padding: '9px 16px', cursor: 'pointer', borderRadius: 8, border: '1px solid var(--border-strong)', background: 'var(--control)', color: 'var(--text)' }}>Cancel</button>
          <button onClick={() => createGroup(newGroupName.trim() || 'New Group', newGroupMembers)} disabled={newGroupMembers.length === 0} style={{ ...condensed, fontSize: 12, padding: '9px 20px', borderRadius: 8, border: 'none', background: newGroupMembers.length ? 'var(--accent-deep)' : 'var(--control)', color: newGroupMembers.length ? '#fff' : 'var(--text-faint)', cursor: newGroupMembers.length ? 'pointer' : 'not-allowed' }}>Create</button>
        </div>
      </div>
    </div>
  );
}

function Composer({ onSend }: { onSend: (text: string) => void }) {
  const [text, setText] = useState('');
  const send = () => { const v = text.trim(); if (!v) return; onSend(v); setText(''); };
  return (
    <div style={{ display: 'flex', gap: 10, padding: 14, borderTop: '1px solid var(--border)', alignItems: 'center' }}>
      <input
        value={text}
        placeholder="Write a message…"
        onChange={e => setText(e.target.value)}
        onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); send(); } }}
        style={{ flex: 1, padding: '12px 14px', background: 'var(--field)', color: 'var(--text)', border: '1px solid var(--border-strong)', borderRadius: 9, fontSize: 13.5, outline: 'none', fontFamily: 'inherit' }}
      />
      <button type="button" title="Attach a file" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 44, height: 44, borderRadius: 9, background: 'var(--field)', border: '1px solid var(--border-strong)', color: 'var(--text-muted)', cursor: 'pointer', flex: '0 0 auto' }}>
        <Paperclip size={17} />
      </button>
      <button onClick={send} style={{ ...condensed, fontSize: 13, padding: '0 22px', height: 44, borderRadius: 9, border: 'none', background: 'var(--accent-deep)', color: '#fff', cursor: 'pointer', flex: '0 0 auto' }}>
        Send
      </button>
    </div>
  );
}

export default function ChatPage() {
  const viewMode = useStore(s => s.viewMode);
  const staff = useStore(s => s.staff);
  const groups = useStore(s => s.groups);
  const dms = useStore(s => s.dms);
  const chatActive = useStore(s => s.chatActive);
  const cu = useStore(currentUser);
  const usernames = useStore(s => s.usernames);
  const instagram = useStore(s => s.instagram);
  const newGroupModal = useStore(s => s.newGroupModal);

  const setChatActive = useStore(s => s.setChatActive);
  const sendDm = useStore(s => s.sendDm);
  const sendGroup = useStore(s => s.sendGroup);
  const setNewGroupModal = useStore(s => s.setNewGroupModal);

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
  const onSend = (txt: string) => {
    if (isGroup && activeGroup) sendGroup(activeGroup.id, txt);
    else if (activeStaff) sendDm(activeStaff.id, txt);
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

  const renderThreadPane = (withBack: boolean) => (
    <>
      <div style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '12px 16px', borderBottom: '1px solid var(--border)' }}>
        {withBack && (
          <button onClick={() => setChatActive(null)} aria-label="Back" style={{ background: 'transparent', border: 'none', color: 'var(--text)', cursor: 'pointer', padding: 4 }}><ArrowLeft size={18} /></button>
        )}
        {!isGroup && activeStaff && <Avatar staffId={activeStaff.id} size={34} />}
        {isGroup && (
          <div style={{ width: 34, height: 34, borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: 'var(--control)', border: '1.5px solid var(--border-strong)' }}><Users size={16} color="var(--text-muted)" /></div>
        )}
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 9, flex: 1, minWidth: 0 }}>
          <span style={{ fontSize: 15, fontWeight: 800 }}>{threadTitle}</span>
          {!isGroup && activeStaff && <span style={{ fontSize: 12.5, color: 'var(--accent)', fontWeight: 600 }}>@{handleOf(activeStaff.id)}</span>}
        </div>
        {activeIg && (
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
                <div style={{ fontSize: 10.5, color: 'var(--text-muted)', marginBottom: 3, textAlign: own ? 'right' : 'left' }}>{own ? 'You' : nameOf(msg.from)} · {msg.time}</div>
                <div style={{ padding: '9px 13px', borderRadius: 12, fontSize: 13.5, background: own ? 'var(--accent-deep)' : 'var(--panel-2)', color: own ? '#fff' : 'var(--text)', border: own ? 'none' : '1px solid var(--border)' }}>
                  {msg.text}
                  {msg.att && <div style={{ marginTop: 4, fontSize: 11, opacity: 0.85, textDecoration: 'underline' }}>{msg.att.name}</div>}
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
    </div>
  );
}
