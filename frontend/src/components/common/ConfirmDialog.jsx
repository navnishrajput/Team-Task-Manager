import { AlertTriangle } from 'lucide-react';
import Modal from './Modal';

const ConfirmDialog = ({ isOpen, onClose, onConfirm, title, message }) => (
  <Modal isOpen={isOpen} onClose={onClose} title="">
    <div className="text-center">
      <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <AlertTriangle className="text-red-500" size={28} />
      </div>
      <h3 className="text-lg font-semibold text-gray-800 mb-2">{title || 'Confirm'}</h3>
      <p className="text-gray-500 mb-6">{message || 'Are you sure?'}</p>
      <div className="flex gap-3 justify-center">
        <button onClick={onClose} className="btn-secondary px-6">Cancel</button>
        <button onClick={onConfirm} className="btn-danger px-6">Delete</button>
      </div>
    </div>
  </Modal>
);
export default ConfirmDialog;