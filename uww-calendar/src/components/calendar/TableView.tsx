import type React from 'react';
import {
  Calendar as CalendarIcon, Table as TableIcon, Search, SlidersHorizontal,
  ArrowUpDown, Check,
} from 'lucide-react';
import { useStore, visibleEvents, isAdmin, eventNotifCount } from '../../store';
import type { SortKey } from '../../types';
import {
  eventTypeLabel, formatDate, sortEvents, completionFor,
} from '../../data/utils';
import PriorityDot from '../common/PriorityDot';
import Avatar from '../common/Avatar';

const condLabel: React.CSSProperties = {
  fontStretch: '75%',
  fontWeight: 800,
  textTransform: 'uppercase',
  letterSpacing: '.02em',
};

const SORT_OPTIONS: Array<{ key: SortKey; label: string }> = [
  { key: 'date', label: 'Date' },
  { key: 'type', label: 'Type' },
  { key: 'completion', label: 'Completion' },
  { key: 'priority', label: 'Priority' },
];

export default function TableView() {
  const search = useStore(s => s.search);
  const filterType = useStore(s => s.filterType);
  const filterPriority = useStore(s => s.filterPriority);
  const sortKey = useStore(s => s.sortKey);
  const sortDir = useStore(s => s.sortDir);
  const sortMenuOpen = useStore(s => s.sortMenuOpen);
  const detail = useStore(s => s.detail);
  const admin = useStore(isAdmin);
  const events = useStore(visibleEvents);
  const fullState = useStore(s => s);

  const setCalView = useStore(s => s.setCalView);
  const setSearch = useStore(s => s.setSearch);
  const openFilter = useStore(s => s.openFilter);
  const toggleSortMenu = useStore(s => s.toggleSortMenu);
  const closeSortMenu = useStore(s => s.closeSortMenu);
  const setSort = useStore(s => s.setSort);
  const selectEvent = useStore(s => s.selectEvent);

  const q = search.trim().toLowerCase();
  const filtered = events
    .filter(e => !q || e.name.toLowerCase().includes(q))
    .filter(e => filterType === 'all' || e.eventType === filterType)
    .filter(e => filterPriority === 'all' || e.priority === filterPriority);

  const rows = sortEvents(filtered, sortKey, sortDir, detail);

  const toolbarBtn: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    padding: '8px 12px',
    borderRadius: 8,
    cursor: 'pointer',
    background: 'var(--control)',
    color: 'var(--text)',
    ...condLabel,
    fontSize: 11,
  };

  const headCell: React.CSSProperties = {
    ...condLabel,
    fontSize: 10,
    color: 'var(--text-muted)',
    padding: '10px 12px',
    textAlign: 'left',
  };

  const bodyCell: React.CSSProperties = {
    padding: '12px',
    borderTop: '1px solid var(--border)',
    fontSize: 12,
    color: 'var(--text)',
    verticalAlign: 'middle',
  };

  return (
    <div style={{ padding: 18, display: 'flex', flexDirection: 'column', gap: 14 }}>
      {/* Toolbar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
        {/* View toggle */}
        <div style={{ display: 'flex', background: 'var(--control)', borderRadius: 8, padding: 3, gap: 3 }}>
          <button
            onClick={() => setCalView('calendar')}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 10px', borderRadius: 6,
              cursor: 'pointer', background: 'transparent', color: 'var(--text-muted)', ...condLabel, fontSize: 11,
            }}
          >
            <CalendarIcon size={14} /> Calendar
          </button>
          <button
            onClick={() => setCalView('table')}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 10px', borderRadius: 6,
              cursor: 'pointer', background: 'var(--accent)', color: '#fff', ...condLabel, fontSize: 11,
            }}
          >
            <TableIcon size={14} /> Table
          </button>
        </div>

        <div style={{ flex: 1 }} />

        {/* Search */}
        <div
          style={{
            display: 'flex', alignItems: 'center', gap: 6, padding: '0 10px',
            background: 'var(--field)', border: '1px solid var(--border)', borderRadius: 8, height: 36,
          }}
        >
          <Search size={15} color="var(--text-muted)" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search events"
            style={{
              border: 'none', outline: 'none', background: 'transparent', color: 'var(--text)',
              fontSize: 13, width: 160,
            }}
          />
        </div>

        <button onClick={openFilter} style={toolbarBtn}>
          <SlidersHorizontal size={15} /> Filter
        </button>

        {/* Sort menu */}
        <div style={{ position: 'relative' }}>
          <button onClick={toggleSortMenu} style={toolbarBtn}>
            <ArrowUpDown size={15} /> Sort
          </button>
          {sortMenuOpen && (
            <>
              <div
                onClick={closeSortMenu}
                style={{ position: 'fixed', inset: 0, zIndex: 40 }}
              />
              <div
                className="uww-overlay"
                style={{
                  position: 'absolute',
                  top: 'calc(100% + 6px)',
                  right: 0,
                  zIndex: 41,
                  minWidth: 180,
                  background: 'var(--panel)',
                  border: '1px solid var(--border)',
                  borderRadius: 10,
                  boxShadow: 'var(--shadow)',
                  padding: 6,
                }}
              >
                {SORT_OPTIONS.map(opt => {
                  const active = sortKey === opt.key;
                  return (
                    <button
                      key={opt.key}
                      onClick={() => setSort(opt.key)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        width: '100%',
                        padding: '8px 10px',
                        borderRadius: 6,
                        cursor: 'pointer',
                        background: active ? 'var(--control)' : 'transparent',
                        color: active ? 'var(--text)' : 'var(--text-muted)',
                        ...condLabel,
                        fontSize: 11,
                      }}
                    >
                      <span>{opt.label}</span>
                      {active && (
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                          <Check size={13} />
                          <span style={{ fontSize: 10 }}>{sortDir === 'asc' ? 'Asc' : 'Desc'}</span>
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Table */}
      <div
        style={{
          background: 'var(--panel)',
          border: '1px solid var(--border)',
          borderRadius: 12,
          overflow: 'hidden',
        }}
      >
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: 'var(--panel-2)' }}>
              <th style={{ ...headCell, width: 44 }}>Pri</th>
              <th style={headCell}>Event</th>
              <th style={headCell}>Type</th>
              <th style={headCell}>Competition</th>
              <th style={headCell}>Dates</th>
              <th style={headCell}>Staff</th>
              {admin && <th style={headCell}>Completion</th>}
              <th style={headCell}>Notifs</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(ev => {
              const d = detail[ev.id];
              const confirmed = d
                ? d.members.filter(m => m.status === 'confirmed').map(m => m.id)
                : ev.staff;
              const completion = completionFor(ev.id, detail, events);
              const nCount = eventNotifCount(ev.id, fullState);

              return (
                <tr
                  key={ev.id}
                  onClick={() => selectEvent(ev.id)}
                  style={{ cursor: 'pointer' }}
                >
                  <td style={bodyCell}>
                    <PriorityDot priority={ev.priority} />
                  </td>
                  <td style={{ ...bodyCell, ...condLabel, fontSize: 12 }}>{ev.name}</td>
                  <td style={{ ...bodyCell, color: 'var(--text-muted)' }}>{eventTypeLabel(ev.eventType)}</td>
                  <td style={{ ...bodyCell, color: 'var(--text-muted)' }}>{ev.competitionType}</td>
                  <td style={{ ...bodyCell, color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                    {formatDate(ev.start)}{ev.end && ev.end !== ev.start ? `–${formatDate(ev.end)}` : ''}
                  </td>
                  <td style={bodyCell}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      {confirmed.slice(0, 5).map((sid, i) => (
                        <span key={sid} style={{ marginLeft: i === 0 ? 0 : -6 }}>
                          <Avatar staffId={sid} size={22} confirmed />
                        </span>
                      ))}
                      {confirmed.length > 5 && (
                        <span style={{ ...condLabel, fontSize: 10, color: 'var(--text-muted)', marginLeft: 6 }}>
                          +{confirmed.length - 5}
                        </span>
                      )}
                    </div>
                  </td>
                  {admin && (
                    <td style={bodyCell}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div
                          style={{
                            width: 70,
                            height: 6,
                            borderRadius: 999,
                            background: 'var(--control)',
                            overflow: 'hidden',
                          }}
                        >
                          <div
                            style={{
                              width: `${completion}%`,
                              height: '100%',
                              background: 'var(--accent)',
                            }}
                          />
                        </div>
                        <span style={{ ...condLabel, fontSize: 11, color: 'var(--text-muted)' }}>{completion}%</span>
                      </div>
                    </td>
                  )}
                  <td style={bodyCell}>
                    {nCount > 0 ? (
                      <span
                        style={{
                          minWidth: 18,
                          height: 18,
                          padding: '0 5px',
                          borderRadius: 999,
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: 10,
                          fontWeight: 800,
                          fontStretch: '75%',
                          background: '#ef4444',
                          color: '#fff',
                        }}
                      >
                        {nCount}
                      </span>
                    ) : (
                      <span style={{ color: 'var(--text-faint)', fontSize: 12 }}>—</span>
                    )}
                  </td>
                </tr>
              );
            })}
            {rows.length === 0 && (
              <tr>
                <td
                  colSpan={admin ? 8 : 7}
                  style={{ ...bodyCell, textAlign: 'center', color: 'var(--text-muted)', padding: 28 }}
                >
                  No events match your filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
