const ConfirmModal = ({ isOpen, onConfirm, onCancel }) => {
  // Guard clause: If it's not open, render absolutely nothing to the DOM!
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <p className="intention-prompt">Are you sure you want to completely reset the timer?</p>
        
        <div className="modal-actions">
          {/* We reuse our existing .control-btn class so that it matches neatly */}
          <button className="control-btn" onClick={onCancel}>
            Cancel
          </button>
          <button className="control-btn danger-btn" onClick={onConfirm}>
            Yes, Reset
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;