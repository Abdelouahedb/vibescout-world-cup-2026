# VibeScout 2026 Product

## Register

product

## Product Purpose

VibeScout 2026 is a clean, ad-free World Cup 2026 web app that helps fans decide which matches are worth their time. It ranks fixtures by drama instead of listing them only by date.

Core tagline: A World Cup schedule ranked by drama, not date.

## Target Users

- Casual fans who cannot watch every match and want a quick answer.
- Dedicated football fans who want a sharper read on stakes, rivalry, stars, upset risk, and fan interest.
- Busy viewers checking the schedule from a phone before work, dinner, travel, or a night out.
- Social watchers choosing which match is worth planning around with friends.

## Core User Problem

World Cup schedules are easy to find but hard to judge. Fans need to know what is actually worth watching tonight, without scanning tables, news, standings, and pundit chatter.

## Current Scope

The app now includes a mobile Home screen and a mobile Rankings screen using real 2026 World Cup group-stage fixtures stored locally from public fixture sources. It does not include backend storage, paid sports APIs, auth, live scores, lineup updates, desktop-specific layout, or saved watchlist persistence.

The Home screen must answer:

- What is the best match tonight?
- Why is it worth watching?
- What are the next best options?
- How can the user start a watchlist habit?

The Rankings screen must answer:

- Which World Cup group-stage matches are highest ranked overall?
- Why did each match receive its Vibe Score?
- Can the user search by day, team, stadium, player, or score label?
- Can the user filter the schedule by match date?

The Watchlist screen must answer:

- Which matches did the user save?
- When do those matches kick off in Morocco time?
- Can the user remove one match or clear the whole list?
- What should the user do when the list is empty?

The Settings screen must include:

- Time Zone: Morocco time locked
- Score Preferences
- Hide overnight games toggle
- Hide passed games toggle
- Reduced motion toggle
- Clear watchlist
- About Vibe Score

Settings behavior is part of the product contract:

- Score Preferences reweight visible Vibe Scores and ranking order across Home and Rankings, and update visible scores inside Watchlist.
- Hide overnight games removes matches before 07:00 Morocco time from Home, Rankings, and Watchlist views.
- Hide passed games removes matches whose Morocco kickoff time has already passed from Home, Rankings, and Watchlist views.
- Reduced motion disables GSAP/Lenis entrance motion across the app in addition to respecting the system reduced-motion setting.
- Clear watchlist removes all locally saved matches.

## Data And Scoring

The current schedule source is public fixture data verified against June 2026 World Cup fixture coverage. Flags load through the free FlagCDN image API. Vibe Scores are generated locally from a transparent editorial model using FIFA-ranking proxies, team quality, star power, fan interest, host pressure, group-stage pressure, kickoff timing, competitive balance, upset potential, mismatch penalties, and rare market-specific marquee bonuses.

The score is a watchability score, not betting advice and not a match-result prediction. Strong mismatches should score lower than balanced elite games, even when a famous team is involved.

For the Morocco-first experience, Brazil vs Morocco is treated as the opening-slate marquee match: Brazil's global star power, Morocco's 2022 semifinal run, strong competitive balance, and a 23:00 Morocco kickoff make it the highest-rated fixture.

All displayed match dates and kickoff times are converted to Morocco time (`Africa/Casablanca`) for the primary user experience.

Watchlist state is stored locally in the browser with `localStorage`. It is intentionally client-only for this phase and does not sync across devices.

Settings state is also local-only. Score preferences and schedule toggles are stored for future filtering/scoring behavior, while the current scoring model remains deterministic in the local fixture data.

## Success Criteria

- A user can understand the top recommendation within five seconds.
- The Vibe Score feels editorial and useful, not gimmicky.
- The screen feels premium, football-specific, and mobile-native.
- The app avoids betting, scoreboard, generic SaaS, and FIFA/ESPN clone patterns.
- The interface remains readable and usable with motion disabled.

## Product Principles

- Rank by human interest, not calendar order.
- Explain the recommendation in plain football language.
- Keep the screen calm enough to trust.
- Make the match card feel collectible, like a ticket worth saving.
- Let motion dramatize the score moment without turning the app into an animation demo.

## Accessibility And Inclusion

Target WCAG 2.2 AA. Vibe Score must always be represented by number and text, never color alone. Controls need semantic labels, visible focus states, keyboard access, minimum 44px touch targets, readable text sizes, and reduced-motion support.
