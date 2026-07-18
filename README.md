# StudyCat 🐱

A cozy, device-based study timer. Focus with a countdown, Pomodoro, stopwatch,
or break timer, earn fish for the time you focus, and spend them on cats,
accessories, and room decorations. Every session is logged to a calendar so
you can look back at any day's timeline.

No accounts, no login — everything is saved to this browser/device via
`localStorage`.

## Run it locally

```bash
npm install
npm run dev
```

## Project structure

```
src/
  data/constants.js        shop catalog, timer limits, colors — tune values here
  hooks/useLocalStorageState.js   the "database": persists state to localStorage
  context/StoreContext.jsx        fish, inventory, focus labels, session history
  context/TimerContext.jsx        the actual ticking timer engine
  components/
    Room.jsx / Room.css           page 1 — landing room + HUD
    ShopPanel.jsx                 page 2 — cats / decorations / accessories
    CalendarModal.jsx             page 3 — month view
    DayTimelineModal.jsx          page 4 — a single day's session timeline
    TimerModal.jsx                page 5 — countdown / pomodoro / stopwatch / break setup
    NotepadModal.jsx              page 6 — focus label colors + names
    CatDisplay.jsx                the cat + equipped accessory
```

See `src/assets/README.md` for exactly where to drop in your own pixel art to
replace the current CSS/SVG placeholders.

## Deploying

Push to GitHub, then import the repo in Vercel — it auto-detects the Vite
build (`npm run build`, output `dist`). Every push to `main` redeploys.
