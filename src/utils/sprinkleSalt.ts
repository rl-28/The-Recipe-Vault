import confetti from 'canvas-confetti';
import { soundEngine } from './soundEngine';

export type SprinkleMode = 'subtle' | 'burst' | 'celebration' | 'rapid';

export interface SprinkleOptions {
  origin?: { x: number; y: number };
  colors?: string[];
  particleCount?: number;
  spread?: number;
  angle?: number;
  playSound?: boolean;
}

export const COZY_CONFETTI_PALETTE = [
  '#FFFFFF', // Pure Salt Crystal
  '#EA7186', // Strawberry Pink
  '#F2C76E', // Pastel Cheddar Gold
  '#7A77B9', // Soft Royal Lavender
  '#BD9DEA', // Lilac Berry
  '#FFF3B0', // Creamy Butter
];

// Helper to create star shape safely
let starShape: confetti.Shape | undefined;
try {
  if (typeof confetti.shapeFromPath === 'function') {
    starShape = confetti.shapeFromPath({
      path: 'M 0 -10 L 3 -3 L 10 -3 L 5 2 L 7 9 L 0 5 L -7 9 L -5 2 L -10 -3 L -3 -3 Z',
    });
  }
} catch {
  // fallback to standard shapes
}

const getShapes = (): (confetti.Shape | 'square' | 'circle')[] => {
  if (starShape) {
    return ['square', 'circle', starShape];
  }
  return ['square', 'circle'];
};

/**
 * Supercharged Salt & Seasoning Confetti Particle Engine
 */
export const sprinkleSalt = (
  mode: SprinkleMode = 'burst',
  options: SprinkleOptions = {}
) => {
  const {
    origin = { x: 0.88, y: 0.85 },
    colors = COZY_CONFETTI_PALETTE,
    playSound = true,
  } = options;

  if (playSound) {
    soundEngine.playTick(1300);
  }

  const shapes = getShapes();

  // ================================================================
  // 1. SUBTLE BURST (Bookmark / Card Save / Small Action)
  // ================================================================
  if (mode === 'subtle') {
    confetti({
      particleCount: options.particleCount || 90,
      angle: options.angle || 90,
      spread: options.spread || 70,
      origin: options.origin || origin,
      colors,
      shapes,
      startVelocity: 30,
      gravity: 0.7,
      scalar: 0.9,
      ticks: 300,
      drift: (Math.random() - 0.5) * 0.3,
      disableForReducedMotion: true,
    });
    return;
  }

  // ================================================================
  // 2. RAPID / SPAM CLICK BURST (Overlapping, non-blocking)
  // ================================================================
  if (mode === 'rapid') {
    confetti({
      particleCount: options.particleCount || 100,
      angle: 90 + (Math.random() * 40 - 20),
      spread: 90,
      origin: options.origin || origin,
      colors,
      shapes,
      startVelocity: 35 + Math.random() * 10,
      gravity: 0.75,
      scalar: 0.85 + Math.random() * 0.4,
      ticks: 280,
      drift: (Math.random() - 0.5) * 0.5,
      disableForReducedMotion: true,
    });
    return;
  }

  // ================================================================
  // 3. BURST MODE (Clicking Mr. Salt / Big Season Trigger)
  // ================================================================
  if (mode === 'burst') {
    const count = options.particleCount || 180;

    // Dual-angled spray for dense screen coverage
    confetti({
      particleCount: Math.round(count * 0.6),
      angle: 75,
      spread: options.spread || 120,
      origin: options.origin || origin,
      colors,
      shapes,
      startVelocity: 42,
      gravity: 0.7,
      scalar: 1.1,
      ticks: 320,
      drift: 0.2,
      disableForReducedMotion: true,
    });

    confetti({
      particleCount: Math.round(count * 0.4),
      angle: 110,
      spread: options.spread || 100,
      origin: options.origin || origin,
      colors,
      shapes,
      startVelocity: 38,
      gravity: 0.65,
      scalar: 0.85,
      ticks: 320,
      drift: -0.2,
      disableForReducedMotion: true,
    });
    return;
  }

  // ================================================================
  // 4. CELEBRATION MODE (Recipe Created / Timer Finished / Recipe Done)
  // Prolonged multi-stage dual cannon burst (1.5 - 2s duration)
  // ================================================================
  if (mode === 'celebration') {
    // Stage 1: Left Cannon (t = 0ms)
    confetti({
      particleCount: 120,
      angle: 60,
      spread: 80,
      origin: { x: 0.05, y: 0.75 },
      colors,
      shapes,
      startVelocity: 55,
      gravity: 0.7,
      scalar: 1.2,
      ticks: 350,
    });

    // Stage 2: Right Cannon (t = 150ms)
    setTimeout(() => {
      confetti({
        particleCount: 120,
        angle: 120,
        spread: 80,
        origin: { x: 0.95, y: 0.75 },
        colors,
        shapes,
        startVelocity: 55,
        gravity: 0.7,
        scalar: 1.2,
        ticks: 350,
      });
    }, 150);

    // Stage 3: Top Center Rainfall (t = 300ms)
    setTimeout(() => {
      confetti({
        particleCount: 150,
        angle: 90,
        spread: 130,
        origin: { x: 0.5, y: 0.1 },
        colors,
        shapes,
        startVelocity: 35,
        gravity: 0.65,
        scalar: 1.3,
        ticks: 360,
      });
    }, 300);

    // Stage 4: Secondary Left/Right Crossfire (t = 650ms)
    setTimeout(() => {
      confetti({
        particleCount: 90,
        angle: 65,
        spread: 90,
        origin: { x: 0.15, y: 0.65 },
        colors,
        shapes,
        startVelocity: 45,
        gravity: 0.7,
        scalar: 1.0,
        ticks: 320,
      });
      confetti({
        particleCount: 90,
        angle: 115,
        spread: 90,
        origin: { x: 0.85, y: 0.65 },
        colors,
        shapes,
        startVelocity: 45,
        gravity: 0.7,
        scalar: 1.0,
        ticks: 320,
      });
    }, 650);

    // Stage 5: Grand Finale Center Shimmer (t = 1100ms)
    setTimeout(() => {
      confetti({
        particleCount: 150,
        angle: 90,
        spread: 150,
        origin: { x: 0.5, y: 0.2 },
        colors,
        shapes,
        startVelocity: 40,
        gravity: 0.6,
        scalar: 1.15,
        ticks: 380,
      });
    }, 1100);
  }
};
