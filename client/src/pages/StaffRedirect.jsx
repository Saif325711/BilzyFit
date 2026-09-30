import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const WORKSPACE_PREFIX = 'bilzyfit_workspace_';

/**
 * /staff � short URL for staff login.
 *
 * Reads saved workspaces from localStorage (written when the full auth link
 * is visited the first time) and redirects to the login page pre-filled with
 * the correct workspace.
 */
export default function StaffRedirect() {
  const navigate = useNavigate();

  useEffect(() => {
    const workspaces = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(WORKSPACE_PREFIX)) {
        try {
          const data = JSON.parse(localStorage.getItem(key) || '{}');
          if (data.workspaceId) workspaces.push(data);
        } catch { /* ignore */ }
      }
    }

    if (workspaces.length > 0) {
      const preferred =
        workspaces.find((w) => w.workspaceId !== 'demo-workspace') ||
        workspaces[workspaces.length - 1];

      const wsId = preferred.workspaceId;
      const gymName = preferred.settings?.gymName || preferred.businessName || '';

      const params = new URLSearchParams({ tab: 'staff', ws: wsId });
      if (gymName) params.set('gym', gymName);

      navigate(`/login?${params.toString()}`, { replace: true });
    } else {
      navigate('/login?tab=staff', { replace: true });
    }
  }, [navigate]);

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: '#f3f4f6', fontSize: '14px', color: '#6b7280' }}>
      Redirecting to staff login�
    </div>
  );
}
