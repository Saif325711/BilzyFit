import { DollarSign, Download, FileText, TrendingUp, UserCheck, Users } from 'lucide-react';
import { useData } from '../context/DataContext';
import { useMemo, useState } from 'react';
import PageHeader from '../components/ui/PageHeader';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

const reportGroups = [
  {
    title: 'Member Reports',
    reports: ['Total Members', 'Active Members', 'Expired Members', 'New Members', 'Renewed Members'],
  },
  {
    title: 'Attendance Reports',
    reports: ['Daily Attendance', 'Weekly Attendance', 'Monthly Attendance', 'Member Attendance', 'Peak Hours'],
  },
  {
    title: 'Finance Reports',
    reports: ['Revenue', 'Expenses', 'Profit', 'Pending Payments', 'Membership Revenue', 'Payment Method Report'],
  },
  {
    title: 'CRM Reports',
    reports: ['New Leads', 'Converted Leads', 'Conversion Rate', 'Trial Conversion'],
  },
];

function downloadCsv(filename, headers, rows) {
  const escape = (val) => `"${String(val ?? '').replace(/"/g, '""')}"`;
  const csv = [headers.map(escape).join(','), ...rows.map((row) => row.map(escape).join(','))].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function fmtDate(d) {
  return new Date(d).toISOString().split('T')[0];
}

export default function Reports() {
  const { data } = useData();
  const [category, setCategory] = useState('');
  const [search, setSearch] = useState('');

  const visibleGroups = useMemo(
    () =>
      reportGroups
        .filter((group) => !category || group.title === category)
        .map((group) => ({
          ...group,
          reports: group.reports.filter((report) =>
            report.toLowerCase().includes(search.toLowerCase())
          ),
        }))
        .filter((group) => group.reports.length > 0),
    [category, search]
  );
  const revenue = data.payments.reduce((sum, payment) => sum + payment.amount, 0);
  const expenses = data.expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const activeMembers = data.members.filter((member) => member.status === 'active').length;
  const conversionRate = data.leads.length
    ? Math.round((data.leads.filter((lead) => lead.status === 'Converted').length / data.leads.length) * 100)
    : 0;

  const exportReport = (title) => {
    const today = fmtDate(new Date());
    const monthStart = today.slice(0, 7);
    const weekAgo = fmtDate(new Date(Date.now() - 7 * 86400000));

    switch (title) {
      case 'Total Members':
        downloadCsv(
          'total-members.csv',
          ['Name', 'Mobile', 'Email', 'Status', 'Joining Date', 'Goal'],
          data.members.map((m) => [m.fullName, m.mobile, m.email, m.status, m.joiningDate, m.goal])
        );
        break;
      case 'Active Members':
        downloadCsv(
          'active-members.csv',
          ['Name', 'Mobile', 'Email', 'Joining Date', 'Goal'],
          data.members.filter((m) => m.status === 'active').map((m) => [m.fullName, m.mobile, m.email, m.joiningDate, m.goal])
        );
        break;
      case 'Expired Members':
        downloadCsv(
          'expired-members.csv',
          ['Name', 'Mobile', 'Email', 'Joining Date'],
          data.members.filter((m) => m.status === 'expired').map((m) => [m.fullName, m.mobile, m.email, m.joiningDate])
        );
        break;
      case 'New Members':
        downloadCsv(
          'new-members.csv',
          ['Name', 'Mobile', 'Joining Date', 'Goal'],
          data.members
            .filter((m) => m.joiningDate >= fmtDate(new Date(Date.now() - 30 * 86400000)))
            .map((m) => [m.fullName, m.mobile, m.joiningDate, m.goal])
        );
        break;
      case 'Renewed Members':
        downloadCsv(
          'renewed-members.csv',
          ['Name', 'Mobile', 'Plan', 'Start Date', 'Expiry Date'],
          data.memberships
            .filter((m) => m.startDate >= fmtDate(new Date(Date.now() - 30 * 86400000)))
            .map((m) => {
              const member = data.members.find((x) => x.id === m.memberId);
              return [member?.fullName || '', member?.mobile || '', m.planName, m.startDate, m.expiryDate];
            })
        );
        break;
      case 'Daily Attendance':
        downloadCsv(
          'daily-attendance.csv',
          ['Member ID', 'Name', 'Date', 'Check In', 'Check Out'],
          data.attendance
            .filter((a) => a.date === today)
            .map((a) => {
              const member = data.members.find((x) => x.id === a.memberId);
              return [member?.memberId || '', member?.fullName || '', a.date, a.checkIn, a.checkOut || '—'];
            })
        );
        break;
      case 'Weekly Attendance':
        downloadCsv(
          'weekly-attendance.csv',
          ['Date', 'Count'],
          Object.entries(
            data.attendance
              .filter((a) => a.date >= weekAgo)
              .reduce((acc, a) => {
                acc[a.date] = (acc[a.date] || 0) + 1;
                return acc;
              }, {})
          )
        );
        break;
      case 'Monthly Attendance':
        downloadCsv(
          'monthly-attendance.csv',
          ['Member ID', 'Name', 'Date', 'Check In'],
          data.attendance
            .filter((a) => a.date.startsWith(monthStart))
            .map((a) => {
              const member = data.members.find((x) => x.id === a.memberId);
              return [member?.memberId || '', member?.fullName || '', a.date, a.checkIn];
            })
        );
        break;
      case 'Member Attendance':
        downloadCsv(
          'member-attendance.csv',
          ['Member ID', 'Name', 'Total Visits'],
          data.members.map((m) => [
            m.memberId,
            m.fullName,
            data.attendance.filter((a) => a.memberId === m.id).length,
          ])
        );
        break;
      case 'Peak Hours': {
        const hours = data.attendance.reduce((acc, a) => {
          const hour = new Date(a.checkIn).getHours();
          acc[hour] = (acc[hour] || 0) + 1;
          return acc;
        }, {});
        downloadCsv(
          'peak-hours.csv',
          ['Hour', 'Check-ins'],
          Object.entries(hours).map(([hour, count]) => [`${hour}:00`, count])
        );
        break;
      }
      case 'Revenue':
        downloadCsv(
          'revenue.csv',
          ['Date', 'Member', 'Amount', 'Method', 'Invoice'],
          data.payments.map((p) => {
            const member = data.members.find((x) => x.id === p.memberId);
            return [p.date, member?.fullName || '', p.amount, p.method, p.invoiceNumber];
          })
        );
        break;
      case 'Expenses':
        downloadCsv(
          'expenses.csv',
          ['Date', 'Category', 'Description', 'Amount', 'Method'],
          data.expenses.map((e) => [e.date, e.category, e.description, e.amount, e.paymentMethod])
        );
        break;
      case 'Profit': {
        const revenue = data.payments.reduce((s, p) => s + p.amount, 0);
        const expense = data.expenses.reduce((s, e) => s + e.amount, 0);
        downloadCsv('profit.csv', ['Metric', 'Amount (₹)'], [
          ['Revenue', revenue],
          ['Expenses', expense],
          ['Net Profit', revenue - expense],
        ]);
        break;
      }
      case 'Pending Payments':
        downloadCsv(
          'pending-payments.csv',
          ['Member ID', 'Name', 'Plan', 'Amount', 'Paid', 'Pending'],
          data.memberships
            .filter((m) => m.pendingAmount > 0)
            .map((m) => {
              const member = data.members.find((x) => x.id === m.memberId);
              return [member?.memberId || '', member?.fullName || '', m.planName, m.amount, m.paidAmount, m.pendingAmount];
            })
        );
        break;
      case 'Membership Revenue':
        downloadCsv(
          'membership-revenue.csv',
          ['Date', 'Member', 'Amount', 'Method'],
          data.payments
            .filter((p) => p.type === 'membership')
            .map((p) => {
              const member = data.members.find((x) => x.id === p.memberId);
              return [p.date, member?.fullName || '', p.amount, p.method];
            })
        );
        break;
      case 'Payment Method Report': {
        const methods = data.payments.reduce((acc, p) => {
          acc[p.method] = (acc[p.method] || 0) + p.amount;
          return acc;
        }, {});
        downloadCsv('payment-method-report.csv', ['Method', 'Total (₹)'], Object.entries(methods));
        break;
      }
      case 'New Leads':
        downloadCsv(
          'new-leads.csv',
          ['Name', 'Phone', 'Source', 'Status', 'Follow-up Date'],
          data.leads.filter((l) => l.status === 'New Lead').map((l) => [l.name, l.phone, l.source, l.status, l.followUpDate])
        );
        break;
      case 'Converted Leads':
        downloadCsv(
          'converted-leads.csv',
          ['Name', 'Phone', 'Source', 'Status', 'Follow-up Date'],
          data.leads.filter((l) => l.status === 'Converted').map((l) => [l.name, l.phone, l.source, l.status, l.followUpDate])
        );
        break;
      case 'Conversion Rate': {
        const total = data.leads.length;
        const converted = data.leads.filter((l) => l.status === 'Converted').length;
        downloadCsv('conversion-rate.csv', ['Metric', 'Value'], [
          ['Total Leads', total],
          ['Converted', converted],
          ['Conversion Rate %', total ? ((converted / total) * 100).toFixed(2) : 0],
        ]);
        break;
      }
      case 'Trial Conversion':
        downloadCsv(
          'trial-conversion.csv',
          ['Name', 'Phone', 'Source', 'Status', 'Follow-up Date'],
          data.leads.filter((l) => l.status === 'Trial').map((l) => [l.name, l.phone, l.source, l.status, l.followUpDate])
        );
        break;
      default:
        break;
    }
  };

  return (
    <div className="page-container">
      <PageHeader title="Reports" subtitle="Download and view detailed gym reports.">
        <Button icon={Download} onClick={() => exportReport('Revenue')}>Export revenue</Button>
      </PageHeader>

      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: 'Total revenue', value: `₹${revenue.toLocaleString('en-IN')}`, icon: DollarSign, color: 'bg-emerald-50 text-emerald-600' },
          { label: 'Net profit', value: `₹${(revenue - expenses).toLocaleString('en-IN')}`, icon: TrendingUp, color: 'bg-blue-50 text-blue-600' },
          { label: 'Active members', value: activeMembers, icon: Users, color: 'bg-violet-50 text-violet-600' },
          { label: 'Lead conversion', value: `${conversionRate}%`, icon: UserCheck, color: 'bg-amber-50 text-amber-600' },
        ].map((metric) => (
          <Card key={metric.label}>
            <div className="flex items-center justify-between">
              <div><p className="text-xs font-medium uppercase tracking-wide text-gray-500">{metric.label}</p><p className="mt-2 text-2xl font-bold text-gray-900">{metric.value}</p></div>
              <div className={`rounded-xl p-3 ${metric.color}`}><metric.icon className="h-5 w-5" /></div>
            </div>
          </Card>
        ))}
      </div>

      <Card className="mb-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div><h2 className="text-base font-semibold text-gray-900">Report library</h2><p className="mt-1 text-sm text-gray-500">Choose a category and download the exact report you need.</p></div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search reports..." className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200" />
            <select value={category} onChange={(e) => setCategory(e.target.value)} className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200">
              <option value="">All categories</option>
              {reportGroups.map((group) => <option key={group.title} value={group.title}>{group.title}</option>)}
            </select>
          </div>
        </div>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        {visibleGroups.map((group) => (
          <Card key={group.title}>
            <div className="mb-3 flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary-600" />
              <h3 className="font-semibold text-gray-900">{group.title}</h3>
            </div>
            <ul className="space-y-2">
              {group.reports.map((r) => (
                <li
                  key={r}
                  className="flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50 px-3 py-2 text-sm"
                >
                  <span className="text-gray-700">{r}</span>
                  <Button size="sm" variant="ghost" icon={Download} onClick={() => exportReport(r)}>
                    Export
                  </Button>
                </li>
              ))}
            </ul>
          </Card>
        ))}
      </div>
      {visibleGroups.length === 0 && <Card><div className="py-10 text-center text-sm text-gray-500">No reports match your search.</div></Card>}
    </div>
  );
}
