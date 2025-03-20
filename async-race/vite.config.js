import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import path from 'node:path';

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

export default defineConfig({
  base: './',
  resolve: {
    alias: {
      // '~': path.resolve(__dirname, './src'),
      '~': path.resolve(import.meta.dirname, './src'),
    },
  },
  build: {
    minify: true,
    target: 'esnext',
    compact: true,
  },
  css: {
    modules: {
      localsConvention: 'camelCaseOnly',
    },
  },
  plugins: [tailwindcss()],
});
