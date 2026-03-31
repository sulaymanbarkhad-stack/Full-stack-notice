import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle, AlertCircle, X } from 'lucide-react';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'success') => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    
    // Auto remove after 4 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 4000);
  }, []);

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div style={{
        position: 'fixed',
        bottom: '2rem',
        right: '2rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem',
        zIndex: 9999,
        pointerEvents: 'none'
      }}>
        {toasts.map((toast) => (
          <div
            key={toast.id}
            style={{
              padding: '1rem',
              borderRadius: '12px',
              backgroundColor: 'white',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              minWidth: '300px',
              maxWidth: '450px',
              border: `1px solid ${toast.type === 'success' ? '#DCFCE7' : '#FEE2E2'}`,
              animation: 'slideIn 0.3s ease-out forwards',
              pointerEvents: 'auto'
            }}
          >
            {toast.type === 'success' ? (
              <CheckCircle size={20} color="var(--success)" />
            ) : (
              <AlertCircle size={20} color="var(--error)" />
            )}
            <p style={{ flex: 1, fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-primary)' }}>
              {toast.message}
            </p>
            <button
              onClick={() => removeToast(toast.id)}
              style={{ padding: '4px', borderRadius: '50%', border: 'none', backgroundColor: 'transparent', cursor: 'pointer', color: 'var(--text-secondary)' }}
            >
              <X size={16} />
            </button>
          </div>
        ))}
      </div>
      <style>{`
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}</style>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
