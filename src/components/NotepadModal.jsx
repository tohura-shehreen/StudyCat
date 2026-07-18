import { useState } from 'react'
import Modal from './Modal.jsx'
import { useStore } from '../context/StoreContext.jsx'
import { NOTEPAD_SWATCHES, swatchHex } from '../data/constants'
import './NotepadModal.css'

export default function NotepadModal({ onClose }) {
  const { focusLabels, setLabelForColor, setActiveNotepadColor } = useStore()
  const [selectedId, setSelectedId] = useState(NOTEPAD_SWATCHES[0].id)
  const [name, setName] = useState(labelNameFor(focusLabels, NOTEPAD_SWATCHES[0].id))

  function pickSwatch(id) {
    setSelectedId(id)
    setName(labelNameFor(focusLabels, id))
    setActiveNotepadColor(id)
  }

  function handleSave() {
    setLabelForColor(selectedId, name)
  }

  return (
    <Modal onClose={onClose} variant="blue" width={520}>
      <div className="notepad-modal">
        <div className="notepad-form">
          <input
            type="text"
            className="notepad-input"
            placeholder="Name of the focus"
            value={name}
            maxLength={18}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSave()}
          />
          <button type="button" className="notepad-save-btn" onClick={handleSave}>
            Save
          </button>
        </div>

        <div className="notepad-grid">
          {NOTEPAD_SWATCHES.map((swatch) => {
            const label = focusLabels.find((l) => l.color === swatch.id)
            return (
              <div key={swatch.id} className="notepad-cell">
                <button
                  type="button"
                  className={`notepad-swatch${selectedId === swatch.id ? ' notepad-swatch--active' : ''}`}
                  onClick={() => pickSwatch(swatch.id)}
                  aria-label="Choose this color"
                >
                  <img
                    src={`/notepad/${swatch.id}.png`}
                    alt=""
                    className="notepad-swatch-img"
                    draggable={false}
                  />
                </button>
                {label?.name ? (
                  <span className="notepad-chip" style={{ background: swatchHex(swatch.id) }}>
                    {label.name}
                  </span>
                ) : null}
              </div>
            )
          })}
        </div>

        <p className="notepad-note">
          One more color ("slate") is still a broken export — see{' '}
          <code>src/assets/README.md</code>.
        </p>
      </div>
    </Modal>
  )
}

function labelNameFor(labels, swatchId) {
  return labels.find((l) => l.color === swatchId)?.name || ''
}
