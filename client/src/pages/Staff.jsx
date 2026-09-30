import { useMemo, useState } from 'react';
import { useData } from '../context/DataContext';
import { useAuth, generateStaffLoginLink } from '../context/AuthContext';
import { deleteStaff } from '../data/services';
import PageHeader from '../components/ui/PageHeader';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import StaffModal from '../components/StaffModal';
import Avatar from '../components/ui/Avatar';
import Modal from '../components/ui/Modal';
import { Table, Thead, Th, Tbody, Tr, Td } from '../components/ui/Table';
import Badge from '../components/ui/Badge';
import { Plus, Edit2, Trash2, UserCheck, UserCog, Users, KeyRound, Copy, Check, QrCode, Shield, ExternalLink } from 'lucide-react';
import SearchInput from '../components/ui/SearchInput';
import Select from '../components/ui/Select';

const statusVariant = {
  active: 'success',
  inactive: 'default',
};

export default function Staff() {
  const { data, setData, activeBranch, setActiveBranch, branches, currentBranch } = useData();
  const { user } = useAuth();
  const [modalOpen, setModalOpen] = useState(false);
  const [editStaff, setEditStaff] = useState(null);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [copied, setCopied] = useState(false);
  const [qrOpen, setQrOpen] = useState(false);

  const openCreate = () => {
    setEditStaff(null);
    setModalOpen(true);
  };

  const openEdit = (s) => {
    setEditStaff(s);
    setModalOpen(true);
  };

  const handleDelete = (id) => {
    if (confirm('Delete this staff member?')) {
      const { data: next } = deleteStaff(data, id);
      setData(next);
    }
  };

  // Generate staff login link containing gym workspace info
  const staffLoginLink = useMemo(() => {
    return generateStaffLoginLink(
      user?.workspaceId || 'demo-workspace',
      data.settings?.gymName || user?.businessName || 'BilzyFit Gym',
      data.staff
    );
  }, [user?.workspaceId, user?.businessName, data.settings?.gymName, data.staff]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(staffLoginLink).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  const qrSrc = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&color=0f766e&bgcolor=ffffff&qzone=2&data=${encodeURIComponent(staffLoginLink)}`;

  const filtered = useMemo(() => data.staff.filter((member) => {
    const term = search.toLowerCase();
    const matchesSearch = !term || member.name.toLowerCase().includes(term) || member.email?.toLowerCase().includes(term);
    const matchesRole = !roleFilter || member.role === roleFilter;
    const matchesStatus = !statusFilter || member.status === statusFilter;
    const matchesBranch = activeBranch === 'all' || !activeBranch || member.branch === 'All Branches' || member.branch === activeBranch || !member.branch;
    return matchesSearch && matchesRole && matchesStatus && matchesBranch;
  }), [data.staff, search, roleFilter, statusFilter, activeBranch]);

  const activeCount = filtered.filter((member) => member.status === 'active').length;
  const loginEnabledCount = filtered.filter((member) => member.loginEnabled).length;
  const payroll = filtered.reduce((sum, member) => sum + Number(member.salary || 0), 0);

  return (
    <div className="page-container">
      <PageHeader title="Staff Management" subtitle="Manage gym staff across your branches, assign roles, and grant app login access.">
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="secondary" icon={QrCode} onClick={() => setQrOpen(true)}>
            Staff QR Code
          </Button>
          <Button icon={Plus} onClick={openCreate}>
            Add Staff
          </Button>
        </div>
      </PageHeader>

      {/* ── Active Branch Switcher Banner ── */}
      <div className="mb-6 flex flex-col gap-3 rounded-xl border border-primary-100 bg-primary-50/50 p-3 sm:flex-row sm:items-center sm:justify-between text-xs">
        <div className="flex items-center gap-2 text-primary-900 font-medium">
          <span className="h-2 w-2 rounded-full bg-primary-600 animate-pulse shrink-0"></span>
          <span>
            Staff Scope:{' '}
            <strong>{activeBranch === 'all' ? '🌐 All Gym Centres (Consolidated Staff)' : (currentBranch?.name || activeBranch)}</strong>
            {currentBranch?.city && <span className="opacity-75 font-normal"> ({currentBranch.city})</span>}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={activeBranch}
            onChange={(e) => setActiveBranch(e.target.value)}
            className="rounded-lg border border-gray-300 bg-white px-2.5 py-1 text-xs font-semibold text-gray-800 shadow-xs focus:border-primary-500 focus:outline-none"
          >
            <option value="all">🌐 All Centres Staff ({data.staff.length})</option>
            {branches.map((b) => (
              <option key={b.id} value={b.name}>
                🏢 {b.name}
              </option>
            ))}
          </select>
          {activeBranch !== 'all' && (
            <button
              type="button"
              onClick={() => setActiveBranch('all')}
              className="text-primary-700 underline font-semibold hover:text-primary-900"
            >
              View All Staff
            </button>
          )}
        </div>
      </div>

      {/* Metrics Row */}
      <div className="mb-6 grid gap-4 sm:grid-cols-4">
        {[
          { label: 'Total staff', value: data.staff.length, icon: Users },
          { label: 'Active staff', value: activeCount, icon: UserCheck },
          { label: 'App Login Enabled', value: `${loginEnabledCount} / ${data.staff.length}`, icon: KeyRound },
          { label: 'Monthly payroll', value: `₹${payroll.toLocaleString('en-IN')}`, icon: UserCog },
        ].map((metric) => (
          <Card key={metric.label}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-gray-500">{metric.label}</p>
                <p className="mt-2 text-2xl font-bold text-gray-900">{metric.value}</p>
              </div>
              <metric.icon className="h-5 w-5 text-primary-600" />
            </div>
          </Card>
        ))}
      </div>

      {/* Staff Login Portal Shareable Link Banner */}
      <div className="mb-6 rounded-2xl border border-primary-100 bg-gradient-to-r from-primary-50 via-white to-primary-50/40 p-4 sm:p-5 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-start gap-3.5">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-600 text-white shadow-sm">
              <KeyRound className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-gray-900">Staff Login Portal Link</h3>
                <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-semibold text-emerald-800">
                  Ready to Share
                </span>
              </div>
              <p className="mt-0.5 text-xs text-gray-600 max-w-2xl leading-relaxed">
                Share this link with your staff members (Trainers, Managers, Receptionists). They can open it on their mobile phone or computer, enter their <strong>Name + Role + Password</strong>, and access only the features allowed for their role.
              </p>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              onClick={handleCopyLink}
              className="inline-flex items-center gap-2 rounded-xl bg-primary-700 px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-primary-800 active:scale-95"
            >
              {copied ? <Check className="h-4 w-4 text-emerald-300" /> : <Copy className="h-4 w-4" />}
              <span>{copied ? 'Link Copied!' : 'Copy Staff Link'}</span>
            </button>
            <button
              type="button"
              onClick={() => setQrOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-xl border border-gray-300 bg-white px-3.5 py-2.5 text-xs font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50"
            >
              <QrCode className="h-4 w-4 text-primary-600" />
              <span>QR Code</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <SearchInput value={search} onChange={setSearch} placeholder="Search staff by name or email..." className="w-full sm:max-w-sm" />
        <div className="flex gap-3">
          <Select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            options={[
              { value: '', label: 'All roles' },
              ...Array.from(new Set(data.staff.map((m) => m.role))).map((value) => ({ value, label: value })),
            ]}
            className="w-full sm:w-44"
          />
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            options={[
              { value: '', label: 'All statuses' },
              { value: 'active', label: 'Active' },
              { value: 'inactive', label: 'Inactive' },
            ]}
            className="w-full sm:w-36"
          />
        </div>
      </div>

      {/* Staff Table */}
      <Card>
        <Table>
          <Thead>
            <Tr>
              <Th>Name</Th>
              <Th>Role</Th>
              <Th>Branch</Th>
              <Th>App Login Access</Th>
              <Th>Phone</Th>
              <Th>Email</Th>
              <Th>Joining Date</Th>
              <Th>Salary</Th>
              <Th>Status</Th>
              <Th className="text-right">Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {filtered.length === 0 ? (
              <Tr>
                <Td colSpan={10} className="py-8 text-center text-sm text-gray-500">
                  No staff members found matching your search.
                </Td>
              </Tr>
            ) : (
              filtered.map((s) => (
                <Tr key={s.id}>
                  <Td>
                    <div className="flex items-center gap-3">
                      <Avatar name={s.name} src={s.photo} size="sm" />
                      <div>
                        <p className="font-semibold text-gray-900">{s.name}</p>
                        <p className="text-[11px] text-gray-500">{s.email || 'No email'}</p>
                      </div>
                    </div>
                  </Td>
                  <Td>
                    <span className="inline-flex rounded-md bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-800">
                      {s.role}
                    </span>
                  </Td>
                  <Td>
                    <span className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium ${
                      s.branch && s.branch !== 'All Branches' ? 'bg-primary-50 text-primary-700' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {s.branch || 'All Branches'}
                    </span>
                  </Td>
                  <Td>
                    {s.loginEnabled ? (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 border border-emerald-200">
                        <KeyRound className="h-3.5 w-3.5 text-emerald-600" />
                        Enabled
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-1 text-xs text-gray-500">
                        Disabled
                      </span>
                    )}
                  </Td>
                  <Td>{s.phone}</Td>
                  <Td>{s.email || '—'}</Td>
                  <Td>{s.joiningDate}</Td>
                  <Td>₹{Number(s.salary).toLocaleString('en-IN')}</Td>
                  <Td>
                    <Badge variant={statusVariant[s.status] || 'default'}>{s.status}</Badge>
                  </Td>
                  <Td className="text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        title="Edit staff & password"
                        onClick={() => openEdit(s)}
                        className="rounded p-1.5 text-gray-500 hover:bg-gray-100 hover:text-primary-600 transition-colors"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        title="Delete staff"
                        onClick={() => handleDelete(s.id)}
                        className="rounded p-1.5 text-gray-500 hover:bg-red-50 hover:text-red-600 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </Td>
                </Tr>
              ))
            )}
          </Tbody>
        </Table>
      </Card>

      {/* Staff Modal (Add / Edit + Set Password) */}
      <StaffModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        staff={editStaff}
      />

      {/* Staff QR Code Modal */}
      <Modal
        open={qrOpen}
        onClose={() => setQrOpen(false)}
        title="Staff Login QR Code"
        size="sm"
        footer={
          <div className="flex w-full items-center justify-between gap-2">
            <Button variant="secondary" onClick={() => setQrOpen(false)}>
              Close
            </Button>
            <Button icon={copied ? Check : Copy} onClick={handleCopyLink}>
              {copied ? 'Link Copied!' : 'Copy Portal Link'}
            </Button>
          </div>
        }
      >
        <div className="flex flex-col items-center py-2 text-center">
          <p className="text-xs text-gray-600 mb-4">
            Trainers, managers, and receptionists can scan this QR code on their phone to immediately open the staff login page.
          </p>

          <div className="rounded-2xl border-2 border-primary-200 bg-white p-3 shadow-md">
            <img
              src={qrSrc}
              alt="Staff Login QR Code"
              className="h-56 w-56 object-contain"
            />
          </div>

          <div className="mt-4 w-full rounded-xl bg-gray-50 p-3 text-left">
            <p className="text-[11px] font-semibold text-gray-700">How Staff Logs In:</p>
            <ol className="mt-1 list-decimal pl-4 text-[11px] text-gray-600 space-y-0.5">
              <li>Open the link or scan the QR code</li>
              <li>Enter their registered Name (e.g. Sneha Patel)</li>
              <li>Select their Role (e.g. Trainer)</li>
              <li>Enter the password set by the Gym Owner</li>
            </ol>
          </div>
        </div>
      </Modal>
    </div>
  );
}
