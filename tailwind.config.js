/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#005acd",
        primaryLight: "#0093cb",
        primarySoft: "#bef0ff",
        whiteSoft: "#f5ffff",
      },
    },
  },
  plugins: [],
};
