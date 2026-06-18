import type React from 'react';
import { useState } from 'react';
import { Search, Users, Plus, X, ArrowLeft, Send } from 'lucide-react';
import { useStore, currentUser } from '../../store';
import type { Message } from '../../types';
import Avatar from '../common/Avatar';

const condensed: React.CSSProperties = {
  fontStretch: '75%', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.02em',
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
    setNewGroupMembers(
      newGroupMembers.includes(id)
        ? newGroupMembers.filter(m => m !== id)
        : [...newGroupMembers, id],
    );
  };

  return (
    <div
      style={{
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,.5)', zIndex: 100,
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20,
      }}
      onClick={() => setNewGroupModal(false)}
    >
      <div
        className="uww-overlay"
        style={{
          width: 420, maxWidth: '100%', maxHeight: '90vh', overflowY: 'auto',
          background: 'var(--panel)', border: '1px solid var(--border-strong)',
          borderRadius: 14, boxShadow: 'var(--shadow)', padding: 22,
        }}
        onClick={e => e.stopPropagation()}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
          <div style={{ ...condensed, fontSize: 16, color: 'var(--text)' }}>New Group</div>
          <button
            onClick={() => setNewGroupModal(false)}
            style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 4 }}
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        <div style={{ marginBottom: 16 }}>
          <label style={{ ...condensed, fontSize: 11, color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>Group Name</label>
          <input
            value={newGroupName}
            placeholder="Group name"
            onChange={e => setNewGroupName(e.target.value)}
            style={{ width: '100%', padding: '9px 11px', background: 'var(--field)', color: 'var(--text)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 13, outline: 'none' }}
          />
        </div>

        <div style={{ marginBottom: 22 }}>
          <label style={{ ...condensed, fontSize: 11, color: 'var(--text-muted)', display: 'block', marginBottom: 8 }}>Members</label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {staff.map(m => {
              const checked = newGroupMembers.includes(m.id);
              return (
                <label
                  key={m.id}
                  style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '6px 8px', borderRadius: 8, cursor: 'pointer', background: checked ? 'var(--control)' : 'transparent' }}
                >
                  <input type="checkbox" checked={checked} onChange={() => toggleMember(m.id)} style={{ cursor: 'pointer' }} />
                  <Avatar staffId={m.id} size={26} />
                  <span style={{ ...condensed, fontSize: 12, color: 'var(--text)' }}>{m.name}</span>
                </label>
              );
            })}
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
          <button
            onClick={() => setNewGroupModal(false)}
            style={{ ...condensed, fontSize: 12, padding: '9px 16px', cursor: 'pointer', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--control)', color: 'var(--text)' }}
          >
            Cancel
          </button>
          <button
            onClick={() => createGroup(newGroupName.trim() || 'New Group', newGroupMembers)}
            disabled={newGroupMembers.length === 0}
            style={{
              ...condensed, fontSize: 12, padding: '9px 20px', borderRadius: 8, border: 'none',
              background: newGroupMembers.length ? 'var(--accent)' : 'var(--control)',
              color: newGroupMembers.length ? '#fff' : 'var(--text-faint)',
              cursor: newGroupMembers.length ? 'pointer' : 'not-allowed',
            }}
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
}

function Thread({ messages, cu }: { messages: Message[]; cu: string }) {
  const staff = useStore(s => s.staff);
  const nameOf = (id: string) => staff.find(m => m.id === id)?.name || id;

  if (messages.length === 0) {
    return (
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-faint)', fontSize: 13 }}>
        No messages yet.
      </div>
    );
  }

  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
      {messages.map((msg, i) => {
        const own = msg.from === cu;
        return (
          <div key={i} style={{ display: 'flex', justifyContent: own ? 'flex-end' : 'flex-start' }}>
            <div style={{ maxWidth: '72%' }}>
              <div style={{ ...condensed, fontSize: 10, color: 'var(--text-muted)', marginBottom: 3, textAlign: own ? 'right' : 'left' }}>
                {own ? 'You' : nameOf(msg.from)} · {msg.time}
              </div>
              <div
                style={{
                  padding: '8px 12px', borderRadius: 12, fontSize: 13,
                  background: own ? 'var(--accent)' : 'var(--panel-2)',
                  color: own ? '#fff' : 'var(--text)',
                  border: own ? 'none' : '1px solid var(--border)',
                  borderTopRightRadius: own ? 4 : 12,
                  borderTopLeftRadius: own ? 12 : 4,
                }}
              >
                {msg.text}
                {msg.att && (
                  <div style={{ marginTop: 4, fontSize: 11, opacity: 0.85, textDecoration: 'underline' }}>{msg.att.name}</div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function Composer({ onSend }: { onSend: (text: string) => void }) {
  const [text, setText] = useState('');
  const send = () => {
    const v = text.trim();
    if (!v) return;
    onSend(v);
    setText('');
  };
  return (
    <div style={{ display: 'flex', gap: 8, padding: 12, borderTop: '1px solid var(--border)' }}>
      <textarea
        value={text}
        placeholder="Write a message"
        onChange={e => setText(e.target.value)}
        onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } }}
        rows={1}
        style={{
          flex: 1, resize: 'none', padding: '9px 11px', background: 'var(--field)', color: 'var(--text)',
          border: '1px solid var(--border)', borderRadius: 8, fontSize: 13, outline: 'none', fontFamily: 'inherit', minHeight: 38, maxHeight: 120,
        }}
      />
      <button
        onClick={send}
        aria-label="Send"
        style={{ display: 'inline-flex', alignItems: 'center', gap: 6, ...condensed, fontSize: 11, padding: '0 16px', borderRadius: 8, border: 'none', background: 'var(--accent)', color: '#fff', cursor: 'pointer' }}
      >
        <Send size={15} /> Send
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
  const newGroupModal = useStore(s => s.newGroupModal);

  const setChatActive = useStore(s => s.setChatActive);
  const sendDm = useStore(s => s.sendDm);
  const sendGroup = useStore(s => s.sendGroup);
  const setNewGroupModal = useStore(s => s.setNewGroupModal);

  const [filter, setFilter] = useState('');

  const q = filter.trim().toLowerCase();
  const dmStaff = staff.filter(m => m.id !== cu).filter(m => !q || m.name.toLowerCase().includes(q));
  const myGroups = groups.filter(g => g.members.includes(cu)).filter(g => !q || g.name.toLowerCase().includes(q));

  const isGroup = !!chatActive && chatActive.startsWith('g:');
  const activeGroup = isGroup ? groups.find(g => g.id === chatActive!.slice(2)) : undefined;
  const activeStaff = chatActive && !isGroup ? staff.find(m => m.id === chatActive) : undefined;

  const threadMessages: Message[] = isGroup
    ? (activeGroup?.messages || [])
    : (activeStaff ? (dms[dmKey(cu, activeStaff.id)] || []) : []);

  const lastDmPreview = (otherId: string): string => {
    const arr = dms[dmKey(cu, otherId)];
    if (!arr || arr.length === 0) return 'No messages yet';
    return arr[arr.length - 1].text;
  };

  const onSend = (txt: string) => {
    if (isGroup && activeGroup) sendGroup(activeGroup.id, txt);
    else if (activeStaff) sendDm(activeStaff.id, txt);
  };

  const sectionLabel: React.CSSProperties = {
    ...condensed, fontSize: 10, color: 'var(--text-muted)', padding: '10px 12px 6px',
  };

  const renderSidebar = () => (
    <>
      <div style={{ padding: 12, borderBottom: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '0 10px', background: 'var(--field)', border: '1px solid var(--border)', borderRadius: 8, height: 36 }}>
          <Search size={15} color="var(--text-muted)" />
          <input
            value={filter}
            onChange={e => setFilter(e.target.value)}
            placeholder="Search people"
            style={{ border: 'none', outline: 'none', background: 'transparent', color: 'var(--text)', fontSize: 13, width: '100%' }}
          />
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto' }}>
        <div style={sectionLabel}>Direct Messages</div>
        {dmStaff.map(m => {
          const active = chatActive === m.id;
          return (
            <div
              key={m.id}
              onClick={() => setChatActive(m.id)}
              style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', cursor: 'pointer', background: active ? 'var(--control)' : 'transparent' }}
            >
              <Avatar staffId={m.id} size={32} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ ...condensed, fontSize: 12, color: 'var(--text)' }}>{m.name}</div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{lastDmPreview(m.id)}</div>
              </div>
            </div>
          );
        })}

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={sectionLabel}>Groups</div>
          <button
            onClick={() => setNewGroupModal(true)}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 4, ...condensed, fontSize: 10, padding: '4px 8px', marginRight: 10, borderRadius: 6, border: '1px solid var(--border)', background: 'var(--control)', color: 'var(--text)', cursor: 'pointer' }}
          >
            <Plus size={12} /> New group
          </button>
        </div>
        {myGroups.map(g => {
          const active = chatActive === 'g:' + g.id;
          return (
            <div
              key={g.id}
              onClick={() => setChatActive('g:' + g.id)}
              style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', cursor: 'pointer', background: active ? 'var(--control)' : 'transparent' }}
            >
              {g.photo ? (
                <div style={{ width: 32, height: 32, borderRadius: '50%', backgroundImage: `url(${g.photo})`, backgroundSize: 'cover', backgroundPosition: 'center', flex: '0 0 auto', border: '1.5px solid var(--border-strong)' }} />
              ) : (
                <div style={{ width: 32, height: 32, borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: 'var(--control)', border: '1.5px solid var(--border-strong)', flex: '0 0 auto' }}>
                  <Users size={16} color="var(--text-muted)" />
                </div>
              )}
              <div style={{ ...condensed, fontSize: 12, color: 'var(--text)' }}>{g.name}</div>
            </div>
          );
        })}
        {myGroups.length === 0 && (
          <div style={{ padding: '4px 12px 12px', fontSize: 11, color: 'var(--text-faint)' }}>No groups yet.</div>
        )}
      </div>
    </>
  );

  const threadTitle = isGroup ? (activeGroup?.name || 'Group') : (activeStaff?.name || '');

  const renderThreadPane = (withBack: boolean) => (
    <>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: 12, borderBottom: '1px solid var(--border)' }}>
        {withBack && (
          <button
            onClick={() => setChatActive(null)}
            aria-label="Back"
            style={{ background: 'transparent', border: 'none', color: 'var(--text)', cursor: 'pointer', padding: 4 }}
          >
            <ArrowLeft size={18} />
          </button>
        )}
        {!isGroup && activeStaff && <Avatar staffId={activeStaff.id} size={28} />}
        {isGroup && (
          <div style={{ width: 28, height: 28, borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: 'var(--control)', border: '1.5px solid var(--border-strong)' }}>
            <Users size={14} color="var(--text-muted)" />
          </div>
        )}
        <div style={{ ...condensed, fontSize: 14, color: 'var(--text)' }}>{threadTitle}</div>
      </div>
      <Thread messages={threadMessages} cu={cu} />
      <Composer onSend={onSend} />
    </>
  );

  // Mobile: single column
  if (viewMode === 'mobile') {
    return (
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {chatActive ? renderThreadPane(true) : renderSidebar()}
        {newGroupModal && <NewGroupModal />}
      </div>
    );
  }

  // Web: two columns
  return (
    <div style={{ height: '100%', display: 'flex', overflow: 'hidden' }}>
      <div style={{ width: 280, flex: '0 0 280px', borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column', background: 'var(--panel)' }}>
        {renderSidebar()}
      </div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {chatActive ? (
          renderThreadPane(false)
        ) : (
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-faint)', fontSize: 13 }}>
            Select a conversation
          </div>
        )}
      </div>
      {newGroupModal && <NewGroupModal />}
    </div>
  );
}
