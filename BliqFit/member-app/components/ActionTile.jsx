export default function ActionTile({ icon: Icon, label, color, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex min-h-24 flex-col items-start justify-between rounded-2xl border border-gray-100 bg-white p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
    >
      <span className={`rounded-xl p-2 ${color}`}><Icon className="h-5 w-5" /></span>
      <span className="text-sm font-semibold text-gray-800">{label}</span>
    </button>
  );
}
