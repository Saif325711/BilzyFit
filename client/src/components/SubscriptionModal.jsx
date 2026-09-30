import { useEffect, useState } from 'react';
import { useData } from '../context/DataContext';
import { refundMembership, renewMembership } from '../data/services';
import Modal from './ui/Modal';
import Input from './ui/Input';
import Select from './ui/Select';
import Textarea from './ui/Textarea';
import Button from './ui/Button';

const methods = ['Cash', 'UPI', 'Card', 'Bank Transfer', 'Online'];
const today = () => new Date().toISOString().split('T')[0];

function getRefundDetails(data, membership) {
  const dayMs = 86400000;
  const start = new Date(membership.startDate);
  const expiry = new Date(membership.expiryDate);
  const totalDays = Math.max(1, Math.ceil((expiry - start) / dayMs));
  const todayDate = new Date();
  const usedDays = new Set(
    data.attendance
      .filter((record) => record.memberId === membership.memberId)
      .filter((record) => {
        const date = new Date(record.date);
        return date >= start && date <= todayDate;
      })
      .map((record) => record.date)
  ).size;
  const refundAmount = Math.max(0, Math.round(membership.paidAmount * (totalDays - usedDays) / totalDays));
  return { totalDays, usedDays, refundAmount, remainingDays: totalDays - usedDays };
}

export default function SubscriptionModal({ open, onClose, mode, member, membership }) {
  const { data, setData } = useData();
  const [planId, setPlanId] = useState('');
  const [startDate, setStartDate] = useState(today());
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState('Cash');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  const selectedPlan = data.plans.find((plan) => plan.id === planId);
  const refund = membership ? getRefundDetails(data, membership) : null;

  useEffect(() => {
    if (open && mode === 'renew') {
      const defaultPlan = data.plans.find((plan) => plan.id === membership?.planId) || data.plans[0];
      setPlanId(defaultPlan?.id || '');
      setStartDate(today());
      setAmount(defaultPlan?.price || '');
      setMethod('Cash');
      setNotes('');
    }
  }, [open, mode, membership, data.plans]);

  const title = mode === 'renew'
    ? `Renew Membership - ${member?.fullName}`
    : `Refund Membership - ${member?.fullName}`;

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    if (mode === 'renew') {
      const { data: next } = renewMembership(data, member.id, {
        planId,
        startDate,
        paymentAmount: Number(amount),
        paymentMethod: method,
      });
      setData(next);
    } else {
      const { data: next } = refundMembership(data, membership.id, {
        method,
        date: today(),
        notes,
      });
      setData(next);
    }
    setLoading(false);
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      size="md"
      footer={(
        <>
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button
            type="submit"
            form="subscription-form"
            variant={mode === 'refund' ? 'danger' : 'primary'}
            disabled={loading || (mode === 'refund' && (!refund || refund.refundAmount <= 0))}
          >
            {loading ? 'Saving...' : mode === 'renew' ? 'Renew Membership' : 'Confirm Refund'}
          </Button>
        </>
      )}
    >
      <form id="subscription-form" onSubmit={handleSubmit} className="space-y-4">
        {mode === 'renew' ? (
          <>
            <Select
              label="Membership Plan"
              value={planId}
              onChange={(e) => {
                const nextPlanId = e.target.value;
                const plan = data.plans.find((item) => item.id === nextPlanId);
                setPlanId(nextPlanId);
                setAmount(plan?.price || '');
              }}
              options={data.plans.map((plan) => ({
                value: plan.id,
                label: `${plan.name} — ₹${plan.price.toLocaleString('en-IN')}`,
              }))}
              required
            />
            <Input label="Start Date" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} required />
            <Input label="Plan Price (₹)" type="number" value={selectedPlan?.price || 0} disabled />
            <Input label="Payment Amount (₹)" type="number" min={0} value={amount} onChange={(e) => setAmount(e.target.value)} required />
            <Select label="Payment Method" value={method} onChange={(e) => setMethod(e.target.value)} options={methods.map((value) => ({ value, label: value }))} />
          </>
        ) : (
          <>
            {refund && (
              <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm">
                <p>Paid: <strong>₹{membership.paidAmount.toLocaleString('en-IN')}</strong></p>
                <p>Used days: <strong>{refund.usedDays}</strong> of {refund.totalDays}</p>
                <p>Remaining days: <strong>{refund.remainingDays}</strong></p>
                <p className="mt-2 text-base font-semibold text-amber-800">
                  Refund amount: ₹{refund.refundAmount.toLocaleString('en-IN')}
                </p>
              </div>
            )}
            {refund?.refundAmount <= 0 && (
              <p className="text-sm text-gray-600">No refundable balance remains for this membership.</p>
            )}
            <Select label="Refund Method" value={method} onChange={(e) => setMethod(e.target.value)} options={methods.map((value) => ({ value, label: value }))} />
            <Textarea label="Notes" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Optional refund note" />
          </>
        )}
      </form>
    </Modal>
  );
}
