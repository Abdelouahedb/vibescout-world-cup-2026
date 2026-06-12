import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: [
          "Barlow Condensed",
          "Aptos Narrow",
          "Bahnschrift Condensed",
          "system-ui",
          "sans-serif",
        ],
        sans: ["Manrope", "system-ui", "Segoe UI", "sans-serif"],
        editorial: ["Libre Baskerville", "Georgia", "serif"],
      },
    },
  },
  plugins: [],
};

export default config;
