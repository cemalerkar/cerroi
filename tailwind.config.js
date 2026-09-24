/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      animation: {
        'slide-in-left': 'slideInLeft 0.6s cubic-bezier(0.16, 1, 0.3, 1) both',
        'slide-in-right': 'slideInRight 0.6s cubic-bezier(0.16, 1, 0.3, 1) both',
        'slide-in-up': 'slideInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) both',
        'fade-in': 'fadeIn 0.5s ease-out both',
        
        'float-slow-1': 'floatPath1 35s ease-in-out infinite alternate',
        'float-slow-2': 'floatPath2 45s ease-in-out infinite alternate',
        'float-slow-3': 'floatPath3 40s ease-in-out infinite alternate',
        'float-slow-4': 'floatPath4 50s ease-in-out infinite alternate',
        'float-spin': 'spinSlow 25s linear infinite',
      },
      keyframes: {
        slideInLeft: {
          '0%': { opacity: '0', transform: 'translateX(-40px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(40px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        slideInUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        
        floatPath1: {
          '0%': { transform: 'translate(0, 0) rotate(0deg) scale(1)' },
          '50%': { transform: 'translate(15vw, -20vh) rotate(45deg) scale(1.1)' },
          '100%': { transform: 'translate(-10vw, -40vh) rotate(90deg) scale(0.9)' },
        },
        floatPath2: {
          '0%': { transform: 'translate(0, 0) rotate(0deg) scale(1)' },
          '50%': { transform: 'translate(-20vw, 15vh) rotate(-30deg) scale(0.8)' },
          '100%': { transform: 'translate(15vw, 30vh) rotate(-60deg) scale(1.2)' },
        },
        floatPath3: {
          '0%': { transform: 'translate(0, 0) rotate(0deg)' },
          '50%': { transform: 'translate(10vw, 30vh) rotate(20deg)' },
          '100%': { transform: 'translate(-20vw, 10vh) rotate(40deg)' },
        },
        floatPath4: {
          '0%': { transform: 'translate(0, 0) rotate(0deg)' },
          '50%': { transform: 'translate(-15vw, -25vh) rotate(-40deg)' },
          '100%': { transform: 'translate(20vw, -10vh) rotate(-80deg)' },
        },
        spinSlow: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        }
      }
    },
  },
  plugins: [],
}
