import React from 'react';
import {
  Sparkles,
  Zap,
  ShieldCheck,
  Smartphone,
  Cpu,
  RefreshCw,
  Award,
  ArrowRight,
  CheckCircle2,
  Clock,
  Layers,
  Database,
  TrendingUp,
  Fingerprint,
  Bus,
  MessageCircle,
  Building,
  Check,
  X
} from 'lucide-react';

export default function Unique({ onOpenDemo, onOpenTrial, onNavigateHome, onNavigatePlans }) {
  const differentiators = [
    {
      icon: MessageCircle,
      title: 'Official Meta WhatsApp Business API Engine',
      subtitle: '98.4% Open Rate vs 12% in Unopened SMS',
      desc: 'Legacy vendors send slow, spam-filtered SMS that parents rarely open. EduBliq natively integrates with Meta WhatsApp Business API. Parents receive verified green-tick fee receipts, attendance gate notifications, homework PDFs, and circulars right on their WhatsApp within 2 seconds.',
      tag: 'Communication Revolution'
    },
    {
      icon: Cpu,
      title: 'AI Smart Timetable & Instant Teacher Substitution',
      subtitle: '15-Second Morning Schedule Resolution',
      desc: 'When a teacher calls in sick at 7:30 AM, academic coordinators usually spend 45 panicked minutes shuffling paper timetables. EduBliq AI analyzes teacher workload, subject constraints, and room availability to suggest optimal substitutions in 1 click and alerts substitute teachers instantly on their app.',
      tag: 'Artificial Intelligence'
    },
    {
      icon: Fingerprint,
      title: 'Direct Hardware-to-Cloud IoT Gate Architecture',
      subtitle: 'No Dedicated Local PC Required',
      desc: 'Old biometric machines require a computer running in the reception with USB cables and manual Excel export. EduBliq connects turnstile RFID gates and face scanners directly to AWS cloud over WiFi or 4G SIM. Student punches trigger instant parent alerts without human intervention.',
      tag: 'Hardware Integration'
    },
    {
      icon: Award,
      title: 'True NEP 2020 Holistic Progress Card (HPC)',
      subtitle: 'Multi-Dimensional 360° Competency Evaluation',
      desc: 'Unlike traditional software that only prints percentage marks, EduBliq complies with the CBSE and NEP 2020 Holistic Progress Card framework. It seamlessly integrates self-evaluation, peer assessment, teacher rubric grading, and experiential learning milestones into a beautiful PDF report.',
      tag: 'Curriculum & CBSE'
    },
    {
      icon: Bus,
      title: 'Sub-Second Real-Time School Bus Fleet GPS',
      subtitle: 'Live WebSocket Map with Geofencing',
      desc: 'Parents no longer need to make frantic phone calls asking "Where is the bus?". EduBliq provides live turn-by-turn bus movement on the parent mobile app, smart geofence notifications when the bus is 1 km away from their stop, and RFID boarding verification by conductors.',
      tag: 'Student Safety'
    },
    {
      icon: Building,
      title: 'Single-Glass Multi-Branch Trust Governance',
      subtitle: 'Unified P&L & Auditing Across All Campuses',
      desc: 'Designed for institutional founders and society trustees who manage multiple preschools, K-12 branches, and colleges. Compare fee collections, teacher punctuality, admissions velocity, and expense ledgers across all campuses from a single smartphone app in real time.',
      tag: 'Trust Governance'
    }
  ];

  const benchmarks = [
    {
      metric: 'Morning Attendance Dispatch to 1,200 Parents',
      edubliq: '14 Seconds (Automated WhatsApp)',
      legacy: '45+ Minutes (Manual SMS & Register)',
      gain: '99% Faster'
    },
    {
      metric: 'End-of-Term Report Card Generation',
      edubliq: '1-Click Instant Batch PDF',
      legacy: '4 to 5 Days of Manual Excel Typing',
      gain: 'Save 40+ Staff Hours'
    },
    {
      metric: 'Fee Collection Reconciliation',
      edubliq: '100% Real-Time Automated Sync',
      legacy: 'Manual Daily Cash Ledger Matching',
      gain: 'Zero Leakage'
    },
    {
      metric: 'System Security & Data Storage',
      edubliq: 'Tier-4 Cloud + Automated Hourly Backup',
      legacy: 'Single Vulnerable Hard Disk in Office',
      gain: 'Bank-Grade'
    }
  ];

  return (
    <div className="unique-page" style={{ backgroundColor: '#ffffff', color: '#0f172a', fontFamily: '"Lora", serif' }}>
      
      {/* ===================================================
          1. HERO SECTION
          =================================================== */}
      <section style={{ background: 'linear-gradient(180deg, #f8fafc 0%, #ffffff 100%)', padding: '75px 0 50px', borderBottom: '1px solid #e2e8f0', textAlign: 'center' }}>
        <div className="container">
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#eff6ff', border: '1px solid #bfdbfe', color: '#1d4ed8', padding: '6px 16px', borderRadius: '999px', fontSize: '13px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '16px' }}>
            <Sparkles className="h-4 w-4" /> The EduBliq Advantage
          </div>

          <h1 style={{ fontSize: '3.2rem', fontWeight: '800', color: '#090d16', lineHeight: '1.2', maxWidth: '920px', margin: '0 auto 18px', letterSpacing: '-0.02em' }}>
            How EduBliq is <span style={{ color: '#2563eb' }}>Fundamentally Unique</span>
          </h1>

          <p style={{ fontSize: '1.15rem', color: '#475569', maxWidth: '760px', margin: '0 auto 28px', lineHeight: '1.6' }}>
            Traditional school software was engineered 20 years ago for offline computers. EduBliq was built from scratch on modern cloud architecture to deliver sub-second speed, parent delight, and total administrative peace of mind.
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', flexWrap: 'wrap' }}>
            <button onClick={onOpenDemo} className="btn btn-primary btn-lg" style={{ padding: '14px 30px' }}>
              Schedule Interactive Demo <ArrowRight className="h-4 w-4" />
            </button>
            <button onClick={onNavigatePlans} className="btn btn-secondary btn-lg" style={{ padding: '14px 28px' }}>
              View Plans & Pricing
            </button>
          </div>
        </div>
      </section>

      {/* ===================================================
          2. THE 6 ARCHITECTURAL BREAKTHROUGHS
          =================================================== */}
      <section style={{ padding: '70px 0 80px' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '45px' }}>
            <span style={{ backgroundColor: '#eff6ff', color: '#1d4ed8', fontSize: '12px', fontWeight: '700', padding: '4px 12px', borderRadius: '999px', textTransform: 'uppercase' }}>
              Built Differently
            </span>
            <h2 style={{ fontSize: '2.4rem', fontWeight: '800', color: '#0f172a', marginTop: '12px' }}>
              Six Capabilities You Won’t Find in Legacy ERPs
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '28px' }}>
            {differentiators.map((item, idx) => (
              <div
                key={idx}
                style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '16px',
                  border: '1px solid #e2e8f0',
                  padding: '32px 28px',
                  boxShadow: '0 4px 15px rgba(0, 0, 0, 0.04)',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'all 0.2s',
                  position: 'relative'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: '#eff6ff', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <item.icon className="h-6 w-6" />
                  </div>
                  <span style={{ backgroundColor: '#f1f5f9', color: '#475569', fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', padding: '4px 10px', borderRadius: '6px' }}>
                    {item.tag}
                  </span>
                </div>

                <h3 style={{ fontSize: '1.35rem', fontWeight: '800', color: '#0f172a', marginBottom: '6px' }}>
                  {item.title}
                </h3>
                <div style={{ fontSize: '0.85rem', color: '#2563eb', fontWeight: '700', marginBottom: '14px' }}>
                  {item.subtitle}
                </div>
                <p style={{ fontSize: '0.9rem', color: '#475569', lineHeight: '1.6', flex: 1 }}>
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===================================================
          3. REAL-WORLD SPEED & EFFICIENCY BENCHMARKS
          =================================================== */}
      <section style={{ backgroundColor: '#0f172a', color: '#ffffff', padding: '80px 0' }}>
        <div className="container">
          <div style={{ maxWidth: '920px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '45px' }}>
              <span style={{ backgroundColor: 'rgba(37, 99, 235, 0.25)', border: '1px solid #3b82f6', color: '#93c5fd', fontSize: '12px', fontWeight: '700', padding: '5px 14px', borderRadius: '999px', textTransform: 'uppercase' }}>
                Operational Benchmarks
              </span>
              <h2 style={{ fontSize: '2.5rem', fontWeight: '800', color: '#ffffff', marginTop: '16px', marginBottom: '10px' }}>
                Speed and Accuracy Benchmarks
              </h2>
              <p style={{ color: '#94a3b8', fontSize: '1rem', maxWidth: '640px', margin: '0 auto' }}>
                Measurable time savings calculated across 1,100+ school implementations.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
              {benchmarks.map((b, i) => (
                <div
                  key={i}
                  style={{
                    backgroundColor: '#1e293b',
                    padding: '24px',
                    borderRadius: '14px',
                    border: '1px solid rgba(255, 255, 255, 0.08)'
                  }}
                >
                  <div style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', fontWeight: '700', marginBottom: '8px' }}>
                    {b.metric}
                  </div>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#4ade80', fontWeight: '800', fontSize: '1.1rem', margin: '8px 0' }}>
                    <CheckCircle2 className="h-5 w-5 flex-shrink-0" />
                    <span>EduBliq: {b.edubliq}</span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#94a3b8', fontSize: '0.875rem' }}>
                    <X className="h-4 w-4 text-rose-400 flex-shrink-0" />
                    <span>Traditional: {b.legacy}</span>
                  </div>

                  <div style={{ marginTop: '14px', paddingTop: '10px', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '11px', color: '#64748b' }}>Efficiency Impact:</span>
                    <span style={{ fontSize: '12px', fontWeight: '800', color: '#60a5fa', background: 'rgba(59, 130, 246, 0.15)', padding: '2px 8px', borderRadius: '4px' }}>
                      {b.gain}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================
          4. FINAL CTA
          =================================================== */}
      <section style={{ padding: '70px 0', backgroundColor: '#ffffff', textAlign: 'center' }}>
        <div className="container" style={{ maxWidth: '760px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '2.3rem', fontWeight: '800', color: '#090d16', marginBottom: '14px' }}>
            Experience the Unmatched Speed of EduBliq
          </h2>
          <p style={{ fontSize: '1.05rem', color: '#475569', lineHeight: '1.6', marginBottom: '28px' }}>
            Book a 20-minute tailored walkthrough with our Lead Solutions Architect and witness how easy school operations can become.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', flexWrap: 'wrap' }}>
            <button onClick={onOpenDemo} className="btn btn-primary btn-lg" style={{ padding: '14px 32px' }}>
              Schedule 1-on-1 Walkthrough →
            </button>
            <button onClick={onNavigateHome} className="btn btn-secondary btn-lg" style={{ padding: '14px 28px' }}>
              ← Return to Main Page
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
