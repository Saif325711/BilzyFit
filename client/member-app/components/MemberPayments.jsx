import { useState } from 'react';
import {
  Bell,
  QrCode,
  CreditCard,
  CheckCircle2,
  Clock,
  ArrowRight,
  Download,
  Receipt,
  Sparkles,
  ShieldCheck,
  RefreshCw,
  Star,
  X,
  FileText,
  ChevronRight,
  Zap,
} from 'lucide-react';

export default function MemberPayments({
  member = {},
  membership = {},
  payments = [],
  daysLeft = 23,
  onShowQR,
}) {
  const [activeFilter, setActiveFilter] = useState('All'); // 'All' | 'Completed' | 'Invoices'
  const [showRenewModal, setShowRenewModal] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  // Initial payments list with rich fallback if empty
  const [paymentList, setPaymentList] = useState(() => {
    if (payments && payments.length > 0) {
      return payments;
    }
    return [
      {
        id: 'pay-1',
        amount: 2499,
        date: '01 Aug 2026',
        method: 'UPI · Google Pay',
        status: 'Completed',
        txnId: 'TXN_BF_2499_881',
      },
      {
        id: 'pay-2',
        amount: 2499,
        date: '01 Jul 2026',
        method: 'HDFC Debit Card',
        status: 'Completed',
        txnId: 'TXN_BF_2499_762',
      },
      {
        id: 'pay-3',
        amount: 2499,
        date: '01 Jun 2026',
        method: 'UPI · PhonePe',
        status: 'Completed',
        txnId: 'TXN_BF_2499_541',
      },
      {
        id: 'pay-4',
        amount: 2499,
        date: '01 May 2026',
        method: 'Net Banking',
        status: 'Completed',
        txnId: 'TXN_BF_2499_329',
      },
    ];
  });

  // Renew form state
  const [selectedDuration, setSelectedDuration] = useState(1); // 1, 3, 12 months
  const [selectedMethod, setSelectedMethod] = useState('UPI');

  const firstName =
    member?.fullName?.split(' ')[0] || member?.name?.split(' ')[0] || 'Athlete';
  const memberId = member?.memberCode || member?.id || 'BF-1024';
  const planName = membership?.planName || 'ALL ACCESS VIP PRO';
  const expiryDate = membership?.expiryDate || '30 Sep 2026';
  const pendingAmount = Number(membership?.pendingAmount) || 0;

  const renewAmount =
    selectedDuration === 1 ? 2499 : selectedDuration === 3 ? 6499 : 19999;

  function handleProcessPayment(e) {
    e.preventDefault();
    const now = new Date();
    const months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];
    const dateStr = `${now.getDate().toString().padStart(2, '0')} ${
      months[now.getMonth()]
    } ${now.getFullYear()}`;

    const newEntry = {
      id: `pay-${Date.now()}`,
      amount: renewAmount,
      date: dateStr,
      method: selectedMethod === 'UPI' ? 'UPI · GPay/PhonePe' : 'Credit/Debit Card',
      status: 'Completed',
      txnId: `TXN_BF_${renewAmount}_${Math.floor(100 + Math.random() * 900)}`,
    };

    setPaymentList([newEntry, ...paymentList]);
    setShowRenewModal(false);
    setShowSuccessToast(true);
    setTimeout(() => setShowSuccessToast(false), 4000);
  }

  const filteredPayments = paymentList.filter((p) => {
    if (activeFilter === 'Completed') return p.status === 'Completed';
    return true; // 'All' and 'Invoices' show all invoices
  });

  return (
    <div
      style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}
      className="space-y-4 pb-4 animate-fadeIn"
    >
      {/* ── SUCCESS TOAST NOTIFICATION ───────────────────────────────── */}
      {showSuccessToast && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 rounded-2xl bg-emerald-900 px-4 py-3 text-white shadow-xl animate-bounce">
          <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
          <p className="text-xs font-bold">
            Payment of ₹{renewAmount.toLocaleString('en-IN')} successful! Membership renewed.
          </p>
        </div>
      )}

      {/* ── TOP APP BAR (Branding + Actions) ─────────────────────────── */}
      <div className="flex items-center justify-between pt-1">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-gray-900 leading-none">
            bilzy<span className="text-emerald-500">fit</span>
          </h1>
          <p className="mt-1 text-[8.5px] font-extrabold tracking-[0.22em] text-gray-400 uppercase">
            TRAIN &bull; TRACK &bull; TRANSFORM
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-600 transition hover:bg-gray-200"
            title="Notifications"
          >
            <Bell className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={onShowQR}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500 text-white shadow-md shadow-emerald-500/30 transition hover:bg-emerald-600"
            title="QR Check-in"
          >
            <QrCode className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* ── HERO HEADER WITH VIP BADGE ───────────────────────────────── */}
      <div
        className="relative overflow-hidden rounded-3xl bg-white p-5 shadow-sm border border-gray-100"
        style={{ minHeight: 146 }}
      >
        <div
          className="absolute -right-6 -top-6 h-44 w-44 rounded-full bg-emerald-100/60 pointer-events-none"
          style={{ filter: 'blur(1px)' }}
        />
        <div className="absolute right-20 -bottom-8 h-28 w-28 rounded-full bg-sky-50 pointer-events-none" />

        {/* VIP visual badge on the right */}
        <div className="absolute right-3 top-3 bottom-3 w-36 overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100/80 flex flex-col items-center justify-center shadow-sm">
          <span className="text-3xl">💳</span>
          <span className="mt-1 text-[11px] font-black text-emerald-700">VIP Member</span>
          <span className="text-[9px] font-semibold text-emerald-600/70">Active &amp; Verified</span>
        </div>

        {/* Left greeting text */}
        <div className="relative z-10 pr-36">
          <p className="text-xs font-semibold text-gray-500">Hi, {firstName} 👋</p>
          <h2 className="mt-1 text-2xl font-black text-gray-900 tracking-tight leading-tight">
            My <span className="text-emerald-500">Payments</span>
          </h2>
          <p className="mt-1 text-xs text-gray-400 font-medium">
            Active Plan &bull; Auto-renew &amp; Invoices 💳
          </p>
        </div>
      </div>

      {/* ── DIGITAL MEMBERSHIP CARD (OBSIDIAN BLACK METAL PASS) ──────── */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-gray-900 to-emerald-950 p-6 text-white shadow-xl">
        {/* Glow circle overlay */}
        <div className="absolute -right-10 -bottom-10 h-44 w-44 rounded-full bg-emerald-500/10 blur-2xl pointer-events-none" />

        <div className="relative z-10 space-y-6">
          {/* Card Top: Chip + Logo + Active Status */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="flex h-7 w-10 items-center justify-center rounded-lg bg-amber-400/80 text-black shadow-inner">
                <CreditCard className="h-4 w-4" />
              </div>
              <span className="text-xs font-black tracking-widest text-gray-300 uppercase">
                bilzyfit VIP PASS
              </span>
            </div>

            <div className="flex items-center gap-1.5 rounded-full border border-emerald-400/30 bg-emerald-500/20 px-2.5 py-1 text-[10px] font-black text-emerald-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>ACTIVE</span>
            </div>
          </div>

          {/* Card Middle: Plan & Member ID */}
          <div>
            <h3 className="text-xl font-black tracking-tight text-white uppercase">
              {planName}
            </h3>
            <p className="text-[11px] font-semibold tracking-wider text-gray-400 uppercase mt-0.5">
              MEMBER ID: {memberId}
            </p>
          </div>

          {/* Card Bottom: Member Name + Expiry + Renew Button */}
          <div className="flex items-end justify-between pt-1 border-t border-white/10">
            <div>
              <p className="text-sm font-extrabold text-white">
                {member?.fullName || member?.name || 'Rahul Sharma'}
              </p>
              <p className="text-[11px] text-gray-400 font-medium">
                Valid until: {expiryDate} ({daysLeft}d left)
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowRenewModal(true)}
              className="rounded-xl bg-emerald-500 px-3.5 py-2 text-xs font-black text-white shadow-lg shadow-emerald-500/30 hover:bg-emerald-600 transition"
            >
              Renew Plan
            </button>
          </div>
        </div>
      </div>

      {/* ── BILLING STATUS & OUTSTANDING BALANCE CARD ─────────────────── */}
      <div className="rounded-3xl bg-white p-5 shadow-sm border border-gray-100 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] font-extrabold tracking-wider uppercase text-gray-400">
              OUTSTANDING BALANCE
            </p>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span
                className={`text-2xl font-black leading-none ${
                  pendingAmount > 0 ? 'text-red-600' : 'text-gray-900'
                }`}
              >
                ₹{pendingAmount.toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          {pendingAmount > 0 ? (
            <button
              type="button"
              onClick={() => setShowRenewModal(true)}
              className="rounded-xl bg-red-600 px-3.5 py-2 text-xs font-black text-white hover:bg-red-700 transition"
            >
              Pay Due Now
            </button>
          ) : (
            <div className="flex items-center gap-1.5 rounded-xl bg-emerald-50 px-3 py-1.5 text-xs font-black text-emerald-700">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              <span>Up to Date</span>
            </div>
          )}
        </div>

        <p className="text-xs text-gray-500 leading-relaxed font-medium">
          {pendingAmount > 0
            ? 'Please clear your outstanding balance to avoid access interruptions.'
            : `Your membership is active and verified. Next scheduled renewal is on ${expiryDate}.`}
        </p>

        {/* 3 Metric Summary Pills */}
        <div className="grid grid-cols-3 gap-2 pt-1 border-t border-gray-100">
          <div className="rounded-2xl bg-emerald-50/70 p-2.5 text-center">
            <p className="text-[10px] font-bold text-emerald-700">🗓 Status</p>
            <p className="text-xs font-black text-emerald-900 mt-0.5">
              Active ({daysLeft}d left)
            </p>
          </div>
          <div className="rounded-2xl bg-sky-50/70 p-2.5 text-center">
            <p className="text-[10px] font-bold text-sky-700">💵 Rate</p>
            <p className="text-xs font-black text-sky-900 mt-0.5">₹2,499 / mo</p>
          </div>
          <div className="rounded-2xl bg-purple-50/70 p-2.5 text-center">
            <p className="text-[10px] font-bold text-purple-700">🛡 Plan</p>
            <p className="text-xs font-black text-purple-900 mt-0.5">All Zones &amp; Spa</p>
          </div>
        </div>
      </div>

      {/* ── QUICK ACTION TILES ───────────────────────────────────────── */}
      <div className="grid grid-cols-3 gap-2.5">
        <button
          type="button"
          onClick={() => setShowRenewModal(true)}
          className="flex flex-col items-center justify-center rounded-2xl bg-white p-3.5 shadow-sm border border-gray-100 transition hover:bg-emerald-50/30 group"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 group-hover:scale-105 transition">
            <RefreshCw className="h-4 w-4" />
          </div>
          <span className="mt-2 text-xs font-extrabold text-gray-900">
            Quick Renew
          </span>
          <span className="text-[9.5px] font-bold text-emerald-600">
            Instant Extend
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveFilter('Invoices')}
          className="flex flex-col items-center justify-center rounded-2xl bg-white p-3.5 shadow-sm border border-gray-100 transition hover:bg-sky-50/30 group"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-50 text-sky-600 group-hover:scale-105 transition">
            <FileText className="h-4 w-4" />
          </div>
          <span className="mt-2 text-xs font-extrabold text-gray-900">
            Tax Invoices
          </span>
          <span className="text-[9.5px] font-bold text-sky-600">
            GST Receipts
          </span>
        </button>

        <button
          type="button"
          onClick={() => {
            setSelectedDuration(12);
            setShowRenewModal(true);
          }}
          className="flex flex-col items-center justify-center rounded-2xl bg-white p-3.5 shadow-sm border border-gray-100 transition hover:bg-amber-50/30 group"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50 text-amber-600 group-hover:scale-105 transition">
            <Star className="h-4 w-4" />
          </div>
          <span className="mt-2 text-xs font-extrabold text-gray-900">
            VIP Upgrade
          </span>
          <span className="text-[9.5px] font-bold text-amber-600">
            Save 35%
          </span>
        </button>
      </div>

      {/* ── PAYMENT HISTORY & INVOICES SECTION ───────────────────────── */}
      <div className="rounded-3xl bg-white p-5 shadow-sm border border-gray-100 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-extrabold text-gray-900">
              Payment History
            </h3>
            <p className="text-xs text-gray-400 font-medium">
              Receipts &amp; billing transactions
            </p>
          </div>
          <span className="rounded-xl bg-gray-100 px-2.5 py-1 text-xs font-bold text-gray-600">
            {paymentList.length} Records
          </span>
        </div>

        {/* Filter Chips */}
        <div className="flex gap-2">
          {['All', 'Completed', 'Invoices'].map((filter) => (
            <button
              key={filter}
              type="button"
              onClick={() => setActiveFilter(filter)}
              className={`rounded-xl px-3 py-1.5 text-xs font-bold transition ${
                activeFilter === filter
                  ? 'bg-emerald-500 text-white shadow-sm'
                  : 'bg-gray-100 text-gray-500 hover:text-gray-800'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Payment Records List */}
        <div className="space-y-2.5 pt-1">
          {filteredPayments.map((p) => (
            <div
              key={p.id}
              className="flex items-center justify-between rounded-2xl border border-gray-100 bg-gray-50/70 p-3.5 transition hover:bg-gray-100/60"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
                  <CheckCircle2 className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-black text-gray-900">
                    ₹{Number(p.amount).toLocaleString('en-IN')}
                  </p>
                  <p className="text-[11px] text-gray-400 font-medium">
                    {p.date} &bull; {p.method}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedReceipt(p)}
                className="flex items-center gap-1 rounded-xl border border-gray-200 bg-white px-3 py-1.5 text-xs font-extrabold text-emerald-600 hover:bg-emerald-50 transition"
              >
                <Receipt className="h-3.5 w-3.5" />
                <span>Receipt</span>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* ── MODAL 1: RENEW MEMBERSHIP MODAL ──────────────────────────── */}
      {showRenewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
                  <RefreshCw className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-gray-900">
                    Renew Membership
                  </h3>
                  <p className="text-xs text-gray-400">
                    Instant access renewal
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowRenewModal(false)}
                className="rounded-full p-1 text-gray-400 hover:bg-gray-100 transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleProcessPayment} className="space-y-4">
              {/* Duration Options */}
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1.5">
                  Select Plan Duration
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { d: 1, label: '1 Month', price: '₹2,499', badge: 'Standard' },
                    { d: 3, label: '3 Months', price: '₹6,499', badge: 'Save 15%' },
                    { d: 12, label: '12 Months', price: '₹19,999', badge: 'VIP 35% OFF' },
                  ].map((opt) => (
                    <button
                      key={opt.d}
                      type="button"
                      onClick={() => setSelectedDuration(opt.d)}
                      className={`rounded-2xl p-2.5 text-center border transition ${
                        selectedDuration === opt.d
                          ? 'border-emerald-500 bg-emerald-50/70'
                          : 'border-gray-200 bg-gray-50'
                      }`}
                    >
                      <span
                        className={`text-[8.5px] font-black uppercase block ${
                          selectedDuration === opt.d
                            ? 'text-emerald-700'
                            : 'text-gray-400'
                        }`}
                      >
                        {opt.badge}
                      </span>
                      <span className="text-xs font-extrabold text-gray-900 block mt-0.5">
                        {opt.label}
                      </span>
                      <span className="text-xs font-black text-emerald-600 block mt-0.5">
                        {opt.price}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Payment Mode */}
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1.5">
                  Payment Method
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedMethod('UPI')}
                    className={`flex items-center justify-center gap-2 rounded-2xl py-2.5 px-3 border text-xs font-bold transition ${
                      selectedMethod === 'UPI'
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                        : 'border-gray-200 text-gray-600'
                    }`}
                  >
                    <QrCode className="h-4 w-4" />
                    <span>UPI (GPay/PhonePe)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedMethod('Card')}
                    className={`flex items-center justify-center gap-2 rounded-2xl py-2.5 px-3 border text-xs font-bold transition ${
                      selectedMethod === 'Card'
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                        : 'border-gray-200 text-gray-600'
                    }`}
                  >
                    <CreditCard className="h-4 w-4" />
                    <span>Card / NetBanking</span>
                  </button>
                </div>
              </div>

              {/* Summary line */}
              <div className="rounded-2xl bg-gray-50 p-3 text-xs space-y-1">
                <div className="flex justify-between text-gray-500">
                  <span>Base Membership:</span>
                  <span className="font-bold text-gray-900">
                    ₹{(renewAmount * 0.82).toFixed(0)}
                  </span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>GST (18% inclusive):</span>
                  <span className="font-bold text-gray-900">
                    ₹{(renewAmount * 0.18).toFixed(0)}
                  </span>
                </div>
                <div className="flex justify-between border-t border-gray-200 pt-1 text-sm font-black text-gray-900">
                  <span>Total Payable:</span>
                  <span className="text-emerald-600">
                    ₹{renewAmount.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowRenewModal(false)}
                  className="flex-1 rounded-2xl border border-gray-200 py-3 text-xs font-bold text-gray-600 hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-2xl bg-emerald-500 py-3 text-xs font-bold text-white shadow-md shadow-emerald-500/25 hover:bg-emerald-600 transition"
                >
                  Pay ₹{renewAmount.toLocaleString('en-IN')} 🔥
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── MODAL 2: TAX INVOICE & RECEIPT MODAL ───────────────────────── */}
      {selectedReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div>
                <h3 className="text-lg font-black text-gray-900">
                  bilzy<span className="text-emerald-500">fit</span>
                </h3>
                <p className="text-[9px] font-bold tracking-widest uppercase text-gray-400">
                  TAX INVOICE / RECEIPT
                </p>
              </div>
              <span className="rounded-lg bg-emerald-100 px-2 py-0.5 text-[10px] font-black text-emerald-800">
                PAID &bull; VERIFIED
              </span>
            </div>

            <div>
              <p className="text-xs text-gray-400 font-medium">Amount Paid</p>
              <h4 className="text-2xl font-black text-gray-900">
                ₹{Number(selectedReceipt.amount).toLocaleString('en-IN')}
              </h4>
            </div>

            <div className="divide-y divide-gray-100 text-xs">
              <div className="flex justify-between py-1.5">
                <span className="text-gray-500">Member Name:</span>
                <span className="font-bold text-gray-900">
                  {member?.fullName || member?.name || 'Rahul Sharma'}
                </span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-gray-500">Member ID:</span>
                <span className="font-bold text-gray-900">{memberId}</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-gray-500">Date:</span>
                <span className="font-bold text-gray-900">
                  {selectedReceipt.date}
                </span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-gray-500">Payment Mode:</span>
                <span className="font-bold text-gray-900">
                  {selectedReceipt.method}
                </span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-gray-500">Transaction ID:</span>
                <span className="font-mono font-bold text-gray-900 text-[10px]">
                  {selectedReceipt.txnId || 'TXN_BF_98124'}
                </span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-gray-500">GSTIN (BilzyFit):</span>
                <span className="font-mono text-gray-600 text-[10px]">
                  07AABCB2104F1Z4
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                setSelectedReceipt(null);
                setShowSuccessToast(true);
                setTimeout(() => setShowSuccessToast(false), 3000);
              }}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-500 py-3 text-xs font-bold text-white shadow-md shadow-emerald-500/25 hover:bg-emerald-600 transition"
            >
              <Download className="h-4 w-4" />
              <span>Download PDF Invoice</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
