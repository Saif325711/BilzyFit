import { useMemo, useState } from 'react';
import { useData } from '../context/DataContext';
import { deleteBranch } from '../data/services';
import PageHeader from '../components/ui/PageHeader';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import BranchModal from '../components/BranchModal';
import { Building2, Plus, Edit2, Trash2, MapPin, Phone, Clock, Check, Globe2, Users, IndianRupee } from 'lucide-react';
import SearchInput from '../components/ui/SearchInput';
import EmptyState from '../components/ui/EmptyState';

export default function Branches() {
  const { data, setData, activeBranch, setActiveBranch, getBranchStats, currentBranch } = useData();
  const [modalOpen, setModalOpen] = useState(false);
  const [editBranch, setEditBranch] = useState(null);
  const [search, setSearch] = useState('');

  const openCreate = () => {
    setEditBranch(null);
    setModalOpen(true);
  };

  const openEdit = (b) => {
    setEditBranch(b);
    setModalOpen(true);
  };

  const handleDelete = (id, name) => {
    if (confirm(`Are you sure you want to delete ${name}? Members will be reassigned.`)) {
      const { data: next } = deleteBranch(data, id);
      setData(next);
      if (activeBranch === name) setActiveBranch('all');
    }
  };

  const branches = useMemo(
    () => (data.settings.branches || []).filter((branch) => {
      const term = search.toLowerCase();
      return !term || branch.name.toLowerCase().includes(term) || (branch.city && branch.city.toLowerCase().includes(term));
    }),
    [data.settings.branches, search]
  );

  return (
    <div className="page-container">
      <PageHeader title="Gym Centres & Branches" subtitle="Manage multiple gym branches and switch active workspace location.">
        <Button icon={Plus} onClick={openCreate}>
          Add Gym Branch
        </Button>
      </PageHeader>

      {/* Current Active Scope Banner */}
      <div className="mb-6 flex flex-col gap-4 rounded-2xl border border-primary-100 bg-gradient-to-r from-primary-50 via-white to-primary-50/40 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-600 text-white shadow-sm">
            <Building2 className="h-6 w-6" />
          </div>
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-primary-700">Currently Active Gym Centre</span>
            <p className="mt-0.5 text-base font-bold text-gray-900">
              {activeBranch === 'all' ? '🌐 All Gym Centres (Consolidated View)' : (currentBranch?.name || activeBranch)}
              {currentBranch?.city && <span className="ml-1.5 text-sm font-normal text-gray-500">({currentBranch.city})</span>}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {activeBranch !== 'all' ? (
            <Button
              size="sm"
              variant="secondary"
              icon={Globe2}
              onClick={() => setActiveBranch('all')}
            >
              View All Centres Consolidated
            </Button>
          ) : (
            <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800">
              Consolidated Multi-Branch View
            </span>
          )}
        </div>
      </div>

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <Card>
          <p className="text-xs font-medium uppercase tracking-wide text-gray-500">Total gym branches</p>
          <p className="mt-2 text-2xl font-bold text-gray-900">{data.settings.branches?.length || 0}</p>
        </Card>
        <Card>
          <p className="text-xs font-medium uppercase tracking-wide text-gray-500">Total members</p>
          <p className="mt-2 text-2xl font-bold text-gray-900">{data.members.length}</p>
        </Card>
        <Card>
          <p className="text-xs font-medium uppercase tracking-wide text-gray-500">Active memberships</p>
          <p className="mt-2 text-2xl font-bold text-emerald-600">{data.memberships.filter((m) => m.status === 'active').length}</p>
        </Card>
      </div>

      <div className="mb-4">
        <SearchInput value={search} onChange={setSearch} placeholder="Search branch name or city..." className="w-full sm:max-w-sm" />
      </div>

      {branches.length === 0 ? (
        <EmptyState
          title="No branches found"
          description="Add your first gym branch to manage locations separately."
          actionLabel="Add Branch"
          onAction={openCreate}
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {branches.map((b) => {
            const isActive = activeBranch === b.name;
            const stats = getBranchStats(b.name);
            return (
              <Card
                key={b.id}
                className={`flex flex-col justify-between transition-all ${
                  isActive ? 'border-primary-500 bg-primary-50/20 ring-2 ring-primary-500/20 shadow-md' : 'hover:shadow-sm'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${isActive ? 'bg-primary-600 text-white' : 'bg-primary-100 text-primary-700'}`}>
                        <Building2 className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h3 className="font-semibold text-gray-900">{b.name}</h3>
                          {b.branchCode && (
                            <span className="rounded bg-gray-100 px-1.5 py-0.2 text-[10px] font-bold text-gray-600 uppercase">
                              {b.branchCode}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-500">{b.city || 'Location'}</p>
                      </div>
                    </div>
                    {isActive && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-800">
                        <Check className="h-3 w-3" /> Active
                      </span>
                    )}
                  </div>

                  {/* Branch info */}
                  <div className="mt-3 space-y-1 text-xs text-gray-500">
                    {b.address && (
                      <p className="flex items-center gap-1.5 truncate">
                        <MapPin className="h-3.5 w-3.5 text-gray-400 shrink-0" />
                        <span className="truncate">{b.address}</span>
                      </p>
                    )}
                    {b.phone && (
                      <p className="flex items-center gap-1.5">
                        <Phone className="h-3.5 w-3.5 text-gray-400 shrink-0" />
                        <span>{b.phone}</span>
                      </p>
                    )}
                    {b.timings && (
                      <p className="flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5 text-gray-400 shrink-0" />
                        <span>{b.timings}</span>
                      </p>
                    )}
                  </div>

                  {/* Quick stats strip */}
                  <div className="mt-4 grid grid-cols-3 gap-2 rounded-lg bg-gray-50 p-2 text-center text-xs">
                    <div>
                      <span className="text-[10px] text-gray-400 uppercase">Members</span>
                      <p className="font-bold text-gray-800">{stats.totalMembers}</p>
                    </div>
                    <div>
                      <span className="text-[10px] text-gray-400 uppercase">Active</span>
                      <p className="font-bold text-emerald-600">{stats.activeMembers}</p>
                    </div>
                    <div>
                      <span className="text-[10px] text-gray-400 uppercase">Revenue</span>
                      <p className="font-bold text-gray-800">₹{(stats.totalRevenue / 1000).toFixed(0)}k</p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-3">
                  <div className="flex gap-1">
                    <button
                      onClick={() => openEdit(b)}
                      className="rounded p-1.5 text-gray-400 hover:bg-gray-100 hover:text-primary-600"
                      title="Edit Branch"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    {data.settings.branches.length > 1 && (
                      <button
                        onClick={() => handleDelete(b.id, b.name)}
                        className="rounded p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-600"
                        title="Delete Branch"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>

                  {isActive ? (
                    <span className="text-xs font-semibold text-primary-700">Currently Managing</span>
                  ) : (
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => setActiveBranch(b.name)}
                    >
                      Switch to this Branch
                    </Button>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      )}

      <BranchModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditBranch(null);
        }}
        branch={editBranch}
      />
    </div>
  );
}
