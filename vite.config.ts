import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    // Проксируем все запросы /v3/* на реальный API
    // Браузер думает что это localhost — куки работают
    proxy: {
      '/v3': {
        target: 'https://api.owlvision.app',
        changeOrigin: true,
        secure: false,
      }
    }
  }
})
