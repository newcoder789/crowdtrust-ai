import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'


// https://vite.dev/config/
export default defineConfig({
  server: {
    proxy: {
      '/uploads': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
      },'/analyze': {
          target: 'http://localhost:5000',
          changeOrigin: true,
          secure: false,
        },
    },
  },
  plugins: [react(), tailwindcss()],
})
