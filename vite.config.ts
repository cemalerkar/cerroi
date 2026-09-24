import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/cerroi/', 
  build: {
    outDir: 'docs', // GitHub Pages'in okuyabilmesi için dist yerine docs klasörüne çıkartıyoruz
    emptyOutDir: true
  }
})
