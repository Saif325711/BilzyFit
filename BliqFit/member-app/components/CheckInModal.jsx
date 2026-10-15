import { QrCode, X } from 'lucide-react';

export default function CheckInModal({ member, gymCenter, onClose }) {
  const centerName = gymCenter?.name || member?.branch || 'Star Fitness';

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-gray-900/60 p-4 backdrop-blur-xs sm:items-center animate-fadeIn">
      <div className="w-full max-w-sm rounded-3xl bg-white p-6 text-center shadow-2xl border border-gray-100">
        <div className="mb-5 flex items-center justify-between">
          <div className="text-left">
            <span className="rounded-md bg-emerald-100 px-2 py-0.5 text-[9px] font-black uppercase text-emerald-800 tracking-wider">
              {centerName}
            </span>
            <h2 className="mt-1 text-lg font-black text-gray-900">Show at Reception</h2>
            <p className="text-[10px] text-gray-400 font-medium">Digital attendance & turnstile entry pass</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full bg-gray-100 p-2 text-gray-500 hover:bg-gray-200 transition"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mx-auto flex h-52 w-52 items-center justify-center rounded-2xl border-4 border-emerald-500/20 bg-emerald-50/40 shadow-inner">
          <QrCode className="h-36 w-36 text-slate-900" />
        </div>

        <div className="mt-4 space-y-1">
          <p className="text-sm font-extrabold text-gray-900">
            {member?.fullName} &bull; <span className="font-mono text-emerald-700">{member?.memberId}</span>
          </p>
          <p className="text-xs font-semibold text-emerald-700">
            Active Member Pass &bull; {centerName}
          </p>
          <p className="text-[10px] text-gray-400 pt-1">
            Valid only at {centerName} turnstiles &amp; front desk check-in.
          </p>
        </div>
      </div>
    </div>
  );
}

