import { useId } from 'react';
import clsx from 'clsx';

export default function Textarea({ label, id, error, className, ...props }) {
  const generatedId = useId();
  const textareaId = id || props.name || generatedId;
  return (
    <div className={clsx('w-full', className)}>
      {label && (
        <label
          htmlFor={textareaId}
          className="mb-1.5 block text-sm font-medium text-gray-700"
        >
          {label}
        </label>
      )}
      <textarea
        id={textareaId}
        className={clsx(
          'w-full rounded-lg border bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200',
          error
            ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
            : 'border-gray-300'
        )}
        {...props}
      />
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}
