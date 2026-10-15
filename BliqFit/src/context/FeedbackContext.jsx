import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';
import ToastStack from '../components/feedback/ToastStack';
import ConfirmDialog from '../components/feedback/ConfirmDialog';

const FeedbackContext = createContext(null);

let toastSeq = 0;

export function FeedbackProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const [confirmState, setConfirmState] = useState(null);
  const resolverRef = useRef(null);

  const dismiss = useCallback((id) => {
    setToasts((current) => current.filter((item) => item.id !== id));
  }, []);

  const push = useCallback((variant, message, options = {}) => {
    const id = `toast-${++toastSeq}`;
    const duration = options.duration ?? (variant === 'error' ? 6000 : 3500);
    setToasts((current) => [...current, { id, variant, message, title: options.title }]);
    if (duration > 0) {
      window.setTimeout(() => dismiss(id), duration);
    }
    return id;
  }, [dismiss]);

  const toast = useMemo(() => ({
    success: (message, options) => push('success', message, options),
    error: (message, options) => push('error', message, options),
    warning: (message, options) => push('warning', message, options),
    info: (message, options) => push('info', message, options),
    dismiss,
  }), [push, dismiss]);

  // Promise-based replacement for window.confirm so destructive actions get a
  // styled dialog instead of the browser default.
  const confirm = useCallback((options = {}) => {
    return new Promise((resolve) => {
      resolverRef.current = resolve;
      setConfirmState({
        title: options.title || 'Are you sure?',
        message: options.message || 'This action cannot be undone.',
        confirmLabel: options.confirmLabel || 'Confirm',
        cancelLabel: options.cancelLabel || 'Cancel',
        variant: options.variant || 'danger',
      });
    });
  }, []);

  const settleConfirm = useCallback((result) => {
    setConfirmState(null);
    const resolve = resolverRef.current;
    resolverRef.current = null;
    if (resolve) resolve(result);
  }, []);

  const value = useMemo(() => ({ toast, confirm }), [toast, confirm]);

  return (
    <FeedbackContext.Provider value={value}>
      {children}
      <ToastStack toasts={toasts} onDismiss={dismiss} />
      <ConfirmDialog
        open={Boolean(confirmState)}
        {...(confirmState || {})}
        onConfirm={() => settleConfirm(true)}
        onCancel={() => settleConfirm(false)}
      />
    </FeedbackContext.Provider>
  );
}

export function useFeedback() {
  const ctx = useContext(FeedbackContext);
  if (!ctx) throw new Error('useFeedback must be used inside FeedbackProvider');
  return ctx;
}

export const useToast = () => useFeedback().toast;
export const useConfirm = () => useFeedback().confirm;
