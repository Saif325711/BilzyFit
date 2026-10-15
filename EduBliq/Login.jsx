import React, { useState, useEffect } from 'react';
import {
  Shield,
  Building,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Users,
  AlertCircle,
  School,
  Mail,
  MapPin,
  Database,
  UserCheck,
  UserPlus,
  KeyRound,
  Calendar,
  CreditCard,
  BookOpen
} from 'lucide-react';
import { useSchoolData } from './src/context/SchoolDataContext';

export default function Login({ 
  onNavigateHome, 
  onNavigatePlans, 
  onNavigateDashboard, 
  initialRole = 'super_admin', 
  authSession = null 
}) {
  const { 
    institution, 
    users, 
    registerSuperAdmin, 
    loginUser, 
    loginWithSecretCode,
    portalAccessList = [],
    dockerStorageConnected, 
    syncStatus 
  } = useSchoolData();

  // Mode: 'signin' | 'signup' — Super Admin only ERP entry (Secret Passkey removed)
  const [authMode, setAuthMode] = useState('signin');

  // 1. Sign In Form State (Email + Password)
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  // 2. SuperAdmin Sign Up Form State (New Institution ERP Creation)
  const [institutionName, setInstitutionName] = useState('');
  const [institutionEmail, setInstitutionEmail] = useState('');
  const [city, setCity] = useState('');
  const [stateVal, setStateVal] = useState('');
  const [studentsStrength, setStudentsStrength] = useState('');
  const [createPassword, setCreatePassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCreatePassword, setShowCreatePassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Status & Feedback
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // 3. Portal Access Invite (SuperAdmin shared link: #access?role=...&code=...&token=...)
  const [inviteDetected, setInviteDetected] = useState(false);
  const [inviteRole, setInviteRole] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  const [inviteToken, setInviteToken] = useState('');
  const [inviteName, setInviteName] = useState('');
  const [showInviteCode, setShowInviteCode] = useState(false);

  const matchedInvitePortal = portalAccessList.find(p => p.role === inviteRole || p.id === inviteRole);
  const invitePortalTitle = matchedInvitePortal?.title || PORTAL_LABELS[inviteRole] || 'Portal Workspace';
  const invitePortalColor = matchedInvitePortal?.color || '#2563eb';
  const invitePortalCategory = matchedInvitePortal?.category || 'Institution Portal';

  // Auto-detect SuperAdmin portal invite links (#access?role=school_admin&code=ADM-2026...)
  // This flow is ONLY reachable via a shared link — it is not shown in the login tabs.
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const checkInviteParams = () => {
      const hash = window.location.hash || '';
      const search = window.location.search || '';
      let params = null;
      if (hash.includes('?')) {
        params = new URLSearchParams(hash.split('?')[1]);
      } else if (search) {
        params = new URLSearchParams(search);
      }

      const roleParam = params ? (params.get('role') || '') : '';
      const codeParam = params ? (params.get('code') || '') : '';
      const tokenParam = params ? (params.get('token') || '') : '';

      if (hash.startsWith('#access') || roleParam || codeParam) {
        const norm = roleParam.toLowerCase().trim();
        const mappedRole =
          (norm === 'coordinator' || norm === 'viceprincipal' || norm === 'academiccoordinator' || norm === 'accademiccoordinator') ? 'academic_coordinator' :
          (norm === 'schooladmin' || norm === 'admin') ? 'school_admin' :
          (norm === 'principalportal') ? 'principal' :
          (norm === 'teacher' || norm === 'faculty') ? 'staff' :
          (norm === 'parents' || norm === 'guardian') ? 'parent' : norm;
        setInviteDetected(true);
        setInviteRole(mappedRole);
        setInviteCode(codeParam.toUpperCase());
        setInviteToken(tokenParam);
      } else {
        setInviteDetected(false);
        setInviteRole('');
        setInviteCode('');
        setInviteToken('');
      }
    };

    checkInviteParams();
    window.addEventListener('hashchange', checkInviteParams);
    return () => window.removeEventListener('hashchange', checkInviteParams);
  }, []);

  // 1. Handle SuperAdmin Registration Form (Fresh New Institution)
  const handleSignUpSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!institutionName.trim()) {
      setErrorMessage('Please enter Institution Name.');
      return;
    }
    if (!institutionEmail.trim() || !institutionEmail.includes('@')) {
      setErrorMessage('Please enter a valid official Institution Email.');
      return;
    }
    if (!city.trim() || !stateVal.trim()) {
      setErrorMessage('Please provide both City and State.');
      return;
    }
    if (!studentsStrength) {
      setErrorMessage('Please specify Student Strength.');
      return;
    }
    if (!createPassword || createPassword.length < 4) {
      setErrorMessage('Password must be at least 4 characters long.');
      return;
    }
    if (createPassword !== confirmPassword) {
      setErrorMessage('Passwords do not match. Please verify your passwords.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      try {
        const result = registerSuperAdmin({
          institutionName,
          institutionEmail,
          city,
          state: stateVal,
          studentsStrength,
          password: createPassword,
          ownerName: `${institutionName} SuperAdmin`
        });

        setIsSubmitting(false);
        setSuccessMessage('🎉 Institution ERP created successfully! Launching SuperAdmin Console...');

        // Freshly created ERP creator is the SuperAdmin -> Launch SuperAdmin dashboard!
        setTimeout(() => {
          if (onNavigateDashboard) {
            onNavigateDashboard('super_admin', {
              name: result.user.name,
              email: institutionEmail,
              role: 'super_admin',
              school: institutionName,
              isNewRegistration: true
            });
          }
        }, 700);
      } catch (err) {
        setIsSubmitting(false);
        setErrorMessage(err.message || 'Failed to create SuperAdmin account.');
      }
    }, 450);
  };

  // 1. Handle Portal Access Invite Submit (SuperAdmin shared link → role dashboard)
  const handleInviteSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!inviteName.trim()) {
      setErrorMessage('Please enter your Full Name.');
      return;
    }
    if (!inviteCode.trim()) {
      setErrorMessage('Please enter the Secret Passkey provided by your SuperAdmin.');
      return;
    }

    setIsSubmitting(true);
    try {
      if (!loginWithSecretCode) {
        setIsSubmitting(false);
        setErrorMessage('Authentication service temporarily unavailable.');
        return;
      }

      const result = await loginWithSecretCode({
        name: inviteName,
        role: inviteRole,
        secretCode: inviteCode,
        token: inviteToken
      });
      setIsSubmitting(false);

      if (result && result.success) {
        const uRole = result.targetRole || inviteRole;
        const uName = result.user?.name || inviteName;
        setSuccessMessage(`✓ Access Authorized! Welcome, ${uName}. Launching ${(PORTAL_LABELS[uRole] || invitePortalTitle)}...`);
        setTimeout(() => {
          if (onNavigateDashboard) {
            onNavigateDashboard(uRole, {
              name: uName,
              email: result.user?.email,
              role: uRole,
              school: institution?.name || "St. Xavier's International Academy"
            });
          }
        }, 600);
      } else {
        setErrorMessage(result?.error || result?.message || 'Invalid secret passcode or portal access is paused.');
      }
    } catch (err) {
      setIsSubmitting(false);
      setErrorMessage(err.message || 'Authentication failed.');
    }
  };

  // 2. Handle Sign In Form (Super Admin Only)
  const handleSignInSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!loginEmail.trim()) {
      setErrorMessage('Please enter your Institutional Email or ID.');
      return;
    }
    if (!loginPassword) {
      setErrorMessage('Please enter your password.');
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await loginUser(loginEmail, loginPassword);
      setIsSubmitting(false);

      if (result && result.success && result.user) {
        // SUPER ADMIN ONLY: Principal, Staff, Accountant etc. cannot sign in from this ERP login
        const signedInRole = (result.user.role || '').toLowerCase();
        if (signedInRole !== 'super_admin') {
          setErrorMessage('Access restricted: only the Super Admin can sign in from this ERP login. Principal, Staff & other users do not have access here.');
          return;
        }
        setSuccessMessage(`Welcome back, ${result.user.name}! Launching your SuperAdmin dashboard...`);
        setTimeout(() => {
          if (onNavigateDashboard) {
            onNavigateDashboard(result.user.role, {
              name: result.user.name,
              email: result.user.email,
              role: result.user.role,
              school: result.user.school || institution?.name || "St. Xavier's International Academy"
            });
          }
        }, 500);
      } else {
        setErrorMessage(result?.message || 'Invalid credentials. Please verify your email and password.');
      }
    } catch (err) {
      setIsSubmitting(false);
      setErrorMessage(err.message || 'Authentication failed. Please try again.');
    }
  };

  // Quick Autofill for available test users
  const handleQuickAutofill = (user) => {
    setLoginEmail(user.email);
    setLoginPassword(user.password || 'password');
    setErrorMessage('');
    const roleLabel = 
      user.role === 'super_admin' ? 'Institution SuperAdmin (Overall Full ERP Access)' :
      user.role === 'accountant' ? 'School Accountant (Fees & Ledgers)' :
      user.role === 'academic_coordinator' || user.role === 'vice_principal' ? 'Academic Coordinator / Vice Principal (Academic Operations)' :
      user.role === 'staff' || user.role === 'teacher' ? 'Teaching Staff (Academics & Attendance)' :
      user.role === 'principal' ? 'Academic Principal (Strategic Oversight)' :
      user.role === 'trustee' ? 'Governing Trustee (Optional Board)' :
      user.role.toUpperCase();
    setSuccessMessage(`Loaded credentials for ${user.name} — ${roleLabel}`);
  };

  return (
    <div style={{
      backgroundColor: '#071530',
      minHeight: '100vh',
      color: '#f8fafc',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      position: 'relative',
      overflowX: 'hidden'
    }}>
      {/* Background Ambient Glows */}
      <div style={{
        position: 'absolute',
        top: '-15%',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '800px',
        height: '450px',
        background: 'radial-gradient(ellipse at center, rgba(37, 99, 235, 0.22), transparent 70%)',
        pointerEvents: 'none',
        zIndex: 0
      }} />

      {/* Top Navbar */}
      <header style={{
        position: 'relative',
        zIndex: 10,
        padding: '16px 32px',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #2563eb, #38bdf8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 14px rgba(37, 99, 235, 0.4)'
          }}>
            <School size={24} color="#ffffff" />
          </div>
          <div>
            <div style={{ fontSize: '20px', fontWeight: '800', letterSpacing: '-0.02em', color: '#ffffff' }}>
              EduBliq <span style={{ color: '#38bdf8' }}>ERP</span>
            </div>
            <div style={{ fontSize: '11px', color: '#94a3b8', letterSpacing: '0.04em' }}>
              Institutional Unified ERP Portal
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {onNavigateHome && (
            <button
              onClick={onNavigateHome}
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                color: '#e2e8f0',
                padding: '8px 16px',
                borderRadius: '8px',
                fontSize: '12px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.15s'
              }}
            >
              Public Website
            </button>
          )}
        </div>
      </header>

      {/* Main Container */}
      <main style={{
        position: 'relative',
        zIndex: 10,
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '32px 16px'
      }}>
        <div style={{
          width: '100%',
          maxWidth: inviteDetected ? '560px' : authMode === 'signup' ? '680px' : '520px',
          backgroundColor: 'rgba(11, 28, 61, 0.75)',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          borderRadius: '24px',
          padding: '30px 28px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 40px rgba(37, 99, 235, 0.15)',
          transition: 'max-width 0.3s ease'
        }}>
          {/* ============================================
              PORTAL ACCESS HEADER (SuperAdmin invite link)
              Shows exactly which portal this link opens
              ============================================ */}
          {inviteDetected && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
              backgroundColor: `${invitePortalColor}1f`,
              border: `1px solid ${invitePortalColor}66`,
              borderRadius: '14px',
              padding: '14px 16px',
              marginBottom: '20px'
            }}>
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '12px',
                background: `linear-gradient(135deg, ${invitePortalColor}, #38bdf8)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                boxShadow: `0 4px 14px ${invitePortalColor}55`
              }}>
                <KeyRound size={22} color="#ffffff" />
              </div>
              <div style={{ minWidth: 0 }}>
                <div style={{
                  fontSize: '10px',
                  fontWeight: '800',
                  color: invitePortalColor,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em'
                }}>
                  Portal Access • {invitePortalCategory}
                </div>
                <h2 style={{ fontSize: '19px', fontWeight: '800', color: '#ffffff', margin: '2px 0 0 0', letterSpacing: '-0.02em' }}>
                  {invitePortalTitle}
                </h2>
                <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '2px' }}>
                  👉 This invite link opens the <strong style={{ color: '#e2e8f0' }}>{PORTAL_LABELS[inviteRole] || invitePortalTitle}</strong> — enter your name &amp; passkey to enter directly.
                </div>
              </div>
            </div>
          )}

          {/* Mode Switcher Tabs — hidden on SuperAdmin portal invite links */}
          {!inviteDetected && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            backgroundColor: '#071530',
            borderRadius: '12px',
            padding: '4px',
            marginBottom: '24px',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            gap: '4px'
          }}>
            <button
              type="button"
              onClick={() => { setAuthMode('signin'); setErrorMessage(''); setSuccessMessage(''); }}
              style={{
                padding: '9px 8px',
                borderRadius: '9px',
                border: 'none',
                backgroundColor: authMode === 'signin' ? '#2563eb' : 'transparent',
                color: authMode === 'signin' ? '#ffffff' : '#94a3b8',
                fontSize: '12px',
                fontWeight: '700',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                transition: 'all 0.2s',
                boxShadow: authMode === 'signin' ? '0 4px 12px rgba(37, 99, 235, 0.4)' : 'none'
              }}
            >
              <Lock size={14} />
              Email Sign In
            </button>
            <button
              type="button"
              onClick={() => { setAuthMode('signup'); setErrorMessage(''); setSuccessMessage(''); }}
              style={{
                padding: '9px 8px',
                borderRadius: '9px',
                border: 'none',
                backgroundColor: authMode === 'signup' ? '#2563eb' : 'transparent',
                color: authMode === 'signup' ? '#ffffff' : '#94a3b8',
                fontSize: '12px',
                fontWeight: '700',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                transition: 'all 0.2s',
                boxShadow: authMode === 'signup' ? '0 4px 12px rgba(37, 99, 235, 0.4)' : 'none'
              }}
            >
              <UserPlus size={14} />
              Create ERP
            </button>
          </div>
          )}

          {/* Feedback Banners */}
          {errorMessage && (
            <div style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '10px',
              backgroundColor: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid #ef4444',
              borderRadius: '12px',
              padding: '12px 16px',
              color: '#fca5a5',
              fontSize: '13px',
              marginBottom: '20px'
            }}>
              <AlertCircle size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>{errorMessage}</div>
            </div>
          )}

          {successMessage && (
            <div style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '10px',
              backgroundColor: 'rgba(16, 185, 129, 0.15)',
              border: '1px solid #10b981',
              borderRadius: '12px',
              padding: '12px 16px',
              color: '#6ee7b7',
              fontSize: '13px',
              marginBottom: '20px'
            }}>
              <CheckCircle2 size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>{successMessage}</div>
            </div>
          )}

          {/* ==============================================
              PORTAL ACCESS DESK (SuperAdmin invite link only)
              Opens when URL has #access?role=...&code=...
              ============================================== */}
          {inviteDetected && inviteRole && (
            <form onSubmit={handleInviteSubmit}>
              <div style={{ marginBottom: '22px' }}>
                <span style={{
                  fontSize: '11px',
                  fontWeight: '800',
                  color: invitePortalColor,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}>
                  <Shield size={14} /> Authorized Portal Entry
                </span>
                <h2 style={{ fontSize: '23px', fontWeight: '800', color: '#ffffff', margin: '4px 0 6px 0', letterSpacing: '-0.02em' }}>
                  Enter {invitePortalTitle}
                </h2>
                <p style={{ margin: 0, fontSize: '13px', color: '#94a3b8' }}>
                  Your portal — <strong style={{ color: '#e2e8f0' }}>{PORTAL_LABELS[inviteRole] || inviteRole}</strong> — is auto-selected from the invite link. Just confirm your name and passkey.
                </p>
              </div>

              {inviteCode && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  backgroundColor: 'rgba(16, 185, 129, 0.12)',
                  border: '1px solid rgba(16, 185, 129, 0.4)',
                  borderRadius: '10px',
                  padding: '10px 14px',
                  color: '#6ee7b7',
                  fontSize: '12px',
                  fontWeight: '600',
                  marginBottom: '16px'
                }}>
                  <CheckCircle2 size={16} color="#10b981" />
                  <span>Direct invite link detected — role &amp; passkey pre-configured.</span>
                </div>
              )}

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {/* 1. Full Name */}
                <div>
                  <label style={labelStyle}>
                    Your Full Name <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <div style={inputContainerStyle}>
                    <UserCheck size={16} color="#64748b" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Mrs. Anita Sharma"
                      value={inviteName}
                      onChange={(e) => setInviteName(e.target.value)}
                      style={inputStyle}
                    />
                  </div>
                </div>

                {/* 2. Secret Passkey */}
                <div>
                  <label style={labelStyle}>
                    Secret Passkey <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <div style={inputContainerStyle}>
                    <KeyRound size={16} color="#64748b" />
                    <input
                      type={showInviteCode ? 'text' : 'password'}
                      required
                      placeholder="e.g. ADM-2026, TCH-2026, ACC-2026"
                      value={inviteCode}
                      onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
                      style={{
                        ...inputStyle,
                        fontFamily: 'monospace',
                        fontWeight: '700',
                        letterSpacing: '0.06em'
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowInviteCode(!showInviteCode)}
                      style={eyeBtnStyle}
                      title={showInviteCode ? 'Hide passkey' : 'Show passkey'}
                    >
                      {showInviteCode ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                  <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '4px' }}>
                    💡 Prefilled from your invite link. Keep it confidential — SuperAdmin can regenerate it anytime.
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  style={{
                    marginTop: '6px',
                    padding: '14px',
                    borderRadius: '12px',
                    border: 'none',
                    background: `linear-gradient(135deg, ${invitePortalColor}, #0891b2)`,
                    color: '#ffffff',
                    fontSize: '15px',
                    fontWeight: '800',
                    cursor: isSubmitting ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '10px',
                    boxShadow: `0 8px 24px ${invitePortalColor}55`,
                    transition: 'all 0.2s',
                    opacity: isSubmitting ? 0.7 : 1
                  }}
                >
                  {isSubmitting ? (
                    'Verifying Passkey...'
                  ) : (
                    <>
                      <span>Verify &amp; Enter {invitePortalTitle}</span>
                      <ArrowRight size={18} />
                    </>
                  )}
                </button>
              </div>

              <div style={{ marginTop: '24px', textAlign: 'center', fontSize: '13px', color: '#94a3b8' }}>
                Are you the SuperAdmin?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setInviteDetected(false);
                    setInviteRole('');
                    setErrorMessage('');
                    setSuccessMessage('');
                    window.location.hash = '#login';
                  }}
                  style={{ background: 'none', border: 'none', color: '#38bdf8', fontWeight: '700', cursor: 'pointer', textDecoration: 'underline' }}
                >
                  Go to Super Admin Login →
                </button>
              </div>
            </form>
          )}

          {/* Incomplete invite link notice (no portal role found in URL) */}
          {inviteDetected && !inviteRole && (
            <div style={{ textAlign: 'center', padding: '4px 0' }}>
              <div style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '10px',
                backgroundColor: 'rgba(245, 158, 11, 0.12)',
                border: '1px solid rgba(245, 158, 11, 0.4)',
                borderRadius: '12px',
                padding: '12px 16px',
                color: '#fbbf24',
                fontSize: '13px',
                marginBottom: '18px',
                textAlign: 'left'
              }}>
                <AlertCircle size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>This access link is incomplete — no portal role was found in it. Please ask your SuperAdmin to re-share the correct portal link.</div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setInviteDetected(false);
                  setInviteRole('');
                  window.location.hash = '#login';
                }}
                style={{
                  padding: '10px 18px',
                  borderRadius: '10px',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  backgroundColor: 'rgba(255, 255, 255, 0.06)',
                  color: '#e2e8f0',
                  fontSize: '13px',
                  fontWeight: '700',
                  cursor: 'pointer'
                }}
              >
                ← Back to Super Admin Login
              </button>
            </div>
          )}

          {/* ========================================================
              TAB 1: SUPERADMIN SIGN UP (Institution Registration)
              ======================================================== */}
          {authMode === 'signup' && !inviteDetected && (
            <form onSubmit={handleSignUpSubmit}>
              <div style={{ marginBottom: '22px' }}>
                <span style={{
                  fontSize: '11px',
                  fontWeight: '800',
                  color: '#38bdf8',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}>
                  <Sparkles size={14} /> Master Onboarding
                </span>
                <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#ffffff', margin: '4px 0 6px 0', letterSpacing: '-0.02em' }}>
                  Register SuperAdmin & Institution
                </h2>
                <p style={{ margin: 0, fontSize: '13px', color: '#94a3b8' }}>
                  Create your master SuperAdmin console. You can then add Accountants, Staff/Teachers, Principal, and manage your school.
                </p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {/* 1. Institution Name */}
                <div>
                  <label style={labelStyle}>
                    Institution Name <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <div style={inputContainerStyle}>
                    <Building size={16} color="#64748b" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. St. Xavier's International Academy"
                      value={institutionName}
                      onChange={(e) => setInstitutionName(e.target.value)}
                      style={inputStyle}
                    />
                  </div>
                </div>

                {/* 2. Institution Email */}
                <div>
                  <label style={labelStyle}>
                    Institution Email (SuperAdmin Login ID) <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <div style={inputContainerStyle}>
                    <Mail size={16} color="#64748b" />
                    <input
                      type="email"
                      required
                      placeholder="admin@institution.edu.in"
                      value={institutionEmail}
                      onChange={(e) => setInstitutionEmail(e.target.value)}
                      style={inputStyle}
                    />
                  </div>
                </div>

                {/* 3 & 4. City and State */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                  <div>
                    <label style={labelStyle}>
                      City <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <div style={inputContainerStyle}>
                      <MapPin size={16} color="#64748b" />
                      <input
                        type="text"
                        required
                        placeholder="e.g. Jaipur"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        style={inputStyle}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={labelStyle}>
                      State <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <div style={inputContainerStyle}>
                      <MapPin size={16} color="#64748b" />
                      <input
                        type="text"
                        required
                        placeholder="e.g. Rajasthan"
                        value={stateVal}
                        onChange={(e) => setStateVal(e.target.value)}
                        style={inputStyle}
                      />
                    </div>
                  </div>
                </div>

                {/* 5. Students Strength */}
                <div>
                  <label style={labelStyle}>
                    Students Strength (Enrolled / Capacity) <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <div style={inputContainerStyle}>
                    <Users size={16} color="#64748b" />
                    <input
                      type="number"
                      required
                      placeholder="e.g. 1500"
                      value={studentsStrength}
                      onChange={(e) => setStudentsStrength(e.target.value)}
                      style={inputStyle}
                    />
                  </div>
                </div>

                {/* 6 & 7. Create Password & Confirm Password */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                  <div>
                    <label style={labelStyle}>
                      Create Password <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <div style={inputContainerStyle}>
                      <Lock size={16} color="#64748b" />
                      <input
                        type={showCreatePassword ? 'text' : 'password'}
                        required
                        placeholder="Create password"
                        value={createPassword}
                        onChange={(e) => setCreatePassword(e.target.value)}
                        style={inputStyle}
                      />
                      <button
                        type="button"
                        onClick={() => setShowCreatePassword(!showCreatePassword)}
                        style={eyeBtnStyle}
                      >
                        {showCreatePassword ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label style={labelStyle}>
                      Confirm Password <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <div style={inputContainerStyle}>
                      <KeyRound size={16} color="#64748b" />
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        required
                        placeholder="Confirm password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        style={inputStyle}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        style={eyeBtnStyle}
                      >
                        {showConfirmPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Submit: Create Account Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  style={{
                    marginTop: '8px',
                    padding: '14px',
                    borderRadius: '12px',
                    border: 'none',
                    background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
                    color: '#ffffff',
                    fontSize: '15px',
                    fontWeight: '800',
                    cursor: isSubmitting ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '10px',
                    boxShadow: '0 8px 24px rgba(37, 99, 235, 0.4)',
                    transition: 'all 0.2s',
                    opacity: isSubmitting ? 0.7 : 1
                  }}
                >
                  {isSubmitting ? (
                    'Provisioning Institution & SuperAdmin...'
                  ) : (
                    <>
                      <span>Create Account & Open SuperAdmin ERP</span>
                      <ArrowRight size={18} />
                    </>
                  )}
                </button>
              </div>

              <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '13px', color: '#94a3b8' }}>
                Already registered?{' '}
                <button
                  type="button"
                  onClick={() => setAuthMode('signin')}
                  style={{ background: 'none', border: 'none', color: '#38bdf8', fontWeight: '700', cursor: 'pointer', textDecoration: 'underline' }}
                >
                  Sign In to ERP Portal →
                </button>
              </div>
            </form>
          )}

          {/* ========================================================
              TAB 2: EMAIL SIGN IN (Super Admin Only)
              ======================================================== */}
          {authMode === 'signin' && !inviteDetected && (
            <form onSubmit={handleSignInSubmit}>
              <div style={{ marginBottom: '22px' }}>
                <span style={{
                  fontSize: '11px',
                  fontWeight: '800',
                  color: '#38bdf8',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}>
                  <Lock size={14} /> Super Admin Gateway
                </span>
                <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#ffffff', margin: '4px 0 6px 0', letterSpacing: '-0.02em' }}>
                  SuperAdmin Sign In
                </h2>
                <p style={{ margin: 0, fontSize: '13px', color: '#94a3b8' }}>
                  Sign in with your SuperAdmin credentials to open the Super Admin dashboard directly. Principal, Staff &amp; other users cannot sign in here.
                </p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {/* Email / ID */}
                <div>
                  <label style={labelStyle}>
                    SuperAdmin Email <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <div style={inputContainerStyle}>
                    <Mail size={16} color="#64748b" />
                    <input
                      type="text"
                      required
                      placeholder="admin@institution.edu.in"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      style={inputStyle}
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <label style={labelStyle}>
                      Password <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                  </div>
                  <div style={inputContainerStyle}>
                    <Lock size={16} color="#64748b" />
                    <input
                      type={showLoginPassword ? 'text' : 'password'}
                      required
                      placeholder="••••••••"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      style={inputStyle}
                    />
                    <button
                      type="button"
                      onClick={() => setShowLoginPassword(!showLoginPassword)}
                      style={eyeBtnStyle}
                    >
                      {showLoginPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>

                {/* Quick Demo Credentials Pill Bar (Super Admin only) */}
                {users && users.filter((u) => (u.role || '').toLowerCase() === 'super_admin').length > 0 && (
                  <div style={{ marginTop: '2px' }}>
                    <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: '700', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      ⚡ Quick Demo SuperAdmin:
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                      {users.filter((u) => (u.role || '').toLowerCase() === 'super_admin').map((u) => {
                        const isSelected = loginEmail === u.email;
                        const label = 'SuperAdmin';
                        return (
                          <button
                            key={u.id || u.email}
                            type="button"
                            onClick={() => handleQuickAutofill(u)}
                            style={{
                              padding: '4px 9px',
                              borderRadius: '6px',
                              fontSize: '11px',
                              fontWeight: '700',
                              cursor: 'pointer',
                              border: isSelected ? '1px solid #38bdf8' : '1px solid rgba(255, 255, 255, 0.12)',
                              backgroundColor: isSelected ? 'rgba(56, 189, 248, 0.18)' : '#071530',
                              color: isSelected ? '#38bdf8' : '#cbd5e1',
                              transition: 'all 0.15s'
                            }}
                          >
                            {label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Submit Sign In Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  style={{
                    marginTop: '6px',
                    padding: '14px',
                    borderRadius: '12px',
                    border: 'none',
                    background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
                    color: '#ffffff',
                    fontSize: '15px',
                    fontWeight: '800',
                    cursor: isSubmitting ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '10px',
                    boxShadow: '0 8px 24px rgba(37, 99, 235, 0.4)',
                    transition: 'all 0.2s',
                    opacity: isSubmitting ? 0.7 : 1
                  }}
                >
                  {isSubmitting ? (
                    'Authenticating...'
                  ) : (
                    <>
                      <span>Sign In to SuperAdmin Dashboard</span>
                      <ArrowRight size={18} />
                    </>
                  )}
                </button>
              </div>

              <div style={{ marginTop: '24px', textAlign: 'center', fontSize: '13px', color: '#94a3b8' }}>
                New School or Institution?{' '}
                <button
                  type="button"
                  onClick={() => setAuthMode('signup')}
                  style={{ background: 'none', border: 'none', color: '#38bdf8', fontWeight: '700', cursor: 'pointer', textDecoration: 'underline' }}
                >
                  Register as SuperAdmin →
                </button>
              </div>
            </form>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer style={{
        position: 'relative',
        zIndex: 10,
        padding: '16px 32px',
        borderTop: '1px solid rgba(255, 255, 255, 0.06)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px',
        fontSize: '12px',
        color: '#64748b'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Shield size={14} color="#10b981" />
          <span>CBSE / ICSE / NEP 2020 Compliant ERP</span>
          <span>·</span>
          <span>Zero Cloud Leakage On-Premise Docker Storage</span>
        </div>
        <div>
          Copyright © {new Date().getFullYear()} EduBliq. All Rights Reserved.
        </div>
      </footer>
    </div>
  );
}

const labelStyle = {
  fontSize: '12px',
  fontWeight: '700',
  color: '#e2e8f0',
  display: 'block',
  marginBottom: '6px'
};

const inputContainerStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  backgroundColor: '#050f24',
  border: '1px solid rgba(255, 255, 255, 0.16)',
  borderRadius: '10px',
  padding: '0 12px',
  transition: 'border-color 0.2s'
};

const inputStyle = {
  flex: 1,
  backgroundColor: 'transparent',
  border: 'none',
  padding: '11px 0',
  color: '#ffffff',
  fontSize: '13px',
  outline: 'none',
  fontFamily: 'inherit'
};

const eyeBtnStyle = {
  background: 'none',
  border: 'none',
  color: '#64748b',
  cursor: 'pointer',
  padding: '4px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
};

// Friendly portal labels — makes it crystal clear which portal an invite link opens
const PORTAL_LABELS = {
  super_admin: 'Super Admin Console',
  principal: 'Principal Portal',
  school_admin: 'School Admin Portal',
  academic_coordinator: 'Academic Coordinator Portal',
  accountant: 'Accountant Portal',
  staff: 'Teaching Staff Portal',
  student: 'Student Portal',
  parent: 'Parent Portal',
  trustee: 'Trustee Portal'
};
