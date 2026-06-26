---
version: alpha
name: Ayming Brand Design System
description: >
  Canonical design system for all Ayming-built surfaces (HR offer slide decks,
  internal documents, web apps). Source of truth for colors, typography, spacing,
  and brand rules. Any AI agent or person building an Ayming surface must follow this.
colors:
  blue-primary: "#11a9e6"      # main brand blue, primary actions, links, accents
  blue-accent: "#0da4e8"       # hover/secondary blue, near-primary
  blue-dark: "#00456d"         # deep navy, headings on light, high-emphasis text
  gradient-blue-start: "#0fa7e2"   # left stop of the brand gradient
  gradient-green-end: "#0ab38c"    # right stop of the brand gradient
  text-dark: "#0f172a"         # default body text
  text-gray: "#6b7280"         # secondary text, intros, captions
  text-light: "#9ca3af"        # tertiary text, footnotes, disabled
  bg-white: "#ffffff"          # default surface
  bg-light: "#f8fafc"          # page background, nav rail, subtle panels
  bg-subtle: "#eef2f6"         # borders, dividers, hairlines
  overlay-blue-soft: "rgba(17,169,230,0.10)"  # tinted fills behind icons/badges
gradients:
  brand-horizontal: "linear-gradient(90deg, #0fa7e2, #0ab38c)"  # blue->green, the signature mark
typography:
  font-family-base: "'Lato', sans-serif"
  font-family-quote: "Georgia, serif"      # decorative quotation marks only
  weights: [300, 400, 500, 600, 700]
  cover-title:   { size: "52px", weight: 700, family: base }
  slide-title:   { size: "44px", weight: 700, family: base }
  section-head:  { size: "36px", weight: 700, family: base }
  stat-number:   { size: "48px", weight: 700, family: base }
  lead:          { size: "17px", weight: 400, lineHeight: 1.6, family: base, color: text-gray }
  body:          { size: "15px", weight: 400, lineHeight: 1.55, family: base, color: text-dark }
  label:         { size: "13px", weight: 600, family: base }
  micro:         { size: "11px", weight: 700, family: base, transform: uppercase, tracking: "0.5px" }
rounded:
  hairline: "1px"     # progress bars, fine rules
  md: "8px"           # small chips, inputs
  lg: "12px"          # cards, callouts
  xl: "16px"          # large cards
  2xl: "20px"         # feature panels, hero cards
  pill: "9999px"
  circle: "50%"       # step numbers, avatars, icon badges
spacing:
  scale: [4, 6, 8, 12, 16, 18, 22, 26, 34, 42, 52]   # px steps used across decks
  nav-width: "260px"
  nav-collapsed: "20px"
  banner-h: "46px"
shadows:
  sm: "0 1px 3px rgba(0,0,0,0.06)"
  md: "0 4px 12px rgba(0,0,0,0.08)"
  lg: "0 10px 40px rgba(0,0,0,0.10)"
components:
  card:
    backgroundColor: "{colors.bg-white}"
    rounded: "{rounded.xl}"
    border: "1px solid {colors.bg-subtle}"
    elevation: "{shadows.md}"
  card-hover:
    elevation: "{shadows.lg}"
  badge-icon:
    backgroundColor: "{colors.overlay-blue-soft}"
    textColor: "{colors.blue-primary}"
    rounded: "{rounded.circle}"
  step-number:
    background: "{gradients.brand-horizontal}"
    textColor: "#ffffff"
    rounded: "{rounded.circle}"
    typography: { size: "21px", weight: 700 }
  sector-header:
    background: "{gradients.brand-horizontal}"
    textColor: "#ffffff"
    typography: "{typography.micro}"
---

# Ayming Brand Design System

This file is the single source of truth for how anything we build looks. The slide-deck
engine (`slides.css` in the `ayming-france/assets` repo) is the reference implementation;
its CSS custom properties are mirrored verbatim in the front matter above. When building a
new surface (a web app, a document, a dashboard), reuse these tokens rather than inventing
new ones. When the engine and this file disagree, the engine wins and this file should be
updated to match it.

## Overview

Ayming is a French HR/social-charges consultancy. The brand reads **clear, institutional,
and reassuring**: never flashy, never playful. Surfaces are mostly **white and airy** with
generous whitespace; color is used sparingly as accent, not as fill. The one signature
visual is the **horizontal blue-to-green gradient** (`#0fa7e2 -> #0ab38c`), reserved for
high-emphasis moments (step numbers, section markers, key stats), not spread across whole
screens. Density is low: one idea per panel, lots of breathing room, restrained type scale.
Tone of voice is professional and compliant (see the legal vocabulary rules in Don'ts).

## Colors

Use semantic roles, not raw hex, when you can:

| Role | Token | Hex |
|------|-------|-----|
| Primary brand | `blue-primary` | `#11a9e6` |
| Primary hover | `blue-accent` | `#0da4e8` |
| Deep headings | `blue-dark` | `#00456d` |
| Signature gradient | `brand-horizontal` | `#0fa7e2 -> #0ab38c` |
| Body text | `text-dark` | `#0f172a` |
| Secondary text | `text-gray` | `#6b7280` |
| Tertiary text | `text-light` | `#9ca3af` |
| Default surface | `bg-white` | `#ffffff` |
| Page / panel bg | `bg-light` | `#f8fafc` |
| Borders / dividers | `bg-subtle` | `#eef2f6` |
| Soft icon fill | `overlay-blue-soft` | `rgba(17,169,230,0.10)` |

Rules: blue is the only chromatic accent; green appears **only** as the right end of the
gradient, never as a standalone fill or text color. There is no red/amber/purple in the
brand. Error/warning states (in app contexts) should use neutral grays plus iconography
rather than introducing new hues, unless a genuine functional need arises.

## Typography

- **One font: Lato** (Google Fonts, weights 300/400/500/600/700). Georgia serif is allowed
  **only** for decorative quotation marks around testimonials, never for running text.
- Hierarchy is carried by **size and weight**, not by switching families or colors.
- Weight vocabulary: 700 for titles/numbers/labels-of-emphasis, 600 for sub-labels and
  card headings, 500 for de-emphasized labels, 400 for body and intros, 300 for large
  light display numbers.
- Type scale (px): cover title 52 / slide title 44 / section head 36 / stat number 48 /
  lead 17 / body 15 / label 13 / micro 11. Line-height 1.55–1.6 for prose.
- Micro labels (11px) are uppercase with `0.5px` letter-spacing; body text is never
  uppercased.

## Layout

- Slides are a fixed **16:9 stage**; the deck has a 260px left chapter-nav that collapses
  to 20px, and an optional 46px top banner.
- Spacing follows the step scale `4 / 6 / 8 / 12 / 16 / 18 / 22 / 26 / 34 / 42 / 52` px.
  Prefer these values over arbitrary numbers.
- Center the title and intro of a panel if you like, but **content lists are always
  left-aligned** (see Don'ts). Constrain prose blocks with a `max-width` (typically
  900–940px) and `margin: 0 auto` rather than letting lines run full-bleed.
- One concept per panel. If a slide needs more than ~6 bullets or two stacked cards,
  split it.

## Elevation & Depth

Three-step shadow system only. Do not invent new shadows:

| Token | Value | Use |
|-------|-------|-----|
| `shadows.sm` | `0 1px 3px rgba(0,0,0,0.06)` | hairline lift, chips |
| `shadows.md` | `0 4px 12px rgba(0,0,0,0.08)` | cards at rest |
| `shadows.lg` | `0 10px 40px rgba(0,0,0,0.10)` | cards on hover, modals, hero panels |

Depth is conveyed primarily by **borders (`1px solid bg-subtle`) and soft shadows**, never
by heavy drop shadows or dark overlays.

## Shapes

Rounding scale: `8` (chips/inputs) / `12` (cards, callouts) / `16` (large cards) /
`18–20` (feature/hero panels) / `50%` (step numbers, avatars, icon badges) / `1px`
(progress bars). Corners are consistently soft; nothing is fully square except hairlines.

## Components

- **Card:** white surface, `1px solid bg-subtle` border, 16–20px radius, `shadows.md` at
  rest, `shadows.lg` on hover. Borders define cards, not shadows alone.
- **Icon badge:** circular, `overlay-blue-soft` fill, `blue-primary` icon (Lucide library,
  vendored at `engine/lucide.min.js`, never reference unpkg).
- **Step number:** circular, brand gradient fill, white 700-weight number, `shadows.md`,
  4px white ring.
- **Sector / section header chip:** brand gradient background, white uppercase micro label.
- **Stat:** large 700-weight (or 300-weight light) number in `blue-dark` or `blue-primary`
  with a 13px `text-gray` caption beneath.
- All interactive elements get a hover state (usually shadow step-up or `blue-primary ->
  blue-accent`); transitions are short and eased, never bouncy.

## Do's and Don'ts

**Do**
- Reuse the tokens above; pull from `slides.css` custom properties when building decks.
- Keep surfaces white and airy; use the gradient as a rare accent.
- Carry hierarchy with Lato size/weight.
- Write visible French text with **full, correct accents** (é è ê ë à â ù û ô î ï ç) in
  headings, paragraphs, labels, alt text, YAML values. Never on code identifiers or URLs.
- Keep multi-word brand names intact with `&nbsp;` (ABO&nbsp;DAT, Exter&nbsp;DAT,
  ABO&nbsp;ABSENCE, Ayming&nbsp;Collect, IJ&nbsp;Rec, IJ&nbsp;Safe, MyAcci+).
- Use Lucide icons from the vendored library.

**Don't**
- **Don't center content lists.** `ul`, `ol`, `li` are always `text-align: left`, even
  inside a centered card or slide. Centered bullets create ugly ragged wraps.
- **Don't use the em dash** (the long horizontal dash) anywhere in generated text (HTML,
  markdown, YAML). Rewrite with a period, comma, colon, or restructure.
- **Don't hardcode `<br>` inside titles/headings** (`.slide-title`, `h1`, `h2`). Let text
  wrap naturally. Exception: short `.cover-title` deliberate splits.
- **Don't introduce new fonts.** No Inter, no Roboto, no system-ui for content. Lato only
  (Georgia for quote marks only).
- **Don't introduce new colors or gradients** (no purple, no AI-default blue-violet). Green
  only as the gradient's right stop.
- **Don't use heavy/dark drop shadows, neon glows, or bounce/elastic easing.**
- **Don't nest cards inside cards** or stack more than two CTAs.
- **Don't full-bleed long prose.** Constrain with `max-width`.
- **Don't use forbidden legal vocabulary** in client-facing copy: never "garantir/garantie",
  "100%", "zéro risque", "conformité légale", "optimisation" (use "maîtrise"; exception:
  Charges Sociales), "assistance" (use "accompagnement"), "audit" for paie/IJ (use
  "diagnostic"), "défense des intérêts", "recours" (use "démarches"). Lawyers are always
  "cabinet d'avocats indépendants, choisi d'un commun accord". Full list in
  `legal-vocabulary-guide.md`.

## Agent Prompt Guide

Quick reference to paste when prompting a tool:

> Brand: Ayming. Font: Lato only (Georgia for quote marks). Palette: blue `#11a9e6`,
> deep navy `#00456d`, signature gradient `#0fa7e2 -> #0ab38c` used sparingly. Surfaces
> white/airy. Cards = white + `1px #eef2f6` border + soft shadow (`0 4px 12px rgba(0,0,0,.08)`).
> Soft corners (12–20px). No em dashes, no new fonts/colors, no centered bullet lists,
> no `<br>` in titles. French text fully accented. Respect Ayming legal vocabulary.
