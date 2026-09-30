import { CheckCircle2, AlertTriangle, XCircle, Info, X } from 'lucide-react';
import clsx from 'clsx';

const variants = {
  success: { icon: CheckCircle2, accent: 'text-green-600', ring: 'border-green-200' },
  error: { icon: XCircle, accent: 'text-red-600', ring: 'border-red-200' },
  warning: { icon: AlertTriangle, accent: 'text-amber-600', ring: 'border-amber-200' },
  info: { icon: Info, accent: 'text-blue-600', ring: 'border-blue-200' },
};

export default function ToastStack({ toasts, onDismiss }) {
  if (!toasts.length) return null;

  return (
    <div
      className="pointer-events-none fixed bottom-4 right-4 z-[100] flex w-full max-w-sm flex-col gap-2 print:hidden"
      role="status"
      aria-live="polite"
    >
      {toasts.map((item) => {
        const { icon: Icon, accent, ring } = variants[item.variant] || variants.info;
        return (
          <div
            key={item.id}
            className={clsx(
              'pointer-events-auto flex items-start gap-3 rounded-lg border bg-white px-4 py-3 shadow-lg',
              ring
            )}
          >
            <Icon className={clsx('mt-0.5 h-5 w-5 shrink-0', accent)} />
            <div className="min-w-0 flex-1">
              {item.title && <p className="text-sm font-semibold text-gray-900">{item.title}</p>}
              <p className={clsx('text-sm text-gray-700', item.title && 'mt-0.5')}>{item.message}</p>
            </div>
            <button
              onClick={() => onDismiss(item.id)}
              aria-label="Dismiss notification"
              className="rounded p-0.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
