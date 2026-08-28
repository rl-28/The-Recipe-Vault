# 🔒 The Recipe Vault // Cryogenic Culinary Archive

[![React](https://img.shields.io/badge/React-19.2-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-6.0-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Three.js](https://img.shields.io/badge/Three.js-R3F-000000?style=flat-square&logo=three.js&logoColor=white)](https://threejs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-13.1-0055FF?style=flat-square&logo=framer&logoColor=white)](https://www.framer.com/motion/)
[![Web Audio API](https://img.shields.io/badge/Audio-Web_Audio_API-F5D061?style=flat-square)](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)
[![Web Speech API](https://img.shields.io/badge/Voice-Web_Speech_API-10B981?style=flat-square)](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API)

> **Declassified culinary formulations, molecular gastronomy techniques, and high-precision kitchen protocols protected by an interactive 3D cryogenic vault.**

---

## 🌟 Key Highlights

- **Realistic 3D WebGL Vault Door**: Fully rendered 3D titanium blast door with rotating mechanical hand-wheel, radial locking bolts, glowing inner chamber, and camera dolly-in zoom transitions powered by `@react-three/fiber`, `@react-three/drei`, and `GSAP`.
- **Combination Cipher Keypad**: Interactive 3-digit culinary passcode pad with real-time tumbler click audio feedback and instant bypass access.
- **Hands-Free Active Chef Cooking HUD**: Fullscreen, high-contrast kitchen display with **Voice Speech Synthesis** that reads instructions aloud hands-free, giant countdown timers, celebration confetti, and keyboard shortcuts.
- **Sommelier Wine & Beverage Pairing Engine**: Curated vintage recommendations, spirit pairings, and tasting notes for every archived formulation.
- **Macronutrient & Molecular Breakdown**: Calorie, protein, carbohydrate, and fat profiles per serving.
- **Dynamic Metric ⇄ Imperial Conversion & Scaler**: Live unit conversion (g/ml ⇄ oz/lbs/fl oz) and adjustable yield multipliers (0.5x to 8x).
- **Interactive Ingredient Matrix**: Real-time prep check-off with visual progress completion meter and one-click shopping list export to clipboard.
- **Procedural Sound Engine**: Synthesized mechanical tumbler clicks, pneumatic hydraulic hiss, sub-bass opening rumble, and access chimes built entirely with native Web Audio API (zero external audio asset dependencies).

---

## 📋 Interactive Chef HUD & Keyboard Shortcuts

| Shortcut | Action | Scope |
| :--- | :--- | :--- |
| `Space` | Start / Pause Active Step Countdown Timer | Chef HUD |
| `→` or `N` | Advance to Next Culinary Phase | Chef HUD |
| `←` or `P` | Return to Previous Phase | Chef HUD |
| `V` | Read Current Step Aloud (Voice Guidance) | Chef HUD |
| `R` | Reset Active Phase Timer | Chef HUD |
| `Esc` | Exit Chef HUD / Close Recipe Drawer | Global |
| `/` or `Cmd+K` / `Ctrl+K` | Quick Focus Search Bar | Interior Dashboard |

---

## 🗂️ Project Structure

```
recipe-vault/
├── public/
├── src/
│   ├── assets/               # Static assets & icons
│   ├── components/
│   │   ├── dashboard/        # Interior Archive UI
│   │   │   ├── RecipeCard.tsx    # 3D interactive tilt cards with specular reflections
│   │   │   ├── RecipeGrid.tsx    # Responsive grid with filter state handlers
│   │   │   └── VaultHeader.tsx   # Search, filters, sort dropdown, and unit switcher
│   │   ├── landing/          # 3D Vault Entry View
│   │   │   └── HeroLanding.tsx   # Hero branding, cipher keypad, and sound controls
│   │   ├── modal/            # Drawers & Overlays
│   │   │   ├── ChefCookingMode.tsx # Fullscreen Hands-Free Cooking HUD (Voice & Timers)
│   │   │   ├── CreateRecipeModal.tsx # Encrypted Protocol Ingestion Form
│   │   │   ├── RecipeDrawer.tsx    # Detailed protocol dossier, scaler, and sommelier notes
│   │   │   └── StepTimer.tsx       # Circular countdown timer with confetti triggers
│   │   └── vault3d/          # 3D WebGL Components
│   │       ├── VaultDoorMesh.tsx # Titanium door, bolts, wheel, and glowing inner crystal
│   │       └── VaultScene.tsx    # Three.js scene, lighting, mouse parallax, and GSAP timeline
│   ├── context/
│   │   └── VaultContext.tsx  # Global state (recipes, bookmarks, units, sorting, chef HUD)
│   ├── data/
│   │   └── recipes.ts        # Michelin & Master culinary dataset with macros and pairings
│   ├── types/
│   │   └── recipe.ts         # Strict TypeScript definitions
│   ├── utils/
│   │   └── soundEngine.ts    # Web Audio API sound synthesis and Web Speech API engine
│   ├── App.tsx               # Main application container & view mode orchestrator
│   ├── index.css             # Glassmorphic tokens, tailwind layers, and custom styling
│   └── main.tsx              # React DOM entry point
├── package.json
├── postcss.config.js
├── tailwind.config.js
├── tsconfig.json
└── vite.config.ts
```

---

## 🛠️ Technology Stack

| Category | Technology | Description |
| :--- | :--- | :--- |
| **Framework** | [React 19](https://react.dev/) | Modern component architecture with concurrency |
| **Language** | [TypeScript 6](https://www.typescriptlang.org/) | Strict type checking with `verbatimModuleSyntax` |
| **3D Graphics** | [Three.js](https://threejs.org/) + [@react-three/fiber](https://r3f.docs.pmnd.rs/) | Declarative WebGL rendering and custom shaders |
| **3D Helpers** | [@react-three/drei](https://github.com/pmndrs/drei) | Environment lighting, sparkles, and floating meshes |
| **Animation** | [GSAP 3](https://greensock.com/) + [Framer Motion 13](https://www.framer.com/motion/) | Cinematic camera dollies and UI spring transitions |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) + PostCSS | Dark-mode glassmorphism and specular gradient cards |
| **Audio** | [Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API) | Procedural oscillators and biquad filters |
| **Voice** | [Web Speech API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API) | Natural voice speech synthesis for hands-free cooking |
| **Icons** | [Lucide React](https://lucide.dev/) | Clean, consistent SVG icon set |
| **Celebration** | [canvas-confetti](https://www.npmjs.com/package/canvas-confetti) | Dynamic particle explosion upon timer / protocol completion |
| **Bundler** | [Vite 8](https://vite.dev/) | Ultra-fast HMR and optimized production build |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js**: v18.0.0 or higher
- **npm** or **yarn** / **pnpm**

### Installation

1. Clone or navigate to the project directory:
   ```bash
   cd recipe-vault
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the local development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to:
   ```
   http://localhost:5173/
   ```

---

## 📦 Production Build & Quality Checks

- **Run TypeScript Compiler & Production Build**:
  ```bash
  npm run build
  ```

- **Preview the Production Build Locally**:
  ```bash
  npm run preview
  ```

- **Lint Codebase**:
  ```bash
  npm run lint
  ```

---

## 🛡️ Culinary Archive Protocols Included

1. **VLT-702-WAGYU**: 72-Hour Sous-Vide Wagyu Short Rib (Kyoto / San Sebastián)
2. **VLT-108-CRUST**: 100% Hydration Dark Sourdough Boule (Copenhagen Fermentary)
3. **VLT-944-GOLD**: 24K Gold Smoked Dark Chocolate Sphere (Paris / Zurich)
4. **VLT-330-SMOKE**: Smoked Rosemary & Cacao Old Fashioned (New Orleans)
5. **VLT-512-CAVIAR**: Truffle & Dashi Spherical Caviar (San Sebastián)
6. **VLT-601-CURED**: Citrus & Koji-Cured Wild Hamachi (Hokkaido)
7. **VLT-880-RAMEN**: 48-Hour Tonkotsu & Black Garlic Mayu Ramen (Fukuoka)
8. **VLT-224-MATCHA**: Matcha Mille-Crêpe with Yuzu Gelée (Kyoto Imperial Guild)

---

## 📄 License

This project is open-source and available under the **MIT License**.
