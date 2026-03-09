/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#4F46E5",
        "primary-light": "#E0E7FF",
        background: "#F9FAFB",
        card: "#FFFFFF",
      },
    },
  },
  plugins: [],
}