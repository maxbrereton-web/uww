import type React from 'react';
import {
  ChevronLeft, ChevronRight, Calendar as CalendarIcon, Table as TableIcon,
  Search, SlidersHorizontal, Plus,
} from 'lucide-react';
import { useStore, visibleEvents, isAdmin, eventNotifCount } from '../../store';
import type { UWWEvent } from '../../types';
import {
  buildCalendarWeeks, toISO, eventBarColor, eventBarTextColor, priorityRank, isoToday,
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

const BAND_TOP = 34; // vertical room reserved above the first bar lane
const LANE_H = 40; // bar height
const GAP = 5; // vertical gap between lanes
const OVH = 20; // overflow-chip height
const CELL_MIN = 132; // minimum day-cell / week-row height
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
  const selectEvent = useStore(s => s.selectEvent);
  const setContextMenu = useStore(s => s.setContextMenu);
  const openDmWith = useStore(s => s.openDmWith);

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
        {admin && (
          <button
            onClick={() => openNewEvent()}
            style={{
              ...toolbarBtn,
              background: 'var(--accent-deep)',
              color: '#fff',
              padding: '9px 15px',
              boxShadow: '0 6px 16px rgba(241,90,34,.32)',
            }}
          >
            <Plus size={16} /> New Event <span style={{ opacity: 0.8, fontSize: 10 }}>▾</span>
          </button>
        )}

        <button onClick={openFilter} style={toolbarBtn}>
          <SlidersHorizontal size={15} /> Filter <span style={{ color: 'var(--text-muted)', fontSize: 10 }}>▾</span>
        </button>

        {/* View toggle */}
        <div style={{ display: 'flex', background: 'var(--control)', borderRadius: 8, padding: 3, gap: 3 }}>
          <button
            onClick={() => setCalView('calendar')}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 12px', borderRadius: 6,
              cursor: 'pointer', background: 'var(--panel)', color: 'var(--text)', ...condLabel, fontSize: 11,
            }}
          >
            <CalendarIcon size={14} /> Calendar
          </button>
          <button
            onClick={() => setCalView('table')}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 12px', borderRadius: 6,
              cursor: 'pointer', background: 'transparent', color: 'var(--text-muted)', ...condLabel, fontSize: 11,
            }}
          >
            <TableIcon size={14} /> Table
          </button>
        </div>

        {/* Centered month nav */}
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14, minWidth: 200 }}>
          <button onClick={prevMonth} title="Previous month" style={{ background: 'none', color: 'var(--text-muted)', fontSize: 20, cursor: 'pointer', lineHeight: 1 }}>
            <ChevronLeft size={18} />
          </button>
          <div style={{ ...condLabel, fontSize: 18, color: 'var(--text)', letterSpacing: '.04em', minWidth: 150, textAlign: 'center' }}>
            {MONTHS[month]} {year}
          </div>
          <button onClick={nextMonth} title="Next month" style={{ background: 'none', color: 'var(--text-muted)', fontSize: 20, cursor: 'pointer', lineHeight: 1 }}>
            <ChevronRight size={18} />
          </button>
        </div>

        {/* Search */}
        <div
          style={{
            display: 'flex', alignItems: 'center', gap: 6, padding: '0 12px',
            background: 'var(--field)', border: '1px solid var(--border-strong)', borderRadius: 10, height: 39,
          }}
        >
          <Search size={15} color="var(--text-muted)" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search events..."
            style={{
              border: 'none', outline: 'none', background: 'transparent', color: 'var(--text)',
              fontSize: 13.5, width: 200,
            }}
          />
        </div>
      </div>

      {/* Calendar panel */}
      <div
        style={{
          background: 'var(--panel)',
          border: '1px solid var(--border)',
          borderRadius: 14,
          overflow: 'hidden',
          boxShadow: 'var(--shadow)',
        }}
      >
        {/* Day-of-week header */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 1fr)',
            background: 'var(--panel-2)',
            borderBottom: '1px solid var(--border)',
          }}
        >
          {DOW.map(d => (
            <div
              key={d}
              style={{
                ...condLabel,
                fontSize: 11,
                color: 'var(--text-muted)',
                letterSpacing: '.1em',
                padding: '11px 12px',
              }}
            >
              {d}
            </div>
          ))}
        </div>

        {/* Weeks */}
        {weeks.map((week, wi) => {
          const { bars, overflowByCol, maxLane } = layoutWeek(sorted, week.dates);
          const usedLanes = Math.min(MAX_LANES, maxLane + 1);
          const hasOverflow = Object.keys(overflowByCol).length > 0;
          const rowHeight = Math.max(
            CELL_MIN,
            BAND_TOP + usedLanes * (LANE_H + GAP) + (hasOverflow ? OVH + GAP : 0) + 6,
          );
          const today = isoToday();

          return (
            <div key={wi} style={{ position: 'relative', borderBottom: wi < weeks.length - 1 ? '1px solid var(--border)' : 'none' }}>
              {/* Day cells (the sizing element) */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)' }}>
                {week.dates.map((d, ci) => {
                  const iso = d ? toISO(d) : '';
                  const isToday = !!d && iso === today;
                  return (
                    <div
                      key={ci}
                      onContextMenu={d && admin ? (e => {
                        e.preventDefault();
                        setContextMenu({ x: e.clientX, y: e.clientY, type: 'day', date: iso });
                      }) : undefined}
                      style={{
                        minHeight: rowHeight,
                        padding: '8px 10px',
                        position: 'relative',
                        background: d ? 'transparent' : 'var(--cell-muted)',
                        borderRight: ci < 6 ? '1px solid var(--border)' : 'none',
                        cursor: d && admin ? 'context-menu' : 'default',
                      }}
                    >
                      {d && (
                        <div
                          style={{
                            fontSize: 13,
                            fontWeight: 700,
                            fontVariantNumeric: 'tabular-nums',
                            textAlign: 'right',
                            color: isToday ? '#fff' : 'var(--text)',
                            ...(isToday
                              ? {
                                  width: 24,
                                  height: 24,
                                  borderRadius: '50%',
                                  background: 'var(--accent-deep)',
                                  marginLeft: 'auto',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  lineHeight: 1,
                                }
                              : {}),
                          }}
                        >
                          {d.getDate()}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Bars overlay */}
              <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
                {bars.map(bar => {
                  const { ev, firstCol, lastCol, lane } = bar;
                  const leftPct = ((firstCol / 7) * 100).toFixed(3);
                  const widthPct = (((lastCol - firstCol + 1) / 7) * 100).toFixed(3);
                  const roundL = ev.start === toISO(week.dates[firstCol] as Date);
                  const roundR = ev.end === toISO(week.dates[lastCol] as Date);
                  const barBg = eventBarColor(ev);
                  const fg = eventBarTextColor(ev);
                  const d = detail[ev.id];
                  const confirmedIds = d
                    ? d.members.filter(m => m.status === 'confirmed').map(m => m.id)
                    : ev.staff;
                  const nCount = notifCount(ev.id);
                  const avatars = roundL ? ev.staff.slice(0, 4) : [];

                  return (
                    <div
                      key={ev.id + '-' + wi}
                      onClick={() => selectEvent(ev.id)}
                      onContextMenu={e => {
                        e.preventDefault();
                        setContextMenu({ x: e.clientX, y: e.clientY, type: 'event', eventId: ev.id });
                      }}
                      title={`${ev.name} · ${ev.priority} priority`}
                      style={{
                        position: 'absolute',
                        left: `calc(${leftPct}% + 4px)`,
                        width: `calc(${widthPct}% - 8px)`,
                        top: BAND_TOP + lane * (LANE_H + GAP),
                        height: LANE_H,
                        background: barBg,
                        color: fg,
                        display: 'flex',
                        alignItems: 'center',
                        overflow: 'visible',
                        borderTopLeftRadius: roundL ? 7 : 0,
                        borderBottomLeftRadius: roundL ? 7 : 0,
                        borderTopRightRadius: roundR ? 7 : 0,
                        borderBottomRightRadius: roundR ? 7 : 0,
                        opacity: lane === 0 ? 1 : 0.92,
                        boxShadow: '0 2px 8px rgba(0,0,0,.3)',
                        cursor: 'pointer',
                        pointerEvents: 'auto',
                      }}
                    >
                      {roundL && <PriorityDot priority={ev.priority} size={11} style={{ marginLeft: 9, flex: '0 0 11px' }} />}
                      {roundL && (
                        <span
                          style={{
                            fontSize: 14,
                            fontWeight: 700,
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            padding: '0 4px 0 8px',
                            flex: '0 1 auto',
                            textShadow: fg === '#fff' ? '0 1px 2px rgba(0,0,0,.25)' : 'none',
                          }}
                        >
                          {ev.name}
                        </span>
                      )}
                      {roundL && nCount > 0 && (
                        <span
                          style={{
                            background: '#ED1C24',
                            color: '#fff',
                            fontSize: 11,
                            fontWeight: 800,
                            minWidth: 18,
                            height: 18,
                            borderRadius: 6,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 2px',
                            padding: '0 4px',
                            flex: '0 0 auto',
                          }}
                          title={`${nCount} notification(s)`}
                        >
                          {nCount}
                        </span>
                      )}
                      {avatars.length > 0 && (
                        <div style={{ display: 'flex', alignItems: 'center', marginLeft: 'auto', paddingLeft: 5, paddingRight: 5, flex: '0 0 auto' }}>
                          {avatars.map(sid => {
                            const ok = confirmedIds.includes(sid);
                            return (
                              <span
                                key={sid}
                                style={{ marginLeft: 3, opacity: ok ? 1 : 0.45 }}
                                onClick={e => { e.stopPropagation(); openDmWith(sid); }}
                              >
                                <Avatar staffId={sid} size={25} confirmed={ok} />
                              </span>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}

                {/* +N more overflow chips */}
                {Object.entries(overflowByCol).map(([col, evs]) => {
                  const cc = Number(col);
                  return (
                    <div
                      key={'more' + wi + col}
                      onClick={() => selectEvent(evs[0].id)}
                      title={`${evs.length} more event(s)`}
                      style={{
                        position: 'absolute',
                        left: `calc(${((cc / 7) * 100).toFixed(3)}% + 4px)`,
                        width: `calc(${((1 / 7) * 100).toFixed(3)}% - 8px)`,
                        top: BAND_TOP + usedLanes * (LANE_H + GAP),
                        height: OVH,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: 'var(--accent-deep)',
                        color: '#fff',
                        borderRadius: 6,
                        fontSize: 11,
                        fontWeight: 800,
                        boxShadow: '0 2px 10px rgba(241,90,34,.5)',
                        cursor: 'pointer',
                        pointerEvents: 'auto',
                      }}
                    >
                      +{evs.length} more
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
