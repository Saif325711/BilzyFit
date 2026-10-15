import { useState } from 'react';
import { useData } from '../context/DataContext';
import { addPayment } from '../data/services';
import Modal from './ui/Modal';
import Input from './ui/Input';
import Select from './ui/Select';
import Textarea from './ui/Textarea';
import Button from './ui/Button';

export default function PaymentModal({ open, onClose, member }) {
  const { data, setData } = useData();
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState('Cash');
  const [notes, setNotes] = useState('');
  const [discount, setDiscount] = useState(0);
  const [coupon, setCoupon] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!amount || Number(amount) <= 0) return;
    setLoading(true);
    setTimeout(() => {
      const { data: next } = addPayment(data, {
        memberId: member.id,
        amount: Number(amount),
        method,
        date: new Date().toISOString().split('T')[0],
        notes,
        type: 'membership',
        discount: Number(discount),
        coupon,
        gstRate: Number(data.settings.defaultGstRate) || 0,
      });
      setData(next);
      setLoading(false);
      setAmount('');
      setNotes('');
      setDiscount(0);
      setCoupon('');
      onClose();
    }, 300);
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={`Collect Payment - ${member?.fullName}`}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" form="payment-form" disabled={loading}>
            {loading ? 'Saving...' : 'Record Payment'}
          </Button>
        </>
      }
    >
      <form id="payment-form" onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Amount (₹)"
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />
        <Select
          label="Payment Method"
          value={method}
          onChange={(e) => setMethod(e.target.value)}
          options={[
            { value: 'Cash', label: 'Cash' },
            { value: 'UPI', label: 'UPI' },
            { value: 'Card', label: 'Card' },
            { value: 'Bank Transfer', label: 'Bank Transfer' },
            { value: 'Online', label: 'Online Payment' },
          ]}
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <Input label="Discount (₹)" type="number" min={0} value={discount} onChange={(e) => setDiscount(e.target.value)} />
          <Input label="Coupon code" value={coupon} onChange={(e) => setCoupon(e.target.value.toUpperCase())} />
        </div>
        {data.settings.gstin && <p className="text-xs text-gray-500">GSTIN {data.settings.gstin} · {data.settings.defaultGstRate || 0}% GST</p>}
        <Textarea
          label="Notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </form>
    </Modal>
  );
}
