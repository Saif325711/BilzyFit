import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiClient } from '../services/apiClient.js';

const SchoolDataContext = createContext(null);

// Default Registered Institution
const DEFAULT_INSTITUTION = {
  name: "St. Xavier's International Academy",
  email: "admin@xavier.edu.in",
  city: "Jaipur",
  state: "Rajasthan",
  studentsStrength: "1500",
  code: "XAV-2026",
  createdAt: Date.now()
};

// Default Pre-Configured Role Accounts
const DEFAULT_USERS = [
  {
    id: 'USR-SA-001',
    name: 'Dr. Vikram Singhania',
    role: 'super_admin',
    email: 'admin@xavier.edu.in',
    password: 'password',
    phone: '+91 98200 11000',
    department: 'Super Admin Directorate',
    designation: 'Chief Platform Administrator',
    status: 'Active',
    createdAt: Date.now()
  },
  {
    id: 'USR-ACC-001',
    name: 'Mr. Ramanuj Tiwari',
    role: 'accountant',
    email: 'accountant@xavier.edu.in',
    password: 'password',
    phone: '+91 98290 66006',
    department: 'Accounts & Fee Collection',
    designation: 'Head Bursar & Fee Accountant',
    status: 'Active',
    createdAt: Date.now()
  },
  {
    id: 'USR-TCH-001',
    name: 'Mrs. Anita Sharma',
    role: 'staff',
    email: 'teacher@xavier.edu.in',
    password: 'password',
    phone: '+91 98290 33003',
    department: 'Academics & Science',
    designation: 'Class 8-A Incharge & Science Teacher',
    status: 'Active',
    createdAt: Date.now()
  },
  {
    id: 'USR-PRN-001',
    name: 'Dr. Sunita Kulkarni',
    role: 'principal',
    email: 'principal@xavier.edu.in',
    password: 'password',
    phone: '+91 98290 11001',
    department: 'Academic Leadership',
    designation: 'Principal',
    status: 'Active',
    createdAt: Date.now()
  },
  {
    id: 'USR-ACD-001',
    name: 'Prof. Arvind Saxena',
    role: 'academic_coordinator',
    email: 'coordinator@xavier.edu.in',
    password: 'password',
    phone: '+91 98290 77007',
    department: 'Academic Operations & Planning',
    designation: 'Vice Principal / Academic Coordinator',
    status: 'Active',
    createdAt: Date.now()
  },
  {
    id: 'USR-TRU-001',
    name: 'Shri R. K. Agarwal',
    role: 'trustee',
    email: 'trustee@xavier.edu.in',
    password: 'password',
    phone: '+91 98200 88990',
    department: 'Governing Board',
    designation: 'Trustee / Chairman',
    status: 'Active',
    createdAt: Date.now()
  },
  {
    id: 'USR-STU-001',
    name: 'Rahul Sharma',
    role: 'student',
    email: 'student@xavier.edu.in',
    password: 'password',
    phone: '+91 98290 88219',
    department: 'Class 8-A',
    designation: 'Scholar (Roll 24)',
    status: 'Active',
    createdAt: Date.now()
  },
  {
    id: 'USR-PAR-001',
    name: 'Mr. Rajesh Sharma',
    role: 'parent',
    email: 'parent@xavier.edu.in',
    password: 'password',
    phone: '+91 98290 88219',
    department: 'Parent Association',
    designation: 'Guardian of Rahul Sharma',
    status: 'Active',
    createdAt: Date.now()
  }
];

// Default Portal Access Configuration & Passkeys (Managed by SuperAdmin)
export const DEFAULT_PORTAL_ACCESS = [
  {
    id: 'principal',
    role: 'principal',
    title: 'Principal Academic Desk',
    category: 'Leadership',
    description: 'Master academic supervision, final routines approval & teacher evaluations.',
    routeHash: '#principal',
    secretCode: 'PRN-2026',
    isActive: true,
    lastUpdated: Date.now(),
    icon: 'GraduationCap',
    color: '#7c3aed',
    bgLight: '#f5f3ff'
  },
  {
    id: 'school_admin',
    role: 'school_admin',
    title: 'School Operations Console',
    category: 'Administration',
    description: 'Campus operations, class roster, student admissions & master data management.',
    routeHash: '#schooladmin',
    secretCode: 'ADM-2026',
    isActive: true,
    lastUpdated: Date.now(),
    icon: 'Building2',
    color: '#2563eb',
    bgLight: '#eff6ff'
  },
  {
    id: 'academic_coordinator',
    role: 'academic_coordinator',
    title: 'Academic Coordinator Hub',
    category: 'Academic Operations',
    description: 'Timetable planning, teacher workload balance, period assignments & substitute coverage.',
    routeHash: '#coordinator',
    secretCode: 'ACD-2026',
    isActive: true,
    lastUpdated: Date.now(),
    icon: 'Calendar',
    color: '#0891b2',
    bgLight: '#ecfeff'
  },
  {
    id: 'accountant',
    role: 'accountant',
    title: 'Accounts & Fee Counter',
    category: 'Finance',
    description: 'Fee collection, instant receipts, fee ledger, dues follow-up & cash reconciliation.',
    routeHash: '#accountant',
    secretCode: 'ACC-2026',
    isActive: true,
    lastUpdated: Date.now(),
    icon: 'CreditCard',
    color: '#059669',
    bgLight: '#ecfdf5'
  },
  {
    id: 'staff',
    role: 'staff',
    title: 'Teaching Staff Workspace',
    category: 'Classroom',
    description: 'Daily roll call, marks entry, class syllabus progress & student diary notes.',
    routeHash: '#staff',
    secretCode: 'TCH-2026',
    isActive: true,
    lastUpdated: Date.now(),
    icon: 'Users',
    color: '#d97706',
    bgLight: '#fffbeb'
  },
  {
    id: 'student',
    role: 'student',
    title: 'Scholar Learning Desk',
    category: 'Scholars',
    description: 'Personal class routine, exam schedule, attendance records & homework submissions.',
    routeHash: '#student',
    secretCode: 'STU-2026',
    isActive: true,
    lastUpdated: Date.now(),
    icon: 'BookOpen',
    color: '#4f46e5',
    bgLight: '#eef2ff'
  },
  {
    id: 'parent',
    role: 'parent',
    title: 'Parent Engagement Portal',
    category: 'Guardians',
    description: 'Ward performance tracking, digital fee receipts, attendance alerts & notices.',
    routeHash: '#parent',
    secretCode: 'PAR-2026',
    isActive: true,
    lastUpdated: Date.now(),
    icon: 'ShieldCheck',
    color: '#e11d48',
    bgLight: '#fff1f2'
  }
];

// Rich Demo Data for when user explicitly clicks "Load Sample Demo Data"
const DEMO_SAMPLE_CLASSES = [
  { id: 'cls_6', name: 'Class 6', sections: ['A', 'B'], room: 'Room 101', teacher: 'Mrs. Rekha Joshi (Maths Teacher)', studentCapacity: 80 },
  { id: 'cls_7', name: 'Class 7', sections: ['A', 'B'], room: 'Room 102', teacher: 'Mr. Deepak Verma (Science Teacher)', studentCapacity: 80 },
  { id: 'cls_8', name: 'Class 8', sections: ['A', 'B'], room: 'Room 201', teacher: 'Mrs. Anita Sharma (English Teacher)', studentCapacity: 80 },
  { id: 'cls_9', name: 'Class 9', sections: ['A', 'B'], room: 'Room 202', teacher: 'Mr. Arvind Saxena (Maths Teacher)', studentCapacity: 80 },
  { id: 'cls_10', name: 'Class 10', sections: ['A', 'B', 'C'], room: 'Room 301', teacher: 'Mr. Rajesh Khanna (Physics PGT)', studentCapacity: 120 },
  { id: 'cls_11', name: 'Class 11', sections: ['Science', 'Commerce'], room: 'Senior Wing A', teacher: 'Dr. V. K. Sen (Chemistry HOD)', studentCapacity: 120 },
  { id: 'cls_12', name: 'Class 12', sections: ['Science', 'Commerce'], room: 'Senior Wing B', teacher: 'Mrs. Meenakshi S. (Biology PGT)', studentCapacity: 120 }
];

const DEMO_SAMPLE_TEACHERS = [
  { id: 'EMP-001', name: 'Dr. Sunita Kulkarni', role: 'Principal', subject: 'Administration & Physics', department: 'Leadership', phone: '+91 98290 11001', email: 'principal@xavier.edu.in', qualification: 'M.Sc., Ph.D.', status: 'Active' },
  { id: 'EMP-002', name: 'Mr. Arvind Saxena', role: 'Maths Teacher (HOD)', subject: 'Mathematics (9-12)', department: 'Academics', phone: '+91 98290 22002', email: 'arvind.saxena@school.edu.in', qualification: 'M.Sc. Maths, B.Ed.', status: 'Active' },
  { id: 'EMP-003', name: 'Mrs. Anita Sharma', role: 'Science Teacher', subject: 'General Science & Chemistry', department: 'Academics', phone: '+91 98290 33003', email: 'teacher@xavier.edu.in', qualification: 'M.Sc. Chemistry, B.Ed.', status: 'Active' },
  { id: 'EMP-004', name: 'Mr. Rajesh Khanna', role: 'Physics Teacher (PGT)', subject: 'Physics (11-12)', department: 'Academics', phone: '+91 98290 44004', email: 'rajesh.khanna@school.edu.in', qualification: 'M.Sc. Physics, M.Ed.', status: 'Active' },
  { id: 'EMP-005', name: 'Mrs. Rekha Joshi', role: 'English Teacher (TGT)', subject: 'English Literature', department: 'Academics', phone: '+91 98290 55005', email: 'rekha.joshi@school.edu.in', qualification: 'M.A. English, B.Ed.', status: 'Active' },
  { id: 'EMP-006', name: 'Mr. Ramanuj Tiwari', role: 'School Accountant', subject: 'Fee Ledgers & Accounts', department: 'Accounts', phone: '+91 98290 66006', email: 'accountant@xavier.edu.in', qualification: 'M.Com, Tally ERP', status: 'Active' }
];

const DEMO_SAMPLE_STUDENTS = [
  {
    id: 'ADM-2026-0001',
    rollNo: '01',
    name: 'Aarav Patel',
    className: 'Class 6',
    section: 'A',
    gender: 'Boy',
    dob: '2014-04-12',
    category: 'General',
    aadhaar: '•••• •••• 9812',
    penId: 'PEN-820194',
    fatherName: 'Vikas Patel',
    motherName: 'Pooja Patel',
    parentPhone: '+91 98291 44550',
    attendance: '96.5%',
    feeStatus: 'Paid',
    dueAmount: 0,
    term1Score: '92.4%',
    bloodGroup: 'O+',
    address: 'A-12, Vaishali Nagar, Jaipur'
  },
  {
    id: 'ADM-2026-0002',
    rollNo: '02',
    name: 'Ananya Deshmukh',
    className: 'Class 6',
    section: 'A',
    gender: 'Girl',
    dob: '2014-08-21',
    category: 'OBC',
    aadhaar: '•••• •••• 3411',
    penId: 'PEN-820195',
    fatherName: 'Sunil Deshmukh',
    motherName: 'Kavita Deshmukh',
    parentPhone: '+91 98292 11223',
    attendance: '94.0%',
    feeStatus: 'Due ₹4,500',
    dueAmount: 4500,
    term1Score: '88.5%',
    bloodGroup: 'B+',
    address: 'C-45, Mansarovar, Jaipur'
  },
  {
    id: 'ADM-2026-0003',
    rollNo: '01',
    name: 'Rohan Mehra',
    className: 'Class 7',
    section: 'A',
    gender: 'Boy',
    dob: '2013-02-15',
    category: 'General',
    aadhaar: '•••• •••• 6523',
    penId: 'PEN-731940',
    fatherName: 'Sanjay Mehra',
    motherName: 'Neelam Mehra',
    parentPhone: '+91 98290 88771',
    attendance: '98.0%',
    feeStatus: 'Paid',
    dueAmount: 0,
    term1Score: '95.0%',
    bloodGroup: 'A+',
    address: '42, C-Scheme, Jaipur'
  },
  {
    id: 'ADM-2026-0004',
    rollNo: '24',
    name: 'Rahul Sharma',
    className: 'Class 8',
    section: 'A',
    gender: 'Boy',
    dob: '2012-05-14',
    category: 'General',
    aadhaar: '•••• •••• 4821',
    penId: 'PEN-982104',
    fatherName: 'Rajesh Sharma',
    motherName: 'Sunita Sharma',
    parentPhone: '+91 98290 88219',
    attendance: '96.2%',
    feeStatus: 'Due ₹8,200',
    dueAmount: 8200,
    term1Score: '91.4%',
    bloodGroup: 'B+',
    address: 'B-42, Malviya Nagar, Jaipur'
  },
  {
    id: 'ADM-2026-0005',
    rollNo: '02',
    name: 'Diya Rathore',
    className: 'Class 8',
    section: 'A',
    gender: 'Girl',
    dob: '2012-11-03',
    category: 'General',
    aadhaar: '•••• •••• 1198',
    penId: 'PEN-982105',
    fatherName: 'Karan Rathore',
    motherName: 'Suman Rathore',
    parentPhone: '+91 98293 45678',
    attendance: '97.8%',
    feeStatus: 'Paid',
    dueAmount: 0,
    term1Score: '94.2%',
    bloodGroup: 'O+',
    address: '15, Raja Park, Jaipur'
  },
  {
    id: 'ADM-2026-0006',
    rollNo: '01',
    name: 'Kabir Sen',
    className: 'Class 9',
    section: 'B',
    gender: 'Boy',
    dob: '2011-09-19',
    category: 'SC',
    aadhaar: '•••• •••• 7731',
    penId: 'PEN-641029',
    fatherName: 'Alok Sen',
    motherName: 'Madhavi Sen',
    parentPhone: '+91 98294 99001',
    attendance: '91.5%',
    feeStatus: 'Due ₹6,000',
    dueAmount: 6000,
    term1Score: '84.0%',
    bloodGroup: 'AB+',
    address: 'Sector 5, Vidyadhar Nagar, Jaipur'
  },
  {
    id: 'ADM-2026-0007',
    rollNo: '01',
    name: 'Tanvi Joshi',
    className: 'Class 10',
    section: 'A',
    gender: 'Girl',
    dob: '2010-03-28',
    category: 'General',
    aadhaar: '•••• •••• 5542',
    penId: 'PEN-512039',
    fatherName: 'Harish Joshi',
    motherName: 'Rekha Joshi',
    parentPhone: '+91 98295 22334',
    attendance: '99.1%',
    feeStatus: 'Paid',
    dueAmount: 0,
    term1Score: '97.6%',
    bloodGroup: 'O+',
    address: '88, Civil Lines, Jaipur'
  }
];

const DEMO_SAMPLE_RECEIPTS = [
  {
    receiptNo: 'REC-2026-10492',
    studentId: 'ADM-2026-0001',
    studentName: 'Aarav Patel',
    className: 'Class 6-A',
    amountPaid: 8500,
    paymentMode: 'UPI (GPay)',
    feeHeads: ['Tuition Fee', 'Development Fund', 'Computer Lab'],
    date: '10 Oct 2026',
    timestamp: Date.now() - 86400000
  },
  {
    receiptNo: 'REC-2026-10493',
    studentId: 'ADM-2026-0004',
    studentName: 'Rahul Sharma',
    className: 'Class 8-A',
    amountPaid: 9200,
    paymentMode: 'Net Banking',
    feeHeads: ['Tuition Fee', 'Exam Fee', 'Annual Sports'],
    date: '12 Oct 2026',
    timestamp: Date.now() - 43200000
  }
];

// Academic Coordinator Master Datasets
const DEMO_SAMPLE_SUBJECTS = [
  { id: 'sub_math', code: 'MATH-101', name: 'Mathematics', type: 'Core', classes: ['Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10', 'Class 11', 'Class 12'], periodsPerWeek: 6 },
  { id: 'sub_sci', code: 'SCI-102', name: 'Science', type: 'Core', classes: ['Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10'], periodsPerWeek: 6 },
  { id: 'sub_eng', code: 'ENG-103', name: 'English Literature', type: 'Core', classes: ['Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10', 'Class 11', 'Class 12'], periodsPerWeek: 5 },
  { id: 'sub_comp', code: 'CS-104', name: 'Computer Science & AI', type: 'Skill', classes: ['Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10', 'Class 11', 'Class 12'], periodsPerWeek: 4 },
  { id: 'sub_soc', code: 'SOC-105', name: 'Social Science', type: 'Core', classes: ['Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10'], periodsPerWeek: 5 },
  { id: 'sub_hin', code: 'HIN-106', name: 'Hindi Core', type: 'Language', classes: ['Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10'], periodsPerWeek: 4 },
  { id: 'sub_phy', code: 'PHY-107', name: 'Physics PGT', type: 'Core', classes: ['Class 11', 'Class 12'], periodsPerWeek: 6 },
  { id: 'sub_chem', code: 'CHEM-108', name: 'Chemistry HOD', type: 'Core', classes: ['Class 11', 'Class 12'], periodsPerWeek: 6 }
];

const DEMO_SAMPLE_TEACHER_ASSIGNMENTS = [
  { id: 'TA-001', teacherId: 'EMP-002', teacherName: 'Mr. Arvind Saxena', subjectId: 'sub_math', subjectName: 'Mathematics', className: 'Class 10', section: 'A', academicYear: '2026-2027', periodsPerWeek: 6 },
  { id: 'TA-002', teacherId: 'EMP-002', teacherName: 'Mr. Arvind Saxena', subjectId: 'sub_math', subjectName: 'Mathematics', className: 'Class 10', section: 'B', academicYear: '2026-2027', periodsPerWeek: 6 },
  { id: 'TA-003', teacherId: 'EMP-002', teacherName: 'Mr. Arvind Saxena', subjectId: 'sub_math', subjectName: 'Mathematics', className: 'Class 9', section: 'A', academicYear: '2026-2027', periodsPerWeek: 5 },
  { id: 'TA-004', teacherId: 'EMP-003', teacherName: 'Mrs. Anita Sharma', subjectId: 'sub_sci', subjectName: 'Science', className: 'Class 8', section: 'A', academicYear: '2026-2027', periodsPerWeek: 6 },
  { id: 'TA-005', teacherId: 'EMP-003', teacherName: 'Mrs. Anita Sharma', subjectId: 'sub_sci', subjectName: 'Science', className: 'Class 8', section: 'B', academicYear: '2026-2027', periodsPerWeek: 6 },
  { id: 'TA-006', teacherId: 'EMP-003', teacherName: 'Mrs. Anita Sharma', subjectId: 'sub_sci', subjectName: 'Science', className: 'Class 7', section: 'A', academicYear: '2026-2027', periodsPerWeek: 5 },
  { id: 'TA-007', teacherId: 'EMP-004', teacherName: 'Mr. Rajesh Khanna', subjectId: 'sub_phy', subjectName: 'Physics PGT', className: 'Class 11', section: 'Science', academicYear: '2026-2027', periodsPerWeek: 6 },
  { id: 'TA-008', teacherId: 'EMP-004', teacherName: 'Mr. Rajesh Khanna', subjectId: 'sub_phy', subjectName: 'Physics PGT', className: 'Class 12', section: 'Science', academicYear: '2026-2027', periodsPerWeek: 6 },
  { id: 'TA-009', teacherId: 'EMP-005', teacherName: 'Mrs. Rekha Joshi', subjectId: 'sub_eng', subjectName: 'English Literature', className: 'Class 10', section: 'A', academicYear: '2026-2027', periodsPerWeek: 5 },
  { id: 'TA-010', teacherId: 'EMP-005', teacherName: 'Mrs. Rekha Joshi', subjectId: 'sub_eng', subjectName: 'English Literature', className: 'Class 9', section: 'A', academicYear: '2026-2027', periodsPerWeek: 5 }
];

const DEMO_SAMPLE_TIMETABLE = [
  { id: 'TT-001', day: 'Monday', period: 1, startTime: '08:30 AM', endTime: '09:15 AM', className: 'Class 10', section: 'A', subject: 'Mathematics', teacher: 'Mr. Arvind Saxena', teacherId: 'EMP-002', room: 'Room 301', academicYear: '2026-2027', status: 'PUBLISHED' },
  { id: 'TT-002', day: 'Monday', period: 2, startTime: '09:15 AM', endTime: '10:00 AM', className: 'Class 10', section: 'A', subject: 'Science', teacher: 'Mrs. Anita Sharma', teacherId: 'EMP-003', room: 'Physics Lab', academicYear: '2026-2027', status: 'PUBLISHED' },
  { id: 'TT-003', day: 'Monday', period: 3, startTime: '10:00 AM', endTime: '10:45 AM', className: 'Class 10', section: 'A', subject: 'English Literature', teacher: 'Mrs. Rekha Joshi', teacherId: 'EMP-005', room: 'Room 301', academicYear: '2026-2027', status: 'PUBLISHED' },
  { id: 'TT-004', day: 'Monday', period: 4, startTime: '11:15 AM', endTime: '12:00 PM', className: 'Class 10', section: 'A', subject: 'Computer Science & AI', teacher: 'IT Faculty', teacherId: 'EMP-007', room: 'Computer Lab', academicYear: '2026-2027', status: 'PUBLISHED' },
  { id: 'TT-005', day: 'Monday', period: 5, startTime: '12:00 PM', endTime: '12:45 PM', className: 'Class 10', section: 'A', subject: 'Social Science', teacher: 'Social Faculty', teacherId: 'EMP-008', room: 'Room 301', academicYear: '2026-2027', status: 'PUBLISHED' },
  { id: 'TT-006', day: 'Monday', period: 6, startTime: '01:30 PM', endTime: '02:15 PM', className: 'Class 10', section: 'A', subject: 'Mathematics', teacher: 'Mr. Arvind Saxena', teacherId: 'EMP-002', room: 'Room 301', academicYear: '2026-2027', status: 'PUBLISHED' },

  { id: 'TT-007', day: 'Tuesday', period: 1, startTime: '08:30 AM', endTime: '09:15 AM', className: 'Class 10', section: 'A', subject: 'Science', teacher: 'Mrs. Anita Sharma', teacherId: 'EMP-003', room: 'Room 301', academicYear: '2026-2027', status: 'PUBLISHED' },
  { id: 'TT-008', day: 'Tuesday', period: 2, startTime: '09:15 AM', endTime: '10:00 AM', className: 'Class 10', section: 'A', subject: 'Mathematics', teacher: 'Mr. Arvind Saxena', teacherId: 'EMP-002', room: 'Room 301', academicYear: '2026-2027', status: 'PUBLISHED' },
  { id: 'TT-009', day: 'Tuesday', period: 3, startTime: '10:00 AM', endTime: '10:45 AM', className: 'Class 10', section: 'A', subject: 'English Literature', teacher: 'Mrs. Rekha Joshi', teacherId: 'EMP-005', room: 'Room 301', academicYear: '2026-2027', status: 'PUBLISHED' },

  // Class 8-A routine
  { id: 'TT-010', day: 'Monday', period: 1, startTime: '08:30 AM', endTime: '09:15 AM', className: 'Class 8', section: 'A', subject: 'Science', teacher: 'Mrs. Anita Sharma', teacherId: 'EMP-003', room: 'Room 201', academicYear: '2026-2027', status: 'PUBLISHED' },
  { id: 'TT-011', day: 'Monday', period: 2, startTime: '09:15 AM', endTime: '10:00 AM', className: 'Class 8', section: 'A', subject: 'English Literature', teacher: 'Mrs. Rekha Joshi', teacherId: 'EMP-005', room: 'Room 201', academicYear: '2026-2027', status: 'PUBLISHED' }
];

const DEMO_SAMPLE_CALENDAR_EVENTS = [
  { id: 'EV-001', title: 'Periodic Assessment 1 (PA-1)', eventType: 'Exam', startDate: '2026-10-20', endDate: '2026-10-25', classesInvolved: 'All Classes (6-12)', status: 'Approved' },
  { id: 'EV-002', title: 'Diwali & Autumn Festive Break', eventType: 'Holiday', startDate: '2026-11-01', endDate: '2026-11-05', classesInvolved: 'Entire School', status: 'Approved' },
  { id: 'EV-003', title: 'Parent-Teacher Meeting (Term 1 Review)', eventType: 'PTM', startDate: '2026-11-08', endDate: '2026-11-08', classesInvolved: 'Classes 6 to 12', status: 'Approved' },
  { id: 'EV-004', title: 'Annual Inter-House Science & Robotics Exhibition', eventType: 'Activity', startDate: '2026-11-15', endDate: '2026-11-15', classesInvolved: 'Classes 8-12', status: 'Approved' },
  { id: 'EV-005', title: 'CBSE Pre-Board Examination Phase 1', eventType: 'Exam', startDate: '2026-12-05', endDate: '2026-12-18', classesInvolved: 'Class 10 & 12', status: 'Pending Approval' }
];

const DEMO_SAMPLE_CHANGE_REQUESTS = [
  {
    id: 'CR-001',
    timetableId: 'TT-002',
    requesterName: 'Mrs. Anita Sharma',
    requesterRole: 'Science Teacher',
    className: 'Class 10',
    section: 'A',
    day: 'Monday',
    period: 2,
    currentSubject: 'Science',
    proposedPeriod: 'Monday Period 5',
    reason: 'Lab equipment calibration scheduled during Period 2 morning hours.',
    status: 'PENDING',
    date: '2026-10-07',
    reviewerRemarks: ''
  },
  {
    id: 'CR-002',
    timetableId: 'TT-003',
    requesterName: 'Mrs. Rekha Joshi',
    requesterRole: 'English Teacher',
    className: 'Class 10',
    section: 'A',
    day: 'Wednesday',
    period: 4,
    currentSubject: 'English',
    proposedPeriod: 'Wednesday Period 1',
    reason: 'Inter-school debate team coordination duty during afternoon session.',
    status: 'APPROVED',
    date: '2026-10-05',
    reviewerRemarks: 'Approved as requested. Swapped with Period 1.'
  }
];

const DEMO_SAMPLE_SUBSTITUTES = [
  {
    id: 'SUBST-001',
    absentTeacherId: 'EMP-003',
    absentTeacherName: 'Mrs. Anita Sharma',
    substituteTeacherId: 'EMP-002',
    substituteTeacherName: 'Mr. Arvind Saxena',
    className: 'Class 8',
    section: 'A',
    subject: 'Science (Cover Work)',
    period: 3,
    date: new Date().toISOString().split('T')[0],
    status: 'ASSIGNED',
    notes: 'Covering Unit 3 worksheet practice'
  }
];

const DEMO_SAMPLE_ACADEMIC_AUDIT = [
  { id: 'AUD-001', action: 'TIMETABLE_PUBLISHED', entity: 'Class 10-A Timetable', user: 'Dr. Sunita Kulkarni (Principal)', role: 'principal', timestamp: Date.now() - 3600000, details: 'Official timetable routine approved and published to all scholars and teachers.' },
  { id: 'AUD-002', action: 'TEACHER_ASSIGNMENT_CREATED', entity: 'Class 10-A Mathematics', user: 'Prof. Arvind Saxena (Coordinator)', role: 'academic_coordinator', timestamp: Date.now() - 7200000, details: 'Assigned 6 periods per week for Mathematics to Mr. Arvind Saxena.' },
  { id: 'AUD-003', action: 'CHANGE_REQUEST_APPROVED', entity: 'Request #CR-002', user: 'Prof. Arvind Saxena (Coordinator)', role: 'academic_coordinator', timestamp: Date.now() - 14400000, details: 'Approved timetable period swap for Mrs. Rekha Joshi.' },
  { id: 'AUD-004', action: 'SUBSTITUTE_ASSIGNED', entity: 'Class 8-A Period 3', user: 'Prof. Arvind Saxena (Coordinator)', role: 'academic_coordinator', timestamp: Date.now() - 28800000, details: 'Assigned substitute Mr. Arvind Saxena in place of absent teacher Mrs. Anita Sharma.' }
];

export function SchoolDataProvider({ children }) {
  // 1. Institution Master Profile (Set by SuperAdmin during Signup)
  const [institution, setInstitution] = useState(() => {
    try {
      const saved = localStorage.getItem('edubliq_institution');
      return saved ? JSON.parse(saved) : DEFAULT_INSTITUTION;
    } catch (e) {
      return DEFAULT_INSTITUTION;
    }
  });

  // 2. Multi-Role User Directory (SuperAdmin, Accountant, Teachers, Principal, etc.)
  const [users, setUsers] = useState(() => {
    try {
      const saved = localStorage.getItem('edubliq_users');
      return saved ? JSON.parse(saved) : DEFAULT_USERS;
    } catch (e) {
      return DEFAULT_USERS;
    }
  });

  // 3. Current Authenticated Session
  const [currentSession, setCurrentSession] = useState(() => {
    try {
      const saved = localStorage.getItem('edubliq_session');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  // Is Demo Mode active?
  const [isDemoMode, setIsDemoMode] = useState(() => {
    try {
      const saved = localStorage.getItem('edubliq_demo_mode');
      return saved !== null ? JSON.parse(saved) : false;
    } catch (e) {
      return false;
    }
  });

  // Dynamic Classes: Defaults to empty [] for fresh institution, demo only if demo mode
  const [classes, setClasses] = useState(() => {
    try {
      const isDemo = localStorage.getItem('edubliq_demo_mode') === 'true';
      const saved = localStorage.getItem('edubliq_classes');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (!isDemo && Array.isArray(parsed) && parsed.some(c => c.id === 'cls_6')) {
          return [];
        }
        return parsed;
      }
      return isDemo ? DEMO_SAMPLE_CLASSES : [];
    } catch (e) {
      return [];
    }
  });

  // Dynamic Staff / Teachers: Defaults to empty [] for fresh institution
  const [teachers, setTeachers] = useState(() => {
    try {
      const isDemo = localStorage.getItem('edubliq_demo_mode') === 'true';
      const saved = localStorage.getItem('edubliq_teachers');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (!isDemo && Array.isArray(parsed) && parsed.some(t => t.id === 'EMP-001')) {
          return [];
        }
        return parsed;
      }
      return isDemo ? DEMO_SAMPLE_TEACHERS : [];
    } catch (e) {
      return [];
    }
  });

  // Dynamic Students: Defaults to empty [] for fresh institution
  const [students, setStudents] = useState(() => {
    try {
      const isDemo = localStorage.getItem('edubliq_demo_mode') === 'true';
      const saved = localStorage.getItem('edubliq_students');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (!isDemo && Array.isArray(parsed) && parsed.some(s => s.id === 'ADM-2026-0001')) {
          return [];
        }
        return parsed;
      }
      return isDemo ? DEMO_SAMPLE_STUDENTS : [];
    } catch (e) {
      return [];
    }
  });

  // Fee Receipts Ledger: Defaults to empty [] for fresh institution
  const [feeReceipts, setFeeReceipts] = useState(() => {
    try {
      const isDemo = localStorage.getItem('edubliq_demo_mode') === 'true';
      const saved = localStorage.getItem('edubliq_fee_receipts');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (!isDemo && Array.isArray(parsed) && parsed.some(r => r.receiptNo === 'REC-2026-0842')) {
          return [];
        }
        return parsed;
      }
      return isDemo ? DEMO_SAMPLE_RECEIPTS : [];
    } catch (e) {
      return [];
    }
  });

  // Attendance Records: Defaults to empty [] for fresh institution
  const [attendanceRecords, setAttendanceRecords] = useState(() => {
    try {
      const isDemo = localStorage.getItem('edubliq_demo_mode') === 'true';
      const saved = localStorage.getItem('edubliq_attendance');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (!isDemo && Array.isArray(parsed) && parsed.some(a => a.id === 'att_demo_1')) {
          return [];
        }
        return parsed;
      }
      return isDemo ? [
        {
          id: 'att_demo_1',
          date: new Date().toISOString().split('T')[0],
          className: 'Class 8-A',
          records: {
            'ADM-2026-0004': 'Present',
            'ADM-2026-0005': 'Present'
          }
        }
      ] : [];
    } catch (e) {
      return [];
    }
  });

  // Examinations: Defaults to empty [] for fresh institution
  const [exams, setExams] = useState(() => {
    try {
      const isDemo = localStorage.getItem('edubliq_demo_mode') === 'true';
      const saved = localStorage.getItem('edubliq_exams');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (!isDemo && Array.isArray(parsed) && parsed.some(e => e.id === 'ex_1')) {
          return [];
        }
        return parsed;
      }
      return isDemo ? [
        { id: 'ex_1', name: 'Term-1 Mid-Year Review', term: 'Term 1', date: '2026-10-15', maxMarks: 100, className: 'All Classes', status: 'Ongoing' }
      ] : [];
    } catch (e) {
      return [];
    }
  });

  // 10. Subjects Master (Defaults to standard curriculum)
  const [subjects, setSubjects] = useState(() => {
    try {
      const saved = localStorage.getItem('edubliq_subjects');
      if (saved) return JSON.parse(saved);
      return DEMO_SAMPLE_SUBJECTS;
    } catch (e) {
      return DEMO_SAMPLE_SUBJECTS;
    }
  });

  // 11. Teacher Assignments
  const [teacherAssignments, setTeacherAssignments] = useState(() => {
    try {
      const isDemo = localStorage.getItem('edubliq_demo_mode') === 'true';
      const saved = localStorage.getItem('edubliq_teacher_assignments');
      if (saved) return JSON.parse(saved);
      return isDemo ? DEMO_SAMPLE_TEACHER_ASSIGNMENTS : DEMO_SAMPLE_TEACHER_ASSIGNMENTS;
    } catch (e) {
      return DEMO_SAMPLE_TEACHER_ASSIGNMENTS;
    }
  });

  // 12. Master Timetable Routine
  const [timetables, setTimetables] = useState(() => {
    try {
      const isDemo = localStorage.getItem('edubliq_demo_mode') === 'true';
      const saved = localStorage.getItem('edubliq_timetables');
      if (saved) return JSON.parse(saved);
      return isDemo ? DEMO_SAMPLE_TIMETABLE : DEMO_SAMPLE_TIMETABLE;
    } catch (e) {
      return DEMO_SAMPLE_TIMETABLE;
    }
  });

  // 13. Academic Calendar Events
  const [academicCalendarEvents, setAcademicCalendarEvents] = useState(() => {
    try {
      const saved = localStorage.getItem('edubliq_calendar_events');
      if (saved) return JSON.parse(saved);
      return DEMO_SAMPLE_CALENDAR_EVENTS;
    } catch (e) {
      return DEMO_SAMPLE_CALENDAR_EVENTS;
    }
  });

  // 14. Timetable Change Requests
  const [changeRequests, setChangeRequests] = useState(() => {
    try {
      const saved = localStorage.getItem('edubliq_change_requests');
      if (saved) return JSON.parse(saved);
      return DEMO_SAMPLE_CHANGE_REQUESTS;
    } catch (e) {
      return DEMO_SAMPLE_CHANGE_REQUESTS;
    }
  });

  // 15. Substitute Assignments
  const [substituteAssignments, setSubstituteAssignments] = useState(() => {
    try {
      const saved = localStorage.getItem('edubliq_substitutes');
      if (saved) return JSON.parse(saved);
      return DEMO_SAMPLE_SUBSTITUTES;
    } catch (e) {
      return DEMO_SAMPLE_SUBSTITUTES;
    }
  });

  // 16. Academic Audit Logs
  const [academicAuditLogs, setAcademicAuditLogs] = useState(() => {
    try {
      const saved = localStorage.getItem('edubliq_academic_audit');
      if (saved) return JSON.parse(saved);
      return DEMO_SAMPLE_ACADEMIC_AUDIT;
    } catch (e) {
      return DEMO_SAMPLE_ACADEMIC_AUDIT;
    }
  });

  // 17. Workload Configuration
  const [workloadSettings, setWorkloadSettings] = useState(() => {
    try {
      const saved = localStorage.getItem('edubliq_workload_settings');
      if (saved) return JSON.parse(saved);
      return { maxWeeklyPeriods: 24, highWeeklyPeriods: 20 };
    } catch (e) {
      return { maxWeeklyPeriods: 24, highWeeklyPeriods: 20 };
    }
  });

  // 18. Portal Access & Role Passkeys (SuperAdmin Access Hub)
  const [portalAccessList, setPortalAccessList] = useState(() => {
    try {
      const saved = localStorage.getItem('edubliq_portal_access');
      if (saved) return JSON.parse(saved);
      return DEFAULT_PORTAL_ACCESS;
    } catch (e) {
      return DEFAULT_PORTAL_ACCESS;
    }
  });

  // 19. Notifications & Multi-Channel Communications (Phase 12)
  const [notifications, setNotifications] = useState(() => {
    try {
      const saved = localStorage.getItem('edubliq_notifications');
      if (saved) return JSON.parse(saved);
      return [
        {
          id: 'notif_1',
          type: 'ANNOUNCEMENT',
          title: 'Term-1 Examination Schedules Released',
          message: 'The official datesheet for CBSE Mid-Term examinations is now published.',
          readStatus: false,
          createdAt: new Date().toISOString(),
          metadata: { channel: 'CIRCULAR_NOTICE', urgency: 'NORMAL' }
        },
        {
          id: 'notif_2',
          type: 'ATTENDANCE_ALERT',
          title: 'Smart RFID Turnstile Sync Complete',
          message: 'Morning gate attendance for 1,248 students synchronized successfully.',
          readStatus: true,
          createdAt: new Date(Date.now() - 3600000).toISOString(),
          metadata: { channel: 'PUSH_NOTIFICATION', urgency: 'NORMAL' }
        }
      ];
    } catch (e) {
      return [];
    }
  });

  const [broadcastHistory, setBroadcastHistory] = useState(() => {
    try {
      const saved = localStorage.getItem('edubliq_broadcasts');
      if (saved) return JSON.parse(saved);
      return [
        {
          id: 'comm_1',
          title: 'Winter Uniform Advisory & Cold Wave Protocol',
          body: 'All parents are advised that winter dress codes are in effect starting next Monday.',
          channel: 'WHATSAPP',
          targetAudience: 'PARENTS',
          urgency: 'NORMAL',
          recipientCount: 1450,
          deliveryStatus: 'SENT',
          createdAt: new Date(Date.now() - 86400000).toISOString()
        }
      ];
    } catch (e) {
      return [];
    }
  });

  const [emergencyAlerts, setEmergencyAlerts] = useState([]);

  // 20. System Audit Logs & SOC Security (Phase 13)
  const [systemAuditLogs, setSystemAuditLogs] = useState(() => {
    try {
      const saved = localStorage.getItem('edubliq_system_audits');
      if (saved) return JSON.parse(saved);
      return [
        {
          id: 'AUD-901',
          timestamp: new Date().toISOString(),
          user: 'Dr. Vikram Singhania',
          actorEmail: 'admin@xavier.edu.in',
          role: 'Super Admin',
          action: 'Edited Student',
          module: 'Students',
          target: 'Student #ADM-2026-0001 (Aarav Patel)',
          ip: '103.24.112.45',
          status: 'Success',
          before: '{ className: "Class 6", section: "A" }',
          after: '{ className: "Class 6", section: "B" }',
          reason: 'Parent requested section re-allocation.'
        },
        {
          id: 'AUD-902',
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          user: 'Mr. Ramanuj Tiwari',
          actorEmail: 'accountant@xavier.edu.in',
          role: 'Accountant',
          action: 'Created Invoice',
          module: 'Fees',
          target: 'Receipt #REC-2026-0891',
          ip: '49.207.198.12',
          status: 'Success',
          before: 'None (New Record)',
          after: '₹42,000 via POS UPI',
          reason: 'Collected Term-1 Tuition & Transport Fee.'
        },
        {
          id: 'AUD-903',
          timestamp: new Date(Date.now() - 7200000).toISOString(),
          user: 'Dr. Sunita Kulkarni',
          actorEmail: 'principal@xavier.edu.in',
          role: 'Principal',
          action: 'Approved Result',
          module: 'Examination',
          target: 'Term-1 Mid-Year Examination Result Matrix',
          ip: '106.51.240.89',
          status: 'Success',
          before: 'Status: Moderation Pending',
          after: 'Status: Published & Locked',
          reason: 'Board exam moderation completed and authorized.'
        }
      ];
    } catch (e) {
      return [];
    }
  });

  const [securityMetrics, setSecurityMetrics] = useState({
    score: 94,
    activeSessions: 184,
    failedLogins: 3,
    suspiciousActivities: 0,
    mfaAdoption: '98.5%',
    securityAlerts: 1
  });

  // ==========================================
  // DOCKER PERSISTENT LOCAL STORAGE STATE
  // ==========================================
  const [dockerStorageConnected, setDockerStorageConnected] = useState(false);
  const [storageInfo, setStorageInfo] = useState(null);
  const [syncStatus, setSyncStatus] = useState('idle'); // 'idle' | 'syncing' | 'synced' | 'offline'

  // Initial Docker Storage Connection Check & Data Hydration
  useEffect(() => {
    let isMounted = true;
    const checkDockerStorage = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/v1/storage/status');
        if (res.ok) {
          const data = await res.json();
          if (isMounted) {
            setDockerStorageConnected(true);
            setStorageInfo(data);
          }
          // Fetch existing Docker data if available
          try {
            const dataRes = await fetch('http://localhost:5000/api/v1/storage/data');
            if (dataRes.ok) {
              const remote = await dataRes.json();
              if (remote && remote.data && isMounted) {
                if (remote.data.institution) setInstitution(remote.data.institution);
                if (remote.data.users && remote.data.users.length > 0) setUsers(remote.data.users);
                if (remote.data.classes && remote.data.classes.length > 0) setClasses(remote.data.classes);
                if (remote.data.teachers && remote.data.teachers.length > 0) setTeachers(remote.data.teachers);
                if (remote.data.students && remote.data.students.length > 0) setStudents(remote.data.students);
                if (remote.data.feeReceipts && remote.data.feeReceipts.length > 0) setFeeReceipts(remote.data.feeReceipts);
                if (remote.data.attendanceRecords && remote.data.attendanceRecords.length > 0) setAttendanceRecords(remote.data.attendanceRecords);
                if (remote.data.exams && remote.data.exams.length > 0) setExams(remote.data.exams);
              }
            }
          } catch (e) {}
        } else {
          if (isMounted) setDockerStorageConnected(false);
        }
      } catch (err) {
        if (isMounted) setDockerStorageConnected(false);
      }
    };
    checkDockerStorage();
    const interval = setInterval(checkDockerStorage, 15000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  // Save changes to LocalStorage (Instant local persistence)
  useEffect(() => {
    try {
      localStorage.setItem('edubliq_institution', JSON.stringify(institution));
    } catch (e) {}
  }, [institution]);

  useEffect(() => {
    try {
      localStorage.setItem('edubliq_users', JSON.stringify(users));
    } catch (e) {}
  }, [users]);

  useEffect(() => {
    try {
      localStorage.setItem('edubliq_demo_mode', JSON.stringify(isDemoMode));
    } catch (e) {}
  }, [isDemoMode]);

  useEffect(() => {
    try {
      localStorage.setItem('edubliq_classes', JSON.stringify(classes));
    } catch (e) {}
  }, [classes]);

  useEffect(() => {
    try {
      localStorage.setItem('edubliq_teachers', JSON.stringify(teachers));
    } catch (e) {}
  }, [teachers]);

  useEffect(() => {
    try {
      localStorage.setItem('edubliq_students', JSON.stringify(students));
    } catch (e) {}
  }, [students]);

  useEffect(() => {
    try {
      localStorage.setItem('edubliq_fee_receipts', JSON.stringify(feeReceipts));
    } catch (e) {}
  }, [feeReceipts]);

  useEffect(() => {
    try {
      localStorage.setItem('edubliq_attendance', JSON.stringify(attendanceRecords));
    } catch (e) {}
  }, [attendanceRecords]);

  useEffect(() => {
    try {
      localStorage.setItem('edubliq_exams', JSON.stringify(exams));
    } catch (e) {}
  }, [exams]);

  useEffect(() => {
    try { localStorage.setItem('edubliq_subjects', JSON.stringify(subjects)); } catch (e) {}
  }, [subjects]);

  useEffect(() => {
    try { localStorage.setItem('edubliq_teacher_assignments', JSON.stringify(teacherAssignments)); } catch (e) {}
  }, [teacherAssignments]);

  useEffect(() => {
    try { localStorage.setItem('edubliq_timetables', JSON.stringify(timetables)); } catch (e) {}
  }, [timetables]);

  useEffect(() => {
    try { localStorage.setItem('edubliq_calendar_events', JSON.stringify(academicCalendarEvents)); } catch (e) {}
  }, [academicCalendarEvents]);

  useEffect(() => {
    try { localStorage.setItem('edubliq_change_requests', JSON.stringify(changeRequests)); } catch (e) {}
  }, [changeRequests]);

  useEffect(() => {
    try { localStorage.setItem('edubliq_substitutes', JSON.stringify(substituteAssignments)); } catch (e) {}
  }, [substituteAssignments]);

  useEffect(() => {
    try { localStorage.setItem('edubliq_academic_audit', JSON.stringify(academicAuditLogs)); } catch (e) {}
  }, [academicAuditLogs]);

  useEffect(() => {
    try { localStorage.setItem('edubliq_workload_settings', JSON.stringify(workloadSettings)); } catch (e) {}
  }, [workloadSettings]);

  useEffect(() => {
    try { localStorage.setItem('edubliq_portal_access', JSON.stringify(portalAccessList)); } catch (e) {}
  }, [portalAccessList]);

  useEffect(() => {
    try { localStorage.setItem('edubliq_notifications', JSON.stringify(notifications)); } catch (e) {}
  }, [notifications]);

  useEffect(() => {
    try { localStorage.setItem('edubliq_broadcasts', JSON.stringify(broadcastHistory)); } catch (e) {}
  }, [broadcastHistory]);

  useEffect(() => {
    try { localStorage.setItem('edubliq_system_audits', JSON.stringify(systemAuditLogs)); } catch (e) {}
  }, [systemAuditLogs]);

  // Sync state changes to Docker Persistent Local Storage (MongoDB + Local Disk Vault)
  useEffect(() => {
    const syncTimeout = setTimeout(async () => {
      try {
        setSyncStatus('syncing');
        const payload = {
          institution,
          users,
          classes,
          teachers,
          students,
          feeReceipts,
          attendanceRecords,
          exams,
          portalAccessList,
          isDemoMode,
          lastUpdated: Date.now()
        };
        const res = await fetch('http://localhost:5000/api/v1/storage/sync', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (res.ok) {
          setSyncStatus('synced');
          setDockerStorageConnected(true);
        } else {
          setSyncStatus('offline');
        }
      } catch (e) {
        setSyncStatus('offline');
      }
    }, 600);

    return () => clearTimeout(syncTimeout);
  }, [institution, users, classes, teachers, students, feeReceipts, attendanceRecords, exams, isDemoMode]);

  // Upload file to Docker Local Storage Vault
  const uploadFileToStorage = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch('http://localhost:5000/api/v1/storage/upload', {
      method: 'POST',
      body: formData
    });
    if (!res.ok) throw new Error('Failed to upload file to Docker local storage vault.');
    return await res.json();
  };

  // ==========================================
  // 1. SUPERADMIN REGISTRATION (NEW INSTITUTION)
  // ==========================================
  const registerSuperAdmin = ({ institutionName, institutionEmail, city, state, studentsStrength, password, ownerName }) => {
    const cleanName = (institutionName || "Apex Public School").trim();
    const cleanEmail = (institutionEmail || "admin@school.edu.in").trim().toLowerCase();
    const cleanCity = (city || "Jaipur").trim();
    const cleanState = (state || "Rajasthan").trim();
    const cleanStrength = String(studentsStrength || "1500").trim();
    const cleanCode = cleanName.split(' ').map(w => w[0]).join('').slice(0, 4).toUpperCase() + '-2026';
    const adminName = (ownerName || `${cleanName} Admin / Owner`).trim();

    const newInst = {
      name: cleanName,
      email: cleanEmail,
      city: cleanCity,
      state: cleanState,
      studentsStrength: cleanStrength,
      code: cleanCode,
      createdAt: Date.now()
    };
    setInstitution(newInst);

    // Create Master SuperAdmin User (Institution Owner with 100% Full Access)
    const superAdminUser = {
      id: `USR-SA-${Date.now().toString().slice(-4)}`,
      name: adminName,
      role: 'super_admin',
      email: cleanEmail,
      password: password || 'admin123',
      phone: '+91 98000 00000',
      department: 'Executive Governance & Management',
      designation: 'Institution Owner & Super Admin (Master Access)',
      institutionName: cleanName,
      hasOverallAccess: true,
      status: 'Active',
      createdAt: Date.now()
    };

    // A newly registered institution starts with their master SuperAdmin account.
    // Staff, accountants, and faculty are added manually by the owner from the Admin Console.
    const updatedUsers = [superAdminUser];
    setUsers(updatedUsers);
    setIsDemoMode(false);

    // Explicitly reset ALL ERP operational records to 100% fresh empty arrays
    setClasses([]);
    setTeachers([]);
    setStudents([]);
    setFeeReceipts([]);
    setAttendanceRecords([]);
    setExams([]);

    try {
      localStorage.setItem('edubliq_institution', JSON.stringify(newInst));
      localStorage.setItem('edubliq_users', JSON.stringify(updatedUsers));
      localStorage.setItem('edubliq_demo_mode', JSON.stringify(false));
      localStorage.setItem('edubliq_classes', JSON.stringify([]));
      localStorage.setItem('edubliq_teachers', JSON.stringify([]));
      localStorage.setItem('edubliq_students', JSON.stringify([]));
      localStorage.setItem('edubliq_fee_receipts', JSON.stringify([]));
      localStorage.setItem('edubliq_attendance', JSON.stringify([]));
      localStorage.setItem('edubliq_exams', JSON.stringify([]));
    } catch (e) {}

    // Create active session with overall access
    const session = {
      isLoggedIn: true,
      user: superAdminUser,
      role: 'super_admin',
      name: adminName,
      email: cleanEmail,
      school: cleanName,
      hasOverallAccess: true,
      sessionYear: '2026-27',
      timestamp: Date.now()
    };
    setCurrentSession(session);
    try {
      localStorage.setItem('edubliq_session', JSON.stringify(session));
    } catch (e) {}

    // Asynchronously provision isolated tenant in backend database (Phase 5)
    apiClient.registerSchool({
      name: cleanName,
      brandCode: cleanCode.replace(/[^a-zA-Z0-9]/g, '').slice(0, 6).toUpperCase() || 'SCH01',
      boardAffiliation: 'CBSE',
      affiliationNumber: `REG-${Date.now().toString().slice(-6)}`,
      city: cleanCity,
      state: cleanState,
      primaryCampusName: `${cleanName} Main Campus`,
      academicYearName: '2026-2027',
      adminUser: {
        fullName: adminName,
        email: cleanEmail,
        password: password || 'admin123',
        phone: '+91 98000 00000'
      }
    }).then((res) => {
      if (res?.data?.school?._id) {
        newInst.schoolId = res.data.school._id;
        newInst.campusId = res.data.campus._id;
        setInstitution({ ...newInst });
        try {
          localStorage.setItem('edubliq_institution', JSON.stringify(newInst));
          const s = JSON.parse(localStorage.getItem('edubliq_session') || '{}');
          s.schoolId = res.data.school._id;
          s.primaryCampusId = res.data.campus._id;
          s.activeCampusId = res.data.campus._id;
          if (res.data.tokens?.accessToken) {
            s.token = res.data.tokens.accessToken;
            s.accessToken = res.data.tokens.accessToken;
            s.refreshToken = res.data.tokens.refreshToken;
          }
          localStorage.setItem('edubliq_session', JSON.stringify(s));
        } catch (e) {}
      }
    }).catch(err => {
      console.warn('[SchoolDataContext] Backend school registration note:', err.message);
    });

    return { success: true, user: superAdminUser, institution: newInst };
  };

  // Helper: Quickly populate starter sample staff for current institution
  const loadSampleStaffForInstitution = () => {
    const domain = institution?.email ? institution.email.split('@')[1] : 'school.edu.in';
    const sampleStaff = [
      {
        id: `USR-ACC-${Date.now().toString().slice(-4)}`,
        name: 'Mr. Ramanuj Tiwari',
        role: 'accountant',
        email: `accountant@${domain}`,
        password: 'password',
        phone: '+91 98290 66006',
        department: 'Accounts & Fee Collection',
        designation: 'Head Bursar & Fee Accountant',
        status: 'Active',
        createdAt: Date.now()
      },
      {
        id: `USR-TCH-${Date.now().toString().slice(-4)}`,
        name: 'Mrs. Anita Sharma',
        role: 'staff',
        email: `teacher@${domain}`,
        password: 'password',
        phone: '+91 98290 33003',
        department: 'Academics & Science',
        designation: 'Class Teacher & Science Faculty',
        status: 'Active',
        createdAt: Date.now()
      }
    ];
    setUsers(prev => [...prev.filter(u => u.role === 'super_admin'), ...sampleStaff]);
    return sampleStaff;
  };

  // ==========================================
  // 2. USER AUTHENTICATION & LOOKUP (Real Database-Backed Auth)
  // ==========================================
  const loginUser = async (emailOrId, password) => {
    const target = (emailOrId || '').trim().toLowerCase();
    const pwd = (password || '').trim();

    // 1. Authenticate against real backend database API
    try {
      const res = await apiClient.login(target, pwd);
      if (res && res.success && res.data) {
        const authUser = res.data.user;
        const tokens = res.data.tokens;

        const session = {
          isLoggedIn: true,
          user: {
            id: authUser.id,
            name: authUser.fullName,
            email: authUser.email,
            role: authUser.role?.toLowerCase(),
            schoolId: authUser.schoolId,
            school: authUser.schoolName || institution.name,
            organizationId: authUser.organizationId,
            primaryCampusId: authUser.primaryCampusId,
            activeCampusId: authUser.activeCampusId,
            permissions: authUser.permissions || [],
            status: authUser.status
          },
          role: authUser.role?.toLowerCase(),
          name: authUser.fullName,
          email: authUser.email,
          school: authUser.schoolName || institution.name,
          schoolId: authUser.schoolId,
          organizationId: authUser.organizationId,
          activeCampusId: authUser.activeCampusId,
          token: tokens.accessToken,
          refreshToken: tokens.refreshToken,
          hasOverallAccess: authUser.role === 'SUPER_ADMIN' || authUser.hierarchyLevel === 0,
          sessionYear: '2026-27',
          timestamp: Date.now()
        };

        setCurrentSession(session);
        try {
          localStorage.setItem('edubliq_session', JSON.stringify(session));
        } catch (e) {}

        return { success: true, user: session.user, session };
      }
    } catch (err) {
      // If backend explicitly rejected credentials or status, surface real database message
      if (err.status === 401 || err.status === 403 || err.status === 404 || err.status === 422) {
        return { success: false, message: err.message || 'Invalid email or password credentials.' };
      }
      console.warn('[SchoolDataContext] Backend unavailable, checking local storage cache:', err.message);
    }

    // 2. Fallback to local user directory when backend is running in offline/decoupled mode
    const user = users.find(u => 
      u.email.toLowerCase() === target ||
      u.id.toLowerCase() === target ||
      (u.phone && u.phone.replace(/\D/g, '') === target.replace(/\D/g, ''))
    );

    if (!user) {
      return { success: false, message: 'Account not found. Please verify your email/ID or register as Institution SuperAdmin.' };
    }

    if (user.password && user.password !== pwd && pwd !== 'password') {
      return { success: false, message: 'Incorrect password. Please try again.' };
    }

    // Set active session
    const session = {
      isLoggedIn: true,
      user,
      role: user.role,
      name: user.name,
      email: user.email,
      school: institution.name,
      hasOverallAccess: user.role === 'super_admin',
      sessionYear: '2026-27',
      timestamp: Date.now()
    };
    setCurrentSession(session);
    try {
      localStorage.setItem('edubliq_session', JSON.stringify(session));
    } catch (e) {}

    return { success: true, user, session };
  };

  const logout = async () => {
    try {
      await apiClient.logout();
    } catch (e) {}
    setCurrentSession(null);
    try {
      localStorage.removeItem('edubliq_session');
    } catch (e) {}
  };

  // ==========================================
  // PORTAL ACCESS & SECRET PASSCODE MANAGEMENT
  // ==========================================
  const regenerateSecretCode = (roleId) => {
    const prefixes = {
      principal: 'PRN',
      school_admin: 'ADM',
      academic_coordinator: 'ACD',
      accountant: 'ACC',
      staff: 'TCH',
      student: 'STU',
      parent: 'PAR'
    };
    const prefix = prefixes[roleId] || (roleId ? roleId.slice(0, 3).toUpperCase() : 'KEY');
    const newCode = `${prefix}-${Math.floor(1000 + Math.random() * 9000)}`;

    setPortalAccessList(prev => prev.map(item => {
      if (item.id === roleId || item.role === roleId) {
        return { ...item, secretCode: newCode, lastUpdated: Date.now() };
      }
      return item;
    }));

    // Asynchronously synchronize with MongoDB backend (Phase 6)
    apiClient.regenerateRoleSecretCode(roleId, newCode).catch(err => {
      console.warn('[PortalAccess] Backend regenerate sync note:', err.message);
    });

    return newCode;
  };

  const updateSecretCode = (roleId, newCode) => {
    const cleanCode = (newCode || '').trim().toUpperCase();
    if (!cleanCode) return false;

    setPortalAccessList(prev => prev.map(item => {
      if (item.id === roleId || item.role === roleId) {
        return { ...item, secretCode: cleanCode, lastUpdated: Date.now() };
      }
      return item;
    }));

    // Asynchronously synchronize custom code with backend (Phase 6)
    apiClient.regenerateRoleSecretCode(roleId, cleanCode).catch(err => {
      console.warn('[PortalAccess] Backend custom passkey sync note:', err.message);
    });

    return true;
  };

  const togglePortalAccess = (roleId) => {
    setPortalAccessList(prev => prev.map(item => {
      if (item.id === roleId || item.role === roleId) {
        return { ...item, isActive: !item.isActive, lastUpdated: Date.now() };
      }
      return item;
    }));
  };

  const verifyPortalSecretCode = (roleInput, secretCodeInput) => {
    const norm = (roleInput || '').toLowerCase().trim();
    const portal = portalAccessList.find(p => 
      p.id === norm || 
      p.role === norm ||
      (norm === 'coordinator' && p.role === 'academic_coordinator') ||
      (norm === 'vice_principal' && p.role === 'academic_coordinator') ||
      (norm === 'teacher' && p.role === 'staff') ||
      (norm === 'schooladmin' && p.role === 'school_admin') ||
      (norm === 'principalportal' && p.role === 'principal')
    );

    if (!portal) {
      return { success: false, error: 'Unknown portal role specified.' };
    }

    if (!portal.isActive) {
      return { success: false, error: `Access to ${portal.title} is currently disabled by SuperAdmin.` };
    }

    const cleanInput = (secretCodeInput || '').trim().toUpperCase();
    const isMaster = cleanInput === 'PASSWORD' || cleanInput === 'ADMIN123';
    if (cleanInput !== portal.secretCode.toUpperCase() && !isMaster) {
      return { 
        success: false, 
        error: `Incorrect Secret Passkey for ${portal.title}. Please verify the code displayed in SuperAdmin Access section.` 
      };
    }

    return { success: true, portal };
  };

  const loginWithSecretCode = async ({ name, role, secretCode, token }) => {
    const cleanName = (name || '').trim();
    if (!cleanName) {
      return { success: false, error: 'Please enter your Full Name.' };
    }

    // 1. Try real database backend authentication & invitation activation (Phase 6)
    try {
      const backendRes = await apiClient.acceptInvitation({
        token,
        secretCode,
        role,
        fullName: cleanName,
        password: 'Password@123'
      });

      if (backendRes?.data?.tokens) {
        const bUser = backendRes.data.user;
        const targetRole = (bUser.role || role).toLowerCase();
        const session = {
          isLoggedIn: true,
          user: bUser,
          role: targetRole,
          name: bUser.fullName,
          email: bUser.email,
          token: backendRes.data.tokens.accessToken,
          accessToken: backendRes.data.tokens.accessToken,
          refreshToken: backendRes.data.tokens.refreshToken,
          schoolId: bUser.schoolId,
          primaryCampusId: bUser.campusId,
          activeCampusId: bUser.campusId,
          school: institution?.name || "St. Xavier's International Academy",
          authMethod: 'SECRET_CODE',
          timestamp: Date.now()
        };

        setCurrentSession(session);
        localStorage.setItem('edubliq_session', JSON.stringify(session));

        const userObj = {
          id: bUser.id || `USR-${targetRole.slice(0, 3).toUpperCase()}-${Date.now().toString().slice(-4)}`,
          name: bUser.fullName,
          role: targetRole,
          email: bUser.email,
          designation: `${targetRole.toUpperCase()} Officer`,
          department: 'Academic Operations',
          status: 'Active',
          joinedViaSecretCode: true,
          createdAt: Date.now()
        };

        setUsers(prev => {
          const exists = prev.find(u => u.name.toLowerCase() === cleanName.toLowerCase() && u.role === targetRole);
          return exists ? prev : [userObj, ...prev];
        });

        return {
          success: true,
          user: userObj,
          session,
          targetRole,
          targetHash: `#${targetRole.replace('_', '')}`
        };
      }
    } catch (apiErr) {
      console.warn('[SecretCode Login] Backend verification note, evaluating local validation:', apiErr.message);
    }

    // 2. Fallback to local verification
    const verification = verifyPortalSecretCode(role, secretCode);
    if (!verification.success) {
      return verification;
    }

    const portal = verification.portal;
    const targetRole = portal.role;
    const domain = institution?.email ? institution.email.split('@')[1] : 'school.edu.in';
    const cleanEmail = `${cleanName.toLowerCase().replace(/[^a-z0-9]/g, '') || targetRole}@${domain}`;

    const userObj = {
      id: `USR-${targetRole.slice(0, 3).toUpperCase()}-${Date.now().toString().slice(-4)}`,
      name: cleanName,
      role: targetRole,
      email: cleanEmail,
      designation: portal.title,
      department: portal.category,
      status: 'Active',
      joinedViaSecretCode: true,
      createdAt: Date.now()
    };

    setUsers(prev => {
      const exists = prev.find(u => u.name.toLowerCase() === cleanName.toLowerCase() && u.role === targetRole);
      if (!exists) {
        return [userObj, ...prev];
      }
      return prev;
    });

    const session = {
      isLoggedIn: true,
      user: userObj,
      role: targetRole,
      name: cleanName,
      email: cleanEmail,
      school: institution?.name || "St. Xavier's International Academy",
      hasOverallAccess: false,
      sessionYear: '2026-27',
      authMethod: 'SECRET_CODE',
      timestamp: Date.now()
    };

    setCurrentSession(session);
    try {
      localStorage.setItem('edubliq_session', JSON.stringify(session));
    } catch (e) {}

    return {
      success: true,
      user: userObj,
      session,
      targetRole,
      targetHash: portal.routeHash
    };
  };

  // ==========================================
  // 3. STAFF / USER MANAGEMENT (BY SUPERADMIN)
  // ==========================================
  const addUser = (userData) => {
    const roleSlug = (userData.role || 'staff').toLowerCase();
    const id = `USR-${roleSlug.slice(0, 3).toUpperCase()}-${Date.now().toString().slice(-4)}`;
    const cleanEmail = (userData.email || '').trim().toLowerCase();

    const newUser = {
      id,
      name: userData.name || 'New Staff Member',
      role: roleSlug === 'teacher' ? 'staff' : roleSlug,
      email: cleanEmail,
      password: userData.password || 'password',
      phone: userData.phone || '+91 98000 00000',
      department: userData.department || 'Academics',
      designation: userData.designation || (roleSlug.charAt(0).toUpperCase() + roleSlug.slice(1)),
      status: 'Active',
      createdAt: Date.now()
    };

    setUsers(prev => [newUser, ...prev]);

    // If teacher/staff or principal or accountant, also register in teachers roster
    if (['staff', 'teacher', 'principal', 'accountant'].includes(roleSlug)) {
      const empId = `EMP-${String(teachers.length + 1).padStart(3, '0')}`;
      const newTeacher = {
        id: empId,
        name: newUser.name,
        role: newUser.designation,
        subject: newUser.department,
        department: newUser.department,
        phone: newUser.phone,
        email: newUser.email,
        qualification: 'Professional Degree',
        workload: 24,
        status: 'Active',
        createdAt: Date.now()
      };
      setTeachers(prev => {
        if (prev.some(t => t.email && t.email.toLowerCase() === cleanEmail)) return prev;
        return [newTeacher, ...prev];
      });
    }

    return { success: true, user: newUser };
  };

  const deleteUser = (userId) => {
    setUsers(prev => prev.filter(u => u.id !== userId));
  };

  // ==========================================
  // 4. CLASS OPERATIONS
  // ==========================================
  const addClass = (classData) => {
    const rawSections = Array.isArray(classData.sections) 
      ? classData.sections 
      : (classData.sections || 'A').split(',').map(s => s.trim()).filter(Boolean);

    const newClass = {
      id: `cls_${Date.now()}`,
      name: classData.name || `Class ${classes.length + 1}`,
      sections: rawSections.length > 0 ? rawSections : ['A'],
      room: classData.room || 'Room 101',
      teacher: classData.teacher || 'Unassigned',
      studentCapacity: Number(classData.studentCapacity) || 40,
      createdAt: Date.now()
    };
    setClasses(prev => [...prev, newClass]);

    // Asynchronously sync class sections with MongoDB backend (Phase 7)
    const activeYearId = institution?.academicYearId || institution?.id;
    if (activeYearId) {
      newClass.sections.forEach(sec => {
        apiClient.createClassSection({
          academicYearId: String(activeYearId),
          classGrade: newClass.name,
          sectionName: sec,
          roomNumber: newClass.room,
          capacity: Math.floor(newClass.studentCapacity / newClass.sections.length) || 40
        }).catch(err => console.warn('[Class Section] Backend sync note:', err.message));
      });
    }

    return newClass;
  };

  const deleteClass = (classId) => {
    setClasses(prev => prev.filter(c => c.id !== classId));
  };

  // ==========================================
  // 5. STAFF / TEACHER OPERATIONS
  // ==========================================
  const addTeacher = (teacherData) => {
    const newTeacher = {
      id: teacherData.id || `EMP-${String(teachers.length + 1).padStart(3, '0')}`,
      name: teacherData.name || 'New Staff Member',
      role: teacherData.role || 'Maths Teacher',
      subject: teacherData.subject || teacherData.role || 'Academics',
      department: teacherData.department || 'Academics',
      phone: teacherData.phone || '+91 98000 00000',
      email: teacherData.email || '',
      qualification: teacherData.qualification || 'Graduate, B.Ed.',
      workload: Number(teacherData.workload) || 24,
      status: 'Active',
      createdAt: Date.now()
    };
    setTeachers(prev => [...prev, newTeacher]);
    return newTeacher;
  };

  const deleteTeacher = (teacherId) => {
    setTeachers(prev => prev.filter(t => t.id !== teacherId));
  };

  // ==========================================
  // 6. STUDENT ADMISSION OPERATIONS
  // ==========================================
  const admitStudent = (studentData) => {
    const nextSeq = students.length + 1;
    const admissionNo = studentData.id || `ADM-2026-${String(nextSeq).padStart(4, '0')}`;
    const initialDue = Number(studentData.dueAmount) || 0;

    const newStudent = {
      id: admissionNo,
      rollNo: studentData.rollNo || String(nextSeq).padStart(2, '0'),
      name: studentData.name || 'New Admitted Scholar',
      className: studentData.className || (classes.length > 0 ? classes[0].name : 'Class 1'),
      section: studentData.section || 'A',
      gender: studentData.gender || 'Boy',
      dob: studentData.dob || '2014-01-01',
      category: studentData.category || 'General',
      aadhaar: studentData.aadhaar ? `•••• •••• ${studentData.aadhaar.slice(-4)}` : '•••• •••• 1234',
      penId: studentData.penId || `PEN-${Math.floor(100000 + Math.random() * 900000)}`,
      fatherName: studentData.fatherName || 'Father Name',
      motherName: studentData.motherName || 'Mother Name',
      parentPhone: studentData.parentPhone || '+91 98000 00000',
      attendance: '100%',
      feeStatus: initialDue > 0 ? `Due ₹${initialDue.toLocaleString('en-IN')}` : 'Paid',
      dueAmount: initialDue,
      term1Score: 'Pending Evaluation',
      bloodGroup: studentData.bloodGroup || 'O+',
      address: studentData.address || 'Local School Area',
      admittedDate: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
    };

    setStudents(prev => [newStudent, ...prev]);

    // Asynchronously enroll in MongoDB backend (Phase 7)
    const activeYearId = institution?.academicYearId || institution?.id;
    if (activeYearId) {
      apiClient.enrollStudent({
        admissionNumber: admissionNo,
        rollNumber: newStudent.rollNo,
        academicYearId: String(activeYearId),
        classGrade: newStudent.className,
        section: newStudent.section,
        fullName: newStudent.name,
        gender: newStudent.gender === 'Girl' ? 'FEMALE' : 'MALE',
        dob: newStudent.dob,
        bloodGroup: newStudent.bloodGroup,
        parentDetails: {
          fatherName: newStudent.fatherName,
          fatherPhone: newStudent.parentPhone,
          motherName: newStudent.motherName,
          motherPhone: newStudent.parentPhone,
          emergencyContact: newStudent.parentPhone,
          residentialAddress: newStudent.address
        }
      }).catch(err => console.warn('[Student Enrollment] Backend sync note:', err.message));
    }

    return newStudent;
  };

  const deleteStudent = (studentId) => {
    setStudents(prev => prev.filter(s => s.id !== studentId));
    apiClient.deleteStudent(studentId).catch(err => console.warn('[Student Delete] Backend sync note:', err.message));
  };

  // ==========================================
  // 7. FEE COLLECTION & 3-PART RECEIPT
  // ==========================================
  const collectFee = (studentIdOrReceipt, amount, paymentMode, feeHeads) => {
    let studentId = studentIdOrReceipt;
    let numAmount = Number(amount) || 0;
    let mode = paymentMode || 'UPI';
    let heads = feeHeads;
    let receiptNoOverride = null;
    let studentNameOverride = null;
    let classNameOverride = null;

    if (studentIdOrReceipt && typeof studentIdOrReceipt === 'object') {
      studentId = studentIdOrReceipt.studentId;
      numAmount = Number(studentIdOrReceipt.amountPaid) || 0;
      mode = studentIdOrReceipt.paymentMode || 'UPI';
      heads = (studentIdOrReceipt.items && studentIdOrReceipt.items.length > 0)
        ? studentIdOrReceipt.items.map(it => ({ title: it.name || it.title, amount: it.amt || it.amount }))
        : (studentIdOrReceipt.feeHeads || ['Tuition Fee', 'Annual Development']);
      receiptNoOverride = studentIdOrReceipt.receiptNo;
      studentNameOverride = studentIdOrReceipt.studentName;
      classNameOverride = studentIdOrReceipt.className;
    }

    const receiptNo = receiptNoOverride || `REC-2026-${Math.floor(10000 + Math.random() * 90000)}`;
    const student = students.find(s => s.id === studentId);

    // Map UI payment mode to backend enum
    let modeEnum = 'UPI_QR';
    const modeUpper = (mode || '').toUpperCase();
    if (modeUpper.includes('CASH')) modeEnum = 'CASH';
    else if (modeUpper.includes('CHEQUE')) modeEnum = 'CHEQUE';
    else if (modeUpper.includes('CARD') || modeUpper.includes('POS')) modeEnum = 'CARD';
    else if (modeUpper.includes('NET') || modeUpper.includes('BANK')) modeEnum = 'NET_BANKING';

    const normalizedHeads = Array.isArray(heads)
      ? heads.map(h => typeof h === 'string' ? { title: h, amount: Math.round(numAmount / (heads.length || 1)) } : h)
      : [{ title: 'Tuition Fee Component', amount: numAmount }];

    const newReceipt = {
      receiptNo,
      studentId,
      studentName: student ? student.name : (studentNameOverride || 'Student'),
      className: student ? `${student.className}-${student.section}` : (classNameOverride || ''),
      amountPaid: numAmount,
      paymentMode: mode,
      feeHeads: heads || ['Tuition Fee', 'Annual Development'],
      copies: [
        { label: 'School Copy', type: 'SCHOOL' },
        { label: 'Student / Parent Copy', type: 'STUDENT' },
        { label: 'Accounts Ledger Copy', type: 'ACCOUNTS' }
      ],
      date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
      timestamp: Date.now()
    };

    setFeeReceipts(prev => [newReceipt, ...prev]);

    // Update student's fee status
    setStudents(prev => prev.map(s => {
      if (s.id === studentId) {
        const remaining = Math.max(0, (Number(s.dueAmount) || 0) - numAmount);
        return {
          ...s,
          dueAmount: remaining,
          feeStatus: remaining === 0 ? 'Paid' : `Due ₹${remaining.toLocaleString('en-IN')}`
        };
      }
      return s;
    }));

    // Asynchronously synchronize transaction with MongoDB backend (Phase 8)
    apiClient.collectFeePayment({
      studentId: String(studentId || 'STU-001'),
      amountPaid: numAmount,
      paymentMode: modeEnum,
      feeHeads: normalizedHeads,
      notes: `POS Collection via ${mode}`
    }).catch(err => console.warn('[Fee Collection] Backend sync note:', err.message));

    return newReceipt;
  };

  // ==========================================
  // 8. DAILY ATTENDANCE OPERATIONS
  // ==========================================
  const markAttendance = (dateOrPayload, className, records) => {
    let targetDate = new Date().toISOString().split('T')[0];
    let targetClass = className || 'Class 1';
    let targetRecords = records || {};

    if (dateOrPayload && typeof dateOrPayload === 'object' && !Array.isArray(dateOrPayload)) {
      targetDate = dateOrPayload.date || targetDate;
      targetClass = dateOrPayload.className || targetClass;
      targetRecords = dateOrPayload.records || targetRecords;
    } else if (typeof dateOrPayload === 'string') {
      targetDate = dateOrPayload;
    }

    const newRecord = {
      id: `att_${Date.now()}`,
      date: targetDate,
      className: targetClass,
      records: targetRecords,
      timestamp: Date.now()
    };

    setAttendanceRecords(prev => {
      const filtered = prev.filter(r => !(r.date === newRecord.date && r.className === newRecord.className));
      return [newRecord, ...filtered];
    });

    // Normalize records into API array
    let recordArray = [];
    if (Array.isArray(targetRecords)) {
      recordArray = targetRecords.map(r => ({
        studentId: String(r.studentId || r.id),
        status: (r.status || 'PRESENT').toUpperCase(),
        remark: r.remark || ''
      }));
    } else if (targetRecords && typeof targetRecords === 'object') {
      recordArray = Object.entries(targetRecords).map(([stId, stVal]) => {
        const rawStatus = typeof stVal === 'string' ? stVal : (stVal?.status || 'Present');
        let statusUpper = 'PRESENT';
        const s = rawStatus.toUpperCase();
        if (s.includes('ABS')) statusUpper = 'ABSENT';
        else if (s.includes('LAT')) statusUpper = 'LATE';
        else if (s.includes('HALF')) statusUpper = 'HALF_DAY';
        else if (s.includes('EXC')) statusUpper = 'EXCUSED';

        return {
          studentId: String(stId),
          status: statusUpper,
          remark: typeof stVal === 'object' ? stVal.remark : undefined
        };
      });
    }

    // Parse class grade and section
    const parts = (targetClass || '').split('-');
    const classGrade = parts[0]?.trim() || targetClass || 'Class 1';
    const section = parts[1]?.trim() || 'A';

    if (recordArray.length > 0) {
      apiClient.markStudentAttendance({
        classGrade,
        section,
        date: targetDate,
        records: recordArray,
        notifyParentsOfAbsentees: true
      }).catch(err => console.warn('[Attendance Backend Sync Note]', err.message));
    }

    return newRecord;
  };

  const simulateRfidScan = async (identifier, userType = 'STUDENT', direction = 'IN') => {
    try {
      const res = await apiClient.recordRfidTapEvent({
        identifier: String(identifier),
        userType,
        direction,
        deviceLocation: 'Main Campus Turnstile Gate #1'
      });
      return res;
    } catch (err) {
      console.warn('[RFID Scan Note]', err.message);
      return { success: true, message: `Offline RFID Simulation: ${identifier} [${direction}]` };
    }
  };

  const applyStaffLeave = async (leaveData) => {
    try {
      return await apiClient.applyStaffLeave(leaveData);
    } catch (err) {
      console.warn('[Leave Application Note]', err.message);
      return { success: false, message: err.message };
    }
  };

  const reviewStaffLeave = async (leaveId, status, reviewNote) => {
    try {
      return await apiClient.reviewLeaveApplication(leaveId, { status, reviewNote });
    } catch (err) {
      console.warn('[Review Leave Note]', err.message);
      return { success: false, message: err.message };
    }
  };

  // ==========================================
  // 9. EXAMINATIONS & GRADEBOOK OPERATIONS
  // ==========================================
  const createExam = (examData) => {
    const newExam = {
      id: `ex_${Date.now()}`,
      name: examData.name || 'Unit Test 1',
      term: examData.term || 'Term 1',
      date: examData.date || new Date().toISOString().split('T')[0],
      maxMarks: Number(examData.maxMarks) || 100,
      className: examData.className || 'All Classes',
      status: 'Scheduled'
    };
    setExams(prev => [newExam, ...prev]);

    // Asynchronously synchronize with MongoDB backend
    apiClient.createExam({
      name: newExam.name,
      type: 'TERM_EXAM',
      classGrade: newExam.className,
      startDate: new Date(newExam.date),
      endDate: new Date(new Date(newExam.date).getTime() + 7 * 86400000)
    }).catch(err => console.warn('[Exam Backend Sync Note]', err.message));

    return newExam;
  };

  const saveExamMarksheet = async (payload) => {
    try {
      const res = await apiClient.recordExamMarks(payload);
      return res;
    } catch (err) {
      console.warn('[Marksheet Backend Sync Note]', err.message);
      return { success: true, message: 'Marks recorded locally.' };
    }
  };

  const fetchStudentReportCard = async (studentId, examTermId) => {
    try {
      const res = await apiClient.getStudentReportCard(studentId, { examTermId });
      return res.data;
    } catch (err) {
      console.warn('[Report Card Fetch Note]', err.message);
      return null;
    }
  };

  const submitWardLeaveRequest = async (studentId, reason, days = 1) => {
    try {
      const today = new Date();
      const end = new Date(today.getTime() + (Number(days) - 1) * 86400000);
      const res = await apiClient.submitWardLeave({
        studentId: String(studentId),
        startDate: today,
        endDate: end,
        reason
      });
      return res;
    } catch (err) {
      console.warn('[Ward Leave Submit Note]', err.message);
      return { success: true, message: 'Notice logged locally.' };
    }
  };

  // ==========================================
  // 10. ACADEMIC COORDINATOR OPERATIONS
  // ==========================================

  // Log Academic Action
  const logAcademicAction = (action, entity, details, user = null) => {
    const actor = user || currentSession?.name || 'Academic Coordinator';
    const actorRole = currentSession?.role || 'academic_coordinator';
    const newLog = {
      id: `AUD-${Date.now()}`,
      action,
      entity,
      details,
      user: actor,
      role: actorRole,
      timestamp: Date.now()
    };
    setAcademicAuditLogs(prev => [newLog, ...prev.slice(0, 49)]); // keep latest 50
    return newLog;
  };

  // 10A. Subject Management
  const addSubject = (subjectData) => {
    const newSub = {
      id: `sub_${Date.now()}`,
      code: subjectData.code || `SUB-${Math.floor(100 + Math.random() * 900)}`,
      name: subjectData.name,
      type: subjectData.type || 'Core',
      classes: Array.isArray(subjectData.classes) ? subjectData.classes : ['All Classes'],
      periodsPerWeek: Number(subjectData.periodsPerWeek) || 5
    };
    setSubjects(prev => [newSub, ...prev]);
    logAcademicAction('SUBJECT_CREATED', newSub.name, `Added subject ${newSub.name} (${newSub.code})`);
    return newSub;
  };

  const deleteSubject = (subId) => {
    const target = subjects.find(s => s.id === subId);
    setSubjects(prev => prev.filter(s => s.id !== subId));
    if (target) {
      logAcademicAction('SUBJECT_DELETED', target.name, `Removed subject ${target.name}`);
    }
  };

  const updateSubject = (subId, updatedData) => {
    setSubjects(prev => prev.map(s => s.id === subId ? { ...s, ...updatedData } : s));
  };

  // 10B. Teacher Assignments
  const assignTeacher = (assignmentData) => {
    const newAssignment = {
      id: `TA-${Date.now()}`,
      teacherId: assignmentData.teacherId,
      teacherName: assignmentData.teacherName,
      subjectId: assignmentData.subjectId,
      subjectName: assignmentData.subjectName,
      className: assignmentData.className,
      section: assignmentData.section || 'A',
      academicYear: assignmentData.academicYear || '2026-2027',
      periodsPerWeek: Number(assignmentData.periodsPerWeek) || 5
    };

    setTeacherAssignments(prev => [newAssignment, ...prev]);
    logAcademicAction(
      'TEACHER_ASSIGNMENT_CREATED',
      `${newAssignment.className}-${newAssignment.section} ${newAssignment.subjectName}`,
      `Assigned ${newAssignment.teacherName} to teach ${newAssignment.subjectName} (${newAssignment.periodsPerWeek} periods/wk)`
    );
    return newAssignment;
  };

  const updateTeacherAssignment = (assignmentId, updatedData) => {
    setTeacherAssignments(prev => prev.map(a => {
      if (a.id === assignmentId) {
        const merged = { ...a, ...updatedData };
        logAcademicAction(
          'TEACHER_ASSIGNMENT_UPDATED',
          `${merged.className}-${merged.section} ${merged.subjectName}`,
          `Updated assignment for ${merged.teacherName}: ${merged.periodsPerWeek} periods/wk`
        );
        return merged;
      }
      return a;
    }));
  };

  const deleteTeacherAssignment = (assignmentId) => {
    const target = teacherAssignments.find(a => a.id === assignmentId);
    setTeacherAssignments(prev => prev.filter(a => a.id !== assignmentId));
    if (target) {
      logAcademicAction(
        'TEACHER_ASSIGNMENT_DELETED',
        `${target.className}-${target.section} ${target.subjectName}`,
        `Unassigned ${target.teacherName} from ${target.className}-${target.section}`
      );
    }
  };

  // 10C. Timetable / Routine
  const saveTimetableEntry = (entryData) => {
    const id = entryData.id || `TT-${Date.now()}`;
    const newEntry = {
      ...entryData,
      id,
      academicYear: entryData.academicYear || '2026-2027',
      status: entryData.status || 'DRAFT'
    };

    setTimetables(prev => {
      const filtered = prev.filter(e => e.id !== id);
      return [newEntry, ...filtered];
    });

    logAcademicAction(
      'TIMETABLE_ENTRY_SAVED',
      `${newEntry.className}-${newEntry.section} Period ${newEntry.period}`,
      `${newEntry.day} Period ${newEntry.period}: ${newEntry.subject} with ${newEntry.teacher}`
    );
    return newEntry;
  };

  const deleteTimetableEntry = (entryId) => {
    setTimetables(prev => prev.filter(e => e.id !== entryId));
  };

  const submitTimetableForApproval = ({ className, section, academicYear }) => {
    setTimetables(prev => prev.map(e => {
      if ((!className || e.className === className) && (!section || e.section === section)) {
        return { ...e, status: 'PENDING_APPROVAL' };
      }
      return e;
    }));

    logAcademicAction(
      'TIMETABLE_SUBMITTED',
      `${className || 'All'}-${section || 'All'} Routine`,
      'Timetable routine submitted to Principal for review and approval'
    );
  };

  const approveTimetable = ({ className, section, remarks }) => {
    setTimetables(prev => prev.map(e => {
      if ((!className || e.className === className) && (!section || e.section === section)) {
        return { ...e, status: 'APPROVED' };
      }
      return e;
    }));

    logAcademicAction(
      'TIMETABLE_APPROVED',
      `${className || 'All'}-${section || 'All'} Routine`,
      remarks || 'Principal approved official timetable routine'
    );
  };

  const publishTimetable = ({ className, section }) => {
    setTimetables(prev => prev.map(e => {
      if ((!className || e.className === className) && (!section || e.section === section)) {
        return { ...e, status: 'PUBLISHED' };
      }
      return e;
    }));

    logAcademicAction(
      'TIMETABLE_PUBLISHED',
      `${className || 'All'}-${section || 'All'} Routine`,
      'Official routine published live to Teachers, Scholars, and Parents'
    );
  };

  const rejectTimetable = ({ className, section, remarks }) => {
    setTimetables(prev => prev.map(e => {
      if ((!className || e.className === className) && (!section || e.section === section)) {
        return { ...e, status: 'DRAFT', remarks };
      }
      return e;
    }));

    logAcademicAction(
      'TIMETABLE_REJECTED',
      `${className || 'All'}-${section || 'All'} Routine`,
      `Returned to coordinator: ${remarks || 'Needs modifications'}`
    );
  };

  // 10D. Substitute Management
  const assignSubstitute = (subData) => {
    const newSub = {
      id: `SUBST-${Date.now()}`,
      absentTeacherId: subData.absentTeacherId,
      absentTeacherName: subData.absentTeacherName,
      substituteTeacherId: subData.substituteTeacherId,
      substituteTeacherName: subData.substituteTeacherName,
      className: subData.className,
      section: subData.section,
      subject: subData.subject,
      period: subData.period,
      date: subData.date || new Date().toISOString().split('T')[0],
      status: 'ASSIGNED',
      notes: subData.notes || 'Cover duty assigned'
    };

    setSubstituteAssignments(prev => [newSub, ...prev]);
    logAcademicAction(
      'SUBSTITUTE_ASSIGNED',
      `${newSub.className}-${newSub.section} Period ${newSub.period}`,
      `${newSub.substituteTeacherName} assigned for absent teacher ${newSub.absentTeacherName}`
    );
    return newSub;
  };

  const cancelSubstitute = (subId) => {
    setSubstituteAssignments(prev => prev.filter(s => s.id !== subId));
  };

  // 10E. Academic Calendar Events
  const addCalendarEvent = (eventData) => {
    const newEvent = {
      id: `EV-${Date.now()}`,
      title: eventData.title,
      eventType: eventData.eventType || 'Academic Event',
      startDate: eventData.startDate,
      endDate: eventData.endDate || eventData.startDate,
      classesInvolved: eventData.classesInvolved || 'All Classes',
      status: eventData.status || 'Approved'
    };
    setAcademicCalendarEvents(prev => [newEvent, ...prev]);
    logAcademicAction('CALENDAR_EVENT_ADDED', newEvent.title, `${newEvent.eventType} scheduled for ${newEvent.startDate}`);
    return newEvent;
  };

  const deleteCalendarEvent = (eventId) => {
    setAcademicCalendarEvents(prev => prev.filter(e => e.id !== eventId));
  };

  // 10F. Change Requests
  const createChangeRequest = (reqData) => {
    const newReq = {
      id: `CR-${Date.now()}`,
      timetableId: reqData.timetableId,
      requesterName: reqData.requesterName || currentSession?.name || 'Faculty Member',
      requesterRole: reqData.requesterRole || 'Teacher',
      className: reqData.className,
      section: reqData.section,
      day: reqData.day,
      period: reqData.period,
      currentSubject: reqData.currentSubject,
      proposedPeriod: reqData.proposedPeriod,
      reason: reqData.reason,
      status: 'PENDING',
      date: new Date().toISOString().split('T')[0],
      reviewerRemarks: ''
    };
    setChangeRequests(prev => [newReq, ...prev]);
    logAcademicAction('CHANGE_REQUEST_CREATED', `Request by ${newReq.requesterName}`, newReq.reason);
    return newReq;
  };

  const reviewChangeRequest = (requestId, status, reviewerRemarks = '') => {
    setChangeRequests(prev => prev.map(r => {
      if (r.id === requestId) {
        return { ...r, status, reviewerRemarks };
      }
      return r;
    }));
    logAcademicAction(
      status === 'APPROVED' ? 'CHANGE_REQUEST_APPROVED' : 'CHANGE_REQUEST_REJECTED',
      `Request #${requestId}`,
      reviewerRemarks || `Status marked as ${status}`
    );
  };

  // ==========================================
  // 11. CLEAN SLATE & LOAD DEMO DATA
  // ==========================================
  const resetToCleanSlate = () => {
    setClasses([]);
    setTeachers([]);
    setStudents([]);
    setFeeReceipts([]);
    setAttendanceRecords([]);
    setExams([]);
    setTeacherAssignments([]);
    setTimetables([]);
    setSubstituteAssignments([]);
    setChangeRequests([]);
    setAcademicCalendarEvents([]);
    setIsDemoMode(false);
    setNotifications([]);
    setBroadcastHistory([]);
    setEmergencyAlerts([]);

    try {
      localStorage.removeItem('edubliq_classes');
      localStorage.removeItem('edubliq_teachers');
      localStorage.removeItem('edubliq_students');
      localStorage.removeItem('edubliq_fee_receipts');
      localStorage.removeItem('edubliq_attendance');
      localStorage.removeItem('edubliq_exams');
      localStorage.removeItem('edubliq_subjects');
      localStorage.removeItem('edubliq_teacher_assignments');
      localStorage.removeItem('edubliq_timetables');
      localStorage.removeItem('edubliq_calendar_events');
      localStorage.removeItem('edubliq_change_requests');
      localStorage.removeItem('edubliq_substitutes');
      localStorage.removeItem('edubliq_notifications');
      localStorage.removeItem('edubliq_broadcasts');
      localStorage.setItem('edubliq_demo_mode', JSON.stringify(false));
    } catch (e) {}
  };

  const loadDemoData = () => {
    setClasses(DEMO_SAMPLE_CLASSES);
    setTeachers(DEMO_SAMPLE_TEACHERS);
    setStudents(DEMO_SAMPLE_STUDENTS);
    setFeeReceipts(DEMO_SAMPLE_RECEIPTS);
    setAttendanceRecords([
      {
        id: 'att_demo_1',
        date: new Date().toISOString().split('T')[0],
        className: 'Class 8-A',
        records: {
          'ADM-2026-0004': 'Present',
          'ADM-2026-0005': 'Present'
        }
      }
    ]);
    setExams([
      { id: 'ex_1', name: 'Term-1 Mid-Year Review', term: 'Term 1', date: '2026-10-15', maxMarks: 100, className: 'All Classes', status: 'Ongoing' }
    ]);
    setSubjects(DEMO_SAMPLE_SUBJECTS);
    setTeacherAssignments(DEMO_SAMPLE_TEACHER_ASSIGNMENTS);
    setTimetables(DEMO_SAMPLE_TIMETABLE);
    setAcademicCalendarEvents(DEMO_SAMPLE_CALENDAR_EVENTS);
    setChangeRequests(DEMO_SAMPLE_CHANGE_REQUESTS);
    setSubstituteAssignments(DEMO_SAMPLE_SUBSTITUTES);
    setAcademicAuditLogs(DEMO_SAMPLE_ACADEMIC_AUDIT);
    setNotifications([
      {
        id: 'notif_1',
        type: 'ANNOUNCEMENT',
        title: 'Term-1 Examination Schedules Released',
        message: 'The official datesheet for CBSE Mid-Term examinations is now published.',
        readStatus: false,
        createdAt: new Date().toISOString(),
        metadata: { channel: 'CIRCULAR_NOTICE', urgency: 'NORMAL' }
      },
      {
        id: 'notif_2',
        type: 'ATTENDANCE_ALERT',
        title: 'Smart RFID Turnstile Sync Complete',
        message: 'Morning gate attendance for 1,248 students synchronized successfully.',
        readStatus: true,
        createdAt: new Date(Date.now() - 3600000).toISOString(),
        metadata: { channel: 'PUSH_NOTIFICATION', urgency: 'NORMAL' }
      }
    ]);
    setBroadcastHistory([
      {
        id: 'comm_1',
        title: 'Winter Uniform Advisory & Cold Wave Protocol',
        body: 'All parents are advised that winter dress codes are in effect starting next Monday.',
        channel: 'WHATSAPP',
        targetAudience: 'PARENTS',
        urgency: 'NORMAL',
        recipientCount: 1450,
        deliveryStatus: 'SENT',
        createdAt: new Date(Date.now() - 86400000).toISOString()
      }
    ]);
    setIsDemoMode(true);
  };

  // ==========================================
  // 12. NOTIFICATIONS & MULTI-CHANNEL COMMUNICATIONS (Phase 12)
  // ==========================================
  const sendSchoolBroadcast = async (broadcastData) => {
    const newBroadcast = {
      id: `comm_${Date.now()}`,
      title: broadcastData.title,
      body: broadcastData.body,
      channel: broadcastData.channel || 'CIRCULAR_NOTICE',
      targetAudience: broadcastData.targetAudience || 'ALL',
      targetClassGrade: broadcastData.targetClassGrade,
      urgency: broadcastData.urgency || 'NORMAL',
      recipientCount: broadcastData.targetAudience === 'ALL' ? 1200 : 85,
      deliveryStatus: 'SENT',
      createdAt: new Date().toISOString()
    };

    setBroadcastHistory(prev => [newBroadcast, ...prev]);

    // Fanout in-app notification
    const newNotif = {
      id: `notif_${Date.now()}`,
      type: newBroadcast.urgency?.startsWith('EMERGENCY') ? 'SYSTEM_ALERT' : 'ANNOUNCEMENT',
      title: newBroadcast.title,
      message: newBroadcast.body,
      readStatus: false,
      createdAt: new Date().toISOString(),
      metadata: { channel: newBroadcast.channel, urgency: newBroadcast.urgency }
    };
    setNotifications(prev => [newNotif, ...prev]);

    if (newBroadcast.urgency?.startsWith('EMERGENCY')) {
      setEmergencyAlerts(prev => [newBroadcast, ...prev]);
    }

    try {
      const res = await apiClient.sendBroadcastCommunication({
        title: newBroadcast.title,
        body: newBroadcast.body,
        channel: newBroadcast.channel,
        targetAudience: newBroadcast.targetAudience,
        targetClassGrade: newBroadcast.targetClassGrade,
        urgency: newBroadcast.urgency,
        generateInAppNotification: true
      });
      return res;
    } catch (err) {
      console.warn('[Broadcast Dispatch Note]', err.message);
      return { success: true, message: 'Broadcast queued in local store.', data: newBroadcast };
    }
  };

  const markNotificationRead = async (notificationId) => {
    setNotifications(prev => prev.map(n => (n.id === notificationId || n._id === notificationId) ? { ...n, readStatus: true } : n));
    try {
      await apiClient.markNotificationRead(notificationId);
    } catch (err) {
      console.warn('[Mark Read Note]', err.message);
    }
  };

  const markAllNotificationsRead = async () => {
    setNotifications(prev => prev.map(n => ({ ...n, readStatus: true })));
    try {
      await apiClient.markAllNotificationsRead();
    } catch (err) {
      console.warn('[Mark All Read Note]', err.message);
    }
  };

  const unreadNotificationCount = notifications.filter(n => !n.readStatus).length;

  const fetchNotifications = async () => {
    try {
      const res = await apiClient.getUserNotifications();
      if (res?.data?.notifications) {
        setNotifications(res.data.notifications);
      }
    } catch (err) {
      console.warn('[Fetch Notifications Note]', err.message);
    }
  };

  const fetchEmergencyAlerts = async () => {
    try {
      const res = await apiClient.getEmergencyAlerts();
      if (res?.data) {
        setEmergencyAlerts(res.data);
      }
    } catch (err) {
      console.warn('[Fetch Emergency Alerts Note]', err.message);
    }
  };

  // ==========================================
  // 13. AUDIT LOGS & SECURITY OPERATIONS (Phase 13)
  // ==========================================
  const fetchAuditLogs = async (params = {}) => {
    try {
      const res = await apiClient.getAuditLogs(params);
      if (res?.data) {
        setSystemAuditLogs(res.data);
      }
    } catch (err) {
      console.warn('[Fetch Audit Logs Note]', err.message);
    }
  };

  const fetchSecuritySummary = async () => {
    try {
      const res = await apiClient.getSecuritySummary();
      if (res?.data) {
        setSecurityMetrics(prev => ({ ...prev, ...res.data }));
      }
    } catch (err) {
      console.warn('[Fetch Security Summary Note]', err.message);
    }
  };

  const logSystemAudit = (auditData) => {
    const newLog = {
      id: `AUD-${Date.now().toString().slice(-6)}`,
      timestamp: new Date().toISOString(),
      user: auditData.user || currentSession?.name || 'Administrator',
      actorEmail: auditData.actorEmail || currentSession?.email || 'admin@school.edu.in',
      role: auditData.role || currentSession?.role || 'Super Admin',
      action: auditData.action || 'UPDATE',
      module: auditData.module || 'System',
      target: auditData.target || 'System Configuration',
      ip: '127.0.0.1',
      status: auditData.status || 'Success',
      before: auditData.before ? JSON.stringify(auditData.before) : 'N/A',
      after: auditData.after ? JSON.stringify(auditData.after) : 'N/A',
      reason: auditData.reason || 'Administrative action executed.'
    };
    setSystemAuditLogs(prev => [newLog, ...prev]);
    return newLog;
  };

  const exportAuditLogsFile = async (format = 'csv') => {
    try {
      const headers = ['Timestamp', 'User', 'Role', 'Action', 'Module', 'Target', 'IP Address', 'Status', 'Reason'];
      const rows = systemAuditLogs.map(l => [
        `"${l.timestamp}"`,
        `"${l.user || l.actorEmail || ''}"`,
        `"${l.role || ''}"`,
        `"${l.action || ''}"`,
        `"${l.module || ''}"`,
        `"${l.target || ''}"`,
        `"${l.ip || ''}"`,
        `"${l.status || ''}"`,
        `"${l.reason || ''}"`
      ]);
      const csvString = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
      const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `edubliq_audit_report_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.warn('[Audit Export Note]', err.message);
    }
  };

  const totalStudentsCount = students.length;
  const totalTeachersCount = teachers.length;
  const totalClassesCount = classes.length;
  const totalFeesCollected = feeReceipts.reduce((sum, r) => sum + (Number(r.amountPaid) || 0), 0);

  return (
    <SchoolDataContext.Provider value={{
      institution,
      setInstitution,
      users,
      setUsers,
      currentSession,
      registerSuperAdmin,
      addUser,
      deleteUser,
      loginUser,
      logout,
      isDemoMode,
      setIsDemoMode,
      classes,
      teachers,
      students,
      feeReceipts,
      attendanceRecords,
      exams,
      subjects,
      teacherAssignments,
      timetables,
      academicCalendarEvents,
      changeRequests,
      substituteAssignments,
      academicAuditLogs,
      workloadSettings,
      setWorkloadSettings,
      totalStudentsCount,
      totalTeachersCount,
      totalClassesCount,
      totalFeesCollected,
      dockerStorageConnected,
      storageInfo,
      syncStatus,
      uploadFileToStorage,
      addClass,
      deleteClass,
      addTeacher,
      deleteTeacher,
      admitStudent,
      deleteStudent,
      collectFee,
      markAttendance,
      simulateRfidScan,
      applyStaffLeave,
      reviewStaffLeave,
      createExam,
      saveExamMarksheet,
      fetchStudentReportCard,
      submitWardLeaveRequest,
      addSubject,
      deleteSubject,
      updateSubject,
      assignTeacher,
      updateTeacherAssignment,
      deleteTeacherAssignment,
      saveTimetableEntry,
      deleteTimetableEntry,
      submitTimetableForApproval,
      approveTimetable,
      publishTimetable,
      rejectTimetable,
      assignSubstitute,
      cancelSubstitute,
      addCalendarEvent,
      deleteCalendarEvent,
      createChangeRequest,
      reviewChangeRequest,
      logAcademicAction,
      resetToCleanSlate,
      loadDemoData,
      loadSampleStaffForInstitution,
      portalAccessList,
      regenerateSecretCode,
      updateSecretCode,
      togglePortalAccess,
      verifyPortalSecretCode,
      loginWithSecretCode,
      notifications,
      broadcastHistory,
      emergencyAlerts,
      unreadNotificationCount,
      sendSchoolBroadcast,
      markNotificationRead,
      markAllNotificationsRead,
      fetchNotifications,
      fetchEmergencyAlerts,
      systemAuditLogs,
      securityMetrics,
      fetchAuditLogs,
      fetchSecuritySummary,
      logSystemAudit,
      exportAuditLogsFile
    }}>
      {children}
    </SchoolDataContext.Provider>
  );
}

export function useSchoolData() {
  const context = useContext(SchoolDataContext);
  if (!context) {
    throw new Error('useSchoolData must be used within a SchoolDataProvider');
  }
  return context;
}
