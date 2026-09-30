import { useState, useMemo } from 'react';
import {
  Users, Clock3, CreditCard, TrendingUp, Shield, LogOut,
  BarChart3, Globe, Activity, AlertTriangle, CheckCircle2,
  Eye, EyeOff, RefreshCw, Search, ChevronUp, ChevronDown,
  Dumbbell, Calendar, Building2, Zap, Star,
  XCircle, Timer,
} from 'lucide-react';

const ADMIN_KEY  = 'bilzyfit_admin_session';
const TRIAL_KEY  = 'bilzyfit_trial_users';
const WS_PREFIX  = 'bilzyfit_workspace_';
const SUB_KEY    = 'bilzyfit_last_subscription';
const ADMIN_CREDS = { email: 'admin@bilzyfit.com', password: 'bilzyadmin@2025' };

function readTrialUsers()  { try { return JSON.parse(localStorage.getItem(TRIAL_KEY) || '[]'); } catch { return []; } }
function readAllWorkspaces() {
  const ws = [];
  for (let i = 0; i < localStorage.length; i++) {
    const k = localStorage.key(i);
    if (k && k.startsWith(WS_PREFIX)) { try { ws.push({ key: k, ...JSON.parse(localStorage.getItem(k) || '{}') }); } catch { /* skip */ } }
  }
  return ws;
}
function readSubscription() { try { return JSON.parse(localStorage.getItem(SUB_KEY) || 'null'); } catch { return null; } }
function daysLeft(iso) { if (!iso) return null; return Math.max(0, Math.ceil((new Date(iso) - Date.now()) / 86400000)); }
function fmtDate(iso)     { if (!iso) return '-'; return new Date(iso).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }); }
function fmtDateTime(iso) { if (!iso) return '-'; return new Date(iso).toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }); }

function StatCard({ icon: Icon, label, value, sub, color = 'teal' }) {
  const grad = { teal:'from-teal-500 to-teal-700', amber:'from-amber-400 to-orange-500', emerald:'from-emerald-500 to-green-700', red:'from-red-500 to-rose-700', violet:'from-violet-500 to-purple-700', blue:'from-blue-500 to-indigo-700' };
  return (
    <div className="relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm border border-gray-100">
      <div className={`absolute -right-4 -top-4 h-24 w-24 rounded-full bg-gradient-to-br ${grad[color]} opacity-10`} />
      <div className={`inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${grad[color]} shadow-lg`}>
        <Icon className="h-5 w-5 text-white" />
      </div>
      <p className="mt-4 text-3xl font-bold text-gray-900">{value}</p>
      <p className="text-sm font-medium text-gray-500">{label}</p>
      {sub && <p className="mt-1 text-xs text-gray-400">{sub}</p>}
    </div>
  );
}

function StatusBadge({ type }) {
  const map = { trial:'bg-amber-100 text-amber-800', converted:'bg-emerald-100 text-emerald-800', expired:'bg-red-100 text-red-700', active:'bg-teal-100 text-teal-800' };
  const lbl = { trial:'Trial', converted:'Paid', expired:'Expired', active:'Active' };
  return <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${map[type] || map.active}`}>{lbl[type] || type}</span>;
}

export default function AdminPanel() {
  const [authed, setAuthed] = useState(() => sessionStorage.getItem(ADMIN_KEY) === 'true');
  const [email, setEmail]   = useState('');
  const [pass, setPass]     = useState('');
  const [showPass, setShowPass] = useState(false);
  const [err, setErr]       = useState('');
  const [tab, setTab]       = useState('overview');
  const [search, setSearch] = useState('');
  const [refreshed, setRefreshed] = useState(0);

  const trialUsers   = useMemo(() => readTrialUsers(),     [refreshed]);
  const workspaces   = useMemo(() => readAllWorkspaces(),  [refreshed]);
  const subscription = useMemo(() => readSubscription(),   [refreshed]);

  const stats = useMemo(() => {
    const now = Date.now();
    const active    = trialUsers.filter(u => u.isTrial && new Date(u.trialEndsAt) > now);
    const expired   = trialUsers.filter(u => u.isTrial && new Date(u.trialEndsAt) <= now);
    const paid      = trialUsers.filter(u => u.conversionStatus === 'converted');
    const total     = trialUsers.length;
    const convRate  = total > 0 ? Math.round((paid.length / total) * 100) : 0;
    const avgDaysLeft = active.length ? Math.round(active.reduce((s, u) => s + daysLeft(u.trialEndsAt), 0) / active.length) : 0;
    return { active, expired, paid, total, convRate, avgDaysLeft, wsCount: workspaces.length };
  }, [trialUsers, workspaces]);

  const countByType = useMemo(() => {
    const map = {};
    trialUsers.forEach(u => { const t = u.businessType || 'Unknown'; map[t] = (map[t] || 0) + 1; });
    return Object.entries(map).sort((a, b) => b[1] - a[1]);
  }, [trialUsers]);

  const countByCountry = useMemo(() => {
    const map = {};
    trialUsers.forEach(u => { const c = u.country || 'Unknown'; map[c] = (map[c] || 0) + 1; });
    return Object.entries(map).sort((a, b) => b[1] - a[1]);
  }, [trialUsers]);

  const signupChart = useMemo(() => {
    const days = 14;
    const buckets = {};
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(); d.setDate(d.getDate() - i);
      buckets[d.toISOString().slice(0, 10)] = 0;
    }
    trialUsers.forEach(u => { const day = u.trialStartedAt?.slice(0, 10); if (day && buckets[day] !== undefined) buckets[day]++; });
    const entries = Object.entries(buckets);
    const max = Math.max(...entries.map(e => e[1]), 1);
    return { entries, max };
  }, [trialUsers]);

  const filteredUsers = useMemo(() => {
    const q = search.trim().toLowerCase();
    return trialUsers.filter(u => !q || [u.name, u.email, u.mobile, u.businessType, u.country].some(v => v?.toLowerCase().includes(q)));
  }, [trialUsers, search]);

  const expiringSoon = useMemo(() =>
    trialUsers.filter(u => u.isTrial && daysLeft(u.trialEndsAt) !== null && daysLeft(u.trialEndsAt) <= 1),
  [trialUsers]);

  function handleLogin(e) {
    e.preventDefault();
    if (email === ADMIN_CREDS.email && pass === ADMIN_CREDS.password) {
      sessionStorage.setItem(ADMIN_KEY, 'true'); setAuthed(true);
    } else { setErr('Invalid admin credentials.'); }
  }
  function handleLogout() { sessionStorage.removeItem(ADMIN_KEY); setAuthed(false); }

  if (!authed) return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 via-teal-950 to-slate-900 px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-teal-500/20 ring-2 ring-teal-500/30">
            <Shield className="h-8 w-8 text-teal-400" />
          </div>
          <h1 className="text-2xl font-bold text-white">BilzyFit Admin</h1>
          <p className="mt-1 text-sm text-slate-400">Internal management console</p>
        </div>
        <form onSubmit={handleLogin} className="rounded-2xl bg-white/5 border border-white/10 p-8 backdrop-blur-sm space-y-5">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">Admin Email</label>
            <input value={email} onChange={e => setEmail(e.target.value)} type="email" required
              className="w-full rounded-lg bg-white/10 border border-white/10 px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:border-teal-400 focus:outline-none"
              placeholder="admin@bilzyfit.com" />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">Password</label>
            <div className="relative">
              <input value={pass} onChange={e => setPass(e.target.value)} type={showPass ? 'text' : 'password'} required
                className="w-full rounded-lg bg-white/10 border border-white/10 px-4 py-2.5 pr-10 text-sm text-white placeholder-slate-500 focus:border-teal-400 focus:outline-none"
                placeholder="..." />
              <button type="button" onClick={() => setShowPass(v => !v)} className="absolute right-3 top-2.5 text-slate-400 hover:text-white">
                {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
          {err && <p className="text-xs text-red-400">{err}</p>}
          <button type="submit" className="w-full rounded-xl bg-teal-500 py-3 text-sm font-semibold text-white hover:bg-teal-400 transition-colors">
            Sign In to Admin
          </button>
        </form>
        <p className="mt-6 text-center text-xs text-slate-500">Restricted access — BilzyFit internal only</p>
      </div>
    </div>
  );

  const alertLabel = expiringSoon.length > 0 ? 'Alerts (' + expiringSoon.length + ')' : 'Alerts';
  const TABS = [
    { id: 'overview',   label: 'Overview',    icon: BarChart3 },
    { id: 'users',      label: 'Users',       icon: Users },
    { id: 'alerts',     label: alertLabel,    icon: AlertTriangle },
    { id: 'workspaces', label: 'Workspaces',  icon: Building2 },
  ];

  return (
    <div className="min-h-screen bg-slate-50" style={{ fontFamily: 'Inter, sans-serif' }}>
      <header className="sticky top-0 z-20 flex items-center justify-between gap-4 border-b border-slate-200 bg-white px-6 py-3 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-600 text-white font-bold text-sm">BF</div>
          <div>
            <p className="text-sm font-bold text-slate-900">BilzyFit Admin Console</p>
            <p className="text-xs text-slate-400">Super Admin Dashboard</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => setRefreshed(r => r + 1)} className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-50">
            <RefreshCw className="h-3.5 w-3.5" /> Refresh
          </button>
          <button onClick={handleLogout} className="flex items-center gap-1.5 rounded-lg bg-red-50 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-100">
            <LogOut className="h-3.5 w-3.5" /> Logout
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="mb-8 flex gap-1 rounded-xl bg-slate-100 p-1 w-fit flex-wrap">
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={'flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all ' + (tab === t.id ? 'bg-white text-teal-700 shadow-sm' : 'text-slate-500 hover:text-slate-800')}>
              <t.icon className="h-4 w-4" />{t.label}
            </button>
          ))}
        </div>

        {tab === 'overview' && (
          <div className="space-y-8">
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard icon={Users}      label="Total Sign-ups"    value={stats.total}          color="teal"    sub="All trial registrations" />
              <StatCard icon={Clock3}     label="Active Trials"     value={stats.active.length}  color="amber"   sub={'Avg ' + stats.avgDaysLeft + 'd remaining'} />
              <StatCard icon={CreditCard} label="Paid Users"        value={stats.paid.length}    color="emerald" sub={stats.convRate + '% conversion rate'} />
              <StatCard icon={XCircle}    label="Expired Trials"    value={stats.expired.length} color="red"     sub="Potential re-engage" />
            </div>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              <StatCard icon={Building2}  label="Active Workspaces" value={stats.wsCount}        color="violet"  sub="Saved in browser storage" />
              <StatCard icon={Zap}        label="Conversion Rate"   value={stats.convRate + '%'} color="blue"    sub="Trial to Paid" />
              <StatCard icon={Star}       label="Current Plan"      value={subscription ? subscription.plan : 'Demo'} color="teal" sub={subscription ? subscription.billing + ' - Rs.' + subscription.amount : 'No active subscription'} />
            </div>

            <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
              <h2 className="mb-1 text-base font-bold text-slate-900">Sign-ups — Last 14 Days</h2>
              <p className="mb-6 text-xs text-slate-400">Daily new trial registrations</p>
              <div className="flex items-end gap-1.5 h-40">
                {signupChart.entries.map(([day, count]) => (
                  <div key={day} className="group relative flex flex-1 flex-col items-center">
                    <div className="w-full rounded-t-md bg-teal-500 hover:bg-teal-400 transition-colors"
                      style={{ height: (count / signupChart.max) * 120 + 'px', minHeight: count > 0 ? '4px' : '0' }} />
                    <span className="mt-1 text-[9px] text-slate-400">{day.slice(5)}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
                <h2 className="mb-4 text-base font-bold text-slate-900 flex items-center gap-2"><Dumbbell className="h-4 w-4 text-teal-600" /> By Business Type</h2>
                {countByType.length === 0 ? <p className="text-sm text-slate-400">No data yet.</p> : (
                  <ul className="space-y-3">
                    {countByType.map(([type, count]) => (
                      <li key={type} className="flex items-center gap-3">
                        <span className="flex-1 truncate text-sm text-slate-700">{type}</span>
                        <div className="w-32 rounded-full bg-slate-100 h-2 overflow-hidden">
                          <div className="h-2 rounded-full bg-teal-500" style={{ width: ((count / (stats.total || 1)) * 100) + '%' }} />
                        </div>
                        <span className="w-5 text-right text-sm font-semibold text-slate-900">{count}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
                <h2 className="mb-4 text-base font-bold text-slate-900 flex items-center gap-2"><Globe className="h-4 w-4 text-teal-600" /> By Country</h2>
                {countByCountry.length === 0 ? <p className="text-sm text-slate-400">No data yet.</p> : (
                  <ul className="space-y-3">
                    {countByCountry.map(([country, count]) => (
                      <li key={country} className="flex items-center gap-3">
                        <span className="flex-1 truncate text-sm text-slate-700">{country}</span>
                        <div className="w-32 rounded-full bg-slate-100 h-2 overflow-hidden">
                          <div className="h-2 rounded-full bg-violet-500" style={{ width: ((count / (stats.total || 1)) * 100) + '%' }} />
                        </div>
                        <span className="w-5 text-right text-sm font-semibold text-slate-900">{count}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            {subscription && (
              <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-6">
                <h2 className="mb-3 text-base font-bold text-emerald-900 flex items-center gap-2"><CreditCard className="h-4 w-4" /> Last Subscription Record</h2>
                <div className="grid gap-3 sm:grid-cols-3 text-sm">
                  {[['Plan', subscription.plan], ['Billing', subscription.billing], ['Amount', 'Rs.' + subscription.amount], ['Status', subscription.status], ['Mode', subscription.mode], ['Paid At', fmtDateTime(subscription.paidAt)]].map(([k, v]) => (
                    <div key={k} className="rounded-xl bg-white border border-emerald-100 px-4 py-3">
                      <p className="text-xs text-slate-400">{k}</p>
                      <p className="font-semibold text-slate-900 mt-0.5">{v}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {tab === 'users' && (
          <div className="space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-lg font-bold text-slate-900">All Registered Users ({filteredUsers.length})</h2>
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search name, email, country..."
                  className="rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-4 text-sm focus:border-teal-400 focus:outline-none w-64" />
              </div>
            </div>
            <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50 text-xs font-semibold uppercase tracking-wider text-slate-500">
                      {['User', 'Contact', 'Business', 'Country', 'Status', 'Trial Ends', 'Days Left', 'Joined'].map(h => (
                        <th key={h} className="px-5 py-3 text-left">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {filteredUsers.length === 0 && (
                      <tr><td colSpan={8} className="px-5 py-10 text-center text-slate-400">No users found.</td></tr>
                    )}
                    {filteredUsers.map(u => {
                      const dl = daysLeft(u.trialEndsAt);
                      const status = u.conversionStatus === 'converted' ? 'converted' : u.isTrial && dl > 0 ? 'trial' : 'expired';
                      return (
                        <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                          <td className="px-5 py-3">
                            <div className="flex items-center gap-2.5">
                              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-teal-100 text-xs font-bold text-teal-700">
                                {(u.name || '?')[0].toUpperCase()}
                              </div>
                              <div>
                                <p className="font-medium text-slate-900">{u.name || '-'}</p>
                                <p className="text-xs text-slate-400">{u.id}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-5 py-3">
                            <p className="text-slate-700">{u.email || '-'}</p>
                            <p className="text-xs text-slate-400">{u.mobile || '-'}</p>
                          </td>
                          <td className="px-5 py-3 text-slate-600">{u.businessType || '-'}</td>
                          <td className="px-5 py-3 text-slate-600">{u.country || '-'}</td>
                          <td className="px-5 py-3"><StatusBadge type={status} /></td>
                          <td className="px-5 py-3 text-slate-600">{fmtDate(u.trialEndsAt)}</td>
                          <td className="px-5 py-3">
                            {dl == null ? '-' : (
                              <span className={'font-semibold ' + (dl <= 1 ? 'text-red-600' : dl <= 2 ? 'text-amber-600' : 'text-emerald-600')}>
                                {dl}d
                              </span>
                            )}
                          </td>
                          <td className="px-5 py-3 text-slate-500 text-xs">{fmtDate(u.trialStartedAt)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {tab === 'alerts' && (
          <div className="space-y-6">
            <h2 className="text-lg font-bold text-slate-900">Active Alerts</h2>
            {expiringSoon.length === 0 ? (
              <div className="rounded-2xl border border-emerald-100 bg-emerald-50 px-6 py-10 text-center">
                <CheckCircle2 className="mx-auto mb-3 h-10 w-10 text-emerald-500" />
                <p className="font-semibold text-emerald-800">All clear - no trials expiring today or tomorrow</p>
              </div>
            ) : (
              <div className="rounded-2xl border border-red-100 bg-white shadow-sm overflow-hidden">
                <div className="border-b border-red-100 bg-red-50 px-6 py-3 flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                  <p className="text-sm font-semibold text-red-700">{expiringSoon.length} trial(s) expiring today or tomorrow</p>
                </div>
                <ul className="divide-y divide-slate-50">
                  {expiringSoon.map(u => (
                    <li key={u.id} className="flex items-center gap-4 px-6 py-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 text-sm font-bold text-red-700">
                        {(u.name || '?')[0].toUpperCase()}
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-slate-900">{u.name}</p>
                        <p className="text-xs text-slate-500">{u.email} | {u.businessType} | {u.country}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-slate-400">Expires</p>
                        <p className="font-bold text-red-600">{daysLeft(u.trialEndsAt) === 0 ? 'Today' : 'Tomorrow'}</p>
                        <p className="text-xs text-slate-400">{fmtDate(u.trialEndsAt)}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {stats.expired.length > 0 && (
              <div className="rounded-2xl border border-slate-100 bg-white shadow-sm overflow-hidden">
                <div className="border-b border-slate-100 px-6 py-3 flex items-center gap-2">
                  <Timer className="h-4 w-4 text-slate-500" />
                  <p className="text-sm font-semibold text-slate-700">Expired Trials ({stats.expired.length}) - Re-engage Opportunities</p>
                </div>
                <ul className="divide-y divide-slate-50">
                  {stats.expired.map(u => (
                    <li key={u.id} className="flex items-center gap-4 px-6 py-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-sm font-bold text-slate-500">
                        {(u.name || '?')[0].toUpperCase()}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-slate-800">{u.name}</p>
                        <p className="text-xs text-slate-400">{u.email} | {u.country}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-slate-400">Expired</p>
                        <p className="text-sm text-slate-600">{fmtDate(u.trialEndsAt)}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {tab === 'workspaces' && (
          <div className="space-y-5">
            <h2 className="text-lg font-bold text-slate-900">Saved Workspaces ({workspaces.length})</h2>
            {workspaces.length === 0 ? (
              <div className="rounded-2xl border border-slate-100 bg-white p-10 text-center text-slate-400">No workspaces saved in this browser.</div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {workspaces.map(ws => (
                  <div key={ws.key} className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm hover:shadow-md transition-shadow">
                    <div className="mb-3 flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-100 font-bold text-teal-700 text-sm">
                        {(ws.settings?.gymName || ws.businessName || 'G')[0].toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900">{ws.settings?.gymName || ws.businessName || ws.workspaceId}</p>
                        <p className="text-xs text-slate-400">{ws.workspaceId}</p>
                      </div>
                    </div>
                    <div className="space-y-1 text-xs text-slate-500">
                      <p>Staff: <span className="font-medium text-slate-700">{Array.isArray(ws.staff) ? ws.staff.length : 0}</span></p>
                      <p>Members: <span className="font-medium text-slate-700">{Array.isArray(ws.members) ? ws.members.length : '-'}</span></p>
                      <p className="font-mono text-[10px] text-slate-300">{ws.key}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
