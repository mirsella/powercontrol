import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import WindiCSS from 'vite-plugin-windicss'

export default defineConfig({
  plugins: [
    vue(),
    WindiCSS()
  ],
  // base: process.env.NODE_ENV === 'gh-pages' ? '/powercontrol/' : '/',
  base: '/powercontrol/'
})
