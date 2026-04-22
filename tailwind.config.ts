import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        umber: { 700: "#4A2F1A", 800: "#3A2218", 900: "#2A1810", 950: "#1A0E08" },
        gold: { 400: "#E8C982", 500: "#C9A961", 600: "#9B7D3E" },
        ember: { 500: "#D66A3A", 600: "#8B2D1A" },
        cream: { 100: "#E8D5B0", 200: "#F4E4B8" },
        muted: { 400: "#A89274", 600: "#5B3A24" },
        indigo: { 500: "#1A4A6B" },
      },
      fontFamily: {
        serif: ["var(--font-serif)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        "lift-sm":
          "0 1px 2px rgba(0,0,0,0.4), 0 0 0 0.5px rgba(201,169,97,0.1)",
        "lift-md":
          "0 4px 12px rgba(0,0,0,0.5), 0 0 0 0.5px rgba(201,169,97,0.15)",
        "lift-lg":
          "0 12px 32px rgba(0,0,0,0.6), 0 0 0 0.5px rgba(201,169,97,0.2)",
        "inset-sm":
          "inset 0 1px 2px rgba(0,0,0,0.6), inset 0 -0.5px 0 rgba(201,169,97,0.1)",
        "inset-md": "inset 0 2px 6px rgba(0,0,0,0.7)",
        "ember-glow":
          "0 0 24px rgba(214,106,58,0.35), 0 0 0 1px #C9A961",
        "gold-rim": "0 0 0 1px #C9A961, 0 0 0 2px rgba(201,169,97,0.2)",
      },
      transitionTimingFunction: {
        heritage: "cubic-bezier(0.33, 0.08, 0.17, 1)",
      },
      transitionDuration: {
        600: "600ms",
        900: "900ms",
      },
    },
  },
  plugins: [],
};

export default config;
