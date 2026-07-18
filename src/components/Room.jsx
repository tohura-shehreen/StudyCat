import { useRef, useState } from 'react'
import { useStore } from '../context/StoreContext.jsx'
import { useTimer } from '../context/TimerContext.jsx'
import { TIMER_TYPES, CAT_STATES } from '../data/constants'
import CatDisplay from './CatDisplay.jsx'
import {
  FishIcon,
  ShopIcon,
  CalendarIcon,
  GearIcon,
  TomatoIcon,
  NotepadIcon,
  StopwatchIcon,
  CountdownIcon,
  BreakIcon,
  PlayIcon,
  PauseIcon,
  StopIcon,
} from './Icons.jsx'
import './Room.css'

const TYPE_LABEL = {
  [TIMER_TYPES.COUNTDOWN]: 'Countdown',
  [TIMER_TYPES.POMODORO]: 'Pomodoro',
  [TIMER_TYPES.STOPWATCH]: 'Stopwatch',
  [TIMER_TYPES.BREAK]: 'Break',
}

const TYPE_ICON = {
  [TIMER_TYPES.COUNTDOWN]: CountdownIcon,
  [TIMER_TYPES.POMODORO]: TomatoIcon,
  [TIMER_TYPES.STOPWATCH]: StopwatchIcon,
  [TIMER_TYPES.BREAK]: BreakIcon,
}

function formatClock(totalSeconds) {
  const s = Math.max(0, Math.round(totalSeconds))
  const mm = Math.floor(s / 60)
  const ss = s % 60
  return `${String(mm).padStart(2, '0')}:${String(ss).padStart(2, '0')}`
}

export default function Room({ onOpen }) {
  const {
    fish,
    decorations,
    equippedCatId,
    equippedAccessoryId,
    ownedDecorationIds,
    placedDecorations,
    moveDecoration,
    activeNotepadColor,
    lastTimerType,
  } = useStore()
  const { timer, pause, resume, stop } = useTimer()

  // The tomato tile always mirrors whichever timer type is running (or was
  // last picked), and the notepad tile always mirrors whichever notepad
  // color was last picked, instead of always showing the generic art.
  const TimerTileIcon = TYPE_ICON[timer?.type || lastTimerType] || TomatoIcon
  const notepadTileSrc = `/notepad/${activeNotepadColor || 'coral'}.png`

  const catState = !timer
    ? CAT_STATES.IDLE
    : timer.type === TIMER_TYPES.BREAK || (timer.type === TIMER_TYPES.POMODORO && timer.phase === 'break')
    ? CAT_STATES.BREAK
    : CAT_STATES.STUDYING

  const clockLabel = timer
    ? timer.type === TIMER_TYPES.STOPWATCH
      ? 'Stopwatch'
      : timer.type === TIMER_TYPES.POMODORO
      ? `${timer.phase === 'focus' ? 'Focus' : 'Break'} · ${timer.sessionsDone + 1}/${timer.totalSessions}`
      : TYPE_LABEL[timer.type]
    : TYPE_LABEL[TIMER_TYPES.COUNTDOWN]

  const clockValue = timer
    ? timer.type === TIMER_TYPES.STOPWATCH
      ? formatClock(timer.elapsedSeconds)
      : formatClock(timer.remainingSeconds)
    : '00:00'

  return (
    <div className="room">
      <div className="room-scene">
        <img src="/room/background.png" alt="" className="room-background" />

        {ownedDecorationIds.map((id) => {
          const deco = decorations.find((d) => d.id === id)
          if (!deco) return null
          const pos = placedDecorations[id] || { x: deco.defaultX, y: deco.defaultY }
          return (
            <DraggableDecoration
              key={id}
              deco={deco}
              pos={pos}
              onMove={(x, y) => moveDecoration(id, x, y)}
            />
          )
        })}

        <div className="room-hud room-hud--top-left">
          <div className="fish-counter">
            <FishIcon />
            <span>{fish}</span>
          </div>
          <button
            type="button"
            className="hud-round-btn"
            onClick={() => onOpen('shop')}
            aria-label="Open shop"
          >
            <ShopIcon />
          </button>
        </div>

        <div className="room-hud room-hud--top-right">
          <button
            type="button"
            className="hud-round-btn"
            onClick={() => onOpen('calendar')}
            aria-label="Open calendar"
          >
            <CalendarIcon />
          </button>
          <button
            type="button"
            className="hud-round-btn"
            onClick={() => onOpen('settings')}
            aria-label="Open settings"
          >
            <GearIcon />
          </button>
        </div>

        <div className="room-center">
          <div className="mode-icons">
            <button
              type="button"
              className="mode-tile"
              onClick={() => !timer && onOpen('timer')}
              aria-label="Open timer settings"
              disabled={!!timer}
            >
              <TimerTileIcon className="mode-tile-timer-img" />
            </button>
            <button
              type="button"
              className="mode-tile"
              onClick={() => onOpen('notepad')}
              aria-label="Open focus labels"
            >
              <img src={notepadTileSrc} alt="" className="mode-tile-notepad-img" draggable={false} />
            </button>
          </div>

          <div className="clock-display">{clockValue}</div>

          {timer ? (
            <div className="clock-controls">
              <button type="button" className="pill-btn" onClick={timer.running ? pause : resume}>
                {timer.running ? <PauseIcon /> : <PlayIcon />}
                {timer.running ? 'Pause' : 'Resume'}
              </button>
              <button type="button" className="pill-btn pill-btn--stop" onClick={stop}>
                <StopIcon />
                Stop
              </button>
            </div>
          ) : (
            <button type="button" className="pill-btn pill-btn--wide" onClick={() => onOpen('timer')}>
              {clockLabel}
            </button>
          )}
        </div>

        <div className="room-cat">
          <CatDisplay catId={equippedCatId} state={catState} hasBow={!!equippedAccessoryId} />
        </div>
      </div>
    </div>
  )
}

function DraggableDecoration({ deco, pos, onMove }) {
  const roomRef = useRef(null)
  const [dragging, setDragging] = useState(false)

  function handlePointerDown(e) {
    e.currentTarget.setPointerCapture(e.pointerId)
    setDragging(true)
  }

  function handlePointerMove(e) {
    if (!dragging) return
    const scene = e.currentTarget.parentElement
    const rect = scene.getBoundingClientRect()
    let x = ((e.clientX - rect.left) / rect.width) * 100
    let y = ((e.clientY - rect.top) / rect.height) * 100
    x = Math.min(96, Math.max(2, x))
    y = Math.min(94, Math.max(30, y))
    onMove(x, y)
  }

  function handlePointerUp(e) {
    setDragging(false)
    e.currentTarget.releasePointerCapture(e.pointerId)
  }

  return (
    <div
      ref={roomRef}
      className={`room-decoration${dragging ? ' room-decoration--dragging' : ''}`}
      style={{
        left: `${pos.x}%`,
        top: `${pos.y}%`,
        width: deco.width,
        height: deco.height,
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      title="Drag to reposition"
    >
      <DecorationArt id={deco.id} name={deco.name} />
    </div>
  )
}

// Decoration art now comes straight from /public/decorations/<id>.png
function DecorationArt({ id, name }) {
  return (
    <img
      src={`/decorations/${id}.png`}
      alt={name}
      className="decoration-sprite"
      draggable={false}
    />
  )
}
