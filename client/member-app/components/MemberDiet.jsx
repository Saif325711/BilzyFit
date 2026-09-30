import { useState, useMemo } from 'react';
import {
  Plus,
  Flame,
  CheckCircle2,
  Clock,
  Sparkles,
  ChevronRight,
  MoreVertical,
  X,
  Trash2,
  Bell,
  QrCode,
  Droplets,
  Apple,
} from 'lucide-react';
import { useAuth } from '../../src/context/AuthContext';

// ── default rich diet plan (matches workout screen standard) ────────────────
const DEFAULT_DIET_PLAN = {
  id: 'diet-muscle-fuel',
  name: 'Balanced Muscle Fuel',
  description: 'High protein, lean carb nutrition plan',
  source: 'trainer',
  totalCalories: 1840,
  meals: [
    {
      type: 'Breakfast',
      time: '8:00 AM – 9:00 AM',
      items: 'Rolled Oats (60g), 4 Boiled Eggs, Almonds & Banana',
      calories: 450,
      protein: 34,
      carbs: 52,
      fats: 12,
      emoji: '🥞',
      image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=160&auto=format&fit=crop&q=80',
    },
    {
      type: 'Lunch',
      time: '1:00 PM – 2:00 PM',
      items: 'Grilled Chicken / Paneer (150g), Brown Rice & Steamed Broccoli',
      calories: 620,
      protein: 46,
      carbs: 60,
      fats: 16,
      emoji: '🥗',
      image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=160&auto=format&fit=crop&q=80',
    },
    {
      type: 'Evening Snack',
      time: '5:00 PM – 6:00 PM',
      items: 'Greek Yogurt with Chia Seeds, Apple & Whey Scoop',
      calories: 260,
      protein: 24,
      carbs: 28,
      fats: 6,
      emoji: '🍎',
      image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=160&auto=format&fit=crop&q=80',
    },
    {
      type: 'Dinner',
      time: '8:30 PM – 9:30 PM',
      items: 'Tofu / Fish / Cottage Cheese, Sauteed Veggies & 2 Rotis',
      calories: 510,
      protein: 38,
      carbs: 45,
      fats: 14,
      emoji: '🥩',
      image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=160&auto=format&fit=crop&q=80',
    },
  ],
};

// ─── Single Meal Item Card ──────────────────────────────────────────────────
function MealItemCard({ meal, isEaten, onToggle }) {
  return (
    <div
      onClick={onToggle}
      className={`group flex items-start gap-3 rounded-2xl p-3 cursor-pointer transition-all border ${
        isEaten
          ? 'bg-emerald-50/60 border-emerald-200'
          : 'bg-gray-50/70 border-gray-100 hover:bg-emerald-50/30'
      }`}
    >
      {/* Food thumbnail photo or emoji fallback */}
      <div className="relative flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gray-900 shadow-sm">
        {meal.image ? (
          <img
            src={meal.image}
            alt={meal.type}
            className="h-full w-full object-cover"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
        ) : (
          <span className="text-2xl">{meal.emoji || '🍽️'}</span>
        )}
      </div>

      {/* Details */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="text-base">{meal.emoji || '🍽️'}</span>
            <p
              className={`text-sm font-extrabold tracking-tight ${
                isEaten ? 'text-emerald-800 line-through' : 'text-gray-900'
              }`}
            >
              {meal.type}
            </p>
          </div>
          <span className="text-xs font-black text-orange-600">
            {meal.calories} kcal
          </span>
        </div>

        <p className="mt-0.5 text-[10px] text-gray-400 font-semibold flex items-center gap-1">
          <Clock className="h-3 w-3" />
          {meal.time || 'Flexible Timing'}
        </p>

        <p className="mt-1 text-xs text-gray-600 font-medium leading-relaxed">
          {meal.items}
        </p>

        {/* Macro tags */}
        {(meal.protein > 0 || meal.carbs > 0) && (
          <div className="mt-2 flex flex-wrap gap-1.5">
            <span className="rounded-md bg-emerald-100 px-1.5 py-0.5 text-[9px] font-bold text-emerald-800">
              P: {meal.protein}g
            </span>
            <span className="rounded-md bg-sky-100 px-1.5 py-0.5 text-[9px] font-bold text-sky-800">
              C: {meal.carbs}g
            </span>
            <span className="rounded-md bg-amber-100 px-1.5 py-0.5 text-[9px] font-bold text-amber-800">
              F: {meal.fats}g
            </span>
          </div>
        )}
      </div>

      {/* Checkbox indicator */}
      <div className="shrink-0 pt-1">
        <div
          className={`flex h-6 w-6 items-center justify-center rounded-full border-2 transition-colors ${
            isEaten
              ? 'border-emerald-500 bg-emerald-500 text-white'
              : 'border-gray-300 bg-white group-hover:border-emerald-400'
          }`}
        >
          {isEaten && <CheckCircle2 className="h-4 w-4" />}
        </div>
      </div>
    </div>
  );
}

// ─── Plan Container Card ───────────────────────────────────────────────────
function DietPlanContainer({ plan, eatenMeals, onToggleMeal, onCustomize }) {
  const totalCals =
    plan.totalCalories ||
    plan.meals?.reduce((sum, m) => sum + (Number(m.calories) || 0), 0) ||
    1840;

  return (
    <div className="rounded-3xl border border-gray-100 bg-white p-4 shadow-sm space-y-4">
      {/* Plan Header */}
      <div className="flex items-start gap-3">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-100 text-2xl shadow-sm">
          🥗
        </div>
        <div className="flex-1 min-w-0 pt-0.5">
          <h3 className="text-base font-extrabold text-gray-900 tracking-tight">
            {plan.name}
          </h3>
          <p className="text-xs text-gray-400 font-medium truncate">
            {plan.description}
          </p>
          <p className="mt-0.5 text-[11px] font-medium text-emerald-600">
            {plan.source === 'member'
              ? 'Created by you'
              : 'Recommended by Nutritionist'}
          </p>
        </div>
        <div className="flex flex-col items-end gap-1.5 shrink-0">
          <button type="button" className="p-1 text-gray-300 hover:text-gray-500">
            <MoreVertical className="h-4 w-4" />
          </button>
          <div className="flex items-center gap-1 rounded-lg bg-orange-50 px-2 py-1 text-[11px] font-bold text-orange-700">
            <Flame className="h-3 w-3 text-orange-500" />
            <span>{totalCals} kcal</span>
          </div>
        </div>
      </div>

      {/* Meals list */}
      <div className="space-y-2.5">
        {(plan.meals || []).map((meal, idx) => (
          <MealItemCard
            key={meal.type + idx}
            meal={meal}
            isEaten={eatenMeals.includes(meal.type)}
            onToggle={() => onToggleMeal(meal.type)}
          />
        ))}
      </div>

      {/* Customize / Add button */}
      <button
        type="button"
        onClick={onCustomize}
        className="flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-emerald-300 bg-emerald-50/40 py-3 text-xs font-bold text-emerald-700 hover:bg-emerald-100/70 transition-colors"
      >
        <Plus className="h-4 w-4 text-emerald-600" /> Customize Meal Plan
      </button>
    </div>
  );
}

// ─── Macro Breakdown Tab ───────────────────────────────────────────────────
function MacroBreakdownTab({ plan }) {
  const totalProtein =
    plan.meals?.reduce((sum, m) => sum + (Number(m.protein) || 0), 0) || 142;
  const totalCarbs =
    plan.meals?.reduce((sum, m) => sum + (Number(m.carbs) || 0), 0) || 185;
  const totalFats =
    plan.meals?.reduce((sum, m) => sum + (Number(m.fats) || 0), 0) || 48;

  return (
    <div className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm space-y-4">
      <div>
        <h3 className="text-base font-extrabold text-gray-900 tracking-tight">
          Macronutrient Distribution
        </h3>
        <p className="text-xs text-gray-400 font-medium">
          Targeted macro ratio optimized for body recomposition and steady energy.
        </p>
      </div>

      <div className="space-y-3.5 pt-1">
        {/* Protein */}
        <div>
          <div className="flex justify-between text-xs font-bold mb-1">
            <span className="text-emerald-800">🍗 Protein (Muscle Synthesis)</span>
            <span className="text-gray-900">{totalProtein}g / 160g</span>
          </div>
          <div className="h-2.5 w-full rounded-full bg-gray-100 overflow-hidden">
            <div
              className="h-full bg-emerald-500 rounded-full transition-all"
              style={{ width: `${Math.min(100, (totalProtein / 160) * 100)}%` }}
            />
          </div>
        </div>

        {/* Carbs */}
        <div>
          <div className="flex justify-between text-xs font-bold mb-1">
            <span className="text-sky-800">🌾 Carbohydrates (Workout Energy)</span>
            <span className="text-gray-900">{totalCarbs}g / 220g</span>
          </div>
          <div className="h-2.5 w-full rounded-full bg-gray-100 overflow-hidden">
            <div
              className="h-full bg-sky-500 rounded-full transition-all"
              style={{ width: `${Math.min(100, (totalCarbs / 220) * 100)}%` }}
            />
          </div>
        </div>

        {/* Fats */}
        <div>
          <div className="flex justify-between text-xs font-bold mb-1">
            <span className="text-amber-800">🥑 Healthy Fats (Hormone Health)</span>
            <span className="text-gray-900">{totalFats}g / 65g</span>
          </div>
          <div className="h-2.5 w-full rounded-full bg-gray-100 overflow-hidden">
            <div
              className="h-full bg-amber-500 rounded-full transition-all"
              style={{ width: `${Math.min(100, (totalFats / 65) * 100)}%` }}
            />
          </div>
        </div>
      </div>

      <div className="rounded-2xl bg-emerald-50/70 p-4 border border-emerald-100 text-xs text-emerald-800 space-y-1">
        <p className="font-extrabold flex items-center gap-1.5">
          <Sparkles className="h-4 w-4 text-emerald-600" /> Nutritionist Pro Tip
        </p>
        <p className="leading-relaxed">
          Consume 25g–35g of lean protein within 45 minutes after your workout to accelerate muscle fiber recovery and reduce soreness.
        </p>
      </div>
    </div>
  );
}

// ─── Hydration Tab ─────────────────────────────────────────────────────────
function HydrationTab({ glasses, onAdjust }) {
  const targetGlasses = 12; // 3.0 Liters
  const liters = (glasses * 0.25).toFixed(1);
  const percentage = Math.min(100, Math.round((glasses / targetGlasses) * 100));

  return (
    <div className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm text-center space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-extrabold text-gray-900 tracking-tight text-left">
          Water Intake Tracker
        </h3>
        <span className="rounded-full bg-sky-100 px-3 py-1 text-xs font-extrabold text-sky-700">
          Target: 3.0 L
        </span>
      </div>

      {/* Big Water Ring Graphic */}
      <div className="mx-auto flex h-36 w-36 items-center justify-center rounded-full bg-sky-50 border-4 border-sky-200 shadow-inner">
        <div>
          <Droplets className="mx-auto h-7 w-7 text-sky-500" />
          <p className="mt-1 text-2xl font-black text-sky-900">{liters} L</p>
          <p className="text-[10px] font-bold text-gray-400">
            {glasses} / {targetGlasses} glasses ({percentage}%)
          </p>
        </div>
      </div>

      {/* Adjust Buttons */}
      <div className="flex items-center justify-center gap-3 pt-1">
        <button
          type="button"
          onClick={() => onAdjust(-1)}
          className="rounded-2xl border border-gray-200 bg-white px-4 py-2.5 text-xs font-bold text-gray-700 shadow-sm hover:bg-gray-50 active:scale-95 transition"
        >
          -250ml
        </button>
        <button
          type="button"
          onClick={() => onAdjust(1)}
          className="flex items-center gap-1.5 rounded-2xl bg-sky-500 px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-sky-500/25 hover:bg-sky-600 active:scale-95 transition"
        >
          <Plus className="h-4 w-4" /> Add 250ml Glass
        </button>
      </div>

      <div className="rounded-2xl bg-sky-50/60 p-3.5 text-left border border-sky-100 text-xs text-sky-800">
        💧 Drinking sufficient water boosts athletic stamina by up to 15% and speeds up nutrient absorption into muscle cells.
      </div>
    </div>
  );
}

// ─── Create Diet Plan Modal ────────────────────────────────────────────────
function CreateDietModal({ onClose, onSave }) {
  const [name, setName] = useState('High Protein Clean Diet');
  const [desc, setDesc] = useState('Optimized for lean muscle recovery');
  const [targetCalories, setTargetCalories] = useState('2100');
  const [dietGoal, setDietGoal] = useState('Muscle Gain');
  const [meals, setMeals] = useState([
    { type: 'Breakfast', emoji: '🥞', items: 'Rolled Oats (60g), 4 Boiled Eggs, Almonds & Banana', calories: 450, protein: 34 },
    { type: 'Lunch', emoji: '🥗', items: 'Grilled Chicken / Paneer (150g), Brown Rice & Steamed Broccoli', calories: 620, protein: 46 },
    { type: 'Snack', emoji: '🍎', items: 'Greek Yogurt with Chia Seeds, Apple & Whey Scoop', calories: 260, protein: 24 },
    { type: 'Dinner', emoji: '🥩', items: 'Tofu / Fish / Cottage Cheese, Sauteed Veggies & 2 Rotis', calories: 510, protein: 38 },
  ]);
  const [done, setDone] = useState(false);

  const mealPresets = [
    { type: 'Breakfast', emoji: '🥞' },
    { type: 'Lunch', emoji: '🥗' },
    { type: 'Snack', emoji: '🍎' },
    { type: 'Dinner', emoji: '🥩' },
    { type: 'Post-Workout', emoji: '⚡' },
  ];

  const totalPlannedCalories = useMemo(
    () => meals.reduce((sum, m) => sum + (Number(m.calories) || 0), 0),
    [meals]
  );

  const totalPlannedProtein = useMemo(
    () => meals.reduce((sum, m) => sum + (Number(m.protein) || 0), 0),
    [meals]
  );

  function updateMeal(index, field, val) {
    setMeals((prev) =>
      prev.map((m, i) => (i === index ? { ...m, [field]: val } : m))
    );
  }

  function addMeal() {
    setMeals((prev) => [
      ...prev,
      {
        type: `Meal ${prev.length + 1}`,
        emoji: '🍽️',
        items: '',
        calories: 300,
        protein: 20,
      },
    ]);
  }

  function removeMeal(index) {
    if (meals.length <= 1) return;
    setMeals((prev) => prev.filter((_, i) => i !== index));
  }

  function handleSave() {
    onSave({
      id: 'diet-' + Date.now(),
      name: `${dietGoal} · ${name.trim() || 'Custom Diet'}`,
      description: desc.trim() || 'Custom clean meal plan',
      source: 'member',
      totalCalories: totalPlannedCalories,
      meals: meals.map((m) => ({
        ...m,
        calories: Number(m.calories) || 0,
        protein: Number(m.protein) || 0,
      })),
    });
    setDone(true);
  }

  if (done) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-fadeIn">
        <div className="w-full max-w-sm rounded-3xl bg-white p-6 text-center shadow-2xl">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
            <CheckCircle2 className="h-9 w-9 text-emerald-600" />
          </div>
          <h2 className="text-xl font-extrabold text-gray-900">Diet Plan Saved! 🥗</h2>
          <p className="mt-2 text-xs text-gray-500">
            <span className="font-bold text-gray-800">"{name}"</span> is now active in your daily nutrition dashboard.
          </p>
          <div className="mt-4 grid grid-cols-2 gap-2 rounded-2xl bg-emerald-50 p-3 text-center">
            <div>
              <p className="text-base font-black text-emerald-700">{totalPlannedCalories} kcal</p>
              <p className="text-[10px] text-emerald-600 font-medium">Daily Target</p>
            </div>
            <div>
              <p className="text-base font-black text-emerald-700">{totalPlannedProtein}g</p>
              <p className="text-[10px] text-emerald-600 font-medium">Total Protein</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="mt-5 w-full rounded-2xl bg-emerald-500 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-500/25 hover:bg-emerald-600 transition"
          >
            Start Eating Clean! 🔥
          </button>
        </div>
      </div>
    );
  }

  const target = Number(targetCalories) || 2100;
  const calPercent = Math.min(100, Math.round((totalPlannedCalories / (target > 0 ? target : 1)) * 100));

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 p-0 sm:p-4 backdrop-blur-sm animate-fadeIn">
      <div className="flex w-full max-w-lg flex-col rounded-t-3xl sm:rounded-3xl bg-white max-h-[90vh] shadow-2xl overflow-hidden">
        {/* Top Gradient Header */}
        <div className="bg-gradient-to-r from-emerald-800 to-emerald-600 p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/20 text-2xl backdrop-blur-sm shadow-sm">
              🥗
            </div>
            <div>
              <h2 className="text-lg font-black tracking-tight leading-tight">
                Build Nutrition Plan
              </h2>
              <p className="text-xs text-emerald-100 font-medium">
                Tailor macros, meals &amp; daily calories
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-white/80 hover:bg-white/20 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {/* Nutrition Goal Selector */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">
              Nutrition Goal
            </label>
            <div className="flex flex-wrap gap-1.5">
              {['Muscle Gain', 'Fat Loss', 'Lean Bulk', 'Maintenance', 'Clean Eating'].map((goal) => {
                const isSelected = dietGoal === goal;
                return (
                  <button
                    key={goal}
                    type="button"
                    onClick={() => {
                      setDietGoal(goal);
                      if (goal === 'Fat Loss') setTargetCalories('1800');
                      if (goal === 'Muscle Gain') setTargetCalories('2400');
                      if (goal === 'Lean Bulk') setTargetCalories('2600');
                      if (goal === 'Maintenance') setTargetCalories('2100');
                    }}
                    className={`rounded-xl px-3 py-1.5 text-xs font-bold transition-all ${
                      isSelected
                        ? 'bg-emerald-500 text-white shadow-sm shadow-emerald-500/30'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {goal}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Plan Name */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              Diet Plan Name *
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. High Protein Clean Diet"
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-50"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              Goal or Notes
            </label>
            <input
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              placeholder="e.g. Optimized for lean muscle recovery"
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-50"
            />
          </div>

          {/* Daily Calorie Target + Presets */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              Daily Calorie Target (kcal)
            </label>
            <input
              type="number"
              value={targetCalories}
              onChange={(e) => setTargetCalories(e.target.value)}
              placeholder="2100"
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-bold text-gray-900 focus:border-emerald-500 focus:outline-none"
            />
            <div className="flex gap-2 mt-1.5">
              {['1800', '2100', '2400', '2800'].map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setTargetCalories(preset)}
                  className="rounded-lg bg-gray-100 px-2.5 py-1 text-[11px] font-bold text-gray-600 hover:bg-gray-200 transition"
                >
                  {preset} kcal
                </button>
              ))}
            </div>
          </div>

          {/* Live Calorie & Macro Bar */}
          <div className="rounded-2xl border border-gray-100 bg-gray-50 p-3.5 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className={totalPlannedCalories > target ? 'text-red-600' : 'text-emerald-700'}>
                Planned: {totalPlannedCalories} kcal
              </span>
              <span className="text-gray-400">Target: {target} kcal</span>
              <span className="text-sky-700">Protein: {totalPlannedProtein}g</span>
            </div>
            <div className="h-2 w-full rounded-full bg-gray-200 overflow-hidden">
              <div
                className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                style={{ width: `${calPercent}%` }}
              />
            </div>
          </div>

          {/* Daily Meals Breakdown */}
          <div className="space-y-2.5 pt-1">
            <div className="flex items-center justify-between">
              <label className="text-xs font-extrabold text-gray-900">
                Daily Meals ({meals.length})
              </label>
              <span className="text-[11px] text-gray-400 font-medium">Configure items &amp; macros</span>
            </div>

            <div className="space-y-3">
              {meals.map((m, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl border border-gray-200/80 bg-white p-3.5 space-y-2.5 shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-emerald-100 text-xs font-black text-emerald-800">
                        {idx + 1}
                      </span>
                      <span className="text-base">{m.emoji}</span>
                      <span className="text-xs font-extrabold text-gray-900">{m.type}</span>
                    </div>

                    {meals.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeMeal(idx)}
                        className="text-red-400 hover:text-red-600 p-1 transition"
                        title="Remove meal"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>

                  {/* Meal type quick switch chips */}
                  <div className="flex gap-1 overflow-x-auto pb-1 no-scrollbar">
                    {mealPresets.map((preset) => {
                      const isCur = m.type === preset.type;
                      return (
                        <button
                          key={preset.type}
                          type="button"
                          onClick={() => {
                            updateMeal(idx, 'type', preset.type);
                            updateMeal(idx, 'emoji', preset.emoji);
                          }}
                          className={`shrink-0 rounded-lg px-2 py-0.5 text-[10px] font-bold transition ${
                            isCur
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                              : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                          }`}
                        >
                          {preset.emoji} {preset.type}
                        </button>
                      );
                    })}
                  </div>

                  {/* Food items input */}
                  <input
                    value={m.items}
                    onChange={(e) => updateMeal(idx, 'items', e.target.value)}
                    placeholder="Foods e.g. 4 Boiled Eggs, Oats, Milk"
                    className="w-full rounded-xl border border-gray-200 px-3 py-1.5 text-xs text-gray-800 focus:border-emerald-500 focus:outline-none"
                  />

                  {/* Calories & Protein side-by-side */}
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <label className="text-[10px] font-bold text-gray-400 block mb-0.5">
                        Calories (kcal)
                      </label>
                      <input
                        type="number"
                        value={m.calories}
                        onChange={(e) => updateMeal(idx, 'calories', e.target.value)}
                        className="w-full rounded-xl border border-gray-200 px-2.5 py-1 text-xs font-bold text-gray-800 focus:border-emerald-500 focus:outline-none"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="text-[10px] font-bold text-gray-400 block mb-0.5">
                        Protein (g)
                      </label>
                      <input
                        type="number"
                        value={m.protein || 0}
                        onChange={(e) => updateMeal(idx, 'protein', e.target.value)}
                        className="w-full rounded-xl border border-gray-200 px-2.5 py-1 text-xs font-bold text-gray-800 focus:border-emerald-500 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Add another meal */}
            <button
              type="button"
              onClick={addMeal}
              className="flex w-full items-center justify-center gap-1.5 rounded-2xl border border-dashed border-emerald-300 bg-emerald-50/50 py-3 text-xs font-extrabold text-emerald-700 hover:bg-emerald-100 transition"
            >
              <Plus className="h-4 w-4" /> Add Another Meal
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-100 p-4 flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-2xl border border-gray-200 py-3 text-xs font-bold text-gray-600 hover:bg-gray-50 transition"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={!name.trim()}
            onClick={handleSave}
            className="flex-2 w-full rounded-2xl bg-emerald-500 py-3 text-xs font-extrabold text-white shadow-md shadow-emerald-500/25 hover:bg-emerald-600 disabled:opacity-40 transition"
          >
            Save Diet Plan
          </button>
        </div>
      </div>
    </div>
  );
}

// ══ MAIN EXPORT ════════════════════════════════════════════════════════════
export default function MemberDiet({ diets = [], diet, onShowQR }) {
  const { user } = useAuth();
  const firstName = user?.name?.split(' ')[0] || 'Saiful';
  const [tab, setTab] = useState('meals'); // 'meals' | 'macros' | 'hydration'
  const [showCreate, setShowCreate] = useState(false);
  const [customDiets, setCustomDiets] = useState([]);
  const [eatenMeals, setEatenMeals] = useState(['Breakfast']);
  const [glasses, setGlasses] = useState(8);

  const activePlans = useMemo(() => {
    const base = diets.length ? diets : diet ? [diet] : [DEFAULT_DIET_PLAN];
    return [...customDiets, ...base];
  }, [diets, diet, customDiets]);

  const currentPlan = activePlans[0] || DEFAULT_DIET_PLAN;

  const totalCals =
    currentPlan.totalCalories ||
    currentPlan.meals?.reduce((sum, m) => sum + (Number(m.calories) || 0), 0) ||
    1840;

  const totalProtein =
    currentPlan.meals?.reduce((sum, m) => sum + (Number(m.protein) || 0), 0) ||
    142;
  const totalCarbs =
    currentPlan.meals?.reduce((sum, m) => sum + (Number(m.carbs) || 0), 0) ||
    185;
  const totalFats =
    currentPlan.meals?.reduce((sum, m) => sum + (Number(m.fats) || 0), 0) || 48;

  const eatenCals = (currentPlan.meals || [])
    .filter((m) => eatenMeals.includes(m.type))
    .reduce((sum, m) => sum + (Number(m.calories) || 0), 0);

  function handleToggleMeal(type) {
    setEatenMeals((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  }

  function handleAdjustWater(delta) {
    setGlasses((g) => Math.max(0, Math.min(16, g + delta)));
  }

  function handleSaveDiet(newPlan) {
    setCustomDiets((prev) => [newPlan, ...prev]);
    setTab('meals');
  }

  const TABS = [
    { id: 'meals',     label: "Today's Meals" },
    { id: 'macros',    label: 'Macro Breakdown' },
    { id: 'hydration', label: 'Hydration' },
  ];

  const calProgress = Math.min(
    100,
    Math.round((eatenCals / (totalCals > 0 ? totalCals : 1)) * 100)
  );

  return (
    <div style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }} className="space-y-4 pb-4">
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

      {/* ── HERO HEADER WITH FRESH DIET GRAPHIC ──────────────────────── */}
      <div className="relative overflow-hidden rounded-3xl bg-white p-5 shadow-sm border border-gray-100" style={{ minHeight: 146 }}>
        <div
          className="absolute -right-6 -top-6 h-44 w-44 rounded-full bg-emerald-100/60 pointer-events-none"
          style={{ filter: 'blur(1px)' }}
        />
        <div className="absolute right-20 -bottom-8 h-28 w-28 rounded-full bg-emerald-50 pointer-events-none" />

        {/* Nutrition visual on the right */}
        <div className="absolute right-3 top-3 bottom-3 w-36 overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100/80 flex flex-col items-center justify-center shadow-sm">
          <span className="text-4xl">🥗</span>
          <span className="mt-1 text-[11px] font-black text-emerald-700">100% Clean</span>
          <span className="text-[9px] font-semibold text-emerald-600/70">Whole Foods</span>
        </div>

        {/* Left greeting text */}
        <div className="relative z-10 pr-36">
          <p className="text-xs font-semibold text-gray-500">Hi, {firstName} 👋</p>
          <h2 className="mt-1 text-2xl font-black text-gray-900 tracking-tight leading-tight">
            My <span className="text-emerald-500">Diet Plan</span>
          </h2>
          <p className="mt-1 text-xs text-gray-400 font-medium">
            Eat clean, fuel your gains 🥑
          </p>
        </div>
      </div>

      {/* ── DAILY CALORIE & MACRO TARGET CARD ────────────────────────── */}
      <div className="rounded-3xl bg-white p-4 shadow-sm border border-gray-100 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-gray-400">Daily Calorie Target</p>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-2xl font-black text-gray-900 leading-none">
                {eatenCals}
              </span>
              <span className="text-xs font-bold text-gray-400">
                / {totalCals} kcal
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1 rounded-xl bg-emerald-50 px-2.5 py-1 text-xs font-black text-emerald-700">
            <Flame className="h-3.5 w-3.5 text-orange-500" />
            <span>{calProgress}% Done</span>
          </div>
        </div>

        {/* Linear progress bar */}
        <div className="h-2.5 w-full rounded-full bg-gray-100 overflow-hidden">
          <div
            className="h-full rounded-full bg-emerald-500 transition-all duration-300"
            style={{ width: `${calProgress}%` }}
          />
        </div>

        {/* 4 Macro Pills */}
        <div className="grid grid-cols-4 gap-2 pt-1">
          <div className="rounded-2xl bg-emerald-50/80 p-2 text-center">
            <p className="text-[10px] font-bold text-emerald-800">🍗 Protein</p>
            <p className="text-xs font-black text-emerald-700 mt-0.5">{totalProtein}g</p>
          </div>
          <div className="rounded-2xl bg-sky-50/80 p-2 text-center">
            <p className="text-[10px] font-bold text-sky-800">🌾 Carbs</p>
            <p className="text-xs font-black text-sky-700 mt-0.5">{totalCarbs}g</p>
          </div>
          <div className="rounded-2xl bg-amber-50/80 p-2 text-center">
            <p className="text-[10px] font-bold text-amber-800">🥑 Fats</p>
            <p className="text-xs font-black text-amber-700 mt-0.5">{totalFats}g</p>
          </div>
          <div className="rounded-2xl bg-purple-50/80 p-2 text-center">
            <p className="text-[10px] font-bold text-purple-800">💧 Water</p>
            <p className="text-xs font-black text-purple-700 mt-0.5">{(glasses * 0.25).toFixed(1)}L</p>
          </div>
        </div>
      </div>

      {/* ── TABS + CREATE DIET BUTTON ─────────────────────────────────── */}
      <div className="flex items-center justify-between gap-2 pt-1">
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

        <button
          type="button"
          onClick={() => setShowCreate(true)}
          className="flex shrink-0 items-center gap-1.5 rounded-full bg-emerald-500 px-3.5 py-2 text-xs font-bold text-white shadow-md shadow-emerald-500/20 hover:bg-emerald-600 active:scale-95 transition"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>Create Diet</span>
        </button>
      </div>

      {/* ── TAB CONTENT ──────────────────────────────────────────────── */}
      {tab === 'meals' && (
        <DietPlanContainer
          plan={currentPlan}
          eatenMeals={eatenMeals}
          onToggleMeal={handleToggleMeal}
          onCustomize={() => setShowCreate(true)}
        />
      )}

      {tab === 'macros' && <MacroBreakdownTab plan={currentPlan} />}

      {tab === 'hydration' && (
        <HydrationTab glasses={glasses} onAdjust={handleAdjustWater} />
      )}

      {/* ── CREATE DIET MODAL ────────────────────────────────────────── */}
      {showCreate && (
        <CreateDietModal
          onClose={() => setShowCreate(false)}
          onSave={handleSaveDiet}
        />
      )}
    </div>
  );
}
