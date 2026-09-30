import { createContext, useContext, useEffect, useState, useMemo, useCallback } from 'react';
import { loadAll, persistAll } from '../data/services';
import { pullWorkspacePlans } from '../data/sync';
import { setActiveWorkspace } from '../data/seed';
import { useAuth } from './AuthContext';
import { isFirebaseConfigured } from '../firebase/config';
import { subscribeToFirestoreWorkspace, testFirestoreConnection } from '../firebase/firestoreService';

const DataContext = createContext(null);

export function DataProvider({ children }) {
  const { user } = useAuth();
  const workspaceId = user?.workspaceId || 'demo-workspace';
  const [data, setData] = useState(() => {
    setActiveWorkspace(workspaceId);
    return loadAll(workspaceId);
  });
  const [loadedWorkspaceId, setLoadedWorkspaceId] = useState(workspaceId);
  const [isCloudConnected, setIsCloudConnected] = useState(() => isFirebaseConfigured());

  // Workspace switch handler
  useEffect(() => {
    if (loadedWorkspaceId !== workspaceId) {
      setActiveWorkspace(workspaceId);
      setData(loadAll(workspaceId));
      setLoadedWorkspaceId(workspaceId);
    }
  }, [loadedWorkspaceId, workspaceId]);

  // Local persistence
  useEffect(() => {
    if (loadedWorkspaceId === workspaceId) persistAll(data, workspaceId);
  }, [data, loadedWorkspaceId, workspaceId]);

  // Sync workspace plans via fallback sync
  useEffect(() => {
    let active = true;
    pullWorkspacePlans(workspaceId).then((remote) => {
      if (!active) return;
      setData((current) => {
        const mergeMemberPlans = (localPlans = [], remotePlans = []) => {
          const localIds = new Set(localPlans.map((item) => item.id));
          return [
            ...localPlans,
            ...remotePlans.filter((item) => item.source === 'member' && !localIds.has(item.id)),
          ];
        };
        return {
          ...current,
          workouts: mergeMemberPlans(current.workouts, remote.workouts),
          diets: mergeMemberPlans(current.diets, remote.diets),
        };
      });
    });
    return () => {
      active = false;
    };
  }, [workspaceId]);

  // Real-time Firestore synchronization
  useEffect(() => {
    let unsubscribeFirestore = null;

    const setupFirestoreListener = () => {
      if (isFirebaseConfigured()) {
        testFirestoreConnection().then((res) => {
          setIsCloudConnected(res.success);
        });

        unsubscribeFirestore = subscribeToFirestoreWorkspace(workspaceId, (remoteData) => {
          setData((current) => {
            // Only merge collections that have remote documents
            const nextMembers = (remoteData.members && remoteData.members.length > 0) ? remoteData.members : current.members;
            const nextWorkouts = (remoteData.workouts && remoteData.workouts.length > 0) ? remoteData.workouts : current.workouts;
            const nextDiets = (remoteData.diets && remoteData.diets.length > 0) ? remoteData.diets : current.diets;
            const nextAttendance = (remoteData.attendance && remoteData.attendance.length > 0) ? remoteData.attendance : current.attendance;
            const nextPayments = (remoteData.payments && remoteData.payments.length > 0) ? remoteData.payments : current.payments;
            const nextPlans = (remoteData.plans && remoteData.plans.length > 0) ? remoteData.plans : current.plans;
            const nextSettings = remoteData.settings ? { ...current.settings, ...remoteData.settings } : current.settings;

            return {
              ...current,
              members: nextMembers,
              workouts: nextWorkouts,
              diets: nextDiets,
              attendance: nextAttendance,
              payments: nextPayments,
              plans: nextPlans,
              settings: nextSettings,
            };
          });
        });
      } else {
        setIsCloudConnected(false);
      }
    };

    setupFirestoreListener();

    const handleConfigChange = () => {
      if (unsubscribeFirestore) {
        unsubscribeFirestore();
        unsubscribeFirestore = null;
      }
      setupFirestoreListener();
    };

    window.addEventListener('bilzyfit-firebase-config-updated', handleConfigChange);
    return () => {
      if (unsubscribeFirestore) unsubscribeFirestore();
      window.removeEventListener('bilzyfit-firebase-config-updated', handleConfigChange);
    };
  }, [workspaceId]);

  const refresh = useCallback(() => setData(loadAll(workspaceId)), [workspaceId]);

  // --- Multi-Branch Management ---
  const [activeBranch, setActiveBranchState] = useState(() => {
    return localStorage.getItem(`bilzyfit_active_branch_${workspaceId}`) || 'all';
  });

  const setActiveBranch = useCallback((branchNameOrId) => {
    const val = branchNameOrId || 'all';
    setActiveBranchState(val);
    try {
      localStorage.setItem(`bilzyfit_active_branch_${workspaceId}`, val);
      window.dispatchEvent(new CustomEvent('bilzyfit-branch-change', { detail: { branch: val } }));
    } catch {
      // ignore
    }
  }, [workspaceId]);

  const branches = useMemo(() => data.settings?.branches || [], [data.settings?.branches]);

  const currentBranch = useMemo(() => {
    if (activeBranch === 'all') return null;
    return branches.find((b) => b.name === activeBranch || b.id === activeBranch) || null;
  }, [branches, activeBranch]);

  // Scoped data filtered by active branch
  const scopedData = useMemo(() => {
    if (activeBranch === 'all' || !activeBranch) {
      return data;
    }
    const branchName = currentBranch?.name || activeBranch;
    const branchMembers = data.members.filter((m) => m.branch === branchName);
    const branchMemberIds = new Set(branchMembers.map((m) => m.id));
    const branchAttendance = data.attendance.filter((a) => branchMemberIds.has(a.memberId));
    const branchPayments = data.payments.filter((p) => branchMemberIds.has(p.memberId));
    const branchMemberships = data.memberships.filter((ms) => branchMemberIds.has(ms.memberId));
    const branchExpenses = data.expenses.filter((e) => !e.branch || e.branch === branchName || e.branch === 'All Branches');
    const branchLeads = data.leads.filter((l) => !l.branch || l.branch === branchName);
    const branchStaff = data.staff.filter((s) => !s.branch || s.branch === branchName || s.branch === 'All Branches');
    const branchTrainers = data.trainers.filter((t) => !t.branch || t.branch === branchName || t.branch === 'All Branches');

    return {
      ...data,
      members: branchMembers,
      attendance: branchAttendance,
      payments: branchPayments,
      memberships: branchMemberships,
      expenses: branchExpenses,
      leads: branchLeads,
      staff: branchStaff,
      trainers: branchTrainers,
    };
  }, [data, activeBranch, currentBranch]);

  // Helper to compute quick statistics for any branch (or 'all')
  const getBranchStats = useCallback((targetBranchName) => {
    const isAll = !targetBranchName || targetBranchName === 'all';
    const targetMembers = isAll
      ? data.members
      : data.members.filter((m) => m.branch === targetBranchName);
    const targetMemberIds = new Set(targetMembers.map((m) => m.id));

    const totalMembers = targetMembers.length;
    const activeMembers = targetMembers.filter((m) => m.status === 'active').length;
    const totalRevenue = data.payments
      .filter((p) => isAll || targetMemberIds.has(p.memberId))
      .reduce((sum, p) => sum + (p.amount || 0), 0);
    const today = new Date().toISOString().split('T')[0];
    const todayAttendance = data.attendance
      .filter((a) => a.date === today && (isAll || targetMemberIds.has(a.memberId))).length;
    const totalStaff = data.staff
      .filter((s) => isAll || !s.branch || s.branch === targetBranchName || s.branch === 'All Branches').length;

    return {
      totalMembers,
      activeMembers,
      totalRevenue,
      todayAttendance,
      totalStaff,
    };
  }, [data]);

  const value = useMemo(
    () => ({
      data,
      setData,
      scopedData,
      refresh,
      activeBranch,
      setActiveBranch,
      branches,
      currentBranch,
      getBranchStats,
      isCloudConnected,
      setIsCloudConnected,
    }),
    [
      data,
      scopedData,
      refresh,
      activeBranch,
      setActiveBranch,
      branches,
      currentBranch,
      getBranchStats,
      isCloudConnected,
    ]
  );

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export const useData = () => useContext(DataContext);
