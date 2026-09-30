import { useState } from 'react';
import {
  Bell,
  QrCode,
  Flame,
  TrendingUp,
  Plus,
  Trophy,
  Scale,
  Calendar,
  Clock,
  Dumbbell,
  CheckCircle2,
  ChevronRight,
  Edit3,
  X,
  Sparkles,
  Zap,
} from 'lucide-react';

export default function MemberProgress({
  member = {},
  attendance = [],
  presentThisMonth = 18,
  onShowQR,
}) {
  const [activeTab, setActiveTab] = useState('consistency'); // 'consistency' | 'metrics' | 'prs'
  const [currentWeight, setCurrentWeight] = useState(
    member?.weight ? Number(member.weight) : 72.0
  );
  const [showLogWeight, setShowLogWeight] = useState(false);
  const [showAddPR, setShowAddPR] = useState(false);

  // Default PRs list
  const [prs, setPrs] = useState([
    {
      id: 'pr-1',
      exercise: 'Bench Press',
      weight: '100 kg',
      reps: '1 rep',
      date: '3 days ago',
      category: 'Chest',
      emoji: '🏋️‍♂️',
    },
    {
      id: 'pr-2',
      exercise: 'Barbell Squat',
      weight: '140 kg',
      reps: '3 reps',
      date: 'Last week',
      category: 'Legs',
      emoji: '🦵',
    },
    {
      id: 'pr-3',
      exercise: 'Deadlift',
      weight: '160 kg',
      reps: '1 rep',
      date: '2 weeks ago',
      category: 'Back',
      emoji: '⚡',
    },
    {
      id: 'pr-4',
      exercise: 'Pull-ups',
      weight: 'Bodyweight + 15 kg',
      reps: '8 reps',
      date: '10 days ago',
      category: 'Upper Body',
      emoji: '💪',
    },
    {
      id: 'pr-5',
      exercise: 'Overhead Press',
      weight: '65 kg',
      reps: '5 reps',
      date: '3 weeks ago',
      category: 'Shoulders',
      emoji: '🎯',
    },
  ]);

  // Form states for dialogs
  const [weightInput, setWeightInput] = useState(currentWeight.toString());
  const [newPR, setNewPR] = useState({
    exercise: 'Barbell Incline Press',
    weight: '85 kg',
    reps: '3 reps',
    category: 'Chest',
  });

  const firstName =
    member?.fullName?.split(' ')[0] || member?.name?.split(' ')[0] || 'Athlete';
  const height = member?.height ? Number(member.height) : 178;
  const heightMeters = height / 100;
  const bmi = (currentWeight / (heightMeters * heightMeters)).toFixed(1);

  const totalTargetVisits = 24;
  const visits = presentThisMonth || 18;
  const attendanceProgress = Math.min(
    100,
    Math.round((visits / totalTargetVisits) * 100)
  );

  // SVG Circular Ring calculation
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset =
    circumference - (attendanceProgress / 100) * circumference;

  function handleSaveWeight(e) {
    e.preventDefault();
    const val = parseFloat(weightInput);
    if (!isNaN(val) && val > 0) {
      setCurrentWeight(val);
    }
    setShowLogWeight(false);
  }

  function handleSavePR(e) {
    e.preventDefault();
    if (!newPR.exercise.trim()) return;
    setPrs((prev) => [
      {
        id: `pr-${Date.now()}`,
        exercise: newPR.exercise.trim(),
        weight: newPR.weight.trim(),
        reps: newPR.reps.trim(),
        date: 'Just now',
        category: newPR.category,
        emoji: '🥇',
      },
      ...prev,
    ]);
    setShowAddPR(false);
  }

  return (
    <div
      style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}
      className="space-y-4 pb-4 animate-fadeIn"
    >
      {/* ── TOP APP BAR (Branding + Actions) ─────────────────────────── */}
      <div className="flex items-center justify-between pt-1">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-gray-900 leading-none">
            bilzy<span className="text-emerald-500">fit</span>
          </h1>
          <p className="mt-1 text-[8.5px] font-extrabold tracking-[0.22em] text-gray-400 uppercase">
            TRAIN &bull; TRACK &bull; TRANSFORM
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

      {/* ── HERO HEADER WITH TROPHY BADGE ───────────────────────────── */}
      <div
        className="relative overflow-hidden rounded-3xl bg-white p-5 shadow-sm border border-gray-100"
        style={{ minHeight: 146 }}
      >
        <div
          className="absolute -right-6 -top-6 h-44 w-44 rounded-full bg-emerald-100/60 pointer-events-none"
          style={{ filter: 'blur(1px)' }}
        />
        <div className="absolute right-20 -bottom-8 h-28 w-28 rounded-full bg-sky-50 pointer-events-none" />

        {/* Trophy visual badge on the right */}
        <div className="absolute right-3 top-3 bottom-3 w-36 overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100/80 flex flex-col items-center justify-center shadow-sm">
          <span className="text-3xl">🏆</span>
          <span className="mt-1 text-[11px] font-black text-emerald-700">Top 10% Gym</span>
          <span className="text-[9px] font-semibold text-emerald-600/70">Consistency Index</span>
        </div>

        {/* Left greeting text */}
        <div className="relative z-10 pr-36">
          <p className="text-xs font-semibold text-gray-500">Hi, {firstName} 👋</p>
          <h2 className="mt-1 text-2xl font-black text-gray-900 tracking-tight leading-tight">
            My <span className="text-emerald-500">Progress</span>
          </h2>
          <p className="mt-1 text-xs text-gray-400 font-medium">
            Track consistency &amp; transformation 📈
          </p>
        </div>
      </div>

      {/* ── CONSISTENCY / ATTENDANCE HERO CARD (RING + METRICS) ──────── */}
      <div className="rounded-3xl bg-white p-5 shadow-sm border border-gray-100 space-y-4">
        <div className="flex items-center gap-5">
          {/* Circular Attendance Ring */}
          <div className="relative flex h-28 w-28 shrink-0 items-center justify-center">
            <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r={radius}
                className="stroke-gray-100"
                strokeWidth="10"
                fill="none"
              />
              <circle
                cx="50"
                cy="50"
                r={radius}
                className="stroke-emerald-500 transition-all duration-1000 ease-out"
                strokeWidth="10"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="none"
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center">
              <span className="text-2xl font-black text-gray-900 leading-none">
                {visits}
              </span>
              <span className="text-[9px] font-black uppercase tracking-wider text-gray-400 mt-0.5">
                VISITS
              </span>
            </div>
          </div>

          {/* Streak & Consistency Message */}
          <div className="flex-1 space-y-1.5">
            <div className="inline-flex items-center gap-1 rounded-lg bg-amber-50 px-2.5 py-0.5 text-xs font-black text-amber-700">
              <Flame className="h-3.5 w-3.5 text-orange-500" />
              <span>5 Day Streak</span>
            </div>
            <h3 className="text-base font-extrabold text-gray-900 leading-snug">
              Outstanding Consistency!
            </h3>
            <p className="text-xs text-gray-500 font-medium leading-relaxed">
              You completed {attendanceProgress}% of your monthly target ({visits}/{totalTargetVisits} sessions).
            </p>
          </div>
        </div>

        {/* 3 Metric Pills */}
        <div className="grid grid-cols-3 gap-2 pt-1 border-t border-gray-100">
          <div className="rounded-2xl bg-emerald-50/70 p-2.5 text-center">
            <p className="text-[10px] font-bold text-emerald-700">📅 Goal</p>
            <p className="text-xs font-black text-emerald-900 mt-0.5">
              {visits} / {totalTargetVisits} days
            </p>
          </div>
          <div className="rounded-2xl bg-sky-50/70 p-2.5 text-center">
            <p className="text-[10px] font-bold text-sky-700">⏱ Gym Time</p>
            <p className="text-xs font-black text-sky-900 mt-0.5">28.5 hrs</p>
          </div>
          <div className="rounded-2xl bg-purple-50/70 p-2.5 text-center">
            <p className="text-[10px] font-bold text-purple-700">⚡ Level</p>
            <p className="text-xs font-black text-purple-900 mt-0.5">Beast Mode</p>
          </div>
        </div>
      </div>

      {/* ── TABS BAR + LOG ACTION BUTTON ─────────────────────────────── */}
      <div className="flex items-center gap-2">
        <div className="flex flex-1 rounded-2xl bg-gray-100 p-1">
          {[
            { id: 'consistency', label: 'Consistency' },
            { id: 'metrics', label: 'Body Metrics' },
            { id: 'prs', label: 'PRs & Strength' },
          ].map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setActiveTab(t.id)}
              className={`flex-1 rounded-xl py-2 text-xs font-bold transition-all ${
                activeTab === t.id
                  ? 'bg-white text-emerald-600 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={() => {
            if (activeTab === 'prs') {
              setShowAddPR(true);
            } else {
              setWeightInput(currentWeight.toString());
              setShowLogWeight(true);
            }
          }}
          className="flex items-center gap-1.5 rounded-2xl bg-emerald-500 px-3.5 py-2.5 text-xs font-black text-white shadow-sm hover:bg-emerald-600 transition"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>{activeTab === 'prs' ? 'Add PR' : 'Log Entry'}</span>
        </button>
      </div>

      {/* ── TAB 1: CONSISTENCY OVERVIEW ─────────────────────────────── */}
      {activeTab === 'consistency' && (
        <div className="space-y-4">
          <div className="rounded-3xl bg-white p-5 shadow-sm border border-gray-100 space-y-4">
            <div>
              <h3 className="text-base font-extrabold text-gray-900">
                Weekly Attendance Breakdown
              </h3>
              <p className="text-xs text-gray-400 font-medium">
                Consistency breakdown for September 2026
              </p>
            </div>

            <div className="space-y-3.5 pt-1">
              {[
                { week: 'Week 1', days: '5 / 6 Days', percent: 83, color: 'bg-emerald-500' },
                { week: 'Week 2', days: '4 / 6 Days', percent: 67, color: 'bg-sky-500' },
                { week: 'Week 3', days: '5 / 6 Days', percent: 83, color: 'bg-emerald-500' },
                { week: 'Week 4 (Current)', days: '4 / 4 Days', percent: 100, color: 'bg-amber-500' },
              ].map((w, idx) => (
                <div key={idx}>
                  <div className="flex justify-between text-xs font-bold mb-1">
                    <span className="text-gray-800">{w.week}</span>
                    <span className="text-gray-900">{w.days}</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-gray-100 overflow-hidden">
                    <div
                      className={`h-full ${w.color} rounded-full transition-all duration-700`}
                      style={{ width: `${w.percent}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Motivational Banner */}
            <div className="flex items-start gap-3 rounded-2xl bg-emerald-50/80 p-3.5 border border-emerald-100 text-xs text-emerald-800">
              <span className="text-xl shrink-0">🔥</span>
              <p className="leading-relaxed">
                You are in the <span className="font-extrabold">top 10% of regular gym goers</span> this month! Maintaining this pace accelerates metabolic conditioning by 28%.
              </p>
            </div>
          </div>

          {/* Recent Workout Check-ins Log */}
          <div className="rounded-3xl bg-white p-5 shadow-sm border border-gray-100 space-y-3">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-gray-400">
              Recent Gym Sessions
            </h4>
            <div className="divide-y divide-gray-100">
              {[
                { date: 'Today', time: '7:15 AM – 8:30 AM', duration: '75 mins', activity: 'Push Day Strength' },
                { date: 'Yesterday', time: '6:45 PM – 7:50 PM', duration: '65 mins', activity: 'HIIT & Conditioning' },
                { date: '2 days ago', time: '7:00 AM – 8:15 AM', duration: '75 mins', activity: 'Legs & Core Hypertrophy' },
                { date: '4 days ago', time: '6:30 PM – 7:45 PM', duration: '75 mins', activity: 'Pull Day Heavy' },
              ].map((s, idx) => (
                <div key={idx} className="flex items-center justify-between py-2.5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                      <CheckCircle2 className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-900">{s.activity}</p>
                      <p className="text-[11px] text-gray-400">{s.time}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="rounded-md bg-gray-100 px-2 py-0.5 text-[10px] font-bold text-gray-600">
                      {s.duration}
                    </span>
                    <p className="text-[10px] text-gray-400 mt-0.5">{s.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── TAB 2: BODY COMPOSITION & METRICS ───────────────────────── */}
      {activeTab === 'metrics' && (
        <div className="space-y-4">
          <div className="rounded-3xl bg-white p-5 shadow-sm border border-gray-100 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-extrabold text-gray-900">
                  Body Composition
                </h3>
                <p className="text-xs text-gray-400 font-medium">
                  Physical metrics &amp; transformation
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setWeightInput(currentWeight.toString());
                  setShowLogWeight(true);
                }}
                className="flex items-center gap-1 rounded-xl border border-emerald-200 bg-emerald-50/50 px-3 py-1.5 text-xs font-bold text-emerald-700 hover:bg-emerald-100 transition"
              >
                <Edit3 className="h-3 w-3" />
                <span>Update</span>
              </button>
            </div>

            {/* 3 Metric Summary Boxes */}
            <div className="grid grid-cols-3 gap-2.5 pt-1">
              <div className="rounded-2xl border border-gray-100 bg-gray-50/70 p-3 text-center">
                <p className="text-[11px] font-medium text-gray-500">Weight</p>
                <p className="text-base font-black text-gray-900 mt-0.5">
                  {currentWeight.toFixed(1)} kg
                </p>
                <span className="mt-1 inline-block rounded-md bg-emerald-100/70 px-1.5 py-0.5 text-[9px] font-extrabold text-emerald-700">
                  -4.5 kg down
                </span>
              </div>

              <div className="rounded-2xl border border-gray-100 bg-gray-50/70 p-3 text-center">
                <p className="text-[11px] font-medium text-gray-500">Height</p>
                <p className="text-base font-black text-gray-900 mt-0.5">
                  {height} cm
                </p>
                <span className="mt-1 inline-block rounded-md bg-sky-100/70 px-1.5 py-0.5 text-[9px] font-extrabold text-sky-700">
                  Standard
                </span>
              </div>

              <div className="rounded-2xl border border-gray-100 bg-gray-50/70 p-3 text-center">
                <p className="text-[11px] font-medium text-gray-500">BMI</p>
                <p className="text-base font-black text-gray-900 mt-0.5">{bmi}</p>
                <span className="mt-1 inline-block rounded-md bg-amber-100/70 px-1.5 py-0.5 text-[9px] font-extrabold text-amber-700">
                  Healthy Range
                </span>
              </div>
            </div>

            {/* Target Weight Transformation Card */}
            <div className="rounded-2xl border border-gray-100 bg-gray-50/80 p-4 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-gray-900">
                  Goal: 70.0 kg
                </span>
                <span className="text-xs font-black text-emerald-600">
                  88% Target Reached
                </span>
              </div>
              <div className="h-2.5 w-full rounded-full bg-gray-200 overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full transition-all duration-700"
                  style={{ width: '88%' }}
                />
              </div>
              <div className="flex justify-between text-[11px] font-semibold text-gray-400 pt-0.5">
                <span>Start: 76.5 kg</span>
                <span className="font-extrabold text-emerald-600">
                  Current: {currentWeight.toFixed(1)} kg
                </span>
                <span>Goal: 70.0 kg</span>
              </div>
            </div>
          </div>

          {/* Advanced Vitals & Biomarkers */}
          <div className="rounded-3xl bg-white p-5 shadow-sm border border-gray-100 space-y-3">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-gray-400">
              Estimated Body Composition
            </h4>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center gap-3 rounded-2xl bg-gray-50 p-3.5 border border-gray-100">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-100 text-orange-600">
                  <Flame className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[11px] font-medium text-gray-500">Body Fat</p>
                  <p className="text-base font-black text-gray-900">15.2%</p>
                  <p className="text-[9px] text-emerald-600 font-bold">Athletic Zone</p>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-2xl bg-gray-50 p-3.5 border border-gray-100">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">
                  <Dumbbell className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[11px] font-medium text-gray-500">Muscle Mass</p>
                  <p className="text-base font-black text-gray-900">36.8 kg</p>
                  <p className="text-[9px] text-emerald-600 font-bold">+1.2 kg gained</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── TAB 3: PERSONAL RECORDS (PRS & STRENGTH) ─────────────────── */}
      {activeTab === 'prs' && (
        <div className="space-y-4">
          <div className="rounded-3xl bg-white p-5 shadow-sm border border-gray-100 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-extrabold text-gray-900">
                  Personal Records (PRs)
                </h3>
                <p className="text-xs text-gray-400 font-medium">
                  Your all-time best gym lifts
                </p>
              </div>
              <span className="text-2xl">🏋️‍♂️</span>
            </div>

            <div className="space-y-2.5 pt-1">
              {prs.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between rounded-2xl border border-gray-100 bg-gray-50/70 p-3.5 transition hover:bg-gray-100/60"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-lg">
                      {item.emoji}
                    </div>
                    <div>
                      <p className="text-xs font-black text-gray-900">
                        {item.exercise}
                      </p>
                      <div className="flex items-center gap-1.5 mt-0.5 text-[10px] text-gray-400 font-medium">
                        <span className="rounded-md bg-gray-200/80 px-1.5 py-0.2 text-gray-600">
                          {item.category}
                        </span>
                        <span>&bull;</span>
                        <span>{item.date}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-sm font-black text-emerald-600">
                      {item.weight}
                    </p>
                    <p className="text-[10px] font-bold text-gray-500">
                      {item.reps}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setShowAddPR(true)}
              className="flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-emerald-300 bg-emerald-50/40 py-3 text-xs font-bold text-emerald-700 hover:bg-emerald-100/70 transition"
            >
              <Plus className="h-4 w-4 text-emerald-600" />
              <span>Log New Personal Record</span>
            </button>
          </div>

          {/* Strength Tier Insight Box */}
          <div className="rounded-3xl bg-gradient-to-r from-gray-900 to-gray-800 p-5 text-white shadow-md space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="rounded-lg bg-emerald-500/20 px-2 py-0.5 text-[10px] font-black text-emerald-400 uppercase tracking-wide">
                Strength Tier
              </span>
              <span className="text-xs font-bold text-gray-300">Level: Advanced</span>
            </div>
            <h4 className="text-sm font-extrabold text-white">
              Next Milestone: 110 kg Bench Press
            </h4>
            <p className="text-xs text-gray-400 leading-relaxed">
              Based on your recent 100 kg PR and training volume, your predicted 1RM ceiling is currently 107.5 kg. Keep up heavy progressive overload.
            </p>
          </div>
        </div>
      )}

      {/* ── MODAL 1: LOG WEIGHT DIALOG ──────────────────────────────── */}
      {showLogWeight && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
                  <Scale className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-gray-900">
                    Log Weight
                  </h3>
                  <p className="text-xs text-gray-400">Track body recomposition</p>
                </div>
              </div>
              <button
                onClick={() => setShowLogWeight(false)}
                className="rounded-full p-1 text-gray-400 hover:bg-gray-100 transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveWeight} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">
                  Current Weight (kg)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.1"
                    min="30"
                    max="250"
                    value={weightInput}
                    onChange={(e) => setWeightInput(e.target.value)}
                    required
                    className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-base font-black text-gray-900 focus:border-emerald-500 focus:bg-white focus:outline-none"
                    placeholder="72.0"
                  />
                  <span className="absolute right-4 top-3.5 text-xs font-extrabold text-gray-400">
                    kg
                  </span>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowLogWeight(false)}
                  className="flex-1 rounded-2xl border border-gray-200 py-3 text-xs font-bold text-gray-600 hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-2xl bg-emerald-500 py-3 text-xs font-bold text-white shadow-md shadow-emerald-500/25 hover:bg-emerald-600 transition"
                >
                  Save Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── MODAL 2: ADD NEW PR DIALOG ──────────────────────────────── */}
      {showAddPR && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-100 text-amber-600">
                  <Trophy className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-gray-900">
                    Log New PR
                  </h3>
                  <p className="text-xs text-gray-400">Record a new personal best</p>
                </div>
              </div>
              <button
                onClick={() => setShowAddPR(false)}
                className="rounded-full p-1 text-gray-400 hover:bg-gray-100 transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSavePR} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">
                  Exercise Name
                </label>
                <input
                  type="text"
                  value={newPR.exercise}
                  onChange={(e) =>
                    setNewPR((p) => ({ ...p, exercise: e.target.value }))
                  }
                  required
                  placeholder="e.g. Incline Dumbbell Press"
                  className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-xs font-bold text-gray-900 focus:border-emerald-500 focus:bg-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">
                    Weight Lifted
                  </label>
                  <input
                    type="text"
                    value={newPR.weight}
                    onChange={(e) =>
                      setNewPR((p) => ({ ...p, weight: e.target.value }))
                    }
                    required
                    placeholder="e.g. 90 kg"
                    className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-xs font-bold text-gray-900 focus:border-emerald-500 focus:bg-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">
                    Repetitions
                  </label>
                  <input
                    type="text"
                    value={newPR.reps}
                    onChange={(e) =>
                      setNewPR((p) => ({ ...p, reps: e.target.value }))
                    }
                    required
                    placeholder="e.g. 5 reps"
                    className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-xs font-bold text-gray-900 focus:border-emerald-500 focus:bg-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">
                  Category
                </label>
                <select
                  value={newPR.category}
                  onChange={(e) =>
                    setNewPR((p) => ({ ...p, category: e.target.value }))
                  }
                  className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-xs font-bold text-gray-900 focus:border-emerald-500 focus:bg-white focus:outline-none"
                >
                  <option value="Chest">Chest</option>
                  <option value="Back">Back</option>
                  <option value="Legs">Legs</option>
                  <option value="Shoulders">Shoulders</option>
                  <option value="Arms">Arms</option>
                  <option value="Core">Core</option>
                </select>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddPR(false)}
                  className="flex-1 rounded-2xl border border-gray-200 py-3 text-xs font-bold text-gray-600 hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-2xl bg-emerald-500 py-3 text-xs font-bold text-white shadow-md shadow-emerald-500/25 hover:bg-emerald-600 transition"
                >
                  Record PR 🔥
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
