import React from 'react';
import Modal from './Modal';
import Button from './Button';
import { AlertTriangle } from 'lucide-react';

/**
 * Accessible confirmation dialog for destructive actions (e.g., deleting a menu item).
 */
export const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  itemName,
  description = 'Are you sure you want to proceed? This action cannot be undone.',
  confirmText = 'Delete Item',
  cancelText = 'Cancel',
  isLoading = false,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={isLoading ? () => {} : onClose}
      maxWidth="max-w-md"
      showClose={!isLoading}
    >
      <div className="flex flex-col items-center text-center">
        <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center mb-4">
          <AlertTriangle className="w-6 h-6" />
        </div>

        <h3 className="text-lg font-bold font-display text-cafe-text">
          {title}
        </h3>

        {itemName && (
          <div className="my-2 px-3 py-1 bg-red-50 text-red-800 text-sm font-semibold rounded-lg border border-red-200 break-words max-w-full">
            "{itemName}"
          </div>
        )}

        <p className="text-sm text-cafe-subtext mt-1 leading-relaxed">
          {description}
        </p>

        <div className="flex items-center justify-end gap-3 w-full mt-6 pt-4 border-t border-cafe-border">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
            className="flex-1"
          >
            {cancelText}
          </Button>

          <Button
            variant="danger"
            onClick={onConfirm}
            isLoading={isLoading}
            className="flex-1"
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmDialog;
