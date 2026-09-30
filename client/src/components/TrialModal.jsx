import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Phone, ShieldCheck, RefreshCw, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { createFreshData, saveData, setActiveWorkspace } from '../data/seed';

const FAST2SMS_API_KEY = 'PYDxhqI210geOFV8BJzlrXn4vf3ZWMyHpKGs9NC6Ruj7cQdkabtio439cvYDeJqNnd82QhXrOUR0Lzsb';

const businessTypes = [
  'Gym', 'Yoga Studio', 'Fitness Center', 'CrossFit Box',
  'Personal Training', 'Dance Studio', 'Other',
];

const countries = [
  { code: 'IN', name: 'India', dial: '+91' },
  { code: 'US', name: 'United States', dial: '+1' },
  { code: 'UK', name: 'United Kingdom', dial: '+44' },
  { code: 'AE', name: 'United Arab Emirates', dial: '+971' },
  { code: 'CA', name: 'Canada', dial: '+1' },
  { code: 'AU', name: 'Australia', dial: '+61' },
];

/* ── Fast2SMS OTP Dispatcher ── */
async function dispatchSmsOtp(mobile, otpCode) {
  // Fast2SMS bulkV2 route for OTP
  try {
    const url = `https://www.fast2sms.com/dev/bulkV2?authorization=${encodeURIComponent(FAST2SMS_API_KEY)}&route=otp&variables_values=${encodeURIComponent(otpCode)}&numbers=${encodeURIComponent(mobile)}`;
    const res = await fetch(url, {
      method: 'GET',
      headers: { Accept: 'application/json' },
    });
    const data = await res.json();
    return data;
  } catch (err) {
    console.warn('Fast2SMS dispatch error:', err);
    return { return: false, message: err.message };
  }
}

/* ── OTP Input (6 boxes) ── */
function OtpInput({ value, onChange }) {
  const refs = useRef([]);
  const digits = value.split('').concat(Array(6).fill('')).slice(0, 6);

  const handleKey = (i, e) => {
    if (e.key === 'Backspace') {
      const next = digits.map((d, idx) => (idx === i ? '' : d)).join('');
      onChange(next);
      if (i > 0 && !digits[i]) refs.current[i - 1]?.focus();
    }
  };

  const handleChange = (i, val) => {
    const ch = val.replace(/\D/g, '').slice(-1);
    const next = digits.map((d, idx) => (idx === i ? ch : d)).join('');
    onChange(next);
    if (ch && i < 5) refs.current[i + 1]?.focus();
  };

  const handlePaste = (e) => {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    onChange(pasted.padEnd(6, '').slice(0, 6).split('').join(''));
    refs.current[Math.min(pasted.length, 5)]?.focus();
    e.preventDefault();
  };

  return (
    <div className="flex gap-2 justify-center" onPaste={handlePaste}>
      {digits.map((d, i) => (
        <input
          key={i}
          ref={(el) => (refs.current[i] = el)}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={d}
          onChange={(e) => handleChange(i, e.target.value)}
          onKeyDown={(e) => handleKey(i, e)}
          className={`h-12 w-11 rounded-xl border text-center text-lg font-bold text-white outline-none transition-all ${
            d
              ? 'border-orange-500 bg-orange-500/10 shadow-sm shadow-orange-500/20'
              : 'border-slate-700 bg-slate-800 focus:border-orange-400'
          }`}
        />
      ))}
    </div>
  );
}

export default function TrialModal({ isOpen, onClose }) {
  const { registerTrial } = useAuth();
  const { setData } = useData();
  const navigate = useNavigate();

  // step: 'form' | 'otp'
  const [step, setStep] = useState('form');
  const [form, setForm] = useState({
    businessName: '',
    businessType: 'Gym',
    country: 'IN',
    mobile: '',
    email: '',
    password: '',
  });

  const [generatedOtp, setGeneratedOtp] = useState('');
  const [apiNotice, setApiNotice] = useState(null);
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resendTimer, setResendTimer] = useState(0);

  // Resend countdown
  useEffect(() => {
    if (resendTimer <= 0) return;
    const id = setInterval(() => setResendTimer((t) => t - 1), 1000);
    return () => clearInterval(id);
  }, [resendTimer]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen) return null;

  const selectedDial = countries.find((c) => c.code === form.country)?.dial || '+91';
  const rawMobile = form.mobile.trim().replace(/^0+/, '').replace(/\D/g, '');

  const handleChange = (field, value) => {
    setForm((f) => ({ ...f, [field]: value }));
  };

  /* Step 1 — generate and send OTP */
  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError('');

    if (!rawMobile || rawMobile.length < 10) {
      setError('Please enter a valid 10-digit mobile number.');
      return;
    }

    setLoading(true);
    const newCode = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(newCode);

    try {
      const result = await dispatchSmsOtp(rawMobile, newCode);

      if (result && result.return === true) {
        setApiNotice({
          type: 'success',
          text: `SMS OTP sent successfully to ${selectedDial} ${rawMobile}!`,
        });
      } else if (result && result.status_code === 996) {
        setApiNotice({
          type: 'notice',
          text: `Fast2SMS notice: Complete website verification in your Fast2SMS dashboard to enable direct delivery. Test OTP: ${newCode}`,
        });
      } else if (result && result.message) {
        setApiNotice({
          type: 'notice',
          text: `Fast2SMS notice: ${result.message}. Test OTP: ${newCode}`,
        });
      } else {
        setApiNotice({
          type: 'notice',
          text: `Fast2SMS verification code: ${newCode}`,
        });
      }

      setStep('otp');
      setResendTimer(60);
    } catch (err) {
      setApiNotice({
        type: 'notice',
        text: `Verification code: ${newCode}`,
      });
      setStep('otp');
      setResendTimer(60);
    } finally {
      setLoading(false);
    }
  };

  /* Step 2 — verify OTP & register */
  const handleVerifyAndRegister = async (e) => {
    e.preventDefault();
    const entered = otp.replace(/\D/g, '');

    if (entered.length !== 6) {
      setError('Please enter the 6-digit OTP code.');
      return;
    }

    if (entered !== generatedOtp) {
      setError('Incorrect OTP. Please enter the valid verification code.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const result = await registerTrial({
        ...form,
        mobile: rawMobile,
      });

      if (!result.success) {
        setError(result.message || 'Trial registration failed.');
        setLoading(false);
        return;
      }

      setActiveWorkspace(result.user.workspaceId);
      const freshData = createFreshData({
        workspaceId: result.user.workspaceId,
        gymName: form.businessName.trim(),
        businessType: form.businessType,
        phone: `${selectedDial} ${rawMobile}`,
        email: form.email.trim().toLowerCase(),
      });

      saveData(freshData, result.user.workspaceId);
      setData(freshData);
      onClose();
      navigate('/');
    } catch (err) {
      setError('Verification failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendTimer > 0) return;
    setError('');
    setOtp('');
    setLoading(true);

    const newCode = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(newCode);

    try {
      const result = await dispatchSmsOtp(rawMobile, newCode);
      if (result && result.return === true) {
        setApiNotice({
          type: 'success',
          text: `A new SMS OTP has been sent to ${selectedDial} ${rawMobile}!`,
        });
      } else {
        setApiNotice({
          type: 'notice',
          text: `Fast2SMS notice: ${result?.message || 'Verification pending'}. Test OTP: ${newCode}`,
        });
      }
      setResendTimer(60);
    } catch (err) {
      setApiNotice({
        type: 'notice',
        text: `New verification code: ${newCode}`,
      });
      setResendTimer(60);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-white/10 bg-slate-900 shadow-2xl">

        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
          <div>
            <h3 className="text-xl font-bold text-white">
              {step === 'form' ? "Let's start your free trial" : 'Verify your mobile number'}
            </h3>
            {step === 'otp' && (
              <p className="mt-0.5 text-sm text-slate-400">
                OTP sent to <span className="font-semibold text-orange-400">{selectedDial} {rawMobile}</span>
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 transition-colors hover:bg-white/10 hover:text-white"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* ── STEP 1: Registration Form ── */}
        {step === 'form' && (
          <form onSubmit={handleSendOtp} className="space-y-4 px-6 py-6">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-orange-400">Business Name</label>
              <input
                type="text" required placeholder="Enter Business Name"
                value={form.businessName} onChange={(e) => handleChange('businessName', e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-2.5 text-white placeholder-slate-500 outline-none transition-colors focus:border-orange-500"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-orange-400">Business Type</label>
              <select
                value={form.businessType} onChange={(e) => handleChange('businessType', e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-2.5 text-white outline-none transition-colors focus:border-orange-500"
              >
                {businessTypes.map((t) => <option key={t} value={t} className="bg-slate-800">{t}</option>)}
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-orange-400">Select Country</label>
              <select
                value={form.country} onChange={(e) => handleChange('country', e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-2.5 text-white outline-none transition-colors focus:border-orange-500"
              >
                {countries.map((c) => (
                  <option key={c.code} value={c.code} className="bg-slate-800">{c.name} {c.code} ({c.dial})</option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-orange-400">Mobile Number (10 digits)</label>
              <div className="flex gap-3">
                <span className="flex shrink-0 items-center rounded-xl border border-slate-700 bg-slate-800 px-3 text-sm text-slate-300">
                  {selectedDial}
                </span>
                <input
                  type="tel" required placeholder="9876543210"
                  maxLength={10}
                  value={form.mobile} onChange={(e) => handleChange('mobile', e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-2.5 text-white placeholder-slate-500 outline-none transition-colors focus:border-orange-500"
                />
              </div>
              <p className="mt-1 text-xs text-slate-500">Fast2SMS will deliver a 6-digit OTP to this number.</p>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-orange-400">Email</label>
              <input
                type="email" required placeholder="owner@yourgym.com"
                value={form.email} onChange={(e) => handleChange('email', e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-2.5 text-white placeholder-slate-500 outline-none transition-colors focus:border-orange-500"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-orange-400">Set Password</label>
              <input
                type="password" required minLength={8} placeholder="Min 8 characters"
                value={form.password} onChange={(e) => handleChange('password', e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-2.5 text-white placeholder-slate-500 outline-none transition-colors focus:border-orange-500"
              />
            </div>

            {error && <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">{error}</p>}

            <button
              type="submit" disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 py-3.5 text-sm font-bold text-white shadow-lg shadow-orange-500/25 transition-transform hover:-translate-y-0.5 hover:bg-orange-600 disabled:opacity-70"
            >
              <Phone className="h-4 w-4" />
              {loading ? 'Sending OTP via Fast2SMS...' : 'Send OTP to Verify'}
            </button>

            <p className="text-center text-xs text-slate-500">
              Your account includes a full 3-day free trial. By submitting this form, I confirm that I have read and understood{' '}
              <a href="#" className="text-slate-400 underline hover:text-orange-400">privacy policy</a>.
            </p>
          </form>
        )}

        {/* ── STEP 2: OTP Verification ── */}
        {step === 'otp' && (
          <form onSubmit={handleVerifyAndRegister} className="px-6 py-8 space-y-6">
            <div className="flex justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-orange-500/15 ring-2 ring-orange-500/30">
                <ShieldCheck className="h-8 w-8 text-orange-400" />
              </div>
            </div>

            {apiNotice && (
              <div className={`rounded-xl border p-3.5 text-xs ${
                apiNotice.type === 'success'
                  ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300'
                  : 'border-orange-500/30 bg-orange-500/10 text-orange-200'
              }`}>
                <div className="flex items-start gap-2">
                  {apiNotice.type === 'success' ? (
                    <CheckCircle className="h-4 w-4 shrink-0 text-emerald-400 mt-0.5" />
                  ) : (
                    <AlertCircle className="h-4 w-4 shrink-0 text-orange-400 mt-0.5" />
                  )}
                  <p className="leading-relaxed font-medium">{apiNotice.text}</p>
                </div>
              </div>
            )}

            <p className="text-center text-sm text-slate-400">
              Enter the 6-digit OTP code below to verify your number and activate your gym trial account.
            </p>

            <OtpInput value={otp} onChange={setOtp} />

            {error && <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-center text-sm text-red-300">{error}</p>}

            <button
              type="submit" disabled={loading || otp.replace(/\D/g, '').length !== 6}
              className="w-full rounded-xl bg-orange-500 py-3.5 text-sm font-bold text-white shadow-lg shadow-orange-500/25 transition-transform hover:-translate-y-0.5 hover:bg-orange-600 disabled:opacity-50"
            >
              {loading ? 'Activating Trial...' : '✓ Verify & Start Free Trial'}
            </button>

            <div className="flex items-center justify-between text-sm">
              <button
                type="button"
                onClick={() => { setStep('form'); setOtp(''); setError(''); setApiNotice(null); }}
                className="text-slate-400 hover:text-white transition-colors"
              >
                ← Change number
              </button>
              <button
                type="button"
                onClick={handleResend}
                disabled={resendTimer > 0 || loading}
                className="flex items-center gap-1.5 text-orange-400 hover:text-orange-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                {resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Resend OTP'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
