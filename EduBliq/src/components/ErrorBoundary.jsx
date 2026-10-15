import React from 'react';

/**
 * Global Error Boundary
 *
 * Catches any unhandled render/runtime error in the React tree and shows a
 * branded recovery screen instead of a white page. Prevents one broken
 * portal/view from taking down the entire ERP session.
 */
export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, info: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    // Keep stack in console for debugging; attach component stack for the copy report
    console.error('[EduBliq ErrorBoundary] Unhandled UI error:', error, info);
    this.setState({ info });
  }

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    try {
      window.location.hash = '#home';
    } catch (e) {}
    // Force a clean re-mount of the tree after a crash
    window.location.reload();
  };

  handleCopyReport = () => {
    const { error, info } = this.state;
    const report = [
      `EduBliq Error Report — ${new Date().toISOString()}`,
      `URL: ${window.location.href}`,
      `User-Agent: ${navigator.userAgent}`,
      '',
      `Error: ${error?.message || 'Unknown'}`,
      '',
      `Stack: ${error?.stack || 'n/a'}`,
      '',
      `Component Stack: ${info?.componentStack || 'n/a'}`
    ].join('\n');

    navigator.clipboard?.writeText(report).then(
      () => {
        try {
          window.dispatchEvent(new CustomEvent('edubliq:toast', {
            detail: { type: 'success', message: 'Error report copied to clipboard.' }
          }));
        } catch (e) {}
      },
      () => {}
    );
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
          padding: '24px', fontFamily: "'Inter', system-ui, sans-serif"
        }}>
          <div style={{
            backgroundColor: '#ffffff', borderRadius: '16px', padding: '36px',
            maxWidth: '520px', width: '100%',
            boxShadow: '0 25px 50px rgba(0,0,0,0.35)',
            border: '1px solid #e2e8f0'
          }}>
            <div style={{
              width: '52px', height: '52px', borderRadius: '14px',
              backgroundColor: '#fef2f2', color: '#dc2626',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '26px', marginBottom: '18px'
            }}>⚠️</div>

            <h1 style={{ fontSize: '22px', fontWeight: '800', color: '#0f172a', margin: '0 0 8px' }}>
              Something went wrong
            </h1>
            <p style={{ fontSize: '14px', color: '#64748b', margin: '0 0 6px', lineHeight: 1.55 }}>
              A view in the EduBliq workspace encountered an unexpected error and could not be rendered.
              Your data is safe — no changes were lost.
            </p>
            <p style={{
              fontSize: '12px', color: '#94a3b8', margin: '0 0 22px',
              fontFamily: 'monospace', backgroundColor: '#f8fafc',
              border: '1px solid #e2e8f0', borderRadius: '8px', padding: '10px 12px',
              wordBreak: 'break-word'
            }}>
              {this.state.error?.message || 'Unknown rendering error'}
            </p>

            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <button
                onClick={this.handleReload}
                style={{
                  backgroundColor: '#2563eb', color: '#fff', border: 'none',
                  padding: '10px 18px', borderRadius: '9px', fontSize: '14px',
                  fontWeight: '700', cursor: 'pointer'
                }}
              >
                Reload Workspace
              </button>
              <button
                onClick={this.handleGoHome}
                style={{
                  backgroundColor: '#ffffff', color: '#334155',
                  border: '1px solid #cbd5e1',
                  padding: '10px 18px', borderRadius: '9px', fontSize: '14px',
                  fontWeight: '700', cursor: 'pointer'
                }}
              >
                Back to Home
              </button>
              <button
                onClick={this.handleCopyReport}
                style={{
                  backgroundColor: '#f1f5f9', color: '#475569',
                  border: '1px solid #e2e8f0',
                  padding: '10px 18px', borderRadius: '9px', fontSize: '14px',
                  fontWeight: '700', cursor: 'pointer'
                }}
              >
                Copy Error Report
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
