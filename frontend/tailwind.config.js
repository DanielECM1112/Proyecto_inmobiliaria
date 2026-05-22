/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx}"],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['Playfair Display', 'serif'],
        heading: ['Playfair Display', 'serif'],
      },
      colors: {
        primary: {
          light: '#F8FAFC',
          DEFAULT: '#0F172A',
          dark: '#0F172A',
        },
        dark: {
          50: '#F8FAFC',
          100: '#F1F5F9',
          200: '#E2E8F0',
          300: '#CBD5E1',
          400: '#94A3B8',
          500: '#64748B',
          600: '#475569',
          700: '#334155',
          800: '#1E293B',
          900: '#111827',
          950: '#0F172A',
        },
        light: {
          50: '#FFFFFF',
          100: '#F8FAFC',
          200: '#E2E8F0',
          300: '#CBD5E1',
          400: '#94A3B8',
          500: '#64748B',
        },
        gold: {
          light: '#D4AF37',
          DEFAULT: '#D4AF37',
          dark: '#B8941E',
          lighter: '#E5C158',
        },
        midnight: {
          DEFAULT: '#0F172A',
          light: '#1E293B',
          lighter: '#334155',
        },
        accent: {
          blue: '#2563EB',
          cyan: '#06B6D4',
          purple: '#A855F7',
        }
      },
      backgroundColor: {
        'dark-primary': '#F8FAFC',
        'dark-secondary': '#E2E8F0',
        'light-primary': '#FFFFFF',
        'light-secondary': '#F8FAFC',
      },
      textColor: {
        'dark-primary': '#F8FAFC',
        'dark-secondary': '#CBD5E1',
        'light-primary': '#0F172A',
        'light-secondary': '#475569',
      }
    },
  },
  plugins: [],
}

