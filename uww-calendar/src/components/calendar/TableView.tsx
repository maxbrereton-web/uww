import type React from 'react';
import {
  Calendar as CalendarIcon, Table as TableIcon, Search, SlidersHorizontal, Plus,
} from 'lucide-react';
import { useStore, useVisibleEvents, isAdmin, eventNotifCount } from '../../store';
import type { SortKey } from '../../types';
import { eventTypeLabel, formatDayMon, sortEvents, completionFor } from '../../data/utils';
import PriorityDot from '../common/PriorityDot';
import Avatar from '../common/Avatar';

const condLabel: React.CSSProperties = {
  fontStretch: '75%', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.02em',
};

const SORT_OPTIONS: Array<{ key: SortKey; label: string }> = [
  { key: 'date', label: 'Date' },
  { key: 'type', label: 'Type' },
  { key: 'completion', label: 'Completion' },
  { key: 'priority', label: 'Priority' },
];

function completionColor(pct: number): string {
  return pct >= 80 ? '#2e9e5b' : pct >= 40 ? '#E0A100' : '#ED1C24';
}

export default function TableView() {
  const search = useStore(s => s.search);
  const filterType = useStore(s => s.filterType);
  const filterPriority = useStore(s => s.filterPriority);
  const sortKey = useStore(s => s.sortKey);
  const sortDir = useStore(s => s.sortDir);
  const sortMenuOpen = useStore(s => s.sortMenuOpen);
  const detail = useStore(s => s.detail);
  const admin = useStore(isAdmin);
  const events = useVisibleEvents();
  const fullState = useStore(s => s);

  const setCalView = useStore(s => s.setCalView);
  const setSearch = useStore(s => s.setSearch);
  const openFilter = useStore(s => s.openFilter);
  const openNewEvent = useStore(s => s.openNewEvent);
  const toggleSortMenu = useStore(s => s.toggleSortMenu);
  const closeSortMenu = useStore(s => s.closeSortMenu);
  const setSort = useStore(s => s.setSort);
  const selectEvent = useStore(s => s.selectEvent);
  const setContextMenu = useStore(s => s.setContextMenu);
  const openDmWith = useStore(s => s.openDmWith);

  const q = search.trim().toLowerCase();
  const filtered = events
    .filter(e => !q || e.name.toLowerCase().includes(q))
    .filter(e => filterType === 'all' || e.eventType === filterType)
    .filter(e => filterPriority === 'all' || e.priority === filterPriority);

  const rows = sortEvents(filtered, sortKey, sortDir, detail);
  const sortLabel = SORT_OPTIONS.find(o => o.key === sortKey)?.label || 'Date';

  const toolbarBtn: React.CSSProperties = {
    display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 12px', borderRadius: 8,
    cursor: 'pointer', background: 'var(--control)', color: 'var(--text)', ...condLabel, fontSize: 11,
  };
  const headCell: React.CSSProperties = {
    ...condLabel, fontSize: 10.5, color: 'var(--text-muted)', padding: '13px 16px', textAlign: 'left', letterSpacing: '.08em',
  };
  const cell: React.CSSProperties = {
    padding: '15px 16px', borderTop: '1px solid var(--border)', fontSize: 13.5, color: 'var(--text)', verticalAlign: 'middle',
  };

  return (
    <div style={{ padding: '18px 24px', display: 'flex', flexDirection: 'column', gap: 14 }}>
      {/* Toolbar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
        {admin && (
          <button
            onClick={() => openNewEvent()}
            style={{ ...toolbarBtn, background: 'var(--accent-deep)', color: '#fff', padding: '9px 15px', boxShadow: '0 6px 16px rgba(241,90,34,.32)' }}
          >
            <Plus size={16} /> New Event <span style={{ opacity: 0.8, fontSize: 10 }}>▾</span>
          </button>
        )}

        <button onClick={e => { const r = e.currentTarget.getBoundingClientRect(); openFilter({ x: r.left, y: r.bottom }); }} style={toolbarBtn}>
          <SlidersHorizontal size={15} /> Filter <span style={{ color: 'var(--text-muted)', fontSize: 10 }}>▾</span>
        </button>

        {/* View toggle */}
        <div style={{ display: 'flex', background: 'var(--control)', borderRadius: 8, padding: 3, gap: 3 }}>
          <button
            onClick={() => setCalView('calendar')}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 12px', borderRadius: 6, cursor: 'pointer', background: 'transparent', color: 'var(--text-muted)', ...condLabel, fontSize: 11 }}
          >
            <CalendarIcon size={14} /> Calendar
          </button>
          <button
            onClick={() => setCalView('table')}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 12px', borderRadius: 6, cursor: 'pointer', background: 'var(--panel)', color: 'var(--text)', ...condLabel, fontSize: 11 }}
          >
            <TableIcon size={14} /> Table
          </button>
        </div>

        {/* Sort */}
        <div style={{ position: 'relative' }}>
          <button onClick={toggleSortMenu} style={toolbarBtn}>
            <span style={{ fontSize: 13 }}>⇅</span> Sort: {sortLabel} <span style={{ fontSize: 12, fontWeight: 800 }}>{sortDir === 'asc' ? '↑' : '↓'}</span> <span style={{ color: 'var(--text-muted)', fontSize: 10 }}>▾</span>
          </button>
          {sortMenuOpen && (
            <>
              <div onClick={closeSortMenu} style={{ position: 'fixed', inset: 0, zIndex: 40 }} />
              <div
                className="uww-overlay"
                style={{ position: 'absolute', top: 'calc(100% + 6px)', left: 0, zIndex: 41, minWidth: 194, background: 'var(--panel)', border: '1px solid var(--border-strong)', borderRadius: 11, boxShadow: 'var(--shadow)', overflow: 'hidden' }}
              >
                {SORT_OPTIONS.map(opt => {
                  const active = sortKey === opt.key;
                  return (
                    <button
                      key={opt.key}
                      onClick={() => setSort(opt.key)}
                      style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', padding: '10px 14px', cursor: 'pointer', background: active ? 'var(--control)' : 'transparent', color: active ? 'var(--text)' : 'var(--text-muted)', border: 'none', fontSize: 13, fontWeight: 600 }}
                    >
                      <span>{opt.label}</span>
                      {active && <span style={{ color: 'var(--accent)', fontWeight: 800 }}>{sortDir === 'asc' ? '↑' : '↓'}</span>}
                    </button>
                  );
                })}
              </div>
            </>
          )}
        </div>

        <div style={{ flex: 1 }} />

        {/* Search */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '0 12px', background: 'var(--field)', border: '1px solid var(--border-strong)', borderRadius: 10, height: 39 }}>
          <Search size={15} color="var(--text-muted)" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search events..."
            style={{ border: 'none', outline: 'none', background: 'transparent', color: 'var(--text)', fontSize: 13.5, width: 200 }}
          />
        </div>
      </div>

      {/* Table */}
      <div style={{ background: 'var(--panel)', border: '1px solid var(--border)', borderRadius: 14, overflow: 'hidden', boxShadow: 'var(--shadow)' }} data-table-wrap="1">
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 920 }}>
            <thead>
              <tr style={{ background: 'var(--panel-2)' }}>
                <th style={{ ...headCell, width: 44 }}>Pri</th>
                <th style={headCell}>Event</th>
                <th style={headCell}>Type</th>
                <th style={headCell}>Competition</th>
                <th style={headCell}>Dates</th>
                <th style={headCell}>Staff</th>
                {admin && <th style={headCell}>Completion</th>}
                <th style={headCell}>Notifications</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(ev => {
                const d = detail[ev.id];
                const confirmed = d ? d.members.filter(m => m.status === 'confirmed').map(m => m.id) : ev.staff;
                const completion = completionFor(ev.id, detail, events);
                const nCount = eventNotifCount(ev.id, fullState);

                return (
                  <tr
                    key={ev.id}
                    onClick={() => selectEvent(ev.id)}
                    onContextMenu={e => { e.preventDefault(); setContextMenu({ x: e.clientX, y: e.clientY, type: 'event', eventId: ev.id }); }}
                    style={{ cursor: 'pointer' }}
                  >
                    <td style={cell}><PriorityDot priority={ev.priority} /></td>
                    <td style={{ ...cell, fontWeight: 700 }}>{ev.name}</td>
                    <td style={{ ...cell, color: 'var(--text-muted)' }}>{eventTypeLabel(ev.eventType)}</td>
                    <td style={{ ...cell, color: 'var(--text-muted)' }}>{ev.competitionType || '—'}</td>
                    <td style={{ ...cell, color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                      {formatDayMon(ev.start)}{ev.end && ev.end !== ev.start ? ` – ${formatDayMon(ev.end)}` : ''}
                    </td>
                    <td style={cell}>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        {confirmed.slice(0, 5).map((sid, i) => (
                          <span key={sid} style={{ marginLeft: i === 0 ? 0 : -7 }} onClick={e => { e.stopPropagation(); openDmWith(sid); }}>
                            <Avatar staffId={sid} size={28} confirmed />
                          </span>
                        ))}
                        {confirmed.length > 5 && (
                          <span style={{ ...condLabel, fontSize: 11, color: 'var(--text-muted)', marginLeft: 7 }}>+{confirmed.length - 5}</span>
                        )}
                        {confirmed.length === 0 && <span style={{ color: 'var(--text-faint)' }}>—</span>}
                      </div>
                    </td>
                    {admin && (
                      <td style={cell}>
                        <span style={{ ...condLabel, fontSize: 14, color: completionColor(completion) }}>{completion}%</span>
                      </td>
                    )}
                    <td style={cell}>
                      {nCount > 0 ? (
                        <span style={{ minWidth: 18, height: 18, padding: '0 5px', borderRadius: 6, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 800, background: '#ED1C24', color: '#fff' }}>{nCount}</span>
                      ) : (
                        <span style={{ color: 'var(--text-faint)', fontSize: 13 }}>—</span>
                      )}
                    </td>
                  </tr>
                );
              })}
              {rows.length === 0 && (
                <tr>
                  <td colSpan={admin ? 8 : 7} style={{ ...cell, textAlign: 'center', color: 'var(--text-muted)', padding: 28 }}>
                    No events match your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
