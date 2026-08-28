import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Lock, 
  Unlock, 
  Volume2, 
  VolumeX, 
  ShieldCheck, 
  Key, 
  Sparkles, 
  Compass, 
  Binary, 
  Hash
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
          <div className="w-9 h-9 rounded-lg bg-vault-900 border border-vault-gold-500/30 flex items-center justify-center shadow-neon-gold">
            <Lock className="w-4 h-4 text-vault-gold-400" />
          </div>
          <div>
            <h2 className="text-xs font-mono tracking-widest text-vault-gold-400 font-semibold uppercase">
              The Recipe Vault
            </h2>
            <p className="text-[10px] tracking-wider text-vault-steel/70 font-mono">
              CLASSIFIED PROTOCOLS // DEPT. CULINARY ARTS
            </p>
          </div>
        </div>

        {/* Status Badges & Controls */}
        <div className="flex items-center space-x-3">
          <div className="hidden sm:flex items-center space-x-2 px-3 py-1.5 rounded-full bg-vault-900/80 border border-white/10 backdrop-blur-md text-[11px] font-mono text-vault-steel">
            <span className="w-1.5 h-1.5 rounded-full bg-vault-emerald animate-pulse"></span>
            <span className="text-neutral-300">VAULT ONLINE</span>
            <span className="text-white/20">|</span>
            <ShieldCheck className="w-3.5 h-3.5 text-vault-gold-400" />
            <span>256-BIT CULINARY CIPHER</span>
          </div>

          {/* Keypad Dial Trigger */}
          <button
            onClick={() => {
              soundEngine.playTick(1000);
              setShowKeypad(!showKeypad);
            }}
            className="flex items-center space-x-1.5 px-3 py-2 rounded-lg bg-vault-900/80 border border-white/10 hover:border-vault-gold-500/40 text-vault-gold-400 text-xs font-mono backdrop-blur-md transition-all cursor-pointer"
            title="Open Combination Cipher Pad"
          >
            <Binary className="w-3.5 h-3.5" />
            <span className="hidden md:inline">CIPHER DIAL</span>
          </button>

          {/* Sound Mute Toggle Button */}
          <button
            id="sound-toggle-btn"
            onClick={handleMuteToggle}
            onMouseEnter={() => soundEngine.playTick(900)}
            className="p-2.5 rounded-lg bg-vault-900/80 border border-white/10 text-neutral-300 hover:text-vault-gold-400 hover:border-vault-gold-500/40 backdrop-blur-md transition-all duration-200 cursor-pointer"
            title={isMuted ? 'Unmute Mechanical Audio' : 'Mute Mechanical Audio'}
            aria-label="Toggle Sound"
          >
            {isMuted ? (
              <VolumeX className="w-4 h-4 text-neutral-500" />
            ) : (
              <Volume2 className="w-4 h-4 text-vault-gold-400" />
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
          <div className="inline-flex items-center space-x-2 px-4 py-1 rounded-full bg-vault-gold-500/10 border border-vault-gold-500/25 text-vault-gold-400 text-xs font-mono tracking-widest uppercase mb-6 shadow-vault-glow">
            <Sparkles className="w-3 h-3 text-vault-gold-400 animate-spin-slow" />
            <span>Grand Master Gastronomy Repository</span>
          </div>

          {/* Main Title */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-display font-black tracking-tight text-white uppercase drop-shadow-2xl">
            The Recipe <span className="text-gold-gradient">Vault</span>
          </h1>

          <p className="mt-4 text-sm sm:text-base md:text-lg text-vault-steel max-w-2xl font-light leading-relaxed">
            Declassified formulas, molecular precision techniques, and generational kitchen secrets. 
            Protected by mechanical cryo-lock protocols.
          </p>

          {/* Cipher Keypad or Primary Action */}
          <div className="mt-8 flex flex-col items-center">
            {showKeypad ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-5 rounded-2xl bg-vault-950/90 border border-vault-gold-500/40 shadow-2xl backdrop-blur-xl flex flex-col items-center space-y-3 w-72"
              >
                <div className="text-[11px] font-mono text-vault-steel flex items-center space-x-1.5">
                  <Hash className="w-3.5 h-3.5 text-vault-gold-400" />
                  <span>ENTER 3-DIGIT CHEF CIPHER</span>
                </div>

                {/* PIN Display */}
                <div className="flex space-x-3 py-2">
                  {[0, 1, 2].map((idx) => (
                    <div
                      key={idx}
                      className={`w-9 h-11 rounded-lg border flex items-center justify-center font-mono text-lg font-bold ${
                        enteredPin[idx]
                          ? 'bg-vault-gold-500/20 text-vault-gold-300 border-vault-gold-500/60 shadow-neon-gold'
                          : 'bg-vault-900 border-white/10 text-vault-steel/40'
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
                      className="p-2.5 rounded-lg bg-vault-900 hover:bg-vault-800 border border-white/10 hover:border-vault-gold-500/40 text-sm font-mono font-bold text-neutral-200 hover:text-vault-gold-400 transition-all cursor-pointer"
                    >
                      {digit}
                    </button>
                  ))}
                  <button
                    onClick={handleClearPin}
                    className="p-2.5 rounded-lg bg-vault-900 hover:bg-red-950/40 border border-white/10 text-xs font-mono text-red-400 transition-all cursor-pointer"
                  >
                    CLR
                  </button>
                  <button
                    onClick={() => handleKeyPress('0')}
                    className="p-2.5 rounded-lg bg-vault-900 hover:bg-vault-800 border border-white/10 hover:border-vault-gold-500/40 text-sm font-mono font-bold text-neutral-200 hover:text-vault-gold-400 transition-all cursor-pointer"
                  >
                    0
                  </button>
                  <button
                    onClick={handleEnterClick}
                    className="p-2.5 rounded-lg bg-vault-gold-500 hover:bg-vault-gold-400 text-vault-950 text-xs font-mono font-bold transition-all cursor-pointer"
                    title="Bypass Code"
                  >
                    BYP
                  </button>
                </div>
              </motion.div>
            ) : (
              <div className="relative group">
                {/* Glow Aura */}
                <div className="absolute -inset-1 rounded-xl bg-gradient-to-r from-vault-gold-500 to-amber-600 opacity-30 blur-lg group-hover:opacity-75 transition duration-500 group-hover:duration-200 animate-pulse-subtle"></div>

                <button
                  id="enter-archive-btn"
                  onClick={handleEnterClick}
                  disabled={isUnlocking}
                  onMouseEnter={() => soundEngine.playTick(1100)}
                  className={`relative flex items-center space-x-3 px-9 py-4 rounded-xl font-mono text-sm tracking-widest uppercase font-semibold transition-all duration-300 cursor-pointer overflow-hidden ${
                    isUnlocking
                      ? 'bg-vault-gold-500 text-vault-950 shadow-neon-gold scale-95'
                      : 'bg-gradient-to-b from-vault-800 to-vault-900 hover:from-vault-700 hover:to-vault-800 text-vault-gold-300 border border-vault-gold-500/40 hover:border-vault-gold-400 shadow-vault-card hover:shadow-neon-gold hover:scale-[1.03]'
                  }`}
                >
                  {/* Scanline Highlight Shimmer */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out"></div>

                  {isUnlocking ? (
                    <>
                      <Unlock className="w-5 h-5 animate-spin text-vault-950" />
                      <span className="font-bold">DISENGAGING HYDRAULIC LOCKS...</span>
                    </>
                  ) : (
                    <>
                      <Key className="w-4 h-4 text-vault-gold-400 group-hover:rotate-45 transition-transform duration-300" />
                      <span className="tracking-widest">ENTER ARCHIVE</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>

          {/* Interactive Hint */}
          <div className="mt-6 flex items-center space-x-2 text-xs font-mono text-vault-steel/60">
            <Compass className="w-3.5 h-3.5 text-vault-gold-500/50" />
            <span>MOVE CURSOR TO ROTATE 3D VAULT // CLICK TO ENGAGE DOLLY-IN TRANSITION</span>
          </div>
        </motion.div>
      </div>

      {/* Bottom Footer Metadata */}
      <motion.footer
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: isUnlocking ? 0 : 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between pt-6 border-t border-white/5 text-xs font-mono text-vault-steel/60"
      >
        <div className="flex items-center space-x-6">
          <div>
            <span className="text-vault-gold-500/80 font-bold">NODE:</span> VAULT-ALPHA-01
          </div>
          <div>
            <span className="text-vault-gold-500/80 font-bold">TEMP:</span> -18.4°C CRYO
          </div>
          <div className="hidden md:block">
            <span className="text-vault-gold-500/80 font-bold">CHAMBER:</span> HERMETIC
          </div>
        </div>

        <div className="mt-2 sm:mt-0 text-center sm:text-right">
          AUTHENTICATED USER // LEVEL 1 CHEF PROTOCOL
        </div>
      </motion.footer>
    </div>
  );
};
