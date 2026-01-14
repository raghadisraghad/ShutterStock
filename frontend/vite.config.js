import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import dotenv from 'dotenv'

dotenv.config()

export default defineConfig({
  plugins: [react()],
  server: {
    port : 3000,
    proxy :{
      '/api':{
        target: process.env.VITE_API_BASE_URL,
        changeOrigin: true
      }
    }
  }
})