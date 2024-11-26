import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port : 3000,
    proxy :{
      '/api':{
        target:  'https://mern--backend-d9e4cea28066.herokuapp.com/',
        changeOrigin: true
      }
    }
  }
})
