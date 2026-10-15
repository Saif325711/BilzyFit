import { useState, useMemo, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Plus, Trash2, Edit2, FileText, KeyRound, Copy, Check } from 'lucide-react';
import { useData } from '../context/DataContext';
import { deleteMember } from '../data/services';
import PageHeader from '../components/ui/PageHeader';
import Button from '../components/ui/Button';
import SearchInput from '../components/ui/SearchInput';
import Select from '../components/ui/Select';
import { Table, Thead, Th, Tbody, Tr, Td } from '../components/ui/Table';
import Badge from '../components/ui/Badge';
import Avatar from '../components/ui/Avatar';
import ReceiptModal from '../components/ReceiptModal';
import EmptyState from '../components/ui/EmptyState';

const statusBadge = {
  active: 'success',
  inactive: 'default',
  expiring: 'warning',
  expired: 'danger',
};

export default function Members() {
  const { data, setData, activeBranch, setActiveBranch, branches, currentBranch } = useData();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState(searchParams.get('status') || '');
  const [copiedCodeId, setCopiedCodeId] = useState(null);

  const handleCopyCode = (e, memberId, code) => {
    e.stopPropagation();
    navigator.clipboard.writeText(code);
    setCopiedCodeId(memberId);
    setTimeout(() => setCopiedCodeId(null), 2000);
  };

  useEffect(() => {
    setStatusFilter(searchParams.get('status') || '');
  }, [searchParams]);

  const [receiptMember, setReceiptMember] = useState(null);

  const filtered = useMemo(() => {
    return data.members.filter((m) => {
      const matchesSearch =
        m.fullName.toLowerCase().includes(search.toLowerCase()) ||
        m.mobile.includes(search) ||
        m.memberId.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter ? m.status === statusFilter : true;
      const matchesBranch = activeBranch === 'all' || !activeBranch ? true : m.branch === activeBranch;
      return matchesSearch && matchesStatus && matchesBranch;
    });
  }, [data.members, search, statusFilter, activeBranch]);

  const openEdit = (member) => {
    navigate(`/members/${member.id}/edit`);
  };

  const handleDelete = (id) => {
    if (confirm('Are you sure you want to delete this member?')) {
      const { data: next } = deleteMember(data, id);
      setData(next);
    }
  };

  return (
    <div className="page-container">
      <PageHeader title="Members" subtitle="Manage all gym members across your locations.">
        <Button onClick={() => navigate('/members/new')} icon={Plus}>
          Add Member
        </Button>
      </PageHeader>

      {/* Active Branch Context Pill */}
      {activeBranch !== 'all' ? (
        <div className="mb-4 flex items-center justify-between rounded-xl border border-primary-200 bg-primary-50/60 px-4 py-2.5 text-xs text-primary-800">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-primary-600 animate-pulse"></span>
            <span>
              Showing <strong>{filtered.length} members</strong> registered under <strong>{currentBranch?.name || activeBranch}</strong> ({currentBranch?.city || 'Location'})
            </span>
          </div>
          <button
            type="button"
            onClick={() => setActiveBranch('all')}
            className="font-semibold text-primary-700 underline hover:text-primary-900"
          >
            Show All Branches ({data.members.length})
          </button>
        </div>
      ) : null}

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Search by name, mobile, member ID..."
          className="w-full sm:max-w-sm"
        />
        <div className="flex flex-wrap items-center gap-2">
          {/* Gym Centre Switcher in Toolbar */}
          <Select
            value={activeBranch}
            onChange={(e) => setActiveBranch(e.target.value)}
            options={[
              { value: 'all', label: `🌐 All Centres (${data.members.length})` },
              ...branches.map((b) => ({
                value: b.name,
                label: `🏢 ${b.name} (${data.members.filter((m) => m.branch === b.name).length})`,
              })),
            ]}
            className="w-full sm:w-56"
          />
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            options={[
              { value: '', label: 'All Status' },
              { value: 'active', label: 'Active' },
              { value: 'inactive', label: 'Inactive' },
              { value: 'expiring', label: 'Expiring' },
              { value: 'expired', label: 'Expired' },
            ]}
            className="w-full sm:w-36"
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          title="No members found"
          description={activeBranch !== 'all' ? `No members registered yet in ${currentBranch?.name || activeBranch}.` : 'Try adjusting your search or filters, or add a new member.'}
          actionLabel="Add Member"
          onAction={() => navigate('/members/new')}
        />
      ) : (
        <Table>
          <Thead>
            <Tr>
              <Th>Member</Th>
              <Th>ID</Th>
              <Th>App Secret Code</Th>
              {activeBranch === 'all' && <Th>Branch</Th>}
              <Th>Mobile</Th>
              <Th>Goal</Th>
              <Th>Status</Th>
              <Th>Joined</Th>
              <Th className="text-right">Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {filtered.map((m) => (
              <Tr
                key={m.id}
                onClick={() => navigate(`/members/${m.id}`)}
                className="cursor-pointer"
              >
                <Td>
                  <div className="flex items-center gap-3">
                    <Avatar name={m.fullName} src={m.photo} size="sm" />
                    <span className="font-medium text-gray-900">{m.fullName}</span>
                  </div>
                </Td>
                <Td className="font-mono text-xs font-semibold">{m.memberId}</Td>
                <Td>
                  <div className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-200 bg-emerald-50/80 px-2 py-1 font-mono text-xs font-extrabold text-emerald-800">
                    <KeyRound className="h-3 w-3 text-emerald-600" />
                    <span>{m.secretCode || '749201'}</span>
                    <button
                      type="button"
                      onClick={(e) => handleCopyCode(e, m.id, m.secretCode || '749201')}
                      className="ml-1 rounded p-0.5 text-emerald-700 hover:bg-emerald-200 transition"
                      title="Copy Secret Code for Member App"
                    >
                      {copiedCodeId === m.id ? (
                        <Check className="h-3 w-3 text-emerald-700" />
                      ) : (
                        <Copy className="h-3 w-3" />
                      )}
                    </button>
                  </div>
                </Td>
                {activeBranch === 'all' && (
                  <Td>
                    <span className="inline-flex items-center gap-1 rounded-md bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-700">
                      {m.branch || 'Main Branch'}
                    </span>
                  </Td>
                )}
                <Td>{m.mobile}</Td>
                <Td>{m.goal}</Td>
                <Td>
                  <Badge variant={statusBadge[m.status] || 'default'}>{m.status}</Badge>
                </Td>
                <Td>{m.joiningDate}</Td>
                <Td>
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setReceiptMember(m);
                      }}
                      className="rounded p-1.5 text-gray-500 hover:bg-gray-100 hover:text-primary-600"
                      title="Receipt"
                    >
                      <FileText className="h-4 w-4" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openEdit(m);
                      }}
                      className="rounded p-1.5 text-gray-500 hover:bg-gray-100 hover:text-primary-600"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(m.id);
                      }}
                      className="rounded p-1.5 text-gray-500 hover:bg-red-50 hover:text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      )}

      {receiptMember && (
        <ReceiptModal
          member={receiptMember}
          onClose={() => setReceiptMember(null)}
        />
      )}
    </div>
  );
}
