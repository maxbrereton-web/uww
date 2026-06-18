# Handoff: UWW Event & Content Calendar

## Overview
A fully-interactive admin + staff **event and content calendar** for United World Wrestling
(UWW). It lets administrators plan events, build teams, manage posting schedules, track flight
availability, and message staff; staff and freelance contributors see the events they're on,
respond to invites, set availability, and chat. The interface ships dark-by-default with a
light theme, a web and a mobile layout, and three roles (Admin / Staff / Freelance).

## About the Design Files
The files in this bundle are **design references created in HTML** — a working prototype that
demonstrates the intended look, layout, copy, and behaviour. They are **not production code to
copy directly.** The task is to **recreate these designs in the target codebase's existing
environment** (React, Vue, Svelte, native, etc.) using its established component library,
routing, state, and data layer. If no codebase exists yet, choose the most appropriate modern
framework (a React + TypeScript SPA is a natural fit given the structure here) and implement
the designs there.

The prototype is a single self-contained component. In a real app you should decompose it into
proper components, move the mock in-memory data behind an API/data layer, and replace the
`localStorage` persistence with real backend persistence + auth.

### How to run the prototype for reference
`UWW Event Calendar.dc.html` is a "Design Component" — it relies on a small runtime
(`support.js`, included) and the UWW design-system bundle (not included; see **Assets**).
The most reliable way to study it is to read the source: the logic class lives in the
`<script data-dc-script>` block near the bottom, and the markup template is the `<x-dc>` body.
All styling is inline + a small `<style>` block of CSS variables and keyframes at the top.

## Fidelity
**High-fidelity (hifi).** Final colours, typography, spacing, interactions, animations, and
copy are all present and intentional. Recreate the UI faithfully using the codebase's existing
libraries — match the exact tokens listed below. Where the codebase already has equivalent
primitives (buttons, inputs, avatars), prefer those styled to these tokens over pixel-cloning.

---

## Roles & Theming
- **Three roles**, switched bottom-left of the sidebar: **Admin** (default), **Staff**,
  **Freelance**. Identity resolves to `jh` (Joshua Halvatzis, admin) / `sr`→Mike Stevens (staff)
  / `aa`→Karol Angerman (freelance).
- **Freelance** = staff, but can **only see events they're assigned to** (or have a pending join
  request for). Staff see all events.
- **Event admins**: any staff member can be promoted to admin **for a single event**, gaining
  full admin controls on that event only.
- **Theme**: dark default, light toggle. Implemented as CSS custom properties that flip on a
  `[data-app-theme="light"]` attribute on the root. **Use a theming mechanism (CSS vars / a
  ThemeProvider) — do not hardcode colours.**
- **Layout mode**: a web/mobile toggle (sit above the role toggle). Mobile is a genuinely
  different responsive layout, not just a narrower web view (single-column chat with a back
  button, two-column stacked tables, collapsible staff cards, finger-cursor tutorial, etc.).
  In production this should be driven by viewport/media queries, not a manual toggle.

---

## Screens / Views

### 1. Calendar (home)
- **Purpose**: month-at-a-glance view of all events.
- **Layout**: left sidebar nav (~230px) + main area. Top bar holds the page title (left),
  month navigation (centered chevrons + "Month YYYY"), search, a Filter button, a
  Calendar/Table toggle, a global notifications bell, and the user avatar. Below: a 7-column
  month grid; each day cell is a flex column that stacks event bars.
- **Event bars**: a horizontal bar spanning the event's days (multi-day events render as a
  continuous bar that wraps across week rows). Each bar shows, left→right: a **priority dot**
  (only at the event's start, not on wrapped continuations), the event name (only on the first
  row), confirmed/pending **staff avatars**, and a red **notification count badge**.
  Overlapping events stack into lanes; overflow collapses into a high-visibility **`+N more`**
  chip, with the higher-priority event drawn on top.
- **Interactions**: click a bar → open that event. Right-click (web) / **press-and-hold**
  (mobile) a bar → context menu ("Request to join event", or "Archive event" for admins).
  Right-click / press-and-hold an empty day (admin) → "Start event from here".

### 2. Table view
- Toggle from the Calendar/Table control. Columns: Priority (dot), Event name, Type, Dates,
  **Completion %** (admin only), Staff (avatars), Comments/Requests, **Notifications**.
- **Sort by** button: Date / Type / Completion / Priority. Clicking a key sorts ascending;
  clicking the same key again flips direction. **Tie-break chain**: chosen key → then priority
  → then date.
- Columns share one CSS grid template (`minmax(0,…fr)` tracks) so header and rows align exactly.
  Mobile: the table gets a min-width and scrolls horizontally so every column stays readable.

### 3. New Event (overlay form)
- Adaptive form. Event type drives the rest: **Wrestling** → competition types + age ranges;
  **Continental** → location; **Ranking Series** → age locked to Senior; **Documentary** and
  **Development Camp** → competition type greyed out (not needed). Native date pickers. A
  **calendar-bar colour picker**. All dropdowns are user-extendable ("Add new…" → name prompt).

### 4. Import from UWW.org (overlay)
- Mock "fetch from UWW.org". Opens a **review panel** listing fetched events; each row has a
  Low/Mid/Top priority selector + a delete control. "Add N events" confirms and adds them all.
  Already-imported events are filtered out.

### 5. Event detail (7 tabs)
Opened by clicking any event. A header lets you switch events without leaving detail. Tabs:
1. **Event Info** — at-a-glance: priority, dates, competition. **Important Info** panel: a card
   list of docs & links. Seeds: a greyed **Event Info** doc (opens a Word/Docs-style rich-text
   editor — style/size, bold/italic/underline/strike, align, lists, quote, divider, clear), a
   **Photo** link (→ photo.uww.org) and an **Arena** link (→ brackets). Links start greyed;
   clicking one (admin) opens a setup overlay: "Find event automatically" (mock AI search →
   confirm) or "Paste link manually". A **+** adds a new doc or link. Below: an **Event admin**
   section — all standard admins listed; admin can add any staff member as an event admin
   (popover opens upward).
2. **Event Schedule** — per-day timings.
3. **Posting Schedule** — content/social plan (link, athlete, caption per post). Mobile reflows
   each post into a 2-column label/value layout with the × at bottom-right.
4. **Event Team** (formerly "Staff & Roles") — **staff-first** two-way join handshake (see
   *Interactions* below). Member rows show avatar, name, assigned role chips (simple text,
   space-separated, divided), and an × to remove. Roles assignable per member are limited to
   that person's skillsets.
5. **Availability & Flights** — admin sets a **flight-booking deadline** (date). Staff/admin set
   their own status to **Available / Limited** (no "Unavailable" — accepting implies available).
   Limited → a row of selectable **per-day boxes** ("Day N" + date); confirm locks them and the
   chosen range shows in **orange brackets** next to the name (e.g. `(07/07 - 09/07)`, with gaps
   like `(07/07 - 08/07, 10/07 - 11/07)`); **Edit days** reopens. Others see `(TBC)` until
   confirmed. **Flight booked** checkbox per person (only that person can toggle their own) +
   **(flight not needed)** checkbox that greys it out and suppresses flight reminders.
6. **Notifications** — per-event, role-filtered alerts; counts tick in sync with the global bell.
7. **Comments** (formerly "Requests") — a chat thread to the admin team. `@`-mention
   autocomplete (live bold-orange tags), file attach, admin Resolve/Re-open.

### 6. Staff page (admin)
- Table of staff: admin toggle, type (Staff/Freelance), editable skillset tags (assigned skills
  drop out of the add-dropdown), New Staff → invite flow. Right-click / press-and-hold to remove.
- Mobile: each person becomes a card with a name heading, 2-column label/value rows, and a
  collapse arrow (top-right) to minimise.

### 7. Chat (sidebar nav, both roles)
- 1-to-1 DMs **and** group chats, separate from event Comments. A full Chat page (list + thread
  + composer) and a click-to-open floating DM overlay (clicking any teammate avatar anywhere).
- **Groups**: "New group" (name + uploadable/croppable icon, tick members) or "Create from
  event" (auto-adds the event's team, auto-names it). Edit-group button in the header. Groups
  visible only to members.
- Chat page: a **search bar** (matches names *and* in-chat text), sidebar split into two
  scrollable halves (Direct Messages / Groups). Shared **mention composer** (`@`-autocomplete,
  paperclip attach → "X mentioned you" notification; attachments preview before send, show
  truncated filename + download).
- Mobile: tapping a name opens the thread **full-screen** with a **‹ back** button.

### 8. Templates (admin nav)
- **Event Templates** (name, priority, event/competition type, age, duration, bar colour) and
  **Document Templates** (rich-text). Full CRUD: New, Save, Edit, Duplicate, Delete.

### 9. Archive
- Restore past events. Mobile: horizontally scrollable table.

### 10. Profile (centered modal)
- First/last name, **Username** (used for @-mentions), **Instagram handle** (independent of
  username; renders a clickable IG link), login credentials, theme toggle, **replay tutorial**.
- Avatar upload → **crop overlay** with a circular mask preview.

### 11. Tutorial (staff-facing, animated)
- A video-style guided tour: an animated cursor (a **pointing-finger** in mobile) moves to and
  clicks the relevant control, *then* the explainer text appears; Next replays for the next
  step. Copy speaks to "you" as a staff member. Covers all 7 event tabs (the Notifications step
  actually opens the bell dropdown), the calendar colour-coding + priority dot + approved-avatar
  + Calendar/Table toggle, Chat, and Profile. Cursor hidden on slides 1–2, appears on Next,
  disappears on the last slide. No hyphens in tutorial copy (intentional copy rule).

---

## Interactions & Behavior

### The two-way join handshake (Event Team)
- **Admin adds a member** → status **Invited** (admin sees "Awaiting acceptance"). That member
  must **Accept/Decline** (shown only to them). Accept → **Pending**.
- **Staff requests to join** (via the + on the tab, or right-click/press-hold an event →
  "Request to join") → shows in the admin's "Requests to join" with Approve/Decline → **Pending**.
- Once invite-accepted or request-approved → **Approved/confirmed** (drives the
  confirmed-avatar state on calendar/table).
- Badge colours: **Invited = blue, Pending = amber, Approved/confirmed = green** (status only —
  see avatar-ring note below).

### Notifications
- Global bell dropdown + per-event tab, role-filtered, clickable (jumps to the relevant tab and
  greys out the notification). Each has `actioned` and `cleared` flags. The red count shows
  un-actioned items; when all are actioned it turns **grey, shows 0**, and a **Clear all**
  appears. Cleared items are removed; empty state = "You're all caught up." Per-event red badges
  are computed live and tick down with the bell.

### Comments / mentions
- `@` opens an autocomplete of teammates. A completed tag becomes **bold orange** the moment a
  name is picked (before send); deleting a letter reverts it to normal text. Posting a mention
  fires an "X mentioned you" notification to the tagged user. Admins can mention too.

### Animations / motion
- **Priority = medal scheme**: **Top = gold, Mid = silver, Low = bronze.** Gold has a subtle
  animated shimmer + ripple so it reads apart from bronze (`goldGlow` brightness pulse +
  `goldRipple` expanding ring). Respect `prefers-reduced-motion` (the prototype disables
  animation under it).
- Overlay entrances animate **transform only, never from opacity:0** (so paused/capture
  environments don't leave them invisible) — a sensible rule to keep.
- General motion is restrained (~120–360ms, ease-out) per the UWW design system.

### Responsive behavior
- Mobile is a distinct layout (see role/layout note). Press-and-hold replaces right-click;
  chat goes full-screen with a back button; wide tables scroll horizontally; the posting
  schedule and staff page reflow to stacked label/value rows.

---

## State Management
The prototype keeps everything in component state / instance fields. A real implementation
should model these as proper app state (store) + server data:

- **UI state**: `theme`, `viewMode` (web/mobile), `role` (admin/staff/freelance), current
  `page`, `calView` (calendar/table), visible `year`/`month`, `search`, `filters`,
  `selectedEventId` + active `eventTab`, the active overlay, sort key + direction, various
  open/collapsed flags, tutorial step + cursor position.
- **Domain data**: `events`, `archivedEvents`, per-event `detail` (members, joinRequests,
  availability, infoItems, schedule, posting schedule, requests/comments, eventAdmins,
  flightDeadline, reminder toggles), `staff` (incl. photos, skillsets, admin flag, type),
  `notifications`, direct messages (`dms` keyed by sorted id-pair), `groups`, `templates`
  (events + docs), `usernames`, `instagram` handles.
- **Derived**: `visibleEvents()` (role filter), `completionFor(ev)`, `confirmedStaffFor(ev)`,
  `eventNotifCount(ev)`, sorted/filtered table rows.

### Persistence (prototype)
The prototype auto-persists a snapshot of view state + all domain data to `localStorage`
(key `uww_cal_state_v1`, version-tagged, debounced ~1.5s + on unload, try/catch-guarded) and
hydrates on load (navigation resets to Calendar). **Replace this with real backend persistence
and authentication.** Treat it only as a list of what needs to survive a session.

### Data fetching (production)
- Events, staff, details, notifications, chats, templates → real API.
- "Import from UWW.org" and link "Find event automatically" are mocked here; wire to the real
  UWW.org data source / a search service.
- Document editor content is stored as HTML; persist as rich text (HTML or a structured doc model).

---

## Design Tokens

### Colours — Dark (default)
| Token | Value |
|---|---|
| `--bg` | `#0c0d12` |
| `--sidebar` | `#08090d` |
| `--topbar` | `#0f1016` |
| `--panel` | `#14161e` |
| `--panel-2` | `#191c25` |
| `--cell` | `#1b1e27` |
| `--cell-muted` | `#15171f` |
| `--border` | `rgba(255,255,255,.08)` |
| `--border-strong` | `rgba(255,255,255,.15)` |
| `--text` | `#f2f3f7` |
| `--text-muted` | `#9499a8` |
| `--text-faint` | `#565b6c` |
| `--control` | `#20232e` |
| `--control-hover` | `#282c3a` |
| `--field` | `#23262f` |
| `--shadow` | `0 18px 50px rgba(0,0,0,.55)` |

### Colours — Light (`[data-app-theme="light"]`)
| Token | Value |
|---|---|
| `--bg` | `#e9ebf0` |
| `--sidebar` / `--topbar` / `--panel` / `--cell` | `#ffffff` |
| `--panel-2` | `#f6f7f9` |
| `--cell-muted` | `#f4f5f8` |
| `--border` | `rgba(4,0,63,.10)` |
| `--border-strong` | `rgba(4,0,63,.18)` |
| `--text` | `#13162a` |
| `--text-muted` | `#6c7385` |
| `--text-faint` | `#9aa0b2` |
| `--control` | `#f1f2f5` |
| `--control-hover` | `#e7e9ef` |
| `--field` | `#f1f2f5` |
| `--shadow` | `0 18px 50px rgba(4,0,63,.14)` |

### Brand / accent (both themes)
| Token | Value | Use |
|---|---|---|
| `--accent` | `#F58220` | UWW orange — primary identity, trims, links |
| `--accent-deep` | `#F15A22` | deeper orange — solid fills with white labels, own-message bubbles |
| Avatar ring | `#F15A22`-family orange, **1.5px** | confirmed staff (NOT green); pending = greyed/muted |
| Limited-availability dates | UWW orange | bracketed date text |

### Priority (medal) colours
| Priority | Colour | Notes |
|---|---|---|
| Top | **gold** `#CFA63A` (highlight `#E0C078`) | animated: `goldGlow` brightness pulse + `goldRipple` ring |
| Mid | **silver** `#B4BBC7` | static |
| Low | **bronze** `#C0793C` | static |
| Done/complete | `var(--text-faint)` | greyed dot |

### Status colours
- Invited = blue · Pending = amber · Confirmed = green (these are **status badges**, distinct
  from the orange avatar ring).

### Typography
- Display/labels/headings/stats/buttons: **Open Sans, condensed** (`font-stretch:75%`),
  weight 800, uppercase, tight line-height (~0.9), slight negative tracking. Eyebrows uppercase
  `.14em` tracking. (Brand print face is Fedra Sans Condensed — substituted with Open Sans for
  web per the UWW guide; swap if you license Fedra.)
- Body: **Open Sans** regular width, sentence case.
- Observed UI sizes: section/card body 12.5–14px, small meta 9.5–11px, field text ~13.5px,
  oversized condensed numbers for stats. Adjust to the codebase scale but keep the
  condensed-uppercase-display vs regular-body contrast.

### Radii / borders / shadows
- Corners are sharp-ish/athletic: form controls ~9px, cards/panels ~10–14px, small chips 5–7px.
- Hairline borders via `--border`; stronger via `--border-strong`. 3px orange accents
  (tab underline, focus ring, card accent bar).
- Navy-tinted soft shadows (`--shadow`), never harsh grey.

### Spacing
- 4px base grid. Common paddings: cells/cards 11–16px, sidebar ~230px wide. Flex/grid + `gap`
  for all groupings (not margin-based inline flow).

### Keyframes (motion)
- `goldRipple` (expanding box-shadow ring, 2.2s) + `goldGlow` (brightness/saturation pulse) on
  top-priority dots; `goldFlag` border-colour pulse; `uwwSpin` loader. All disabled under
  `prefers-reduced-motion`.

---

## Assets
Bundled in `assets/`:
- **Staff photos** (used as avatars across the app): `josh.jpg`, `mike.jpg`, `luca.jpg`,
  `mateusz.jpg`, `karol.jpg`. These are sample/demo portraits — replace with real user uploads.
- **UWW brand marks**: `uww-logo-lockup.svg`, `uww-emblem.svg`, `uww-emblem-world.svg`,
  `uww-emblem-continental.svg`. Use the official brand assets from your environment in production.

**Not bundled — the UWW design system.** The prototype loads the UWW design-system token CSS
(`tokens/*.css`, `styles.css`) and component bundle from a `_ds/…` path. In your codebase, use
your existing UWW design-system package (Button, Input, Select, Avatar, Badge, Tag, Card, Stat,
Tabs, etc.) rather than re-importing the prototype bundle. The token values above mirror that
system so you can map them to your library.

Icons are thin-stroke (1.75–2px) line SVGs drawn inline (a Lucide-style substitution — UWW has
no published icon set). Use Lucide or your existing icon set. **No emoji** anywhere (brand rule);
country identity is shown via 3-letter country codes, medals as solid colour discs.

## Screenshots
Reference captures of the prototype live in `screenshots/` (admin role, dark theme unless noted):

| File | Shows |
|---|---|
| `calendar-admin-dark.png` | Month calendar grid — spanning event bars, priority dot, staff avatars, notification badge |
| `calendar-light-theme.png` | Same calendar in the light theme |
| `table-view-admin.png` | Sortable table view (priority, completion %, staff avatars, notifications) |
| `new-event-form.png` | New Event overlay (priority segmented control, adaptive type/competition, dates) |
| `import-from-uww.png` | Import-from-UWW.org review panel (per-row priority + delete, "Add N events") |
| `event-info-tab.png` | Event detail → Event Info (priority/type/competition/dates + Important Info) |
| `event-team-tab.png` | Event detail → Event Team (Requests to join, member rows, role assignment) |
| `availability-flights-tab.png` | Event detail → Availability & Flights (deadline, reminders, per-person status) |
| `posting-schedule-tab.png` | Event detail → Posting Schedule (per-post link/athlete/caption) |
| `comments-tab.png` | Event detail → Comments (thread, Reply/Resolve, mention composer) |
| `chat-page.png` | Chat page (search, Direct Messages / Groups split, New group, thread pane) |
| `staff-page-admin.png` | Staff admin page (admin toggle, type, editable skillset tags) |
| `templates-page.png` | Templates (Event Templates + Document Templates, CRUD controls) |
| `profile-modal.png` | Profile modal (name, username, Instagram, login, Watch Tutorial) |
| `tutorial.png` | Staff-facing guided tutorial overlay (animated cursor walkthrough) |
| `mobile-calendar.png` | Mobile layout (bottom tab bar, adapted calendar) |

## Files
- `UWW Event Calendar.dc.html` — the complete prototype (markup template + logic class + inline
  styles). The single source of truth for layout, copy, and behaviour.
- `DATA_MODEL.md` — TypeScript-style interfaces for every entity (Event, StaffMember,
  EventDetail, Notification, Message, Group, Template, AppState) + key relationships.
- `seed-data.json` — the real starting fixtures (events, staff, notifications, templates,
  Instagram handles) plus one fully-expanded `EventDetail` example. Develop against these.
- `support.js` — the prototype runtime (reference only; not needed in production).
- `assets/` — staff photos + UWW brand marks (see above).
- `PROJECT_NOTES.md` — the running build notes (decisions, conventions, feature inventory) kept
  during the design process. Useful secondary context; this README is the primary spec.
