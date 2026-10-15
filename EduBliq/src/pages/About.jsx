import React, { useState } from 'react';
import {
  Building2,
  Users,
  Target,
  Award,
  ShieldCheck,
  HeartHandshake,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Calendar,
  Briefcase,
  Mail,
  Phone,
  MapPin,
  Clock,
  ExternalLink,
  ChevronRight,
  GraduationCap,
  Globe2,
  Check,
  Send,
  Building,
  Lock,
  Headphones,
  Laptop,
  Compass,
  Star
} from 'lucide-react';

export default function About({ onOpenDemo, onOpenTrial, onNavigateHome, onNavigatePlans }) {
  const [activeTab, setActiveTab] = useState('story');
  const [applyModalOpen, setApplyModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState('');
  const [contactSubmitted, setContactSubmitted] = useState(false);
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'Institutional Partnership',
    message: ''
  });

  const milestones = [
    {
      year: '2018',
      title: 'The Inception & First 12 Schools',
      desc: 'Founded by engineers from IIT and seasoned educators tired of seeing school administrators spend 3 hours daily on manual cash registers and handwritten attendance sheets. Launched Version 1 in 12 schools.'
    },
    {
      year: '2020',
      title: 'Pioneered NEP 2020 Holistic Progress Card',
      desc: 'When the National Education Policy 2020 was announced, EduBliq was among the first platforms to engineer a true 360-degree multidimensional competency assessment engine compliant with CBSE guidelines.'
    },
    {
      year: '2022',
      title: 'Direct Cloud-to-IoT Hardware & WhatsApp Engine',
      desc: 'Eliminated local server dependency by connecting biometric turnstiles directly to AWS cloud over 4G/WiFi and integrating official Meta WhatsApp Business API for instant parent communication.'
    },
    {
      year: '2024',
      title: 'AI Smart Substitution & Trust Governance',
      desc: 'Launched sub-second AI timetable auto-substitution and multi-campus centralized financial governance for large educational trusts operating multiple branches.'
    },
    {
      year: 'Today',
      title: '1,100+ Campuses & 650,000+ Students',
      desc: 'Trusted by leading CBSE, ICSE, and State Board schools across 18 states in India with 99.98% verified cloud uptime and dedicated regional support offices.'
    }
  ];

  const leaders = [
    {
      name: 'Rajesh Sharma',
      role: 'Co-Founder & Chief Executive Officer',
      bio: 'B.Tech from IIT Delhi with 15+ years of enterprise architecture experience. Passionate about empowering educators with software that saves hours of mundane paperwork.',
      image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
      tag: 'Executive Leadership'
    },
    {
      name: 'Dr. Ananya Mukherjee',
      role: 'Chief Academic Officer & Co-Founder',
      bio: 'Ph.D. in Educational Pedagogy. Former CBSE Master Resource Person and consultant to leading K-12 school boards on competency-based evaluation frameworks.',
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
      tag: 'Academic Pedagogy'
    },
    {
      name: 'Vikramaditya Rathore',
      role: 'Chief Technology Officer',
      bio: 'Former Principal Cloud Architect with deep expertise in distributed IoT pipelines, bank-grade encryption protocols, and high-frequency real-time WebSocket data engines.',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
      tag: 'Cloud & Infrastructure'
    },
    {
      name: 'Priya Narayanan',
      role: 'VP of Product & Parent Experience',
      bio: 'Pioneered intuitive consumer interfaces for millions of users. Dedicated to crafting mobile experiences that give parents peace of mind and build trust with schools.',
      image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&auto=format&fit=crop&q=80',
      tag: 'Product Design'
    }
  ];

  const advisors = [
    {
      name: 'Prof. Harish Chandra',
      role: 'Former Principal & Education Policy Fellow',
      institution: 'Delhi Public School Society Alumni',
      desc: '38 years of experience in institutional administration, CBSE affiliation norms, and teacher professional training.'
    },
    {
      name: 'Sister Mary Thomas',
      role: 'Managing Trustee & Academic Mentor',
      institution: 'St. Jude Educational Trust',
      desc: 'Oversees 8 campuses with over 14,000 students. Guides EduBliq on multi-branch audit and society governance.'
    },
    {
      name: 'Dr. Sandeep Verma',
      role: 'Child Psychologist & Learning Assessment Advisor',
      institution: 'National Council of Educational Research',
      desc: 'Specializes in experiential student assessment, emotional well-being metrics, and NEP 2020 behavioral rubrics.'
    }
  ];

  const values = [
    {
      icon: HeartHandshake,
      title: 'Empathy-First for Teachers',
      desc: 'Teachers should spend their energy inspiring students, not wrestling with confusing software. Every feature in EduBliq is tested by real teachers to ensure it takes 3 clicks or fewer.'
    },
    {
      icon: ShieldCheck,
      title: 'Uncompromising Child Privacy',
      desc: 'We never sell student data, show advertisements, or monetize personal records. School databases are completely isolated with AES-256 encryption and hosted in secure Indian Tier-4 data centers.'
    },
    {
      icon: Target,
      title: '100% Transparent & Fair Pricing',
      desc: 'No hidden setup fees, no forced renewal price hikes, and no surprise hardware lock-ins. We believe lasting partnerships are built on mutual respect, trust, and predictability.'
    },
    {
      icon: Headphones,
      title: 'Human-First 24/7 Regional Support',
      desc: 'When fee collection is live or morning bus attendance is dispatched, you cannot wait for an automated chatbot. Our dedicated regional account managers answer calls in under 30 seconds.'
    }
  ];

  const openRoles = [
    {
      title: 'Senior Full-Stack Engineer (React / Node.js / AWS)',
      dept: 'Engineering',
      location: 'Bengaluru / Hybrid',
      type: 'Full-Time',
      exp: '4-7 Years',
      desc: 'Architect high-throughput real-time APIs for 650,000+ daily student attendance punches, fee reconciliation gateways, and WhatsApp broadcast engines.'
    },
    {
      title: 'Regional Implementation & Customer Success Manager',
      dept: 'Client Operations',
      location: 'Delhi-NCR / Jaipur',
      type: 'Full-Time',
      exp: '2-5 Years',
      desc: 'Work closely with School Principals, Treasurers, and IT heads to lead campus onboarding, data migration, and teacher workshops.'
    },
    {
      title: 'Enterprise Institutional Sales Director',
      dept: 'Business Development',
      location: 'Mumbai / Pune',
      type: 'Full-Time',
      exp: '5-9 Years',
      desc: 'Establish relationships with school management trusts, dioceses, and educational societies seeking digital transformation.'
    },
    {
      title: 'Academic Content & NEP 2020 Assessment Researcher',
      dept: 'Product & Pedagogy',
      location: 'Hyderabad / Remote',
      type: 'Full-Time',
      exp: '3-6 Years',
      desc: 'Design CBSE, ICSE, and State Board compliant assessment templates, rubric banks, and holistic growth portfolios.'
    }
  ];

  const regionalOffices = [
    {
      city: 'Bengaluru (Headquarters)',
      type: 'Technology & Product Innovation Center',
      address: 'Tower 4, 6th Floor, Embassy TechVillage, Outer Ring Road, Devarabeesanahalli, Bengaluru, Karnataka 560103',
      phone: '+91 80 4967 8200',
      email: 'bengaluru@edubliq.com'
    },
    {
      city: 'Delhi-NCR Regional Office',
      type: 'North India Institutional Operations',
      address: 'Plot 18, Sector 18, Udyog Vihar Phase IV, Gurugram, Delhi-NCR 122015',
      phone: '+91 124 489 3100',
      email: 'delhi@edubliq.com'
    },
    {
      city: 'Mumbai Experience Center',
      type: 'West India Banking & Enterprise Hub',
      address: 'Level 9, Platina Building, Bandra-Kurla Complex (BKC), Bandra East, Mumbai, Maharashtra 400051',
      phone: '+91 22 6842 1500',
      email: 'mumbai@edubliq.com'
    },
    {
      city: 'Jaipur Regional Center',
      type: 'Rajasthan Schools Support & Training Hub',
      address: 'Corporate Park, 4th Floor, Gopalpura Bypass Road, Mansarovar, Jaipur, Rajasthan 302020',
      phone: '+91 141 289 4400',
      email: 'jaipur@edubliq.com'
    }
  ];

  const handleContactSubmit = (e) => {
    e.preventDefault();
    setContactSubmitted(true);
    setTimeout(() => {
      setContactSubmitted(false);
      setContactForm({
        name: '',
        email: '',
        phone: '',
        subject: 'Institutional Partnership',
        message: ''
      });
    }, 4000);
  };

  return (
    <div className="about-page" style={{ backgroundColor: '#ffffff', color: '#0f172a', fontFamily: '"Lora", serif' }}>
      
      {/* ===================================================
          1. HERO SECTION WITH KEY IMPACT STATS
          =================================================== */}
      <section style={{ background: 'linear-gradient(180deg, #f8fafc 0%, #ffffff 100%)', padding: '75px 0 50px', borderBottom: '1px solid #e2e8f0' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#eff6ff', border: '1px solid #bfdbfe', color: '#1d4ed8', padding: '6px 16px', borderRadius: '999px', fontSize: '13px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '16px' }}>
            <Sparkles className="h-4 w-4" /> About EduBliq Technologies
          </div>

          <h1 style={{ fontSize: '3.3rem', fontWeight: '800', color: '#090d16', lineHeight: '1.18', maxWidth: '960px', margin: '0 auto 20px', letterSpacing: '-0.025em' }}>
            Empowering <span style={{ color: '#2563eb' }}>1,100+ Schools</span> with Next-Gen Digital Infrastructure
          </h1>

          <p style={{ fontSize: '1.15rem', color: '#475569', maxWidth: '780px', margin: '0 auto 32px', lineHeight: '1.65' }}>
            We started EduBliq with a simple mission: remove the friction of outdated paper systems and complex software from Indian education so school administrators, teachers, and parents can focus on what truly matters — shaping young minds.
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', flexWrap: 'wrap', marginBottom: '48px' }}>
            <button onClick={onOpenDemo} className="btn btn-primary btn-lg" style={{ padding: '14px 30px' }}>
              Schedule Interactive Demo <ArrowRight className="h-4 w-4" />
            </button>
            <button onClick={onNavigatePlans} className="btn btn-secondary btn-lg" style={{ padding: '14px 28px' }}>
              Explore School Plans
            </button>
          </div>

          {/* Quick Jump Navigation Pill Bar */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', backgroundColor: '#f1f5f9', padding: '6px', borderRadius: '12px', border: '1px solid #e2e8f0', flexWrap: 'wrap', justifyContent: 'center' }}>
            {[
              { id: 'story', label: 'Company Story' },
              { id: 'leadership', label: 'Leadership & Advisors' },
              { id: 'values', label: 'Core Values & Trust' },
              { id: 'careers', label: 'Careers (Hiring)' },
              { id: 'contact', label: 'Offices & Contact' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  const el = document.getElementById(tab.id);
                  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }}
                style={{
                  padding: '8px 16px',
                  borderRadius: '8px',
                  fontSize: '13px',
                  fontWeight: '700',
                  border: 'none',
                  cursor: 'pointer',
                  backgroundColor: activeTab === tab.id ? '#2563eb' : 'transparent',
                  color: activeTab === tab.id ? '#ffffff' : '#475569',
                  transition: 'all 0.15s ease'
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

        </div>
      </section>

      {/* ===================================================
          2. IMPACT METRICS BANNER
          =================================================== */}
      <section style={{ backgroundColor: '#0f172a', color: '#ffffff', padding: '40px 0' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px', textAlign: 'center' }}>
            <div>
              <div style={{ fontSize: '2.5rem', fontWeight: '800', color: '#60a5fa', marginBottom: '4px' }}>1,100+</div>
              <div style={{ fontSize: '0.85rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: '700' }}>Active Schools</div>
            </div>
            <div>
              <div style={{ fontSize: '2.5rem', fontWeight: '800', color: '#34d399', marginBottom: '4px' }}>650,000+</div>
              <div style={{ fontSize: '0.85rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: '700' }}>Students & Parents</div>
            </div>
            <div>
              <div style={{ fontSize: '2.5rem', fontWeight: '800', color: '#f59e0b', marginBottom: '4px' }}>99.98%</div>
              <div style={{ fontSize: '0.85rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: '700' }}>Cloud Uptime SLA</div>
            </div>
            <div>
              <div style={{ fontSize: '2.5rem', fontWeight: '800', color: '#c084fc', marginBottom: '4px' }}>18 States</div>
              <div style={{ fontSize: '0.85rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: '700' }}>Pan-India Reach</div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================
          3. SECTION 1: OUR STORY & VISION
          =================================================== */}
      <section id="story" style={{ padding: '80px 0', borderBottom: '1px solid #f1f5f9' }}>
        <div className="container">
          <div style={{ maxWidth: '880px', margin: '0 auto 60px', textAlign: 'center' }}>
            <span style={{ backgroundColor: '#eff6ff', color: '#1d4ed8', fontSize: '12px', fontWeight: '700', padding: '4px 12px', borderRadius: '999px', textTransform: 'uppercase' }}>
              Our Journey
            </span>
            <h2 style={{ fontSize: '2.4rem', fontWeight: '800', color: '#0f172a', marginTop: '12px', marginBottom: '14px' }}>
              Built From Real Classroom Realities
            </h2>
            <p style={{ fontSize: '1.05rem', color: '#475569', lineHeight: '1.65' }}>
              Unlike generic corporate software retrofitted for schools, EduBliq was built inside Indian staffrooms alongside headmistresses, fee clerks, transport in-charges, and school trustees.
            </p>
          </div>

          {/* Timeline of Milestones */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '840px', margin: '0 auto' }}>
            {milestones.map((m, idx) => (
              <div 
                key={idx}
                style={{
                  display: 'flex',
                  gap: '24px',
                  backgroundColor: '#ffffff',
                  padding: '24px 28px',
                  borderRadius: '14px',
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.03)',
                  alignItems: 'flex-start'
                }}
              >
                <div style={{ backgroundColor: '#2563eb', color: '#ffffff', fontWeight: '800', fontSize: '14px', padding: '6px 14px', borderRadius: '8px', flexShrink: 0, marginTop: '2px' }}>
                  {m.year}
                </div>
                <div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#0f172a', marginBottom: '6px' }}>
                    {m.title}
                  </h3>
                  <p style={{ fontSize: '0.925rem', color: '#64748b', lineHeight: '1.6', margin: 0 }}>
                    {m.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Mission & Vision Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px', maxWidth: '960px', margin: '50px auto 0' }}>
            <div style={{ backgroundColor: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '16px', padding: '32px 28px' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '10px', backgroundColor: '#2563eb', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                <Target className="h-6 w-6" />
              </div>
              <h3 style={{ fontSize: '1.35rem', fontWeight: '800', color: '#1e3a8a', marginBottom: '10px' }}>Our Mission</h3>
              <p style={{ fontSize: '0.95rem', color: '#1e40af', lineHeight: '1.65', margin: 0 }}>
                To reclaim 4 lost hours every single day for school leaders and teachers by eliminating redundant data entry, automating financial reconciliation, and bridging the home-school communication divide.
              </p>
            </div>

            <div style={{ backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '16px', padding: '32px 28px' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '10px', backgroundColor: '#16a34a', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                <Compass className="h-6 w-6" />
              </div>
              <h3 style={{ fontSize: '1.35rem', fontWeight: '800', color: '#14532d', marginBottom: '10px' }}>Our Vision</h3>
              <p style={{ fontSize: '0.95rem', color: '#166534', lineHeight: '1.65', margin: 0 }}>
                To become the most reliable, secure, and loved institutional operating system across 5,000+ K-12 campuses by 2028, setting the benchmark for child safety, holistic learning, and transparent governance.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================
          4. SECTION 2: LEADERSHIP TEAM & ADVISORY BOARD
          =================================================== */}
      <section id="leadership" style={{ padding: '80px 0', backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
        <div className="container">
          <div style={{ maxWidth: '880px', margin: '0 auto 55px', textAlign: 'center' }}>
            <span style={{ backgroundColor: '#eff6ff', color: '#1d4ed8', fontSize: '12px', fontWeight: '700', padding: '4px 12px', borderRadius: '999px', textTransform: 'uppercase' }}>
              People & Pedagogy
            </span>
            <h2 style={{ fontSize: '2.4rem', fontWeight: '800', color: '#0f172a', marginTop: '12px', marginBottom: '14px' }}>
              Led by Educators & Cloud Architects
            </h2>
            <p style={{ fontSize: '1.05rem', color: '#475569', lineHeight: '1.6' }}>
              Our leadership unites deep educational classroom domain knowledge with modern enterprise software engineering.
            </p>
          </div>

          {/* Core Leadership Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '24px', marginBottom: '60px' }}>
            {leaders.map((lead, idx) => (
              <div 
                key={idx}
                style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '16px',
                  border: '1px solid #e2e8f0',
                  overflow: 'hidden',
                  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.04)',
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                <div style={{ height: '220px', width: '100%', overflow: 'hidden', position: 'relative' }}>
                  <img 
                    src={lead.image} 
                    alt={lead.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                  />
                  <span style={{ position: 'absolute', bottom: '12px', left: '12px', backgroundColor: 'rgba(15, 23, 42, 0.85)', backdropFilter: 'blur(6px)', color: '#ffffff', fontSize: '11px', fontWeight: '700', padding: '4px 8px', borderRadius: '6px' }}>
                    {lead.tag}
                  </span>
                </div>
                <div style={{ padding: '22px 20px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#0f172a', marginBottom: '4px' }}>
                    {lead.name}
                  </h3>
                  <div style={{ fontSize: '0.85rem', color: '#2563eb', fontWeight: '700', marginBottom: '12px' }}>
                    {lead.role}
                  </div>
                  <p style={{ fontSize: '0.875rem', color: '#64748b', lineHeight: '1.55', margin: 0, flex: 1 }}>
                    {lead.bio}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Academic Advisory Council */}
          <div style={{ maxWidth: '960px', margin: '0 auto', backgroundColor: '#ffffff', borderRadius: '16px', padding: '36px', border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
              <div style={{ width: '38px', height: '38px', borderRadius: '8px', backgroundColor: '#eff6ff', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <GraduationCap className="h-5 w-5" />
              </div>
              <div>
                <h3 style={{ fontSize: '1.35rem', fontWeight: '800', color: '#0f172a', margin: 0 }}>Academic Advisory Council</h3>
                <div style={{ fontSize: '0.85rem', color: '#64748b' }}>Guiding our roadmap to guarantee strict CBSE, ICSE & state education norms</div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
              {advisors.map((adv, idx) => (
                <div key={idx} style={{ padding: '18px 20px', borderRadius: '12px', backgroundColor: '#f8fafc', border: '1px solid #f1f5f9' }}>
                  <div style={{ fontSize: '1.05rem', fontWeight: '800', color: '#0f172a', marginBottom: '2px' }}>{adv.name}</div>
                  <div style={{ fontSize: '0.825rem', color: '#2563eb', fontWeight: '700', marginBottom: '4px' }}>{adv.role}</div>
                  <div style={{ fontSize: '0.775rem', color: '#64748b', fontWeight: '600', marginBottom: '10px' }}>{adv.institution}</div>
                  <p style={{ fontSize: '0.84rem', color: '#475569', lineHeight: '1.5', margin: 0 }}>{adv.desc}</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* ===================================================
          5. SECTION 3: CORE VALUES & DATA SECURITY
          =================================================== */}
      <section id="values" style={{ padding: '80px 0', borderBottom: '1px solid #f1f5f9' }}>
        <div className="container">
          <div style={{ maxWidth: '880px', margin: '0 auto 55px', textAlign: 'center' }}>
            <span style={{ backgroundColor: '#eff6ff', color: '#1d4ed8', fontSize: '12px', fontWeight: '700', padding: '4px 12px', borderRadius: '999px', textTransform: 'uppercase' }}>
              Trust & Foundation
            </span>
            <h2 style={{ fontSize: '2.4rem', fontWeight: '800', color: '#0f172a', marginTop: '12px', marginBottom: '14px' }}>
              Four Values That Guide Every Line of Code
            </h2>
            <p style={{ fontSize: '1.05rem', color: '#475569', lineHeight: '1.6' }}>
              We recognize that managing a school’s data is a matter of profound public trust. Here is what we stand for.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '24px', marginBottom: '55px' }}>
            {values.map((v, idx) => (
              <div 
                key={idx}
                style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '16px',
                  padding: '30px 24px',
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.03)',
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: '#eff6ff', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '18px' }}>
                  <v.icon className="h-6 w-6" />
                </div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#0f172a', marginBottom: '8px' }}>
                  {v.title}
                </h3>
                <p style={{ fontSize: '0.9rem', color: '#64748b', lineHeight: '1.6', margin: 0 }}>
                  {v.desc}
                </p>
              </div>
            ))}
          </div>

          {/* Security & Compliance Highlight Box */}
          <div style={{ backgroundColor: '#0f172a', color: '#ffffff', borderRadius: '20px', padding: '40px', maxWidth: '1000px', margin: '0 auto' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', alignItems: 'center' }}>
              <div>
                <span style={{ backgroundColor: 'rgba(37, 99, 235, 0.25)', border: '1px solid #3b82f6', color: '#93c5fd', fontSize: '11px', fontWeight: '700', padding: '4px 12px', borderRadius: '999px', textTransform: 'uppercase' }}>
                  Bank-Grade Architecture
                </span>
                <h3 style={{ fontSize: '1.85rem', fontWeight: '800', color: '#ffffff', marginTop: '12px', marginBottom: '12px' }}>
                  Your School's Data Stays in India, Encrypted 24/7
                </h3>
                <p style={{ color: '#94a3b8', fontSize: '0.925rem', lineHeight: '1.6', marginBottom: '20px' }}>
                  We implement enterprise-grade security protocols so principals and trustees never have to worry about data breaches, server crashes, or hardware loss.
                </p>
                <button onClick={onOpenTrial} className="btn btn-blue btn-sm">
                  Review Security Architecture & Whitepaper →
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {[
                  { title: 'ISO 27001 Certified Security Practices', desc: 'Strict role-based permissions and cryptographic audit trails.' },
                  { title: '100% Indian Data Residency (AWS Mumbai)', desc: 'Full compliance with Indian digital data protection norms.' },
                  { title: 'Hourly Automated Snapshot Backups', desc: 'Point-in-time recovery ensures 0% data loss under any failure.' },
                  { title: 'Official Meta WhatsApp Business API', desc: 'End-to-end encrypted messaging with verified green-badge trust.' }
                ].map((s, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', backgroundColor: 'rgba(255, 255, 255, 0.05)', padding: '12px 16px', borderRadius: '10px' }}>
                    <CheckCircle2 className="h-5 w-5 text-emerald-400" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <div>
                      <div style={{ fontSize: '0.9rem', fontWeight: '700', color: '#ffffff' }}>{s.title}</div>
                      <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{s.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================
          6. SECTION 4: CAREERS & LIFE AT EDUBLIQ
          =================================================== */}
      <section id="careers" style={{ padding: '80px 0', backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
        <div className="container">
          <div style={{ maxWidth: '880px', margin: '0 auto 55px', textAlign: 'center' }}>
            <span style={{ backgroundColor: '#eff6ff', color: '#1d4ed8', fontSize: '12px', fontWeight: '700', padding: '4px 12px', borderRadius: '999px', textTransform: 'uppercase' }}>
              We Are Hiring
            </span>
            <h2 style={{ fontSize: '2.4rem', fontWeight: '800', color: '#0f172a', marginTop: '12px', marginBottom: '14px' }}>
              Build Tools That Shape the Next Generation
            </h2>
            <p style={{ fontSize: '1.05rem', color: '#475569', lineHeight: '1.6' }}>
              Join a high-energy mission-driven team impacting 650,000+ students and thousands of teachers every morning.
            </p>
          </div>

          {/* Open Roles List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px', maxWidth: '920px', margin: '0 auto 40px' }}>
            {openRoles.map((role, idx) => (
              <div 
                key={idx}
                style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '14px',
                  padding: '24px 28px',
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.03)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '20px',
                  flexWrap: 'wrap'
                }}
              >
                <div style={{ flex: '1 1 450px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                    <span style={{ fontSize: '11px', fontWeight: '800', color: '#2563eb', backgroundColor: '#eff6ff', padding: '2px 8px', borderRadius: '4px' }}>{role.dept}</span>
                    <span style={{ fontSize: '11px', fontWeight: '600', color: '#64748b' }}>• {role.location}</span>
                    <span style={{ fontSize: '11px', fontWeight: '600', color: '#64748b' }}>• {role.type}</span>
                  </div>
                  <h3 style={{ fontSize: '1.18rem', fontWeight: '800', color: '#0f172a', marginBottom: '6px' }}>
                    {role.title}
                  </h3>
                  <p style={{ fontSize: '0.875rem', color: '#64748b', lineHeight: '1.5', margin: 0 }}>
                    {role.desc}
                  </p>
                </div>

                <button 
                  onClick={() => {
                    setSelectedRole(role.title);
                    setApplyModalOpen(true);
                  }}
                  className="btn btn-secondary btn-sm"
                  style={{ whiteSpace: 'nowrap', fontWeight: '700' }}
                >
                  Apply for Role →
                </button>
              </div>
            ))}
          </div>

          {/* Perks Bar */}
          <div style={{ backgroundColor: '#ffffff', borderRadius: '14px', padding: '24px', border: '1px solid #e2e8f0', maxWidth: '920px', margin: '0 auto', display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', gap: '16px', textAlign: 'center' }}>
            <div>
              <div style={{ fontWeight: '800', color: '#0f172a', fontSize: '0.95rem' }}>Competitive Compensation</div>
              <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Top-tier CTC + ESOPs</div>
            </div>
            <div>
              <div style={{ fontWeight: '800', color: '#0f172a', fontSize: '0.95rem' }}>Comprehensive Health</div>
              <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Full family health cover</div>
            </div>
            <div>
              <div style={{ fontWeight: '800', color: '#0f172a', fontSize: '0.95rem' }}>Flexible Work Culture</div>
              <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Hybrid & high-autonomy</div>
            </div>
            <div>
              <div style={{ fontWeight: '800', color: '#0f172a', fontSize: '0.95rem' }}>Continuous Upskilling</div>
              <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Annual learning budget</div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================
          7. SECTION 5: OFFICES & DIRECT CONTACT
          =================================================== */}
      <section id="contact" style={{ padding: '80px 0' }}>
        <div className="container">
          <div style={{ maxWidth: '880px', margin: '0 auto 55px', textAlign: 'center' }}>
            <span style={{ backgroundColor: '#eff6ff', color: '#1d4ed8', fontSize: '12px', fontWeight: '700', padding: '4px 12px', borderRadius: '999px', textTransform: 'uppercase' }}>
              Get in Touch
            </span>
            <h2 style={{ fontSize: '2.4rem', fontWeight: '800', color: '#0f172a', marginTop: '12px', marginBottom: '14px' }}>
              Regional Experience Centers & Support Hubs
            </h2>
            <p style={{ fontSize: '1.05rem', color: '#475569', lineHeight: '1.6' }}>
              Whether you are an institution leader exploring digital adoption or an existing partner, our regional teams are ready to assist.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '36px', maxWidth: '1080px', margin: '0 auto 60px' }}>
            
            {/* Left: 4 Regional Hubs */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {regionalOffices.map((off, idx) => (
                <div key={idx} style={{ backgroundColor: '#ffffff', borderRadius: '12px', padding: '20px', border: '1px solid #e2e8f0', boxShadow: '0 2px 6px rgba(0, 0, 0, 0.02)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: '#0f172a', margin: 0 }}>{off.city}</h3>
                    <span style={{ fontSize: '10px', fontWeight: '700', color: '#2563eb', backgroundColor: '#eff6ff', padding: '2px 8px', borderRadius: '4px' }}>Regional Hub</span>
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#2563eb', fontWeight: '600', marginBottom: '8px' }}>{off.type}</div>
                  <p style={{ fontSize: '0.85rem', color: '#64748b', lineHeight: '1.45', marginBottom: '12px' }}>{off.address}</p>
                  <div style={{ display: 'flex', gap: '16px', fontSize: '0.825rem', color: '#0f172a', fontWeight: '700' }}>
                    <a href={`tel:${off.phone}`} style={{ color: '#0f172a', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Phone className="h-3.5 w-3.5 text-blue-600" /> {off.phone}
                    </a>
                    <a href={`mailto:${off.email}`} style={{ color: '#2563eb', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Mail className="h-3.5 w-3.5 text-blue-600" /> {off.email}
                    </a>
                  </div>
                </div>
              ))}
            </div>

            {/* Right: Quick Direct Inquiry Form */}
            <div style={{ backgroundColor: '#f8fafc', borderRadius: '16px', padding: '32px', border: '1px solid #e2e8f0' }}>
              <h3 style={{ fontSize: '1.35rem', fontWeight: '800', color: '#0f172a', marginBottom: '6px' }}>Send Us a Message</h3>
              <p style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '20px' }}>Our executive team typically responds within 2 business hours.</p>

              {contactSubmitted ? (
                <div style={{ backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', color: '#166534', padding: '24px', borderRadius: '12px', textAlign: 'center' }}>
                  <CheckCircle2 className="h-8 w-8 text-emerald-600" style={{ margin: '0 auto 8px' }} />
                  <div style={{ fontWeight: '800', fontSize: '1.05rem', marginBottom: '4px' }}>Thank You for Reaching Out!</div>
                  <div style={{ fontSize: '0.875rem' }}>Your message has been assigned to our regional representative. We will contact you shortly.</div>
                </div>
              ) : (
                <form onSubmit={handleContactSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#334155', marginBottom: '4px' }}>Your Name / Title *</label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. Sister Teresa / Dr. Arvind Mehra"
                      value={contactForm.name}
                      onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                      style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px' }}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#334155', marginBottom: '4px' }}>Email Address *</label>
                      <input 
                        type="email" 
                        required
                        placeholder="principal@school.edu.in"
                        value={contactForm.email}
                        onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                        style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#334155', marginBottom: '4px' }}>Phone Number *</label>
                      <input 
                        type="tel" 
                        required
                        placeholder="+91 98765 43210"
                        value={contactForm.phone}
                        onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                        style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px' }}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#334155', marginBottom: '4px' }}>Inquiry Topic</label>
                    <select
                      value={contactForm.subject}
                      onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                      style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px', backgroundColor: '#ffffff' }}
                    >
                      <option value="Institutional Partnership">Institutional School ERP Partnership</option>
                      <option value="Multi-Campus Trust Demo">Multi-Campus Trust Demo</option>
                      <option value="Hardware / IoT Integration">Biometric Turnstile & Bus GPS Hardware</option>
                      <option value="Channel Partner / Reseller">Channel Partner / Franchisee Inquiry</option>
                      <option value="Careers / General">Careers / Press Inquiry</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#334155', marginBottom: '4px' }}>Message or School Details</label>
                    <textarea 
                      rows="3"
                      placeholder="Tell us about your campus, student strength, or question..."
                      value={contactForm.message}
                      onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                      style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px', resize: 'vertical' }}
                    />
                  </div>

                  <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '12px', marginTop: '6px' }}>
                    Send Direct Inquiry <Send className="h-4 w-4" />
                  </button>
                </form>
              )}
            </div>

          </div>
        </div>
      </section>

      {/* ===================================================
          8. BOTTOM CALL TO ACTION
          =================================================== */}
      <section style={{ backgroundColor: '#0f172a', color: '#ffffff', padding: '70px 0', textAlign: 'center' }}>
        <div className="container">
          <div style={{ maxWidth: '820px', margin: '0 auto' }}>
            <span style={{ backgroundColor: 'rgba(37, 99, 235, 0.25)', border: '1px solid #3b82f6', color: '#93c5fd', fontSize: '12px', fontWeight: '700', padding: '5px 14px', borderRadius: '999px', textTransform: 'uppercase' }}>
              Join 1,100+ School Leaders
            </span>
            <h2 style={{ fontSize: '2.5rem', fontWeight: '800', color: '#ffffff', marginTop: '16px', marginBottom: '14px' }}>
              Experience the Future of Indian School Operations
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '1.05rem', lineHeight: '1.6', marginBottom: '32px' }}>
              Get a customized live demonstration tailored to your school board, student count, and administrative structure.
            </p>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', flexWrap: 'wrap' }}>
              <button onClick={onOpenDemo} className="btn btn-primary btn-lg" style={{ padding: '14px 32px' }}>
                Request Live Campus Demo <ArrowRight className="h-4 w-4" />
              </button>
              <button onClick={onNavigatePlans} className="btn btn-secondary btn-lg" style={{ padding: '14px 28px' }}>
                View Transparent Pricing
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================
          9. CAREERS APPLICATION MODAL
          =================================================== */}
      {applyModalOpen && (
        <div 
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.75)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '16px'
          }}
          onClick={() => setApplyModalOpen(false)}
        >
          <div 
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '16px',
              padding: '32px',
              maxWidth: '500px',
              width: '100%',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.25)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#0f172a', margin: 0 }}>
                Apply for Position
              </h3>
              <button 
                onClick={() => setApplyModalOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '20px', color: '#64748b' }}
              >
                ✕
              </button>
            </div>

            <p style={{ fontSize: '0.875rem', color: '#2563eb', fontWeight: '700', marginBottom: '16px' }}>
              Role: {selectedRole}
            </p>

            <p style={{ fontSize: '0.875rem', color: '#475569', lineHeight: '1.6', marginBottom: '20px' }}>
              Send your resume and a brief introduction directly to our talent acquisition team at:
            </p>

            <div style={{ backgroundColor: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '10px', padding: '14px 18px', marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontWeight: '700', color: '#1d4ed8', fontSize: '15px' }}>careers@edubliq.com</span>
              <a 
                href={`mailto:careers@edubliq.com?subject=Job Application: ${encodeURIComponent(selectedRole)}`}
                className="btn btn-blue btn-sm"
              >
                Open Email App
              </a>
            </div>

            <button 
              onClick={() => setApplyModalOpen(false)}
              className="btn btn-secondary" 
              style={{ width: '100%' }}
            >
              Close Window
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
