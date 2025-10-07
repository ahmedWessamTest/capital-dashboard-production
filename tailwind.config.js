/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      colors: {
        main: {
          100: "#E5F4FB",  // very light tint
          200: "#CBE9F7",
          300: "#B0DCF3",
          400: "#84C8EB",
          500: "#37A6DE",  // base color
          600: "#2C85B2",
          700: "#216386",
          800: "#16425A",
          900: "#0B212E",  // very dark shade
        },
        
      },
    },
  },
  plugins: [require("tailwindcss-primeui")],
};
