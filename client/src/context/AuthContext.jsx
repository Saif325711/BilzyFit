import { createContext, useContext, useMemo, useCallback } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';

export const roles = {
  SUPER_ADMIN: 'Super Admin',
  GYM_OWNER: 'Gym Owner',
  MANAGER: 'Manager',
  RECEPTIONIST: 'Receptionist',
  TRAINER: 'Trainer',
  MEMBER: 'Member',
};

export const rolePermissions = {
  [roles.SUPER_ADMIN]: ['*'],
  [roles.GYM_OWNER]: [
    'dashboard',
    'members',
    'memberships',
    'attendance',
    'finance',
    'workouts',
    'diets',
    'leads',
    'staff',
    'trainers',
    'reports',
    'analytics',
    'settings',
    'branches',
    'messaging',
    'member-app',
    'operations',
    'subscription',
  ],
  [roles.MANAGER]: [
    'dashboard',
    'members',
    'memberships',
    'attendance',
    'leads',
    'reports',
    'workouts',
    'diets',
    'messaging',
    'operations',
    'subscription',
  ],
  [roles.RECEPTIONIST]: [
    'dashboard',
    'members',
    'memberships',
    'attendance',
    'finance',
    'operations',
    'subscription',
  ],
  [roles.TRAINER]: ['dashboard', 'members', 'workouts', 'diets'],
  [roles.MEMBER]: ['member-app'],
};

// Maps staff roles (as stored in the Staff page) → system roles (with permissions)
const STAFF_ROLE_MAP = {
  'Gym Owner': roles.GYM_OWNER,
  'Manager': roles.MANAGER,
  'Receptionist': roles.RECEPTIONIST,
  'Trainer': roles.TRAINER,
  'Nutritionist': roles.TRAINER,
  'Cleaner': roles.RECEPTIONIST,
  'Security': roles.RECEPTIONIST,
  'Other': roles.RECEPTIONIST,
};

const demoUsers = [
  { id: 'u1', email: 'owner@gym.com', name: 'Amit Verma', role: roles.GYM_OWNER, avatar: '', workspaceId: 'demo-workspace' },
  { id: 'u2', email: 'manager@gym.com', name: 'Priya Sharma', role: roles.MANAGER, avatar: '', workspaceId: 'demo-workspace' },
  { id: 'u3', email: 'reception@gym.com', name: 'Rohan Das', role: roles.RECEPTIONIST, avatar: '', workspaceId: 'demo-workspace' },
  { id: 'u4', email: 'trainer@gym.com', name: 'Sneha Patel', role: roles.TRAINER, avatar: '', workspaceId: 'demo-workspace' },
  { id: 'u5', email: 'member@gym.com', name: 'Rahul Sharma', role: roles.MEMBER, avatar: '', workspaceId: 'demo-workspace' },
];

const TRIAL_USERS_KEY = 'bilzyfit_trial_users';
const WORKSPACE_STORAGE_PREFIX = 'bilzyfit_workspace_';

function getTrialUsers() {
  try {
    return JSON.parse(localStorage.getItem(TRIAL_USERS_KEY) || '[]');
  } catch {
    return [];
  }
}

function isTrialExpired(user) {
  return Boolean(user?.trialEndsAt && new Date(user.trialEndsAt).getTime() <= Date.now());
}

async function hashPassword(password) {
  if (window.crypto?.subtle) {
    const bytes = new TextEncoder().encode(`bilzyfit-local-v1:${password}`);
    const digest = await window.crypto.subtle.digest('SHA-256', bytes);
    return Array.from(new Uint8Array(digest)).map((byte) => byte.toString(16).padStart(2, '0')).join('');
  }
  return btoa(unescape(encodeURIComponent(`bilzyfit-local-v1:${password}`)));
}

// Read staff list from a workspace's localStorage
function getWorkspaceStaff(workspaceId) {
  try {
    const key = `${WORKSPACE_STORAGE_PREFIX}${workspaceId}`;
    const raw = localStorage.getItem(key)
      || (workspaceId === 'demo-workspace' ? localStorage.getItem('bilzyfit_data') : null);
    if (!raw) {
      if (workspaceId === 'demo-workspace') {
        return [
          { id: 's1', name: 'Priya Sharma', phone: '9876543210', email: 'manager@gym.com', role: 'Manager', status: 'active', loginEnabled: true },
          { id: 's2', name: 'Rohan Das', phone: '9876543211', email: 'reception@gym.com', role: 'Receptionist', status: 'active', loginEnabled: true },
          { id: 's3', name: 'Sneha Patel', phone: '9876543212', email: 'trainer@gym.com', role: 'Trainer', status: 'active', loginEnabled: true },
          { id: 's4', name: 'Amit Verma', phone: '9876543213', email: 'owner@gym.com', role: 'Gym Owner', status: 'active', loginEnabled: true },
          { id: 's5', name: 'Neha Gupta', phone: '9876543214', email: 'nutrition@gym.com', role: 'Nutritionist', status: 'active', loginEnabled: true },
        ];
      }
      return [];
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed.staff) ? parsed.staff : [];
  } catch {
    return [];
  }
}

// Find which workspaces exist in localStorage and return all their IDs
function getAllWorkspaceIds() {
  const ids = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith(WORKSPACE_STORAGE_PREFIX)) {
      ids.push(key.replace(WORKSPACE_STORAGE_PREFIX, ''));
    }
  }
  if (!ids.includes('demo-workspace')) {
    ids.push('demo-workspace');
  }
  return ids;
}

// Helper to unpack workspace and staff info from a shareable staff login link
export function importWorkspaceFromToken(token) {
  try {
    if (!token) return { success: false };
    const json = decodeURIComponent(escape(atob(token)));
    const payload = JSON.parse(json);
    if (payload && payload.wsId) {
      const key = `${WORKSPACE_STORAGE_PREFIX}${payload.wsId}`;
      const existing = JSON.parse(localStorage.getItem(key) || '{}');
      const merged = {
        ...existing,
        workspaceId: payload.wsId,
        businessName: payload.gymName || existing.businessName || 'Gym Workspace',
        staff: Array.isArray(payload.staff) ? payload.staff : (existing.staff || []),
        settings: {
          ...(existing.settings || {}),
          gymName: payload.gymName || existing.settings?.gymName || 'Gym Workspace',
        },
      };
      localStorage.setItem(key, JSON.stringify(merged));
      return { success: true, wsId: payload.wsId, gymName: payload.gymName };
    }
  } catch (err) {
    console.error('Failed to import workspace from token', err);
  }
  return { success: false };
}

// Helper for gym owners to create a full shareable login link for staff
export function generateStaffLoginLink(workspaceId = 'demo-workspace', gymName = 'BilzyFit Gym', staffList = []) {
  try {
    const origin = window.location.origin;
    const roster = (staffList || []).map((s) => ({
      id: s.id,
      name: s.name,
      role: s.role,
      status: s.status,
      loginEnabled: Boolean(s.loginEnabled),
      passwordHash: s.passwordHash || '',
      email: s.email || '',
      photo: s.photo || '',
    }));
    const payload = {
      wsId: workspaceId,
      gymName: gymName || 'BilzyFit Gym',
      staff: roster,
    };
    const token = btoa(unescape(encodeURIComponent(JSON.stringify(payload))));
    return `${origin}/login?tab=staff&ws=${encodeURIComponent(workspaceId)}&gym=${encodeURIComponent(gymName || '')}&auth=${encodeURIComponent(token)}`;
  } catch {
    return `${window.location.origin}/login?tab=staff&ws=${encodeURIComponent(workspaceId)}`;
  }
}

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useLocalStorage('gym_user', demoUsers[0]);
  const currentUser = user ? { ...user, workspaceId: user.workspaceId || 'demo-workspace' } : null;

  // --- Owner / Admin login (email + password) ---
  const login = useCallback(async (email, password) => {
    const found = [...demoUsers, ...getTrialUsers()].find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (found && isTrialExpired(found)) {
      return { success: false, message: 'Your 3-day free trial has expired.' };
    }
    if (found && password === 'password') {
      setUser({ ...found, workspaceId: found.workspaceId || 'demo-workspace', lastLoginAt: new Date().toISOString() });
      return { success: true };
    }
    if (found?.passwordHash && found.passwordHash === await hashPassword(password)) {
      setUser({ ...found, lastLoginAt: new Date().toISOString() });
      return { success: true };
    }
    if (found?.password === password) {
      const upgraded = { ...found, passwordHash: await hashPassword(password), password: undefined, lastLoginAt: new Date().toISOString() };
      const trials = getTrialUsers().map((item) => item.id === found.id ? upgraded : item);
      localStorage.setItem(TRIAL_USERS_KEY, JSON.stringify(trials));
      setUser(upgraded);
      return { success: true };
    }
    return { success: false, message: 'Invalid email or password' };
  }, [setUser]);

  // --- Staff login (name + role + password, scoped to a workspaceId) ---
  const loginAsStaff = useCallback(async (name, staffRole, password, workspaceId) => {
    if (!name.trim() || !password.trim()) {
      return { success: false, message: 'Please fill in all fields (Name and Password).' };
    }

    // Determine which workspaces to search
    const wsIds = workspaceId
      ? [workspaceId, ...getAllWorkspaceIds().filter((id) => id !== workspaceId)]
      : getAllWorkspaceIds();

    if (wsIds.length === 0) {
      return { success: false, message: 'No gym workspace found. Ask your gym owner to share their staff login link.' };
    }

    const hash = await hashPassword(password);

    for (const wsId of wsIds) {
      const staffList = getWorkspaceStaff(wsId);
      const match = staffList.find((s) => {
        const nameMatch = s.name.trim().toLowerCase() === name.trim().toLowerCase();
        const roleMatch = !staffRole || s.role.toLowerCase() === staffRole.toLowerCase();
        return nameMatch && roleMatch && s.loginEnabled && s.status === 'active';
      });

      if (match) {
        // Verify password (custom hashed password OR default 'password' if not hashed yet)
        const isValid = match.passwordHash
          ? match.passwordHash === hash
          : password === 'password';

        if (!isValid) {
          return { success: false, message: 'Incorrect password.' };
        }

        // Map staff role → system role for permissions
        const systemRole = STAFF_ROLE_MAP[match.role] || roles.RECEPTIONIST;
        const staffUser = {
          id: `staff-${match.id}`,
          email: match.email || '',
          name: match.name,
          role: systemRole,
          staffRole: match.role,
          staffId: match.id,
          avatar: match.photo || '',
          workspaceId: wsId,
          isStaff: true,
          lastLoginAt: new Date().toISOString(),
        };
        setUser(staffUser);
        return { success: true, user: staffUser };
      }

      // If name matches but no login enabled → helpful error
      const nameOnly = staffList.find(
        (s) => s.name.trim().toLowerCase() === name.trim().toLowerCase()
      );
      if (nameOnly && !nameOnly.loginEnabled) {
        return { success: false, message: 'Login is not enabled for this staff member. Ask your gym owner to enable login in the Staff section.' };
      }
    }

    return { success: false, message: 'Staff member not found. Please verify your name, role, and password.' };
  }, [setUser]);

  const registerTrial = useCallback(async (details) => {
    const email = details.email.trim().toLowerCase();
    const mobile = details.mobile.trim();
    if (details.password.trim().length < 8) return { success: false, message: 'Use a password with at least 8 characters.' };
    const exists = [...demoUsers, ...getTrialUsers()].some(
      (item) => item.email.toLowerCase() === email || item.mobile === mobile
    );
    if (exists) return { success: false, message: 'An account already exists with this email or mobile number.' };

    const workspaceId = `workspace-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const now = new Date().toISOString();
    const trialUser = {
      id: `trial-${Date.now()}`,
      email,
      password: details.password,
      name: details.businessName.trim(),
      businessName: details.businessName.trim(),
      businessType: details.businessType,
      mobile,
      country: details.country,
      role: roles.GYM_OWNER,
      avatar: '',
      workspaceId,
      trialStartedAt: now,
      trialEndsAt: new Date(Date.now() + 3 * 86400000).toISOString(),
      isTrial: true,
      conversionStatus: 'trial',
      conversionSource: 'landing-trial',
      conversionStartedAt: now,
      convertedAt: null,
      conversionPlan: null,
      passwordHash: await hashPassword(details.password),
    };
    localStorage.setItem(TRIAL_USERS_KEY, JSON.stringify([...getTrialUsers(), trialUser]));
    setUser(trialUser);
    return { success: true, user: trialUser };
  }, [setUser]);

  const markTrialConverted = useCallback((conversionPlan = 'local-demo-plan') => {
    if (!currentUser?.isTrial) return { success: false };
    const converted = {
      ...currentUser,
      conversionStatus: 'converted',
      conversionPlan,
      convertedAt: new Date().toISOString(),
      isTrial: false,
      trialEndsAt: null,
    };
    const trials = getTrialUsers().map((item) => item.id === converted.id ? converted : item);
    localStorage.setItem(TRIAL_USERS_KEY, JSON.stringify(trials));
    setUser(converted);
    return { success: true, user: converted };
  }, [currentUser, setUser]);

  const logout = useCallback(() => setUser(null), [setUser]);

  const canAccess = useCallback((permission) => {
    if (!currentUser) return false;
    const perms = rolePermissions[currentUser.role] || [];
    return perms.includes('*') || perms.includes(permission);
  }, [currentUser]);

  const value = useMemo(
    () => ({ user: currentUser, login, loginAsStaff, registerTrial, markTrialConverted, logout, canAccess, demoUsers }),
    [currentUser, login, loginAsStaff, registerTrial, markTrialConverted, logout, canAccess]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
