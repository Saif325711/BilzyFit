import clsx from 'clsx';

export function Table({ children, className }) {
  return (
    <div className="w-full overflow-x-auto rounded-xl border border-gray-200">
      <table className={clsx('w-full text-left text-sm', className)}>
        {children}
      </table>
    </div>
  );
}

export function Thead({ children }) {
  return (
    <thead className="bg-gray-50 text-xs font-semibold uppercase tracking-wide text-gray-600">
      {children}
    </thead>
  );
}

export function Th({ children, className, colSpan }) {
  return (
    <th colSpan={colSpan} className={clsx('px-4 py-3', className)}>{children}</th>
  );
}

export function Tbody({ children }) {
  return <tbody className="divide-y divide-gray-100 bg-white">{children}</tbody>;
}

export function Tr({ children, className, onClick }) {
  return (
    <tr
      onClick={onClick}
      className={clsx(
        'transition-colors',
        onClick && 'cursor-pointer hover:bg-gray-50',
        className
      )}
    >
      {children}
    </tr>
  );
}

export function Td({ children, className, colSpan }) {
  return (
    <td colSpan={colSpan} className={clsx('px-4 py-3 text-gray-700', colSpan && 'whitespace-normal', !colSpan && 'whitespace-nowrap', className)}>
      {children}
    </td>
  );
}
