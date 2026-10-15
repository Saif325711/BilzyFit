// Workspace sync helpers.
// These endpoints (/api/workspaces/…) only exist on the local Vite dev-server
// (workspaceSyncPlugin).  In production (Vercel / any static host) there is
// no backend, so every call is silently skipped to avoid console noise.

function isDevEnv() {
  if (typeof window !== 'undefined') {
    return window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  }
  return Boolean(import.meta.env.DEV);
}

export async function syncWorkspaceData(data, workspaceId = 'demo-workspace') {
  if (!isDevEnv()) return; // no-op in production / Vercel
  try {
    const response = await fetch(`/api/workspaces/${encodeURIComponent(workspaceId)}/sync`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        members: data.members || [],
        workouts: data.workouts || [],
        diets: data.diets || [],
      }),
    });
    if (!response.ok && isDevEnv()) {
      console.warn(`Workspace sync status: ${response.status}`);
    }
  } catch (error) {
    if (isDevEnv()) {
      console.warn('Bilzy Member sync (dev only):', error.message);
    }
  }
}

export async function publishMemberPlan({
  workspaceId = 'demo-workspace',
  memberEmail,
  memberName,
  workout,
  diet,
}) {
  if (!isDevEnv()) return; // no-op in production / Vercel
  try {
    const response = await fetch(`/api/workspaces/${encodeURIComponent(workspaceId)}/member-content`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ memberEmail, memberName, workout, diet }),
    });
    if (!response.ok && isDevEnv()) {
      console.warn(`Member plan publish status: ${response.status}`);
    }
  } catch (error) {
    if (isDevEnv()) {
      console.warn('Bilzy Member plan publish (dev only):', error.message);
    }
  }
}

export async function pullWorkspacePlans(workspaceId = 'demo-workspace') {
  if (!isDevEnv()) return { workouts: [], diets: [] }; // no-op in production / Vercel
  try {
    const response = await fetch(`/api/workspaces/${encodeURIComponent(workspaceId)}`);
    if (!response.ok) {
      return { workouts: [], diets: [] };
    }
    return await response.json();
  } catch (error) {
    if (isDevEnv()) {
      console.warn('Bilzy Fit plan pull (dev only):', error.message);
    }
    return { workouts: [], diets: [] };
  }
}
