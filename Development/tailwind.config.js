/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Noto Sans', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        serif: ['Libre Bodoni', 'ui-serif', 'Georgia', 'serif'],
        display: ['Playfair Display', 'serif'],
      },
      colors: {
        'satriales': {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d',
        },
        'butcher': {
          50: '#f8f5f2',
          100: '#e8e0d8',
          200: '#d4c3b5',
          300: '#b89c85',
          400: '#a07c61',
          500: '#8b6347',
          600: '#74502f',
          700: '#5d3f24',
          800: '#46301c',
          900: '#2f2013',
        },
        'porkchop': {
          50: '#f9f5f2',
          100: '#f0e6dd',
          200: '#e2cdb9',
          300: '#d4b395',
          400: '#c69a72',
          500: '#b7814e',
          600: '#a3683a',
          700: '#8f502c',
          800: '#7b391f',
          900: '#672211',
        },
        'vintage': {
          50: '#f7f7f2',
          100: '#e6e4d9',
          200: '#d2ceb8',
          300: '#b8b090',
          400: '#a49872',
          500: '#8c7d5a',
          600: '#746744',
          700: '#5c5235',
          800: '#443d28',
          900: '#2c281a',
        },
        'mint': {
          50: '#f2fdf6',
          100: '#e6fbee',
          200: '#ccf7dc',
          300: '#b3f3cb',
          400: '#99efb9',
          500: '#80eba8',
          600: '#66e796',
          700: '#4de385',
          800: '#33df73',
          900: '#1ad961',
        },
      },
      boxShadow: {
        'vintage': '0 4px 6px -1px rgba(139, 99, 71, 0.1), 0 2px 4px -1px rgba(139, 99, 71, 0.06)',
        'vintage-lg': '0 10px 15px -3px rgba(139, 99, 71, 0.1), 0 4px 6px -2px rgba(139, 99, 71, 0.05)',
        'wooden': '0 3px 6px -1px rgba(46, 30, 18, 0.12), 0 2px 4px -1px rgba(46, 30, 18, 0.07)',
        'tag': '0 2px 3px rgba(0, 0, 0, 0.1)',
      },
      backgroundImage: {
        'butcher-paper': "url('/images/butcher-paper-bg.png')",
        'wood-texture': "url('/images/wood-texture.png')",
        'paper-rip-top': "url('/images/paper-rip-top.png')",
        'paper-rip-bottom': "url('/images/paper-rip-bottom.png')",
      },
      borderWidth: {
        '3': '3px',
      },
      animation: {
        'swing': 'swing 2s ease-in-out infinite',
        'stamp-fade-in': 'stampFadeIn 1s ease-out forwards',
      },
      keyframes: {
        swing: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
        stampFadeIn: {
          '0%': { opacity: 0, transform: 'rotate(15deg) scale(0.7)' },
          '100%': { opacity: 1, transform: 'rotate(15deg) scale(1)' },
        }
      },
    },
  },
  plugins: [],
}