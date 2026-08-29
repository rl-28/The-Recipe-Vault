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
              particleCount: 85,
              spread: 80,
              origin: { y: 0.6 },
              colors: ['#F59E0B', '#10B981', '#FB923C', '#8B5CF6'],
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
      currentStep.chefTip ? `Chef tip: ${currentStep.chefTip}` : ''
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
        particleCount: 140,
        spread: 100,
        origin: { y: 0.5 },
        colors: ['#F59E0B', '#10B981', '#38BDF8', '#8B5CF6'],
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
        className="fixed inset-0 z-50 bg-[#FAF7F2] flex flex-col justify-between text-stone-900 overflow-hidden font-sans select-none"
      >
        {/* Top Header HUD Bar */}
        <header className="relative z-10 w-full px-6 py-4 border-b border-stone-200/80 bg-white/90 backdrop-blur-md flex items-center justify-between shadow-xs">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center shadow-xs">
              <ChefHat className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[11px] font-bold tracking-wide">
                  CHEF KITCHEN HUD
                </span>
                <span className="text-xs text-stone-500 font-medium">
                  {activeChefRecipe.category}
                </span>
              </div>
              <h1 className="text-base font-bold text-stone-900 truncate max-w-md mt-0.5">
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
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl border text-xs font-semibold transition-all cursor-pointer shadow-xs ${
                autoVoice
                  ? 'bg-amber-50 text-amber-800 border-amber-300'
                  : 'bg-white text-stone-500 border-stone-200'
              }`}
              title="Toggle Auto-Voice reading on step change"
            >
              <Mic className={`w-3.5 h-3.5 ${autoVoice ? 'text-amber-600 animate-pulse' : ''}`} />
              <span className="hidden sm:inline">Voice: {autoVoice ? 'ON' : 'OFF'}</span>
            </button>

            {/* Manual Speak Step Button */}
            <button
              onClick={toggleSpeech}
              className={`p-2.5 rounded-xl border transition-all cursor-pointer shadow-xs ${
                isSpeaking
                  ? 'bg-amber-500 text-white border-amber-600 shadow-md animate-pulse'
                  : 'bg-white text-stone-700 border-stone-200 hover:border-amber-400 hover:text-amber-600'
              }`}
              title={isSpeaking ? 'Stop Voice (V)' : 'Read Step Aloud (V)'}
            >
              {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-amber-600" />}
            </button>

            {/* Exit Chef Mode Button */}
            <button
              onClick={() => {
                soundEngine.stopSpeaking();
                soundEngine.playTick(600);
                exitChefMode();
              }}
              className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 border border-stone-200 text-stone-700 text-xs font-medium transition-all cursor-pointer"
            >
              <X className="w-4 h-4" />
              <span className="hidden sm:inline">Exit (Esc)</span>
            </button>
          </div>
        </header>

        {/* Phase Progress Bar at Top */}
        <div className="relative z-10 w-full bg-white/80 border-b border-stone-200/80 px-6 py-2.5 flex items-center justify-between shadow-xs">
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
                  className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl text-xs transition-all cursor-pointer whitespace-nowrap shadow-xs ${
                    isCurrent
                      ? 'bg-amber-500 text-white font-bold shadow-md shadow-amber-500/20 scale-105'
                      : isDone
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 font-medium'
                      : 'bg-white text-stone-600 border border-stone-200 hover:border-stone-300'
                  }`}
                >
                  <span className="font-bold">Step {s.stepNumber}</span>
                  <span className="hidden md:inline font-normal">• {s.title}</span>
                </button>
              );
            })}
          </div>

          <div className="text-xs text-amber-700 font-bold pl-4 whitespace-nowrap">
            {Math.round(progressPercent)}% Done
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
            <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold tracking-wide">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>STEP {currentStep.stepNumber} OF {steps.length}</span>
            </div>

            {/* Giant Step Title */}
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-stone-900 tracking-tight leading-tight max-w-3xl">
              {currentStep.title}
            </h2>

            {/* Giant Readable Instruction Typography */}
            <p className="text-lg sm:text-2xl text-stone-700 font-normal leading-relaxed max-w-3xl px-6 py-4 rounded-3xl bg-white border border-stone-200 shadow-md">
              {currentStep.instruction}
            </p>

            {/* Chef Tip Callout */}
            {currentStep.chefTip && (
              <div className="max-w-2xl px-5 py-3.5 rounded-2xl bg-amber-50/90 border border-amber-200 text-left flex items-start space-x-3 text-xs sm:text-sm text-amber-950 shadow-xs">
                <Sparkles className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-amber-800 mr-2">Chef's Advice:</span>
                  <span className="italic">{currentStep.chefTip}</span>
                </div>
              </div>
            )}

            {/* Embedded Large Step Countdown Timer (if configured) */}
            {timerTotal > 0 && (
              <div className="mt-4 p-6 rounded-3xl bg-white border border-stone-200 shadow-md flex flex-col items-center space-y-3 w-full max-w-md">
                <div className="flex items-center space-x-2 text-xs font-semibold text-stone-500">
                  <Clock className="w-4 h-4 text-amber-500" />
                  <span>{currentStep.timerLabel || 'Step Countdown'}</span>
                </div>

                {/* Giant Digital Readout */}
                <div
                  className={`text-5xl sm:text-6xl font-mono font-bold tracking-wider px-6 py-2 rounded-2xl transition-all ${
                    timerCompleted
                      ? 'text-emerald-700 bg-emerald-50 border border-emerald-200 animate-bounce'
                      : timerRunning
                      ? 'text-amber-700 bg-amber-50 border border-amber-300 shadow-sm'
                      : 'text-stone-800 bg-stone-50 border border-stone-200'
                  }`}
                >
                  {formatTimer(timerSeconds)}
                </div>

                {/* Timer Controls */}
                <div className="flex items-center space-x-3 pt-2">
                  <button
                    onClick={handleToggleTimer}
                    className={`flex items-center space-x-2 px-6 py-3 rounded-full font-sans text-xs font-bold transition-all cursor-pointer shadow-md ${
                      timerRunning
                        ? 'bg-amber-100 text-amber-800 border border-amber-300 hover:bg-amber-200'
                        : 'bg-amber-500 text-white hover:bg-amber-600 shadow-amber-500/25'
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
                    className="p-3 rounded-full bg-stone-100 text-stone-600 hover:text-stone-900 border border-stone-200 transition-all cursor-pointer"
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
        <footer className="relative z-10 w-full px-6 py-4 border-t border-stone-200/80 bg-white/90 backdrop-blur-md flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
          {/* Keyboard shortcuts reminder */}
          <div className="hidden lg:flex items-center space-x-4 text-xs font-medium text-stone-500">
            <span className="flex items-center space-x-1">
              <kbd className="px-2 py-0.5 rounded-md bg-stone-100 border border-stone-200 text-stone-700">← / P</kbd>
              <span>Prev</span>
            </span>
            <span className="flex items-center space-x-1">
              <kbd className="px-2 py-0.5 rounded-md bg-stone-100 border border-stone-200 text-stone-700">→</kbd>
              <span>Next</span>
            </span>
            <span className="flex items-center space-x-1">
              <kbd className="px-2 py-0.5 rounded-md bg-stone-100 border border-stone-200 text-stone-700">Space</kbd>
              <span>Timer</span>
            </span>
            <span className="flex items-center space-x-1">
              <kbd className="px-2 py-0.5 rounded-md bg-stone-100 border border-stone-200 text-stone-700">V</kbd>
              <span>Voice</span>
            </span>
          </div>

          {/* Prev / Next Big Buttons */}
          <div className="flex items-center space-x-4 w-full sm:w-auto justify-between sm:justify-end">
            <button
              onClick={handlePrevStep}
              disabled={currentStepIndex === 0}
              className="flex items-center space-x-2 px-6 py-3 rounded-full bg-white border border-stone-200 hover:bg-stone-50 text-stone-700 disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer font-sans text-xs font-bold shadow-xs"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous Step</span>
            </button>

            <button
              onClick={handleNextStep}
              className={`flex items-center space-x-2 px-8 py-3 rounded-full font-sans text-xs font-bold transition-all cursor-pointer shadow-md ${
                isFinalStep
                  ? 'bg-emerald-500 text-white hover:bg-emerald-600 shadow-emerald-500/25'
                  : 'bg-amber-500 text-white hover:bg-amber-600 shadow-amber-500/25'
              }`}
            >
              {isFinalStep ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Finish Recipe</span>
                </>
              ) : (
                <>
                  <span>Next Step</span>
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
