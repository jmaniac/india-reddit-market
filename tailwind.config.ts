import type { Config } from 'tailwindcss';
const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        bg: '#0d0f14', bg2: '#13161e', card: '#181c27', 'card-h': '#1e2333',
        acc: '#ff8c00', 'acc-b': '#ffab33', t1: '#f0f2f7', t2: '#9aa0b8', tm: '#606880',
      },
      fontFamily: { sans: ['Inter', 'system-ui', 'sans-serif'] },
    },
  },
  plugins: [],
};
export default config;