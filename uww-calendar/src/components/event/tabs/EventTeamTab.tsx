import type React from 'react';
import { useState } from 'react';
import { useStore, isAdmin, currentUser } from '../../../store';
import type { MemberStatus } from '../../../types';
import Avatar from '../../common/Avatar';

const sectionLabel: React.CSSProperties = {
  fontSize: 12, color: 'var(--text-muted)', textTransform: 'uppercase',
  letterSpacing: '.09em', fontWeight: 700,
};

const STATUS_BADGE: Record<MemberStatus, { color: string; label: string }> = {
  invited: { color: '#0089CF', label: 'Invited' },
  pending: { color: '#E0A100', label: 'Pending' },
  confirmed: { color: '#22C55E', label: 'Confirmed' },
};

function titleCase(s: string): string {
  return s.replace(/\b\w/g, c => c.toUpperCase());
}

export default function EventTeamTab({ eventId }: { eventId: string }) {
  const detail = useStore(s => s.detail[eventId]);
  const admin = useStore(isAdmin);
  const cu = useStore(currentUser);
  const role = useStore(s => s.role);
  const staff = useStore(s => s.staff);
  const openDmWith = useStore(s => s.openDmWith);

  const approveJoinRequest = useStore(s => s.approveJoinRequest);
  const declineJoinRequest = useStore(s => s.declineJoinRequest);
  const addRole = useStore(s => s.addRole);
  const removeRole = useStore(s => s.removeRole);
  const addMember = useStore(s => s.addMember);
  const removeMember = useStore(s => s.removeMember);
  const acceptInvite = useStore(s => s.acceptInvite);
  const declineInvite = useStore(s => s.declineInvite);
  const requestJoin = useStore(s => s.requestJoin);

  const [addStaffOpen, setAddStaffOpen] = useState(false);

  if (!detail) return null;

  const members = detail.members;
  const joinRequests = detail.joinRequests;
  const onTeam = members.some(m => m.id === cu);
  const hasRequested = joinRequests.includes(cu);
  const canRequest = (role === 'staff' || role === 'freelance') && !onTeam;
  const memberOf = (id: string) => staff.find(s => s.id === id);
  const nameOf = (id: string) => memberOf(id)?.name || id;
  const skillsOf = (id: string) => (memberOf(id)?.skillsets || []).map(titleCase);
  const addable = staff.filter(m => !members.some(mm => mm.id === m.id));

  return (
    <div>
      {/* Requests to join */}
      {admin && joinRequests.length > 0 && (
        <div style={{ marginBottom: 22 }}>
          <div style={{ ...sectionLabel, marginBottom: 12 }}>Requests to join</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {joinRequests.map(id => (
              <div
                key={id}
                style={{
                  background: 'var(--panel-2)', border: '1px dashed var(--accent)', borderRadius: 12,
                  padding: '13px 15px', display: 'flex', alignItems: 'center', gap: 13, flexWrap: 'wrap',
                }}
              >
                <Avatar staffId={id} size={40} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 700, fontSize: 14 }}>
                    {nameOf(id)} <span style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 400 }}>wants to join this event</span>
                  </div>
                  <div style={{ fontSize: 11.5, color: 'var(--text-muted)', marginTop: 2, textTransform: 'capitalize' }}>
                    {skillsOf(id).join(' · ')}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button type="button" onClick={() => approveJoinRequest(eventId, id)} style={{ background: 'var(--accent-deep)', color: '#fff', borderRadius: 8, padding: '7px 14px', cursor: 'pointer', fontSize: 12.5, fontWeight: 700 }}>Approve</button>
                  <button type="button" onClick={() => declineJoinRequest(eventId, id)} style={{ background: 'var(--control)', border: '1px solid var(--border-strong)', borderRadius: 8, padding: '7px 14px', cursor: 'pointer', fontSize: 12.5, fontWeight: 700, color: 'var(--text-muted)' }}>Decline</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add staff member */}
      {admin && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, position: 'relative', marginBottom: 14 }}>
          <span style={{ fontSize: 12.5, color: 'var(--text-muted)' }}>Add staff member</span>
          <button
            type="button"
            onClick={() => setAddStaffOpen(o => !o)}
            title="Add staff member"
            style={{
              width: 34, height: 34, borderRadius: '50%', background: 'var(--accent-deep)', color: '#fff',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 21, lineHeight: 1,
              cursor: 'pointer', boxShadow: '0 6px 16px rgba(241,90,34,.32)',
            }}
          >
            +
          </button>
          {addStaffOpen && (
            <>
              <div onClick={() => setAddStaffOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 15 }} />
              <div
                style={{
                  position: 'absolute', top: 42, left: 0, zIndex: 20, width: 268,
                  background: 'var(--panel)', border: '1px solid var(--border-strong)',
                  borderRadius: 12, boxShadow: 'var(--shadow)', overflow: 'hidden',
                }}
              >
                <div style={{ padding: '10px 14px 7px', fontSize: 10, color: 'var(--text-faint)', textTransform: 'uppercase', letterSpacing: '.1em', fontWeight: 700 }}>
                  Add to event team
                </div>
                <div style={{ maxHeight: 240, overflow: 'auto' }}>
                  {addable.map(m => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => { addMember(eventId, m.id); setAddStaffOpen(false); }}
                      style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%', textAlign: 'left', padding: '9px 13px', border: 'none', background: 'transparent', cursor: 'pointer' }}
                    >
                      <Avatar staffId={m.id} size={30} />
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontSize: 13, fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{m.name}</div>
                        <div style={{ fontSize: 10.5, color: 'var(--text-muted)', textTransform: 'capitalize', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{m.skillsets.join(', ')}</div>
                      </div>
                    </button>
                  ))}
                  {addable.length === 0 && (
                    <div style={{ padding: 16, textAlign: 'center', color: 'var(--text-faint)', fontSize: 12.5 }}>Everyone is already on this event.</div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* Member rows */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {members.length === 0 && (
          <div style={{ padding: 28, textAlign: 'center', color: 'var(--text-faint)', fontSize: 13, border: '1px dashed var(--border)', borderRadius: 12 }}>
            No staff on this event yet. Add someone above, or wait for a request to join.
          </div>
        )}
        {members.map(member => {
          const confirmed = member.status === 'confirmed';
          const badge = STATUS_BADGE[member.status];
          const skillRoles = skillsOf(member.id).filter(r => !member.roles.includes(r));
          const isMe = member.id === cu;
          return (
            <div
              key={member.id}
              style={{
                background: 'var(--panel-2)', border: '1px solid var(--border)', borderRadius: 12,
                padding: '15px 17px', display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap',
              }}
            >
              <Avatar staffId={member.id} size={40} confirmed={confirmed} onClick={() => openDmWith(member.id)} />
              <div style={{ minWidth: 160 }}>
                <div style={{ fontWeight: 800, fontSize: 15 }}>{nameOf(member.id)}</div>
              </div>

              {member.status !== 'confirmed' && (
                <span style={{ fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.04em', color: badge.color, background: `color-mix(in srgb, ${badge.color} 16%, transparent)`, padding: '3px 9px', borderRadius: 20, whiteSpace: 'nowrap' }}>
                  {badge.label}
                </span>
              )}

              {/* Roles + assign */}
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', minWidth: 200, marginLeft: 14 }}>
                {member.roles.map((r, ri) => (
                  <span key={r} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 12.5, fontWeight: 600 }}>
                    {ri > 0 && <span style={{ display: 'inline-block', width: 1, height: 14, background: 'var(--border-strong)', margin: '0 4px' }} />}
                    {r}
                    {admin && (
                      <span onClick={() => removeRole(eventId, member.id, r)} style={{ cursor: 'pointer', opacity: 0.7, fontSize: 13 }} title="Remove role">×</span>
                    )}
                  </span>
                ))}
                {member.roles.length === 0 && (
                  <span style={{ fontSize: 12, color: 'var(--text-faint)', fontStyle: 'italic' }}>No roles assigned yet</span>
                )}
                {admin && (
                  <select
                    value=""
                    onChange={e => { if (e.target.value) addRole(eventId, member.id, e.target.value); }}
                    style={{ background: 'var(--field)', border: '1px dashed var(--border-strong)', borderRadius: 20, padding: '5px 11px', color: 'var(--text-muted)', fontSize: 12, fontFamily: 'inherit', cursor: 'pointer' }}
                  >
                    <option value="">+ Assign role</option>
                    {skillRoles.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                )}
              </div>

              {/* Right controls */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                {admin && member.status === 'invited' && (
                  <span style={{ fontSize: 11, color: '#0089CF', fontWeight: 700 }}>Awaiting acceptance</span>
                )}
                {isMe && member.status === 'invited' && (
                  <>
                    <button type="button" onClick={() => acceptInvite(eventId)} style={{ background: 'var(--accent-deep)', color: '#fff', borderRadius: 8, padding: '6px 14px', cursor: 'pointer', fontSize: 12, fontWeight: 800 }}>Accept</button>
                    <button type="button" onClick={() => declineInvite(eventId)} style={{ background: 'var(--control)', border: '1px solid var(--border-strong)', borderRadius: 8, padding: '6px 12px', cursor: 'pointer', fontSize: 12, fontWeight: 700, color: 'var(--text-muted)' }}>Decline</button>
                  </>
                )}
                {admin && (
                  <span onClick={() => removeMember(eventId, member.id)} style={{ cursor: 'pointer', color: 'var(--text-faint)', fontSize: 17 }} title="Remove from event">×</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Staff self-join */}
      {canRequest && !hasRequested && (
        <div style={{ marginTop: 18, display: 'flex', alignItems: 'center', gap: 11 }}>
          <button
            type="button"
            onClick={() => requestJoin(eventId)}
            title="Join event"
            style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--accent-deep)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, lineHeight: 1, cursor: 'pointer', boxShadow: '0 6px 16px rgba(241,90,34,.32)' }}
          >
            +
          </button>
          <span style={{ fontSize: 12.5, color: 'var(--text-muted)' }}>Join event — sends a request for the admin to approve</span>
        </div>
      )}
      {canRequest && hasRequested && (
        <div style={{ marginTop: 18, display: 'inline-flex', alignItems: 'center', gap: 8, background: 'color-mix(in srgb, #E0A100 16%, transparent)', color: '#E0A100', border: '1px solid #E0A100', borderRadius: 10, padding: '10px 18px', fontWeight: 700, fontSize: 13 }}>
          Request sent — awaiting admin approval
        </div>
      )}
    </div>
  );
}
