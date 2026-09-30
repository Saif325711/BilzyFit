import { useState } from 'react';
import {
  Smartphone,
  ExternalLink,
  Copy,
  Check,
  Zap,
  Users,
  Shield,
  Star,
  Download,
  CheckCircle2,
  Maximize2,
  RefreshCw,
} from 'lucide-react';
import PageHeader from '../components/ui/PageHeader';
import Card from '../components/ui/Card';
import MemberPortal from '../../member-app/MemberApp';

const APP_DOWNLOAD_URL = 'https://play.google.com/store/apps/details?id=com.bilzyfit.member';

const FEATURES = [
  { icon: Zap, label: 'QR Check-in', desc: 'Scan to mark attendance instantly', color: 'bg-amber-100 text-amber-700' },
  { icon: Smartphone, label: 'Workout Plans', desc: 'View trainer-assigned workouts', color: 'bg-emerald-100 text-emerald-700' },
  { icon: Users, label: 'Diet Tracker', desc: 'Follow your personalised meal plan', color: 'bg-teal-100 text-teal-700' },
  { icon: Shield, label: 'Payment History', desc: 'Track dues and receipts', color: 'bg-purple-100 text-purple-700' },
];

const REVIEWS = [
  { name: 'Rahul S.', rating: 5, text: 'Love the QR check-in. No waiting at the counter!' },
  { name: 'Priya M.', rating: 5, text: 'All my workout and diet plans in one place. Great app!' },
  { name: 'Amit K.', rating: 4, text: 'Very smooth experience. Membership details are always up to date.' },
];

function StarRating({ count = 5 }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`h-3.5 w-3.5 ${i < count ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}`}
        />
      ))}
    </div>
  );
}

export default function MemberAppPage() {
  const [activeView, setActiveView] = useState('preview'); // 'preview' | 'share'
  const [copied, setCopied] = useState(false);
  const [phoneKey, setPhoneKey] = useState(0);

  const handleCopy = () => {
    navigator.clipboard.writeText(APP_DOWNLOAD_URL).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const qrSrc = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&color=047857&bgcolor=ffffff&qzone=2&data=${encodeURIComponent(
    APP_DOWNLOAD_URL
  )}`;

  return (
    <div className="page-container max-w-6xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <PageHeader
          title="Member App"
          subtitle="Experience the redesigned BilzyFit Member App, test member workout flows, or share with gym members."
        />

        {/* View Switcher Toggle */}
        <div className="flex items-center gap-1 rounded-2xl bg-gray-100 p-1.5 self-start sm:self-auto shrink-0 shadow-inner">
          <button
            type="button"
            onClick={() => setActiveView('preview')}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
              activeView === 'preview'
                ? 'bg-white text-emerald-700 shadow-sm'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            <Smartphone className="h-4 w-4" />
            Live App Simulator
          </button>
          <button
            type="button"
            onClick={() => setActiveView('share')}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
              activeView === 'share'
                ? 'bg-white text-emerald-700 shadow-sm'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            <Download className="h-4 w-4" />
            Share &amp; QR Code
          </button>
        </div>
      </div>

      {/* VIEW 1: LIVE APP SIMULATOR (DEFAULT) */}
      {activeView === 'preview' && (
        <div className="flex flex-col lg:flex-row items-center lg:items-start justify-center gap-8 py-2">
          {/* Phone Frame Mockup */}
          <div className="relative">
            {/* Phone Bezel */}
            <div className="w-[390px] max-w-[95vw] h-[810px] rounded-[48px] bg-[#111827] p-3.5 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.3)] ring-1 ring-white/20 relative">
              {/* Speaker / Dynamic Island */}
              <div className="absolute top-4 left-1/2 -translate-x-1/2 h-4 w-28 rounded-full bg-black z-50 flex items-center justify-center">
                <div className="h-2.5 w-2.5 rounded-full bg-[#1e293b] mr-2" />
                <div className="h-2 w-2 rounded-full bg-[#0ea5e9]/40" />
              </div>

              {/* Phone Screen Inner Container */}
              <div
                key={phoneKey}
                className="w-full h-full rounded-[38px] overflow-y-auto overflow-x-hidden bg-[#F7F9F8] relative custom-scrollbar pt-4"
              >
                <MemberPortal initialTab="workout" />
              </div>
            </div>

            {/* Quick Actions under phone */}
            <div className="mt-4 flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setPhoneKey((k) => k + 1)}
                className="inline-flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 shadow-sm hover:bg-gray-50"
              >
                <RefreshCw className="h-3.5 w-3.5 text-gray-500" /> Reset View
              </button>
              <a
                href="/portal"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3.5 py-1.5 text-xs font-bold text-white shadow-sm hover:bg-emerald-700"
              >
                <Maximize2 className="h-3.5 w-3.5" /> Fullscreen Portal
                <ExternalLink className="h-3 w-3 opacity-70" />
              </a>
            </div>
          </div>

          {/* Right Side Info & Instructions for Admin */}
          <div className="w-full lg:max-w-md space-y-4">
            <Card className="border-emerald-100 bg-gradient-to-br from-emerald-50/70 via-white to-white p-5">
              <div className="flex items-center gap-2 text-emerald-800 font-extrabold text-sm mb-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 text-white text-xs">
                  ✓
                </span>
                Live Member Experience
              </div>
              <p className="text-xs text-gray-600 leading-relaxed">
                This is the exact view your gym members see on their smartphones. You can:
              </p>
              <ul className="mt-3 space-y-2 text-xs text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="font-bold text-emerald-600">•</span>
                  <span><strong>Push Day Strength:</strong> Inspect the recommended workout routine with reps &amp; exercise cards.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold text-emerald-600">•</span>
                  <span><strong>+ Create My Workout:</strong> Test creating a custom workout routine with the step-by-step modal.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold text-emerald-600">•</span>
                  <span><strong>Tabs:</strong> Switch between <i>My Plan</i>, <i>Muscle Groups</i>, and <i>History</i>.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold text-emerald-600">•</span>
                  <span><strong>Bottom Navigation:</strong> Navigate to Diet, Progress, Payments, and Profile.</span>
                </li>
              </ul>
            </Card>

            <Card className="p-5">
              <h4 className="text-sm font-bold text-gray-900 mb-2">Flutter Mobile App Status</h4>
              <p className="text-xs text-gray-500 mb-3">
                The Flutter Android/iOS codebase in <code className="rounded bg-gray-100 px-1 py-0.5 font-mono text-emerald-700">member_app/</code> is synced with the exact same UI, colors, asset banner, and stats.
              </p>
              <div className="flex items-center justify-between rounded-xl bg-gray-50 p-3 text-xs">
                <span className="font-semibold text-gray-700">Flutter Compilation</span>
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-[11px] font-bold text-emerald-700">
                  <Check className="h-3 w-3" /> Ready (0 errors)
                </span>
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* VIEW 2: SHARE & DOWNLOAD */}
      {activeView === 'share' && (
        <div className="space-y-8 animate-fadeIn">
          {/* Hero banner */}
          <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-800 via-emerald-900 to-slate-900 p-6 text-white shadow-xl md:p-10">
            <div className="flex flex-col items-center gap-8 lg:flex-row lg:items-stretch">
              {/* Left — info */}
              <div className="flex-1">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-emerald-200">
                  <Smartphone className="h-3.5 w-3.5" /> BilzyFit Member App
                </span>
                <h2 className="mt-4 text-3xl font-extrabold leading-tight md:text-4xl">
                  Your gym, in your pocket
                </h2>
                <p className="mt-3 text-base text-emerald-100 leading-relaxed max-w-lg">
                  Members can check in with a QR scan, view their workout &amp; diet plans, track attendance,
                  and see payment history — all from one simple app.
                </p>

                <ul className="mt-6 space-y-2.5">
                  {['Free to download for all members', 'Works offline for workout &amp; diet plans', 'Instant QR check-in at the gym'].map((item) => (
                    <li key={item} className="flex items-center gap-2.5 text-sm text-emerald-100">
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
                      <span dangerouslySetInnerHTML={{ __html: item }} />
                    </li>
                  ))}
                </ul>

                <a
                  id="member-app-download-btn"
                  href={APP_DOWNLOAD_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-bold text-emerald-900 shadow-lg transition hover:bg-emerald-50 hover:shadow-xl active:scale-95"
                >
                  <Download className="h-4 w-4" />
                  Download on Google Play
                  <ExternalLink className="h-3.5 w-3.5 opacity-60" />
                </a>
              </div>

              {/* Right — QR */}
              <div className="flex flex-col items-center justify-center rounded-2xl bg-white/10 p-6 backdrop-blur-sm lg:min-w-[240px]">
                <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-emerald-200">
                  Scan to Download
                </p>
                <div className="rounded-2xl bg-white p-3 shadow-lg">
                  <img
                    src={qrSrc}
                    alt="QR code to download BilzyFit Member App"
                    className="h-[180px] w-[180px] rounded-lg"
                  />
                </div>
                <p className="mt-3 text-center text-xs text-emerald-200">
                  Point your phone camera<br />at this code
                </p>
              </div>
            </div>
          </div>

          {/* Share link row */}
          <Card className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between p-5">
            <div>
              <p className="text-sm font-semibold text-gray-800">Share download link with members</p>
              <p className="mt-0.5 text-xs text-gray-500 break-all">{APP_DOWNLOAD_URL}</p>
            </div>
            <button
              id="member-app-copy-link-btn"
              type="button"
              onClick={handleCopy}
              className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-emerald-50 hover:border-emerald-200 hover:text-emerald-700"
            >
              {copied ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
              {copied ? 'Copied!' : 'Copy link'}
            </button>
          </Card>

          {/* Features grid */}
          <div>
            <h3 className="mb-4 text-base font-semibold text-gray-900">What members can do in the app</h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {FEATURES.map(({ icon: Icon, label, desc, color }) => (
                <Card key={label} className="flex flex-col gap-3 transition hover:shadow-md p-4">
                  <div className={`w-fit rounded-xl p-2.5 ${color}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">{label}</p>
                    <p className="mt-0.5 text-xs text-gray-500">{desc}</p>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Member reviews */}
          <div>
            <h3 className="mb-4 text-base font-semibold text-gray-900">What members are saying</h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {REVIEWS.map(({ name, rating, text }) => (
                <Card key={name} className="space-y-2.5 p-4">
                  <StarRating count={rating} />
                  <p className="text-sm text-gray-700 leading-relaxed">"{text}"</p>
                  <p className="text-xs font-semibold text-gray-500">— {name}</p>
                </Card>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
