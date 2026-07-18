import { CloseIcon, BackIcon } from './Icons.jsx'
import './Modal.css'

export default function Modal({ children, onClose, onBack, variant = 'blue', width = 560 }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className={`modal-panel modal-panel--${variant}`}
        style={{ maxWidth: width }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-panel-topbar">
          {onBack ? (
            <button type="button" className="modal-icon-btn" onClick={onBack} aria-label="Back">
              <BackIcon />
            </button>
          ) : (
            <span />
          )}
          <button type="button" className="modal-icon-btn" onClick={onClose} aria-label="Close">
            <CloseIcon />
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}
