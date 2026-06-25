import type { UWWEvent, StaffMember, Notification, Templates, EventDetail, Group } from '../types';

export const SEED_EVENTS: UWWEvent[] = [
  { id: "ev1", name: "UWW Senior World Championships 2026", priority: "top", eventType: "wrestling", competitionType: "World Championships", ageRange: "Senior", location: "", start: "2026-07-07", end: "2026-07-12", staff: ["jh", "mc", "kt"], flightDeadline: "2026-06-23", archived: false },
  { id: "ev2", name: "Ranking Series — Budapest", priority: "mid", eventType: "wrestling", competitionType: "Ranking Series", ageRange: "Senior", location: "", start: "2026-07-09", end: "2026-07-10", staff: ["sr"], archived: false },
  { id: "ev3", name: "U23 European Championships", priority: "low", eventType: "wrestling", competitionType: "Continental Championships", ageRange: "U23", location: "Euros", start: "2026-07-20", end: "2026-07-23", staff: ["aa", "sr"], archived: false }
];

export const SEED_ARCHIVED: UWWEvent[] = [
  { id: "ar1", name: "Senior European Championships 2026", priority: "top", eventType: "wrestling", competitionType: "Continental Championships", ageRange: "Senior", location: "Euros", start: "2026-04-06", end: "2026-04-12", staff: ["jh", "mc"] },
  { id: "ar2", name: "Ranking Series — Tirana", priority: "mid", eventType: "wrestling", competitionType: "Ranking Series", ageRange: "Senior", location: "", start: "2026-02-10", end: "2026-02-12", staff: ["sr"] },
  { id: "ar3", name: "U17 World Championships 2025", priority: "mid", eventType: "wrestling", competitionType: "World Championships", ageRange: "U17", location: "", start: "2025-08-04", end: "2025-08-10", staff: ["kt", "aa"] }
];

export const SEED_STAFF: StaffMember[] = [
  { id: "jh", name: "Joshua Halvatzis", admin: true, location: "Brighton, UK", email: "joshhal@outlook.com", type: "Freelance", skillsets: ["design", "photography"], country: "GBR", photo: "/assets/josh.jpg" },
  { id: "mc", name: "Mateusz Zielonka", admin: false, location: "Warsaw, PL", email: "m.zielonka@uww.org", type: "Staff", skillsets: ["social video", "social manager"], country: "POL", photo: "/assets/mateusz.jpg" },
  { id: "kt", name: "Luca Vukovich", admin: false, location: "London, UK", email: "l.vukovich@uww.org", type: "Staff", skillsets: ["documentary video", "creative video"], country: "GBR", photo: "/assets/luca.jpg" },
  { id: "aa", name: "Karol Angerman", admin: false, location: "Krakow, PL", email: "k.angerman@uww.org", type: "Freelance", skillsets: ["photography", "creative photography"], country: "POL", photo: "/assets/karol.jpg" },
  { id: "sr", name: "Mike Stevens", admin: false, location: "Bournemouth, UK", email: "mike.stevens@uww.org", type: "Staff", skillsets: ["posting", "design"], country: "GBR", photo: "/assets/mike.jpg" }
];

export const SEED_NOTIFICATIONS: Notification[] = [
  { id: "n1", eventId: "ev1", title: "Book Flights", kind: "flight", pri: "top", deadlineLabel: "2 weeks remaining", targetTab: "flights", actioned: false, forRole: "both" },
  { id: "n2", eventId: "ev1", title: "Upload Event Info", kind: "info", pri: "top", deadlineLabel: "2 weeks remaining", targetTab: "info", actioned: false, forRole: "admin" },
  { id: "n3", eventId: "ev1", title: "Assign Staff", kind: "staff", pri: "top", deadlineLabel: "1 week remaining", targetTab: "staffRoles", actioned: false, forRole: "admin" },
  { id: "n4", eventId: "ev1", title: "Approve Staff Request — Mike Stevens", kind: "request", pri: "top", deadlineLabel: "", targetTab: "requests", actioned: false, forRole: "admin" },
  { id: "n5", eventId: "ev3", title: "Book Flights", kind: "flight", pri: "low", deadlineLabel: "1 week remaining", targetTab: "flights", actioned: false, forRole: "both" },
  { id: "n6", eventId: "ev3", title: "Missing Event Info", kind: "info", pri: "low", deadlineLabel: "5 days remaining", targetTab: "info", actioned: false, forRole: "admin" },
  { id: "n7", eventId: "ev1", title: "Roles Updated — Photographer", kind: "roles", pri: "top", deadlineLabel: "Today", targetTab: "staffRoles", actioned: false, forRole: "staff" },
  { id: "n8", eventId: "ev3", title: "Request Replied", kind: "reply", pri: "low", deadlineLabel: "Yesterday", targetTab: "requests", actioned: false, forRole: "staff" }
];

export const SEED_TEMPLATES: Templates = {
  events: [{ id: "et1", name: "New Event Template", eventType: "", competitionType: "", ageRange: "", priority: "mid", barColor: "" }],
  docs: [{ id: "dt1", name: "Event Brief", content: "" }]
};

export const SEED_USERNAMES: Record<string, string> = {};
export const SEED_INSTAGRAM: Record<string, string> = { jh: "joshuahalvatzis", mc: "mateuszzielonka" };

export const SEED_GROUPS: Group[] = [];

export function initDetail(eventId: string, events: UWWEvent[]): EventDetail {
  const ev = events.find(e => e.id === eventId);
  const detail: EventDetail = {
    infoItems: [
      { id: "doc1", kind: "doc", name: "Event Info", content: "" },
      { id: "lnk-photo", kind: "link", name: "Photo", url: "" },
      { id: "lnk-arena", kind: "link", name: "Arena", url: "" }
    ],
    schedule: {},
    members: (ev?.staff || []).map(id => ({ id, roles: [], status: "confirmed" as const })),
    joinRequests: [],
    posting: {},
    availability: {},
    requests: [],
    newRequest: ""
  };
  if (eventId === "ev1" && ev) {
    detail.members = [
      { id: "jh", roles: ["Design"], status: "confirmed" },
      { id: "mc", roles: ["Social Video"], status: "confirmed" },
      { id: "kt", roles: ["Documentary Video"], status: "confirmed" }
    ];
    detail.joinRequests = ["sr"];
    detail.schedule = {
      "2026-07-07": [{ time: "10:00", label: "Weigh-in" }, { time: "17:00", label: "Qualification rounds — Mats A–C" }],
      "2026-07-08": [{ time: "18:00", label: "Finals & medal ceremony" }]
    };
    detail.posting = {
      "Pre-Event": [{ posted: true, type: "Design", name: "Event Announcement", link: "dropbox.com/uww/announce", athlete: "", caption: "Hype graphic — 1 week out" }],
      "Post-Event": [{ posted: false, type: "Video", name: "Highlights Reel", link: "", athlete: "", caption: "90s recap for socials" }],
      "2026-07-07": [{ posted: false, type: "Photo", name: "Day 1 Gallery", link: "", athlete: "", caption: "Top moments" }]
    };
    detail.availability = {
      jh: { status: "Available", flights: true },
      mc: { status: "Available", flights: false },
      kt: { status: "Limited", flights: true }
    };
    detail.requests = [
      { id: "rq1", from: "sr", status: "open", draft: "", messages: [{ from: "sr", text: "Requesting flight from Bournemouth (BOH) on the 6th — can you confirm the budget cap?", time: "2 days ago" }] }
    ];
  }
  return detail;
}

export const EVENT_TYPES = ['wrestling', 'grappling', 'randoms', 'amma', 'pankration', 'devcamp', 'documentary'] as const;
export const COMPETITION_TYPES_WRESTLING = ['Continental Championships', 'World Championships', 'Ranking Series'];
export const COMPETITION_TYPES_CONTINENTAL = ['European Championships', 'Pan American Championships', 'Asian Championships', 'African Championships', 'Oceania Championships'];
export const AGE_RANGES = ['Senior', 'U23', 'U20', 'U17', 'U15'];
export const REGIONS = ['Euros', 'Pans', 'Asian', 'Oceania', 'African'];
export const EVENT_ROLES = ['Designer', 'Photographer', 'Social Video', 'Documentary Video', 'Creative Video', 'Social Manager', 'Posting', 'Creative Photography'];

/** Canonical skillset keys (lowercase). Display via titleCase. Event roles for a
 *  member are limited to their assigned skillsets. */
export const SKILLSETS = [
  'social video', 'documentary video', 'creative video', 'bts video',
  'design', 'photography', 'creative photography', 'posting', 'social manager',
];
export const POST_TYPES = ['Photo', 'Design', 'Story', 'Video', 'Thumbnail', 'YouTube', 'UWW+', 'Web'];

export const IMPORT_EVENTS = [
  { id: "imp1", name: "Senior World Cup — Istanbul", priority: "top" as const, eventType: "wrestling" as const, competitionType: "World Cup", ageRange: "Senior", location: "Istanbul, TUR", start: "2026-08-15", end: "2026-08-18", staff: [], archived: false },
  { id: "imp2", name: "U20 World Championships 2026", priority: "mid" as const, eventType: "wrestling" as const, competitionType: "World Championships", ageRange: "U20", location: "Belgrade, SRB", start: "2026-09-05", end: "2026-09-11", staff: [], archived: false },
  { id: "imp3", name: "Ranking Series — Warsaw", priority: "mid" as const, eventType: "wrestling" as const, competitionType: "Ranking Series", ageRange: "Senior", location: "Warsaw, POL", start: "2026-08-28", end: "2026-08-30", staff: [], archived: false },
  { id: "imp4", name: "Cadet World Championships", priority: "low" as const, eventType: "wrestling" as const, competitionType: "World Championships", ageRange: "Cadet", location: "Almaty, KAZ", start: "2026-10-01", end: "2026-10-06", staff: [], archived: false },
];
