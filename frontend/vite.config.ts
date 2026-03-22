import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    rolldownOptions: {
      output: {
        manualChunks: (id: string) => {
          if (id.includes('ethers')) return 'ethers';
          if (id.includes('@reown/appkit')) return 'appkit';
          if (id.includes('react-dom') || id.includes('react-router')) return 'react-vendor';
          if (id.includes('react')) return 'react';
        }
      }
    }
  }
});
