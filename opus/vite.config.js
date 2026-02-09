import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server : {
    proxy : {
      '/kcisa' : {
        target : 'https://api.kcisa.kr',
        changeOrigin : true,
        rewrite: (path) => path.replace(/^\/kcisa/, ''),
      },

      '/kopis': {
        target: 'http://www.kopis.or.kr',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/kopis/, ''),
      },
    }
  }
})