import { useMemo, useState } from 'react';
import { CalendarDays, ClipboardCheck, Package, Plus, ShoppingCart, Wallet } from 'lucide-react';
import { useData } from '../context/DataContext';
import { addAppointment, addInventoryItem, closeCashDay, recordPosSale, recordStaffAttendance } from '../data/services';
import PageHeader from '../components/ui/PageHeader';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Tabs from '../components/ui/Tabs';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import { Table, Thead, Th, Tbody, Tr, Td } from '../components/ui/Table';
import Badge from '../components/ui/Badge';

const today = () => new Date().toISOString().split('T')[0];

export default function Operations() {
  const { data, setData } = useData();
  const [activeTab, setActiveTab] = useState('appointments');
  const [appointment, setAppointment] = useState({ memberId: data.members[0]?.id || '', trainerId: data.trainers[0]?.id || '', date: today(), time: '07:00', type: 'PT Session', notes: '' });
  const [item, setItem] = useState({ name: '', sku: '', category: 'Supplements', unit: 'piece', stock: 0, reorderLevel: 5, price: 0, cost: 0 });
  const [sale, setSale] = useState({ itemId: data.inventory[0]?.id || '', quantity: 1, memberId: '', paymentMethod: 'Cash' });
  const [attendance, setAttendance] = useState({ staffId: data.staff[0]?.id || '', date: today(), status: 'present', checkIn: '09:00', checkOut: '' });
  const [cash, setCash] = useState({ date: today(), countedCash: '', notes: '' });

  const tabs = [
    { key: 'appointments', label: 'Appointments' },
    { key: 'pos', label: 'POS & Inventory' },
    { key: 'staff', label: 'Staff attendance' },
    { key: 'cash', label: 'Cash closing' },
  ];

  const selectedItem = data.inventory.find((entry) => entry.id === sale.itemId);
  const lowStock = useMemo(() => data.inventory.filter((entry) => entry.stock <= entry.reorderLevel), [data.inventory]);

  const saveAppointment = (event) => {
    event.preventDefault();
    const { data: next } = addAppointment(data, appointment);
    setData(next);
    setAppointment((current) => ({ ...current, notes: '' }));
  };

  const saveItem = (event) => {
    event.preventDefault();
    if (!item.name.trim()) return;
    const { data: next } = addInventoryItem(data, item);
    setData(next);
    setItem({ name: '', sku: '', category: 'Supplements', unit: 'piece', stock: 0, reorderLevel: 5, price: 0, cost: 0 });
  };

  const saveSale = (event) => {
    event.preventDefault();
    const result = recordPosSale(data, sale);
    if (!result.sale) return;
    setData(result.data);
    setSale((current) => ({ ...current, quantity: 1 }));
  };

  const saveAttendance = (event) => {
    event.preventDefault();
    const { data: next } = recordStaffAttendance(data, attendance);
    setData(next);
  };

  const saveCash = (event) => {
    event.preventDefault();
    const { data: next } = closeCashDay(data, cash);
    setData(next);
    setCash((current) => ({ ...current, countedCash: '', notes: '' }));
  };

  return (
    <div className="page-container">
      <PageHeader title="Gym operations" subtitle="Run appointments, retail sales, staff attendance and daily cash controls." />
      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <Card><div className="flex items-center justify-between"><div><p className="text-xs uppercase tracking-wide text-gray-500">Upcoming appointments</p><p className="mt-2 text-2xl font-bold text-gray-900">{data.appointments.filter((entry) => entry.status === 'scheduled').length}</p></div><CalendarDays className="h-5 w-5 text-primary-600" /></div></Card>
        <Card><div className="flex items-center justify-between"><div><p className="text-xs uppercase tracking-wide text-gray-500">Low stock items</p><p className="mt-2 text-2xl font-bold text-gray-900">{lowStock.length}</p></div><Package className="h-5 w-5 text-amber-600" /></div></Card>
        <Card><div className="flex items-center justify-between"><div><p className="text-xs uppercase tracking-wide text-gray-500">POS sales</p><p className="mt-2 text-2xl font-bold text-gray-900">{data.posSales.length}</p></div><ShoppingCart className="h-5 w-5 text-emerald-600" /></div></Card>
      </div>
      <Tabs tabs={tabs} active={activeTab} onChange={setActiveTab} />

      {activeTab === 'appointments' && (
        <div className="mt-4 grid gap-6 lg:grid-cols-[360px_1fr]">
          <Card>
            <h2 className="mb-4 text-base font-semibold text-gray-900">Book appointment</h2>
            <form onSubmit={saveAppointment} className="space-y-4">
              <Select label="Member" value={appointment.memberId} onChange={(e) => setAppointment({ ...appointment, memberId: e.target.value })} options={data.members.map((member) => ({ value: member.id, label: member.fullName }))} />
              <Select label="Trainer" value={appointment.trainerId} onChange={(e) => setAppointment({ ...appointment, trainerId: e.target.value })} options={data.trainers.map((trainer) => ({ value: trainer.id, label: trainer.name }))} />
              <div className="grid gap-4 sm:grid-cols-2"><Input label="Date" type="date" value={appointment.date} onChange={(e) => setAppointment({ ...appointment, date: e.target.value })} required /><Input label="Time" type="time" value={appointment.time} onChange={(e) => setAppointment({ ...appointment, time: e.target.value })} required /></div>
              <Select label="Type" value={appointment.type} onChange={(e) => setAppointment({ ...appointment, type: e.target.value })} options={['PT Session', 'Fitness Assessment', 'Diet Consultation', 'Trial Session'].map((value) => ({ value, label: value }))} />
              <Input label="Notes" value={appointment.notes} onChange={(e) => setAppointment({ ...appointment, notes: e.target.value })} />
              <Button type="submit" icon={Plus}>Book appointment</Button>
            </form>
          </Card>
          <Card>
            <h2 className="mb-4 text-base font-semibold text-gray-900">Schedule</h2>
            <Table><Thead><Tr><Th>Date</Th><Th>Member</Th><Th>Trainer</Th><Th>Type</Th><Th>Status</Th></Tr></Thead><Tbody>
              {data.appointments.map((entry) => <Tr key={entry.id}><Td>{entry.date} {entry.time}</Td><Td>{data.members.find((member) => member.id === entry.memberId)?.fullName || '—'}</Td><Td>{data.trainers.find((trainer) => trainer.id === entry.trainerId)?.name || '—'}</Td><Td>{entry.type}</Td><Td><Badge variant={entry.status === 'completed' ? 'success' : 'warning'}>{entry.status}</Badge></Td></Tr>)}
              {data.appointments.length === 0 && <Tr><Td colSpan={5} className="py-8 text-center text-gray-500">No appointments booked.</Td></Tr>}
            </Tbody></Table>
          </Card>
        </div>
      )}

      {activeTab === 'pos' && (
        <div className="mt-4 grid gap-6 lg:grid-cols-2">
          <Card>
            <h2 className="mb-4 text-base font-semibold text-gray-900">Record POS sale</h2>
            <form onSubmit={saveSale} className="space-y-4">
              <Select label="Item" value={sale.itemId} onChange={(e) => setSale({ ...sale, itemId: e.target.value })} options={data.inventory.map((entry) => ({ value: entry.id, label: `${entry.name} — ${entry.stock} in stock` }))} />
              <Input label="Quantity" type="number" min={1} max={selectedItem?.stock || 1} value={sale.quantity} onChange={(e) => setSale({ ...sale, quantity: e.target.value })} required />
              <Select label="Member (optional)" value={sale.memberId} onChange={(e) => setSale({ ...sale, memberId: e.target.value })} options={[{ value: '', label: 'Walk-in sale' }, ...data.members.map((member) => ({ value: member.id, label: member.fullName }))]} />
              <Select label="Payment method" value={sale.paymentMethod} onChange={(e) => setSale({ ...sale, paymentMethod: e.target.value })} options={['Cash', 'UPI', 'Card'].map((value) => ({ value, label: value }))} />
              <p className="text-sm text-gray-600">Total: <strong>₹{((selectedItem?.price || 0) * Number(sale.quantity || 0)).toLocaleString('en-IN')}</strong></p>
              <Button type="submit" icon={ShoppingCart} disabled={!selectedItem || selectedItem.stock < Number(sale.quantity)}>Record sale</Button>
            </form>
          </Card>
          <Card>
            <h2 className="mb-4 text-base font-semibold text-gray-900">Add inventory item</h2>
            <form onSubmit={saveItem} className="grid gap-4 sm:grid-cols-2">
              <Input label="Name" value={item.name} onChange={(e) => setItem({ ...item, name: e.target.value })} required />
              <Input label="SKU" value={item.sku} onChange={(e) => setItem({ ...item, sku: e.target.value })} />
              <Input label="Category" value={item.category} onChange={(e) => setItem({ ...item, category: e.target.value })} />
              <Input label="Opening stock" type="number" min={0} value={item.stock} onChange={(e) => setItem({ ...item, stock: e.target.value })} />
              <Input label="Selling price (₹)" type="number" min={0} value={item.price} onChange={(e) => setItem({ ...item, price: e.target.value })} required />
              <Input label="Reorder level" type="number" min={0} value={item.reorderLevel} onChange={(e) => setItem({ ...item, reorderLevel: e.target.value })} />
              <Button type="submit" icon={Plus} className="sm:col-span-2">Add item</Button>
            </form>
            <div className="mt-6"><Table><Thead><Tr><Th>Item</Th><Th>Stock</Th><Th>Price</Th></Tr></Thead><Tbody>{data.inventory.map((entry) => <Tr key={entry.id}><Td>{entry.name}</Td><Td className={entry.stock <= entry.reorderLevel ? 'font-semibold text-amber-700' : ''}>{entry.stock}</Td><Td>₹{entry.price.toLocaleString('en-IN')}</Td></Tr>)}</Tbody></Table></div>
          </Card>
        </div>
      )}

      {activeTab === 'staff' && (
        <div className="mt-4 grid gap-6 lg:grid-cols-[360px_1fr]">
          <Card><h2 className="mb-4 text-base font-semibold text-gray-900">Mark staff attendance</h2><form onSubmit={saveAttendance} className="space-y-4"><Select label="Staff" value={attendance.staffId} onChange={(e) => setAttendance({ ...attendance, staffId: e.target.value })} options={data.staff.map((member) => ({ value: member.id, label: member.name }))} /><Input label="Date" type="date" value={attendance.date} onChange={(e) => setAttendance({ ...attendance, date: e.target.value })} /><Select label="Status" value={attendance.status} onChange={(e) => setAttendance({ ...attendance, status: e.target.value })} options={['present', 'absent', 'leave'].map((value) => ({ value, label: value }))} /><div className="grid gap-4 sm:grid-cols-2"><Input label="Check-in" type="time" value={attendance.checkIn} onChange={(e) => setAttendance({ ...attendance, checkIn: e.target.value })} /><Input label="Check-out" type="time" value={attendance.checkOut} onChange={(e) => setAttendance({ ...attendance, checkOut: e.target.value })} /></div><Button type="submit" icon={ClipboardCheck}>Save attendance</Button></form></Card>
          <Card><h2 className="mb-4 text-base font-semibold text-gray-900">Attendance history</h2><Table><Thead><Tr><Th>Date</Th><Th>Staff</Th><Th>Status</Th><Th>Hours</Th></Tr></Thead><Tbody>{data.staffAttendance.map((entry) => <Tr key={entry.id}><Td>{entry.date}</Td><Td>{data.staff.find((member) => member.id === entry.staffId)?.name || '—'}</Td><Td>{entry.status}</Td><Td>{entry.checkIn || '—'} – {entry.checkOut || '—'}</Td></Tr>)}</Tbody></Table></Card>
        </div>
      )}

      {activeTab === 'cash' && (
        <div className="mt-4 grid gap-6 lg:grid-cols-[360px_1fr]">
          <Card><h2 className="mb-4 text-base font-semibold text-gray-900">Close cash day</h2><form onSubmit={saveCash} className="space-y-4"><Input label="Date" type="date" value={cash.date} onChange={(e) => setCash({ ...cash, date: e.target.value })} /><Input label="Counted cash (₹)" type="number" min={0} value={cash.countedCash} onChange={(e) => setCash({ ...cash, countedCash: e.target.value })} required /><Input label="Notes" value={cash.notes} onChange={(e) => setCash({ ...cash, notes: e.target.value })} /><Button type="submit" icon={Wallet}>Close cash</Button></form></Card>
          <Card><h2 className="mb-4 text-base font-semibold text-gray-900">Closing history</h2><Table><Thead><Tr><Th>Date</Th><Th>Expected</Th><Th>Counted</Th><Th>Variance</Th></Tr></Thead><Tbody>{data.cashClosings.map((entry) => <Tr key={entry.id}><Td>{entry.date}</Td><Td>₹{entry.expectedCash.toLocaleString('en-IN')}</Td><Td>₹{entry.countedCash.toLocaleString('en-IN')}</Td><Td className={entry.variance === 0 ? 'text-emerald-600' : 'text-amber-700'}>₹{entry.variance.toLocaleString('en-IN')}</Td></Tr>)}</Tbody></Table></Card>
        </div>
      )}
    </div>
  );
}
