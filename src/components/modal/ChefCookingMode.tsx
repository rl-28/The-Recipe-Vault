import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Volume2, 
  VolumeX, 
  Play, 
  Pause, 
  RotateCcw, 
  ChevronLeft, 
  ChevronRight, 
  Sparkles, 
  ChefHat, 
  CheckCircle2,
  Mic,
  Clock
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useVault } from '../../context/VaultContext';
import { soundEngine } from '../../utils/soundEngine';

export const ChefCookingMode: React.FC = () => {
  const { isChefModeActive, activeChefRecipe, exitChefMode } = useVault();
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [autoVoice, setAutoVoice] = useState<boolean>(true);

  // Active step timer states
  const [timerSeconds, setTimerSeconds] = useState<number>(0);
  const [timerRunning, setTimerRunning] = useState<boolean>(false);
  const [timerCompleted, setTimerCompleted] = useState<boolean>(false);
  const [timerTotal, setTimerTotal] = useState<number>(0);

  const steps = activeChefRecipe?.steps || [];
  const currentStep = steps[currentStepIndex];

  // Initialize step timer when step changes
  useEffect(() => {
    if (currentStep && currentStep.timerDurationSec) {
      setTimerTotal(currentStep.timerDurationSec);
      setTimerSeconds(currentStep.timerDurationSec);
      setTimerRunning(false);
      setTimerCompleted(false);
    } else {
      setTimerTotal(0);
      setTimerSeconds(0);
      setTimerRunning(false);
      setTimerCompleted(false);
    }

    if (autoVoice && currentStep) {
      speakCurrentStep();
    }
  }, [currentStepIndex, activeChefRecipe]);

  // Interval timer tick
  useEffect(() => {
    let interval: number | undefined;
    if (timerRunning) {
      interval = window.setInterval(() => {
        setTimerSeconds((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            setTimerRunning(false);
            setTimerCompleted(true);
            soundEngine.playTimerAlert();
            confetti({
              particleCount: 75,
              spread: 80,
              origin: { y: 0.6 },
              colors: ['#D4AF37', '#10B981', '#F59E0B', '#FFF'],
            });
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timerRunning]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isChefModeActive) return;

      if (e.key === 'Escape') {
        soundEngine.stopSpeaking();
        exitChefMode();
      } else if (e.key === 'ArrowRight' || e.key === 'n') {
        if (currentStepIndex < steps.length - 1) {
          handleNextStep();
        }
      } else if (e.key === 'ArrowLeft' || e.key === 'p') {
        if (currentStepIndex > 0) {
          handlePrevStep();
        }
      } else if (e.key === ' ' && timerTotal > 0) {
        e.preventDefault();
        handleToggleTimer();
      } else if (e.key === 'v' || e.key === 'V') {
        e.preventDefault();
        toggleSpeech();
      } else if (e.key === 'r' || e.key === 'R') {
        if (timerTotal > 0) {
          handleResetTimer();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isChefModeActive, currentStepIndex, steps.length, timerTotal, timerRunning]);

  if (!isChefModeActive || !activeChefRecipe || !currentStep) return null;

  const speakCurrentStep = () => {
    const textToSpeak = `Step ${currentStep.stepNumber}. ${currentStep.title}. ${currentStep.instruction}. ${
      currentStep.chefTip ? `Master tip: ${currentStep.chefTip}` : ''
    }`;
    setIsSpeaking(true);
    soundEngine.speakText(textToSpeak, () => {
      setIsSpeaking(false);
    });
  };

  const toggleSpeech = () => {
    if (isSpeaking) {
      soundEngine.stopSpeaking();
      setIsSpeaking(false);
    } else {
      speakCurrentStep();
    }
  };

  const handleNextStep = () => {
    soundEngine.stopSpeaking();
    soundEngine.playTick(1300);
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    } else {
      // Completed all steps celebration!
      soundEngine.playAccessGranted();
      confetti({
        particleCount: 120,
        spread: 100,
        origin: { y: 0.5 },
        colors: ['#D4AF37', '#10B981', '#38BDF8', '#FFF'],
      });
    }
  };

  const handlePrevStep = () => {
    soundEngine.stopSpeaking();
    soundEngine.playTick(800);
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  };

  const handleToggleTimer = () => {
    soundEngine.playTick(timerRunning ? 700 : 1200);
    if (timerCompleted) {
      setTimerSeconds(timerTotal);
      setTimerCompleted(false);
      setTimerRunning(true);
    } else {
      setTimerRunning(!timerRunning);
    }
  };

  const handleResetTimer = () => {
    soundEngine.playTick(600);
    setTimerRunning(false);
    setTimerCompleted(false);
    setTimerSeconds(timerTotal);
  };

  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const progressPercent = ((currentStepIndex + 1) / steps.length) * 100;
  const isFinalStep = currentStepIndex === steps.length - 1;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-[#06080D] flex flex-col justify-between text-neutral-100 overflow-hidden font-sans select-none"
      >
        {/* Ambient subtle vignette */}
        <div className="absolute inset-0 bg-radial-vignette opacity-80 pointer-events-none"></div>

        {/* Top Header HUD Bar */}
        <header className="relative z-10 w-full px-6 py-4 border-b border-white/10 vault-glass flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 rounded-xl bg-vault-950 border border-vault-gold-500/40 flex items-center justify-center shadow-neon-gold">
              <ChefHat className="w-5 h-5 text-vault-gold-400" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="px-2 py-0.5 rounded bg-vault-gold-500/20 text-vault-gold-400 text-[10px] font-mono font-bold tracking-widest uppercase">
                  ACTIVE CHEF HUD
                </span>
                <span className="text-xs font-mono text-vault-steel">
                  {activeChefRecipe.vaultCode}
                </span>
              </div>
              <h1 className="text-base font-bold text-white font-sans truncate max-w-md mt-0.5">
                {activeChefRecipe.title}
              </h1>
            </div>
          </div>

          {/* Controls: Voice Toggle, Step Counter, Close */}
          <div className="flex items-center space-x-3">
            {/* Auto-Voice Reading Toggle */}
            <button
              onClick={() => {
                const next = !autoVoice;
                setAutoVoice(next);
                if (!next) soundEngine.stopSpeaking();
              }}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-xl border text-xs font-mono transition-all cursor-pointer ${
                autoVoice
                  ? 'bg-vault-gold-500/20 text-vault-gold-300 border-vault-gold-500/40 shadow-neon-gold'
                  : 'bg-vault-900 text-vault-steel border-white/10'
              }`}
              title="Toggle Auto-Voice reading on step change"
            >
              <Mic className={`w-3.5 h-3.5 ${autoVoice ? 'text-vault-gold-400 animate-pulse' : ''}`} />
              <span className="hidden sm:inline">AUTO-VOICE: {autoVoice ? 'ON' : 'OFF'}</span>
            </button>

            {/* Manual Speak Step Button */}
            <button
              onClick={toggleSpeech}
              className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                isSpeaking
                  ? 'bg-vault-gold-500 text-vault-950 border-vault-gold-400 shadow-neon-gold animate-pulse'
                  : 'bg-vault-900 text-neutral-300 border-white/10 hover:border-vault-gold-500/30'
              }`}
              title={isSpeaking ? 'Stop Voice (V)' : 'Read Step Aloud (V)'}
            >
              {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-vault-gold-400" />}
            </button>

            {/* Exit Chef Mode Button */}
            <button
              onClick={() => {
                soundEngine.stopSpeaking();
                soundEngine.playTick(600);
                exitChefMode();
              }}
              className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-vault-900 hover:bg-red-950/40 border border-white/10 hover:border-red-500/40 text-neutral-300 hover:text-red-400 text-xs font-mono transition-all cursor-pointer"
            >
              <X className="w-4 h-4" />
              <span className="hidden sm:inline">EXIT HUD (ESC)</span>
            </button>
          </div>
        </header>

        {/* Phase Progress Bar at Top */}
        <div className="relative z-10 w-full bg-vault-950/80 border-b border-white/5 px-6 py-2 flex items-center justify-between">
          <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar py-1">
            {steps.map((s, idx) => {
              const isCurrent = idx === currentStepIndex;
              const isDone = idx < currentStepIndex;
              return (
                <button
                  key={s.id}
                  onClick={() => {
                    soundEngine.stopSpeaking();
                    setCurrentStepIndex(idx);
                  }}
                  className={`flex items-center space-x-1.5 px-3 py-1 rounded-lg font-mono text-xs transition-all cursor-pointer whitespace-nowrap ${
                    isCurrent
                      ? 'bg-vault-gold-500 text-vault-950 font-bold shadow-neon-gold scale-105'
                      : isDone
                      ? 'bg-vault-emerald/20 text-vault-emerald border border-vault-emerald/30'
                      : 'bg-vault-900/60 text-vault-steel border border-white/5 hover:border-white/20'
                  }`}
                >
                  <span>0{s.stepNumber}</span>
                  <span className="hidden md:inline font-sans font-medium">{s.title}</span>
                </button>
              );
            })}
          </div>

          <div className="text-xs font-mono text-vault-gold-400 font-bold pl-4 whitespace-nowrap">
            {Math.round(progressPercent)}% COMPLETE
          </div>
        </div>

        {/* Main Center Cooking Workspace */}
        <main className="relative z-10 flex-1 max-w-5xl mx-auto w-full px-6 py-8 flex flex-col justify-center items-center">
          <motion.div
            key={currentStep.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="w-full flex flex-col items-center text-center space-y-6"
          >
            {/* Step Phase Number Badge */}
            <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-vault-gold-500/15 border border-vault-gold-500/40 text-vault-gold-400 text-xs font-mono tracking-widest uppercase">
              <Sparkles className="w-3.5 h-3.5" />
              <span>PROTOCOL PHASE 0{currentStep.stepNumber} OF 0{steps.length}</span>
            </div>

            {/* Giant Step Title */}
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight max-w-3xl">
              {currentStep.title}
            </h2>

            {/* Giant Readable Instruction Typography */}
            <p className="text-lg sm:text-2xl text-neutral-200 font-light leading-relaxed max-w-3xl px-4 py-2 rounded-2xl bg-vault-950/40 border border-white/5 shadow-2xl">
              {currentStep.instruction}
            </p>

            {/* Chef Tip Callout */}
            {currentStep.chefTip && (
              <div className="max-w-2xl px-5 py-3 rounded-xl bg-vault-gold-500/10 border border-vault-gold-500/25 text-left flex items-start space-x-3 text-xs sm:text-sm font-mono text-neutral-200">
                <Sparkles className="w-4 h-4 text-vault-gold-400 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-vault-gold-400 mr-2">CHEF PROTOCOL ADVICE:</span>
                  <span className="italic">{currentStep.chefTip}</span>
                </div>
              </div>
            )}

            {/* Embedded Large Step Countdown Timer (if configured) */}
            {timerTotal > 0 && (
              <div className="mt-4 p-5 rounded-2xl bg-vault-950 border border-vault-gold-500/30 shadow-vault-inner flex flex-col items-center space-y-3 w-full max-w-md">
                <div className="flex items-center space-x-2 text-xs font-mono text-vault-steel">
                  <Clock className="w-4 h-4 text-vault-gold-400" />
                  <span>{currentStep.timerLabel || 'Step Countdown'}</span>
                </div>

                {/* Giant Digital Readout */}
                <div
                  className={`text-5xl sm:text-6xl font-mono font-bold tracking-wider px-6 py-2 rounded-xl transition-all ${
                    timerCompleted
                      ? 'text-vault-emerald bg-vault-emerald/15 animate-bounce'
                      : timerRunning
                      ? 'text-vault-gold-300 bg-vault-900 border border-vault-gold-500/40 shadow-neon-gold'
                      : 'text-neutral-300 bg-vault-900'
                  }`}
                >
                  {formatTimer(timerSeconds)}
                </div>

                {/* Timer Controls */}
                <div className="flex items-center space-x-3 pt-2">
                  <button
                    onClick={handleToggleTimer}
                    className={`flex items-center space-x-2 px-6 py-2.5 rounded-xl font-mono text-xs font-bold transition-all cursor-pointer ${
                      timerRunning
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30'
                        : 'bg-vault-gold-500 text-vault-950 hover:bg-vault-gold-400 shadow-vault-glow'
                    }`}
                  >
                    {timerRunning ? (
                      <>
                        <Pause className="w-4 h-4 fill-current" />
                        <span>PAUSE (SPACE)</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 fill-current" />
                        <span>START TIMER (SPACE)</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={handleResetTimer}
                    className="p-2.5 rounded-xl bg-vault-900 text-vault-steel hover:text-white border border-white/10 transition-all cursor-pointer"
                    title="Reset Timer (R)"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </main>

        {/* Bottom HUD Navigation Controls */}
        <footer className="relative z-10 w-full px-6 py-4 border-t border-white/10 vault-glass flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Keyboard shortcuts reminder */}
          <div className="hidden lg:flex items-center space-x-4 text-[11px] font-mono text-vault-steel">
            <span className="flex items-center space-x-1">
              <kbd className="px-1.5 py-0.5 rounded bg-vault-900 border border-white/10 text-neutral-300">← / P</kbd>
              <span>Prev</span>
            </span>
            <span className="flex items-center space-x-1">
              <kbd className="px-1.5 py-0.5 rounded bg-vault-900 border border-white/10 text-neutral-300">→ / N</kbd>
              <span>Next</span>
            </span>
            <span className="flex items-center space-x-1">
              <kbd className="px-1.5 py-0.5 rounded bg-vault-900 border border-white/10 text-neutral-300">Space</kbd>
              <span>Timer</span>
            </span>
            <span className="flex items-center space-x-1">
              <kbd className="px-1.5 py-0.5 rounded bg-vault-900 border border-white/10 text-neutral-300">V</kbd>
              <span>Voice</span>
            </span>
          </div>

          {/* Prev / Next Big Buttons */}
          <div className="flex items-center space-x-4 w-full sm:w-auto justify-between sm:justify-end">
            <button
              onClick={handlePrevStep}
              disabled={currentStepIndex === 0}
              className="flex items-center space-x-2 px-5 py-3 rounded-xl bg-vault-900 border border-white/10 hover:border-white/20 text-neutral-200 disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer font-mono text-xs font-semibold"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>PREVIOUS PHASE</span>
            </button>

            <button
              onClick={handleNextStep}
              className={`flex items-center space-x-2 px-8 py-3 rounded-xl font-mono text-xs font-bold transition-all cursor-pointer ${
                isFinalStep
                  ? 'bg-vault-emerald text-vault-950 hover:bg-emerald-400 shadow-vault-glow'
                  : 'bg-vault-gold-500 text-vault-950 hover:bg-vault-gold-400 shadow-neon-gold'
              }`}
            >
              {isFinalStep ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>COMPLETE PROTOCOL</span>
                </>
              ) : (
                <>
                  <span>NEXT PHASE</span>
                  <ChevronRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </footer>
      </motion.div>
    </AnimatePresence>
  );
};
