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
          DEFAULT: "#0B1220",
          light: "#16233F",
        },
        brand: {
          // DEFAULT is deliberately a darker antique gold, not a bright
          // showroom gold. text-brand is used for body links, badges, and
          // buttons on white backgrounds throughout the site — a lighter
          // gold like #B8902E only hits ~3:1 contrast against white, which
          // fails WCAG AA and reads as washed-out/hard to read. #8C6D1D
          // hits ~4.9:1, so it stays legible while still looking gold.
          DEFAULT: "#8C6D1D",
          // light is the brighter showroom gold, reserved for use on dark
          // navy backgrounds (nav highlights, ticker) where it has ~9:1
          // contrast and can afford to be more vivid.
          light: "#D4AF52",
        },
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
      animation: {
        marquee: "marquee 40s linear infinite",
      },
    },
  },
  plugins: [],
};
