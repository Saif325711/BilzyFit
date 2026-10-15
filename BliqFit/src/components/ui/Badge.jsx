import clsx from 'clsx';

const variants = {
  success: 'bg-green-100 text-green-800 border-green-200',
  warning: 'bg-amber-100 text-amber-800 border-amber-200',
  danger: 'bg-red-100 text-red-800 border-red-200',
  info: 'bg-blue-100 text-blue-800 border-blue-200',
  default: 'bg-gray-100 text-gray-700 border-gray-200',
  primary: 'bg-primary-100 text-primary-800 border-primary-200',
};

export default function Badge({ children, variant = 'default', className }) {
  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium uppercase tracking-wide',
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
