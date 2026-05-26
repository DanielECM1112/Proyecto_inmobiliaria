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
        /* Colores Primarios Premium */
        primary: {
          light: '#FAFBFC',
          DEFAULT: '#0A0E1F',
          dark: '#050609',
        },
        /* Escala de Grises Actualizada */
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
          950: '#0A0E1F',
        },
        light: {
          50: '#FFFFFF',
          100: '#FAFBFC',
          150: '#F5F7FA',
          200: '#F0F3F7',
          300: '#E4EAF2',
          400: '#D4DAE2',
          500: '#A0A8B8',
        },
        /* Paleta de Oro Premium - SIN NARANJA CHILLÓN */
        gold: {
          50: '#FFFBF0',
          100: '#FDF6E3',
          200: '#F8E8C8',
          300: '#F0DAA8',
          400: '#E5C158',
          500: '#D4AF37',
          600: '#C9A961',
          700: '#B8941B',
          800: '#9B7C1f',
          900: '#7a5f17',
          light: '#E5C158',
          DEFAULT: '#D4AF37',
          dark: '#B8941B',
          champagne: '#D4AF37',
          metallic: '#C9A961',
        },
        /* Colores Nocturnos Elegantes */
        midnight: {
          DEFAULT: '#0A0E1F',
          light: '#121829',
          lighter: '#1A1F3A',
          darkest: '#050609',
        },
        /* Acentos Premium */
        accent: {
          gold: '#D4AF37',
          'gold-light': '#E5C158',
          'gold-dark': '#B8941B',
          'night-blue': '#1e3a8a',
          'deep-blue': '#1e40af',
          blue: '#2563EB',
          cyan: '#06B6D4',
          purple: '#A855F7',
        }
      },
      backgroundColor: {
        'dark-primary': '#FAFBFC',
        'dark-secondary': '#E4EAF2',
        'light-primary': '#FFFFFF',
        'light-secondary': '#FAFBFC',
        'premium-gold': '#D4AF37',
        'premium-dark': '#0A0E1F',
      },
      textColor: {
        'dark-primary': '#FAFBFC',
        'dark-secondary': '#D4D9E3',
        'light-primary': '#0A0E1F',
        'light-secondary': '#2C3E50',
        'gold-accent': '#D4AF37',
      },
      boxShadow: {
        'gold': '0 4px 20px rgba(212, 175, 55, 0.15)',
        'gold-lg': '0 8px 30px rgba(212, 175, 55, 0.2)',
        'cinema': '0 20px 50px rgba(0, 0, 0, 0.4)',
        'cinema-light': '0 10px 30px rgba(0, 0, 0, 0.1)',
        'premium-dark': '0 24px 48px rgba(0, 0, 0, 0.6)',
        'premium-light': '0 4px 12px rgba(0, 0, 0, 0.08)',
      },
    },
  },
  plugins: [],
}

