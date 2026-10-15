import { useState } from 'react';
import { useData } from '../context/DataContext';
import { deleteWorkout, assignWorkout } from '../data/services';
import PageHeader from '../components/ui/PageHeader';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import WorkoutModal from '../components/WorkoutModal';
import AssignModal from '../components/AssignModal';
import { Plus, Dumbbell, Video, Trash2, Edit2, Users } from 'lucide-react';

export default function Workouts() {
  const { data, setData } = useData();
  const [modalOpen, setModalOpen] = useState(false);
  const [editWorkout, setEditWorkout] = useState(null);
  const [assignOpen, setAssignOpen] = useState(false);
  const [assigningWorkout, setAssigningWorkout] = useState(null);

  const openCreate = () => {
    setEditWorkout(null);
    setModalOpen(true);
  };

  const openEdit = (w) => {
    setEditWorkout(w);
    setModalOpen(true);
  };

  const openAssign = (w) => {
    setAssigningWorkout(w);
    setAssignOpen(true);
  };

  const handleAssign = (memberIds) => {
    if (!assigningWorkout) return;
    const { data: next } = assignWorkout(data, assigningWorkout.id, memberIds);
    setData(next);
    setAssigningWorkout(null);
  };

  const handleDelete = (id) => {
    if (confirm('Are you sure you want to delete this workout plan?')) {
      const { data: next } = deleteWorkout(data, id);
      setData(next);
    }
  };

  return (
    <div className="page-container">
      <PageHeader title="Workout Plans" subtitle="Create and assign workout plans to members.">
        <Button icon={Plus} onClick={openCreate}>
          Create Workout
        </Button>
      </PageHeader>

      <div className="grid gap-4 lg:grid-cols-2">
        {data.workouts.map((w) => (
          <Card key={w.id}>
            <div className="mb-3 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-100 text-primary-700">
                <Dumbbell className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{w.name}</h3>
                <p className="text-sm text-gray-500">{w.focus || w.description}</p>
              </div>
            </div>
            <div className="space-y-2">
              {w.exercises.map((ex, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50 px-3 py-2 text-sm"
                >
                  <span className="flex items-center gap-2 font-medium text-gray-800">
                    {ex.name}
                    {ex.video && <Video className="h-3.5 w-3.5 text-primary-600" />}
                  </span>
                  <span className="text-gray-500">
                    {ex.sets} Sets x {ex.reps} • Rest {ex.rest}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="rounded-full bg-primary-50 px-2.5 py-1 text-xs font-medium text-primary-700">
                {w.source === 'member' ? 'Member-created' : 'Trainer recommended'}
              </span>
              <Button size="sm" variant="secondary" icon={Users} onClick={() => openAssign(w)}>
                Assign ({w.assignedTo?.length || 0})
              </Button>
              <Button size="sm" variant="ghost" icon={Edit2} onClick={() => openEdit(w)}>
                Edit
              </Button>
              <Button size="sm" variant="ghost" icon={Trash2} onClick={() => handleDelete(w.id)}>
                Delete
              </Button>
            </div>
          </Card>
        ))}
      </div>

      <WorkoutModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        workout={editWorkout}
      />

      <AssignModal
        open={assignOpen}
        onClose={() => setAssignOpen(false)}
        title={`Assign "${assigningWorkout?.name}" to members`}
        assignedIds={assigningWorkout?.assignedTo || []}
        onAssign={handleAssign}
      />
    </div>
  );
}
