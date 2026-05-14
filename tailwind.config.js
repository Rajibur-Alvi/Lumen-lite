/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        lumen: {
          bg: "#020617",
          surface: "#0f172a",
          cyan: "#22d3ee",
          blue: "#3b82f6",
        },
      },
    },
  },
  plugins: [],
};
