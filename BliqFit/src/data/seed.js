const STORAGE_KEY = 'bilzyfit_data';
const WORKSPACE_STORAGE_PREFIX = 'bilzyfit_workspace_';
let activeWorkspaceId = 'demo-workspace';

export const setActiveWorkspace = (workspaceId = 'demo-workspace') => {
  activeWorkspaceId = workspaceId || 'demo-workspace';
};

export const getWorkspaceStorageKey = (workspaceId = activeWorkspaceId) =>
  `${WORKSPACE_STORAGE_PREFIX}${workspaceId}`;

const migrateAccountingEntries = (data) => {
  if (Array.isArray(data.accountingEntries)) return data.accountingEntries;
  const payments = (data.payments || []).map((payment) => ({
    id: `acct-${payment.id}`,
    date: payment.date,
    type: payment.type || 'membership',
    direction: payment.amount >= 0 ? 'credit' : 'debit',
    account: payment.amount >= 0 ? 'Revenue' : 'Expense / Refund',
    amount: Math.abs(payment.amount),
    method: payment.method || '',
    referenceId: payment.id,
    invoiceNumber: payment.invoiceNumber || '',
    memberId: payment.memberId || '',
    description: payment.notes || 'Payment',
  }));
  const expenses = (data.expenses || []).map((expense) => ({
    id: `acct-${expense.id}`,
    date: expense.date,
    type: 'expense',
    direction: 'debit',
    account: 'Expense / Refund',
    amount: Number(expense.amount) || 0,
    method: expense.paymentMethod || '',
    referenceId: expense.id,
    invoiceNumber: '',
    memberId: '',
    description: `${expense.category}: ${expense.description || 'Expense'}`,
  }));
  return [...payments, ...expenses].slice(0, 250);
};

const ensureMemberSecretCodes = (members) => {
  const branchesList = [
    { branch: 'Star Fitness Center', gymName: 'Star Fitness Gym', defaultCode: '749201' },
    { branch: 'Iron Pulse Gym & Spa', gymName: 'Iron Pulse Fitness', defaultCode: '825102' },
    { branch: 'Gold Elite Fitness Hub', gymName: 'Gold Elite Fitness', defaultCode: '614923' },
    { branch: 'Olympus Power Gym', gymName: 'Olympus Gym', defaultCode: '395814' },
  ];
  return (members || []).map((m, idx) => {
    const defaultCodes = {
      'm1001': '749201',
      'GM1001': '749201',
      'm1002': '825102',
      'GM1002': '825102',
      'm1003': '614923',
      'GM1003': '614923',
      'm1004': '395814',
      'GM1004': '395814',
    };
    const bInfo = branchesList[idx % branchesList.length];
    const code = m.secretCode || defaultCodes[m.id] || defaultCodes[m.memberId] || bInfo.defaultCode;
    const branch = m.branch && m.branch !== 'Star Fitness Center' ? m.branch : bInfo.branch;
    const gymName = bInfo.gymName;
    return { ...m, secretCode: code, branch, gymName };
  });
};

// In-memory workspace cache to safeguard against QuotaExceededError or private browsing
const memoryStore = new Map();

// Helper to remove obsolete/stale keys if storage is full
function cleanupStorageQuota(currentWorkspaceId) {
  if (typeof window === 'undefined' || !window.localStorage) return;
  try {
    localStorage.removeItem(STORAGE_KEY);
    const currentKey = getWorkspaceStorageKey(currentWorkspaceId);
    const wsKeys = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && k.startsWith(WORKSPACE_STORAGE_PREFIX) && k !== currentKey) {
        wsKeys.push(k);
      }
    }
    for (const k of wsKeys) {
      if (k.includes('trial-') || wsKeys.length > 2) {
        try {
          localStorage.removeItem(k);
        } catch {}
      }
    }
  } catch (err) {
    console.warn('[BilzyFit Storage] Cleanup warning:', err);
  }
}

// Prune oversized arrays and strip massive base64 media to ensure payload fits inside localStorage
function pruneDataForStorage(data, ultra = false) {
  if (!data || typeof data !== 'object') return data;
  const clone = { ...data };

  if (Array.isArray(clone.auditLog)) clone.auditLog = clone.auditLog.slice(-25);
  if (Array.isArray(clone.attendance)) clone.attendance = clone.attendance.slice(ultra ? -40 : -120);
  if (Array.isArray(clone.accountingEntries)) clone.accountingEntries = clone.accountingEntries.slice(ultra ? -40 : -150);
  if (Array.isArray(clone.payments)) clone.payments = clone.payments.slice(ultra ? -50 : -200);
  if (Array.isArray(clone.expenses)) clone.expenses = clone.expenses.slice(ultra ? -30 : -100);
  if (Array.isArray(clone.posSales)) clone.posSales = clone.posSales.slice(-40);
  if (Array.isArray(clone.staffAttendance)) clone.staffAttendance = clone.staffAttendance.slice(-40);
  if (Array.isArray(clone.messages)) clone.messages = clone.messages.slice(-25);
  if (Array.isArray(clone.notifications)) clone.notifications = clone.notifications.slice(-25);

  const stripLargeMedia = (items, fields) => {
    if (!Array.isArray(items)) return items;
    return items.map((item) => {
      if (!item) return item;
      const copy = { ...item };
      for (const f of fields) {
        if (typeof copy[f] === 'string' && copy[f].length > 15000) {
          copy[f] = '';
        }
      }
      return copy;
    });
  };

  clone.members = stripLargeMedia(clone.members, ['photo']);
  clone.staff = stripLargeMedia(clone.staff, ['photo']);
  clone.trainers = stripLargeMedia(clone.trainers, ['photo']);
  if (clone.settings && typeof clone.settings.logo === 'string' && clone.settings.logo.length > 30000) {
    clone.settings = { ...clone.settings, logo: '' };
  }
  if (Array.isArray(clone.workouts)) {
    clone.workouts = clone.workouts.map((w) => {
      if (!w || !Array.isArray(w.exercises)) return w;
      return {
        ...w,
        exercises: w.exercises.map((e) => {
          if (e && typeof e.video === 'string' && e.video.length > 15000) {
            return { ...e, video: '' };
          }
          return e;
        }),
      };
    });
  }

  return clone;
}

export const saveData = (data, workspaceId = activeWorkspaceId) => {
  if (!data) return;
  const key = getWorkspaceStorageKey(workspaceId);
  const payload = { ...data, workspaceId };

  // 1. Maintain in-memory copy
  memoryStore.set(key, payload);

  if (typeof window === 'undefined' || !window.localStorage) return;

  try {
    localStorage.setItem(key, JSON.stringify(payload));
  } catch (err) {
    console.warn(`[BilzyFit Storage] LocalStorage write failed for ${key} (${err?.name || err}). Attempting quota recovery...`);
    try {
      cleanupStorageQuota(workspaceId);
      const pruned = pruneDataForStorage(payload, false);
      localStorage.setItem(key, JSON.stringify(pruned));
      memoryStore.set(key, pruned);
      console.info(`[BilzyFit Storage] Successfully recovered & saved pruned workspace data for ${key}`);
    } catch (secondErr) {
      console.warn(`[BilzyFit Storage] Quota still exceeded after pruning. Trying ultra-compact mode...`, secondErr?.name || secondErr);
      try {
        const ultra = pruneDataForStorage(payload, true);
        localStorage.setItem(key, JSON.stringify(ultra));
        memoryStore.set(key, ultra);
        console.info(`[BilzyFit Storage] Saved ultra-compact workspace data for ${key}`);
      } catch (thirdErr) {
        console.warn(`[BilzyFit Storage] Browser storage completely exhausted. Preserving workspace state in-memory safely:`, thirdErr?.name || thirdErr);
      }
    }
  }
};

export const getData = (workspaceId = activeWorkspaceId) => {
  const workspaceKey = getWorkspaceStorageKey(workspaceId);

  // If in-memory copy exists, use it immediately
  if (memoryStore.has(workspaceKey)) {
    return memoryStore.get(workspaceKey);
  }

  try {
    let raw = null;
    try {
      raw = localStorage.getItem(workspaceKey)
        || (workspaceId === 'demo-workspace' ? localStorage.getItem(STORAGE_KEY) : null);
    } catch (readErr) {
      console.warn('[BilzyFit Storage] Read warning:', readErr);
    }

    if (raw) {
      const parsed = JSON.parse(raw);
      const defaultBranches = generateSettings().branches;
      const parsedBranches = parsed.settings?.branches && parsed.settings.branches.length > 0
        ? parsed.settings.branches.map((b, idx) => ({
            ...b,
            branchCode: b.branchCode || `BR-${String(idx + 1).padStart(2, '0')}`,
            timings: b.timings || '6:00 AM – 10:30 PM',
            manager: b.manager || (idx === 0 ? 'Priya Sharma' : idx === 1 ? 'Rohan Das' : 'Sneha Patel'),
            upiId: b.upiId || `gymbranch${idx + 1}@upi`,
            phone: b.phone || '+91 98111 22334',
            email: b.email || `${b.city ? b.city.toLowerCase() : 'branch'}@bilzyfit.com`,
          }))
        : defaultBranches;

      const branchNames = parsedBranches.map((b) => b.name);
      const migratedMembers = ensureMemberSecretCodes(parsed.members || []).map((m, idx) => {
        // If member has no branch or branch doesn't exist, distribute across branches
        if (!m.branch || !branchNames.includes(m.branch)) {
          return { ...m, branch: branchNames[idx % branchNames.length] || 'Star Fitness Center' };
        }
        return m;
      });

      const migrated = {
        ...parsed,
        workspaceId,
        members: migratedMembers,
        plans: parsed.plans || [],
        memberships: parsed.memberships || [],
        attendance: parsed.attendance || [],
        payments: parsed.payments || [],
        expenses: (parsed.expenses || []).map((e, idx) => ({
          ...e,
          branch: e.branch || branchNames[idx % branchNames.length] || branchNames[0],
        })),
        leads: (parsed.leads || []).map((l, idx) => ({
          ...l,
          branch: l.branch || branchNames[idx % branchNames.length] || branchNames[0],
        })),
        staff: (parsed.staff || []).map((s, idx) => ({
          ...s,
          branch: s.branch || (idx === 0 ? 'All Branches' : branchNames[idx % branchNames.length] || 'All Branches'),
        })),
        trainers: parsed.trainers || [],
        workouts: parsed.workouts || [],
        diets: parsed.diets || [],
        messages: parsed.messages || [],
        appointments: parsed.appointments || [],
        inventory: parsed.inventory || [],
        posSales: parsed.posSales || [],
        staffAttendance: parsed.staffAttendance || [],
        cashClosings: parsed.cashClosings || [],
        accountingEntries: migrateAccountingEntries(parsed),
        auditLog: parsed.auditLog || [],
        settings: {
          ...generateSettings(),
          ...(parsed.settings || {}),
          gymName: parsed.settings?.gymName || 'Star Fitness Gym',
          branches: parsedBranches,
        },
      };

      // Safely persist migrated copy (non-throwing)
      saveData(migrated, workspaceId);
      return migrated;
    }
  } catch (err) {
    console.error('[BilzyFit Storage] Error loading workspace data:', err);
  }
  return seedData();
};

const today = new Date();
const fmtDate = (d) => d.toISOString().split('T')[0];
const addDays = (d, days) => {
  const nd = new Date(d);
  nd.setDate(nd.getDate() + days);
  return nd;
};
const addMonths = (d, months) => {
  const nd = new Date(d);
  nd.setMonth(nd.getMonth() + months);
  return nd;
};

const maleNames = [
  'Rahul Sharma', 'Amit Verma', 'Rohan Das', 'Vikram Singh', 'Arjun Nair',
  'Karan Mehta', 'Sanjay Gupta', 'Manish Joshi', 'Nikhil Rao', 'Pankaj Yadav',
  'Ankit Kumar', 'Deepak Mishra', 'Harsh Patel', 'Siddharth Jain', 'Tarun Bhatia'
];
const femaleNames = [
  'Priya Sharma', 'Sneha Patel', 'Neha Gupta', 'Anjali Mehta', 'Ritu Verma',
  'Pooja Nair', 'Kavita Rao', 'Divya Joshi', 'Shreya Singh', 'Meera Iyer',
  'Sonali Das', 'Nisha Kumar', 'Asha Rani', 'Bhavna Shah', 'Hina Khan'
];

const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

const goals = ['Weight Loss', 'Muscle Gain', 'General Fitness', 'Strength', 'Bodybuilding', 'Endurance'];
const bloodGroups = ['A+', 'B+', 'O+', 'AB+', 'A-', 'B-', 'O-', 'AB-'];
const sources = ['Instagram', 'Walk-in', 'Referral', 'Google', 'Justdial', 'Facebook'];
const expenseCategories = ['Electricity', 'Rent', 'Equipment', 'Maintenance', 'Salary', 'Marketing', 'Cleaning', 'Internet', 'Other'];
const paymentMethods = ['Cash', 'UPI', 'Card', 'Bank Transfer', 'Online'];

function generateMembers(count = 14) {
  const members = [];
  for (let i = 0; i < count; i++) {
    const isMale = Math.random() > 0.35;
    const firstPool = isMale ? maleNames : femaleNames;
    const fullName = pick(firstPool);
    const gender = isMale ? 'Male' : 'Female';
    const age = randomInt(18, 55);
    const dob = addDays(today, -age * 365 - randomInt(0, 365));
    const joining = addDays(today, -randomInt(10, 400));
    const heightCm = randomInt(155, 190);
    const weightKg = randomInt(55, 110);
    const bmi = (weightKg / ((heightCm / 100) ** 2)).toFixed(1);
    const mobile = `9${randomInt(100000000, 999999999)}`;
    const idNum = 1001 + i;
    const statusRoll = Math.random();
    let status = 'active';
    if (statusRoll > 0.92) status = 'expired';
    else if (statusRoll > 0.82) status = 'expiring';
    else if (statusRoll > 0.72) status = 'inactive';

    members.push({
      id: `m${idNum}`,
      memberId: `GM${idNum}`,
      secretCode: idNum === 1001 ? '749201' : String(100000 + ((idNum * 314159) % 900000)),
      fullName,
      gender,
      dob: fmtDate(dob),
      mobile,
      email: `${fullName.toLowerCase().replace(/\s+/g, '.')}@email.com`,
      address: `${randomInt(1, 999)}, Sector ${randomInt(1, 80)}, Delhi`,
      emergencyContact: `9${randomInt(100000000, 999999999)}`,
      joiningDate: fmtDate(joining),
      goal: pick(goals),
      height: heightCm,
      weight: weightKg,
      bmi,
      bloodGroup: pick(bloodGroups),
      notes: '',
      status,
      branch: ['Star Fitness Center', 'Iron Pulse Gym & Spa', 'Gold Elite Fitness Hub', 'Olympus Power Gym'][i % 4],
      photo: '',
    });
  }
  return members;
}

function generatePlans() {
  return [
    { id: 'p1', name: 'Monthly', durationMonths: 1, price: 2500, description: 'Full gym access', features: ['Gym Access', 'Locker', 'Shower'], ptSessions: 0, autoRenew: false, status: 'active' },
    { id: 'p2', name: 'Quarterly', durationMonths: 3, price: 6500, description: '3 months plan', features: ['Gym Access', 'Locker', 'Shower', '1 PT Session'], ptSessions: 1, autoRenew: false, status: 'active' },
    { id: 'p3', name: 'Half Yearly', durationMonths: 6, price: 11000, description: '6 months plan', features: ['Gym Access', 'Locker', 'Shower', '3 PT Sessions'], ptSessions: 3, autoRenew: false, status: 'active' },
    { id: 'p4', name: 'Yearly', durationMonths: 12, price: 18000, description: '12 months plan', features: ['Gym Access', 'Locker', 'Shower', '6 PT Sessions'], ptSessions: 6, autoRenew: false, status: 'active' },
    { id: 'p5', name: 'Custom Plan', durationMonths: 2, price: 4500, description: 'Custom duration', features: ['Gym Access', 'Locker'], ptSessions: 0, autoRenew: false, status: 'active' },
  ];
}

function generateMemberships(members, plans) {
  return members.map((m) => {
    const plan = pick(plans);
    const start = addDays(today, -randomInt(5, plan.durationMonths * 30 - 10));
    let expiry = addMonths(start, plan.durationMonths);
    if (m.status === 'expired') expiry = addDays(today, -randomInt(5, 45));
    else if (m.status === 'expiring') expiry = addDays(today, randomInt(1, 14));
    const paidRoll = Math.random();
    let paidAmount = plan.price;
    let pendingAmount = 0;
    if (paidRoll > 0.8) {
      paidAmount = Math.floor(plan.price * 0.6);
      pendingAmount = plan.price - paidAmount;
    }
    const membershipStatus = pendingAmount > 0 ? 'pending' : expiry < today ? 'expired' : expiry <= addDays(today, 7) ? 'expiring' : 'active';
    return {
      id: `ms-${m.id}`,
      memberId: m.id,
      planId: plan.id,
      planName: plan.name,
      startDate: fmtDate(start),
      expiryDate: fmtDate(expiry),
      amount: plan.price,
      paidAmount,
      pendingAmount,
      status: membershipStatus,
      invoiceNumber: `INV-${m.memberId}-${fmtDate(start).replace(/-/g, '')}`,
    };
  });
}

function generateAttendance(members) {
  const records = [];
  for (let d = 0; d < 7; d++) {
    const date = addDays(today, -d);
    const dayMembers = members.filter(() => Math.random() > 0.55);
    dayMembers.forEach((m, idx) => {
      const baseHour = 6 + Math.floor(Math.random() * 14);
      const checkIn = new Date(date);
      checkIn.setHours(baseHour, randomInt(0, 59));
      const checkOut = new Date(checkIn);
      checkOut.setHours(checkOut.getHours() + randomInt(1, 3));
      records.push({
        id: `att-${fmtDate(date)}-${idx}`,
        memberId: m.id,
        date: fmtDate(date),
        checkIn: checkIn.toISOString(),
        checkOut: Math.random() > 0.15 ? checkOut.toISOString() : null,
        status: 'present',
      });
    });
  }
  return records;
}

function generatePayments(memberships) {
  const payments = [];
  memberships.forEach((ms) => {
    const count = ms.paidAmount === ms.amount ? 1 : randomInt(1, 2);
    let remaining = ms.paidAmount;
    for (let i = 0; i < count && remaining > 0; i++) {
      const amt = i === count - 1 ? remaining : Math.floor(remaining / 2);
      remaining -= amt;
      payments.push({
        id: `pay-${ms.id}-${i}`,
        memberId: ms.memberId,
        amount: amt,
        method: pick(paymentMethods),
        date: fmtDate(addDays(today, -randomInt(0, 60))),
        invoiceNumber: ms.invoiceNumber,
        status: 'success',
        notes: '',
        type: 'membership',
      });
    }
  });
  return payments;
}

function generateExpenses() {
  const expenses = [];
  for (let i = 0; i < 10; i++) {
    expenses.push({
      id: `exp-${i}`,
      category: pick(expenseCategories),
      amount: randomInt(500, 25000),
      date: fmtDate(addDays(today, -randomInt(0, 90))),
      description: pick(['Monthly', 'Quarterly', 'Repair', 'Purchase', 'Bill']),
      paymentMethod: pick(paymentMethods),
      receipt: '',
    });
  }
  return expenses;
}

function generateLeads() {
  const leads = [];
  for (let i = 0; i < 8; i++) {
    const isMale = Math.random() > 0.4;
    const pool = isMale ? maleNames : femaleNames;
    leads.push({
      id: `ld-${i}`,
      name: pick(pool),
      phone: `9${randomInt(100000000, 999999999)}`,
      email: `lead${i}@email.com`,
      source: pick(sources),
      interestedPlan: pick(['Monthly', 'Quarterly', 'Half Yearly', 'Yearly']),
      goal: pick(goals),
      followUpDate: fmtDate(addDays(today, randomInt(-2, 7))),
      notes: '',
      status: pick(['New Lead', 'Contacted', 'Interested', 'Trial', 'Follow-up', 'Converted']),
    });
  }
  return leads;
}

function generateStaff() {
  return [
    { id: 's1', name: 'Priya Sharma', phone: '9876543210', email: 'manager@gym.com', role: 'Manager', joiningDate: '2023-02-10', salary: 45000, workingHours: '9 AM - 6 PM', status: 'active', photo: '', loginEnabled: true },
    { id: 's2', name: 'Rohan Das', phone: '9876543211', email: 'reception@gym.com', role: 'Receptionist', joiningDate: '2023-06-15', salary: 22000, workingHours: '6 AM - 2 PM', status: 'active', photo: '', loginEnabled: true },
    { id: 's3', name: 'Sneha Patel', phone: '9876543212', email: 'trainer@gym.com', role: 'Trainer', joiningDate: '2023-04-01', salary: 35000, workingHours: '5 AM - 1 PM', status: 'active', photo: '', loginEnabled: true },
    { id: 's4', name: 'Amit Verma', phone: '9876543213', email: 'owner@gym.com', role: 'Gym Owner', joiningDate: '2022-01-01', salary: 80000, workingHours: '10 AM - 7 PM', status: 'active', photo: '', loginEnabled: true },
    { id: 's5', name: 'Neha Gupta', phone: '9876543214', email: 'nutrition@gym.com', role: 'Nutritionist', joiningDate: '2023-09-12', salary: 32000, workingHours: '10 AM - 6 PM', status: 'active', photo: '', loginEnabled: true },
  ];
}

function generateTrainers() {
  return [
    { id: 't1', name: 'Sneha Patel', phone: '9876543212', email: 'trainer@gym.com', specialization: 'Strength & Conditioning', joiningDate: '2023-04-01', salary: 35000, status: 'active', assignedMembers: 12, photo: '' },
    { id: 't2', name: 'Vikram Singh', phone: '9876543215', email: 'vikram@gym.com', specialization: 'Weight Loss', joiningDate: '2023-07-20', salary: 30000, status: 'active', assignedMembers: 9, photo: '' },
    { id: 't3', name: 'Anjali Mehta', phone: '9876543216', email: 'anjali@gym.com', specialization: 'Yoga & Flexibility', joiningDate: '2024-01-05', salary: 28000, status: 'active', assignedMembers: 6, photo: '' },
  ];
}

function generateWorkouts() {
  return [
    { id: 'w1', name: 'Muscle Gain - Beginner', description: 'Full body strength program', exercises: [{ name: 'Bench Press', sets: 4, reps: '10-12', rest: '90s', video: '', videoName: '' }, { name: 'Squats', sets: 4, reps: '10', rest: '90s', video: '', videoName: '' }, { name: 'Lat Pulldown', sets: 3, reps: '12', rest: '60s', video: '', videoName: '' }], assignedTo: [] },
    { id: 'w2', name: 'Fat Loss - HIIT', description: 'High intensity fat burning', exercises: [{ name: 'Burpees', sets: 3, reps: '15', rest: '45s', video: '', videoName: '' }, { name: 'Mountain Climbers', sets: 3, reps: '30s', rest: '30s', video: '', videoName: '' }, { name: 'Jump Squats', sets: 3, reps: '15', rest: '45s', video: '', videoName: '' }], assignedTo: [] },
    { id: 'w3', name: 'Strength - Powerlifting', description: 'Heavy compound movements', exercises: [{ name: 'Deadlift', sets: 5, reps: '5', rest: '3m', video: '', videoName: '' }, { name: 'Overhead Press', sets: 4, reps: '6', rest: '2m', video: '', videoName: '' }, { name: 'Barbell Row', sets: 4, reps: '8', rest: '2m', video: '', videoName: '' }], assignedTo: [] },
  ];
}

function generateDiets() {
  return [
    { id: 'd1', name: 'Muscle Gain Diet', description: 'High protein diet for bulking', meals: [{ type: 'Breakfast', items: 'Oats + Eggs + Banana', calories: 450, protein: 28, carbs: 55, fats: 10 }, { type: 'Lunch', items: 'Rice + Chicken + Vegetables', calories: 700, protein: 45, carbs: 80, fats: 15 }], assignedTo: [] },
    { id: 'd2', name: 'Weight Loss Diet', description: 'Calorie deficit diet', meals: [{ type: 'Breakfast', items: 'Sprouts + Green Tea', calories: 220, protein: 15, carbs: 30, fats: 4 }, { type: 'Lunch', items: 'Salad + Grilled Fish', calories: 350, protein: 35, carbs: 15, fats: 8 }], assignedTo: [] },
  ];
}

function generateSettings() {
  return {
    gymName: 'Star Fitness Gym',
    address: 'Plot 18, Commercial Hub, Sector 62, Noida, Uttar Pradesh',
    phone: '+91 98111 22334',
    email: 'support@starfitness.com',
    openingHours: '5:00 AM - 11:30 PM',
    logo: '',
    currency: 'INR',
    timezone: 'Asia/Kolkata',
    dateFormat: 'DD MMM YYYY',
    theme: 'light',
    language: 'English',
    emailNotifications: true,
    smsNotifications: true,
    renewalReminders: true,
    paymentAlerts: true,
    weeklyReports: false,
    gstin: '07AAAAA0000A1Z5',
    invoicePrefix: 'INV',
    defaultGstRate: 18,
    upiId: 'starfitness@upi',
    upiName: 'Star Fitness Gym',
    branches: [
      {
        id: 'b1',
        name: 'Star Fitness Center',
        branchCode: 'SFC-01',
        city: 'Noida',
        address: 'Plot 18, Commercial Hub, Sector 62, Noida, Uttar Pradesh',
        phone: '+91 98111 22334',
        email: 'noida@starfitness.com',
        timings: '5:00 AM – 11:30 PM',
        manager: 'Priya Sharma',
        upiId: 'starfitness.noida@upi',
        status: 'active',
      },
      {
        id: 'b2',
        name: 'Iron Pulse Gym & Spa',
        branchCode: 'IPG-02',
        city: 'Indirapuram',
        address: 'Shop 4, Ahinsa Khand II, Indirapuram, Ghaziabad, UP',
        phone: '+91 98222 33445',
        email: 'indirapuram@ironpulse.com',
        timings: '6:00 AM – 10:30 PM',
        manager: 'Vikram Singh',
        upiId: 'ironpulse@upi',
        status: 'active',
      },
      {
        id: 'b3',
        name: 'Gold Elite Fitness Hub',
        branchCode: 'GEF-03',
        city: 'Gurugram',
        address: 'Tower B, DLF Cyber City, Phase 2, Gurugram, Haryana',
        phone: '+91 98333 44556',
        email: 'gurugram@goldelite.com',
        timings: '5:30 AM – 11:00 PM',
        manager: 'Rohan Sharma',
        upiId: 'goldelite@upi',
        status: 'active',
      },
      {
        id: 'b4',
        name: 'Olympus Power Gym',
        branchCode: 'OPG-04',
        city: 'South Extension',
        address: 'F-22, Main Ring Road, South Extension Part 1, New Delhi',
        phone: '+91 98444 55667',
        email: 'delhi@olympusgym.com',
        timings: '6:00 AM – 11:00 PM',
        manager: 'Amit Verma',
        upiId: 'olympusgym@upi',
        status: 'active',
      },
    ],
  };
}

export function seedData() {
  const plans = generatePlans();
  const members = generateMembers();
  const memberships = generateMemberships(members, plans);
  const attendance = generateAttendance(members);
  const payments = generatePayments(memberships);
  const expenses = generateExpenses();
  const leads = generateLeads();
  const staff = generateStaff();
  const trainers = generateTrainers();
  const workouts = generateWorkouts();
  const diets = generateDiets();
  const settings = generateSettings();
  const data = {
    members,
    plans,
    memberships,
    attendance,
    payments,
    expenses,
    leads,
    staff,
    trainers,
    workouts,
    diets,
    settings,
    notifications: [],
    messages: [],
    appointments: [],
    inventory: [
      { id: 'inv-1', name: 'Protein Shake', sku: 'BF-PS-001', category: 'Supplements', unit: 'piece', stock: 25, reorderLevel: 5, price: 180, cost: 110, status: 'active' },
      { id: 'inv-2', name: 'Gym Gloves', sku: 'BF-GG-001', category: 'Accessories', unit: 'pair', stock: 12, reorderLevel: 3, price: 499, cost: 300, status: 'active' },
    ],
    posSales: [],
    staffAttendance: [],
    cashClosings: [],
    auditLog: [],
  };
  data.accountingEntries = migrateAccountingEntries(data);
  saveData(data);
  return data;
}

export function createFreshData(settingsOverrides = {}) {
  const settings = {
    ...generateSettings(),
    ...settingsOverrides,
    branches: settingsOverrides.branches || [{
      id: 'b-main',
      name: settingsOverrides.gymName ? `${settingsOverrides.gymName} Main Branch` : 'Main Branch',
      city: '',
    }],
  };
  return {
    workspaceId: settingsOverrides.workspaceId || activeWorkspaceId,
    members: [],
    plans: generatePlans(),
    memberships: [],
    attendance: [],
    payments: [],
    expenses: [],
    leads: [],
    staff: [],
    trainers: [],
    workouts: [],
    diets: [],
    settings,
    notifications: [],
    messages: [],
    appointments: [],
    inventory: [],
    posSales: [],
    staffAttendance: [],
    cashClosings: [],
    accountingEntries: [],
    auditLog: [],
  };
}

export { fmtDate, addDays, addMonths };
