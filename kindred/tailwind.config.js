/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        kindred: {
          orange: '#fb8b24',
          'orange-dark': '#c95f08',
          cream: '#faf0e6',
          'cream-deep': '#f4dfca',
        },
      },
    },
  },
  plugins: [],
}
