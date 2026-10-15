import React, { useState } from 'react';
import {
  Check,
  X,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
  HelpCircle,
  Star,
  Smartphone,
  CreditCard,
  Users,
  Clock,
  Award,
  Building,
  ChevronRight,
  Calculator,
  FileCheck,
  PhoneCall,
  Bus,
  Fingerprint,
  MessageCircle,
  TrendingUp,
  Package,
  Layers,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export default function Plans({ onOpenDemo, onOpenTrial, onNavigateHome, onBuyNow }) {
  const [openFaq, setOpenFaq] = useState(0);

  const plans = [
    {
      id: 'basic',
      name: 'Basic Plan',
      badge: 'Essential School ERP',
      badgeColor: '#475569',
      badgeBg: '#f1f5f9',
      price: 1999,
      period: 'per year',
      description: 'Core student administration, daily attendance, gradebook, and manual fee receipts for growing schools.',
      popular: false,
      features: [
        'Central Student 360° Profile & Document Archive',
        'Daily Period-wise & Class-wise Attendance System',
        'Manual Fee Collection & Automated PDF Receipts',
        'Examination Management & CBSE Gradebook Marks Entry',
        'Class-wise Homework, Noticeboard & Circulars',
        'Standard School Calendar & Event Scheduler',
        'Single Campus License & Role-Based Staff Access',
        'Standard Email & Phone Technical Support'
      ],
      notIncluded: [
        'WhatsApp Official Meta API Automated Alerts',
        'Online Fee Payment Gateway (0% UPI & Netbanking)',
        '4 Native Mobile Apps (Admin, Teachers, Parents, Students)',
        'Biometric & RFID Turnstile Gate Hardware Sync',
        'School Bus Real-time GPS Fleet Tracking Map',
        'AI Timetable & Daily Teacher Substitution Engine',
        'NEP 2020 Multidimensional Holistic Progress Cards'
      ],
      btnText: 'Buy Basic Plan — ₹1,999/yr',
      btnClass: 'btn-secondary'
    },
    {
      id: 'premium',
      name: 'Premium Plan',
      badge: 'MOST POPULAR • ALL-IN-ONE',
      badgeColor: '#2563eb',
      badgeBg: '#eff6ff',
      price: 2999,
      period: 'per year',
      description: 'Complete high-tech automation including WhatsApp messaging, 4 native mobile apps, GPS bus tracking, biometric gates, and NEP 2020 reports.',
      popular: true,
      features: [
        'Everything in Basic Plan, PLUS:',
        'Official Meta WhatsApp Business API Messaging (Receipts & Alerts)',
        'Online Fee Gateway (0% UPI, QR Code, Netbanking & Cards)',
        '4 Native Mobile Apps (iOS & Android for Admin, Teachers, Parents, Students)',
        'NEP 2020 Holistic Progress Card (HPC) 360° Competency Reports',
        'Real-time GPS School Bus Fleet Tracking with Parent Map & ETA',
        'Biometric Fingerprint & RFID Gate Turnstile Hardware Integration',
        'AI Timetable Generator & Automatic Daily Teacher Substitution',
        'Digital Admissions Enquiry CRM & Online Application Portal',
        'Staff Payroll, Leave Approval & Salary Slips Generator',
        'Dedicated 24/7 Priority Relationship Manager'
      ],
      notIncluded: [],
      btnText: 'Buy Premium Plan — ₹2,999/yr',
      btnClass: 'btn-primary'
    }
  ];

  const comparisonRows = [
    { feature: 'Annual License Fee', basic: '₹1,999 / year', premium: '₹2,999 / year' },
    { feature: 'Student Database Vault & Documents', basic: true, premium: true },
    { feature: 'Classroom Daily Attendance System', basic: true, premium: true },
    { feature: 'Fee Management & PDF Receipts', basic: true, premium: true },
    { feature: 'Exam Schedules & Digital Gradebook', basic: true, premium: true },
    { feature: 'Official Meta WhatsApp Business API', basic: false, premium: true },
    { feature: 'Online UPI / QR Code Payment Gateway', basic: false, premium: true },
    { feature: 'Native Mobile Apps (Parent & Teacher)', basic: false, premium: true },
    { feature: 'Biometric Face / RFID Gate Sync', basic: false, premium: true },
    { feature: 'School Bus GPS Live Tracking on Map', basic: false, premium: true },
    { feature: 'NEP 2020 Holistic Progress Card (HPC)', basic: false, premium: true },
    { feature: 'AI Timetable & Teacher Substitution', basic: false, premium: true },
    { feature: 'Support SLA', basic: 'Email & Phone (Mon-Sat)', premium: '24/7 Priority Dedicated Manager' }
  ];

  const faqs = [
    {
      q: 'What is included in the ₹1,999 and ₹2,999 annual plans?',
      a: 'The Basic Plan (₹1,999/yr) includes core administration, attendance, fees, exams, and notices. The Premium Plan (₹2,999/yr) adds the official Meta WhatsApp engine, 4 mobile apps, GPS bus tracking, biometric hardware integration, and NEP 2020 report cards.'
    },
    {
      q: 'What happens after I click "Buy Now"?',
      a: 'You will be taken to our secure registration page where you provide your school details (name, admin contact, city, student count). Immediately after, you can complete payment via UPI, QR code, card, or net banking, and your portal will be activated instantly.'
    },
    {
      q: 'Are there any hidden setup or data migration charges?',
      a: 'Zero hidden fees. We provide complete cloud setup, student data migration from your existing software or Excel spreadsheets, and staff onboarding at no extra charge.'
    },
    {
      q: 'Can we upgrade from Basic to Premium later?',
      a: 'Yes! You can upgrade anytime during your academic year with simple pro-rated billing.'
    },
    {
      q: 'How does parent fee collection work?',
      a: 'Parent payments made via UPI, QR code, or cards settle directly into your school verified bank account on a T+1 settlement cycle. EduBliq never holds your funds.'
    }
  ];

  return (
    <div className="plans-page" style={{ backgroundColor: '#ffffff', color: '#0f172a', fontFamily: '"Lora", serif' }}>
      
      {/* ===================================================
          1. PLANS HERO SECTION
          =================================================== */}
      <section className="plans-hero" style={{ background: 'linear-gradient(180deg, #f8fafc 0%, #ffffff 100%)', padding: '75px 0 45px', borderBottom: '1px solid #e2e8f0', textAlign: 'center' }}>
        <div className="container">
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#eff6ff', border: '1px solid #bfdbfe', color: '#1d4ed8', padding: '6px 16px', borderRadius: '999px', fontSize: '13px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '16px' }}>
            <Sparkles className="h-4 w-4" /> Transparent Annual Pricing
          </div>

          <h1 style={{ fontSize: '3.2rem', fontWeight: '800', color: '#090d16', lineHeight: '1.2', maxWidth: '880px', margin: '0 auto 18px', letterSpacing: '-0.02em' }}>
            Simple, Transparent Plans for <span style={{ color: '#2563eb' }}>Every School</span>
          </h1>

          <p style={{ fontSize: '1.15rem', color: '#475569', maxWidth: '720px', margin: '0 auto 28px', lineHeight: '1.6' }}>
            Choose the ideal license for your institution. Complete cloud setup, free student data migration, and zero hidden costs.
          </p>
        </div>
      </section>

      {/* ===================================================
          2. THE TWO PLANS CARDS (BASIC & PREMIUM)
          =================================================== */}
      <section style={{ padding: '60px 0 80px' }}>
        <div className="container" style={{ maxWidth: '1080px' }}>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '32px', alignItems: 'stretch' }}>
            {plans.map((p) => (
              <div
                key={p.id}
                style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '20px',
                  border: p.popular ? '2px solid #2563eb' : '1px solid #e2e8f0',
                  boxShadow: p.popular ? '0 16px 40px -10px rgba(37, 99, 235, 0.18)' : '0 4px 16px rgba(0, 0, 0, 0.04)',
                  padding: '36px 32px',
                  display: 'flex',
                  flexDirection: 'column',
                  position: 'relative'
                }}
              >
                {p.popular && (
                  <div style={{ position: 'absolute', top: '-14px', left: '50%', transform: 'translateX(-50%)', backgroundColor: '#2563eb', color: '#ffffff', fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.06em', padding: '5px 18px', borderRadius: '999px', boxShadow: '0 4px 12px rgba(37, 99, 235, 0.35)' }}>
                    RECOMMENDED • ALL-IN-ONE
                  </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                  <span style={{ backgroundColor: p.badgeBg, color: p.badgeColor, fontSize: '12px', fontWeight: '800', padding: '4px 12px', borderRadius: '6px', textTransform: 'uppercase' }}>
                    {p.badge}
                  </span>
                </div>

                <h3 style={{ fontSize: '1.85rem', fontWeight: '800', color: '#0f172a', marginBottom: '6px' }}>
                  {p.name}
                </h3>

                <p style={{ fontSize: '0.925rem', color: '#64748b', lineHeight: '1.5', minHeight: '44px', marginBottom: '20px' }}>
                  {p.description}
                </p>

                {/* Price Display */}
                <div style={{ padding: '20px 0', borderTop: '1px solid #f1f5f9', borderBottom: '1px solid #f1f5f9', marginBottom: '24px' }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                    <span style={{ fontSize: '3rem', fontWeight: '800', color: p.popular ? '#2563eb' : '#0f172a', letterSpacing: '-0.03em' }}>
                      ₹{p.price.toLocaleString('en-IN')}
                    </span>
                    <span style={{ fontSize: '1.05rem', color: '#64748b', fontWeight: '600' }}>
                      / year
                    </span>
                  </div>
                  <div style={{ fontSize: '12px', color: '#16a34a', fontWeight: '700', marginTop: '4px' }}>
                    Includes 365 days cloud hosting & support
                  </div>
                </div>

                {/* Buy Now CTA Button */}
                <button
                  onClick={() => onBuyNow ? onBuyNow(p.id) : null}
                  className={`btn ${p.popular ? 'btn-primary' : 'btn-secondary'} btn-lg`}
                  style={{ width: '100%', padding: '14px', marginBottom: '28px', fontSize: '1rem', fontWeight: '800', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                >
                  {p.btnText} <ArrowRight className="h-4 w-4" />
                </button>

                {/* Features list */}
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '12px', fontWeight: '800', color: '#334155', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '14px' }}>
                    What's Included:
                  </div>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '11px' }}>
                    {p.features.map((feat, idx) => (
                      <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '0.88rem', color: '#334155', lineHeight: '1.45' }}>
                        <Check className="h-4 w-4 text-emerald-600" style={{ flexShrink: 0, marginTop: '2px' }} />
                        <span>{feat}</span>
                      </li>
                    ))}
                    {p.notIncluded.map((feat, idx) => (
                      <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '0.85rem', color: '#94a3b8', lineHeight: '1.45', opacity: 0.65 }}>
                        <X className="h-4 w-4 text-slate-300" style={{ flexShrink: 0, marginTop: '2px' }} />
                        <span style={{ textDecoration: 'line-through' }}>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

              </div>
            ))}
          </div>

          {/* Money Back Guarantee Banner */}
          <div style={{ marginTop: '40px', backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '14px', padding: '18px 24px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', flexWrap: 'wrap', textAlign: 'center' }}>
            <CheckCircle2 className="h-6 w-6 text-emerald-600" />
            <span style={{ fontSize: '0.95rem', color: '#166534', fontWeight: '700' }}>
              30-Day Unconditional Money-Back Guarantee • Free Data Migration • Zero Hidden Setup Fees
            </span>
          </div>

        </div>
      </section>

      {/* ===================================================
          3. FEATURE-BY-FEATURE COMPARISON TABLE
          =================================================== */}
      <section style={{ backgroundColor: '#f8fafc', padding: '75px 0', borderTop: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0' }}>
        <div className="container" style={{ maxWidth: '960px' }}>
          
          <div style={{ textAlign: 'center', marginBottom: '45px' }}>
            <h2 style={{ fontSize: '2.3rem', fontWeight: '800', color: '#0f172a', marginBottom: '10px' }}>
              Side-by-Side Plan Comparison
            </h2>
            <p style={{ color: '#64748b', fontSize: '1.05rem' }}>
              Detailed breakdown of modules included in Basic vs Premium.
            </p>
          </div>

          <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 4px 16px rgba(0,0,0,0.03)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ backgroundColor: '#f1f5f9', borderBottom: '2px solid #e2e8f0' }}>
                  <th style={{ padding: '16px 20px', fontSize: '14px', fontWeight: '800', color: '#0f172a' }}>Capability / Module</th>
                  <th style={{ padding: '16px 20px', fontSize: '14px', fontWeight: '800', color: '#0f172a', textAlign: 'center' }}>Basic (₹1,999/yr)</th>
                  <th style={{ padding: '16px 20px', fontSize: '14px', fontWeight: '800', color: '#2563eb', textAlign: 'center', backgroundColor: '#eff6ff' }}>Premium (₹2,999/yr)</th>
                </tr>
              </thead>
              <tbody>
                {comparisonRows.map((row, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9', backgroundColor: idx % 2 === 0 ? '#ffffff' : '#fafafa' }}>
                    <td style={{ padding: '14px 20px', fontSize: '13.5px', color: '#334155', fontWeight: '600' }}>
                      {row.feature}
                    </td>
                    <td style={{ padding: '14px 20px', textAlign: 'center' }}>
                      {typeof row.basic === 'boolean' ? (
                        row.basic ? <Check className="h-5 w-5 text-emerald-600" style={{ margin: '0 auto' }} /> : <X className="h-5 w-5 text-slate-300" style={{ margin: '0 auto' }} />
                      ) : (
                        <span style={{ fontSize: '13px', fontWeight: '700', color: '#0f172a' }}>{row.basic}</span>
                      )}
                    </td>
                    <td style={{ padding: '14px 20px', textAlign: 'center', backgroundColor: '#eff6ff' }}>
                      {typeof row.premium === 'boolean' ? (
                        row.premium ? <Check className="h-5 w-5 text-emerald-600" style={{ margin: '0 auto' }} /> : <X className="h-5 w-5 text-slate-300" style={{ margin: '0 auto' }} />
                      ) : (
                        <span style={{ fontSize: '13px', fontWeight: '800', color: '#2563eb' }}>{row.premium}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginTop: '30px' }}>
            <button 
              onClick={() => onBuyNow ? onBuyNow('basic') : null}
              className="btn btn-secondary btn-md"
            >
              Choose Basic Plan (₹1,999)
            </button>
            <button 
              onClick={() => onBuyNow ? onBuyNow('premium') : null}
              className="btn btn-primary btn-md"
            >
              Choose Premium Plan (₹2,999) →
            </button>
          </div>

        </div>
      </section>

      {/* ===================================================
          4. FREQUENTLY ASKED QUESTIONS
          =================================================== */}
      <section style={{ padding: '80px 0' }}>
        <div className="container" style={{ maxWidth: '840px' }}>
          
          <div style={{ textAlign: 'center', marginBottom: '45px' }}>
            <h2 style={{ fontSize: '2.2rem', fontWeight: '800', color: '#0f172a', marginBottom: '10px' }}>
              Frequently Asked Pricing Questions
            </h2>
            <p style={{ color: '#64748b', fontSize: '1rem' }}>
              Clear answers to help you choose with total confidence.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {faqs.map((faq, idx) => (
              <div 
                key={idx}
                style={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.02)'
                }}
              >
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  style={{
                    width: '100%',
                    padding: '18px 22px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    border: 'none',
                    backgroundColor: 'transparent',
                    cursor: 'pointer',
                    textAlign: 'left',
                    fontFamily: 'inherit'
                  }}
                >
                  <span style={{ fontSize: '1.05rem', fontWeight: '700', color: '#0f172a' }}>{faq.q}</span>
                  <span style={{ fontSize: '1.2rem', color: '#2563eb', fontWeight: '700', marginLeft: '12px' }}>
                    {openFaq === idx ? '−' : '+'}
                  </span>
                </button>

                {openFaq === idx && (
                  <div style={{ padding: '0 22px 20px 22px', color: '#64748b', fontSize: '0.925rem', lineHeight: '1.6' }}>
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ===================================================
          5. BOTTOM CTA BANNER
          =================================================== */}
      <section style={{ backgroundColor: '#0f172a', color: '#ffffff', padding: '70px 0', textAlign: 'center' }}>
        <div className="container">
          <div style={{ maxWidth: '820px', margin: '0 auto' }}>
            <span style={{ backgroundColor: 'rgba(37, 99, 235, 0.25)', border: '1px solid #3b82f6', color: '#93c5fd', fontSize: '12px', fontWeight: '700', padding: '5px 14px', borderRadius: '999px', textTransform: 'uppercase' }}>
              Instant Cloud Provisioning
            </span>
            <h2 style={{ fontSize: '2.5rem', fontWeight: '800', color: '#ffffff', marginTop: '16px', marginBottom: '14px' }}>
              Activate Your School ERP in Under 5 Minutes
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '1.05rem', lineHeight: '1.6', marginBottom: '32px' }}>
              Join 1,100+ schools running smoothly with automated attendance, fees, WhatsApp alerts, and parent delight.
            </p>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', flexWrap: 'wrap' }}>
              <button onClick={() => onBuyNow ? onBuyNow('premium') : null} className="btn btn-primary btn-lg" style={{ padding: '14px 32px' }}>
                Buy Premium Plan (₹2,999/yr) <ArrowRight className="h-4 w-4" />
              </button>
              <button onClick={onOpenDemo} className="btn btn-secondary btn-lg" style={{ padding: '14px 28px' }}>
                Schedule Campus Demo
              </button>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
