import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/portal/',
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react', 'yet-another-react-lightbox'],
    include: ['react', 'react-dom'],
  },
});
