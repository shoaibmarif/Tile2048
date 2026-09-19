/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        darkbg: '#090d16',
        carddark: '#111726',
        gold2048: '#edc22e',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      keyframes: {
        pop: {
          '0%': { transform: 'scale(0.8)', opacity: '0.8' },
          '50%': { transform: 'scale(1.18)' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        spawn: {
          '0%': { transform: 'scale(0)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        scorePopup: {
          '0%': { transform: 'translateY(0)', opacity: '1' },
          '100%': { transform: 'translateY(-30px)', opacity: '0' },
        }
      },
      animation: {
        pop: 'pop 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275) 80ms backwards',
        spawn: 'spawn 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275) 80ms backwards',
        scorePopup: 'scorePopup 0.6s ease-out forwards',
      }
    },
  },
  plugins: [],
};
