import { useState, useMemo, useEffect } from 'react';
import { useData } from '../context/DataContext';
import { collectPayment } from '../data/services';
import Modal from './ui/Modal';
import Input from './ui/Input';
import Select from './ui/Select';
import Textarea from './ui/Textarea';
import Button from './ui/Button';

const methods = ['Cash', 'UPI', 'Card', 'Bank Transfer', 'Online'];

const emptyForm = {
  memberId: '',
  amount: '',
  method: 'Cash',
  date: new Date().toISOString().split('T')[0],
  notes: '',
  discount: 0,
  coupon: '',
};

export default function CollectPaymentModal({ open, onClose }) {
  const { data, setData } = useData();
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(false);

  const membersWithPending = useMemo(
    () =>
      data.members
        .map((m) => {
          const membership = data.memberships.find((ms) => ms.memberId === m.id);
          return { ...m, pending: membership?.pendingAmount || 0 };
        })
        .filter((m) => m.pending > 0),
    [data.members, data.memberships]
  );

  useEffect(() => {
    if (open) {
      const first = membersWithPending[0];
      setForm({
        ...emptyForm,
        memberId: first?.id || '',
        amount: first?.pending || '',
      });
    }
  }, [open, membersWithPending]);

  const handleChange = (field, value) =>
    setForm((f) => ({ ...f, [field]: value }));

  const selectedMember = membersWithPending.find((m) => m.id === form.memberId);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.memberId || !form.amount) return;
    setLoading(true);
    const { data: next } = collectPayment(data, {
      memberId: form.memberId,
      amount: Number(form.amount),
      method: form.method,
      date: form.date,
      notes: form.notes,
      discount: Number(form.discount),
      coupon: form.coupon,
      gstRate: Number(data.settings.defaultGstRate) || 0,
    });
    setData(next);
    setLoading(false);
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Collect Payment"
      size="md"
      footer={
        <>
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" form="collect-payment-form" disabled={loading || membersWithPending.length === 0}>
            {loading ? 'Saving...' : 'Record Payment'}
          </Button>
        </>
      }
    >
      <form id="collect-payment-form" onSubmit={handleSubmit} className="space-y-4">
        {membersWithPending.length === 0 ? (
          <p className="text-sm text-gray-600">No members with pending payments.</p>
        ) : (
          <>
            <Select
              label="Member"
              value={form.memberId}
              onChange={(e) => {
                const id = e.target.value;
                const m = membersWithPending.find((x) => x.id === id);
                setForm((f) => ({
                  ...f,
                  memberId: id,
                  amount: m?.pending || '',
                }));
              }}
              options={membersWithPending.map((m) => ({
                value: m.id,
                label: `${m.fullName} — ₹${m.pending.toLocaleString('en-IN')} pending`,
              }))}
            />
            {selectedMember && (
              <p className="text-xs text-gray-500">
                Pending: ₹{selectedMember.pending.toLocaleString('en-IN')}
              </p>
            )}
            <Input
              label="Amount (₹)"
              type="number"
              min={1}
              value={form.amount}
              onChange={(e) => handleChange('amount', e.target.value)}
              required
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <Input label="Discount (₹)" type="number" min={0} value={form.discount} onChange={(e) => handleChange('discount', e.target.value)} />
              <Input label="Coupon code" value={form.coupon} onChange={(e) => handleChange('coupon', e.target.value.toUpperCase())} />
            </div>
            {data.settings.gstin && <p className="text-xs text-gray-500">GST invoice: {data.settings.gstin} at {data.settings.defaultGstRate || 0}%</p>}
            <Select
              label="Payment Method"
              value={form.method}
              onChange={(e) => handleChange('method', e.target.value)}
              options={methods.map((m) => ({ value: m, label: m }))}
            />
            <Input
              label="Date"
              type="date"
              value={form.date}
              onChange={(e) => handleChange('date', e.target.value)}
              required
            />
            <Textarea
              label="Notes"
              value={form.notes}
              onChange={(e) => handleChange('notes', e.target.value)}
              placeholder="Optional note"
              rows={2}
            />
          </>
        )}
      </form>
    </Modal>
  );
}
