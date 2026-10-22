import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback(({ type = 'info', title, message, duration = 3500 }) => {
    const id = Date.now() + Math.random().toString(36).substring(2, 9);
    const newToast = { id, type, title, message };

    setToasts((prev) => [...prev, newToast]);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
    return id;
  }, [removeToast]);

  const toast = {
    success: (message, title = 'Success') => addToast({ type: 'success', title, message }),
    error: (message, title = 'Error') => addToast({ type: 'error', title, message }),
    info: (message, title = 'Notice') => addToast({ type: 'info', title, message }),
    warning: (message, title = 'Warning') => addToast({ type: 'warning', title, message }),
    dismiss: removeToast,
  };

  return (
    <ToastContext.Provider value={toast}>
      {children}
      {/* Toast container floating at bottom right */}
      <div
        className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-4 sm:px-0"
        aria-live="polite"
      >
        {toasts.map((item) => (
          <div
            key={item.id}
            className={`
              pointer-events-auto flex items-start gap-3 p-4 rounded-2xl shadow-card border
              animate-slide-up transition-all bg-white
              ${item.type === 'success' ? 'border-emerald-200 text-emerald-950' : ''}
              ${item.type === 'error' ? 'border-red-200 text-red-950' : ''}
              ${item.type === 'warning' ? 'border-amber-200 text-amber-950' : ''}
              ${item.type === 'info' ? 'border-brand-200 text-cafe-text' : ''}
            `}
            role="status"
          >
            <span className="shrink-0 mt-0.5">
              {item.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-600" />}
              {item.type === 'error' && <AlertCircle className="w-5 h-5 text-red-600" />}
              {item.type === 'warning' && <AlertCircle className="w-5 h-5 text-amber-600" />}
              {item.type === 'info' && <Info className="w-5 h-5 text-brand-600" />}
            </span>

            <div className="flex-1 min-w-0">
              {item.title && <h5 className="text-sm font-semibold leading-tight">{item.title}</h5>}
              {item.message && <p className="text-xs text-cafe-subtext mt-0.5 leading-relaxed">{item.message}</p>}
            </div>

            <button
              type="button"
              onClick={() => removeToast(item.id)}
              className="shrink-0 p-1 rounded-lg text-cafe-subtext hover:text-cafe-text hover:bg-cafe-muted transition-colors"
              aria-label="Dismiss toast"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    // Graceful fallback if used outside provider
    return {
      success: (msg) => console.log('Toast [success]:', msg),
      error: (msg) => console.error('Toast [error]:', msg),
      info: (msg) => console.info('Toast [info]:', msg),
      warning: (msg) => console.warn('Toast [warning]:', msg),
      dismiss: () => {},
    };
  }
  return context;
};

export default ToastProvider;
