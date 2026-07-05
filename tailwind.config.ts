import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#2B3AFF",
          light: "#5C6BFF",
          dark: "#1B24B8",
        },
        accent: {
          DEFAULT: "#FF6B4A",
          light: "#FF8F73",
        },
        yellow: "#FFD23F",
        mint: "#00C2A8",
        surface: {
          DEFAULT: "#F4F5FF", // page background
          raised: "#FFFFFF", // card background
          sunken: "#E8E9FF",
        },
        ink: {
          DEFAULT: "#14183D",
          muted: "#5D628C",
          faint: "#9BA0C7",
        },
        state: {
          opened: "#FF6B4A", // = accent.DEFAULT
          delivered: "#2B3AFF", // = primary.DEFAULT
          paid: "#00C2A8", // = mint
        },
      },
      borderRadius: {
        card: "22px",
        pill: "999px",
      },
      boxShadow: {
        // hard offset "sticker" shadow — 0 blur, solid color, full opacity
        sticker: "6px 6px 0 0 #14183D",
        "sticker-lg": "8px 8px 0 0 #14183D",
      },
      fontFamily: {
        display: ["var(--font-space-grotesk)", "sans-serif"],
        body: ["var(--font-inter)", "sans-serif"],
        mono: ["var(--font-plex-mono)", "monospace"],
        closing: ["var(--font-fraunces)", "serif"],
      },
    },
  },
  plugins: [],
};

export default config;
