import { useMemo, useState } from 'react';
import {
  Bell,
  Building2,
  Check,
  CheckCircle2,
  ClipboardList,
  ChevronRight,
  Download,
  Edit2,
  Globe2,
  LockKeyhole,
  MapPin,
  Palette,
  Phone,
  Plus,
  RotateCcw,
  Save,
  ShieldCheck,
  SlidersHorizontal,
  Store,
  Trash2,
  Upload,
  UserRound,
  Users,
  IndianRupee,
  Clock,
  Mail,
  QrCode,
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { normalizeImportedData, deleteBranch } from '../data/services';
import PageHeader from '../components/ui/PageHeader';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Textarea from '../components/ui/Textarea';
import Select from '../components/ui/Select';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import BranchModal from '../components/BranchModal';

const defaultSettings = {
  gymName: '',
  address: '',
  phone: '',
  email: '',
  openingHours: '',
  logo: '',
  currency: 'INR',
  timezone: 'Asia/Kolkata',
  dateFormat: 'DD MMM YYYY',
  theme: 'light',
  language: 'English',
  emailNotifications: true,
  smsNotifications: true,
  renewalReminders: true,
  paymentAlerts: true,
  weeklyReports: false,
  gstin: '',
  invoicePrefix: 'INV',
  defaultGstRate: 18,
  upiId: '',
  upiName: '',
  branches: [],
};

const sections = [
  { id: 'branches', label: 'Gym Centres & Branches', description: 'Switch active centre & locations', icon: Building2 },
  { id: 'profile', label: 'Gym Profile', description: 'Brand and contact details', icon: Store },
  { id: 'preferences', label: 'Preferences', description: 'Regional and display options', icon: SlidersHorizontal },
  { id: 'notifications', label: 'Notifications', description: 'Alerts and reminders', icon: Bell },
  { id: 'security', label: 'Security', description: 'Access and account safety', icon: ShieldCheck },
  { id: 'backup', label: 'Data & Backup', description: 'Export and protect your data', icon: Download },
  { id: 'audit', label: 'Audit log', description: 'Review workspace activity', icon: ClipboardList },
];

function SettingRow({ title, description, checked, onChange }) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-4 rounded-xl border border-gray-100 bg-gray-50/70 p-4 transition-colors hover:bg-gray-50">
      <span>
        <span className="block text-sm font-semibold text-gray-800">{title}</span>
        <span className="mt-1 block text-xs text-gray-500">{description}</span>
      </span>
      <span className="relative shrink-0">
        <input
          type="checkbox"
          className="peer sr-only"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
        />
        <span className="block h-6 w-11 rounded-full bg-gray-300 transition-colors peer-checked:bg-primary-600 peer-focus:ring-2 peer-focus:ring-primary-200" />
        <span className="absolute left-1 top-1 h-4 w-4 rounded-full bg-white shadow transition-transform peer-checked:translate-x-5" />
      </span>
    </label>
  );
}

export default function Settings() {
  const { data, setData, activeBranch, setActiveBranch, getBranchStats, currentBranch, branches } = useData();
  const { user } = useAuth();
  const initialSettings = useMemo(() => ({ ...defaultSettings, ...data.settings }), [data.settings]);
  const [form, setForm] = useState(initialSettings);
  const [activeSection, setActiveSection] = useState('branches');
  const [branchOpen, setBranchOpen] = useState(false);
  const [editBranch, setEditBranch] = useState(null);
  const [saved, setSaved] = useState(false);
  const [themeSkin, setThemeSkin] = useState(() => localStorage.getItem('bilzyfit_theme_skin') || 'teal');
  const [importMessage, setImportMessage] = useState('');

  const comparableForm = { ...form, branches: data.settings.branches || [] };
  const isDirty = JSON.stringify(comparableForm) !== JSON.stringify(initialSettings);
  const handleChange = (field, value) => {
    setSaved(false);
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setData((current) => ({
      ...current,
      settings: { ...form, branches: current.settings.branches || [] },
      auditLog: [{
        id: `audit-${Date.now()}`,
        action: 'settings.updated',
        entity: 'settings',
        entityId: user?.workspaceId || 'demo-workspace',
        details: { section: activeSection },
        at: new Date().toISOString(),
      }, ...(current.auditLog || [])].slice(0, 500),
    }));
    setSaved(true);
  };

  const resetChanges = () => setForm(initialSettings);

  const handleLogoChange = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => handleChange('logo', reader.result);
    reader.readAsDataURL(file);
  };

  const changeThemeSkin = (skin) => {
    setThemeSkin(skin);
    localStorage.setItem('bilzyfit_theme_skin', skin);
    window.dispatchEvent(new CustomEvent('bilzyfit-preferences-change', { detail: { themeSkin: skin } }));
  };

  const exportData = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${form.gymName || 'bilzyfit'}-backup.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const importData = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const imported = normalizeImportedData(
          JSON.parse(reader.result),
          user?.workspaceId || 'demo-workspace'
        );
        if (!confirm('Restore this backup and replace the current workspace data?')) return;
        setData(imported);
        setImportMessage('Backup restored. Orphaned records were removed safely.');
      } catch (error) {
        setImportMessage(error.message || 'Could not restore this backup file.');
      }
    };
    reader.readAsText(file);
  };

  const renderSection = () => {
    if (activeSection === 'branches') {
      return (
        <div className="space-y-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <div className="rounded-xl bg-primary-50 p-2.5 text-primary-700">
                <Building2 className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Gym Centres & Branches</h2>
                <p className="text-sm text-gray-500">
                  Switch active gym centre, view individual centre performance, and manage multiple locations.
                </p>
              </div>
            </div>
            <Button
              type="button"
              icon={Plus}
              onClick={() => {
                setEditBranch(null);
                setBranchOpen(true);
              }}
            >
              Add Gym Centre
            </Button>
          </div>

          {/* Currently Active Branch Banner */}
          <div className="rounded-xl border border-primary-200 bg-gradient-to-r from-primary-50 via-white to-primary-50/50 p-4 shadow-sm">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-600 text-white shadow-sm">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-xs font-semibold uppercase tracking-wider text-primary-700">Currently Managing</p>
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-semibold text-emerald-800">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                      Live Context
                    </span>
                  </div>
                  <p className="mt-0.5 text-lg font-bold text-gray-900">
                    {activeBranch === 'all' ? '🌐 All Gym Centres (Consolidated View)' : (currentBranch?.name || activeBranch)}
                    {currentBranch?.city && <span className="ml-2 text-sm font-normal text-gray-500">({currentBranch.city})</span>}
                  </p>
                  <p className="text-xs text-gray-600">
                    {activeBranch === 'all'
                      ? 'Dashboard, Members, Attendance, and Finance are displaying consolidated multi-centre data.'
                      : `All pages are currently displaying members, finances, and attendance specifically for this centre.`}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {activeBranch !== 'all' ? (
                  <Button
                    type="button"
                    size="sm"
                    variant="secondary"
                    icon={Globe2}
                    onClick={() => setActiveBranch('all')}
                  >
                    Switch to All Centres
                  </Button>
                ) : (
                  <span className="rounded-lg bg-primary-100 px-3 py-1.5 text-xs font-semibold text-primary-800">
                    All Locations Active
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Grid of Branch Cards */}
          <div className="grid gap-4 md:grid-cols-2">
            {branches.map((b) => {
              const isActive = activeBranch === b.name;
              const stats = getBranchStats(b.name);
              return (
                <div
                  key={b.id}
                  className={`flex flex-col justify-between rounded-xl border p-5 transition-all ${
                    isActive
                      ? 'border-primary-500 bg-primary-50/20 ring-2 ring-primary-500/20 shadow-md'
                      : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
                  }`}
                >
                  <div>
                    {/* Header */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-3">
                        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${isActive ? 'bg-primary-600 text-white' : 'bg-primary-100 text-primary-700'}`}>
                          <Building2 className="h-5 w-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-gray-900">{b.name}</h3>
                            {b.branchCode && (
                              <span className="rounded bg-gray-100 px-1.5 py-0.5 text-[10px] font-bold text-gray-600 uppercase">
                                {b.branchCode}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-gray-500">{b.city || 'Location'}</p>
                        </div>
                      </div>
                      {isActive && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-800">
                          <Check className="h-3.5 w-3.5" /> Active
                        </span>
                      )}
                    </div>

                    {/* Details list */}
                    <div className="mt-4 space-y-1.5 border-t border-gray-100 pt-3 text-xs text-gray-600">
                      {b.address && (
                        <div className="flex items-center gap-2">
                          <MapPin className="h-3.5 w-3.5 text-gray-400 shrink-0" />
                          <span className="truncate">{b.address}</span>
                        </div>
                      )}
                      {b.timings && (
                        <div className="flex items-center gap-2">
                          <Clock className="h-3.5 w-3.5 text-gray-400 shrink-0" />
                          <span>{b.timings}</span>
                        </div>
                      )}
                      {b.phone && (
                        <div className="flex items-center gap-2">
                          <Phone className="h-3.5 w-3.5 text-gray-400 shrink-0" />
                          <span>{b.phone}</span>
                        </div>
                      )}
                      {b.manager && (
                        <div className="flex items-center gap-2">
                          <UserRound className="h-3.5 w-3.5 text-gray-400 shrink-0" />
                          <span>Manager: {b.manager}</span>
                        </div>
                      )}
                      {b.upiId && (
                        <div className="flex items-center gap-2 text-primary-700 font-mono">
                          <QrCode className="h-3.5 w-3.5 text-primary-600 shrink-0" />
                          <span>UPI: {b.upiId}</span>
                        </div>
                      )}
                    </div>

                    {/* Stats strip */}
                    <div className="mt-4 grid grid-cols-3 gap-2 rounded-lg bg-gray-50 p-2 text-center">
                      <div>
                        <p className="text-[10px] uppercase font-medium text-gray-400">Total Members</p>
                        <p className="text-sm font-bold text-gray-900">{stats.totalMembers}</p>
                      </div>
                      <div>
                        <p className="text-[10px] uppercase font-medium text-gray-400">Active</p>
                        <p className="text-sm font-bold text-emerald-600">{stats.activeMembers}</p>
                      </div>
                      <div>
                        <p className="text-[10px] uppercase font-medium text-gray-400">Revenue</p>
                        <p className="text-sm font-bold text-gray-900">₹{(stats.totalRevenue / 1000).toFixed(0)}k</p>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-5 flex items-center justify-between border-t border-gray-100 pt-3">
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => {
                          setEditBranch(b);
                          setBranchOpen(true);
                        }}
                        className="rounded p-1.5 text-gray-400 hover:bg-gray-100 hover:text-primary-600"
                        title="Edit Centre Details"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      {branches.length > 1 && (
                        <button
                          type="button"
                          onClick={() => {
                            if (confirm(`Delete ${b.name}? Associated members will be reassigned.`)) {
                              const { data: next } = deleteBranch(data, b.id);
                              setData(next);
                              if (activeBranch === b.name) setActiveBranch('all');
                            }
                          }}
                          className="rounded p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-600"
                          title="Delete Centre"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>

                    {isActive ? (
                      <span className="text-xs font-semibold text-primary-700">Currently Active</span>
                    ) : (
                      <Button
                        type="button"
                        size="sm"
                        variant="secondary"
                        onClick={() => setActiveBranch(b.name)}
                      >
                        Switch to this Centre
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      );
    }

    if (activeSection === 'audit') {
      return (
        <>
          <div className="mb-6 flex items-start gap-3">
            <div className="rounded-xl bg-primary-50 p-2.5 text-primary-700"><ClipboardList className="h-5 w-5" /></div>
            <div><h2 className="text-lg font-semibold text-gray-900">Audit log</h2><p className="text-sm text-gray-500">Recent local activity recorded for this workspace.</p></div>
          </div>
          {(data.auditLog || []).length === 0 ? (
            <div className="rounded-xl border border-dashed border-gray-300 p-8 text-center text-sm text-gray-500">No activity has been recorded yet.</div>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-gray-200">
              <table className="min-w-full divide-y divide-gray-200 text-sm">
                <thead className="bg-gray-50 text-left text-xs uppercase tracking-wide text-gray-500"><tr><th className="px-4 py-3">Time</th><th className="px-4 py-3">Action</th><th className="px-4 py-3">Entity</th><th className="px-4 py-3">Details</th></tr></thead>
                <tbody className="divide-y divide-gray-100 bg-white">
                  {(data.auditLog || []).slice(0, 100).map((entry) => <tr key={entry.id}><td className="whitespace-nowrap px-4 py-3 text-gray-500">{new Date(entry.at).toLocaleString()}</td><td className="px-4 py-3 font-medium text-gray-800">{entry.action}</td><td className="px-4 py-3 text-gray-600">{entry.entity}</td><td className="max-w-xs truncate px-4 py-3 text-gray-500">{JSON.stringify(entry.details || {})}</td></tr>)}
                </tbody>
              </table>
            </div>
          )}
        </>
      );
    }

    if (activeSection === 'profile') {
      return (
        <>
          <div className="mb-6 flex items-start gap-3">
            <div className="rounded-xl bg-primary-50 p-2.5 text-primary-700"><Building2 className="h-5 w-5" /></div>
            <div><h2 className="text-lg font-semibold text-gray-900">Gym profile</h2><p className="text-sm text-gray-500">Keep your business identity and contact information up to date.</p></div>
          </div>
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-4 rounded-xl border border-gray-100 bg-gray-50/70 p-4">
              <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-xl border border-gray-200 bg-white">
                {form.logo ? <img src={form.logo} alt="Gym logo preview" className="h-full w-full object-contain p-1" /> : <Building2 className="h-7 w-7 text-gray-300" />}
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-800">Gym logo</p>
                <p className="mt-1 text-xs text-gray-500">This logo appears in the vertical sidebar and receipts.</p>
                <label className="mt-3 inline-flex cursor-pointer items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50">
                  <Upload className="h-4 w-4 text-primary-600" /> {form.logo ? 'Change logo' : 'Upload logo'}
                  <input type="file" accept="image/png,image/jpeg,image/webp,image/svg+xml" className="hidden" onChange={(e) => handleLogoChange(e.target.files[0])} />
                </label>
                {form.logo && <button type="button" onClick={() => handleChange('logo', '')} className="ml-3 text-xs font-medium text-red-600 hover:text-red-700">Remove</button>}
              </div>
            </div>
            <Input label="Gym name" value={form.gymName} onChange={(e) => handleChange('gymName', e.target.value)} />
            <Textarea label="Address" value={form.address} onChange={(e) => handleChange('address', e.target.value)} />
            <div className="grid gap-4 sm:grid-cols-2">
              <Input label="Phone" value={form.phone} onChange={(e) => handleChange('phone', e.target.value)} />
              <Input label="Business email" type="email" value={form.email} onChange={(e) => handleChange('email', e.target.value)} />
              <Input label="GSTIN" value={form.gstin} onChange={(e) => handleChange('gstin', e.target.value.toUpperCase())} placeholder="15-character GSTIN" />
              <Input label="Default GST rate (%)" type="number" min={0} max={100} value={form.defaultGstRate} onChange={(e) => handleChange('defaultGstRate', Number(e.target.value))} />
              <Input label="Invoice prefix" value={form.invoicePrefix} onChange={(e) => handleChange('invoicePrefix', e.target.value.toUpperCase())} />
              <Input label="UPI ID" value={form.upiId} onChange={(e) => handleChange('upiId', e.target.value)} placeholder="billing@upi" />
            </div>
            <Input label="Opening hours" helper="Example: Mon–Sun, 5:00 AM – 10:00 PM" value={form.openingHours} onChange={(e) => handleChange('openingHours', e.target.value)} />
          </div>
        </>
      );
    }

    if (activeSection === 'preferences') {
      return (
        <>
          <div className="mb-6 flex items-start gap-3">
            <div className="rounded-xl bg-primary-50 p-2.5 text-primary-700"><Palette className="h-5 w-5" /></div>
            <div><h2 className="text-lg font-semibold text-gray-900">Preferences</h2><p className="text-sm text-gray-500">Configure how BilzyFit displays dates, currency and language.</p></div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Select label="Currency" value={form.currency} onChange={(e) => handleChange('currency', e.target.value)} options={[{ value: 'INR', label: 'INR — Indian Rupee' }, { value: 'USD', label: 'USD — US Dollar' }, { value: 'AED', label: 'AED — UAE Dirham' }]} />
            <Select label="Timezone" value={form.timezone} onChange={(e) => handleChange('timezone', e.target.value)} options={[{ value: 'Asia/Kolkata', label: 'India Standard Time' }, { value: 'Asia/Dubai', label: 'Gulf Standard Time' }, { value: 'UTC', label: 'Coordinated Universal Time' }]} />
            <Select label="Date format" value={form.dateFormat} onChange={(e) => handleChange('dateFormat', e.target.value)} options={[{ value: 'DD MMM YYYY', label: '06 Sep 2026' }, { value: 'DD/MM/YYYY', label: '06/09/2026' }, { value: 'MM/DD/YYYY', label: '09/06/2026' }]} />
            <Select label="Language" value={form.language} onChange={(e) => handleChange('language', e.target.value)} options={[{ value: 'English', label: 'English' }, { value: 'Hindi', label: 'Hindi' }]} />
          </div>
          <div className="mt-6 rounded-xl border border-gray-100 p-4">
            <div className="flex items-center gap-3"><Globe2 className="h-4 w-4 text-primary-600" /><span className="text-sm font-semibold text-gray-800">Appearance</span></div>
            <div className="mt-3 flex gap-3">
              {['light', 'dark'].map((theme) => (
                <button key={theme} type="button" onClick={() => handleChange('theme', theme)} className={`rounded-lg border px-4 py-2 text-sm capitalize transition-colors ${form.theme === theme ? 'border-primary-600 bg-primary-50 font-semibold text-primary-700' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}>{theme}</button>
              ))}
            </div>
            <div className="mt-4 rounded-xl border border-gray-100 p-4">
              <div className="flex items-center gap-3"><Palette className="h-4 w-4 text-primary-600" /><span className="text-sm font-semibold text-gray-800">Theme skin</span></div>
              <p className="mt-1 text-xs text-gray-500">Applies the selected accent color across the complete dashboard.</p>
              <div className="mt-4 flex flex-wrap gap-3">
                {[
                  { value: 'teal', label: 'Teal', className: 'bg-teal-600' },
                  { value: 'green', label: 'Green', className: 'bg-green-600' },
                  { value: 'orange', label: 'Orange', className: 'bg-orange-500' },
                  { value: 'red', label: 'Red', className: 'bg-red-600' },
                ].map((skin) => (
                  <button key={skin.value} type="button" onClick={() => changeThemeSkin(skin.value)} className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm ${themeSkin === skin.value ? 'border-primary-600 bg-primary-50 font-semibold text-primary-700' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
                    <span className={`h-3 w-3 rounded-full ${skin.className}`} /> {skin.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </>
      );
    }

    if (activeSection === 'notifications') {
      return (
        <>
          <div className="mb-6 flex items-start gap-3">
            <div className="rounded-xl bg-primary-50 p-2.5 text-primary-700"><Bell className="h-5 w-5" /></div>
            <div><h2 className="text-lg font-semibold text-gray-900">Notifications</h2><p className="text-sm text-gray-500">Choose which updates your team should receive.</p></div>
          </div>
          <div className="space-y-3">
            <SettingRow title="Email notifications" description="Receive important system updates by email." checked={form.emailNotifications} onChange={(value) => handleChange('emailNotifications', value)} />
            <SettingRow title="SMS notifications" description="Send time-sensitive alerts to your registered phone." checked={form.smsNotifications} onChange={(value) => handleChange('smsNotifications', value)} />
            <SettingRow title="Membership renewal reminders" description="Remind members before their plans expire." checked={form.renewalReminders} onChange={(value) => handleChange('renewalReminders', value)} />
            <SettingRow title="Payment alerts" description="Notify managers when payments are received or pending." checked={form.paymentAlerts} onChange={(value) => handleChange('paymentAlerts', value)} />
            <SettingRow title="Weekly performance report" description="Get a weekly summary of members, revenue and attendance." checked={form.weeklyReports} onChange={(value) => handleChange('weeklyReports', value)} />
          </div>
        </>
      );
    }

    if (activeSection === 'security') {
      return (
        <>
          <div className="mb-6 flex items-start gap-3">
            <div className="rounded-xl bg-primary-50 p-2.5 text-primary-700"><LockKeyhole className="h-5 w-5" /></div>
            <div><h2 className="text-lg font-semibold text-gray-900">Security</h2><p className="text-sm text-gray-500">Manage account protection and staff access.</p></div>
          </div>
          <div className="space-y-3">
            <button type="button" className="flex w-full items-center justify-between rounded-xl border border-gray-200 p-4 text-left transition-colors hover:border-primary-200 hover:bg-primary-50/40"><span><span className="block text-sm font-semibold text-gray-800">Manage staff permissions</span><span className="mt-1 block text-xs text-gray-500">Control what each role can view and manage.</span></span><ChevronRight className="h-4 w-4 text-gray-400" /></button>
            <button type="button" className="flex w-full items-center justify-between rounded-xl border border-gray-200 p-4 text-left transition-colors hover:border-primary-200 hover:bg-primary-50/40"><span><span className="block text-sm font-semibold text-gray-800">Change account password</span><span className="mt-1 block text-xs text-gray-500">Update your password regularly for better security.</span></span><ChevronRight className="h-4 w-4 text-gray-400" /></button>
          </div>
          <div className="mt-5 flex items-center gap-3 rounded-xl border border-emerald-100 bg-emerald-50 p-4 text-sm text-emerald-800"><ShieldCheck className="h-5 w-5 shrink-0" />Your workspace is protected with local data storage.</div>
        </>
      );
    }

    return (
      <>
        <div className="mb-6 flex items-start gap-3">
          <div className="rounded-xl bg-primary-50 p-2.5 text-primary-700"><Download className="h-5 w-5" /></div>
          <div><h2 className="text-lg font-semibold text-gray-900">Data & backup</h2><p className="text-sm text-gray-500">Download a secure copy of your gym data whenever you need it.</p></div>
        </div>
        <div className="rounded-xl border border-dashed border-gray-300 p-6 text-center">
          <Upload className="mx-auto h-8 w-8 text-gray-400" />
          <h3 className="mt-3 text-sm font-semibold text-gray-800">Create a backup</h3>
          <p className="mx-auto mt-1 max-w-sm text-xs text-gray-500">Export members, payments, plans and settings as a JSON file for safekeeping.</p>
          <Button className="mt-4" variant="secondary" icon={Download} onClick={exportData}>Export data</Button>
          <label className="mx-auto mt-3 flex w-fit cursor-pointer items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50">
            <Upload className="h-4 w-4 text-primary-600" /> Restore JSON backup
            <input type="file" accept="application/json,.json" className="hidden" onChange={(e) => { importData(e.target.files?.[0]); e.target.value = ''; }} />
          </label>
          {importMessage && <p className="mt-3 text-xs text-gray-600">{importMessage}</p>}
        </div>
      </>
    );
  };

  return (
    <div className="page-container">
      <PageHeader title="Settings" subtitle="Configure your BilzyFit workspace and keep your gym operations organised.">
        {isDirty && <span className="rounded-full bg-amber-50 px-3 py-1.5 text-xs font-medium text-amber-700">Unsaved changes</span>}
      </PageHeader>

      {/* Quick Active Branch Switcher Banner */}
      <div className="mb-6 flex flex-col gap-4 rounded-2xl border border-primary-100 bg-gradient-to-r from-primary-50/90 via-white to-primary-50/50 p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary-600 text-white shadow-sm shadow-primary-200">
            <Building2 className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-primary-700">Active Gym Centre</span>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700 border border-emerald-200">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                Active Scope
              </span>
            </div>
            <p className="mt-0.5 text-base font-bold text-gray-900">
              {activeBranch === 'all' ? '🌐 All Gym Centres (Consolidated View)' : (currentBranch?.name || activeBranch)}
              {currentBranch?.city && <span className="ml-1.5 text-sm font-normal text-gray-500">({currentBranch.city})</span>}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={activeBranch}
            onChange={(e) => setActiveBranch(e.target.value)}
            className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-semibold text-gray-800 shadow-sm transition-colors hover:border-gray-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100"
          >
            <option value="all">🌐 All Gym Centres Consolidated ({branches.length})</option>
            {branches.map((b) => (
              <option key={b.id} value={b.name}>
                🏢 {b.name} ({b.city || 'Main'})
              </option>
            ))}
          </select>
          <Button
            size="sm"
            variant={activeSection === 'branches' ? 'primary' : 'outline'}
            onClick={() => setActiveSection('branches')}
          >
            Manage Centres
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[240px_minmax(0,1fr)]">
        <Card padding="none" className="h-fit overflow-hidden">
          <div className="border-b border-gray-100 px-4 py-4"><p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Workspace settings</p></div>
          <nav className="space-y-1 p-2">
            {sections.map((section) => {
              const Icon = section.icon;
              const active = activeSection === section.id;
              return <button key={section.id} type="button" onClick={() => setActiveSection(section.id)} className={`flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left transition-colors ${active ? 'bg-primary-50 text-primary-700' : 'text-gray-600 hover:bg-gray-50'}`}><Icon className="h-4 w-4 shrink-0" /><span className="min-w-0"><span className="block text-sm font-medium">{section.label}</span><span className={`mt-0.5 block truncate text-xs ${active ? 'text-primary-600/70' : 'text-gray-400'}`}>{section.description}</span></span>{active && <ChevronRight className="ml-auto h-4 w-4" />}</button>;
            })}
          </nav>
          <div className="m-3 rounded-xl bg-gray-50 p-3"><div className="flex items-center gap-2 text-xs font-semibold text-gray-700"><UserRound className="h-4 w-4 text-primary-600" />Admin workspace</div><p className="mt-1 text-xs leading-5 text-gray-500">Only authorised staff should update these settings.</p></div>
        </Card>

        {activeSection === 'branches' ? (
          <Card padding="large">{renderSection()}</Card>
        ) : (
          <form onSubmit={handleSubmit}>
            <Card padding="large">{renderSection()}</Card>
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
              <Button type="button" variant="ghost" icon={RotateCcw} onClick={resetChanges} disabled={!isDirty}>Reset changes</Button>
              <div className="flex items-center gap-3">
                {saved && <span className="flex items-center gap-1 text-sm text-emerald-600"><Check className="h-4 w-4" />Saved successfully</span>}
                <Button type="submit" icon={Save} disabled={!isDirty}>Save changes</Button>
              </div>
            </div>
          </form>
        )}
      </div>

      <BranchModal
        open={branchOpen}
        onClose={() => {
          setBranchOpen(false);
          setEditBranch(null);
        }}
        branch={editBranch}
      />
    </div>
  );
}
