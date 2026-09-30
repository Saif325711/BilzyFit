import { useEffect, useRef, useState } from 'react';
import {
  Menu,
  Search,
  Bell,
  Check,
  Plus,
  LogOut,
  ChevronDown,
  Settings,
  X,
  UserCircle,
  Clock3,
  Building2,
  Globe2,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import Avatar from '../ui/Avatar';
import { useNavigate } from 'react-router-dom';

export default function TopNav({
  onMenuClick,
  menuStyle = 'vertical',
  themeSkin = 'teal',
  sideNavOptions = {},
  onPreferenceChange,
}) {
  const { user, logout, demoUsers } = useAuth();
  const { data, activeBranch, setActiveBranch, branches, currentBranch } = useData();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showBranchMenu, setShowBranchMenu] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [now, setNow] = useState(Date.now());
  const userMenuRef = useRef(null);
  const branchMenuRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleOutside(e) {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setShowUserMenu(false);
      }
      if (branchMenuRef.current && !branchMenuRef.current.contains(e.target)) {
        setShowBranchMenu(false);
      }
    }
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);
  useEffect(() => {
    if (!user?.isTrial) return undefined;
    const timer = window.setInterval(() => setNow(Date.now()), 60000);
    return () => window.clearInterval(timer);
  }, [user?.isTrial]);
  const trialDaysLeft = user?.isTrial
    ? Math.max(0, Math.ceil((new Date(user.trialEndsAt).getTime() - now) / 86400000))
    : 0;
  const updatePreference = (key, value, storageKey) => {
    localStorage.setItem(storageKey, String(value));
    onPreferenceChange(key, value);
  };

  const results = search.trim()
    ? data.members
        .filter((m) =>
          m.fullName.toLowerCase().includes(search.toLowerCase()) ||
          m.mobile.includes(search) ||
          m.memberId.toLowerCase().includes(search.toLowerCase())
        )
        .slice(0, 6)
    : [];

  const switchUser = (u) => {
    localStorage.setItem('gym_user', JSON.stringify(u));
    window.location.reload();
  };

  return (
    <header className={`sticky top-0 z-30 flex items-center justify-between gap-3 border-b px-4 print:hidden md:px-6 ${menuStyle === 'horizontal' ? 'min-h-14 flex-nowrap border-primary-800 bg-primary-700 text-white' : 'h-16 border-gray-200 bg-white'}`}>
      <div className="flex items-center gap-3 md:hidden">
        <button
          onClick={onMenuClick}
          className="rounded-lg p-2 text-gray-600 hover:bg-gray-100"
        >
          <Menu className="h-5 w-5" />
        </button>
        <span className={`text-lg font-bold ${menuStyle === 'horizontal' ? 'text-white' : 'text-gray-900'}`}>BilzyFit</span>
      </div>
      {menuStyle === 'horizontal' && (
        <div className="order-1 hidden items-center gap-2 md:flex">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white font-bold text-primary-700">BF</div>
          <span className="text-lg font-bold tracking-tight text-white">BilzyFit</span>
        </div>
      )}

      <div className={`relative hidden md:block ${menuStyle === 'horizontal' ? 'order-2 min-w-0 flex-1 max-w-xl' : 'flex-1 max-w-md'}`}>
        <div className="relative">
          <Search className={`absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 ${menuStyle === 'horizontal' ? 'text-white/70' : 'text-gray-400'}`} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onFocus={() => setShowSearch(true)}
            onBlur={() => setTimeout(() => setShowSearch(false), 150)}
            placeholder="Search member, mobile, member ID..."
            className={`w-full rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-primary-200 ${menuStyle === 'horizontal' ? 'border-primary-500 bg-primary-800/50 py-1 pl-9 pr-3 text-white placeholder-white/70 focus:bg-white focus:text-gray-900' : 'border-gray-300 bg-gray-50 py-2 pl-9 pr-4 text-gray-900 placeholder-gray-400 focus:border-primary-500 focus:bg-white'}`}
          />
        </div>
        {showSearch && results.length > 0 && (
          <div className="absolute mt-2 w-full rounded-xl border border-gray-200 bg-white py-2 shadow-lg">
            {results.map((m) => (
              <button
                key={m.id}
                onClick={() => {
                  navigate(`/members/${m.id}`);
                  setSearch('');
                }}
                className="flex w-full items-center gap-3 px-4 py-2 text-left hover:bg-gray-50"
              >
                <Avatar name={m.fullName} size="sm" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{m.fullName}</p>
                  <p className="text-xs text-gray-500">{m.memberId} • {m.mobile}</p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      <div className={`flex items-center gap-2 md:gap-3 ${menuStyle === 'horizontal' ? 'order-3 shrink-0' : ''}`}>
        {/* Gym Centre / Branch Switcher Dropdown */}
        <div className="relative" ref={branchMenuRef}>
          <button
            type="button"
            onClick={() => setShowBranchMenu(!showBranchMenu)}
            className={`flex items-center gap-2 rounded-xl px-2.5 py-1.5 text-xs font-semibold transition-all border ${
              menuStyle === 'horizontal'
                ? 'border-primary-500 bg-primary-800/70 text-white hover:bg-primary-800'
                : 'border-gray-200 bg-gray-50 text-gray-800 hover:border-primary-300 hover:bg-white shadow-xs'
            }`}
            title="Switch Active Gym Centre"
          >
            <Building2 className={`h-4 w-4 shrink-0 ${menuStyle === 'horizontal' ? 'text-white' : 'text-primary-600'}`} />
            <div className="flex flex-col text-left max-w-[110px] sm:max-w-[160px]">
              <span className="truncate text-xs font-bold leading-tight">
                {activeBranch === 'all' ? 'All Gym Centres' : (currentBranch?.name || activeBranch)}
              </span>
              <span className={`truncate text-[10px] font-normal ${menuStyle === 'horizontal' ? 'text-primary-100' : 'text-gray-500'}`}>
                {activeBranch === 'all' ? `${branches.length} locations` : (currentBranch?.city || 'Location')}
              </span>
            </div>
            <ChevronDown className="h-3.5 w-3.5 opacity-60 shrink-0" />
          </button>

          {showBranchMenu && (
            <div className="absolute right-0 mt-2 w-72 rounded-2xl border border-gray-100 bg-white p-2 shadow-xl ring-1 ring-black/5 z-50">
              <div className="px-3 py-2 border-b border-gray-100">
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Switch Gym Centre</p>
                <p className="text-[11px] text-gray-500 mt-0.5">Select which branch data to view</p>
              </div>

              <div className="py-1 space-y-0.5 max-h-60 overflow-y-auto">
                <button
                  type="button"
                  onClick={() => {
                    setActiveBranch('all');
                    setShowBranchMenu(false);
                  }}
                  className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-xs transition-colors ${
                    activeBranch === 'all'
                      ? 'bg-primary-50 font-semibold text-primary-700'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gray-100 text-gray-600">
                      <Globe2 className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">🌐 All Gym Centres</p>
                      <p className="text-[10px] text-gray-400">Consolidated overview</p>
                    </div>
                  </div>
                  {activeBranch === 'all' && <Check className="h-4 w-4 text-primary-600" />}
                </button>

                {branches.map((b) => {
                  const isSelected = activeBranch === b.name;
                  return (
                    <button
                      key={b.id}
                      type="button"
                      onClick={() => {
                        setActiveBranch(b.name);
                        setShowBranchMenu(false);
                      }}
                      className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-xs transition-colors ${
                        isSelected
                          ? 'bg-primary-50 font-semibold text-primary-700'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${isSelected ? 'bg-primary-600 text-white' : 'bg-primary-50 text-primary-700'}`}>
                          <Building2 className="h-4 w-4" />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <p className="truncate font-semibold text-gray-900">{b.name}</p>
                            {b.branchCode && (
                              <span className="rounded bg-gray-100 px-1 py-0.2 text-[9px] font-bold text-gray-500 uppercase">
                                {b.branchCode}
                              </span>
                            )}
                          </div>
                          <p className="truncate text-[10px] text-gray-400">{b.city || 'Branch'}</p>
                        </div>
                      </div>
                      {isSelected && <Check className="h-4 w-4 shrink-0 text-primary-600" />}
                    </button>
                  );
                })}
              </div>

              <div className="mt-1 border-t border-gray-100 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setShowBranchMenu(false);
                    navigate('/settings');
                  }}
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-xs font-medium text-primary-600 hover:bg-primary-50"
                >
                  <Settings className="h-3.5 w-3.5" />
                  <span>Gym Centre Settings & Locations</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {user?.isTrial && (
          <div className={`hidden items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold md:flex ${trialDaysLeft <= 1 ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-800'}`}>
            <Clock3 className="h-3.5 w-3.5" />
            Trial: {trialDaysLeft} {trialDaysLeft === 1 ? 'day' : 'days'} left
          </div>
        )}
        <button
          onClick={() => navigate('/members/new')}
          className={`hidden items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium md:inline-flex ${menuStyle === 'horizontal' ? 'bg-white text-primary-700 hover:bg-primary-50' : 'bg-primary-600 text-white hover:bg-primary-700'}`}
        >
          <Plus className="h-4 w-4" />
          Quick Add
        </button>

        <button className={`relative rounded-lg p-2 ${menuStyle === 'horizontal' ? 'text-white hover:bg-primary-600' : 'text-gray-500 hover:bg-gray-100'}`}>
          <Bell className="h-5 w-5" />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
        </button>
        <button
          onClick={() => setShowSettings(true)}
          aria-label="Open settings"
          className={`rounded-lg p-2 transition-colors ${menuStyle === 'horizontal' ? 'text-white hover:bg-primary-600' : 'text-gray-500 hover:bg-gray-100 hover:text-primary-700'}`}
        >
          <Settings className="h-5 w-5" />
        </button>
        <div className="relative" ref={userMenuRef}>
          <button
            onClick={() => setShowUserMenu((v) => !v)}
            className={`flex items-center gap-2 rounded-lg p-1.5 ${menuStyle === 'horizontal' ? 'hover:bg-primary-600' : 'hover:bg-gray-100'}`}
          >
            <Avatar name={user?.name} size="sm" />
            <div className="hidden text-left md:block">
              <p className={`text-sm font-medium ${menuStyle === 'horizontal' ? 'text-white' : 'text-gray-900'}`}>{user?.name}</p>
              <p className={`text-xs ${menuStyle === 'horizontal' ? 'text-white/70' : 'text-gray-500'}`}>
                {user?.staffRole ? `${user.staffRole} (Staff)` : user?.role}
              </p>
            </div>
            <ChevronDown className={`hidden h-4 w-4 md:block ${menuStyle === 'horizontal' ? 'text-white/70' : 'text-gray-400'}`} />
          </button>
          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-56 rounded-xl border border-gray-200 bg-white py-2 shadow-lg">
              {user?.isStaff ? (
                <div className="border-b border-gray-100 px-4 py-2">
                  <p className="text-xs font-semibold uppercase tracking-wider text-primary-600">Staff Account</p>
                  <p className="text-sm font-bold text-gray-900">{user.name}</p>
                  <p className="text-xs text-gray-500">{user.staffRole || user.role}</p>
                </div>
              ) : (
                <div className="border-b border-gray-100 px-4 py-2">
                  <p className="text-sm font-medium text-gray-900">Switch user (demo)</p>
                </div>
              )}
              {!user?.isStaff && demoUsers.map((u) => (
                <button
                  key={u.id}
                  onClick={() => switchUser(u)}
                  className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
                >
                  <UserCircle className="h-4 w-4" />
                  {u.name} — {u.role}
                </button>
              ))}
              <div className="border-t border-gray-100 px-4 py-2">
                <button
                  onClick={logout}
                  className="flex w-full items-center gap-2 text-sm text-red-600 hover:text-red-700"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {showSettings && (
        <div className="fixed inset-0 z-50">
          <button
            type="button"
            aria-label="Close settings"
            className="absolute inset-0 h-full w-full cursor-default bg-gray-900/30"
            onClick={() => setShowSettings(false)}
          />
          <aside className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-200 px-6 py-5">
              <h2 className="text-xl font-bold text-gray-900">Settings</h2>
              <button type="button" onClick={() => setShowSettings(false)} className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-700"><X className="h-5 w-5" /></button>
            </div>
            <div className="flex-1 overflow-y-auto px-6 py-6">
              <section>
                <h3 className="text-base font-bold text-gray-800">Choose menu</h3>
                <div className="mt-2 border-t border-gray-200 pt-3">
                  {[
                    { value: 'vertical', label: 'Vertical' },
                    { value: 'horizontal', label: 'Horizontal' },
                  ].map((option) => (
                    <label key={option.value} className="flex cursor-pointer items-center gap-3 py-2 text-base text-gray-700">
                      <input type="radio" name="menu-style" checked={menuStyle === option.value} onChange={() => updatePreference('menuStyle', option.value, 'bilzyfit_menu_style')} className="h-5 w-5 accent-primary-600" />
                      {option.label}
                    </label>
                  ))}
                </div>
              </section>

              <section className="mt-8">
                <h3 className="text-base font-bold text-gray-800">Choose theme skin</h3>
                <div className="mt-2 border-t border-gray-200 pt-4">
                  <div className="flex flex-wrap gap-5">
                    {[
                      { value: 'teal', className: 'from-teal-500 to-slate-800' },
                      { value: 'green', className: 'from-green-600 to-slate-800' },
                      { value: 'orange', className: 'from-orange-500 to-slate-800' },
                      { value: 'red', className: 'from-red-600 to-black' },
                    ].map((skin) => (
                      <button key={skin.value} type="button" aria-label={`${skin.value} theme`} onClick={() => updatePreference('themeSkin', skin.value, 'bilzyfit_theme_skin')} className={`relative h-12 w-12 bg-gradient-to-br ${skin.className} ${themeSkin === skin.value ? 'ring-2 ring-primary-500 ring-offset-2' : ''}`}>
                        <span className="absolute bottom-0 right-0 h-1/2 w-1/2 bg-white/90" />
                        {themeSkin === skin.value && <Check className="absolute -right-2 -top-2 h-4 w-4 rounded-full bg-primary-600 p-0.5 text-white" />}
                      </button>
                    ))}
                  </div>
                </div>
              </section>

              <section className="mt-8">
                <h3 className="text-base font-bold text-gray-800">Sidenav options</h3>
                <div className="mt-2 border-t border-gray-200 pt-2">
                  {[
                    { key: 'opened', label: 'Opened sidenav' },
                    { key: 'pinned', label: 'Pinned sidenav' },
                    { key: 'userInfo', label: 'Sidenav user info' },
                  ].map((option) => (
                    <label key={option.key} className="flex cursor-pointer items-center justify-between py-3 text-base text-gray-700">
                      {option.label}
                      <span className="relative">
                        <input
                          type="checkbox"
                          className="peer sr-only"
                          checked={sideNavOptions[option.key]}
                          onChange={(e) => {
                            const next = { ...sideNavOptions, [option.key]: e.target.checked };
                            localStorage.setItem(`bilzyfit_sidenav_${option.key}`, String(e.target.checked));
                            updatePreference('sideNavOptions', next, 'bilzyfit_sidenav_options');
                          }}
                        />
                        <span className="block h-6 w-11 rounded-full bg-gray-300 transition-colors peer-checked:bg-teal-500" />
                        <span className="absolute left-1 top-1 h-4 w-4 rounded-full bg-gray-200 shadow transition-transform peer-checked:translate-x-5" />
                      </span>
                    </label>
                  ))}
                </div>
              </section>
            </div>
            <div className="border-t border-gray-200 px-6 py-4">
              <button type="button" onClick={() => { setShowSettings(false); navigate('/settings'); }} className="flex w-full items-center justify-center rounded-lg bg-primary-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-700">
                Open full settings
              </button>
            </div>
          </aside>
        </div>
      )}

    </header>
  );
}
