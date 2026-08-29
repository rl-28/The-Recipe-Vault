import { soundEngine } from './soundEngine';
import { sprinkleSalt, COZY_CONFETTI_PALETTE, type SprinkleMode } from './sprinkleSalt';

export type SeasoningType = 
  | 'maldon-salt'
  | 'smoked-paprika'
  | 'cracked-pepper'
  | 'tuscan-herbs'
  | 'gold-dust'
  | 'rainbow-seasoning';

export interface SeasoningConfig {
  id: SeasoningType;
  name: string;
  emoji: string;
  description: string;
  colors: string[];
}

export const SEASONING_PRESETS: Record<SeasoningType, SeasoningConfig> = {
  'maldon-salt': {
    id: 'maldon-salt',
    name: 'Flaky Maldon Salt',
    emoji: '🧂',
    description: 'Pyramidal mineral crystals from the Essex coast',
    colors: ['#FFFFFF', '#F8FAFC', '#F1F5F9', '#FFFDF8', '#FFF3B0'],
  },
  'smoked-paprika': {
    id: 'smoked-paprika',
    name: 'Smoked Paprika',
    emoji: '🌶️',
    description: 'Oak-smoked Spanish Pimentón de la Vera',
    colors: ['#DC2626', '#EF4444', '#B91C1C', '#EA7186', '#F97316'],
  },
  'cracked-pepper': {
    id: 'cracked-pepper',
    name: 'Tellicherry Black Pepper',
    emoji: '🖤',
    description: 'Coarse sun-dried aromatic peppercorn grind',
    colors: ['#0F172A', '#1E293B', '#334155', '#475569', '#7A77B9'],
  },
  'tuscan-herbs': {
    id: 'tuscan-herbs',
    name: 'Tuscan Herb Medley',
    emoji: '🌿',
    description: 'Crushed wild rosemary, thyme, oregano & sage',
    colors: ['#15803D', '#16A34A', '#22C55E', '#4ADE80', '#D4F1F4'],
  },
  'gold-dust': {
    id: 'gold-dust',
    name: '24K Edible Gold Flakes',
    emoji: '✨',
    description: 'Lustrous shimmering pastry & gourmet gold flakes',
    colors: ['#F2C76E', '#F59E0B', '#FBBF24', '#FDE68A', '#D97706'],
  },
  'rainbow-seasoning': {
    id: 'rainbow-seasoning',
    name: 'Chef Secret Blend',
    emoji: '🌈',
    description: 'A vibrant burst of all signature seasonings',
    colors: COZY_CONFETTI_PALETTE,
  }
};

class SeasoningEngine {
  private audioCtx: AudioContext | null = null;
  private lastSprinkleTime = 0;

  private initAudio() {
    if (!this.audioCtx && typeof window !== 'undefined') {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtxClass) {
        this.audioCtx = new AudioCtxClass();
      }
    }
  }

  /**
   * Synthesizes realistic maraca/salt shaker rattle sounds using filtered white noise
   */
  public playShakerSound(intensity: 'single' | 'double' | 'triple' = 'single') {
    if (soundEngine.getIsMuted()) return;
    try {
      this.initAudio();
      if (!this.audioCtx) return;
      if (this.audioCtx.state === 'suspended') {
        this.audioCtx.resume();
      }

      const count = intensity === 'triple' ? 3 : intensity === 'double' ? 2 : 1;

      for (let i = 0; i < count; i++) {
        const delay = i * 0.07;
        const now = this.audioCtx.currentTime + delay;

        // White noise buffer for salt grains collision
        const bufferSize = this.audioCtx.sampleRate * 0.06;
        const buffer = this.audioCtx.createBuffer(1, bufferSize, this.audioCtx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let j = 0; j < bufferSize; j++) {
          data[j] = Math.random() * 2 - 1;
        }

        const noiseSource = this.audioCtx.createBufferSource();
        noiseSource.buffer = buffer;

        // Bandpass filter to capture shaker frequency (3200Hz - 4500Hz)
        const filter = this.audioCtx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(3600 + Math.random() * 600, now);
        filter.Q.setValueAtTime(2.2, now);

        // Amplitude envelope: snappy attack & fast exponential decay
        const gainNode = this.audioCtx.createGain();
        gainNode.gain.setValueAtTime(0, now);
        gainNode.gain.linearRampToValueAtTime(0.2, now + 0.008);
        gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.055);

        noiseSource.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(this.audioCtx.destination);

        noiseSource.start(now);
        noiseSource.stop(now + 0.06);
      }
    } catch {
      // Audio fallback
    }
  }

  /**
   * Supercharged sprinkle from a specific screen coordinate (or mascot location)
   */
  public sprinkle({
    type = 'maldon-salt',
    origin = { x: 0.88, y: 0.85 },
    particleCount = 180,
    spread = 120,
    angle = 90,
    mode = 'burst',
  }: {
    type?: SeasoningType;
    origin?: { x: number; y: number };
    particleCount?: number;
    spread?: number;
    angle?: number;
    mode?: SprinkleMode;
  } = {}) {
    const now = Date.now();
    const isRapid = now - this.lastSprinkleTime < 300;
    this.lastSprinkleTime = now;

    this.playShakerSound(isRapid ? 'single' : 'double');

    const config = SEASONING_PRESETS[type] || SEASONING_PRESETS['maldon-salt'];

    sprinkleSalt(isRapid ? 'rapid' : mode, {
      origin,
      colors: config.colors,
      particleCount,
      spread,
      angle,
      playSound: false,
    });
  }

  /**
   * Full-screen celebratory seasoning rainfall
   */
  public seasonFullScreen(type: SeasoningType = 'maldon-salt') {
    this.playShakerSound('triple');
    const config = SEASONING_PRESETS[type] || SEASONING_PRESETS['maldon-salt'];

    sprinkleSalt('celebration', {
      colors: config.colors,
      playSound: false,
    });
  }
}

export const seasoningEngine = new SeasoningEngine();
