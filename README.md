# Harbor Frontend — Poppy Design System

A Next.js (App Router) + Tailwind CSS starter with the "poppy" Harbor design
system already wired up: colors, fonts, shadows, and 7 components, plus an
assembled dashboard page so you can see it running immediately.

## Getting started

```bash
npm install
npm run dev
```

Then open http://localhost:3000 — you'll see the dashboard page rendered
with real components, not a static mockup.

## Structure

```
harbor-frontend/
├── app/
│   ├── layout.tsx        # root layout, wires up all 4 fonts
│   ├── page.tsx           # assembled dashboard (uses every component below)
│   ├── fonts.ts            # next/font Google Fonts setup
│   └── globals.css         # Tailwind directives
├── components/
│   ├── Header.tsx           # logo, nav, avatar
│   ├── StatusPill.tsx        # variant: opened / delivered / paid
│   ├── BalanceCard.tsx        # available balance + settled summary
│   ├── QuickActions.tsx        # sidebar action list
│   ├── LCList.tsx                # active letters of credit table
│   ├── SettlementCard.tsx         # variant: settling / settled
│   ├── SplitCompare.tsx            # traditional vs. Harbor timing comparison
│   └── ClosingCard.tsx              # single-use closing statement
├── tailwind.config.ts       # all design tokens (colors, radius, shadows, fonts)
├── postcss.config.js
├── next.config.js
├── tsconfig.json
└── package.json
```

## Design tokens (in `tailwind.config.ts`)

- **Colors:** `primary` (indigo), `accent` (coral), `yellow`, `mint`,
  `surface` (default/raised/sunken), `ink` (default/muted/faint), and
  `state` (opened/delivered/paid — mapped to accent/primary/mint).
- **Radius:** `rounded-card` (22px), `rounded-pill` (999px).
- **Shadows:** `shadow-sticker` and `shadow-sticker-lg` — hard 0-blur
  offset shadows (not soft blur) paired with a 3px ink border on every
  card. This combo is what gives the whole system its "sticker" feel.
- **Fonts:** `font-display` (Space Grotesk, headings/numbers), `font-body`
  (Inter, body text), `font-mono` (IBM Plex Mono, inline figures),
  `font-closing` (Fraunces Italic, Closing Card only).

## Notes

- Every component takes props (amount, status, etc.) — none of the data is
  hardcoded except the sample rows in `LCList.tsx`, which you'll want to
  replace with real data.
- `ClosingCard.tsx` has a comment showing how to switch from the Fraunces
  italic treatment to a bolder Space Grotesk one if you decide against the
  quiet-contrast approach.
- The corner badge on `BalanceCard` is a small flourish — delete the badge
  `div` if it feels like too much once you see it live.
- This scaffold intentionally has minimal dependencies (just Next, React,
  Tailwind) so you can drop it straight into your existing Harbor repo —
  either merge these files in directly, or use this as the reference and
  copy over what you need.
