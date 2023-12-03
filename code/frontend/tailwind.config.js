/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sanfran: ['SANFRAN', 'sans-serif'],
      },
      colors: {
        'dijo-blue': '#5C6CEA',
        'dijo-orange': '#EFB73A',
        'dijo-dark-grey': '#707070',
        'dijo-light-grey': '#A3A3A3',
        'dijo-xlight-grey': '#F4F4F4'
      }
    },
  },
  plugins: [require("daisyui")],
}
