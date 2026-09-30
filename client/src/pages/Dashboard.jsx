import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  ClipboardCheck,
  IndianRupee,
  AlertCircle,
  UserPlus,
  CreditCard,
  CalendarClock,
  TrendingUp,
  Wallet,
  Plus,
  ArrowRight,
  MessageCircle,
  Clock3,
  Building2,
  Globe2,
  Check,
  ChevronRight,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import PageHeader from '../components/ui/PageHeader';
import BarChart from '../components/charts/BarChart';
import LineChart from '../components/charts/LineChart';
import { getDashboardStats, getNeedsAttention } from '../data/services';

const formatCurrency = (n) =>
  '₹' + n.toLocaleString('en-IN');

function StatCard({ label, value, subtext, icon: Icon, variant = 'primary' }) {
  const colors = {
    primary: 'bg-primary-50 text-primary-700',
    blue: 'bg-blue-50 text-blue-700',
    amber: 'bg-amber-50 text-amber-700',
    red: 'bg-red-50 text-red-700',
  };
  return (
    <Card className="flex items-start justify-between">
      <div>
        <p className="text-sm font-medium text-gray-500">{label}</p>
        <p className="mt-1 text-2xl font-bold text-gray-900">{value}</p>
        {subtext && <p className="mt-1 text-xs text-gray-500">{subtext}</p>}
      </div>
      <div className={`rounded-lg p-2 ${colors[variant]}`}>
        <Icon className="h-5 w-5" />
      </div>
    </Card>
  );
}

function AttentionItem({ title, count, onClick, variant = 'warning' }) {
  return (
    <button
      onClick={onClick}
      className="flex w-full items-center justify-between rounded-lg border border-gray-200 bg-white p-3 text-left hover:border-primary-300 hover:bg-primary-50/30"
    >
      <div className="flex items-center gap-3">
        <AlertCircle className={`h-5 w-5 ${variant === 'danger' ? 'text-red-500' : 'text-amber-500'}`} />
        <span className="text-sm font-medium text-gray-900">{title}</span>
      </div>
      <div className="flex items-center gap-2">
        <Badge variant={variant === 'danger' ? 'danger' : 'warning'}>{count}</Badge>
        <ArrowRight className="h-4 w-4 text-gray-400" />
      </div>
    </button>
  );
}

export default function Dashboard() {
  const { user, canAccess, markTrialConverted } = useAuth();
  const { data, scopedData, activeBranch, setActiveBranch, branches, currentBranch, getBranchStats } = useData();
  const navigate = useNavigate();
  const stats = getDashboardStats(scopedData);
  const attention = getNeedsAttention(scopedData);
  const chartMonths = useMemo(() => Array.from({ length: 6 }, (_, index) => {
    const date = new Date();
    date.setMonth(date.getMonth() - (5 - index), 1);
    return { key: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`, name: date.toLocaleString('en-IN', { month: 'short' }) };
  }), []);
  const revenueExpenseData = useMemo(() => chartMonths.map((month) => ({
    name: month.name,
    revenue: scopedData.payments.filter((payment) => payment.date?.startsWith(month.key)).reduce((sum, payment) => sum + payment.amount, 0),
    expenses: scopedData.expenses.filter((expense) => expense.date?.startsWith(month.key)).reduce((sum, expense) => sum + expense.amount, 0),
  })), [chartMonths, scopedData.payments, scopedData.expenses]);
  const memberGrowthData = useMemo(() => chartMonths.map((month) => ({
    name: month.name,
    value: scopedData.members.filter((member) => member.joiningDate && member.joiningDate <= `${month.key}-31`).length,
  })), [chartMonths, scopedData.members]);
  const attendanceTrendData = useMemo(() => Array.from({ length: 7 }, (_, index) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - index));
    const key = date.toISOString().split('T')[0];
    return { name: date.toLocaleString('en-IN', { weekday: 'short' }), value: scopedData.attendance.filter((record) => record.date === key).length };
  }), [scopedData.attendance]);
  const renewalTrendData = useMemo(() => chartMonths.map((month) => ({
    name: month.name,
    renewals: scopedData.memberships.filter((membership) => membership.startDate?.startsWith(month.key)).length,
  })), [chartMonths, scopedData.memberships]);
  const trialDaysLeft = user?.isTrial
    ? Math.max(0, Math.ceil((new Date(user.trialEndsAt).getTime() - Date.now()) / 86400000))
    : 0;

  return (
    <div className="page-container">
      <PageHeader
        title={`Welcome, ${user?.name?.split(' ')[0] || 'Admin'} 👋`}
        subtitle="Here's what's happening at your gym today."
      />

      {user?.isTrial && (
        <Card className="mb-6 border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <div className="rounded-lg bg-amber-100 p-2 text-amber-700"><Clock3 className="h-5 w-5" /></div>
              <div>
                <p className="font-semibold text-amber-900">Your BilzyFit free trial is active</p>
                  <p className="mt-1 text-sm text-amber-800">You have <strong>{trialDaysLeft} {trialDaysLeft === 1 ? 'day' : 'days'}</strong> left to explore the complete gym management system.</p>
                  <p className="mt-1 text-xs text-amber-700">Conversion tracking: {user.conversionStatus || 'trial'} · local/demo metadata only.</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="warning">{trialDaysLeft} days left</Badge>
              {user.conversionStatus !== 'converted' && (
                <Button size="sm" variant="secondary" onClick={() => markTrialConverted('local-demo-plan')}>Mark converted</Button>
              )}
            </div>
          </div>
        </Card>
      )}

      {/* Branch Scope & Quick Switcher */}
      <div className="mb-6 flex flex-col gap-3 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-50 text-primary-700">
            <Building2 className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">Gym Centre Analytics</span>
              <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 border border-emerald-200">
                {activeBranch === 'all' ? 'All Locations' : 'Single Branch'}
              </span>
            </div>
            <p className="text-base font-bold text-gray-900">
              {activeBranch === 'all' ? '🌐 All Gym Centres (Consolidated Performance)' : (currentBranch?.name || activeBranch)}
              {currentBranch?.city && <span className="ml-1 text-sm font-normal text-gray-500">• {currentBranch.city}</span>}
            </p>
          </div>
        </div>

        {/* Quick Branch Switcher Pills */}
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            type="button"
            onClick={() => setActiveBranch('all')}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
              activeBranch === 'all'
                ? 'bg-primary-600 text-white shadow-xs'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            All Centres ({branches.length})
          </button>
          {branches.map((b) => (
            <button
              key={b.id}
              type="button"
              onClick={() => setActiveBranch(b.name)}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                activeBranch === b.name
                  ? 'bg-primary-600 text-white shadow-xs'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {b.name}
            </button>
          ))}
          <Button
            size="sm"
            variant="ghost"
            onClick={() => navigate('/settings')}
            className="!px-2 text-xs"
          >
            Manage Branches →
          </Button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Active Members" value={stats.activeMembers} icon={Users} variant="primary" />
        <StatCard label="Today's Attendance" value={stats.todaysAttendance} icon={ClipboardCheck} variant="blue" />
        <StatCard label="Today's Revenue" value={formatCurrency(stats.todaysRevenue)} icon={IndianRupee} variant="primary" />
        <StatCard label="Pending Payments" value={formatCurrency(stats.pendingPayments)} icon={CreditCard} variant="red" />
        <StatCard label="Expiring Soon" value={stats.expiringSoon} subtext="Next 7 days" icon={CalendarClock} variant="amber" />
        <StatCard label="New Leads" value={stats.newLeads} icon={UserPlus} variant="blue" />
        <StatCard label="Week Collection" value={formatCurrency(stats.weekCollection)} icon={TrendingUp} variant="primary" />
        <StatCard label="Total Expenses" value={formatCurrency(stats.totalExpenses)} icon={Wallet} variant="amber" />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <h3 className="mb-4 text-base font-semibold text-gray-900">Needs Attention</h3>
          <div className="grid gap-3 sm:grid-cols-2">
            <AttentionItem title="Expiring Memberships" count={attention.expiring.length} onClick={() => navigate('/memberships')} />
            <AttentionItem title="Pending Payments" count={attention.pending.length} onClick={() => navigate('/finance')} />
            <AttentionItem title="Lead Follow-ups" count={attention.leadFollowups.length} onClick={() => navigate('/leads')} />
            <AttentionItem title="Inactive Members" count={attention.inactive.length} onClick={() => navigate('/members')} variant="danger" />
          </div>
        </Card>

        <Card>
          <h3 className="mb-4 text-base font-semibold text-gray-900">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-3">
            <Button onClick={() => navigate('/members')} icon={Plus} className="justify-start">Add Member</Button>
            <Button onClick={() => navigate('/finance')} icon={CreditCard} variant="secondary" className="justify-start">Collect Payment</Button>
            <Button onClick={() => navigate('/attendance/qr')} icon={ClipboardCheck} variant="secondary" className="justify-start">Check-in</Button>
            <Button onClick={() => navigate('/leads')} icon={UserPlus} variant="secondary" className="justify-start">Add Lead</Button>
            <Button onClick={() => navigate('/memberships')} icon={CalendarClock} variant="secondary" className="justify-start">Renew</Button>
            <Button onClick={() => navigate('/finance')} icon={Wallet} variant="secondary" className="justify-start">Add Expense</Button>
            {canAccess('messaging') && (
              <Button onClick={() => navigate('/messaging')} icon={MessageCircle} variant="secondary" className="justify-start">Bulk Message</Button>
            )}
          </div>
        </Card>
      </div>

      {/* Multi-Branch Performance Comparison Table (Shown when All Centres is selected) */}
      {activeBranch === 'all' && branches.length > 0 && (
        <Card className="mt-6">
          <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-base font-semibold text-gray-900">Multi-Branch Performance Breakdown</h3>
              <p className="text-xs text-gray-500">Compare metrics across all your registered gym locations.</p>
            </div>
            <Button size="sm" variant="outline" onClick={() => navigate('/branches')}>
              View Full Branch Details
            </Button>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-50 text-left text-xs uppercase tracking-wider text-gray-500">
                <tr>
                  <th className="px-4 py-3">Gym Centre</th>
                  <th className="px-4 py-3">City</th>
                  <th className="px-4 py-3">Total Members</th>
                  <th className="px-4 py-3">Active Members</th>
                  <th className="px-4 py-3">Total Collection</th>
                  <th className="px-4 py-3">Today Attendance</th>
                  <th className="px-4 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {branches.map((b) => {
                  const bStats = getBranchStats(b.name);
                  return (
                    <tr key={b.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3.5 font-semibold text-gray-900">
                        <div className="flex items-center gap-2">
                          <Building2 className="h-4 w-4 text-primary-600 shrink-0" />
                          <span>{b.name}</span>
                          {b.branchCode && (
                            <span className="rounded bg-gray-100 px-1.5 py-0.5 text-[10px] font-bold text-gray-500 uppercase">
                              {b.branchCode}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3.5 text-gray-500">{b.city || '—'}</td>
                      <td className="px-4 py-3.5 font-bold text-gray-800">{bStats.totalMembers}</td>
                      <td className="px-4 py-3.5 text-emerald-600 font-semibold">{bStats.activeMembers}</td>
                      <td className="px-4 py-3.5 font-semibold text-gray-900">{formatCurrency(bStats.totalRevenue)}</td>
                      <td className="px-4 py-3.5 text-blue-600 font-semibold">{bStats.todayAttendance}</td>
                      <td className="px-4 py-3.5 text-right">
                        <button
                          type="button"
                          onClick={() => setActiveBranch(b.name)}
                          className="inline-flex items-center gap-1 rounded-lg bg-primary-50 px-2.5 py-1 text-xs font-semibold text-primary-700 hover:bg-primary-100 transition-colors"
                        >
                          <span>Switch to Centre</span>
                          <ChevronRight className="h-3.5 w-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card>
          <h3 className="mb-4 text-base font-semibold text-gray-900">Revenue vs Expenses</h3>
          <BarChart
            data={revenueExpenseData}
            bars={[
              { dataKey: 'revenue', name: 'Revenue', color: '#059669' },
              { dataKey: 'expenses', name: 'Expenses', color: '#ef4444' },
            ]}
          />
        </Card>
        <Card>
          <h3 className="mb-4 text-base font-semibold text-gray-900">Member Growth</h3>
          <LineChart data={memberGrowthData} />
        </Card>
        <Card>
          <h3 className="mb-4 text-base font-semibold text-gray-900">Attendance Trend</h3>
          <LineChart data={attendanceTrendData} color="#3b82f6" />
        </Card>
        <Card>
          <h3 className="mb-4 text-base font-semibold text-gray-900">Renewal Trends</h3>
          <BarChart
            data={renewalTrendData}
            bars={[{ dataKey: 'renewals', name: 'Renewals', color: '#8b5cf6' }]}
          />
        </Card>
      </div>
    </div>
  );
}
