/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1D9BF0',
          hover: '#1a8cd8',
        },
        secondary: {
          DEFAULT: '#FFD600',
        },
        accent: {
          DEFAULT: '#FF0000',
          pink: '#FF69B4',
        },
        neutral: {
          DEFAULT: '#000000',
          hover: '#1a1a1a',
          text: {
            primary: '#000000',
            secondary: '#666666',
          },
          border: '#E5E5E5',
          input: '#F9FAFB',
        },
      },
      fontSize: {
        'heading-1': ['2rem', {
          lineHeight: '2.5rem',
          fontWeight: '600',
        }],
        'heading-2': ['1.5rem', {
          lineHeight: '2rem',
          fontWeight: '600',
        }],
        'heading-3': ['1.25rem', {
          lineHeight: '1.75rem',
          fontWeight: '500',
        }],
        'body': ['0.875rem', {
          lineHeight: '1.25rem',
          fontWeight: '400',
        }],
        'small': ['0.75rem', {
          lineHeight: '1rem',
          fontWeight: '400',
        }],
      },
      fontWeight: {
        normal: '400',
        medium: '500',
        semibold: '600',
        bold: '700',
      },
      borderRadius: {
        'button': '9999px',
        'input': '0.5rem',
        'modal': '0.75rem',
      },
      spacing: {
        'modal-padding': '2rem',
        'section-gap': '1.25rem',
        'input-padding': '0.75rem',
      },
      transitionProperty: {
        'transform': 'transform',
      },
      transformStyle: {
        'preserve-3d': 'preserve-3d',
      },
      backfaceVisibility: {
        'hidden': 'hidden',
      },
      rotate: {
        'y-180': 'rotateY(180deg)',
      },
      perspective: {
        '1000': '1000px',
      },
    },
  },
  plugins: [],
}