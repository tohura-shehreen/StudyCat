// ---------------------------------------------------------------------------
// Icon components used across the HUD, shop tabs, and timer tabs.
//
// Most of these now render real art from /public/icons/<name>.png. A few
// (Break, Play/Pause/Stop, Close/Back) still fall back to small hand-drawn
// SVGs because no art has been supplied for them yet — swap them the same
// way once you have it: just render an <img src="/icons/<name>.png"> instead.
// ---------------------------------------------------------------------------

function Img({ src, alt = '', size = 24, className, style }) {
  return (
    <img
      src={src}
      alt={alt}
      draggable={false}
      className={className}
      style={{ width: size, height: size, objectFit: 'contain', imageRendering: 'pixelated', ...style }}
    />
  )
}

// --- real art -------------------------------------------------------------

export function FishIcon(props) {
  return <Img src="/icons/fish-coin.png" size={26} {...props} />
}

export function ShopIcon(props) {
  return <Img src="/icons/shop.png" size={28} {...props} />
}

export function CalendarIcon(props) {
  return <Img src="/icons/calendar.png" size={26} {...props} />
}

export function GearIcon(props) {
  return <Img src="/icons/gear.png" size={26} {...props} />
}

export function TomatoIcon(props) {
  return <Img src="/icons/tomato.png" size={42} {...props} />
}

export function NotepadIcon(props) {
  return <Img src="/icons/notepad.png" size={48} {...props} />
}

export function StopwatchIcon(props) {
  return <Img src="/icons/stopwatch.png" size={48} {...props} />
}

export function CountdownIcon(props) {
  return <Img src="/icons/countdown.png" size={42} {...props} />
}

// Shop tab-strip icons (grey outline style, matches the panel border tone)
export function CatsTabIcon(props) {
  return <Img src="/icons/cat-outline.png" size={30} {...props} />
}

export function DecorationsTabIcon(props) {
  return <Img src="/icons/plant-outline.png" size={30} {...props} />
}

export function AccessoriesTabIcon(props) {
  return <Img src="/icons/bow-outline.png" size={30} {...props} />
}

export function FishTabIcon(props) {
  return <Img src="/icons/fish-outline.png" size={30} {...props} />
}

// --- no art yet — hand-drawn placeholders ----------------------------------

export function BreakIcon(props) {
  return (
    <svg viewBox="0 0 24 24" width="48" height="48" {...props}>
      <path
        d="M5 8h11a3 3 0 0 1 0 6h-1"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <rect x="4" y="7" width="12" height="9" rx="1.5" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <path d="M6 4.5c0 1-1 1.2-1 2.2M9.5 4.5c0 1-1 1.2-1 2.2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" fill="none" />
    </svg>
  )
}

export function CloseIcon(props) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" {...props}>
      <path d="M5 5l14 14M19 5L5 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

export function BackIcon(props) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" {...props}>
      <path d="M14 5l-7 7 7 7" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function PlayIcon(props) {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" {...props}>
      <path d="M6 4l14 8-14 8V4z" fill="currentColor" />
    </svg>
  )
}

export function PauseIcon(props) {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" {...props}>
      <rect x="6" y="4" width="4" height="16" fill="currentColor" />
      <rect x="14" y="4" width="4" height="16" fill="currentColor" />
    </svg>
  )
}

export function StopIcon(props) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" {...props}>
      <rect x="5" y="5" width="14" height="14" rx="2" fill="currentColor" />
    </svg>
  )
}
