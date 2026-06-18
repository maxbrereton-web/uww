import type React from 'react';
import { useState } from 'react';
import { X, Plus, Check } from 'lucide-react';
import { useStore, isAdmin, currentUser } from '../../../store';
import type { MemberStatus } from '../../../types';
import Avatar from '../../common/Avatar';
import { EVENT_ROLES } from '../../../data/seed';

const condensed: React.CSSProperties = {
  fontStretch: '75%',
  fontWeight: 800,
  textTransform: 'uppercase',
  letterSpacing: '.02em',
};

const sectionHeading: React.CSSProperties = { ...condensed, fontSize: 13, color: 'var(--text)', margin: '4px 0 12px' };

const STATUS_COLORS: Record<MemberStatus, string> = {
  invited: '#0089CF',
  pending: '#E0A100',
  confirmed: '#22C55E',
};

function actionBtn(bg: string): React.CSSProperties {
  return {
    ...condensed,
    fontSize: 11,
    border: 'none',
    borderRadius: 6,
    background: bg,
    color: '#fff',
    padding: '5px 10px',
    cursor: 'pointer',
  };
}

const ghostBtn: React.CSSProperties = {
  ...condensed,
  fontSize: 11,
  border: '1px solid var(--border)',
  borderRadius: 6,
  background: 'var(--control)',
  color: 'var(--text-muted)',
  padding: '5px 10px',
  cursor: 'pointer',
};

export default function EventTeamTab({ eventId }: { eventId: string }) {
  const detail = useStore(s => s.detail[eventId]);
  const admin = useStore(isAdmin);
  const cu = useStore(currentUser);
  const role = useStore(s => s.role);
  const staff = useStore(s => s.staff);

  const approveJoinRequest = useStore(s => s.approveJoinRequest);
  const declineJoinRequest = useStore(s => s.declineJoinRequest);
  const addRole = useStore(s => s.addRole);
  const removeRole = useStore(s => s.removeRole);
  const addMember = useStore(s => s.addMember);
  const removeMember = useStore(s => s.removeMember);
  const acceptInvite = useStore(s => s.acceptInvite);
  const declineInvite = useStore(s => s.declineInvite);
  const requestJoin = useStore(s => s.requestJoin);

  const [roleMenuFor, setRoleMenuFor] = useState<string | null>(null);
  const [addStaffOpen, setAddStaffOpen] = useState(false);

  if (!detail) return null;

  const members = detail.members;
  const joinRequests = detail.joinRequests;
  const onTeam = members.some(m => m.id === cu);
  const hasRequested = joinRequests.includes(cu);
  const canRequest = (role === 'staff' || role === 'freelance') && !onTeam;

  const nameOf = (id: string) => staff.find(s => s.id === id)?.name || id;

  return (
    <div>
      {/* Join requests */}
      {admin && joinRequests.length > 0 && (
        <div style={{ marginBottom: 22 }}>
          <div style={sectionHeading}>Requests to join</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {joinRequests.map(id => (
              <div
                key={id}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  border: '2px dashed var(--accent)', borderRadius: 10, padding: '10px 12px',
                }}
              >
                <Avatar staffId={id} size={28} />
                <span style={{ fontSize: 13, color: 'var(--text)', flex: 1 }}>{nameOf(id)}</span>
                <button type="button" style={actionBtn('#22C55E')} onClick={() => approveJoinRequest(eventId, id)}>Approve</button>
                <button type="button" style={ghostBtn} onClick={() => declineJoinRequest(eventId, id)}>Decline</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Event team */}
      <div style={sectionHeading}>Event team</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {members.length === 0 && <div style={{ color: 'var(--text-muted)', fontSize: 13 }}>No team members yet.</div>}
        {members.map(member => {
          const confirmed = member.status === 'confirmed';
          const availableRoles = EVENT_ROLES.filter(r => !member.roles.includes(r));
          return (
            <div
              key={member.id}
              style={{
                display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap',
                background: 'var(--panel)', border: '1px solid var(--border)', borderRadius: 10, padding: '10px 12px',
              }}
            >
              <Avatar staffId={member.id} size={28} confirmed={confirmed} />
              <span style={{ fontSize: 13, color: 'var(--text)', fontWeight: 600 }}>{nameOf(member.id)}</span>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, alignItems: 'center' }}>
                {member.roles.map(r => (
                  <span key={r} style={roleChip}>
                    {r}
                    {admin && (
                      <button type="button" onClick={() => removeRole(eventId, member.id, r)} style={roleChipX} title="Remove role">
                        <X size={10} />
                      </button>
                    )}
                  </span>
                ))}

                {admin && (
                  <div style={{ position: 'relative' }}>
                    <button
                      type="button"
                      onClick={() => setRoleMenuFor(roleMenuFor === member.id ? null : member.id)}
                      style={{ ...roleChip, cursor: 'pointer', border: '1px dashed var(--border-strong)' }}
                      title="Add role"
                    >
                      <Plus size={11} />
                    </button>
                    {roleMenuFor === member.id && (
                      <div style={popover}>
                        {availableRoles.map(r => (
                          <button
                            key={r}
                            type="button"
                            onClick={() => { addRole(eventId, member.id, r); setRoleMenuFor(null); }}
                            style={menuItemStyle}
                          >
                            {r}
                          </button>
                        ))}
                        {availableRoles.length === 0 && (
                          <div style={{ padding: '8px 12px', color: 'var(--text-muted)', fontSize: 13 }}>All roles assigned.</div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>

              <span
                style={{
                  ...condensed, fontSize: 10, color: '#fff', padding: '3px 8px',
                  borderRadius: 999, background: STATUS_COLORS[member.status], marginLeft: 'auto',
                }}
              >
                {member.status}
              </span>

              <div style={{ display: 'flex', gap: 6 }}>
                {member.id === cu && member.status === 'invited' && (
                  <>
                    <button type="button" style={actionBtn('#22C55E')} onClick={() => acceptInvite(eventId)}>Accept</button>
                    <button type="button" style={ghostBtn} onClick={() => declineInvite(eventId)}>Decline</button>
                  </>
                )}
                {admin && (
                  <button type="button" style={ghostBtn} onClick={() => removeMember(eventId, member.id)}>Remove</button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer controls */}
      <div style={{ marginTop: 16, position: 'relative', display: 'flex', gap: 10 }}>
        {admin && (
          <div style={{ position: 'relative' }}>
            <button
              type="button"
              onClick={() => setAddStaffOpen(o => !o)}
              style={{ ...ghostBtn, display: 'inline-flex', alignItems: 'center', gap: 6 }}
            >
              <Plus size={13} /> Add staff member
            </button>
            {addStaffOpen && (
              <div style={{ ...popover, bottom: '100%', top: 'auto', marginBottom: 4 }}>
                {staff.filter(m => !members.some(mm => mm.id === m.id)).map(m => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => { addMember(eventId, m.id); setAddStaffOpen(false); }}
                    style={{ ...menuItemStyle, display: 'flex', alignItems: 'center', gap: 8 }}
                  >
                    <Avatar staffId={m.id} size={20} />
                    {m.name}
                  </button>
                ))}
                {staff.filter(m => !members.some(mm => mm.id === m.id)).length === 0 && (
                  <div style={{ padding: '8px 12px', color: 'var(--text-muted)', fontSize: 13 }}>All staff on team.</div>
                )}
              </div>
            )}
          </div>
        )}

        {canRequest && (
          hasRequested ? (
            <button type="button" disabled style={{ ...ghostBtn, cursor: 'default', opacity: 0.6, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <Check size={13} /> Request sent
            </button>
          ) : (
            <button type="button" style={actionBtn('var(--accent)')} onClick={() => requestJoin(eventId)}>Request to join</button>
          )
        )}
      </div>
    </div>
  );
}

const roleChip: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 4,
  background: 'var(--panel-2)',
  border: '1px solid var(--border)',
  borderRadius: 999,
  padding: '3px 8px',
  fontSize: 12,
  color: 'var(--text)',
};

const roleChipX: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 14,
  height: 14,
  borderRadius: '50%',
  border: 'none',
  background: 'var(--control)',
  color: 'var(--text-muted)',
  cursor: 'pointer',
};

const popover: React.CSSProperties = {
  position: 'absolute',
  top: '100%',
  left: 0,
  marginTop: 4,
  zIndex: 20,
  background: 'var(--panel)',
  border: '1px solid var(--border-strong)',
  borderRadius: 8,
  boxShadow: 'var(--shadow)',
  minWidth: 180,
  maxHeight: 240,
  overflowY: 'auto',
};

const menuItemStyle: React.CSSProperties = {
  display: 'block',
  width: '100%',
  textAlign: 'left',
  padding: '8px 12px',
  border: 'none',
  background: 'transparent',
  color: 'var(--text)',
  fontSize: 13,
  cursor: 'pointer',
};
