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
        // Light theme colors
        background: {
          light: '#fdfcfb', // soft warm white
          dark: '#2a2621',  // soft dark warm gray
        },
        foreground: {
          light: '#2a2621', // dark text on light bg
          dark: '#fdfcfb',  // light text on dark bg
        },
        // Primary accent colors based on #195221 (forest green)
        primary: {
          50: '#f0f9f1',
          100: '#dcf2de',
          200: '#bae5c0',
          300: '#8dd298',
          400: '#5cb56a',
          500: '#3a9b47',
          600: '#2a7d35',
          700: '#23642b',
          800: '#1f5024',
          900: '#195221', // your base color
          950: '#0d2d12',
        },
        // Secondary accent colors based on #6c5d80 (muted purple)
        secondary: {
          50: '#f7f6f9',
          100: '#efecf2',
          200: '#e1dce7',
          300: '#cbc1d4',
          400: '#b09ebc',
          500: '#9680a5',
          600: '#81678d',
          700: '#6c5d80', // your base color
          800: '#5a4d68',
          900: '#4c4056',
          950: '#322a38',
        },
        // Neutral grays with warm undertones
        neutral: {
          50: '#faf9f8',
          100: '#f4f2f0',
          200: '#e8e4e1',
          300: '#d7d1cb',
          400: '#c1b8af',
          500: '#a89d92',
          600: '#938377',
          700: '#7a6e63',
          800: '#655c53',
          900: '#544d46',
          950: '#2a2621', // matches dark background
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
