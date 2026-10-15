import React, { useState } from 'react';
import '../SchoolERP.css';
import {
  School,
  Building,
  CreditCard,
  Calendar,
  FileCheck,
  Users,
  Shield,
  Clock,
  Award,
  Layers,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Check,
  X,
  TrendingUp,
  Download,
  Search,
  Database,
  Calculator,
  Laptop,
  CheckSquare,
  FileSpreadsheet,
  AlertCircle,
  HelpCircle,
  PhoneCall,
  UserPlus,
  GraduationCap,
  Bus,
  Fingerprint,
  Library,
  Bed,
  Package,
  UserCheck,
  BookOpen
} from 'lucide-react';

import principalOfficeImg from '../assets/principal-office.jpg';
import smartClassroomImg from '../assets/smart-classroom.jpg';
import campusImg from '../assets/campus.jpg';

export default function SchoolERP({ onOpenDemo, onOpenTrial, onNavigateHome, onNavigatePortal, onNavigateLogin }) {
  const [activeConsoleTab, setActiveConsoleTab] = useState('fees');
  const [studentCountSlider, setStudentCountSlider] = useState(1200);
  const [selectedTreeNode, setSelectedTreeNode] = useState('principal');

  // Comprehensive RBAC Architecture Tree Node Details
  const architectureNodes = {
    trustee: {
      id: 'trustee',
      title: 'TRUSTEE / CHAIRMAN / BOARD',
      subtitle: 'Apex Governance & Multi-Campus Society',
      tier: 'Level 0 — Strategic Oversight',
      tagColor: '#b45309',
      tagBg: '#fffbeb',
      icon: Award,
      badge: 'Board of Directors',
      portalRole: 'trustee',
      scope: 'Multi-Campus Institutional Society (8 Campuses)',
      reportsTo: 'Apex Society / Trust Board',
      governs: 'Super Admin, School Admins, Financial Health & Vision',
      keyTools: 'Executive Boardroom Tablet, Consolidated P&L, Audit Trails',
      responsibilities: [
        'Multi-campus fiscal budgets, capital expenditures & annual audited accounts',
        'Trust-wide expansion strategy, land acquisitions & accreditation mandates',
        'Consolidated admissions trend analysis & branch-by-branch performance benchmarking',
        'Appointing Principals and approving senior institutional leadership'
      ],
      dataPermissions: [
        'Consolidated Balance Sheets & P&L',
        'Group Admissions & Student Retention',
        'Capital Works & Infra Investments',
        'Executive Governance Audit Trail'
      ]
    },
    school_erp: {
      id: 'school_erp',
      title: 'SCHOOL ERP (CENTRAL CORE)',
      subtitle: 'Central Unified Cloud Engine & Single Source of Truth',
      tier: 'System Core Backbone',
      tagColor: '#0284c7',
      tagBg: '#e0f2fe',
      icon: Database,
      badge: 'Cloud Backbone',
      portalRole: 'super_admin',
      scope: 'Unified 256-Bit Cloud Database Cluster',
      reportsTo: 'Automated Tier-4 Cloud Architecture',
      governs: 'All 23 School Modules, Hardware IoT & Real-time Integrations',
      keyTools: 'PostgreSQL Relational DB, Redis Realtime Queues, Cloud Backups',
      responsibilities: [
        'Central repository interconnecting admissions, academics, fees, RFID, and GPS',
        'Role-Based Access Control (RBAC) enforcing granular security policies',
        'Real-time automated sync across Turnstiles, Biometric clocks & GPS trackers',
        'CBSE OASIS, ICSE, and UDISE+ compliance export compilation'
      ],
      dataPermissions: [
        'Encrypted Cloud Data Warehouse',
        'Audit Logging of All CRUD Actions',
        'Automated Hourly Redundant Backups',
        'Multi-Tenant Data Segregation'
      ]
    },
    super_admin: {
      id: 'super_admin',
      title: 'SUPER ADMIN',
      subtitle: '(Multi-Campus Master)',
      tier: 'Level 1 — Executive Pillar',
      tagColor: '#dc2626',
      tagBg: '#fef2f2',
      icon: Shield,
      badge: 'Platform Master',
      portalRole: 'super_admin',
      scope: 'Group-Wide (All 8 Campuses & Franchise Branches)',
      reportsTo: 'Trustee / Chairman / Board',
      governs: 'School Admins, Global Security, Server Infrastructure & Licensing',
      keyTools: 'Multi-Branch Master Console, Global Audit Logs, Role Configuration',
      responsibilities: [
        'Provision new school branches, academic sessions, and institutional domains',
        'Manage global system administrators, permission matrices & security policies',
        'Monitor server latency, automated cloud backup integrity & security breaches',
        'Oversee ERP feature rollouts and custom institutional integrations'
      ],
      dataPermissions: [
        'Read/Write across All Campuses',
        'System Master Database Config',
        'User Role & Permission Matrix',
        'Cloud Server Infrastructure Logs'
      ]
    },
    school_admin: {
      id: 'school_admin',
      title: 'SCHOOL ADMIN',
      subtitle: '(Branch Head)',
      tier: 'Level 1 — Executive Pillar',
      tagColor: '#2563eb',
      tagBg: '#eff6ff',
      icon: Building,
      badge: 'Branch Operations',
      portalRole: 'school_admin',
      scope: 'Campus Branch (e.g. St. Xavier’s Main Branch Jaipur)',
      reportsTo: 'Super Admin & Trustee Board',
      governs: 'Accountant, Reception, HR, Transport, Hostel, Security & Inventory',
      keyTools: 'Campus ERP Console, Staff Punch Master, Fee Structure Setup',
      responsibilities: [
        'Oversee daily administrative operations, admissions pipeline & branch compliance',
        'Define campus fee heads, installment schemes, sibling discounts & fine rules',
        'Monitor staff attendance, biometric device health & campus security protocols',
        'Coordinate state education department inspections, affiliations & UDISE+ sync'
      ],
      dataPermissions: [
        'Full Campus Operational Data',
        'Staff Master Records & KYC',
        'Admissions Funnel & Enrollment',
        'Branch Cash Flow & Ledgers'
      ]
    },
    principal: {
      id: 'principal',
      title: 'PRINCIPAL',
      subtitle: '(Academic Leader)',
      tier: 'Level 1 — Executive Pillar',
      tagColor: '#7c3aed',
      tagBg: '#faf5ff',
      icon: GraduationCap,
      badge: 'Academic Head',
      portalRole: 'principal',
      scope: 'Entire School Academic Ecosystem & Teaching Faculty',
      reportsTo: 'Trustee Board & School Management',
      governs: 'Teaching Staff, Academic Coordinators, Students & Examination Cell',
      keyTools: 'Principal Academic Dashboard, NEP Rubrics, Teacher Lesson Reviewer',
      responsibilities: [
        'Academic leadership, curriculum pacing, and CBSE/ICSE board exam excellence',
        'Evaluate teacher performance, syllabus coverage, and classroom quality',
        'Approve student/staff leaves, special concessions, and disciplinary matters',
        'Review NEP 2020 Holistic Progress Cards and issue official circulars'
      ],
      dataPermissions: [
        'All Student Academic Records',
        'Examination Marks & Percentiles',
        'Teacher Lesson Plans & Attendance',
        'Official Institutional Circulars'
      ]
    },
    teacher: {
      id: 'teacher',
      title: 'Teacher',
      subtitle: 'Classroom & LMS Head',
      tier: 'Level 2 — Faculty & Operations',
      tagColor: '#16a34a',
      tagBg: '#f0fdf4',
      icon: BookOpen,
      badge: 'Faculty',
      portalRole: 'teacher',
      scope: 'Assigned Classes & Subjects (e.g. Class 8-A, 9-B)',
      reportsTo: 'Principal & Head of Department',
      governs: 'Assigned Students & Parent Communication',
      keyTools: 'Teacher Mobile App, Digital Gradebook, Attendance Kiosk, LMS',
      responsibilities: [
        'Take period-by-period attendance with 1-click WhatsApp alerts to parents',
        'Upload homework, lesson materials, digital assignments, and project rubrics',
        'Enter mid-term, periodic, and final marks with automated GPA computation',
        'Communicate directly with parents regarding student progress and behavior'
      ],
      dataPermissions: [
        'Assigned Class Student Roster',
        'Marks Entry & Grading Grid',
        'Attendance Register & Remarks',
        'Direct Parent Message Center'
      ]
    },
    accountant: {
      id: 'accountant',
      title: 'Accountant',
      subtitle: 'Fee Counter & Bursar',
      tier: 'Level 2 — Faculty & Operations',
      tagColor: '#059669',
      tagBg: '#ecfdf5',
      icon: CreditCard,
      badge: 'Finance',
      portalRole: 'accountant',
      scope: 'School Accounts Office & Cash/Bank Counter',
      reportsTo: 'School Admin & Trustee Finance Committee',
      governs: 'Fee Counters, Defaulter Tracking & Payment Gateways',
      keyTools: 'POS Counter Terminal, Thermal Receipt Printer, Tally XML Sync',
      responsibilities: [
        'Collect offline counter fees (cash/cheque/card) with automated GST receipts',
        'Reconcile online UPI, Netbanking & Payment Gateway transactions automatically',
        'Generate automated fee dues reminders on WhatsApp with 1-click payment links',
        'Process vendor expense vouchers, petty cash ledgers, and Tally export'
      ],
      dataPermissions: [
        'Fee Ledgers & Invoices',
        'Online Gateway Settlement',
        'Defaulters List & Fine Waivers',
        'Expense Accounts & Tally Data'
      ]
    },
    reception: {
      id: 'reception',
      title: 'Reception',
      subtitle: 'Front Desk & Enquiries',
      tier: 'Level 2 — Faculty & Operations',
      tagColor: '#d97706',
      tagBg: '#fef3c7',
      icon: UserCheck,
      badge: 'Front Office',
      portalRole: 'reception',
      scope: 'Campus Front Office & Visitor Welcome Lounge',
      reportsTo: 'School Admin',
      governs: 'Visitor Logging, Admission Walk-ins & Gate Passes',
      keyTools: 'Front Desk Touch Kiosk, Visitor WebCam, Badge Thermal Printer',
      responsibilities: [
        'Register new parent walk-in admission enquiries and log into CRM follow-ups',
        'Capture visitor photo, ID proof, person to meet, and print QR visitor badge',
        'Issue verified student early exit gate passes with parent OTP confirmation',
        'Maintain digital inbound courier, dispatch postal logs, and telephone register'
      ],
      dataPermissions: [
        'Visitor & Guest Register',
        'Admission Enquiry Funnel',
        'Student Early Exit Gate Passes',
        'Front Office Courier Logs'
      ]
    },
    hr: {
      id: 'hr',
      title: 'HR',
      subtitle: 'Staff Directory & Payroll',
      tier: 'Level 2 — Faculty & Operations',
      tagColor: '#4338ca',
      tagBg: '#e0e7ff',
      icon: FileSpreadsheet,
      badge: 'HR & Payroll',
      portalRole: 'hr',
      scope: 'All Teaching, Administrative & Support Staff',
      reportsTo: 'School Admin & Principal',
      governs: 'Staff Biometrics, Leave Records & Statutory Payroll',
      keyTools: 'Biometric Cloud Bridge, Automated Payroll Engine, EPFO/ESIC Calculator',
      responsibilities: [
        'Automated monthly salary computation with EPF, ESI, TDS, and PT deductions',
        'Sync daily biometric punch logs and flag late arrivals or half-day leaves',
        'Manage casual, medical, and earned leave quotas with principal approval',
        'Maintain digital staff service books, qualification records & police verification'
      ],
      dataPermissions: [
        'Staff Biometric Logs',
        'Salary Computation & Slips',
        'Leave Balance Registers',
        'Teacher Document Vault'
      ]
    },
    librarian: {
      id: 'librarian',
      title: 'Librarian',
      subtitle: 'Catalog & Circulation',
      tier: 'Level 2 — Faculty & Operations',
      tagColor: '#c2410c',
      tagBg: '#fff7ed',
      icon: Library,
      badge: 'Library',
      portalRole: 'librarian',
      scope: 'Central Campus Library & Reading Rooms',
      reportsTo: 'Principal',
      governs: 'Book Inventory, Student Issuance & Digital E-Library',
      keyTools: 'Handheld Barcode Scanner, Dewey Decimal Index, OPAC Portal',
      responsibilities: [
        'Fast barcode checkout and check-in of physical books to students and staff',
        'Catalog new arrivals with Dewey decimal numbers, ISBN, author, and rack tag',
        'Automate overdue fine calculation and WhatsApp reminder notices to borrowers',
        'Curate digital NCERT textbooks, reference e-books, and research journals'
      ],
      dataPermissions: [
        'Library Master Catalog',
        'Issue / Return Transaction Log',
        'Overdue Fines Ledger',
        'E-Book Repository & Downloads'
      ]
    },
    transport_manager: {
      id: 'transport_manager',
      title: 'Transport Manager',
      subtitle: '(Bus App)',
      tier: 'Level 2 — Faculty & Operations',
      tagColor: '#0f766e',
      tagBg: '#ccfbf1',
      icon: Bus,
      badge: 'Transit',
      portalRole: 'transport_manager',
      scope: 'Fleet of School Buses, Vans, Drivers & Commuters',
      reportsTo: 'School Admin',
      governs: 'Fleet Operations, Route Optimization & Parent Live GPS',
      keyTools: 'Live GPS Radar Fleet Map, Driver App, Conductor RFID Tablet',
      responsibilities: [
        'Track all school buses in real-time with live speed, route deviation, and geofencing',
        'Conductor tablet records student boarding/deboarding with instant parent SMS',
        'Optimize bus stop sequences to reduce fuel consumption and transit time',
        'Monitor driver licenses, speed limits, vehicle fitness, and insurance renewals'
      ],
      dataPermissions: [
        'Live GPS Fleet Coordinates',
        'Route Maps & Stop Pickups',
        'Student Commuter Manifest',
        'Driver Compliance & Fuel Logs'
      ]
    },
    hostel_warden: {
      id: 'hostel_warden',
      title: 'Hostel Warden',
      subtitle: '(Mess/Rooms)',
      tier: 'Level 2 — Faculty & Operations',
      tagColor: '#6d28d9',
      tagBg: '#f5f3ff',
      icon: Bed,
      badge: 'Boarding',
      portalRole: 'hostel_warden',
      scope: 'Boys & Girls Boarding Hostels & Dining Hall',
      reportsTo: 'School Admin & Principal',
      governs: 'Boarder Care, Night Roll Call, Mess Menu & Medical Infirmary',
      keyTools: 'Hostel Biometric Tablet, Mess Meal Counter, Outpass OTP Generator',
      responsibilities: [
        'Manage dormitory room allocations, furniture inventory, and bed occupancy',
        'Conduct daily night roll call with biometric verification to ensure safety',
        'Curate weekly mess meal schedules, nutritional balance, and dietary logs',
        'Authorize student weekend outings only after automated parent WhatsApp OTP consent'
      ],
      dataPermissions: [
        'Hostel Room Allocations',
        'Night Roll Call Biometric Log',
        'Mess Attendance & Menu Plan',
        'Outpass & Infirmary Records'
      ]
    },
    security_guard: {
      id: 'security_guard',
      title: 'Security Guard',
      subtitle: '(Gate Pass)',
      tier: 'Level 2 — Faculty & Operations',
      tagColor: '#b91c1c',
      tagBg: '#fee2e2',
      icon: Fingerprint,
      badge: 'Gate Security',
      portalRole: 'security_guard',
      scope: 'Campus Perimeter, Turnstile RFID Gates & Barrier Kiosks',
      reportsTo: 'School Admin',
      governs: 'Turnstile Pedestrian Access, Visitor Scans & Vehicle Gates',
      keyTools: 'Rugged Touch Kiosk, QR Pass Scanner, RFID Turnstiles, CCTV Grid',
      responsibilities: [
        'Operate student turnstiles with real-time smart card RFID tap-in logging',
        'Scan QR code on parent/visitor paper passes issued at reception',
        'Verify authorized parent pickup ID cards before handing over primary students',
        'Trigger campus lockdown alerts or automated emergency exit barrier open'
      ],
      dataPermissions: [
        'Real-time Turnstile Tap Stream',
        'Scanned Visitor QR Passes',
        'Authorized Pickup Photo ID',
        'Gate Barrier & Panic Controls'
      ]
    },
    store_keeper: {
      id: 'store_keeper',
      title: 'Store / Inventory',
      subtitle: 'Warehouse & Supplies',
      tier: 'Level 2 — Faculty & Operations',
      tagColor: '#db2777',
      tagBg: '#fdf2f8',
      icon: Package,
      badge: 'Inventory',
      portalRole: 'store_keeper',
      scope: 'Central School Warehouse, Uniform Depot & Science Lab Stores',
      reportsTo: 'School Admin & Accountant',
      governs: 'Uniform Kits, Textbooks, Lab Equipment & Stationery',
      keyTools: 'Barcode Stock Scanner, PO Procurement Requisition, Stock Audits',
      responsibilities: [
        'Track stock of school uniforms (blazers, shirts, ties) across all student sizes',
        'Manage seasonal textbook bundle assembly and stationary kits distribution',
        'Trigger automated reorder alerts when A4 paper, lab chemicals, or toner run low',
        'Issue goods against department requisition vouchers and generate vendor POs'
      ],
      dataPermissions: [
        'Warehouse Inventory Stock Levels',
        'Low Stock Reorder Triggers',
        'Department Stationery Requests',
        'Vendor Purchase Orders (POs)'
      ]
    },
    parent: {
      id: 'parent',
      title: 'Parent',
      subtitle: 'Mobile App / Portal',
      tier: 'Level 3 — Beneficiaries (Under Teacher)',
      tagColor: '#1d4ed8',
      tagBg: '#eff6ff',
      icon: Users,
      badge: 'Guardian',
      portalRole: 'parent',
      scope: 'Enrolled Child Academic & Financial Profile',
      reportsTo: 'Family & School Collaboration',
      governs: 'Child Welfare, Fee Clearance & Attendance Oversight',
      keyTools: 'EduBliq Parent Mobile App (Android/iOS), 1-Click UPI Payment',
      responsibilities: [
        'Receive instant morning notification when child taps RFID smart card at school gate',
        'Track school bus live on Google Map with accurate 5-minute arrival alerts',
        'Pay tuition fees in 2 taps via zero-convenience-fee UPI (GPay/PhonePe)',
        'Review teacher homework notes, digital report cards, and apply for student leave'
      ],
      dataPermissions: [
        'Child’s Daily Attendance & RFID',
        'Child’s Marksheet & Remarks',
        'Fee Invoices & Instant Receipts',
        'Real-time Bus GPS Location'
      ]
    },
    student: {
      id: 'student',
      title: 'Student',
      subtitle: 'Learning App / Kiosk',
      tier: 'Level 3 — Beneficiaries (Under Teacher)',
      tagColor: '#b45309',
      tagBg: '#fef3c7',
      icon: Laptop,
      badge: 'Learner',
      portalRole: 'student',
      scope: 'Personal Academic, Timetable & Co-Curricular Profile',
      reportsTo: 'Class Teacher & Parents',
      governs: 'Academic Growth & Homework Submissions',
      keyTools: 'Student Tablet/Web Portal, Digital E-Library, Quiz Solver',
      responsibilities: [
        'Check tomorrow’s timetable periods, classroom numbers, and teacher substitutions',
        'Download homework assignment PDFs and submit completed digital coursework',
        'Access NCERT digital textbook repository and borrow digital e-library books',
        'Track personal house points, attendance streak, and view upcoming exam schedules'
      ],
      dataPermissions: [
        'Daily Class Timetable & Periods',
        'Homework Assignments & Marks',
        'NCERT E-Library Access',
        'House Points & Badges Earned'
      ]
    }
  };

  const activeNode = architectureNodes[selectedTreeNode] || architectureNodes.principal;

  // Dynamic calculations for ROI calculator
  const hoursSaved = Math.round(studentCountSlider * 0.22);
  const paperSavedLakhs = ((studentCountSlider * 210) / 100000).toFixed(1);
  const collectionBoost = Math.min(98.4, (90 + (studentCountSlider / 600)).toFixed(1));

  return (
    <div className="erp-page">
      {/* ===================================================
          1. DEDICATED SCHOOL ERP HERO SECTION
          =================================================== */}
      <section className="erp-hero">
        <div className="container" style={{ textAlign: 'center' }}>
          <div className="erp-hero-badge">
            <Sparkles className="h-4 w-4" /> Enterprise School Cloud ERP · Architecture 2026-27
          </div>
          
          <h1 className="erp-hero-title">
            The Core Operating System for <span className="gradient-text">Modern Educational Institutions</span>
          </h1>
          
          <p className="erp-hero-sub">
            A single, highly scalable ERP backbone connecting student records, admissions, fee ledgers, automated timetables, CCE examinations, and CBSE/NEP compliance across single or multi-campus institutions.
          </p>

          <div className="erp-hero-ctas">
            <button onClick={onOpenDemo} className="btn btn-primary btn-lg">
              Schedule Guided ERP Tour <ArrowRight className="h-4 w-4" />
            </button>
            <a href="#roi-calculator" className="btn btn-secondary btn-lg">
              <Calculator className="h-4 w-4" /> Calculate School ROI
            </a>
          </div>

          {/* Interactive Live Institutional ERP Sandbox Preview */}
          <div className="erp-console-preview">
            <div className="erp-console-header">
              <div className="erp-console-controls">
                <span className="erp-dot red"></span>
                <span className="erp-dot yellow"></span>
                <span className="erp-dot green"></span>
                <span style={{ fontSize: '11px', fontWeight: '700', marginLeft: '8px', color: '#cbd5e1' }}>
                  EduBliq Cloud ERP Console v4.8 (Enterprise Edition)
                </span>
              </div>
              <div style={{ fontSize: '11px', color: '#94a3b8' }}>
                Campus: <strong style={{ color: '#ffffff' }}>St. Xavier's Academy (Main Campus)</strong> · Session: 2026-27
              </div>
            </div>

            {/* Interactive Console Tabs */}
            <div className="erp-tabs-bar">
              <button 
                onClick={() => setActiveConsoleTab('fees')}
                className={`erp-tab-btn ${activeConsoleTab === 'fees' ? 'active' : ''}`}
              >
                <CreditCard className="h-3.5 w-3.5" /> 1. Fee Ledger & Collection
              </button>
              <button 
                onClick={() => setActiveConsoleTab('timetable')}
                className={`erp-tab-btn ${activeConsoleTab === 'timetable' ? 'active' : ''}`}
              >
                <Clock className="h-3.5 w-3.5" /> 2. AI Smart Timetable Engine
              </button>
              <button 
                onClick={() => setActiveConsoleTab('admissions')}
                className={`erp-tab-btn ${activeConsoleTab === 'admissions' ? 'active' : ''}`}
              >
                <UserPlus className="h-3.5 w-3.5" /> 3. Admissions CRM Pipeline
              </button>
              <button 
                onClick={() => setActiveConsoleTab('student360')}
                className={`erp-tab-btn ${activeConsoleTab === 'student360' ? 'active' : ''}`}
              >
                <Users className="h-3.5 w-3.5" /> 4. Student 360° Profile Vault
              </button>
              <button 
                onClick={() => setActiveConsoleTab('compliance')}
                className={`erp-tab-btn ${activeConsoleTab === 'compliance' ? 'active' : ''}`}
              >
                <CheckCircle2 className="h-3.5 w-3.5" /> 5. CBSE / NEP Compliance
              </button>
            </div>

            {/* Tab 1: Fee Ledger */}
            {activeConsoleTab === 'fees' && (
              <div className="erp-console-body">
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '18px' }}>
                  <div style={{ backgroundColor: '#ffffff', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                    <div style={{ fontSize: '10px', color: '#64748b', fontWeight: '700' }}>TOTAL PROJECTED FEES</div>
                    <div style={{ fontSize: '18px', fontWeight: '800', color: '#0f172a' }}>₹1,45,20,000</div>
                    <div style={{ fontSize: '10px', color: '#2563eb' }}>1,240 Students Enrolled</div>
                  </div>
                  <div style={{ backgroundColor: '#ffffff', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                    <div style={{ fontSize: '10px', color: '#64748b', fontWeight: '700' }}>TOTAL COLLECTED</div>
                    <div style={{ fontSize: '18px', fontWeight: '800', color: '#16a34a' }}>₹1,34,80,500</div>
                    <div style={{ fontSize: '10px', color: '#16a34a' }}>92.8% Realized</div>
                  </div>
                  <div style={{ backgroundColor: '#ffffff', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                    <div style={{ fontSize: '10px', color: '#64748b', fontWeight: '700' }}>OUTSTANDING DUES</div>
                    <div style={{ fontSize: '18px', fontWeight: '800', color: '#dc2626' }}>₹10,39,500</div>
                    <div style={{ fontSize: '10px', color: '#dc2626' }}>88 Accounts Pending</div>
                  </div>
                  <div style={{ backgroundColor: '#ffffff', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                    <div style={{ fontSize: '10px', color: '#64748b', fontWeight: '700' }}>ONLINE UPI / GATEWAY</div>
                    <div style={{ fontSize: '18px', fontWeight: '800', color: '#7c3aed' }}>78.4%</div>
                    <div style={{ fontSize: '10px', color: '#64748b' }}>Zero Manual Reconciliation</div>
                  </div>
                </div>

                {/* Ledger Table */}
                <div style={{ backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '12px' }}>
                    <thead>
                      <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#475569' }}>
                        <th style={{ padding: '10px 14px' }}>Invoice ID</th>
                        <th style={{ padding: '10px 14px' }}>Student Name</th>
                        <th style={{ padding: '10px 14px' }}>Class / Section</th>
                        <th style={{ padding: '10px 14px' }}>Fee Head</th>
                        <th style={{ padding: '10px 14px' }}>Amount</th>
                        <th style={{ padding: '10px 14px' }}>Payment Mode</th>
                        <th style={{ padding: '10px 14px' }}>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { id: 'INV-2026-9041', name: 'Aarav Singhania', class: 'Grade 9-A', head: 'Term-2 Tuition & Lab', amt: '₹22,500', mode: 'UPI / PhonePe', status: 'Paid ✓' },
                        { id: 'INV-2026-9042', name: 'Ananya Deshmukh', class: 'Grade 10-B', head: 'Term-2 + Transport', amt: '₹28,000', mode: 'Netbanking (HDFC)', status: 'Paid ✓' },
                        { id: 'INV-2026-9043', name: 'Rohan Mehra', class: 'Grade 7-C', head: 'Annual Library & Tech', amt: '₹8,500', mode: 'Credit Card', status: 'Paid ✓' },
                        { id: 'INV-2026-9044', name: 'Kavya Nair', class: 'Grade 8-A', head: 'Term-2 Tuition', amt: '₹18,500', mode: 'SMS Payment Link', status: 'Pending ⏱' },
                      ].map((row, i) => (
                        <tr key={i} style={{ borderBottom: '1px solid #f1f5f9' }}>
                          <td style={{ padding: '10px 14px', fontFamily: 'monospace', color: '#2563eb', fontWeight: '600' }}>{row.id}</td>
                          <td style={{ padding: '10px 14px', fontWeight: '700', color: '#0f172a' }}>{row.name}</td>
                          <td style={{ padding: '10px 14px', color: '#64748b' }}>{row.class}</td>
                          <td style={{ padding: '10px 14px', color: '#475569' }}>{row.head}</td>
                          <td style={{ padding: '10px 14px', fontWeight: '700', color: '#0f172a' }}>{row.amt}</td>
                          <td style={{ padding: '10px 14px', color: '#64748b' }}>{row.mode}</td>
                          <td style={{ padding: '10px 14px' }}>
                            <span style={{ 
                              fontSize: '11px', 
                              fontWeight: '700', 
                              padding: '2px 8px', 
                              borderRadius: '4px',
                              backgroundColor: row.status.includes('Paid') ? '#dcfce7' : '#fef3c7',
                              color: row.status.includes('Paid') ? '#16a34a' : '#b45309'
                            }}>
                              {row.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Tab 2: Timetable Generator */}
            {activeConsoleTab === 'timetable' && (
              <div className="erp-console-body">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                  <div>
                    <h4 style={{ fontSize: '13px', fontWeight: '800', color: '#0f172a' }}>Class 10-A Timetable Matrix</h4>
                    <p style={{ fontSize: '11px', color: '#64748b' }}>Zero-Conflict Auto Generated · Room 204 · 32 periods/week</p>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <span style={{ fontSize: '11px', backgroundColor: '#dbeafe', color: '#1d4ed8', padding: '4px 10px', borderRadius: '4px', fontWeight: '600' }}>
                      Teacher Substitution Alert: Mr. Sharma on leave → Mrs. Rao allocated for Period 3
                    </span>
                  </div>
                </div>

                <div style={{ backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'center', fontSize: '11px' }}>
                    <thead>
                      <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#475569' }}>
                        <th style={{ padding: '8px' }}>Day</th>
                        <th style={{ padding: '8px' }}>Period 1 (08:30)</th>
                        <th style={{ padding: '8px' }}>Period 2 (09:15)</th>
                        <th style={{ padding: '8px' }}>Period 3 (10:00)</th>
                        <th style={{ padding: '8px' }}>Period 4 (11:00)</th>
                        <th style={{ padding: '8px' }}>Period 5 (11:45)</th>
                        <th style={{ padding: '8px' }}>Period 6 (12:30)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { day: 'Monday', p1: 'Mathematics', p2: 'Physics', p3: 'English', p4: 'Chemistry', p5: 'History', p6: 'Physical Ed.' },
                        { day: 'Tuesday', p1: 'Biology', p2: 'Mathematics', p3: 'Computer Science', p4: 'Hindi', p5: 'Physics Lab', p6: 'Physics Lab' },
                        { day: 'Wednesday', p1: 'English', p2: 'Chemistry', p3: 'Mathematics', p4: 'Geography', p5: 'Library', p6: 'Art & Design' },
                        { day: 'Thursday', p1: 'Mathematics', p2: 'Physics', p3: 'Biology Lab', p4: 'Biology Lab', p5: 'Civics', p6: 'Economics' },
                        { day: 'Friday', p1: 'Computer Science', p2: 'English', p3: 'Chemistry', p4: 'Mathematics', p5: 'Sports', p6: 'Club Activity' },
                      ].map((row, i) => (
                        <tr key={i} style={{ borderBottom: '1px solid #f1f5f9' }}>
                          <td style={{ padding: '10px 8px', fontWeight: '700', backgroundColor: '#f8fafc', color: '#0f172a' }}>{row.day}</td>
                          <td style={{ padding: '10px 8px', color: '#1d4ed8', fontWeight: '600' }}>{row.p1}</td>
                          <td style={{ padding: '10px 8px', color: '#0f766e', fontWeight: '600' }}>{row.p2}</td>
                          <td style={{ padding: '10px 8px', color: '#7c3aed', fontWeight: '600' }}>{row.p3}</td>
                          <td style={{ padding: '10px 8px', color: '#b45309', fontWeight: '600' }}>{row.p4}</td>
                          <td style={{ padding: '10px 8px', color: '#be185d', fontWeight: '600' }}>{row.p5}</td>
                          <td style={{ padding: '10px 8px', color: '#047857', fontWeight: '600' }}>{row.p6}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Tab 3: Admissions CRM Pipeline */}
            {activeConsoleTab === 'admissions' && (
              <div className="erp-console-body">
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px' }}>
                  {[
                    { stage: '1. New Enquiries', count: 48, leads: ['Aryan Verma (Nursery)', 'Diya Shah (Class 1)', 'Tanvi Roy (Class 6)'] },
                    { stage: '2. Campus Walk-in', count: 24, leads: ['Sameer Joshi (Class 9)', 'Ishita Bansal (Class 4)'] },
                    { stage: '3. Entrance Test', count: 18, leads: ['Pranav Reddy (Class 11 - Sci)', 'Anika Sen (Class 11 - Com)'] },
                    { stage: '4. Enrolled & Paid', count: 35, leads: ['Zoya Khan (Class 8)', 'Kabir Kapoor (Class 3)'] }
                  ].map((col, idx) => (
                    <div key={idx} style={{ backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e2e8f0', padding: '14px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                        <span style={{ fontSize: '11px', fontWeight: '700', color: '#0f172a' }}>{col.stage}</span>
                        <span style={{ fontSize: '11px', fontWeight: '800', backgroundColor: '#eff6ff', color: '#2563eb', padding: '2px 6px', borderRadius: '4px' }}>
                          {col.count}
                        </span>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {col.leads.map((l, i) => (
                          <div key={i} style={{ backgroundColor: '#f8fafc', padding: '8px 10px', borderRadius: '6px', border: '1px solid #f1f5f9', fontSize: '11px', fontWeight: '600', color: '#334155' }}>
                            {l}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab 4: Student 360 */}
            {activeConsoleTab === 'student360' && (
              <div className="erp-console-body">
                <div style={{ backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e2e8f0', padding: '20px', display: 'grid', gridTemplateColumns: '120px 1fr 1fr', gap: '20px', alignItems: 'center' }}>
                  <img 
                    src="https://images.unsplash.com/photo-1544717305-2782549b5136?w=200&auto=format&fit=crop&q=80" 
                    alt="Student" 
                    style={{ width: '100px', height: '100px', borderRadius: '50%', objectFit: 'cover', border: '3px solid #bfdbfe' }}
                  />
                  <div>
                    <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#0f172a', marginBottom: '4px' }}>Rahul Sharma (Class 8-A)</h3>
                    <p style={{ fontSize: '11px', color: '#64748b', marginBottom: '8px' }}>Admission #2024-8891 · RFID Tag #RF-8092 · Roll: 14</p>
                    <div style={{ display: 'flex', gap: '8px', fontSize: '11px' }}>
                      <span style={{ backgroundColor: '#dcfce7', color: '#16a34a', padding: '2px 8px', borderRadius: '4px', fontWeight: '700' }}>Attendance: 96.4%</span>
                      <span style={{ backgroundColor: '#eff6ff', color: '#2563eb', padding: '2px 8px', borderRadius: '4px', fontWeight: '700' }}>Term-1 CGPA: 9.4</span>
                      <span style={{ backgroundColor: '#fef3c7', color: '#b45309', padding: '2px 8px', borderRadius: '4px', fontWeight: '700' }}>Bus Route: #14</span>
                    </div>
                  </div>
                  <div style={{ fontSize: '11px', color: '#475569', borderLeft: '1px solid #e2e8f0', paddingLeft: '20px' }}>
                    <div><strong>Father:</strong> Mr. Rajesh Sharma (+91 98765 43210)</div>
                    <div><strong>Fee Ledger:</strong> Fully Paid (Zero Dues) ✓</div>
                    <div><strong>House:</strong> Shivaji House (Captain)</div>
                    <div><strong>Medical Log:</strong> Normal (Blood Group: B+)</div>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 5: CBSE/NEP Compliance */}
            {activeConsoleTab === 'compliance' && (
              <div className="erp-console-body">
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px' }}>
                  <div style={{ backgroundColor: '#ffffff', padding: '16px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                    <h4 style={{ fontSize: '13px', fontWeight: '700', color: '#0f172a', marginBottom: '6px' }}>CBSE OASIS & LOC Export</h4>
                    <p style={{ fontSize: '11px', color: '#64748b', marginBottom: '12px' }}>Automate List of Candidates (LOC) for Grade 10 & 12 board examinations with automated photo and signature collation.</p>
                    <button className="btn btn-secondary btn-sm" style={{ width: '100%' }}>Generate OASIS XML</button>
                  </div>
                  <div style={{ backgroundColor: '#ffffff', padding: '16px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                    <h4 style={{ fontSize: '13px', fontWeight: '700', color: '#0f172a', marginBottom: '6px' }}>UDISE+ Data Synchronization</h4>
                    <p style={{ fontSize: '11px', color: '#64748b', marginBottom: '12px' }}>One-click export of state education portal requirements, student demographics, teacher qualifications and infrastructure metrics.</p>
                    <button className="btn btn-secondary btn-sm" style={{ width: '100%' }}>Sync UDISE+ Dataset</button>
                  </div>
                  <div style={{ backgroundColor: '#ffffff', padding: '16px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                    <h4 style={{ fontSize: '13px', fontWeight: '700', color: '#0f172a', marginBottom: '6px' }}>NEP 2020 Holistic Progress Cards</h4>
                    <p style={{ fontSize: '11px', color: '#64748b', marginBottom: '12px' }}>Multidimensional 360-degree competency rubric cards covering cognitive, affective and psychomotor domains.</p>
                    <button className="btn btn-secondary btn-sm" style={{ width: '100%' }}>Batch Generate HPC Cards</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ===================================================
          2. COMPLIANCE & ACCREDITATION STRIP
          =================================================== */}
      <section className="compliance-strip">
        <div className="container">
          <div className="compliance-grid">
            <div className="compliance-badge">
              <CheckCircle2 className="h-4 w-4 text-blue-600" />
              <span>CBSE Affiliation Norms Compliant</span>
            </div>
            <div className="compliance-badge">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              <span>ICSE / CISCE Assessment Ready</span>
            </div>
            <div className="compliance-badge">
              <CheckCircle2 className="h-4 w-4 text-purple-600" />
              <span>NEP 2020 Holistic Framework</span>
            </div>
            <div className="compliance-badge">
              <CheckCircle2 className="h-4 w-4 text-amber-600" />
              <span>UDISE+ & OASIS Integration</span>
            </div>
            <div className="compliance-badge">
              <Shield className="h-4 w-4 text-indigo-600" />
              <span>ISO 27001 & 256-Bit Cloud Security</span>
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================
          3. 6 CORE ERP FUNCTIONAL PILLARS
          =================================================== */}
      <section className="erp-pillars-section">
        <div className="container">
          <div style={{ textAlign: 'center' }}>
            <span className="section-badge">Core ERP Architecture</span>
            <h2 className="section-title">The 6 Pillars of EduBliq School ERP</h2>
            <p className="section-subtitle">
              Engineered specifically for Indian K-12 private schools, convent academies and multi-branch educational trusts.
            </p>
          </div>

          <div className="erp-pillars-grid">
            {/* Pillar 1 */}
            <div className="pillar-box">
              <div className="pillar-icon-circle" style={{ backgroundColor: '#eff6ff', color: '#2563eb' }}>
                <Building className="h-5 w-5" />
              </div>
              <h3 className="pillar-box-title">Multi-Branch Governance</h3>
              <p className="pillar-box-desc">
                Centralized leadership console to govern multiple schools, junior colleges and preschool franchises with role-based segregation.
              </p>
              <div className="pillar-tags">
                <span className="pillar-tag">Branch Hierarchy</span>
                <span className="pillar-tag">Unified Auditing</span>
                <span className="pillar-tag">Consolidated P&L</span>
              </div>
            </div>

            {/* Pillar 2 */}
            <div className="pillar-box">
              <div className="pillar-icon-circle" style={{ backgroundColor: '#f0fdf4', color: '#16a34a' }}>
                <CreditCard className="h-5 w-5" />
              </div>
              <h3 className="pillar-box-title">Dynamic Fee Engine</h3>
              <p className="pillar-box-desc">
                Configure intricate sibling discounts, staff concessions, transport installments, late fine rules and one-click Tally/ERP ledger sync.
              </p>
              <div className="pillar-tags">
                <span className="pillar-tag">UPI / Auto-Debit</span>
                <span className="pillar-tag">GST e-Invoicing</span>
                <span className="pillar-tag">Dues Recovery CRM</span>
              </div>
            </div>

            {/* Pillar 3 */}
            <div className="pillar-box">
              <div className="pillar-icon-circle" style={{ backgroundColor: '#fef3c7', color: '#d97706' }}>
                <Clock className="h-5 w-5" />
              </div>
              <h3 className="pillar-box-title">Smart Timetable Engine</h3>
              <p className="pillar-box-desc">
                AI scheduler solves complex teacher period constraints, room capacities, consecutive practical lab allocations, and daily teacher substitution.
              </p>
              <div className="pillar-tags">
                <span className="pillar-tag">Zero Conflicts</span>
                <span className="pillar-tag">Instant Substitute</span>
                <span className="pillar-tag">Room Optimization</span>
              </div>
            </div>

            {/* Pillar 4 */}
            <div className="pillar-box">
              <div className="pillar-icon-circle" style={{ backgroundColor: '#faf5ff', color: '#9333ea' }}>
                <Award className="h-5 w-5" />
              </div>
              <h3 className="pillar-box-title">Exams & Holistic Grading</h3>
              <p className="pillar-box-desc">
                Supports CCE, semester schemes, GPA scales, co-curricular rubrics, automated marks collation, and printable student report card generation.
              </p>
              <div className="pillar-tags">
                <span className="pillar-tag">CBSE CCE Marks</span>
                <span className="pillar-tag">Hall Ticket Maker</span>
                <span className="pillar-tag">Marksheet PDF</span>
              </div>
            </div>

            {/* Pillar 5 */}
            <div className="pillar-box">
              <div className="pillar-icon-circle" style={{ backgroundColor: '#e0f2fe', color: '#0284c7' }}>
                <UserPlus className="h-5 w-5" />
              </div>
              <h3 className="pillar-box-title">Digital Admissions CRM</h3>
              <p className="pillar-box-desc">
                Track parent walk-ins, phone calls, website forms, counselor follow-ups, entrance exam merit lists, and paperless online fee enrollment.
              </p>
              <div className="pillar-tags">
                <span className="pillar-tag">Lead Funnel</span>
                <span className="pillar-tag">Document Vault</span>
                <span className="pillar-tag">Merit Listing</span>
              </div>
            </div>

            {/* Pillar 6 */}
            <div className="pillar-box">
              <div className="pillar-icon-circle" style={{ backgroundColor: '#fdf2f8', color: '#db2777' }}>
                <Users className="h-5 w-5" />
              </div>
              <h3 className="pillar-box-title">HR & Staff Payroll</h3>
              <p className="pillar-box-desc">
                Biometric punch synchronization, automated leave quotas, casual/sick leave approvals, PF/ESI/TDS tax computations, and salary slip generation.
              </p>
              <div className="pillar-tags">
                <span className="pillar-tag">Biometric Sync</span>
                <span className="pillar-tag">Salary Slips</span>
                <span className="pillar-tag">PF / ESI Reports</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================
          3.5. ROLE-BASED ACCESS CONTROL (RBAC) ARCHITECTURE TREE
          =================================================== */}
      <section id="architecture-tree" className="erp-hierarchy-section">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '36px' }}>
            <span className="section-badge">Institutional RBAC Architecture</span>
            <h2 className="section-title">Four-Tier Governance & Operations Hierarchy</h2>
            <p className="section-subtitle">
              Interactive role-based access model connecting the Board of Trustees, Leadership Pillars, Departmental Staff, and Classroom Beneficiaries.
            </p>
            <div className="hierarchy-hint-badge">
              <Sparkles className="h-3.5 w-3.5 text-blue-600" />
              <span>Click any node in the organizational chart below to inspect access privileges and launch its live simulated workspace</span>
            </div>
          </div>

          <div className="hierarchy-split-container">
            {/* Left: The Visual ASCII-derived Organizational Tree */}
            <div className="hierarchy-tree-canvas-wrapper">
              <div className="hierarchy-tree-canvas">
                
                {/* 1. TOP TIER: TRUSTEE / CHAIRMAN / BOARD */}
                <div className="tree-tier-row center-row">
                  <div 
                    onClick={() => setSelectedTreeNode('trustee')}
                    className={`tree-node-card tier-trustee ${selectedTreeNode === 'trustee' ? 'active' : ''}`}
                  >
                    <div className="tree-node-icon" style={{ backgroundColor: '#fffbeb', color: '#b45309' }}>
                      <Award className="h-5 w-5" />
                    </div>
                    <div className="tree-node-text">
                      <div className="tree-node-badge" style={{ backgroundColor: '#fffbeb', color: '#b45309' }}>APEX GOVERNANCE</div>
                      <div className="tree-node-title">TRUSTEE / CHAIRMAN / BOARD</div>
                      <div className="tree-node-sub">Multi-Campus Trust & Board of Directors</div>
                    </div>
                    <div className="tree-node-indicator"></div>
                  </div>
                </div>

                {/* Vertical Stem down to School ERP */}
                <div className="tree-connector-v">
                  <div className="stem-line"></div>
                </div>

                {/* 2. CORE ENGINE: SCHOOL ERP */}
                <div className="tree-tier-row center-row">
                  <div 
                    onClick={() => setSelectedTreeNode('school_erp')}
                    className={`tree-node-card tier-core-erp ${selectedTreeNode === 'school_erp' ? 'active' : ''}`}
                  >
                    <div className="tree-node-icon" style={{ backgroundColor: '#e0f2fe', color: '#0284c7' }}>
                      <Database className="h-5 w-5" />
                    </div>
                    <div className="tree-node-text">
                      <div className="tree-node-badge" style={{ backgroundColor: '#e0f2fe', color: '#0284c7' }}>CENTRAL CLOUD BACKBONE</div>
                      <div className="tree-node-title">SCHOOL ERP</div>
                      <div className="tree-node-sub">Unified Real-time Database Engine (23 Modules)</div>
                    </div>
                    <div className="tree-node-indicator"></div>
                  </div>
                </div>

                {/* Vertical Stem branching to 3 Leadership Pillars */}
                <div className="tree-connector-v">
                  <div className="stem-line"></div>
                </div>

                {/* 3-WAY LEADERSHIP BRANCH BRACKET */}
                <div className="tree-branch-bracket-3">
                  <div className="bracket-top-line"></div>
                </div>

                {/* 3. THREE LEADERSHIP PILLARS */}
                <div className="tree-tier-row three-pillars-row">
                  {/* Super Admin */}
                  <div 
                    onClick={() => setSelectedTreeNode('super_admin')}
                    className={`tree-node-card tier-pillar ${selectedTreeNode === 'super_admin' ? 'active' : ''}`}
                  >
                    <div className="tree-node-icon" style={{ backgroundColor: '#fef2f2', color: '#dc2626' }}>
                      <Shield className="h-4 w-4" />
                    </div>
                    <div className="tree-node-text">
                      <div className="tree-node-title">SUPER ADMIN</div>
                      <div className="tree-node-sub">(Multi-Campus)</div>
                    </div>
                    <div className="tree-node-indicator"></div>
                  </div>

                  {/* School Admin */}
                  <div 
                    onClick={() => setSelectedTreeNode('school_admin')}
                    className={`tree-node-card tier-pillar ${selectedTreeNode === 'school_admin' ? 'active' : ''}`}
                  >
                    <div className="tree-node-icon" style={{ backgroundColor: '#eff6ff', color: '#2563eb' }}>
                      <Building className="h-4 w-4" />
                    </div>
                    <div className="tree-node-text">
                      <div className="tree-node-title">SCHOOL ADMIN</div>
                      <div className="tree-node-sub">(Branch Head)</div>
                    </div>
                    <div className="tree-node-indicator"></div>
                  </div>

                  {/* Principal */}
                  <div 
                    onClick={() => setSelectedTreeNode('principal')}
                    className={`tree-node-card tier-pillar ${selectedTreeNode === 'principal' ? 'active' : ''}`}
                  >
                    <div className="tree-node-icon" style={{ backgroundColor: '#faf5ff', color: '#7c3aed' }}>
                      <GraduationCap className="h-4 w-4" />
                    </div>
                    <div className="tree-node-text">
                      <div className="tree-node-title">PRINCIPAL</div>
                      <div className="tree-node-sub">(Academic Leader)</div>
                    </div>
                    <div className="tree-node-indicator"></div>
                  </div>
                </div>

                {/* Convergence Bracket reuniting leadership into the central operational bus */}
                <div className="tree-reunion-bracket-3">
                  <div className="bracket-bottom-line"></div>
                </div>

                <div className="tree-connector-v">
                  <div className="stem-line"></div>
                </div>

                {/* 9-WAY OPERATIONAL BUS BRACKET */}
                <div className="tree-staff-bus-bracket">
                  <div className="staff-bus-line"></div>
                </div>

                {/* 4. OPERATIONS & FACULTY STAFF TIER (9 COLUMNS) */}
                <div className="tree-tier-row staff-grid-row">
                  {/* Column 1: Teacher (With Sub-branch to Parent & Student) */}
                  <div className="staff-col-with-children">
                    <div 
                      onClick={() => setSelectedTreeNode('teacher')}
                      className={`tree-node-card tier-staff ${selectedTreeNode === 'teacher' ? 'active' : ''}`}
                    >
                      <div className="tree-node-icon" style={{ backgroundColor: '#f0fdf4', color: '#16a34a' }}>
                        <BookOpen className="h-3.5 w-3.5" />
                      </div>
                      <div className="tree-node-text">
                        <div className="tree-node-title">Teacher</div>
                        <div className="tree-node-sub">Faculty</div>
                      </div>
                      <div className="tree-node-indicator"></div>
                    </div>

                    {/* Sub-branch Stem from Teacher to Parent & Student */}
                    <div className="teacher-sub-stem"></div>
                    <div className="teacher-sub-bracket"></div>

                    {/* End-User / Beneficiaries: Parent & Student */}
                    <div className="teacher-children-grid">
                      <div 
                        onClick={() => setSelectedTreeNode('parent')}
                        className={`tree-node-card tier-enduser ${selectedTreeNode === 'parent' ? 'active' : ''}`}
                      >
                        <div className="tree-node-icon" style={{ backgroundColor: '#eff6ff', color: '#1d4ed8' }}>
                          <Users className="h-3.5 w-3.5" />
                        </div>
                        <div className="tree-node-text">
                          <div className="tree-node-title">Parent</div>
                          <div className="tree-node-sub">App / UPI</div>
                        </div>
                        <div className="tree-node-indicator"></div>
                      </div>

                      <div 
                        onClick={() => setSelectedTreeNode('student')}
                        className={`tree-node-card tier-enduser ${selectedTreeNode === 'student' ? 'active' : ''}`}
                      >
                        <div className="tree-node-icon" style={{ backgroundColor: '#fef3c7', color: '#b45309' }}>
                          <Laptop className="h-3.5 w-3.5" />
                        </div>
                        <div className="tree-node-text">
                          <div className="tree-node-title">Student</div>
                          <div className="tree-node-sub">LMS / Books</div>
                        </div>
                        <div className="tree-node-indicator"></div>
                      </div>
                    </div>
                  </div>

                  {/* Column 2: Accountant */}
                  <div 
                    onClick={() => setSelectedTreeNode('accountant')}
                    className={`tree-node-card tier-staff ${selectedTreeNode === 'accountant' ? 'active' : ''}`}
                  >
                    <div className="tree-node-icon" style={{ backgroundColor: '#ecfdf5', color: '#059669' }}>
                      <CreditCard className="h-3.5 w-3.5" />
                    </div>
                    <div className="tree-node-text">
                      <div className="tree-node-title">Accountant</div>
                      <div className="tree-node-sub">Fee POS</div>
                    </div>
                    <div className="tree-node-indicator"></div>
                  </div>

                  {/* Column 3: Reception */}
                  <div 
                    onClick={() => setSelectedTreeNode('reception')}
                    className={`tree-node-card tier-staff ${selectedTreeNode === 'reception' ? 'active' : ''}`}
                  >
                    <div className="tree-node-icon" style={{ backgroundColor: '#fef3c7', color: '#d97706' }}>
                      <UserCheck className="h-3.5 w-3.5" />
                    </div>
                    <div className="tree-node-text">
                      <div className="tree-node-title">Reception</div>
                      <div className="tree-node-sub">Enquiry/Pass</div>
                    </div>
                    <div className="tree-node-indicator"></div>
                  </div>

                  {/* Column 4: HR */}
                  <div 
                    onClick={() => setSelectedTreeNode('hr')}
                    className={`tree-node-card tier-staff ${selectedTreeNode === 'hr' ? 'active' : ''}`}
                  >
                    <div className="tree-node-icon" style={{ backgroundColor: '#e0e7ff', color: '#4338ca' }}>
                      <FileSpreadsheet className="h-3.5 w-3.5" />
                    </div>
                    <div className="tree-node-text">
                      <div className="tree-node-title">HR</div>
                      <div className="tree-node-sub">Payroll</div>
                    </div>
                    <div className="tree-node-indicator"></div>
                  </div>

                  {/* Column 5: Librarian */}
                  <div 
                    onClick={() => setSelectedTreeNode('librarian')}
                    className={`tree-node-card tier-staff ${selectedTreeNode === 'librarian' ? 'active' : ''}`}
                  >
                    <div className="tree-node-icon" style={{ backgroundColor: '#fff7ed', color: '#c2410c' }}>
                      <Library className="h-3.5 w-3.5" />
                    </div>
                    <div className="tree-node-text">
                      <div className="tree-node-title">Librarian</div>
                      <div className="tree-node-sub">Barcodes</div>
                    </div>
                    <div className="tree-node-indicator"></div>
                  </div>

                  {/* Column 6: Transport Manager (Bus App) */}
                  <div 
                    onClick={() => setSelectedTreeNode('transport_manager')}
                    className={`tree-node-card tier-staff ${selectedTreeNode === 'transport_manager' ? 'active' : ''}`}
                  >
                    <div className="tree-node-icon" style={{ backgroundColor: '#ccfbf1', color: '#0f766e' }}>
                      <Bus className="h-3.5 w-3.5" />
                    </div>
                    <div className="tree-node-text">
                      <div className="tree-node-title">Transport</div>
                      <div className="tree-node-sub">Manager</div>
                      <span className="tree-tag-pill" style={{ backgroundColor: '#ccfbf1', color: '#0f766e' }}>(Bus App)</span>
                    </div>
                    <div className="tree-node-indicator"></div>
                  </div>

                  {/* Column 7: Hostel Warden (Mess/Rooms) */}
                  <div 
                    onClick={() => setSelectedTreeNode('hostel_warden')}
                    className={`tree-node-card tier-staff ${selectedTreeNode === 'hostel_warden' ? 'active' : ''}`}
                  >
                    <div className="tree-node-icon" style={{ backgroundColor: '#f5f3ff', color: '#6d28d9' }}>
                      <Bed className="h-3.5 w-3.5" />
                    </div>
                    <div className="tree-node-text">
                      <div className="tree-node-title">Hostel</div>
                      <div className="tree-node-sub">Warden</div>
                      <span className="tree-tag-pill" style={{ backgroundColor: '#f5f3ff', color: '#6d28d9' }}>(Mess/Rooms)</span>
                    </div>
                    <div className="tree-node-indicator"></div>
                  </div>

                  {/* Column 8: Security Guard (Gate Pass) */}
                  <div 
                    onClick={() => setSelectedTreeNode('security_guard')}
                    className={`tree-node-card tier-staff ${selectedTreeNode === 'security_guard' ? 'active' : ''}`}
                  >
                    <div className="tree-node-icon" style={{ backgroundColor: '#fee2e2', color: '#b91c1c' }}>
                      <Fingerprint className="h-3.5 w-3.5" />
                    </div>
                    <div className="tree-node-text">
                      <div className="tree-node-title">Security</div>
                      <div className="tree-node-sub">Guard</div>
                      <span className="tree-tag-pill" style={{ backgroundColor: '#fee2e2', color: '#b91c1c' }}>(Gate Pass)</span>
                    </div>
                    <div className="tree-node-indicator"></div>
                  </div>

                  {/* Column 9: Store / Inventory */}
                  <div 
                    onClick={() => setSelectedTreeNode('store_keeper')}
                    className={`tree-node-card tier-staff ${selectedTreeNode === 'store_keeper' ? 'active' : ''}`}
                  >
                    <div className="tree-node-icon" style={{ backgroundColor: '#fdf2f8', color: '#db2777' }}>
                      <Package className="h-3.5 w-3.5" />
                    </div>
                    <div className="tree-node-text">
                      <div className="tree-node-title">Store /</div>
                      <div className="tree-node-sub">Inventory</div>
                      <span className="tree-tag-pill" style={{ backgroundColor: '#fdf2f8', color: '#db2777' }}>(Uniforms)</span>
                    </div>
                    <div className="tree-node-indicator"></div>
                  </div>
                </div>

              </div>
            </div>

            {/* Right: Interactive Role Inspector & Simulation Launcher */}
            <div className="hierarchy-inspector-pane">
              {activeNode && (
                <div className="inspector-card">
                  <div className="inspector-header">
                    <div className="inspector-avatar" style={{ backgroundColor: activeNode.tagBg, color: activeNode.tagColor }}>
                      <activeNode.icon className="h-6 w-6" />
                    </div>
                    <div>
                      <span className="inspector-tier-badge" style={{ backgroundColor: activeNode.tagBg, color: activeNode.tagColor }}>
                        {activeNode.tier}
                      </span>
                      <h3 className="inspector-role-title">{activeNode.title}</h3>
                      <div className="inspector-role-subtitle">{activeNode.subtitle}</div>
                    </div>
                  </div>

                  <div className="inspector-body">
                    {/* Metadata Grid */}
                    <div className="inspector-meta-grid">
                      <div className="inspector-meta-item">
                        <span className="meta-label">Institutional Scope:</span>
                        <strong className="meta-val">{activeNode.scope}</strong>
                      </div>
                      <div className="inspector-meta-item">
                        <span className="meta-label">Reports To:</span>
                        <strong className="meta-val">{activeNode.reportsTo}</strong>
                      </div>
                      <div className="inspector-meta-item">
                        <span className="meta-label">Directly Governs:</span>
                        <strong className="meta-val">{activeNode.governs}</strong>
                      </div>
                      <div className="inspector-meta-item">
                        <span className="meta-label">Dedicated Tools:</span>
                        <strong className="meta-val">{activeNode.keyTools}</strong>
                      </div>
                    </div>

                    {/* Core Responsibilities */}
                    <div className="inspector-section">
                      <h4 className="inspector-section-heading">Key Operational Responsibilities</h4>
                      <ul className="inspector-bullets">
                        {activeNode.responsibilities.map((r, i) => (
                          <li key={i}>
                            <CheckCircle2 className="h-3.5 w-3.5 text-blue-600 flex-shrink-0" />
                            <span>{r}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Data Access & Permissions */}
                    <div className="inspector-section">
                      <h4 className="inspector-section-heading">Data Visibility & Permissions</h4>
                      <div className="inspector-perm-tags">
                        {activeNode.dataPermissions.map((p, i) => (
                          <span key={i} className="perm-tag">✓ {p}</span>
                        ))}
                      </div>
                    </div>

                    {/* Live Simulation Launchers */}
                    <div className="inspector-actions">
                      <button
                        onClick={() => {
                          if (onNavigatePortal) {
                            onNavigatePortal(activeNode.portalRole);
                          }
                        }}
                        className="btn btn-primary"
                        style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '12px' }}
                      >
                        <Sparkles className="h-4 w-4" />
                        Launch {activeNode.title.split(' ')[0]} Portal Simulation →
                      </button>

                      <button
                        onClick={() => {
                          if (onNavigateLogin) {
                            onNavigateLogin(activeNode.portalRole);
                          }
                        }}
                        className="btn btn-secondary"
                        style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '10px' }}
                      >
                        <Shield className="h-4 w-4" />
                        Test {activeNode.title.split(' ')[0]} Login & Credentials
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================
          4. INTERACTIVE SCHOOL ERP ROI CALCULATOR
          =================================================== */}
      <section id="roi-calculator" className="erp-roi-section">
        <div className="container">
          <div style={{ textAlign: 'center' }}>
            <span className="section-badge">Institutional Savings</span>
            <h2 className="section-title">Calculate Your School's Projected Savings</h2>
            <p className="section-subtitle">
              See the measurable financial return, administrative hours saved, and fee realization boost from implementing EduBliq ERP.
            </p>
          </div>

          <div className="roi-card">
            <div className="roi-slider-header">
              <div>
                <span style={{ fontSize: '0.85rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: '700' }}>
                  Select Total Student Strength
                </span>
                <div className="roi-slider-val">{studentCountSlider.toLocaleString()} Students</div>
              </div>
              <span style={{ backgroundColor: '#1e293b', padding: '6px 12px', borderRadius: '6px', fontSize: '12px', color: '#38bdf8' }}>
                Typical Indian K-12 Institution
              </span>
            </div>

            <div className="roi-slider-container">
              <input 
                type="range" 
                min="250" 
                max="5000" 
                step="50"
                value={studentCountSlider}
                onChange={(e) => setStudentCountSlider(Number(e.target.value))}
                className="roi-range-input"
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#64748b', marginTop: '8px' }}>
                <span>250 Students (Small School)</span>
                <span>2,500 Students (Medium)</span>
                <span>5,000+ Students (Large Trust)</span>
              </div>
            </div>

            <div className="roi-metrics-grid">
              <div className="roi-metric-item">
                <div className="roi-metric-num">{hoursSaved} hrs</div>
                <div className="roi-metric-label">Administrative Hours Saved / Month</div>
              </div>
              <div className="roi-metric-item">
                <div className="roi-metric-num">₹{paperSavedLakhs} Lakhs</div>
                <div className="roi-metric-label">Annual Paper & Printing Cost Saved</div>
              </div>
              <div className="roi-metric-item">
                <div className="roi-metric-num">{collectionBoost}%</div>
                <div className="roi-metric-label">On-Time Fee Realization Rate</div>
              </div>
            </div>

            <div style={{ textAlign: 'center', marginTop: '30px' }}>
              <button onClick={onOpenDemo} className="btn btn-blue btn-lg">
                Get Customized ROI Report for Your School →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================
          5. 7-DAY IMPLEMENTATION & MIGRATION ROADMAP
          =================================================== */}
      <section className="erp-roadmap-section">
        <div className="container">
          <div style={{ textAlign: 'center' }}>
            <span className="section-badge">Fast & Painless Onboarding</span>
            <h2 className="section-title">From Legacy Systems to Go-Live in 7 Days</h2>
            <p className="section-subtitle">
              Our dedicated on-site deployment engineers handle 100% of data cleanup, Excel import, teacher training and biometric integration.
            </p>
          </div>

          <div className="roadmap-grid">
            <div className="roadmap-card">
              <span className="roadmap-day">Day 01 – 02</span>
              <h4 style={{ fontSize: '1.05rem', fontWeight: '700', color: '#0f172a', marginBottom: '8px' }}>Data Audit & Migration</h4>
              <p style={{ fontSize: '0.85rem', color: '#64748b', lineHeight: '1.5' }}>
                Extraction, deduplication and secure ingestion of legacy student records, fee dues history, and staff profiles from old software or Excel.
              </p>
            </div>

            <div className="roadmap-card">
              <span className="roadmap-day">Day 03 – 04</span>
              <h4 style={{ fontSize: '1.05rem', fontWeight: '700', color: '#0f172a', marginBottom: '8px' }}>Rules & Fee Setup</h4>
              <p style={{ fontSize: '0.85rem', color: '#64748b', lineHeight: '1.5' }}>
                Configuration of campus fee structures, installment dates, concession criteria, timetable matrices, and grade assessment schemes.
              </p>
            </div>

            <div className="roadmap-card">
              <span className="roadmap-day">Day 05 – 06</span>
              <h4 style={{ fontSize: '1.05rem', fontWeight: '700', color: '#0f172a', marginBottom: '8px' }}>Staff Training & Hardware</h4>
              <p style={{ fontSize: '0.85rem', color: '#64748b', lineHeight: '1.5' }}>
                Interactive on-site workshops for teachers, accountants, and administrators, plus turnstile RFID gate and biometric device pairing.
              </p>
            </div>

            <div className="roadmap-card" style={{ borderLeft: '4px solid #16a34a' }}>
              <span className="roadmap-day" style={{ backgroundColor: '#dcfce7', color: '#16a34a' }}>Day 07 — Go-Live!</span>
              <h4 style={{ fontSize: '1.05rem', fontWeight: '700', color: '#0f172a', marginBottom: '8px' }}>Seamless Launch</h4>
              <p style={{ fontSize: '0.85rem', color: '#64748b', lineHeight: '1.5' }}>
                Parent mobile app access release, automated WhatsApp circular, and dedicated EduBliq implementation engineer stationed on campus.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================
          6. ERP COMPARISON TABLE
          =================================================== */}
      <section className="erp-comparison-section">
        <div className="container">
          <div style={{ textAlign: 'center' }}>
            <span className="section-badge">Strategic Evaluation</span>
            <h2 className="section-title">How EduBliq Compares to Alternatives</h2>
            <p className="section-subtitle">
              Why 1,100+ schools choose EduBliq over legacy desktop software and disconnected Excel spreadsheets.
            </p>
          </div>

          <div className="comp-table-wrap">
            <table className="erp-comp-table">
              <thead>
                <tr>
                  <th>Features & Capabilities</th>
                  <th className="highlight-col">EduBliq Cloud ERP</th>
                  <th>Legacy Desktop Software</th>
                  <th>Excel & Manual Work</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>Cloud Access (Anywhere, Anytime)</strong></td>
                  <td className="highlight-col">✓ 100% Cloud (Browser & Apps)</td>
                  <td>❌ Local PC only (server crashes)</td>
                  <td>❌ Scattered across pendrives</td>
                </tr>
                <tr>
                  <td><strong>WhatsApp Business API Invoicing</strong></td>
                  <td className="highlight-col">✓ Native Instant Delivery</td>
                  <td>❌ Manual SMS only (unopened)</td>
                  <td>❌ Manual printed slips</td>
                </tr>
                <tr>
                  <td><strong>Biometric & Turnstile RFID Sync</strong></td>
                  <td className="highlight-col">✓ Real-time automated sync</td>
                  <td>⚠️ Complicated offline CSV import</td>
                  <td>❌ Manual paper registers</td>
                </tr>
                <tr>
                  <td><strong>NEP 2020 Holistic Progress Card</strong></td>
                  <td className="highlight-col">✓ Pre-built 360° Rubrics</td>
                  <td>❌ Outdated percentage marks</td>
                  <td>❌ Hundreds of hours manual typing</td>
                </tr>
                <tr>
                  <td><strong>Live GPS Bus Tracking for Parents</strong></td>
                  <td className="highlight-col">✓ Native Parent App Map</td>
                  <td>❌ Third-party separate portal</td>
                  <td>❌ Frantic phone calls to school</td>
                </tr>
                <tr>
                  <td><strong>Multi-Campus Management Console</strong></td>
                  <td className="highlight-col">✓ Unified Single Dashboard</td>
                  <td>❌ Separate license per building</td>
                  <td>❌ Chaos & zero visibility</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ===================================================
          7. FINAL ERP CALL TO ACTION
          =================================================== */}
      <section className="final-cta-section">
        <img src={campusImg} alt="School Campus" className="cta-campus-bg" />
        <div className="cta-dark-overlay"></div>
        <div className="container">
          <div className="final-cta-content">
            <h2 className="cta-title">Upgrade Your School to EduBliq ERP</h2>
            <p className="cta-subtext">
              Request an interactive demo customized for your school’s unique fee structure, board requirements, and admission targets.
            </p>
            <div className="cta-buttons-row">
              <button 
                onClick={onOpenDemo}
                className="btn btn-primary btn-lg"
                style={{ backgroundColor: '#ffffff', color: '#0b132b' }}
              >
                Request Custom ERP Walkthrough <ArrowRight className="h-4 w-4" />
              </button>
              <button 
                onClick={onNavigateHome}
                className="btn btn-secondary btn-lg"
                style={{ backgroundColor: 'transparent', color: '#ffffff', borderColor: 'rgba(255,255,255,0.3)' }}
              >
                ← Back to Main Website
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
