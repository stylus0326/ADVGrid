import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';
import postcss from 'postcss';

/**
 * tweakcn-compat PostCSS Plugin
 * Hỗ trợ cú pháp CSS chuẩn tweakcn (Tailwind v4 syntax: @import "tailwindcss", @custom-variant, @theme inline, outline-ring/50)
 * hoạt động mượt mà 100% trên Vite dev server (HMR) và production build mà không cần cài thêm package.
 */
const tweakcnCompatPlugin = () => ({
  postcssPlugin: 'tweakcn-compat',
  Once(root, { atRule }) {
    root.walkAtRules((rule) => {
      if (rule.name === 'import' && rule.params.includes('tailwindcss')) {
        rule.after(atRule({ name: 'tailwind', params: 'utilities' }));
        rule.after(atRule({ name: 'tailwind', params: 'components' }));
        rule.after(atRule({ name: 'tailwind', params: 'base' }));
        rule.remove();
      } else if (rule.name === 'custom-variant' || rule.name === 'theme') {
        rule.remove();
      } else if (rule.name === 'apply' && rule.params.includes('outline-ring/50')) {
        rule.parent.append(postcss.decl({ prop: 'border-color', value: 'var(--border)' }));
        rule.parent.append(postcss.decl({ prop: 'outline-color', value: 'color-mix(in srgb, var(--ring) 50%, transparent)' }));
        rule.remove();
      }
    });
  },
});
tweakcnCompatPlugin.postcss = true;

export default {
  plugins: [
    tweakcnCompatPlugin(),
    tailwindcss(),
    autoprefixer(),
  ],
};
