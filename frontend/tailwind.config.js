/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // This ensures Tailwind scans your src folder for any file extensions you use
    "./public/index.html", // Make sure the public folder is included if needed
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
