import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  // GitHub Pages base path (repo नावानुसार case-sensitive असतो)
  base: '/Fire/',
  plugins: [react()],
})
