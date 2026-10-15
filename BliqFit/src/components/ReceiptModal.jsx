import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Printer, Smartphone, KeyRound, ShieldCheck } from 'lucide-react';
import QRCode from 'qrcode';
import { useData } from '../context/DataContext';
import Button from './ui/Button';

export default function ReceiptModal({ member, onClose, membershipId, paymentId }) {
  const { data } = useData();
  const memberships = data.memberships
    .filter((m) => m.memberId === member.id)
    .sort((a, b) => new Date(b.startDate) - new Date(a.startDate))[0];
  const selectedPayment = data.payments.find((p) => p.id === paymentId);
  const membership = data.memberships.find((item) => item.id === membershipId)
    || (selectedPayment?.membershipId && data.memberships.find((item) => item.id === selectedPayment.membershipId))
    || (selectedPayment?.invoiceNumber && data.memberships.find((item) => item.invoiceNumber === selectedPayment.invoiceNumber))
    || memberships;
  const payments = data.payments.filter((p) => p.memberId === member.id && (!membership?.invoiceNumber || p.invoiceNumber === membership.invoiceNumber));
  const invoiceNumber = selectedPayment?.invoiceNumber || membership?.invoiceNumber || '—';
  const invoiceAmount = selectedPayment ? selectedPayment.amount : membership?.amount || 0;
  const gym = data.settings;
  const secretCode = member.secretCode || '749201';

  // Resolve member's specific gym center / branch
  const matchedBranch = (data.settings?.branches || []).find(
    (b) => b.name?.toLowerCase() === member.branch?.toLowerCase() || b.id === member.branch
  );
  const centerTitle = matchedBranch?.name || member.gymName || member.branch || gym.gymName || 'Star Fitness';
  const isStar = centerTitle.toLowerCase().includes('star');
  const centerName = isStar ? 'Star Fitness' : centerTitle;
  const centerAddress = matchedBranch?.address || (isStar ? 'Plot 18, Commercial Hub, Sector 62, Noida, Uttar Pradesh' : gym.address);
  const centerPhone = matchedBranch?.phone || (isStar ? '+91 98111 22334' : gym.phone);
  const centerEmail = matchedBranch?.email || (isStar ? 'support@starfitness.com' : gym.email);

  const [qrUrl, setQrUrl] = useState('');

  useEffect(() => {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:5173';
    const memberAppUrl = `${origin}/member-app?user=${encodeURIComponent(member.memberId || '')}&code=${encodeURIComponent(secretCode)}&center=${encodeURIComponent(centerName)}`;
    QRCode.toDataURL(memberAppUrl, {
      width: 140,
      margin: 1,
      color: { dark: '#065F46', light: '#FFFFFF' },
    })
      .then(setQrUrl)
      .catch(() => {});
  }, [member, secretCode, centerName]);

  const handlePrint = () => window.print();

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto p-4 print:p-0">
      <div
        className="fixed inset-0 bg-gray-900/40 print:hidden"
        onClick={onClose}
      />
      <div className="relative z-10 mt-8 w-full max-w-2xl rounded-xl border border-gray-200 bg-white p-8 shadow-xl print:mt-0 print:max-w-none print:rounded-none print:border-0 print:shadow-none">
        <div className="mb-6 flex items-center justify-between print:hidden">
          <h2 className="text-lg font-semibold text-gray-900">
            Membership Receipt
          </h2>
          <button
            onClick={onClose}
            className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div id="receipt-print" className="space-y-6 text-sm text-gray-800">
          <div className="flex items-start justify-between border-b border-gray-200 pb-4">
            <div>
              <h1 className="text-2xl font-bold text-primary-700">{centerName}</h1>
              <p className="mt-1 text-gray-600">{centerAddress}</p>
              <p className="text-gray-600">Phone: {centerPhone}</p>
              <p className="text-gray-600">Email: {centerEmail}</p>
              {member.branch && (
                <span className="mt-1 inline-block rounded-md bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-800">
                  Branch / Center: {member.branch}
                </span>
              )}
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500">Invoice #</p>
              <p className="font-semibold">{invoiceNumber}</p>
              <p className="mt-2 text-xs text-gray-500">Date</p>
              <p className="font-semibold">{selectedPayment?.date || membership?.startDate || '—'}</p>
            </div>
          </div>

          <div>
            <h3 className="mb-2 text-base font-semibold text-gray-900">Member Details</h3>
            <div className="grid gap-2 sm:grid-cols-2">
              <p><span className="font-medium">Name:</span> {member.fullName}</p>
              <p><span className="font-medium">Member ID:</span> {member.memberId}</p>
              <p><span className="font-medium">Mobile:</span> {member.mobile}</p>
              <p><span className="font-medium">Email:</span> {member.email}</p>
              <p><span className="font-medium">Joining Date:</span> {member.joiningDate}</p>
              <p><span className="font-medium">Goal:</span> {member.goal}</p>
            </div>
          </div>

          <div>
            <h3 className="mb-2 text-base font-semibold text-gray-900">Membership Details</h3>
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-gray-600">
                <tr>
                  <th className="px-3 py-2">Plan</th>
                  <th className="px-3 py-2">Start</th>
                  <th className="px-3 py-2">Expiry</th>
                  <th className="px-3 py-2 text-right">Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-100">
                  <td className="px-3 py-2">{membership?.planName || '—'}</td>
                  <td className="px-3 py-2">{membership?.startDate || '—'}</td>
                  <td className="px-3 py-2">{membership?.expiryDate || '—'}</td>
                  <td className="px-3 py-2 text-right font-semibold">
                    ₹{invoiceAmount.toLocaleString('en-IN')}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="flex justify-end border-t border-gray-200 pt-4">
            <div className="w-full max-w-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Total Amount</span>
                <span className="font-semibold">₹{invoiceAmount.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Paid</span>
                <span className="font-semibold text-green-700">
                  ₹{(selectedPayment ? selectedPayment.amount : payments.reduce((s, p) => s + p.amount, 0)).toLocaleString('en-IN')}
                </span>
              </div>
              <div className="flex justify-between border-t border-gray-200 pt-2">
                <span className="font-medium">Pending</span>
                <span className="font-semibold text-red-600">
                  ₹{(selectedPayment ? 0 : membership?.pendingAmount || 0).toLocaleString('en-IN')}
                </span>
              </div>
              <div className="pt-1 text-xs text-gray-500">
                Payment Method: {selectedPayment?.method || payments[0]?.method || '—'}
              </div>
            </div>
          </div>

          {/* ── BILZYFIT MEMBER APP PASS (SECRET CODE & QR) ── */}
          <div className="rounded-xl border-2 border-dashed border-emerald-500/40 bg-emerald-50/60 p-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-md bg-emerald-600 text-xs font-black text-white">
                    <Smartphone className="h-3.5 w-3.5" />
                  </span>
                  <h4 className="font-extrabold text-gray-900 text-sm">
                    {centerName} Member App Access Credentials
                  </h4>
                  <span className="rounded bg-emerald-200/80 px-1.5 py-0.5 text-[9.5px] font-black text-emerald-800 uppercase tracking-wide">
                    Confidential
                  </span>
                </div>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Download or open the {centerName} Member App to track daily workouts, diet plans, gym attendance and digital VIP entry pass.
                </p>
                <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
                  <span className="rounded-lg bg-white px-2.5 py-1 font-mono font-bold text-gray-800 border border-emerald-200 shadow-sm">
                    Username / ID: <strong className="text-gray-950 font-black">{member.memberId}</strong>
                  </span>
                  <span className="rounded-lg bg-emerald-600 px-3 py-1 font-mono font-black text-white shadow-sm flex items-center gap-1.5">
                    <KeyRound className="h-3.5 w-3.5" />
                    <span>Secret Code: <strong className="tracking-widest text-emerald-100">{secretCode}</strong></span>
                  </span>
                </div>
              </div>

              {/* QR Code container */}
              <div className="flex flex-col items-center justify-center rounded-xl bg-white p-2.5 shadow-sm border border-emerald-200 shrink-0">
                {qrUrl ? (
                  <img
                    src={qrUrl}
                    alt="Member App QR Code"
                    className="h-24 w-24 rounded-lg object-contain"
                  />
                ) : (
                  <div className="flex h-24 w-24 items-center justify-center rounded-lg bg-gray-100 text-gray-400 text-xs">
                    Loading QR...
                  </div>
                )}
                <span className="text-[9px] font-black text-emerald-700 mt-1 uppercase tracking-wider">
                  Member App QR
                </span>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-4 text-center text-xs text-gray-500">
            Thank you for choosing {centerName}. This is a computer generated receipt.
          </div>
        </div>

        <div className="mt-8 flex justify-end gap-3 print:hidden">
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
          <Button onClick={handlePrint} icon={Printer}>
            Print Receipt
          </Button>
        </div>
      </div>
    </div>,
    document.body
  );
}
