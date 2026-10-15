import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  handleResetStorage = () => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        // Clear all bilzyfit storage keys
        const keysToRemove = [];
        for (let i = 0; i < localStorage.length; i++) {
          const k = localStorage.key(i);
          if (k && (k.startsWith('bilzyfit_') || k.startsWith('gym_'))) {
            keysToRemove.push(k);
          }
        }
        keysToRemove.forEach((k) => {
          try {
            localStorage.removeItem(k);
          } catch {}
        });
      }
    } catch (e) {
      console.error('Failed to clear storage:', e);
    }
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          backgroundColor: '#0f172a',
          color: '#f8fafc',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1.5rem',
          fontFamily: 'Inter, system-ui, -apple-system, sans-serif'
        }}>
          <div style={{
            maxWidth: '540px',
            width: '100%',
            backgroundColor: '#1e293b',
            border: '1px solid #334155',
            borderRadius: '16px',
            padding: '2rem',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 8px 10px -6px rgba(0, 0, 0, 0.5)',
            textAlign: 'center'
          }}>
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              backgroundColor: 'rgba(239, 68, 68, 0.15)',
              color: '#ef4444',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.25rem',
              fontSize: '28px'
            }}>
              ⚠️
            </div>

            <h1 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '0.5rem', color: '#fff' }}>
              Gym Management Recovery
            </h1>
            <p style={{ color: '#94a3b8', fontSize: '0.925rem', lineHeight: '1.5', marginBottom: '1.5rem' }}>
              Browser storage quota exceeded or unexpected data was encountered. BliqFit can automatically reset storage cache and restore your dashboard immediately.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
              <button
                onClick={this.handleResetStorage}
                style={{
                  backgroundColor: '#10b981',
                  color: '#ffffff',
                  fontWeight: '600',
                  padding: '0.75rem 1.25rem',
                  borderRadius: '10px',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '0.95rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  transition: 'background-color 0.2s'
                }}
              >
                🔄 Clean Cache & Restore Dashboard
              </button>

              <button
                onClick={this.handleReload}
                style={{
                  backgroundColor: '#334155',
                  color: '#e2e8f0',
                  fontWeight: '500',
                  padding: '0.75rem 1.25rem',
                  borderRadius: '10px',
                  border: '1px solid #475569',
                  cursor: 'pointer',
                  fontSize: '0.95rem'
                }}
              >
                Reload Page
              </button>
            </div>

            {this.state.error && (
              <details style={{ textAlign: 'left', backgroundColor: '#0f172a', padding: '0.75rem 1rem', borderRadius: '8px', fontSize: '0.8rem', color: '#f87171' }}>
                <summary style={{ cursor: 'pointer', color: '#94a3b8', fontWeight: '500' }}>Technical Error Details</summary>
                <pre style={{ marginTop: '0.5rem', whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
                  {this.state.error.toString()}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
