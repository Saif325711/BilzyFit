import { useState, useEffect } from 'react';
import { useData } from '../context/DataContext';
import { addLead, updateLead } from '../data/services';
import Modal from './ui/Modal';
import Input from './ui/Input';
import Select from './ui/Select';
import Textarea from './ui/Textarea';
import Button from './ui/Button';

const emptyLead = {
  name: '',
  phone: '',
  email: '',
  source: 'Walk-in',
  interestedPlan: 'Monthly',
  goal: 'Weight Loss',
  followUpDate: new Date().toISOString().split('T')[0],
  status: 'New Lead',
  notes: '',
  assignedTo: '',
  trialDate: '',
  lostReason: '',
};

export default function LeadModal({ open, onClose, lead }) {
  const { data, setData } = useData();
  const [form, setForm] = useState(emptyLead);
  const [loading, setLoading] = useState(false);
  const isEdit = Boolean(lead);

  useEffect(() => {
    setForm(open && lead ? { ...emptyLead, ...lead } : emptyLead);
  }, [open, lead]);

  const handleChange = (field, value) => setForm((f) => ({ ...f, [field]: value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      if (isEdit) {
        const { data: next } = updateLead(data, lead.id, form);
        setData(next);
      } else {
        const { data: next } = addLead(data, form);
        setData(next);
      }
      setLoading(false);
      onClose();
    }, 300);
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEdit ? 'Edit Lead' : 'Add Lead'}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" form="lead-form" disabled={loading}>
            {loading ? 'Saving...' : isEdit ? 'Save Changes' : 'Add Lead'}
          </Button>
        </>
      }
    >
      <form id="lead-form" onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
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
          label="Source"
          value={form.source}
          onChange={(e) => handleChange('source', e.target.value)}
          options={['Instagram', 'Walk-in', 'Referral', 'Google', 'Justdial', 'Facebook'].map((v) => ({ value: v, label: v }))}
        />
        <Select
          label="Assigned salesperson"
          value={form.assignedTo}
          onChange={(e) => handleChange('assignedTo', e.target.value)}
          options={[{ value: '', label: 'Unassigned' }, ...data.staff.filter((member) => member.status === 'active').map((member) => ({ value: member.name, label: member.name }))]}
        />
        <Input
          label="Trial date"
          type="date"
          value={form.trialDate}
          onChange={(e) => handleChange('trialDate', e.target.value)}
        />
        {form.status === 'Not Interested' && (
          <Input
            label="Lost reason"
            value={form.lostReason}
            onChange={(e) => handleChange('lostReason', e.target.value)}
            placeholder="Price, timing, moved away..."
          />
        )}
        <Select
          label="Interested Plan"
          value={form.interestedPlan}
          onChange={(e) => handleChange('interestedPlan', e.target.value)}
          options={['Monthly', 'Quarterly', 'Half Yearly', 'Yearly'].map((v) => ({ value: v, label: v }))}
        />
        <Select
          label="Goal"
          value={form.goal}
          onChange={(e) => handleChange('goal', e.target.value)}
          options={['Weight Loss', 'Muscle Gain', 'General Fitness', 'Strength', 'Bodybuilding', 'Endurance'].map((v) => ({ value: v, label: v }))}
        />
        <Input
          label="Follow-up Date"
          type="date"
          value={form.followUpDate}
          onChange={(e) => handleChange('followUpDate', e.target.value)}
        />
        <Select
          label="Status"
          value={form.status}
          onChange={(e) => handleChange('status', e.target.value)}
          options={['New Lead', 'Contacted', 'Interested', 'Trial', 'Follow-up', 'Converted', 'Not Interested'].map((v) => ({ value: v, label: v }))}
        />
        <Textarea
          label="Notes"
          value={form.notes}
          onChange={(e) => handleChange('notes', e.target.value)}
          className="sm:col-span-2"
        />
      </form>
    </Modal>
  );
}
