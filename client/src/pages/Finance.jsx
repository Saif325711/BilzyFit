import { useState, useMemo } from 'react';
import { Download, FileText, Plus, Wallet, TrendingDown, Clock, Receipt } from 'lucide-react';
import { useData } from '../context/DataContext';
import PageHeader from '../components/ui/PageHeader';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Tabs from '../components/ui/Tabs';
import { Table, Thead, Th, Tbody, Tr, Td } from '../components/ui/Table';
import Badge from '../components/ui/Badge';
import ExpenseModal from '../components/ExpenseModal';
import CollectPaymentModal from '../components/CollectPaymentModal';
import ReceiptModal from '../components/ReceiptModal';
import SearchInput from '../components/ui/SearchInput';
import Select from '../components/ui/Select';

export default function Finance() {
  const { data, scopedData, activeBranch, setActiveBranch, branches, currentBranch } = useData();
  const [activeTab, setActiveTab] = useState('payments');
  const [expenseOpen, setExpenseOpen] = useState(false);
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [receiptMember, setReceiptMember] = useState(null);
  const [search, setSearch] = useState('');
  const [methodFilter, setMethodFilter] = useState('');
  const [expenseCategory, setExpenseCategory] = useState('');

  const totalRevenue = scopedData.payments.reduce((s, p) => s + p.amount, 0);
  const totalExpenses = scopedData.expenses.reduce((s, e) => s + e.amount, 0);
  const pending = scopedData.memberships.reduce((s, m) => s + m.pendingAmount, 0);
  const accountingEntries = scopedData.accountingEntries || [];

  const paymentsWithMember = useMemo(
    () =>
      scopedData.payments.map((p) => ({
        ...p,
        member: scopedData.members.find((m) => m.id === p.memberId),
      })),
    [scopedData.payments, scopedData.members]
  );

  const pendingPayments = useMemo(
    () =>
      scopedData.memberships
        .filter((m) => m.pendingAmount > 0)
        .map((m) => ({
          ...m,
          member: scopedData.members.find((x) => x.id === m.memberId),
        })),
    [scopedData.memberships, scopedData.members]
  );

  const filteredPayments = paymentsWithMember.filter((payment) => {
    const term = search.toLowerCase();
    return (!term || payment.member?.fullName?.toLowerCase().includes(term) || payment.invoiceNumber?.toLowerCase().includes(term))
      && (!methodFilter || payment.method === methodFilter);
  });
  const filteredExpenses = scopedData.expenses.filter((expense) => {
    const term = search.toLowerCase();
    return (!term || expense.description?.toLowerCase().includes(term) || expense.category?.toLowerCase().includes(term))
      && (!expenseCategory || expense.category === expenseCategory);
  });

  const tabs = [
    { key: 'payments', label: 'Payments' },
    { key: 'pending', label: 'Pending Payments' },
    { key: 'expenses', label: 'Expenses' },
    { key: 'invoices', label: 'Invoices' },
    { key: 'refunds', label: 'Refund history' },
    { key: 'accounting', label: 'Accounting' },
  ];

  return (
    <div className="page-container">
      <PageHeader title="Finance" subtitle="Indian gym collections, dues, expenses and invoices.">
        <Button variant="secondary" onClick={() => setExpenseOpen(true)} icon={Plus}>
          Add Expense
        </Button>
        <Button icon={Plus} onClick={() => setPaymentOpen(true)}>
          Collect Payment
        </Button>
      </PageHeader>

      {/* ── Active Branch Switcher Banner ── */}
      <div className="mb-6 flex flex-col gap-3 rounded-xl border border-primary-100 bg-primary-50/50 p-3 sm:flex-row sm:items-center sm:justify-between text-xs">
        <div className="flex items-center gap-2 text-primary-900 font-medium">
          <span className="h-2 w-2 rounded-full bg-primary-600 animate-pulse shrink-0"></span>
          <span>
            Financial Scope:{' '}
            <strong>{activeBranch === 'all' ? '🌐 All Gym Centres (Consolidated)' : (currentBranch?.name || activeBranch)}</strong>
            {currentBranch?.city && <span className="opacity-75 font-normal"> ({currentBranch.city})</span>}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={activeBranch}
            onChange={(e) => setActiveBranch(e.target.value)}
            className="rounded-lg border border-gray-300 bg-white px-2.5 py-1 text-xs font-semibold text-gray-800 shadow-xs focus:border-primary-500 focus:outline-none"
          >
            <option value="all">🌐 All Centres Consolidated</option>
            {branches.map((b) => (
              <option key={b.id} value={b.name}>
                🏢 {b.name} ({b.city || 'Main'})
              </option>
            ))}
          </select>
          {activeBranch !== 'all' && (
            <button
              type="button"
              onClick={() => setActiveBranch('all')}
              className="text-primary-700 underline font-semibold hover:text-primary-900"
            >
              View All Centres
            </button>
          )}
        </div>
      </div>

      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: 'Total collections', value: totalRevenue, icon: Wallet, color: 'text-emerald-600 bg-emerald-50' },
          { label: 'Total expenses', value: totalExpenses, icon: TrendingDown, color: 'text-red-600 bg-red-50' },
          { label: 'Pending dues', value: pending, icon: Clock, color: 'text-amber-600 bg-amber-50' },
          { label: 'Net profit', value: totalRevenue - totalExpenses, icon: Receipt, color: 'text-blue-600 bg-blue-50' },
        ].map((metric) => <Card key={metric.label}><div className="flex items-center justify-between"><div><p className="text-xs font-medium uppercase tracking-wide text-gray-500">{metric.label}</p><p className="mt-2 text-2xl font-bold text-gray-900">₹{metric.value.toLocaleString('en-IN')}</p></div><div className={`rounded-xl p-3 ${metric.color}`}><metric.icon className="h-5 w-5" /></div></div></Card>)}
      </div>

      <Tabs tabs={tabs} active={activeTab} onChange={setActiveTab} />

      <div className="mt-4">
        {activeTab !== 'invoices' && activeTab !== 'accounting' && <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><SearchInput value={search} onChange={setSearch} placeholder={activeTab === 'expenses' ? 'Search expenses...' : 'Search payments...'} className="w-full sm:max-w-sm" /><div className="flex gap-3">{activeTab === 'expenses' ? <Select value={expenseCategory} onChange={(e) => setExpenseCategory(e.target.value)} options={[{ value: '', label: 'All categories' }, ...Array.from(new Set(data.expenses.map((expense) => expense.category))).map((value) => ({ value, label: value }))]} className="w-full sm:w-44" /> : <Select value={methodFilter} onChange={(e) => setMethodFilter(e.target.value)} options={[{ value: '', label: 'All methods' }, ...['Cash', 'UPI', 'Card', 'Bank Transfer', 'Online'].map((value) => ({ value, label: value }))]} className="w-full sm:w-40" />}<Button variant="secondary" icon={Download} onClick={() => { const rows = accountingEntries.map((entry) => [entry.date, entry.type, entry.direction, entry.account, entry.amount, entry.method, entry.invoiceNumber, entry.description]); const csv = [['Date', 'Type', 'Direction', 'Account', 'Amount', 'Method', 'Invoice', 'Description'], ...rows].map((row) => row.map((value) => `"${String(value ?? '').replace(/"/g, '""')}"`).join(',')).join('\n'); const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv' })); const link = document.createElement('a'); link.href = url; link.download = 'bilzyfit-accounting-export.csv'; link.click(); URL.revokeObjectURL(url); }}>Accounting export</Button><Button variant="secondary" icon={Download} onClick={() => window.print()}>Print</Button></div></div>}
        {activeTab === 'payments' && (
          <Card>
            <Table>
              <Thead>
                <Tr>
                  <Th>Date</Th>
                  <Th>Member</Th>
                  <Th>Amount</Th>
                  <Th>Method</Th>
                  <Th>Invoice</Th>
                  <Th>Status</Th>
                </Tr>
              </Thead>
              <Tbody>
                {filteredPayments.map((p) => (
                  <Tr key={p.id}>
                    <Td>{p.date}</Td>
                    <Td>{p.member?.fullName || '—'}</Td>
                    <Td>₹{p.amount.toLocaleString('en-IN')}</Td>
                    <Td>{p.method}</Td>
                    <Td>{p.invoiceNumber}</Td>
                    <Td><Badge variant="success">{p.status}</Badge></Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Card>
        )}

        {activeTab === 'pending' && (
          <Card>
            <Table>
              <Thead>
                <Tr>
                  <Th>Member ID</Th>
                  <Th>Member</Th>
                  <Th>Plan</Th>
                  <Th>Amount</Th>
                  <Th>Paid</Th>
                  <Th>Pending</Th>
                </Tr>
              </Thead>
              <Tbody>
                {pendingPayments.map((m) => (
                  <Tr key={m.id}>
                    <Td>{m.member?.memberId}</Td>
                    <Td>{m.member?.fullName}</Td>
                    <Td>{m.planName}</Td>
                    <Td>₹{m.amount.toLocaleString('en-IN')}</Td>
                    <Td>₹{m.paidAmount.toLocaleString('en-IN')}</Td>
                    <Td className="font-semibold text-red-600">₹{m.pendingAmount.toLocaleString('en-IN')}</Td>
                  </Tr>
                ))}
                {pendingPayments.length === 0 && (
                  <Tr>
                    <Td colSpan={6} className="py-8 text-center text-gray-500">No pending payments.</Td>
                  </Tr>
                )}
              </Tbody>
            </Table>
          </Card>
        )}

        {activeTab === 'expenses' && (
          <Card>
            <Table>
              <Thead>
                <Tr>
                  <Th>Date</Th>
                  <Th>Category</Th>
                  <Th>Description</Th>
                  <Th>Amount</Th>
                  <Th>Method</Th>
                </Tr>
              </Thead>
              <Tbody>
                {filteredExpenses.map((e) => (
                  <Tr key={e.id}>
                    <Td>{e.date}</Td>
                    <Td>{e.category}</Td>
                    <Td>{e.description}</Td>
                    <Td>₹{e.amount.toLocaleString('en-IN')}</Td>
                    <Td>{e.paymentMethod}</Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Card>
        )}

        {activeTab === 'invoices' && (
          <Card>
            <Table>
              <Thead>
                <Tr>
                  <Th>Invoice #</Th>
                  <Th>Member</Th>
                  <Th>Plan</Th>
                  <Th>Amount</Th>
                  <Th>Date</Th>
                  <Th className="text-right">Action</Th>
                </Tr>
              </Thead>
              <Tbody>
                {data.memberships.slice(0, 20).map((m) => {
                  const member = data.members.find((x) => x.id === m.memberId);
                  return (
                    <Tr key={m.id}>
                      <Td>{m.invoiceNumber}</Td>
                      <Td>{member?.fullName}</Td>
                      <Td>{m.planName}</Td>
                      <Td>₹{m.amount.toLocaleString('en-IN')}</Td>
                      <Td>{m.startDate}</Td>
                      <Td className="text-right">
                        <Button
                          size="sm"
                          variant="secondary"
                          icon={FileText}
                          onClick={() => member && setReceiptMember(member)}
                        >
                          View
                        </Button>
                      </Td>
                    </Tr>
                  );
                })}
              </Tbody>
            </Table>
          </Card>
        )}

        {activeTab === 'refunds' && (
          <Card>
            <Table>
              <Thead><Tr><Th>Date</Th><Th>Member</Th><Th>Invoice</Th><Th>Refund</Th><Th>Method</Th><Th>Notes</Th></Tr></Thead>
              <Tbody>
                {data.payments.filter((payment) => payment.type === 'refund' || payment.status === 'refunded').map((payment) => (
                  <Tr key={payment.id}><Td>{payment.date}</Td><Td>{data.members.find((member) => member.id === payment.memberId)?.fullName || '—'}</Td><Td>{payment.invoiceNumber}</Td><Td className="font-semibold text-red-600">₹{Math.abs(payment.amount).toLocaleString('en-IN')}</Td><Td>{payment.method}</Td><Td>{payment.notes || '—'}</Td></Tr>
                ))}
                {data.payments.filter((payment) => payment.type === 'refund' || payment.status === 'refunded').length === 0 && <Tr><Td colSpan={6} className="py-8 text-center text-gray-500">No refunds recorded.</Td></Tr>}
              </Tbody>
            </Table>
          </Card>
        )}

        {activeTab === 'accounting' && (
          <Card>
            <Table>
              <Thead><Tr><Th>Date</Th><Th>Type</Th><Th>Account</Th><Th>Reference</Th><Th>Method</Th><Th>Amount</Th></Tr></Thead>
              <Tbody>
                {accountingEntries.map((entry) => (
                  <Tr key={entry.id}>
                    <Td>{entry.date}</Td>
                    <Td className="capitalize">{entry.type}</Td>
                    <Td>{entry.account}</Td>
                    <Td>{entry.invoiceNumber || entry.referenceId}</Td>
                    <Td>{entry.method || '—'}</Td>
                    <Td className={entry.direction === 'credit' ? 'font-semibold text-emerald-600' : 'font-semibold text-red-600'}>
                      {entry.direction === 'credit' ? '+' : '-'}₹{entry.amount.toLocaleString('en-IN')}
                    </Td>
                  </Tr>
                ))}
                {accountingEntries.length === 0 && <Tr><Td colSpan={6} className="py-8 text-center text-gray-500">No accounting entries recorded.</Td></Tr>}
              </Tbody>
            </Table>
          </Card>
        )}
      </div>

      <ExpenseModal open={expenseOpen} onClose={() => setExpenseOpen(false)} />
      <CollectPaymentModal open={paymentOpen} onClose={() => setPaymentOpen(false)} />
      {receiptMember && (
        <ReceiptModal member={receiptMember} onClose={() => setReceiptMember(null)} />
      )}
    </div>
  );
}
