/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // App surface palette — dark navy
        surface: {
          base: '#060A14',    // Deepest background
          card: '#0D1117',    // Card background
          hover: '#111827',   // Hover state
          border: '#1C2433',  // Subtle borders
          input: '#0D1117',   // Input fields
        },
        // Primary brand — indigo
        brand: {
          50:  '#EEF2FF',
          100: '#E0E7FF',
          200: '#C7D2FE',
          300: '#A5B4FC',
          400: '#818CF8',
          500: '#6366F1',
          600: '#4F46E5',
          700: '#4338CA',
          800: '#3730A3',
          900: '#312E81',
        },
        // Score colors
        score: {
          excellent: '#10B981', // emerald
          good:      '#6366F1', // indigo
          fair:      '#F59E0B', // amber
          poor:      '#EF4444', // red
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      animation: {
        'fade-in':    'fadeIn 0.4s ease-out',
        'slide-up':   'slideUp 0.4s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'scale-in':   'scaleIn 0.3s ease-out',
        'spin-slow':  'spin 3s linear infinite',
        'pulse-glow': 'pulseGlow 2.5s ease-in-out infinite',
        'shimmer':    'shimmer 2s linear infinite',
      },
      keyframes: {
        fadeIn: {
          from: { opacity: '0' },
          to:   { opacity: '1' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(16px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          from: { opacity: '0', transform: 'translateY(-12px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          from: { opacity: '0', transform: 'scale(0.95)' },
          to:   { opacity: '1', transform: 'scale(1)' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(99, 102, 241, 0)' },
          '50%':      { boxShadow: '0 0 24px 6px rgba(99, 102, 241, 0.25)' },
        },
        shimmer: {
          from: { backgroundPosition: '-200% 0' },
          to:   { backgroundPosition: '200% 0' },
        },
      },
      backgroundImage: {
        'grid-pattern':
          'linear-gradient(rgba(99,102,241,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.04) 1px, transparent 1px)',
        'shimmer-gradient':
          'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.04) 50%, transparent 100%)',
      },
      backgroundSize: {
        'grid': '48px 48px',
      },
    },
  },
  plugins: [],
};