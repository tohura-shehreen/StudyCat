// ---------------------------------------------------------------------------
// StudyCat — shared constants & shop catalog
//
// This is the single place that defines "what exists to buy", "what colors
// the notepad offers", and "how fish are earned". Change numbers here rather
// than hunting through components.
//
// Real art lives in /public so plain string paths work everywhere (no JS
// import needed): /public/cats/<id>/<state>-<accessory>.gif,
// /public/notepad/<id>.png, /public/accessories/<id>.png,
// /public/decorations/<id>.png, /public/room/background.png,
// /public/icons/<name>.png, /public/ui/button-round.png.
// ---------------------------------------------------------------------------

// How many fish (coins) a user earns per full minute of completed FOCUS time.
// Breaks never earn fish. Stopwatch earns fish for every minute it ran before
// being stopped/saved.
export const FISH_PER_FOCUS_MINUTE = 2

// Timer type identifiers used across TimerModal + Room.
export const TIMER_TYPES = {
  COUNTDOWN: 'countdown',
  POMODORO: 'pomodoro',
  STOPWATCH: 'stopwatch',
  BREAK: 'break',
}

// Slider bounds per the spec you gave.
export const TIMER_LIMITS = {
  [TIMER_TYPES.COUNTDOWN]: { focusMin: 0, focusMax: 180, focusDefault: 25 },
  [TIMER_TYPES.POMODORO]: {
    focusMin: 0,
    focusMax: 180,
    focusDefault: 45,
    breakMin: 0,
    breakMax: 60,
    breakDefault: 5,
    sessionsMin: 1,
    sessionsMax: 5,
    sessionsDefault: 1,
  },
  [TIMER_TYPES.BREAK]: { breakMin: 0, breakMax: 60, breakDefault: 10 },
}

// Cat "life" states that map to a real GIF per cat:
//   idle      -> sitting, awake, no timer running
//   studying  -> reading a book, a focus timer is running
//   break     -> sleeping ("Zzz"), a break timer is running
export const CAT_STATES = {
  IDLE: 'idle',
  STUDYING: 'studying',
  BREAK: 'break',
}

// Cats available in the shop. Each needs six files at
// /public/cats/<id>/<state>-none.gif and <state>-pink-bow.gif
// for state in idle/studying/break. Add a new cat by dropping the same six
// files in a new folder and adding one entry here.
export const CATS = [
  { id: 'tuxedo', name: 'Tuxedo', price: 0 },
  { id: 'ginger', name: 'Ginger', price: 150 },
]

// Accessories: the bow is baked directly into each cat's GIF (not a layered
// overlay), so equipping it just switches which file CatDisplay loads
// (<state>-pink-bow.gif vs <state>-none.gif).
export const ACCESSORIES = [
  { id: 'pink-bow', name: 'Pink Bow', price: 200 },
]

// Decorations: user can drag to any position in the room, but cannot change
// stacking order (always renders at the layer defined in Room.jsx) or resize.
// Art at /public/decorations/<id>.png. width/height are the on-screen pixel
// size at the room's native 1024x768 scale; defaultX/defaultY are percentage
// positions within the room the first time it's bought.
export const DECORATIONS = [
  {
    id: 'bed',
    name: 'Bed',
    price: 220,
    width: 260,
    height: 256,
    defaultX: 18,
    defaultY: 48,
  },
  {
    id: 'desk',
    name: 'Desk',
    price: 200,
    width: 240,
    height: 244,
    defaultX: 78,
    defaultY: 55,
  },
]

// Notepad / focus-label colors — one real card image per swatch, plus a
// representative hex used to tint the little name-chip shown under it once
// it's named. Only colors that have the real spiral-bound notepad artwork
// are listed here (a handful of older flat-card exports for tan/blue/sage/
// steel, plus an 11th color "slate", were dropped since they don't match
// this art style / are broken — see src/assets/README.md).
export const NOTEPAD_SWATCHES = [
  { id: 'butteryellow', hex: '#dad4b8' },
  { id: 'coral', hex: '#dabcb8' },
  { id: 'lavender', hex: '#c4b8da' },
  { id: 'lilac', hex: '#d2b8da' },
  { id: 'mint', hex: '#b8daca' },
  { id: 'peach', hex: '#dac7b8' },
  { id: 'periwinkle', hex: '#b8bcda' },
  { id: 'sagegreen', hex: '#c4dab8' },
  { id: 'seafoam', hex: '#b8dad3' },
  { id: 'skyblue', hex: '#b8ced9' },
]

/** Focus labels store a swatch id (e.g. "tan"); resolve it to a real hex color for rendering. */
export function swatchHex(swatchId) {
  return NOTEPAD_SWATCHES.find((s) => s.id === swatchId)?.hex || '#c9c2b6'
}

export const DEFAULT_FOCUS_LABELS = [
  { id: 'label-study', color: 'coral', name: 'study' },
  { id: 'label-work', color: 'skyblue', name: 'work' },
]

export const WEEKDAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thurs', 'Fri', 'Sat']

export const MONTH_LABELS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]
