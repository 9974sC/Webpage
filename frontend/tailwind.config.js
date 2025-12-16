/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "#F2F6D0",
        foreground: "#080708",
        primary: {
          DEFAULT: "#473BF0",
          foreground: "#FFFFFF",
        },
        secondary: {
          DEFAULT: "#A0DDFF",
          foreground: "#080708",
        },
        muted: {
          DEFAULT: "#E8ECBE",
          foreground: "#5A5958",
        },
        accent: {
          DEFAULT: "#A0DDFF",
          foreground: "#080708",
        },
        destructive: {
          DEFAULT: "#DC2626",
          foreground: "#FFFFFF",
        },
        border: "#D4D8AA",
        input: "#FFFFFF",
        ring: "#473BF0",
        card: {
          DEFAULT: "#FFFFFF",
          foreground: "#080708",
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

