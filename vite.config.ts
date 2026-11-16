import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const BE_CRM_TARGET = process.env.BE_CRM_BASE_URL || 'https://agency-sandbox.phuongnamtravel.com';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/be-crm': {
        target: BE_CRM_TARGET,
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/be-crm/, ''),
        cookieDomainRewrite: '',
      },
    },
  },
});
