import baseConfig from './tailwind.config.js';

/** @type {import('tailwindcss').Config} */
export default {
  ...baseConfig,
  content: [
    './src/lib/**/*.{ts,tsx}',
    './src/components/grid/**/*.{ts,tsx}',
    './src/components/ui/**/*.{ts,tsx}',
    './src/themes/**/*.{ts,tsx}',
  ],
  corePlugins: {
    preflight: false,
  },
};
