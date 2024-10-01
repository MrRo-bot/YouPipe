/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        kode: ["kode mono", "monospace"],
        sometype: ["sometype mono", "monospace"],
      },
    },
  },
  plugins: [],
};
