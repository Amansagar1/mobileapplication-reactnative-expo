/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}", "./screens/**/*.{js,jsx}",
    "./pages/**/*.{js,jsx}", "./navigation/**/*.{js,jsx}"],
    
  
  presets: [require("nativewind/preset")],
  theme: {
    extend: {},
  },
  plugins: [],
};