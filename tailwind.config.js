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
        warm: {
          50: '#FAF9F6',
          100: '#F4F2EB',
          200: '#EAE6DB',
          300: '#DDD8C7',
          400: '#C2BC9F',
          500: '#A49E7C',
          600: '#837D5F',
          700: '#645E47',
          800: '#464232',
          900: '#2C2A20',
          950: '#171610',
        },
        sage: {
          50: '#F4F7F5',
          100: '#E6ECE8',
          200: '#CEDAD1',
          300: '#ADC2B3',
          400: '#86A48F',
          500: '#5C8267',
          600: '#43684D',
          700: '#34523C',
          800: '#2A4030',
          900: '#233428',
          950: '#111C14',
        },
        ink: {
          50: '#F7F7F8',
          100: '#EEEEF0',
          200: '#DDDEE1',
          300: '#BDBFC5',
          400: '#9497A0',
          500: '#737782',
          600: '#5A5D67',
          700: '#474A53',
          800: '#36383F',
          900: '#1A1C20',
          950: '#0F1012',
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', '-apple-system', 'sans-serif'],
        serif: ['"Lora"', 'Georgia', 'serif'],
      },
      boxShadow: {
        'subtle': '0 1px 3px 0 rgba(0, 0, 0, 0.04), 0 1px 2px -1px rgba(0, 0, 0, 0.02)',
        'card': '0 4px 20px -2px rgba(28, 30, 27, 0.05), 0 2px 6px -1px rgba(28, 30, 27, 0.02)',
        'elevation': '0 12px 36px -4px rgba(28, 30, 27, 0.08)',
      }
    },
  },
  plugins: [],
};
