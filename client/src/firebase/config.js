import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, enableIndexedDbPersistence } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const STORAGE_KEY = 'bilzyfit_firebase_config';

// Default configuration with provided Firebase project
export const DEFAULT_FIREBASE_CONFIG = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyAI-YrKFGyxtzKJ-eqfPfbdbFaPz99WfFM',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'bilzyfit.firebaseapp.com',
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL || 'https://bilzyfit-default-rtdb.asia-southeast1.firebasedatabase.app',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'bilzyfit',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'bilzyfit.firebasestorage.app',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '29483760575',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:29483760575:web:ea378f84c1e851eaf7ff0a',
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || 'G-6KCMH996S1',
};

export function getStoredFirebaseConfig() {
  try {
    if (typeof localStorage === 'undefined') return DEFAULT_FIREBASE_CONFIG;
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return { ...DEFAULT_FIREBASE_CONFIG, ...parsed };
    }
  } catch (err) {
    console.warn('Failed to read firebase config from storage:', err);
  }
  return DEFAULT_FIREBASE_CONFIG;
}

export function saveStoredFirebaseConfig(config) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
    window.dispatchEvent(new CustomEvent('bilzyfit-firebase-config-updated', { detail: config }));
  } catch (err) {
    console.error('Failed to save firebase config:', err);
  }
}

export function isFirebaseConfigured(config = getStoredFirebaseConfig()) {
  return Boolean(
    config &&
    config.apiKey &&
    config.projectId &&
    !config.apiKey.includes('YOUR_') &&
    !config.projectId.includes('YOUR_')
  );
}

let appInstance = null;
let dbInstance = null;
let authInstance = null;

export function initFirebase(customConfig = null) {
  const config = customConfig || getStoredFirebaseConfig();
  if (!isFirebaseConfigured(config)) {
    return { app: null, db: null, auth: null, isConfigured: false };
  }

  try {
    if (!getApps().length) {
      appInstance = initializeApp(config);
    } else {
      appInstance = getApp();
    }

    dbInstance = getFirestore(appInstance);
    authInstance = getAuth(appInstance);

    return {
      app: appInstance,
      db: dbInstance,
      auth: authInstance,
      isConfigured: true,
    };
  } catch (error) {
    console.error('Firebase initialization error:', error);
    return { app: null, db: null, auth: null, isConfigured: false, error };
  }
}

// Auto-initialize if configured
const initial = initFirebase();
export const app = initial.app;
export const db = initial.db;
export const auth = initial.auth;
