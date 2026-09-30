import { getData, saveData, fmtDate, addMonths } from './seed';
import { syncWorkspaceData } from './sync';

export function loadAll(workspaceId) {
  return getData(workspaceId);
}

let firestoreSyncTimeout = null;
function debouncedFirestoreSync(data, workspaceId = 'demo-workspace') {
  if (typeof window === 'undefined') return;
  clearTimeout(firestoreSyncTimeout);
  firestoreSyncTimeout = setTimeout(async () => {
    try {
      const { isFirebaseConfigured } = await import('../firebase/config');
      if (isFirebaseConfigured()) {
        const { migrateLocalDataToFirestore } = await import('../firebase/firestoreService');
        migrateLocalDataToFirestore(data, workspaceId).catch(() => {});
      }
    } catch {}
  }, 1200);
}

export function persistAll(data, workspaceId) {
  saveData(data, workspaceId);
  syncWorkspaceData(data, workspaceId);
  debouncedFirestoreSync(data, workspaceId);
}

export function normalizeImportedData(input, workspaceId) {
  if (!input || typeof input !== 'object' || !Array.isArray(input.members)) {
    throw new Error('This file is not a valid BilzyFit workspace backup.');
  }
  const memberIds = new Set(input.members.map((member) => member.id));
  const memberships = (input.memberships || []).filter((item) => memberIds.has(item.memberId));
  const normalized = {
    ...input,
    workspaceId,
    members: input.members,
    plans: input.plans || [],
    memberships,
    attendance: (input.attendance || []).filter((item) => memberIds.has(item.memberId)),
    payments: (input.payments || []).filter((item) => memberIds.has(item.memberId) || item.type === 'pos'),
    expenses: input.expenses || [],
    leads: input.leads || [],
    staff: input.staff || [],
    trainers: input.trainers || [],
    workouts: (input.workouts || []).map((item) => ({ ...item, assignedTo: (item.assignedTo || []).filter((id) => memberIds.has(id)) })),
    diets: (input.diets || []).map((item) => ({ ...item, assignedTo: (item.assignedTo || []).filter((id) => memberIds.has(id)) })),
    messages: input.messages || [],
    appointments: (input.appointments || []).filter((item) => !item.memberId || memberIds.has(item.memberId)),
    inventory: input.inventory || [],
    posSales: input.posSales || [],
    staffAttendance: input.staffAttendance || [],
    cashClosings: input.cashClosings || [],
    accountingEntries: input.accountingEntries || [],
    auditLog: input.auditLog || [],
    settings: input.settings || {},
  };
  normalized.auditLog = [
    {
      id: `audit-${Date.now()}`,
      action: 'workspace.restored',
      entity: 'workspace',
      entityId: workspaceId,
      details: { removedOrphanMemberships: (input.memberships || []).length - memberships.length },
      at: new Date().toISOString(),
    },
    ...normalized.auditLog,
  ].slice(0, 500);
  return normalized;
}

function withAudit(data, action, entity, entityId, details = {}) {
  return [{
    id: `audit-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    action,
    entity,
    entityId,
    details,
    at: new Date().toISOString(),
  }, ...(data.auditLog || [])].slice(0, 500);
}

function withAccounting(data, {
  date = fmtDate(new Date()),
  type,
  amount,
  method = '',
  referenceId,
  invoiceNumber = '',
  description,
  memberId = '',
}) {
  const numericAmount = Number(amount) || 0;
  if (!numericAmount) return data.accountingEntries || [];
  return [{
    id: `acct-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    date,
    type,
    direction: numericAmount >= 0 ? 'credit' : 'debit',
    account: numericAmount >= 0 ? 'Revenue' : 'Expense / Refund',
    amount: Math.abs(numericAmount),
    method,
    referenceId,
    invoiceNumber,
    memberId,
    description,
  }, ...(data.accountingEntries || [])].slice(0, 2000);
}

export function addMember(data, member) {
  const randCode = String(Math.floor(100000 + Math.random() * 900000));
  const newMember = {
    ...member,
    id: member.id || `m${Date.now()}`,
    memberId: member.memberId || `GM${Date.now()}`,
    secretCode: member.secretCode || randCode,
  };
  const next = { ...data, members: [newMember, ...data.members], auditLog: withAudit(data, 'member.created', 'member', newMember.id, { memberId: newMember.memberId, secretCode: newMember.secretCode }) };
  persistAll(next);
  return { data: next, member: newMember };
}

export function enrollMember(data, member, { planId, startDate, paymentAmount = 0, paymentMethod = 'Cash' }) {
  const plan = data.plans.find((p) => p.id === planId);
  if (!plan) return addMember(data, member);

  const bmi = member.weight && member.height
    ? (member.weight / ((member.height / 100) ** 2)).toFixed(1)
    : '';
  const { data: afterMember, member: newMember } = addMember(data, { ...member, bmi });

  const start = new Date(startDate);
  const expiry = addMonths(start, plan.durationMonths);
  const membership = {
    id: `ms-${newMember.id}`,
    memberId: newMember.id,
    planId: plan.id,
    planName: plan.name,
    startDate: fmtDate(start),
    expiryDate: fmtDate(expiry),
    amount: plan.price,
    autoRenew: Boolean(plan.autoRenew),
    ptSessionsRemaining: Number(plan.ptSessions) || 0,
    paidAmount: paymentAmount,
    pendingAmount: Math.max(0, plan.price - paymentAmount),
    status: paymentAmount >= plan.price ? 'active' : 'pending',
    invoiceNumber: `INV-${newMember.memberId}-${fmtDate(start).replace(/-/g, '')}`,
  };
  let next = { ...afterMember, memberships: [membership, ...afterMember.memberships] };

  if (paymentAmount > 0) {
    const payment = {
      id: `pay-${Date.now()}`,
      memberId: newMember.id,
      amount: paymentAmount,
      method: paymentMethod,
      date: fmtDate(new Date()),
      invoiceNumber: membership.invoiceNumber,
      membershipId: membership.id,
      status: 'success',
      notes: 'Initial membership payment',
      type: 'membership',
    };
    next = { ...next, payments: [payment, ...next.payments] };
    next.accountingEntries = withAccounting(next, {
      date: payment.date,
      type: 'membership',
      amount: payment.amount,
      method: payment.method,
      referenceId: payment.id,
      invoiceNumber: payment.invoiceNumber,
      memberId: payment.memberId,
      description: payment.notes,
    });
  }

  persistAll(next);
  return { data: next, member: newMember, membership };
}

export function updateMember(data, id, updates) {
  const member = data.members.find((m) => m.id === id);
  const height = Number(updates.height);
  const weight = Number(updates.weight);
  const bmi = height > 0 && weight > 0
    ? (weight / ((height / 100) ** 2)).toFixed(1)
    : member?.bmi || '';
  const members = data.members.map((m) => (m.id === id ? { ...m, ...updates, bmi } : m));
  let memberships = data.memberships;
  if (member && updates.joiningDate && updates.joiningDate !== member.joiningDate) {
    const memberMemberships = data.memberships
      .filter((item) => item.memberId === id)
      .sort((a, b) => new Date(b.startDate) - new Date(a.startDate));
    const latestMembership = memberMemberships[0];
    if (latestMembership) {
      const start = new Date(updates.joiningDate);
      const expiry = addMonths(start, Number(
        data.plans.find((plan) => plan.id === latestMembership.planId)?.durationMonths || 1
      ));
      const expiryDate = fmtDate(expiry);
      const today = fmtDate(new Date());
      const weekLater = fmtDate(new Date(Date.now() + 7 * 86400000));
      const status = latestMembership.pendingAmount > 0
        ? 'pending'
        : expiryDate < today
          ? 'expired'
          : expiryDate <= weekLater
            ? 'expiring'
            : 'active';
      memberships = data.memberships.map((item) =>
        item.id === latestMembership.id
          ? { ...item, startDate: fmtDate(start), expiryDate, status }
          : item
      );
    }
  }
  const next = { ...data, members, memberships, auditLog: withAudit(data, 'member.updated', 'member', id, updates) };
  persistAll(next);
  return { data: next };
}

export function freezeMembership(data, membershipId, { startDate = fmtDate(new Date()), days = 30, reason = '' } = {}) {
  const membership = data.memberships.find((item) => item.id === membershipId);
  if (!membership) return { data, membership: null };
  const start = new Date(startDate);
  const end = new Date(start);
  end.setDate(end.getDate() + Number(days));
  const memberships = data.memberships.map((item) => item.id === membershipId
    ? (() => {
        const expiry = new Date(item.expiryDate);
        expiry.setDate(expiry.getDate() + Number(days));
        return { ...item, frozen: true, freezeStart: fmtDate(start), freezeEnd: fmtDate(end), freezeDays: Number(days), freezeReason: reason, originalExpiryDate: item.originalExpiryDate || item.expiryDate, expiryDate: fmtDate(expiry), status: 'paused' };
      })()
    : item);
  const members = data.members.map((member) => member.id === membership.memberId
    ? { ...member, status: 'paused' }
    : member);
  const next = { ...data, members, memberships, auditLog: withAudit(data, 'membership.frozen', 'membership', membershipId, { days, reason }) };
  persistAll(next);
  return { data: next, membership: memberships.find((item) => item.id === membershipId) };
}

export function unfreezeMembership(data, membershipId) {
  const membership = data.memberships.find((item) => item.id === membershipId);
  if (!membership) return { data, membership: null };
  const today = fmtDate(new Date());
  const status = membership.pendingAmount > 0 ? 'pending' : membership.expiryDate < today ? 'expired' : 'active';
  const memberships = data.memberships.map((item) => item.id === membershipId
    ? { ...item, frozen: false, status, unfrozenAt: today }
    : item);
  const members = data.members.map((member) => member.id === membership.memberId
    ? { ...member, status: status === 'expired' ? 'expired' : 'active' }
    : member);
  const next = { ...data, members, memberships, auditLog: withAudit(data, 'membership.unfrozen', 'membership', membershipId) };
  persistAll(next);
  return { data: next, membership: memberships.find((item) => item.id === membershipId) };
}

export function transferMember(data, memberId, branch) {
  const members = data.members.map((member) => member.id === memberId ? { ...member, branch } : member);
  const next = { ...data, members, auditLog: withAudit(data, 'member.transferred', 'member', memberId, { branch }) };
  persistAll(next);
  return { data: next };
}

export function consumePtSession(data, membershipId) {
  const membership = data.memberships.find((item) => item.id === membershipId);
  if (!membership || Number(membership.ptSessionsRemaining) <= 0) return { data, membership: null };
  const memberships = data.memberships.map((item) => item.id === membershipId
    ? { ...item, ptSessionsRemaining: Number(item.ptSessionsRemaining) - 1 }
    : item);
  const next = { ...data, memberships, auditLog: withAudit(data, 'pt.session.consumed', 'membership', membershipId) };
  persistAll(next);
  return { data: next, membership: memberships.find((item) => item.id === membershipId) };
}

export function deleteMember(data, id) {
  const next = {
    ...data,
    members: data.members.filter((m) => m.id !== id),
    memberships: data.memberships.filter((m) => m.memberId !== id),
    attendance: data.attendance.filter((a) => a.memberId !== id),
    payments: data.payments.filter((p) => p.memberId !== id),
    workouts: data.workouts.map((item) => ({ ...item, assignedTo: (item.assignedTo || []).filter((memberId) => memberId !== id) })),
    diets: data.diets.map((item) => ({ ...item, assignedTo: (item.assignedTo || []).filter((memberId) => memberId !== id) })),
    appointments: (data.appointments || []).filter((item) => item.memberId !== id),
    auditLog: withAudit(data, 'member.deleted', 'member', id),
  };
  persistAll(next);
  return { data: next };
}

export function getMemberStats(data, memberId) {
  const member = data.members.find((m) => m.id === memberId);
  const memberships = data.memberships
    .filter((m) => m.memberId === memberId)
    .sort((a, b) => new Date(b.startDate) - new Date(a.startDate));
  const membership = memberships[0];
  const plan =
    membership &&
    (data.plans.find((p) => p.id === membership.planId) ||
      data.plans.find((p) => p.name === membership.planName));
  const attendance = data.attendance.filter((a) => a.memberId === memberId);
  const payments = data.payments.filter((p) => p.memberId === memberId);
  const totalPaid = payments.reduce((sum, p) => sum + p.amount, 0);
  const totalVisits = attendance.length;
  const last30 = attendance.filter((a) => new Date(a.date) >= new Date(fmtDate(new Date(Date.now() - 30 * 86400000))));
  return {
    member,
    membership,
    plan,
    attendance,
    payments,
    totalPaid,
    totalVisits,
    recentVisits: last30.length,
  };
}

export function recordAttendance(data, memberId, checkIn = new Date().toISOString(), method = 'QR', shift = null) {
  const checkInHour = new Date(checkIn).getHours();
  const calculatedShift = shift || (checkInHour < 12 ? '1st Shift' : '2nd Shift');
  const record = {
    id: `att-${Date.now()}`,
    memberId,
    date: fmtDate(new Date()),
    checkIn,
    checkOut: null,
    status: 'present',
    method,
    shift: calculatedShift,
  };
  const next = { ...data, attendance: [record, ...data.attendance] };
  persistAll(next);
  return { data: next, record };
}

export function manualCheckIn(data, memberId, checkInTime, method = 'Manual', notes = '', shift = null) {
  const checkIn = checkInTime ? new Date(checkInTime).toISOString() : new Date().toISOString();
  const checkInHour = new Date(checkIn).getHours();
  const calculatedShift = shift || (checkInHour < 12 ? '1st Shift' : '2nd Shift');
  const record = {
    id: `att-${Date.now()}`,
    memberId,
    date: fmtDate(new Date()),
    checkIn,
    checkOut: null,
    status: 'present',
    method,
    notes,
    shift: calculatedShift,
  };
  const next = { ...data, attendance: [record, ...data.attendance] };
  persistAll(next);
  return { data: next, record };
}

export function checkoutAttendance(data, memberId) {
  const today = fmtDate(new Date());
  const attendance = data.attendance.map((a) =>
    a.memberId === memberId && a.date === today && !a.checkOut
      ? { ...a, checkOut: new Date().toISOString() }
      : a
  );
  const next = { ...data, attendance };
  persistAll(next);
  return { data: next };
}

export function addPayment(data, payment) {
  const discount = Number(payment.discount) || 0;
  const netAmount = Math.max(0, Number(payment.amount) - discount);
  const membership = data.memberships
    .filter((m) => m.memberId === payment.memberId)
    .sort((a, b) => new Date(b.startDate) - new Date(a.startDate))[0];
  const invoiceNumber = payment.invoiceNumber || membership?.invoiceNumber || `INV-${payment.memberId}-${String(payment.date || fmtDate(new Date())).replace(/-/g, '')}`;
  const newPayment = {
    ...payment,
    id: `pay-${Date.now()}`,
    amount: netAmount,
    grossAmount: Number(payment.amount),
    discount,
    invoiceNumber,
    membershipId: payment.membershipId || membership?.id,
    status: 'success',
  };
  let memberships = data.memberships;
  if (membership) {
    memberships = memberships.map((m) =>
      m.id === membership.id
        ? {
            ...m,
            paidAmount: m.paidAmount + netAmount,
            pendingAmount: Math.max(0, m.pendingAmount - netAmount),
          }
        : m
    );
  }
  const next = { ...data, payments: [newPayment, ...data.payments], memberships };
  next.accountingEntries = withAccounting(next, {
    date: newPayment.date,
    type: newPayment.type || 'membership',
    amount: newPayment.amount,
    method: newPayment.method,
    referenceId: newPayment.id,
    invoiceNumber: newPayment.invoiceNumber,
    memberId: newPayment.memberId,
    description: newPayment.notes || 'Membership payment',
  });
  persistAll(next);
  return { data: next, payment: newPayment };
}

export function addLead(data, lead) {
  const newLead = { ...lead, id: `ld-${Date.now()}` };
  const next = { ...data, leads: [newLead, ...data.leads] };
  persistAll(next);
  return { data: next, lead: newLead };
}

export function updateLead(data, id, updates) {
  const leads = data.leads.map((l) => (l.id === id ? { ...l, ...updates } : l));
  const next = { ...data, leads };
  persistAll(next);
  return { data: next };
}

export function addExpense(data, expense) {
  const newExpense = { ...expense, id: `exp-${Date.now()}` };
  const next = { ...data, expenses: [newExpense, ...data.expenses] };
  next.accountingEntries = withAccounting(next, {
    date: newExpense.date,
    type: 'expense',
    amount: -Number(newExpense.amount),
    method: newExpense.paymentMethod,
    referenceId: newExpense.id,
    description: `${newExpense.category}: ${newExpense.description || 'Expense'}`,
  });
  persistAll(next);
  return { data: next, expense: newExpense };
}

export function addWorkout(data, workout) {
  const newWorkout = {
    ...workout,
    id: `w${Date.now()}`,
    assignedTo: workout.assignedTo || [],
    source: workout.source || 'trainer',
  };
  const next = { ...data, workouts: [newWorkout, ...data.workouts] };
  persistAll(next);
  return { data: next, workout: newWorkout };
}

export function updateWorkout(data, id, updates) {
  const workouts = data.workouts.map((w) =>
    w.id === id ? { ...w, ...updates } : w
  );
  const next = { ...data, workouts };
  persistAll(next);
  return { data: next };
}

export function deleteWorkout(data, id) {
  const next = { ...data, workouts: data.workouts.filter((w) => w.id !== id) };
  persistAll(next);
  return { data: next };
}

export function addDiet(data, diet) {
  const newDiet = {
    ...diet,
    id: `d${Date.now()}`,
    assignedTo: diet.assignedTo || [],
    source: diet.source || 'trainer',
  };
  const next = { ...data, diets: [newDiet, ...data.diets] };
  persistAll(next);
  return { data: next, diet: newDiet };
}

export function updateDiet(data, id, updates) {
  const diets = data.diets.map((d) => (d.id === id ? { ...d, ...updates } : d));
  const next = { ...data, diets };
  persistAll(next);
  return { data: next };
}

export function deleteDiet(data, id) {
  const next = { ...data, diets: data.diets.filter((d) => d.id !== id) };
  persistAll(next);
  return { data: next };
}

export function assignWorkout(data, workoutId, memberIds) {
  const workouts = data.workouts.map((w) =>
    w.id === workoutId ? { ...w, assignedTo: Array.from(new Set(memberIds)) } : w
  );
  const next = { ...data, workouts };
  persistAll(next);
  return { data: next };
}

export function assignDiet(data, dietId, memberIds) {
  const diets = data.diets.map((d) =>
    d.id === dietId ? { ...d, assignedTo: Array.from(new Set(memberIds)) } : d
  );
  const next = { ...data, diets };
  persistAll(next);
  return { data: next };
}

export function addBranch(data, branch) {
  const newBranch = { ...branch, id: `b${Date.now()}` };
  const settings = {
    ...data.settings,
    branches: [...(data.settings.branches || []), newBranch],
  };
  const next = { ...data, settings };
  persistAll(next);
  return { data: next, branch: newBranch };
}

export function updateBranch(data, id, updates) {
  const branches = (data.settings.branches || []).map((b) =>
    b.id === id ? { ...b, ...updates } : b
  );
  const settings = { ...data.settings, branches };
  const next = { ...data, settings };
  persistAll(next);
  return { data: next };
}

export function deleteBranch(data, id) {
  const removedBranch = (data.settings.branches || []).find((branch) => branch.id === id);
  const branches = (data.settings.branches || []).filter((b) => b.id !== id);
  const settings = { ...data.settings, branches };
  const fallbackBranch = branches[0]?.name || '';
  const members = data.members.map((member) => member.branch === removedBranch?.name
    ? { ...member, branch: fallbackBranch }
    : member);
  const next = { ...data, settings, members };
  persistAll(next);
  return { data: next };
}

export function addStaff(data, staff) {
  const newStaff = { ...staff, id: `s${Date.now()}`, status: staff.status || 'active' };
  const next = { ...data, staff: [newStaff, ...data.staff] };
  persistAll(next);
  return { data: next, staff: newStaff };
}

export function updateStaff(data, id, updates) {
  const staff = data.staff.map((s) => (s.id === id ? { ...s, ...updates } : s));
  const next = { ...data, staff };
  persistAll(next);
  return { data: next };
}

export function deleteStaff(data, id) {
  const next = { ...data, staff: data.staff.filter((s) => s.id !== id) };
  persistAll(next);
  return { data: next };
}

export function addTrainer(data, trainer) {
  const newTrainer = {
    ...trainer,
    id: `t${Date.now()}`,
    status: trainer.status || 'active',
    assignedMembers: Number(trainer.assignedMembers) || 0,
  };
  const next = { ...data, trainers: [newTrainer, ...data.trainers] };
  persistAll(next);
  return { data: next, trainer: newTrainer };
}

export function updateTrainer(data, id, updates) {
  const trainers = data.trainers.map((t) =>
    t.id === id ? { ...t, ...updates, assignedMembers: Number(updates.assignedMembers) || t.assignedMembers || 0 } : t
  );
  const next = { ...data, trainers };
  persistAll(next);
  return { data: next };
}

export function deleteTrainer(data, id) {
  const next = { ...data, trainers: data.trainers.filter((t) => t.id !== id) };
  persistAll(next);
  return { data: next };
}

export function addPlan(data, plan) {
  const newPlan = { ...plan, id: `p${Date.now()}`, status: plan.status || 'active' };
  const next = { ...data, plans: [newPlan, ...data.plans] };
  persistAll(next);
  return { data: next, plan: newPlan };
}

export function updatePlan(data, id, updates) {
  const plans = data.plans.map((p) => (p.id === id ? { ...p, ...updates } : p));
  const next = { ...data, plans };
  persistAll(next);
  return { data: next };
}

export function deletePlan(data, id) {
  const next = { ...data, plans: data.plans.filter((p) => p.id !== id) };
  persistAll(next);
  return { data: next };
}

export function collectPayment(data, { memberId, amount, method, date, notes, discount = 0, coupon = '', gstRate = 0 }) {
  const netAmount = Math.max(0, Number(amount) - (Number(discount) || 0));
  const memberships = data.memberships.map((m) => {
    if (m.memberId !== memberId) return m;
    const paidAmount = m.paidAmount + netAmount;
    const pendingAmount = Math.max(0, m.amount - paidAmount);
    const status = pendingAmount > 0 ? 'pending' : m.expiryDate < fmtDate(new Date()) ? 'expired' : 'active';
    return { ...m, paidAmount, pendingAmount, status };
  });
  const membership = data.memberships.find((m) => m.memberId === memberId);
  const payment = {
    id: `pay-${Date.now()}`,
    memberId,
    amount: netAmount,
    grossAmount: Number(amount),
    method,
    date,
    invoiceNumber: membership?.invoiceNumber || `INV-${memberId}-${date.replace(/-/g, '')}`,
    membershipId: membership?.id,
    status: 'success',
    notes: notes || 'Payment collected',
    type: 'membership',
    discount: Number(discount) || 0,
    coupon,
    gstRate: Number(gstRate) || 0,
    gstAmount: Math.round(netAmount * (Number(gstRate) || 0) / 100),
  };
  const next = {
    ...data,
    memberships,
    payments: [payment, ...data.payments],
    auditLog: withAudit(data, 'payment.collected', 'payment', payment.id, { memberId, amount: payment.amount }),
  };
  next.accountingEntries = withAccounting(next, {
    date: payment.date,
    type: 'membership',
    amount: payment.amount,
    method: payment.method,
    referenceId: payment.id,
    invoiceNumber: payment.invoiceNumber,
    memberId: payment.memberId,
    description: payment.notes,
  });
  persistAll(next);
  return { data: next, payment };
}

export function addAppointment(data, appointment) {
  const newAppointment = {
    ...appointment,
    id: `appt-${Date.now()}`,
    status: appointment.status || 'scheduled',
    createdAt: new Date().toISOString(),
  };
  const next = { ...data, appointments: [newAppointment, ...(data.appointments || [])], auditLog: withAudit(data, 'appointment.created', 'appointment', newAppointment.id) };
  persistAll(next);
  return { data: next, appointment: newAppointment };
}

export function updateAppointment(data, id, updates) {
  const appointments = (data.appointments || []).map((item) => item.id === id ? { ...item, ...updates } : item);
  const next = { ...data, appointments, auditLog: withAudit(data, 'appointment.updated', 'appointment', id, updates) };
  persistAll(next);
  return { data: next };
}

export function deleteAppointment(data, id) {
  const next = { ...data, appointments: (data.appointments || []).filter((item) => item.id !== id), auditLog: withAudit(data, 'appointment.deleted', 'appointment', id) };
  persistAll(next);
  return { data: next };
}

export function addInventoryItem(data, item) {
  const newItem = { ...item, id: `inv-${Date.now()}`, stock: Number(item.stock) || 0, price: Number(item.price) || 0, cost: Number(item.cost) || 0, status: 'active' };
  const next = { ...data, inventory: [newItem, ...(data.inventory || [])], auditLog: withAudit(data, 'inventory.created', 'inventory', newItem.id) };
  persistAll(next);
  return { data: next, item: newItem };
}

export function recordPosSale(data, { itemId, quantity = 1, memberId = '', paymentMethod = 'Cash' }) {
  const item = (data.inventory || []).find((entry) => entry.id === itemId);
  const qty = Number(quantity);
  if (!item || qty <= 0 || item.stock < qty) return { data, sale: null, error: 'Insufficient stock' };
  const sale = { id: `sale-${Date.now()}`, itemId, memberId, quantity: qty, amount: item.price * qty, paymentMethod, date: fmtDate(new Date()) };
  const inventory = data.inventory.map((entry) => entry.id === itemId ? { ...entry, stock: entry.stock - qty } : entry);
  const payment = memberId ? { id: `pay-${Date.now()}-pos`, memberId, amount: sale.amount, method: paymentMethod, date: sale.date, invoiceNumber: `POS-${Date.now()}`, status: 'success', type: 'pos', notes: item.name } : null;
  const next = { ...data, inventory, posSales: [sale, ...(data.posSales || [])], payments: payment ? [payment, ...data.payments] : data.payments, auditLog: withAudit(data, 'pos.sale', 'sale', sale.id, sale) };
  next.accountingEntries = withAccounting(next, {
    date: sale.date,
    type: 'pos',
    amount: sale.amount,
    method: sale.paymentMethod,
    referenceId: sale.id,
    invoiceNumber: payment?.invoiceNumber || `POS-${sale.id}`,
    memberId: sale.memberId,
    description: `POS sale: ${item.name} x${qty}`,
  });
  persistAll(next);
  return { data: next, sale };
}

export function recordStaffAttendance(data, { staffId, date = fmtDate(new Date()), status = 'present', checkIn = '', checkOut = '' }) {
  const existing = (data.staffAttendance || []).find((item) => item.staffId === staffId && item.date === date);
  const record = { id: existing?.id || `staff-att-${Date.now()}`, staffId, date, status, checkIn, checkOut };
  const staffAttendance = existing
    ? data.staffAttendance.map((item) => item.id === existing.id ? { ...item, ...record } : item)
    : [record, ...(data.staffAttendance || [])];
  const next = { ...data, staffAttendance, auditLog: withAudit(data, 'staff.attendance', 'staff', staffId, record) };
  persistAll(next);
  return { data: next, record };
}

export function closeCashDay(data, { date = fmtDate(new Date()), countedCash = 0, notes = '' }) {
  const cashSales = data.payments.filter((payment) => payment.date === date && payment.method === 'Cash').reduce((sum, payment) => sum + payment.amount, 0);
  const cashExpenses = data.expenses.filter((expense) => expense.date === date && expense.paymentMethod === 'Cash').reduce((sum, expense) => sum + expense.amount, 0);
  const expectedCash = cashSales - cashExpenses;
  const closing = { id: `cash-${Date.now()}`, date, cashSales, cashExpenses, expectedCash, countedCash: Number(countedCash), variance: Number(countedCash) - expectedCash, notes, closedAt: new Date().toISOString() };
  const next = { ...data, cashClosings: [closing, ...(data.cashClosings || [])], auditLog: withAudit(data, 'cash.closed', 'cashClosing', closing.id, closing) };
  persistAll(next);
  return { data: next, closing };
}

export function renewMembership(data, memberId, { planId, startDate, paymentAmount = 0, paymentMethod = 'Cash' }) {
  const member = data.members.find((m) => m.id === memberId);
  const plan = data.plans.find((p) => p.id === planId);
  if (!member || !plan) return { data, membership: null };

  const start = new Date(startDate);
  const expiry = addMonths(start, plan.durationMonths);
  const paidAmount = Number(paymentAmount);
  const membership = {
    id: `ms-${member.id}-${Date.now()}`,
    memberId: member.id,
    planId: plan.id,
    planName: plan.name,
    startDate: fmtDate(start),
    expiryDate: fmtDate(expiry),
    amount: plan.price,
    autoRenew: Boolean(plan.autoRenew),
    ptSessionsRemaining: Number(plan.ptSessions) || 0,
    paidAmount,
    pendingAmount: Math.max(0, plan.price - paidAmount),
    status: paidAmount >= plan.price ? 'active' : 'pending',
    invoiceNumber: `INV-${member.memberId}-${fmtDate(start).replace(/-/g, '')}`,
  };
  let next = { ...data, memberships: [membership, ...data.memberships] };
  if (paidAmount > 0) {
    next = {
      ...next,
      payments: [{
        id: `pay-${Date.now()}`,
        memberId: member.id,
        amount: paidAmount,
        method: paymentMethod,
        date: fmtDate(new Date()),
        invoiceNumber: membership.invoiceNumber,
        status: 'success',
        notes: 'Membership renewal payment',
        type: 'membership',
      }, ...next.payments],
    };
    next.accountingEntries = withAccounting(next, {
      date: fmtDate(new Date()),
      type: 'membership',
      amount: paidAmount,
      method: paymentMethod,
      referenceId: next.payments[0].id,
      invoiceNumber: membership.invoiceNumber,
      memberId: member.id,
      description: 'Membership renewal payment',
    });
  }
  persistAll(next);
  return { data: next, membership };
}

export function refundMembership(data, membershipId, { method = 'Cash', date = fmtDate(new Date()), notes = '' } = {}) {
  const membership = data.memberships.find((m) => m.id === membershipId);
  if (!membership || membership.refundedAt || membership.paidAmount <= 0) {
    return { data, refundAmount: 0, usedDays: 0, totalDays: 0 };
  }

  const start = new Date(membership.startDate);
  const expiry = new Date(membership.expiryDate);
  const today = new Date();
  const dayMs = 86400000;
  const totalDays = Math.max(1, Math.ceil((expiry - start) / dayMs));
  const usedDays = new Set(
    data.attendance
      .filter((record) => record.memberId === membership.memberId)
      .filter((record) => {
        const date = new Date(record.date);
        return date >= start && date <= today;
      })
      .map((record) => record.date)
  ).size;
  const refundAmount = Math.max(0, Math.round(membership.paidAmount * (totalDays - usedDays) / totalDays));
  const memberships = data.memberships.map((item) =>
    item.id === membershipId
      ? { ...item, status: 'refunded', refundAmount, refundedAt: date }
      : item
  );
  const refund = {
    id: `refund-${Date.now()}`,
    memberId: membership.memberId,
    amount: -refundAmount,
    method,
    date,
    invoiceNumber: membership.invoiceNumber,
    status: 'refunded',
    notes: notes || `Refund for unused ${totalDays - usedDays} day(s)`,
    type: 'refund',
  };
  const next = {
    ...data,
    memberships,
    payments: refundAmount > 0 ? [refund, ...data.payments] : data.payments,
  };
  next.accountingEntries = withAccounting(next, {
    date,
    type: 'refund',
    amount: -refundAmount,
    method,
    referenceId: refund.id,
    invoiceNumber: refund.invoiceNumber,
    memberId: refund.memberId,
    description: refund.notes,
  });
  persistAll(next);
  return { data: next, refundAmount, usedDays, totalDays, refund };
}

export function addMessage(data, message) {
  const newMessage = { ...message, id: `msg-${Date.now()}`, sentAt: new Date().toISOString() };
  const messages = [newMessage, ...(data.messages || [])];
  const next = { ...data, messages };
  persistAll(next);
  return { data: next, message: newMessage };
}

export function getDashboardStats(data) {
  const today = fmtDate(new Date());
  const activeMembers = data.members.filter((m) => m.status === 'active').length;
  const todaysAttendance = data.attendance.filter((a) => a.date === today).length;
  const todaysRevenue = data.payments
    .filter((p) => p.date === today)
    .reduce((sum, p) => sum + p.amount, 0);
  const weekAgo = fmtDate(new Date(Date.now() - 7 * 86400000));
  const weekCollection = data.payments
    .filter((p) => p.date >= weekAgo)
    .reduce((sum, p) => sum + p.amount, 0);
  const monthAgo = fmtDate(new Date(Date.now() - 30 * 86400000));
  const monthCollection = data.payments
    .filter((p) => p.date >= monthAgo)
    .reduce((sum, p) => sum + p.amount, 0);
  const pendingPayments = data.memberships.reduce((sum, m) => sum + m.pendingAmount, 0);
  const expiringSoon = data.memberships.filter(
    (m) => new Date(m.expiryDate) > new Date(today) && new Date(m.expiryDate) <= new Date(fmtDate(new Date(Date.now() + 7 * 86400000)))
  ).length;
  const expired = data.memberships.filter((m) => m.expiryDate < today).length;
  const newLeads = data.leads.filter((l) => l.status === 'New Lead').length;
  const newMembers = data.members.filter((m) => m.joiningDate >= weekAgo).length;
  const totalExpenses = data.expenses.reduce((sum, e) => sum + e.amount, 0);
  const totalRevenue = data.payments.reduce((sum, p) => sum + p.amount, 0);

  return {
    activeMembers,
    todaysAttendance,
    todaysRevenue,
    weekCollection,
    monthCollection,
    pendingPayments,
    expiringSoon,
    expired,
    newLeads,
    newMembers,
    totalExpenses,
    netRevenue: totalRevenue - totalExpenses,
  };
}

export function getNeedsAttention(data) {
  const today = fmtDate(new Date());
  const weekLater = fmtDate(new Date(Date.now() + 7 * 86400000));
  const expiring = data.memberships.filter(
    (m) => new Date(m.expiryDate) > new Date(today) && new Date(m.expiryDate) <= new Date(weekLater)
  );
  const pending = data.memberships.filter((m) => m.pendingAmount > 0);
  const leadFollowups = data.leads.filter(
    (l) => l.followUpDate <= today && !['Converted', 'Not Interested'].includes(l.status)
  );
  const inactive = data.members.filter((m) => m.status === 'inactive');
  const expired = data.memberships.filter((m) => m.expiryDate < today);
  return { expiring, pending, leadFollowups, inactive, expired };
}
