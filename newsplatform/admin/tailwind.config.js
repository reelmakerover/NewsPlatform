/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        body: ['"DM Sans"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      colors: {
        ink: { 50: '#f8f7f4', 100: '#f0ede6', 200: '#ddd7cc', 300: '#c4baa8', 400: '#a69880', 500: '#8b7d62', 600: '#6e6049', 700: '#574b39', 800: '#3e3629', 900: '#231f16', 950: '#120e08' },
        crimson: { 50: '#fef2f2', 100: '#ffe1e1', 200: '#ffc7c7', 300: '#ffa0a0', 400: '#e85d5d', 500: '#e03535', 600: '#c42020', 700: '#a31a1a', 800: '#871818', 900: '#701818' },
        saffron: { 50: '#fffbeb', 100: '#fef3c7', 200: '#fde68a', 300: '#fcd34d', 400: '#f5a623', 500: '#e8930d', 600: '#cc7a00', 700: '#a86200', 800: '#894f00', 900: '#714200' },
      },
      animation: {
        'slide-up': 'slideUp 0.6s cubic-bezier(0.16,1,0.3,1) forwards',
        'fade-in': 'fadeIn 0.5s ease forwards',
        'ticker': 'ticker 30s linear infinite',
      },
      keyframes: {
        slideUp: { from: { opacity: 0, transform: 'translateY(30px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
        fadeIn: { from: { opacity: 0 }, to: { opacity: 1 } },
        ticker: { from: { transform: 'translateX(100%)' }, to: { transform: 'translateX(-100%)' } },
      }
    }
  },
  plugins: []
}
