import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Gen.G Brand Colors
        gold: {
          DEFAULT: "#D4AF37",
          light: "#F5E6A3",
          dark: "#B8960C",
          50: "#FDF9E7",
          100: "#F9F0C3",
          200: "#F5E6A3",
          300: "#E8D06A",
          400: "#D4AF37",
          500: "#B8960C",
          600: "#9A7B0A",
          700: "#7C6208",
          800: "#5E4A06",
          900: "#403204",
        },
        black: {
          DEFAULT: "#0D0D0D",
          light: "#1A1A1A",
          charcoal: "#2D2D2D",
          50: "#4A4A4A",
          100: "#3D3D3D",
          200: "#2D2D2D",
          300: "#1A1A1A",
          400: "#0D0D0D",
          500: "#000000",
        },
      },
      fontFamily: {
        heading: ["var(--font-heading)", "Oswald", "sans-serif"],
        body: ["var(--font-inter)", "Inter", "sans-serif"],
      },
      backgroundImage: {
        "gradient-gold": "linear-gradient(135deg, #D4AF37 0%, #F5E6A3 50%, #D4AF37 100%)",
        "gradient-dark": "linear-gradient(180deg, #0D0D0D 0%, #1A1A1A 100%)",
        "gradient-radial-gold": "radial-gradient(circle, #D4AF37 0%, transparent 70%)",
      },
      boxShadow: {
        "gold-glow": "0 0 20px rgba(212, 175, 55, 0.5)",
        "gold-glow-lg": "0 0 40px rgba(212, 175, 55, 0.6)",
      },
      animation: {
        "pulse-gold": "pulse-gold 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "shimmer": "shimmer 2s linear infinite",
        "float": "float 3s ease-in-out infinite",
      },
      keyframes: {
        "pulse-gold": {
          "0%, 100%": { boxShadow: "0 0 20px rgba(212, 175, 55, 0.5)" },
          "50%": { boxShadow: "0 0 40px rgba(212, 175, 55, 0.8)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;


