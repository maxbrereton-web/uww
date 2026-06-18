# UWW Event & Content Calendar — Project Notes

Persistent context for this project. The deliverable is **`UWW Event Calendar.dc.html`**
(a single Design Component). Read that file first before editing.

## What this is
A fully-interactive admin + staff **event & content calendar** for United World Wrestling (UWW).
Built on the bound UWW design system (`_ds/`), dark theme by default with a light toggle.
Single `.dc.html` file — all screens, state, and overlays live in one component.

## Roles
- **Admin**, **Staff** and **Freelance** views, switched via the toggle bottom-left of the sidebar.
- Default role on load: **admin**. Default theme: **dark**. `this.ME` resolves jh (admin) / sr=Mike
  (staff) / aa=Karol (freelance).
- **Freelance** = like staff but can ONLY see events they're assigned to (or have a pending join
  request for) — `visibleEvents()` filters by `ev.staff.includes(this.ME)` when role==='freelance'.
  Staff see all events.
- **Event admins**: Event Info tab has an **Event Admin** section (below Important Info) — all standard
  admins are always listed (no removable tag); admin can add any staff member as an event admin via a +
  popover that opens UPWARD. Stored on `ev.eventAdmins`. An event admin gets FULL admin controls on
  that event only (`isAdmin` in eventVals = role==='admin' || eventAdmins.includes(ME)).

## Key screens / features (all working)
- **Calendar**: month grid with spanning multi-day event bars, overlap stacking + a high-visibility
  `+N more` chip (higher priority sits on top), live notification badges, month nav, search, Filter
  popup (type + priority). Right-click a day (admin) → "Start event from here".
- **Table view**: toggle next to Calendar. Has a **Sort by** button (Date / Type / Completion / Priority).
  Tie-break chain: chosen value → then **priority** → then **date**.
- **New Event**: adaptive form (Wrestling → competition types → age ranges; Continental → location;
  Ranking Series locks age to Senior). Native date pickers.
- **Import from UWW.org**: opens a **review panel** listing fetched events — each row has a
  Low/Mid/Top priority selector + delete; "Add N events" confirms and adds them all. Filters out
  already-imported events.
- **Event detail**: 7 tabs — Event Info, Event Schedule, Staff & Roles, Posting Schedule,
  Availability & Flights, Notifications, Requests.
  - **Event Info tab — "Important Info" panel** (replaces old Documents grid): card list of info items
    stored on `detail[eid].infoItems` (`{id,kind:'doc'|'link',name,content?/url?}`). Seeds: greyed
    **Pre-Event Info** (doc, empty) + **Photo** (link → photo.uww.org) + **Arena** (link → brackets).
    Clicking a `doc` opens a Word/Docs-style editor overlay (white serif page + rich-text toolbar:
    style/size, bold/italic/underline/strike, align, lists, quote, divider, clear formatting — built as
    a contentEditable React component `makeDocEditorComponent`, content stored as HTML); admin
    writes/saves the brief (empty = greyed, "Tap to write the brief"; saved = active "Document"). Staff
    can only open a doc that has content. **Photo & Arena links start empty/greyed** — clicking one (admin)
    opens a **link-setup overlay**: choose "Find event automatically" (mock AI search of UWW.org → shows a
    found result + Confirm) or "Paste link manually". Once a URL is set the card activates and clicking
    opens it. Admin **+** button → dropdown
    (New document / Add link); Add link opens a small name+URL modal. Seed items can't be removed; added
    ones have an ×. Handlers: `openInfoItem`, `openDocEditor`/`saveDoc`, `saveLink`, `removeInfoItem`.
    sender + admin (and any participant) post replies (button says **Reply**, with a text box) — it
    stays **Open** as a back-and-forth until the **admin hits Resolve** to close it (admin can Re-open).
    Own messages right-aligned/orange, others left. Model:
    `requests:[{id,from,status,draft,messages:[{from,text,time}]}]`. Handler `sendReply(eid,rqid)`.
  - **Availability & Flights tab**: admin sets a **flight booking deadline** (date picker). The three
    reminder intervals (2 weeks / 1 week / 1 day before) show as **toggle chips** — each clickable
    on/off, all **on by default** (disabled indices stored on `ev.reminderOff`). Staff see only a
    one-line read-only deadline note (no reminders panel — it's an admin setup tool). Stored on
    `ev.flightDeadline`.
  - **Availability**: status is just **Available / Limited** (no "Unavailable" — accepting the invite
    implies availability). When a staff member sets their own availability to **Limited**, a row of
    selectable **per-day boxes** appears (one per competition day, "Day N" + date from `eventDayList(ev)`).
    They tap the days they're free, then click **Confirm dates** — the boxes lock and the chosen dates
    show **in orange brackets next to their name** (e.g. "(07/07 - 09/07)"); an **Edit days** button
    reopens selection. The day grid is visible **only to that staff member** while unconfirmed; everyone
    else (admins + other staff) sees **"(TBC)"** in the same orange bracket style until they confirm. Stored on `availability[sid].days` (ISO array) + `.daysConfirmed`; handler
    `toggleAvailDay(eid,sid,iso)`.
- **Staff & Roles tab is STAFF-FIRST** (not role-first): two-way join handshake.
  - **Admin adds a member** → status **Invited** (admin sees "Awaiting acceptance"); the staff member
    must **Accept/Decline** (shown only to that user in staff view). Accept → **Pending**.
  - **Staff requests to join** (via the + "Join event" button on the tab, OR **right-click an event in
    the calendar/table → "Request to join event"**) → appears in the admin's "Requests to join" section
    with Approve/Decline. Approve → **Pending**.
  - Once on the team (admin-invite **accepted** by staff, or join-request **approved** by admin), the
    member is **Approved/confirmed** (green avatar, drives calendar/table confirmed state). The admin
    assigns roles via chips + "Assign role" dropdown (limited to that person's skillsets). Member rows
    have NO approve button — only the small **×** to remove; the Approve/Decline gate lives solely in
    the "Requests to join" section (and Accept/Decline for invites in the staff member's own view).
    Badge colours: Invited=blue, Pending=amber, Approved=green.
  - "+ Add staff member" is a round + button → popover of addable staff. Members live in
    `detail[eventId].members` ({id, roles, status:'invited'|'pending'|'confirmed'}); join requests in
    `detail[eventId].joinRequests`. Current staff user = `this.ME` ('jh'). Roles list = EVENT_ROLES.
  - Staff view is read-only except their own Accept/Decline and the Join-event request button.
- **Staff page** (admin): table w/ admin toggle, type, editable skillset tags, New Staff → invite flow,
  right-click to remove.
- **Notifications**: global dropdown (top bar) + per-event tab. Role-filtered, clickable (jump to the
  right tab). Each notification has `actioned` and `cleared` flags. Clicking a notification actions it
  (navigates + greys it out at 0.45 opacity, grey dot/tag) and reveals a **Clear** button to dismiss it.
  The red top-bar count shows un-actioned count; when all are actioned it turns **grey and shows 0**, and
  a **Clear all** button appears at the foot of the panel. Cleared notifications are removed; empty state
  shows "You're all caught up." Handlers: `actionNotif`, `clearNotif`, `clearAllNotifs`.
  - **Per-event notification counts** (red badge on calendar bars + table Notifications column) are
    computed live via `eventNotifCount(ev)` = un-actioned, un-cleared, role-filtered notifications for
    that event. They tick down in sync with the main bell dropdown (NOT the old static `ev.notif`).
- **Archive** (restore past events), **Profile menu** (centered modal), **guided Tutorial**.
- **Chat** (sidebar nav item, both roles): 1-to-1 direct messages. Full Chat page (conversation list +
  thread + composer) AND a click-to-open floating DM overlay (clicking a staff/admin avatar, e.g. on
  the Staff & Roles tab, opens it). Both share the same per-person history (`this.dms` keyed by
  `dmKey(a,b)`), separate from event Comments. Handlers: `openDmWith`, `sendDm`, `dmMsgRows`;
  `chatVals()` + `dmVals()`. Current user = `this.ME` (jh admin / sr=Mike in staff view).
  - **Group chats**: "New group" button — modal to name it (+ uploadable/croppable group icon), tick
    members, OR "Create from event" (auto-adds that event's team + auto-names it; checkboxes sync).
    Groups on `this.groups` ([{id,name,members,messages,photo}]); chatActive uses `g:<id>`. **Edit
    group** button in chat header. Groups only visible to members. `createGroup`/`editGroup`/`sendGroup`.
  - Chat page: **search bar** (Names / In-chats modes) + sidebar split into two scrollable halves
    (Direct Messages top, Groups bottom). Shared **MentionComposer** (`@`-autocomplete, live bold-orange
    tags, paperclip attach → "X mentioned you" notifs). Clicking any staff avatar opens the DM overlay.
  - **Comments tab** (was "Requests"): chat thread, admin Resolve/Re-open, same MentionComposer.
  - Photo avatars via `withPhoto`/`photoStyle` (neutralize `background` shorthand so cover survives).
- **Templates page** (admin nav item): two sections — **Event Templates** (name, priority, event/
  competition type, age, duration days, notes) and **Document Templates** (rich-text doc editor).
  Full CRUD: New, Save, Edit, Duplicate, Delete. Stored on `this.templates.{events,docs}`; editor
  overlay = `tplEditor`, handlers `newEventTemplate`/`newDocTemplate`/`editTemplate`/`duplicateTemplate`/
  `deleteTemplate`/`setTplField`; `templatesVals()` + `tplEditorVals()`.

## Important decisions / conventions (KEEP THESE)
- **Priority colour scheme = medals: Top = GOLD, Mid = SILVER, Low = BRONZE.**
  - Gold has a subtle animated shimmer/ripple (`@keyframes goldGlow`) so it stands out from bronze.
- **Priority indicator on calendar bars** = a **circle dot at the start of the event bar** (matching
  the table-view priority circle), shown only at the event's start (not when it wraps to the next week
  row). Top = glowing gold. When referring to it in copy, call it "the dot at the start".
- **Completion % column** (table view) = **admin only**. Staff never see completion data.
- **Staff column** (table view) = shown to **BOTH admin and staff**. Renders as overlapping
  **avatar icons** (not a number): green ring = confirmed/approved, greyed out = pending. `+N` overflow past 5.
- **Confirmed staff icons**: avatars show on event bars; **green when confirmed/approved, greyed out
  when pending/not yet approved.**
- **Tutorial = STAFF-FACING ONLY.** Copy speaks directly to "you" as a staff member
  (e.g. "your icon will appear here once you're approved for the event"). No admin-only steps.
  - It's a **video-style guided tour**: an animated cursor moves around the page and clicks the
    relevant button, THEN the explainer text box appears. Clicking Next replays the animation for the
    next step.
  - Cursor stays **hidden on slides 1–2**; appears when you hit Next on slide 2 and moves to an event
    to click it. On the **last slide the cursor just disappears** (no animation back to centre).
  - Every one of the 7 event tabs is explained. The Notifications slide actually **opens the
    notifications dropdown**. The Calendar slide explains colour-coding, the priority block, the
    green-when-approved avatar, AND the Calendar/Table toggle.

## Tech notes
- It's a Design Component: edit via `dc_html_str_replace` (template) / `dc_js_str_replace` (logic).
  `str_replace_edit` works too (e.g. for the `data-props` attribute) but won't stream.
- Inline styles only; theme via CSS vars (`--bg`, `--panel`, `--accent`, etc.) that flip on
  `[data-app-theme="light"]`.
- Overlay entrance keyframes must NOT start at `opacity:0` (capture/paused-animation environments
  leave them invisible) — animate transform only.
- Brand assets copied into `assets/` (uww-emblem.svg etc.). DS bundle loaded in `<helmet>`.
