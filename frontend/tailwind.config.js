/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "#F5E8C4",
        foreground: "#5B4937",
        primary: {
          DEFAULT: "#84C95F",
          foreground: "#FFFFFF",
        },
        secondary: {
          DEFAULT: "#D89C8A",
          foreground: "#5B4937",
        },
        muted: {
          DEFAULT: "#E3D26F",
          foreground: "#6A3952",
        },
        accent: {
          DEFAULT: "#6A3952",
          foreground: "#FFFFFF",
        },
        destructive: {
          DEFAULT: "#DC2626",
          foreground: "#FFFFFF",
        },
        border: "#D89C8A",
        input: "#FFFFFF",
        ring: "#84C95F",
        card: {
          DEFAULT: "#FFFFFF",
          foreground: "#5B4937",
        },
      },
      borderRadius: {
        lg: "0.625rem",
        md: "calc(0.625rem - 2px)",
        sm: "calc(0.625rem - 4px)",
      },
      fontSize: {
        base: "18px",
      },
      lineHeight: {
        base: "1.6",
      },
    },
  },
  plugins: [],
}

