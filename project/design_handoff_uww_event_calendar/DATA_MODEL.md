# Data Model — UWW Event & Content Calendar

TypeScript-style interfaces describing every entity in the prototype. These are derived
directly from the prototype's seed data and runtime shapes — field names and value enums match
exactly. Use them as the contract for your API / store models. IDs are opaque strings in the
prototype (`ev1`, `jh`, `n1`, …); in production use whatever your backend issues.

All dates are ISO `YYYY-MM-DD` strings unless noted.

```ts
// ---------- enums ----------
type Role        = 'admin' | 'staff' | 'freelance';
type Priority    = 'top' | 'mid' | 'low';            // gold / silver / bronze
type EventType   = 'wrestling' | 'continental' | 'rankingseries'
                 | 'documentary' | 'devcamp';        // extendable in the New Event form
type MemberStatus = 'invited' | 'pending' | 'confirmed';   // blue / amber / green
type AvailStatus  = 'Available' | 'Limited';         // no "Unavailable" — accepting implies available
type StaffType    = 'Staff' | 'Freelance';
type NotifKind    = 'flight' | 'info' | 'staff' | 'request' | 'roles' | 'reply' | 'mention';
type NotifTab     = 'info' | 'flights' | 'staffRoles' | 'requests' | 'schedule'
                  | 'posting' | 'notifications';
type NotifRole    = 'admin' | 'staff' | 'both';

// ---------- core entities ----------
interface Event {
  id: string;
  name: string;
  priority: Priority;
  eventType: EventType;
  competitionType: string;     // e.g. "World Championships", "Ranking Series" ('' for documentary/devcamp)
  ageRange: string;            // e.g. "Senior", "U23" ('' when not applicable)
  location: string;            // free text ('' if none)
  start: string;               // ISO date
  end: string;                 // ISO date
  staff: string[];             // StaffMember ids assigned to the event
  barColor?: string;           // optional custom calendar-bar colour (hex); else derived from type
  eventAdmins?: string[];      // StaffMember ids granted admin rights for THIS event only
  reminderOff?: number[];      // indices of disabled flight-reminder intervals (0=2wk,1=1wk,2=1day)
  flightDeadline?: string;     // ISO date — admin-set flight booking deadline
  archived?: boolean;
}

interface StaffMember {
  id: string;
  name: string;
  admin: boolean;              // global admin
  location: string;
  email: string;
  type: StaffType;
  skillsets: string[];         // lowercase skill keys, e.g. ['design','photography']
  country: string;             // 3-letter code, e.g. 'GBR'
  photo?: string;              // image URL / data URL (avatar); falls back to initials
  // username + instagram are stored in separate maps keyed by id (see AppState), not on the member
}

// Per-event working data. Keyed by event id in state.detail[eventId].
interface EventDetail {
  infoItems: InfoItem[];       // "Important Info" cards (docs + links)
  schedule: Record<string, ScheduleItem[]>;   // key = ISO day or 'Pre-Event'/'Post-Event'
  members: EventMember[];
  joinRequests: string[];      // StaffMember ids who requested to join (await admin approval)
  posting: Record<string, PostingItem[]>;      // key = ISO day or 'Pre-Event'/'Post-Event'
  availability: Record<string, Availability>;  // keyed by StaffMember id
  requests: Comment[];         // the "Comments" tab threads
  newRequest: string;          // composer draft (UI state)
}

interface EventMember {
  id: string;                  // StaffMember id
  roles: string[];             // assigned roles (limited to that member's skillsets)
  status: MemberStatus;
}

interface InfoItem {
  id: string;
  kind: 'doc' | 'link';
  name: string;
  content?: string;            // doc: rich-text HTML
  url?: string;                // link: target URL ('' = not yet set / greyed)
}

interface ScheduleItem { time: string; label: string; }   // time = 'HH:MM'

interface PostingItem {
  posted: boolean;
  type: string;                // 'Design' | 'Video' | 'Photos' | …
  name: string;
  link: string;
  athlete: string;
  caption: string;
}

interface Availability {
  status: AvailStatus;
  flights: boolean;            // flight booked
  flightNotReq?: boolean;      // "flight not needed" — suppresses flight reminders
  days?: string[];            // ISO days the member is available (only when status='Limited')
  daysConfirmed?: boolean;     // member has confirmed their limited days
}

interface Comment {            // a "Comments" tab thread
  id: string;
  from: string;                // StaffMember id who opened it
  status: 'open' | 'resolved';
  draft: string;               // reply composer draft (UI state)
  messages: Message[];
}

interface Notification {
  id: string;
  eventId: string;
  title: string;
  kind: NotifKind;
  pri: Priority;
  deadlineLabel: string;       // e.g. "2 weeks remaining", "Today", '' if none
  targetTab: NotifTab;         // which event tab clicking it opens
  forRole: NotifRole;          // visibility filter
  actioned?: boolean;          // clicked/handled — greys out, drops the red count
  cleared?: boolean;           // dismissed — removed from the list
  mentionFor?: string;         // StaffMember id, for "@you were mentioned" notifications
}

// ---------- chat ----------
interface Message {
  from: string;                // StaffMember id
  text: string;
  time: string;                // display string in prototype; use a real timestamp in production
  att?: Attachment;            // optional file attachment
}
interface Attachment { name: string; url: string; }   // url is a data URL in the prototype

// Direct messages: keyed by the two participant ids sorted + joined with '|', e.g. "jh|sr".
type DirectMessages = Record<string, Message[]>;

interface Group {
  id: string;
  name: string;
  members: string[];           // StaffMember ids (only members can see the group)
  messages: Message[];
  photo?: string;              // group icon (image/data URL)
}

// ---------- templates ----------
interface Templates {
  events: EventTemplate[];
  docs: DocTemplate[];
}
interface EventTemplate {
  id: string;
  name: string;
  eventType: EventType | '';
  competitionType: string;
  ageRange: string;
  priority: Priority;
  barColor?: string;
}
interface DocTemplate { id: string; name: string; content: string; }   // content = rich-text HTML

// ---------- top-level app state ----------
interface AppState {
  // view
  theme: 'dark' | 'light';
  viewMode: 'web' | 'mobile';
  role: Role;
  // current navigation
  page: 'calendar' | 'staff' | 'archive' | 'templates' | 'chat' | 'event' | 'profile';
  calView: 'calendar' | 'table';
  year: number; month: number;          // month is 0-indexed
  selectedEventId: string | null;
  eventTab: NotifTab;
  // data
  detail: Record<string, EventDetail>;  // keyed by event id
  // (events, archivedEvents, staff, notifications, templates, dms, groups,
  //  usernames, instagram are top-level collections — see seed-data.json)
}

// identity maps (keyed by StaffMember id)
type Usernames = Record<string, string>;   // @handle used for mentions
type Instagram = Record<string, string>;   // independent of username
```

## Key relationships & derived values
- An event's team = `EventDetail.members` (status-gated). `Event.staff` is the id list; member
  status/roles live in `EventDetail.members`.
- **Visible events** depend on role: admin & staff see all; **freelance** sees only events where
  `event.staff` includes them (or they have a pending join request).
- **Completion %** (`completionFor(event)`, admin-only) is computed from detail completeness
  (members confirmed, info filled, posting/schedule populated, availability/flights set).
- **Per-event notification count** = un-actioned, un-cleared, role-filtered notifications for
  that event (`mentionFor` must match the viewer if set; flight notifs suppressed when the
  viewer set `flightNotReq`).
- **Event admin**: `role==='admin' || event.eventAdmins.includes(currentUserId)` grants full
  admin controls on that one event.
- **Identity**: prototype current-user resolves by role — admin→`jh`, staff→`sr`, freelance→`aa`.

See `seed-data.json` for the actual starting fixtures (events, staff, notifications, templates).
The per-event `EventDetail` is generated lazily by `initDetail()` in the prototype; the JSON
includes one fully-expanded example (`detailExample`) so you can see a populated detail object.
