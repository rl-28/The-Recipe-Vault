import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Sparkles, 
  Volume2, 
  VolumeX, 
  Key, 
  Compass, 
  Binary, 
  Hash,
  ChefHat,
  Heart
} from 'lucide-react';
import { soundEngine } from '../../utils/soundEngine';

interface HeroLandingProps {
  onUnlock: () => void;
  isUnlocking: boolean;
}

export const HeroLanding: React.FC<HeroLandingProps> = ({ onUnlock, isUnlocking }) => {
  const [isMuted, setIsMuted] = useState(soundEngine.getIsMuted());
  const [showKeypad, setShowKeypad] = useState<boolean>(false);
  const [enteredPin, setEnteredPin] = useState<string>('');

  const handleMuteToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    const muted = soundEngine.toggleMute();
    setIsMuted(muted);
  };

  const handleEnterClick = () => {
    if (isUnlocking) return;
    soundEngine.playTick(1400);
    onUnlock();
  };

  const handleKeyPress = (num: string) => {
    if (enteredPin.length >= 3) return;
    soundEngine.playTumblerClick(900 + Number(num) * 80);
    const nextPin = enteredPin + num;
    setEnteredPin(nextPin);

    // If 3 digits entered, verify
    if (nextPin.length === 3) {
      setTimeout(() => {
        soundEngine.playAccessGranted();
        setShowKeypad(false);
        onUnlock();
      }, 300);
    }
  };

  const handleClearPin = () => {
    soundEngine.playTick(500);
    setEnteredPin('');
  };

  return (
    <div className="relative z-10 flex flex-col justify-between min-h-screen px-6 py-8 md:px-12 md:py-10 select-none font-sans">
      {/* Top Bar Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="flex items-center justify-between w-full max-w-7xl mx-auto"
      >
        {/* Brand Insignia */}
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-2xl bg-[#FFE68C] border-[2.5px] border-black flex items-center justify-center shadow-[3px_3px_0px_#000]">
            <ChefHat className="w-6 h-6 text-black stroke-[2.2]" />
          </div>
          <div>
            <h2 className="text-base font-hand font-extrabold tracking-tight text-black uppercase">
              The Recipe Vault
            </h2>
            <p className="text-xs font-doodle font-bold text-stone-600">
              Cozy Storybook Kitchen
            </p>
          </div>
        </div>

        {/* Status Badges & Controls */}
        <div className="flex items-center space-x-3">
          {/* Keypad Trigger */}
          <button
            onClick={() => {
              soundEngine.playTick(1000);
              setShowKeypad(!showKeypad);
            }}
            className="flex items-center space-x-2 px-4 py-2 rounded-2xl bg-white border-2 border-black font-hand font-bold text-xs text-black shadow-[2px_2px_0px_#000] hover:bg-[#D4F1F4] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
            title="Open Combination Cipher Pad"
          >
            <Binary className="w-4 h-4 stroke-[2.5]" />
            <span className="hidden md:inline">Keypad Access</span>
          </button>

          {/* Sound Mute Toggle Button */}
          <button
            id="sound-toggle-btn"
            onClick={handleMuteToggle}
            onMouseEnter={() => soundEngine.playTick(900)}
            className="p-2.5 rounded-2xl bg-white border-2 border-black text-black shadow-[2px_2px_0px_#000] hover:bg-[#E8D7F1] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
            title={isMuted ? 'Unmute Sound' : 'Mute Sound'}
            aria-label="Toggle Sound"
          >
            {isMuted ? (
              <VolumeX className="w-4 h-4 text-stone-400 stroke-[2.5]" />
            ) : (
              <Volume2 className="w-4 h-4 text-black stroke-[2.5]" />
            )}
          </button>
        </div>
      </motion.header>

      {/* Main Center Callout & Action */}
      <div className="flex flex-col items-center justify-center text-center my-auto max-w-4xl mx-auto pointer-events-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: isUnlocking ? 0 : 1, scale: isUnlocking ? 1.05 : 1 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center"
        >
          {/* Subtitle sticker tag */}
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-2xl bg-[#FFE68C] border-2 border-black text-black text-xs font-hand font-bold mb-6 shadow-[2px_2px_0px_#000]">
            <Sparkles className="w-4 h-4 stroke-[2.5]" />
            <span>Curated Artisanal Kitchen Sanctuary</span>
          </div>

          {/* Main Title */}
          <h1 className="text-5xl sm:text-7xl md:text-8xl font-hand font-extrabold tracking-tight text-black uppercase leading-tight drop-shadow-sm">
            The Recipe <span className="bg-[#FFE68C] px-3 py-0.5 rounded-2xl border-2 border-black shadow-[3px_3px_0px_#000]">Vault</span>
          </h1>

          <p className="mt-5 text-base sm:text-xl text-stone-700 max-w-2xl font-doodle font-bold leading-relaxed">
            A curated sanctuary of artisanal flavors, secret recipes, and joyful cooking.
          </p>

          {/* Cipher Keypad or Primary Action */}
          <div className="mt-8 flex flex-col items-center">
            {showKeypad ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-6 rounded-3xl bg-[#FFFDF8] border-[2.5px] border-black shadow-[6px_6px_0px_#000] flex flex-col items-center space-y-3 w-76"
              >
                <div className="text-xs font-hand font-bold text-black flex items-center space-x-1.5">
                  <Hash className="w-4 h-4 text-black stroke-[2.5]" />
                  <span>ENTER 3-DIGIT CHEF CODE</span>
                </div>

                {/* PIN Display */}
                <div className="flex space-x-3 py-2">
                  {[0, 1, 2].map((idx) => (
                    <div
                      key={idx}
                      className={`w-11 h-12 rounded-2xl border-2 border-black flex items-center justify-center font-mono text-xl font-bold shadow-[2px_2px_0px_#000] ${
                        enteredPin[idx]
                          ? 'bg-[#FFE68C] text-black'
                          : 'bg-white text-stone-300'
                      }`}
                    >
                      {enteredPin[idx] || '•'}
                    </div>
                  ))}
                </div>

                {/* Keypad Digits */}
                <div className="grid grid-cols-3 gap-2 w-full pt-1">
                  {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
                    <button
                      key={digit}
                      onClick={() => handleKeyPress(digit)}
                      className="p-3 rounded-2xl bg-white hover:bg-[#FFE68C] border-2 border-black text-sm font-hand font-extrabold text-black transition-all cursor-pointer shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
                    >
                      {digit}
                    </button>
                  ))}
                  <button
                    onClick={handleClearPin}
                    className="p-3 rounded-2xl bg-[#FFAAA6] hover:bg-rose-300 border-2 border-black text-xs font-hand font-extrabold text-black transition-all cursor-pointer shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
                  >
                    CLR
                  </button>
                  <button
                    onClick={() => handleKeyPress('0')}
                    className="p-3 rounded-2xl bg-white hover:bg-[#FFE68C] border-2 border-black text-sm font-hand font-extrabold text-black transition-all cursor-pointer shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
                  >
                    0
                  </button>
                  <button
                    onClick={handleEnterClick}
                    className="p-3 rounded-2xl bg-[#FFE68C] hover:bg-amber-300 border-2 border-black text-xs font-hand font-extrabold text-black transition-all cursor-pointer shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
                    title="Bypass Code"
                  >
                    BYP
                  </button>
                </div>
              </motion.div>
            ) : (
              <div className="relative group">
                <button
                  id="enter-archive-btn"
                  onClick={handleEnterClick}
                  disabled={isUnlocking}
                  onMouseEnter={() => soundEngine.playTick(1100)}
                  className={`relative flex items-center space-x-3 px-9 py-4 rounded-full font-hand font-extrabold text-base tracking-wide transition-all duration-200 cursor-pointer border-[2.5px] border-black shadow-[4px_4px_0px_#000] hover:shadow-[6px_6px_0px_#000] hover:translate-x-[-2px] hover:translate-y-[-2px] active:translate-x-1 active:translate-y-1 active:shadow-none ${
                    isUnlocking
                      ? 'bg-[#FFAAA6] text-black'
                      : 'bg-[#FFE68C] hover:bg-amber-300 text-black'
                  }`}
                >
                  {isUnlocking ? (
                    <>
                      <Key className="w-5 h-5 animate-spin text-black stroke-[2.5]" />
                      <span>Opening Vault...</span>
                    </>
                  ) : (
                    <>
                      <Key className="w-5 h-5 text-black stroke-[2.5] group-hover:rotate-45 transition-transform" />
                      <span>Explore Recipes 📖</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>

          {/* Interactive Hint */}
          <div className="mt-6 flex items-center space-x-2 text-xs font-doodle font-bold text-stone-500">
            <Compass className="w-4 h-4 text-black stroke-[2]" />
            <span>Move cursor to inspect 3D vault • Click button to enter</span>
          </div>
        </motion.div>
      </div>

      {/* Bottom Footer Metadata */}
      <motion.footer
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: isUnlocking ? 0 : 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between pt-6 border-t-2 border-black text-xs font-hand font-bold text-black"
      >
        <div className="flex items-center space-x-6">
          <div>
            <span className="text-amber-800">Curation:</span> Master Chef Vault
          </div>
          <div>
            <span className="text-amber-800">Techniques:</span> Artisanal & Modern
          </div>
          <div className="hidden md:block">
            <span className="text-amber-800">Kitchen:</span> Tested & Verified
          </div>
        </div>

        <div className="mt-2 sm:mt-0 text-center sm:text-right flex items-center space-x-1">
          <span>Handcrafted with love</span>
          <Heart className="w-3.5 h-3.5 text-[#FFAAA6] fill-current inline" />
        </div>
      </motion.footer>
    </div>
  );
};
