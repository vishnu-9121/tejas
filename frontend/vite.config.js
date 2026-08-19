import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import viteCompression from 'vite-plugin-compression'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    tailwindcss(),
    viteCompression({ algorithm: 'gzip' }),
    viteCompression({ algorithm: 'brotliCompress', ext: '.br' }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
    host: true,
    cors: true,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
      },
      '/socket.io': {
        target: 'http://localhost:5000',
        ws: true,
      },
    },
  },
  build: {
    target: 'es2020',
    sourcemap: false,
    cssCodeSplit: true,
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
        manualChunks(id) {
          if (id.includes('node_modules')) {
            const normalized = id.replace(/\\/g, '/');

            // 1. Pure React Core & Router Runtime
            if (/\/node_modules\/(react|react-dom|scheduler|react-router|react-router-dom)\//.test(normalized)) {
              return 'vendor-react';
            }
            // 2. Animation Engine
            if (/\/node_modules\/(framer-motion)\//.test(normalized)) {
              return 'vendor-framer';
            }
            // 3. Lucide Icons
            if (/\/node_modules\/(lucide-react)\//.test(normalized)) {
              return 'vendor-icons';
            }
            // 4. Server State (TanStack Query)
            if (/\/node_modules\/(@tanstack\/react-query|@tanstack\/query-core)\//.test(normalized)) {
              return 'vendor-query';
            }
            // 5. Form Handling & Schema Validation
            if (/\/node_modules\/(react-hook-form|@hookform\/resolvers|zod)\//.test(normalized)) {
              return 'vendor-forms';
            }
            // 6. Excel Export (SheetJS)
            if (/\/node_modules\/(xlsx)\//.test(normalized)) {
              return 'vendor-xlsx';
            }
            // 7. Google OAuth Provider
            if (/\/node_modules\/(@react-oauth\/google)\//.test(normalized)) {
              return 'vendor-auth';
            }
            // 8. Sonner Toast UI
            if (/\/node_modules\/(sonner)\//.test(normalized)) {
              return 'vendor-ui';
            }
            // 9. Utilities & Networking
            if (/\/node_modules\/(axios|socket\.io-client|engine\.io-client|zustand|clsx|tailwind-merge|react-helmet-async)\//.test(normalized)) {
              return 'vendor-utils';
            }

            return 'vendor';
          }
        }
      }
    }
  }
}))
