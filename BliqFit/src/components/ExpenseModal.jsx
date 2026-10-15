import { useState } from 'react';
import { useData } from '../context/DataContext';
import { addExpense } from '../data/services';
import Modal from './ui/Modal';
import Input from './ui/Input';
import Select from './ui/Select';
import Textarea from './ui/Textarea';
import Button from './ui/Button';

const categories = [
  'Electricity',
  'Rent',
  'Equipment',
  'Maintenance',
  'Salary',
  'Marketing',
  'Cleaning',
  'Internet',
  'Other',
];

export default function ExpenseModal({ open, onClose }) {
  const { data, setData } = useData();
  const [form, setForm] = useState({
    category: 'Other',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    description: '',
    paymentMethod: 'Cash',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (field, value) => setForm((f) => ({ ...f, [field]: value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      const { data: next } = addExpense(data, { ...form, amount: Number(form.amount) });
      setData(next);
      setLoading(false);
      setForm({
        category: 'Other',
        amount: '',
        date: new Date().toISOString().split('T')[0],
        description: '',
        paymentMethod: 'Cash',
      });
      onClose();
    }, 300);
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Add Expense"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" form="expense-form" disabled={loading}>
            {loading ? 'Saving...' : 'Add Expense'}
          </Button>
        </>
      }
    >
      <form id="expense-form" onSubmit={handleSubmit} className="space-y-4">
        <Select
          label="Category"
          value={form.category}
          onChange={(e) => handleChange('category', e.target.value)}
          options={categories.map((c) => ({ value: c, label: c }))}
        />
        <Input
          label="Amount"
          type="number"
          value={form.amount}
          onChange={(e) => handleChange('amount', e.target.value)}
          required
        />
        <Input
          label="Date"
          type="date"
          value={form.date}
          onChange={(e) => handleChange('date', e.target.value)}
        />
        <Select
          label="Payment Method"
          value={form.paymentMethod}
          onChange={(e) => handleChange('paymentMethod', e.target.value)}
          options={['Cash', 'UPI', 'Card', 'Bank Transfer', 'Online'].map((v) => ({ value: v, label: v }))}
        />
        <Textarea
          label="Description"
          value={form.description}
          onChange={(e) => handleChange('description', e.target.value)}
        />
      </form>
    </Modal>
  );
}
