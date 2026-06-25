import type React from 'react';
import type { StaffMember } from '../types';

/** Default @handle derived from a person's name when they have no custom username. */
export function defaultHandle(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]/g, '');
}

/** Map every known @handle (lowercased) to its staff id. */
export function buildHandleMap(staff: StaffMember[], usernames: Record<string, string>): Record<string, string> {
  const map: Record<string, string> = {};
  for (const m of staff) {
    const h = (usernames[m.id] || defaultHandle(m.name)).toLowerCase();
    if (h) map[h] = m.id;
  }
  return map;
}

/** Resolve the distinct staff ids tagged via @handle inside a block of text. */
export function resolveMentionIds(text: string, staff: StaffMember[], usernames: Record<string, string>): string[] {
  const map = buildHandleMap(staff, usernames);
  const ids = new Set<string>();
  const re = /@([a-z0-9._]+)/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text))) {
    const id = map[m[1].toLowerCase()];
    if (id) ids.add(id);
  }
  return [...ids];
}

/**
 * Render message text, highlighting any valid @handle in the accent colour.
 * Handles that don't match a real person are left as plain text.
 */
export function renderMentionText(
  text: string,
  handleMap: Record<string, string>,
  ownBubble = false,
): React.ReactNode {
  const parts = text.split(/(@[a-z0-9._]+)/gi);
  return parts.map((part, i) => {
    const m = /^@([a-z0-9._]+)$/i.exec(part);
    if (m && handleMap[m[1].toLowerCase()]) {
      return (
        <span
          key={i}
          style={{ color: ownBubble ? '#ffe2cf' : 'var(--accent)', fontWeight: 700 }}
        >
          {part}
        </span>
      );
    }
    return part;
  });
}
