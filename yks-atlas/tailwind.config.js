/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'dark': {
          'bg': '#0F0D16',
          'bg-secondary': '#13111B',
          'card': '#1B1828',
          'border': '#2E2740',
        },
        'primary': {
          '50': '#F3EDFF',
          '100': '#E8D5FF',
          '200': '#D6AEFF',
          '300': '#C485FF',
          '400': '#B36AFF',
          '500': '#A593D6',
          '600': '#8F6BA8',
          '700': '#6B4D80',
          '800': '#4D3C70',
          '900': '#2E2247',
        },
        'accent': {
          'green': '#1FD9B6',
          'orange': '#FF9800',
          'red': '#E5836A',
          'blue': '#5ECBAD',
          'yellow': '#DFB244',
        },
        'text': {
          'primary': '#EFEBE3',
          'secondary': '#B6B0BF',
          'muted': '#76707F',
        },
      },
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif'],
        'display': ['"Source Serif 4"', 'Georgia', 'serif'],
      },
      fontSize: {
        'xs': ['0.75rem', '1rem'],
        'sm': ['0.875rem', '1.25rem'],
        'base': ['1rem', '1.5rem'],
        'lg': ['1.125rem', '1.75rem'],
        'xl': ['1.25rem', '1.75rem'],
        '2xl': ['1.5rem', '2rem'],
        '3xl': ['1.875rem', '2.25rem'],
        '4xl': ['2.25rem', '2.5rem'],
      },
      spacing: {
        '1': '0.25rem',
        '2': '0.5rem',
        '3': '0.75rem',
        '4': '1rem',
        '6': '1.5rem',
        '8': '2rem',
        '10': '2.5rem',
        '12': '3rem',
        '16': '4rem',
        '20': '5rem',
        '24': '6rem',
      },
      borderRadius: {
        'none': '0',
        'sm': '0.375rem',
        'md': '0.5rem',
        'lg': '0.75rem',
        'xl': '1rem',
      },
      backdropBlur: {
        'xs': '2px',
        'sm': '4px',
        'md': '12px',
      },
      boxShadow: {
        'sm': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'md': '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        'lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
        'xl': '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
        'neon': '0 0 20px rgba(165, 147, 214, 0.3)',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
}
