import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // Honor an injected PORT so the dev server can be assigned a free port.
    port: process.env.PORT ? Number(process.env.PORT) : 5173,
  },
})
