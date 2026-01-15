/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#22696c',
          dark: '#1c5659',
          light: '#22696c',
        },
        dark: {
          DEFAULT: '#222121',
          lighter: '#2A2A2A',
          card: '#2F2F2F',
        },
      },
    },
  },
  plugins: [],
}
