import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        cream: "#fbf4e8",
        porcelain: "#fffaf1",
        cocoa: "#563f42",
        mocha: "#72575a",
        copper: "#b47c58",
        sage: "#7f8a76"
      },
      boxShadow: {
        phone: "0 28px 80px rgba(56, 43, 44, 0.32)"
      },
      fontFamily: {
        script: ["var(--font-script)", "Snell Roundhand", "Brush Script MT", "cursive"],
        display: ["var(--font-display)", "Cormorant Garamond", "Georgia", "serif"],
        body: ["var(--font-body)", "Montserrat", "ui-sans-serif", "system-ui", "sans-serif"]
      }
    }
  },
  plugins: []
};

export default config;
