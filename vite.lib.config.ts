import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';

const ROOT_DIR = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react()],
  publicDir: false,
  css: {
    postcss: {
      plugins: [tailwindcss('./tailwind.lib.config.js'), autoprefixer()],
    },
  },
  esbuild: {
    legalComments: 'none',
    drop: ['debugger'],
  },
  build: {
    outDir: 'dist-lib',
    emptyOutDir: true,
    sourcemap: false,
    minify: 'esbuild',
    cssCodeSplit: false,
    target: 'es2020',
    lib: {
      entry: {
        index: resolve(ROOT_DIR, 'src/lib/index.ts'),
        columns: resolve(ROOT_DIR, 'src/lib/columns.ts'),
        grid: resolve(ROOT_DIR, 'src/lib/grid.ts'),
        ui: resolve(ROOT_DIR, 'src/lib/ui.ts'),
        themes: resolve(ROOT_DIR, 'src/lib/themes.ts'),
      },
      formats: ['es'],
      fileName: (_format, entryName) => `${entryName}.js`,
      cssFileName: 'styles',
    },
    rollupOptions: {
      external: [
        'react',
        'react-dom',
        'react/jsx-runtime',
        'react/jsx-dev-runtime',
        'react-dom/client',
      ],
      output: {
        chunkFileNames: 'chunks/[name]-[hash].js',
      },
    },
  },
});
