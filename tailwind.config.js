/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        therapy: {
          50: '#f6f7f6',
          100: '#e3e8e4',
          200: '#c5d1c7',
          300: '#9eb4a2',
          400: '#75947b',
          500: '#55765c',
          600: '#415d47',
          700: '#344b39',
          800: '#2c3c2f',
          900: '#253228',
          950: '#121c15',
        },
        slateSurface: {
          50: '#f8fafc',
          100: '#f1f5f9',
          800: '#0f172a',
          900: '#0b1120',
          950: '#070b14',
        }
      },
      fontFamily: {
        sans: ['"Space Grotesk"', 'system-ui', '-apple-system', 'sans-serif'],
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        'soft': '0 2px 10px 0 rgba(0, 0, 0, 0.04), 0 1px 3px 0 rgba(0, 0, 0, 0.02)',
        'float': '0 10px 30px -5px rgba(0, 0, 0, 0.08), 0 4px 6px -2px rgba(0, 0, 0, 0.04)',
        'modal': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
      }
    },
  },
  plugins: [],
};
