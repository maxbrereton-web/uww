# United World Wrestling — Design System

A brand & UI system for **United World Wrestling (UWW)**, the international governing
body for the sport of wrestling — freestyle, Greco-Roman and women's wrestling — based
in Corsier-sur-Vevey, Switzerland. UWW governs ~184 national federations and runs the
sport's flagship events (World Championships, Continental Championships, Olympic
qualification).

This system packages UWW's brand foundations (colour, type, logos, imagery rules) plus a
reusable React component library and a website UI kit, so agents can produce on-brand
interfaces, slides and prototypes.

## Brand architecture

UWW runs a **parent + endorsed-competition** structure. Each surface has its own palette:

| Brand | Palette | Use |
|-------|---------|-----|
| **Corporate (UWW)** | Oranges + Dark Blue | The federation itself — default theme |
| **World Championship** | Blues | World-level competition (`.theme-world`) |
| **Continental Championship** | Burgundies | Continental competition (`.theme-continental`) |

The shared **wrestler emblem** (orange sunburst / two grappling wrestlers) is the constant;
only its colourway changes per competition. The corporate wordmark endorses each
competition logo (it is never combined into a single composite mark).

## Sources

- **`uploads/STYLE GUIDE.pdf`** — the official UWW Style Guide (35 pp): logo colour system,
  photography guidelines, typography, and two-logo usage rules. This is the single source
  of truth for everything here. Logos in this system were extracted as vectors directly
  from that PDF.
- Public reference: [uww.org](https://uww.org). No product code or Figma was provided — the
  website UI kit is a faithful, brand-derived recreation of a UWW.org-style experience, not
  a pixel copy of the live site.

### ⚠️ Font substitution (needs your input)
The brand print face is **Fedra Sans Condensed** (Typotheque, licensed — not web-embeddable).
The guide's own **web** recommendation is **Open Sans + Open Sans Condensed** (Google Fonts),
which this system uses: one Open Sans variable font supplies both the condensed display face
(width axis 75%) and the regular body face. Trebuchet MS is the digital/email fallback.
**If you have a licensed Fedra Sans Condensed webfont, upload it and we'll wire it in.**

---

## CONTENT FUNDAMENTALS

The guide is visual-first, so tone is derived from its language and the sport itself.

- **Voice:** authoritative, heritage-proud, aspirational. Wrestling is framed as *the oldest
  sport*; events should feel like *"the big event"* with an *"aim high"*, Olympic-scale
  ambition. Brand watchwords from the guide: **AUTHENTIC** and **ICONIC** — *"Be true to the
  spirit of the sport. Use real action images."*
- **Person:** the federation speaks in the **third person / institutional** voice in editorial
  ("United World Wrestling governs…"). Direct **second-person imperatives** are reserved for
  calls to action ("Watch live", "Buy tickets", "Follow athlete").
- **Casing:** display headlines and labels are **UPPERCASE** and condensed; body copy is
  sentence case. Eyebrows/labels are uppercase with wide tracking.
- **Tone of copy:** short, punchy, confident. Favour strong verbs (compete, chase, rise,
  pin) and concrete numbers (184 federations, 3 styles, 700 athletes). Avoid hype filler.
- **Names & data:** athletes shown as `First Last` with a 3-letter **country code** (USA, TUR,
  JPN). Weight classes as `74 kg`; disciplines as Freestyle / Greco-Roman / Women's (or FS /
  GR / WW). Scores and win-types (Decision, Tech. Sup., Fall) are first-class data.
- **Emoji:** never. The wrestler emblem and flags/country codes carry the iconographic load.

Example headline + deck:
> **THE WORLD COMES TO WRESTLE**
> Ten days. Three styles. 700 athletes from 95 nations chasing gold on the sport's biggest stage.

---

## VISUAL FOUNDATIONS

**Colour.** Corporate runs on **orange `#F58220`** (Pantone 158C, primary identity) against
**dark blue `#04003F`** (Pantone 2757C, ink). A family of oranges (`#F7941E → #ED1C24`) gives
energy; warm **stone greys** (`#9F9D83`, `#D7D6C4`) and a cool navy-tinted neutral ramp carry
UI. Action fills use the deeper orange `#F15A22` so white labels clear AA-large. Competition
themes swap the primary to blues or burgundies via `.theme-world` / `.theme-continental`.

**Type.** Condensed, athletic, uppercase display (Open Sans @ `font-stretch:75%`, weight 800)
for every headline, label, stat and button; regular-width Open Sans for body. Headlines run
tight (`line-height ~.9`, slightly negative tracking); eyebrows are uppercase with `.14em`
tracking. Stats and scores reuse the condensed face at large sizes.

**Backgrounds.** Per-brand, not flat: the corporate background is a **navy→orange blend**;
World Championship is a **radial navy→light-blue**; Continental a **burgundy radial**. These
are the `--gradient-*` tokens. Hero/media areas darken toward navy at the foot so foreground
type and (real) athlete photography read.

**Imagery.** Per the guide: **darken the background, light the wrestler.** Recipe — saturation
−50, contrast +100, mask the subject and drop background luminosity; real action only, never
staged WWE-style poses; aspire to the Olympic "big event" feel. The kit ships a treated
`PhotoPanel` placeholder (navy gradient + subject spotlight + ghosted emblem) that should be
swapped for real photography in production.

**Motion.** Restrained and purposeful: ~120–360ms with an ease-out curve. Tabs slide an
orange underline; the **Live** badge pulses (respects `prefers-reduced-motion`); cards lift
−3px on hover. No bouncy or decorative looping motion on content.

**States.** Hover = darken fill / strengthen border; press = `translateY(1px)`; focus = a 3px
orange focus ring (`--focus-ring`). Disabled drops opacity to ~0.45.

**Borders, radii, shadows.** Hairline `#E0E3EB` borders; **2px** on form controls; **3px**
orange accents (tab underline, card top bar, input focus). Corners are **sharp** by default
(`4–10px`) for an athletic feel, with a **pill** option for sporty CTAs. Shadows are
**navy-tinted** (`rgba(4,0,63,…)`), soft and low — never grey or harsh.

**Cards.** White surface, `10px` radius, hairline border + soft navy shadow, optional 16:9
media slot and a 4px orange accent bar. A dark **`ink`** variant exists for navy sections.

**Layout.** Centered max-width ~1180px with 28px gutters; sticky navy header; generous
section padding (~56–80px). 4px spacing grid throughout.

---

## ICONOGRAPHY

The style guide defines **no icon system** — its only proprietary glyph is the **wrestler
emblem** (the sunburst + two grappling wrestlers), which is the hero brand mark and should be
used for watermarks, favicons and section accents (`assets/uww-emblem.svg`).

- **UI icons:** the kit uses a **Lucide-style thin-stroke (1.75–2px) line set**, drawn inline
  as SVG in `ui_kits/website/icons.jsx`. ⚠️ *This is a substitution* — UWW has no published
  icon library; a comparable thin-line set is the closest match to the brand's clean, modern
  digital tone. Swap for Lucide via CDN or a licensed set in production if preferred.
- **Country identity:** 3-letter **country codes** (and national flags in production) act as
  athlete iconography rather than decorative icons.
- **Medals:** represented as solid colour discs (gold `#F7941E`, silver `#9AA0B2`, bronze
  `#B0490C`) and avatar rings, not emoji or clip-art.
- **Emoji / unicode icons:** never used.

---

## Index / manifest

```
styles.css                  → global entry (consumers link this); @import list only
tokens/
  fonts.css                 → Open Sans (Google Fonts, variable wght/wdth/ital)
  colors.css                → brand + neutral + event palettes, semantic aliases
  typography.css            → families, scale, weights, tracking, helper classes
  spacing.css               → 4px grid, containers, gutters
  effects.css               → radii, borders, shadows, gradients, motion, z-index
  base.css                  → element resets + .theme-world / .theme-continental scopes
assets/
  uww-logo-lockup.svg       → primary vertical lockup (emblem + wordmark)
  uww-emblem.svg            → corporate emblem (circle only)
  uww-emblem-world.{svg,png}        → World Championship emblem (blue)
  uww-emblem-continental.{svg,png}  → Continental Championship emblem (burgundy)
components/
  buttons/   → Button, IconButton
  forms/     → Input, Select, Checkbox, Radio, Switch
  display/   → Badge, Tag, Avatar, Card, Stat
  navigation/→ Tabs
guidelines/foundations/      → Design System tab specimen cards (Colors/Type/Spacing/Brand)
ui_kits/website/             → interactive UWW.org-style kit (Home · Event · Athlete)
SKILL.md                     → Agent Skill manifest (for Claude Code)
```

**Components** (import from `window.UnitedWorldWrestlingDesignSystem_0e32df`): Button,
IconButton, Input, Select, Checkbox, Radio, Switch, Badge, Tag, Avatar, Card, Stat, Tabs.
Each ships a `.d.ts` (props) and `.prompt.md` (usage).

**UI kit:** `ui_kits/website/index.html` — a click-through with a global navy header, a Home
page (hero, live match strip, news grid, stat band), an Event/Results page (World-blue
themed, tabbed, weight-class filters, results table) and an Athlete profile (stat band, medal
history). See `ui_kits/website/README.md`.
