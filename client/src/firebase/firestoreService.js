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
 * Real-time member verification for Member Portal using Secret Code
 */
export async function verifyMemberWithFirestore(memberId, secretCode, workspaceId = 'demo-workspace') {
  if (!isFirebaseConfigured() || !db) {
    return null;
  }

  try {
    const membersRef = collection(db, `workspaces/${workspaceId}/members`);
    const q = query(membersRef, where('secretCode', '==', secretCode));
    const querySnapshot = await getDocs(q);

    for (const docSnap of querySnapshot.docs) {
      const data = docSnap.data();
      const idMatch = (data.memberId && data.memberId.toUpperCase() === memberId.toUpperCase()) ||
                      (data.id && data.id.toUpperCase() === memberId.toUpperCase());
      if (idMatch) {
        return { id: docSnap.id, ...data };
      }
    }
  } catch (error) {
    console.error('Error verifying member in Firestore:', error);
  }
  return null;
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
