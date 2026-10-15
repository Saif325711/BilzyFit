import { useId } from 'react';
import clsx from 'clsx';

export default function Select({
  label,
  id,
  options = [],
  placeholder,
  error,
  className,
  ...props
}) {
  const generatedId = useId();
  const selectId = id || props.name || generatedId;
  return (
    <div className={clsx('w-full', className)}>
      {label && (
        <label
          htmlFor={selectId}
          className="mb-1.5 block text-sm font-medium text-gray-700"
        >
          {label}
        </label>
      )}
      <select
        id={selectId}
        className={clsx(
          'w-full rounded-lg border bg-white px-3 py-2 text-sm text-gray-900 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200',
          error
            ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
            : 'border-gray-300'
        )}
        {...props}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}
