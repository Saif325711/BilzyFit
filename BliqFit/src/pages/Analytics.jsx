import { useMemo } from 'react';
import { BarChart3, IndianRupee, UserCheck, Users } from 'lucide-react';
import { useData } from '../context/DataContext';
import PageHeader from '../components/ui/PageHeader';
import Card from '../components/ui/Card';
import LineChart from '../components/charts/LineChart';
import BarChart from '../components/charts/BarChart';
import DonutChart from '../components/charts/DonutChart';

export default function Analytics() {
  const { data } = useData();
  const today = useMemo(() => new Date(), []);
  const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
  const monthNames = Array.from({ length: 6 }, (_, index) => {
    const date = new Date(today.getFullYear(), today.getMonth() - (5 - index), 1);
    return {
      key: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`,
      name: date.toLocaleString('en-IN', { month: 'short' }),
    };
  });

  const memberGrowthData = useMemo(
    () => monthNames.map((month) => ({
      name: month.name,
      value: data.members.filter((member) => member.joiningDate?.startsWith(month.key)).length,
    })),
    [data.members, monthNames]
  );
  const revenueGrowthData = useMemo(
    () => monthNames.map((month) => ({
      name: month.name,
      value: data.payments
        .filter((payment) => payment.date?.startsWith(month.key))
        .reduce((sum, payment) => sum + payment.amount, 0),
    })),
    [data.payments, monthNames]
  );
  const attendanceTrendData = useMemo(
    () => Array.from({ length: 7 }, (_, index) => {
      const date = new Date(today);
      date.setDate(today.getDate() - (6 - index));
      const key = date.toISOString().split('T')[0];
      return {
        name: date.toLocaleString('en-IN', { weekday: 'short' }),
        value: data.attendance.filter((record) => record.date === key).length,
      };
    }),
    [data.attendance, today]
  );
  const membershipDistribution = useMemo(
    () => Array.from(new Set(data.memberships.map((membership) => membership.planName))).map((planName) => ({
      name: planName,
      value: data.memberships.filter((membership) => membership.planName === planName).length,
    })),
    [data.memberships]
  );
  const monthRevenue = data.payments
    .filter((payment) => new Date(payment.date) >= monthStart)
    .reduce((sum, payment) => sum + payment.amount, 0);
  const monthAttendance = data.attendance.filter((record) => new Date(record.date) >= monthStart).length;

  return (
    <div className="page-container">
      <PageHeader title="Insights & Analytics" subtitle="Live business insights based on your gym data." />

      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: 'Total members', value: data.members.length, icon: Users },
          { label: 'Active members', value: data.members.filter((member) => member.status === 'active').length, icon: UserCheck },
          { label: 'This month revenue', value: `₹${monthRevenue.toLocaleString('en-IN')}`, icon: IndianRupee },
          { label: 'This month visits', value: monthAttendance, icon: BarChart3 },
        ].map((metric) => (
          <Card key={metric.label}>
            <div className="flex items-center justify-between">
              <div><p className="text-xs font-medium uppercase tracking-wide text-gray-500">{metric.label}</p><p className="mt-2 text-2xl font-bold text-gray-900">{metric.value}</p></div>
              <metric.icon className="h-5 w-5 text-primary-600" />
            </div>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card><h3 className="mb-4 text-base font-semibold text-gray-900">New member registrations</h3><LineChart data={memberGrowthData} /></Card>
        <Card><h3 className="mb-4 text-base font-semibold text-gray-900">Revenue collection</h3><LineChart data={revenueGrowthData} color="#3b82f6" /></Card>
        <Card><h3 className="mb-4 text-base font-semibold text-gray-900">Attendance trend</h3><BarChart data={attendanceTrendData} bars={[{ dataKey: 'value', name: 'Visits', color: '#059669' }]} /></Card>
        <Card><h3 className="mb-4 text-base font-semibold text-gray-900">Membership distribution</h3><DonutChart data={membershipDistribution} /></Card>
      </div>
    </div>
  );
}
