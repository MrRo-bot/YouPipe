/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        text: ["Chivo", "monospace"],
      },
      boxShadow: {
        // cardShadow: "5px 5px 10px #bebebe, -5px -5px 10px #ffffff",
        cardShadow:
          "2.5px 2.5px 5px hsla(239, 78%, 16%, 0.55), -2.5px -2.5px 5px hsla(239, 78%, 16%, 0.55)",
      },
    },
  },
  plugins: [],
};
