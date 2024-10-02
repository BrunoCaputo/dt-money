import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  base: './',
  build: {
    outDir: 'build',
    chunkSizeWarningLimit: 5000,
  },
  plugins: [react()],
})
