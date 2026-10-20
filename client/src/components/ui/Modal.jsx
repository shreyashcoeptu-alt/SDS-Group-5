import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

/**
 * 2026 Accessible Modal Dialog.
 * Scroll containment, ESC close, backdrop dismiss, Clash Grotesk & Lovelo styling.
 */
export const Modal = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  maxWidth = 'max-w-lg',
  showClose = true,
  className = '',
}) => {
  const dialogRef = useRef(null);
  const previouslyFocusedElement = useRef(null);

  useEffect(() => {
    if (isOpen) {
      previouslyFocusedElement.current = document.activeElement;
      const handleKeyDown = (e) => {
        if (e.key === 'Escape') {
          onClose();
        }
      };
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';

      dialogRef.current?.focus();

      return () => {
        window.removeEventListener('keydown', handleKeyDown);
        document.body.style.overflow = '';
        if (previouslyFocusedElement.current && previouslyFocusedElement.current.focus) {
          previouslyFocusedElement.current.focus();
        }
      };
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? 'modal-title' : undefined}
    >
      {/* Dark backdrop overlay */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-200 animate-fade-in"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog Window */}
      <div
        ref={dialogRef}
        tabIndex={-1}
        className={`
          relative w-full ${maxWidth} bg-white rounded-2xl shadow-modal
          border border-stone-200 overflow-hidden z-10 my-auto
          animate-slide-up focus:outline-none ${className}
        `}
      >
        {(title || showClose) && (
          <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100 bg-[#F8F9FA]/60">
            <div>
              {title && (
                <h3 id="modal-title" className="text-lg sm:text-xl font-black font-title uppercase tracking-tight text-black">
                  {title}
                </h3>
              )}
              {subtitle && (
                <p className="text-xs text-stone-500 font-sans mt-0.5">{subtitle}</p>
              )}
            </div>

            {showClose && (
              <button
                type="button"
                onClick={onClose}
                className="p-1.5 -mr-1 rounded-lg text-stone-400 hover:text-black hover:bg-stone-200/60 transition-colors focus:outline-none"
                aria-label="Close dialog"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        )}

        <div className="p-6 max-h-[82vh] overflow-y-auto thin-scrollbar">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
