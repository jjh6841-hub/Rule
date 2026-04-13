import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  base: '/Rule/',
  plugins: [
    tailwindcss(),
    react(),
  ],
  server: {
    proxy: {
      '/law-api': {
        target: 'http://www.law.go.kr',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/law-api/, '/DRF'),
      },
    },
  },
})
