# VibeScout 2026

<p align="center">
  <img src="./public/brand/vibescout-logo-lockup.png" alt="VibeScout 2026 logo" width="560" />
</p>

<p align="center">
  <strong>A World Cup schedule ranked by drama, not date.</strong>
</p>

## Why this project exists

Most football schedule apps are good at telling you **when** games happen.

They are much worse at telling you **which match is actually worth your time**.

VibeScout 2026 is built around that gap. It is a mobile-first World Cup app that treats the schedule like an editorial recommendation product, not a plain fixture table. Instead of pushing every match equally, it scores and ranks fixtures based on what makes them genuinely watchable:

- stakes
- star power
- matchup quality
- upset potential
- fan pull
- host pressure
- kickoff convenience for Morocco time

The goal is simple: if you can only watch one match, VibeScout should help you choose the right one fast.

## What makes VibeScout different

VibeScout is not trying to be:

- a betting app
- a generic live-score clone
- a stats-heavy dashboard
- a FIFA or ESPN copy

It is trying to be a **useful football recommendation app** with a strong editorial point of view.

That means:

- the home screen answers "what should I watch tonight?"
- the rankings page answers "how does the whole slate compare?"
- every strong score has a readable football reason behind it
- time is localized for a Morocco-first viewing experience

## What the app does right now

- Highlights the best current recommendation on Home
- Shows the next best three matches
- Ranks the World Cup fixture slate using a Vibe Score
- Explains why each match scored the way it did
- Shows real match state and result treatment when a game has already been played
- Lets users search by team and filter by day
- Supports watchlist saving with local persistence
- Applies settings that change the app behavior

## Vibe Score

`Vibe Score /100` is the core product system.

It is **not** a win-probability model and **not** betting advice. It is a watchability model.

The score is designed to answer:

> How likely is this match to feel worth sitting down for?

The ranking logic considers a blend of:

- team quality
- competitive balance
- star players
- rivalry or narrative pressure
- upset window
- fan interest
- stage leverage
- kickoff convenience in Morocco time
- mismatch penalties when a game looks too one-sided

The score is then turned into a readable editorial layer:

- `Must Watch`
- `Worth It`
- `Chaos Potential`
- `Background Game`
- `Sleep Is Fine`

## Live data and API layer

This repo is not just static mock data.

The app includes a lightweight live update pipeline so the fixture list can be enriched with fresh match state while staying efficient on a free API plan.

### What the data layer does

- uses local fixture intelligence for the core World Cup schedule
- merges live match updates into that local data
- caches live payloads on the client
- limits refresh frequency to stay within a free API budget
- shows played games differently from future recommendations

### Current API-related pieces

- `app/api/world-cup/route.ts`  
  server route that returns World Cup data with cache headers

- `lib/live-world-cup.ts`  
  client-side live fetch and local cache handling

- `lib/matches.ts`  
  fixture metadata, editorial notes, and base score inputs

- `lib/match-intelligence.ts`  
  logic for choosing the featured match and home slate

### Efficiency strategy

The app is designed to be careful with free-tier API limits:

- cached responses
- slower refresh intervals instead of constant polling
- local-first ranking logic
- only lightweight live patches instead of rebuilding the whole app state from scratch every few seconds

That makes the project more realistic to run without paying for an expensive sports-data stack on day one.

## Main screens

### Home

The home screen is the editorial front page of the product.

It includes:

- VibeScout header and brand lockup
- hero recommendation
- archival football visual treatment
- featured match ticket
- large score moment
- scout note
- score drivers
- next best matches
- watchlist CTA

### Rankings

The rankings page turns the tournament slate into a browsable recommendation list.

It includes:

- full ordered match list
- date filter chips
- search
- expandable descriptions
- score breakdown details
- watchlist actions

### Watchlist

The watchlist is the personal layer of the app.

It lets users:

- save matches worth remembering
- remove single matches
- clear the list
- revisit saved fixtures with Morocco-time kickoff display

### Settings

Settings are functional, not decorative.

The current screen includes:

- Morocco time lock
- score preference modes
- hide overnight games
- hide passed games
- reduced motion
- clear watchlist

## Tech stack

- Next.js 15
- React 19
- TypeScript
- Tailwind CSS
- GSAP
- Lenis
- Lucide React

## Project structure

```text
app/
  api/world-cup/route.ts   World Cup route with caching behavior
  globals.css              Design tokens and global styles
  layout.tsx               Root app shell
  page.tsx                 Home page
  rankings/page.tsx        Rankings page
  settings/page.tsx        Settings page
  watchlist/page.tsx       Watchlist page

components/
  home-screen.tsx          Home experience
  rankings-screen.tsx      Rankings experience
  settings-screen.tsx      Settings experience
  watchlist-screen.tsx     Watchlist experience
  score-breakdown.tsx      Shared explanation and factor UI
  match-state-pill.tsx     Match status badge

lib/
  matches.ts               Base fixture data and editorial metadata
  match-intelligence.ts    Recommendation logic for Home
  preference-scoring.ts    Score preference reweighting
  live-world-cup.ts        Live update fetching and client caching
  settings.ts              Settings persistence and filtering state
  watchlist.ts             Watchlist persistence

public/
  brand/                   VibeScout logo assets
  images/                  Editorial imagery

PRODUCT.md                 Product contract
BRAND.md                   Brand direction
DESIGN.md                  Visual system
CRAFT.md                   Quality and implementation rules
```

## Run locally

### Install

```bash
npm install
```

### Start the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Quality checks

```bash
npm run typecheck
npm run lint
npm run build
```

## Product principles

- mobile first
- editorial, not noisy
- useful before flashy
- score must always be explained
- motion should support the product, not become the product
- accessibility and reduced-motion support are part of the core build

## What is not built yet

This is still an early product slice, not the full VibeScout platform.

## Credits

Built by eybiwon (Abdelouahed).
