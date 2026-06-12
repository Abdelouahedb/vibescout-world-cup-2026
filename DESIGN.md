# VibeScout 2026 Design

## Design Intent

VibeScout is a mobile-first recommendation app with editorial football energy. The first screen should feel like a match ticket, a scouting note, and a premium app interface merged into one focused surface.

Physical scene: a fan checks their phone in warm evening light before deciding whether tonight's match deserves their attention.

## Color System

Use OKLCH color tokens. The surface may feel warm through imagery and accents, but the interface should avoid a muddy beige monoculture.

```css
--vs-bg: oklch(0.985 0 0);
--vs-paper: oklch(0.962 0.009 93);
--vs-surface: oklch(0.995 0 0);
--vs-ink: oklch(0.145 0.018 145);
--vs-muted: oklch(0.395 0.025 145);
--vs-line: oklch(0.845 0.015 95);
--vs-green: oklch(0.35 0.105 145);
--vs-green-bright: oklch(0.52 0.145 140);
--vs-red: oklch(0.58 0.215 29);
--vs-gold: oklch(0.69 0.145 78);
--vs-blue: oklch(0.45 0.105 255);
```

Roles:

- Green: trust, scout intelligence, active navigation, worth watching.
- Red: drama, top match, urgent score energy.
- Gold: premium football occasion and high-interest accents.
- Blue: low-priority or background-game score labels.
- Neutral ink and paper: editorial readability.

## Typography Direction

Use Option C from the typography direction board:

- Display: `Barlow Condensed` for hero, teams, ranks, and Vibe Score numerals.
- Body/UI: `Manrope` for controls, metadata, navigation, and dense app text.
- Editorial: `Libre Baskerville` for the hero tagline and scout notes.
- Numbers: tabular numerals for Vibe Score, times, and ranks.

Display type should be bold and condensed, but not cramped. Body copy must remain at least 16px on mobile.

## Layout Rules

- Mobile first at 320px, 390px, and 430px.
- No horizontal overflow.
- Single-column screen.
- Header controls and bottom navigation are 44px minimum touch targets.
- Cards should feel like collectible tickets, with controlled borders, separators, and notched/coupon details where useful.
- Do not nest cards inside cards.
- Hero image and best-match card are the first visual anchors.

## Logo Assets

- `public/brand/vibescout-logo-lockup.png`: supplied top logo lockup with background removed, used in the header.
- `public/brand/vibescout-icon.png`: supplied icon-only crop with background removed, used for compact icon moments.
- `app/icon.png`: app icon generated from the icon-only crop.
- Do not redraw the logo or substitute a CSS/vector approximation unless explicitly requested.

## Vibe Score System

The Vibe Score is a 0-100 recommendation score built from:

- Drama
- Star power
- Rivalry
- Stakes
- Upset potential
- Kickoff time
- Fan interest

Labels:

- 85-100: Must Watch
- 70-84: Worth It
- 55-69: Chaos Potential
- 40-54: Background Game
- 0-39: Sleep Is Fine

Every score must show number, text label, and `/100` context.

## Match Card Language

The top card should read like an editorial ticket:

- Short top label: Best Match Tonight
- Teams with visible flags
- Kickoff and stadium
- Stage or group label
- One short scout note
- Score drivers as compact icon-plus-text chips

Flags are remote image assets loaded from the FlagCDN HTTP flag API by ISO country or subdivision code. Team names remain visible text, so flags are visual reinforcement rather than the only country identifier.

## Motion Rules

- GSAP controls hero title reveal, Vibe Score count-up, and ticket/list reveals.
- Lenis smooths scrolling only if the page scrolls.
- CSS transitions handle button/card feedback.
- Reduced-motion users get instant content with no score count or parallax.
- Motion should feel like a smooth editorial reveal, not a game intro.

## Accessibility Rules

- Use semantic landmarks and headings.
- Buttons require accessible names.
- Focus states must be visible against light surfaces.
- Contrast must target WCAG 2.2 AA.
- Do not use color as the only state indicator.
- Keep tap targets at least 44px.
- Respect `prefers-reduced-motion`.

## Anti-Patterns

Do not ship:

- Betting visual language
- Scoreboard clone density
- Neon, esports, crypto, or casino effects
- Generic SaaS cards
- Messy fake retro filters
- Layout shift during animation
- Invisible content before JS runs
