import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  productionSourceMap: false,
  drop_console: true,
  drop_debugger: true,
  plugins: [vue()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  server: {
    open: false,
    https: false,
    hot: true,
    port:9000,
    proxy: {
      '/api': {
        target: 'http://192.168.99.112:3199/',
        //target: 'http://jk.royalgaming.today:3198',
        ws: true,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  },
})
