import { create } from 'zustand';
import { useMemo } from 'react';
import type {
  Role, Page, CalView, NotifTab, ContextMenuData, SortKey, UWWEvent, StaffMember,
  EventDetail, Notification, Message, Group, Templates, NewEventForm, Priority,
  InfoItem, Availability, EventTemplate, DocTemplate, MemberStatus,
} from '../types';
import {
  SEED_EVENTS, SEED_ARCHIVED, SEED_STAFF, SEED_NOTIFICATIONS, SEED_TEMPLATES,
  SEED_USERNAMES, SEED_INSTAGRAM, SEED_GROUPS, IMPORT_EVENTS, initDetail,
} from '../data/seed';

const LS_KEY = 'uww_cal_v2';

const ROLE_USER: Record<Role, string> = { admin: 'jh', staff: 'sr', freelance: 'aa' };

interface PersistShape {
  theme: 'dark' | 'light';
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
  // UI state
  theme: 'dark' | 'light';
  viewMode: 'web' | 'mobile';
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
  showProfile: boolean;
  showTutorial: boolean;
  contextMenu: ContextMenuData | null;
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
  toggleTheme: () => void;
  setViewMode: (m: 'web' | 'mobile') => void;
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
  openFilter: () => void;
  closeFilter: () => void;
  openProfile: () => void;
  closeProfile: () => void;
  openTutorial: () => void;
  closeTutorial: () => void;
  nextTutorialStep: () => void;
  setContextMenu: (data: ContextMenuData | null) => void;
  closeContextMenu: () => void;
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
  eventType: 'wrestling',
  competitionType: 'World Championships',
  ageRange: 'Senior',
  location: '',
  start: '',
  end: '',
  barColor: '',
});

export const useStore = create<StoreState>((set, get) => {
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

  const patchDetail = (eventId: string, fn: (d: EventDetail) => EventDetail) => {
    ensureDetail(eventId);
    const s = get();
    const cur = s.detail[eventId];
    commit(() => ({ detail: { ...s.detail, [eventId]: fn(cur) } }));
  };

  return {
    theme: persisted.theme || 'dark',
    viewMode: 'web',
    role: 'admin',
    page: 'calendar',
    calView: 'calendar',
    year: 2026,
    month: 6,
    selectedEventId: null,
    eventTab: 'info',
    showNotifications: false,
    showNewEvent: false,
    showImport: false,
    showFilter: false,
    showProfile: false,
    showTutorial: false,
    contextMenu: null,
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

    toggleTheme: () => commit(s => ({ theme: s.theme === 'dark' ? 'light' : 'dark' })),
    setViewMode: (m) => set({ viewMode: m }),
    setRole: (r) => set({ role: r, selectedEventId: null, page: 'calendar', showNotifications: false }),
    setPage: (p) => set({ page: p, selectedEventId: null, showNotifications: false }),
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
        id, name: f.name || 'Untitled Event', priority: f.priority, eventType: f.eventType,
        competitionType: f.competitionType, ageRange: f.ageRange, location: f.location,
        start: f.start, end: f.end || f.start, staff: [], barColor: f.barColor || undefined, archived: false,
      };
      commit(st => ({ events: [...st.events, ev], showNewEvent: false, newEventForm: defaultNewEventForm() }));
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
    },

    openFilter: () => set({ showFilter: true }),
    closeFilter: () => set({ showFilter: false }),
    openProfile: () => set({ showProfile: true }),
    closeProfile: () => set({ showProfile: false }),
    openTutorial: () => set({ showTutorial: true, tutorialStep: 0, showProfile: false }),
    closeTutorial: () => set({ showTutorial: false, tutorialStep: 0 }),
    nextTutorialStep: () => set(s => ({ tutorialStep: s.tutorialStep + 1 })),

    setContextMenu: (data) => set({ contextMenu: data }),
    closeContextMenu: () => set({ contextMenu: null }),
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

    actionNotif: (id) => commit(s => ({ notifications: s.notifications.map(n => n.id === id ? { ...n, actioned: true } : n) })),
    clearNotif: (id) => commit(s => ({ notifications: s.notifications.map(n => n.id === id ? { ...n, cleared: true } : n) })),
    clearAllNotifs: () => commit(s => {
      const cu = ROLE_USER[s.role];
      const isAdminUser = s.role === 'admin';
      return {
        notifications: s.notifications.map(n => {
          const forMe = n.forRole === 'both' || (isAdminUser ? n.forRole === 'admin' : n.forRole === 'staff') || n.mentionFor === cu;
          return forMe ? { ...n, cleared: true } : n;
        }),
      };
    }),

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

    addEventAdmin: (eventId, staffId) => commit(s => ({
      events: s.events.map(e => e.id === eventId ? { ...e, eventAdmins: [...(e.eventAdmins || []), staffId] } : e),
    })),
    removeEventAdmin: (eventId, staffId) => commit(s => ({
      events: s.events.map(e => e.id === eventId ? { ...e, eventAdmins: (e.eventAdmins || []).filter(a => a !== staffId) } : e),
    })),

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

    updateStaff: (staffId, partial) => commit(s => ({ staff: s.staff.map(m => m.id === staffId ? { ...m, ...partial } : m) })),
    addStaff: (member) => commit(s => ({ staff: [...s.staff, member] })),
    removeStaff: (staffId) => commit(s => ({ staff: s.staff.filter(m => m.id !== staffId) })),

    sendDm: (toId, text, att) => {
      const cu = ROLE_USER[get().role];
      const msg: Message = { from: cu, text, time: 'now', att };
      const key = [cu, toId].sort().join('|');
      commit(s => ({ dms: { ...s.dms, [key]: [...(s.dms[key] || []), msg] } }));
    },
    openDmWith: (userId) => set({ dmOverlay: userId }),
    closeDmOverlay: () => set({ dmOverlay: null }),
    setChatActive: (id) => set({ chatActive: id }),

    sendGroup: (groupId, text, att) => {
      const cu = ROLE_USER[get().role];
      const msg: Message = { from: cu, text, time: 'now', att };
      commit(s => ({ groups: s.groups.map(g => g.id === groupId ? { ...g, messages: [...g.messages, msg] } : g) }));
    },
    createGroup: (name, members, photo) => {
      const id = 'g' + Date.now();
      commit(s => ({ groups: [...s.groups, { id, name, members, messages: [], photo }], newGroupModal: false, newGroupName: '', newGroupMembers: [] }));
    },
    editGroup: (groupId, name, members, photo) => commit(s => ({
      groups: s.groups.map(g => g.id === groupId ? { ...g, name, members, photo: photo ?? g.photo } : g),
      editGroupModal: false, editGroupId: null,
    })),
    deleteGroup: (groupId) => commit(s => ({
      groups: s.groups.filter(g => g.id !== groupId),
      editGroupModal: false, editGroupId: null,
      chatActive: s.chatActive === 'g:' + groupId ? null : s.chatActive,
    })),

    addEvent: (event) => commit(s => ({ events: [...s.events, event] })),
    updateEvent: (id, partial) => commit(s => ({ events: s.events.map(e => e.id === id ? { ...e, ...partial } : e) })),
    removeEvent: (id) => commit(s => ({ events: s.events.filter(e => e.id !== id), selectedEventId: s.selectedEventId === id ? null : s.selectedEventId })),
    archiveEvent: (id) => commit(s => {
      const ev = s.events.find(e => e.id === id);
      if (!ev) return {};
      return {
        events: s.events.filter(e => e.id !== id),
        archivedEvents: [...s.archivedEvents, { ...ev, archived: true }],
        selectedEventId: s.selectedEventId === id ? null : s.selectedEventId,
        contextMenu: null,
      };
    }),
    restoreEvent: (id) => commit(s => {
      const ev = s.archivedEvents.find(e => e.id === id);
      if (!ev) return {};
      return {
        archivedEvents: s.archivedEvents.filter(e => e.id !== id),
        events: [...s.events, { ...ev, archived: false }],
      };
    }),

    addTemplate: (type, tpl) => commit(s => ({
      templates: type === 'events'
        ? { ...s.templates, events: [...s.templates.events, tpl as EventTemplate] }
        : { ...s.templates, docs: [...s.templates.docs, tpl as DocTemplate] },
    })),
    updateTemplate: (type, id, partial) => commit(s => ({
      templates: type === 'events'
        ? { ...s.templates, events: s.templates.events.map(t => t.id === id ? { ...t, ...partial } : t) }
        : { ...s.templates, docs: s.templates.docs.map(t => t.id === id ? { ...t, ...partial } : t) },
    })),
    deleteTemplate: (type, id) => commit(s => ({
      templates: type === 'events'
        ? { ...s.templates, events: s.templates.events.filter(t => t.id !== id) }
        : { ...s.templates, docs: s.templates.docs.filter(t => t.id !== id) },
    })),
    duplicateTemplate: (type, id) => commit(s => {
      if (type === 'events') {
        const t = s.templates.events.find(x => x.id === id);
        if (!t) return {};
        return { templates: { ...s.templates, events: [...s.templates.events, { ...t, id: 'et' + Date.now(), name: t.name + ' (Copy)' }] } };
      }
      const t = s.templates.docs.find(x => x.id === id);
      if (!t) return {};
      return { templates: { ...s.templates, docs: [...s.templates.docs, { ...t, id: 'dt' + Date.now(), name: t.name + ' (Copy)' }] } };
    }),

    setUsername: (userId, username) => commit(s => ({ usernames: { ...s.usernames, [userId]: username } })),
    setInstagram: (userId, handle) => commit(s => ({ instagram: { ...s.instagram, [userId]: handle } })),

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
      const cu = ROLE_USER[get().role];
      patchDetail(eventId, d => ({
        ...d,
        requests: d.requests.map(c => c.id === threadId
          ? { ...c, draft: '', messages: [...c.messages, { from: cu, text, time: 'now' }] }
          : c),
      }));
    },
    resolveComment: (eventId, threadId) => patchDetail(eventId, d => ({
      ...d, requests: d.requests.map(c => c.id === threadId ? { ...c, status: 'resolved' } : c),
    })),
    reopenComment: (eventId, threadId) => patchDetail(eventId, d => ({
      ...d, requests: d.requests.map(c => c.id === threadId ? { ...c, status: 'open' } : c),
    })),
    setCommentDraft: (eventId, threadId, text) => patchDetail(eventId, d => ({
      ...d, requests: d.requests.map(c => c.id === threadId ? { ...c, draft: text } : c),
    })),
    setNewRequest: (eventId, text) => patchDetail(eventId, d => ({ ...d, newRequest: text })),
    addNewRequest: (eventId, text) => {
      const cu = ROLE_USER[get().role];
      patchDetail(eventId, d => ({
        ...d,
        newRequest: '',
        requests: [...d.requests, { id: 'rq' + Date.now(), from: cu, status: 'open', draft: '', messages: [{ from: cu, text, time: 'now' }] }],
      }));
    },

    updateEventFlightDeadline: (eventId, date) => commit(s => ({
      events: s.events.map(e => e.id === eventId ? { ...e, flightDeadline: date } : e),
    })),
    toggleReminder: (eventId, idx) => commit(s => ({
      events: s.events.map(e => {
        if (e.id !== eventId) return e;
        const off = e.reminderOff || [];
        return { ...e, reminderOff: off.includes(idx) ? off.filter(i => i !== idx) : [...off, idx] };
      }),
    })),
  };
});

// Selectors
export function currentUser(state: StoreState): string {
  return ROLE_USER[state.role];
}

export function isAdmin(state: StoreState): boolean {
  if (state.role === 'admin') return true;
  const ev = state.events.find(e => e.id === state.selectedEventId);
  return !!ev?.eventAdmins?.includes(ROLE_USER[state.role]);
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
    const forMe = n.forRole === 'both'
      || (isAdminUser ? n.forRole === 'admin' : n.forRole === 'staff')
      || n.mentionFor === cu;
    return forMe;
  }).length;
}

export function roleNotifs(state: StoreState): Notification[] {
  const cu = ROLE_USER[state.role];
  const isAdminUser = state.role === 'admin';
  return state.notifications.filter(n => {
    if (n.cleared) return false;
    return n.forRole === 'both'
      || (isAdminUser ? n.forRole === 'admin' : n.forRole === 'staff')
      || n.mentionFor === cu;
  });
}

export { ROLE_USER };
