import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import path from 'node:path';

export default defineConfig({
  base: './',
  resolve: {
    alias: {
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

  esbuild: {
    jsx: 'transform',
    jsxDev: false,
    jsxImportSource: '~',
    jsxInject: `import { jsx } from '~/jsx-runtime.ts';`,
    jsxFactory: 'jsx.component',
  },
});
