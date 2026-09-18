/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ivory: "#F7F4EC",
        ink: "#2A2420",
        indigo: {
          DEFAULT: "#2B3A67",
          dark: "#1E2A4D",
        },
        brass: "#A8791F",
        maroon: "#8C3B3B",
      },
      fontFamily: {
        display: ["'Fraunces'", "serif"],
        body: ["'Work Sans'", "sans-serif"],
      },
    },
  },
  plugins: [],
};
