import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
export default defineConfig({ plugins: [react()], test: { include: ['src/**/*.test.ts'] }, base: './', build: { rollupOptions: { output: { manualChunks: { math: ['katex'], motion: ['motion/react'] } } } } });
