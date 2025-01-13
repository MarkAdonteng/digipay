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
        // ... rest of your theme configuration
      },
    },
  },
  plugins: [],
} 