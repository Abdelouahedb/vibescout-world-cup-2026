# VibeScout 2026 Craft

## Implementation Bar

The Step 1 build must feel like a finished mobile product screen, not a placeholder landing page. Every visible control should look intentional, respond to touch/keyboard focus, and preserve layout at 320px, 390px, and 430px.

## Required Build Scope

- One Next.js route: `/`.
- Mobile Home screen only.
- Local placeholder fixture data.
- Local generated archival football image.
- No backend, APIs, auth, persistent watchlist, real routing, or desktop-specific app.

## Motion Checklist

- Hero title reveals line by line.
- Main Vibe Score counts from 0 to final score.
- Ticket cards fade and slide gently into place.
- Save/watchlist button gives a tactile response.
- Bottom navigation active indicator moves smoothly.
- Archival image has subtle texture drift only when motion is allowed.
- Reduced-motion support disables animation without hiding content.

## Quality Checklist

- Production build passes.
- Type checks pass.
- No console errors.
- No horizontal overflow.
- Works at 320px, 390px, and 430px.
- Focus states are visible.
- Vibe Score has number and text label.
- Images have useful alt text.
- Controls have accessible names.
- Generated image is copied into the workspace before use.

## Impeccable Anti-Slop Checks

- No gradient text.
- No side-stripe card accents.
- No nested cards.
- No oversized card radii.
- No generic SaaS dashboard layout.
- No fake brand-deck sections.
- No decorative motion that delays the task.
- No text overflow in buttons, cards, nav, or score labels.
