import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        yellow: {
          500: "#FFB300",
        },
        teal: {
          50: "#F2FAFA",
          400: "#00A296",
          600: "#027A7A",
        },
        green: {
          500: "#02A117",
        },
        neutral: {
          50: "#F5F6F9",
          100: "#EEF0F5",
          200: "#CDD1D9",
          400: "#A8ADB7",
          500: "#6D6F73",
          700: "#393A3C",
          900: "#202326",
        },
        purple: {
          200: "#EECFFC",
          500: "#7B1FA2",
          700: "#580F78",
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
