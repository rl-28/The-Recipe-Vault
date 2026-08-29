/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        parchment: '#FAF7F0',
        card: '#FFFDF8',
        cheddar: '#FFE68C',
        'soft-pink': '#FFAAA6',
        'sky-doodle': '#BBE1FA',
        'mint-doodle': '#D4F1F4',
        'lavender-doodle': '#E8D7F1',
        vault: {
          50: '#FAF7F0',
          100: '#FFFDF8',
          cheddar: '#FFE68C',
          pink: '#FFAAA6',
          sky: '#BBE1FA',
          mint: '#D4F1F4',
          lavender: '#E8D7F1',
        }
      },
      fontFamily: {
        sans: ['"Shantell Sans"', '"Patrick Hand"', 'system-ui', 'sans-serif'],
        hand: ['"Patrick Hand"', '"Shantell Sans"', 'cursive'],
        doodle: ['"Gaegu"', 'cursive'],
        mono: ['"Space Mono"', '"JetBrains Mono"', 'monospace'],
      },
      boxShadow: {
        'doodle-sm': '2px 2px 0px 0px #000',
        'doodle': '4px 4px 0px 0px #000',
        'doodle-lg': '6px 6px 0px 0px #000',
        'doodle-hover': '5px 5px 0px 0px #000',
      },
      borderRadius: {
        'doodle': '24px',
        'doodle-lg': '32px',
      }
    },
  },
  plugins: [],
}
