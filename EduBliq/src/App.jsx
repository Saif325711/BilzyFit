import React, { useState, useEffect, useRef } from 'react';
import SchoolERP from './pages/SchoolERP';
import Plans from './pages/Plans';
import Unique from './pages/Unique';
import About from './pages/About';
import Checkout from './pages/Checkout';
import Login from '../Login';
import WorkspaceGateway from './portals/WorkspaceGateway';
import {
  GraduationCap,
  ChevronDown,
  ArrowRight,
  Check,
  X,
  Search,
  Bell,
  Users,
  Calendar,
  CreditCard,
  MessageSquare,
  Truck,
  Package,
  FileText,
  BarChart3,
  BookOpen,
  Clock,
  Award,
  Layers,
  Smartphone,
  ShieldCheck,
  Headphones,
  Sliders,
  Smile,
  Star,
  Plus,
  Minus,
  Mail,
  ExternalLink,
  ChevronRight,
  Menu,
  Sparkles,
  Phone,
  Building,
  UserCheck,
  Send,
  Download,
  Fingerprint,
  Database,
  Bus,
  MessageCircle,
  TrendingUp,
  School,
  FileCheck,
  Shield,
  UserPlus,
  ClipboardList,
  PhoneCall,
  CheckCircle2,
  MapPin,
  QrCode,
  Wifi,
  Radio,
  FileSpreadsheet,
  Library,
  Bed,
  Laptop,
  FileBadge
} from 'lucide-react';

import studentGirlImg from './assets/student-girl.jpg';
import paperworkImg from './assets/traditional-paperwork.jpg';
import studentBoyImg from './assets/student-boy.jpg';
import campusImg from './assets/campus.jpg';
import smartClassroomImg from './assets/smart-classroom.jpg';
import schoolBusImg from './assets/school-bus.jpg';
import biometricGateImg from './assets/biometric-gate.jpg';
import principalOfficeImg from './assets/principal-office.jpg';
import { useSchoolData } from './context/SchoolDataContext.jsx';
import { useToast } from './components/ToastProvider.jsx';

export default function App() {
  const { dockerStorageConnected, syncStatus, institution } = useSchoolData();
  const toast = useToast();
  const [currentPage, setCurrentPage] = useState(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash;
      if (hash.startsWith('#plans')) return 'plans';
      if (hash.startsWith('#why-unique') || hash.startsWith('#unique')) return 'unique';
      if (hash.startsWith('#school-erp')) return 'school-erp';
      if (hash.startsWith('#about')) return 'about';
      if (hash.startsWith('#checkout') || hash.startsWith('#buy-now')) return 'checkout';
      if (hash.startsWith('#login') || hash.startsWith('#access')) return 'login';
      if (hash.startsWith('#onboarding') || hash.startsWith('#setup')) return 'portal';
      if (hash.startsWith('#portal') || hash.startsWith('#dashboard') || hash.startsWith('#trustee') || hash.startsWith('#executive') || hash.startsWith('#superadmin') || hash.startsWith('#schooladmin') || hash.startsWith('#principal') || hash.startsWith('#coordinator') || hash.startsWith('#academic_coordinator') || hash.startsWith('#viceprincipal') || hash.startsWith('#accountant') || hash.startsWith('#staff') || hash.startsWith('#teacher') || hash.startsWith('#student') || hash.startsWith('#parent')) return 'portal';
    }
    return 'home';
  });

  const [portalRole, setPortalRole] = useState(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash;
      if (hash.startsWith('#onboarding') || hash.startsWith('#setup')) return 'onboarding';
      if (hash.startsWith('#principal')) return 'principal';
      if (hash.startsWith('#coordinator') || hash.startsWith('#academic_coordinator') || hash.startsWith('#viceprincipal')) return 'academic_coordinator';
      if (hash.startsWith('#schooladmin')) return 'school_admin';
      if (hash.startsWith('#superadmin')) return 'super_admin';
      if (hash.startsWith('#trustee') || hash.startsWith('#executive')) return 'trustee';
      if (hash.startsWith('#accountant')) return 'accountant';
      if (hash.startsWith('#staff') || hash.startsWith('#teacher')) return 'staff';
      if (hash.startsWith('#student')) return 'student';
      if (hash.startsWith('#parent')) return 'parent';
      if (hash.startsWith('#portal-')) {
        return hash.replace('#portal-', '');
      }
      try {
        const saved = localStorage.getItem('edubliq_session');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed && parsed.role) return parsed.role;
        }
      } catch (e) {}
    }
    return 'principal';
  });
  const [loginInitialRole, setLoginInitialRole] = useState('principal');
  const [loginQuickMenuOpen, setLoginQuickMenuOpen] = useState(false);

  // Persistent authenticated session state in localStorage
  const [authSession, setAuthSession] = useState(() => {
    try {
      const saved = localStorage.getItem('edubliq_session');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  const handleLoginSuccess = (roleId, userDetails = {}) => {
    const targetRole = roleId || 'principal';
    const schoolName = userDetails.school || (institution && institution.name) || "St. Xavier's International Academy";
    const session = {
      isLoggedIn: true,
      role: targetRole,
      name: userDetails.name || (
        targetRole === 'super_admin' ? (institution?.name ? `${institution.name} SuperAdmin` : 'Dr. Vikram Singhania') :
        targetRole === 'trustee' ? 'Shri Rajeshwar Singhania' :
        targetRole === 'school_admin' ? 'Mr. Arvind Saxena' :
        targetRole === 'academic_coordinator' || targetRole === 'vice_principal' || targetRole === 'coordinator' ? 'Prof. Arvind Saxena' :
        targetRole === 'accountant' ? 'Mr. Ramanuj Tiwari' :
        targetRole === 'staff' || targetRole === 'teacher' ? 'Mrs. Anita Sharma' :
        targetRole === 'student' ? 'Aarav Sharma' :
        targetRole === 'parent' ? 'Dr. Vikram Sharma' :
        'Dr. Sunita Kulkarni'
      ),
      email: userDetails.email || (targetRole === 'super_admin' && institution ? institution.email : 'admin@xavier.edu.in'),
      school: schoolName,
      hasOverallAccess: targetRole === 'super_admin',
      sessionYear: "2026-27",
      timestamp: Date.now()
    };
    try {
      localStorage.setItem('edubliq_session', JSON.stringify(session));
    } catch (e) {}
    setAuthSession(session);
    setPortalRole(targetRole);
    navigateTo('portal', targetRole);
  };

  const handleLogout = () => {
    try {
      localStorage.removeItem('edubliq_session');
    } catch (e) {}
    setAuthSession(null);
    navigateTo('home');
  };

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [megaMenuOpen, setMegaMenuOpen] = useState(false);
  const [whyMenuOpen, setWhyMenuOpen] = useState(false);
  const [aboutMenuOpen, setAboutMenuOpen] = useState(false);
  const [mobileModulesOpen, setMobileModulesOpen] = useState(false);

  // Pointer control & smooth hover grace period timeouts
  const megaTimeoutRef = useRef(null);
  const whyTimeoutRef = useRef(null);
  const aboutTimeoutRef = useRef(null);

  const handleMegaEnter = () => {
    if (megaTimeoutRef.current) clearTimeout(megaTimeoutRef.current);
    if (whyTimeoutRef.current) clearTimeout(whyTimeoutRef.current);
    if (aboutTimeoutRef.current) clearTimeout(aboutTimeoutRef.current);
    setWhyMenuOpen(false);
    setAboutMenuOpen(false);
    setMegaMenuOpen(true);
  };

  const handleMegaLeave = () => {
    megaTimeoutRef.current = setTimeout(() => {
      setMegaMenuOpen(false);
    }, 240); // 240ms grace period prevents accidental closing
  };

  const handleWhyEnter = () => {
    if (whyTimeoutRef.current) clearTimeout(whyTimeoutRef.current);
    if (megaTimeoutRef.current) clearTimeout(megaTimeoutRef.current);
    if (aboutTimeoutRef.current) clearTimeout(aboutTimeoutRef.current);
    setMegaMenuOpen(false);
    setAboutMenuOpen(false);
    setWhyMenuOpen(true);
  };

  const handleWhyLeave = () => {
    whyTimeoutRef.current = setTimeout(() => {
      setWhyMenuOpen(false);
    }, 240); // 240ms grace period prevents accidental closing
  };

  const handleAboutEnter = () => {
    if (aboutTimeoutRef.current) clearTimeout(aboutTimeoutRef.current);
    if (megaTimeoutRef.current) clearTimeout(megaTimeoutRef.current);
    if (whyTimeoutRef.current) clearTimeout(whyTimeoutRef.current);
    setMegaMenuOpen(false);
    setWhyMenuOpen(false);
    setAboutMenuOpen(true);
  };

  const handleAboutLeave = () => {
    aboutTimeoutRef.current = setTimeout(() => {
      setAboutMenuOpen(false);
    }, 240); // 240ms grace period prevents accidental closing
  };

  // Close dropdowns on outside click
  useEffect(() => {
    const handleDocClick = (e) => {
      if (!e.target.closest('.mega-menu-container') && !e.target.closest('.why-edubliq-container') && !e.target.closest('.about-us-container')) {
        setMegaMenuOpen(false);
        setWhyMenuOpen(false);
        setAboutMenuOpen(false);
      }
    };
    document.addEventListener('click', handleDocClick);
    return () => document.removeEventListener('click', handleDocClick);
  }, []);

  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash;
      if (hash.startsWith('#plans')) {
        setCurrentPage('plans');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (hash.startsWith('#why-unique') || hash.startsWith('#unique')) {
        setCurrentPage('unique');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (hash.startsWith('#school-erp')) {
        setCurrentPage('school-erp');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (hash.startsWith('#about')) {
        setCurrentPage('about');
        const sectionId = hash.replace('#about-', '').replace('#about', '');
        if (sectionId) {
          setTimeout(() => {
            const el = document.getElementById(sectionId);
            if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }, 120);
        } else {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      } else if (hash.startsWith('#checkout') || hash.startsWith('#buy-now')) {
        setCurrentPage('checkout');
        if (hash.includes('basic')) setCheckoutPlan('basic');
        else if (hash.includes('premium')) setCheckoutPlan('premium');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (hash.startsWith('#login') || hash.startsWith('#access')) {
        setCurrentPage('login');
        const roleFromHash = hash.replace('#login-', '').replace('#login', '').replace('#access', '');
        if (roleFromHash && !roleFromHash.startsWith('?')) setLoginInitialRole(roleFromHash);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (hash.startsWith('#onboarding') || hash.startsWith('#setup')) {
        setCurrentPage('portal');
        setPortalRole('onboarding');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (hash.startsWith('#principal')) {
        setCurrentPage('portal');
        setPortalRole('principal');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (hash.startsWith('#coordinator') || hash.startsWith('#academic_coordinator') || hash.startsWith('#viceprincipal')) {
        setCurrentPage('portal');
        setPortalRole('academic_coordinator');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (hash.startsWith('#schooladmin')) {
        setCurrentPage('portal');
        setPortalRole('school_admin');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (hash.startsWith('#superadmin')) {
        setCurrentPage('portal');
        setPortalRole('super_admin');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (hash.startsWith('#trustee') || hash.startsWith('#executive')) {
        setCurrentPage('portal');
        setPortalRole('trustee');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (hash.startsWith('#accountant')) {
        setCurrentPage('portal');
        setPortalRole('accountant');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (hash.startsWith('#staff') || hash.startsWith('#teacher')) {
        setCurrentPage('portal');
        setPortalRole('staff');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (hash.startsWith('#student')) {
        setCurrentPage('portal');
        setPortalRole('student');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (hash.startsWith('#parent')) {
        setCurrentPage('portal');
        setPortalRole('parent');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (hash.startsWith('#portal') || hash.startsWith('#dashboard')) {
        setCurrentPage('portal');
        const roleFromHash = hash.replace('#portal-', '').replace('#dashboard-', '').replace('#portal', '').replace('#dashboard', '');
        if (roleFromHash) setPortalRole(roleFromHash);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (hash === '#home' || hash === '') {
        setCurrentPage('home');
      }
    };
    // Parse the hash on first page load too — deep links (e.g. shared SuperAdmin
    // portal invite #access?role=...&code=...) must open their target page when
    // the URL is opened fresh in a new browser/tab.
    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  // Global session expiry: apiClient dispatches this when refresh token also fails.
  // Sign the user out cleanly and route them to login with a clear message.
  useEffect(() => {
    const handleSessionExpired = () => {
      try {
        localStorage.removeItem('edubliq_session');
      } catch (e) {}
      setAuthSession(null);
      toast.warning('Your session has expired. Please sign in again to continue.', {
        title: 'Session Expired',
        duration: 8000
      });
      navigateTo('login');
    };
    window.addEventListener('edubliq:session-expired', handleSessionExpired);
    return () => window.removeEventListener('edubliq:session-expired', handleSessionExpired);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const navigateTo = (page, sectionId = '') => {
    setCurrentPage(page);
    setMegaMenuOpen(false);
    setWhyMenuOpen(false);
    setAboutMenuOpen(false);
    setMobileMenuOpen(false);
    if (page === 'plans') {
      window.location.hash = '#plans';
    } else if (page === 'unique') {
      window.location.hash = '#why-unique';
    } else if (page === 'school-erp') {
      window.location.hash = sectionId ? `#school-erp-${sectionId}` : '#school-erp';
    } else if (page === 'about') {
      window.location.hash = sectionId ? `#about-${sectionId}` : '#about';
      if (sectionId) {
        setTimeout(() => {
          const el = document.getElementById(sectionId);
          if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 120);
      }
    } else if (page === 'checkout') {
      setCheckoutPlan(sectionId === 'basic' ? 'basic' : 'premium');
      window.location.hash = sectionId ? `#checkout-${sectionId}` : '#checkout';
    } else if (page === 'login') {
      if (sectionId) setLoginInitialRole(sectionId);
      window.location.hash = sectionId ? `#login-${sectionId}` : '#login';
    } else if (page === 'onboarding' || page === 'setup') {
      setPortalRole('onboarding');
      window.location.hash = '#onboarding';
    } else if (page === 'portal' || page === 'dashboard') {
      if (sectionId) setPortalRole(sectionId);
      window.location.hash = sectionId ? `#portal-${sectionId}` : '#portal';
    } else {
      window.location.hash = sectionId ? `#${sectionId}` : '#home';
    }
    if (!sectionId && page !== 'about') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const [activeFaq, setActiveFaq] = useState(0);
  const [demoModalOpen, setDemoModalOpen] = useState(false);
  const [trialModalOpen, setTrialModalOpen] = useState(false);
  const [callModalOpen, setCallModalOpen] = useState(false);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubmitted, setNewsletterSubmitted] = useState(false);

  // Demo Form State
  const [demoForm, setDemoForm] = useState({
    name: '',
    schoolName: '',
    email: '',
    phone: '',
    studentCount: '500-1000',
    role: 'Principal / Management'
  });
  const [demoSubmitted, setDemoSubmitted] = useState(false);

  const handleDemoSubmit = (e) => {
    e.preventDefault();
    setDemoSubmitted(true);
    setTimeout(() => {
      setDemoSubmitted(false);
      setDemoModalOpen(false);
      setCallModalOpen(false);
      setDemoForm({
        name: '',
        schoolName: '',
        email: '',
        phone: '',
        studentCount: '500-1000',
        role: 'Principal / Management'
      });
    }, 2500);
  };

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    setNewsletterSubmitted(true);
    setTimeout(() => {
      setNewsletterSubmitted(false);
      setNewsletterEmail('');
    }, 3000);
  };

  const [moduleCategory, setModuleCategory] = useState('all');

  // Complete 23 Modules / Services Suite for Indian School ERP
  const allModulesList = [
    { id: 'school-erp', name: 'School Management Software', icon: School, category: 'academics', desc: 'All-in-one ERP to centralize academics, operations, staff & students.' },
    { id: 'admissions', name: 'Admission Management', icon: UserPlus, category: 'operations', desc: 'Online application forms, enquiry CRM, entrance tests & enrollment.' },
    { id: 'enrollment', name: 'Enrollment & KYC', icon: ClipboardList, category: 'operations', desc: 'Student onboarding, KYC verification, document archive & sectioning.' },
    { id: 'student-info', name: 'Student 360° Information', icon: GraduationCap, category: 'academics', desc: 'Complete academic lifecycle, medical health logs & discipline files.' },
    { id: 'attendance', name: 'Attendance System', icon: Calendar, category: 'academics', desc: 'Daily period-wise & daily attendance with automated SMS to parents.' },
    { id: 'fees', name: 'Fee Ledger & Online Gateway', icon: CreditCard, category: 'finance', desc: 'Online UPI/Netbanking gateway, automated fee reminders & instant PDF receipts.' },
    { id: 'payroll', name: 'Staff HRMS & Payroll', icon: FileSpreadsheet, category: 'finance', desc: 'Biometric shift sync, EPF/ESI deductions, leave workflow & automated salary slips.' },
    { id: 'exams', name: 'Examination & Gradebook', icon: FileCheck, category: 'academics', desc: 'Exam schedules, hall tickets, grading schemes & automated report cards.' },
    { id: 'holistic-card', name: 'NEP 2020 Holistic Card (HPC)', icon: TrendingUp, category: 'academics', desc: 'NEP 2020 & CBSE compliant 360° multidimensional competency reports.' },
    { id: 'lms', name: 'LMS & E-Learning Portal', icon: Laptop, category: 'academics', desc: 'Digital lesson planner, video lecture repository & online homework submissions.' },
    { id: 'library', name: 'Library & Barcode Book Circulation', icon: Library, category: 'academics', desc: 'Dewey decimal catalog, barcode scanner, book circulation & digital e-library.' },
    { id: 'whatsapp', name: 'WhatsApp For Education', icon: MessageCircle, category: 'communication', desc: 'Automated fee receipts, attendance alerts & homework notices on WhatsApp.' },
    { id: 'communication', name: 'Parent-Teacher Communication', icon: MessageSquare, category: 'communication', desc: 'Circulars, direct teacher-parent chats, SMS & voice broadcasts.' },
    { id: 'mobile-app', name: '4 Native Mobile Apps', icon: Smartphone, category: 'communication', desc: '4 native apps for Admin, Teachers, Parents, and Students on iOS/Android.' },
    { id: 'biometric', name: 'Biometric & Turnstile Gate', icon: Fingerprint, category: 'hardware', desc: 'Fingerprint scanners, facial recognition & RFID gate turnstile integration.' },
    { id: 'bus-tracking', name: 'School Bus GPS Live Tracking', icon: MapPin, category: 'hardware', desc: 'Real-time GPS bus location on map, speed monitor & parent arrival ETA.' },
    { id: 'bus-attendance', name: 'Bus RFID Attendance', icon: Bus, category: 'hardware', desc: 'Conductor tablet app & student RFID boarding/deboarding verification.' },
    { id: 'visitor', name: 'Visitor & Security Gate Pass', icon: UserCheck, category: 'hardware', desc: 'Visitor photo ID capture, OTP gate badge printing & staff authorizations.' },
    { id: 'hostel', name: 'Hostel & Boarding Management', icon: Bed, category: 'operations', desc: 'Room allotment, mess menu & meal attendance, outing gate-pass with biometric log.' },
    { id: 'inventory', name: 'Inventory & School Store', icon: Package, category: 'operations', desc: 'Uniforms, textbooks, lab equipment, sports kits & asset depreciation.' },
    { id: 'certificates', name: 'Certificates & TC Generator', icon: FileBadge, category: 'operations', desc: 'Instant 1-click Transfer Certificates (TC), Bonafide, Character & Merit awards.' },
    { id: 'admin', name: 'Multi-Campus Administration', icon: Shield, category: 'operations', desc: 'Campus branches, role permissions, audit trails & staff hierarchy.' },
    { id: 'database', name: 'Encrypted Cloud Database', icon: Database, category: 'operations', desc: 'High-security 256-bit encrypted student & staff records on Tier-4 cloud.' }
  ];

  const quickModules = [
    { name: 'Admissions', id: 'admissions', icon: UserPlus, bg: '#fee2e2', color: '#dc2626' },
    { name: 'Attendance', id: 'attendance', icon: Calendar, bg: '#e0f2fe', color: '#0284c7' },
    { name: 'Exams & Results', id: 'exams', icon: FileCheck, bg: '#f3e8ff', color: '#9333ea' },
    { name: 'Fee Ledger', id: 'fees', icon: CreditCard, bg: '#fef3c7', color: '#d97706' },
    { name: 'Staff HR & Payroll', id: 'payroll', icon: FileSpreadsheet, bg: '#ecfdf5', color: '#047857' },
    { name: 'WhatsApp Meta', id: 'whatsapp', icon: MessageCircle, bg: '#dcfce7', color: '#15803d' },
    { name: 'GPS Bus Tracking', id: 'bus-tracking', icon: Bus, bg: '#ccfbf1', color: '#0d9488' },
    { name: 'Biometric Gate', id: 'biometric', icon: Fingerprint, bg: '#e0e7ff', color: '#4338ca' },
    { name: 'Library Barcode', id: 'library', icon: Library, bg: '#fef3c7', color: '#b45309' },
    { name: 'Mobile Apps', id: 'mobile-app', icon: Smartphone, bg: '#ede9fe', color: '#6366f1' }
  ];

  const faqs = [
    {
      q: 'What is EduBliq?',
      a: 'EduBliq is an all-in-one cloud-based School ERP software designed for Indian K-12 schools, colleges and institutes to manage admissions, attendance, fees, exams, staff, parent communication and digital learning from a single unified portal.'
    },
    {
      q: 'Can parents pay school fees online through EduBliq?',
      a: 'Yes! EduBliq seamlessly integrates with leading Indian payment gateways (UPI, Netbanking, Debit/Credit Cards) allowing parents to pay directly via the mobile app or WhatsApp with zero friction and receive instant GST-ready digital receipts.'
    },
    {
      q: 'Can biometric or RFID attendance devices be integrated?',
      a: 'Yes. EduBliq natively integrates with biometric fingerprint scanners, RFID smart attendance gates, turnstiles, and facial recognition devices. Attendance records update instantly on the dashboard and trigger automated WhatsApp/SMS alerts to parents.'
    },
    {
      q: 'How does WhatsApp for Education work?',
      a: 'EduBliq integrates with the official Meta WhatsApp Business API. Your school gets a verified WhatsApp identity to send instant fee receipts, attendance notifications, report cards, homework updates, and circulars directly to parents with 98% open rates.'
    },
    {
      q: 'Does EduBliq support GPS School Bus Tracking?',
      a: 'Yes! EduBliq provides real-time GPS tracking for your entire bus fleet. Parents can track their child’s bus live on the mobile app, receive geofence alerts when the bus is approaching their stop, and see boarding logs via RFID card taps.'
    },
    {
      q: 'Is our school data secure on EduBliq?',
      a: 'Absolutely. EduBliq uses enterprise-grade 256-bit SSL encryption, automated daily backups, role-based access control, and cloud servers hosted in high-security Tier-4 data centers.'
    },
    {
      q: 'Is staff training and onboarding support provided?',
      a: 'Yes! Our dedicated school implementation team provides full on-site and remote training for teachers, accountants, administrative staff, and management, along with 24/7 priority support.'
    }
  ];

  const testimonials = [
    {
      quote: "EduBliq has completely transformed how we manage our school. It's simple, powerful and our parents love the real-time fee and attendance notifications.",
      name: "Dr. Sunita Sharma",
      role: "Principal",
      school: "Sunrise International School, New Delhi",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80"
    },
    {
      quote: "The WhatsApp communication and RFID attendance have made parent trust skyrocket. Our fee collection turnaround improved by 40% in just two terms.",
      name: "Rajeshwar Rao",
      role: "Administrative Head",
      school: "Greenwood Public School, Hyderabad",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
    },
    {
      quote: "From online admissions to NEP Holistic Progress Cards and school bus GPS tracking, everything is now seamless and organized. Highly recommended.",
      name: "Anand K. Verma",
      role: "Managing Director",
      school: "Radiant Academy, Bengaluru",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80"
    }
  ];

  return (
    <div className="edubliq-app">
      {/* ===================================================
          1. STICKY NAVBAR WITH MODULES/SERVICES MEGA MENU (Only on Public Marketing Pages)
          =================================================== */}
      {currentPage !== 'portal' && currentPage !== 'login' && (
        <header className="navbar-wrapper">
          <div className="container">
            <div className="navbar-content">
              {/* Logo */}
              <a 
                href="#home" 
                onClick={(e) => { e.preventDefault(); navigateTo('home'); }} 
                className="nav-brand"
              >
                <div className="brand-icon-box">
                  <GraduationCap className="h-5 w-5" />
                </div>
                <span className="brand-title">Edu<span>Bliq</span></span>
              </a>

              {/* Desktop Navigation Links */}
              <nav>
                <ul className="nav-links">
                  <li className="nav-link-item">
                    <a 
                      href="#home" 
                      onClick={(e) => { e.preventDefault(); navigateTo('home'); }}
                      className={`nav-link ${currentPage === 'home' ? 'active-pill' : ''}`}
                    >
                      Home
                    </a>
                  </li>
                  <li className="nav-link-item">
                    <a 
                      href="#school-erp" 
                      onClick={(e) => { 
                        e.preventDefault(); 
                        if (authSession) {
                          navigateTo('portal', authSession.role);
                        } else {
                          navigateTo('school-erp'); 
                        }
                      }}
                      className={`nav-link ${currentPage === 'school-erp' || currentPage === 'portal' ? 'active-pill' : ''}`}
                    >
                      School ERP
                    </a>
                  </li>
                
                {/* Modules/Services with Mega Menu Dropdown */}
                <li 
                  className="nav-link-item mega-menu-container"
                  onMouseEnter={handleMegaEnter}
                  onMouseLeave={handleMegaLeave}
                >
                  <button 
                    onClick={() => setMegaMenuOpen(!megaMenuOpen)}
                    className="nav-link" 
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: 'none', border: 'none', cursor: 'pointer' }}
                  >
                    <span style={{ color: megaMenuOpen ? '#38bdf8' : 'rgba(255, 255, 255, 0.92)', fontWeight: '600' }}>Modules/Services</span>
                    <ChevronDown className={`h-3.5 w-3.5 transition-transform ${megaMenuOpen ? 'rotate-180' : ''}`} style={{ color: megaMenuOpen ? '#38bdf8' : '#93c5fd' }} />
                  </button>

                  {/* Mega Menu Dropdown Panel (Matching Screenshot) */}
                  {megaMenuOpen && (
                    <div 
                      className="mega-menu-dropdown"
                      onMouseEnter={handleMegaEnter}
                      onMouseLeave={handleMegaLeave}
                    >
                      <div className="mega-menu-grid">
                        {allModulesList.map((m) => (
                          <a 
                            key={m.id} 
                            href={m.id === 'school-erp' ? '#school-erp' : `#${m.id}`}
                            onClick={(e) => {
                              setMegaMenuOpen(false);
                              if (m.id === 'school-erp') {
                                e.preventDefault();
                                navigateTo('school-erp');
                              } else {
                                if (currentPage !== 'home') {
                                  navigateTo('home', m.id);
                                }
                              }
                            }}
                            className="mega-menu-card"
                          >
                            <div className="mega-icon-wrap">
                              <m.icon className="h-4 w-4" />
                            </div>
                            <span className="mega-title">{m.name}</span>
                          </a>
                        ))}
                      </div>

                      <div className="mega-menu-footer">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#64748b' }}>
                          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                          <span>All 23 Modules include CBSE, ICSE & State Board compliance</span>
                        </div>
                        <button 
                          onClick={() => { setMegaMenuOpen(false); navigateTo('school-erp'); }}
                          className="btn btn-blue btn-sm"
                        >
                          Explore School ERP Page →
                        </button>
                      </div>
                    </div>
                  )}
                </li>

                {/* Why EduBliq with Dropdown matching User Screenshot */}
                <li 
                  className="nav-link-item why-edubliq-container"
                  onMouseEnter={handleWhyEnter}
                  onMouseLeave={handleWhyLeave}
                >
                  <button 
                    onClick={() => setWhyMenuOpen(!whyMenuOpen)}
                    className={`nav-link ${currentPage === 'unique' || currentPage === 'plans' ? 'active-pill' : ''}`}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}
                  >
                    <span style={{ color: (whyMenuOpen || currentPage === 'unique' || currentPage === 'plans') ? '#38bdf8' : 'rgba(255, 255, 255, 0.92)', fontWeight: '600' }}>Why EduBliq</span>
                    <ChevronDown className={`h-3.5 w-3.5 transition-transform ${whyMenuOpen ? 'rotate-180' : ''}`} style={{ color: (whyMenuOpen || currentPage === 'unique' || currentPage === 'plans') ? '#38bdf8' : '#93c5fd' }} />
                  </button>

                  {/* Dropdown Menu matching exact user screenshot */}
                  {whyMenuOpen && (
                    <div 
                      className="why-dropdown-menu"
                      onMouseEnter={handleWhyEnter}
                      onMouseLeave={handleWhyLeave}
                    >
                      <button 
                        onClick={() => { setWhyMenuOpen(false); navigateTo('unique'); }}
                        className={`why-dropdown-item ${currentPage === 'unique' ? 'active' : ''}`}
                      >
                        <span>How is EduBliq unique!</span>
                      </button>

                      <button 
                        onClick={() => { setWhyMenuOpen(false); navigateTo('plans'); }}
                        className={`why-dropdown-item ${currentPage === 'plans' ? 'active' : ''}`}
                      >
                        <span>Plans</span>
                        <span style={{ fontSize: '10px', background: '#dcfce7', color: '#16a34a', padding: '2px 6px', borderRadius: '4px', fontWeight: '800' }}>SAVE 20%</span>
                      </button>
                    </div>
                  )}
                </li>

                {/* About Us with Pointer-Controlled Dropdown */}
                <li 
                  className="nav-link-item about-us-container"
                  onMouseEnter={handleAboutEnter}
                  onMouseLeave={handleAboutLeave}
                >
                  <button 
                    onClick={() => setAboutMenuOpen(!aboutMenuOpen)}
                    className={`nav-link ${currentPage === 'about' ? 'active-pill' : ''}`}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}
                  >
                    <span style={{ color: (aboutMenuOpen || currentPage === 'about') ? '#38bdf8' : 'rgba(255, 255, 255, 0.92)', fontWeight: '600' }}>About Us</span>
                    <ChevronDown className={`h-3.5 w-3.5 transition-transform ${aboutMenuOpen ? 'rotate-180' : ''}`} style={{ color: (aboutMenuOpen || currentPage === 'about') ? '#38bdf8' : '#93c5fd' }} />
                  </button>

                  {/* Dropdown Menu */}
                  {aboutMenuOpen && (
                    <div 
                      className="about-dropdown-menu"
                      onMouseEnter={handleAboutEnter}
                      onMouseLeave={handleAboutLeave}
                    >
                      <button 
                        onClick={() => { setAboutMenuOpen(false); navigateTo('about', 'story'); }}
                        className="about-dropdown-item"
                      >
                        <span>Company Story & Vision</span>
                      </button>

                      <button 
                        onClick={() => { setAboutMenuOpen(false); navigateTo('about', 'leadership'); }}
                        className="about-dropdown-item"
                      >
                        <span>Our Leadership & Advisors</span>
                      </button>

                      <button 
                        onClick={() => { setAboutMenuOpen(false); navigateTo('about', 'values'); }}
                        className="about-dropdown-item"
                      >
                        <span>Core Values & Security</span>
                      </button>

                      <button 
                        onClick={() => { setAboutMenuOpen(false); navigateTo('about', 'careers'); }}
                        className="about-dropdown-item"
                      >
                        <span>Careers at EduBliq</span>
                        <span style={{ fontSize: '10px', background: '#dbeafe', color: '#1d4ed8', padding: '2px 6px', borderRadius: '4px', fontWeight: '800' }}>HIRING</span>
                      </button>

                      <button 
                        onClick={() => { setAboutMenuOpen(false); navigateTo('about', 'contact'); }}
                        className="about-dropdown-item"
                      >
                        <span>Offices & Direct Contact</span>
                      </button>
                    </div>
                  )}
                </li>
                <li className="nav-link-item">
                  <button 
                    onClick={() => navigateTo('plans')}
                    className={`nav-link ${currentPage === 'plans' ? 'active-pill' : ''}`}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}
                  >
                    Plans & Pricing
                  </button>
                </li>
              </ul>
            </nav>

            {/* Actions */}
            <div className="nav-actions">
              {authSession ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <button 
                    onClick={() => navigateTo('portal', authSession.role)}
                    className="btn btn-primary btn-sm"
                    style={{
                      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                      border: 'none',
                      color: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      boxShadow: '0 4px 14px rgba(16, 185, 129, 0.4)',
                      padding: '8px 14px',
                      fontWeight: '700'
                    }}
                  >
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#a7f3d0', boxShadow: '0 0 8px #10b981', display: 'inline-block' }}></span>
                    <span>Launch ERP ({authSession.role.replace('_', ' ').toUpperCase()}) →</span>
                  </button>
                  <button 
                    onClick={handleLogout}
                    className="btn btn-secondary btn-sm"
                    style={{ padding: '6px 10px', fontSize: '11px', color: '#fca5a5', borderColor: 'rgba(239, 68, 68, 0.35)' }}
                    title="Sign Out of Session"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ position: 'relative' }}>
                    <button 
                      onClick={() => navigateTo('login')}
                      onMouseEnter={() => setLoginQuickMenuOpen(true)}
                      className="btn btn-secondary btn-sm"
                      style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                    >
                      <UserCheck className="h-3.5 w-3.5 text-sky-400" />
                      <span>Login</span>
                      <ChevronDown className="h-3 w-3" />
                    </button>

                    {/* Streamlined Dropdown: ONLY ERP Login and Student Login */}
                    {loginQuickMenuOpen && (
                      <div 
                        onMouseEnter={() => setLoginQuickMenuOpen(true)}
                        onMouseLeave={() => setLoginQuickMenuOpen(false)}
                        style={{
                          position: 'absolute',
                          top: '100%',
                          right: 0,
                          marginTop: '8px',
                          width: '160px',
                          backgroundColor: '#071530',
                          border: '1px solid rgba(255, 255, 255, 0.15)',
                          borderRadius: '10px',
                          padding: '6px',
                          boxShadow: '0 16px 36px rgba(0, 0, 0, 0.6)',
                          zIndex: 100,
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '4px'
                        }}
                      >
                        <button
                          onClick={() => {
                            setLoginQuickMenuOpen(false);
                            navigateTo('login', 'super_admin');
                          }}
                          style={{
                            width: '100%',
                            textAlign: 'left',
                            backgroundColor: 'rgba(255, 255, 255, 0.04)',
                            border: '1px solid rgba(255, 255, 255, 0.06)',
                            color: '#ffffff',
                            padding: '8px 12px',
                            borderRadius: '6px',
                            fontSize: '12px',
                            fontWeight: '700',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            transition: 'all 0.15s'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = 'rgba(37, 99, 235, 0.25)';
                            e.currentTarget.style.borderColor = '#38bdf8';
                            e.currentTarget.style.color = '#38bdf8';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.04)';
                            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.06)';
                            e.currentTarget.style.color = '#ffffff';
                          }}
                        >
                          <span>ERP Login</span>
                          <ArrowRight className="h-3 w-3" />
                        </button>

                        <button
                          onClick={() => {
                            setLoginQuickMenuOpen(false);
                            navigateTo('student');
                          }}
                          style={{
                            width: '100%',
                            textAlign: 'left',
                            backgroundColor: 'rgba(255, 255, 255, 0.04)',
                            border: '1px solid rgba(255, 255, 255, 0.06)',
                            color: '#ffffff',
                            padding: '8px 12px',
                            borderRadius: '6px',
                            fontSize: '12px',
                            fontWeight: '700',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            transition: 'all 0.15s'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = 'rgba(16, 185, 129, 0.25)';
                            e.currentTarget.style.borderColor = '#10b981';
                            e.currentTarget.style.color = '#34d399';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.04)';
                            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.06)';
                            e.currentTarget.style.color = '#ffffff';
                          }}
                        >
                          <span>Student Login</span>
                          <ArrowRight className="h-3 w-3" />
                        </button>

                      </div>
                    )}
                  </div>

                  <button 
                    onClick={() => setDemoModalOpen(true)}
                    className="btn btn-primary btn-sm"
                  >
                    Request Live Demo
                  </button>
                </div>
              )}
              <button 
                className="mobile-menu-btn"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown Menu (Responsive Drawer) */}
        {mobileMenuOpen && (
          <div className="mobile-nav-drawer">
            <a 
              href="#home" 
              onClick={(e) => { e.preventDefault(); setMobileMenuOpen(false); navigateTo('home'); }} 
              style={{ padding: '8px 0', fontWeight: '600', color: currentPage === 'home' ? '#2563eb' : '#0f172a' }}
            >
              Home
            </a>
            <a 
              href="#school-erp" 
              onClick={(e) => { e.preventDefault(); setMobileMenuOpen(false); navigateTo('school-erp'); }} 
              style={{ padding: '8px 0', color: currentPage === 'school-erp' ? '#2563eb' : '#475569', fontWeight: '700' }}
            >
              School ERP
            </a>

            {/* Why EduBliq Section in Mobile */}
            <div style={{ padding: '10px 0', borderTop: '1px solid #f1f5f9', borderBottom: '1px solid #f1f5f9', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <span style={{ fontSize: '11px', color: '#0284c7', fontWeight: '800', textTransform: 'uppercase' }}>Why EduBliq</span>
              <a 
                href="#why-unique" 
                onClick={(e) => { e.preventDefault(); setMobileMenuOpen(false); navigateTo('unique'); }} 
                style={{ padding: '6px 8px', fontSize: '14px', color: currentPage === 'unique' ? '#2563eb' : '#475569', fontWeight: '600' }}
              >
                • How is EduBliq unique!
              </a>
              <a 
                href="#plans" 
                onClick={(e) => { e.preventDefault(); setMobileMenuOpen(false); navigateTo('plans'); }} 
                style={{ padding: '6px 8px', fontSize: '14px', color: currentPage === 'plans' ? '#2563eb' : '#475569', fontWeight: '600', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
              >
                <span>• Plans</span>
                <span style={{ fontSize: '10px', background: '#dcfce7', color: '#16a34a', padding: '2px 6px', borderRadius: '4px', fontWeight: '800' }}>SAVE 20%</span>
              </a>
            </div>

            {/* Modules / Services Collapsible in Mobile */}
            <div style={{ borderBottom: '1px solid #f1f5f9', padding: '8px 0' }}>
              <button
                onClick={() => setMobileModulesOpen(!mobileModulesOpen)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  width: '100%',
                  background: 'none',
                  border: 'none',
                  padding: '6px 0',
                  color: '#0284c7',
                  fontWeight: '700',
                  fontSize: '14px',
                  cursor: 'pointer',
                  textAlign: 'left'
                }}
              >
                <span>Modules & Services (23)</span>
                <ChevronDown className={`h-4 w-4 transition-transform ${mobileModulesOpen ? 'rotate-180' : ''}`} />
              </button>

              {mobileModulesOpen && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '6px', paddingTop: '8px', paddingBottom: '8px' }}>
                  {allModulesList.map((m) => (
                    <a
                      key={m.id}
                      href={m.id === 'school-erp' ? '#school-erp' : `#${m.id}`}
                      onClick={(e) => {
                        setMobileMenuOpen(false);
                        if (m.id === 'school-erp') {
                          e.preventDefault();
                          navigateTo('school-erp');
                        } else {
                          if (currentPage !== 'home') {
                            navigateTo('home', m.id);
                          }
                        }
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '6px 8px',
                        backgroundColor: '#f8fafc',
                        borderRadius: '6px',
                        border: '1px solid #e2e8f0',
                        fontSize: '11.5px',
                        fontWeight: '600',
                        color: '#1e293b',
                        textDecoration: 'none'
                      }}
                    >
                      <m.icon className="h-3 w-3 text-sky-600" style={{ flexShrink: 0 }} />
                      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.name}</span>
                    </a>
                  ))}
                </div>
              )}
            </div>

            {/* About EduBliq in Mobile Drawer */}
            <div style={{ padding: '8px 0', borderBottom: '1px solid #f1f5f9', display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <span style={{ fontSize: '11px', color: '#0284c7', fontWeight: '800', textTransform: 'uppercase' }}>About EduBliq</span>
              <a 
                href="#about-story" 
                onClick={(e) => { e.preventDefault(); setMobileMenuOpen(false); navigateTo('about', 'story'); }} 
                style={{ padding: '6px 8px', fontSize: '14px', color: currentPage === 'about' ? '#2563eb' : '#475569', fontWeight: '600' }}
              >
                • Company Story & Vision
              </a>
              <a 
                href="#about-leadership" 
                onClick={(e) => { e.preventDefault(); setMobileMenuOpen(false); navigateTo('about', 'leadership'); }} 
                style={{ padding: '6px 8px', fontSize: '14px', color: '#475569', fontWeight: '600' }}
              >
                • Our Leadership & Advisors
              </a>
              <a 
                href="#about-values" 
                onClick={(e) => { e.preventDefault(); setMobileMenuOpen(false); navigateTo('about', 'values'); }} 
                style={{ padding: '6px 8px', fontSize: '14px', color: '#475569', fontWeight: '600' }}
              >
                • Core Values & Security
              </a>
              <a 
                href="#about-careers" 
                onClick={(e) => { e.preventDefault(); setMobileMenuOpen(false); navigateTo('about', 'careers'); }} 
                style={{ padding: '6px 8px', fontSize: '14px', color: '#475569', fontWeight: '600', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
              >
                <span>• Careers at EduBliq</span>
                <span style={{ fontSize: '10px', background: '#dbeafe', color: '#1d4ed8', padding: '2px 6px', borderRadius: '4px', fontWeight: '800' }}>HIRING</span>
              </a>
              <a 
                href="#about-contact" 
                onClick={(e) => { e.preventDefault(); setMobileMenuOpen(false); navigateTo('about', 'contact'); }} 
                style={{ padding: '6px 8px', fontSize: '14px', color: '#475569', fontWeight: '600' }}
              >
                • Regional Offices & Support
              </a>
            </div>

            <a href="#biometric" onClick={() => { setMobileMenuOpen(false); if(currentPage !== 'home') navigateTo('home', 'biometric'); }} style={{ padding: '8px 0', color: '#475569' }}>Biometric & RFID Attendance</a>
            <a href="#bus-tracking" onClick={() => { setMobileMenuOpen(false); if(currentPage !== 'home') navigateTo('home', 'bus-tracking'); }} style={{ padding: '8px 0', color: '#475569' }}>Bus Tracking System</a>
            <a href="#whatsapp" onClick={() => { setMobileMenuOpen(false); if(currentPage !== 'home') navigateTo('home', 'whatsapp'); }} style={{ padding: '8px 0', color: '#475569' }}>WhatsApp For Education</a>
            <a href="#mobile-apps" onClick={() => { setMobileMenuOpen(false); if(currentPage !== 'home') navigateTo('home', 'mobile-apps'); }} style={{ padding: '8px 0', color: '#475569' }}>Mobile Apps</a>
            <a href="#faq" onClick={() => { setMobileMenuOpen(false); if(currentPage !== 'home') navigateTo('home', 'faq'); }} style={{ padding: '8px 0', color: '#475569' }}>FAQ</a>
            <div style={{ display: 'flex', gap: '10px', paddingTop: '12px', borderTop: '1px solid #f1f5f9' }}>
              <button onClick={() => { setMobileMenuOpen(false); navigateTo('login'); }} className="btn btn-secondary" style={{ flex: 1 }}>Login</button>
              <button onClick={() => { setMobileMenuOpen(false); setDemoModalOpen(true); }} className="btn btn-primary" style={{ flex: 1 }}>Request Demo</button>
            </div>
          </div>
        )}
      </header>
      )}

      {currentPage === 'school-erp' && (
        <SchoolERP 
          onOpenDemo={() => setDemoModalOpen(true)}
          onOpenTrial={() => setTrialModalOpen(true)}
          onNavigateHome={() => navigateTo('home')}
          onNavigatePortal={(roleId) => {
            handleLoginSuccess(roleId);
          }}
          onNavigateLogin={(roleId) => {
            if (roleId) setLoginInitialRole(roleId);
            navigateTo('login', roleId);
          }}
        />
      )}

      {currentPage === 'plans' && (
        <Plans 
          onOpenDemo={() => setDemoModalOpen(true)}
          onOpenTrial={() => setTrialModalOpen(true)}
          onNavigateHome={() => navigateTo('home')}
          onBuyNow={(planId) => navigateTo('checkout', planId)}
        />
      )}

      {currentPage === 'checkout' && (
        <Checkout 
          initialPlan={checkoutPlan}
          onNavigateHome={() => navigateTo('home')}
          onNavigatePlans={() => navigateTo('plans')}
        />
      )}

      {currentPage === 'unique' && (
        <Unique 
          onOpenDemo={() => setDemoModalOpen(true)}
          onOpenTrial={() => setTrialModalOpen(true)}
          onNavigateHome={() => navigateTo('home')}
          onNavigatePlans={() => navigateTo('plans')}
        />
      )}

      {currentPage === 'about' && (
        <About 
          onOpenDemo={() => setDemoModalOpen(true)}
          onOpenTrial={() => setTrialModalOpen(true)}
          onNavigateHome={() => navigateTo('home')}
          onNavigatePlans={() => navigateTo('plans')}
        />
      )}

      {currentPage === 'login' && (
        <Login 
          initialRole={loginInitialRole}
          authSession={authSession}
          onNavigateHome={() => navigateTo('home')}
          onNavigatePlans={() => navigateTo('plans')}
          onNavigateDashboard={(roleId, userDetails) => {
            handleLoginSuccess(roleId, userDetails);
          }}
        />
      )}

      {currentPage === 'portal' && (
        <WorkspaceGateway 
          role={portalRole}
          authSession={authSession}
          onNavigateHome={() => navigateTo('home')}
          onNavigateLogin={() => {
            handleLogout();
            navigateTo('login');
          }}
          onSwitchRole={(newRole) => {
            handleLoginSuccess(newRole);
          }}
        />
      )}

      {currentPage === 'home' && (
        <>
          {/* ===================================================
              2. HERO SECTION WITH ERP DASHBOARD MOCKUP
              =================================================== */}
          <section id="home" className="hero-section">
            <div className="hero-glow-1"></div>
            <div className="container">
              <div className="hero-grid">
                {/* Left: Copy & CTAs */}
                <div className="hero-left">
                  <div 
                    className="section-badge"
                    onClick={() => navigateTo('school-erp')}
                    style={{ cursor: 'pointer', transition: 'all 0.2s', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                    title="Click to open dedicated School ERP Page"
                  >
                    <Sparkles className="h-3 w-3" /> All-in-One School ERP &bull; <span style={{ textDecoration: 'underline' }}>Explore Dedicated ERP Page →</span>
                  </div>
                  <h1 className="hero-headline">
                Simplify School Management, <span className="gradient-text">Empower Education</span>
              </h1>
              <p className="hero-desc">
                A modern, easy-to-use School Management System to manage admissions, attendance, fees, exams, communication, bus tracking and more — all in one connected place.
              </p>

              <div className="hero-cta-group">
                <button 
                  onClick={() => setDemoModalOpen(true)}
                  className="btn btn-primary btn-lg"
                >
                  Request Demo <ArrowRight className="h-4 w-4" />
                </button>
                <button 
                  onClick={() => setTrialModalOpen(true)}
                  className="btn btn-secondary btn-lg"
                >
                  Start 14 Days Trial
                </button>
              </div>

              {/* Social Proof */}
              <div className="hero-trust">
                <div className="trust-avatar-stack">
                  <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80" alt="Leader" className="trust-avatar" />
                  <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80" alt="Leader" className="trust-avatar" />
                  <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80" alt="Leader" className="trust-avatar" />
                </div>
                <span className="trust-text">Trusted by 1,100+ Schools across India</span>
              </div>
            </div>

            {/* Right: Realistic Admin Dashboard Mockup */}
            <div className="dashboard-mockup-wrapper">
              <div className="dashboard-window">
                {/* Window Top Bar */}
                <div className="dash-topbar">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#ef4444' }}></div>
                    <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#f59e0b' }}></div>
                    <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#10b981' }}></div>
                    <span style={{ fontSize: '11px', fontWeight: '700', color: '#0f172a', marginLeft: '6px' }}>EduBliq ERP</span>
                  </div>

                  <div className="dash-search">
                    <Search className="h-3.5 w-3.5" />
                    <span>Search students, staff, admission ID...</span>
                  </div>

                  <div className="dash-user-area">
                    <Bell className="h-4 w-4 text-slate-500" style={{ cursor: 'pointer' }} />
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <img 
                        src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=80" 
                        alt="Admin" 
                        style={{ width: '26px', height: '26px', borderRadius: '50%', objectFit: 'cover' }} 
                      />
                      <span style={{ fontSize: '11px', fontWeight: '700', color: '#0f172a' }}>Admin</span>
                    </div>
                  </div>
                </div>

                {/* Dashboard Inner Body */}
                <div className="dash-body">
                  {/* Left mini sidebar */}
                  <div className="dash-sidebar">
                    <div className="dash-nav-item active">
                      <BarChart3 className="h-3.5 w-3.5" /> Dashboard
                    </div>
                    <div className="dash-nav-item">
                      <Users className="h-3.5 w-3.5" /> Students
                    </div>
                    <div className="dash-nav-item">
                      <Calendar className="h-3.5 w-3.5" /> Attendance
                    </div>
                    <div className="dash-nav-item">
                      <Award className="h-3.5 w-3.5" /> Exams
                    </div>
                    <div className="dash-nav-item">
                      <CreditCard className="h-3.5 w-3.5" /> Fees
                    </div>
                    <div className="dash-nav-item">
                      <MessageSquare className="h-3.5 w-3.5" /> Messages
                    </div>
                    <div className="dash-nav-item">
                      <Truck className="h-3.5 w-3.5" /> Transport
                    </div>
                    <div className="dash-nav-item">
                      <Package className="h-3.5 w-3.5" /> Inventory
                    </div>
                    <div className="dash-nav-item">
                      <UserCheck className="h-3.5 w-3.5" /> Staff
                    </div>
                  </div>

                  {/* Main content view */}
                  <div className="dash-main">
                    <div className="dash-header-greeting">
                      <div>
                        <h4 style={{ fontSize: '14px', fontWeight: '800', color: '#0f172a' }}>Welcome back, Admin!</h4>
                        <p style={{ fontSize: '10px', color: '#64748b' }}>Here is what's happening at St. Xavier's Academy today.</p>
                      </div>
                      <span style={{ fontSize: '10px', fontWeight: '600', color: '#2563eb', backgroundColor: '#eff6ff', padding: '3px 8px', borderRadius: '4px' }}>
                        Session: 2026-27
                      </span>
                    </div>

                    {/* 4 KPIs */}
                    <div className="dash-kpi-grid">
                      <div className="dash-kpi-card">
                        <div className="dash-kpi-label">Total Students</div>
                        <div className="dash-kpi-val">1,240</div>
                        <div className="dash-kpi-sub">↑ +12% YoY</div>
                      </div>
                      <div className="dash-kpi-card">
                        <div className="dash-kpi-label">Total Teachers</div>
                        <div className="dash-kpi-val">95</div>
                        <div className="dash-kpi-sub">↑ +3% Staff</div>
                      </div>
                      <div className="dash-kpi-card">
                        <div className="dash-kpi-label">Fee Collection</div>
                        <div className="dash-kpi-val">₹12,38,500</div>
                        <div className="dash-kpi-sub" style={{ color: '#059669' }}>94% Collected</div>
                      </div>
                      <div className="dash-kpi-card">
                        <div className="dash-kpi-label">Attendance Today</div>
                        <div className="dash-kpi-val">96%</div>
                        <div className="dash-kpi-sub" style={{ color: '#2563eb' }}>1,190 Present</div>
                      </div>
                    </div>

                    {/* Split: Left side (Chart + Recent Activities) & Right side (Quick Actions) */}
                    <div className="dash-inner-split">
                      {/* Left: Classwise Bar Chart & Recent Activities */}
                      <div className="dash-left-col">
                        {/* Bar chart */}
                        <div className="dash-chart-card">
                          <div className="dash-card-header">
                            <span>Classwise Student Count</span>
                            <span style={{ fontSize: '9px', color: '#64748b' }}>Grades 1-10</span>
                          </div>
                          <div className="bar-chart-bars">
                            {[
                              { class: 'I', height: '52px', count: 120 },
                              { class: 'II', height: '68px', count: 135 },
                              { class: 'III', height: '48px', count: 110 },
                              { class: 'IV', height: '72px', count: 142 },
                              { class: 'V', height: '58px', count: 125 },
                              { class: 'VI', height: '82px', count: 155 },
                              { class: 'VII', height: '64px', count: 130 },
                              { class: 'VIII', height: '76px', count: 148 },
                              { class: 'IX', height: '88px', count: 160 },
                              { class: 'X', height: '60px', count: 128 },
                            ].map((b, i) => (
                              <div key={i} className="bar-col">
                                <div className="bar-pillar" style={{ height: b.height }} title={`Class ${b.class}: ${b.count} students`}></div>
                                <span className="bar-label">{b.class}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Recent Activities */}
                        <div className="dash-activities-card">
                          <div className="dash-card-header">
                            <span>Recent Activities</span>
                            <span style={{ fontSize: '9px', color: '#2563eb', cursor: 'pointer' }}>View all</span>
                          </div>
                          <div className="dash-activity-list">
                            <div className="dash-activity-row">
                              <span className="activity-dot bg-green"></span>
                              <span className="activity-text">New admission received</span>
                              <span className="activity-time">10 min ago</span>
                            </div>
                            <div className="dash-activity-row">
                              <span className="activity-dot bg-blue"></span>
                              <span className="activity-text">Fee payment received</span>
                              <span className="activity-time">25 min ago</span>
                            </div>
                            <div className="dash-activity-row">
                              <span className="activity-dot bg-amber"></span>
                              <span className="activity-text">Leave application</span>
                              <span className="activity-time">1 hour ago</span>
                            </div>
                            <div className="dash-activity-row">
                              <span className="activity-dot bg-purple"></span>
                              <span className="activity-text">Exam marks updated</span>
                              <span className="activity-time">3 hours ago</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Right: Quick Actions */}
                      <div className="dash-actions-card">
                        <div className="dash-card-header">
                          <span>Quick Actions</span>
                        </div>
                        <div className="dash-actions-list">
                          <button className="quick-action-btn">
                            <span className="qa-icon" style={{ backgroundColor: '#eff6ff', color: '#2563eb' }}>+</span>
                            <span>Add New Student</span>
                          </button>
                          <button className="quick-action-btn">
                            <span className="qa-icon" style={{ backgroundColor: '#fef2f2', color: '#ef4444' }}>📢</span>
                            <span>Broadcast Notice</span>
                          </button>
                          <button className="quick-action-btn">
                            <span className="qa-icon" style={{ backgroundColor: '#ecfdf5', color: '#059669' }}>💳</span>
                            <span>Collect Fees</span>
                          </button>
                          <button className="quick-action-btn">
                            <span className="qa-icon" style={{ backgroundColor: '#faf5ff', color: '#7c3aed' }}>📄</span>
                            <span>Generate Report</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Pill Badge */}
              <div className="dash-floating-pill">
                <span style={{ fontSize: '18px' }}>📲</span>
                <div>
                  <div style={{ fontWeight: '700', color: '#0f172a' }}>Manage your school</div>
                  <div style={{ fontSize: '10px', color: '#64748b' }}>Anytime, anywhere on cloud</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================
          3. HORIZONTAL QUICK MODULE STRIP
          =================================================== */}
      <section className="modules-strip-section">
        <div className="container">
          <div className="modules-strip-grid">
            {quickModules.map((m, idx) => (
              <div 
                key={idx} 
                className="strip-item"
                onClick={() => {
                  const targetEl = document.getElementById(m.id) || document.getElementById('modules');
                  if (targetEl) targetEl.scrollIntoView({ behavior: 'smooth' });
                }}
                title={`Explore ${m.name} module`}
              >
                <div className="strip-icon-circle" style={{ backgroundColor: m.bg, color: m.color }}>
                  <m.icon className="h-5 w-5" />
                </div>
                <span className="strip-title">{m.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===================================================
          4. PROBLEM TO SOLUTION (TRADITIONAL VS EDUBLIQ)
          =================================================== */}
      <section id="features" className="section-padding comparison-section">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '16px' }}>
            <span className="section-badge section-badge-purple">Digital Transformation</span>
            <h2 className="section-title">Move From Manual Work to One Connected School</h2>
            <p className="section-subtitle">
              Replace disconnected spreadsheets, paperwork and repetitive administrative tasks with a centralized, automated digital platform.
            </p>
          </div>

          <div className="comparison-grid">
            {/* The Traditional Way */}
            <div className="comparison-card comparison-card-traditional">
              <div className="comp-header">
                <span className="comp-badge-bad">The Traditional Way</span>
                <h3 className="comp-title">Manual Process, More Errors</h3>
                <p className="comp-subtitle">Slow, paper-heavy and prone to data loss</p>
              </div>
              <div className="comp-content-split">
                <div className="comp-img-box">
                  <img src={paperworkImg} alt="Paperwork files stack" />
                </div>
                <ul className="comp-list">
                  {[
                    'Paperwork and physical file cabinets',
                    'Difficult manual admission tracking',
                    'Manual paper register attendance',
                    'Late fee collection & missed dues',
                    'Poor, uncoordinated parent communication',
                    'Time-consuming manual report cards',
                    'Data security and damage risks'
                  ].map((item, i) => (
                    <li key={i} className="comp-item">
                      <span className="comp-icon-bad"><X className="h-3 w-3" /></span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Transition Arrow Badge */}
            <div className="comparison-arrow-badge">
              <ArrowRight className="h-5 w-5" />
            </div>

            {/* The EduBliq Way */}
            <div className="comparison-card comparison-card-digital">
              <div className="comp-header">
                <span className="comp-badge-good">The EduBliq Way</span>
                <h3 className="comp-title">Smart Solution for Modern Schools</h3>
                <p className="comp-subtitle">Fast, centralized, automated & error-free</p>
              </div>
              <div className="comp-content-split">
                <ul className="comp-list">
                  {[
                    'Complete paperless digital management',
                    'Online admissions & instant verification',
                    'Automated attendance (Biometric/RFID)',
                    'Online fee collection & instant receipts',
                    'Real-time parent communication on app',
                    'Instant report cards & grade analytics',
                    'Secure, encrypted cloud-based system'
                  ].map((item, i) => (
                    <li key={i} className="comp-item">
                      <span className="comp-icon-good"><Check className="h-3 w-3" /></span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <div className="comp-img-box">
                  <img src={studentGirlImg} alt="Smiling Indian student" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================
          5. SCHOOL GROWTH WORKFLOW (4 STEPS)
          =================================================== */}
      <section className="section-padding workflow-section">
        <div className="container">
          <div className="workflow-header-row">
            <div>
              <span className="section-badge section-badge-green">From Enquiry to Alumni</span>
              <h2 className="section-title">Boost School Growth at Every Step</h2>
              <p className="section-subtitle" style={{ marginLeft: 0 }}>
                Manage prospective student enquiries, follow-ups, admissions and their full learning journey with a structured, data-driven workflow.
              </p>
            </div>
            <button 
              onClick={() => setDemoModalOpen(true)}
              className="btn btn-secondary"
            >
              Learn More <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          <div className="workflow-steps-grid">
            {[
              {
                step: '01',
                title: 'Enquiry',
                desc: 'Capture & manage prospective student enquiries from walk-ins, phone calls and website forms.',
                icon: '📋',
                bg: '#eff6ff',
                color: '#2563eb'
              },
              {
                step: '02',
                title: 'Follow-ups',
                desc: 'Automated SMS reminders, counselor call schedules and prospective parent engagement.',
                icon: '🔔',
                bg: '#fef3c7',
                color: '#d97706'
              },
              {
                step: '03',
                title: 'Admission',
                desc: 'Online registration, digital document verification, entrance tests and fee payment.',
                icon: '🎓',
                bg: '#f0fdf4',
                color: '#16a34a'
              },
              {
                step: '04',
                title: 'Student Journey',
                desc: 'Track attendance, marks, timetable, fees, health records and alumni connections continuously.',
                icon: '🌟',
                bg: '#faf5ff',
                color: '#9333ea'
              }
            ].map((st, i) => (
              <div key={i} className="workflow-step-card">
                <span className="step-num-badge">Step {st.step}</span>
                <div className="step-icon-box" style={{ backgroundColor: st.bg, color: st.color, fontSize: '20px' }}>
                  {st.icon}
                </div>
                <h3 className="step-title">{st.title}</h3>
                <p className="step-desc">{st.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===================================================
          6. ALL 23 ESSENTIAL MODULES & SERVICES
          =================================================== */}
      <section id="modules" className="section-padding modules-section">
        <div className="container">
          <div className="modules-top-row">
            <div>
              <span className="section-badge">Complete School Management</span>
              <h2 className="section-title">All 23 Essential Modules & Services</h2>
              <p className="section-subtitle" style={{ marginLeft: 0 }}>
                Powerful tools engineered for schools to automate operations, reduce staff workload, and provide a world-class digital experience.
              </p>
            </div>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <button 
                onClick={() => navigateTo('school-erp')}
                className="btn btn-secondary"
              >
                Explore School ERP Console →
              </button>
              <button 
                onClick={() => setDemoModalOpen(true)}
                className="btn btn-blue"
              >
                Request Custom Demo
              </button>
            </div>
          </div>

          {/* Module Category Filter Tabs */}
          <div className="module-category-tabs">
            {[
              { id: 'all', label: 'All Modules', count: allModulesList.length },
              { id: 'academics', label: 'Academics & Learning', count: allModulesList.filter(m => m.category === 'academics').length },
              { id: 'operations', label: 'Administration & Campus', count: allModulesList.filter(m => m.category === 'operations').length },
              { id: 'hardware', label: 'Biometrics & Transport', count: allModulesList.filter(m => m.category === 'hardware').length },
              { id: 'finance', label: 'Fees & Payroll', count: allModulesList.filter(m => m.category === 'finance').length },
              { id: 'communication', label: 'Communication & Apps', count: allModulesList.filter(m => m.category === 'communication').length }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setModuleCategory(tab.id)}
                className={`module-cat-btn ${moduleCategory === tab.id ? 'active' : ''}`}
              >
                <span>{tab.label}</span>
                <span className="cat-count">{tab.count}</span>
              </button>
            ))}
          </div>

          {/* 23 Modules Grid */}
          <div className="modules-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))' }}>
            {allModulesList
              .filter(mod => moduleCategory === 'all' || mod.category === moduleCategory)
              .map((mod) => (
                <div 
                  key={mod.id} 
                  id={mod.id} 
                  className="module-card"
                  onClick={() => {
                    if (mod.id === 'school-erp') {
                      navigateTo('school-erp');
                    } else {
                      const target = document.getElementById(mod.id);
                      if (target && target !== document.getElementById('modules')) {
                        target.scrollIntoView({ behavior: 'smooth' });
                      } else {
                        setDemoModalOpen(true);
                      }
                    }
                  }}
                  style={{ cursor: 'pointer' }}
                  title={`Click to explore ${mod.name}`}
                >
                  <div className="module-card-header">
                    <div className="module-icon-wrap" style={{ backgroundColor: '#e0f2fe', color: '#0284c7' }}>
                      <mod.icon className="h-5 w-5" />
                    </div>
                    <ChevronRight className="h-4 w-4 module-card-arrow" />
                  </div>
                  <h3 className="module-name">{mod.name}</h3>
                  <p className="module-desc">{mod.desc}</p>
                </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===================================================
          7. NEW FEATURE SHOWCASE 1: BIOMETRIC & RFID SMART ATTENDANCE
          =================================================== */}
      <section id="biometric" className="feature-showcase-section bg-white">
        <div className="container">
          <div className="showcase-grid">
            {/* Left: Professional Photo with Live Gate Overlay */}
            <div className="showcase-img-container">
              <img src={biometricGateImg} alt="Indian student scanning RFID ID card at smart turnstile" className="showcase-img" />
              <div className="showcase-telemetry-badge">
                <div className="telemetry-left">
                  <div className="telemetry-dot"></div>
                  <div>
                    <div className="telemetry-title">Turnstile Gate 01 · IDEMIA</div>
                    <div className="telemetry-sub">Student: Rahul Sharma (Class 8-A) · Tap In: 08:14 AM</div>
                  </div>
                </div>
                <span className="telemetry-tag">VERIFIED ✓</span>
              </div>
            </div>

            {/* Right: Feature Highlights */}
            <div className="showcase-content">
              <span className="showcase-badge" style={{ backgroundColor: '#e0f2fe', color: '#0284c7' }}>
                <Fingerprint className="h-3.5 w-3.5" /> Biometric & RFID Turnstiles
              </span>
              <h2 className="showcase-title">Zero-Error Biometric & RFID Gate Attendance</h2>
              <p className="showcase-desc">
                Replace manual paper registers and proxy entries with lightning-fast biometric fingerprint, facial recognition, and smart RFID card turnstiles.
              </p>

              <ul className="showcase-checklist">
                <li className="showcase-check-item">
                  <span className="check-icon-circle"><Check className="h-3.5 w-3.5" /></span>
                  <div>
                    <strong>Instant Parent SMS & App Alerts:</strong> Parents receive an automated notification the exact second their child taps in or exits the campus.
                  </div>
                </li>
                <li className="showcase-check-item">
                  <span className="check-icon-circle"><Check className="h-3.5 w-3.5" /></span>
                  <div>
                    <strong>Turnstile Hardware Integration:</strong> Compatible with Idemia, eSSL, Realtime, Matrix, and facial recognition terminals with offline caching.
                  </div>
                </li>
                <li className="showcase-check-item">
                  <span className="check-icon-circle"><Check className="h-3.5 w-3.5" /></span>
                  <div>
                    <strong>Staff Biometric & Payroll Sync:</strong> Automate teacher shifts, half-day leaves, late-mark calculations, and one-click salary generation.
                  </div>
                </li>
              </ul>

              <div>
                <button onClick={() => setDemoModalOpen(true)} className="btn btn-primary">
                  See Biometric Live Demo <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================
          8. NEW FEATURE SHOWCASE 2: GPS SCHOOL BUS TRACKING & BUS ATTENDANCE
          =================================================== */}
      <section id="bus-tracking" className="feature-showcase-section bg-light">
        <div className="container">
          <div className="showcase-grid showcase-reverse">
            {/* Right on desktop: Professional School Bus Fleet Photo */}
            <div className="showcase-img-container">
              <img src={schoolBusImg} alt="Modern Indian school buses fleet with teacher using tablet attendance" className="showcase-img" />
              <div className="showcase-telemetry-badge">
                <div className="telemetry-left">
                  <div className="telemetry-dot"></div>
                  <div>
                    <div className="telemetry-title">Route #14 · Heritage International</div>
                    <div className="telemetry-sub">Speed: 34 km/h · Next: Indiranagar Stop (ETA: 4 mins)</div>
                  </div>
                </div>
                <span className="telemetry-tag" style={{ backgroundColor: '#fef3c7', color: '#b45309' }}>GPS LIVE 📡</span>
              </div>
            </div>

            {/* Left on desktop: Feature Details */}
            <div className="showcase-content">
              <span className="showcase-badge" style={{ backgroundColor: '#ccfbf1', color: '#0f766e' }}>
                <Bus className="h-3.5 w-3.5" /> Safe Student Commute
              </span>
              <h2 className="showcase-title">Live GPS Bus Tracking & Smart Bus Attendance</h2>
              <p className="showcase-desc">
                Provide parents complete peace of mind. Track your entire fleet of school buses in real-time, monitor driver speed, and verify student boarding with RFID taps.
              </p>

              <ul className="showcase-checklist">
                <li className="showcase-check-item">
                  <span className="check-icon-circle"><Check className="h-3.5 w-3.5" /></span>
                  <div>
                    <strong>Real-Time Live Map for Parents:</strong> Parents see their child's bus moving live on the mobile app with accurate traffic-based arrival ETA.
                  </div>
                </li>
                <li className="showcase-check-item">
                  <span className="check-icon-circle"><Check className="h-3.5 w-3.5" /></span>
                  <div>
                    <strong>Conductor Tablet App:</strong> Conductor or attendant taps student smart cards during boarding & deboarding, flagging any wrong bus boarding.
                  </div>
                </li>
                <li className="showcase-check-item">
                  <span className="check-icon-circle"><Check className="h-3.5 w-3.5" /></span>
                  <div>
                    <strong>Over-Speeding & Geofence SOS Alerts:</strong> Instant alarms when a bus deviates from assigned route or exceeds campus speed limits.
                  </div>
                </li>
              </ul>

              <div>
                <button onClick={() => setDemoModalOpen(true)} className="btn btn-blue">
                  Explore Transport Module <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================
          9. NEW FEATURE SHOWCASE 3: WHATSAPP FOR EDUCATION
          =================================================== */}
      <section id="whatsapp" className="feature-showcase-section bg-white">
        <div className="container">
          <div className="showcase-grid">
            {/* Left: Realistic WhatsApp Phone Mockup */}
            <div className="whatsapp-phone-chassis">
              <div className="wa-top-bar">
                <div className="wa-school-info">
                  <div className="wa-avatar">🏫</div>
                  <div className="wa-name-box">
                    <span className="wa-name">
                      St. Xavier's Academy <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                    </span>
                    <span className="wa-status">Official Verified School Account</span>
                  </div>
                </div>
                <Phone className="h-4 w-4 text-emerald-200" />
              </div>

              <div className="wa-chat-body">
                {/* Message 1: Attendance */}
                <div className="wa-bubble school-alert">
                  <strong>Attendance Alert 🔔</strong>
                  <p style={{ margin: '4px 0' }}>Dear Mr. Sharma, your ward <strong>Rahul Sharma (8-A)</strong> has entered school campus at <strong>08:14 AM</strong> via Gate 01.</p>
                  <div className="wa-time">08:14 AM · Delivered ✓✓</div>
                </div>

                {/* Message 2: Fee Receipt */}
                <div className="wa-bubble receipt-alert">
                  <strong>Fee Payment Confirmed 💳</strong>
                  <p style={{ margin: '4px 0' }}>Term-2 Tuition & Transport Fee of <strong>₹24,500</strong> received with thanks.</p>
                  <div className="wa-pdf-btn">
                    <span>📄 Receipt_XAV_9281.pdf</span>
                    <Download className="h-3.5 w-3.5" style={{ marginLeft: 'auto' }} />
                  </div>
                  <div className="wa-time">11:30 AM · Delivered ✓✓</div>
                </div>

                {/* Message 3: Exam Marksheet */}
                <div className="wa-bubble school-alert">
                  <strong>Periodic Test-II Result Published 🏆</strong>
                  <p style={{ margin: '4px 0' }}>Rahul has secured <strong>Grade A+ (94.2%)</strong>. View comprehensive progress card below:</p>
                  <div className="wa-pdf-btn">
                    <span>📊 Holistic_Progress_Card.pdf</span>
                    <Download className="h-3.5 w-3.5" style={{ marginLeft: 'auto' }} />
                  </div>
                  <div className="wa-time">02:15 PM · Delivered ✓✓</div>
                </div>
              </div>
            </div>

            {/* Right: Copy */}
            <div className="showcase-content">
              <span className="showcase-badge" style={{ backgroundColor: '#dcfce7', color: '#15803d' }}>
                <MessageCircle className="h-3.5 w-3.5" /> Official WhatsApp Business API
              </span>
              <h2 className="showcase-title">WhatsApp For Education: 98% Parent Engagement</h2>
              <p className="showcase-desc">
                Reach parents where they actually read messages. Deliver automated fee receipts, attendance gate alerts, homework circulars, and instant UPI payment links directly on WhatsApp.
              </p>

              <ul className="showcase-checklist">
                <li className="showcase-check-item">
                  <span className="check-icon-circle"><Check className="h-3.5 w-3.5" /></span>
                  <div>
                    <strong>Instant Fee Receipts & Payment Links:</strong> Send interactive WhatsApp messages with one-click UPI/GPay payment buttons, improving fee collection by 45%.
                  </div>
                </li>
                <li className="showcase-check-item">
                  <span className="check-icon-circle"><Check className="h-3.5 w-3.5" /></span>
                  <div>
                    <strong>Direct PDF Marksheet Delivery:</strong> Deliver NEP 2020 Holistic Progress Cards and report cards right to the parent's WhatsApp chat without app download hassles.
                  </div>
                </li>
                <li className="showcase-check-item">
                  <span className="check-icon-circle"><Check className="h-3.5 w-3.5" /></span>
                  <div>
                    <strong>Verified Green Badge Identity:</strong> Built on official Meta Cloud API with end-to-end encryption, compliant with school privacy regulations.
                  </div>
                </li>
              </ul>

              <div>
                <button onClick={() => setDemoModalOpen(true)} className="btn btn-primary">
                  See WhatsApp Demo <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================
          10. NEW FEATURE SHOWCASE 4: SMART CLASSROOM & HOLISTIC PROGRESS CARD
          =================================================== */}
      <section id="holistic-card" className="feature-showcase-section bg-light">
        <div className="container">
          <div className="showcase-grid showcase-reverse">
            {/* Right on desktop: Smart Classroom Professional Photo */}
            <div className="showcase-img-container">
              <img src={smartClassroomImg} alt="Indian teacher teaching on interactive digital smartboard in modern classroom" className="showcase-img" />
              <div className="showcase-telemetry-badge">
                <div className="telemetry-left">
                  <div className="telemetry-dot"></div>
                  <div>
                    <div className="telemetry-title">Smart Classroom 10-B · Mathematics</div>
                    <div className="telemetry-sub">Digital Board Connected · 38/38 Active Students</div>
                  </div>
                </div>
                <span className="telemetry-tag" style={{ backgroundColor: '#f3e8ff', color: '#7e22ce' }}>NEP 2020 READY</span>
              </div>
            </div>

            {/* Left: Features */}
            <div className="showcase-content">
              <span className="showcase-badge" style={{ backgroundColor: '#f3e8ff', color: '#7e22ce' }}>
                <TrendingUp className="h-3.5 w-3.5" /> NEP 2020 & CBSE Compliant
              </span>
              <h2 className="showcase-title">Holistic Progress Card (HPC) & Digital Learning</h2>
              <p className="showcase-desc">
                Move beyond rote memorization. Implement the Government of India's NEP 2020 multidimensional assessment framework tracking cognitive, socio-emotional, and psychomotor competencies.
              </p>

              <ul className="showcase-checklist">
                <li className="showcase-check-item">
                  <span className="check-icon-circle"><Check className="h-3.5 w-3.5" /></span>
                  <div>
                    <strong>360-Degree Evaluation Rubrics:</strong> Combine teacher ratings, self-assessments, peer feedback, and project portfolios in one beautiful report.
                  </div>
                </li>
                <li className="showcase-check-item">
                  <span className="check-icon-circle"><Check className="h-3.5 w-3.5" /></span>
                  <div>
                    <strong>Built-in LMS & Smart Homework:</strong> Teachers upload digital lessons, worksheets, video tutorials, and collect homework submissions online.
                  </div>
                </li>
                <li className="showcase-check-item">
                  <span className="check-icon-circle"><Check className="h-3.5 w-3.5" /></span>
                  <div>
                    <strong>CBSE Automated Grade Computation:</strong> One-click conversion from marks to percentile, grade bands, co-curricular rubrics, and printable marksheet templates.
                  </div>
                </li>
              </ul>

              <div>
                <button onClick={() => setDemoModalOpen(true)} className="btn btn-primary">
                  Download Sample HPC Report <Download className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================
          11. NEW FEATURE SHOWCASE 5: EXECUTIVE BI ANALYTICS FOR PRINCIPALS
          =================================================== */}
      <section id="admin" className="feature-showcase-section bg-white">
        <div className="container">
          <div className="showcase-grid">
            {/* Left: Principal Office Professional Photo */}
            <div className="showcase-img-container">
              <img src={principalOfficeImg} alt="Indian school principal seated in executive office reviewing analytics on laptop" className="showcase-img" />
              <div className="showcase-telemetry-badge">
                <div className="telemetry-left">
                  <div className="telemetry-dot"></div>
                  <div>
                    <div className="telemetry-title">Executive Console · Principal's Desk</div>
                    <div className="telemetry-sub">Branch 1 & Branch 2 · Academic Session 2026-27</div>
                  </div>
                </div>
                <span className="telemetry-tag" style={{ backgroundColor: '#ecfdf5', color: '#047857' }}>ALL CAMPUSES SYNCED</span>
              </div>
            </div>

            {/* Right: Executive Highlights */}
            <div className="showcase-content">
              <span className="showcase-badge" style={{ backgroundColor: '#fef3c7', color: '#b45309' }}>
                <BarChart3 className="h-3.5 w-3.5" /> Executive Decision Making
              </span>
              <h2 className="showcase-title">Empowering Principals with Strategic Data</h2>
              <p className="showcase-desc">
                No more waiting days for administrative staff to compile Excel spreadsheets. Review admissions pipelines, fee recovery forecasts, teacher workloads, and board exam trends in seconds.
              </p>

              <ul className="showcase-checklist">
                <li className="showcase-check-item">
                  <span className="check-icon-circle"><Check className="h-3.5 w-3.5" /></span>
                  <div>
                    <strong>Multi-Branch Governance:</strong> Manage multiple school campuses, franchises, or junior colleges under a single unified leadership dashboard.
                  </div>
                </li>
                <li className="showcase-check-item">
                  <span className="check-icon-circle"><Check className="h-3.5 w-3.5" /></span>
                  <div>
                    <strong>Predictive Fee Recovery:</strong> Automated tracking of overdue fee installments, scholarship concessions, and cash flow projections.
                  </div>
                </li>
                <li className="showcase-check-item">
                  <span className="check-icon-circle"><Check className="h-3.5 w-3.5" /></span>
                  <div>
                    <strong>Staff Performance & Syllabus Tracking:</strong> Monitor chapter completion, student pass rates, teacher leave frequencies, and timetable substitutions.
                  </div>
                </li>
              </ul>

              <div>
                <button onClick={() => setDemoModalOpen(true)} className="btn btn-blue">
                  Schedule Principal Consultation <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================
          12. MOBILE APPS ECOSYSTEM (4 SMARTPHONES)
          =================================================== */}
      <section id="mobile-apps" className="section-padding mobile-ecosystem-section">
        <div className="container">
          <div className="mobile-grid">
            {/* Left copy & store buttons */}
            <div>
              <span className="section-badge section-badge-purple">Stay Connected Always</span>
              <h2 className="section-title">A Complete Ecosystem of Mobile Apps</h2>
              <p className="section-subtitle" style={{ marginLeft: 0, marginBottom: '24px' }}>
                Dedicated native applications designed specifically for Administrators, Teachers, Parents and Students to stay informed and connected in real-time.
              </p>

              <div className="app-store-badges">
                <a href="#mobile-apps" className="store-badge">
                  <span style={{ fontSize: '20px' }}>▶</span>
                  <div className="store-badge-text">
                    <small>Get it on</small>
                    <strong>Google Play</strong>
                  </div>
                </a>
                <a href="#mobile-apps" className="store-badge">
                  <span style={{ fontSize: '20px' }}></span>
                  <div className="store-badge-text">
                    <small>Download on the</small>
                    <strong>App Store</strong>
                  </div>
                </a>
              </div>
            </div>

            {/* Right: 4 realistic smartphone mockups */}
            <div className="phone-mockups-row">
              {/* 1. Admin App */}
              <div className="phone-card">
                <div className="phone-chassis">
                  <div className="phone-notch"></div>
                  <div className="phone-screen-header" style={{ backgroundColor: '#2563eb' }}>
                    EduBliq Admin
                  </div>
                  <div className="phone-screen-body">
                    <div className="phone-mini-item">📊 Dashboard</div>
                    <div className="phone-mini-item">👨‍🎓 Students (1,240)</div>
                    <div className="phone-mini-item">💰 Fee Collected</div>
                    <div className="phone-mini-item">📅 Attendance 96%</div>
                    <div className="phone-mini-item">📑 Reports</div>
                  </div>
                </div>
                <span className="phone-label">Admin App</span>
              </div>

              {/* 2. Teacher App */}
              <div className="phone-card">
                <div className="phone-chassis">
                  <div className="phone-notch"></div>
                  <div className="phone-screen-header" style={{ backgroundColor: '#4f46e5' }}>
                    Teacher Portal
                  </div>
                  <div className="phone-screen-body">
                    <div className="phone-mini-item">🏫 My Classes (5)</div>
                    <div className="phone-mini-item">✓ Take Attendance</div>
                    <div className="phone-mini-item">📝 Homework</div>
                    <div className="phone-mini-item">🏆 Exam Marks</div>
                    <div className="phone-mini-item">💬 Parent Chat</div>
                  </div>
                </div>
                <span className="phone-label">Teacher App</span>
              </div>

              {/* 3. Parent App */}
              <div className="phone-card">
                <div className="phone-chassis">
                  <div className="phone-notch"></div>
                  <div className="phone-screen-header" style={{ backgroundColor: '#059669' }}>
                    Parent App
                  </div>
                  <div className="phone-screen-body">
                    <div className="phone-mini-item">👦 Child Profile</div>
                    <div className="phone-mini-item">✓ Attendance: 98%</div>
                    <div className="phone-mini-item">💳 Pay Fees Online</div>
                    <div className="phone-mini-item">📚 Homework Tasks</div>
                    <div className="phone-mini-item">🚌 Bus Location</div>
                  </div>
                </div>
                <span className="phone-label">Parent App</span>
              </div>

              {/* 4. Student App */}
              <div className="phone-card">
                <div className="phone-chassis">
                  <div className="phone-notch"></div>
                  <div className="phone-screen-header" style={{ backgroundColor: '#ea580c' }}>
                    Student Portal
                  </div>
                  <div className="phone-screen-body">
                    <div className="phone-mini-item">📖 Daily Schedule</div>
                    <div className="phone-mini-item">📝 Assignments</div>
                    <div className="phone-mini-item">📊 My Report Card</div>
                    <div className="phone-mini-item">💻 Live Classes</div>
                    <div className="phone-mini-item">⏰ Timetable</div>
                  </div>
                </div>
                <span className="phone-label">Student App</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================
          13. STATS & METRICS BAR (5 METRICS)
          =================================================== */}
      <section className="stats-bar-section">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-icon-circle" style={{ backgroundColor: '#eff6ff', color: '#2563eb' }}>
                <MessageSquare className="h-5 w-5" />
              </div>
              <div>
                <div className="stat-number">50M+</div>
                <div className="stat-desc">Messages Delivered</div>
              </div>
            </div>

            <div className="stat-item">
              <div className="stat-icon-circle" style={{ backgroundColor: '#f0fdf4', color: '#16a34a' }}>
                <Users className="h-5 w-5" />
              </div>
              <div>
                <div className="stat-number">5L+</div>
                <div className="stat-desc">Students Managed</div>
              </div>
            </div>

            <div className="stat-item">
              <div className="stat-icon-circle" style={{ backgroundColor: '#fef2f2', color: '#dc2626' }}>
                <UserCheck className="h-5 w-5" />
              </div>
              <div>
                <div className="stat-number">20K+</div>
                <div className="stat-desc">Teachers Connected</div>
              </div>
            </div>

            <div className="stat-item">
              <div className="stat-icon-circle" style={{ backgroundColor: '#f0fdfa', color: '#0d9488' }}>
                <CreditCard className="h-5 w-5" />
              </div>
              <div>
                <div className="stat-number">30L+</div>
                <div className="stat-desc">Payments Processed</div>
              </div>
            </div>

            <div className="stat-item">
              <div className="stat-icon-circle" style={{ backgroundColor: '#fffbeb', color: '#d97706' }}>
                <Calendar className="h-5 w-5" />
              </div>
              <div>
                <div className="stat-number">60L+</div>
                <div className="stat-desc">Attendance Records</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================
          14. WHY SCHOOLS CHOOSE EDUSYNC / EDUSYNC PILLARS
          =================================================== */}
      <section id="why-choose" className="section-padding why-choose-section">
        <div className="container">
          <div className="why-choose-grid">
            {/* Left: Indian Student Photo with Badge */}
            <div className="why-choose-photo-wrapper">
              <div className="why-photo-box">
                <img src={studentBoyImg} alt="Indian School Student" />
              </div>
              <div className="why-floating-badge">
                <span style={{ fontSize: '24px' }}>🏛️</span>
                <div>
                  <div style={{ fontWeight: '800', fontSize: '13px', color: '#0f172a' }}>Trusted by 1,100+ Schools</div>
                  <div style={{ fontSize: '11px', color: '#64748b' }}>Across CBSE, ICSE & State Boards</div>
                </div>
              </div>
            </div>

            {/* Right: Pillars Grid */}
            <div>
              <span className="section-badge">Why Choose EduBliq</span>
              <h2 className="section-title">Built for Schools. Loved by Everyone.</h2>
              <p className="section-subtitle" style={{ marginLeft: 0 }}>
                Every single screen is designed with simplicity and reliability in mind, ensuring your staff can easily operate the platform without technical headaches.
              </p>

              <div className="why-pillars-grid">
                <div className="pillar-card">
                  <div className="pillar-icon-box" style={{ backgroundColor: '#f3e8ff', color: '#9333ea' }}>
                    <Smile className="h-5 w-5" />
                  </div>
                  <h3 className="pillar-title">User-Friendly</h3>
                  <p className="pillar-desc">Intuitive, clean workflows that any teacher or staff member can master in minutes.</p>
                </div>

                <div className="pillar-card">
                  <div className="pillar-icon-box" style={{ backgroundColor: '#e0f2fe', color: '#0284c7' }}>
                    <Sliders className="h-5 w-5" />
                  </div>
                  <h3 className="pillar-title">Customizable</h3>
                  <p className="pillar-desc">Adapt fee structures, grading systems and admission forms to your school's unique rules.</p>
                </div>

                <div className="pillar-card">
                  <div className="pillar-icon-box" style={{ backgroundColor: '#dbeafe', color: '#2563eb' }}>
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                  <h3 className="pillar-title">Secure & Reliable</h3>
                  <p className="pillar-desc">Enterprise 256-bit encryption, role-based access control and high-uptime cloud servers.</p>
                </div>

                <div className="pillar-card">
                  <div className="pillar-icon-box" style={{ backgroundColor: '#dcfce7', color: '#16a34a' }}>
                    <Headphones className="h-5 w-5" />
                  </div>
                  <h3 className="pillar-title">Dedicated Support</h3>
                  <p className="pillar-desc">Comprehensive on-site and remote training with dedicated account managers and 24/7 help.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================
          15. TESTIMONIALS (WHAT SCHOOL LEADERS SAY)
          =================================================== */}
      <section className="section-padding testimonials-section">
        <div className="container">
          <div style={{ textAlign: 'center' }}>
            <span className="section-badge section-badge-purple">Trusted by School Leaders</span>
            <h2 className="section-title">What School Leaders Say</h2>
            <p className="section-subtitle">
              Hear directly from principals, directors and administrators across top institutions in India.
            </p>
          </div>

          <div className="testimonials-grid">
            {testimonials.map((t, idx) => (
              <div key={idx} className="testimonial-card">
                <div>
                  <div className="stars-row">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4" fill="#f59e0b" color="#f59e0b" />
                    ))}
                  </div>
                  <p className="testi-quote">"{t.quote}"</p>
                </div>
                <div className="testi-author">
                  <img src={t.avatar} alt={t.name} className="testi-avatar" />
                  <div>
                    <h4 className="author-name">{t.name}</h4>
                    <p className="author-role">{t.role} · {t.school}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===================================================
          16. TRANSPARENT PRICING PLANS (BASIC & PREMIUM)
          =================================================== */}
      <section id="pricing" className="section-padding landing-pricing-section">
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '780px', margin: '0 auto 48px' }}>
            <span className="section-badge section-badge-green">Transparent Annual Pricing</span>
            <h2 className="section-title">Simple, Predictable Plans for Every School</h2>
            <p className="section-subtitle">
              Get full cloud access with 365-day hosting, dedicated support, and zero hidden setup charges. Choose your plan and activate in under 5 minutes.
            </p>
          </div>

          <div className="landing-pricing-grid">
            {/* 1. Basic Plan Card */}
            <div className="landing-plan-card">
              <span className="landing-plan-badge standard-badge">Essential School ERP</span>
              
              <div style={{ marginBottom: '20px' }}>
                <h3 style={{ fontSize: '1.4rem', fontWeight: '800', color: '#0f172a', marginBottom: '8px' }}>Basic Plan</h3>
                <p style={{ fontSize: '0.85rem', color: '#64748b', lineHeight: '1.5' }}>
                  Core student administration, daily attendance, gradebook, and manual fee receipts for growing schools.
                </p>
              </div>

              <div style={{ padding: '20px 0', borderTop: '1px solid #f1f5f9', borderBottom: '1px solid #f1f5f9', marginBottom: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                  <span style={{ fontSize: '2.8rem', fontWeight: '800', color: '#0f172a', letterSpacing: '-0.03em' }}>₹1,999</span>
                  <span style={{ fontSize: '1rem', color: '#64748b', fontWeight: '600' }}>/ year</span>
                </div>
                <div style={{ fontSize: '12px', color: '#16a34a', fontWeight: '700', marginTop: '6px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <CheckCircle2 className="h-3.5 w-3.5" /> 365 Days Cloud Hosting & Support Included
                </div>
              </div>

              <button
                onClick={() => navigateTo('checkout', 'basic')}
                className="btn btn-secondary btn-lg"
                style={{ width: '100%', padding: '14px', marginBottom: '28px', fontSize: '0.95rem', fontWeight: '800', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
              >
                Buy Basic Plan — ₹1,999/yr <ArrowRight className="h-4 w-4" />
              </button>

              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '12px', fontWeight: '800', color: '#334155', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '14px' }}>
                  What's Included:
                </div>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {[
                    'Central Student 360° Profile & Document Archive',
                    'Daily Period-wise & Class-wise Attendance',
                    'Manual Fee Collection & Automated PDF Receipts',
                    'Exam Management & CBSE Marks Entry',
                    'Class-wise Homework & Circular Notices',
                    'Standard School Calendar & Event Scheduler',
                    'Single Campus License & Role-Based Access'
                  ].map((feat, idx) => (
                    <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '0.85rem', color: '#334155', lineHeight: '1.4' }}>
                      <Check className="h-4 w-4 text-emerald-600" style={{ flexShrink: 0, marginTop: '2px' }} />
                      <span>{feat}</span>
                    </li>
                  ))}
                  {[
                    'WhatsApp Official Meta API Alerts',
                    'Online Fee Gateway (0% UPI/Cards)',
                    '4 Native Mobile Apps (iOS/Android)',
                    'Biometric & RFID Turnstiles',
                    'Live GPS School Bus Fleet Tracking'
                  ].map((feat, idx) => (
                    <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '0.82rem', color: '#94a3b8', lineHeight: '1.4', opacity: 0.65 }}>
                      <X className="h-4 w-4 text-slate-300" style={{ flexShrink: 0, marginTop: '2px' }} />
                      <span style={{ textDecoration: 'line-through' }}>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* 2. Premium Plan Card */}
            <div className="landing-plan-card featured">
              <span className="landing-plan-badge popular-badge">RECOMMENDED • ALL-IN-ONE</span>
              
              <div style={{ marginBottom: '20px' }}>
                <h3 style={{ fontSize: '1.4rem', fontWeight: '800', color: '#1d4ed8', marginBottom: '8px' }}>Premium Plan</h3>
                <p style={{ fontSize: '0.85rem', color: '#64748b', lineHeight: '1.5' }}>
                  Complete high-tech automation with WhatsApp alerts, 4 mobile apps, GPS bus tracking, biometric hardware & NEP 2020 cards.
                </p>
              </div>

              <div style={{ padding: '20px 0', borderTop: '1px solid #eff6ff', borderBottom: '1px solid #eff6ff', marginBottom: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                  <span style={{ fontSize: '2.8rem', fontWeight: '800', color: '#1d4ed8', letterSpacing: '-0.03em' }}>₹2,999</span>
                  <span style={{ fontSize: '1rem', color: '#64748b', fontWeight: '600' }}>/ year</span>
                </div>
                <div style={{ fontSize: '12px', color: '#2563eb', fontWeight: '700', marginTop: '6px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <Sparkles className="h-3.5 w-3.5" /> Full Automation & Official Meta WhatsApp Included
                </div>
              </div>

              <button
                onClick={() => navigateTo('checkout', 'premium')}
                className="btn btn-primary btn-lg"
                style={{ width: '100%', padding: '14px', marginBottom: '28px', fontSize: '0.95rem', fontWeight: '800', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', background: 'linear-gradient(135deg, #1d4ed8 0%, #2563eb 100%)', boxShadow: '0 4px 14px rgba(37, 99, 235, 0.35)' }}
              >
                Buy Premium Plan — ₹2,999/yr <ArrowRight className="h-4 w-4" />
              </button>

              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '12px', fontWeight: '800', color: '#1d4ed8', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '14px' }}>
                  Everything in Basic, Plus:
                </div>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {[
                    'Official Meta WhatsApp Business API Messaging',
                    'Online Fee Gateway (0% UPI, QR Code, Netbanking & Cards)',
                    '4 Native Mobile Apps (Admin, Teachers, Parents, Students)',
                    'NEP 2020 Holistic Progress Card (HPC) 360° Reports',
                    'Real-time GPS School Bus Fleet Tracking on Live Map',
                    'Biometric Fingerprint & RFID Turnstile Gate Sync',
                    'Staff HRMS, Payroll & Salary Slips Generator',
                    'Library Barcode Scanner & Book Circulation',
                    'Hostel & Boarding Room/Mess Management',
                    'Dedicated 24/7 Priority Relationship Manager'
                  ].map((feat, idx) => (
                    <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '0.85rem', color: '#1e293b', lineHeight: '1.4' }}>
                      <Check className="h-4 w-4 text-emerald-600" style={{ flexShrink: 0, marginTop: '2px' }} />
                      <strong style={{ fontWeight: '600' }}>{feat}</strong>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Full comparison CTA banner */}
          <div style={{ marginTop: '40px', backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '24px', maxWidth: '980px', margin: '40px auto 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontWeight: '800', fontSize: '1.05rem', color: '#0f172a' }}>Want a detailed feature-by-feature breakdown?</div>
              <div style={{ fontSize: '0.85rem', color: '#64748b' }}>Explore all 50+ capabilities, SLAs, and migration support in our comprehensive matrix.</div>
            </div>
            <button 
              onClick={() => navigateTo('plans')}
              className="btn btn-secondary"
              style={{ fontWeight: '700' }}
            >
              Compare All Features On Plans Page →
            </button>
          </div>
        </div>
      </section>

      {/* ===================================================
          17. FAQ SECTION
          =================================================== */}
      <section id="faq" className="section-padding faq-section">
        <div className="container">
          <div className="faq-grid">
            {/* Left intro */}
            <div>
              <span className="section-badge">Frequently Asked Questions</span>
              <h2 className="section-title">Have Questions? We've Got Answers.</h2>
              <p className="section-subtitle" style={{ marginLeft: 0, marginBottom: '24px' }}>
                Find clear answers to common questions about EduBliq, implementation timelines, security and migration.
              </p>
              <button 
                onClick={() => setDemoModalOpen(true)}
                className="btn btn-secondary"
              >
                View All FAQs <ArrowRight className="h-4 w-4" />
              </button>
            </div>

            {/* Right accordion list */}
            <div className="faq-list">
              {faqs.map((faq, index) => {
                const isOpen = activeFaq === index;
                return (
                  <div key={index} className={`faq-item ${isOpen ? 'open' : ''}`}>
                    <button 
                      onClick={() => setActiveFaq(isOpen ? -1 : index)}
                      className="faq-question-btn"
                    >
                      <span>{faq.q}</span>
                      <span className="faq-icon-toggle">
                        {isOpen ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                      </span>
                    </button>
                    {isOpen && (
                      <div className="faq-answer">
                        <p>{faq.a}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================
          18. FINAL CTA BANNER (CAMPUS BACKDROP)
          =================================================== */}
      <section id="final-cta" className="final-cta-section">
        <img src={campusImg} alt="School Campus" className="cta-campus-bg" />
        <div className="cta-dark-overlay"></div>
        <div className="container">
          <div className="final-cta-content">
            <h2 className="cta-title">Ready to Transform Your School?</h2>
            <p className="cta-subtext">
              Join 1,100+ schools already using EduBliq to save hundreds of administrative hours, automate fee collections, live track buses, and deliver a modern learning experience.
            </p>
            <div className="cta-buttons-row">
              <button 
                onClick={() => setDemoModalOpen(true)}
                className="btn btn-primary btn-lg"
                style={{ backgroundColor: '#ffffff', color: '#0b132b' }}
              >
                Request Demo <ArrowRight className="h-4 w-4" />
              </button>
              <button 
                onClick={() => setTrialModalOpen(true)}
                className="btn btn-secondary btn-lg"
                style={{ backgroundColor: 'transparent', color: '#ffffff', borderColor: 'rgba(255,255,255,0.3)' }}
              >
                Start 14 Days Trial
              </button>
            </div>

            {/* Avatar Cluster */}
            <div className="cta-trust-cluster">
              <div className="trust-avatar-stack">
                <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80" alt="Leader" className="trust-avatar" />
                <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80" alt="Leader" className="trust-avatar" />
                <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80" alt="Leader" className="trust-avatar" />
              </div>
              <span style={{ fontSize: '13px', color: '#cbd5e1', fontWeight: '500' }}>
                Trusted by 1,100+ Schools Across India
              </span>
            </div>
          </div>
        </div>
      </section>
        </>
      )}

      {/* ===================================================
          18. MULTI-COLUMN FOOTER (Only on Public Marketing Pages)
          =================================================== */}
      {currentPage !== 'portal' && currentPage !== 'login' && (
        <>
          <footer id="contact" className="site-footer">
        <div className="container">
          <div className="footer-top-grid">
            {/* Col 1: Brand */}
            <div>
              <a 
                href="#home" 
                onClick={(e) => { e.preventDefault(); navigateTo('home'); }} 
                className="nav-brand" 
                style={{ marginBottom: '14px', display: 'inline-flex' }}
              >
                <div className="brand-icon-box">
                  <GraduationCap className="h-5 w-5" />
                </div>
                <span className="brand-title">Edu<span>Bliq</span></span>
              </a>
              <p style={{ color: '#64748b', fontSize: '0.85rem', lineHeight: '1.6', marginBottom: '18px' }}>
                A modern School Management System built to simplify school operations, automate finances, track transport and improve learning outcomes.
              </p>
              <div className="social-icons-row">
                <a href="#contact" className="social-icon-btn" aria-label="LinkedIn">in</a>
                <a href="#contact" className="social-icon-btn" aria-label="Twitter">𝕏</a>
                <a href="#contact" className="social-icon-btn" aria-label="Instagram">ig</a>
                <a href="#contact" className="social-icon-btn" aria-label="YouTube">yt</a>
              </div>
            </div>

            {/* Col 2: Product */}
            <div>
              <h4 className="footer-col-title">Product</h4>
              <ul className="footer-links-list">
                <li>
                  <a 
                    href="#school-erp" 
                    onClick={(e) => { e.preventDefault(); navigateTo('school-erp'); }} 
                    className="footer-link" 
                  >
                    School ERP
                  </a>
                </li>
                <li>
                  <a 
                    href="#plans" 
                    onClick={(e) => { e.preventDefault(); navigateTo('plans'); }} 
                    className="footer-link" 
                    style={{ fontWeight: '700', color: '#2563eb' }}
                  >
                    Plans (Basic to Enterprise) →
                  </a>
                </li>
                <li>
                  <a 
                    href="#why-unique" 
                    onClick={(e) => { e.preventDefault(); navigateTo('unique'); }} 
                    className="footer-link" 
                  >
                    How is EduBliq unique!
                  </a>
                </li>
                <li><a href="#biometric" onClick={(e) => { if(currentPage !== 'home') { e.preventDefault(); navigateTo('home', 'biometric'); } }} className="footer-link">Biometric Attendance</a></li>
                <li><a href="#bus-tracking" onClick={(e) => { if(currentPage !== 'home') { e.preventDefault(); navigateTo('home', 'bus-tracking'); } }} className="footer-link">Bus Tracking System</a></li>
                <li><a href="#whatsapp" onClick={(e) => { if(currentPage !== 'home') { e.preventDefault(); navigateTo('home', 'whatsapp'); } }} className="footer-link">WhatsApp for Education</a></li>
                <li><a href="#holistic-card" onClick={(e) => { if(currentPage !== 'home') { e.preventDefault(); navigateTo('home', 'holistic-card'); } }} className="footer-link">Holistic Progress Card</a></li>
                <li><a href="#mobile-apps" onClick={(e) => { if(currentPage !== 'home') { e.preventDefault(); navigateTo('home', 'mobile-apps'); } }} className="footer-link">Mobile Apps</a></li>
              </ul>
            </div>

            {/* Col 3: Company */}
            <div>
              <h4 className="footer-col-title">Company</h4>
              <ul className="footer-links-list">
                <li>
                  <a 
                    href="#about-story" 
                    onClick={(e) => { e.preventDefault(); navigateTo('about', 'story'); }} 
                    className="footer-link"
                  >
                    About Us & Story
                  </a>
                </li>
                <li>
                  <a 
                    href="#about-leadership" 
                    onClick={(e) => { e.preventDefault(); navigateTo('about', 'leadership'); }} 
                    className="footer-link"
                  >
                    Our Leadership & Advisors
                  </a>
                </li>
                <li>
                  <a 
                    href="#about-values" 
                    onClick={(e) => { e.preventDefault(); navigateTo('about', 'values'); }} 
                    className="footer-link"
                  >
                    Core Values & Security
                  </a>
                </li>
                <li>
                  <a 
                    href="#about-careers" 
                    onClick={(e) => { e.preventDefault(); navigateTo('about', 'careers'); }} 
                    className="footer-link"
                  >
                    Careers at EduBliq
                  </a>
                </li>
                <li>
                  <a 
                    href="#about-contact" 
                    onClick={(e) => { e.preventDefault(); navigateTo('about', 'contact'); }} 
                    className="footer-link"
                  >
                    Contact & Regional Offices
                  </a>
                </li>
              </ul>
            </div>

            {/* Col 4: Resources */}
            <div>
              <h4 className="footer-col-title">Resources</h4>
              <ul className="footer-links-list">
                <li><a href="#faq" className="footer-link">School Blog</a></li>
                <li><a href="#faq" className="footer-link">Help Center</a></li>
                <li><a href="#modules" className="footer-link">Brochure PDF</a></li>
                <li><a href="#about" className="footer-link">Case Studies</a></li>
                <li><a href="#faq" className="footer-link">FAQ & Guides</a></li>
              </ul>
            </div>

            {/* Col 5: Newsletter */}
            <div>
              <h4 className="footer-col-title">Subscribe to Newsletter</h4>
              <p style={{ color: '#64748b', fontSize: '0.8125rem', marginBottom: '10px' }}>
                Get the latest school management trends, CBSE/ICSE updates and product news.
              </p>
              <form onSubmit={handleNewsletterSubmit} className="footer-newsletter-form">
                <input 
                  type="email" 
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="Enter school email" 
                  required
                  className="newsletter-input" 
                />
                <button type="submit" className="btn btn-blue btn-sm">
                  <Send className="h-3.5 w-3.5" />
                </button>
              </form>
              {newsletterSubmitted && (
                <p style={{ color: '#16a34a', fontSize: '11px', marginTop: '6px' }}>✓ Thank you for subscribing!</p>
              )}
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="footer-bottom-bar">
            <div>
              © 2026 EduBliq. All rights reserved. Built for Indian Schools & Institutions.
            </div>
            <div className="footer-legal-links">
              <a href="#contact" className="footer-link">Privacy Policy</a>
              <a href="#contact" className="footer-link">Terms & Conditions</a>
              <a href="#contact" className="footer-link">Sitemap</a>
            </div>
          </div>
        </div>
      </footer>

      {/* ===================================================
          19. FLOATING ACTION BUTTONS (PHONE & WHATSAPP)
          =================================================== */}
      <div className="floating-contact-panel">
        {/* Call Button */}
        <button 
          onClick={() => setCallModalOpen(true)}
          className="float-action-btn float-call-btn"
          aria-label="Call for School Consultation"
          title="Instant Call with School Expert"
        >
          <PhoneCall className="h-5 w-5" />
        </button>

        {/* WhatsApp Button */}
        <button 
          onClick={() => {
            setDemoForm(prev => ({ ...prev, role: 'WhatsApp Direct Enquiry' }));
            setDemoModalOpen(true);
          }}
          className="float-action-btn float-whatsapp-btn"
          aria-label="WhatsApp School Support"
          title="Chat with EduBliq Consultant"
        >
          <MessageCircle className="h-6 w-6" />
          <span className="float-badge-pulse"></span>
        </button>
      </div>
      </>
      )}

      {/* ===================================================
          20. MODAL: REQUEST DEMO
          =================================================== */}
      {demoModalOpen && (
        <div className="modal-overlay" onClick={() => setDemoModalOpen(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={() => setDemoModalOpen(false)}>
              <X className="h-5 w-5" />
            </button>

            {demoSubmitted ? (
              <div style={{ textAlign: 'center', padding: '30px 10px' }}>
                <div style={{ width: '56px', height: '56px', borderRadius: '50%', backgroundColor: '#dcfce7', color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontSize: '24px' }}>
                  ✓
                </div>
                <h3 style={{ fontSize: '1.4rem', fontWeight: '800', color: '#0f172a', marginBottom: '8px' }}>Demo Request Received!</h3>
                <p style={{ color: '#64748b', fontSize: '0.875rem', lineHeight: '1.5' }}>
                  Thank you! Our school implementation specialist will contact you within 24 hours to schedule an interactive walkthrough.
                </p>
              </div>
            ) : (
              <>
                <div style={{ marginBottom: '20px' }}>
                  <span className="section-badge">Live Demonstration</span>
                  <h3 style={{ fontSize: '1.35rem', fontWeight: '800', color: '#0f172a' }}>Request a Personalized Demo</h3>
                  <p style={{ fontSize: '0.8125rem', color: '#64748b' }}>
                    See how EduBliq can streamline your school's specific workflows across admissions, fees, RFID, and bus tracking.
                  </p>
                </div>

                <form onSubmit={handleDemoSubmit}>
                  <div className="form-group">
                    <label className="form-label">Your Name</label>
                    <input 
                      type="text" 
                      required 
                      value={demoForm.name}
                      onChange={(e) => setDemoForm({...demoForm, name: e.target.value})}
                      placeholder="e.g. Dr. Ramesh Gupta" 
                      className="form-input" 
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">School / Institution Name</label>
                    <input 
                      type="text" 
                      required 
                      value={demoForm.schoolName}
                      onChange={(e) => setDemoForm({...demoForm, schoolName: e.target.value})}
                      placeholder="e.g. Heritage International School, Bengaluru" 
                      className="form-input" 
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <div className="form-group">
                      <label className="form-label">Email Address</label>
                      <input 
                        type="email" 
                        required 
                        value={demoForm.email}
                        onChange={(e) => setDemoForm({...demoForm, email: e.target.value})}
                        placeholder="principal@school.edu" 
                        className="form-input" 
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Mobile Number</label>
                      <input 
                        type="tel" 
                        required 
                        value={demoForm.phone}
                        onChange={(e) => setDemoForm({...demoForm, phone: e.target.value})}
                        placeholder="+91 98765 43210" 
                        className="form-input" 
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <div className="form-group">
                      <label className="form-label">Student Strength</label>
                      <select 
                        value={demoForm.studentCount}
                        onChange={(e) => setDemoForm({...demoForm, studentCount: e.target.value})}
                        className="form-select"
                      >
                        <option value="Under 250">Under 250 Students</option>
                        <option value="250-500">250 - 500 Students</option>
                        <option value="500-1000">500 - 1,000 Students</option>
                        <option value="1000-2500">1,000 - 2,500 Students</option>
                        <option value="2500+">2,500+ Students</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Your Role</label>
                      <select 
                        value={demoForm.role}
                        onChange={(e) => setDemoForm({...demoForm, role: e.target.value})}
                        className="form-select"
                      >
                        <option value="Principal / Management">Principal / Director</option>
                        <option value="Administrator">Administrator / Registrar</option>
                        <option value="Trustee / Owner">Trustee / Owner</option>
                        <option value="Teacher / Faculty">Teacher / Faculty</option>
                        <option value="IT Head">IT / Systems Head</option>
                      </select>
                    </div>
                  </div>

                  <button 
                    type="submit" 
                    className="btn btn-primary" 
                    style={{ width: '100%', marginTop: '10px', padding: '12px' }}
                  >
                    Confirm & Schedule Demo
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}

      {/* ===================================================
          21. MODAL: CALL CONSULTATION
          =================================================== */}
      {callModalOpen && (
        <div className="modal-overlay" onClick={() => setCallModalOpen(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={() => setCallModalOpen(false)}>
              <X className="h-5 w-5" />
            </button>

            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <div style={{ width: '50px', height: '50px', borderRadius: '50%', backgroundColor: '#dcfce7', color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
                <PhoneCall className="h-6 w-6" />
              </div>
              <h3 style={{ fontSize: '1.35rem', fontWeight: '800', color: '#0f172a' }}>Direct School Consultation</h3>
              <p style={{ fontSize: '0.8125rem', color: '#64748b' }}>
                Speak directly with an EduBliq Senior Education Technology Advisor.
              </p>
            </div>

            <div style={{ backgroundColor: '#f8fafc', padding: '16px', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '18px', textAlign: 'center' }}>
              <div style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', fontWeight: '700' }}>Toll-Free School Helpline</div>
              <div style={{ fontSize: '1.4rem', fontWeight: '800', color: '#0f172a', margin: '4px 0' }}>1800-890-3240</div>
              <div style={{ fontSize: '0.75rem', color: '#16a34a', fontWeight: '600' }}>Mon – Sat, 9:00 AM – 7:00 PM IST</div>
            </div>

            <button 
              onClick={() => { setCallModalOpen(false); setDemoModalOpen(true); }}
              className="btn btn-primary"
              style={{ width: '100%', padding: '12px' }}
            >
              Or Request an Instant Callback
            </button>
          </div>
        </div>
      )}

      {/* ===================================================
          22. MODAL: START 14 DAYS TRIAL / LOGIN
          =================================================== */}
      {trialModalOpen && (
        <div className="modal-overlay" onClick={() => setTrialModalOpen(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={() => setTrialModalOpen(false)}>
              <X className="h-5 w-5" />
            </button>

            <div style={{ marginBottom: '20px', textAlign: 'center' }}>
              <div className="brand-icon-box" style={{ margin: '0 auto 12px' }}>
                <GraduationCap className="h-5 w-5" />
              </div>
              <h3 style={{ fontSize: '1.35rem', fontWeight: '800', color: '#0f172a' }}>Welcome to EduBliq</h3>
              <p style={{ fontSize: '0.8125rem', color: '#64748b' }}>
                Sign in to your school management workspace or start a free 14-day trial.
              </p>
            </div>

            <form onSubmit={(e) => { 
              e.preventDefault(); 
              setTrialModalOpen(false); 
              handleLoginSuccess(portalRole || 'principal');
            }}>
              <div className="form-group">
                <label className="form-label">Select Institutional Role to Access</label>
                <select 
                  className="form-select"
                  value={portalRole}
                  onChange={(e) => setPortalRole(e.target.value)}
                >
                  <optgroup label="1. Leadership & Governance">
                    <option value="principal">🎓 Principal (Academic Leader)</option>
                    <option value="school_admin">🏢 School Admin (Branch Head)</option>
                    <option value="super_admin">👑 Super Admin (Multi-Campus)</option>
                    <option value="trustee">🏛️ Trustee / Chairman / Board</option>
                  </optgroup>
                  <optgroup label="2. Faculty & Academics">
                    <option value="teacher">👩‍🏫 Teacher (Class 8-A Incharge)</option>
                    <option value="librarian">📚 Head Librarian</option>
                  </optgroup>
                  <optgroup label="3. Operations, Finance & Security">
                    <option value="accountant">💳 Accountant (Fee Ledger)</option>
                    <option value="transport_manager">🚌 Transport Manager (Bus App)</option>
                    <option value="security_guard">🛡️ Security Guard (Gate Pass)</option>
                    <option value="hr">👥 HR & Staff Payroll</option>
                    <option value="reception">📋 Reception & Front Desk</option>
                    <option value="hostel_warden">🛏️ Hostel Warden (Mess/Rooms)</option>
                    <option value="store_keeper">📦 Store & Inventory</option>
                  </optgroup>
                  <optgroup label="4. Parents & Students">
                    <option value="parent">👨‍👩‍👦 Parent Portal</option>
                    <option value="student">🎒 Student Portal</option>
                  </optgroup>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Institutional Email</label>
                <input type="email" required defaultValue="admin@xavier.edu.in" className="form-input" />
              </div>
              <div className="form-group">
                <label className="form-label">Password</label>
                <input type="password" required defaultValue="••••••••" className="form-input" />
              </div>
              <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '8px' }}>
                Sign In to School ERP Workspace →
              </button>
              <div style={{ textAlign: 'center', marginTop: '14px' }}>
                <button 
                  type="button" 
                  onClick={() => { setTrialModalOpen(false); navigateTo('onboarding'); }}
                  style={{ fontSize: '0.8125rem', color: '#2563eb', fontWeight: '700', cursor: 'pointer', background: 'none', border: 'none' }}
                >
                  ✨ New School? Create your ERP workspace directly →
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
