import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

/**
 * 2026 Slide-over Drawer Component.
 * High-contrast, clean 1px border, Lovelo Black title, Clash Grotesk controls.
 */
export const Drawer = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  footer,
  width = 'max-w-md sm:max-w-lg',
  className = '',
}) => {
  const drawerRef = useRef(null);
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

      drawerRef.current?.focus();

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
      className="fixed inset-0 z-50 overflow-hidden"
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? 'drawer-title' : undefined}
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-200 animate-fade-in"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer Container */}
      <div className="fixed inset-y-0 right-0 flex max-w-full pl-6 sm:pl-10">
        <div
          ref={drawerRef}
          tabIndex={-1}
          className={`
            w-screen ${width} bg-white shadow-2xl border-l border-stone-200
            flex flex-col h-full animate-drawer-in focus:outline-none ${className}
          `}
        >
          {/* Header */}
          <div className="flex items-start justify-between px-6 py-5 border-b border-stone-100 bg-[#F8F9FA]/70">
            <div>
              {title && (
                <h3 id="drawer-title" className="text-xl sm:text-2xl font-black font-title uppercase tracking-tight text-black">
                  {title}
                </h3>
              )}
              {subtitle && (
                <p className="text-xs text-stone-500 font-sans mt-0.5">{subtitle}</p>
              )}
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 -mr-1 rounded-lg text-stone-400 hover:text-black hover:bg-stone-200/60 transition-colors focus:outline-none"
              aria-label="Close drawer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-6 thin-scrollbar">
            {children}
          </div>

          {/* Optional Footer */}
          {footer && (
            <div className="px-6 py-4 border-t border-stone-100 bg-[#F8F9FA]/40">
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Drawer;
