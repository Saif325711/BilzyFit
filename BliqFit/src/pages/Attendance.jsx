import { useState, useMemo, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  QrCode, Plus, ScanLine, CheckCircle, XCircle,
  X, ChevronDown, RotateCcw, Download, Printer,
  TrendingUp, TrendingDown, Clock, Users,
  AlertTriangle, ArrowRight, Search, UserCheck,
  CalendarDays, Activity, Sun, Moon,
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
} from 'recharts';
import { useData } from '../context/DataContext';
import { checkoutAttendance, recordAttendance, manualCheckIn } from '../data/services';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { Table, Thead, Th, Tbody, Tr, Td } from '../components/ui/Table';
import Badge from '../components/ui/Badge';
import Avatar from '../components/ui/Avatar';
import Modal from '../components/ui/Modal';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';

// ─── Helpers ────────────────────────────────────────────────────────────────

const getShift = (checkInIso) => {
  if (!checkInIso) return '1st Shift';
  const h = new Date(checkInIso).getHours();
  return h < 12 ? '1st Shift' : '2nd Shift';
};

const fmtTime = (iso) =>
  iso
    ? new Date(iso).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
    : '—';

const fmtDate = (d) => d.toISOString().split('T')[0];

const getDuration = (checkIn, checkOut) => {
  const end = checkOut ? new Date(checkOut) : new Date();
  const mins = Math.max(0, Math.floor((end - new Date(checkIn)) / 60000));
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  if (h === 0) return `${m}m`;
  return m === 0 ? `${h}h` : `${h}h ${m}m`;
};

const getElapsed = (checkIn) => getDuration(checkIn, null);

const dateRange = (period, customDate) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (period === 'today') {
    return { from: fmtDate(today), to: fmtDate(today) };
  }
  if (period === 'yesterday') {
    const y = new Date(today);
    y.setDate(y.getDate() - 1);
    return { from: fmtDate(y), to: fmtDate(y) };
  }
  if (period === 'week') {
    const from = new Date(today);
    from.setDate(from.getDate() - 6);
    return { from: fmtDate(from), to: fmtDate(today) };
  }
  if (period === 'month') {
    const from = new Date(today);
    from.setDate(1);
    return { from: fmtDate(from), to: fmtDate(today) };
  }
  if (period === 'custom' && customDate) {
    return { from: customDate, to: customDate };
  }
  return { from: fmtDate(today), to: fmtDate(today) };
};

const getAttendanceStatus = (record, lateThresholdHour = 19) => {
  if (!record.checkOut) {
    const checkInHour = new Date(record.checkIn).getHours();
    if (checkInHour >= lateThresholdHour) return 'Late';
    return 'Inside';
  }
  const checkInHour = new Date(record.checkIn).getHours();
  if (checkInHour >= lateThresholdHour) return 'Late';
  return 'Present';
};

const statusBadge = (status) => {
  const map = {
    Present: { variant: 'success', dot: 'bg-green-500' },
    Inside:  { variant: 'info',    dot: 'bg-blue-500' },
    Late:    { variant: 'warning', dot: 'bg-amber-500' },
    'Checked Out': { variant: 'default', dot: 'bg-gray-400' },
    Invalid: { variant: 'danger',  dot: 'bg-red-500' },
  };
  return map[status] || map['Present'];
};

// ─── Mini inline components ──────────────────────────────────────────────────

function FilterSelect({ value, onChange, options, placeholder }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="h-9 rounded-lg border border-gray-300 bg-white px-2 py-1.5 text-sm text-gray-700 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200"
    >
      <option value="">{placeholder}</option>
      {options.map((o) => (
        <option key={o.value} value={o.value}>{o.label}</option>
      ))}
    </select>
  );
}

function StatCard({ label, value, sub, subIcon: SubIcon, subUp }) {
  return (
    <Card className="flex flex-col gap-1">
      <p className="text-xs font-medium text-gray-500">{label}</p>
      <p className="text-2xl font-bold text-gray-900 leading-tight">{value}</p>
      {sub && (
        <p className="flex items-center gap-1 text-xs text-gray-500 mt-0.5">
          {SubIcon && (
            <SubIcon
              className={`h-3.5 w-3.5 ${subUp === true ? 'text-green-600' : subUp === false ? 'text-red-500' : 'text-gray-400'}`}
            />
          )}
          {sub}
        </p>
      )}
    </Card>
  );
}

// ─── Attendance Details Drawer ────────────────────────────────────────────────

function AttendanceDrawer({ record, allRecords, member, membership, onClose }) {
  const navigate = useNavigate();
  if (!record || !member) return null;

  const memberRecords = allRecords
    .filter((r) => r.memberId === member.id)
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const thisMonthVisits = memberRecords.filter(
    (r) => new Date(r.date) >= monthStart
  ).length;

  const completedRecords = memberRecords.filter((r) => r.checkOut);
  const avgDuration =
    completedRecords.length > 0
      ? Math.round(
          completedRecords.reduce(
            (sum, r) =>
              sum +
              Math.floor(
                (new Date(r.checkOut) - new Date(r.checkIn)) / 60000
              ),
            0
          ) / completedRecords.length
        )
      : 0;
  const avgDurStr =
    avgDuration > 0
      ? `${Math.floor(avgDuration / 60)}h ${avgDuration % 60}m`
      : '—';

  const rate =
    daysInMonth > 0 ? Math.round((thisMonthVisits / daysInMonth) * 100) : 0;

  const recentFive = memberRecords.slice(0, 5);

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-gray-900/20"
        onClick={onClose}
      />
      <aside className="fixed right-0 top-0 z-50 flex h-full w-80 flex-col border-l border-gray-200 bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
          <h3 className="text-sm font-semibold text-gray-900">Attendance Details</h3>
          <button
            onClick={onClose}
            className="rounded-md p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-5">
          {/* Member info */}
          <div className="flex items-center gap-3">
            <Avatar name={member.fullName} size="lg" />
            <div>
              <p className="font-semibold text-gray-900">{member.fullName}</p>
              <p className="text-xs text-gray-500">{member.memberId}</p>
              <Badge
                variant={
                  membership?.status === 'active'
                    ? 'success'
                    : membership?.status === 'expiring'
                    ? 'warning'
                    : 'danger'
                }
                className="mt-1"
              >
                {membership?.planName || 'No Plan'}
              </Badge>
            </div>
          </div>

          {/* Current visit */}
          <div className="rounded-lg border border-gray-100 bg-gray-50 p-3 space-y-1.5">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">This Visit</p>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">Shift</span>
              <span
                className={`inline-flex items-center gap-1 rounded px-2 py-0.5 text-xs font-medium ${
                  (record.shift || getShift(record.checkIn)) === '1st Shift'
                    ? 'border border-amber-200 bg-amber-50 text-amber-800'
                    : 'border border-indigo-200 bg-indigo-50 text-indigo-800'
                }`}
              >
                {(record.shift || getShift(record.checkIn)) === '1st Shift' ? (
                  <>
                    <Sun className="h-3 w-3 text-amber-600" />
                    1st Shift (Morning)
                  </>
                ) : (
                  <>
                    <Moon className="h-3 w-3 text-indigo-600" />
                    2nd Shift (Evening)
                  </>
                )}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Check In</span>
              <span className="font-medium text-gray-900">{fmtTime(record.checkIn)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Check Out</span>
              <span className="font-medium text-gray-900">{fmtTime(record.checkOut)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Duration</span>
              <span className="font-medium text-gray-900">
                {record.checkOut ? getDuration(record.checkIn, record.checkOut) : 'Currently inside'}
              </span>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="rounded-lg border border-gray-100 bg-gray-50 p-2">
              <p className="text-base font-bold text-gray-900">{rate}%</p>
              <p className="text-xs text-gray-500 mt-0.5">Rate</p>
            </div>
            <div className="rounded-lg border border-gray-100 bg-gray-50 p-2">
              <p className="text-base font-bold text-gray-900">{thisMonthVisits}</p>
              <p className="text-xs text-gray-500 mt-0.5">This month</p>
            </div>
            <div className="rounded-lg border border-gray-100 bg-gray-50 p-2">
              <p className="text-base font-bold text-gray-900">{avgDurStr}</p>
              <p className="text-xs text-gray-500 mt-0.5">Avg dur.</p>
            </div>
          </div>

          {/* Recent attendance */}
          <div>
            <p className="mb-2 text-xs font-medium uppercase tracking-wide text-gray-500">
              Recent Attendance
            </p>
            {recentFive.length === 0 ? (
              <p className="text-sm text-gray-400">No history yet.</p>
            ) : (
              <div className="space-y-1">
                {recentFive.map((r) => (
                  <div
                    key={r.id}
                    className="flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50 px-3 py-2"
                  >
                    <span className="text-xs font-medium text-gray-700">
                      {new Date(r.date).toLocaleDateString('en-IN', {
                        day: '2-digit',
                        month: 'short',
                      })}
                    </span>
                    <span className="text-xs text-gray-500">
                      {fmtTime(r.checkIn)}
                      {r.checkOut ? ` → ${fmtTime(r.checkOut)}` : ' → now'}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-100 px-4 py-3">
          <Button
            variant="secondary"
            fullWidth
            icon={ArrowRight}
            onClick={() => navigate(`/members/${member.id}`)}
          >
            View Full Profile
          </Button>
        </div>
      </aside>
    </>
  );
}

// ─── QR Check-in Modal ───────────────────────────────────────────────────────

function QRModal({ open, onClose, data, setData }) {
  const [scanning, setScanning] = useState(false);
  const [memberSearch, setMemberSearch] = useState('');
  const [result, setResult] = useState(null);

  const today = fmtDate(new Date());
  const activeMembers = data.members.filter((m) => m.status === 'active');
  const searchResults = memberSearch.length >= 2
    ? activeMembers.filter((m) =>
        m.fullName.toLowerCase().includes(memberSearch.toLowerCase()) ||
        m.memberId.toLowerCase().includes(memberSearch.toLowerCase())
      ).slice(0, 5)
    : [];

  const doCheckIn = useCallback(
    (member) => {
      const membership = data.memberships.find((m) => m.memberId === member.id);
      const expired = membership?.expiryDate < today;
      const alreadyIn = data.attendance.some(
        (a) => a.memberId === member.id && a.date === today && !a.checkOut
      );
      if (alreadyIn) {
        setResult({ type: 'error', member, message: 'Member is already checked in.' });
        return;
      }
      if (expired) {
        setResult({ type: 'expired', member, membership, message: 'Membership expired. Please renew before checking in.' });
        return;
      }
      const checkInTime = new Date().toISOString();
      const shift = getShift(checkInTime);
      const { data: next } = recordAttendance(data, member.id, checkInTime, 'QR', shift);
      setData(next);
      setResult({
        type: 'success',
        member,
        membership,
        message: 'Check-in successful!',
      });
      setMemberSearch('');
    },
    [data, setData, today]
  );

  const simulateScan = () => {
    setScanning(true);
    setResult(null);
    setTimeout(() => {
      const member = activeMembers[Math.floor(Math.random() * activeMembers.length)];
      doCheckIn(member);
      setScanning(false);
    }, 1200);
  };

  const handleClose = () => {
    setResult(null);
    setMemberSearch('');
    setScanning(false);
    onClose();
  };

  return (
    <Modal open={open} onClose={handleClose} title="QR Check-in" size="sm">
      {/* Scanner area */}
      <div className="relative mx-auto flex h-52 w-52 items-center justify-center rounded-xl border-2 border-dashed border-gray-200 bg-gray-50">
        {scanning ? (
          <div className="absolute inset-0 flex animate-pulse items-center justify-center rounded-xl bg-primary-50">
            <ScanLine className="h-10 w-10 text-primary-600" />
          </div>
        ) : (
          <ScanLine className="h-14 w-14 text-gray-300" />
        )}
        <div className="absolute inset-x-6 top-1/2 h-px -translate-y-1/2 bg-primary-400/60" />
      </div>

      <Button
        onClick={simulateScan}
        disabled={scanning}
        icon={ScanLine}
        className="mt-4 w-full"
      >
        {scanning ? 'Scanning…' : 'Simulate Scan'}
      </Button>

      {/* Manual search */}
      <div className="mt-4 border-t border-gray-100 pt-4">
        <p className="mb-2 text-xs font-medium text-gray-500">Or search member manually</p>
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={memberSearch}
            onChange={(e) => {
              setMemberSearch(e.target.value);
              setResult(null);
            }}
            placeholder="Name or member ID…"
            className="w-full rounded-lg border border-gray-300 bg-white py-2 pl-9 pr-3 text-sm text-gray-900 placeholder-gray-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200"
          />
          {searchResults.length > 0 && (
            <div className="absolute left-0 right-0 top-full z-10 mt-1 rounded-lg border border-gray-200 bg-white shadow-lg">
              {searchResults.map((m) => (
                <button
                  key={m.id}
                  onClick={() => doCheckIn(m)}
                  className="flex w-full items-center gap-3 px-3 py-2 text-left text-sm hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg"
                >
                  <Avatar name={m.fullName} size="sm" />
                  <div>
                    <p className="font-medium text-gray-900">{m.fullName}</p>
                    <p className="text-xs text-gray-500">{m.memberId}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Result */}
      {result && (
        <div
          className={`mt-4 rounded-lg border p-3 ${
            result.type === 'success'
              ? 'border-green-200 bg-green-50'
              : 'border-red-200 bg-red-50'
          }`}
        >
          <div className="flex items-start gap-3">
            {result.type === 'success' ? (
              <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-green-600" />
            ) : (
              <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />
            )}
            <div className="flex-1 min-w-0">
              <p
                className={`font-medium text-sm ${
                  result.type === 'success' ? 'text-green-800' : 'text-red-800'
                }`}
              >
                {result.message}
              </p>
              <p className="mt-0.5 text-sm text-gray-700">
                {result.member.fullName}
                <span className="ml-2 text-xs text-gray-500">{result.member.memberId}</span>
              </p>
              {result.type === 'success' && result.membership && (
                <p className="mt-0.5 text-xs text-gray-500">
                  Membership: {result.membership.planName} · Expires{' '}
                  {new Date(result.membership.expiryDate).toLocaleDateString('en-IN', {
                    day: 'numeric', month: 'long', year: 'numeric',
                  })}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
}

// ─── Manual Check-in Modal ───────────────────────────────────────────────────

function ManualCheckInModal({ open, onClose, data, setData }) {
  const [search, setSearch] = useState('');
  const [selectedMember, setSelectedMember] = useState(null);
  const [checkInTime, setCheckInTime] = useState(
    () => new Date().toISOString().slice(0, 16)
  );
  const [shift, setShift] = useState(() => {
    const h = new Date().getHours();
    return h < 12 ? '1st Shift' : '2nd Shift';
  });
  const [method, setMethod] = useState('Manual');
  const [notes, setNotes] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const members = data.members.filter((m) => m.status === 'active');
  const searchResults =
    search.length >= 2 && !selectedMember
      ? members
          .filter(
            (m) =>
              m.fullName.toLowerCase().includes(search.toLowerCase()) ||
              m.memberId.toLowerCase().includes(search.toLowerCase())
          )
          .slice(0, 6)
      : [];

  const handleTimeChange = (val) => {
    setCheckInTime(val);
    if (val) {
      const h = new Date(val).getHours();
      setShift(h < 12 ? '1st Shift' : '2nd Shift');
    }
  };

  const handleSubmit = () => {
    if (!selectedMember) return;
    const today = fmtDate(new Date());
    const alreadyIn = data.attendance.some(
      (a) => a.memberId === selectedMember.id && a.date === today && !a.checkOut
    );
    if (alreadyIn) {
      setSubmitted('already');
      return;
    }
    const { data: next } = manualCheckIn(data, selectedMember.id, checkInTime, method, notes, shift);
    setData(next);
    setSubmitted('ok');
    setTimeout(() => {
      handleClose();
    }, 1200);
  };

  const handleClose = () => {
    setSearch('');
    setSelectedMember(null);
    setCheckInTime(new Date().toISOString().slice(0, 16));
    setShift(new Date().getHours() < 12 ? '1st Shift' : '2nd Shift');
    setMethod('Manual');
    setNotes('');
    setSubmitted(false);
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Manual Check-in"
      size="sm"
      footer={
        submitted === 'ok' ? null : (
          <>
            <Button variant="secondary" onClick={handleClose}>Cancel</Button>
            <Button onClick={handleSubmit} disabled={!selectedMember} icon={UserCheck}>
              Check In
            </Button>
          </>
        )
      }
    >
      {submitted === 'ok' ? (
        <div className="flex flex-col items-center gap-2 py-4">
          <CheckCircle className="h-10 w-10 text-green-500" />
          <p className="font-semibold text-gray-900">Checked in successfully</p>
          <p className="text-sm text-gray-500">{selectedMember?.fullName}</p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Member search */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">Member</label>
            {selectedMember ? (
              <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 px-3 py-2">
                <div className="flex items-center gap-2">
                  <Avatar name={selectedMember.fullName} size="sm" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{selectedMember.fullName}</p>
                    <p className="text-xs text-gray-500">{selectedMember.memberId}</p>
                  </div>
                </div>
                <button
                  onClick={() => { setSelectedMember(null); setSearch(''); }}
                  className="rounded p-1 text-gray-400 hover:bg-gray-200"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            ) : (
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by name or member ID…"
                  className="w-full rounded-lg border border-gray-300 bg-white py-2 pl-9 pr-3 text-sm text-gray-900 placeholder-gray-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200"
                />
                {searchResults.length > 0 && (
                  <div className="absolute left-0 right-0 top-full z-10 mt-1 max-h-48 overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-lg">
                    {searchResults.map((m) => (
                      <button
                        key={m.id}
                        onClick={() => { setSelectedMember(m); setSearch(m.fullName); }}
                        className="flex w-full items-center gap-3 px-3 py-2 text-left text-sm hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg"
                      >
                        <Avatar name={m.fullName} size="sm" />
                        <div>
                          <p className="font-medium text-gray-900">{m.fullName}</p>
                          <p className="text-xs text-gray-500">{m.memberId}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {submitted === 'already' && (
            <p className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">
              This member is already checked in today.
            </p>
          )}

          {/* Check-in time */}
          <Input
            label="Check-in Time"
            type="datetime-local"
            value={checkInTime}
            onChange={(e) => handleTimeChange(e.target.value)}
          />

          {/* Shift */}
          <Select
            label="Shift"
            value={shift}
            onChange={(e) => setShift(e.target.value)}
            options={[
              { value: '1st Shift', label: '🌅 1st Shift (Morning · 6 AM - 12 PM)' },
              { value: '2nd Shift', label: '🌆 2nd Shift (Evening · 12 PM - 10 PM)' },
            ]}
          />

          {/* Method */}
          <Select
            label="Check-in Method"
            value={method}
            onChange={(e) => setMethod(e.target.value)}
            options={[
              { value: 'Manual', label: 'Manual' },
              { value: 'QR', label: 'QR Code' },
              { value: 'RFID', label: 'RFID' },
              { value: 'Biometric', label: 'Biometric' },
              { value: 'Member App', label: 'Member App' },
            ]}
          />

          {/* Notes */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Notes <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Late arrival, trial visit…"
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200"
            />
          </div>
        </div>
      )}
    </Modal>
  );
}

// ─── Currently Inside Panel ──────────────────────────────────────────────────

function CurrentlyInsidePanel({ insideRecords, onSelect }) {
  return (
    <Card className="flex flex-col" padding="none">
      <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 animate-pulse rounded-full bg-green-500" />
          <h3 className="text-sm font-semibold text-gray-900">Currently Inside</h3>
        </div>
        <span className="rounded-full bg-primary-50 px-2 py-0.5 text-xs font-semibold text-primary-700">
          {insideRecords.length}
        </span>
      </div>

      <div className="flex-1 overflow-y-auto">
        {insideRecords.length === 0 ? (
          <div className="flex flex-col items-center justify-center px-4 py-8 text-center">
            <Users className="mb-2 h-8 w-8 text-gray-200" />
            <p className="text-sm text-gray-400">No members currently inside</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {insideRecords.map((r) => {
              const shift = r.shift || getShift(r.checkIn);
              return (
                <button
                  key={r.id}
                  onClick={() => onSelect(r)}
                  className="flex w-full items-center justify-between px-4 py-2.5 text-left hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Avatar name={r.member?.fullName} size="sm" />
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-gray-900">
                        {r.member?.fullName}
                      </p>
                      <p className="flex items-center gap-1 text-[11px] text-gray-500">
                        {shift === '1st Shift' ? (
                          <span className="font-medium text-amber-700">🌅 1st Shift</span>
                        ) : (
                          <span className="font-medium text-indigo-700">🌆 2nd Shift</span>
                        )}
                      </p>
                    </div>
                  </div>
                  <span className="ml-2 shrink-0 text-xs tabular-nums text-gray-400">
                    {getElapsed(r.checkIn)}
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {insideRecords.length > 0 && (
        <div className="border-t border-gray-100 px-4 py-2.5">
          <p className="text-xs text-gray-500">
            {insideRecords.length} member{insideRecords.length !== 1 ? 's' : ''} inside
          </p>
        </div>
      )}
    </Card>
  );
}

// ─── Weekly Chart ─────────────────────────────────────────────────────────────

function WeeklyChartTooltip({ active, payload, label }) {
  if (active && payload?.length) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs shadow-md">
        <p className="font-semibold text-gray-900">{label}</p>
        <p className="text-gray-600">{payload[0].value} check-ins</p>
      </div>
    );
  }
  return null;
}

function WeeklyChart({ attendance }) {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const now = new Date();
  const data = days.map((day, i) => {
    const offset = (now.getDay() + 6 - i) % 7;
    const d = new Date(now);
    d.setDate(d.getDate() - offset);
    const ds = fmtDate(d);
    const count = attendance.filter((a) => a.date === ds).length;
    return { day, count };
  });
  // reorder to start from Monday of current week
  const sorted = [...data].sort((a, b) => days.indexOf(a.day) - days.indexOf(b.day));

  return (
    <Card>
      <h3 className="mb-4 text-sm font-semibold text-gray-900">Weekly Attendance</h3>
      <ResponsiveContainer width="100%" height={160}>
        <BarChart data={sorted} barSize={28} margin={{ top: 0, right: 0, bottom: 0, left: -20 }}>
          <XAxis
            dataKey="day"
            tick={{ fontSize: 12, fill: '#6b7280' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 11, fill: '#9ca3af' }}
            axisLine={false}
            tickLine={false}
            allowDecimals={false}
          />
          <Tooltip content={<WeeklyChartTooltip />} cursor={{ fill: '#f3f4f6' }} />
          <Bar dataKey="count" radius={[4, 4, 0, 0]}>
            {sorted.map((entry, index) => {
              const todayDayIdx = (new Date().getDay() + 6) % 7;
              return (
                <Cell
                  key={`cell-${index}`}
                  fill={index === todayDayIdx ? '#059669' : '#a7f3d0'}
                />
              );
            })}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <p className="mt-1 text-right text-xs text-gray-400">Current week · Today highlighted</p>
    </Card>
  );
}

// ─── Peak Hours Panel ─────────────────────────────────────────────────────────

function PeakHoursPanel({ attendance }) {
  const slots = [6, 7, 8, 9, 10, 17, 18, 19, 20, 21];
  const labels = {
    6: '6 AM', 7: '7 AM', 8: '8 AM', 9: '9 AM', 10: '10 AM',
    17: '5 PM', 18: '6 PM', 19: '7 PM', 20: '8 PM', 21: '9 PM',
  };

  const counts = slots.map((h) => ({
    hour: h,
    label: labels[h],
    count: attendance.filter((a) => {
      const ci = new Date(a.checkIn);
      return ci.getHours() === h;
    }).length,
  }));

  const max = Math.max(...counts.map((c) => c.count), 1);
  const peak = counts.reduce((best, c) => (c.count > best.count ? c : best), counts[0]);

  return (
    <Card>
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-900">Peak Hours</h3>
        <span className="rounded-full bg-primary-50 px-2 py-0.5 text-xs font-semibold text-primary-700">
          Peak: {peak.label}
        </span>
      </div>
      <div className="space-y-1.5">
        {counts.map((slot) => (
          <div key={slot.hour} className="flex items-center gap-2">
            <span className="w-12 shrink-0 text-right text-xs text-gray-500">
              {slot.label}
            </span>
            <div className="flex-1 rounded-full bg-gray-100 h-2.5">
              <div
                className={`h-2.5 rounded-full transition-all ${
                  slot.hour === peak.hour ? 'bg-primary-600' : 'bg-primary-300'
                }`}
                style={{ width: `${(slot.count / max) * 100}%`, minWidth: slot.count > 0 ? '4px' : '0' }}
              />
            </div>
            <span className="w-5 shrink-0 text-xs tabular-nums text-gray-400">
              {slot.count}
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
}

// ─── Members Needing Attention ────────────────────────────────────────────────

function NeedsAttentionPanel({ members, attendance }) {
  const navigate = useNavigate();
  const today = new Date();

  const inactive = members
    .filter((m) => m.status === 'active')
    .map((m) => {
      const records = attendance.filter((a) => a.memberId === m.id);
      const last = records.length
        ? records.sort((a, b) => new Date(b.date) - new Date(a.date))[0]
        : null;
      const daysSince = last
        ? Math.floor((today - new Date(last.date)) / 86400000)
        : 999;
      return { ...m, daysSince, lastDate: last?.date };
    })
    .filter((m) => m.daysSince >= 7)
    .sort((a, b) => b.daysSince - a.daysSince)
    .slice(0, 5);

  return (
    <Card>
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-900">Members Needing Attention</h3>
        <button
          onClick={() => navigate('/members?status=inactive')}
          className="flex items-center gap-1 text-xs text-primary-600 hover:text-primary-700"
        >
          View All <ArrowRight className="h-3 w-3" />
        </button>
      </div>

      {inactive.length === 0 ? (
        <p className="text-sm text-gray-400">All active members attended recently.</p>
      ) : (
        <div className="space-y-2">
          {inactive.map((m) => (
            <div
              key={m.id}
              className="flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50 px-3 py-2"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <AlertTriangle className="h-3.5 w-3.5 shrink-0 text-amber-500" />
                <button
                  onClick={() => navigate(`/members/${m.id}`)}
                  className="truncate text-sm text-gray-800 hover:text-primary-700 hover:underline"
                >
                  {m.fullName}
                </button>
              </div>
              <div className="ml-2 flex shrink-0 items-center gap-2">
                <span className="text-xs text-gray-500">
                  {m.daysSince >= 999 ? 'Never visited' : `${m.daysSince}d ago`}
                </span>
                <button
                  onClick={() => navigate('/messaging')}
                  className="rounded border border-gray-200 bg-white px-1.5 py-0.5 text-xs text-gray-600 hover:bg-gray-100"
                >
                  WhatsApp
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}

// ─── Export helpers ───────────────────────────────────────────────────────────

function exportCSV(records) {
  const headers = ['Member', 'Member ID', 'Shift', 'Check In', 'Check Out', 'Duration', 'Status', 'Method'];
  const rows = records.map((r) => [
    r.member?.fullName || '',
    r.member?.memberId || '',
    r.shift || getShift(r.checkIn),
    fmtTime(r.checkIn),
    fmtTime(r.checkOut),
    r.checkOut ? getDuration(r.checkIn, r.checkOut) : 'Inside',
    getAttendanceStatus(r),
    r.method || 'Manual',
  ]);
  const csv = [headers, ...rows].map((row) => row.map((c) => `"${c}"`).join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `attendance-${fmtDate(new Date())}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function Attendance() {
  const { data, setData, activeBranch, setActiveBranch, branches, currentBranch } = useData();

  // Filters
  const [period, setPeriod] = useState('today');
  const [customDate, setCustomDate] = useState('');
  const [search, setSearch] = useState('');
  const [selectedShift, setSelectedShift] = useState('all'); // 'all' | '1st Shift' | '2nd Shift'
  const [filterStatus, setFilterStatus] = useState('');
  const [filterMethod, setFilterMethod] = useState('');
  const [filterTrainer, setFilterTrainer] = useState('');
  const [filterMembership, setFilterMembership] = useState('');
  const [showPeriodDrop, setShowPeriodDrop] = useState(false);
  const [showExportDrop, setShowExportDrop] = useState(false);
  const periodRef = useRef(null);
  const exportRef = useRef(null);

  // Modals / Drawer
  const [qrOpen, setQrOpen] = useState(false);
  const [manualOpen, setManualOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);

  const today = fmtDate(new Date());
  const { from, to } = useMemo(() => dateRange(period, customDate), [period, customDate]);

  // All records in range, joined with member and shift
  const rangeRecords = useMemo(() => {
    return data.attendance
      .filter((a) => {
        if (a.date < from || a.date > to) return false;
        if (activeBranch !== 'all' && activeBranch) {
          const m = data.members.find((mem) => mem.id === a.memberId);
          if (!m || m.branch !== activeBranch) return false;
        }
        return true;
      })
      .map((a) => {
        const shift = a.shift || getShift(a.checkIn);
        return {
          ...a,
          shift,
          member: data.members.find((m) => m.id === a.memberId),
          membership: data.memberships.find((ms) => ms.memberId === a.memberId),
        };
      });
  }, [data.attendance, data.members, data.memberships, from, to, activeBranch]);

  // Filtered records for table
  const filteredRecords = useMemo(() => {
    return rangeRecords.filter((r) => {
      if (selectedShift !== 'all' && r.shift !== selectedShift) {
        return false;
      }
      if (search) {
        const t = search.toLowerCase();
        if (
          !r.member?.fullName.toLowerCase().includes(t) &&
          !r.member?.memberId.toLowerCase().includes(t)
        )
          return false;
      }
      if (filterStatus) {
        const s = getAttendanceStatus(r);
        if (s !== filterStatus) return false;
      }
      if (filterMethod) {
        if ((r.method || 'Manual') !== filterMethod) return false;
      }
      if (filterMembership) {
        if (r.membership?.planName !== filterMembership) return false;
      }
      return true;
    });
  }, [rangeRecords, selectedShift, search, filterStatus, filterMethod, filterMembership]);

  // Summary card computations (always for today)
  const todayRecords = useMemo(
    () =>
      data.attendance
        .filter((a) => a.date === today)
        .map((a) => ({
          ...a,
          shift: a.shift || getShift(a.checkIn),
          member: data.members.find((m) => m.id === a.memberId),
        })),
    [data.attendance, data.members, today]
  );

  // Shift counts & active presence for today & current view range
  const todayShift1 = useMemo(
    () => todayRecords.filter((r) => r.shift === '1st Shift'),
    [todayRecords]
  );
  const todayShift2 = useMemo(
    () => todayRecords.filter((r) => r.shift === '2nd Shift'),
    [todayRecords]
  );

  const shift1Inside = useMemo(() => todayShift1.filter((r) => !r.checkOut).length, [todayShift1]);
  const shift1CheckedOut = useMemo(() => todayShift1.filter((r) => r.checkOut).length, [todayShift1]);

  const shift2Inside = useMemo(() => todayShift2.filter((r) => !r.checkOut).length, [todayShift2]);
  const shift2CheckedOut = useMemo(() => todayShift2.filter((r) => r.checkOut).length, [todayShift2]);

  const rangeShift1Count = useMemo(
    () => rangeRecords.filter((r) => r.shift === '1st Shift').length,
    [rangeRecords]
  );
  const rangeShift2Count = useMemo(
    () => rangeRecords.filter((r) => r.shift === '2nd Shift').length,
    [rangeRecords]
  );

  const yesterdayRecords = useMemo(() => {
    const y = new Date();
    y.setDate(y.getDate() - 1);
    const yStr = fmtDate(y);
    return data.attendance.filter((a) => {
      if (a.date !== yStr) return false;
      if (activeBranch !== 'all' && activeBranch) {
        const m = data.members.find((mem) => mem.id === a.memberId);
        if (!m || m.branch !== activeBranch) return false;
      }
      return true;
    });
  }, [data.attendance, data.members, activeBranch]);

  const lastWeekRecords = useMemo(() => {
    const from7 = new Date();
    from7.setDate(from7.getDate() - 14);
    const to7 = new Date();
    to7.setDate(to7.getDate() - 7);
    const fStr = fmtDate(from7);
    const tStr = fmtDate(to7);
    return data.attendance.filter((a) => {
      if (a.date < fStr || a.date > tStr) return false;
      if (activeBranch !== 'all' && activeBranch) {
        const m = data.members.find((mem) => mem.id === a.memberId);
        if (!m || m.branch !== activeBranch) return false;
      }
      return true;
    });
  }, [data.attendance, data.members, activeBranch]);

  const checkedOutToday = todayRecords.filter((r) => r.checkOut);
  const insideNow = todayRecords.filter((r) => !r.checkOut);
  const activeMembers = useMemo(() => {
    return data.members.filter(
      (m) => m.status === 'active' && (activeBranch === 'all' || !activeBranch || m.branch === activeBranch)
    );
  }, [data.members, activeBranch]);

  const avgDuration = useMemo(() => {
    if (checkedOutToday.length === 0) return null;
    const total = checkedOutToday.reduce(
      (sum, r) =>
        sum + Math.floor((new Date(r.checkOut) - new Date(r.checkIn)) / 60000),
      0
    );
    const avg = Math.round(total / checkedOutToday.length);
    return `${Math.floor(avg / 60)}h ${avg % 60}m`;
  }, [checkedOutToday]);

  // Peak hour from today
  const peakHour = useMemo(() => {
    const hourCounts = {};
    todayRecords.forEach((r) => {
      const h = new Date(r.checkIn).getHours();
      hourCounts[h] = (hourCounts[h] || 0) + 1;
    });
    const max = Math.max(...Object.values(hourCounts), 0);
    const peakH = Object.keys(hourCounts).find((h) => hourCounts[h] === max);
    if (!peakH) return { label: '—', count: 0 };
    const h = Number(peakH);
    return {
      label: h === 0 ? '12 AM' : h < 12 ? `${h} AM` : h === 12 ? '12 PM' : `${h - 12} PM`,
      count: max,
    };
  }, [todayRecords]);

  const attendanceRate = activeMembers.length
    ? Math.round((todayRecords.length / activeMembers.length) * 100)
    : 0;
  const lastWeekRate = activeMembers.length
    ? Math.round((lastWeekRecords.length / 7 / activeMembers.length) * 100)
    : 0;
  const rateChange = attendanceRate - lastWeekRate;

  const presentVsYesterday =
    yesterdayRecords.length > 0
      ? Math.round(
          ((todayRecords.length - yesterdayRecords.length) / yesterdayRecords.length) * 100
        )
      : 0;

  // Plans for filter
  const planNames = useMemo(
    () => [...new Set(data.plans.map((p) => p.name))],
    [data.plans]
  );

  const handleCheckOut = (memberId) => {
    const { data: next } = checkoutAttendance(data, memberId);
    setData(next);
    setSelectedRecord(null);
  };

  const resetFilters = () => {
    setSearch('');
    setFilterStatus('');
    setFilterMethod('');
    setFilterTrainer('');
    setFilterMembership('');
    setSelectedShift('all');
  };

  const hasFilters =
    search || filterStatus || filterMethod || filterTrainer || filterMembership || selectedShift !== 'all';

  const periodLabels = {
    today: 'Today',
    yesterday: 'Yesterday',
    week: 'This Week',
    month: 'This Month',
    custom: 'Custom Date',
  };

  const selectedDrawerRecord = selectedRecord
    ? filteredRecords.find((r) => r.id === selectedRecord) ||
      rangeRecords.find((r) => r.id === selectedRecord) ||
      todayRecords.find((r) => r.id === selectedRecord)
    : null;

  return (
    <div className="page-container">
      {/* ── Page Header ── */}
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Attendance</h1>
          <p className="mt-1 text-sm text-gray-500">Track member check-ins and attendance history.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {/* Period filter */}
          <div className="relative" ref={periodRef}>
            <button
              onClick={() => setShowPeriodDrop((v) => !v)}
              className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              <CalendarDays className="h-3.5 w-3.5 text-gray-500" />
              {periodLabels[period]}
              <ChevronDown className="h-3.5 w-3.5 text-gray-400" />
            </button>
            {showPeriodDrop && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowPeriodDrop(false)} />
                <div className="absolute right-0 top-full z-20 mt-1 w-40 rounded-lg border border-gray-200 bg-white shadow-lg">
                  {Object.entries(periodLabels).map(([val, label]) => (
                    <button
                      key={val}
                      onClick={() => {
                        setPeriod(val);
                        setShowPeriodDrop(false);
                      }}
                      className={`block w-full px-3 py-2 text-left text-sm hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg ${
                        period === val ? 'font-semibold text-primary-700' : 'text-gray-700'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
          {period === 'custom' && (
            <input
              type="date"
              value={customDate}
              onChange={(e) => setCustomDate(e.target.value)}
              className="h-9 rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-700 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200"
            />
          )}
          <Button variant="secondary" icon={QrCode} onClick={() => setQrOpen(true)}>
            QR Check-in
          </Button>
          <Button icon={Plus} onClick={() => setManualOpen(true)}>
            Manual Check-in
          </Button>
        </div>
      </div>

      {/* ── Active Branch Switcher Banner ── */}
      <div className="mb-5 flex flex-col gap-3 rounded-xl border border-primary-100 bg-primary-50/50 p-3 sm:flex-row sm:items-center sm:justify-between text-xs">
        <div className="flex items-center gap-2 text-primary-900 font-medium">
          <span className="h-2 w-2 rounded-full bg-primary-600 animate-pulse shrink-0"></span>
          <span>
            Tracking Attendance for:{' '}
            <strong>{activeBranch === 'all' ? '🌐 All Gym Centres (Consolidated)' : (currentBranch?.name || activeBranch)}</strong>
            {currentBranch?.city && <span className="opacity-75 font-normal"> ({currentBranch.city})</span>}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={activeBranch}
            onChange={(e) => setActiveBranch(e.target.value)}
            className="rounded-lg border border-gray-300 bg-white px-2.5 py-1 text-xs font-semibold text-gray-800 shadow-xs focus:border-primary-500 focus:outline-none"
          >
            <option value="all">🌐 All Centres ({data.members.length} members)</option>
            {branches.map((b) => (
              <option key={b.id} value={b.name}>
                🏢 {b.name} ({data.members.filter((m) => m.branch === b.name).length})
              </option>
            ))}
          </select>
          {activeBranch !== 'all' && (
            <button
              type="button"
              onClick={() => setActiveBranch('all')}
              className="text-primary-700 underline font-semibold hover:text-primary-900"
            >
              View All
            </button>
          )}
        </div>
      </div>

      {/* ── Summary Cards ── */}
      <div className="mb-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Present Today"
          value={todayRecords.length}
          sub={
            yesterdayRecords.length > 0
              ? `${presentVsYesterday >= 0 ? '+' : ''}${presentVsYesterday}% vs yesterday`
              : 'No data yesterday'
          }
          subIcon={presentVsYesterday >= 0 ? TrendingUp : TrendingDown}
          subUp={presentVsYesterday >= 0}
        />
        <StatCard
          label="Checked Out"
          value={checkedOutToday.length}
          sub={avgDuration ? `Avg duration: ${avgDuration}` : 'No completed sessions'}
          subIcon={Clock}
        />
        <StatCard
          label="Peak Hour"
          value={peakHour.label}
          sub={peakHour.count > 0 ? `${peakHour.count} members` : 'No data yet'}
          subIcon={Activity}
        />
        <StatCard
          label="Attendance Rate"
          value={`${attendanceRate}%`}
          sub={
            rateChange !== 0
              ? `${rateChange >= 0 ? '+' : ''}${rateChange}% vs last week`
              : 'Same as last week'
          }
          subIcon={rateChange >= 0 ? TrendingUp : TrendingDown}
          subUp={rateChange >= 0}
        />
      </div>

      {/* ── Owner Shift Overview & Live Status ── */}
      <div className="mb-5 grid gap-4 sm:grid-cols-2">
        {/* 1st Shift Card */}
        <div
          onClick={() => setSelectedShift((prev) => (prev === '1st Shift' ? 'all' : '1st Shift'))}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && setSelectedShift((prev) => (prev === '1st Shift' ? 'all' : '1st Shift'))}
          className={`group relative cursor-pointer rounded-xl border p-4 transition-all duration-150 ${
            selectedShift === '1st Shift'
              ? 'border-amber-400 bg-amber-50/70 shadow-sm ring-2 ring-amber-400/30'
              : 'border-gray-200 bg-white hover:border-amber-300 hover:bg-amber-50/20 shadow-sm'
          }`}
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100 text-amber-700">
                <Sun className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-gray-900">1st Shift (Morning)</h3>
                  <span className="rounded-full bg-amber-100/90 px-2 py-0.5 text-[11px] font-semibold text-amber-800">
                    6:00 AM – 12:00 PM
                  </span>
                </div>
                <p className="text-xs text-gray-500">Morning workout batch</p>
              </div>
            </div>
            <span
              className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition-colors ${
                selectedShift === '1st Shift'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-gray-100 text-gray-600 group-hover:bg-amber-100 group-hover:text-amber-800'
              }`}
            >
              {selectedShift === '1st Shift' ? 'Showing 1st Shift ✓' : 'Filter 1st Shift'}
            </span>
          </div>

          <div className="mt-3.5 flex items-baseline justify-between border-t border-gray-100 pt-3">
            <div>
              <p className="text-xs font-medium text-gray-500">Total Students Present Today</p>
              <div className="flex items-baseline gap-1.5">
                <p className="text-2xl font-black text-amber-900">{todayShift1.length}</p>
                <span className="text-xs text-gray-500">students</span>
              </div>
            </div>
            <div className="flex items-center gap-3 text-right">
              <div>
                <p className="text-[11px] text-gray-500">Inside Now</p>
                <p className="text-sm font-bold text-blue-600">{shift1Inside}</p>
              </div>
              <div className="h-6 w-px bg-gray-200" />
              <div>
                <p className="text-[11px] text-gray-500">Checked Out</p>
                <p className="text-sm font-bold text-gray-700">{shift1CheckedOut}</p>
              </div>
            </div>
          </div>
        </div>

        {/* 2nd Shift Card */}
        <div
          onClick={() => setSelectedShift((prev) => (prev === '2nd Shift' ? 'all' : '2nd Shift'))}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && setSelectedShift((prev) => (prev === '2nd Shift' ? 'all' : '2nd Shift'))}
          className={`group relative cursor-pointer rounded-xl border p-4 transition-all duration-150 ${
            selectedShift === '2nd Shift'
              ? 'border-indigo-400 bg-indigo-50/70 shadow-sm ring-2 ring-indigo-400/30'
              : 'border-gray-200 bg-white hover:border-indigo-300 hover:bg-indigo-50/20 shadow-sm'
          }`}
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-100 text-indigo-700">
                <Moon className="h-5 w-5 text-indigo-600" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-gray-900">2nd Shift (Evening)</h3>
                  <span className="rounded-full bg-indigo-100/90 px-2 py-0.5 text-[11px] font-semibold text-indigo-800">
                    12:00 PM – 10:00 PM
                  </span>
                </div>
                <p className="text-xs text-gray-500">Evening workout batch</p>
              </div>
            </div>
            <span
              className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition-colors ${
                selectedShift === '2nd Shift'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-gray-100 text-gray-600 group-hover:bg-indigo-100 group-hover:text-indigo-800'
              }`}
            >
              {selectedShift === '2nd Shift' ? 'Showing 2nd Shift ✓' : 'Filter 2nd Shift'}
            </span>
          </div>

          <div className="mt-3.5 flex items-baseline justify-between border-t border-gray-100 pt-3">
            <div>
              <p className="text-xs font-medium text-gray-500">Total Students Present Today</p>
              <div className="flex items-baseline gap-1.5">
                <p className="text-2xl font-black text-indigo-900">{todayShift2.length}</p>
                <span className="text-xs text-gray-500">students</span>
              </div>
            </div>
            <div className="flex items-center gap-3 text-right">
              <div>
                <p className="text-[11px] text-gray-500">Inside Now</p>
                <p className="text-sm font-bold text-blue-600">{shift2Inside}</p>
              </div>
              <div className="h-6 w-px bg-gray-200" />
              <div>
                <p className="text-[11px] text-gray-500">Checked Out</p>
                <p className="text-sm font-bold text-gray-700">{shift2CheckedOut}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Table + Currently Inside ── */}
      <div className="mb-5 grid gap-4 lg:grid-cols-[1fr_260px]">
        {/* Attendance Table card */}
        <Card padding="none">
          {/* Table header + filters */}
          <div className="border-b border-gray-100 px-4 py-3">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="text-sm font-semibold text-gray-900">
                  {period === 'today' ? "Today's Attendance" : `Attendance · ${periodLabels[period]}`}
                  <span className="ml-2 text-xs font-normal text-gray-400">
                    {filteredRecords.length} record{filteredRecords.length !== 1 ? 's' : ''}
                  </span>
                </h3>
              </div>
              <div className="flex items-center gap-2">
                {/* Export */}
                <div className="relative" ref={exportRef}>
                  <button
                    onClick={() => setShowExportDrop((v) => !v)}
                    className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-2.5 text-xs font-medium text-gray-600 hover:bg-gray-50"
                  >
                    <Download className="h-3.5 w-3.5" />
                    Export
                    <ChevronDown className="h-3 w-3 text-gray-400" />
                  </button>
                  {showExportDrop && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setShowExportDrop(false)} />
                      <div className="absolute right-0 top-full z-20 mt-1 w-36 rounded-lg border border-gray-200 bg-white shadow-lg">
                        <button
                          onClick={() => { exportCSV(filteredRecords); setShowExportDrop(false); }}
                          className="block w-full px-3 py-2 text-left text-sm hover:bg-gray-50 rounded-t-lg text-gray-700"
                        >
                          Download CSV
                        </button>
                        <button
                          onClick={() => { window.print(); setShowExportDrop(false); }}
                          className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-gray-50 rounded-b-lg text-gray-700"
                        >
                          <Printer className="h-3.5 w-3.5 text-gray-400" />
                          Print
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Shift Filter Buttons Row */}
            <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-gray-100 pt-3">
              <div className="inline-flex rounded-lg border border-gray-200 bg-gray-50/80 p-1">
                <button
                  type="button"
                  onClick={() => setSelectedShift('all')}
                  className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-all ${
                    selectedShift === 'all'
                      ? 'bg-white text-gray-900 shadow-sm font-semibold'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  All Shifts
                  <span className="rounded-full bg-gray-200 px-1.5 py-0.2 text-[10px] font-semibold text-gray-700">
                    {rangeRecords.length}
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedShift('1st Shift')}
                  className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-all ${
                    selectedShift === '1st Shift'
                      ? 'bg-amber-500 text-white shadow-sm font-semibold'
                      : 'text-gray-600 hover:text-amber-700'
                  }`}
                >
                  <Sun className={`h-3.5 w-3.5 ${selectedShift === '1st Shift' ? 'text-white' : 'text-amber-500'}`} />
                  1st Shift (Morning)
                  <span
                    className={`rounded-full px-1.5 py-0.2 text-[10px] font-semibold ${
                      selectedShift === '1st Shift' ? 'bg-amber-600 text-white' : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {period === 'today' ? todayShift1.length : rangeShift1Count} Present
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedShift('2nd Shift')}
                  className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-all ${
                    selectedShift === '2nd Shift'
                      ? 'bg-indigo-600 text-white shadow-sm font-semibold'
                      : 'text-gray-600 hover:text-indigo-700'
                  }`}
                >
                  <Moon className={`h-3.5 w-3.5 ${selectedShift === '2nd Shift' ? 'text-white' : 'text-indigo-500'}`} />
                  2nd Shift (Evening)
                  <span
                    className={`rounded-full px-1.5 py-0.2 text-[10px] font-semibold ${
                      selectedShift === '2nd Shift' ? 'bg-indigo-700 text-white' : 'bg-indigo-100 text-indigo-800'
                    }`}
                  >
                    {period === 'today' ? todayShift2.length : rangeShift2Count} Present
                  </span>
                </button>
              </div>

              {selectedShift !== 'all' && (
                <div className="flex items-center gap-1.5 text-xs text-gray-500">
                  <span>Filtered:</span>
                  <span className={`inline-flex items-center gap-1 font-semibold ${
                    selectedShift === '1st Shift' ? 'text-amber-700' : 'text-indigo-700'
                  }`}>
                    {selectedShift === '1st Shift' ? '🌅 1st Shift (Morning)' : '🌆 2nd Shift (Evening)'}
                  </span>
                  <button
                    onClick={() => setSelectedShift('all')}
                    className="ml-1 text-gray-400 hover:text-gray-700 underline"
                  >
                    Show all
                  </button>
                </div>
              )}
            </div>

            {/* Filter row */}
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <div className="relative min-w-[160px] flex-1 sm:flex-none sm:w-48">
                <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search member…"
                  className="h-8 w-full rounded-lg border border-gray-300 bg-white pl-8 pr-3 text-sm text-gray-900 placeholder-gray-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200"
                />
              </div>
              <FilterSelect
                value={filterStatus}
                onChange={setFilterStatus}
                placeholder="Status"
                options={[
                  { value: 'Inside', label: 'Inside' },
                  { value: 'Present', label: 'Present' },
                  { value: 'Late', label: 'Late' },
                ]}
              />
              <FilterSelect
                value={filterMethod}
                onChange={setFilterMethod}
                placeholder="Check-in Type"
                options={[
                  { value: 'QR', label: 'QR' },
                  { value: 'Manual', label: 'Manual' },
                  { value: 'RFID', label: 'RFID' },
                  { value: 'Biometric', label: 'Biometric' },
                  { value: 'Member App', label: 'Member App' },
                ]}
              />
              <FilterSelect
                value={filterMembership}
                onChange={setFilterMembership}
                placeholder="Membership"
                options={planNames.map((p) => ({ value: p, label: p }))}
              />
              {hasFilters && (
                <button
                  onClick={resetFilters}
                  className="inline-flex h-8 items-center gap-1 rounded-lg border border-gray-200 bg-white px-2.5 text-xs text-gray-500 hover:bg-gray-50"
                >
                  <RotateCcw className="h-3 w-3" />
                  Reset
                </button>
              )}
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <Table>
              <Thead>
                <Tr>
                  <Th>Member</Th>
                  <Th>ID</Th>
                  <Th>Shift</Th>
                  <Th>Check In</Th>
                  <Th>Check Out</Th>
                  <Th>Duration</Th>
                  <Th>Status</Th>
                  <Th className="text-right">Action</Th>
                </Tr>
              </Thead>
              <Tbody>
                {filteredRecords.map((r) => {
                  const status = getAttendanceStatus(r);
                  const { variant, dot } = statusBadge(status);
                  const duration = r.checkOut
                    ? getDuration(r.checkIn, r.checkOut)
                    : null;
                  return (
                    <Tr key={r.id}>
                      <Td>
                        <div className="flex items-center gap-2.5">
                          <Avatar name={r.member?.fullName} size="sm" />
                          <span className="font-medium text-gray-900 whitespace-nowrap">
                            {r.member?.fullName}
                          </span>
                        </div>
                      </Td>
                      <Td>
                        <span className="text-xs text-gray-500">{r.member?.memberId}</span>
                      </Td>
                      <Td>
                        {r.shift === '1st Shift' ? (
                          <span className="inline-flex items-center gap-1 rounded-md border border-amber-200 bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-800 whitespace-nowrap">
                            <Sun className="h-3 w-3 text-amber-600" />
                            1st Shift
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-md border border-indigo-200 bg-indigo-50 px-2 py-0.5 text-xs font-medium text-indigo-800 whitespace-nowrap">
                            <Moon className="h-3 w-3 text-indigo-600" />
                            2nd Shift
                          </span>
                        )}
                      </Td>
                      <Td>{fmtTime(r.checkIn)}</Td>
                      <Td>{fmtTime(r.checkOut)}</Td>
                      <Td>
                        {duration ? (
                          <span className="text-sm text-gray-700">{duration}</span>
                        ) : (
                          <span className="text-xs text-blue-600">Currently inside</span>
                        )}
                      </Td>
                      <Td>
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 text-xs font-medium ${
                            variant === 'success'
                              ? 'border-green-200 bg-green-50 text-green-800'
                              : variant === 'info'
                              ? 'border-blue-200 bg-blue-50 text-blue-800'
                              : variant === 'warning'
                              ? 'border-amber-200 bg-amber-50 text-amber-800'
                              : variant === 'danger'
                              ? 'border-red-200 bg-red-50 text-red-800'
                              : 'border-gray-200 bg-gray-50 text-gray-600'
                          }`}
                        >
                          <span className={`h-1.5 w-1.5 rounded-full ${dot}`} />
                          {status}
                        </span>
                      </Td>
                      <Td className="text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {!r.checkOut && r.date === today && (
                            <Button
                              size="sm"
                              variant="secondary"
                              onClick={() => handleCheckOut(r.memberId)}
                            >
                              Check Out
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setSelectedRecord(r.id)}
                          >
                            View
                          </Button>
                        </div>
                      </Td>
                    </Tr>
                  );
                })}
                {filteredRecords.length === 0 && (
                  <Tr>
                    <Td colSpan={8}>
                      <div className="flex flex-col items-center justify-center py-12 text-center">
                        <UserCheck className="mb-3 h-10 w-10 text-gray-200" />
                        <p className="text-sm font-medium text-gray-500">
                          {hasFilters
                            ? 'No records match the selected filters.'
                            : 'No check-ins recorded yet.'}
                        </p>
                        {!hasFilters && (
                          <p className="mt-1 text-xs text-gray-400">
                            Start by scanning a member's QR code or manually checking them in.
                          </p>
                        )}
                        {!hasFilters && (
                          <div className="mt-3 flex gap-2">
                            <Button
                              size="sm"
                              icon={QrCode}
                              onClick={() => setQrOpen(true)}
                            >
                              QR Check-in
                            </Button>
                            <Button
                              size="sm"
                              variant="secondary"
                              icon={Plus}
                              onClick={() => setManualOpen(true)}
                            >
                              Manual
                            </Button>
                          </div>
                        )}
                        {hasFilters && (
                          <button
                            onClick={resetFilters}
                            className="mt-2 text-xs text-primary-600 hover:underline"
                          >
                            Clear filters
                          </button>
                        )}
                      </div>
                    </Td>
                  </Tr>
                )}
              </Tbody>
            </Table>
          </div>
        </Card>

        {/* Currently Inside */}
        <CurrentlyInsidePanel
          insideRecords={insideNow}
          onSelect={(r) => setSelectedRecord(r.id)}
        />
      </div>

      {/* ── Charts Row ── */}
      <div className="mb-5 grid gap-4 lg:grid-cols-2">
        <WeeklyChart attendance={data.attendance} />
        <PeakHoursPanel attendance={data.attendance} />
      </div>

      {/* ── Members Needing Attention ── */}
      <NeedsAttentionPanel members={data.members} attendance={data.attendance} />

      {/* ── Modals ── */}
      <QRModal
        open={qrOpen}
        onClose={() => setQrOpen(false)}
        data={data}
        setData={setData}
      />
      <ManualCheckInModal
        open={manualOpen}
        onClose={() => setManualOpen(false)}
        data={data}
        setData={setData}
      />

      {/* ── Attendance Drawer ── */}
      {selectedRecord && selectedDrawerRecord && (
        <AttendanceDrawer
          record={selectedDrawerRecord}
          allRecords={data.attendance}
          member={selectedDrawerRecord.member}
          membership={selectedDrawerRecord.membership}
          onClose={() => setSelectedRecord(null)}
        />
      )}
    </div>
  );
}
