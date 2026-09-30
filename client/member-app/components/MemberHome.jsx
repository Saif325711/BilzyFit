import { useState } from 'react';
import {
  Bell,
  QrCode,
  Flame,
  Dumbbell,
  Apple,
  CreditCard,
  ChevronRight,
  TrendingUp,
  Droplets,
  Plus,
  CheckCircle2,
  Calendar,
  Sparkles,
  ArrowRight,
  Zap,
} from 'lucide-react';

export default function MemberHome({
  member = {},
  membership = {},
  payments = [],
  presentThisMonth = 18,
  daysLeft = 23,
  gymCenter,
  onNavigate,
  onShowQR,
}) {
  const [glasses, setGlasses] = useState(6);
  const [showToast, setShowToast] = useState(false);
  const [toastText, setToastText] = useState('');

  const firstName =
    member?.fullName?.split(' ')[0] || member?.name?.split(' ')[0] || 'Athlete';
  const weight = member?.weight ? Number(member.weight) : 72.0;

  function handleAddWater() {
    if (glasses < 12) {
      const next = glasses + 1;
      setGlasses(next);
      setToastText(`Hydration logged: ${next} / 8 glasses (+250ml) 💧`);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2500);
    }
  }

  return (
    <div
      style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}
      className="space-y-4 pb-4 animate-fadeIn"
    >
      {/* ── TOAST NOTIFICATION ───────────────────────────────────────── */}
      {showToast && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2.5 rounded-2xl bg-emerald-900 px-4 py-3 text-white shadow-xl animate-bounce">
          <Droplets className="h-4 w-4 text-emerald-400 shrink-0" />
          <p className="text-xs font-bold">{toastText}</p>
        </div>
      )}

      {/* ── TOP APP BAR (Branding + Actions) ─────────────────────────── */}
      <div className="flex items-center justify-between pt-1">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-black tracking-tight text-gray-900 leading-none uppercase">
              {gymCenter?.name || 'Star Fitness'}
            </h1>
            <span className="rounded-md bg-emerald-100 px-1.5 py-0.5 text-[8.5px] font-black uppercase text-emerald-800 tracking-wide">
              MEMBER
            </span>
          </div>
          <p className="mt-1 text-[8.5px] font-extrabold tracking-[0.2em] text-emerald-600 uppercase">
            {gymCenter?.branch || member?.branch || 'OFFICIAL GYM CENTER'}
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-600 transition hover:bg-gray-200"
            title="Notifications"
          >
            <Bell className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={onShowQR}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500 text-white shadow-md shadow-emerald-500/30 transition hover:bg-emerald-600"
            title="QR Check-in"
          >
            <QrCode className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* ── HERO COMMAND BANNER ──────────────────────────────────────── */}
      <div
        className="relative overflow-hidden rounded-3xl bg-white p-5 shadow-sm border border-gray-100"
        style={{ minHeight: 154 }}
      >
        <div
          className="absolute -right-6 -top-6 h-44 w-44 rounded-full bg-emerald-100/60 pointer-events-none"
          style={{ filter: 'blur(1px)' }}
        />
        <div className="absolute right-20 -bottom-8 h-28 w-28 rounded-full bg-orange-50 pointer-events-none" />

        {/* CTA Visual Card on the right */}
        <div className="absolute right-3 top-3 bottom-3 w-36 overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100/80 flex flex-col items-center justify-center shadow-sm">
          <span className="text-3xl">🔥</span>
          <span className="mt-1 text-[11px] font-black text-emerald-800">Ready to Train?</span>
          <button
            type="button"
            onClick={() => onNavigate('workout')}
            className="mt-1.5 rounded-lg bg-emerald-500 px-3 py-1 text-[10px] font-black text-white hover:bg-emerald-600 transition shadow-sm"
          >
            Start Now &rarr;
          </button>
        </div>

        {/* Left greeting text */}
        <div className="relative z-10 pr-36">
          <p className="text-xs font-semibold text-gray-500">
            Welcome back, {firstName} 👋
          </p>
          <h2 className="mt-1 text-2xl font-black text-gray-900 tracking-tight leading-tight">
            Push Day <span className="text-emerald-500">Strength</span>
          </h2>
          <p className="mt-1 text-xs text-gray-400 font-medium">
            Week 4 &bull; 5 Exercises on schedule today
          </p>
          <div className="mt-2.5 inline-flex items-center gap-1 rounded-md bg-amber-50 px-2 py-0.5 text-[10px] font-extrabold text-amber-700">
            <Zap className="h-3 w-3 text-amber-500" />
            <span>Goal: 75% Completed</span>
          </div>
        </div>
      </div>

      {/* ── 4-PILLAR QUICK LAUNCHPAD ─────────────────────────────────── */}
      <div className="grid grid-cols-2 gap-2.5">
        <button
          type="button"
          onClick={onShowQR}
          className="flex items-center gap-3 rounded-2xl bg-white p-3.5 shadow-sm border border-gray-100 text-left transition hover:bg-emerald-50/30 group"
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 group-hover:scale-105 transition">
            <QrCode className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-black text-gray-900 truncate">
              Quick Check-in
            </p>
            <p className="text-[10px] font-bold text-emerald-600">Scan Entry QR</p>
          </div>
        </button>

        <button
          type="button"
          onClick={() => onNavigate('workout')}
          className="flex items-center gap-3 rounded-2xl bg-white p-3.5 shadow-sm border border-gray-100 text-left transition hover:bg-orange-50/30 group"
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-orange-600 group-hover:scale-105 transition">
            <Dumbbell className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-black text-gray-900 truncate">
              My Workout
            </p>
            <p className="text-[10px] font-bold text-orange-600">Push Strength</p>
          </div>
        </button>

        <button
          type="button"
          onClick={() => onNavigate('diet')}
          className="flex items-center gap-3 rounded-2xl bg-white p-3.5 shadow-sm border border-gray-100 text-left transition hover:bg-emerald-50/30 group"
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 group-hover:scale-105 transition">
            <Apple className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-black text-gray-900 truncate">
              Meal Plan
            </p>
            <p className="text-[10px] font-bold text-emerald-600">1,840 kcal Clean</p>
          </div>
        </button>

        <button
          type="button"
          onClick={() => onNavigate('payments')}
          className="flex items-center gap-3 rounded-2xl bg-white p-3.5 shadow-sm border border-gray-100 text-left transition hover:bg-purple-50/30 group"
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-50 text-purple-600 group-hover:scale-105 transition">
            <CreditCard className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-black text-gray-900 truncate">
              VIP Pass
            </p>
            <p className="text-[10px] font-bold text-purple-600">
              Active &bull; {daysLeft}d left
            </p>
          </div>
        </button>
      </div>

      {/* ── TODAY'S SNAPSHOT CARD ────────────────────────────────────── */}
      <div className="rounded-3xl bg-white p-5 shadow-sm border border-gray-100 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-extrabold text-gray-900">
              Today's Snapshot
            </h3>
            <p className="text-xs text-gray-400 font-medium">
              September monthly performance
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('progress')}
            className="flex items-center gap-1 text-xs font-black text-emerald-600 hover:text-emerald-700 transition"
          >
            <span>View All</span>
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        {/* 3 Metric Stat Blocks */}
        <div className="grid grid-cols-3 gap-2.5 pt-1">
          <div className="rounded-2xl bg-emerald-50/80 p-3 text-center border border-emerald-100/60">
            <p className="text-[10px] font-bold text-emerald-700">Gym Visits</p>
            <p className="text-xl font-black text-emerald-950 mt-0.5">
              {presentThisMonth}
            </p>
            <p className="text-[9.5px] font-semibold text-emerald-700 mt-0.5">
              18 / 24 Days
            </p>
          </div>

          <div className="rounded-2xl bg-sky-50/80 p-3 text-center border border-sky-100/60">
            <p className="text-[10px] font-bold text-sky-700">Current Weight</p>
            <p className="text-xl font-black text-sky-950 mt-0.5">
              {weight.toFixed(1)}
            </p>
            <p className="text-[9.5px] font-semibold text-sky-700 mt-0.5">
              -4.5 kg down
            </p>
          </div>

          <div className="rounded-2xl bg-amber-50/80 p-3 text-center border border-amber-100/60">
            <p className="text-[10px] font-bold text-amber-700">Active Streak</p>
            <p className="text-xl font-black text-amber-950 mt-0.5">5d</p>
            <p className="text-[9.5px] font-semibold text-amber-700 mt-0.5">
              Top 10% Club
            </p>
          </div>
        </div>
      </div>

      {/* ── TODAY'S ROUTINE PREVIEW ─────────────────────────────────── */}
      <div className="rounded-3xl bg-white p-5 shadow-sm border border-gray-100 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-extrabold text-gray-900">
            Today's Session
          </h3>
          <span className="rounded-md bg-orange-50 px-2 py-0.5 text-[10px] font-black text-orange-700">
            45 Mins &bull; 5 Exercises
          </span>
        </div>

        <div className="flex items-center justify-between rounded-2xl border border-gray-100 bg-gray-50/80 p-3.5">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-100 text-2xl shadow-sm">
              🏋️‍♂️
            </div>
            <div>
              <p className="text-xs font-black text-gray-900">
                Push Day &bull; Chest &amp; Shoulders
              </p>
              <p className="text-[10.5px] text-gray-400 font-medium">
                Bench Press, Incline Dumbbells, Triceps...
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('workout')}
            className="rounded-xl bg-emerald-500 px-3 py-1.5 text-xs font-black text-white hover:bg-emerald-600 transition shadow-sm"
          >
            View Plan
          </button>
        </div>
      </div>

      {/* ── DAILY NUTRITION & HYDRATION CARD ─────────────────────────── */}
      <div className="rounded-3xl bg-white p-5 shadow-sm border border-gray-100 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-extrabold text-gray-900">
            Fuel &amp; Hydration
          </h3>
          <button
            type="button"
            onClick={() => onNavigate('diet')}
            className="text-xs font-black text-emerald-600 hover:text-emerald-700 transition"
          >
            Meal Plan &rarr;
          </button>
        </div>

        {/* Calories Progress */}
        <div className="space-y-1.5 pt-1">
          <div className="flex justify-between text-xs font-bold">
            <span className="text-gray-800">Daily Calories</span>
            <span className="text-gray-900">
              <span className="text-emerald-600 font-black">1,450</span> / 1,840 kcal
            </span>
          </div>
          <div className="h-2 w-full rounded-full bg-gray-100 overflow-hidden">
            <div
              className="h-full bg-emerald-500 rounded-full transition-all duration-700"
              style={{ width: '78%' }}
            />
          </div>
        </div>

        {/* Water Glasses Quick Tracker */}
        <div className="flex items-center justify-between rounded-2xl border border-gray-100 bg-sky-50/50 p-3 mt-2">
          <div className="flex items-center gap-2">
            <span className="text-lg">💧</span>
            <div>
              <p className="text-xs font-bold text-gray-900">
                Hydration: {glasses} / 8 Glasses
              </p>
              <p className="text-[10px] text-sky-700 font-medium">
                {(glasses * 0.25).toFixed(1)} Liters consumed
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleAddWater}
            className="flex items-center gap-1 rounded-xl bg-sky-500 px-2.5 py-1 text-[11px] font-black text-white hover:bg-sky-600 transition shadow-sm"
          >
            <Plus className="h-3 w-3" />
            <span>1 Glass</span>
          </button>
        </div>
      </div>

      {/* ── LIVE GYM TRAFFIC STATUS ─────────────────────────────────── */}
      <div className="flex items-center gap-3 rounded-2xl bg-emerald-50/70 p-4 border border-emerald-100">
        <span className="text-lg">🟢</span>
        <div>
          <p className="text-xs font-black text-emerald-950">
            Live Traffic at {gymCenter?.name || 'Star Fitness'}: Moderate (38 Athletes)
          </p>
          <p className="text-[10px] text-emerald-700 font-medium">
            Optimal time to train at {gymCenter?.name || 'Star Fitness'}! Free weights and squat racks are available.
          </p>
        </div>
      </div>
    </div>
  );
}
