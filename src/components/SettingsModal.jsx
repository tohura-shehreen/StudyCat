import Modal from './Modal.jsx'
import './SettingsModal.css'

export default function SettingsModal({ onClose }) {
  function handleReset() {
    const sure = window.confirm(
      'This clears all StudyCat data on this device — fish, cats, decorations, focus labels, and your whole session history. This cannot be undone. Continue?',
    )
    if (sure) {
      Object.keys(localStorage)
        .filter((k) => k.startsWith('studycat.'))
        .forEach((k) => localStorage.removeItem(k))
      window.location.reload()
    }
  }

  return (
    <Modal onClose={onClose} variant="blue" width={440}>
      <div className="settings-modal">
        <h2>Settings</h2>
        <p className="settings-note">
          StudyCat saves everything on this device only — there's no account and nothing is
          sent anywhere. Clearing your browser data will also clear your progress.
        </p>
        <button type="button" className="settings-reset-btn" onClick={handleReset}>
          Reset all data
        </button>
      </div>
    </Modal>
  )
}
