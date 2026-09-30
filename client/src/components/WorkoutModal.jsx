import { useState, useEffect } from 'react';
import { Plus, Trash2, Video } from 'lucide-react';
import { useData } from '../context/DataContext';
import { addWorkout, updateWorkout } from '../data/services';
import Modal from './ui/Modal';
import Input from './ui/Input';
import Textarea from './ui/Textarea';
import Button from './ui/Button';

const emptyExercise = {
  name: '',
  sets: '',
  reps: '',
  rest: '',
  video: '',
  videoName: '',
};

const emptyForm = {
  name: '',
  focus: '',
  description: '',
  exercises: [{ ...emptyExercise }],
};

export default function WorkoutModal({ open, onClose, workout }) {
  const { data, setData } = useData();
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(false);
  const isEdit = Boolean(workout);

  useEffect(() => {
    if (open) {
      setForm(
        workout
          ? { ...emptyForm, ...workout, exercises: workout.exercises?.length ? workout.exercises : [{ ...emptyExercise }] }
          : emptyForm
      );
    }
  }, [open, workout]);

  const handleChange = (field, value) =>
    setForm((f) => ({ ...f, [field]: value }));

  const handleExerciseChange = (index, field, value) => {
    setForm((f) => {
      const exercises = [...f.exercises];
      exercises[index] = { ...exercises[index], [field]: value };
      return { ...f, exercises };
    });
  };

  const handleVideoChange = (index, file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setForm((f) => {
        const exercises = [...f.exercises];
        exercises[index] = {
          ...exercises[index],
          video: reader.result,
          videoName: file.name,
        };
        return { ...f, exercises };
      });
    };
    reader.readAsDataURL(file);
  };

  const removeVideo = (index) => {
    setForm((f) => {
      const exercises = [...f.exercises];
      exercises[index] = { ...exercises[index], video: '', videoName: '' };
      return { ...f, exercises };
    });
  };

  const addExercise = () =>
    setForm((f) => ({ ...f, exercises: [...f.exercises, { ...emptyExercise }] }));

  const removeExercise = (index) =>
    setForm((f) => ({
      ...f,
      exercises: f.exercises.filter((_, i) => i !== index),
    }));

  const handleSubmit = (e) => {
    e.preventDefault();
    const validExercises = form.exercises.filter((ex) => ex.name.trim());
    if (!form.name.trim() || validExercises.length === 0) {
      alert('Please enter a workout name and at least one exercise.');
      return;
    }
    setLoading(true);
    const payload = { ...form, exercises: validExercises };
    if (isEdit) {
      const { data: next } = updateWorkout(data, workout.id, payload);
      setData(next);
    } else {
      const { data: next } = addWorkout(data, payload);
      setData(next);
    }
    setLoading(false);
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEdit ? 'Edit Workout Plan' : 'Create Workout Plan'}
      size="lg"
      footer={
        <>
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" form="workout-form" disabled={loading}>
            {loading ? 'Saving...' : isEdit ? 'Update Workout' : 'Save Workout'}
          </Button>
        </>
      }
    >
      <form id="workout-form" onSubmit={handleSubmit} className="space-y-5">
        <Input
          label="Workout Name"
          value={form.name}
          onChange={(e) => handleChange('name', e.target.value)}
          placeholder="e.g. Muscle Gain - Beginner"
          required
        />
        <Input
          label="Training Focus / Day"
          value={form.focus}
          onChange={(e) => handleChange('focus', e.target.value)}
          placeholder="e.g. Back + Biceps or Chest"
        />
        <Textarea
          label="Description"
          value={form.description}
          onChange={(e) => handleChange('description', e.target.value)}
          placeholder="Short goal or notes for this plan"
          rows={3}
        />

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold text-gray-900">Exercises</h4>
            <Button
              type="button"
              size="sm"
              variant="outline"
              icon={Plus}
              onClick={addExercise}
            >
              Add Exercise
            </Button>
          </div>

          {form.exercises.map((ex, idx) => (
            <div
              key={idx}
              className="rounded-xl border border-gray-200 bg-gray-50 p-4"
            >
              <div className="mb-3 grid gap-3 sm:grid-cols-5">
                <Input
                  label={idx === 0 ? 'Exercise Name' : undefined}
                  value={ex.name}
                  onChange={(e) => handleExerciseChange(idx, 'name', e.target.value)}
                  placeholder="Bench Press"
                  className="sm:col-span-2"
                />
                <Input
                  label={idx === 0 ? 'Sets' : undefined}
                  type="number"
                  min={1}
                  value={ex.sets}
                  onChange={(e) => handleExerciseChange(idx, 'sets', e.target.value)}
                  placeholder="4"
                />
                <Input
                  label={idx === 0 ? 'Reps' : undefined}
                  value={ex.reps}
                  onChange={(e) => handleExerciseChange(idx, 'reps', e.target.value)}
                  placeholder="10-12"
                />
                <Input
                  label={idx === 0 ? 'Rest' : undefined}
                  value={ex.rest}
                  onChange={(e) => handleExerciseChange(idx, 'rest', e.target.value)}
                  placeholder="90s"
                />
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
                <div className="flex-1">
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    Demo Video (optional)
                  </label>
                  <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-600 transition-colors hover:bg-gray-50">
                    <Video className="h-4 w-4 text-primary-600" />
                    <span className="truncate">
                      {ex.videoName || 'Upload video'}
                    </span>
                    <input
                      type="file"
                      accept="video/*"
                      className="hidden"
                      onChange={(e) => handleVideoChange(idx, e.target.files[0])}
                    />
                  </label>
                </div>
                {ex.video && (
                  <>
                    <button
                      type="button"
                      onClick={() => removeVideo(idx)}
                      className="rounded-lg px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      Remove
                    </button>
                    <video
                      src={ex.video}
                      controls
                      className="h-24 w-40 rounded-lg border border-gray-200 bg-black object-cover"
                    />
                  </>
                )}
              </div>

              {form.exercises.length > 1 && (
                <div className="mt-3 flex justify-end">
                  <button
                    type="button"
                    onClick={() => removeExercise(idx)}
                    className="inline-flex items-center gap-1 text-xs font-medium text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Remove Exercise
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </form>
    </Modal>
  );
}
