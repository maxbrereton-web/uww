import { create } from 'zustand';
import { useMemo } from 'react';
import type {
  Role, Page, CalView, NotifTab, ContextMenuData, ConfirmRequest, SortKey, UWWEvent, StaffMember,
  EventDetail, Notification, Message, Group, Templates, NewEventForm, Priority,
  InfoItem, Availability, EventTemplate, DocTemplate, MemberStatus,
} from '../types';
import {
  SEED_EVENTS, SEED_ARCHIVED, SEED_STAFF, SEED_NOTIFICATIONS, SEED_TEMPLATES,
  SEED_USERNAMES, SEED_INSTAGRAM, SEED_GROUPS, IMPORT_EVENTS, initDetail,
} from '../data/seed';
import { resolveMentionIds } from '../data/mentions';
import { supabase } from '../lib/supabase';

const LS_KEY = 'uww_cal_v3';

const ROLE_USER: Record<Role, string> = { admin: 'jh', staff: 'sr', freelance: 'aa' };

const SUPER_ADMIN = { name: 'admin', password: 'UWW' };
const SUPER_ADMIN_EMAIL = 'admin@uww.app';

// ---- Chat sync (Supabase) ----
interface MsgRow { id: string; channel: string; sender: string; body: string; attachment: { name: string; url: string } | null; }
const dmKey = (a: string, b: string) => [a, b].sort().join('|');
function newMsgId(): string {
  try { return crypto.randomUUID(); } catch { return 'm' + Date.now() + Math.random().toString(36).slice(2); }
}
function rowToMessage(row: MsgRow): Message {
  return { id: row.id, from: row.sender, text: row.body || '', time: 'now', att: row.attachment || undefined };
}

/** Role a real (non-super-admin) user lands in, based on their staff record. */
function roleForMember(m: StaffMember): Role {
  if (m.admin) return 'admin';
  return m.type === 'Freelance' ? 'freelance' : 'staff';
}

/** Match a login identifier (email or @tag/username) to a staff member. */
function findByLogin(staff: StaffMember[], usernames: Record<string, string>, identifier: string): StaffMember | undefined {
  const id = identifier.trim().toLowerCase().replace(/^@/, '');
  return staff.find(m => {
    if (m.email.trim().toLowerCase() === id) return true;
    const handle = (usernames[m.id] || m.name.toLowerCase().replace(/[^a-z0-9]/g, '')).toLowerCase();
    return handle === id;
  });
}

let mentionSeq = 0;
/** Build a notification for each person tagged via @handle in `text` (excluding the sender). */
function makeMentionNotifs(
  text: string,
  fromId: string,
  staff: StaffMember[],
  usernames: Record<string, string>,
  opts: { eventId?: string; targetTab?: NotifTab; context?: string },
): Notification[] {
  const ids = resolveMentionIds(text, staff, usernames).filter(id => id !== fromId);
  if (ids.length === 0) return [];
  const fromName = staff.find(m => m.id === fromId)?.name || fromId;
  const ctx = opts.context ? ` in ${opts.context}` : '';
  return ids.map(id => ({
    id: `mn${Date.now()}_${mentionSeq++}`,
    eventId: opts.eventId || '',
    title: `${fromName} mentioned you${ctx}`,
    kind: 'mention' as const,
    pri: 'mid' as Priority,
    deadlineLabel: '',
    targetTab: opts.targetTab || 'notifications',
    forRole: 'both' as const,
    mentionFor: id,
  }));
}

interface PersistShape {
  theme: 'dark' | 'light';
  role: Role;
  events: UWWEvent[];
  archivedEvents: UWWEvent[];
  staff: StaffMember[];
  detail: Record<string, EventDetail>;
  notifications: Notification[];
  dms: Record<string, Message[]>;
  groups: Group[];
  templates: Templates;
  usernames: Record<string, string>;
  instagram: Record<string, string>;
}

function loadPersisted(): Partial<PersistShape> {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as Partial<PersistShape>;
  } catch {
    return {};
  }
}

let saveTimer: ReturnType<typeof setTimeout> | null = null;
function scheduleSave(get: () => StoreState) {
  if (saveTimer) clearTimeout(saveTimer);
  saveTimer = setTimeout(() => {
    const s = get();
    const data: PersistShape = {
      theme: s.theme,
      role: s.role,
      events: s.events,
      archivedEvents: s.archivedEvents,
      staff: s.staff,
      detail: s.detail,
      notifications: s.notifications,
      dms: s.dms,
      groups: s.groups,
      templates: s.templates,
      usernames: s.usernames,
      instagram: s.instagram,
    };
    try {
      localStorage.setItem(LS_KEY, JSON.stringify(data));
    } catch {
      /* ignore */
    }
  }, 1500);
}

export interface StoreState {
  // Auth
  authedUserId: string | null;   // staff id of the logged-in user; null = show login
  isSuperAdmin: boolean;         // true only for the 'admin' test account (gets dev toggles)
  authChecked: boolean;          // false until we've checked for a live Supabase session

  // UI state
  theme: 'dark' | 'light';
  viewMode: 'web' | 'mobile';
  isNarrow: boolean;
  role: Role;
  page: Page;
  calView: CalView;
  year: number;
  month: number;
  selectedEventId: string | null;
  eventTab: NotifTab;
  showNotifications: boolean;
  showNewEvent: boolean;
  showImport: boolean;
  showFilter: boolean;
  filterAnchor: { x: number; y: number } | null;
  showProfile: boolean;
  showTutorial: boolean;
  contextMenu: ContextMenuData | null;
  confirm: ConfirmRequest | null;
  sortKey: SortKey;
  sortDir: 'asc' | 'desc';
  sortMenuOpen: boolean;
  search: string;
  filterType: string;
  filterPriority: string;
  tutorialStep: number;
  newEventDate?: string;

  // Data
  events: UWWEvent[];
  archivedEvents: UWWEvent[];
  staff: StaffMember[];
  detail: Record<string, EventDetail>;
  notifications: Notification[];
  dms: Record<string, Message[]>;
  groups: Group[];
  templates: Templates;
  usernames: Record<string, string>;
  instagram: Record<string, string>;
  chatActive: string | null;
  dmOverlay: string | null;
  newEventForm: NewEventForm;
  importPriorities: Record<string, Priority>;
  importDeleted: string[];

  // Per-detail UI
  addMemberMenuOpen: boolean;
  addEventAdminOpen: boolean;
  showReminderPanel: boolean;
  docEditorOpen: boolean;
  docEditorItem: InfoItem | null;
  linkSetupOpen: boolean;
  linkSetupItem: InfoItem | null;
  postingDayIdx: number;
  newGroupModal: boolean;
  newGroupName: string;
  newGroupMembers: string[];
  editGroupModal: boolean;
  editGroupId: string | null;

  // Actions
  login: (identifier: string, password: string) => Promise<{ ok: boolean; error?: string; needsSetup?: string }>;
  restoreSession: () => Promise<void>;
  setAuthPassword: (password: string) => Promise<{ ok: boolean; error?: string }>;
  initChat: () => Promise<void>;
  initData: () => Promise<void>;
  completeInvite: (userId: string, data: { name: string; username: string; password: string; photo?: string }) => void;
  logout: () => void;
  toggleTheme: () => void;
  setViewMode: (m: 'web' | 'mobile') => void;
  setIsNarrow: (b: boolean) => void;
  setRole: (r: Role) => void;
  setPage: (p: Page) => void;
  setCalView: (v: CalView) => void;
  prevMonth: () => void;
  nextMonth: () => void;
  selectEvent: (eventId: string | null, tab?: NotifTab) => void;
  setEventTab: (tab: NotifTab) => void;
  toggleNotifications: () => void;
  openNewEvent: (date?: string) => void;
  closeNewEvent: () => void;
  submitNewEvent: () => void;
  openImport: () => void;
  closeImport: () => void;
  confirmImport: () => void;
  openFilter: (anchor?: { x: number; y: number }) => void;
  closeFilter: () => void;
  openProfile: () => void;
  closeProfile: () => void;
  openTutorial: () => void;
  closeTutorial: () => void;
  nextTutorialStep: () => void;
  setContextMenu: (data: ContextMenuData | null) => void;
  closeContextMenu: () => void;
  requestConfirm: (req: ConfirmRequest) => void;
  closeConfirm: () => void;
  setSort: (key: SortKey) => void;
  toggleSortMenu: () => void;
  closeSortMenu: () => void;
  setSearch: (v: string) => void;
  setFilterType: (t: string) => void;
  setFilterPriority: (p: string) => void;
  actionNotif: (id: string) => void;
  clearNotif: (id: string) => void;
  clearAllNotifs: () => void;
  updateDetail: (eventId: string, partial: Partial<EventDetail>) => void;
  addMember: (eventId: string, staffId: string) => void;
  removeMember: (eventId: string, staffId: string) => void;
  acceptInvite: (eventId: string) => void;
  declineInvite: (eventId: string) => void;
  requestJoin: (eventId: string) => void;
  approveJoinRequest: (eventId: string, staffId: string) => void;
  declineJoinRequest: (eventId: string, staffId: string) => void;
  addRole: (eventId: string, staffId: string, role: string) => void;
  removeRole: (eventId: string, staffId: string, role: string) => void;
  addEventAdmin: (eventId: string, staffId: string) => void;
  removeEventAdmin: (eventId: string, staffId: string) => void;
  updateAvailability: (eventId: string, staffId: string, partial: Partial<Availability>) => void;
  toggleAvailDay: (eventId: string, staffId: string, isoDate: string) => void;
  confirmAvailDays: (eventId: string, staffId: string) => void;
  updateInfoItem: (eventId: string, itemId: string, partial: Partial<InfoItem>) => void;
  addInfoItem: (eventId: string, item: InfoItem) => void;
  removeInfoItem: (eventId: string, itemId: string) => void;
  saveDoc: (eventId: string, itemId: string, content: string) => void;
  saveLink: (eventId: string, itemId: string, url: string) => void;
  addScheduleItem: (eventId: string, day: string) => void;
  updateScheduleItem: (eventId: string, day: string, idx: number, partial: { time?: string; label?: string }) => void;
  removeScheduleItem: (eventId: string, day: string, idx: number) => void;
  addPostingRow: (eventId: string, day: string) => void;
  updatePostingRow: (eventId: string, day: string, idx: number, partial: Partial<import('../types').PostingItem>) => void;
  removePostingRow: (eventId: string, day: string, idx: number) => void;
  updateStaff: (staffId: string, partial: Partial<StaffMember>) => void;
  addStaff: (member: StaffMember) => void;
  removeStaff: (staffId: string) => void;
  sendDm: (toId: string, text: string, att?: { name: string; url: string }) => void;
  openDmWith: (userId: string) => void;
  closeDmOverlay: () => void;
  setChatActive: (id: string | null) => void;
  sendGroup: (groupId: string, text: string, att?: { name: string; url: string }) => void;
  createGroup: (name: string, members: string[], photo?: string) => void;
  editGroup: (groupId: string, name: string, members: string[], photo?: string) => void;
  deleteGroup: (groupId: string) => void;
  addEvent: (event: UWWEvent) => void;
  updateEvent: (id: string, partial: Partial<UWWEvent>) => void;
  removeEvent: (id: string) => void;
  archiveEvent: (id: string) => void;
  restoreEvent: (id: string) => void;
  addTemplate: (type: 'events' | 'docs', tpl: EventTemplate | DocTemplate) => void;
  updateTemplate: (type: 'events' | 'docs', id: string, partial: Partial<EventTemplate & DocTemplate>) => void;
  deleteTemplate: (type: 'events' | 'docs', id: string) => void;
  duplicateTemplate: (type: 'events' | 'docs', id: string) => void;
  setUsername: (userId: string, username: string) => void;
  setInstagram: (userId: string, handle: string) => void;
  updateNewEventForm: (partial: Partial<NewEventForm>) => void;
  setImportPriority: (id: string, priority: Priority) => void;
  deleteImportEvent: (id: string) => void;
  openDocEditor: (item: InfoItem) => void;
  closeDocEditor: () => void;
  openLinkSetup: (item: InfoItem) => void;
  closeLinkSetup: () => void;
  setPostingDayIdx: (idx: number) => void;
  setNewGroupModal: (open: boolean) => void;
  setEditGroupModal: (id: string | null) => void;
  setNewGroupName: (name: string) => void;
  setNewGroupMembers: (members: string[]) => void;
  setAddMemberMenuOpen: (open: boolean) => void;
  setAddEventAdminOpen: (open: boolean) => void;
  setShowReminderPanel: (open: boolean) => void;
  addCommentReply: (eventId: string, threadId: string, text: string) => void;
  resolveComment: (eventId: string, threadId: string) => void;
  reopenComment: (eventId: string, threadId: string) => void;
  setCommentDraft: (eventId: string, threadId: string, text: string) => void;
  setNewRequest: (eventId: string, text: string) => void;
  addNewRequest: (eventId: string, text: string) => void;
  updateEventFlightDeadline: (eventId: string, date: string) => void;
  toggleReminder: (eventId: string, idx: number) => void;
}

const persisted = loadPersisted();

const defaultNewEventForm = (): NewEventForm => ({
  name: '',
  priority: 'mid',
  eventType: '',
  competitionType: '',
  ageRange: '',
  location: '',
  start: '',
  end: '',
  barColor: '',
});

export const useStore = create<StoreState>((set, get) => {
  let chatInited = false;
  let dataInited = false;
  const commit = (fn: (s: StoreState) => Partial<StoreState>) => {
    set(fn as never);
    scheduleSave(get);
  };

  const ensureDetail = (eventId: string) => {
    const s = get();
    if (!s.detail[eventId]) {
      const allEvents = [...s.events, ...s.archivedEvents];
      const d = initDetail(eventId, allEvents);
      set({ detail: { ...s.detail, [eventId]: d } } as never);
    }
  };

  const patchDetail = (eventId: string, fn: (d: EventDetail) => EventDetail, skipSync = false) => {
    ensureDetail(eventId);
    const s = get();
    const cur = s.detail[eventId];
    const next = fn(cur);
    commit(() => ({ detail: { ...s.detail, [eventId]: next } }));
    if (!skipSync) pushDetail(eventId, next);
  };

  // Map an authenticated Supabase user onto the app's identity (super-admin,
  // an existing staff member matched by email, or a fresh stub for a new user).
  const applyAuthedUser = async (uid: string, email: string) => {
    const emailL = email.trim().toLowerCase();
    // `nav` only resets the page/selection when the signed-in identity actually changes,
    // so a token refresh or page reload re-affirms the role WITHOUT yanking navigation.
    if (emailL === SUPER_ADMIN_EMAIL) {
      const nav = get().authedUserId !== '__super__' ? { page: 'calendar' as Page, selectedEventId: null } : {};
      commit(() => ({ authedUserId: '__super__', isSuperAdmin: true, role: 'admin', ...nav }));
      return;
    }
    let member = get().staff.find(m => m.email.trim().toLowerCase() === emailL);
    if (!member) {
      // Not in this device's directory yet (e.g. an invited user on a fresh device) → look it up.
      try {
        const { data } = await supabase.from('staff_members').select('*');
        const row = (data as StaffRow[] | null)?.find(r => (r.data?.email || '').trim().toLowerCase() === emailL);
        if (row) { applyStaffRow('UPDATE', row); member = { ...row.data }; }
      } catch { /* ignore */ }
    }
    if (member) {
      const m = member;
      const nav = (get().authedUserId !== m.id || get().isSuperAdmin) ? { page: 'calendar' as Page, selectedEventId: null } : {};
      commit(() => ({ authedUserId: m.id, isSuperAdmin: false, role: roleForMember(m), ...nav }));
      return;
    }
    const nav = (get().authedUserId !== uid || get().isSuperAdmin) ? { page: 'calendar' as Page, selectedEventId: null } : {};
    const stub: StaffMember = { id: uid, name: email.split('@')[0] || 'New User', admin: false, location: '', email, type: 'Staff', skillsets: [], country: '', password: 'set' };
    commit(st => ({
      staff: st.staff.some(m => m.id === uid) ? st.staff : [...st.staff, stub],
      authedUserId: uid, isSuperAdmin: false, role: 'staff', ...nav,
    }));
    syncStaff(uid);
  };

  // Merge a chat row arriving from Supabase (history or realtime) into local state,
  // de-duped by message id so our own optimistic copy isn't doubled.
  const mergeRemoteMessage = (row: MsgRow) => {
    const msg = rowToMessage(row);
    const ch = row.channel;
    if (ch.startsWith('dm:')) {
      const key = ch.slice(3);
      commit(st => {
        const arr = st.dms[key] || [];
        if (arr.some(m => m.id === row.id)) return {};
        return { dms: { ...st.dms, [key]: [...arr, msg] } };
      });
    } else if (ch.startsWith('grp:')) {
      const gid = ch.slice(4);
      commit(st => ({
        groups: st.groups.map(g =>
          g.id === gid && !g.messages.some(m => m.id === row.id) ? { ...g, messages: [...g.messages, msg] } : g),
      }));
    }
  };

  // ---- Events sync (Supabase) ----
  const upsertById = (arr: UWWEvent[], ev: UWWEvent): UWWEvent[] =>
    arr.some(e => e.id === ev.id) ? arr.map(e => (e.id === ev.id ? ev : e)) : [...arr, ev];

  // Push one event (current state) up to Supabase.
  const syncEvent = (id: string) => {
    const s = get();
    const archived = s.archivedEvents.some(e => e.id === id);
    const ev = s.events.find(e => e.id === id) || s.archivedEvents.find(e => e.id === id);
    if (!ev) return;
    supabase.from('events').upsert({ id, data: ev, archived, updated_at: new Date().toISOString() }).then(undefined, () => {});
  };
  const syncEventDeleted = (id: string) => {
    supabase.from('events').delete().eq('id', id).then(undefined, () => {});
  };

  // Apply an event change arriving from Supabase (history or realtime) to local state.
  const applyEventRow = (eventType: string, row: { id: string; data: UWWEvent; archived: boolean }) => {
    if (eventType === 'DELETE') {
      commit(s => ({
        events: s.events.filter(e => e.id !== row.id),
        archivedEvents: s.archivedEvents.filter(e => e.id !== row.id),
      }));
      return;
    }
    const ev = row.data;
    commit(s => ({
      events: row.archived ? s.events.filter(e => e.id !== ev.id) : upsertById(s.events, ev),
      archivedEvents: row.archived ? upsertById(s.archivedEvents, ev) : s.archivedEvents.filter(e => e.id !== ev.id),
    }));
  };

  // ---- Event detail sync (info, links, schedule, team, posting, availability, comments) ----
  // Draft fields (what you're mid-typing) are stripped before sharing so half-typed
  // text never appears on other people's screens.
  const stripDrafts = (d: EventDetail): EventDetail => ({
    ...d, newRequest: '', requests: d.requests.map(r => ({ ...r, draft: '' })),
  });
  const pushDetail = (eventId: string, detail: EventDetail) => {
    supabase.from('event_details').upsert({ event_id: eventId, data: stripDrafts(detail), updated_at: new Date().toISOString() }).then(undefined, () => {});
  };
  // Apply an incoming detail from Supabase, keeping this device's own in-progress drafts.
  const applyDetailRow = (eventId: string, incoming: EventDetail) => {
    commit(s => {
      const localD = s.detail[eventId];
      const merged: EventDetail = {
        ...incoming,
        newRequest: localD?.newRequest ?? '',
        requests: incoming.requests.map(r => {
          const lr = localD?.requests.find(x => x.id === r.id);
          return { ...r, draft: lr?.draft ?? '' };
        }),
      };
      return { detail: { ...s.detail, [eventId]: merged } };
    });
  };

  // ---- Staff directory sync (so people added/edited on one device appear everywhere) ----
  type StaffRow = { id: string; data: StaffMember; username: string | null; instagram: string | null };
  const stripPw = (m: StaffMember): StaffMember => { const c = { ...m }; delete c.password; return c; };
  const syncStaff = (id: string) => {
    const s = get();
    const m = s.staff.find(x => x.id === id);
    if (!m) return;
    supabase.from('staff_members').upsert({
      id, data: stripPw(m), username: s.usernames[id] ?? null, instagram: s.instagram[id] ?? null, updated_at: new Date().toISOString(),
    }).then(undefined, () => {});
  };
  const syncStaffDeleted = (id: string) => {
    supabase.from('staff_members').delete().eq('id', id).then(undefined, () => {});
  };
  const applyStaffRow = (eventType: string, row: StaffRow) => {
    if (eventType === 'DELETE') {
      commit(s => ({ staff: s.staff.filter(m => m.id !== row.id) }));
      return;
    }
    commit(s => {
      // keep any local-only password (used only by the offline fallback login)
      const member: StaffMember = { ...row.data, password: s.staff.find(m => m.id === row.id)?.password };
      const staff = s.staff.some(m => m.id === row.id) ? s.staff.map(m => m.id === row.id ? member : m) : [...s.staff, member];
      return {
        staff,
        usernames: { ...s.usernames, [row.id]: row.username || '' },
        instagram: { ...s.instagram, [row.id]: row.instagram || '' },
      };
    });
  };

  // ---- Notifications sync (so @-mentions reach people on their own device) ----
  const syncNotif = (n: Notification) => {
    supabase.from('notifications').upsert({ id: n.id, data: n, updated_at: new Date().toISOString() }).then(undefined, () => {});
  };
  const syncNotifs = (ns: Notification[]) => ns.forEach(syncNotif);
  const applyNotifRow = (eventType: string, row: { id: string; data: Notification }) => {
    if (eventType === 'DELETE') {
      commit(s => ({ notifications: s.notifications.filter(n => n.id !== row.id) }));
      return;
    }
    commit(s => ({
      notifications: s.notifications.some(n => n.id === row.id)
        ? s.notifications.map(n => n.id === row.id ? row.data : n)
        : [...s.notifications, row.data],
    }));
  };

  // ---- Templates sync (shared event/doc templates) ----
  const syncTemplates = () => {
    supabase.from('templates').upsert({ id: 'main', data: get().templates, updated_at: new Date().toISOString() }).then(undefined, () => {});
  };

  // ---- Group sync (the group itself: name, members, photo — messages sync separately) ----
  const stripGroupMsgs = (g: Group): Group => ({ ...g, messages: [] });
  const syncGroup = (id: string) => {
    const g = get().groups.find(x => x.id === id);
    if (!g) return;
    supabase.from('groups').upsert({ id, data: stripGroupMsgs(g), updated_at: new Date().toISOString() }).then(undefined, () => {});
  };
  const syncGroupDeleted = (id: string) => {
    supabase.from('groups').delete().eq('id', id).then(undefined, () => {});
  };
  const applyGroupRow = (eventType: string, row: { id: string; data: Group }) => {
    if (eventType === 'DELETE') {
      commit(s => ({ groups: s.groups.filter(g => g.id !== row.id), chatActive: s.chatActive === 'g:' + row.id ? null : s.chatActive }));
      return;
    }
    const incoming = row.data;
    const wasNew = !get().groups.some(g => g.id === incoming.id);
    commit(s => {
      const existing = s.groups.find(g => g.id === incoming.id);
      const merged: Group = { ...incoming, messages: existing ? existing.messages : [] };
      return { groups: existing ? s.groups.map(g => g.id === incoming.id ? merged : g) : [...s.groups, merged] };
    });
    // A group that just appeared → pull its message history so it isn't empty.
    if (wasNew) {
      supabase.from('messages').select('*').eq('channel', 'grp:' + incoming.id).then(
        ({ data }) => (data as MsgRow[] | null)?.forEach(mergeRemoteMessage),
        () => {},
      );
    }
  };

  // Local credential check — the safety net if Supabase is unreachable or not set up yet.
  const localLogin = (identifier: string, password: string): { ok: boolean; error?: string; needsSetup?: string } => {
    const s = get();
    if (identifier.trim().toLowerCase() === SUPER_ADMIN.name) {
      if (password !== SUPER_ADMIN.password) return { ok: false, error: 'Incorrect password.' };
      commit(() => ({ authedUserId: '__super__', isSuperAdmin: true, role: 'admin', page: 'calendar', selectedEventId: null }));
      return { ok: true };
    }
    const member = findByLogin(s.staff, s.usernames, identifier);
    if (!member) return { ok: false, error: 'No account found for that email or username.' };
    if (!member.password) return { ok: false, needsSetup: member.id };
    if (member.password !== password) return { ok: false, error: 'Incorrect password.' };
    commit(() => ({ authedUserId: member.id, isSuperAdmin: false, role: roleForMember(member), page: 'calendar', selectedEventId: null }));
    return { ok: true };
  };

  return {
    authedUserId: null,
    isSuperAdmin: false,
    authChecked: false,

    theme: persisted.theme || 'dark',
    viewMode: 'web',
    isNarrow: typeof window !== 'undefined' && window.innerWidth < 760,
    role: persisted.role || 'admin',
    page: 'calendar',
    calView: 'calendar',
    year: new Date().getFullYear(),
    month: new Date().getMonth(),
    selectedEventId: null,
    eventTab: 'info',
    showNotifications: false,
    showNewEvent: false,
    showImport: false,
    showFilter: false,
    filterAnchor: null,
    showProfile: false,
    showTutorial: false,
    contextMenu: null,
    confirm: null,
    sortKey: 'date',
    sortDir: 'asc',
    sortMenuOpen: false,
    search: '',
    filterType: 'all',
    filterPriority: 'all',
    tutorialStep: 0,
    newEventDate: undefined,

    events: persisted.events || SEED_EVENTS,
    archivedEvents: persisted.archivedEvents || SEED_ARCHIVED,
    staff: persisted.staff || SEED_STAFF,
    detail: persisted.detail || {},
    notifications: persisted.notifications || SEED_NOTIFICATIONS,
    dms: persisted.dms || {},
    groups: persisted.groups || SEED_GROUPS,
    templates: persisted.templates || SEED_TEMPLATES,
    usernames: persisted.usernames || SEED_USERNAMES,
    instagram: persisted.instagram || SEED_INSTAGRAM,
    chatActive: null,
    dmOverlay: null,
    newEventForm: defaultNewEventForm(),
    importPriorities: {},
    importDeleted: [],

    addMemberMenuOpen: false,
    addEventAdminOpen: false,
    showReminderPanel: false,
    docEditorOpen: false,
    docEditorItem: null,
    linkSetupOpen: false,
    linkSetupItem: null,
    postingDayIdx: 0,
    newGroupModal: false,
    newGroupName: '',
    newGroupMembers: [],
    editGroupModal: false,
    editGroupId: null,

    login: async (identifier, password) => {
      const trimmed = identifier.trim();
      // Supabase auth is email-based: resolve a username/@tag (or 'admin') to an email.
      let email = trimmed;
      if (!email.includes('@')) {
        if (email.toLowerCase() === SUPER_ADMIN.name) {
          email = SUPER_ADMIN_EMAIL;
        } else {
          try {
            const { data } = await supabase.rpc('email_for_identifier', { identifier: email });
            if (typeof data === 'string' && data) email = data;
          } catch { /* offline — fall through to local */ }
        }
      }
      // Try Supabase first (real, cross-device accounts).
      try {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (!error && data.user) {
          await applyAuthedUser(data.user.id, data.user.email || email);
          return { ok: true };
        }
      } catch { /* network/unconfigured — fall back to local accounts */ }
      // Local fallback so the app is never un-loginnable.
      return localLogin(identifier, password);
    },
    restoreSession: async () => {
      try {
        const { data } = await supabase.auth.getSession();
        const u = data.session?.user;
        if (u) await applyAuthedUser(u.id, u.email || '');
      } catch { /* ignore */ }
      set({ authChecked: true });
      // Catch the session that an invite/email link establishes asynchronously.
      try {
        supabase.auth.onAuthStateChange((_e, session) => {
          if (session?.user) applyAuthedUser(session.user.id, session.user.email || '');
        });
      } catch { /* ignore */ }
    },
    setAuthPassword: async (password) => {
      try {
        const { error } = await supabase.auth.updateUser({ password });
        if (error) return { ok: false, error: error.message };
        return { ok: true };
      } catch {
        return { ok: false, error: 'Could not reach the server.' };
      }
    },
    initChat: async () => {
      if (chatInited) return;
      // Only ever sync with a real Supabase session — an unauthenticated read returns
      // an empty set (RLS), which must NOT be mistaken for "the cloud is empty".
      const { data: sess } = await supabase.auth.getSession();
      if (!sess.session) return;
      chatInited = true;
      // Pull existing history into local state (de-duped by id).
      try {
        const { data } = await supabase.from('messages').select('*').order('created_at', { ascending: true });
        (data as MsgRow[] | null)?.forEach(mergeRemoteMessage);
      } catch { /* offline — local only */ }
      // Subscribe to new messages so they appear live on every device.
      try {
        supabase
          .channel('messages-rt')
          .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, payload => {
            mergeRemoteMessage(payload.new as MsgRow);
          })
          .subscribe();
      } catch { /* ignore */ }
    },
    initData: async () => {
      if (dataInited) return;
      // Critical: only sync/seed with a real Supabase session. Reading as an
      // unauthenticated user returns 0 rows (RLS), and the old code treated that as
      // "cloud empty" and re-seeded stale local data — clobbering everyone's changes.
      const { data: sess } = await supabase.auth.getSession();
      if (!sess.session) return;
      dataInited = true;
      try {
        const { data, error } = await supabase.from('events').select('*');
        if (!error && data) {
          if (data.length === 0) {
            // Cloud is empty (first run) → seed it from whatever we have locally.
            const local = get();
            const rows = [
              ...local.events.map(e => ({ id: e.id, data: e, archived: false })),
              ...local.archivedEvents.map(e => ({ id: e.id, data: e, archived: true })),
            ];
            if (rows.length) await supabase.from('events').upsert(rows).then(undefined, () => {});
          } else {
            // Cloud is the source of truth → load it.
            const rows = data as { id: string; data: UWWEvent; archived: boolean }[];
            commit(() => ({
              events: rows.filter(r => !r.archived).map(r => r.data),
              archivedEvents: rows.filter(r => r.archived).map(r => r.data),
            }));
          }
        }
      } catch { /* offline — local only */ }
      // Load any shared event details (info, links, team, posting, availability, comments).
      try {
        const { data: dets } = await supabase.from('event_details').select('*');
        (dets as { event_id: string; data: EventDetail }[] | null)?.forEach(r => applyDetailRow(r.event_id, r.data));
      } catch { /* ignore */ }
      // Shared staff directory.
      try {
        const { data: rows, error } = await supabase.from('staff_members').select('*');
        if (!error && rows) {
          if (rows.length === 0) {
            const local = get();
            const seed = local.staff.map(m => ({ id: m.id, data: stripPw(m), username: local.usernames[m.id] ?? null, instagram: local.instagram[m.id] ?? null }));
            if (seed.length) await supabase.from('staff_members').upsert(seed).then(undefined, () => {});
          } else {
            // Authoritative load: the cloud directory is the truth, so people removed
            // elsewhere disappear here too (instead of lingering from old local data).
            const cloud = rows as StaffRow[];
            commit(s => {
              const staff: StaffMember[] = cloud.map(r => ({ ...r.data, password: s.staff.find(m => m.id === r.id)?.password }));
              const usernames: Record<string, string> = {};
              const instagram: Record<string, string> = {};
              cloud.forEach(r => { if (r.username) usernames[r.id] = r.username; if (r.instagram) instagram[r.id] = r.instagram; });
              // Keep the signed-in user even if their directory row hasn't synced yet.
              const cu = s.authedUserId;
              if (cu && cu !== '__super__' && !staff.some(m => m.id === cu)) {
                const me = s.staff.find(m => m.id === cu);
                if (me) {
                  staff.push(me);
                  if (s.usernames[cu]) usernames[cu] = s.usernames[cu];
                  if (s.instagram[cu]) instagram[cu] = s.instagram[cu];
                }
              }
              return { staff, usernames, instagram };
            });
          }
        }
      } catch { /* ignore */ }
      // Shared notifications (@-mentions reach people on their own device).
      try {
        const { data: rows, error } = await supabase.from('notifications').select('*');
        if (!error && rows) {
          if (rows.length === 0) {
            const seed = get().notifications.map(n => ({ id: n.id, data: n }));
            if (seed.length) await supabase.from('notifications').upsert(seed).then(undefined, () => {});
          } else {
            (rows as { id: string; data: Notification }[]).forEach(r => applyNotifRow('UPDATE', r));
          }
        }
      } catch { /* ignore */ }
      // Shared templates.
      try {
        const { data: rows, error } = await supabase.from('templates').select('*').eq('id', 'main');
        if (!error && rows) {
          if (rows.length === 0) syncTemplates();
          else commit(() => ({ templates: (rows[0] as { data: Templates }).data }));
        }
      } catch { /* ignore */ }
      // Shared chat groups (their definitions; messages sync via the messages table).
      try {
        const { data: rows, error } = await supabase.from('groups').select('*');
        if (!error && rows) {
          if (rows.length === 0) {
            const seed = get().groups.map(g => ({ id: g.id, data: stripGroupMsgs(g) }));
            if (seed.length) await supabase.from('groups').upsert(seed).then(undefined, () => {});
          } else {
            const cloud = rows as { id: string; data: Group }[];
            commit(s => ({
              groups: cloud.map(r => {
                const existing = s.groups.find(g => g.id === r.id);
                return { ...r.data, messages: existing ? existing.messages : [] };
              }),
            }));
          }
        }
      } catch { /* ignore */ }
      // Live updates to the calendar + event contents for everyone.
      try {
        supabase
          .channel('events-rt')
          .on('postgres_changes', { event: '*', schema: 'public', table: 'events' }, payload => {
            const row = (payload.eventType === 'DELETE' ? payload.old : payload.new) as { id: string; data: UWWEvent; archived: boolean };
            applyEventRow(payload.eventType, row);
          })
          .on('postgres_changes', { event: '*', schema: 'public', table: 'event_details' }, payload => {
            if (payload.eventType === 'DELETE') return;
            const row = payload.new as { event_id: string; data: EventDetail };
            applyDetailRow(row.event_id, row.data);
          })
          .on('postgres_changes', { event: '*', schema: 'public', table: 'staff_members' }, payload => {
            const row = (payload.eventType === 'DELETE' ? payload.old : payload.new) as StaffRow;
            applyStaffRow(payload.eventType, row);
          })
          .on('postgres_changes', { event: '*', schema: 'public', table: 'notifications' }, payload => {
            const row = (payload.eventType === 'DELETE' ? payload.old : payload.new) as { id: string; data: Notification };
            applyNotifRow(payload.eventType, row);
          })
          .on('postgres_changes', { event: '*', schema: 'public', table: 'templates' }, payload => {
            if (payload.eventType === 'DELETE') return;
            commit(() => ({ templates: (payload.new as { data: Templates }).data }));
          })
          .on('postgres_changes', { event: '*', schema: 'public', table: 'groups' }, payload => {
            const row = (payload.eventType === 'DELETE' ? payload.old : payload.new) as { id: string; data: Group };
            applyGroupRow(payload.eventType, row);
          })
          .subscribe();
      } catch { /* ignore */ }
    },
    completeInvite: (userId, data) => {
      const s = get();
      const member = s.staff.find(m => m.id === userId);
      if (!member) return;
      commit(st => ({
        staff: st.staff.map(m => m.id === userId
          ? { ...m, name: data.name.trim() || m.name, password: data.password, photo: data.photo ?? m.photo }
          : m),
        usernames: { ...st.usernames, [userId]: data.username.trim().replace(/^@/, '') },
        authedUserId: userId,
        isSuperAdmin: false,
        role: roleForMember(member),
        page: 'calendar',
        selectedEventId: null,
      }));
      syncStaff(userId);
    },
    logout: () => {
      supabase.auth.signOut().catch(() => {});
      commit(() => ({ authedUserId: null, isSuperAdmin: false, selectedEventId: null, showProfile: false, showNotifications: false }));
    },

    toggleTheme: () => commit(s => ({ theme: s.theme === 'dark' ? 'light' : 'dark' })),
    setViewMode: (m) => set({ viewMode: m }),
    setIsNarrow: (b) => set({ isNarrow: b }),
    setRole: (r) => set({ role: r, selectedEventId: null, page: 'calendar', showNotifications: false }),
    setPage: (p) => set({
      page: p,
      selectedEventId: null,
      showNotifications: false,
      // Opening the calendar always lands on the current month.
      ...(p === 'calendar' ? { year: new Date().getFullYear(), month: new Date().getMonth() } : {}),
    }),
    setCalView: (v) => set({ calView: v }),
    prevMonth: () => set(s => s.month === 0 ? { month: 11, year: s.year - 1 } : { month: s.month - 1 }),
    nextMonth: () => set(s => s.month === 11 ? { month: 0, year: s.year + 1 } : { month: s.month + 1 }),

    selectEvent: (eventId, tab) => {
      if (eventId) ensureDetail(eventId);
      set({ selectedEventId: eventId, eventTab: tab || 'info', showNotifications: false });
    },
    setEventTab: (tab) => set({ eventTab: tab }),
    toggleNotifications: () => set(s => ({ showNotifications: !s.showNotifications })),

    openNewEvent: (date) => set({
      showNewEvent: true,
      newEventDate: date,
      newEventForm: { ...defaultNewEventForm(), start: date || '', end: date || '' },
    }),
    closeNewEvent: () => set({ showNewEvent: false }),
    submitNewEvent: () => {
      const s = get();
      const f = s.newEventForm;
      const id = 'ev' + Date.now();
      const ev: UWWEvent = {
        id, name: f.name || 'Untitled Event', priority: f.priority, eventType: f.eventType || 'wrestling',
        competitionType: f.competitionType, ageRange: f.ageRange, location: f.location,
        start: f.start, end: f.end || f.start, staff: [], barColor: f.barColor || undefined, archived: false,
      };
      commit(st => ({ events: [...st.events, ev], showNewEvent: false, newEventForm: defaultNewEventForm() }));
      syncEvent(id);
    },

    openImport: () => set({ showImport: true, importDeleted: [], importPriorities: {} }),
    closeImport: () => set({ showImport: false }),
    confirmImport: () => {
      const s = get();
      const existing = new Set([...s.events, ...s.archivedEvents].map(e => e.name));
      const toAdd = IMPORT_EVENTS
        .filter(e => !s.importDeleted.includes(e.id) && !existing.has(e.name))
        .map(e => ({ ...e, id: 'ev' + Date.now() + Math.random().toString(36).slice(2, 6), priority: s.importPriorities[e.id] || e.priority }));
      commit(st => ({ events: [...st.events, ...toAdd], showImport: false }));
      toAdd.forEach(e => syncEvent(e.id));
    },

    openFilter: (anchor) => set({ showFilter: true, filterAnchor: anchor || null }),
    closeFilter: () => set({ showFilter: false }),
    openProfile: () => set({ showProfile: true }),
    closeProfile: () => set({ showProfile: false }),
    openTutorial: () => set({ showTutorial: true, tutorialStep: 0, showProfile: false }),
    closeTutorial: () => set({ showTutorial: false, tutorialStep: 0 }),
    nextTutorialStep: () => set(s => ({ tutorialStep: s.tutorialStep + 1 })),

    setContextMenu: (data) => set({ contextMenu: data }),
    closeContextMenu: () => set({ contextMenu: null }),
    requestConfirm: (req) => set({ confirm: req }),
    closeConfirm: () => set({ confirm: null }),
    setSort: (key) => set(s => ({
      sortKey: key,
      sortDir: s.sortKey === key && s.sortDir === 'asc' ? 'desc' : 'asc',
      sortMenuOpen: false,
    })),
    toggleSortMenu: () => set(s => ({ sortMenuOpen: !s.sortMenuOpen })),
    closeSortMenu: () => set({ sortMenuOpen: false }),
    setSearch: (v) => set({ search: v }),
    setFilterType: (t) => set({ filterType: t }),
    setFilterPriority: (p) => set({ filterPriority: p }),

    actionNotif: (id) => {
      commit(s => ({ notifications: s.notifications.map(n => n.id === id ? { ...n, actioned: true } : n) }));
      const n = get().notifications.find(x => x.id === id);
      if (n) syncNotif(n);
    },
    clearNotif: (id) => {
      commit(s => ({ notifications: s.notifications.map(n => n.id === id ? { ...n, cleared: true } : n) }));
      const n = get().notifications.find(x => x.id === id);
      if (n) syncNotif(n);
    },
    clearAllNotifs: () => {
      commit(s => {
        const cu = currentUser(s);
        const isAdminUser = s.role === 'admin';
        return {
          notifications: s.notifications.map(n => {
            const forMe = n.mentionFor
              ? n.mentionFor === cu
              : (n.forRole === 'both' || (isAdminUser ? n.forRole === 'admin' : n.forRole === 'staff'));
            return forMe ? { ...n, cleared: true } : n;
          }),
        };
      });
      syncNotifs(get().notifications.filter(n => n.cleared));
    },

    updateDetail: (eventId, partial) => patchDetail(eventId, d => ({ ...d, ...partial })),

    addMember: (eventId, staffId) => patchDetail(eventId, d => {
      if (d.members.some(m => m.id === staffId)) return d;
      return { ...d, members: [...d.members, { id: staffId, roles: [], status: 'invited' as MemberStatus }] };
    }),
    removeMember: (eventId, staffId) => patchDetail(eventId, d => ({ ...d, members: d.members.filter(m => m.id !== staffId) })),

    acceptInvite: (eventId) => {
      const cu = ROLE_USER[get().role];
      patchDetail(eventId, d => ({ ...d, members: d.members.map(m => m.id === cu ? { ...m, status: 'confirmed' as MemberStatus } : m) }));
    },
    declineInvite: (eventId) => {
      const cu = ROLE_USER[get().role];
      patchDetail(eventId, d => ({ ...d, members: d.members.filter(m => m.id !== cu) }));
    },

    requestJoin: (eventId) => {
      const cu = ROLE_USER[get().role];
      patchDetail(eventId, d => d.joinRequests.includes(cu) ? d : ({ ...d, joinRequests: [...d.joinRequests, cu] }));
    },
    approveJoinRequest: (eventId, staffId) => patchDetail(eventId, d => ({
      ...d,
      joinRequests: d.joinRequests.filter(r => r !== staffId),
      members: d.members.some(m => m.id === staffId) ? d.members : [...d.members, { id: staffId, roles: [], status: 'confirmed' as MemberStatus }],
    })),
    declineJoinRequest: (eventId, staffId) => patchDetail(eventId, d => ({ ...d, joinRequests: d.joinRequests.filter(r => r !== staffId) })),

    addRole: (eventId, staffId, role) => patchDetail(eventId, d => ({
      ...d, members: d.members.map(m => m.id === staffId && !m.roles.includes(role) ? { ...m, roles: [...m.roles, role] } : m),
    })),
    removeRole: (eventId, staffId, role) => patchDetail(eventId, d => ({
      ...d, members: d.members.map(m => m.id === staffId ? { ...m, roles: m.roles.filter(r => r !== role) } : m),
    })),

    addEventAdmin: (eventId, staffId) => {
      commit(s => ({ events: s.events.map(e => e.id === eventId ? { ...e, eventAdmins: [...(e.eventAdmins || []), staffId] } : e) }));
      syncEvent(eventId);
    },
    removeEventAdmin: (eventId, staffId) => {
      commit(s => ({ events: s.events.map(e => e.id === eventId ? { ...e, eventAdmins: (e.eventAdmins || []).filter(a => a !== staffId) } : e) }));
      syncEvent(eventId);
    },

    updateAvailability: (eventId, staffId, partial) => patchDetail(eventId, d => {
      const base: Availability = d.availability[staffId] || { status: 'Available', flights: false };
      return { ...d, availability: { ...d.availability, [staffId]: { ...base, ...partial } } };
    }),
    toggleAvailDay: (eventId, staffId, isoDate) => patchDetail(eventId, d => {
      const cur = d.availability[staffId] || { status: 'Limited', flights: false, days: [] };
      const days = cur.days || [];
      const next = days.includes(isoDate) ? days.filter(x => x !== isoDate) : [...days, isoDate].sort();
      return { ...d, availability: { ...d.availability, [staffId]: { ...cur, days: next, daysConfirmed: false } } };
    }),
    confirmAvailDays: (eventId, staffId) => patchDetail(eventId, d => {
      const cur = d.availability[staffId];
      if (!cur) return d;
      return { ...d, availability: { ...d.availability, [staffId]: { ...cur, daysConfirmed: true } } };
    }),

    updateInfoItem: (eventId, itemId, partial) => patchDetail(eventId, d => ({
      ...d, infoItems: d.infoItems.map(it => it.id === itemId ? { ...it, ...partial } : it),
    })),
    addInfoItem: (eventId, item) => patchDetail(eventId, d => ({ ...d, infoItems: [...d.infoItems, item] })),
    removeInfoItem: (eventId, itemId) => patchDetail(eventId, d => ({ ...d, infoItems: d.infoItems.filter(it => it.id !== itemId) })),
    saveDoc: (eventId, itemId, content) => {
      patchDetail(eventId, d => ({ ...d, infoItems: d.infoItems.map(it => it.id === itemId ? { ...it, content } : it) }));
      set({ docEditorOpen: false, docEditorItem: null });
    },
    saveLink: (eventId, itemId, url) => {
      patchDetail(eventId, d => ({ ...d, infoItems: d.infoItems.map(it => it.id === itemId ? { ...it, url } : it) }));
      set({ linkSetupOpen: false, linkSetupItem: null });
    },

    addScheduleItem: (eventId, day) => patchDetail(eventId, d => ({
      ...d, schedule: { ...d.schedule, [day]: [...(d.schedule[day] || []), { time: '09:00', label: '' }] },
    })),
    updateScheduleItem: (eventId, day, idx, partial) => patchDetail(eventId, d => ({
      ...d, schedule: { ...d.schedule, [day]: (d.schedule[day] || []).map((it, i) => i === idx ? { ...it, ...partial } : it) },
    })),
    removeScheduleItem: (eventId, day, idx) => patchDetail(eventId, d => ({
      ...d, schedule: { ...d.schedule, [day]: (d.schedule[day] || []).filter((_, i) => i !== idx) },
    })),

    addPostingRow: (eventId, day) => patchDetail(eventId, d => ({
      ...d, posting: { ...d.posting, [day]: [...(d.posting[day] || []), { posted: false, type: 'Design', name: '', link: '', athlete: '', caption: '' }] },
    })),
    updatePostingRow: (eventId, day, idx, partial) => patchDetail(eventId, d => ({
      ...d, posting: { ...d.posting, [day]: (d.posting[day] || []).map((it, i) => i === idx ? { ...it, ...partial } : it) },
    })),
    removePostingRow: (eventId, day, idx) => patchDetail(eventId, d => ({
      ...d, posting: { ...d.posting, [day]: (d.posting[day] || []).filter((_, i) => i !== idx) },
    })),

    updateStaff: (staffId, partial) => { commit(s => ({ staff: s.staff.map(m => m.id === staffId ? { ...m, ...partial } : m) })); syncStaff(staffId); },
    addStaff: (member) => { commit(s => ({ staff: [...s.staff, member] })); syncStaff(member.id); },
    removeStaff: (staffId) => { commit(s => ({ staff: s.staff.filter(m => m.id !== staffId) })); syncStaffDeleted(staffId); },

    sendDm: (toId, text, att) => {
      const s0 = get();
      const cu = currentUser(s0);
      const id = newMsgId();
      const msg: Message = { id, from: cu, text, time: 'now', att };
      const key = dmKey(cu, toId);
      const mn = makeMentionNotifs(text, cu, s0.staff, s0.usernames, { context: 'a chat' });
      commit(s => ({
        dms: { ...s.dms, [key]: [...(s.dms[key] || []), msg] },
        notifications: mn.length ? [...s.notifications, ...mn] : s.notifications,
      }));
      if (mn.length) syncNotifs(mn);
      supabase.from('messages').insert({ id, channel: 'dm:' + key, sender: cu, body: text, attachment: att ?? null }).then(undefined, () => {});
    },
    openDmWith: (userId) => set({ dmOverlay: userId }),
    closeDmOverlay: () => set({ dmOverlay: null }),
    setChatActive: (id) => set({ chatActive: id }),

    sendGroup: (groupId, text, att) => {
      const s0 = get();
      const cu = currentUser(s0);
      const id = newMsgId();
      const msg: Message = { id, from: cu, text, time: 'now', att };
      const gName = s0.groups.find(g => g.id === groupId)?.name;
      const mn = makeMentionNotifs(text, cu, s0.staff, s0.usernames, { context: gName });
      commit(s => ({
        groups: s.groups.map(g => g.id === groupId ? { ...g, messages: [...g.messages, msg] } : g),
        notifications: mn.length ? [...s.notifications, ...mn] : s.notifications,
      }));
      if (mn.length) syncNotifs(mn);
      supabase.from('messages').insert({ id, channel: 'grp:' + groupId, sender: cu, body: text, attachment: att ?? null }).then(undefined, () => {});
    },
    createGroup: (name, members, photo) => {
      const id = 'g' + Date.now();
      commit(s => ({ groups: [...s.groups, { id, name, members, messages: [], photo }], newGroupModal: false, newGroupName: '', newGroupMembers: [] }));
      syncGroup(id);
    },
    editGroup: (groupId, name, members, photo) => {
      commit(s => ({
        groups: s.groups.map(g => g.id === groupId ? { ...g, name, members, photo: photo ?? g.photo } : g),
        editGroupModal: false, editGroupId: null,
      }));
      syncGroup(groupId);
    },
    deleteGroup: (groupId) => {
      commit(s => ({
        groups: s.groups.filter(g => g.id !== groupId),
        editGroupModal: false, editGroupId: null,
        chatActive: s.chatActive === 'g:' + groupId ? null : s.chatActive,
      }));
      syncGroupDeleted(groupId);
    },

    addEvent: (event) => { commit(s => ({ events: [...s.events, event] })); syncEvent(event.id); },
    updateEvent: (id, partial) => { commit(s => ({ events: s.events.map(e => e.id === id ? { ...e, ...partial } : e) })); syncEvent(id); },
    removeEvent: (id) => { commit(s => ({ events: s.events.filter(e => e.id !== id), selectedEventId: s.selectedEventId === id ? null : s.selectedEventId })); syncEventDeleted(id); },
    archiveEvent: (id) => {
      commit(s => {
        const ev = s.events.find(e => e.id === id);
        if (!ev) return {};
        return {
          events: s.events.filter(e => e.id !== id),
          archivedEvents: [...s.archivedEvents, { ...ev, archived: true }],
          selectedEventId: s.selectedEventId === id ? null : s.selectedEventId,
          contextMenu: null,
        };
      });
      syncEvent(id);
    },
    restoreEvent: (id) => {
      commit(s => {
        const ev = s.archivedEvents.find(e => e.id === id);
        if (!ev) return {};
        return {
          archivedEvents: s.archivedEvents.filter(e => e.id !== id),
          events: [...s.events, { ...ev, archived: false }],
        };
      });
      syncEvent(id);
    },

    addTemplate: (type, tpl) => {
      commit(s => ({
        templates: type === 'events'
          ? { ...s.templates, events: [...s.templates.events, tpl as EventTemplate] }
          : { ...s.templates, docs: [...s.templates.docs, tpl as DocTemplate] },
      }));
      syncTemplates();
    },
    updateTemplate: (type, id, partial) => {
      commit(s => ({
        templates: type === 'events'
          ? { ...s.templates, events: s.templates.events.map(t => t.id === id ? { ...t, ...partial } : t) }
          : { ...s.templates, docs: s.templates.docs.map(t => t.id === id ? { ...t, ...partial } : t) },
      }));
      syncTemplates();
    },
    deleteTemplate: (type, id) => {
      commit(s => ({
        templates: type === 'events'
          ? { ...s.templates, events: s.templates.events.filter(t => t.id !== id) }
          : { ...s.templates, docs: s.templates.docs.filter(t => t.id !== id) },
      }));
      syncTemplates();
    },
    duplicateTemplate: (type, id) => {
      commit(s => {
        if (type === 'events') {
          const t = s.templates.events.find(x => x.id === id);
          if (!t) return {};
          return { templates: { ...s.templates, events: [...s.templates.events, { ...t, id: 'et' + Date.now(), name: t.name + ' (Copy)' }] } };
        }
        const t = s.templates.docs.find(x => x.id === id);
        if (!t) return {};
        return { templates: { ...s.templates, docs: [...s.templates.docs, { ...t, id: 'dt' + Date.now(), name: t.name + ' (Copy)' }] } };
      });
      syncTemplates();
    },

    setUsername: (userId, username) => { commit(s => ({ usernames: { ...s.usernames, [userId]: username } })); syncStaff(userId); },
    setInstagram: (userId, handle) => { commit(s => ({ instagram: { ...s.instagram, [userId]: handle } })); syncStaff(userId); },

    updateNewEventForm: (partial) => set(s => ({ newEventForm: { ...s.newEventForm, ...partial } })),
    setImportPriority: (id, priority) => set(s => ({ importPriorities: { ...s.importPriorities, [id]: priority } })),
    deleteImportEvent: (id) => set(s => ({ importDeleted: [...s.importDeleted, id] })),

    openDocEditor: (item) => set({ docEditorOpen: true, docEditorItem: item }),
    closeDocEditor: () => set({ docEditorOpen: false, docEditorItem: null }),
    openLinkSetup: (item) => set({ linkSetupOpen: true, linkSetupItem: item }),
    closeLinkSetup: () => set({ linkSetupOpen: false, linkSetupItem: null }),
    setPostingDayIdx: (idx) => set({ postingDayIdx: idx }),
    setNewGroupModal: (open) => set({ newGroupModal: open, newGroupName: '', newGroupMembers: [] }),
    setEditGroupModal: (id) => set({ editGroupModal: id !== null, editGroupId: id }),
    setNewGroupName: (name) => set({ newGroupName: name }),
    setNewGroupMembers: (members) => set({ newGroupMembers: members }),
    setAddMemberMenuOpen: (open) => set({ addMemberMenuOpen: open }),
    setAddEventAdminOpen: (open) => set({ addEventAdminOpen: open }),
    setShowReminderPanel: (open) => set({ showReminderPanel: open }),

    addCommentReply: (eventId, threadId, text) => {
      const s0 = get();
      const cu = currentUser(s0);
      const evName = [...s0.events, ...s0.archivedEvents].find(e => e.id === eventId)?.name;
      const mn = makeMentionNotifs(text, cu, s0.staff, s0.usernames, { eventId, targetTab: 'requests', context: evName });
      ensureDetail(eventId);
      const cur = get().detail[eventId];
      commit(s => ({
        detail: {
          ...s.detail,
          [eventId]: {
            ...cur,
            requests: cur.requests.map(c => c.id === threadId
              ? { ...c, draft: '', messages: [...c.messages, { from: cu, text, time: 'now' }] }
              : c),
          },
        },
        notifications: mn.length ? [...s.notifications, ...mn] : s.notifications,
      }));
      if (mn.length) syncNotifs(mn);
      pushDetail(eventId, get().detail[eventId]);
    },
    resolveComment: (eventId, threadId) => patchDetail(eventId, d => ({
      ...d, requests: d.requests.map(c => c.id === threadId ? { ...c, status: 'resolved' } : c),
    })),
    reopenComment: (eventId, threadId) => patchDetail(eventId, d => ({
      ...d, requests: d.requests.map(c => c.id === threadId ? { ...c, status: 'open' } : c),
    })),
    setCommentDraft: (eventId, threadId, text) => patchDetail(eventId, d => ({
      ...d, requests: d.requests.map(c => c.id === threadId ? { ...c, draft: text } : c),
    }), true),
    setNewRequest: (eventId, text) => patchDetail(eventId, d => ({ ...d, newRequest: text }), true),
    addNewRequest: (eventId, text) => {
      const s0 = get();
      const cu = currentUser(s0);
      const evName = [...s0.events, ...s0.archivedEvents].find(e => e.id === eventId)?.name;
      const mn = makeMentionNotifs(text, cu, s0.staff, s0.usernames, { eventId, targetTab: 'requests', context: evName });
      ensureDetail(eventId);
      const cur = get().detail[eventId];
      commit(s => ({
        detail: {
          ...s.detail,
          [eventId]: {
            ...cur,
            newRequest: '',
            requests: [...cur.requests, { id: 'rq' + Date.now(), from: cu, status: 'open', draft: '', messages: [{ from: cu, text, time: 'now' }] }],
          },
        },
        notifications: mn.length ? [...s.notifications, ...mn] : s.notifications,
      }));
      if (mn.length) syncNotifs(mn);
      pushDetail(eventId, get().detail[eventId]);
    },

    updateEventFlightDeadline: (eventId, date) => {
      commit(s => ({ events: s.events.map(e => e.id === eventId ? { ...e, flightDeadline: date } : e) }));
      syncEvent(eventId);
    },
    toggleReminder: (eventId, idx) => {
      commit(s => ({
        events: s.events.map(e => {
          if (e.id !== eventId) return e;
          const off = e.reminderOff || [];
          return { ...e, reminderOff: off.includes(idx) ? off.filter(i => i !== idx) : [...off, idx] };
        }),
      }));
      syncEvent(eventId);
    },
  };
});

// Selectors
export function currentUser(state: StoreState): string {
  // A real logged-in user is themselves; the super-admin test account follows the
  // role toggle (so it can impersonate admin / staff / freelance while testing).
  if (state.authedUserId && !state.isSuperAdmin) return state.authedUserId;
  return ROLE_USER[state.role];
}

export function isAdmin(state: StoreState): boolean {
  if (state.role === 'admin') return true;
  const ev = state.events.find(e => e.id === state.selectedEventId);
  return !!ev?.eventAdmins?.includes(ROLE_USER[state.role]);
}

/** Effective view: a real narrow screen forces mobile; otherwise the manual toggle. */
export function effectiveView(state: StoreState): 'web' | 'mobile' {
  return state.isNarrow ? 'mobile' : state.viewMode;
}

export function visibleEvents(state: StoreState): UWWEvent[] {
  if (state.role !== 'freelance') return state.events;
  const cu = ROLE_USER[state.role];
  return state.events.filter(e => {
    if (e.staff.includes(cu)) return true;
    const d = state.detail[e.id];
    if (d && (d.members.some(m => m.id === cu) || d.joinRequests.includes(cu))) return true;
    return false;
  });
}

/**
 * Memoized hook form of visibleEvents.
 * Selecting the fresh array directly via useStore(visibleEvents) breaks
 * Zustand v5's plain useSyncExternalStore (new ref each call → infinite loop),
 * so components must use this instead.
 */
export function useVisibleEvents(): UWWEvent[] {
  const events = useStore(s => s.events);
  const role = useStore(s => s.role);
  const detail = useStore(s => s.detail);
  return useMemo(() => {
    if (role !== 'freelance') return events;
    const cu = ROLE_USER[role];
    return events.filter(e => {
      if (e.staff.includes(cu)) return true;
      const d = detail[e.id];
      if (d && (d.members.some(m => m.id === cu) || d.joinRequests.includes(cu))) return true;
      return false;
    });
  }, [events, role, detail]);
}

export function eventNotifCount(eventId: string, state: StoreState): number {
  const cu = ROLE_USER[state.role];
  const isAdminUser = state.role === 'admin';
  return state.notifications.filter(n => {
    if (n.eventId !== eventId) return false;
    if (n.actioned || n.cleared) return false;
    if (n.mentionFor) return n.mentionFor === cu;
    return n.forRole === 'both'
      || (isAdminUser ? n.forRole === 'admin' : n.forRole === 'staff');
  }).length;
}

export function roleNotifs(state: StoreState): Notification[] {
  const cu = ROLE_USER[state.role];
  const isAdminUser = state.role === 'admin';
  return state.notifications.filter(n => {
    if (n.cleared) return false;
    if (n.mentionFor) return n.mentionFor === cu;
    return n.forRole === 'both'
      || (isAdminUser ? n.forRole === 'admin' : n.forRole === 'staff');
  });
}

export { ROLE_USER };
