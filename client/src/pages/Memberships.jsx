import { useMemo, useState } from 'react';
import { CalendarClock, Edit2, Plus, RefreshCw, Trash2, Users, Wallet } from 'lucide-react';
import { useData } from '../context/DataContext';
import { deletePlan } from '../data/services';
import PageHeader from '../components/ui/PageHeader';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import PlanModal from '../components/PlanModal';
import { Table, Thead, Th, Tbody, Tr, Td } from '../components/ui/Table';
import Badge from '../components/ui/Badge';
import Tabs from '../components/ui/Tabs';
import SearchInput from '../components/ui/SearchInput';
import Select from '../components/ui/Select';
import SubscriptionModal from '../components/SubscriptionModal';

const statusVariant = {
  active: 'success',
  pending: 'warning',
  expiring: 'warning',
  expired: 'danger',
};

export default function Memberships() {
  const { data, setData } = useData();
  const [activeTab, setActiveTab] = useState('plans');
  const [modalOpen, setModalOpen] = useState(false);
  const [editPlan, setEditPlan] = useState(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [subscriptionOpen, setSubscriptionOpen] = useState(false);
  const [subscriptionMode, setSubscriptionMode] = useState('renew');
  const [selectedMembership, setSelectedMembership] = useState(null);

  const openCreate = () => {
    setEditPlan(null);
    setModalOpen(true);
  };

  const openEdit = (p) => {
    setEditPlan(p);
    setModalOpen(true);
  };

  const handleDelete = (id) => {
    if (confirm('Delete this membership plan?')) {
      const { data: next } = deletePlan(data, id);
      setData(next);
    }
  };
  const today = new Date().toISOString().split('T')[0];
  const nextWeek = new Date();
  nextWeek.setDate(nextWeek.getDate() + 7);
  const weekLater = nextWeek.toISOString().split('T')[0];

  const membershipsByStatus = useMemo(() => ({
    active: data.memberships.filter((m) => m.status === 'active'),
    pending: data.memberships.filter((m) => m.status === 'pending'),
    expiring: data.memberships.filter(
      (m) => m.expiryDate > today && m.expiryDate <= weekLater
    ),
    expired: data.memberships.filter((m) => m.expiryDate < today),
  }), [data.memberships, today, weekLater]);

  const filteredPlans = useMemo(() => data.plans.filter((plan) => {
    const term = search.toLowerCase();
    return (!term || plan.name.toLowerCase().includes(term) || plan.description?.toLowerCase().includes(term))
      && (!statusFilter || plan.status === statusFilter);
  }), [data.plans, search, statusFilter]);
  const filteredMemberships = useMemo(() => (membershipsByStatus[activeTab] || []).filter((membership) => {
    const member = data.members.find((item) => item.id === membership.memberId);
    const term = search.toLowerCase();
    return !term || member?.fullName?.toLowerCase().includes(term) || member?.memberId?.toLowerCase().includes(term) || membership.planName.toLowerCase().includes(term);
  }), [activeTab, data.members, membershipsByStatus, search]);

  const openRenew = (membership, mode = 'renew') => {
    const member = data.members.find((item) => item.id === membership.memberId);
    if (!member) return;
    setSelectedMembership({ membership, member });
    setSubscriptionMode(mode);
    setSubscriptionOpen(true);
  };

  const tabs = [
    { key: 'plans', label: 'Membership Plans' },
    { key: 'active', label: 'Active' },
    { key: 'pending', label: 'Pending dues' },
    { key: 'expiring', label: 'Expiring' },
    { key: 'expired', label: 'Expired' },
  ];

  return (
    <div className="page-container">
      <PageHeader title="Memberships" subtitle="Plans, subscriptions, renewals and expiry follow-ups for your gym.">
        <Button icon={Plus} onClick={openCreate}>
          Create Plan
        </Button>
      </PageHeader>

      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: 'Active memberships', value: membershipsByStatus.active.length, icon: Users },
          { label: 'Pending dues', value: membershipsByStatus.pending.length, icon: Wallet },
          { label: 'Expiring in 7 days', value: membershipsByStatus.expiring.length, icon: CalendarClock },
          { label: 'Active plans', value: data.plans.filter((plan) => plan.status === 'active').length, icon: RefreshCw },
        ].map((metric) => <Card key={metric.label}><div className="flex items-center justify-between"><div><p className="text-xs font-medium uppercase tracking-wide text-gray-500">{metric.label}</p><p className="mt-2 text-2xl font-bold text-gray-900">{metric.value}</p></div><metric.icon className="h-5 w-5 text-primary-600" /></div></Card>)}
      </div>
      <Tabs tabs={tabs} active={activeTab} onChange={setActiveTab} />

      <div className="mt-4">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <SearchInput value={search} onChange={setSearch} placeholder={activeTab === 'plans' ? 'Search plans...' : 'Search members or plans...'} className="w-full sm:max-w-sm" />
          {activeTab === 'plans' && <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} options={[{ value: '', label: 'All plan statuses' }, { value: 'active', label: 'Active' }, { value: 'inactive', label: 'Inactive' }]} className="w-full sm:w-44" />}
        </div>
        {activeTab === 'plans' && (
          <Card>
            <Table>
              <Thead>
                <Tr>
                  <Th>Plan Name</Th>
                  <Th>Duration</Th>
                  <Th>Price</Th>
                  <Th>Features</Th>
                  <Th>Auto-renew</Th>
                  <Th>Status</Th>
                  <Th className="text-right">Actions</Th>
                </Tr>
              </Thead>
              <Tbody>
                {filteredPlans.map((p) => (
                  <Tr key={p.id}>
                    <Td className="font-medium text-gray-900">{p.name}</Td>
                    <Td>{p.durationMonths} month(s)</Td>
                    <Td>₹{p.price.toLocaleString('en-IN')}</Td>
                    <Td>{p.features.join(', ')}</Td>
                    <Td>{p.autoRenew ? 'Enabled' : 'Off'}</Td>
                    <Td><Badge variant={p.status === 'active' ? 'success' : 'default'}>{p.status}</Badge></Td>
                    <Td className="text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => openEdit(p)}
                          className="rounded p-1.5 text-gray-500 hover:bg-gray-100 hover:text-primary-600"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(p.id)}
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
          </Card>
        )}

        {['active', 'expiring', 'expired'].includes(activeTab) && (
          <Card>
            <Table>
              <Thead>
                <Tr>
                  <Th>Member ID</Th>
                  <Th>Plan</Th>
                  <Th>Start</Th>
                  <Th>Expiry</Th>
                  <Th>Amount</Th>
                  <Th>Paid</Th>
                  <Th>Pending</Th>
                  <Th>Status</Th>
                  <Th className="text-right">Action</Th>
                </Tr>
              </Thead>
              <Tbody>
                {filteredMemberships.map((m) => (
                  <Tr key={m.id}>
                    <Td>{m.memberId}</Td>
                    <Td>{m.planName}</Td>
                    <Td>{m.startDate}</Td>
                    <Td>{m.expiryDate}</Td>
                    <Td>₹{m.amount.toLocaleString('en-IN')}</Td>
                    <Td>₹{m.paidAmount.toLocaleString('en-IN')}</Td>
                    <Td>₹{m.pendingAmount.toLocaleString('en-IN')}</Td>
                    <Td><Badge variant={statusVariant[m.status]}>{m.status}</Badge></Td>
                    <Td className="text-right">
                      {activeTab !== 'expired' && <Button size="sm" variant="secondary" icon={RefreshCw} onClick={() => openRenew(m)}>Renew</Button>}
                    </Td>
                  </Tr>
                ))}
                {filteredMemberships.length === 0 && (
                  <Tr>
                    <Td colSpan={9} className="py-8 text-center text-gray-500">
                      No {activeTab} memberships.
                    </Td>
                  </Tr>
                )}
              </Tbody>
            </Table>
          </Card>
        )}
      </div>

      <PlanModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        plan={editPlan}
      />
      {selectedMembership && (
        <SubscriptionModal
          open={subscriptionOpen}
          onClose={() => setSubscriptionOpen(false)}
          mode={subscriptionMode}
          member={selectedMembership.member}
          membership={selectedMembership.membership}
        />
      )}
    </div>
  );
}
