/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#FAF9F6',
        slate: {
          900: '#1A2A3A',
          800: '#2A3A4A',
          700: '#3A4A5A',
        },
        teal: {
          500: '#00D2A0',
          600: '#00B086',
        },
        steel: {
          500: '#788A94',
        }
      },
      fontFamily: {
        syne: ['var(--font-syne)', 'sans-serif'],
        hanken: ['var(--font-hanken)', 'sans-serif'],
      },
      animation: {
        'reveal-up': 'revealUp 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
        'fade-in': 'fadeIn 1s ease-out',
      },
      keyframes: {
        revealUp: {
          '0%': { transform: 'translateY(30px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}