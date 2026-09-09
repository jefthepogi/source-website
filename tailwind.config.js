// tailwind.config.js
export default {
  content: [
    './src/**/*.{js,jsx,ts,tsx}', // Ensure this path is correct
  ],
  theme: {
    extend: {},
  },
  plugins: [require('daisyui')],
  daisyui: {
    themes: ["light"], // Use the light theme
  },
};
