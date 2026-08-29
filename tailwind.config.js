/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        vault: {
          50: '#FCFAF7',
          100: '#F7F3EB',
          200: '#EFE8DA',
          300: '#E3D7C1',
          400: '#D2BE9E',
          500: '#BFA47E',
          600: '#A48660',
          700: '#846949',
          800: '#5F4B35',
          900: '#3D2F22',
          950: '#261D15',
          steel: '#64748B',
          stone: '#57534E',
          gold: {
            100: '#FEF3C7',
            200: '#FDE68A',
            300: '#FCD34D',
            400: '#FBBF24',
            500: '#F59E0B',
            600: '#D97706',
            700: '#B45309',
          },
          amber: '#F59E0B',
          orange: '#FB923C',
          cyan: '#0284C7',
          emerald: '#10B981',
          green: '#059669',
          ruby: '#EF4444',
          berry: '#8B5CF6'
        }
      },
      fontFamily: {
        sans: ['"Outfit"', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['"Cinzel"', '"Outfit"', 'serif'],
        mono: ['"Space Mono"', '"JetBrains Mono"', 'monospace'],
      },
      backgroundImage: {
        'warm-linen': 'linear-gradient(180deg, #FCFAF7 0%, #F8F5EE 100%)',
        'honey-gradient': 'linear-gradient(135deg, #F59E0B 0%, #FB923C 100%)',
        'soft-glow': 'radial-gradient(circle at center, rgba(251, 146, 60, 0.08) 0%, transparent 70%)',
      },
      boxShadow: {
        'warm-sm': '0 2px 8px -2px rgba(120, 53, 15, 0.05)',
        'warm-md': '0 10px 25px -5px rgba(120, 53, 15, 0.07), 0 8px 10px -6px rgba(120, 53, 15, 0.04)',
        'warm-lg': '0 20px 35px -10px rgba(120, 53, 15, 0.09), 0 10px 15px -5px rgba(120, 53, 15, 0.05)',
        'honey-glow': '0 0 25px rgba(245, 158, 11, 0.25)',
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 25s linear infinite',
      }
    },
  },
  plugins: [],
}
