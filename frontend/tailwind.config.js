/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'Source Sans 3', 'sans-serif'],
      },
      colors: {
        background: '#F8FAFC', // Slate 50
        foreground: '#0F172A', // Slate 900
        primary: {
          DEFAULT: '#4F46E5', // Indigo 600
          foreground: '#FFFFFF',
          dark: '#3730A3', // Indigo 800
        },
        secondary: {
          DEFAULT: '#1E293B', // Slate 800
          foreground: '#FFFFFF',
        },
        card: {
          DEFAULT: '#FFFFFF',
          foreground: '#0F172A',
        },
        danger: {
          DEFAULT: '#EF4444',
          foreground: '#FFFFFF',
          light: '#FEE2E2', // Red 100
        },
        success: {
          DEFAULT: '#10B981',
          foreground: '#FFFFFF',
          light: '#D1FAE5', // Emerald 100
        },
        warning: {
          DEFAULT: '#F59E0B',
          foreground: '#FFFFFF',
          light: '#FEF3C7', // Amber 100
        },
        border: '#E2E8F0', // Slate 200
        ring: '#4F46E5',
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(0, 0, 0, 0.05)',
        'float': '0 10px 30px -5px rgba(0, 0, 0, 0.08)',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      }
    },
  },
  plugins: [],
}
