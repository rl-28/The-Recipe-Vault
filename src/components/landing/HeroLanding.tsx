import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Sparkles, 
  Volume2, 
  VolumeX, 
  ShieldCheck, 
  Key, 
  Compass, 
  Binary, 
  Hash,
  ChefHat
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
    <div className="relative z-10 flex flex-col justify-between min-h-screen px-6 py-8 md:px-12 md:py-10 select-none">
      {/* Top Bar Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="flex items-center justify-between w-full max-w-7xl mx-auto"
      >
        {/* Brand Insignia */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-50 border border-amber-200/80 flex items-center justify-center shadow-sm">
            <ChefHat className="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <h2 className="text-sm font-sans font-bold tracking-tight text-stone-900 uppercase">
              The Recipe Vault
            </h2>
            <p className="text-[11px] font-sans tracking-wide text-stone-500">
              ARTISANAL CULINARY ARCHIVE
            </p>
          </div>
        </div>

        {/* Status Badges & Controls */}
        <div className="flex items-center space-x-3">
          <div className="hidden sm:flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-white/80 border border-stone-200/80 backdrop-blur-md text-xs font-sans text-stone-600 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="font-medium text-stone-800">Archive Open</span>
            <span className="text-stone-300">|</span>
            <ShieldCheck className="w-4 h-4 text-amber-500" />
            <span>Master Collection</span>
          </div>

          {/* Keypad Dial Trigger */}
          <button
            onClick={() => {
              soundEngine.playTick(1000);
              setShowKeypad(!showKeypad);
            }}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-white/80 border border-stone-200/80 hover:border-amber-400 text-stone-700 hover:text-amber-600 text-xs font-sans font-medium backdrop-blur-md transition-all cursor-pointer shadow-sm"
            title="Open Combination Cipher Pad"
          >
            <Binary className="w-3.5 h-3.5 text-amber-500" />
            <span className="hidden md:inline">Keypad Access</span>
          </button>

          {/* Sound Mute Toggle Button */}
          <button
            id="sound-toggle-btn"
            onClick={handleMuteToggle}
            onMouseEnter={() => soundEngine.playTick(900)}
            className="p-2.5 rounded-xl bg-white/80 border border-stone-200/80 text-stone-600 hover:text-amber-600 hover:border-amber-400 backdrop-blur-md transition-all duration-200 cursor-pointer shadow-sm"
            title={isMuted ? 'Unmute Sound' : 'Mute Sound'}
            aria-label="Toggle Sound"
          >
            {isMuted ? (
              <VolumeX className="w-4 h-4 text-stone-400" />
            ) : (
              <Volume2 className="w-4 h-4 text-amber-500" />
            )}
          </button>
        </div>
      </motion.header>

      {/* Main Center Callout & Action */}
      <div className="flex flex-col items-center justify-center text-center my-auto max-w-4xl mx-auto pointer-events-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: isUnlocking ? 0 : 1, scale: isUnlocking ? 1.05 : 1 }}
          transition={{ duration: 0.7 }}
          className="flex flex-col items-center"
        >
          {/* Subtitle tag */}
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-amber-50 border border-amber-200/80 text-amber-800 text-xs font-medium tracking-wide mb-6 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>Curated Culinary Sanctuary</span>
          </div>

          {/* Main Title */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-display font-extrabold tracking-tight text-stone-900 uppercase drop-shadow-sm">
            The Recipe <span className="text-gold-gradient">Vault</span>
          </h1>

          <p className="mt-4 text-base sm:text-lg md:text-xl text-stone-600 max-w-2xl font-light leading-relaxed">
            A curated sanctuary of artisanal flavors, secret recipes, and joyful cooking.
          </p>

          {/* Cipher Keypad or Primary Action */}
          <div className="mt-8 flex flex-col items-center">
            {showKeypad ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-6 rounded-3xl bg-white/95 border border-stone-200 shadow-xl backdrop-blur-xl flex flex-col items-center space-y-3 w-76"
              >
                <div className="text-xs font-sans font-semibold text-stone-600 flex items-center space-x-1.5">
                  <Hash className="w-3.5 h-3.5 text-amber-500" />
                  <span>ENTER 3-DIGIT CHEF CODE</span>
                </div>

                {/* PIN Display */}
                <div className="flex space-x-3 py-2">
                  {[0, 1, 2].map((idx) => (
                    <div
                      key={idx}
                      className={`w-10 h-12 rounded-xl border flex items-center justify-center font-mono text-xl font-bold ${
                        enteredPin[idx]
                          ? 'bg-amber-50 text-amber-700 border-amber-300 shadow-sm'
                          : 'bg-stone-50 border-stone-200 text-stone-300'
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
                      className="p-3 rounded-xl bg-stone-50 hover:bg-amber-50 border border-stone-200/80 hover:border-amber-300 text-sm font-sans font-bold text-stone-800 hover:text-amber-700 transition-all cursor-pointer shadow-sm active:scale-95"
                    >
                      {digit}
                    </button>
                  ))}
                  <button
                    onClick={handleClearPin}
                    className="p-3 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-xs font-sans font-bold text-rose-600 transition-all cursor-pointer active:scale-95"
                  >
                    CLR
                  </button>
                  <button
                    onClick={() => handleKeyPress('0')}
                    className="p-3 rounded-xl bg-stone-50 hover:bg-amber-50 border border-stone-200/80 hover:border-amber-300 text-sm font-sans font-bold text-stone-800 hover:text-amber-700 transition-all cursor-pointer shadow-sm active:scale-95"
                  >
                    0
                  </button>
                  <button
                    onClick={handleEnterClick}
                    className="p-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-sans font-bold transition-all cursor-pointer shadow-sm active:scale-95"
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
                  className={`relative flex items-center space-x-3 px-9 py-4 rounded-full font-sans text-sm font-medium tracking-wide transition-all duration-300 cursor-pointer shadow-lg shadow-amber-500/25 hover:shadow-xl hover:shadow-amber-500/35 hover:scale-105 active:scale-95 ${
                    isUnlocking
                      ? 'bg-amber-600 text-white scale-95'
                      : 'bg-amber-500 hover:bg-amber-600 text-white'
                  }`}
                >
                  {isUnlocking ? (
                    <>
                      <Key className="w-5 h-5 animate-spin text-white" />
                      <span className="font-semibold">Opening Vault...</span>
                    </>
                  ) : (
                    <>
                      <Key className="w-4 h-4 text-white group-hover:rotate-45 transition-transform duration-300" />
                      <span className="font-semibold">Explore Recipes</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>

          {/* Interactive Hint */}
          <div className="mt-6 flex items-center space-x-2 text-xs font-sans text-stone-400">
            <Compass className="w-3.5 h-3.5 text-amber-500/60" />
            <span>Move cursor to inspect 3D vault • Click button to enter</span>
          </div>
        </motion.div>
      </div>

      {/* Bottom Footer Metadata */}
      <motion.footer
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: isUnlocking ? 0 : 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between pt-6 border-t border-stone-200/60 text-xs font-sans text-stone-500"
      >
        <div className="flex items-center space-x-6">
          <div>
            <span className="text-amber-600 font-semibold">Curation:</span> Master Chef Vault
          </div>
          <div>
            <span className="text-amber-600 font-semibold">Techniques:</span> Artisanal & Modern
          </div>
          <div className="hidden md:block">
            <span className="text-amber-600 font-semibold">Kitchen:</span> Tested & Verified
          </div>
        </div>

        <div className="mt-2 sm:mt-0 text-center sm:text-right font-medium">
          Handcrafted with Joy & Precision
        </div>
      </motion.footer>
    </div>
  );
};
