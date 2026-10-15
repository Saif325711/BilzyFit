import clsx from 'clsx';

export default function Card({ children, className, padding = 'normal' }) {
  return (
    <div
      className={clsx(
        'rounded-xl border border-gray-200 bg-white shadow-card',
        padding === 'normal' && 'p-4 md:p-5',
        padding === 'large' && 'p-5 md:p-6',
        padding === 'none' && 'p-0',
        className
      )}
    >
      {children}
    </div>
  );
}
