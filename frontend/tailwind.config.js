/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    screens: {
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
    },
    extend: {
      animation: {
        'spin-slow': 'spin 20s linear infinite',
        'rotateText': 'rotateText 20s linear infinite',
        'gooey': 'gooey 12s cubic-bezier(0.4, 0, 0.2, 1) infinite alternate',
        'border-glow-translate': 'border-glow-translate 10s ease-in-out infinite alternate',
        'border-glow-scale': 'border-glow-scale 10s ease-in-out infinite alternate'
      },
      keyframes: {
        rotateText: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        gooey: {
          '0%': { 
            transform: 'translate(20%, -20%) skew(0) scale(1) rotate(0deg)',
            filter: 'blur(30px)'
          },
          '20%': {
            transform: 'translate(-30%, 30%) skew(-20deg) scale(1.3) rotate(45deg)',
            filter: 'blur(40px)'
          },
          '40%': {
            transform: 'translate(25%, -25%) skew(15deg) scale(0.7) rotate(-45deg)',
            filter: 'blur(35px)'
          },
          '60%': {
            transform: 'translate(-25%, 25%) skew(-15deg) scale(1.2) rotate(90deg)',
            filter: 'blur(45px)'
          },
          '80%': {
            transform: 'translate(30%, -30%) skew(20deg) scale(0.8) rotate(-90deg)',
            filter: 'blur(50px)'
          },
          '100%': { 
            transform: 'translate(-20%, 20%) skew(-10deg) scale(1.4) rotate(180deg)',
            filter: 'blur(55px)'
          }
        },
        'border-glow-translate': {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' }
        },
        'border-glow-scale': {
          '0%': { transform: 'scale(1) translateX(-100%)' },
          '100%': { transform: 'scale(1.5) translateX(100%)' }
        }
      }
    },
  },
  plugins: [],
} 