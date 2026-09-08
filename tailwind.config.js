/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#f7f7f5",
        panel: "#ffffff",
        border: "#e2e0da",
        ink: "#26241f",
        muted: "#75716a",
        accent: {
          DEFAULT: "#2f5c4c",
          hover: "#244a3d",
          soft: "#eef2ee",
          softBorder: "#d7e3d9",
        },
        danger: {
          DEFAULT: "#a8422f",
          hover: "#8c3626",
        },
        warn: {
          bg: "#fbf6ec",
          border: "#edd9a8",
          text: "#6b5215",
        },
      },
      borderRadius: {
        DEFAULT: "8px",
      },
      fontFamily: {
        sans: [
          "-apple-system",
          "Segoe UI",
          "Helvetica",
          "Arial",
          "sans-serif",
        ],
      },
    },
  },
  plugins: [],
};
