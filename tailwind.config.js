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
      keyframes: {
        truck: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(50px)" }, // 🚚 move distance
        },
      },
      animation: {
        truck: "truck 2s ease-in-out infinite", // 🔑 now Tailwind knows animate-truck
      },
    },
  },
  plugins: [scrollbar, scrollbarHide],
};
