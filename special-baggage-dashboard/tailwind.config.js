/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'alert-red': '#B8392C',
        'alert-yellow': '#F5A623',
        'success-green': '#28A745',
        'dark-blue-light': '#1a2331',
        'dark-blue': '#101823',
        'card-bg': '#F7F7F7',
      },
    },
  },
  plugins: [],
} 