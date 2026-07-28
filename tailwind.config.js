/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: "#1F3864",
          light: "#2E4A82",
        },
        brand: {
          DEFAULT: "#16A34A",
          light: "#22C55E",
        },
      },
    },
  },
  plugins: [],
};
