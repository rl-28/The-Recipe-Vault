import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  X, 
  ChevronRight, 
  Flame, 
  Layers
} from 'lucide-react';
import { MrSaltSvg, type MrSaltMood } from './MrSaltSvg';
import { seasoningEngine, SEASONING_PRESETS, type SeasoningType } from '../../utils/seasoningEngine';

const CULINARY_TIPS = [
  "Salt doesn't just make food salty—it suppresses bitterness and boosts sweetness by 20%! 🧂",
  "Always salt your pasta water generously until it tastes like the Mediterranean Sea! 🌊",
  "A pinch of flaky Maldon sea salt over warm chocolate chip cookies is pure molecular magic! ✨",
  "Sous-vide locks in moisture, but a scorching hot dry-brine crust seals the master flavor! 🥩",
  "Season with your heart, but always measure your baking yeast with microgram precision! 🥐",
  "Acidity balances rich butter fats, and a crystalline pinch of salt harmonizes the whole symphony! 🎻",
  "Rest your steaks for half their cooking time to let delicious savory juices redistribute! 🍖",
  "Cold butter in hot dough creates those legendary flaky honeycomb pastry layers! 🥐",
  "Did you know? Koji fermentation generates natural monosodium glutamate without any artificial additives! 🧪",
];

export const FloatingMrSalt: React.FC = () => {
  const [mood, setMood] = useState<MrSaltMood>('idle');
  const [tipIndex, setTipIndex] = useState<number>(0);
  const [showSpeechBubble, setShowSpeechBubble] = useState<boolean>(true);
  const [showSeasoningMenu, setShowSeasoningMenu] = useState<boolean>(false);
  const [selectedSeasoning, setSelectedSeasoning] = useState<SeasoningType>('maldon-salt');
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Auto-rotate tips every 15 seconds if bubble is open
  useEffect(() => {
    if (!showSpeechBubble) return;
    const interval = setInterval(() => {
      setTipIndex((prev) => (prev + 1) % CULINARY_TIPS.length);
    }, 15000);
    return () => clearInterval(interval);
  }, [showSpeechBubble]);

  const handleMascotClick = () => {
    setMood('shake');

    // Calculate normalized screen coordinates of mascot button
    let originX = 0.88;
    let originY = 0.85;

    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      originX = (rect.left + rect.width / 2) / window.innerWidth;
      originY = rect.top / window.innerHeight;
    }

    // Sprinkle seasoning from Mr. Salt's cap
    seasoningEngine.sprinkle({
      type: selectedSeasoning,
      origin: { x: originX, y: originY },
      particleCount: 45,
      spread: 80,
      angle: 110,
    });

    // Advance tip on click & reopen speech bubble if closed
    setTipIndex((prev) => (prev + 1) % CULINARY_TIPS.length);
    setShowSpeechBubble(true);

    setTimeout(() => {
      setMood('idle');
    }, 600);
  };

  const handleNextTip = (e: React.MouseEvent) => {
    e.stopPropagation();
    setMood('think');
    setTipIndex((prev) => (prev + 1) % CULINARY_TIPS.length);
    setTimeout(() => setMood('idle'), 500);
  };

  const handleSeasonScreen = (e: React.MouseEvent) => {
    e.stopPropagation();
    setMood('celebrate');
    seasoningEngine.seasonFullScreen(selectedSeasoning);
    setTimeout(() => setMood('idle'), 1000);
  };

  const handleSelectSeasoning = (type: SeasoningType) => {
    setSelectedSeasoning(type);
    setShowSeasoningMenu(false);
    setMood('shake');

    seasoningEngine.sprinkle({
      type,
      origin: { x: 0.88, y: 0.85 },
      particleCount: 35,
      spread: 65,
    });

    setTimeout(() => setMood('idle'), 600);
  };

  const activeConfig = SEASONING_PRESETS[selectedSeasoning];

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2 pointer-events-auto select-none font-sans">
      {/* ============================================================ */}
      {/* 1. ANIMATED SPEECH BUBBLE POPOVER (Positioned above mascot)  */}
      {/* ============================================================ */}
      <AnimatePresence>
        {showSpeechBubble && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className="max-w-xs md:max-w-sm p-4 rounded-2xl bg-[#FFFDF8] border-2 border-black shadow-[4px_4px_0px_#000] relative mb-1"
          >
            {/* Small downward doodle arrow pointing directly to Mr. Salt */}
            <div className="absolute -bottom-2 right-9 w-3.5 h-3.5 bg-[#FFFDF8] border-r-2 border-b-2 border-black transform rotate-45"></div>

            {/* Bubble Header */}
            <div className="flex items-center justify-between pb-2 border-b-2 border-black mb-2">
              <div className="flex items-center space-x-1.5 text-xs font-hand font-extrabold text-black">
                <span className="text-base">{activeConfig.emoji}</span>
                <span>MR. SALT SAYS:</span>
              </div>

              <div className="flex items-center space-x-1">
                <button
                  onClick={handleNextTip}
                  className="p-1 rounded-lg bg-[#FAF7F0] hover:bg-[#FFE68C] border border-black text-black text-[10px] font-hand font-bold shadow-[1px_1px_0px_#000] flex items-center space-x-0.5 cursor-pointer"
                  title="Next Culinary Tip"
                >
                  <span>Next</span>
                  <ChevronRight className="w-3 h-3 stroke-[3]" />
                </button>

                <button
                  onClick={() => setShowSpeechBubble(false)}
                  className="p-1 rounded-lg bg-[#FFAAA6] hover:bg-rose-300 border border-black text-black shadow-[1px_1px_0px_#000] cursor-pointer"
                  title="Dismiss Speech Bubble"
                >
                  <X className="w-3 h-3 stroke-[3]" />
                </button>
              </div>
            </div>

            {/* Tip Message Text */}
            <p className="text-xs sm:text-sm font-doodle font-bold text-stone-800 leading-relaxed">
              "{CULINARY_TIPS[tipIndex]}"
            </p>

            {/* Quick Action Buttons inside Speech Bubble */}
            <div className="mt-3 pt-2 border-t border-black/20 flex items-center justify-between text-[11px] font-hand font-bold">
              <button
                onClick={() => setShowSeasoningMenu(!showSeasoningMenu)}
                className="flex items-center space-x-1 px-2.5 py-1 rounded-xl bg-[#FFE68C] border border-black shadow-[1px_1px_0px_#000] hover:bg-amber-300 cursor-pointer"
              >
                <Layers className="w-3 h-3" />
                <span>Spice: {activeConfig.name.split(' ')[0]}</span>
              </button>

              <button
                onClick={handleSeasonScreen}
                className="flex items-center space-x-1 px-2.5 py-1 rounded-xl bg-[#D4F1F4] border border-black shadow-[1px_1px_0px_#000] hover:bg-cyan-200 cursor-pointer"
              >
                <Sparkles className="w-3 h-3 text-black" />
                <span>Sprinkle Page! ✨</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ============================================================ */}
      {/* 2. SEASONING SELECTOR POPOVER MENU                           */}
      {/* ============================================================ */}
      <AnimatePresence>
        {showSeasoningMenu && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
            className="w-64 p-3 rounded-2xl bg-[#FFFDF8] border-2 border-black shadow-[4px_4px_0px_#000] space-y-2 mb-1"
          >
            <div className="flex items-center justify-between pb-2 border-b-2 border-black text-xs font-hand font-extrabold text-black">
              <span>SELECT ACTIVE SPICE</span>
              <button
                onClick={() => setShowSeasoningMenu(false)}
                className="text-stone-500 hover:text-black cursor-pointer"
              >
                <X className="w-3.5 h-3.5 stroke-[2.5]" />
              </button>
            </div>

            <div className="space-y-1.5">
              {(Object.keys(SEASONING_PRESETS) as SeasoningType[]).map((key) => {
                const config = SEASONING_PRESETS[key];
                const isSelected = selectedSeasoning === key;
                return (
                  <button
                    key={key}
                    onClick={() => handleSelectSeasoning(key)}
                    className={`w-full flex items-center justify-between p-2 rounded-xl border-2 border-black text-xs font-hand font-bold transition-all cursor-pointer shadow-[1.5px_1.5px_0px_#000] ${
                      isSelected
                        ? 'bg-[#FFE68C] text-black translate-x-1'
                        : 'bg-white hover:bg-[#FAF7F0] text-stone-800'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <span className="text-base">{config.emoji}</span>
                      <span>{config.name}</span>
                    </div>
                    {isSelected && (
                      <span className="w-2 h-2 rounded-full bg-black"></span>
                    )}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ============================================================ */}
      {/* 3. FLOATING MASCOT BUTTON ON CIRCULAR PEDESTAL               */}
      {/* ============================================================ */}
      <div className="flex items-center gap-2">
        {/* Quick Toolbar Pill Buttons */}
        <div className="flex items-center gap-1.5 bg-[#FFFDF8] border-2 border-black p-1.5 rounded-2xl shadow-[3px_3px_0px_#000]">
          <button
            onClick={handleSeasonScreen}
            className="p-2 rounded-xl bg-[#FFE68C] border border-black hover:bg-amber-300 shadow-[1px_1px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
            title="Sprinkle Seasoning Rain! ✨"
          >
            <Sparkles className="w-4 h-4 stroke-[2.5]" />
          </button>

          <button
            onClick={() => setShowSeasoningMenu(!showSeasoningMenu)}
            className="p-2 rounded-xl bg-[#D4F1F4] border border-black hover:bg-cyan-200 shadow-[1px_1px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
            title="Choose Active Spice Preset"
          >
            <Flame className="w-4 h-4 text-orange-600 stroke-[2.5]" />
          </button>
        </div>

        {/* Circular Pedestal Mascot Button */}
        <motion.button
          ref={buttonRef}
          onClick={handleMascotClick}
          whileHover={{ scale: 1.1, rotate: 3 }}
          whileTap={{ scale: 0.95 }}
          className="relative bg-[#FFFDF8] border-[2.5px] border-black p-2 rounded-full shadow-[4px_4px_0px_#000] hover:shadow-[6px_6px_0px_#000] transition-all cursor-pointer flex items-center justify-center group"
          title="Click Mr. Salt to shake and season the page!"
        >
          {/* Mr. Salt SVG Avatar (approx. 70-80px display height) */}
          <div className="w-16 h-18 sm:w-18 sm:h-20 flex items-center justify-center overflow-visible">
            <MrSaltSvg mood={mood} size={70} />
          </div>

          {/* "Shake Me!" Floating Badge */}
          <motion.div
            animate={{ y: [0, -3, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -top-2.5 -left-3 px-2 py-0.5 rounded-full bg-[#FFAAA6] border-2 border-black font-hand font-extrabold text-[10px] text-black shadow-[2px_2px_0px_#000] pointer-events-none whitespace-nowrap"
          >
            Shake Me! 🧂
          </motion.div>
        </motion.button>
      </div>
    </div>
  );
};

export const MrSaltWidget = FloatingMrSalt;
export default FloatingMrSalt;
