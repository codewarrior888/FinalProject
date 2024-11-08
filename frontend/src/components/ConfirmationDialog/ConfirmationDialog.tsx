import React from 'react';
import '../../styles/ConfirmationDialog.scss';

interface ConfirmationDialogProps {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({ message, onConfirm, onCancel }) => (
  <div className="confirmation-modal-overlay">
    <div className="confirmation-modal-overlay__content">
      <h2>Внимание!</h2>
      <p>{message}</p>
      <button className="confirmation-modal-overlay__submit-button" onClick={onConfirm}>Удалить</button>
      <button className="confirmation-modal-overlay__cancel-button" onClick={onCancel}>Отменить</button>
    </div>
  </div>
);

export default ConfirmationDialog;