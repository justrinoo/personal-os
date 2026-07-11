---
name: FitFlow
colors:
  primary: "#FFD147"
  primary-deep: "#E0AD20"
  secondary: "#222327"
  background: "#EBE9E4"
  background-canvas: "#F0EEE9"
  background-bone: "#F5F3EF"
  surface: "#F8F7F4"
  surface-card: "#FFFFFF"
  surface-dark: "#DCD4C6"
  surface-deep: "#222327"
  foreground: "#1A1D20"
  ink: "#1A1D20"
  body: "#1A1D20"
  charcoal: "#2D2F33"
  mute: "#6e7073"
  ash: "#5A5C60"
  stone: "#6e7073"
  on-primary: "#1A1D20"
  on-secondary: "#FFFFFF"
  on-background: "#1A1D20"
  on-surface: "#1A1D20"
  on-dark: "#FCFCFC"
  on-dark-mute: "rgba(252,252,252,0.72)"
  hairline: "#EFEDE8"
  hairline-strong: "#C9C6BE"
  divider: "#E5E2DC"
  divider-dark: "#C9C6BE"
  hero-warm: "#FFD147"
  hero-glow: "#FFB347"
  hero-pink: "#FF8A7A"
  badge-success: "#22C55E"
  badge-warning: "#F59E0B"
  badge-info: "#3B82F6"
  link: "#7A6320"
  ring-focus: "rgba(255,209,71,0.5)"
colors-dark:
  primary: "#FFD147"
  primary-deep: "#FFD147"
  secondary: "#D4D4D8"
  background: "#121212"
  background-canvas: "#181818"
  background-bone: "#1E1E1E"
  surface: "#1E1E1E"
  surface-card: "#2A2A2A"
  surface-dark: "#3E3A33"
  surface-deep: "#1A1A1E"
  foreground: "#E4E4E7"
  ink: "#E4E4E7"
  body: "#D4D4D8"
  charcoal: "#A1A1AA"
  mute: "#909097"
  ash: "#909097"
  stone: "#909096"
  on-primary: "#1A1D20"
  on-secondary: "#1A1D20"
  on-background: "#E4E4E7"
  on-surface: "#E4E4E7"
  on-dark: "#FCFCFC"
  on-dark-mute: "rgba(252,252,252,0.72)"
  hairline: "#2A2A2A"
  hairline-strong: "#555555"
  divider: "#333333"
  divider-dark: "#444444"
  hero-warm: "#FFD147"
  hero-glow: "#FFB347"
  hero-pink: "#FF8A7A"
  badge-success: "#22C55E"
  badge-warning: "#F59E0B"
  badge-info: "#3B82F6"
  link: "#FFE070"
  ring-focus: "rgba(255,209,71,0.5)"
typography:
  display-xxl:
    fontFamily: "Inter, sans-serif"
    fontSize: "128px"
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: "-3px"
  display-xl:
    fontFamily: "Inter, sans-serif"
    fontSize: "72px"
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: "-1.8px"
  display-lg:
    fontFamily: "Inter, sans-serif"
    fontSize: "48px"
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: "-1px"
  display-md:
    fontFamily: "Inter, sans-serif"
    fontSize: "30px"
    fontWeight: 600
    lineHeight: 1.25
    letterSpacing: "-0.5px"
  heading-lg:
    fontFamily: "Inter, sans-serif"
    fontSize: "36px"
    fontWeight: 600
    lineHeight: 1.1
    letterSpacing: "-0.5px"
  heading-md:
    fontFamily: "Inter, sans-serif"
    fontSize: "24px"
    fontWeight: 600
    lineHeight: 1.25
    letterSpacing: "-0.025em"
  heading-sm:
    fontFamily: "Inter, sans-serif"
    fontSize: "20px"
    fontWeight: 600
    lineHeight: 1.25
    letterSpacing: "-0.025em"
  subtitle:
    fontFamily: "Inter, sans-serif"
    fontSize: "18px"
    fontWeight: 600
    lineHeight: 1.56
    letterSpacing: "normal"
  body-lg:
    fontFamily: "Inter, sans-serif"
    fontSize: "18px"
    fontWeight: 400
    lineHeight: 1.56
    letterSpacing: "normal"
  body-md:
    fontFamily: "Inter, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.625
    letterSpacing: "normal"
  body-sm:
    fontFamily: "Inter, sans-serif"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: 1.625
    letterSpacing: "normal"
  button-md:
    fontFamily: "Inter, sans-serif"
    fontSize: "16px"
    fontWeight: 600
    lineHeight: 1.5
    letterSpacing: "normal"
  button-sm:
    fontFamily: "Inter, sans-serif"
    fontSize: "14px"
    fontWeight: 600
    lineHeight: 1.5
    letterSpacing: "normal"
  caption:
    fontFamily: "Inter, sans-serif"
    fontSize: "12px"
    fontWeight: 400
    lineHeight: 1.25
    letterSpacing: "normal"
  code-md:
    fontFamily: "JetBrains Mono, monospace"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: 1.625
    letterSpacing: "normal"
  code-sm:
    fontFamily: "JetBrains Mono, monospace"
    fontSize: "12px"
    fontWeight: 400
    lineHeight: 1.625
    letterSpacing: "normal"
spacing:
  xxs: "2px"
  xs: "4px"
  sm: "8px"
  md: "12px"
  lg: "16px"
  xl: "24px"
  xxl: "32px"
  xxxl: "48px"
  section: "96px"
  band: "160px"
rounded:
  none: "0"
  xs: "4px"
  sm: "8px"
  md: "12px"
  lg: "16px"
  full: "9999px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.button-md}"
    rounded: "{rounded.sm}"
    padding: "12px 24px"
    height: "44px"
  button-secondary:
    backgroundColor: "{colors.surface-card}"
    textColor: "{colors.ink}"
    typography: "{typography.button-md}"
    rounded: "{rounded.sm}"
    padding: "12px 24px"
    height: "44px"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.button-md}"
    rounded: "{rounded.sm}"
    padding: "12px 24px"
    height: "44px"
  text-input:
    backgroundColor: "{colors.surface-card}"
    textColor: "{colors.ink}"
    typography: "{typography.body-md}"
    rounded: "{rounded.sm}"
    padding: "12px 20px"
    height: "44px"
  checkbox:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.body-md}"
    rounded: "{rounded.xs}"
    padding: "0"
    height: "20px"
  radio:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.body-md}"
    rounded: "{rounded.full}"
    padding: "0"
    height: "20px"
  switch:
    backgroundColor: "{colors.surface-dark}"
    textColor: "{colors.on-dark}"
    typography: "{typography.caption}"
    rounded: "{rounded.full}"
    padding: "2px"
    height: "24px"
  badge:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.caption}"
    rounded: "{rounded.full}"
    padding: "2px 8px"
    height: "20px"
  card:
    backgroundColor: "{colors.surface-card}"
    textColor: "{colors.ink}"
    typography: "{typography.body-md}"
    rounded: "{rounded.md}"
    padding: "24px"
    height: "auto"
  accordion:
    backgroundColor: "{colors.surface-card}"
    textColor: "{colors.ink}"
    typography: "{typography.body-md}"
    rounded: "{rounded.md}"
    padding: "16px"
    height: "auto"
  table:
    backgroundColor: "{colors.surface-card}"
    textColor: "{colors.ink}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.sm}"
    padding: "12px"
    height: "auto"
  progress:
    backgroundColor: "{colors.surface-dark}"
    textColor: "{colors.primary}"
    typography: "{typography.caption}"
    rounded: "{rounded.full}"
    padding: "0"
    height: "8px"
  alert:
    backgroundColor: "{colors.surface-card}"
    textColor: "{colors.ink}"
    typography: "{typography.body-md}"
    rounded: "{rounded.md}"
    padding: "16px"
    height: "auto"
  tooltip:
    backgroundColor: "{colors.surface-deep}"
    textColor: "{colors.on-dark}"
    typography: "{typography.caption}"
    rounded: "{rounded.sm}"
    padding: "4px 8px"
    height: "auto"
  navbar:
    backgroundColor: "{colors.background-canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.button-sm}"
    rounded: "{rounded.none}"
    padding: "0 24px"
    height: "60px"
  dropdown:
    backgroundColor: "{colors.surface-card}"
    textColor: "{colors.ink}"
    typography: "{typography.body-md}"
    rounded: "{rounded.sm}"
    padding: "4px"
    height: "auto"
  tabs:
    backgroundColor: "transparent"
    textColor: "{colors.mute}"
    typography: "{typography.button-md}"
    rounded: "{rounded.none}"
    padding: "8px 16px"
    height: "40px"
  modal:
    backgroundColor: "{colors.surface-card}"
    textColor: "{colors.ink}"
    typography: "{typography.heading-md}"
    rounded: "{rounded.lg}"
    padding: "32px"
    height: "auto"
---

# FitFlow — Design System

## Overview

FitFlow is an energetic health and fitness dashboard system built for movement — literally and visually. The brand personality channels the feeling of a golden-hour outdoor workout: warm, alive, and driven. Where sterile fitness apps feel clinical, FitFlow wraps data in warmth. Where loud dashboards overwhelm, FitFlow channels energy into purposeful clarity.

The system is anchored by a vibrant gold accent ({colors.primary}) against warm beige backgrounds ({colors.background}) that evoke natural textures — sunlit earth, warm wood, morning light. This isn't a cold dark gym; it's the outdoors at golden hour. The interface should make users *want* to move, to track, to improve. Every visual decision — from the generous rounded corners ({rounded.md}) to the expansive section spacing ({spacing.section}) — reinforces a sense of open-air possibility.

FitFlow speaks in a warm, encouraging voice. The UI never scolds. It celebrates progress with the golden glow of a setting sun.

---

## Colors

### Brand & Accent

The brand heart beats through {colors.primary} — a warm gold-yellow that reads like positive energy, achievement, and natural light. Unlike aggressive reds or clinical blues common in fitness, this yellow-gold feels approachable and motivational. It appears on primary actions, key data highlights, hero gradients, and the badge system.

| Token | Value | Role |
|-------|-------|------|
| {colors.primary} | `#FFD147` | Brand anchor, primary CTAs |
| {colors.primary-deep} | `#E0AD20` | Pressed state, active interaction |
| {colors.hero-warm} | `#FFD147` | Hero gradient start |
| {colors.hero-glow} | `#FFB347` | Hero gradient mid-point |
| {colors.hero-pink} | `#FF8A7A` | Hero gradient end |

The hero gradient ({colors.hero-warm} → {colors.hero-glow} → {colors.hero-pink}) creates a sunburst transition from gold through warm orange to coral pink — an energetic sweep that can backdrop dashboards, onboarding screens, or achievement celebrations.

A dark secondary ({colors.secondary}) provides grounding contrast for text-heavy regions, dividers, and UI chrome that needs to recede.

### Surface

The surface system uses warm beige neutrals instead of pure whites or cold grays. This warmth is FitFlow's signature — it makes long dashboard sessions feel comfortable rather than sterile.

| Token | Light Mode | Dark Mode | Usage |
|-------|-----------|-----------|-------|
| {colors.background} | `#EBE9E4` | `#121212` | Page canvas |
| {colors.background-canvas} | `#F0EEE9` | `#181818` | Lifted page canvas |
| {colors.background-bone} | `#F5F3EF` | `#1E1E1E` | Inset card groups |
| {colors.surface} | `#F8F7F4` | `#1E1E1E` | Default surface |
| {colors.surface-card} | `#FFFFFF` | `#2A2A2A` | Card white (light) / dark card (dark) |
| {colors.surface-dark} | `#DCD4C6` | `#3E3A33` | Track backgrounds, switches |
| {colors.surface-deep} | `#222327` | `#1A1A1E` | Tooltips, footer, highest contrast |

In dark mode, the beige warmth carries through: surfaces shift to warm dark grays (`#1E1E1E`, `#2A2A2A`) rather than cold pure black (`#000000`). The dark canvas (`#121212`) is a warm near-black. This is the "Warm Inversion Principle" — invert the luminance, keep the warmth.

### Text

Text hierarchy spans from the highest-contrast ink to the faintest stone:

| Token | Value | Usage |
|-------|-------|-------|
| {colors.ink} | `#1A1D20` | Primary headings, emphasis |
| {colors.body} | `#1A1D20` | Body copy, paragraphs |
| {colors.charcoal} | `#2D2F33` | Secondary headings, metadata |
| {colors.ash} | `#5A5C60` | Captions, tertiary info |
| {colors.mute} | `#6e7073` | Placeholder text |
| {colors.stone} | `#6e7073` | Disabled foreground |

On primary backgrounds, {colors.on-primary} (`#1A1D20`) provides high-contrast text against the gold. On dark surfaces (tooltips, dark headers), {colors.on-dark} (`#FCFCFC`) ensures readability with a warm off-white. For secondary text on dark, {colors.on-dark-mute} (`rgba(252,252,252,0.72)`) offers reduced prominence.

### Semantic

| Token | Value | Usage |
|-------|-------|-------|
| {colors.badge-success} | `#22C55E` | Achievements, completed goals, green metrics |
| {colors.badge-warning} | `#F59E0B` | Approaching limits, mid-range stats |
| {colors.badge-info} | `#3B82F6` | Informational tips, new features |
| {colors.link} | `#7A6320` / dark `#FFE070` | Inline links, "Learn more" |
| {colors.ring-focus} | `rgba(255,209,71,0.5)` | Focus rings on interactive elements |

### Dark Mode Comparison

| Token | Light | Dark |
|-------|-------|------|
| {colors.primary} | `#FFD147` | `#FFD147` |
| {colors.background} | `#EBE9E4` | `#121212` |
| {colors.surface} | `#F8F7F4` | `#1E1E1E` |
| {colors.surface-card} | `#FFFFFF` | `#2A2A2A` |
| {colors.ink} | `#1A1D20` | `#E4E4E7` |
| {colors.body} | `#1A1D20` | `#D4D4D8` |
| {colors.mute} | `#6e7073` | `#909097` |
| {colors.hairline} | `#EFEDE8` | `#2A2A2A` |
| {colors.divider} | `#E5E2DC` | `#333333` |
| {colors.link} | `#7A6320` | `#FFE070` |

The primary gold remains identical across both modes — brand consistency is paramount. Borders and dividers darken proportionally while the rest of the palette inverts.

---

## Typography

### Font Family

FitFlow uses **Inter** for both display and body roles — a single-family approach that creates a clean, cohesive rhythm. Inter's generous x-height and open apertures make it exceptionally readable in fitness dashboard contexts where data is often scanned quickly during movement. The tall lowercase keeps metric numbers and short labels crisp at small sizes.

| Role | Stack |
|------|-------|
| Display (headlines) | `Inter, sans-serif` |
| Body (text, UI) | `Inter, sans-serif` |
| Monospace (code, data) | `JetBrains Mono, monospace` |

**Font substitutes**: When Inter is unavailable, fall back to system `sans-serif`. The weight range (400–700) is deliberately narrower than Inter's full spectrum — no thin weights appear in the system. This prevents the washed-out look that ultra-light text creates on warm beige backgrounds.

**JetBrains Mono** handles all code blocks, raw metric data, and tabular figures. Its ligature support and clear punctuation make reading workout data (timestamps, split times, calorie counts) more precise.

### Hierarchy

| Token | Font Family | Size | Weight | Line Height | Letter Spacing | Use |
|-------|-----------|------|--------|-------------|---------------|-----|
| {typography.display-xxl} | Inter | 128px | 700 | 1.1 | -3px | Hero headline (one per page) |
| {typography.display-xl} | Inter | 72px | 700 | 1.1 | -1.8px | Section openers, welcome screens |
| {typography.display-lg} | Inter | 48px | 700 | 1.1 | -1px | Sub-section titles, metric hero |
| {typography.display-md} | Inter | 30px | 600 | 1.25 | -0.5px | Feature card titles, achievement callouts |
| {typography.heading-lg} | Inter | 36px | 600 | 1.1 | -0.5px | Section headings |
| {typography.heading-md} | Inter | 24px | 600 | 1.25 | -0.025em | Card titles, modal headers |
| {typography.heading-sm} | Inter | 20px | 600 | 1.25 | -0.025em | List headers, stats labels |
| {typography.subtitle} | Inter | 18px | 600 | 1.56 | normal | Lead paragraphs, intro copy |
| {typography.body-lg} | Inter | 18px | 400 | 1.56 | normal | Marketing prose, feature descriptions |
| {typography.body-md} | Inter | 16px | 400 | 1.625 | normal | Default body, dashboard copy |
| {typography.body-sm} | Inter | 14px | 400 | 1.625 | normal | Captions, metadata, timestamps |
| {typography.button-md} | Inter | 16px | 600 | 1.5 | normal | Default button label |
| {typography.button-sm} | Inter | 14px | 600 | 1.5 | normal | Compact button, tab labels |
| {typography.caption} | Inter | 12px | 400 | 1.25 | normal | Footer, copyright, legal |
| {typography.code-md} | JetBrains Mono | 14px | 400 | 1.625 | normal | Code blocks, API responses |
| {typography.code-sm} | JetBrains Mono | 12px | 400 | 1.625 | normal | Inline code, data tables |

### Principles

- **The Golden Hour Rule**: Display sizes (xxl through md) use Inter with negative letter-spacing to create tight, energetic headlines that feel confident and dynamic — like motion in typography.
- **Weight Discipline**: Headlines use 700 (bold), card titles use 600 (semibold), and body text uses 400 (regular). No weights below 400 appear in the system.
- **Relaxed Body Reading**: Body text uses `lineHeight: 1.625` for generous breathing room, making long-form health content (workout descriptions, nutrition notes) comfortable to read.

### Note on Font Substitutes

If Inter fails to load, the system degrades to `sans-serif` (the OS default). The 400–700 weight range may not map identically to system fonts — test visually. For JetBrains Mono, the fallback is `monospace`. When the mono font is unavailable, data tables and code blocks retain monospaced alignment but may lack ligature support.

---

## Layout & Spacing

### Semantic Spacing Scale

The spacing system follows a base-4 grid (4px increments) mapped to semantic tokens:

| Token | Value | Usage |
|-------|-------|-------|
| {spacing.xxs} | 2px | Hairline gaps, icon spacing |
| {spacing.xs} | 4px | Micro spacing between inline elements |
| {spacing.sm} | 8px | Tight spacing between related items |
| {spacing.md} | 12px | Default spacing, button padding |
| {spacing.lg} | 16px | Card insets, input padding |
| {spacing.xl} | 24px | Card padding, section internal margin |
| {spacing.xxl} | 32px | Between grouped sections |
| {spacing.xxxl} | 48px | Between major features |
| {spacing.section} | 96px | Between page sections |
| {spacing.band} | 160px | Maximum separation, hero bands |

### Grid Model

FitFlow uses a 12-column fluid grid with a 24px gutter ({spacing.xl}). Column widths are defined as fractions of the container width.

- **Container max-width**: 1280px (dashboard), 1440px (marketing)
- **Gutter**: 24px between columns
- **Margin**: 24px on each side (mobile: 16px)
- **Breakpoints**: See Responsive Behavior section

### Whitespace Philosophy

FitFlow is deliberately spacious. The principle: "Fitness data deserves room to breathe." A dashboard showing steps, heart rate, and calories should not feel cramped. Key metrics get generous padding ({spacing.xl}) and section gaps ({spacing.section}) to create visual pauses between data groups. Dense data displays (tables, progress history) use tight spacing ({spacing.sm}) internally but are wrapped in spacious containers.

The {spacing.band} token (160px) is reserved for hero areas and full-bleed brand moments — the "big sky" spaces that communicate openness and possibility.

---

## Elevation & Depth

### Level Table

FitFlow uses a pure shadow-based elevation system (no border-based depth). Shadows use warm-black rgba with low opacity for natural, soft depth.

| Level | Light Treatment | Dark Treatment | Use Case |
|-------|----------------|---------------|----------|
| {elevation.level0} | `none` | `none` | Page background, flat surfaces |
| {elevation.level1} | `0 1px 3px rgba(0,0,0,0.08)` | `0 1px 3px rgba(0,0,0,0.3)` | Default card shadow, subtle separation |
| {elevation.level2} | `0 4px 12px rgba(0,0,0,0.1)` | `0 4px 12px rgba(0,0,0,0.4)` | Card hover, elevated panels |
| {elevation.level3} | `0 8px 24px rgba(0,0,0,0.15)` | `0 8px 24px rgba(0,0,0,0.5)` | Modal dialogs, dropdown menus |
| {elevation.level4} | `0 12px 32px rgba(0,0,0,0.2)` | `0 12px 32px rgba(0,0,0,0.6)` | Floating action elements, toasts |
| {elevation.level5} | `0 24px 48px rgba(0,0,0,0.25)` | `0 24px 48px rgba(0,0,0,0.7)` | Promotional overlays, celebration animations |

The progression is intentionally gradual — each level doubles roughly in y-offset and adds 0.05 to alpha. This creates a natural-feeling lift curve: cards float, modals hover, celebrations soar.

### Decorative Depth

Beyond the elevation levels, FitFlow uses atmospheric gradient meshes in hero sections:

- **Hero gradient band**: A three-stop gradient from {colors.hero-warm} through {colors.hero-glow} to {colors.hero-pink}, applied as a full-width decorative backdrop behind the primary headline area. This creates the "golden-hour sky" effect without relying on shadow depth.
- **Dark overlay band**: In dark mode, hero sections may use a subtle radial gradient from `rgba(255,209,71,0.08)` at center to `transparent` at edges, adding warm ambient light without breaking the dark canvas.

These decorative treatments exist *above* the elevation system — they're atmospheric, not structural.

---

## Shapes

### Border Radius Scale

The shape language is intentionally generous. Curves feel organic and warm — nothing looks mechanically sharp.

| Token | Value | Usage |
|-------|-------|-------|
| {rounded.none} | 0 | Full-bleed bands, hero sections, navbar |
| {rounded.xs} | 4px | Checkbox corners, inline tags, code blocks |
| {rounded.sm} | 8px | Buttons, text inputs, select dropdowns, tooltips |
| {rounded.md} | 12px | Cards, alerts, accordion containers |
| {rounded.lg} | 16px | Modals, side panels, large surface containers |
| {rounded.full} | 9999px | Badges, pills, switches, radio buttons, progress bars |

The {rounded.sm} value (8px) is the "workhorse radius" — it appears on most interactive elements. Cards use the more generous {rounded.md} (12px) to feel softer and more approachable than competitors' sharp-cornered dashboards. Switches, radio buttons, and badges use {rounded.full} (9999px) for pill-shaped and circular elements.

### Photography Geometry

- **Dashboard metric cards**: 16:9 aspect ratio for chart areas, {rounded.md} corners
- **Avatar thumbnails**: 1:1 square cropped to {rounded.full} (circle), 40px × 40px
- **Hero imagery**: 16:9 or 21:9 aspect ratio, zero rounding ({rounded.none}), full-bleed
- **Achievement badges**: 1:1 square, {rounded.full} (circle), 48px × 48px
- **Progress thumbnails**: 4:3 aspect ratio, {rounded.sm} corners, full-bleed within card

Images always crop (never stretch), using center gravity as the default focal point. Profile and achievement images use face-aware gravity when available.

---

## Components

### Buttons & Interaction

**Button Primary** — The "Start Workout" action
- Background {colors.primary}, text {colors.on-primary}, type {typography.button-md}
- rounded: {rounded.sm}, padding 12px 24px, height 44px
- Hover: background shifts to `#F5C038` ({colors.primary} hover variant)
- Active/Pressed: background shifts to `#E0AD20` ({colors.primary-deep}), scale(0.98)
- Disabled: opacity 0.5, muted background, cursor not-allowed

**Button Secondary** — Cancel, skip, secondary actions
- Background {colors.surface-card}, text {colors.ink}, type {typography.button-md}
- rounded: {rounded.sm}, padding 12px 24px, height 44px
- Border: 1px solid {colors.hairline-strong}
- Hover: border shifts to {colors.primary}
- Disabled: border fades to {colors.hairline}, opacity 0.5

**Button Ghost** — Text-only actions in toolbars
- Background transparent, text {colors.ink}, type {typography.button-md}
- rounded: {rounded.sm}, padding 12px 24px, height 44px
- Hover: background {colors.surface} (`#F8F7F4`)
- Disabled: opacity 0.5

### Inputs & Selection

**Text Input** — For login, search, goal entry
- Background {colors.surface-card}, text {colors.ink}, type {typography.body-md}
- rounded: {rounded.sm}, padding 12px 20px, height 44px
- Border: 1px solid {colors.hairline-strong}
- Focus: ring {colors.ring-focus} (2px), border {colors.primary}
- Placeholder: {colors.mute} (`#6e7073`)
- Error: border `#FF7B72`, ring `rgba(255,123,114,0.4)`

**Checkbox** — Multi-select options
- Background transparent, text {colors.ink}, type {typography.body-md}
- rounded: {rounded.xs} (4px), padding 0, height 20px
- Checked: background {colors.primary}, border {colors.primary}
- Indicator: checkmark in {colors.on-primary}

**Radio** — Single-select options
- Background transparent, text {colors.ink}, type {typography.body-md}
- rounded: {rounded.full} (circle), padding 0, height 20px
- Selected: outer ring {colors.primary}, inner dot {colors.primary}

**Switch** — Toggle settings on/off
- Background {colors.surface-dark}, text {colors.on-dark}, type {typography.caption}
- rounded: {rounded.full} (pill), padding 2px, height 24px
- Active: background {colors.primary}
- Knob: 20px × 20px circle, {colors.surface-card}

### Chips & Controls

**Badge** — Achievement labels, status markers
- Background {colors.primary}, text {colors.on-primary}, type {typography.caption}
- rounded: {rounded.full} (pill), padding 2px 8px, height 20px
- Variants: success ({colors.badge-success}), warning ({colors.badge-warning}), info ({colors.badge-info})
- Text on variant: always uses {colors.on-primary} (`#1A1D20`) for readability

**Tabs** — Navigation between dashboard views
- Background transparent, text {colors.mute}, type {typography.button-md}
- rounded: {rounded.none}, padding 8px 16px, height 40px
- Active: bottom border 2px solid {colors.primary}, text {colors.ink}
- Hover: text {colors.charcoal}

### Data & Containers

**Card** — Dashboard metric containers, activity summaries
- Background {colors.surface-card}, text {colors.ink}, type {typography.body-md}
- rounded: {rounded.md}, padding 24px, height auto
- Shadow: {elevation.level1} (`0 1px 3px rgba(0,0,0,0.08)`)
- On hover: shadow lifts to {elevation.level2}

**Accordion** — Expandable FAQ or workout detail sections
- Background {colors.surface-card}, text {colors.ink}, type {typography.body-md}
- rounded: {rounded.md}, padding 16px, height auto
- Header: {typography.heading-sm}, chevron rotates on expand
- Expanded: inner content with 12px padding

**Table** — Workout history, nutrition logs
- Background {colors.surface-card}, text {colors.ink}, type {typography.body-sm}
- rounded: {rounded.sm}, padding 12px, height auto
- Header row: {colors.surface} (`#F8F7F4`), {typography.button-sm}, text {colors.charcoal}
- Row hover: background {colors.surface}
- Border: {colors.hairline} between rows

**Progress** — Goal completion, workout intensity
- Background {colors.surface-dark}, text {colors.primary}, type {typography.caption}
- rounded: {rounded.full} (pill), padding 0, height 8px
- Fill: {colors.primary} with animated width transition
- Label: optional percentage text above bar using {typography.caption}

### Feedback Components

**Alert** — Success messages, warnings, info notices
- Background {colors.surface-card}, text {colors.ink}, type {typography.body-md}
- rounded: {rounded.md}, padding 16px, height auto
- Left border accent: 4px {colors.badge-success} / {colors.badge-warning} / {colors.badge-info}
- Icon + title + message layout
- Dismiss: close icon, top-right

**Tooltip** — Contextual hints, metric explanations
- Background {colors.surface-deep} (`#222327` / dark `#1A1A1E`), text {colors.on-dark}
- type {typography.caption}, rounded: {rounded.sm}
- padding 4px 8px, height auto
- Arrow pointing to trigger element
- Appears on hover with {animation.duration.fast} (150ms) fade

### Navigation

**Navbar** — Top-level app navigation
- Background {colors.background-canvas}, text {colors.ink}, type {typography.button-sm}
- rounded: {rounded.none}, padding 0 24px, height 60px
- Logo: left-aligned, links: right-aligned or center
- Active link: border-bottom 2px {colors.primary}
- Scroll: backdrop blur + subtle bottom border ({colors.hairline}) when scrolled

**Dropdown** — Menu selection in forms or navigation
- Background {colors.surface-card}, text {colors.ink}, type {typography.body-md}
- rounded: {rounded.sm}, padding 4px, height auto
- Shadow: {elevation.level3} (`0 8px 24px rgba(0,0,0,0.15)`)
- Items: padding 8px 16px, hover background {colors.surface}
- Separator: 1px {colors.divider}

---

## Do's and Don'ts

### Do

- :white_check_mark: **Use {colors.primary} for primary CTAs and key data highlights** — the gold is the signature accent, make it count
- :white_check_mark: **Use the warm beige surface hierarchy** — {colors.background}, {colors.surface}, {colors.surface-card} — for approachable data display
- :white_check_mark: **Apply generous rounding** — {rounded.sm} for buttons, {rounded.md} for cards, {rounded.full} for badges
- :white_check_mark: **Use negative letter-spacing on display typography** — it creates the tight, energetic headline feel
- :white_check_mark: **Space sections with {spacing.section} (96px)** — fitness data needs breathing room
- :white_check_mark: **Use {elevation.level1} for default cards** — the subtle shadow creates clean separation without heavy depth
- :white_check_mark: **Reserve {elevation.level3} and above for modals and overlays** — keep the elevation hierarchy meaningful
- :white_check_mark: **Use {colors.on-dark} and {colors.on-dark-mute} for text on dark surfaces** — the warm off-white preserves readability

### Don't

- :x: **Don't use pure black (`#000000`) for text** — always use {colors.ink} (`#1A1D20`) which is a warm near-black
- :x: **Don't overuse {colors.primary}** — gold is the signature accent, not the background. Avoid large gold surfaces
- :x: **Don't use thin font weights (100-300)** — the system starts at 400 (normal) and goes to 700 (bold)
- :x: **Don't use sharp corners (0px) on interactive elements** — {rounded.none} is for hero bands and navbars only
- :x: **Don't apply heavy shadows on cards** — {elevation.level1} is the default; higher levels are for modals and overlays
- :x: **Don't mix border-based depth with shadow-based elevation** — FitFlow uses shadow-only elevation
- :x: **Don't override the warm beige palette with cold whites or grays** — the warmth is the brand
- :x: **Don't introduce additional brand colors** — the gold + warm beige + coral hero gradient is the full system
- :x: **Don't use the hero gradient on components** — it's a decorative atmospheric treatment for hero sections only

---

## Responsive Behavior

### Breakpoints

| Name | Width | Key Changes |
|------|-------|-------------|
| xs | 0–479px | Single column, stacked layout, collapsed navbar |
| sm | 480–767px | Two-column grid, compact card padding (16px) |
| md | 768–1023px | Multi-column dashboard, visible sidebar |
| lg | 1024–1279px | Full dashboard layout, sidebar + content + widgets |
| xl | 1280px+ | Max-width container (1280px dashboard), generous margins |

### Touch Targets

All interactive elements meet or exceed the 44px minimum touch target:

| Component | Touch Height | Width |
|-----------|-------------|-------|
| Button (all variants) | 44px | Auto (min 44px) |
| Text input | 44px | 100% |
| Checkbox / Radio | 20px (min 44px tap area via padding) | 20px (same) |
| Switch | 24px (min 44px tap area via padding) | 44px |
| Navbar links | 60px | Auto |
| Tabs | 40px (min 44px tap area via padding) | Auto |

On touch devices, hover states are replaced with active/focus states. Focus rings ({colors.ring-focus}) are always visible for keyboard navigation.

### Collapsing Strategy

- **Navbar**: On xs/sm, the navbar collapses into a hamburger menu. Logo remains left-aligned. The bottom sheet overlay provides navigation options.
- **Cards**: On xs, cards stack in a single column. On sm+, they arrange in a 2-column grid. On md+, they use the full multi-column dashboard layout.
- **Tables**: On xs/sm, tables switch to a stacked card layout (each row becomes a labeled card). Horizontal scroll is available as a fallback.
- **Sidebar**: On md+, the sidebar is pinned. On sm and below, it becomes a slide-out overlay triggered by the hamburger icon.
- **Modals**: Full-screen on xs/sm (with close button), centered dialog on md+.

### Image Behavior

- **DPR**: All images serve at 2× resolution for Retina/HiDPI displays. Background gradients and decorative images use CSS-native techniques that scale automatically.
- **Responsive sizing**: Metric charts use SVG with responsive viewBox. Raster images use `srcset` with widths at 320w, 640w, 960w, 1280w.
- **Gradient vs asset**: Hero sections use the CSS gradient ({colors.hero-warm} → {colors.hero-glow} → {colors.hero-pink}) rather than raster images — this ensures crisp rendering at any viewport and instant load.
- **Avatar thumbnails**: Cropped to centered 1:1 circle, delivered at 80px (40px display × 2× DPR).

---

## Iteration Guide

1. **Start with one component at a time**. Don't rebuild the entire system in one pass. Pick a single component (e.g., `button-primary`) and perfect its token references, states, and dark variant before moving on.

2. **Reference tokens, not values**. Never write raw hex (`#FFD147`) or hardcoded pixels in component CSS. Use token references throughout: `var(--palette-primary)`, `var(--spacing-3)`, `var(--border-radius-md)`. In code, reference `{colors.primary}`, `{spacing.md}`, `{rounded.sm}`.

3. **Run validation after every edit**. Check that:
   - All color references have both light and dark mode values
   - All components define `default`, `hover`, `active`, `pressed`, and `disabled` states
   - Interactive components meet the 44px minimum touch target
   - Typography entries include all 5 properties (fontFamily, fontSize, fontWeight, lineHeight, letterSpacing)

4. **Add new variants as separate entries**. If you need a `button-primary-large`, create a new component entry rather than modifying the existing `button-primary`. This keeps the design system composable.

5. **Keep brand accent scarce**. Every new surface you introduce that uses {colors.primary} as a background should be reviewed: does this truly need to be gold, or can it be {colors.surface-card} with gold as the accent only? The system's power comes from restraint.

6. **Test in both light and dark mode**. The "Warm Inversion" principle means dark mode isn't a simple color flip. Verify that beige-warmth transfers to the dark palette (warm grays, not cold blacks).

7. **Document intentional exceptions**. If a component deliberately breaks a system rule (e.g., a destructive action uses {colors.danger} instead of {colors.primary}), add a comment explaining why.

8. **Sync tokens with the design team**. When Figma tokens change, update `design-token.json` before any component code. The JSON file is the single source of truth.

---

## Known Gaps

- **Motion/animation timing**: While duration tokens (`fast 150ms`, `normal 200ms`, `slow 300ms`) and easing curves are defined, specific component animation behaviors (page transitions, skeleton loading, chart enter animations) are not yet documented.
- **Skeleton loading states**: Placeholder loading patterns for cards, tables, and charts are not defined. Components currently show no loading variation between data-fetched and data-empty states.
- **Empty states**: No standardized empty state has been defined for dashboard widgets, workout history, or goal lists. Teams currently build ad-hoc empty illustrations.
- **Logged-in vs logged-out surfaces**: Marketing pages (logged-out) are not extracted. The current token system targets the logged-in dashboard experience.
- **Native mobile components**: The system currently documents web components only. iOS and Android native component mappings (SwiftUI, Jetpack Compose) are not yet extracted.
- **Focus-ring accessibility**: Interactive components reference {colors.ring-focus} for focus rings, but the full keyboard interaction model (tab order, skip links, aria roles) is not documented per component.
- **Component dark variants**: Some components (table, accordion, dropdown) do not yet have explicit dark-mode-only variants documented in the component spec — they inherit from light mode defaults via CSS custom properties.
- **Data visualization tokens**: Chart colors, line weights, axis styling, and annotation tokens for the dashboard's metric visualizations are not yet defined. The chart library uses its own palette outside the design token system.
