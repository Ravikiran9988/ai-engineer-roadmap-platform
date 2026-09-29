import React, { createContext, useContext, useState, useCallback } from 'react';
import { X } from 'lucide-react';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const toast = useCallback(({ title, description, variant = 'default', duration = 5000 }) => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts(prev => [...prev, { id, title, description, variant }]);

    if (duration) {
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== id));
      }, duration);
    }
  }, []);

  const dismiss = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed bottom-0 right-0 z-50 p-4 md:p-6 space-y-4 w-full md:w-auto max-w-sm flex flex-col items-end pointer-events-none">
        {toasts.map(t => (
          <div 
            key={t.id} 
            className={`pointer-events-auto flex w-full flex-col gap-1 rounded-lg border p-4 pr-8 shadow-lg transition-all animate-in slide-in-from-bottom-5 ${
              t.variant === 'destructive' 
                ? 'border-destructive bg-destructive text-destructive-foreground'
                : 'border-border bg-card text-foreground'
            }`}
          >
            {t.title && <div className="text-sm font-semibold">{t.title}</div>}
            {t.description && <div className="text-sm opacity-90">{t.description}</div>}
            <button
              onClick={() => dismiss(t.id)}
              className="absolute right-2 top-2 rounded-md p-1 opacity-70 transition-opacity hover:opacity-100 focus:outline-none"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used within ToastProvider");
  return context;
}
