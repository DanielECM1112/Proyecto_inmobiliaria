/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Montserrat', 'sans-serif'],
        serif: ['Playfair Display', 'serif'],
      },
      colors: {
        primary: {
          light: '#2c3e50',
          DEFAULT: '#1a252f',
          dark: '#0f172a',
        },
        gold: {
          light: '#d4af37',
          DEFAULT: '#c5a028',
          dark: '#a68a20',
        }
      }
    },
  },
  plugins: [],
}

