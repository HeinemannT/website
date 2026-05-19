/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    './index.html',
    './*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './hooks/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        paper: '#FAF9F6',
        ink: '#2D2D2D',
        cinnabar: '#A63434',
      },
    },
  },
  plugins: [],
};
