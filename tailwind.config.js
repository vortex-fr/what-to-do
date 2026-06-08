/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['ProximaNova', 'system-ui', 'sans-serif'],
        script: ['Pacifico', 'cursive'],
      },
      colors: {
        // Brand
        violet: {
          50: '#f5f1fc',
          100: '#ebe3f9',
          200: '#d7c7f2',
          300: '#bda3e8',
          400: '#a37edc',
          500: '#8b5fbf', // primary
          600: '#7a4fb0',
          700: '#5d4f8c',
          800: '#473a6b',
          900: '#332a4d',
        },
        teal: {
          50: '#effbfa',
          100: '#d6f5f2',
          200: '#ace9e4',
          300: '#7ad6cf',
          400: '#54c4be', // accent
          500: '#36a8a2',
          600: '#2b8884',
          700: '#266c6a',
        },
        ink: '#2b2740',
        cloud: '#f7f5fb',
      },
      boxShadow: {
        card: '0 10px 30px -8px rgba(108, 74, 158, 0.25)',
        glow: '0 0 0 1px rgba(255,255,255,.4), 0 18px 50px -12px rgba(139,95,191,.45)',
        float: '0 24px 60px -18px rgba(45, 30, 80, 0.35)',
      },
      keyframes: {
        floaty: { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-10px)' } },
        shimmer: { '100%': { transform: 'translateX(100%)' } },
        pop: { '0%': { transform: 'scale(.9)', opacity: '0' }, '100%': { transform: 'scale(1)', opacity: '1' } },
        gradientShift: { '0%,100%': { backgroundPosition: '0% 50%' }, '50%': { backgroundPosition: '100% 50%' } },
      },
      animation: {
        floaty: 'floaty 5s ease-in-out infinite',
        shimmer: 'shimmer 2.2s infinite',
        pop: 'pop .25s ease-out',
        gradientShift: 'gradientShift 8s ease infinite',
      },
    },
  },
  plugins: [],
}
