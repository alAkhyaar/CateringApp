import Modal from './Modal';
import { HiOutlineExclamation } from 'react-icons/hi';

const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Konfirmasi',
  message = 'Apakah Anda yakin?',
  confirmText = 'Ya, Lanjutkan',
  cancelText = 'Batal',
  type = 'danger',
}) => {
  const typeStyles = {
    danger: {
      icon: 'bg-red-100 text-red-600',
      button: 'btn-danger',
    },
    warning: {
      icon: 'bg-amber-100 text-amber-600',
      button: 'bg-amber-500 text-white hover:bg-amber-600',
    },
    info: {
      icon: 'bg-blue-100 text-blue-600',
      button: 'btn-primary',
    },
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
      <div className="text-center">
        <div
          className={`w-16 h-16 mx-auto rounded-full ${typeStyles[type].icon} flex items-center justify-center mb-4`}
        >
          <HiOutlineExclamation className="w-8 h-8" />
        </div>
        <p className="text-slate-600 mb-6">{message}</p>
        <div className="flex gap-3 justify-center">
          <button onClick={onClose} className="btn btn-secondary">
            {cancelText}
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`btn ${typeStyles[type].button}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmDialog;

