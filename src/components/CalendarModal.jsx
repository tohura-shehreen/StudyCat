import { useMemo, useState } from 'react'
import Modal from './Modal.jsx'
import { useStore } from '../context/StoreContext.jsx'
import { WEEKDAY_LABELS, MONTH_LABELS } from '../data/constants'
import './CalendarModal.css'

function isoDate(year, month, day) {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}

export default function CalendarModal({ onClose, onSelectDate }) {
  const { sessions } = useStore()
  const today = new Date()
  const [viewYear, setViewYear] = useState(today.getFullYear())
  const [viewMonth, setViewMonth] = useState(today.getMonth())

  const todayISO = isoDate(today.getFullYear(), today.getMonth(), today.getDate())

  const daysWithSessions = useMemo(() => {
    const set = new Set()
    sessions.forEach((s) => set.add(s.date))
    return set
  }, [sessions])

  const firstWeekday = new Date(viewYear, viewMonth, 1).getDay()
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate()

  const cells = []
  for (let i = 0; i < firstWeekday; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(d)

  function changeMonth(delta) {
    let m = viewMonth + delta
    let y = viewYear
    if (m < 0) {
      m = 11
      y -= 1
    } else if (m > 11) {
      m = 0
      y += 1
    }
    setViewMonth(m)
    setViewYear(y)
  }

  return (
    <Modal onClose={onClose} variant="sage" width={640}>
      <div className="calendar-modal">
        <div className="calendar-header">
          <button type="button" className="calendar-nav-btn" onClick={() => changeMonth(-1)}>
            ‹
          </button>
          <h2>
            {MONTH_LABELS[viewMonth]} {viewYear}
          </h2>
          <button type="button" className="calendar-nav-btn" onClick={() => changeMonth(1)}>
            ›
          </button>
        </div>

        <div className="calendar-weekdays">
          {WEEKDAY_LABELS.map((w) => (
            <span key={w}>{w}</span>
          ))}
        </div>

        <div className="calendar-grid">
          {cells.map((day, idx) => {
            if (day === null) return <span key={`empty-${idx}`} />
            const iso = isoDate(viewYear, viewMonth, day)
            const isToday = iso === todayISO
            const hasSessions = daysWithSessions.has(iso)
            return (
              <button
                key={iso}
                type="button"
                className={`calendar-day${isToday ? ' calendar-day--today' : ''}`}
                onClick={() => onSelectDate(iso)}
              >
                {day}
                {hasSessions && <span className="calendar-dot" />}
              </button>
            )
          })}
        </div>
      </div>
    </Modal>
  )
}
