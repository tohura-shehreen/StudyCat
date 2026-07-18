import { useState } from 'react'
import Modal from './Modal.jsx'
import { useStore } from '../context/StoreContext.jsx'
import { useTimer } from '../context/TimerContext.jsx'
import { TIMER_TYPES, TIMER_LIMITS, swatchHex } from '../data/constants'
import { CountdownIcon, TomatoIcon, StopwatchIcon, BreakIcon, PlayIcon } from './Icons.jsx'
import './TimerModal.css'

const TABS = [
  { type: TIMER_TYPES.COUNTDOWN, icon: CountdownIcon, label: 'Countdown' },
  { type: TIMER_TYPES.POMODORO, icon: TomatoIcon, label: 'Pomodoro' },
  { type: TIMER_TYPES.STOPWATCH, icon: StopwatchIcon, label: 'Stopwatch' },
  { type: TIMER_TYPES.BREAK, icon: BreakIcon, label: 'Break' },
]

export default function TimerModal({ onClose }) {
  const { focusLabels, lastTimerType, setLastTimerType } = useStore()
  const { start } = useTimer()

  const [activeType, setActiveType] = useState(lastTimerType || TIMER_TYPES.COUNTDOWN)
  const [labelId, setLabelId] = useState(focusLabels[0]?.id || null)

  function pickType(type) {
    setActiveType(type)
    setLastTimerType(type)
  }

  const countdownLimits = TIMER_LIMITS[TIMER_TYPES.COUNTDOWN]
  const pomodoroLimits = TIMER_LIMITS[TIMER_TYPES.POMODORO]
  const breakLimits = TIMER_LIMITS[TIMER_TYPES.BREAK]

  const [countdownMinutes, setCountdownMinutes] = useState(countdownLimits.focusDefault)
  const [pomodoroFocus, setPomodoroFocus] = useState(pomodoroLimits.focusDefault)
  const [pomodoroBreak, setPomodoroBreak] = useState(pomodoroLimits.breakDefault)
  const [pomodoroSessions, setPomodoroSessions] = useState(pomodoroLimits.sessionsDefault)
  const [breakMinutes, setBreakMinutes] = useState(breakLimits.breakDefault)

  function handleStart() {
    if (activeType === TIMER_TYPES.COUNTDOWN) {
      start({ type: activeType, labelId, focusMinutes: countdownMinutes })
    } else if (activeType === TIMER_TYPES.POMODORO) {
      start({
        type: activeType,
        labelId,
        focusMinutes: pomodoroFocus,
        breakMinutes: pomodoroBreak,
        totalSessions: pomodoroSessions,
      })
    } else if (activeType === TIMER_TYPES.STOPWATCH) {
      start({ type: activeType, labelId })
    } else if (activeType === TIMER_TYPES.BREAK) {
      start({ type: activeType, labelId, breakMinutes })
    }
    onClose()
  }

  return (
    <Modal onClose={onClose} variant="blue" width={520}>
      <div className="timer-modal">
        <div className="timer-tabs">
          {TABS.map(({ type, icon: Icon, label }) => (
            <button
              key={type}
              type="button"
              className={`timer-tab${activeType === type ? ' timer-tab--active' : ''}`}
              onClick={() => pickType(type)}
              aria-label={label}
              title={label}
            >
              <Icon />
            </button>
          ))}
        </div>

        <div className="timer-type-name">
          {TABS.find((t) => t.type === activeType)?.label}
        </div>

        <div className="timer-body">
          {activeType === TIMER_TYPES.COUNTDOWN && (
            <SliderRow
              label="Focus"
              value={countdownMinutes}
              min={countdownLimits.focusMin}
              max={countdownLimits.focusMax}
              unit="min"
              onChange={setCountdownMinutes}
            />
          )}

          {activeType === TIMER_TYPES.POMODORO && (
            <>
              <SliderRow
                label="Focus"
                value={pomodoroFocus}
                min={pomodoroLimits.focusMin}
                max={pomodoroLimits.focusMax}
                unit="min"
                onChange={setPomodoroFocus}
              />
              <SliderRow
                label="Break"
                value={pomodoroBreak}
                min={pomodoroLimits.breakMin}
                max={pomodoroLimits.breakMax}
                unit="min"
                onChange={setPomodoroBreak}
              />
              <SliderRow
                label="Sessions"
                value={pomodoroSessions}
                min={pomodoroLimits.sessionsMin}
                max={pomodoroLimits.sessionsMax}
                unit=""
                onChange={setPomodoroSessions}
              />
            </>
          )}

          {activeType === TIMER_TYPES.STOPWATCH && (
            <p className="timer-hint">Stopwatch has no settings — just start and it counts up.</p>
          )}

          {activeType === TIMER_TYPES.BREAK && (
            <SliderRow
              label="Break"
              value={breakMinutes}
              min={breakLimits.breakMin}
              max={breakLimits.breakMax}
              unit="min"
              onChange={setBreakMinutes}
            />
          )}
        </div>

        {focusLabels.length > 0 && activeType !== TIMER_TYPES.BREAK && (
          <div className="timer-label-picker">
            <span className="timer-label-picker-title">Focus label</span>
            <div className="timer-label-swatches">
              {focusLabels.map((lbl) => (
                <button
                  key={lbl.id}
                  type="button"
                  className={`label-dot${labelId === lbl.id ? ' label-dot--active' : ''}`}
                  style={{ background: swatchHex(lbl.color) }}
                  onClick={() => setLabelId(lbl.id)}
                  title={lbl.name || 'unnamed'}
                />
              ))}
            </div>
          </div>
        )}

        <button type="button" className="pill-btn pill-btn--wide timer-start-btn" onClick={handleStart}>
          <PlayIcon /> Start
        </button>
      </div>
    </Modal>
  )
}

function SliderRow({ label, value, min, max, unit, onChange }) {
  return (
    <div className="slider-row">
      <div className="slider-row-top">
        <span>{label}</span>
        <span>
          {value} {unit}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </div>
  )
}
