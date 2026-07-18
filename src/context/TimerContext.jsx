import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'
import { TIMER_TYPES } from '../data/constants'
import { useStore } from './StoreContext.jsx'

const TimerContext = createContext(null)

const initialState = null
// Shape while active:
// {
//   type, labelId, running,
//   phase: 'focus' | 'break'          // only meaningful for pomodoro
//   remainingSeconds,                  // countdown / pomodoro / break
//   elapsedSeconds,                    // stopwatch only
//   focusMinutes, breakMinutes,        // pomodoro config
//   totalSessions, sessionsDone,       // pomodoro config
// }

export function TimerProvider({ children }) {
  const { recordSession } = useStore()
  const [timer, setTimer] = useState(initialState)
  const intervalRef = useRef(null)

  const clearTick = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])

  function start({ type, labelId, focusMinutes, breakMinutes, totalSessions }) {
    clearTick()
    const seq = Date.now()
    if (type === TIMER_TYPES.STOPWATCH) {
      setTimer({ type, labelId, running: true, elapsedSeconds: 0, seq })
    } else if (type === TIMER_TYPES.COUNTDOWN) {
      setTimer({
        type,
        labelId,
        running: true,
        phase: 'focus',
        remainingSeconds: Math.round(focusMinutes * 60),
        focusMinutes,
        seq,
      })
    } else if (type === TIMER_TYPES.BREAK) {
      setTimer({
        type,
        labelId,
        running: true,
        phase: 'break',
        remainingSeconds: Math.round(breakMinutes * 60),
        breakMinutes,
        seq,
      })
    } else if (type === TIMER_TYPES.POMODORO) {
      setTimer({
        type,
        labelId,
        running: true,
        phase: 'focus',
        remainingSeconds: Math.round(focusMinutes * 60),
        focusMinutes,
        breakMinutes,
        totalSessions,
        sessionsDone: 0,
        seq,
      })
    }
  }

  function pause() {
    setTimer((t) => (t ? { ...t, running: false } : t))
  }

  function resume() {
    setTimer((t) => (t ? { ...t, running: true } : t))
  }

  /** Stop early. Whatever elapsed/focus time has accrued so far still gets recorded (minus current, unfinished second). */
  function stop() {
    if (!timer) return
    if (timer.type === TIMER_TYPES.STOPWATCH) {
      const minutes = timer.elapsedSeconds / 60
      if (minutes > 0) {
        recordSession({ type: timer.type, labelId: timer.labelId, minutes })
      }
    } else if (timer.phase === 'focus') {
      const plannedSeconds = Math.round(timer.focusMinutes * 60)
      const elapsedMinutes = Math.max(0, (plannedSeconds - timer.remainingSeconds) / 60)
      if (elapsedMinutes > 0) {
        recordSession({ type: timer.type, labelId: timer.labelId, minutes: elapsedMinutes })
      }
    }
    clearTick()
    setTimer(null)
  }

  function dismiss() {
    clearTick()
    setTimer(null)
  }

  // The actual 1-second tick loop.
  useEffect(() => {
    if (!timer || !timer.running) {
      clearTick()
      return
    }
    intervalRef.current = setInterval(() => {
      setTimer((current) => {
        if (!current) return current

        if (current.type === TIMER_TYPES.STOPWATCH) {
          return { ...current, elapsedSeconds: current.elapsedSeconds + 1 }
        }

        const next = current.remainingSeconds - 1
        if (next > 0) {
          return { ...current, remainingSeconds: next }
        }

        // A phase just completed.
        if (current.type === TIMER_TYPES.COUNTDOWN) {
          recordSession({ type: current.type, labelId: current.labelId, minutes: current.focusMinutes })
          return { ...current, remainingSeconds: 0, running: false, finished: true }
        }

        if (current.type === TIMER_TYPES.BREAK) {
          recordSession({
            type: current.type,
            labelId: current.labelId,
            minutes: current.breakMinutes,
            isBreak: true,
          })
          return { ...current, remainingSeconds: 0, running: false, finished: true }
        }

        if (current.type === TIMER_TYPES.POMODORO) {
          if (current.phase === 'focus') {
            recordSession({
              type: current.type,
              labelId: current.labelId,
              minutes: current.focusMinutes,
            })
            const sessionsDone = current.sessionsDone + 1
            if (sessionsDone >= current.totalSessions) {
              return { ...current, remainingSeconds: 0, running: false, finished: true, sessionsDone }
            }
            return {
              ...current,
              phase: 'break',
              remainingSeconds: Math.round(current.breakMinutes * 60),
              sessionsDone,
            }
          }
          // phase === 'break' completed -> back to focus
          recordSession({
            type: current.type,
            labelId: current.labelId,
            minutes: current.breakMinutes,
            isBreak: true,
          })
          return {
            ...current,
            phase: 'focus',
            remainingSeconds: Math.round(current.focusMinutes * 60),
          }
        }

        return current
      })
    }, 1000)

    return clearTick
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timer?.running, timer?.seq])

  return (
    <TimerContext.Provider value={{ timer, start, pause, resume, stop, dismiss }}>
      {children}
    </TimerContext.Provider>
  )
}

export function useTimer() {
  const ctx = useContext(TimerContext)
  if (!ctx) throw new Error('useTimer must be used inside <TimerProvider>')
  return ctx
}
