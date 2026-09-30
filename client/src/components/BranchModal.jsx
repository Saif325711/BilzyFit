import { useState, useEffect } from 'react';
import { useData } from '../context/DataContext';
import { addBranch, updateBranch } from '../data/services';
import Modal from './ui/Modal';
import Input from './ui/Input';
import Button from './ui/Button';
import Select from './ui/Select';
import { Building2, MapPin, Phone, Mail, Clock, User, QrCode } from 'lucide-react';

const emptyForm = {
  name: '',
  branchCode: '',
  city: '',
  address: '',
  phone: '',
  email: '',
  timings: '6:00 AM – 10:30 PM',
  manager: '',
  upiId: '',
  status: 'active',
};

export default function BranchModal({ open, onClose, branch }) {
  const { data, setData, setActiveBranch } = useData();
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(false);
  const isEdit = Boolean(branch);

  useEffect(() => {
    if (open) {
      if (branch) {
        setForm({
          ...emptyForm,
          ...branch,
        });
      } else {
        const nextIdx = (data.settings?.branches?.length || 0) + 1;
        setForm({
          ...emptyForm,
          branchCode: `BR-${String(nextIdx).padStart(2, '0')}`,
        });
      }
    }
  }, [open, branch, data.settings?.branches]);

  const handleChange = (field, value) =>
    setForm((f) => ({ ...f, [field]: value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.city.trim()) return;
    setLoading(true);
    if (isEdit) {
      const { data: next } = updateBranch(data, branch.id, form);
      setData(next);
    } else {
      const { data: next, branch: newBranch } = addBranch(data, form);
      setData(next);
      // Auto-switch to newly created branch if owner wants
      if (newBranch?.name) {
        setActiveBranch(newBranch.name);
      }
    }
    setLoading(false);
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-100 text-primary-700">
            <Building2 className="h-4 w-4" />
          </div>
          <span>{isEdit ? 'Edit Gym Centre / Branch' : 'Add New Gym Centre'}</span>
        </div>
      }
      footer={
        <>
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" form="branch-form" disabled={loading}>
            {loading ? 'Saving...' : isEdit ? 'Update Centre' : 'Create Centre'}
          </Button>
        </>
      }
    >
      <form id="branch-form" onSubmit={handleSubmit} className="space-y-4">
        <div className="grid gap-3 sm:grid-cols-2">
          <Input
            label="Gym Centre / Branch Name *"
            value={form.name}
            onChange={(e) => handleChange('name', e.target.value)}
            placeholder="e.g. Star Fitness - Noida Hub"
            required
          />
          <Input
            label="Branch Code / Identifier"
            value={form.branchCode}
            onChange={(e) => handleChange('branchCode', e.target.value.toUpperCase())}
            placeholder="e.g. SFC-01"
          />
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <Input
            label="City *"
            value={form.city}
            onChange={(e) => handleChange('city', e.target.value)}
            placeholder="e.g. Noida, Delhi, Mumbai"
            required
          />
          <Input
            label="Contact Phone / Mobile"
            value={form.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
            placeholder="e.g. +91 98111 22334"
          />
        </div>

        <Input
          label="Full Centre Address"
          value={form.address}
          onChange={(e) => handleChange('address', e.target.value)}
          placeholder="e.g. Plot 18, Commercial Hub, Sector 62, Noida"
        />

        <div className="grid gap-3 sm:grid-cols-2">
          <Input
            label="Branch Email"
            type="email"
            value={form.email}
            onChange={(e) => handleChange('email', e.target.value)}
            placeholder="e.g. noida@bilzyfit.com"
          />
          <Input
            label="Operating Timings"
            value={form.timings}
            onChange={(e) => handleChange('timings', e.target.value)}
            placeholder="e.g. 5:30 AM – 10:30 PM"
          />
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <Input
            label="Manager / In-Charge Name"
            value={form.manager}
            onChange={(e) => handleChange('manager', e.target.value)}
            placeholder="e.g. Priya Sharma"
          />
          <Input
            label="Branch UPI ID (for QR receipts)"
            value={form.upiId}
            onChange={(e) => handleChange('upiId', e.target.value)}
            placeholder="e.g. gymname@upi"
          />
        </div>

        <div>
          <Select
            label="Operational Status"
            value={form.status}
            onChange={(e) => handleChange('status', e.target.value)}
            options={[
              { value: 'active', label: 'Active (Open for members)' },
              { value: 'maintenance', label: 'Under Renovation / Maintenance' },
              { value: 'coming_soon', label: 'Coming Soon' },
            ]}
          />
        </div>
      </form>
    </Modal>
  );
}
