/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        gray: {
          750: '#2D3748',
          850: '#1A202C',
          950: '#0D1117',
        },
      },
    },
  },
  plugins: [],
}
