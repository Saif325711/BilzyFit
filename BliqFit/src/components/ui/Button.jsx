import clsx from 'clsx';

const variants = {
  primary:
    'bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500 border-transparent',
  secondary:
    'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 focus:ring-primary-500',
  outline:
    'bg-transparent text-primary-700 border-primary-200 hover:bg-primary-50 focus:ring-primary-500',
  ghost:
    'bg-transparent text-gray-600 border-transparent hover:bg-gray-100 focus:ring-gray-300',
  danger:
    'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 border-transparent',
};

const sizes = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-4 py-2 text-sm',
  lg: 'px-5 py-2.5 text-base',
};

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  className,
  fullWidth = false,
  disabled = false,
  type = 'button',
  icon: Icon,
  ...props
}) {
  return (
    <button
      type={type}
      disabled={disabled}
      className={clsx(
        'inline-flex items-center justify-center gap-2 rounded-lg border font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-60',
        variants[variant],
        sizes[size],
        fullWidth && 'w-full',
        className
      )}
      {...props}
    >
      {Icon && <Icon className="h-4 w-4" />}
      {children}
    </button>
  );
}
