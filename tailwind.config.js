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
          // Matched to Financial Express's masthead blue by eye (they don't
          // publish an official hex). Replaces the near-black navy used
          // through the earlier WSJ-style pass — same class name so every
          // existing text-navy/bg-navy usage across the site picks it up
          // automatically.
          DEFAULT: "#1457A4",
          light: "#3D7EC9",
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
