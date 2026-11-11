/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          burgundy: '#720D2D',
          'burgundy-hover': '#5B0A24',
          'burgundy-light': '#8E2947',
          rose: '#DDA6AE',
          'rose-light': '#F6E4E7',
          blush: '#FFF0F2',
          cream: '#FFF8F2',
          dark: '#422A30',
          border: '#EADDE0',
        },
      },
      fontFamily: {
        serif: ['Georgia', 'Cambria', '"Times New Roman"', 'Times', 'serif'],
        sans: ['system-ui', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
