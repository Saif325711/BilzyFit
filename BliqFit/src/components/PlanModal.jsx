import { useState, useEffect } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { useData } from '../context/DataContext';
import { addPlan, updatePlan } from '../data/services';
import Modal from './ui/Modal';
import Input from './ui/Input';
import Textarea from './ui/Textarea';
import Select from './ui/Select';
import Button from './ui/Button';

const emptyForm = {
  name: '',
  durationMonths: 1,
  price: '',
  description: '',
  features: [''],
  ptSessions: 0,
  autoRenew: false,
  status: 'active',
};

export default function PlanModal({ open, onClose, plan }) {
  const { data, setData } = useData();
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(false);
  const isEdit = Boolean(plan);

  useEffect(() => {
    if (open) {
      setForm(
        plan
          ? { ...emptyForm, ...plan, features: plan.features?.length ? plan.features : [''] }
          : emptyForm
      );
    }
  }, [open, plan]);

  const handleChange = (field, value) =>
    setForm((f) => ({ ...f, [field]: value }));

  const handleFeatureChange = (idx, value) => {
    setForm((f) => {
      const features = [...f.features];
      features[idx] = value;
      return { ...f, features };
    });
  };

  const addFeature = () =>
    setForm((f) => ({ ...f, features: [...f.features, ''] }));

  const removeFeature = (idx) =>
    setForm((f) => ({
      ...f,
      features: f.features.filter((_, i) => i !== idx),
    }));

  const handleSubmit = (e) => {
    e.preventDefault();
    const features = form.features.filter((f) => f.trim());
    if (!form.name.trim() || !form.price || !form.durationMonths) return;
    setLoading(true);
    const payload = {
      ...form,
      price: Number(form.price),
      durationMonths: Number(form.durationMonths),
      ptSessions: Number(form.ptSessions) || 0,
      features,
    };
    if (isEdit) {
      const { data: next } = updatePlan(data, plan.id, payload);
      setData(next);
    } else {
      const { data: next } = addPlan(data, payload);
      setData(next);
    }
    setLoading(false);
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEdit ? 'Edit Plan' : 'Create Plan'}
      size="md"
      footer={
        <>
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" form="plan-form" disabled={loading}>
            {loading ? 'Saving...' : isEdit ? 'Update Plan' : 'Create Plan'}
          </Button>
        </>
      }
    >
      <form id="plan-form" onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Plan Name"
          value={form.name}
          onChange={(e) => handleChange('name', e.target.value)}
          placeholder="e.g. Monthly"
          required
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label="Duration (months)"
            type="number"
            min={1}
            value={form.durationMonths}
            onChange={(e) => handleChange('durationMonths', e.target.value)}
            required
          />
          <Input
            label="Price (₹)"
            type="number"
            min={0}
            value={form.price}
            onChange={(e) => handleChange('price', e.target.value)}
            required
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Input label="Included PT sessions" type="number" min={0} value={form.ptSessions} onChange={(e) => handleChange('ptSessions', e.target.value)} />
          <label className="flex items-center gap-2 self-end rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700">
            <input type="checkbox" checked={Boolean(form.autoRenew)} onChange={(e) => handleChange('autoRenew', e.target.checked)} />
            Enable auto-renewal
          </label>
        </div>
        <Textarea
          label="Description"
          value={form.description}
          onChange={(e) => handleChange('description', e.target.value)}
          placeholder="What this plan includes"
          rows={2}
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

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold text-gray-900">Features</h4>
            <Button type="button" size="sm" variant="outline" icon={Plus} onClick={addFeature}>
              Add Feature
            </Button>
          </div>
          {form.features.map((feat, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <Input
                value={feat}
                onChange={(e) => handleFeatureChange(idx, e.target.value)}
                placeholder="e.g. Gym Access"
              />
              {form.features.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeFeature(idx)}
                  className="rounded-lg p-2 text-gray-400 hover:bg-red-50 hover:text-red-600"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      </form>
    </Modal>
  );
}
