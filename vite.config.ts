import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build:{
    outDir: 'dist',
  },
  server:{
    port: 3000,
    host: '0.0.0.0',
    watch: {
      usePolling: true,
      interval: 100,
    },
    hmr: {
      host: 'localhost',
      port: 3000,
    },
    proxy: {
      '/api': 'http://backend:8000'
    }
  }
})
