import {
  collection,
  doc,
  setDoc,
  getDocs,
  onSnapshot,
  query,
  where,
  serverTimestamp,
  writeBatch,
} from 'firebase/firestore';
import { db, isFirebaseConfigured, initFirebase } from './config';

/**
 * Test connectivity with Firestore
 */
export async function testFirestoreConnection(customConfig = null) {
  try {
    const initialized = customConfig ? initFirebase(customConfig) : { db, isConfigured: isFirebaseConfigured() };
    const targetDb = initialized.db;

    if (!targetDb) {
      return { success: false, message: 'Firebase credentials are missing or incomplete.' };
    }

    const testDocRef = doc(targetDb, '_system_health', 'ping');
    await setDoc(testDocRef, {
      ping: 'pong',
      timestamp: serverTimestamp(),
      clientTime: new Date().toISOString(),
    });

    return { success: true, message: 'Successfully connected to Firebase Firestore in real-time!' };
  } catch (error) {
    console.error('Firestore connection test failed:', error);
    return { success: false, message: error.message || 'Failed to connect to Firestore.' };
  }
}

/**
 * Real-time listener for entire workspace data across multiple collections.
 * Whenever any member, workout, diet, attendance, payment or plan is changed in Firestore,
 * this triggers real-time updates without page reloads.
 */
export function subscribeToFirestoreWorkspace(workspaceId = 'demo-workspace', onUpdate) {
  if (!isFirebaseConfigured() || !db) {
    return () => {};
  }

  const collections = ['members', 'workouts', 'diets', 'attendance', 'payments', 'plans', 'settings'];
  const unsubscribers = [];
  const cache = {
    members: [],
    workouts: [],
    diets: [],
    attendance: [],
    payments: [],
    plans: [],
    settings: null,
  };

  collections.forEach((colName) => {
    try {
      const colRef = collection(db, `workspaces/${workspaceId}/${colName}`);
      const unsub = onSnapshot(colRef, (snapshot) => {
        if (colName === 'settings') {
          if (!snapshot.empty) {
            cache.settings = snapshot.docs[0].data();
          }
        } else {
          cache[colName] = snapshot.docs.map((docSnap) => ({
            id: docSnap.id,
            ...docSnap.data(),
          }));
        }

        // Notify listener with latest Firestore state
        onUpdate({ ...cache });
      }, (error) => {
        console.warn(`Firestore listener for ${colName} received error:`, error);
      });

      unsubscribers.push(unsub);
    } catch (err) {
      console.warn(`Failed to attach listener for ${colName}:`, err);
    }
  });

  return () => {
    unsubscribers.forEach((u) => {
      try {
        u();
      } catch {}
    });
  };
}

/**
 * Upload all current local data (Members, Plans, Workouts, Diets, etc.) to Firestore
 * This gives the user an instant One-Click Migration to Cloud!
 */
export async function migrateLocalDataToFirestore(localData, workspaceId = 'demo-workspace', onProgress = null) {
  const initialized = initFirebase();
  const targetDb = initialized.db;

  if (!targetDb) {
    throw new Error('Firebase Firestore is not initialized. Please configure credentials first.');
  }

  const steps = [
    { name: 'settings', items: [localData.settings || {}], isDoc: true },
    { name: 'members', items: localData.members || [] },
    { name: 'plans', items: localData.plans || [] },
    { name: 'workouts', items: localData.workouts || [] },
    { name: 'diets', items: localData.diets || [] },
    { name: 'attendance', items: (localData.attendance || []).slice(0, 500) },
    { name: 'payments', items: (localData.payments || []).slice(0, 500) },
  ];

  let completedSteps = 0;

  for (const step of steps) {
    if (step.isDoc) {
      const docRef = doc(targetDb, `workspaces/${workspaceId}/settings`, 'config');
      await setDoc(docRef, { ...step.items[0], updatedAt: new Date().toISOString() }, { merge: true });
    } else if (step.items.length > 0) {
      // Chunk into batches of 450 (Firestore limit is 500)
      const chunkSize = 400;
      for (let i = 0; i < step.items.length; i += chunkSize) {
        const batch = writeBatch(targetDb);
        const chunk = step.items.slice(i, i + chunkSize);

        chunk.forEach((item) => {
          const docId = String(item.id || item.memberId || `${step.name}-${Date.now()}`);
          const itemRef = doc(targetDb, `workspaces/${workspaceId}/${step.name}`, docId);
          batch.set(itemRef, { ...item, syncedAt: new Date().toISOString() }, { merge: true });
        });

        await batch.commit();
      }
    }

    completedSteps++;
    if (onProgress) {
      onProgress(Math.round((completedSteps / steps.length) * 100), step.name);
    }
  }

  return { success: true, count: steps.reduce((sum, s) => sum + s.items.length, 0) };
}

/**
 * Look up gym branch automatically by 6-digit Secret Code (and optional identifier)
 */
export async function lookupBranchBySecretCode(secretCode, identifier = '', workspaceId = 'demo-workspace') {
  const cleanCode = String(secretCode || '').trim();
  const cleanId = String(identifier || '').trim().toLowerCase();

  if (cleanCode.length !== 6) return null;

  // 1. Direct REST query (fast and universally available)
  try {
    const res = await fetch(`https://firestore.googleapis.com/v1/projects/bilzyfit/databases/(default)/documents/workspaces/${workspaceId}/members?pageSize=300`);
    if (res.ok) {
      const json = await res.json();
      if (json.documents) {
        for (const doc of json.documents) {
          const fields = doc.fields || {};
          const docCode = String(fields.secretCode?.stringValue || fields.pin?.stringValue || '').trim();
          if (docCode === cleanCode) {
            return fields.branch?.stringValue || 'Star Fitness Center';
          }
        }
      }
    }
  } catch (_) {}

  // 2. Fallback check for demo code 749201
  if (cleanCode === '749201' || cleanId === 'gm1001') {
    return 'Star Fitness Center';
  }

  // 3. Firestore SDK query
  if (isFirebaseConfigured() && db) {
    try {
      const membersRef = collection(db, `workspaces/${workspaceId}/members`);
      const querySnapshot = await getDocs(membersRef);

      for (const docSnap of querySnapshot.docs) {
        const data = docSnap.data();
        const docCode = String(data.secretCode || data.pin || '').trim();
        if (docCode === cleanCode) {
          return data.branch || 'Star Fitness Center';
        }
      }
    } catch (err) {
      console.error('Error looking up branch by secret code:', err);
    }
  }

  return null;
}

/**
 * Real-time member verification for Member Portal primarily via 6-digit Secret Code (and optional Name)
 */
export async function verifyMemberWithFirestore(identifier, secretCode, selectedBranch = null, workspaceId = 'demo-workspace') {
  const cleanCode = String(secretCode || '').trim();
  const cleanName = String(identifier || '').trim();
  const cleanId = cleanName.toLowerCase();

  if (cleanCode.length !== 6) {
    return { success: false, reason: 'invalid_secret_code', message: 'Please enter a valid 6-digit Secret Code.' };
  }

  let matchedMember = null;

  // 1. Direct REST query (fastest, no SDK auth requirement)
  try {
    const res = await fetch(`https://firestore.googleapis.com/v1/projects/bilzyfit/databases/(default)/documents/workspaces/${workspaceId}/members?pageSize=300`);
    if (res.ok) {
      const json = await res.json();
      if (json.documents) {
        for (const doc of json.documents) {
          const fields = doc.fields || {};
          const docCode = String(fields.secretCode?.stringValue || fields.pin?.stringValue || '').trim();
          if (docCode === cleanCode) {
            const rawMap = {};
            Object.entries(fields).forEach(([k, v]) => {
              if (v && typeof v === 'object') {
                rawMap[k] = v.stringValue || v.integerValue || v.booleanValue || v.doubleValue || '';
              }
            });
            const docId = doc.name.split('/').pop();
            rawMap.id = rawMap.id || docId;
            matchedMember = rawMap;
            break;
          }
        }
      }
    }
  } catch (_) {}

  // 2. Firestore SDK query
  if (!matchedMember && isFirebaseConfigured() && db) {
    try {
      const membersRef = collection(db, `workspaces/${workspaceId}/members`);
      const querySnapshot = await getDocs(membersRef);
      for (const docSnap of querySnapshot.docs) {
        const data = docSnap.data();
        const docCode = String(data.secretCode || data.pin || '').trim();
        const docMemberId = String(data.memberId || docSnap.id).toLowerCase();
        if (docCode === cleanCode || (cleanId && docMemberId === cleanId)) {
          matchedMember = { id: docSnap.id, ...data };
          break;
        }
      }
    } catch (error) {
      console.warn('Firestore SDK query notice:', error);
    }
  }

  // 3. Fallback demo check if 749201
  if (!matchedMember && cleanCode === '749201') {
    matchedMember = {
      id: 'm1001',
      memberId: 'GM1001',
      fullName: cleanName || 'Sanjay Gupta',
      secretCode: '749201',
      branch: selectedBranch || 'Star Fitness Center',
      mobile: '9811122334',
    };
  }

  if (!matchedMember) {
    return { success: false, reason: 'invalid_secret_code', message: 'Invalid 6-digit Secret Code. Check your admission receipt.' };
  }

  if (cleanName) {
    matchedMember.fullName = cleanName;
  }

  // Verify Selected Branch
  if (selectedBranch && selectedBranch !== 'all' && !selectedBranch.startsWith('Enter Secret Code')) {
    const memberBranch = String(matchedMember.branch || 'Star Fitness Center').trim().toLowerCase();
    const targetBranch = String(selectedBranch).trim().toLowerCase();

    if (memberBranch !== targetBranch && !memberBranch.includes(targetBranch) && !targetBranch.includes(memberBranch)) {
      return {
        success: false,
        reason: 'branch_mismatch',
        actualBranch: matchedMember.branch || 'Star Fitness Center',
        message: `Access Denied: You are registered under "${matchedMember.branch || 'Star Fitness Center'}". You cannot access "${selectedBranch}".`,
      };
    }
  }

  return { success: true, member: matchedMember };
}

/**
 * Save or update single member in Firestore
 */
export async function saveMemberToFirestore(member, workspaceId = 'demo-workspace') {
  if (!isFirebaseConfigured() || !db || !member) return;
  try {
    const docId = String(member.id || member.memberId);
    const memberRef = doc(db, `workspaces/${workspaceId}/members`, docId);
    await setDoc(memberRef, { ...member, updatedAt: new Date().toISOString() }, { merge: true });
  } catch (err) {
    console.warn('Failed to sync member to Firestore:', err);
  }
}

/**
 * Delete a member from Firestore
 */
export async function deleteMemberFromFirestore(memberId, workspaceId = 'demo-workspace') {
  if (!isFirebaseConfigured() || !db || !memberId) return;
  try {
    const { deleteDoc } = await import('firebase/firestore');
    const memberRef = doc(db, `workspaces/${workspaceId}/members`, String(memberId));
    await deleteDoc(memberRef);
  } catch (err) {
    console.warn('Failed to delete member from Firestore:', err);
  }
}

/**
 * Save workspace settings / branches to Firestore
 */
export async function saveSettingsToFirestore(settings, workspaceId = 'demo-workspace') {
  if (!isFirebaseConfigured() || !db || !settings) return;
  try {
    const settingsRef = doc(db, `workspaces/${workspaceId}/settings`, 'config');
    await setDoc(settingsRef, { ...settings, updatedAt: new Date().toISOString() }, { merge: true });
  } catch (err) {
    console.warn('Failed to sync settings to Firestore:', err);
  }
}

/**
 * Save workout plan to Firestore
 */
export async function saveWorkoutToFirestore(workout, workspaceId = 'demo-workspace') {
  if (!isFirebaseConfigured() || !db || !workout) return;
  try {
    const docId = String(workout.id || `w-${Date.now()}`);
    const workoutRef = doc(db, `workspaces/${workspaceId}/workouts`, docId);
    await setDoc(workoutRef, { ...workout, updatedAt: new Date().toISOString() }, { merge: true });
  } catch (err) {
    console.warn('Failed to sync workout to Firestore:', err);
  }
}

/**
 * Save diet plan to Firestore
 */
export async function saveDietToFirestore(diet, workspaceId = 'demo-workspace') {
  if (!isFirebaseConfigured() || !db || !diet) return;
  try {
    const docId = String(diet.id || `d-${Date.now()}`);
    const dietRef = doc(db, `workspaces/${workspaceId}/diets`, docId);
    await setDoc(dietRef, { ...diet, updatedAt: new Date().toISOString() }, { merge: true });
  } catch (err) {
    console.warn('Failed to sync diet to Firestore:', err);
  }
}

/**
 * Add attendance check-in to Firestore
 */
export async function recordAttendanceInFirestore(record, workspaceId = 'demo-workspace') {
  if (!isFirebaseConfigured() || !db || !record) return;
  try {
    const docId = String(record.id || `att-${Date.now()}`);
    const attRef = doc(db, `workspaces/${workspaceId}/attendance`, docId);
    await setDoc(attRef, { ...record, createdAt: new Date().toISOString() }, { merge: true });
  } catch (err) {
    console.warn('Failed to sync attendance to Firestore:', err);
  }
}

