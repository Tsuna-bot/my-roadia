/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Montserrat', 'system-ui', '-apple-system', 'sans-serif'],
      },
      colors: {
        neutral: {
          0: '#000000',
          10: '#1A1A1A',
          20: '#333333',
          30: '#4D4D4D',
          40: '#666666',
          50: '#808080',
          60: '#999999',
          70: '#B3B3B3',
          80: '#CCCCCC',
          85: '#D9D9D9',
          90: '#E6E6E6',
          95: '#F2F2F2',
          98: '#FAFAFA',
          100: '#FFFFFF',
        },
        accent: {
          DEFAULT: '#002f6b',
          light: '#003d8a',
          dark: '#002152',
        },
        success: '#10B981',
        warning: '#F59E0B',
        error: '#EF4444',
      },
      // Using standard Tailwind spacing (1 = 0.25rem = 4px)
      // No custom spacing needed - using standard scale
      borderRadius: {
        'xs': '4px',
        'sm': '8px',
        'md': '12px',
        'lg': '16px',
        'xl': '20px',
        '2xl': '24px',
        'full': '1000px',
      },
      fontSize: {
        'xs': ['12px', { lineHeight: '16px' }],
        'sm': ['14px', { lineHeight: '20px' }],
        'base': ['16px', { lineHeight: '24px' }],
        'lg': ['18px', { lineHeight: '28px' }],
        'xl': ['20px', { lineHeight: '28px' }],
        '2xl': ['24px', { lineHeight: '32px' }],
        '3xl': ['30px', { lineHeight: '36px' }],
        '4xl': ['36px', { lineHeight: '40px' }],
      },
      transitionDuration: {
        'fast': '150ms',
        'base': '250ms',
        'slow': '400ms',
      },
    },
  },
  plugins: [],
}
