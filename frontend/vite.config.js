import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import dotenv from 'dotenv';

dotenv.config({ path: './.env' });

// const FRONTEND_PORT = import.meta.env.VITE_FRONTEND_PORT;
// const DOMAIN = import.meta.env.VITE_DOMAIN;
// const PORT = import.meta.env.VITE_PORT;

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port : 3000,
    proxy :{
      '/api':{
        target: `http://backend:5000/` || 'http://localhost:5000',
        changeOrigin: true
      }
    }
  }
})
