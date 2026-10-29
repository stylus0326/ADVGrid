import { defineConfig, Plugin } from 'vite';
import react from '@vitejs/plugin-react';

/**
 * Tweakcn / Shadcn v4 Syntax Bridge Plugin for Vite
 * Cho phép lập trình viên dán trực tiếp 100% cú pháp CSS nguyên bản từ tweakcn.com
 * (chứa @import "tailwindcss", @custom-variant dark, @theme inline, @apply border-border outline-ring/50...)
 * mà không bao giờ phát sinh lỗi PostCSS hay Tailwind v3.
 */
function tweakcnV4CompatPlugin(): Plugin {
  return {
    name: 'vite-plugin-tweakcn-v4-compat',
    enforce: 'pre',
    transform(code, id) {
      if (!id.split('?')[0].endsWith('.css')) return null;
      if (!code.includes('tailwindcss') && !code.includes('border-border')) return null;

      let transformed = code;

      // 1. Chuyển đổi @import "tailwindcss"; thành @tailwind base/components/utilities
      transformed = transformed.replace(
        /@import\s+["']tailwindcss["'];?/g,
        '@tailwind base;\n@tailwind components;\n@tailwind utilities;'
      );

      // 2. Loại bỏ @custom-variant dark (&:is(.dark *)); đặc thù v4
      transformed = transformed.replace(/@custom-variant\s+[^;]+;/g, '');

      // 3. Tương thích @apply border-border outline-ring/50 trong @layer base
      transformed = transformed.replace(
        /@apply\s+border-border\s+outline-ring\/50;?/g,
        'border-color: var(--border);\n    outline-color: color-mix(in srgb, var(--ring) 50%, transparent);'
      );

      // 4. Tương thích @apply bg-background text-foreground trong @layer base
      transformed = transformed.replace(
        /@apply\s+bg-background\s+text-foreground;?/g,
        'background-color: var(--background);\n    color: var(--foreground);'
      );

      return {
        code: transformed,
        map: null,
      };
    },
  };
}

export default defineConfig({
  plugins: [
    tweakcnV4CompatPlugin(),
    react(),
  ],
});
