import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Cyberpunk "Neon Tokyo" palette
        background: "#0a0a0f",
        surface: {
          DEFAULT: "#0f0f1a",
          light: "#1a1a2e",
          lighter: "#252540",
        },
        primary: {
          DEFAULT: "#00f0ff",
          dark: "#00b8c4",
          light: "#5ff5ff",
          glow: "rgba(0, 240, 255, 0.5)",
        },
        accent: {
          DEFAULT: "#f000ff",
          dark: "#b800c4",
          light: "#ff5fff",
          glow: "rgba(240, 0, 255, 0.5)",
        },
        secondary: {
          DEFAULT: "#7000ff",
          dark: "#5000c4",
          light: "#a05fff",
        },
        success: "#00ff9f",
        warning: "#ff9f00",
        danger: "#ff0055",
        text: {
          DEFAULT: "#f0f0ff",
          muted: "#b0b0d0",
          dark: "#8080a0",
        },
        neon: {
          cyan: "#00f0ff",
          magenta: "#f000ff",
          purple: "#7000ff",
          green: "#00ff9f",
          orange: "#ff9f00",
          red: "#ff0055",
        },
      },
      fontFamily: {
        heading: ["var(--font-orbitron)", "sans-serif"],
        body: ["var(--font-rajdhani)", "sans-serif"],
        mono: ["var(--font-jetbrains)", "monospace"],
      },
      boxShadow: {
        "neon-cyan": "0 0 5px #00f0ff, 0 0 20px rgba(0, 240, 255, 0.5), 0 0 40px rgba(0, 240, 255, 0.3)",
        "neon-magenta": "0 0 5px #f000ff, 0 0 20px rgba(240, 0, 255, 0.5), 0 0 40px rgba(240, 0, 255, 0.3)",
        "neon-purple": "0 0 5px #7000ff, 0 0 20px rgba(112, 0, 255, 0.5), 0 0 40px rgba(112, 0, 255, 0.3)",
        "glow-sm": "0 0 10px currentColor",
        "glow-md": "0 0 20px currentColor",
        "glow-lg": "0 0 40px currentColor",
      },
      animation: {
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "float": "float 6s ease-in-out infinite",
        "glitch": "glitch 1s linear infinite",
        "scan": "scan 8s linear infinite",
        "flicker": "flicker 0.15s infinite",
        "gradient": "gradient 8s linear infinite",
        "typing": "typing 3.5s steps(40, end)",
        "blink": "blink 0.75s step-end infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-20px)" },
        },
        glitch: {
          "0%": { transform: "translate(0)" },
          "20%": { transform: "translate(-2px, 2px)" },
          "40%": { transform: "translate(-2px, -2px)" },
          "60%": { transform: "translate(2px, 2px)" },
          "80%": { transform: "translate(2px, -2px)" },
          "100%": { transform: "translate(0)" },
        },
        scan: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100%)" },
        },
        flicker: {
          "0%, 19.999%, 22%, 62.999%, 64%, 64.999%, 70%, 100%": { opacity: "0.99" },
          "20%, 21.999%, 63%, 63.999%, 65%, 69.999%": { opacity: "0.4" },
        },
        gradient: {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
        typing: {
          "from": { width: "0" },
          "to": { width: "100%" },
        },
        blink: {
          "from, to": { borderColor: "transparent" },
          "50%": { borderColor: "#00f0ff" },
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "cyber-grid": `
          linear-gradient(rgba(0, 240, 255, 0.03) 1px, transparent 1px),
          linear-gradient(90deg, rgba(0, 240, 255, 0.03) 1px, transparent 1px)
        `,
      },
      backgroundSize: {
        "grid": "50px 50px",
      },
    },
  },
  plugins: [],
};

export default config;
