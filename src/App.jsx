import { useState } from 'react'
import Room from './components/Room.jsx'
import ShopPanel from './components/ShopPanel.jsx'
import TimerModal from './components/TimerModal.jsx'
import NotepadModal from './components/NotepadModal.jsx'
import CalendarModal from './components/CalendarModal.jsx'
import DayTimelineModal from './components/DayTimelineModal.jsx'
import SettingsModal from './components/SettingsModal.jsx'
import './App.css'

// `overlay` shapes:
//   null
//   { view: 'shop' }
//   { view: 'timer' }
//   { view: 'notepad' }
//   { view: 'calendar' }
//   { view: 'day', date: 'YYYY-MM-DD' }
//   { view: 'settings' }
export default function App() {
  const [overlay, setOverlay] = useState(null)

  function closeOverlay() {
    setOverlay(null)
  }

  function openDay(date) {
    setOverlay({ view: 'day', date })
  }

  function backToCalendar() {
    setOverlay({ view: 'calendar' })
  }

  return (
    <div className="app-viewport">
      <Room onOpen={(view) => setOverlay({ view })} />

      {overlay?.view === 'shop' && <ShopPanel onClose={closeOverlay} />}
      {overlay?.view === 'timer' && <TimerModal onClose={closeOverlay} />}
      {overlay?.view === 'notepad' && <NotepadModal onClose={closeOverlay} />}
      {overlay?.view === 'calendar' && (
        <CalendarModal onClose={closeOverlay} onSelectDate={openDay} />
      )}
      {overlay?.view === 'day' && (
        <DayTimelineModal date={overlay.date} onClose={closeOverlay} onBack={backToCalendar} />
      )}
      {overlay?.view === 'settings' && <SettingsModal onClose={closeOverlay} />}
    </div>
  )
}
