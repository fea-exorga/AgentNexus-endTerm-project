function SuccessPopup({ message, onClose }) {
  if (!message) {
    return null
  }

  return (
    <div className="modal-backdrop" onClick={onClose} role="presentation">
      <div
        aria-live="polite"
        className="success-popup"
        onClick={(event) => event.stopPropagation()}
        role="alertdialog"
      >
        <div className="popup-mark">Done</div>
        <h3>{message.title}</h3>
        <p>{message.body}</p>
        <button className="primary-button" onClick={onClose} type="button">
          Close
        </button>
      </div>
    </div>
  )
}

export default SuccessPopup
