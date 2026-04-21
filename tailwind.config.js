/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#FF7A3D',
        'primary-dark': '#F56319',
        secondary: '#2D2D2D',
        'secondary-light': '#666666',
        accent: '#00C651',
        danger: '#E53935',
        dark: '#1F1F1F',
        light: '#F5F5F5',
      },
      spacing: {
        '128': '32rem',
      },
    },
  },
  plugins: [],
}
