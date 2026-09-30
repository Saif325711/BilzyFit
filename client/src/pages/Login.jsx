import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { LogIn, Eye, EyeOff, Dumbbell, ShieldCheck, UserCheck, Building2, KeyRound, CheckCircle2 } from 'lucide-react';
import { useAuth, importWorkspaceFromToken } from '../context/AuthContext';

function GymIllustration() {
  return (
    <svg
      viewBox="0 0 200 90"
      className="mx-auto h-20 w-auto opacity-90"
      fill="none"
    >
      {/* dumbbell */}
      <rect x="30" y="38" width="10" height="16" rx="2" fill="#FFD740" />
      <rect x="20" y="42" width="8" height="8" rx="1.5" fill="#ffffff" />
      <rect x="58" y="42" width="8" height="8" rx="1.5" fill="#ffffff" />
      <rect x="40" y="45" width="18" height="4" rx="2" fill="#ffffff" />
      {/* chart bars */}
      <rect x="90" y="46" width="8" height="18" rx="1.5" fill="#ffffff" fillOpacity="0.85" />
      <rect x="102" y="36" width="8" height="28" rx="1.5" fill="#FFD740" />
      <rect x="114" y="26" width="8" height="38" rx="1.5" fill="#ffffff" fillOpacity="0.85" />
      {/* heartbeat */}
      <path
        d="M140 50 h10 l4 -12 l8 22 l6 -18 l4 8 h10"
        stroke="#ffffff"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        opacity="0.9"
      />
    </svg>
  );
}

const staffRoleOptions = [
  'Trainer',
  'Manager',
  'Receptionist',
  'Nutritionist',
  'Cleaner',
  'Security',
  'Other',
];

export default function Login() {
  const { login, loginAsStaff } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // URL parameters for staff link: ?tab=staff&ws=...&gym=...&auth=...
  const tabParam = searchParams.get('tab');
  const wsParam = searchParams.get('ws') || '';
  const gymParam = searchParams.get('gym') || '';
  const authParam = searchParams.get('auth') || '';

  const [activeTab, setActiveTab] = useState(tabParam === 'staff' || Boolean(wsParam) ? 'staff' : 'owner');
  const [connectedGym, setConnectedGym] = useState(gymParam || (wsParam ? `Gym (${wsParam})` : ''));

  // Owner Login State
  const [email, setEmail] = useState('owner@gym.com');
  const [password, setPassword] = useState('password');
  const [showPassword, setShowPassword] = useState(false);

  // Staff Login State
  const [staffName, setStaffName] = useState('');
  const [staffRole, setStaffRole] = useState('Trainer');
  const [staffPassword, setStaffPassword] = useState('');
  const [showStaffPassword, setShowStaffPassword] = useState(false);
  const [workspaceId, setWorkspaceId] = useState(wsParam || '');

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showDemo, setShowDemo] = useState(false);

  // Auto-import workspace credentials if auth token is present in URL
  useEffect(() => {
    if (authParam) {
      const res = importWorkspaceFromToken(authParam);
      if (res.success) {
        if (res.gymName) setConnectedGym(res.gymName);
        if (res.wsId) setWorkspaceId(res.wsId);
        setActiveTab('staff');
      }
    } else if (wsParam) {
      setWorkspaceId(wsParam);
      if (gymParam) setConnectedGym(gymParam);
      setActiveTab('staff');
    }
  }, [authParam, wsParam, gymParam]);

  // Handle Owner Login
  const handleOwnerSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    setTimeout(async () => {
      const res = await login(email, password);
      setLoading(false);
      if (res.success) {
        navigate(searchParams.get('redirect') || '/', { replace: true });
      } else {
        setError(res.message);
      }
    }, 400);
  };

  // Handle Staff Login
  const handleStaffSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    setTimeout(async () => {
      const res = await loginAsStaff(staffName, staffRole, staffPassword, workspaceId || undefined);
      setLoading(false);
      if (res.success) {
        // Redirect to dashboard or first allowed page
        navigate(searchParams.get('redirect') || '/', { replace: true });
      } else {
        setError(res.message);
      }
    }, 400);
  };

  const fillDemoStaff = (name, role) => {
    setStaffName(name);
    setStaffRole(role);
    setStaffPassword('password');
    setError('');
  };

  return (
    <div className="flex min-h-full items-start justify-center bg-gray-100 px-4 py-8 sm:items-center sm:py-12">
      <div className="w-full max-w-md">
        <div className="overflow-hidden rounded-2xl bg-white shadow-xl">
          {/* Teal header band with brand + illustration */}
          <div className="relative bg-primary-800 px-6 pb-12 pt-7 text-center text-white">
            <div className="mb-2 flex items-center justify-center gap-2">
              <Dumbbell className="h-6 w-6 text-amber-300" />
              <span className="text-xl font-bold tracking-wide">BilzyFit</span>
            </div>
            <p className="text-xs text-white/75">Smart Gym & Fitness Management</p>
            <GymIllustration />

            {/* Overlapping circular icon */}
            <div className="absolute -bottom-6 left-1/2 flex h-12 w-12 -translate-x-1/2 items-center justify-center rounded-full bg-amber-300 shadow-md">
              <LogIn className="h-5 w-5 text-primary-900" />
            </div>
          </div>

          {/* Form card */}
          <div className="px-6 pb-8 pt-10 sm:px-8">
            {/* Gym connection notice if opened via gym link */}
            {connectedGym && (
              <div className="mb-4 flex items-center gap-2 rounded-xl bg-primary-50 border border-primary-200 px-3.5 py-2.5 text-xs text-primary-900">
                <Building2 className="h-4 w-4 shrink-0 text-primary-600" />
                <div className="flex-1">
                  <span className="font-semibold">Gym Portal: </span>
                  <span className="font-medium text-primary-700">{connectedGym}</span>
                </div>
                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
              </div>
            )}

            {/* Tab switchers: Owner vs Staff */}
            <div className="mb-6 grid grid-cols-2 rounded-xl bg-gray-100 p-1 text-sm font-semibold">
              <button
                type="button"
                onClick={() => { setActiveTab('owner'); setError(''); }}
                className={`flex items-center justify-center gap-2 rounded-lg py-2.5 transition-all ${
                  activeTab === 'owner'
                    ? 'bg-white text-primary-900 shadow-sm'
                    : 'text-gray-500 hover:text-gray-800'
                }`}
              >
                <Building2 className="h-4 w-4" />
                <span>Gym Owner</span>
              </button>

              <button
                type="button"
                onClick={() => { setActiveTab('staff'); setError(''); }}
                className={`flex items-center justify-center gap-2 rounded-lg py-2.5 transition-all ${
                  activeTab === 'staff'
                    ? 'bg-white text-primary-900 shadow-sm'
                    : 'text-gray-500 hover:text-gray-800'
                }`}
              >
                <UserCheck className="h-4 w-4" />
                <span>Staff Login</span>
              </button>
            </div>

            {/* TAB 1: OWNER / ADMIN LOGIN */}
            {activeTab === 'owner' && (
              <form onSubmit={handleOwnerSubmit} className="space-y-5">
                <div>
                  <label htmlFor="login-email" className="block text-xs font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <input
                    id="login-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="owner@gym.com"
                    required
                    className="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 focus:border-primary-600 focus:outline-none focus:ring-1 focus:ring-primary-600"
                  />
                </div>

                <div>
                  <label htmlFor="login-password" className="block text-xs font-medium text-gray-700 mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      id="login-password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      className="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 pr-10 text-sm text-gray-900 focus:border-primary-600 focus:outline-none focus:ring-1 focus:ring-primary-600"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {error && (
                  <div className="rounded-lg bg-red-50 p-2.5 text-xs text-red-700 border border-red-200">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-xl bg-primary-800 py-3 text-sm font-semibold text-white shadow-md transition-colors hover:bg-primary-900 disabled:opacity-60"
                >
                  {loading ? 'Signing in...' : 'Sign In as Gym Owner'}
                </button>
              </form>
            )}

            {/* TAB 2: STAFF LOGIN (Name + Role + Password) */}
            {activeTab === 'staff' && (
              <form onSubmit={handleStaffSubmit} className="space-y-4">
                <div>
                  <label htmlFor="staff-name" className="block text-xs font-medium text-gray-700 mb-1">
                    Your Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="staff-name"
                    type="text"
                    value={staffName}
                    onChange={(e) => setStaffName(e.target.value)}
                    placeholder="e.g. Sneha Patel, Priya Sharma"
                    required
                    className="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 focus:border-primary-600 focus:outline-none focus:ring-1 focus:ring-primary-600"
                  />
                  <p className="mt-1 text-[11px] text-gray-500">Enter your name exactly as registered by the Gym Owner.</p>
                </div>

                <div>
                  <label htmlFor="staff-role" className="block text-xs font-medium text-gray-700 mb-1">
                    Select Your Role <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="staff-role"
                    value={staffRole}
                    onChange={(e) => setStaffRole(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 focus:border-primary-600 focus:outline-none focus:ring-1 focus:ring-primary-600"
                  >
                    {staffRoleOptions.map((role) => (
                      <option key={role} value={role}>
                        {role}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="staff-password" className="block text-xs font-medium text-gray-700 mb-1">
                    Staff Login Password <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      id="staff-password"
                      type={showStaffPassword ? 'text' : 'password'}
                      value={staffPassword}
                      onChange={(e) => setStaffPassword(e.target.value)}
                      placeholder="Enter password set by gym owner"
                      required
                      className="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 pr-10 text-sm text-gray-900 focus:border-primary-600 focus:outline-none focus:ring-1 focus:ring-primary-600"
                    />
                    <button
                      type="button"
                      onClick={() => setShowStaffPassword((v) => !v)}
                      className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                    >
                      {showStaffPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {error && (
                  <div className="rounded-lg bg-red-50 p-2.5 text-xs text-red-700 border border-red-200">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-xl bg-primary-800 py-3 text-sm font-semibold text-white shadow-md transition-colors hover:bg-primary-900 disabled:opacity-60"
                >
                  {loading ? 'Logging in...' : `Log In as ${staffRole}`}
                </button>

                {/* Quick Staff Demo Fill buttons */}
                <div className="pt-2 border-t border-gray-100">
                  <p className="text-[11px] font-medium text-gray-500 mb-1.5">Quick Demo Staff Accounts:</p>
                  <div className="flex flex-wrap gap-1.5">
                    <button
                      type="button"
                      onClick={() => fillDemoStaff('Sneha Patel', 'Trainer')}
                      className="rounded-md border border-gray-200 bg-gray-50 px-2 py-1 text-[11px] text-gray-700 hover:bg-primary-50 hover:text-primary-700"
                    >
                      🏋️ Sneha (Trainer)
                    </button>
                    <button
                      type="button"
                      onClick={() => fillDemoStaff('Priya Sharma', 'Manager')}
                      className="rounded-md border border-gray-200 bg-gray-50 px-2 py-1 text-[11px] text-gray-700 hover:bg-primary-50 hover:text-primary-700"
                    >
                      💼 Priya (Manager)
                    </button>
                    <button
                      type="button"
                      onClick={() => fillDemoStaff('Rohan Das', 'Receptionist')}
                      className="rounded-md border border-gray-200 bg-gray-50 px-2 py-1 text-[11px] text-gray-700 hover:bg-primary-50 hover:text-primary-700"
                    >
                      📋 Rohan (Receptionist)
                    </button>
                  </div>
                </div>
              </form>
            )}

            {/* Useful Links / Options */}
            <div className="mt-6 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-xs">
              <button
                type="button"
                onClick={() => setShowDemo((v) => !v)}
                className="text-gray-600 underline decoration-gray-400 underline-offset-2 hover:text-primary-700"
              >
                {showDemo ? 'Hide Demo Guide' : 'Demo Credentials'}
              </button>
              <span className="text-gray-300">|</span>
              <button
                type="button"
                onClick={() => navigate('/landing?trial=1')}
                className="text-gray-600 underline decoration-gray-400 underline-offset-2 hover:text-primary-700"
              >
                Start Free Trial
              </button>
            </div>

            <div className="mt-4 border-t border-gray-100 pt-4 text-center">
              <button
                type="button"
                onClick={() => navigate('/portal')}
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-50 border border-emerald-200 px-4 py-2.5 text-xs font-bold text-emerald-800 transition hover:bg-emerald-100"
              >
                <span>📱</span> Are you a Gym Member? Open Member App
              </button>
            </div>

            {showDemo && (
              <div className="mt-4 rounded-xl border border-gray-200 bg-gray-50 p-3.5 text-xs text-gray-600 space-y-2">
                <p className="font-semibold text-gray-800">🔐 Demo Login Credentials:</p>
                <div className="grid grid-cols-1 gap-1 text-[11px]">
                  <p><strong>Owner:</strong> owner@gym.com (pass: password)</p>
                  <p><strong>Manager:</strong> Priya Sharma / Manager (pass: password)</p>
                  <p><strong>Trainer:</strong> Sneha Patel / Trainer (pass: password)</p>
                  <p><strong>Receptionist:</strong> Rohan Das / Receptionist (pass: password)</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="flex items-center justify-center gap-1.5 text-xs text-gray-500">
            <ShieldCheck className="h-3.5 w-3.5 text-primary-700" />
            Your gym data is private, secured & GDPR Compliant.
          </p>
          <p className="mt-1 text-xs text-gray-400">
            Copyright © {new Date().getFullYear()}, BilzyFit — All Rights Reserved
          </p>
        </div>
      </div>
    </div>
  );
}
