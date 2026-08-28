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
          950: '#040507',
          900: '#080A0F',
          850: '#0E1118',
          800: '#141822',
          700: '#1F2433',
          600: '#2E354B',
          500: '#475370',
          steel: '#8E9BAE',
          titanium: '#C2CAD6',
          gold: {
            300: '#FDE68A',
            400: '#F5D061',
            500: '#D4AF37',
            600: '#B89225',
            700: '#947217',
          },
          amber: '#F59E0B',
          cyan: '#38BDF8',
          emerald: '#10B981',
          ruby: '#EF4444'
        }
      },
      fontFamily: {
        sans: ['"Outfit"', 'system-ui', 'sans-serif'],
        display: ['"Cinzel"', 'serif'],
        mono: ['"Space Mono"', '"JetBrains Mono"', 'monospace'],
      },
      backgroundImage: {
        'metallic-gradient': 'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.01) 100%)',
        'gold-shimmer': 'linear-gradient(90deg, #D4AF37 0%, #FFF5D0 50%, #D4AF37 100%)',
        'radial-vignette': 'radial-gradient(circle at center, transparent 40%, rgba(4,5,7,0.9) 100%)',
      },
      boxShadow: {
        'vault-glow': '0 0 40px -10px rgba(212, 175, 55, 0.25)',
        'vault-card': '0 20px 40px -15px rgba(0, 0, 0, 0.7), inset 0 1px 1px 0 rgba(255, 255, 255, 0.1)',
        'vault-inner': 'inset 0 2px 6px rgba(0, 0, 0, 0.8)',
        'neon-gold': '0 0 20px rgba(212, 175, 55, 0.4), 0 0 40px rgba(212, 175, 55, 0.2)',
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 20s linear infinite',
      }
    },
  },
  plugins: [],
}
