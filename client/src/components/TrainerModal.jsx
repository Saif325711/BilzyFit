import { useState, useEffect } from 'react';
import { Camera } from 'lucide-react';
import { useData } from '../context/DataContext';
import { addTrainer, updateTrainer } from '../data/services';
import Modal from './ui/Modal';
import Input from './ui/Input';
import Select from './ui/Select';
import Button from './ui/Button';
import Avatar from './ui/Avatar';

const emptyForm = {
  name: '',
  phone: '',
  email: '',
  specialization: '',
  joiningDate: new Date().toISOString().split('T')[0],
  salary: '',
  status: 'active',
  assignedMembers: 0,
  photo: '',
};

const specializations = [
  'Strength & Conditioning',
  'Weight Loss',
  'Muscle Gain',
  'Yoga & Flexibility',
  'CrossFit',
  'Personal Training',
  'Nutrition',
  'Rehabilitation',
  'Other',
];

export default function TrainerModal({ open, onClose, trainer }) {
  const { data, setData } = useData();
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(false);
  const isEdit = Boolean(trainer);

  useEffect(() => {
    if (open) setForm(trainer ? { ...emptyForm, ...trainer } : emptyForm);
  }, [open, trainer]);

  const handleChange = (field, value) =>
    setForm((f) => ({ ...f, [field]: value }));

  const handlePhotoChange = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => handleChange('photo', reader.result);
    reader.readAsDataURL(file);
  };

  const removePhoto = () => handleChange('photo', '');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.phone.trim()) return;
    setLoading(true);
    const payload = {
      ...form,
      salary: Number(form.salary) || 0,
      assignedMembers: Number(form.assignedMembers) || 0,
    };
    if (isEdit) {
      const { data: next } = updateTrainer(data, trainer.id, payload);
      setData(next);
    } else {
      const { data: next } = addTrainer(data, payload);
      setData(next);
    }
    setLoading(false);
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEdit ? 'Edit Trainer' : 'Add Trainer'}
      size="md"
      footer={
        <>
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" form="trainer-form" disabled={loading}>
            {loading ? 'Saving...' : isEdit ? 'Update Trainer' : 'Add Trainer'}
          </Button>
        </>
      }
    >
      <form id="trainer-form" onSubmit={handleSubmit} className="space-y-4">
        <div className="flex items-center gap-4">
          <Avatar name={form.name} src={form.photo} size="lg" />
          <div className="flex-1">
            <label className="mb-1.5 block text-sm font-medium text-gray-700">Profile Photo</label>
            <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-600 transition-colors hover:bg-gray-50">
              <Camera className="h-4 w-4 text-primary-600" />
              <span>{form.photo ? 'Change Photo' : 'Upload Photo'}</span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handlePhotoChange(e.target.files[0])}
              />
            </label>
            {form.photo && (
              <button
                type="button"
                onClick={removePhoto}
                className="ml-3 text-sm text-red-600 hover:text-red-700"
              >
                Remove
              </button>
            )}
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
        <Input
          label="Name"
          value={form.name}
          onChange={(e) => handleChange('name', e.target.value)}
          required
        />
        <Input
          label="Phone"
          value={form.phone}
          onChange={(e) => handleChange('phone', e.target.value)}
          required
        />
        <Input
          label="Email"
          type="email"
          value={form.email}
          onChange={(e) => handleChange('email', e.target.value)}
        />
        <Select
          label="Specialization"
          value={form.specialization}
          onChange={(e) => handleChange('specialization', e.target.value)}
          options={specializations.map((s) => ({ value: s, label: s }))}
        />
        <Input
          label="Joining Date"
          type="date"
          value={form.joiningDate}
          onChange={(e) => handleChange('joiningDate', e.target.value)}
        />
        <Input
          label="Salary (₹)"
          type="number"
          min={0}
          value={form.salary}
          onChange={(e) => handleChange('salary', e.target.value)}
        />
        <Input
          label="Assigned Members"
          type="number"
          min={0}
          value={form.assignedMembers}
          onChange={(e) => handleChange('assignedMembers', e.target.value)}
        />
        <Select
          label="Status"
          value={form.status}
          onChange={(e) => handleChange('status', e.target.value)}
          options={[
            { value: 'active', label: 'Active' },
            { value: 'inactive', label: 'Inactive' },
          ]}
        />
        </div>
      </form>
    </Modal>
  );
}
