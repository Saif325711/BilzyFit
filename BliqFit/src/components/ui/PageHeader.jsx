import clsx from 'clsx';

export default function PageHeader({
  title,
  subtitle,
  children,
  className,
}) {
  return (
    <div
      className={clsx(
        'mb-6 flex flex-col gap-4 md:flex-row md:items-start md:justify-between',
        className
      )}
    >
      <div>
        <h1 className="text-xl font-bold text-gray-900 md:text-2xl">{title}</h1>
        {subtitle && (
          <p className="mt-1 text-sm text-gray-500">{subtitle}</p>
        )}
      </div>
      {children && (
        <div className="flex flex-wrap items-center gap-3">{children}</div>
      )}
    </div>
  );
}
