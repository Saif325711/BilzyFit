import { useState, useMemo } from 'react';
import { CalendarClock, Mail, Phone, Plus, Edit2, Target, Trash2, TrendingUp, Users } from 'lucide-react';
import { useData } from '../context/DataContext';
import PageHeader from '../components/ui/PageHeader';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import SearchInput from '../components/ui/SearchInput';
import Select from '../components/ui/Select';
import { Table, Thead, Th, Tbody, Tr, Td } from '../components/ui/Table';
import Badge from '../components/ui/Badge';
import LeadModal from '../components/LeadModal';
import EmptyState from '../components/ui/EmptyState';

const statusVariant = {
  'New Lead': 'info',
  Contacted: 'default',
  Interested: 'primary',
  Trial: 'warning',
  'Follow-up': 'warning',
  Converted: 'success',
  'Not Interested': 'danger',
};

export default function Leads() {
  const { data, setData } = useData();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editLead, setEditLead] = useState(null);
  const [sourceFilter, setSourceFilter] = useState('');
  const [attentionOnly, setAttentionOnly] = useState(false);

  const filtered = useMemo(() => {
    return data.leads.filter((l) => {
      const term = search.toLowerCase();
      const matchesSearch =
        l.name.toLowerCase().includes(term) || l.phone.includes(search);
      const matchesStatus = statusFilter ? l.status === statusFilter : true;
      const matchesSource = sourceFilter ? l.source === sourceFilter : true;
      const matchesAttention = attentionOnly
        ? l.followUpDate <= new Date().toISOString().split('T')[0] && !['Converted', 'Not Interested'].includes(l.status)
        : true;
      return matchesSearch && matchesStatus && matchesSource && matchesAttention;
    });
  }, [data.leads, search, statusFilter, sourceFilter, attentionOnly]);

  const handleDelete = (id) => {
    if (confirm('Delete this lead?')) {
      const next = { ...data, leads: data.leads.filter((l) => l.id !== id) };
      setData(next);
    }
  };

  const openAdd = () => {
    setEditLead(null);
    setModalOpen(true);
  };

  const openEdit = (lead) => {
    setEditLead(lead);
    setModalOpen(true);
  };

  return (
    <div className="page-container">
      <PageHeader title="Leads / CRM" subtitle="Track potential members and follow-ups.">
        <Button onClick={openAdd} icon={Plus}>Add Lead</Button>
      </PageHeader>

      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: 'Total leads', value: data.leads.length, icon: Users },
          { label: 'New leads', value: data.leads.filter((lead) => lead.status === 'New Lead').length, icon: Target },
          { label: 'Converted', value: data.leads.filter((lead) => lead.status === 'Converted').length, icon: TrendingUp },
          { label: 'Follow-ups due', value: data.leads.filter((lead) => lead.followUpDate <= new Date().toISOString().split('T')[0] && !['Converted', 'Not Interested'].includes(lead.status)).length, icon: CalendarClock },
        ].map((metric) => <Card key={metric.label}><div className="flex items-center justify-between"><div><p className="text-xs font-medium uppercase tracking-wide text-gray-500">{metric.label}</p><p className="mt-2 text-2xl font-bold text-gray-900">{metric.value}</p></div><metric.icon className="h-5 w-5 text-primary-600" /></div></Card>)}
      </div>
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Search leads..."
          className="w-full sm:max-w-sm"
        />
        <div className="flex flex-wrap gap-3">
          <Select value={sourceFilter} onChange={(e) => setSourceFilter(e.target.value)} options={[{ value: '', label: 'All sources' }, ...Array.from(new Set(data.leads.map((lead) => lead.source))).map((value) => ({ value, label: value }))]} className="w-full sm:w-40" />
          <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} options={[{ value: '', label: 'All statuses' }, ...['New Lead', 'Contacted', 'Interested', 'Trial', 'Follow-up', 'Converted', 'Not Interested'].map((value) => ({ value, label: value }))]} className="w-full sm:w-40" />
          <Button type="button" variant={attentionOnly ? 'primary' : 'secondary'} icon={CalendarClock} onClick={() => setAttentionOnly((value) => !value)}>Due today</Button>
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          title="No leads found"
          description="Start adding leads to grow your gym."
          actionLabel="Add Lead"
          onAction={openAdd}
        />
      ) : (
        <Card>
          <Table>
            <Thead>
              <Tr>
                <Th>Name</Th>
                <Th>Phone</Th>
                <Th>Source</Th>
                <Th>Interested Plan</Th>
                <Th>Assigned</Th>
                <Th>Follow-up</Th>
                <Th>Status</Th>
                <Th className="text-right">Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {filtered.map((l) => (
                <Tr key={l.id}>
                  <Td className="font-medium text-gray-900">{l.name}</Td>
                  <Td>{l.phone}</Td>
                  <Td>{l.source}</Td>
                  <Td>{l.interestedPlan}</Td>
                  <Td>{l.assignedTo || '—'}</Td>
                  <Td>{l.followUpDate}</Td>
                  <Td>
                    <Badge variant={statusVariant[l.status] || 'default'}>{l.status}</Badge>
                  </Td>
                  <Td className="text-right">
                    <div className="flex justify-end gap-2">
                      <a href={`tel:${l.phone}`} aria-label={`Call ${l.name}`} className="rounded p-1.5 text-gray-500 hover:bg-emerald-50 hover:text-emerald-600"><Phone className="h-4 w-4" /></a>
                      <a href={`mailto:${l.email}`} aria-label={`Email ${l.name}`} className="rounded p-1.5 text-gray-500 hover:bg-blue-50 hover:text-blue-600"><Mail className="h-4 w-4" /></a>
                      <button
                        onClick={() => openEdit(l)}
                        className="rounded p-1.5 text-gray-500 hover:bg-gray-100 hover:text-primary-600"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(l.id)}
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

      <LeadModal open={modalOpen} onClose={() => setModalOpen(false)} lead={editLead} />
    </div>
  );
}
