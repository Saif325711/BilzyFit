import { memberTabs } from '../constants';

export default function MemberBottomNav({ activeTab, onNavigate }) {
  return (
    <nav className="fixed bottom-0 left-1/2 z-40 flex w-full max-w-md -translate-x-1/2 items-center justify-around border-t border-gray-100 bg-white/98 px-2 py-2 shadow-[0_-4px_24px_rgba(0,0,0,0.06)] backdrop-blur">
      {memberTabs.map(({ id, label, icon: Icon }) => {
        const isActive = activeTab === id;
        return (
          <button
            key={id}
            type="button"
            onClick={() => onNavigate(id)}
            className="flex min-w-12 flex-col items-center gap-0.5 rounded-xl px-1.5 py-1 transition-all"
          >
            <div
              className={`flex items-center justify-center rounded-2xl px-3.5 py-1 transition-colors ${
                isActive ? 'bg-emerald-100 text-emerald-700' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <Icon className="h-5 w-5" />
            </div>
            <span
              className={`text-[10px] ${
                isActive ? 'font-bold text-emerald-600' : 'font-medium text-gray-400'
              }`}
            >
              {label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
