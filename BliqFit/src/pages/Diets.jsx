import { useState } from 'react';
import { useData } from '../context/DataContext';
import { deleteDiet, assignDiet } from '../data/services';
import PageHeader from '../components/ui/PageHeader';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import DietModal from '../components/DietModal';
import AssignModal from '../components/AssignModal';
import { Plus, Apple, Trash2, Edit2, Users } from 'lucide-react';

export default function Diets() {
  const { data, setData } = useData();
  const [modalOpen, setModalOpen] = useState(false);
  const [editDiet, setEditDiet] = useState(null);
  const [assignOpen, setAssignOpen] = useState(false);
  const [assigningDiet, setAssigningDiet] = useState(null);

  const openCreate = () => {
    setEditDiet(null);
    setModalOpen(true);
  };

  const openEdit = (d) => {
    setEditDiet(d);
    setModalOpen(true);
  };

  const openAssign = (d) => {
    setAssigningDiet(d);
    setAssignOpen(true);
  };

  const handleAssign = (memberIds) => {
    if (!assigningDiet) return;
    const { data: next } = assignDiet(data, assigningDiet.id, memberIds);
    setData(next);
    setAssigningDiet(null);
  };

  const handleDelete = (id) => {
    if (confirm('Are you sure you want to delete this diet plan?')) {
      const { data: next } = deleteDiet(data, id);
      setData(next);
    }
  };

  return (
    <div className="page-container">
      <PageHeader title="Diet Plans" subtitle="Create and assign nutrition plans to members.">
        <Button icon={Plus} onClick={openCreate}>
          Create Diet
        </Button>
      </PageHeader>

      <div className="grid gap-4 lg:grid-cols-2">
        {data.diets.map((d) => (
          <Card key={d.id}>
            <div className="mb-3 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100 text-green-700">
                <Apple className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-semibold text-gray-900">{d.name}</h3>
                <p className="text-sm text-gray-500">{d.description}</p>
              </div>
              <span className="rounded-full bg-green-50 px-2.5 py-1 text-xs font-medium text-green-700">
                {d.source === 'member' ? 'Member-created' : 'Trainer recommended'}
              </span>
            </div>
            <p className="mb-3 text-sm font-semibold text-orange-700">
              {d.meals.reduce((total, meal) => total + (Number(meal.calories) || 0), 0)} kcal / day
            </p>
            <div className="space-y-2">
              {d.meals.map((meal, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50 px-3 py-2 text-sm"
                >
                  <div>
                    <p className="font-medium text-gray-800">{meal.type}</p>
                    <p className="text-xs text-gray-500">{meal.items}</p>
                  </div>
                  <p className="text-xs text-gray-500">
                    {meal.calories} kcal • P{meal.protein}g C{meal.carbs}g F{meal.fats}g
                  </p>
                </div>
              ))}
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <Button size="sm" variant="secondary" icon={Users} onClick={() => openAssign(d)}>
                Assign ({d.assignedTo?.length || 0})
              </Button>
              <Button size="sm" variant="ghost" icon={Edit2} onClick={() => openEdit(d)}>
                Edit
              </Button>
              <Button size="sm" variant="ghost" icon={Trash2} onClick={() => handleDelete(d.id)}>
                Delete
              </Button>
            </div>
          </Card>
        ))}
      </div>

      <DietModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        diet={editDiet}
      />

      <AssignModal
        open={assignOpen}
        onClose={() => setAssignOpen(false)}
        title={`Assign "${assigningDiet?.name}" to members`}
        assignedIds={assigningDiet?.assignedTo || []}
        onAssign={handleAssign}
      />
    </div>
  );
}
