import { useState, useMemo } from 'react';
import { Plus, ChevronRight, MoreVertical, Flame, Clock, BarChart2, Dumbbell, X, Trash2, CheckCircle2, Bell, QrCode } from 'lucide-react';
import { useAuth } from '../../src/context/AuthContext';
import bannerImg from '../../src/assets/banner.png';

// ─── exercise photo thumbnails ─────────────────────────────────────────────
const EXERCISE_IMAGES = {
  'Barbell Bench Press':    'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=160&auto=format&fit=crop&q=80',
  'Incline Dumbbell Press': 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=160&auto=format&fit=crop&q=80',
  'Cable Chest Fly':        'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=160&auto=format&fit=crop&q=80',
  'Tricep Rope Pushdown':   'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=160&auto=format&fit=crop&q=80',
  'Pull-ups':               'https://images.unsplash.com/photo-1598971639058-fab3c3109a00?w=160&auto=format&fit=crop&q=80',
  'Barbell Row':            'https://images.unsplash.com/photo-1605296867304-46d5465a13f1?w=160&auto=format&fit=crop&q=80',
  'Squat':                  'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=160&auto=format&fit=crop&q=80',
  'Leg Press':              'https://images.unsplash.com/photo-1434682881908-b43d0467b798?w=160&auto=format&fit=crop&q=80',
  'Overhead Press':         'https://images.unsplash.com/photo-1532029837206-abbe2b7620e3?w=160&auto=format&fit=crop&q=80',
  'Lateral Raise':          'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=160&auto=format&fit=crop&q=80',
  'Bicep Curl':             'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=160&auto=format&fit=crop&q=80',
  'Plank':                  'https://images.unsplash.com/photo-1566241142559-40e1dab266c6?w=160&auto=format&fit=crop&q=80',
  'Treadmill Run':          'https://images.unsplash.com/photo-1538805060514-97d9cc17730c?w=160&auto=format&fit=crop&q=80',
};

// ─── default plan (matches mockup 100%) ────────────────────────────────────
const DEFAULT_PLAN = {
  id: 'plan-push-strength',
  name: 'Push Day Strength',
  focus: 'Chest, shoulders and triceps',
  source: 'trainer',
  duration: '45–60 min',
  exercises: [
    {
      name: 'Barbell Bench Press',
      muscleGroup: 'Chest',
      type: 'Compound',
      category: 'Strength',
      equipment: 'Barbell',
      sets: 4,
      reps: '10',
    },
    {
      name: 'Incline Dumbbell Press',
      muscleGroup: 'Chest',
      type: 'Compound',
      category: 'Strength',
      equipment: 'Dumbbell',
      sets: 3,
      reps: '12',
    },
    {
      name: 'Cable Chest Fly',
      muscleGroup: 'Chest',
      type: 'Isolation',
      category: 'Hypertrophy',
      equipment: 'Cable',
      sets: 3,
      reps: '15',
    },
    {
      name: 'Tricep Rope Pushdown',
      muscleGroup: 'Triceps',
      type: 'Isolation',
      category: 'Hypertrophy',
      equipment: 'Cable',
      sets: 3,
      reps: '12',
    },
  ],
};

// ─── tag pill ──────────────────────────────────────────────────────────────
const TAG_MAP = {
  Strength:    'bg-emerald-100 text-emerald-800',
  Hypertrophy: 'bg-emerald-100 text-emerald-800',
  Barbell:     'bg-gray-100 text-gray-600',
  Dumbbell:    'bg-gray-100 text-gray-600',
  Cable:       'bg-gray-100 text-gray-600',
  Bodyweight:  'bg-gray-100 text-gray-600',
  Machine:     'bg-gray-100 text-gray-600',
  Cardio:      'bg-orange-100 text-orange-700',
};

function Pill({ label }) {
  return (
    <span className={'rounded-md px-2 py-0.5 text-[10px] font-medium ' + (TAG_MAP[label] || 'bg-gray-100 text-gray-600')}>
      {label}
    </span>
  );
}

// ─── single exercise row (card inside routine) ─────────────────────────────
function ExerciseRow({ ex, idx }) {
  const tags = [ex.category, ex.equipment].filter(Boolean);
  const imgSrc = ex.image || EXERCISE_IMAGES[ex.name];

  return (
    <div className="flex items-center gap-3 rounded-2xl bg-gray-50/70 p-2.5 transition hover:bg-emerald-50/40">
      {/* number circle */}
      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-xs font-black text-white shadow-sm">
        {idx + 1}
      </div>

      {/* exercise thumbnail */}
      <div className="relative flex h-13 w-13 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gray-900">
        {imgSrc ? (
          <img
            src={imgSrc}
            alt={ex.name}
            className="h-full w-full object-cover"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
        ) : (
          <Dumbbell className="h-6 w-6 text-emerald-400" />
        )}
      </div>

      {/* title & meta */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-gray-900 truncate">{ex.name}</p>
        <p className="text-[11px] text-gray-400 font-medium">
          {ex.muscleGroup || 'Chest'} &bull; {ex.type || 'Compound'}
        </p>
        <div className="mt-1 flex flex-wrap gap-1.5">
          {tags.map((t) => (
            <Pill key={t} label={t} />
          ))}
        </div>
      </div>

      {/* sets × reps */}
      <div className="shrink-0 text-right pr-1">
        <p className="text-sm font-black text-gray-900">
          {ex.sets} &times; {String(ex.reps).replace(' reps', '')}
        </p>
        <p className="text-[10px] text-gray-400 font-medium">reps</p>
      </div>

      <ChevronRight className="h-4 w-4 shrink-0 text-gray-300" />
    </div>
  );
}

// ─── workout plan card (routine block) ─────────────────────────────────────
function PlanCard({ plan, onAddEx }) {
  const estMin = plan.duration || `${(plan.exercises?.length || 0) * 8 + 15}–${(plan.exercises?.length || 0) * 8 + 30} min`;

  return (
    <div className="rounded-3xl border border-gray-100 bg-white p-4 shadow-sm space-y-4">
      {/* routine header */}
      <div className="flex items-start gap-3">
        {/* bicep badge */}
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-100 text-2xl shadow-sm">
          💪
        </div>

        {/* title & subtitle */}
        <div className="flex-1 min-w-0 pt-0.5">
          <h3 className="text-base font-extrabold text-gray-900 tracking-tight">{plan.name}</h3>
          <p className="text-xs text-gray-400 font-medium truncate">{plan.focus || plan.description}</p>
          <p className="mt-0.5 text-[11px] font-medium text-emerald-600">
            {plan.source === 'member' ? 'Created by you' : 'Recommended by Trainer'}
          </p>
        </div>

        {/* 3-dots and time badge */}
        <div className="flex flex-col items-end gap-1.5 shrink-0">
          <button type="button" className="p-1 text-gray-300 hover:text-gray-500">
            <MoreVertical className="h-4 w-4" />
          </button>
          <div className="flex items-center gap-1 rounded-lg bg-emerald-50 px-2 py-1 text-[11px] font-bold text-emerald-700">
            <BarChart2 className="h-3 w-3 text-emerald-600" />
            <span>{estMin}</span>
          </div>
        </div>
      </div>

      {/* exercise list */}
      <div className="space-y-2.5">
        {(plan.exercises || []).map((ex, i) => (
          <ExerciseRow key={ex.name + i} ex={ex} idx={i} />
        ))}
      </div>

      {/* + Add Exercise button */}
      <button
        type="button"
        onClick={onAddEx}
        className="flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-emerald-300 bg-emerald-50/40 py-3 text-xs font-bold text-emerald-700 hover:bg-emerald-100/70 transition-colors"
      >
        <Plus className="h-4 w-4 text-emerald-600" /> Add Exercise
      </button>
    </div>
  );
}

// ─── muscle groups tab ─────────────────────────────────────────────────────
const GROUPS = [
  { label: 'Chest',     grad: 'from-rose-500 to-pink-600' },
  { label: 'Back',      grad: 'from-blue-500 to-indigo-600' },
  { label: 'Legs',      grad: 'from-amber-500 to-orange-600' },
  { label: 'Shoulders', grad: 'from-violet-500 to-purple-600' },
  { label: 'Arms',      grad: 'from-emerald-500 to-teal-600' },
  { label: 'Core',      grad: 'from-sky-500 to-cyan-600' },
  { label: 'Cardio',    grad: 'from-red-500 to-rose-600' },
  { label: 'Full Body', grad: 'from-gray-600 to-gray-800' },
];

function MuscleGroupsTab() {
  return (
    <div className="grid grid-cols-2 gap-3">
      {GROUPS.map((g) => (
        <div key={g.label} className={'relative overflow-hidden rounded-2xl bg-gradient-to-br ' + g.grad + ' p-4 text-white shadow-sm'}>
          <div className="absolute -right-3 -top-3 h-16 w-16 rounded-full bg-white/10" />
          <Dumbbell className="h-6 w-6 opacity-85" />
          <p className="mt-3 font-bold text-sm">{g.label}</p>
        </div>
      ))}
    </div>
  );
}

// ─── history tab ───────────────────────────────────────────────────────────
const DAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
const DONE = [true, false, true, true, false, true, false];
const HIST = [
  { name: 'Push Day Strength', date: 'Today', dur: '52 min', cal: 320 },
  { name: 'Leg Day',           date: 'Yesterday', dur: '48 min', cal: 410 },
  { name: 'Pull Day',          date: '2 days ago', dur: '44 min', cal: 295 },
];

function HistoryTab() {
  return (
    <div className="space-y-3">
      <div className="rounded-3xl bg-white p-4 shadow-sm border border-gray-100">
        <p className="mb-3 text-xs font-semibold text-gray-400">This Week</p>
        <div className="flex justify-between">
          {DAYS.map((d, i) => (
            <div key={i} className="flex flex-col items-center gap-1.5">
              <div className={'flex h-9 w-9 items-center justify-center rounded-full ' + (DONE[i] ? 'bg-emerald-500' : 'bg-gray-100')}>
                {DONE[i] ? <CheckCircle2 className="h-5 w-5 text-white" /> : <span className="text-xs text-gray-400 font-medium">{d}</span>}
              </div>
              <span className="text-[10px] text-gray-400">{d}</span>
            </div>
          ))}
        </div>
      </div>
      {HIST.map((h) => (
        <div key={h.name} className="flex items-center gap-3 rounded-2xl bg-white px-4 py-3 shadow-sm border border-gray-100">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50">
            <CheckCircle2 className="h-6 w-6 text-emerald-500" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-bold text-gray-900">{h.name}</p>
            <p className="text-xs text-gray-400">{h.date}</p>
          </div>
          <div className="text-right">
            <p className="text-sm font-bold text-gray-800">{h.dur}</p>
            <p className="text-xs text-orange-500 font-medium">{h.cal} cal</p>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── exercise library for create modal ────────────────────────────────────
const LIBRARY = [
  { name: 'Barbell Bench Press',   muscleGroup: 'Chest',     type: 'Compound',  category: 'Strength',    equipment: 'Barbell' },
  { name: 'Incline Dumbbell Press',muscleGroup: 'Chest',     type: 'Compound',  category: 'Strength',    equipment: 'Dumbbell' },
  { name: 'Cable Chest Fly',       muscleGroup: 'Chest',     type: 'Isolation', category: 'Hypertrophy', equipment: 'Cable' },
  { name: 'Tricep Rope Pushdown',  muscleGroup: 'Arms',      type: 'Isolation', category: 'Hypertrophy', equipment: 'Cable' },
  { name: 'Pull-ups',              muscleGroup: 'Back',      type: 'Compound',  category: 'Strength',    equipment: 'Bodyweight' },
  { name: 'Barbell Row',           muscleGroup: 'Back',      type: 'Compound',  category: 'Strength',    equipment: 'Barbell' },
  { name: 'Squat',                 muscleGroup: 'Legs',      type: 'Compound',  category: 'Strength',    equipment: 'Barbell' },
  { name: 'Leg Press',             muscleGroup: 'Legs',      type: 'Compound',  category: 'Hypertrophy', equipment: 'Machine' },
  { name: 'Overhead Press',        muscleGroup: 'Shoulders', type: 'Compound',  category: 'Strength',    equipment: 'Barbell' },
  { name: 'Lateral Raise',         muscleGroup: 'Shoulders', type: 'Isolation', category: 'Hypertrophy', equipment: 'Dumbbell' },
  { name: 'Bicep Curl',            muscleGroup: 'Arms',      type: 'Isolation', category: 'Hypertrophy', equipment: 'Dumbbell' },
  { name: 'Plank',                 muscleGroup: 'Core',      type: 'Isometric', category: 'Strength',    equipment: 'Bodyweight' },
  { name: 'Treadmill Run',         muscleGroup: 'Cardio',    type: 'Cardio',    category: 'Cardio',      equipment: 'Machine' },
];

const MUSCLE_FILTERS = ['All', 'Chest', 'Back', 'Legs', 'Shoulders', 'Arms', 'Core', 'Cardio'];

// ─── create workout modal ──────────────────────────────────────────────────
function CreateModal({ onClose, onSave }) {
  const [step, setStep]         = useState(1);
  const [planName, setPlanName] = useState('');
  const [focus, setFocus]       = useState('');
  const [muscle, setMuscle]     = useState('All');
  const [search, setSearch]     = useState('');
  const [selected, setSelected] = useState([]);
  const [done, setDone]         = useState(false);

  const filtered = useMemo(
    () =>
      LIBRARY.filter(
        (e) =>
          (muscle === 'All' || e.muscleGroup === muscle) &&
          (!search || e.name.toLowerCase().includes(search.toLowerCase()))
      ),
    [muscle, search]
  );

  function toggle(ex) {
    setSelected((prev) =>
      prev.find((e) => e.name === ex.name)
        ? prev.filter((e) => e.name !== ex.name)
        : [...prev, { ...ex, sets: 3, reps: '10', rest: '60s' }]
    );
  }

  function upd(name, field, val) {
    setSelected((prev) => prev.map((e) => (e.name === name ? { ...e, [field]: val } : e)));
  }

  function save() {
    onSave({
      id: 'my-' + Date.now(),
      name: planName,
      focus: focus || 'Custom Routine',
      source: 'member',
      duration: `${selected.length * 8 + 15}–${selected.length * 8 + 30} min`,
      exercises: selected,
    });
    setDone(true);
  }

  // success view
  if (done) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
        <div className="w-full max-w-sm rounded-3xl bg-white p-6 text-center shadow-2xl">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
            <CheckCircle2 className="h-9 w-9 text-emerald-600" />
          </div>
          <h2 className="text-xl font-extrabold text-gray-900">Workout Created! 💪</h2>
          <p className="mt-2 text-xs text-gray-500">
            <span className="font-bold text-gray-800">"{planName}"</span> has been added to your workout plans.
          </p>
          <div className="mt-4 grid grid-cols-3 gap-2 rounded-2xl bg-emerald-50 p-3 text-center">
            <div>
              <p className="text-lg font-black text-emerald-700">{selected.length}</p>
              <p className="text-[10px] text-emerald-600 font-medium">Exercises</p>
            </div>
            <div>
              <p className="text-lg font-black text-emerald-700">
                {selected.reduce((s, e) => s + Number(e.sets || 0), 0)}
              </p>
              <p className="text-[10px] text-emerald-600 font-medium">Total Sets</p>
            </div>
            <div>
              <p className="text-lg font-black text-emerald-700">~{selected.length * 8 + 15}m</p>
              <p className="text-[10px] text-emerald-600 font-medium">Est. Time</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="mt-5 w-full rounded-2xl bg-emerald-500 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-500/25 hover:bg-emerald-600 transition"
          >
            Let's Go! 🔥
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 p-0 sm:p-4 backdrop-blur-sm">
      <div className="flex w-full max-w-md flex-col rounded-t-3xl sm:rounded-3xl bg-white max-h-[90vh] shadow-2xl overflow-hidden">
        {/* header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Step {step} of 2</p>
            <h2 className="text-base font-extrabold text-gray-900">{step === 1 ? 'Plan Details' : 'Add Exercises'}</h2>
          </div>
          <button onClick={onClose} className="rounded-full p-1.5 text-gray-400 hover:bg-gray-100">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="h-1 bg-gray-100">
          <div className="h-1 bg-emerald-500 transition-all duration-300" style={{ width: step === 1 ? '50%' : '100%' }} />
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {step === 1 && (
            <>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">Workout Name *</label>
                <input
                  value={planName}
                  onChange={(e) => setPlanName(e.target.value)}
                  placeholder="e.g. Push Day Strength"
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-100"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">Focus / Target Muscles</label>
                <input
                  value={focus}
                  onChange={(e) => setFocus(e.target.value)}
                  placeholder="e.g. Chest, shoulders and triceps"
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-100"
                />
              </div>
              <div className="rounded-2xl bg-emerald-50/80 p-4 space-y-2 text-xs text-emerald-800">
                <p className="font-semibold">💡 Trainer Tips:</p>
                <p>• Aim for 4–6 compound and isolation exercises per session.</p>
                <p>• Allow 48 hours recovery before training the same muscle group.</p>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              {selected.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs font-bold text-gray-500">Selected Exercises ({selected.length})</p>
                  {selected.map((ex) => (
                    <div key={ex.name} className="flex items-center gap-2.5 rounded-xl border border-emerald-100 bg-emerald-50/60 px-3 py-2">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 text-[10px] font-bold text-white">
                        {selected.indexOf(ex) + 1}
                      </div>
                      <p className="flex-1 truncate text-xs font-bold text-gray-800">{ex.name}</p>
                      <input
                        type="number"
                        value={ex.sets}
                        onChange={(e) => upd(ex.name, 'sets', e.target.value)}
                        className="w-9 rounded border border-emerald-200 text-center text-xs py-0.5"
                        min={1}
                      />
                      <span className="text-xs text-gray-400">×</span>
                      <input
                        value={ex.reps}
                        onChange={(e) => upd(ex.name, 'reps', e.target.value)}
                        className="w-10 rounded border border-emerald-200 text-center text-xs py-0.5"
                        placeholder="10"
                      />
                      <button onClick={() => toggle(ex)} className="text-red-400 hover:text-red-600 pl-1">
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search exercise..."
                className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-emerald-500 focus:outline-none"
              />

              <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
                {MUSCLE_FILTERS.map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setMuscle(m)}
                    className={
                      'shrink-0 rounded-full px-3 py-1 text-xs font-semibold transition ' +
                      (muscle === m
                        ? 'bg-emerald-500 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200')
                    }
                  >
                    {m}
                  </button>
                ))}
              </div>

              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {filtered.map((ex) => {
                  const picked = selected.some((e) => e.name === ex.name);
                  return (
                    <button
                      key={ex.name}
                      type="button"
                      onClick={() => toggle(ex)}
                      className={
                        'flex w-full items-center gap-3 rounded-xl border p-2.5 text-left transition ' +
                        (picked
                          ? 'border-emerald-400 bg-emerald-50/70'
                          : 'border-gray-100 bg-white hover:border-emerald-200')
                      }
                    >
                      <div
                        className={
                          'flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ' +
                          (picked ? 'bg-emerald-500 text-white' : 'bg-gray-100 text-gray-400')
                        }
                      >
                        {picked ? <CheckCircle2 className="h-4 w-4" /> : <Dumbbell className="h-4 w-4" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="truncate text-xs font-bold text-gray-900">{ex.name}</p>
                        <p className="text-[10px] text-gray-400 font-medium">{ex.muscleGroup} &bull; {ex.type}</p>
                      </div>
                      <div className="flex gap-1">
                        <Pill label={ex.category} />
                        <Pill label={ex.equipment} />
                      </div>
                    </button>
                  );
                })}
              </div>
            </>
          )}
        </div>

        <div className="border-t border-gray-100 p-4">
          {step === 1 && (
            <button
              disabled={!planName.trim()}
              onClick={() => setStep(2)}
              className="w-full rounded-2xl bg-emerald-500 py-3 font-bold text-white disabled:opacity-40 hover:bg-emerald-600 transition"
            >
              Next: Select Exercises →
            </button>
          )}
          {step === 2 && (
            <div className="flex gap-2">
              <button
                onClick={() => setStep(1)}
                className="flex-1 rounded-2xl border border-gray-200 py-3 text-xs font-bold text-gray-600 hover:bg-gray-50"
              >
                ← Back
              </button>
              <button
                disabled={selected.length === 0}
                onClick={save}
                className="flex-1 rounded-2xl bg-emerald-500 py-3 text-xs font-bold text-white disabled:opacity-40 hover:bg-emerald-600 transition"
              >
                Save Plan ({selected.length})
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ══ MAIN EXPORT ════════════════════════════════════════════════════════════
export default function MemberWorkout({ workouts = [], workout, onShowQR }) {
  const { user } = useAuth();
  const firstName = user?.name?.split(' ')[0] || 'Saiful';
  const [tab, setTab] = useState('myplan');
  const [showCreate, setShowCreate] = useState(false);
  const [custom, setCustom] = useState([]);

  // Default to DEFAULT_PLAN so user sees the Push Day Strength mockup immediately
  const allPlans = useMemo(() => {
    const base = workouts.length ? workouts : workout ? [workout] : [DEFAULT_PLAN];
    return [...custom, ...base];
  }, [workouts, workout, custom]);

  function handleSave(plan) {
    setCustom((prev) => [plan, ...prev]);
    setTab('myplan');
  }

  const TABS = [
    { id: 'myplan',  label: 'My Plan' },
    { id: 'muscles', label: 'Muscle Groups' },
    { id: 'history', label: 'History' },
  ];

  return (
    <div style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }} className="space-y-4 pb-4">
      {/* ── TOP APP BAR (Branding + Actions) ─────────────────────────── */}
      <div className="flex items-center justify-between pt-1">
        {/* brand */}
        <div>
          <h1 className="text-2xl font-black tracking-tight text-gray-900 leading-none">
            bilzy<span className="text-emerald-500">fit</span>
          </h1>
          <p className="mt-1 text-[8.5px] font-extrabold tracking-[0.22em] text-gray-400 uppercase">
            TRAIN &bull; TRACK &bull; TRANSFORM
          </p>
        </div>

        {/* right icons */}
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

      {/* ── HERO HEADER WITH ATHLETE BANNER ──────────────────────────── */}
      <div className="relative overflow-hidden rounded-3xl bg-white p-5 shadow-sm border border-gray-100" style={{ minHeight: 146 }}>
        {/* Soft organic green background bubbles */}
        <div
          className="absolute -right-6 -top-6 h-44 w-44 rounded-full bg-emerald-100/60 pointer-events-none"
          style={{ filter: 'blur(1px)' }}
        />
        <div
          className="absolute right-20 -bottom-8 h-28 w-28 rounded-full bg-emerald-50 pointer-events-none"
        />

        {/* Athlete Image on the right */}
        <div className="absolute right-0 bottom-0 top-0 w-36 overflow-hidden pointer-events-none flex items-end justify-end">
          <img
            src={bannerImg}
            alt="Fit athlete lifting dumbbell"
            className="h-38 w-auto object-cover object-top"
            style={{ objectPosition: 'top center' }}
          />
        </div>

        {/* Left greeting text */}
        <div className="relative z-10 pr-32">
          <p className="text-xs font-semibold text-gray-500">Hi, {firstName} 👋</p>
          <h2 className="mt-1 text-2xl font-black text-gray-900 tracking-tight leading-tight">
            My <span className="text-emerald-500">Workout</span>
          </h2>
          <p className="mt-1 text-xs text-gray-400 font-medium">
            Stay consistent, get stronger 💪
          </p>
        </div>
      </div>

      {/* ── WEEKLY STATS (Calendar, Calories, Time) ───────────────────── */}
      <div className="flex items-center divide-x divide-gray-100 rounded-3xl bg-white p-3.5 shadow-sm border border-gray-100">
        {/* stat 1: Workouts */}
        <div className="flex flex-1 items-center gap-2.5 px-2">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-emerald-50">
            <svg viewBox="0 0 24 24" className="h-5 w-5 text-emerald-600" fill="none" stroke="currentColor" strokeWidth="2.5">
              <rect x="3" y="4" width="18" height="18" rx="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
          </div>
          <div>
            <p className="text-[10px] text-gray-400 font-medium">This Week</p>
            <p className="text-base font-extrabold text-gray-900 leading-none my-0.5">4 / 6</p>
            <p className="text-[10px] text-gray-400 font-medium">Workouts</p>
          </div>
        </div>

        {/* stat 2: Calories */}
        <div className="flex flex-1 items-center gap-2 px-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-orange-50">
            <Flame className="h-5 w-5 text-orange-500" />
          </div>
          <div>
            <p className="text-base font-extrabold text-gray-900 leading-none">630</p>
            <p className="mt-1 text-[10px] text-gray-400 font-medium">Calories</p>
          </div>
        </div>

        {/* stat 3: Total Time */}
        <div className="flex flex-1 items-center gap-2 px-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-sky-50">
            <Clock className="h-5 w-5 text-sky-500" />
          </div>
          <div>
            <p className="text-base font-extrabold text-gray-900 leading-none">2h 15m</p>
            <p className="mt-1 text-[10px] text-gray-400 font-medium">Total Time</p>
          </div>
        </div>
      </div>

      {/* ── TABS + CREATE BUTTON ─────────────────────────────────────── */}
      <div className="flex items-center justify-between gap-2 pt-1">
        {/* tabs */}
        <div className="flex items-center gap-5 border-b border-gray-100 flex-1">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={
                'relative pb-2.5 text-xs font-bold transition-colors ' +
                (tab === t.id
                  ? 'text-emerald-700'
                  : 'text-gray-400 hover:text-gray-600')
              }
            >
              {t.label}
              {tab === t.id && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-emerald-500" />
              )}
            </button>
          ))}
        </div>

        {/* + Create My Workout button */}
        <button
          type="button"
          onClick={() => setShowCreate(true)}
          className="flex shrink-0 items-center gap-1.5 rounded-full bg-emerald-500 px-3.5 py-2 text-xs font-bold text-white shadow-md shadow-emerald-500/20 hover:bg-emerald-600 active:scale-95 transition"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>Create My Workout</span>
        </button>
      </div>

      {/* ── TAB CONTENT ─────────────────────────────────────────────── */}
      {tab === 'myplan' && (
        <div className="space-y-4">
          {allPlans.map((p) => (
            <PlanCard
              key={p.id || p.name}
              plan={p}
              onAddEx={() => setShowCreate(true)}
            />
          ))}
        </div>
      )}

      {tab === 'muscles' && <MuscleGroupsTab />}

      {tab === 'history' && <HistoryTab />}

      {/* ── CREATE MODAL ─────────────────────────────────────────────── */}
      {showCreate && (
        <CreateModal
          onClose={() => setShowCreate(false)}
          onSave={handleSave}
        />
      )}
    </div>
  );
}