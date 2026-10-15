import React from 'react';
import { GraduationCap, ArrowLeft } from 'lucide-react';

/**
 * Workspace Placeholder
 * ---------------------
 * EduBliq ERP is being rebuilt from scratch. The role dashboards
 * (Super Admin, School Admin, Principal, Staff, Parent, etc.) will be
 * reintroduced here as they are rebuilt. The landing page, login page
 * and invite-link access flow continue to work exactly as before.
 */
export default function WorkspaceGateway({ role = '', authSession = null, onNavigateHome }) {
  const activeRole = (role || (authSession && authSession.role) || '').toLowerCase();
  const roleName = activeRole
    ? activeRole.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
    : 'Workspace';

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#071530',
      color: '#e2e8f0',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px'
    }}>
      <div style={{
        maxWidth: '460px',
        width: '100%',
        backgroundColor: 'rgba(11, 28, 61, 0.75)',
        border: '1px solid rgba(255, 255, 255, 0.12)',
        borderRadius: '20px',
        padding: '36px 30px',
        textAlign: 'center',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
      }}>
        <div style={{
          width: '56px',
          height: '56px',
          borderRadius: '16px',
          background: 'linear-gradient(135deg, #2563eb, #38bdf8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 18px',
          boxShadow: '0 6px 18px rgba(37, 99, 235, 0.4)'
        }}>
          <GraduationCap size={28} color="#ffffff" />
        </div>

        <div style={{
          fontSize: '11px',
          fontWeight: '800',
          color: '#38bdf8',
          textTransform: 'uppercase',
          letterSpacing: '0.08em'
        }}>
          {roleName}
        </div>

        <h1 style={{
          fontSize: '24px',
          fontWeight: '800',
          color: '#ffffff',
          margin: '6px 0 8px',
          letterSpacing: '-0.02em'
        }}>
          Dashboard Coming Soon
        </h1>

        <p style={{ fontSize: '13px', color: '#94a3b8', lineHeight: 1.6, margin: '0 0 22px' }}>
          EduBliq ERP is being rebuilt from scratch. Your sign-in works — the{' '}
          <strong style={{ color: '#e2e8f0' }}>{roleName}</strong> dashboard will be
          available here again soon.
        </p>

        {onNavigateHome && (
          <button
            onClick={onNavigateHome}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '11px 18px',
              borderRadius: '10px',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              backgroundColor: 'rgba(255, 255, 255, 0.06)',
              color: '#e2e8f0',
              fontSize: '13px',
              fontWeight: '700',
              cursor: 'pointer',
              transition: 'all 0.15s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.12)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.06)';
            }}
          >
            <ArrowLeft size={15} /> Back to Website
          </button>
        )}
      </div>
    </div>
  );
}
