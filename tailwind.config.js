/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ocean: {
          50:  '#eff8ff',
          100: '#dbeffe',
          200: '#bfe3fd',
          300: '#92d2fc',
          400: '#5eb8f8',
          500: '#3b9bf3',
          600: '#247de8',
          700: '#1c65d5',
          800: '#1d51ad',
          900: '#1e4688',
          950: '#172b54',
        },
        coral: {
          50:  '#fff4ed',
          100: '#ffe5d3',
          200: '#ffc8a5',
          300: '#ffa06d',
          400: '#ff6f32',
          500: '#fd4f0f',
          600: '#ee3505',
          700: '#c52507',
          800: '#9c1f0e',
          900: '#7e1c0f',
          950: '#440b05',
        },
        sand: {
          50:  '#fefce8',
          100: '#fef9c3',
          200: '#fef08a',
          300: '#fde047',
          400: '#facc15',
          500: '#eab308',
          600: '#ca8a04',
          700: '#a16207',
          800: '#854d0e',
          900: '#713f12',
          950: '#422006',
        },
        slate: {
          850: '#172033',
          950: '#0b1120',
        },
      },
      fontFamily: {
        sans:    ['Inter',  'system-ui', 'sans-serif'],
        display: ['Outfit', 'system-ui', 'sans-serif'],
      },
      animation: {
        'float':       'float 6s ease-in-out infinite',
        'slide-up':    'slideUp 0.5s ease-out',
        'fade-in':     'fadeIn 0.6s ease-out',
        'pulse-slow':  'pulse 4s cubic-bezier(0.4,0,0.6,1) infinite',
        'aurora':      'aurora 8s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%,100%': { transform: 'translateY(0px)' },
          '50%':     { transform: 'translateY(-20px)' },
        },
        slideUp: {
          '0%':   { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        aurora: {
          '0%,100%': { opacity: '0.3', transform: 'scale(1) rotate(0deg)' },
          '33%':     { opacity: '0.5', transform: 'scale(1.1) rotate(5deg)' },
          '66%':     { opacity: '0.2', transform: 'scale(0.95) rotate(-3deg)' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}
