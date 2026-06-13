# VibeScout 2026

<p align="center">
  <img src="./public/brand/vibescout-logo-lockup.png" alt="VibeScout 2026 logo" width="620" />
</p>

<p align="center">
  <strong>A World Cup schedule ranked by drama, not date.</strong>
</p>

<p align="center">
  Mobile-first. Editorial. Morocco-time aware. Built to answer one question fast:
  <br />
  <strong>what is actually worth watching tonight?</strong>
</p>

<p align="center">
  Live app: <a href="https://vibescout26.vercel.app/">vibescout26.vercel.app</a>
</p>

---

## The pitch

Most football apps dump the tournament on your screen and make you do the thinking.

VibeScout flips that.

It does not treat every fixture like equal wallpaper. It scores every World Cup match for watchability, ranks the slate, explains the logic, and gives you a cleaner answer than a generic schedule ever can.

This is a football recommendation product disguised as a schedule app.

## Why it matters

During a World Cup, the problem is not finding games.

The problem is filtering noise:

- which match has real edge
- which one is carried by stars but not stakes
- which one might explode into chaos
- which kickoff is brutal in local time
- which big-name game is secretly skippable

VibeScout is built for fans who want signal, not just fixtures.

## What makes it different

Instead of only listing matches by date, VibeScout builds a ranked viewing layer on top of the tournament:

- a **Vibe Score /100** for every match
- a readable label like `Must Watch` or `Sleep Is Fine`
- an editorial scout note for the match
- factor-based explanations for why the score landed there
- a Morocco-first time experience
- a mobile UI designed like a premium football recommendation app, not a sports-data spreadsheet

It is intentionally not:

- a betting product
- a Sofascore clone
- a sportsbook-style odds screen
- a generic live-score dashboard
- a FIFA/ESPN visual copy

## Core product idea

> If you only watch one match tonight, VibeScout should help you pick the right one in under five seconds.

That idea drives the whole app:

- **Home** says what to watch now
- **Rankings** says how the whole slate compares
- **Watchlist** remembers what you care about
- **Settings** change the app around real viewing habits

---

## Vibe Score

`Vibe Score /100` is the core system behind the product.

It is not a prediction engine.

It is not telling you who will win.

It is trying to measure something more human:

> How likely is this match to feel worth your time?

### The score looks at

- team quality
- balance vs mismatch
- star power
- fan pull
- rivalry or narrative tension
- stage leverage
- upset window
- host pressure
- kickoff convenience in Morocco time

### The score becomes

- `Must Watch`
- `Worth It`
- `Chaos Potential`
- `Background Game`
- `Sleep Is Fine`

That means a famous team can still rank lower if the match looks too flat, too predictable, or too badly timed for the target viewer.

---

## Live data, API flow, and realism

This project is not just styled mock screens.

VibeScout has a real lightweight data model designed to work on a free sports-data budget without spamming an API.

### What the app uses

1. **Local tournament intelligence**
   - curated fixture data
   - editorial notes
   - score inputs
   - recommendation logic

2. **Live match patching**
   - fetches match updates from the app's own API route
   - merges live state into local match records
   - shows played matches differently from upcoming ones

3. **Free-tier friendly caching**
   - cached browser payloads
   - slower refresh intervals
   - server cache headers
   - fallback behavior when the live source is unavailable

### Current API pieces

- [app/api/world-cup/route.ts](C:/Users/Dex/Documents/New%20project%202/app/api/world-cup/route.ts)  
  Server-side World Cup endpoint. Pulls from `football-data.org` when a token is available, falls back gracefully when it is not.

- [lib/live-world-cup.ts](C:/Users/Dex/Documents/New%20project%202/lib/live-world-cup.ts)  
  Client-side live fetch, cache read/write, background refresh, and merge logic.

- [lib/matches.ts](C:/Users/Dex/Documents/New%20project%202/lib/matches.ts)  
  Base fixture data, flags, editorial metadata, score inputs, and app navigation data.

- [lib/match-intelligence.ts](C:/Users/Dex/Documents/New%20project%202/lib/match-intelligence.ts)  
  Logic for choosing the featured match, filtering the slate, and shaping the Home experience.

### Environment variable

To enable the best live source, set:

```env
FOOTBALL_DATA_API_TOKEN=your_token_here
```

Without it, the app still runs, but the live merge becomes more fallback-driven.

### Data source

The live football data layer is built on data from [football-data.org](https://www.football-data.org/pricing).

VibeScout uses that source for World Cup match updates and then layers its own editorial ranking, filtering, caching, and watchability logic on top.

### Why this matters

The app is designed to stay useful even on a tight free plan.

That is part of the product value: the architecture respects reality, not just ideal demos.

---

## Current experience

### Home

The Home screen is the cover page.

It gives you:

- hero recommendation
- archival football mood
- featured ticket card
- Vibe Score moment
- scout note
- score drivers
- next best matches
- watchlist CTA

### Rankings

The Rankings screen turns the whole slate into a recommendation board:

- search
- date filtering
- expanded match descriptions
- score breakdowns
- ranking order shaped by user score preference

### Watchlist

The Watchlist gives the app memory:

- save matches
- remove single entries
- clear everything
- keep your shortlist visible in Morocco time

### Settings

Settings are fully product-facing, not filler:

- Morocco time lock
- score preference modes
- hide overnight games
- hide passed games
- reduced motion
- clear watchlist

Those settings affect what users actually see.

---

## Stack

- Next.js 15
- React 19
- TypeScript
- Tailwind CSS
- GSAP
- Lenis
- Lucide React

## Structure

```text
app/
  api/world-cup/route.ts   Live World Cup API route with caching + fallback
  globals.css              Global tokens, layout, and component styling
  layout.tsx               Root shell
  page.tsx                 Home route
  rankings/page.tsx        Rankings route
  settings/page.tsx        Settings route
  watchlist/page.tsx       Watchlist route

components/
  home-screen.tsx          Home screen UI and motion
  rankings-screen.tsx      Rankings UI and interactions
  settings-screen.tsx      Settings UI and persistence controls
  watchlist-screen.tsx     Watchlist UI and saved state handling
  score-breakdown.tsx      Shared score explanation component
  match-state-pill.tsx     Match status badge

lib/
  matches.ts               Match dataset, editorial fixtures, app metadata
  match-intelligence.ts    Featured slate and recommendation logic
  preference-scoring.ts    Score reweighting by user preference
  live-world-cup.ts        Live fetching, caching, and merging
  settings.ts              Local settings store
  watchlist.ts             Local watchlist store

public/
  brand/                   Logo assets
  images/                  Hero/editorial imagery

PRODUCT.md                 Product contract
BRAND.md                   Brand direction
DESIGN.md                  Visual system
CRAFT.md                   Craft and quality rules
```

---

## Run it locally

### Install

```bash
npm install
```

### Start

```bash
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

### Checks

```bash
npm run typecheck
npm run lint
npm run build
```

---

## Product principles

- mobile first
- editorial before dashboard
- useful before flashy
- every score should feel earned
- motion should support tension, not steal attention
- accessibility and reduced motion are part of the real product

## Not built yet

This is a serious product slice, but not the full platform yet.

Still to come:

- auth
- team profile pages
- richer live-match center UI
- notifications
- deeper tournament-state intelligence
- desktop-specific polish

---

## Credits

Built by eybiwon (Abdelouahed).
