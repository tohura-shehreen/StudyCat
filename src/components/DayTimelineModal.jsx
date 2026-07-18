import { useMemo } from 'react'
import Modal from './Modal.jsx'
import { useStore } from '../context/StoreContext.jsx'
import { swatchHex } from '../data/constants'
import './DayTimelineModal.css'

const AM_HOURS = Array.from({ length: 12 }, (_, i) => i) // 0..11
const PM_HOURS = Array.from({ length: 12 }, (_, i) => i) // displayed as 12,01..11

function formatMonthTitle(dateISO) {
  const [y, m] = dateISO.split('-')
  const d = new Date(Number(y), Number(m) - 1, 1)
  return d.toLocaleDateString(undefined, { month: 'long', year: 'numeric' })
}

function buildBlocks(sessions, focusLabels) {
  const am = []
  const pm = []

  sessions.forEach((session) => {
    const end = new Date(session.recordedAt)
    const start = new Date(end.getTime() - session.minutes * 60000)

    // Simplification: clip to the calendar day of `end` so we don't have to
    // special-case sessions that cross midnight.
    const dayStart = new Date(end)
    dayStart.setHours(0, 0, 0, 0)
    const clippedStart = start < dayStart ? dayStart : start

    const startHourFrac = clippedStart.getHours() + clippedStart.getMinutes() / 60
    const endHourFrac = end.getHours() + end.getMinutes() / 60 || 24

    const label = focusLabels.find((l) => l.id === session.labelId)
    const color = session.isBreak ? '#c9c2b6' : swatchHex(label?.color)
    const name = session.isBreak ? 'Break' : label?.name || session.type

    // Split across the AM/PM boundary (hour 12) if needed.
    const segments = []
    if (startHourFrac < 12 && endHourFrac <= 12) {
      segments.push({ col: 'am', from: startHourFrac, to: endHourFrac })
    } else if (startHourFrac >= 12) {
      segments.push({ col: 'pm', from: startHourFrac - 12, to: Math.max(endHourFrac - 12, startHourFrac - 12 + 0.05) })
    } else {
      segments.push({ col: 'am', from: startHourFrac, to: 12 })
      segments.push({ col: 'pm', from: 0, to: Math.max(endHourFrac - 12, 0.05) })
    }

    segments.forEach((seg) => {
      const block = {
        key: `${session.id}-${seg.col}`,
        top: (seg.from / 12) * 100,
        height: Math.max(((seg.to - seg.from) / 12) * 100, 3),
        color,
        name,
        minutes: session.minutes,
      }
      if (seg.col === 'am') am.push(block)
      else pm.push(block)
    })
  })

  return { am, pm }
}

export default function DayTimelineModal({ date, onClose, onBack }) {
  const { sessionsForDate, focusLabels } = useStore()
  const sessions = sessionsForDate(date)

  const { am, pm } = useMemo(() => buildBlocks(sessions, focusLabels), [sessions, focusLabels])

  const totalFocusMinutes = sessions
    .filter((s) => !s.isBreak)
    .reduce((sum, s) => sum + s.minutes, 0)

  return (
    <Modal onClose={onClose} onBack={onBack} variant="sage" width={680}>
      <div className="day-modal">
        <div className="day-modal-header">
          <h2>{formatMonthTitle(date)}</h2>
          <span className="day-modal-subtitle">
            {new Date(`${date}T00:00:00`).toLocaleDateString(undefined, {
              weekday: 'long',
              day: 'numeric',
            })}
            {' · '}
            {totalFocusMinutes} min focused
          </span>
        </div>

        {sessions.length === 0 ? (
          <p className="day-modal-empty">No focus sessions recorded for this day yet.</p>
        ) : (
          <div className="day-timeline">
            <TimelineColumn hours={AM_HOURS} ampm="AM" blocks={am} />
            <TimelineColumn hours={PM_HOURS} ampm="PM" blocks={pm} />
          </div>
        )}
      </div>
    </Modal>
  )
}

function TimelineColumn({ hours, ampm, blocks }) {
  return (
    <div className="timeline-column">
      <div className="timeline-column-label">{ampm}</div>
      <div className="timeline-track">
        {hours.map((h) => (
          <div className="timeline-row" key={h}>
            <span className="timeline-hour">{String(ampm === 'PM' && h === 0 ? 12 : h).padStart(2, '0')}</span>
          </div>
        ))}
        {blocks.map((block) => (
          <div
            key={block.key}
            className="timeline-block"
            style={{ top: `${block.top}%`, height: `${block.height}%`, background: block.color }}
            title={`${block.name} — ${block.minutes} min`}
          >
            <span>{block.name}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
