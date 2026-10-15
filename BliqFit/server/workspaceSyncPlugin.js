import fs from 'node:fs';
import path from 'node:path';

const MAX_BODY_BYTES = 15 * 1024 * 1024;

function readJson(filePath, fallback) {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch {
    return fallback;
  }
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk;
      if (Buffer.byteLength(body) > MAX_BODY_BYTES) {
        reject(new Error('Request body is too large.'));
        req.destroy();
      }
    });
    req.on('end', () => {
      try {
        resolve(JSON.parse(body || '{}'));
      } catch {
        reject(new Error('Request body must be valid JSON.'));
      }
    });
    req.on('error', reject);
  });
}

export function workspaceSyncPlugin() {
  const dataDirectory = path.resolve(process.cwd(), '.bilzyfit-sync');
  fs.mkdirSync(dataDirectory, { recursive: true });

  return {
    name: 'bilzyfit-workspace-sync',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const requestUrl = new URL(req.url, 'http://localhost');
        const match = requestUrl.pathname.match(/^\/api\/workspaces\/([^/]+)(?:\/(sync|member-content))?$/);
        if (!match) {
          next();
          return;
        }

        const workspaceId = decodeURIComponent(match[1]);
        const action = match[2] || 'workouts';
        const filePath = path.join(dataDirectory, `${workspaceId}.json`);
        const send = (status, payload) => {
          res.statusCode = status;
          res.setHeader('Content-Type', 'application/json');
          res.setHeader('Access-Control-Allow-Origin', '*');
          res.end(JSON.stringify(payload));
        };

        if (req.method === 'OPTIONS') {
          res.statusCode = 204;
          res.setHeader('Access-Control-Allow-Origin', '*');
          res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
          res.end();
          return;
        }

        if (req.method === 'POST' && action === 'sync') {
          try {
            const payload = await readBody(req);
            if (!Array.isArray(payload.members) || !Array.isArray(payload.workouts) || !Array.isArray(payload.diets)) {
              send(400, { error: 'members, workouts, and diets arrays are required.' });
              return;
            }
            const existing = readJson(filePath, { members: [], workouts: [], diets: [] });
            const mergeMemberPlans = (current = [], incoming = []) => {
              const incomingIds = new Set(incoming.map((item) => item.id));
              return [
                ...incoming,
                ...current.filter((item) => item.source === 'member' && !incomingIds.has(item.id)),
              ];
            };
            const next = {
              members: payload.members,
              workouts: mergeMemberPlans(existing.workouts, payload.workouts),
              diets: mergeMemberPlans(existing.diets, payload.diets),
              updatedAt: new Date().toISOString(),
            };
            fs.writeFileSync(filePath, JSON.stringify(next, null, 2));
            send(200, { ok: true, updatedAt: next.updatedAt });
          } catch (error) {
            send(400, { error: error.message });
          }
          return;
        }

        if (req.method !== 'GET' && !(req.method === 'POST' && action === 'member-content')) {
          send(405, { error: 'Method not allowed.' });
          return;
        }

        const data = readJson(filePath, { members: [], workouts: [] });
        if (req.method === 'GET' && action === 'member-content') {
          const email = requestUrl.searchParams.get('email')?.toLowerCase();
          const member = data.members.find((item) => item.email?.toLowerCase() === email);
          const workouts = member
            ? data.workouts.filter((item) => item.assignedTo?.includes(member.id))
            : [];
          const diets = member
            ? (data.diets || []).filter((item) => item.assignedTo?.includes(member.id))
            : [];
          send(200, { member: member || null, workouts, diets });
          return;
        }

        if (req.method === 'POST' && action === 'member-content') {
          try {
            const payload = await readBody(req);
            if (!payload.memberEmail || (!payload.workout && !payload.diet)) {
              send(400, { error: 'memberEmail and a workout or diet plan are required.' });
              return;
            }
            const existing = readJson(filePath, { members: [], workouts: [], diets: [] });
            const members = [...(existing.members || [])];
            let member = members.find(
              (item) => item.email?.toLowerCase() === payload.memberEmail.toLowerCase(),
            );
            if (!member) {
              member = {
                id: `member-${Date.now()}`,
                fullName: payload.memberName || payload.memberEmail,
                email: payload.memberEmail,
                status: 'active',
              };
              members.push(member);
            }
            const next = {
              ...existing,
              members,
              workouts: existing.workouts || [],
              diets: existing.diets || [],
              updatedAt: new Date().toISOString(),
            };
            if (payload.workout) {
              next.workouts = [
                {
                  ...payload.workout,
                  id: payload.workout.id || `member-workout-${Date.now()}`,
                  assignedTo: [member.id],
                  source: 'member',
                  createdBy: member.id,
                },
                ...next.workouts,
              ];
            }
            if (payload.diet) {
              next.diets = [
                {
                  ...payload.diet,
                  id: payload.diet.id || `member-diet-${Date.now()}`,
                  assignedTo: [member.id],
                  source: 'member',
                  createdBy: member.id,
                },
                ...next.diets,
              ];
            }
            fs.writeFileSync(filePath, JSON.stringify(next, null, 2));
            send(200, { ok: true, updatedAt: next.updatedAt });
          } catch (error) {
            send(400, { error: error.message });
          }
          return;
        }

        send(200, { workouts: data.workouts || [], diets: data.diets || [] });
      });
    },
  };
}
