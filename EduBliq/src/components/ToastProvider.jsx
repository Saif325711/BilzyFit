import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { CheckCircle2, AlertTriangle, Info, XCircle, X } from 'lucide-react';

/**
 * Global Toast Notification System for EduBliq
 *
 * Usage (anywhere in the app):
 *   const toast = useToast();
 *   toast.success('Fee receipt generated.');
 *   toast.error('Payment failed.', { title: 'Counter Desk' });
 *
 * Non-React code (e.g. apiClient) can dispatch events:
 *   window.dispatchEvent(new CustomEvent('edubliq:toast', {
 *     detail: { type: 'error', message: 'Session expired.' }
 *   }));
 */

const ToastContext = createContext(null);

const TOAST_STYLES = {
  success: { icon: CheckCircle2, color: '#10b981', bg: '#ecfdf5', border: '#a7f3d0' },
  error: { icon: XCircle, color: '#ef4444', bg: '#fef2f2', border: '#fecaca' },
  warning: { icon: AlertTriangle, color: '#f59e0b', bg: '#fffbeb', border: '#fde68a' },
  info: { icon: Info, color: '#3b82f6', bg: '#eff6ff', border: '#bfdbfe' }
};

let toastIdCounter = 0;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const dismissToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const pushToast = useCallback((type, message, options = {}) => {
    const id = ++toastIdCounter;
    const duration = options.duration ?? (type === 'error' ? 7000 : 4500);
    setToasts(prev => [
      ...prev.slice(-4), // keep at most 5 on screen
      { id, type: TOAST_STYLES[type] ? type : 'info', message, title: options.title, duration }
    ]);
    if (duration > 0) {
      setTimeout(() => dismissToast(id), duration);
    }
    return id;
  }, [dismissToast]);

  const toast = {
    success: (msg, opts) => pushToast('success', msg, opts),
    error: (msg, opts) => pushToast('error', msg, opts),
    warning: (msg, opts) => pushToast('warning', msg, opts),
    info: (msg, opts) => pushToast('info', msg, opts),
    dismiss: dismissToast
  };

  // Bridge for non-React modules (apiClient, services) to raise toasts
  useEffect(() => {
    const handler = (e) => {
      const d = e.detail || {};
      pushToast(d.type, d.message, { title: d.title, duration: d.duration });
    };
    window.addEventListener('edubliq:toast', handler);
    return () => window.removeEventListener('edubliq:toast', handler);
  }, [pushToast]);

  return (
    <ToastContext.Provider value={toast}>
      {children}
      {/* Fixed toast stack — top right, above all portal chrome */}
      <div style={{
        position: 'fixed', top: '18px', right: '18px', zIndex: 100000,
        display: 'flex', flexDirection: 'column', gap: '10px',
        width: 'min(360px, calc(100vw - 36px))', pointerEvents: 'none'
      }}>
        {toasts.map(t => {
          const style = TOAST_STYLES[t.type] || TOAST_STYLES.info;
          const Icon = style.icon;
          return (
            <div
              key={t.id}
              role="status"
              style={{
                pointerEvents: 'auto',
                backgroundColor: style.bg,
                border: `1px solid ${style.border}`,
                borderLeft: `4px solid ${style.color}`,
                borderRadius: '10px',
                padding: '12px 14px',
                boxShadow: '0 10px 25px rgba(15, 23, 42, 0.12)',
                display: 'flex', alignItems: 'flex-start', gap: '10px',
                animation: 'edubliqToastIn 0.25s ease-out'
              }}
            >
              <Icon size={18} color={style.color} style={{ flexShrink: 0, marginTop: '1px' }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                {t.title && (
                  <div style={{ fontSize: '13px', fontWeight: '800', color: '#0f172a', marginBottom: '2px' }}>
                    {t.title}
                  </div>
                )}
                <div style={{ fontSize: '13px', color: '#334155', lineHeight: 1.4, wordBreak: 'break-word' }}>
                  {t.message}
                </div>
              </div>
              <button
                onClick={() => dismissToast(t.id)}
                aria-label="Dismiss notification"
                style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: '#94a3b8', padding: 0, display: 'flex', flexShrink: 0
                }}
              >
                <X size={15} />
              </button>
            </div>
          );
        })}
      </div>
      {/* Keyframes injected once */}
      <style>{`
        @keyframes edubliqToastIn {
          from { opacity: 0; transform: translateX(24px); }
          to { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  // Safe fallback: no-op so components never crash if provider is missing
  return ctx || {
    success: () => {}, error: () => {}, warning: () => {}, info: () => {}, dismiss: () => {}
  };
}
