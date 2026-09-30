import { useMemo, useState } from 'react';
import { useData } from '../context/DataContext';
import { deleteTrainer } from '../data/services';
import PageHeader from '../components/ui/PageHeader';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import TrainerModal from '../components/TrainerModal';
import Avatar from '../components/ui/Avatar';
import Badge from '../components/ui/Badge';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import SearchInput from '../components/ui/SearchInput';
import Select from '../components/ui/Select';
import EmptyState from '../components/ui/EmptyState';

const statusVariant = {
  active: 'success',
  inactive: 'default',
};

export default function Trainers() {
  const { data, setData } = useData();
  const [modalOpen, setModalOpen] = useState(false);
  const [editTrainer, setEditTrainer] = useState(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [specializationFilter, setSpecializationFilter] = useState('');

  const openCreate = () => {
    setEditTrainer(null);
    setModalOpen(true);
  };

  const openEdit = (t) => {
    setEditTrainer(t);
    setModalOpen(true);
  };

  const handleDelete = (id) => {
    if (confirm('Delete this trainer?')) {
      const { data: next } = deleteTrainer(data, id);
      setData(next);
    }
  };

  const filtered = useMemo(() => data.trainers.filter((trainer) => {
    const term = search.toLowerCase();
    return (!term || trainer.name.toLowerCase().includes(term) || trainer.specialization.toLowerCase().includes(term))
      && (!statusFilter || trainer.status === statusFilter)
      && (!specializationFilter || trainer.specialization === specializationFilter);
  }), [data.trainers, search, statusFilter, specializationFilter]);
  const activeCount = data.trainers.filter((trainer) => trainer.status === 'active').length;
  const assignedCount = data.trainers.reduce((sum, trainer) => sum + Number(trainer.assignedMembers || 0), 0);

  return (
    <div className="page-container">
      <PageHeader title="Trainers" subtitle="Trainer profiles, schedules and performance.">
        <Button icon={Plus} onClick={openCreate}>
          Add Trainer
        </Button>
      </PageHeader>

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        {[['Total trainers', data.trainers.length], ['Active trainers', activeCount], ['Assigned members', assignedCount]].map(([label, value]) => (
          <Card key={label}><p className="text-xs font-medium uppercase tracking-wide text-gray-500">{label}</p><p className="mt-2 text-2xl font-bold text-gray-900">{value}</p></Card>
        ))}
      </div>
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <SearchInput value={search} onChange={setSearch} placeholder="Search trainers..." className="w-full sm:max-w-sm" />
        <div className="flex gap-3">
          <Select value={specializationFilter} onChange={(e) => setSpecializationFilter(e.target.value)} options={[{ value: '', label: 'All specializations' }, ...Array.from(new Set(data.trainers.map((trainer) => trainer.specialization))).map((value) => ({ value, label: value }))]} className="w-full sm:w-52" />
          <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} options={[{ value: '', label: 'All statuses' }, { value: 'active', label: 'Active' }, { value: 'inactive', label: 'Inactive' }]} className="w-full sm:w-36" />
        </div>
      </div>
      {filtered.length === 0 ? <EmptyState title="No trainers found" description="Try changing your filters or add a new trainer." actionLabel="Add Trainer" onAction={openCreate} /> : <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((t) => (
          <Card key={t.id}>
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-4">
                <Avatar name={t.name} src={t.photo} size="lg" />
                <div>
                  <h3 className="font-semibold text-gray-900">{t.name}</h3>
                  <p className="text-sm text-gray-500">{t.specialization}</p>
                  <Badge variant={statusVariant[t.status] || 'success'} className="mt-2">{t.status}</Badge>
                </div>
              </div>
              <div className="flex gap-1">
                <button
                  onClick={() => openEdit(t)}
                  className="rounded p-1.5 text-gray-400 hover:bg-gray-100 hover:text-primary-600"
                >
                  <Edit2 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDelete(t.id)}
                  className="rounded p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-600"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
            <div className="mt-4 space-y-2 text-sm text-gray-600">
              <p><span className="font-medium text-gray-900">Phone:</span> {t.phone}</p>
              <p><span className="font-medium text-gray-900">Email:</span> {t.email}</p>
              <p><span className="font-medium text-gray-900">Joined:</span> {t.joiningDate}</p>
              <p><span className="font-medium text-gray-900">Salary:</span> ₹{Number(t.salary).toLocaleString('en-IN')}</p>
              <div className="rounded-lg bg-primary-50 px-3 py-2 text-sm text-primary-800"><span className="font-semibold">{t.assignedMembers}</span> assigned members</div>
            </div>
          </Card>
        ))}
      </div>}

      <TrainerModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        trainer={editTrainer}
      />
    </div>
  );
}
