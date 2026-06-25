import { Bell } from 'lucide-react';
import { useStore, isAdmin, currentUser } from '../../../store';
import type { AvailStatus } from '../../../types';
import Avatar from '../../common/Avatar';
import { eventDayList, formatDate, formatDayMon } from '../../../data/utils';

const GRID = '2fr 1.2fr 1fr';
const REMINDERS = ['2 weeks before', '1 week before', '1 day before'];

/** Group consecutive ISO days and format "07/07 - 09/07, 11/07". */
function daysSummary(days: string[]): string {
  if (!days.length) return '';
  const sorted = [...days].sort();
  const groups: [string, string][] = [];
  let start = sorted[0];
  let prev = sorted[0];
  for (let i = 1; i < sorted.length; i++) {
    const d = new Date(prev);
    d.setDate(d.getDate() + 1);
    const exp = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    if (sorted[i] === exp) { prev = sorted[i]; } else { groups.push([start, prev]); start = sorted[i]; prev = sorted[i]; }
  }
  groups.push([start, prev]);
  return groups.map(([a, b]) => a === b ? formatDate(a) : `${formatDate(a)} - ${formatDate(b)}`).join(', ');
}

export default function AvailabilityTab({ eventId }: { eventId: string }) {
  const ev = useStore(s => s.events.find(e => e.id === eventId) || s.archivedEvents.find(e => e.id === eventId));
  const detail = useStore(s => s.detail[eventId]);
  const admin = useStore(isAdmin);
  const cu = useStore(currentUser);
  const staff = useStore(s => s.staff);
  const showReminderPanel = useStore(s => s.showReminderPanel);
  const setShowReminderPanel = useStore(s => s.setShowReminderPanel);
  const updateEventFlightDeadline = useStore(s => s.updateEventFlightDeadline);
  const toggleReminder = useStore(s => s.toggleReminder);
  const updateAvailability = useStore(s => s.updateAvailability);
  const toggleAvailDay = useStore(s => s.toggleAvailDay);
  const confirmAvailDays = useStore(s => s.confirmAvailDays);
  const openDmWith = useStore(s => s.openDmWith);

  if (!ev) return null;

  const days = eventDayList(ev.start, ev.end);
  const reminderOff = ev.reminderOff || [];
  const rows = (detail?.members || []).filter(m => m.status === 'confirmed');

  return (
    <div>
      {/* Flight deadline */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16, flexWrap: 'wrap' }}>
        {admin ? (
          <>
            <span style={{ fontSize: 12.5, color: 'var(--text-muted)' }}>Flight booking deadline</span>
            <input
              type="date"
              value={ev.flightDeadline || ''}
              onChange={e => updateEventFlightDeadline(eventId, e.target.value)}
              style={{ background: 'var(--field)', border: '1px solid var(--border-strong)', borderRadius: 8, padding: '7px 11px', color: 'var(--text)', fontSize: 12.5, fontFamily: 'inherit', outline: 'none' }}
            />
            {ev.flightDeadline && (
              <span onClick={() => updateEventFlightDeadline(eventId, '')} style={{ fontSize: 11, color: 'var(--text-faint)', cursor: 'pointer', textDecoration: 'underline' }}>clear</span>
            )}
          </>
        ) : (
          <span style={{ fontSize: 12.5, color: 'var(--text-muted)' }}>
            {ev.flightDeadline ? `Flight booking deadline: ${formatDayMon(ev.flightDeadline)}` : 'No flight booking deadline set yet'}
          </span>
        )}
      </div>

      {/* Automatic reminders (admin, only when deadline set) */}
      {admin && ev.flightDeadline && (
        <div style={{ background: 'var(--panel-2)', border: '1px solid var(--border)', borderRadius: 12, padding: '14px 16px', marginBottom: 18 }}>
          <div onClick={() => setShowReminderPanel(!showReminderPanel)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '.08em', fontWeight: 700 }}>Automatic Booking Reminders</div>
            <span style={{ color: 'var(--text-muted)', fontSize: 11 }}>▾</span>
          </div>
          {showReminderPanel && (
            <>
              <div style={{ fontSize: 11.5, color: 'var(--text-faint)', margin: '8px 0 12px' }}>Tap to switch each reminder on or off.</div>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                {REMINDERS.map((label, idx) => {
                  const on = !reminderOff.includes(idx);
                  return (
                    <div
                      key={idx}
                      onClick={() => toggleReminder(eventId, idx)}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 9, cursor: 'pointer', borderRadius: 9, padding: '9px 14px',
                        background: on ? 'color-mix(in srgb, var(--accent-deep) 14%, transparent)' : 'var(--field)',
                        border: '1px solid ' + (on ? 'var(--accent-deep)' : 'var(--border)'),
                        opacity: on ? 1 : 0.65,
                      }}
                    >
                      <Bell size={14} color={on ? 'var(--accent)' : 'var(--text-muted)'} />
                      <div style={{ fontSize: 12.5, fontWeight: 700 }}>{label}</div>
                      <span style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', color: on ? 'var(--accent)' : 'var(--text-faint)' }}>{on ? 'On' : 'Off'}</span>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      )}

      {/* Availability table */}
      <div style={{ border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden' }}>
        <div style={{ display: 'grid', gridTemplateColumns: GRID, background: 'var(--panel-2)', borderBottom: '1px solid var(--border)', fontSize: 10.5, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '.07em', fontWeight: 700 }}>
          <div style={{ padding: '12px 16px' }}>Staff Member</div>
          <div style={{ padding: '12px 16px' }}>Availability</div>
          <div style={{ padding: '12px 16px' }}>Flights Booked</div>
        </div>

        {rows.map(member => {
          const a = detail?.availability[member.id] || { status: 'Available' as AvailStatus, flights: false };
          const editable = admin || cu === member.id;
          const isLimited = a.status === 'Limited';
          const selDays = a.days || [];
          const confirmedDays = !!a.daysConfirmed;
          const isMe = cu === member.id;

          // bracket text next to name
          let bracket = '';
          if (isLimited) {
            if (confirmedDays && selDays.length) bracket = `(${daysSummary(selDays)})`;
            else if (!isMe) bracket = '(TBC)';
          }
          const showDayGrid = isLimited && editable && !confirmedDays;
          const showEditDays = editable && isLimited && confirmedDays;

          return (
            <div key={member.id} style={{ borderBottom: '1px solid var(--border)' }}>
              <div style={{ display: 'grid', gridTemplateColumns: GRID, alignItems: 'center' }}>
                <div style={{ padding: '11px 16px', display: 'flex', alignItems: 'center', gap: 10 }}>
                  <Avatar staffId={member.id} size={30} confirmed onClick={() => openDmWith(member.id)} />
                  <div style={{ minWidth: 0, display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                    <span style={{ fontSize: 13.5, fontWeight: 700 }}>{staff.find(s => s.id === member.id)?.name || member.id}</span>
                    {bracket && <span style={{ fontSize: 12, color: 'var(--accent)', fontWeight: 700 }}>{bracket}</span>}
                    {showEditDays && (
                      <span onClick={() => updateAvailability(eventId, member.id, { daysConfirmed: false })} style={{ fontSize: 11, fontWeight: 700, color: 'var(--accent)', cursor: 'pointer', textDecoration: 'underline' }}>Edit days</span>
                    )}
                  </div>
                </div>
                <div style={{ padding: '11px 16px' }}>
                  <select
                    value={a.status}
                    disabled={!editable}
                    onChange={e => updateAvailability(eventId, member.id, { status: e.target.value as AvailStatus })}
                    style={{ background: 'var(--field)', border: '1px solid var(--border-strong)', borderRadius: 7, padding: '5px 9px', color: 'var(--text)', fontSize: 12, fontFamily: 'inherit', ...(editable ? {} : { opacity: 0.6, cursor: 'default' }) }}
                  >
                    <option value="Available">Available</option>
                    <option value="Limited">Limited</option>
                  </select>
                </div>
                <div style={{ padding: '11px 16px', display: 'flex', alignItems: 'center', gap: 28, flexWrap: 'wrap' }}>
                  <div
                    onClick={editable && !a.flightNotReq ? () => updateAvailability(eventId, member.id, { flights: !a.flights }) : undefined}
                    style={{ width: 22, height: 22, borderRadius: 5, border: '1.5px solid var(--border-strong)', background: a.flights && !a.flightNotReq ? 'var(--accent-deep)' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 13, cursor: editable && !a.flightNotReq ? 'pointer' : 'default', opacity: editable && !a.flightNotReq ? 1 : 0.4 }}
                  >
                    {a.flights && !a.flightNotReq ? '✓' : ''}
                  </div>
                  <div onClick={editable ? () => updateAvailability(eventId, member.id, { flightNotReq: !a.flightNotReq }) : undefined} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: editable ? 'pointer' : 'default' }}>
                    <div style={{ width: 17, height: 17, borderRadius: 4, border: '1.5px solid var(--border-strong)', background: a.flightNotReq ? 'var(--text-muted)' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 11, flex: '0 0 17px' }}>
                      {a.flightNotReq ? '✓' : ''}
                    </div>
                    <span style={{ fontSize: 11.5, color: 'var(--text-muted)' }}>(flight not needed)</span>
                  </div>
                </div>
              </div>

              {/* Limited day picker (only the member, while unconfirmed) */}
              {showDayGrid && (
                <div style={{ padding: '0 16px 14px 56px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 9 }}>
                    <span style={{ fontSize: 11, color: '#E0A100', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.04em' }}>Limited —</span>
                    <span style={{ fontSize: 11.5, color: 'var(--text-muted)' }}>Tap the days you are available, then confirm.</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                    {days.map((d, i) => {
                      const sel = selDays.includes(d);
                      return (
                        <div
                          key={d}
                          onClick={() => toggleAvailDay(eventId, member.id, d)}
                          style={{
                            cursor: 'pointer', borderRadius: 8, padding: '7px 11px', textAlign: 'center', minWidth: 64,
                            background: sel ? 'var(--accent-deep)' : 'var(--field)',
                            border: '1px solid ' + (sel ? 'var(--accent-deep)' : 'var(--border-strong)'),
                            color: sel ? '#fff' : 'var(--text)',
                          }}
                        >
                          <div style={{ fontSize: 10.5, fontWeight: 700, opacity: 0.8 }}>Day {i + 1}</div>
                          <div style={{ fontSize: 12.5, fontWeight: 700, marginTop: 2 }}>{formatDate(d)}</div>
                        </div>
                      );
                    })}
                    <div
                      onClick={selDays.length ? () => confirmAvailDays(eventId, member.id) : undefined}
                      style={{ padding: '7px 14px', borderRadius: 8, cursor: selDays.length ? 'pointer' : 'not-allowed', fontSize: 12, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.03em', background: selDays.length ? 'var(--accent-deep)' : 'var(--control)', color: selDays.length ? '#fff' : 'var(--text-faint)' }}
                    >
                      Confirm dates
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
