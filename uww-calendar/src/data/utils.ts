import type React from 'react';
import type { Priority, UWWEvent, SortKey, EventDetail } from '../types';

const PRIORITY_COLORS: Record<Priority, string> = {
  top: '#CFA63A',
  mid: '#B4BBC7',
  low: '#C0793C',
};

const PRIORITY_LABELS: Record<Priority, string> = {
  top: 'Top',
  mid: 'Mid',
  low: 'Low',
};

const PRIORITY_RANK: Record<Priority, number> = { top: 0, mid: 1, low: 2 };

export function priorityColor(p: Priority): string {
  return PRIORITY_COLORS[p] || PRIORITY_COLORS.mid;
}

export function priorityLabel(p: Priority): string {
  return PRIORITY_LABELS[p] || 'Mid';
}

export function priorityRank(p: Priority): number {
  return PRIORITY_RANK[p] ?? 1;
}

export function priorityDotStyle(p: Priority): React.CSSProperties {
  const color = priorityColor(p);
  const base: React.CSSProperties = {
    width: 10,
    height: 10,
    borderRadius: '50%',
    background: color,
    display: 'inline-block',
    flex: '0 0 auto',
  };
  if (p === 'top') {
    base.animation = 'goldGlow 2.4s ease-in-out infinite, goldRipple 2.4s ease-out infinite';
  }
  return base;
}

export function initials(name: string): string {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
}

export function avatarStyle(confirmed: boolean, size = 28): React.CSSProperties {
  return {
    width: size,
    height: size,
    borderRadius: '50%',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'var(--control)',
    color: 'var(--text)',
    fontSize: Math.max(9, Math.round(size * 0.38)),
    fontWeight: 800,
    fontStretch: '75%',
    letterSpacing: '.02em',
    border: confirmed ? '1.5px solid #F15A22' : '1.5px solid var(--border-strong)',
    flex: '0 0 auto',
    overflow: 'hidden',
    userSelect: 'none',
  };
}

export function photoAvatarStyle(photo: string, confirmed: boolean, size = 28): React.CSSProperties {
  return {
    width: size,
    height: size,
    borderRadius: '50%',
    backgroundImage: `url(${photo})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    border: confirmed ? '1.5px solid #F15A22' : '1.5px solid var(--border-strong)',
    flex: '0 0 auto',
  };
}

const MONTHS_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export function parseDateISO(iso: string): Date {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, (m || 1) - 1, d || 1);
}

export function formatDate(iso: string): string {
  if (!iso) return '';
  const [, m, d] = iso.split('-');
  return `${d}/${m}`;
}

export function formatDateFull(iso: string): string {
  if (!iso) return '';
  const dt = parseDateISO(iso);
  return `${MONTHS_SHORT[dt.getMonth()]} ${dt.getDate()}`;
}

export function toISO(dt: Date): string {
  const y = dt.getFullYear();
  const m = String(dt.getMonth() + 1).padStart(2, '0');
  const d = String(dt.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function eventDayList(start: string, end: string): string[] {
  if (!start) return [];
  const out: string[] = [];
  const s = parseDateISO(start);
  const e = end ? parseDateISO(end) : s;
  const cur = new Date(s);
  let guard = 0;
  while (cur <= e && guard < 400) {
    out.push(toISO(cur));
    cur.setDate(cur.getDate() + 1);
    guard++;
  }
  return out;
}

export function isoToday(): string {
  return toISO(new Date());
}

export function buildCalendarWeeks(year: number, month: number): Array<{ dates: Array<Date | null> }> {
  const first = new Date(year, month, 1);
  const startDow = first.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: Array<Date | null> = [];
  for (let i = 0; i < startDow; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d));
  while (cells.length % 7 !== 0) cells.push(null);
  const weeks: Array<{ dates: Array<Date | null> }> = [];
  for (let i = 0; i < cells.length; i += 7) {
    weeks.push({ dates: cells.slice(i, i + 7) });
  }
  return weeks;
}

export function completionFor(eventId: string, detail: Record<string, EventDetail>, events: UWWEvent[]): number {
  const d = detail[eventId];
  const ev = events.find(e => e.id === eventId);
  if (!d || !ev) return 0;
  let score = 0;

  // members confirmed (25%)
  const members = d.members;
  if (members.length > 0 && members.every(m => m.status === 'confirmed')) score += 25;
  else if (members.length > 0) score += 25 * (members.filter(m => m.status === 'confirmed').length / members.length);

  // info items filled (25%)
  const infos = d.infoItems;
  if (infos.length > 0) {
    const filled = infos.filter(it => (it.kind === 'doc' ? !!it.content : !!it.url)).length;
    score += 25 * (filled / infos.length);
  }

  // posting schedule non-empty (25%)
  const postRows = Object.values(d.posting).reduce((a, arr) => a + arr.length, 0);
  if (postRows > 0) score += 25;

  // all availability set (25%)
  const confirmedMembers = members.filter(m => m.status === 'confirmed');
  if (confirmedMembers.length > 0) {
    const setCount = confirmedMembers.filter(m => d.availability[m.id]).length;
    score += 25 * (setCount / confirmedMembers.length);
  }

  return Math.round(score);
}

const TYPE_BAR_COLORS: Record<string, string> = {
  wrestling: '#F58220',
  continental: '#0089CF',
  rankingseries: '#9B5DE5',
  documentary: '#22C55E',
  devcamp: '#E0A100',
};

export function eventBarColor(ev: UWWEvent): string {
  if (ev.barColor) return ev.barColor;
  return TYPE_BAR_COLORS[ev.eventType] || '#F58220';
}

export function eventTypeLabel(t: string): string {
  switch (t) {
    case 'wrestling': return 'Wrestling';
    case 'continental': return 'Continental';
    case 'rankingseries': return 'Ranking Series';
    case 'documentary': return 'Documentary';
    case 'devcamp': return 'Dev Camp';
    default: return t;
  }
}

export function sortEvents(events: UWWEvent[], key: SortKey, dir: 'asc' | 'desc', detail: Record<string, EventDetail>): UWWEvent[] {
  const sorted = [...events];
  sorted.sort((a, b) => {
    let cmp = 0;
    switch (key) {
      case 'date':
        cmp = a.start.localeCompare(b.start);
        break;
      case 'type':
        cmp = a.eventType.localeCompare(b.eventType);
        break;
      case 'priority':
        cmp = priorityRank(a.priority) - priorityRank(b.priority);
        break;
      case 'completion':
        cmp = completionFor(a.id, detail, events) - completionFor(b.id, detail, events);
        break;
    }
    return dir === 'asc' ? cmp : -cmp;
  });
  return sorted;
}

export function eventsOverlap(a: UWWEvent, b: UWWEvent): boolean {
  return a.start <= b.end && b.start <= a.end;
}

let _idCounter = 0;
export function genId(prefix: string): string {
  _idCounter += 1;
  return `${prefix}${Date.now().toString(36)}${_idCounter}`;
}
