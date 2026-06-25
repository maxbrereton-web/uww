import type React from 'react';
import { useRef, useState } from 'react';
import { Plus, X, ChevronDown, ChevronRight } from 'lucide-react';
import { useStore, effectiveView } from '../../store';
import type { StaffType, StaffMember } from '../../types';
import { SKILLSETS } from '../../data/seed';
import Avatar from '../common/Avatar';

const condensed: React.CSSProperties = {
  fontStretch: '75%', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.02em',
};

function titleCase(s: string): string {
  return s.replace(/\b\w/g, c => c.toUpperCase());
}

const skillChip: React.CSSProperties = {
  display: 'inline-flex', alignItems: 'center', gap: 6, padding: '5px 10px',
  borderRadius: 999, background: 'var(--control)', border: '1px solid var(--border-strong)',
  fontSize: 12.5, fontWeight: 600, color: 'var(--text)', whiteSpace: 'nowrap',
};

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '8px 10px', background: 'var(--field)', color: 'var(--text)',
  border: '1px solid var(--border)', borderRadius: 8, fontSize: 13, outline: 'none',
};

const labelStyle: React.CSSProperties = {
  ...condensed, fontSize: 11, color: 'var(--text-muted)', display: 'block', marginBottom: 6,
};

const STAFF_TYPES: StaffType[] = ['Staff', 'Freelance'];

function ToggleSwitch({ on, onClick }: { on: boolean; onClick: () => void }) {
  return (
    <div
      onClick={onClick}
      role="switch"
      aria-checked={on}
      style={{
        width: 38, height: 22, borderRadius: 999, cursor: 'pointer', flex: '0 0 auto',
        background: on ? 'var(--accent)' : 'var(--control)',
        border: '1px solid var(--border)', position: 'relative', transition: 'background .15s',
      }}
    >
      <div
        style={{
          position: 'absolute', top: 2, left: on ? 18 : 2, width: 16, height: 16,
          borderRadius: '50%', background: '#fff', transition: 'left .15s',
        }}
      />
    </div>
  );
}

function SkillTags({ member }: { member: StaffMember }) {
  const updateStaff = useStore(s => s.updateStaff);
  const btnRef = useRef<HTMLButtonElement>(null);
  const [menu, setMenu] = useState<{ left: number; top?: number; bottom?: number; width: number } | null>(null);

  const assigned = member.skillsets;
  const available = SKILLSETS.filter(s => !assigned.includes(s));

  const removeSkill = (skill: string) =>
    updateStaff(member.id, { skillsets: assigned.filter(s => s !== skill) });
  const addSkill = (skill: string) => {
    updateStaff(member.id, { skillsets: [...assigned, skill] });
    setMenu(null);
  };

  const openMenu = () => {
    const el = btnRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const estHeight = Math.min(280, available.length * 38 + 10);
    const spaceBelow = window.innerHeight - r.bottom;
    const flipUp = spaceBelow < estHeight + 16 && r.top > spaceBelow;
    const width = Math.max(190, r.width);
    const left = Math.min(r.left, window.innerWidth - width - 12);
    setMenu(flipUp
      ? { left, bottom: window.innerHeight - r.top + 6, width }
      : { left, top: r.bottom + 6, width });
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 7 }}>
      {assigned.map(skill => (
        <span key={skill} style={skillChip}>
          {titleCase(skill)}
          <X size={12} style={{ cursor: 'pointer', color: 'var(--text-muted)' }} onClick={() => removeSkill(skill)} />
        </span>
      ))}
      {available.length > 0 && (
        <>
          <button
            ref={btnRef}
            type="button"
            onClick={() => (menu ? setMenu(null) : openMenu())}
            title="Add skillset"
            style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '5px 10px', borderRadius: 999, background: 'var(--control)', border: '1px dashed var(--border-strong)', color: 'var(--text-muted)', cursor: 'pointer', fontSize: 12 }}
          >
            <Plus size={13} /> <ChevronDown size={12} />
          </button>
          {menu && (
            <>
              <div onClick={() => setMenu(null)} style={{ position: 'fixed', inset: 0, zIndex: 200 }} />
              <div
                style={{
                  position: 'fixed', left: menu.left, width: menu.width, zIndex: 201,
                  ...(menu.top != null ? { top: menu.top } : { bottom: menu.bottom }),
                  background: 'var(--panel)', border: '1px solid var(--border-strong)', borderRadius: 10,
                  boxShadow: 'var(--shadow)', overflow: 'hidden', maxHeight: 280, overflowY: 'auto',
                }}
              >
                {available.map(s => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => addSkill(s)}
                    style={{ display: 'block', width: '100%', textAlign: 'left', padding: '9px 13px', border: 'none', background: 'transparent', color: 'var(--text)', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}
                  >
                    {titleCase(s)}
                  </button>
                ))}
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}

function NewStaffModal({ onClose }: { onClose: () => void }) {
  const addStaff = useStore(s => s.addStaff);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [type, setType] = useState<StaffType>('Staff');
  const [skills, setSkills] = useState<string[]>([]);

  const toggleSkill = (s: string) =>
    setSkills(skills.includes(s) ? skills.filter(x => x !== s) : [...skills, s]);

  const create = () => {
    const fullName = `${firstName.trim()} ${lastName.trim()}`.trim();
    addStaff({
      id: 'st' + Date.now(),
      name: fullName || 'New Staff',
      admin: false,
      location: '',
      email: email.trim(),
      type,
      skillsets: skills,
      country: '',
    });
    onClose();
  };

  return (
    <div
      style={{
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,.5)', zIndex: 100,
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20,
      }}
      onClick={onClose}
    >
      <div
        className="uww-overlay"
        style={{
          width: 440, maxWidth: '100%', maxHeight: '90vh', overflowY: 'auto',
          background: 'var(--panel)', border: '1px solid var(--border-strong)',
          borderRadius: 14, boxShadow: 'var(--shadow)', padding: 22,
        }}
        onClick={e => e.stopPropagation()}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
          <div style={{ ...condensed, fontSize: 16, color: 'var(--text)' }}>New Staff</div>
          <button
            onClick={onClose}
            style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 4 }}
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        <div style={{ display: 'flex', gap: 12, marginBottom: 14 }}>
          <div style={{ flex: 1 }}>
            <label style={labelStyle}>First Name</label>
            <input style={inputStyle} value={firstName} placeholder="First name" onChange={e => setFirstName(e.target.value)} />
          </div>
          <div style={{ flex: 1 }}>
            <label style={labelStyle}>Last Name</label>
            <input style={inputStyle} value={lastName} placeholder="Last name" onChange={e => setLastName(e.target.value)} />
          </div>
        </div>

        <div style={{ marginBottom: 14 }}>
          <label style={labelStyle}>Email</label>
          <input style={inputStyle} value={email} placeholder="email@uww.org" onChange={e => setEmail(e.target.value)} />
          <div style={{ fontSize: 11.5, color: 'var(--text-faint)', marginTop: 6, lineHeight: 1.4 }}>
            They'll sign in with this email and set their own password, name, tag and photo.
          </div>
        </div>

        <div style={{ marginBottom: 14 }}>
          <label style={labelStyle}>Type</label>
          <select style={inputStyle} value={type} onChange={e => setType(e.target.value as StaffType)}>
            {STAFF_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>

        <div style={{ marginBottom: 22 }}>
          <label style={labelStyle}>Skillsets</label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
            {SKILLSETS.map(s => {
              const sel = skills.includes(s);
              return (
                <button
                  key={s}
                  type="button"
                  onClick={() => toggleSkill(s)}
                  style={{
                    padding: '6px 11px', borderRadius: 999, fontSize: 12.5, fontWeight: 600, cursor: 'pointer',
                    background: sel ? 'var(--accent-deep)' : 'var(--control)',
                    border: '1px solid ' + (sel ? 'var(--accent-deep)' : 'var(--border-strong)'),
                    color: sel ? '#fff' : 'var(--text-muted)',
                  }}
                >
                  {titleCase(s)}
                </button>
              );
            })}
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
          <button
            onClick={onClose}
            style={{ ...condensed, fontSize: 12, padding: '9px 16px', cursor: 'pointer', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--control)', color: 'var(--text)' }}
          >
            Cancel
          </button>
          <button
            onClick={create}
            style={{ ...condensed, fontSize: 12, padding: '9px 20px', borderRadius: 8, border: 'none', background: 'var(--accent)', color: '#fff', cursor: 'pointer' }}
          >
            Send Invite
          </button>
        </div>
      </div>
    </div>
  );
}

function MobileCard({ member }: { member: StaffMember }) {
  const updateStaff = useStore(s => s.updateStaff);
  const removeStaff = useStore(s => s.removeStaff);
  const [open, setOpen] = useState(false);

  return (
    <div style={{ background: 'var(--panel)', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden' }}>
      <div
        onClick={() => setOpen(o => !o)}
        style={{ display: 'flex', alignItems: 'center', gap: 10, padding: 12, cursor: 'pointer' }}
      >
        <Avatar staffId={member.id} size={32} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ ...condensed, fontSize: 13, color: 'var(--text)' }}>{member.name}</div>
          <div style={{ ...condensed, fontSize: 10, color: 'var(--text-muted)' }}>{member.type}{member.admin ? ' · Admin' : ''}</div>
        </div>
        {open ? <ChevronDown size={18} color="var(--text-muted)" /> : <ChevronRight size={18} color="var(--text-muted)" />}
      </div>
      {open && (
        <div style={{ padding: '0 12px 14px', display: 'flex', flexDirection: 'column', gap: 12, borderTop: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 12 }}>
            <span style={labelStyle}>Admin</span>
            <ToggleSwitch on={member.admin} onClick={() => updateStaff(member.id, { admin: !member.admin })} />
          </div>
          <div>
            <label style={labelStyle}>Type</label>
            <select style={inputStyle} value={member.type} onChange={e => updateStaff(member.id, { type: e.target.value as StaffType })}>
              {STAFF_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label style={labelStyle}>Location</label>
            <input style={inputStyle} value={member.location} placeholder="Location" onChange={e => updateStaff(member.id, { location: e.target.value })} />
          </div>
          <div>
            <label style={labelStyle}>Contact</label>
            <input style={inputStyle} value={member.email} placeholder="Email" onChange={e => updateStaff(member.id, { email: e.target.value })} />
          </div>
          <div>
            <label style={labelStyle}>Skillsets</label>
            <SkillTags member={member} />
          </div>
          <button
            onClick={() => removeStaff(member.id)}
            style={{ ...condensed, fontSize: 11, padding: '8px 12px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--control)', color: '#EF4444', cursor: 'pointer', alignSelf: 'flex-start' }}
          >
            Remove
          </button>
        </div>
      )}
    </div>
  );
}

export default function StaffPage() {
  const role = useStore(s => s.role);
  const viewMode = useStore(effectiveView);
  const staff = useStore(s => s.staff);
  const updateStaff = useStore(s => s.updateStaff);
  const removeStaff = useStore(s => s.removeStaff);
  const openDmWith = useStore(s => s.openDmWith);
  const [showModal, setShowModal] = useState(false);

  if (role !== 'admin') {
    return (
      <div style={{ padding: 24, height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ ...condensed, fontSize: 14, color: 'var(--text-muted)' }}>Admins only</div>
      </div>
    );
  }

  const headCell: React.CSSProperties = {
    ...condensed, fontSize: 10, color: 'var(--text-muted)', padding: '10px 12px', textAlign: 'left',
  };
  const bodyCell: React.CSSProperties = {
    padding: 12, borderTop: '1px solid var(--border)', fontSize: 12, color: 'var(--text)', verticalAlign: 'middle',
  };

  return (
    <div style={{ padding: 22, overflow: 'auto', height: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
        <div style={{ ...condensed, fontSize: 20, color: 'var(--text)' }}>Staff</div>
        <button
          onClick={() => setShowModal(true)}
          style={{ display: 'inline-flex', alignItems: 'center', gap: 6, ...condensed, fontSize: 11, padding: '9px 14px', borderRadius: 8, border: 'none', background: 'var(--accent)', color: '#fff', cursor: 'pointer' }}
        >
          <Plus size={15} /> New Staff
        </button>
      </div>

      {viewMode === 'mobile' ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {staff.map(m => <MobileCard key={m.id} member={m} />)}
        </div>
      ) : (
        <div style={{ background: 'var(--panel)', border: '1px solid var(--border)', borderRadius: 12, overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'var(--panel-2)' }}>
                <th style={headCell}>Name</th>
                <th style={headCell}>Admin</th>
                <th style={headCell}>Type</th>
                <th style={headCell}>Location</th>
                <th style={headCell}>Contact</th>
                <th style={headCell}>Skillsets</th>
                <th style={{ ...headCell, width: 44 }}>Remove</th>
              </tr>
            </thead>
            <tbody>
              {staff.map(m => (
                <tr
                  key={m.id}
                  onContextMenu={e => { e.preventDefault(); removeStaff(m.id); }}
                >
                  <td style={bodyCell}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <Avatar staffId={m.id} size={28} onClick={() => openDmWith(m.id)} />
                      <span style={{ ...condensed, fontSize: 12 }}>{m.name}</span>
                    </div>
                  </td>
                  <td style={bodyCell}>
                    <ToggleSwitch on={m.admin} onClick={() => updateStaff(m.id, { admin: !m.admin })} />
                  </td>
                  <td style={bodyCell}>
                    <select
                      value={m.type}
                      onChange={e => updateStaff(m.id, { type: e.target.value as StaffType })}
                      style={{ ...inputStyle, width: 120, padding: '6px 8px', cursor: 'pointer' }}
                    >
                      {STAFF_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </td>
                  <td style={bodyCell}>
                    <input
                      value={m.location}
                      placeholder="Location"
                      onChange={e => updateStaff(m.id, { location: e.target.value })}
                      style={{ ...inputStyle, width: 140, padding: '6px 8px' }}
                    />
                  </td>
                  <td style={bodyCell}>
                    <input
                      value={m.email}
                      placeholder="Email"
                      onChange={e => updateStaff(m.id, { email: e.target.value })}
                      style={{ ...inputStyle, width: 180, padding: '6px 8px' }}
                    />
                  </td>
                  <td style={{ ...bodyCell, minWidth: 220 }}>
                    <SkillTags member={m} />
                  </td>
                  <td style={bodyCell}>
                    <button
                      onClick={() => removeStaff(m.id)}
                      aria-label="Remove staff"
                      style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 4 }}
                    >
                      <X size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showModal && <NewStaffModal onClose={() => setShowModal(false)} />}
    </div>
  );
}
