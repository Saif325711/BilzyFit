import { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Calendar,
  Phone,
  Mail,
  MapPin,
  Activity,
  ClipboardCheck,
  Dumbbell,
  Apple,
  TrendingUp,
  CalendarDays,
  MessageCircle,
  Edit2,
  IndianRupee,
  FileText,
  RefreshCw,
  RotateCcw,
  WalletCards,
  ReceiptText,
  CheckCircle2,
  Clock3,
  Users,
  KeyRound,
  Copy,
  ExternalLink,
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { getMemberStats, recordAttendance, checkoutAttendance, freezeMembership, unfreezeMembership, transferMember, consumePtSession } from '../data/services';
import { useAuth } from '../context/AuthContext';
import PageHeader from '../components/ui/PageHeader';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Avatar from '../components/ui/Avatar';
import Tabs from '../components/ui/Tabs';
import { Table, Thead, Th, Tbody, Tr, Td } from '../components/ui/Table';
import PaymentModal from '../components/PaymentModal';
import ReceiptModal from '../components/ReceiptModal';
import DonutChart from '../components/charts/DonutChart';
import SubscriptionModal from '../components/SubscriptionModal';

const statusVariant = {
  active: 'success',
  inactive: 'default',
  expiring: 'warning',
  expired: 'danger',
  paused: 'warning',
};

const membershipStatusVariant = {
  active: 'success',
  pending: 'warning',
  expiring: 'warning',
  expired: 'danger',
  paused: 'warning',
};

function EmptyTab({ icon: Icon, title, description, action, onClick }) {
  return (
    <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 px-6 py-10 text-center">
      <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-white text-gray-400 shadow-sm">
        <Icon className="h-6 w-6" />
      </div>
      <h4 className="font-semibold text-gray-900">{title}</h4>
      <p className="mx-auto mt-1 max-w-md text-sm text-gray-500">{description}</p>
      {action && <Button className="mt-4" size="sm" variant="secondary" onClick={onClick}>{action}</Button>}
    </div>
  );
}

export default function MemberProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, setData } = useData();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [receiptOpen, setReceiptOpen] = useState(false);
  const [subscriptionMode, setSubscriptionMode] = useState(null);
  const [freezeDays, setFreezeDays] = useState(30);
  const [transferBranch, setTransferBranch] = useState('');
  const [invoiceSelection, setInvoiceSelection] = useState(null);

  const stats = getMemberStats(data, id);
  const { member, membership, attendance, payments, totalPaid, totalVisits, recentVisits } = stats;
  const memberships = useMemo(
    () => data.memberships
      .filter((item) => item.memberId === id)
      .sort((a, b) => new Date(b.startDate) - new Date(a.startDate)),
    [data.memberships, id]
  );
  const memberWorkouts = useMemo(() => data.workouts.filter((item) => item.assignedTo?.includes(id)), [data.workouts, id]);
  const memberDiets = useMemo(() => data.diets.filter((item) => item.assignedTo?.includes(id)), [data.diets, id]);
  const memberAppointments = useMemo(
    () => (data.appointments || []).filter((item) => item.memberId === id).sort((a, b) => new Date(b.date || b.createdAt) - new Date(a.date || a.createdAt)),
    [data.appointments, id]
  );

  const monthlyAttendance = useMemo(() => {
    const now = new Date();
    const prefix = now.toISOString().slice(0, 7); // YYYY-MM
    const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    const present = attendance.filter((a) => a.date.startsWith(prefix)).length;
    const absent = Math.max(0, daysInMonth - present);
    return {
      daysInMonth,
      present,
      absent,
    };
  }, [attendance]);

  if (!member) {
    return (
      <div className="page-container">
        <p className="text-gray-500">Member not found.</p>
        <Button className="mt-4" onClick={() => navigate('/members')}>
          Back to Members
        </Button>
      </div>
    );
  }

  const today = new Date().toISOString().split('T')[0];
  const todayRecord = attendance.find((a) => a.date === today);
  const membershipEnded = membership && (
    membership.status === 'expired' || membership.expiryDate <= today
  );

  const handleCheckIn = () => {
    if (membership?.frozen) return;
    const { data: next } = recordAttendance(data, member.id);
    setData(next);
  };

  const handleCheckOut = () => {
    const { data: next } = checkoutAttendance(data, member.id);
    setData(next);
  };

  const handleFreeze = () => {
    if (!membership) return;
    const { data: next } = freezeMembership(data, membership.id, { days: freezeDays, reason: 'Member requested pause' });
    setData(next);
  };

  const handleUnfreeze = () => {
    if (!membership) return;
    const { data: next } = unfreezeMembership(data, membership.id);
    setData(next);
  };

  const handleTransfer = () => {
    if (!transferBranch || transferBranch === member.branch) return;
    const { data: next } = transferMember(data, member.id, transferBranch);
    setData(next);
  };

  const handlePtSession = () => {
    if (!membership) return;
    const { data: next } = consumePtSession(data, membership.id);
    setData(next);
  };

  const tabs = [
    { key: 'overview', label: 'Overview' },
    { key: 'membership', label: 'Membership' },
    { key: 'attendance', label: 'Attendance' },
    { key: 'payments', label: 'Payments' },
    { key: 'workout', label: 'Workout' },
    { key: 'diet', label: 'Diet' },
    { key: 'progress', label: 'Progress' },
    { key: 'appointments', label: 'Appointments' },
    { key: 'messages', label: 'Messages' },
  ];
  const openInvoice = (membershipId, paymentId = null) => setInvoiceSelection({ membershipId, paymentId });

  return (
    <div className="page-container">
      <button
        onClick={() => navigate('/members')}
        className="mb-4 inline-flex items-center gap-1 text-sm font-medium text-gray-500 hover:text-primary-600"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Members
      </button>

      <PageHeader
        title={member.fullName}
        subtitle={`${member.memberId} • Joined ${member.joiningDate}`}
      >
        {user?.role !== 'Member' && (
          <>
            <Button variant="secondary" onClick={() => navigate(`/members/${id}/edit`)} icon={Edit2}>
              Edit
            </Button>
            <Button variant="secondary" onClick={() => setReceiptOpen(true)} icon={FileText}>
              Receipt
            </Button>
            <Button onClick={() => setPaymentOpen(true)} icon={IndianRupee}>
              Collect Payment
            </Button>
            {membershipEnded && (
              <Button onClick={() => setSubscriptionMode('renew')} icon={RefreshCw}>
                Renew Membership
              </Button>
            )}
            {membership && !membership.refundedAt && membership.paidAmount > 0 && (
              <Button variant="danger" onClick={() => setSubscriptionMode('refund')} icon={RotateCcw}>
                Refund Balance
              </Button>
            )}
            {!todayRecord ? (
              <Button variant="secondary" onClick={handleCheckIn} icon={ClipboardCheck} disabled={membership?.frozen}>
                {membership?.frozen ? 'Membership paused' : 'Mark Check-in'}
              </Button>
            ) : (
              <Button variant="secondary" onClick={handleCheckOut} icon={ClipboardCheck}>
                Check-out
              </Button>
            )}
          </>
        )}
      </PageHeader>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <div className="flex flex-col items-center text-center">
              <Avatar name={member.fullName} src={member.photo} size="lg" className="mb-3" />
              <h2 className="text-lg font-bold text-gray-900">{member.fullName}</h2>
              <p className="text-sm text-gray-500">{member.memberId}</p>
              <div className="mt-3 flex gap-2">
                <Badge variant={statusVariant[member.status] || 'default'}>{member.status}</Badge>
                <Badge variant={membershipStatusVariant[membership?.status] || 'default'}>
                  {membership?.status || 'No Plan'}
                </Badge>
              </div>
              <div className="mt-6 w-full space-y-3 text-left text-sm">
                <div className="flex items-center gap-3 text-gray-600">
                  <Phone className="h-4 w-4" />
                  {member.mobile}
                </div>
                <div className="flex items-center gap-3 text-gray-600">
                  <Mail className="h-4 w-4" />
                  {member.email}
                </div>
                <div className="flex items-center gap-3 text-gray-600">
                  <MapPin className="h-4 w-4" />
                  {member.address}
                </div>
                <div className="flex items-center gap-3 text-gray-600">
                  <Calendar className="h-4 w-4" />
                  DOB: {member.dob}
                </div>
                <div className="flex items-center gap-3 text-gray-600">
                  <Activity className="h-4 w-4" />
                  Goal: {member.goal}
                </div>
              </div>
            </div>
          </Card>

          {/* Member App Access Credentials Card */}
          <Card className="border border-emerald-200 bg-gradient-to-br from-white via-emerald-50/20 to-teal-50/40">
            <div className="flex items-center justify-between pb-3 border-b border-emerald-100">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600 text-white shadow-xs">
                  <KeyRound className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-900">Member App Login</h3>
                  <p className="text-xs text-gray-500">Access key for mobile app</p>
                </div>
              </div>
              <Badge variant="success">Active</Badge>
            </div>

            <div className="mt-3.5 space-y-2.5 text-xs">
              <div className="flex items-center justify-between rounded-lg bg-white p-2.5 border border-gray-200/70 shadow-xs">
                <span className="text-gray-500 font-medium">Gym Center / Branch:</span>
                <span className="font-bold text-emerald-800">{member.branch || 'Star Fitness Center'}</span>
              </div>

              <div className="flex items-center justify-between rounded-lg bg-white p-2.5 border border-gray-200/70 shadow-xs">
                <span className="text-gray-500 font-medium">Username / Member ID:</span>
                <span className="font-mono font-bold text-gray-900">{member.memberId}</span>
              </div>

              <div className="flex items-center justify-between rounded-lg bg-emerald-500/10 p-2.5 border border-emerald-300/60">
                <span className="text-emerald-950 font-medium">Secret Code:</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-base font-extrabold tracking-widest text-emerald-700">
                    {member.secretCode || '749201'}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(member.secretCode || '749201');
                      alert(`Secret code copied: ${member.secretCode || '749201'}`);
                    }}
                    className="rounded p-1 text-emerald-700 hover:bg-emerald-200/70 transition"
                    title="Copy Secret Code"
                  >
                    <Copy className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              <p className="text-[11px] text-gray-500 pt-0.5 leading-relaxed">
                ℹ️ This 6-digit Secret Code links this member strictly to <strong>{member.branch || 'Star Fitness Center'}</strong>. Other gym centers' data is fully isolated.
              </p>

              <div className="flex flex-col gap-2 pt-2">
                <Button
                  size="sm"
                  variant="secondary"
                  className="w-full justify-center"
                  icon={ReceiptText}
                  onClick={() => setReceiptOpen(true)}
                >
                  View Invoice &amp; QR Code
                </Button>
                <a
                  href={`/member-app?user=${encodeURIComponent(member.memberId)}&code=${encodeURIComponent(member.secretCode || '749201')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-gray-200 bg-white py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition shadow-xs"
                >
                  <ExternalLink className="h-3.5 w-3.5 text-gray-500" />
                  <span>Preview Member App Login</span>
                </a>
              </div>
            </div>
          </Card>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card>
              <p className="text-xs text-gray-500">Total Visits</p>
              <p className="mt-1 text-xl font-bold text-gray-900">{totalVisits}</p>
            </Card>
            <Card>
              <p className="text-xs text-gray-500">Last 30 Days</p>
              <p className="mt-1 text-xl font-bold text-gray-900">{recentVisits}</p>
            </Card>
            <Card>
              <p className="text-xs text-gray-500">Total Paid</p>
              <p className="mt-1 text-xl font-bold text-gray-900">₹{totalPaid.toLocaleString('en-IN')}</p>
            </Card>
            <Card>
              <p className="text-xs text-gray-500">Pending</p>
              <p className="mt-1 text-xl font-bold text-gray-900">
                ₹{(membership?.pendingAmount || 0).toLocaleString('en-IN')}
              </p>
            </Card>
          </div>

          <Tabs tabs={tabs} active={activeTab} onChange={setActiveTab} />

          <Card>
            {activeTab === 'overview' && (
              <div className="space-y-4">
                <h3 className="text-base font-semibold text-gray-900">Member Overview</h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-lg border border-gray-100 bg-gray-50 p-3">
                    <p className="text-xs text-gray-500">Membership</p>
                    <p className="font-medium text-gray-900">{membership?.planName || '—'}</p>
                  </div>
                  <div className="rounded-lg border border-gray-100 bg-gray-50 p-3">
                    <p className="text-xs text-gray-500">Expires On</p>
                    <p className="font-medium text-gray-900">{membership?.expiryDate || '—'}</p>
                  </div>
                  <div className="rounded-lg border border-gray-100 bg-gray-50 p-3">
                    <p className="text-xs text-gray-500">Height / Weight</p>
                    <p className="font-medium text-gray-900">{member.height} cm / {member.weight} kg</p>
                  </div>
                  <div className="rounded-lg border border-gray-100 bg-gray-50 p-3">
                    <p className="text-xs text-gray-500">BMI / Blood Group</p>
                    <p className="font-medium text-gray-900">{member.bmi} / {member.bloodGroup}</p>
                  </div>
                  <div className="rounded-lg border border-primary-100 bg-primary-50 p-3">
                    <p className="text-xs text-primary-700">PT sessions remaining</p>
                    <p className="font-medium text-primary-900">{membership?.ptSessionsRemaining || 0}</p>
                    {membership?.ptSessionsRemaining > 0 && <Button className="mt-2" size="sm" variant="secondary" onClick={handlePtSession}>Use PT session</Button>}
                  </div>
                </div>
                <div className="grid gap-4 border-t border-gray-100 pt-4 md:grid-cols-2">
                  <div className="rounded-lg border border-amber-100 bg-amber-50 p-3">
                    <p className="text-sm font-semibold text-amber-900">Membership pause</p>
                    <p className="mt-1 text-xs text-amber-800">{membership?.frozen ? `Paused until ${membership.freezeEnd}` : 'Pause access for travel, injury or other approved reasons.'}</p>
                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      {membership?.frozen ? (
                        <Button size="sm" variant="secondary" onClick={handleUnfreeze}>Resume membership</Button>
                      ) : (
                        <>
                          <input type="number" min="1" max="365" value={freezeDays} onChange={(e) => setFreezeDays(e.target.value)} className="w-20 rounded-lg border border-gray-300 px-2 py-1.5 text-sm" aria-label="Pause days" />
                          <Button size="sm" onClick={handleFreeze}>Pause access</Button>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="rounded-lg border border-gray-100 bg-gray-50 p-3">
                    <p className="text-sm font-semibold text-gray-900">Branch transfer</p>
                    <p className="mt-1 text-xs text-gray-500">Current branch: {member.branch || '—'}</p>
                    <div className="mt-3 flex gap-2">
                      <select value={transferBranch || member.branch || ''} onChange={(e) => setTransferBranch(e.target.value)} className="min-w-0 flex-1 rounded-lg border border-gray-300 bg-white px-2 py-1.5 text-sm">
                        {(data.settings.branches || []).map((branch) => <option key={branch.id} value={branch.name}>{branch.name}</option>)}
                      </select>
                      <Button size="sm" variant="secondary" onClick={handleTransfer}>Transfer</Button>
                    </div>
                  </div>
                </div>
                <div className="border-t border-gray-100 pt-4">
                  <h4 className="text-sm font-semibold text-gray-900">KYC & declarations</h4>
                  <div className="mt-2 grid gap-3 text-sm sm:grid-cols-2">
                    <p><span className="text-gray-500">KYC:</span> {member.kycType ? `${member.kycType} • ${member.kycNumber || 'number not recorded'}` : 'Not provided'}</p>
                    <p><span className="text-gray-500">Waiver:</span> {member.waiverAccepted ? 'Accepted' : 'Pending'}</p>
                    <p className="sm:col-span-2"><span className="text-gray-500">Health declaration:</span> {member.healthDeclaration || 'Not provided'}</p>
                    {member.documents?.length > 0 && <p className="sm:col-span-2"><span className="text-gray-500">Documents:</span> {member.documents.map((document) => document.name).join(', ')}</p>}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'membership' && (
              <div className="space-y-4">
                <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                  <div>
                    <h3 className="text-base font-semibold text-gray-900">Membership portfolio</h3>
                    <p className="text-sm text-gray-500">Plans, billing status and invoices for this member.</p>
                  </div>
                  {membership && <Button size="sm" variant="secondary" icon={ReceiptText} onClick={() => openInvoice(membership.id)}>Latest invoice</Button>}
                </div>
                <div className="grid gap-3 sm:grid-cols-3">
                  <div className="rounded-lg border border-primary-100 bg-primary-50 p-3"><p className="text-xs text-primary-700">Plans enrolled</p><p className="mt-1 text-xl font-bold text-primary-900">{memberships.length}</p></div>
                  <div className="rounded-lg border border-emerald-100 bg-emerald-50 p-3"><p className="text-xs text-emerald-700">Total billed</p><p className="mt-1 text-xl font-bold text-emerald-900">₹{memberships.reduce((sum, item) => sum + Number(item.amount || 0), 0).toLocaleString('en-IN')}</p></div>
                  <div className="rounded-lg border border-amber-100 bg-amber-50 p-3"><p className="text-xs text-amber-700">Outstanding</p><p className="mt-1 text-xl font-bold text-amber-900">₹{memberships.reduce((sum, item) => sum + Number(item.pendingAmount || 0), 0).toLocaleString('en-IN')}</p></div>
                </div>
                <Table>
                  <Thead>
                    <Tr>
                      <Th>Plan</Th>
                      <Th>Start</Th>
                      <Th>Expiry</Th>
                      <Th>Amount</Th>
                      <Th>Paid</Th>
                      <Th>Pending</Th>
                      <Th>Status</Th>
                      <Th>Invoice</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {memberships.length > 0 ? memberships.map((item) => (
                      <Tr key={item.id}>
                        <Td><p className="font-medium text-gray-900">{item.planName}</p><p className="text-xs text-gray-500">{data.payments.filter((payment) => payment.invoiceNumber === item.invoiceNumber).length} transaction(s)</p></Td>
                        <Td>{item.startDate}</Td>
                        <Td>{item.expiryDate}</Td>
                        <Td>₹{Number(item.amount || 0).toLocaleString('en-IN')}</Td>
                        <Td>₹{Number(item.paidAmount || 0).toLocaleString('en-IN')}</Td>
                        <Td>₹{Number(item.pendingAmount || 0).toLocaleString('en-IN')}</Td>
                        <Td><Badge variant={membershipStatusVariant[item.status]}>{item.status}</Badge></Td>
                        <Td><Button size="sm" variant="ghost" icon={ReceiptText} onClick={() => openInvoice(item.id)}>View</Button></Td>
                      </Tr>
                    )) : (
                      <Tr>
                        <Td colSpan={8} className="text-center text-gray-500">
                          No active membership.
                        </Td>
                      </Tr>
                    )}
                  </Tbody>
                </Table>
              </div>
            )}

            {activeTab === 'attendance' && (
              <div className="grid gap-6 lg:grid-cols-3">
                <Card className="lg:col-span-1">
                  <h4 className="mb-1 text-sm font-semibold text-gray-900">Monthly Attendance</h4>
                  <p className="mb-4 text-xs text-gray-500">
                    {monthlyAttendance.daysInMonth} days in current month
                  </p>
                  <DonutChart
                    data={[
                      { name: 'Present', value: monthlyAttendance.present },
                      { name: 'Absent', value: monthlyAttendance.absent },
                    ]}
                  />
                  <div className="mt-4 grid grid-cols-2 gap-3 text-center text-sm">
                    <div className="rounded-lg bg-emerald-50 p-2">
                      <p className="font-semibold text-emerald-700">{monthlyAttendance.present}</p>
                      <p className="text-xs text-emerald-600">Present</p>
                    </div>
                    <div className="rounded-lg bg-red-50 p-2">
                      <p className="font-semibold text-red-700">{monthlyAttendance.absent}</p>
                      <p className="text-xs text-red-600">Absent</p>
                    </div>
                  </div>
                </Card>
                <div className="lg:col-span-2">
                  <h3 className="mb-3 text-base font-semibold text-gray-900">Attendance History</h3>
                  <Table>
                    <Thead>
                      <Tr>
                        <Th>Date</Th>
                        <Th>Check In</Th>
                        <Th>Check Out</Th>
                        <Th>Status</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {attendance.slice(0, 15).map((a) => (
                        <Tr key={a.id}>
                          <Td>{a.date}</Td>
                          <Td>{new Date(a.checkIn).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</Td>
                          <Td>
                            {a.checkOut
                              ? new Date(a.checkOut).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
                              : '—'}
                          </Td>
                          <Td>
                            <Badge variant="success">{a.status}</Badge>
                          </Td>
                        </Tr>
                      ))}
                      {attendance.length === 0 && (
                        <Tr>
                          <Td colSpan={4} className="text-center text-gray-500">No attendance records.</Td>
                        </Tr>
                      )}
                    </Tbody>
                  </Table>
                </div>
              </div>
            )}

            {activeTab === 'payments' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div><h3 className="text-base font-semibold text-gray-900">Payment ledger</h3><p className="text-sm text-gray-500">Every collection, invoice and payment method in one place.</p></div>
                  <Button size="sm" icon={IndianRupee} onClick={() => setPaymentOpen(true)}>Collect payment</Button>
                </div>
                <div className="grid gap-3 sm:grid-cols-3">
                  <div className="rounded-lg border border-gray-100 bg-gray-50 p-3"><p className="text-xs text-gray-500">Transactions</p><p className="mt-1 text-xl font-bold text-gray-900">{payments.length}</p></div>
                  <div className="rounded-lg border border-emerald-100 bg-emerald-50 p-3"><p className="text-xs text-emerald-700">Collected</p><p className="mt-1 text-xl font-bold text-emerald-900">₹{totalPaid.toLocaleString('en-IN')}</p></div>
                  <div className="rounded-lg border border-primary-100 bg-primary-50 p-3"><p className="text-xs text-primary-700">Payment status</p><p className="mt-1 text-xl font-bold text-primary-900">{payments.filter((payment) => payment.status === 'success').length} successful</p></div>
                </div>
                <Table>
                  <Thead>
                    <Tr>
                      <Th>Date</Th>
                      <Th>Amount</Th>
                      <Th>Method</Th>
                      <Th>Invoice</Th>
                      <Th>Status</Th>
                      <Th>Action</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {payments.map((p) => (
                      <Tr key={p.id}>
                        <Td>{p.date}</Td>
                        <Td>₹{p.amount.toLocaleString('en-IN')}</Td>
                        <Td>{p.method}</Td>
                        <Td><span className="font-medium text-gray-800">{p.invoiceNumber || '—'}</span>{p.discount > 0 && <p className="text-xs text-emerald-600">Discount ₹{p.discount.toLocaleString('en-IN')}</p>}</Td>
                        <Td><Badge variant="success">{p.status}</Badge></Td>
                        <Td><Button size="sm" variant="ghost" icon={ReceiptText} onClick={() => openInvoice(p.membershipId, p.id)}>Invoice</Button></Td>
                      </Tr>
                    ))}
                    {payments.length === 0 && (
                      <Tr>
                        <Td colSpan={6} className="text-center text-gray-500">No payments yet.</Td>
                      </Tr>
                    )}
                  </Tbody>
                </Table>
              </div>
            )}

            {activeTab === 'workout' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between"><div><h3 className="text-base font-semibold text-gray-900">Assigned workout plans</h3><p className="text-sm text-gray-500">Plans currently assigned to {member.fullName}.</p></div><Button size="sm" variant="secondary" icon={Dumbbell} onClick={() => navigate('/workouts')}>Manage plans</Button></div>
                {memberWorkouts.length ? memberWorkouts.map((workout) => <div key={workout.id} className="rounded-lg border border-gray-200 p-4"><div className="flex items-start justify-between gap-3"><div><h4 className="font-semibold text-gray-900">{workout.name}</h4><p className="text-sm text-gray-500">{workout.description}</p></div><Badge variant="success">Assigned</Badge></div><div className="mt-3 grid gap-2 sm:grid-cols-2">{(workout.exercises || []).slice(0, 4).map((exercise, index) => <div key={index} className="rounded-md bg-gray-50 px-3 py-2 text-sm"><p className="font-medium text-gray-800">{exercise.name}</p><p className="text-xs text-gray-500">{exercise.sets} sets × {exercise.reps} · Rest {exercise.rest}</p></div>)}</div></div>) : <EmptyTab icon={Dumbbell} title="No workout plan assigned" description="Assign a structured workout plan from the Workouts module." action="Open Workouts" onClick={() => navigate('/workouts')} />}
              </div>
            )}
            {activeTab === 'diet' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between"><div><h3 className="text-base font-semibold text-gray-900">Assigned nutrition plans</h3><p className="text-sm text-gray-500">Nutrition plans currently assigned to this member.</p></div><Button size="sm" variant="secondary" icon={Apple} onClick={() => navigate('/diets')}>Manage diets</Button></div>
                {memberDiets.length ? memberDiets.map((diet) => <div key={diet.id} className="rounded-lg border border-gray-200 p-4"><div className="flex items-start justify-between gap-3"><div><h4 className="font-semibold text-gray-900">{diet.name}</h4><p className="text-sm text-gray-500">{diet.description}</p></div><Badge variant="success">Assigned</Badge></div><div className="mt-3 space-y-2">{(diet.meals || []).slice(0, 4).map((meal, index) => <div key={index} className="rounded-md bg-gray-50 px-3 py-2 text-sm"><div className="flex justify-between"><span className="font-medium text-gray-800">{meal.type}</span><span className="text-xs text-gray-500">{meal.calories} kcal</span></div><p className="text-xs text-gray-500">{meal.items}</p></div>)}</div></div>) : <EmptyTab icon={Apple} title="No diet plan assigned" description="Assign a nutrition plan from the Diets module." action="Open Diets" onClick={() => navigate('/diets')} />}
              </div>
            )}
            {activeTab === 'progress' && (
              <div className="space-y-4"><div><h3 className="text-base font-semibold text-gray-900">Progress snapshot</h3><p className="text-sm text-gray-500">Current health and engagement indicators.</p></div><div className="grid gap-3 sm:grid-cols-3"><div className="rounded-lg border border-gray-100 bg-gray-50 p-4"><p className="text-xs text-gray-500">BMI</p><p className="mt-1 text-xl font-bold text-gray-900">{member.bmi || '—'}</p></div><div className="rounded-lg border border-gray-100 bg-gray-50 p-4"><p className="text-xs text-gray-500">Monthly visits</p><p className="mt-1 text-xl font-bold text-gray-900">{monthlyAttendance.present}</p></div><div className="rounded-lg border border-gray-100 bg-gray-50 p-4"><p className="text-xs text-gray-500">Fitness goal</p><p className="mt-1 font-semibold text-gray-900">{member.goal || '—'}</p></div></div><div className="rounded-lg border border-primary-100 bg-primary-50 p-4"><div className="flex items-center gap-2 text-primary-800"><TrendingUp className="h-5 w-5" /><span className="font-semibold">Next review recommended</span></div><p className="mt-1 text-sm text-primary-700">Track weight, measurements and progress photos during the next trainer review.</p></div></div>
            )}
            {activeTab === 'appointments' && (
              <div className="space-y-4"><div className="flex items-center justify-between"><div><h3 className="text-base font-semibold text-gray-900">Appointments</h3><p className="text-sm text-gray-500">PT, trial and consultation schedule for this member.</p></div><Button size="sm" variant="secondary" icon={CalendarDays} onClick={() => navigate('/operations')}>Manage schedule</Button></div>{memberAppointments.length ? <Table><Thead><Tr><Th>Date</Th><Th>Type</Th><Th>Trainer</Th><Th>Status</Th></Tr></Thead><Tbody>{memberAppointments.map((item) => <Tr key={item.id}><Td>{item.date || '—'} {item.time || ''}</Td><Td>{item.type || item.title || 'Appointment'}</Td><Td>{item.trainerName || item.trainer || '—'}</Td><Td><Badge variant={item.status === 'completed' ? 'success' : item.status === 'cancelled' ? 'danger' : 'warning'}>{item.status || 'scheduled'}</Badge></Td></Tr>)}</Tbody></Table> : <EmptyTab icon={CalendarDays} title="No appointments scheduled" description="Book a PT session, trial or consultation from Operations." action="Open Operations" onClick={() => navigate('/operations')} />}</div>
            )}
            {activeTab === 'messages' && <EmptyTab icon={MessageCircle} title="Communication history" description="Member conversations and delivery status will appear here when messaging records are linked." action="Open Messaging" onClick={() => navigate('/messaging')} />}
          </Card>
        </div>
      </div>

      <PaymentModal open={paymentOpen} onClose={() => setPaymentOpen(false)} member={member} />
      <SubscriptionModal
        open={Boolean(subscriptionMode)}
        mode={subscriptionMode}
        member={member}
        membership={membership}
        onClose={() => setSubscriptionMode(null)}
      />
      {receiptOpen && (
        <ReceiptModal member={member} onClose={() => setReceiptOpen(false)} />
      )}
      {invoiceSelection && <ReceiptModal member={member} membershipId={invoiceSelection.membershipId} paymentId={invoiceSelection.paymentId} onClose={() => setInvoiceSelection(null)} />}
    </div>
  );
}
