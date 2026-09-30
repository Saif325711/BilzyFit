import { useState } from 'react';
import {
  Bell,
  QrCode,
  Edit3,
  Phone,
  Target,
  Scale,
  Heart,
  Shield,
  UserCheck,
  Dumbbell,
  Clock,
  Flame,
  Award,
  Lock,
  Headphones,
  CheckCircle2,
  ChevronRight,
  X,
  MessageSquare,
  LogOut,
  MapPin,
  KeyRound,
  Copy,
} from 'lucide-react';

export default function MemberProfile({
  member = {},
  membership = {},
  attendance = [],
  daysLeft = 23,
  gymCenter,
  onShowQR,
  onNavigate,
  onLogout,
}) {
  const [showSecretCode, setShowSecretCode] = useState(false);
  const [name, setName] = useState(
    member?.fullName || member?.name || 'Rahul Sharma'
  );
  const [phone, setPhone] = useState(member?.phone || '+91 98765 43210');
  const [goal, setGoal] = useState('Muscle Hypertrophy & Fat Loss');
  const [emergencyContact, setEmergencyContact] = useState(
    'Ananya Sharma (+91 98765 11223)'
  );
  const [workoutReminders, setWorkoutReminders] = useState(true);
  const [dietAlerts, setDietAlerts] = useState(true);

  const [showEditModal, setShowEditModal] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Form states for Edit modal
  const [editName, setEditName] = useState(name);
  const [editPhone, setEditPhone] = useState(phone);
  const [editGoal, setEditGoal] = useState(goal);
  const [editEmergency, setEditEmergency] = useState(emergencyContact);

  const email = member?.email || 'member@bilzyfit.com';
  const memberId = member?.memberCode || member?.id || 'BF-1024';
  const planName = membership?.planName || 'ALL ACCESS VIP PRO';
  const weight = member?.weight ? Number(member.weight) : 72.0;
  const height = member?.height ? Number(member.height) : 178;
  const bmi = (weight / Math.pow(height / 100, 2)).toFixed(1);

  function handleSaveProfile(e) {
    e.preventDefault();
    setName(editName.trim() || name);
    setPhone(editPhone.trim() || phone);
    setGoal(editGoal.trim() || goal);
    setEmergencyContact(editEmergency.trim() || emergencyContact);

    setShowEditModal(false);
    setToastMessage('Profile details updated successfully! ✨');
    setShowSuccessToast(true);
    setTimeout(() => setShowSuccessToast(false), 3500);
  }

  function handleSignOut() {
    if (window.confirm('Are you sure you want to sign out of BilzyFit Member App?')) {
      if (onLogout) {
        onLogout();
      } else {
        window.location.reload();
      }
    }
  }

  return (
    <div
      style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}
      className="space-y-4 pb-4 animate-fadeIn"
    >
      {/* ── SUCCESS TOAST NOTIFICATION ───────────────────────────────── */}
      {showSuccessToast && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 rounded-2xl bg-emerald-900 px-4 py-3 text-white shadow-xl animate-bounce">
          <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
          <p className="text-xs font-bold">{toastMessage}</p>
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
              PROFILE
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

      {/* ── ATHLETE HERO PROFILE CARD ─────────────────────────────────── */}
      <div className="relative overflow-hidden rounded-3xl bg-white p-5 shadow-sm border border-gray-100 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Avatar with Pro Badge */}
            <div className="relative flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-gradient-to-tr from-slate-900 to-slate-700 text-white font-black text-2xl border-2 border-emerald-500 shadow-md">
              <span>{name.charAt(0).toUpperCase()}</span>
              <div
                className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 text-white border-2 border-white shadow-sm"
                title="Verified Athlete"
              >
                <CheckCircle2 className="h-3.5 w-3.5" />
              </div>
            </div>

            {/* Name, Email, and VIP Badge */}
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black text-gray-900 tracking-tight leading-tight">
                  {name}
                </h2>
                <span className="rounded-md bg-amber-100 px-1.5 py-0.5 text-[9px] font-black uppercase text-amber-800 tracking-wide">
                  PRO
                </span>
              </div>
              <p className="text-xs text-gray-400 font-medium">{email}</p>
              <div className="flex items-center gap-1.5 pt-0.5">
                <span className="inline-flex items-center gap-1 rounded-lg bg-emerald-50 px-2 py-0.5 text-[10px] font-extrabold text-emerald-700">
                  <Award className="h-3 w-3" />
                  <span>{planName}</span>
                </span>
                <span className="text-[10px] font-bold text-gray-400">
                  &bull; {gymCenter?.name || 'Star Fitness'} &bull; ID: {memberId}
                </span>
              </div>
            </div>
          </div>

          {/* Edit Button */}
          <button
            type="button"
            onClick={() => {
              setEditName(name);
              setEditPhone(phone);
              setEditGoal(goal);
              setEditEmergency(emergencyContact);
              setShowEditModal(true);
            }}
            className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition shadow-sm"
            title="Edit Profile"
          >
            <Edit3 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* ── PROFILE BANNER STATS TRIO ─────────────────────────────────── */}
      <div className="grid grid-cols-3 gap-2.5">
        <div className="rounded-2xl bg-white p-3 text-center shadow-sm border border-gray-100">
          <p className="text-xs font-black text-emerald-600">🏋️‍♂️ 142</p>
          <p className="text-[10px] font-medium text-gray-400 mt-0.5">
            Workouts Done
          </p>
        </div>
        <div className="rounded-2xl bg-white p-3 text-center shadow-sm border border-gray-100">
          <p className="text-xs font-black text-amber-600">🔥 5 Days</p>
          <p className="text-[10px] font-medium text-gray-400 mt-0.5">
            Active Streak
          </p>
        </div>
        <div className="rounded-2xl bg-white p-3 text-center shadow-sm border border-gray-100">
          <p className="text-xs font-black text-sky-600">⏱ 128.5 hrs</p>
          <p className="text-[10px] font-medium text-gray-400 mt-0.5">
            Total Gym Time
          </p>
        </div>
      </div>

      {/* ── PERSONAL & PHYSICAL DETAILS CARD ─────────────────────────── */}
      <div className="rounded-3xl bg-white p-5 shadow-sm border border-gray-100 space-y-4">
        <div>
          <h3 className="text-base font-extrabold text-gray-900">
            Personal &amp; Physical Details
          </h3>
          <p className="text-xs text-gray-400 font-medium">
            Your athletic profile and health markers
          </p>
        </div>

        <div className="space-y-3 pt-1">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gray-100 text-emerald-600">
              <Phone className="h-4 w-4" />
            </div>
            <div className="flex-1">
              <p className="text-[10px] font-semibold text-gray-400">Phone Number</p>
              <p className="text-xs font-bold text-gray-900">{phone}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gray-100 text-emerald-600">
              <Target className="h-4 w-4" />
            </div>
            <div className="flex-1">
              <p className="text-[10px] font-semibold text-gray-400">Primary Goal</p>
              <p className="text-xs font-bold text-gray-900">{goal}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gray-100 text-emerald-600">
              <Scale className="h-4 w-4" />
            </div>
            <div className="flex-1">
              <p className="text-[10px] font-semibold text-gray-400">Body Composition</p>
              <p className="text-xs font-bold text-gray-900">
                {weight} kg &bull; {height} cm &bull; BMI {bmi} (Healthy)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gray-100 text-emerald-600">
              <Heart className="h-4 w-4" />
            </div>
            <div className="flex-1">
              <p className="text-[10px] font-semibold text-gray-400">Blood Group</p>
              <p className="text-xs font-bold text-gray-900">O+ Positive</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gray-100 text-emerald-600">
              <Shield className="h-4 w-4" />
            </div>
            <div className="flex-1">
              <p className="text-[10px] font-semibold text-gray-400">
                Emergency Contact
              </p>
              <p className="text-xs font-bold text-gray-900">{emergencyContact}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gray-100 text-emerald-600">
              <MapPin className="h-4 w-4" />
            </div>
            <div className="flex-1">
              <p className="text-[10px] font-semibold text-gray-400">Home Branch</p>
              <p className="text-xs font-bold text-gray-900">
                {gymCenter?.branch || 'Star Fitness Center'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── GYM FACILITIES & TRAINER CARD ─────────────────────────────── */}
      <div className="rounded-3xl bg-white p-5 shadow-sm border border-gray-100 space-y-4">
        <div>
          <h3 className="text-base font-extrabold text-gray-900">
            {gymCenter?.name || 'Star Fitness'} Facilities &amp; Trainer
          </h3>
          <p className="text-xs text-gray-400 font-medium">
            Assigned coach &amp; club privileges at {gymCenter?.name || 'Star Fitness'}
          </p>
        </div>

        {/* Assigned Trainer */}
        <div className="flex items-center justify-between rounded-2xl border border-gray-100 bg-gray-50/80 p-3.5">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-100 text-2xl shadow-sm">
              🥊
            </div>
            <div>
              <p className="text-xs font-black text-gray-900">Coach Vikram Singh</p>
              <p className="text-[10px] text-gray-400 font-medium">
                Senior Strength &amp; Conditioning Coach
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              setToastMessage('Opening chat with Coach Vikram...');
              setShowSuccessToast(true);
              setTimeout(() => setShowSuccessToast(false), 2500);
            }}
            className="rounded-xl bg-emerald-500 px-3 py-1.5 text-xs font-black text-white hover:bg-emerald-600 transition shadow-sm"
          >
            Message
          </button>
        </div>

        {/* Locker & Biometric Key */}
        <div className="grid grid-cols-2 gap-2.5">
          <div className="rounded-2xl border border-gray-100 bg-gray-50/80 p-3">
            <p className="text-[9px] font-black uppercase text-gray-400">
              LOCKER ASSIGNED
            </p>
            <p className="text-xs font-black text-gray-900 mt-1">
              L-042 (Zone A)
            </p>
          </div>

          <div className="rounded-2xl border border-gray-100 bg-gray-50/80 p-3">
            <p className="text-[9px] font-black uppercase text-gray-400">
              BIOMETRIC ACCESS
            </p>
            <p className="text-xs font-black text-emerald-600 mt-1">
              Card #8841-A (Active)
            </p>
          </div>
        </div>
      </div>

      {/* ── MEMBER APP ACCESS KEY & SECURITY ─────────────────────────── */}
      <div className="rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 p-5 shadow-lg border border-slate-700/60 text-white space-y-3.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <KeyRound className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-black text-white tracking-wide">
                {gymCenter?.name || 'Star Fitness'} Access Key
              </h3>
              <p className="text-[10px] text-gray-400 font-medium">
                Unique secret code issued by {gymCenter?.name || 'Star Fitness'}
              </p>
            </div>
          </div>
          <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[9px] font-black tracking-wider text-emerald-300 border border-emerald-500/30 uppercase">
            Active
          </span>
        </div>

        <div className="flex items-center justify-between rounded-2xl bg-black/40 px-3.5 py-2.5 border border-white/5">
          <div>
            <span className="text-[9px] uppercase font-extrabold tracking-wider text-gray-400 block">
              Your Secret Code
            </span>
            <span className="font-mono text-base font-black tracking-widest text-emerald-400">
              {showSecretCode ? (member?.secretCode || '749201') : '••••••'}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setShowSecretCode(!showSecretCode)}
              className="rounded-xl bg-white/10 px-2.5 py-1.5 text-xs font-bold text-gray-200 hover:bg-white/20 transition"
            >
              {showSecretCode ? 'Hide' : 'Reveal'}
            </button>
            <button
              type="button"
              onClick={() => {
                navigator.clipboard.writeText(member?.secretCode || '749201');
                setToastMessage('Secret code copied to clipboard!');
                setShowSuccessToast(true);
                setTimeout(() => setShowSuccessToast(false), 2000);
              }}
              className="rounded-xl bg-emerald-500/20 p-1.5 text-emerald-400 hover:bg-emerald-500/30 transition"
              title="Copy Secret Code"
            >
              <Copy className="h-4 w-4" />
            </button>
          </div>
        </div>

        <p className="text-[10.5px] text-gray-400 leading-snug">
          💡 Use your <strong>Member ID ({memberId})</strong> & this <strong>6-digit Secret Code</strong> to access <strong>{gymCenter?.name || 'Star Fitness'}</strong>. This code grants access strictly to your gym center.
        </p>
      </div>

      {/* ── APP PREFERENCES & SUPPORT ─────────────────────────────────── */}
      <div className="rounded-3xl bg-white p-5 shadow-sm border border-gray-100 space-y-4">
        <div>
          <h3 className="text-base font-extrabold text-gray-900">
            App Preferences &amp; Support
          </h3>
          <p className="text-xs text-gray-400 font-medium">
            Custom notifications and gym help desk
          </p>
        </div>

        {/* Push Notification Toggles */}
        <div className="space-y-3 pt-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-gray-900">
                Workout Push Reminders
              </p>
              <p className="text-[10px] text-gray-400 font-medium">
                Daily alert for scheduled training sessions
              </p>
            </div>
            <button
              type="button"
              onClick={() => setWorkoutReminders(!workoutReminders)}
              className={`h-6 w-11 rounded-full p-1 transition-colors ${
                workoutReminders ? 'bg-emerald-500' : 'bg-gray-200'
              }`}
            >
              <div
                className={`h-4 w-4 rounded-full bg-white transition-transform ${
                  workoutReminders ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-gray-900">
                Meal &amp; Hydration Alerts
              </p>
              <p className="text-[10px] text-gray-400 font-medium">
                Timed notifications to drink water &amp; eat clean
              </p>
            </div>
            <button
              type="button"
              onClick={() => setDietAlerts(!dietAlerts)}
              className={`h-6 w-11 rounded-full p-1 transition-colors ${
                dietAlerts ? 'bg-emerald-500' : 'bg-gray-200'
              }`}
            >
              <div
                className={`h-4 w-4 rounded-full bg-white transition-transform ${
                  dietAlerts ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Front Desk Support Banner */}
        <button
          type="button"
          onClick={() => setShowHelpModal(true)}
          className="flex w-full items-center justify-between rounded-2xl bg-emerald-50/70 p-3.5 border border-emerald-100 text-left transition hover:bg-emerald-100/60"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500 text-white shadow-sm">
              <Headphones className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs font-black text-emerald-950">
                {gymCenter?.name || 'Star Fitness'} Front Desk Help
              </p>
              <p className="text-[10px] text-emerald-700 font-medium">
                Immediate support from our reception desk
              </p>
            </div>
          </div>
          <ChevronRight className="h-4 w-4 text-emerald-600" />
        </button>

        {/* Sign Out Button */}
        <button
          type="button"
          onClick={handleSignOut}
          className="flex w-full items-center justify-center gap-2 rounded-2xl border border-red-200 bg-red-50/50 py-3 text-xs font-bold text-red-600 hover:bg-red-100/70 transition"
        >
          <LogOut className="h-4 w-4" />
          <span>Sign Out / Switch Account</span>
        </button>
      </div>

      {/* ── MODAL 1: EDIT PROFILE DIALOG ─────────────────────────────── */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
                  <Edit3 className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-gray-900">
                    Edit Profile
                  </h3>
                  <p className="text-xs text-gray-400">Update personal details</p>
                </div>
              </div>
              <button
                onClick={() => setShowEditModal(false)}
                className="rounded-full p-1 text-gray-400 hover:bg-gray-100 transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  required
                  className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-xs font-bold text-gray-900 focus:border-emerald-500 focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">
                  Phone Number
                </label>
                <input
                  type="text"
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  required
                  className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-xs font-bold text-gray-900 focus:border-emerald-500 focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">
                  Primary Fitness Goal
                </label>
                <input
                  type="text"
                  value={editGoal}
                  onChange={(e) => setEditGoal(e.target.value)}
                  required
                  className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-xs font-bold text-gray-900 focus:border-emerald-500 focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">
                  Emergency Contact
                </label>
                <input
                  type="text"
                  value={editEmergency}
                  onChange={(e) => setEditEmergency(e.target.value)}
                  required
                  className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-xs font-bold text-gray-900 focus:border-emerald-500 focus:bg-white focus:outline-none"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 rounded-2xl border border-gray-200 py-3 text-xs font-bold text-gray-600 hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-2xl bg-emerald-500 py-3 text-xs font-bold text-white shadow-md shadow-emerald-500/25 hover:bg-emerald-600 transition"
                >
                  Save Changes ✨
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── MODAL 2: FRONT DESK HELP DIALOG ──────────────────────────── */}
      {showHelpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
                  <Headphones className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-gray-900">
                    {gymCenter?.name || 'Star Fitness'} Front Desk
                  </h3>
                  <p className="text-xs text-gray-400">{gymCenter?.address || 'Member Support Hub'}</p>
                </div>
              </div>
              <button
                onClick={() => setShowHelpModal(false)}
                className="rounded-full p-1 text-gray-400 hover:bg-gray-100 transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <p className="text-xs text-gray-500 leading-relaxed font-medium">
              Need assistance with locker keys, personal training scheduling, or guest passes? Contact our {gymCenter?.name || 'Star Fitness'} reception desk:
            </p>

            <div className="divide-y divide-gray-100 text-xs">
              <div className="flex justify-between py-2">
                <span className="text-gray-400 font-medium">📍 Center:</span>
                <span className="font-bold text-gray-900 text-right">{gymCenter?.address || 'Floor 2, Main Gym Hub'}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-gray-400 font-medium">📞 Direct Call:</span>
                <span className="font-bold text-emerald-600">{gymCenter?.phone || '+91 98111 22334'}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-gray-400 font-medium">💬 WhatsApp Desk:</span>
                <span className="font-bold text-emerald-600">{gymCenter?.whatsapp || gymCenter?.phone || '+91 98111 22335'}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-gray-400 font-medium">⏰ Timings:</span>
                <span className="font-bold text-gray-900">{gymCenter?.timings || '5:00 AM – 11:30 PM'}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                setShowHelpModal(false);
                setToastMessage('Opening WhatsApp Support Desk...');
                setShowSuccessToast(true);
                setTimeout(() => setShowSuccessToast(false), 2500);
              }}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-500 py-3 text-xs font-bold text-white shadow-md shadow-emerald-500/25 hover:bg-emerald-600 transition"
            >
              <MessageSquare className="h-4 w-4" />
              <span>Message on WhatsApp</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
