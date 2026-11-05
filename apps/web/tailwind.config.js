/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0B0C10",
        obsidian: {
          base: "#0B0C10",
          deep: "#151821",
          raised: "#1E2330",
          card: "#252B3B",
        },
        surface: "#151821",
        "surface-deep": "#151821",
        "surface-elevated": "#1E2330",
        "surface-card": "#252B3B",
        border: "#2A3245",
        "border-dark": "#000000",
        arcade: {
          gold: "#FFB703",
          orange: "#FB8500",
          mint: "#06D6A0",
          coral: "#EF476F",
          cyan: "#00F0FF",
          purple: "#8338EC",
        },
        brand: {
          50: "#F5F3FF",
          100: "#EDE9FE",
          200: "#DDD6FE",
          300: "#C4B5FD",
          400: "#A78BFA",
          500: "#8B5CF6",
          600: "#7C3AED",
          700: "#6D28D9",
          800: "#5B21B6",
          900: "#4C1D95",
        },
        coral: {
          light: "#FF85A1",
          DEFAULT: "#EF476F",
          dark: "#D62246",
        },
        cyan: {
          light: "#70F8FF",
          DEFAULT: "#00F0FF",
          dark: "#06B6D4",
        },
        yellow: {
          light: "#FFE066",
          DEFAULT: "#FFB703",
          dark: "#FB8500",
        },
        mint: {
          light: "#6EE7B7",
          DEFAULT: "#06D6A0",
          dark: "#059669",
        },
      },
      fontFamily: {
        sans: [
          "'Plus Jakarta Sans'",
          "'Inter'",
          "-apple-system",
          "BlinkMacSystemFont",
          "sans-serif",
        ],
        display: [
          "'Space Grotesk'",
          "'Plus Jakarta Sans'",
          "sans-serif",
        ],
        arcade: [
          "'Bungee'",
          "'Space Grotesk'",
          "sans-serif",
        ],
        mono: [
          "'Space Mono'",
          "'JetBrains Mono'",
          "monospace",
        ],
      },
      boxShadow: {
        arcade: "4px 4px 0px #000000",
        "arcade-sm": "2px 2px 0px #000000",
        "arcade-lg": "6px 6px 0px #000000",
        "arcade-xl": "8px 8px 0px #000000",
        "arcade-gold": "4px 4px 0px #FFB703",
        "arcade-mint": "4px 4px 0px #06D6A0",
        "arcade-coral": "4px 4px 0px #EF476F",
        "arcade-cyan": "4px 4px 0px #00F0FF",
        glow: "4px 4px 0px #000000",
        "glow-lg": "6px 6px 0px #000000",
        "glow-coral": "4px 4px 0px #000000",
        "glow-cyan": "4px 4px 0px #000000",
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        float: "float 3s ease-in-out infinite",
        "arcade-blink": "arcadeBlink 1s steps(2, start) infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-6px)" },
        },
        arcadeBlink: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0" },
        },
      },
    },
  },
  plugins: [],
};
