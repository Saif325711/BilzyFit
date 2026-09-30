import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import TrialModal from '../components/TrialModal';
import { useAuth } from '../context/AuthContext';
import dashboardImage from '../assets/image 1.png';
import operationsImage from '../assets/image 2.png';
import memberImage from '../assets/image 3.png';
import heroBackground from '../assets/image 4.png';
import brandLogo from '../assets/image 5.png';
import {
  Users,
  CalendarCheck,
  CreditCard,
  MessageCircle,
  Funnel,
  Smartphone,
  Building2,
  Dumbbell,
  BarChart3,
  Check,
  X,
  Star,
  Menu,
  ArrowRight,
  Play,
  ShieldCheck,
} from 'lucide-react';

const rotatingWords = ['Attendance', 'Billing', 'WhatsApp', 'Memberships', 'Staff', 'Renewals'];

const navLinks = [
  { label: 'Home', href: '#home' },
  { label: 'Features', href: '#features' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'Contact', href: '#contact' },
];

function Navbar({ onStartTrial }) {
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 z-50 w-full border-b border-white/10 bg-slate-950/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 lg:px-8">
        <Link to="/landing" className="flex items-center gap-2 text-2xl font-bold text-white">
          <img src={brandLogo} alt="BilzyFit logo" className="h-12 w-auto max-w-[14rem] object-contain" />
        </Link>

        <div className="hidden items-center gap-8 lg:flex">
          {navLinks.map((l) => (
            <a
              key={l.label}
              href={l.href}
              className="text-sm font-medium text-slate-300 transition-colors hover:text-orange-400"
            >
              {l.label}
            </a>
          ))}
        </div>

        <div className="hidden items-center gap-3 lg:flex">
          <Link
            to="/portal"
            className="flex items-center gap-1.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-2 text-sm font-semibold text-emerald-400 transition-colors hover:bg-emerald-500/20"
          >
            <span>📱</span> Member App
          </Link>
          <Link
            to="/login"
            className="rounded-lg border border-slate-700 px-4 py-2 text-sm font-medium text-white transition-colors hover:border-slate-500"
          >
            Login
          </Link>
          <button
            onClick={onStartTrial}
            className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-orange-500/25 transition-transform hover:-translate-y-0.5 hover:bg-orange-600"
          >
            Start Free Trial
          </button>
        </div>

        <button
          className="text-white lg:hidden"
          onClick={() => setOpen((s) => !s)}
          aria-label="Toggle menu"
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-white/10 bg-slate-950 px-4 py-4 lg:hidden">
          <div className="flex flex-col gap-4">
            {navLinks.map((l) => (
              <a
                key={l.label}
                href={l.href}
                className="text-sm font-medium text-slate-300 hover:text-orange-400"
                onClick={() => setOpen(false)}
              >
                {l.label}
              </a>
            ))}
            <Link
              to="/portal"
              onClick={() => setOpen(false)}
              className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-center text-sm font-semibold text-emerald-400"
            >
              📱 Member App
            </Link>
            <Link
              to="/login"
              className="rounded-lg border border-slate-700 px-4 py-2 text-center text-sm font-medium text-white"
            >
              Login
            </Link>
            <button
              onClick={() => {
                setOpen(false);
                onStartTrial();
              }}
              className="rounded-lg bg-orange-500 px-4 py-2 text-center text-sm font-semibold text-white"
            >
              Start Free Trial
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}

function Hero({ wordIndex, onStartTrial }) {
  return (
    <section
      id="home"
      className="relative overflow-hidden bg-slate-950 pb-20 pt-32 lg:pt-44"
    >
      <img
        src={heroBackground}
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 h-full w-full object-cover object-center opacity-20 mix-blend-screen"
      />
      <div className="pointer-events-none absolute inset-0 bg-slate-950/65" />
      {/* Background glows */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-20 top-20 h-72 w-72 rounded-full bg-orange-500/20 blur-[100px]" />
        <div className="absolute right-0 top-40 h-96 w-96 rounded-full bg-indigo-500/15 blur-[120px]" />
        <div className="absolute bottom-0 left-1/3 h-80 w-80 rounded-full bg-orange-600/10 blur-[100px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 text-center lg:px-8">
        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm text-slate-300 backdrop-blur-sm">
          <span className="h-2 w-2 rounded-full bg-green-500" />
          Trusted by 5000+ Gyms Worldwide
        </div>

        <h1 className="mx-auto mt-6 max-w-4xl text-4xl font-extrabold leading-tight text-white md:text-6xl lg:text-7xl">
          The Gym App That Handles
          <br />
          <span className="bg-gradient-to-r from-orange-400 via-orange-500 to-amber-400 bg-clip-text text-transparent transition-all duration-500">
            {rotatingWords[wordIndex]}
          </span>
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-400">
          BilzyFit helps gym owners improve attendance tracking, automate billing, and increase member renewals — all from one app on your phone.
        </p>

        <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <button
            onClick={onStartTrial}
            className="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-6 py-3.5 text-base font-semibold text-white shadow-xl shadow-orange-500/25 transition-transform hover:-translate-y-1 hover:bg-orange-600"
          >
            Start Free Trial
            <ArrowRight className="h-4 w-4" />
          </button>
          <a
            href="#features"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900/50 px-6 py-3.5 text-base font-medium text-white backdrop-blur-sm transition-colors hover:border-slate-500"
          >
            <Play className="h-4 w-4 text-orange-400" />
            Book a Demo
          </a>
        </div>

        <div className="mx-auto mt-8 grid max-w-5xl gap-4 text-left md:grid-cols-2">
          <div className="group overflow-hidden rounded-2xl border border-white/10 bg-slate-900/60 shadow-xl md:row-span-2">
            <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
              <div>
                <p className="text-sm font-semibold text-white">One clear business dashboard</p>
                <p className="mt-1 text-xs text-slate-400">See members, collections and daily activity at a glance.</p>
              </div>
              <BarChart3 className="h-5 w-5 text-orange-400" />
            </div>
            <img
              src={dashboardImage}
              alt="BilzyFit dashboard preview"
              className="h-full max-h-[28rem] w-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.02]"
            />
          </div>
          <div className="group overflow-hidden rounded-2xl border border-white/10 bg-slate-900/60 shadow-xl">
            <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
              <div>
                <p className="text-sm font-semibold text-white">Daily gym operations</p>
                <p className="mt-1 text-xs text-slate-400">Manage attendance, payments and team workflows.</p>
              </div>
              <CalendarCheck className="h-5 w-5 text-green-400" />
            </div>
            <img
              src={operationsImage}
              alt="BilzyFit operations preview"
              className="h-52 w-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.02]"
            />
          </div>
          <div className="group overflow-hidden rounded-2xl border border-white/10 bg-slate-900/60 shadow-xl">
            <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
              <div>
                <p className="text-sm font-semibold text-white">Member experience</p>
                <p className="mt-1 text-xs text-slate-400">Keep every member profile and plan organized.</p>
              </div>
              <Users className="h-5 w-5 text-indigo-400" />
            </div>
            <img
              src={memberImage}
              alt="BilzyFit member management preview"
              className="h-52 w-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.02]"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

const features = [
  {
    icon: Users,
    title: 'Membership Management',
    desc: 'Create membership plans, automate renewal alerts and reduce membership lapses with automated tracking.',
    points: ['Flexible plan templates', 'Automated renewal reminders', 'Digital membership cards', 'Family & group plans'],
  },
  {
    icon: CalendarCheck,
    title: 'Attendance Tracking',
    desc: 'Improve attendance accuracy with QR code, biometric and mobile app check-ins, all visible on one live dashboard.',
    points: ['QR code check-in', 'Biometric integration', 'Real-time dashboard', 'Late/absent alerts'],
  },
  {
    icon: CreditCard,
    title: 'Billing Automation',
    desc: 'Automate invoicing and payment tracking with Razorpay and Stripe integration, reducing overdue payments.',
    points: ['Auto invoices', 'Razorpay / Stripe', 'Payment reminders', 'GST-ready bills'],
  },
  {
    icon: MessageCircle,
    title: 'WhatsApp Engagement',
    desc: 'Automate payment reminders, renewal alerts and promotions directly through WhatsApp to increase member engagement.',
    points: ['Renewal alerts', 'Birthday wishes', 'Bulk messaging', 'Lead follow-ups'],
  },
  {
    icon: Funnel,
    title: 'CRM and Lead Management',
    desc: 'Track every enquiry through a visual pipeline, helping gyms increase lead-to-member conversion rates.',
    points: ['Visual pipeline', 'Follow-up scheduler', 'Source tracking', 'Conversion reports'],
  },
  {
    icon: Smartphone,
    title: 'Member App',
    desc: 'Give members a branded app to check in, book classes and view payments, improving engagement and retention.',
    points: ['Class bookings', 'Payment history', 'Attendance streaks', 'Push notifications'],
  },
  {
    icon: Building2,
    title: 'Multi-Branch Management',
    desc: 'Manage every branch from one app, helping multi-location gyms reduce reporting time and centralize operations.',
    points: ['Branch-level reports', 'Central member DB', 'Role-based access', 'Comparative analytics'],
  },
  {
    icon: Dumbbell,
    title: 'Trainer Management',
    desc: 'Assign personal training sessions, track trainer hours, compute commissions, and review trainer performance.',
    points: ['Session scheduling', 'Hour tracking', 'Commission calculator', 'Performance reviews'],
  },
  {
    icon: BarChart3,
    title: 'Advanced Analytics',
    desc: 'Get actionable insights on revenue growth, member retention rates, and peak gym hours directly from your dashboard.',
    points: ['Revenue trends', 'Retention rates', 'Peak-hour analysis', 'Custom reports'],
  },
];

function Features() {
  return (
    <section id="features" className="relative bg-slate-950 py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="mb-14 text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-orange-500">Features</p>
          <h2 className="mt-3 text-3xl font-bold text-white md:text-4xl">
            Everything Your Gym Needs to Grow
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-slate-400">
            Powerful tools designed to simplify operations, boost member experience, and increase revenue.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <div
              key={f.title}
              className="group rounded-2xl border border-white/10 bg-slate-900/50 p-6 transition-all hover:-translate-y-1 hover:border-orange-500/30 hover:bg-slate-900/80"
            >
              <div className="mb-4 inline-flex rounded-xl bg-orange-500/10 p-3 text-orange-500">
                <f.icon className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold text-white">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-400">{f.desc}</p>
              <ul className="mt-4 space-y-2">
                {f.points.map((p) => (
                  <li key={p} className="flex items-start gap-2 text-sm text-slate-300">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const whatsappTabs = [
  {
    id: 'renewal',
    label: 'Automated Renewal Reminders',
    messages: [
      { from: 'bot', text: 'Hi Rahul 👋\nYour Personal Training Plan is set to expire on 28 July 2026.\nRenew now to continue your personalized workout sessions, expert guidance, progress tracking, and dedicated trainer support without interruption.', time: '10:00 AM' },
      { from: 'user', text: 'Yes, renew my membership.', time: '10:05 AM' },
      { from: 'bot', text: '✅ Renewal request received successfully.\nOur team is processing your request and you will receive payment details shortly.', time: '10:05 AM' },
    ],
  },
  {
    id: 'bulk',
    label: 'Bulk Messaging to Members',
    messages: [
      { from: 'bot', text: '🔥 Weekend Fitness Challenge Alert!\nJoin our special fitness event this Saturday and compete with fellow members.\n🏆 Exciting rewards\n🎁 Exclusive merchandise\n💪 Fun fitness activities\nRegistration closes tomorrow.', time: '11:30 AM' },
      { from: 'user', text: "I'm interested. How can I join?", time: '11:45 AM' },
      { from: 'bot', text: '✅ Registration request received.\nOur team will share event details and participation guidelines with you shortly.', time: '11:45 AM' },
    ],
  },
  {
    id: 'birthday',
    label: 'Birthday Automation',
    messages: [
      { from: 'bot', text: '🎂 Happy Birthday Priya!\nWishing you a fantastic year filled with good health, strength, and fitness achievements.\nAs a birthday gift, enjoy a complimentary personal training session from BilzyFit.\nHave an amazing day! 🎉', time: '09:00 AM' },
      { from: 'user', text: 'Thank you so much 😊', time: '09:15 AM' },
      { from: 'bot', text: "You're welcome!\n🎁 Your complimentary session voucher has been added to your account.\nContact the front desk to schedule your session.", time: '09:16 AM' },
    ],
  },
  {
    id: 'lead',
    label: 'Lead Follow-Up Automation',
    messages: [
      { from: 'bot', text: "Hi Aman 👋\nThank you for showing interest in BilzyFit.\nYour FREE Trial Workout Session has been scheduled for Friday at 6:00 PM.\nWe can't wait to welcome you.", time: '02:00 PM' },
      { from: 'bot', text: 'Looking forward to meeting you.\nIf you have any questions before your visit, simply reply to this message.', time: '02:31 PM' },
    ],
  },
];

function WhatsAppSection() {
  const [active, setActive] = useState('renewal');
  const tab = whatsappTabs.find((t) => t.id === active);

  return (
    <section className="relative overflow-hidden bg-slate-950 py-20 lg:py-28">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -right-20 top-0 h-96 w-96 rounded-full bg-green-500/10 blur-[120px]" />
      </div>
      <div className="relative mx-auto max-w-7xl px-4 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-green-500">WhatsApp Automation</p>
            <h2 className="mt-3 text-3xl font-bold text-white md:text-4xl">
              Engage Members on WhatsApp Automatically
            </h2>
            <p className="mt-4 text-slate-400">
              Send renewal reminders, birthday wishes, bulk offers, and lead follow-ups — all without manual effort.
            </p>
            <div className="mt-8 space-y-3">
              {whatsappTabs.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setActive(t.id)}
                  className={`flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm font-medium transition-all ${
                    active === t.id
                      ? 'border-green-500/30 bg-green-500/10 text-white'
                      : 'border-white/10 bg-slate-900/40 text-slate-400 hover:border-white/20 hover:text-white'
                  }`}
                >
                  <MessageCircle className={`h-5 w-5 ${active === t.id ? 'text-green-500' : 'text-slate-500'}`} />
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          <div className="mx-auto w-full max-w-sm">
            <div className="overflow-hidden rounded-[2.5rem] border-8 border-slate-800 bg-slate-900 shadow-2xl">
              <div className="flex items-center gap-2 bg-slate-800 px-5 py-3">
                <div className="h-3 w-3 rounded-full bg-slate-600" />
                <div className="h-3 w-3 rounded-full bg-slate-600" />
                <div className="h-3 w-3 rounded-full bg-slate-600" />
              </div>
              <div className="h-[420px] overflow-y-auto bg-[#0b141a] p-4">
                <div className="mb-4 text-center text-xs text-slate-500">Today</div>
                <div className="mb-3 flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-600 text-xs font-bold text-white">
                    BF
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">BilzyFit</p>
                    <p className="text-xs text-slate-500">Business Account</p>
                  </div>
                </div>
                {tab.messages.map((m, i) => (
                  <div
                    key={i}
                    className={`mb-3 flex ${m.from === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm ${
                        m.from === 'user'
                          ? 'rounded-br-none bg-green-600 text-white'
                          : 'rounded-bl-none bg-slate-800 text-slate-200'
                      }`}
                    >
                      <p className="whitespace-pre-line">{m.text}</p>
                      <p className={`mt-1 text-right text-[10px] ${m.from === 'user' ? 'text-green-100' : 'text-slate-500'}`}>
                        {m.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

const memberAppFeatures = [
  { icon: CreditCard, title: 'Membership Status & History', desc: 'Members view their plan, expiry date and payment history without asking the front desk', color: 'bg-blue-500' },
  { icon: CalendarCheck, title: 'Class Booking & Schedule', desc: 'Book sessions based on trainer availability, improving class attendance', color: 'bg-orange-500' },
  { icon: MessageCircle, title: 'Smart Notifications', desc: 'Renewal alerts and class reminders that increase member engagement', color: 'bg-purple-500' },
  { icon: BarChart3, title: 'Progress & Fitness Goals', desc: 'Track attendance streaks and goals, helping improve member retention', color: 'bg-green-500' },
];

function MemberAppSection() {
  return (
    <section className="relative bg-slate-950 py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div className="order-2 lg:order-1">
            <p className="text-sm font-semibold uppercase tracking-wider text-orange-500">Member Mobile App</p>
            <h2 className="mt-3 text-3xl font-bold text-white md:text-4xl">
              A Branded App Your Members Will Love
            </h2>
            <p className="mt-4 text-slate-400">
              Give your members the convenience they expect and boost engagement with a personalized mobile experience.
            </p>
            <div className="mt-8 space-y-4">
              {memberAppFeatures.map((f) => (
                <div key={f.title} className="flex gap-4">
                  <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${f.color} text-white`}>
                    <f.icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="text-base font-semibold text-white">{f.title}</h4>
                    <p className="mt-1 text-sm text-slate-400">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <a
              href="#pricing"
              className="mt-8 inline-flex items-center gap-2 rounded-xl bg-orange-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-orange-500/25 transition-transform hover:-translate-y-0.5 hover:bg-orange-600"
            >
              Get Member App
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>

          <div className="order-1 flex justify-center lg:order-2">
            <div className="relative flex items-end justify-center gap-4">
              <div className="hidden h-80 w-48 overflow-hidden rounded-3xl border-8 border-slate-800 bg-slate-900 shadow-xl md:block">
                <div className="h-full bg-gradient-to-b from-slate-800 to-slate-950 p-4">
                  <p className="text-xs text-slate-500">Payment Summary</p>
                  <div className="mt-4 space-y-3">
                    <div className="h-2 rounded bg-slate-700" />
                    <div className="h-2 w-5/6 rounded bg-slate-700" />
                    <div className="h-2 w-4/6 rounded bg-slate-700" />
                  </div>
                  <div className="mt-6 rounded-lg bg-orange-500/20 p-3 text-center text-xs text-orange-300">
                    Quarterly Plan
                  </div>
                </div>
              </div>
              <div className="z-10 h-96 w-56 overflow-hidden rounded-3xl border-8 border-slate-800 bg-white shadow-2xl">
                <div className="h-full bg-slate-50 p-4">
                  <p className="text-sm font-bold text-slate-800">Explore Membership</p>
                  <div className="mt-4 rounded-xl border border-slate-200 bg-white p-3">
                    <p className="text-xs text-slate-500">Basic Plan</p>
                    <p className="text-lg font-bold text-slate-900">₹2,499</p>
                    <p className="mt-1 text-[10px] text-slate-500">Duration 3 Months</p>
                    <div className="mt-2 rounded bg-orange-500 py-1 text-center text-[10px] font-semibold text-white">
                      Buy now
                    </div>
                  </div>
                  <div className="mt-3 rounded-xl border border-slate-200 bg-white p-3">
                    <p className="text-xs text-slate-500">Premium Plan</p>
                    <p className="text-lg font-bold text-slate-900">₹3,999</p>
                    <p className="mt-1 text-[10px] text-slate-500">Duration 6 Months</p>
                    <div className="mt-2 rounded bg-orange-500 py-1 text-center text-[10px] font-semibold text-white">
                      Buy now
                    </div>
                  </div>
                </div>
              </div>
              <div className="hidden h-80 w-48 overflow-hidden rounded-3xl border-8 border-slate-800 bg-slate-900 shadow-xl md:block">
                <div className="h-full bg-gradient-to-b from-slate-800 to-slate-950 p-4">
                  <p className="text-xs text-slate-500">Sign Up</p>
                  <div className="mt-6 space-y-3">
                    <div className="h-8 rounded bg-slate-700" />
                    <div className="h-8 rounded bg-slate-700" />
                    <div className="h-8 rounded bg-orange-500" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

const testimonials = [
  {
    name: 'Praveen MP',
    role: 'Gym Owner',
    text: 'Using BilzyFit from past 2 years, very happy regarding the service and customisation.',
    rating: 5,
  },
  {
    name: 'Venky V',
    role: 'Fitness Center Manager',
    text: 'The attendance and billing automation saved us hours every day. Highly recommended!',
    rating: 5,
  },
  {
    name: 'Hussain Kaseri',
    role: 'Studio Owner',
    text: 'Very good software in India. I think very good software, good thanks 👍👍👍',
    rating: 5,
  },
];

function Testimonials() {
  return (
    <section className="relative bg-slate-950 py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="mb-14 text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-orange-500">Success Stories</p>
          <h2 className="mt-3 text-3xl font-bold text-white md:text-4xl">
            Gym Owners Who Improved Operations With BilzyFit
          </h2>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="rounded-2xl border border-white/10 bg-slate-900/50 p-6"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-700 text-lg font-bold text-white">
                  {t.name[0]}
                </div>
                <div>
                  <p className="font-semibold text-white">{t.name}</p>
                  <p className="text-xs text-slate-500">{t.role}</p>
                </div>
              </div>
              <div className="mt-3 flex gap-1">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="mt-4 text-slate-300">"{t.text}"</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const plans = [
  {
    name: 'Core',
    priceMonthly: 199,
    priceYearly: 999,
    desc: 'Value Plan - Better center management at the best value.',
    features: [
      { text: 'Upto 150 Active Members', included: true },
      { text: '1500 Text SMS Credit', included: true },
      { text: 'SMS & Bulk Messaging Facility', included: true },
      { text: 'Staff Management (Limited Options)', included: true },
      { text: 'Finance & Billing Management', included: true },
      { text: 'Login Up to 2 Users', included: true },
      { text: 'Unlimited Members & Client Record', included: false },
      { text: 'Advanced SMS & Bulk Messaging Facility', included: false },
      { text: 'Lead Tracking & Follow-Up Systems', included: false },
    ],
    popular: false,
  },
  {
    name: 'Basic',
    priceMonthly: 299,
    priceYearly: 1499,
    desc: 'Perfect for single-location center & studios just getting started with digital management.',
    features: [
      { text: 'Unlimited Members & Client Records', included: true },
      { text: 'Advanced SMS & Bulk Messaging Facility', included: true },
      { text: 'Smart Staff Management', included: true },
      { text: 'Finance & Billing Management', included: true },
      { text: 'Lead Tracking & Follow-Up System', included: true },
      { text: 'Access for Up to 3 Users', included: true },
      { text: 'Multi-User Access for Up to 8 Users', included: false },
      { text: 'Branded Member Mobile Application', included: false },
      { text: 'Automated Weekly Email Backups', included: false },
    ],
    popular: false,
  },
  {
    name: 'Premium',
    priceMonthly: 399,
    priceYearly: 1999,
    desc: 'Everything you need to grow a thriving center. Best value for established gyms.',
    features: [
      { text: 'Includes All Features from the Basic Plan', included: true },
      { text: 'Multi-User Access for Up to 8 Users', included: true },
      { text: 'Branded Member Mobile Application', included: true },
      { text: 'Biometric Device Integration (1 Device)', included: true },
      { text: 'Priority Support via Call & WhatsApp', included: true },
      { text: '200+ Customization Options Available', included: true },
      { text: 'Automated Weekly Email Backups', included: true },
      { text: 'Multi-Branch Management Portal Support', included: true },
      { text: 'Complete DLT Implementation Support', included: true },
    ],
    popular: true,
  },
];

function Pricing() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [yearly, setYearly] = useState(true);

  const handleBuy = async (plan) => {
    const destination = `/subscription?plan=${encodeURIComponent(plan.name)}`;
    if (!user) {
      navigate(`/login?redirect=${encodeURIComponent(destination)}`);
      return;
    }
    navigate(destination);
  };

  return (
    <section id="pricing" className="relative bg-slate-950 py-20 lg:py-28">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute bottom-0 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-orange-500/10 blur-[120px]" />
      </div>
      <div className="relative mx-auto max-w-7xl px-4 lg:px-8">
        <div className="mb-14 text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-orange-500">Pricing</p>
          <h2 className="mt-3 text-3xl font-bold text-white md:text-4xl">
            Gym App Pricing That Scales as You Grow
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-slate-400">
            Start your free trial today. No hidden fees, no lock-in contracts.
          </p>

          <div className="mt-8 inline-flex items-center gap-4 rounded-full border border-white/10 bg-slate-900/50 p-1.5">
            <button
              onClick={() => setYearly(false)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${!yearly ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              Monthly
            </button>
            <button
              onClick={() => setYearly(true)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${yearly ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              Annual
            </button>
            <span className="mr-2 rounded-full bg-green-500/15 px-2 py-0.5 text-xs font-semibold text-green-400">
              Save 25%
            </span>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {plans.map((p) => (
            <div
              key={p.name}
              className={`relative rounded-3xl border p-6 ${
                p.popular
                  ? 'border-orange-500 bg-slate-900/80 shadow-xl shadow-orange-500/10'
                  : 'border-white/10 bg-slate-900/50'
              }`}
            >
              {p.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-orange-500 px-4 py-1 text-xs font-bold text-white">
                  MOST POPULAR
                </div>
              )}
              <p className={`text-sm font-bold uppercase tracking-wider ${p.popular ? 'text-orange-500' : 'text-orange-500'}`}>
                {p.name}
              </p>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-2xl font-semibold text-white">₹</span>
                <span className="text-5xl font-extrabold text-white">
                  {(yearly ? p.priceYearly : p.priceMonthly).toLocaleString('en-IN')}
                </span>
                <span className="text-slate-500">/{yearly ? 'year' : 'month'}</span>
              </div>
              <p className="mt-1 text-xs font-medium text-orange-400">
                {yearly ? `₹${Math.round(p.priceYearly / 12).toLocaleString('en-IN')} per month billed annually` : 'Billed monthly · Cancel anytime'}
              </p>
              <p className="mt-3 text-sm text-slate-400">{p.desc}</p>
              <div className="my-6 h-px bg-white/10" />
              <ul className="space-y-3">
                {p.features.map((f) => (
                  <li key={f.text} className="flex items-start gap-3 text-sm">
                    {f.included ? (
                      <Check className="mt-0.5 h-5 w-5 shrink-0 text-green-500" />
                    ) : (
                      <X className="mt-0.5 h-5 w-5 shrink-0 text-slate-600" />
                    )}
                    <span className={f.included ? 'text-slate-300' : 'text-slate-500'}>{f.text}</span>
                  </li>
                ))}
              </ul>
              <button
                onClick={() => handleBuy(p)}
                className={`mt-6 block w-full rounded-xl py-3 text-center text-sm font-bold transition-colors ${
                  p.popular
                    ? 'bg-orange-500 text-white hover:bg-orange-600'
                    : 'border border-slate-700 text-white hover:border-orange-500 hover:text-orange-400'
                }`}
              >
                Buy Now
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer id="contact" className="border-t border-white/10 bg-slate-950 py-14">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link to="/landing" className="flex items-center gap-2 text-2xl font-bold text-white">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-500 text-white">
                <Dumbbell className="h-5 w-5" />
              </span>
              BilzyFit
            </Link>
            <p className="mt-4 text-sm text-slate-400">
              The complete operating system for gyms. Manage memberships, attendance, payments, trainers, and grow revenue.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-white">Product</h4>
            <ul className="mt-4 space-y-2 text-sm text-slate-400">
              <li><a href="#features" className="hover:text-orange-400">Features</a></li>
              <li><a href="#pricing" className="hover:text-orange-400">Pricing</a></li>
              <li><a href="#" className="hover:text-orange-400">Member App</a></li>
              <li><a href="#" className="hover:text-orange-400">Integrations</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-white">Company</h4>
            <ul className="mt-4 space-y-2 text-sm text-slate-400">
              <li><a href="#" className="hover:text-orange-400">About Us</a></li>
              <li><a href="#" className="hover:text-orange-400">Blogs</a></li>
              <li><a href="#" className="hover:text-orange-400">Contact</a></li>
              <li><a href="#" className="hover:text-orange-400">Privacy Policy</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-white">Contact</h4>
            <ul className="mt-4 space-y-2 text-sm text-slate-400">
              <li>support@bilzyfit.com</li>
              <li><a href="tel:+916003359534" className="transition-colors hover:text-orange-400">+91 6003359534</a></li>
              <li>Guwahati, Assam - 781026</li>
              <li className="flex items-center gap-2 pt-2">
                <ShieldCheck className="h-4 w-4 text-green-500" />
                Your Data is Secure with GDPR Compliance.
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 text-sm text-slate-500 md:flex-row">
          <p>Copyright © 2026, BilzyFit - All Rights Reserved</p>
          <p>Version 1.0</p>
        </div>
      </div>
    </footer>
  );
}

export default function Landing() {
  const location = useLocation();
  const [wordIndex, setWordIndex] = useState(0);
  const [trialOpen, setTrialOpen] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setWordIndex((i) => (i + 1) % rotatingWords.length);
    }, 2500);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (new URLSearchParams(location.search).get('trial') === '1') setTrialOpen(true);
  }, [location.search]);

  const openTrial = () => setTrialOpen(true);

  return (
    <div className="min-h-screen bg-slate-950 font-sans text-slate-200 selection:bg-orange-500/30">
      <Navbar onStartTrial={openTrial} />
      <Hero wordIndex={wordIndex} onStartTrial={openTrial} />
      <Features />
      <WhatsAppSection />
      <MemberAppSection />
      <Testimonials />
      <Pricing />
      <Footer />
      <a
        href="https://wa.me/916002732572?text=Hello%20BilzyFit%2C%20I%20want%20to%20know%20more%20about%20the%20gym%20management%20plans."
        target="_blank"
        rel="noreferrer"
        aria-label="Chat with BilzyFit on WhatsApp"
        className="fixed bottom-5 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-2xl shadow-green-900/30 transition-transform hover:scale-110 focus:outline-none focus:ring-4 focus:ring-green-300"
      >
        <MessageCircle className="h-7 w-7 fill-white" />
      </a>
      <TrialModal isOpen={trialOpen} onClose={() => setTrialOpen(false)} />
    </div>
  );
}
