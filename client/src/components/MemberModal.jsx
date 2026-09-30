import { useState, useEffect } from 'react';
import { enrollMember, updateMember } from '../data/services';
import { fmtDate } from '../data/seed';
import { useData } from '../context/DataContext';
import Modal from './ui/Modal';
import Input from './ui/Input';
import Select from './ui/Select';
import Textarea from './ui/Textarea';
import Button from './ui/Button';

const emptyMember = {
  fullName: '',
  gender: 'Male',
  mobile: '',
  email: '',
  goal: 'General Fitness',
  status: 'active',
  joiningDate: new Date().toISOString().split('T')[0],
  address: '',
  emergencyContact: '',
  height: '',
  weight: '',
  bloodGroup: 'O+',
  notes: '',
  photo: '',
  branch: 'Delhi Branch',
};

export default function MemberModal({ open, onClose, member, onEnroll }) {
  const { data, setData } = useData();
  const [form, setForm] = useState(emptyMember);
  const [loading, setLoading] = useState(false);
  const isEdit = Boolean(member);

  const firstPlan = data.plans[0];
  const [planId, setPlanId] = useState(firstPlan?.id || '');
  const [startDate, setStartDate] = useState(fmtDate(new Date()));
  const [paymentAmount, setPaymentAmount] = useState(firstPlan?.price || 0);
  const [paymentMethod, setPaymentMethod] = useState('Cash');

  useEffect(() => {
    if (open) {
      setForm(member ? { ...emptyMember, ...member } : emptyMember);
      if (!isEdit && firstPlan) {
        setPlanId(firstPlan.id);
        setStartDate(fmtDate(new Date()));
        setPaymentAmount(firstPlan.price);
      }
    }
  }, [open, member, isEdit, firstPlan]);

  useEffect(() => {
    const selected = data.plans.find((p) => p.id === planId);
    if (selected) setPaymentAmount(selected.price);
  }, [planId, data.plans]);

  const handleChange = (field, value) => setForm((f) => ({ ...f, [field]: value }));

  const selectedPlan = data.plans.find((p) => p.id === planId);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      if (isEdit) {
        const { data: next } = updateMember(data, member.id, form);
        setData(next);
      } else {
        const { data: next, member: newMember } = enrollMember(data, form, {
          planId,
          startDate,
          paymentAmount: Number(paymentAmount),
          paymentMethod,
        });
        setData(next);
        onEnroll?.(newMember);
      }
      setLoading(false);
      onClose();
    }, 300);
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEdit ? 'Edit Member' : 'Add New Member'}
      size="lg"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" form="member-form" disabled={loading}>
            {loading ? 'Saving...' : isEdit ? 'Save Changes' : 'Add Member'}
          </Button>
        </>
      }
    >
      <form id="member-form" onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label="Full Name"
            value={form.fullName}
            onChange={(e) => handleChange('fullName', e.target.value)}
            required
          />
          <Select
            label="Gender"
            value={form.gender}
            onChange={(e) => handleChange('gender', e.target.value)}
            options={[
              { value: 'Male', label: 'Male' },
              { value: 'Female', label: 'Female' },
              { value: 'Other', label: 'Other' },
            ]}
          />
          <Input
            label="Mobile"
            value={form.mobile}
            onChange={(e) => handleChange('mobile', e.target.value)}
            required
          />
          <Input
            label="Email"
            type="email"
            value={form.email}
            onChange={(e) => handleChange('email', e.target.value)}
          />
          <Select
            label="Goal"
            value={form.goal}
            onChange={(e) => handleChange('goal', e.target.value)}
            options={[
              { value: 'Weight Loss', label: 'Weight Loss' },
              { value: 'Muscle Gain', label: 'Muscle Gain' },
              { value: 'General Fitness', label: 'General Fitness' },
              { value: 'Strength', label: 'Strength' },
              { value: 'Bodybuilding', label: 'Bodybuilding' },
              { value: 'Endurance', label: 'Endurance' },
            ]}
          />
          <Select
            label="Status"
            value={form.status}
            onChange={(e) => handleChange('status', e.target.value)}
            options={[
              { value: 'active', label: 'Active' },
              { value: 'inactive', label: 'Inactive' },
              { value: 'expiring', label: 'Expiring' },
              { value: 'expired', label: 'Expired' },
            ]}
          />
          <Input
            label="Joining Date"
            type="date"
            value={form.joiningDate}
            onChange={(e) => handleChange('joiningDate', e.target.value)}
          />
          <Input
            label="Emergency Contact"
            value={form.emergencyContact}
            onChange={(e) => handleChange('emergencyContact', e.target.value)}
          />
          <Input
            label="Height (cm)"
            type="number"
            value={form.height}
            onChange={(e) => handleChange('height', Number(e.target.value))}
          />
          <Input
            label="Weight (kg)"
            type="number"
            value={form.weight}
            onChange={(e) => handleChange('weight', Number(e.target.value))}
          />
          <Select
            label="Blood Group"
            value={form.bloodGroup}
            onChange={(e) => handleChange('bloodGroup', e.target.value)}
            options={['A+', 'B+', 'O+', 'AB+', 'A-', 'B-', 'O-', 'AB-'].map((v) => ({ value: v, label: v }))}
          />
          <Input
            label="Address"
            value={form.address}
            onChange={(e) => handleChange('address', e.target.value)}
          />
          <Textarea
            label="Notes"
            value={form.notes}
            onChange={(e) => handleChange('notes', e.target.value)}
            className="sm:col-span-2"
          />
        </div>

        {!isEdit && (
          <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
            <h3 className="mb-3 text-sm font-semibold text-gray-900">Membership & Payment</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <Select
                label="Membership Plan"
                value={planId}
                onChange={(e) => setPlanId(e.target.value)}
                options={data.plans.map((p) => ({ value: p.id, label: `${p.name} — ₹${p.price.toLocaleString('en-IN')}` }))}
              />
              <Input
                label="Start Date"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
              <Input
                label="Plan Price (₹)"
                type="number"
                value={selectedPlan?.price || 0}
                disabled
              />
              <Input
                label="Payment Amount (₹)"
                type="number"
                value={paymentAmount}
                onChange={(e) => setPaymentAmount(e.target.value)}
              />
              <Select
                label="Payment Method"
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                options={[
                  { value: 'Cash', label: 'Cash' },
                  { value: 'UPI', label: 'UPI' },
                  { value: 'Card', label: 'Card' },
                  { value: 'Bank Transfer', label: 'Bank Transfer' },
                  { value: 'Online', label: 'Online Payment' },
                ]}
              />
            </div>
          </div>
        )}
      </form>
    </Modal>
  );
}
