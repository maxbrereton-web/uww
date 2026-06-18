import type React from 'react';
import {
  ChevronLeft, ChevronRight, Calendar as CalendarIcon, Table as TableIcon,
  Search, SlidersHorizontal, Plus, Download,
} from 'lucide-react';
import { useStore, visibleEvents, isAdmin, eventNotifCount } from '../../store';
import type { UWWEvent } from '../../types';
import {
  buildCalendarWeeks, toISO, eventBarColor, priorityRank,
} from '../../data/utils';
import PriorityDot from '../common/PriorityDot';
import Avatar from '../common/Avatar';

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];
const DOW = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const condLabel: React.CSSProperties = {
  fontStretch: '75%',
  fontWeight: 800,
  textTransform: 'uppercase',
  letterSpacing: '.02em',
};

const ROW_TOP = 28; // vertical room reserved for day numbers
const LANE_H = 26; // lane vertical pitch
const BAR_H = 24;
const MAX_LANES = 3;

interface PlacedBar {
  ev: UWWEvent;
  firstCol: number;
  lastCol: number;
  lane: number;
}

interface WeekLayout {
  bars: PlacedBar[];
  overflowByCol: Record<number, UWWEvent[]>;
  maxLane: number;
}

/** For a week (7 day-slots), compute which columns each event covers. */
function spanInWeek(ev: UWWEvent, dates: Array<Date | null>): [number, number] | null {
  let first = -1;
  let last = -1;
  for (let col = 0; col < dates.length; col++) {
    const d = dates[col];
    if (!d) continue;
    const iso = toISO(d);
    if (iso >= ev.start && iso <= ev.end) {
      if (first === -1) first = col;
      last = col;
    }
  }
  if (first === -1) return null;
  return [first, last];
}

function layoutWeek(events: UWWEvent[], dates: Array<Date | null>): WeekLayout {
  // events already sorted by priority rank then start
  const spans = events
    .map(ev => {
      const s = spanInWeek(ev, dates);
      return s ? { ev, firstCol: s[0], lastCol: s[1] } : null;
    })
    .filter((x): x is { ev: UWWEvent; firstCol: number; lastCol: number } => x !== null);

  const bars: PlacedBar[] = [];
  const overflowByCol: Record<number, UWWEvent[]> = {};
  const lanes: Array<Array<[number, number]>> = []; // per lane: occupied column ranges
  let maxLane = -1;

  for (const sp of spans) {
    let placed = -1;
    for (let lane = 0; lane < MAX_LANES; lane++) {
      const occ = lanes[lane] || [];
      const collides = occ.some(([a, b]) => sp.firstCol <= b && a <= sp.lastCol);
      if (!collides) {
        if (!lanes[lane]) lanes[lane] = [];
        lanes[lane].push([sp.firstCol, sp.lastCol]);
        placed = lane;
        break;
      }
    }
    if (placed === -1) {
      // overflow: add a chip to each column it would occupy
      for (let c = sp.firstCol; c <= sp.lastCol; c++) {
        (overflowByCol[c] = overflowByCol[c] || []).push(sp.ev);
      }
    } else {
      maxLane = Math.max(maxLane, placed);
      bars.push({ ev: sp.ev, firstCol: sp.firstCol, lastCol: sp.lastCol, lane: placed });
    }
  }

  return { bars, overflowByCol, maxLane };
}

export default function CalendarGrid() {
  const year = useStore(s => s.year);
  const month = useStore(s => s.month);
  const search = useStore(s => s.search);
  const filterType = useStore(s => s.filterType);
  const filterPriority = useStore(s => s.filterPriority);
  const detail = useStore(s => s.detail);
  const admin = useStore(isAdmin);

  const events = useStore(visibleEvents);
  const fullState = useStore(s => s);

  const prevMonth = useStore(s => s.prevMonth);
  const nextMonth = useStore(s => s.nextMonth);
  const setCalView = useStore(s => s.setCalView);
  const setSearch = useStore(s => s.setSearch);
  const openFilter = useStore(s => s.openFilter);
  const openNewEvent = useStore(s => s.openNewEvent);
  const openImport = useStore(s => s.openImport);
  const selectEvent = useStore(s => s.selectEvent);
  const setContextMenu = useStore(s => s.setContextMenu);

  const q = search.trim().toLowerCase();
  const filtered = events
    .filter(e => !q || e.name.toLowerCase().includes(q))
    .filter(e => filterType === 'all' || e.eventType === filterType)
    .filter(e => filterPriority === 'all' || e.priority === filterPriority);

  // sort by priority then start date — used for stable lane assignment
  const sorted = [...filtered].sort((a, b) => {
    const pr = priorityRank(a.priority) - priorityRank(b.priority);
    return pr !== 0 ? pr : a.start.localeCompare(b.start);
  });

  const weeks = buildCalendarWeeks(year, month);

  // helper to count event notifs without re-subscribing per event
  const notifCount = (eventId: string): number => eventNotifCount(eventId, fullState);

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

  return (
    <div style={{ padding: 18, display: 'flex', flexDirection: 'column', gap: 14 }}>
      {/* Toolbar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <button onClick={prevMonth} title="Previous month" style={{ ...toolbarBtn, padding: 8 }}>
            <ChevronLeft size={16} />
          </button>
          <div style={{ ...condLabel, fontSize: 16, color: 'var(--text)', minWidth: 150, textAlign: 'center' }}>
            {MONTHS[month]} {year}
          </div>
          <button onClick={nextMonth} title="Next month" style={{ ...toolbarBtn, padding: 8 }}>
            <ChevronRight size={16} />
          </button>
        </div>

        {/* View toggle */}
        <div style={{ display: 'flex', background: 'var(--control)', borderRadius: 8, padding: 3, gap: 3 }}>
          <button
            onClick={() => setCalView('calendar')}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 10px', borderRadius: 6,
              cursor: 'pointer', background: 'var(--accent)', color: '#fff', ...condLabel, fontSize: 11,
            }}
          >
            <CalendarIcon size={14} /> Calendar
          </button>
          <button
            onClick={() => setCalView('table')}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 10px', borderRadius: 6,
              cursor: 'pointer', background: 'transparent', color: 'var(--text-muted)', ...condLabel, fontSize: 11,
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

        {admin && (
          <>
            <button
              onClick={() => openNewEvent()}
              style={{ ...toolbarBtn, background: 'var(--accent)', color: '#fff' }}
            >
              <Plus size={15} /> New Event
            </button>
            <button onClick={openImport} style={toolbarBtn}>
              <Download size={15} /> Import
            </button>
          </>
        )}
      </div>

      {/* Day-of-week header */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 0 }}>
        {DOW.map(d => (
          <div
            key={d}
            style={{ ...condLabel, fontSize: 11, color: 'var(--text-muted)', padding: '6px 8px', textAlign: 'left' }}
          >
            {d}
          </div>
        ))}
      </div>

      {/* Weeks */}
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {weeks.map((week, wi) => {
          const { bars, overflowByCol, maxLane } = layoutWeek(sorted, week.dates);
          const usedLanes = Math.min(MAX_LANES, maxLane + 1);
          const minHeight = Math.max(120, ROW_TOP + usedLanes * LANE_H + 8);

          return (
            <div key={wi} style={{ position: 'relative', minHeight }}>
              {/* Day cells (the sizing element) */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(7, 1fr)',
                  position: 'absolute',
                  inset: 0,
                }}
              >
                {week.dates.map((d, ci) => {
                  const iso = d ? toISO(d) : '';
                  const overflow = overflowByCol[ci] || [];
                  return (
                    <div
                      key={ci}
                      onContextMenu={d && admin ? (e => {
                        e.preventDefault();
                        setContextMenu({ x: e.clientX, y: e.clientY, type: 'day', date: iso });
                      }) : undefined}
                      style={{
                        background: d ? 'var(--cell)' : 'var(--cell-muted)',
                        border: '1px solid var(--border)',
                        minHeight: 110,
                        position: 'relative',
                        cursor: d && admin ? 'context-menu' : 'default',
                      }}
                    >
                      {d && (
                        <div
                          style={{
                            ...condLabel, fontSize: 12, color: 'var(--text-muted)', padding: '6px 8px',
                          }}
                        >
                          {d.getDate()}
                        </div>
                      )}
                      {/* +N more chip pinned near bottom of the cell */}
                      {overflow.length > 0 && (
                        <button
                          onClick={() => selectEvent(overflow[0].id)}
                          style={{
                            position: 'absolute',
                            left: 4,
                            bottom: 4,
                            padding: '2px 7px',
                            borderRadius: 999,
                            cursor: 'pointer',
                            background: 'var(--accent)',
                            color: '#fff',
                            ...condLabel,
                            fontSize: 10,
                          }}
                          title={`${overflow.length} more event(s)`}
                        >
                          +{overflow.length} more
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Bars overlay */}
              <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
                {bars.map(bar => {
                  const { ev, firstCol, lastCol, lane } = bar;
                  const leftPct = (firstCol / 7) * 100;
                  const widthPct = ((lastCol - firstCol + 1) / 7) * 100;
                  const isStart = ev.start === toISO(week.dates[firstCol] as Date);
                  const d = detail[ev.id];
                  const confirmed = d
                    ? d.members.filter(m => m.status === 'confirmed').map(m => m.id)
                    : ev.staff;
                  const nCount = notifCount(ev.id);

                  return (
                    <div
                      key={ev.id + '-' + wi}
                      onClick={() => selectEvent(ev.id)}
                      onContextMenu={e => {
                        e.preventDefault();
                        setContextMenu({ x: e.clientX, y: e.clientY, type: 'event', eventId: ev.id });
                      }}
                      title={ev.name}
                      style={{
                        position: 'absolute',
                        left: `calc(${leftPct}% + 3px)`,
                        width: `calc(${widthPct}% - 6px)`,
                        top: ROW_TOP + lane * LANE_H,
                        height: BAR_H,
                        background: eventBarColor(ev),
                        borderRadius: 6,
                        padding: '0 6px',
                        color: '#fff',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6,
                        fontSize: 11,
                        overflow: 'hidden',
                        cursor: 'pointer',
                        pointerEvents: 'auto',
                      }}
                    >
                      {isStart && (
                        <>
                          <PriorityDot priority={ev.priority} size={8} />
                          <span
                            style={{
                              ...condLabel,
                              fontSize: 11,
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                              flex: 1,
                              minWidth: 0,
                            }}
                          >
                            {ev.name}
                          </span>
                        </>
                      )}
                      <div style={{ flex: isStart ? '0 0 auto' : 1 }} />
                      {/* confirmed staff avatars */}
                      <div style={{ display: 'flex', alignItems: 'center', flex: '0 0 auto' }}>
                        {confirmed.slice(0, 3).map((sid, i) => (
                          <span key={sid} style={{ marginLeft: i === 0 ? 0 : -5 }}>
                            <Avatar staffId={sid} size={16} confirmed />
                          </span>
                        ))}
                      </div>
                      {nCount > 0 && (
                        <span
                          style={{
                            width: 8,
                            height: 8,
                            borderRadius: '50%',
                            background: '#ef4444',
                            flex: '0 0 auto',
                          }}
                          title={`${nCount} notification(s)`}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
