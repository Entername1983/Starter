// tsrouter.config.ts
import { defineConfig } from '@tanstack/react-router-cli'

export default defineConfig({
  // adjust this glob to wherever your route files live
  entryPoints: ['src/routes/**/*.{ts,tsx}'],
})
