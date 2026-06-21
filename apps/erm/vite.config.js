import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Mirrors the genealogy app: source lives in apps/erm, the built SPA is emitted
// to /erm at the repo root and served by GitHub Pages at theinemann.de/erm/.
export default defineConfig({
  base: '/erm/',
  plugins: [react()],
  build: { outDir: '../../erm', emptyOutDir: true },
  server: { port: 3000, host: '0.0.0.0' },
});
