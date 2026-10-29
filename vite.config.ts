import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'resolve-tailwind-css',
      enforce: 'pre',
      resolveId(id, importer) {
        if (id === 'tailwindcss' && importer && (importer.endsWith('.css') || importer.includes('.css?'))) {
          return path.resolve(__dirname, 'src/tailwindcss-shim.css');
        }
      },
    },
  ],
  resolve: {
    alias: [
      {
        find: /^tailwindcss$/,
        replacement: path.resolve(__dirname, 'src/tailwindcss-shim.css'),
      },
    ],
  },
});
