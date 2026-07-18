# Where the real art lives

All real StudyCat art lives in `/public`, not here, so it can be referenced
by plain string paths (e.g. `/cats/tuxedo/idle-none.gif`) without a JS
import — works identically in dev and in the built `dist/` output.

```
public/
  cats/
    tuxedo/  idle-none.gif   idle-pink-bow.gif
             studying-none.gif   studying-pink-bow.gif
             break-none.gif      break-pink-bow.gif
    ginger/  (same six files)
  accessories/
    pink-bow.png
  decorations/
    bed.png
    desk.png
  notepad/
    tan.png  blue.png  sage.png  steel.png
    butteryellow.png  coral.png  lavender.png  lilac.png  mint.png  peach.png
  room/
    background.png
  icons/
    fish-coin.png    (currency icon — fish counter, prices)
    fish-outline.png (grey — shop "fish" tab)
    shop.png         (HUD shop button)
    calendar.png     (HUD calendar button)
    gear.png         (HUD settings button)
    tomato.png       (center tomato / pomodoro tab)
    notepad.png      (center notepad icon)
    stopwatch.png    (timer tab)
    countdown.png    (timer tab)
    cat-outline.png     (grey — shop "cats" tab)
    plant-outline.png   (grey — shop "decorations" tab)
    bow-outline.png     (grey — shop "accessories" tab)
  ui/
    button-round.png (HUD button backdrop)
```

## Adding a new cat
Drop the same six GIFs (idle / studying / break, each with a "-none" and
"-pink-bow" version) into a new `public/cats/<id>/` folder, then add
`{ id: '<id>', name: '...', price: ... }` to `CATS` in
`src/data/constants.js`. `CatDisplay.jsx` builds the file path automatically
— no other code changes needed.

## Adding a new decoration
Add `public/decorations/<id>.png` and one entry to `DECORATIONS` in
`src/data/constants.js` (id, name, price, on-screen width/height, and a
default x/y position as a percentage of the room). `Room.jsx` builds the
path automatically.

## Adding a new accessory
Right now the bow is baked directly into each cat's GIF rather than layered
on top, so a brand-new accessory (not just a recolor) needs its own
`-<accessory-id>.gif` variant rendered for every cat + state combination —
6 files per existing cat. Add the accessory's shop-preview PNG to
`public/accessories/<id>.png` and an entry to `ACCESSORIES` in
`src/data/constants.js`.

## Adding a new notepad color
Add `public/notepad/<id>.png` and one entry to `NOTEPAD_SWATCHES` in
`src/data/constants.js` (id + a representative hex for the little name-chip).

## Known issue
An 11th notepad color ("slate") was uploaded early on but the export was
cropped to a thin sliver instead of the full card — it's excluded from
`NOTEPAD_SWATCHES` until it's re-exported at the same size/shape as the
others, then dropped in as `public/notepad/slate.png` and added back to
the array.

## Still placeholder (no real art yet)
- The **Break** timer tab icon — see `BreakIcon` in `Icons.jsx`.
- Generic UI chrome (play/pause/stop, close, back arrow) — small enough that
  hand-drawn SVG is fine unless you want a matching pixel-art style for those too.
