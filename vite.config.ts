import { defineConfig } from 'vite'
import tailwindcss from 'tailwindcss';
import path from 'path';
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@components': path.resolve(__dirname, 'src', 'components'),
      '@pages': path.resolve(__dirname, 'src', 'pages'),
    },
  },
  appType: 'mpa',
  css: {
    postcss: {
      plugins: [tailwindcss()],
    },
  }
})
