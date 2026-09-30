import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  X, Database, Cloud, CheckCircle2, AlertTriangle, RefreshCw,
  UploadCloud, ExternalLink, ShieldCheck, Zap, Sparkles, KeyRound,
} from 'lucide-react';
import {
  getStoredFirebaseConfig,
  saveStoredFirebaseConfig,
  isFirebaseConfigured,
} from '../firebase/config';
import {
  testFirestoreConnection,
  migrateLocalDataToFirestore,
} from '../firebase/firestoreService';
import { useData } from '../context/DataContext';

export default function FirebaseSyncModal({ isOpen, onClose }) {
  const { data, isCloudConnected, setIsCloudConnected } = useData();
  const [config, setConfig] = useState(getStoredFirebaseConfig);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState(null);
  const [migrating, setMigrating] = useState(false);
  const [migrationProgress, setMigrationProgress] = useState(0);
  const [migrationStatus, setMigrationStatus] = useState('');
  const [migrationResult, setMigrationResult] = useState(null);
  const [activeTab, setActiveTab] = useState('status'); // 'status', 'config', 'guide'

  useEffect(() => {
    if (isOpen) {
      setConfig(getStoredFirebaseConfig());
      setTestResult(null);
      setMigrationResult(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = (e) => {
    e?.preventDefault();
    saveStoredFirebaseConfig(config);
    setTestResult({
      success: true,
      message: 'Firebase configuration saved locally! Testing connection...',
    });
    handleTest(config);
  };

  const handleTest = async (testConfig = config) => {
    setTesting(true);
    setTestResult(null);
    try {
      const res = await testFirestoreConnection(testConfig);
      setTestResult(res);
      setIsCloudConnected(res.success);
    } catch (err) {
      setTestResult({ success: false, message: err.message });
      setIsCloudConnected(false);
    } finally {
      setTesting(false);
    }
  };

  const handleMigrate = async () => {
    setMigrating(true);
    setMigrationProgress(0);
    setMigrationResult(null);
    setMigrationStatus('Starting migration to Firestore...');

    try {
      const res = await migrateLocalDataToFirestore(
        data,
        'demo-workspace',
        (pct, stage) => {
          setMigrationProgress(pct);
          setMigrationStatus(`Uploading ${stage} to Cloud Firestore... (${pct}%)`);
        }
      );
      setMigrationResult({
        success: true,
        message: `Successfully synchronized ${res.count} records (Members, Plans, Workouts, Diets, Attendance, Settings) to Cloud Firestore!`,
      });
      setIsCloudConnected(true);
    } catch (err) {
      setMigrationResult({
        success: false,
        message: err.message || 'Migration to Firestore failed.',
      });
    } finally {
      setMigrating(false);
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl max-h-[90vh] flex flex-col rounded-3xl bg-white shadow-2xl border border-slate-200 overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-400/30">
              <Database className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-black tracking-wide">Firebase Firestore Cloud Sync</h3>
                <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider ${
                  isCloudConnected ? 'bg-emerald-500/30 text-emerald-300 border border-emerald-400/40' : 'bg-amber-500/30 text-amber-300 border border-amber-400/40'
                }`}>
                  <span className={`h-1.5 w-1.5 rounded-full ${isCloudConnected ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
                  {isCloudConnected ? 'Cloud Active' : 'Standby / Local'}
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Real-time two-way synchronization between Web Admin &amp; Flutter Mobile Member App
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-slate-400 hover:text-white hover:bg-white/10 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 px-6 border-b border-slate-100 bg-slate-50/70 text-xs font-bold">
          <button
            onClick={() => setActiveTab('status')}
            className={`py-3 px-4 border-b-2 transition ${
              activeTab === 'status'
                ? 'border-emerald-600 text-emerald-700 font-black'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            Cloud Status &amp; Push Data
          </button>
          <button
            onClick={() => setActiveTab('config')}
            className={`py-3 px-4 border-b-2 transition ${
              activeTab === 'config'
                ? 'border-emerald-600 text-emerald-700 font-black'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            Firebase Credentials Config
          </button>
          <button
            onClick={() => setActiveTab('guide')}
            className={`py-3 px-4 border-b-2 transition ${
              activeTab === 'guide'
                ? 'border-emerald-600 text-emerald-700 font-black'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            Setup Guide (3 Steps)
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5 text-sm text-slate-700">
          {activeTab === 'status' && (
            <div className="space-y-5">
              {/* Connection Status Card */}
              <div className={`p-4 rounded-2xl border ${
                isCloudConnected
                  ? 'bg-emerald-50/80 border-emerald-200 text-emerald-950'
                  : 'bg-amber-50/80 border-amber-200 text-amber-950'
              }`}>
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-xl mt-0.5 ${
                    isCloudConnected ? 'bg-emerald-600 text-white' : 'bg-amber-500 text-white'
                  }`}>
                    {isCloudConnected ? <CheckCircle2 className="h-5 w-5" /> : <AlertTriangle className="h-5 w-5" />}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-extrabold text-sm">
                      {isCloudConnected
                        ? 'Real-Time Cloud Firestore Connected!'
                        : 'Running on Local High-Speed Storage (Ready to Connect)'}
                    </h4>
                    <p className="text-xs mt-1 leading-relaxed text-slate-600">
                      {isCloudConnected
                        ? `Live connection verified for project "${config.projectId || 'BilzyFit Cloud'}". All edits on this web panel synchronize instantly to members' mobile devices in real time.`
                        : 'Your data is safely stored in local storage and ready for one-click upload to Firebase Firestore as soon as you enter your free Firebase credentials.'}
                    </p>
                    <div className="mt-3 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleTest()}
                        disabled={testing}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-white px-3 py-1.5 text-xs font-black text-slate-700 border border-slate-200 shadow-sm hover:bg-slate-50 transition"
                      >
                        <RefreshCw className={`h-3.5 w-3.5 ${testing ? 'animate-spin text-emerald-600' : ''}`} />
                        <span>{testing ? 'Testing...' : 'Test Connection'}</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveTab('config')}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3 py-1.5 text-xs font-black text-white shadow-sm hover:bg-emerald-700 transition"
                      >
                        <KeyRound className="h-3.5 w-3.5" />
                        <span>Edit Firebase Keys</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {testResult && (
                <div className={`p-3 rounded-xl text-xs font-medium border ${
                  testResult.success
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                    : 'bg-red-50 border-red-200 text-red-800'
                }`}>
                  {testResult.message}
                </div>
              )}

              {/* Data Summary Grid */}
              <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-slate-500">
                    Local Data Ready to Sync
                  </h4>
                  <span className="text-xs font-black text-slate-700">
                    {data.members?.length || 0} Members Enrolled
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-center">
                  <div className="p-2.5 rounded-xl bg-white border border-slate-100 shadow-sm">
                    <p className="text-[10px] font-bold text-slate-400">MEMBERS</p>
                    <p className="text-lg font-black text-emerald-700">{data.members?.length || 0}</p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white border border-slate-100 shadow-sm">
                    <p className="text-[10px] font-bold text-slate-400">WORKOUTS</p>
                    <p className="text-lg font-black text-teal-700">{data.workouts?.length || 0}</p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white border border-slate-100 shadow-sm">
                    <p className="text-[10px] font-bold text-slate-400">DIET PLANS</p>
                    <p className="text-lg font-black text-sky-700">{data.diets?.length || 0}</p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white border border-slate-100 shadow-sm">
                    <p className="text-[10px] font-bold text-slate-400">ATTENDANCE</p>
                    <p className="text-lg font-black text-amber-700">{data.attendance?.length || 0}</p>
                  </div>
                </div>
              </div>

              {/* One-Click Push to Firestore */}
              <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-500/10 via-teal-500/5 to-slate-50 border border-emerald-200 space-y-3">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600 text-white shadow-sm">
                    <UploadCloud className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-sm text-slate-900">
                      One-Click Cloud Push (Local &rarr; Firestore)
                    </h4>
                    <p className="text-xs text-slate-500">
                      Uploads all Star Fitness members, workouts, diets, and settings into Firestore collections.
                    </p>
                  </div>
                </div>

                {migrating && (
                  <div className="space-y-2 pt-2">
                    <div className="flex justify-between text-xs font-bold text-emerald-800">
                      <span>{migrationStatus}</span>
                      <span>{migrationProgress}%</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-slate-200 overflow-hidden">
                      <div
                        className="h-full bg-emerald-600 transition-all duration-300"
                        style={{ width: `${migrationProgress}%` }}
                      />
                    </div>
                  </div>
                )}

                {migrationResult && (
                  <div className={`p-3 rounded-xl text-xs font-semibold border ${
                    migrationResult.success
                      ? 'bg-emerald-100/70 border-emerald-300 text-emerald-900'
                      : 'bg-red-50 border-red-200 text-red-800'
                  }`}>
                    {migrationResult.message}
                  </div>
                )}

                <button
                  type="button"
                  onClick={handleMigrate}
                  disabled={migrating}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3 text-xs font-black text-white shadow-md shadow-emerald-600/25 hover:bg-emerald-700 transition disabled:opacity-50"
                >
                  <Sparkles className="h-4 w-4" />
                  <span>{migrating ? 'Uploading to Cloud...' : 'Push All Data to Cloud Firestore Now'}</span>
                </button>
              </div>
            </div>
          )}

          {activeTab === 'config' && (
            <form onSubmit={handleSave} className="space-y-4">
              <p className="text-xs text-slate-500">
                Enter your Firebase Web App configuration below. You can copy this directly from your <strong>Firebase Console &gt; Project Settings &gt; General &gt; Your Apps (Web)</strong>:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Project ID *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. bilzyfit-fitness"
                    value={config.projectId || ''}
                    onChange={(e) => setConfig({ ...config, projectId: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 font-mono font-medium focus:border-emerald-500 focus:bg-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">API Key *</label>
                  <input
                    type="text"
                    required
                    placeholder="AIzaSy..."
                    value={config.apiKey || ''}
                    onChange={(e) => setConfig({ ...config, apiKey: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 font-mono font-medium focus:border-emerald-500 focus:bg-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Auth Domain</label>
                  <input
                    type="text"
                    placeholder="project-id.firebaseapp.com"
                    value={config.authDomain || ''}
                    onChange={(e) => setConfig({ ...config, authDomain: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 font-mono font-medium focus:border-emerald-500 focus:bg-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Storage Bucket</label>
                  <input
                    type="text"
                    placeholder="project-id.appspot.com"
                    value={config.storageBucket || ''}
                    onChange={(e) => setConfig({ ...config, storageBucket: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 font-mono font-medium focus:border-emerald-500 focus:bg-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Messaging Sender ID</label>
                  <input
                    type="text"
                    placeholder="e.g. 123456789012"
                    value={config.messagingSenderId || ''}
                    onChange={(e) => setConfig({ ...config, messagingSenderId: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 font-mono font-medium focus:border-emerald-500 focus:bg-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">App ID</label>
                  <input
                    type="text"
                    placeholder="1:123456789012:web:abcdef..."
                    value={config.appId || ''}
                    onChange={(e) => setConfig({ ...config, appId: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 font-mono font-medium focus:border-emerald-500 focus:bg-white focus:outline-none"
                  />
                </div>
              </div>

              {testResult && (
                <div className={`p-3 rounded-xl text-xs font-semibold border ${
                  testResult.success
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                    : 'bg-red-50 border-red-200 text-red-800'
                }`}>
                  {testResult.message}
                </div>
              )}

              <div className="flex gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => handleTest()}
                  disabled={testing}
                  className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition"
                >
                  {testing ? 'Testing...' : 'Test Keys'}
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-xl bg-emerald-600 py-2.5 text-xs font-black text-white shadow-md shadow-emerald-600/25 hover:bg-emerald-700 transition"
                >
                  Save &amp; Connect to Cloud Firestore 🚀
                </button>
              </div>
            </form>
          )}

          {activeTab === 'guide' && (
            <div className="space-y-4 text-xs">
              <div className="p-3.5 rounded-2xl bg-sky-50 border border-sky-200 text-sky-950 flex items-start gap-3">
                <Cloud className="h-5 w-5 text-sky-600 shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                  Firebase Firestore gives you a <strong>Free Tier</strong> (1GB storage &amp; 50,000 daily reads/writes) which is more than enough for running a modern gym management system.
                </p>
              </div>

              <div className="space-y-3">
                <div className="p-3 rounded-xl bg-white border border-slate-200 space-y-1">
                  <p className="font-extrabold text-slate-900">Step 1: Create a Free Project</p>
                  <p className="text-slate-600">
                    Open <a href="https://console.firebase.google.com" target="_blank" rel="noreferrer" className="text-emerald-700 font-bold underline inline-flex items-center gap-0.5">Firebase Console <ExternalLink className="h-3 w-3" /></a> and click <strong>"Add project"</strong>. Name it <em>BilzyFit</em>.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-white border border-slate-200 space-y-1">
                  <p className="font-extrabold text-slate-900">Step 2: Enable Cloud Firestore</p>
                  <p className="text-slate-600">
                    In the left sidebar, click <strong>"Build" &gt; "Firestore Database" &gt; "Create database"</strong>. Select <em>Start in test mode</em> (or set read/write to true).
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-white border border-slate-200 space-y-1">
                  <p className="font-extrabold text-slate-900">Step 3: Register Web App &amp; Paste Keys</p>
                  <p className="text-slate-600">
                    Go to <strong>Project Settings &gt; General &gt; Add app (Web &lt;/&gt;)</strong>. Copy the `firebaseConfig` object and paste the values into the <strong>Firebase Credentials Config</strong> tab above!
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 bg-slate-50 text-xs">
          <div className="flex items-center gap-1.5 text-slate-500 font-medium">
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
            <span>Encrypted Client-Side Configuration</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl bg-slate-200 px-4 py-2 font-bold text-slate-700 hover:bg-slate-300 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
