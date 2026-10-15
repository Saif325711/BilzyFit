export default function SectionTitle({ eyebrow, title, action, onAction }) {
  return (
    <div className="mb-3 flex items-end justify-between">
      <div>
        {eyebrow && <p className="text-xs font-semibold uppercase tracking-widest text-primary-600">{eyebrow}</p>}
        <h2 className="mt-1 text-lg font-bold text-gray-900">{title}</h2>
      </div>
      {action && <button type="button" onClick={onAction} className="text-sm font-semibold text-primary-700">{action}</button>}
    </div>
  );
}
