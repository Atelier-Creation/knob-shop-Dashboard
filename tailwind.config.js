// tailwind.config.js
import scrollbar from 'tailwind-scrollbar';
import scrollbarHide from 'tailwind-scrollbar-hide';
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#f97316", 
        lightGray: "#f9fafb",
        darkGray: "#1f2937",
      },
    },
  },
  plugins: [
    scrollbar,
    scrollbarHide,
  ],
};
