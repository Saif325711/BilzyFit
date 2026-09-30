import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig(async ({ command }) => {
  const plugins = [react()]

  // workspaceSyncPlugin uses Node.js fs/path — only load it in dev (vite serve).
  // It must NOT be bundled in the production build.
  if (command === 'serve') {
    const { workspaceSyncPlugin } = await import('./server/workspaceSyncPlugin.js')
    plugins.push(workspaceSyncPlugin())
  }

  return { plugins }
})
