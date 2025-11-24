/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        wine: {
          50: '#fdf2f4',
          100: '#fce7eb',
          200: '#f9d0d9',
          300: '#f4a8b8',
          400: '#ec7491',
          500: '#e0486e',
          600: '#cc2d5a',
          700: '#ab204a',
          800: '#8e1e42',
          900: '#781d3d',
        },
      },
    },
  },
  plugins: [],
}
