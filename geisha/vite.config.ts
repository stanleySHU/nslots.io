import { join } from "path";
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      'common': join(__dirname, '../', 'common/src'),
      '@': join(__dirname, './src')
    }
  }
})
