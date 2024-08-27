import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

import VueRouter from 'unplugin-vue-router/vite'
 
export default defineConfig({
  base: '/dashboard/',
  plugins: [
    VueRouter({}),
    vue(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
