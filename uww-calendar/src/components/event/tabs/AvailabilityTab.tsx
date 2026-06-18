import type React from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { useStore, isAdmin, currentUser } from '../../../store';
import type { AvailStatus } from '../../../types';
import Avatar from '../../common/Avatar';
import { eventDayList, formatDate, formatDateFull } from '../../../data/utils';

const condensed: React.CSSProperties = {
  fontStretch: '75%',
  fontWeight: 800,
  textTransform: 'uppercase',
  letterSpacing: '.02em',
};

const sectionHeading: React.CSSProperties = { ...condensed, fontSize: 13, color: 'var(--text)', margin: '0 0 12px' };

const inputStyle: React.CSSProperties = {
  background: 'var(--field)',
  border: '1px solid var(--border)',
  borderRadius: 6,
  color: 'var(--text)',
  fontSize: 13,
  padding: '5px 8px',
};

const REMINDER_LABELS = ['2 weeks before', '1 week before', '1 day before'];

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

  if (!ev) return null;

  const days = eventDayList(ev.start, ev.end);
  const reminderOff = ev.reminderOff || [];
  const confirmedMembers = (detail?.members || []).filter(m => m.status === 'confirmed');

  return (
    <div>
      {/* Flight deadline */}
      <div style={{ marginBottom: 18 }}>
        <div style={sectionHeading}>Flight booking deadline</div>
        {admin ? (
          <input
            type="date"
            style={inputStyle}
            value={ev.flightDeadline || ''}
            onChange={e => updateEventFlightDeadline(eventId, e.target.value)}
          />
        ) : (
          <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>
            {ev.flightDeadline ? `Flights must be booked by ${formatDateFull(ev.flightDeadline)}` : 'No deadline set.'}
          </div>
        )}
      </div>

      {/* Automatic reminders (admin only) */}
      {admin && (
        <div style={{ marginBottom: 22 }}>
          <button
            type="button"
            onClick={() => setShowReminderPanel(!showReminderPanel)}
            style={{
              ...condensed, fontSize: 13, color: 'var(--text)',
              display: 'inline-flex', alignItems: 'center', gap: 6,
              background: 'transparent', border: 'none', cursor: 'pointer', padding: 0,
            }}
          >
            {showReminderPanel ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            Automatic reminders
          </button>
          {showReminderPanel && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 10 }}>
              {REMINDER_LABELS.map((label, idx) => {
                const on = !reminderOff.includes(idx);
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => toggleReminder(eventId, idx)}
                    style={{
                      ...condensed, fontSize: 11,
                      padding: '6px 12px', borderRadius: 999, cursor: 'pointer',
                      border: on ? '1px solid var(--accent)' : '1px solid var(--border)',
                      background: on ? 'var(--accent)' : 'var(--control)',
                      color: on ? '#fff' : 'var(--text-muted)',
                    }}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Per-member availability */}
      <div style={sectionHeading}>Team availability</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {confirmedMembers.length === 0 && <div style={{ color: 'var(--text-muted)', fontSize: 13 }}>No confirmed members.</div>}
        {confirmedMembers.map(member => {
          const avail = detail?.availability[member.id] || { status: 'Available' as AvailStatus, flights: false };
          const canEditDays = admin || cu === member.id;
          const selDays = avail.days || [];
          let range = '';
          if (selDays.length > 0) {
            const sorted = [...selDays].sort();
            range = `(${formatDate(sorted[0])}–${formatDate(sorted[sorted.length - 1])})`;
          }
          return (
            <div key={member.id} style={{ background: 'var(--panel)', border: '1px solid var(--border)', borderRadius: 10, padding: '10px 12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                <Avatar staffId={member.id} size={26} confirmed />
                <span style={{ fontSize: 13, color: 'var(--text)', fontWeight: 600, flex: '1 1 140px' }}>
                  {staff.find(s => s.id === member.id)?.name || member.id}
                </span>

                <select
                  style={inputStyle}
                  value={avail.status}
                  onChange={e => updateAvailability(eventId, member.id, { status: e.target.value as AvailStatus })}
                  disabled={!canEditDays}
                >
                  <option value="Available">Available</option>
                  <option value="Limited">Limited</option>
                </select>

                <label style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--text-muted)' }}>
                  <input
                    type="checkbox"
                    checked={!!avail.flights}
                    onChange={e => updateAvailability(eventId, member.id, { flights: e.target.checked })}
                    disabled={!canEditDays}
                  />
                  Flight booked
                </label>

                <label style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--text-muted)' }}>
                  <input
                    type="checkbox"
                    checked={!!avail.flightNotReq}
                    onChange={e => updateAvailability(eventId, member.id, { flightNotReq: e.target.checked })}
                    disabled={!canEditDays}
                  />
                  Flight not needed
                </label>
              </div>

              {avail.status === 'Limited' && (
                <div style={{ marginTop: 10 }}>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, alignItems: 'center' }}>
                    {days.map(d => {
                      const sel = selDays.includes(d);
                      return (
                        <button
                          key={d}
                          type="button"
                          onClick={canEditDays ? () => toggleAvailDay(eventId, member.id, d) : undefined}
                          style={{
                            ...condensed, fontSize: 11,
                            padding: '4px 9px', borderRadius: 6,
                            cursor: canEditDays ? 'pointer' : 'default',
                            border: sel ? '1px solid var(--accent)' : '1px solid var(--border)',
                            background: sel ? 'var(--accent)' : 'var(--control)',
                            color: sel ? '#fff' : 'var(--text-muted)',
                          }}
                        >
                          {formatDate(d)}
                        </button>
                      );
                    })}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 8 }}>
                    {canEditDays && (
                      <button
                        type="button"
                        onClick={() => confirmAvailDays(eventId, member.id)}
                        style={{
                          ...condensed, fontSize: 11, padding: '5px 10px', borderRadius: 6,
                          border: 'none', background: 'var(--accent)', color: '#fff', cursor: 'pointer',
                        }}
                      >
                        Confirm dates
                      </button>
                    )}
                    {avail.daysConfirmed && selDays.length > 0 && (
                      <span style={{ ...condensed, fontSize: 12, color: 'var(--accent)' }}>{range}</span>
                    )}
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
