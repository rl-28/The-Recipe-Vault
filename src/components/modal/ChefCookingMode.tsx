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
              colors: ['#FFE68C', '#FFAAA6', '#BBE1FA', '#D4F1F4', '#E8D7F1'],
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
      // Completed celebration!
      soundEngine.playAccessGranted();
      confetti({
        particleCount: 140,
        spread: 100,
        origin: { y: 0.5 },
        colors: ['#FFE68C', '#FFAAA6', '#BBE1FA', '#D4F1F4'],
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
        className="fixed inset-0 z-50 bg-[#FAF7F0] flex flex-col justify-between text-black overflow-hidden font-sans select-none"
      >
        {/* Top Header HUD Bar */}
        <header className="relative z-10 w-full px-6 py-4 border-b-[2.5px] border-black bg-[#FFFDF8] flex items-center justify-between shadow-xs">
          <div className="flex items-center space-x-4">
            <div className="w-11 h-11 rounded-2xl bg-[#FFE68C] border-2 border-black flex items-center justify-center shadow-[2px_2px_0px_#000]">
              <ChefHat className="w-6 h-6 text-black stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="px-2.5 py-0.5 rounded-lg bg-[#FFE68C] border border-black text-[11px] font-hand font-extrabold text-black">
                  CHEF KITCHEN HUD 🍳
                </span>
                <span className="text-xs font-doodle font-bold text-stone-600">
                  {activeChefRecipe.category}
                </span>
              </div>
              <h1 className="text-base font-hand font-extrabold text-black truncate max-w-md mt-0.5">
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
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-2xl border-2 border-black text-xs font-hand font-bold transition-all cursor-pointer shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none ${
                autoVoice
                  ? 'bg-[#FFE68C] text-black'
                  : 'bg-white text-stone-500'
              }`}
              title="Toggle Auto-Voice reading on step change"
            >
              <Mic className={`w-3.5 h-3.5 ${autoVoice ? 'text-black animate-pulse' : ''}`} />
              <span className="hidden sm:inline">Voice: {autoVoice ? 'ON' : 'OFF'}</span>
            </button>

            {/* Manual Speak Step Button */}
            <button
              onClick={toggleSpeech}
              className={`p-2.5 rounded-2xl border-2 border-black transition-all cursor-pointer shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none ${
                isSpeaking
                  ? 'bg-[#FFAAA6] text-black animate-pulse'
                  : 'bg-white text-black hover:bg-[#FFE68C]'
              }`}
              title={isSpeaking ? 'Stop Voice (V)' : 'Read Step Aloud (V)'}
            >
              {isSpeaking ? <VolumeX className="w-4 h-4 stroke-[2.5]" /> : <Volume2 className="w-4 h-4 stroke-[2.5]" />}
            </button>

            {/* Exit Chef Mode Button */}
            <button
              onClick={() => {
                soundEngine.stopSpeaking();
                soundEngine.playTick(600);
                exitChefMode();
              }}
              className="flex items-center space-x-1.5 px-4 py-2 rounded-2xl bg-[#FFAAA6] border-2 border-black text-black text-xs font-hand font-extrabold shadow-[2px_2px_0px_#000] hover:bg-rose-300 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
            >
              <X className="w-4 h-4 stroke-[2.5]" />
              <span className="hidden sm:inline">Exit (Esc)</span>
            </button>
          </div>
        </header>

        {/* Phase Progress Bar at Top */}
        <div className="relative z-10 w-full bg-[#FAF7F0] border-b-2 border-black px-6 py-2.5 flex items-center justify-between">
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
                  className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-2xl text-xs font-hand font-bold transition-all cursor-pointer whitespace-nowrap border-2 border-black shadow-[1.5px_1.5px_0px_#000] ${
                    isCurrent
                      ? 'bg-[#FFE68C] text-black scale-105 shadow-[2px_2px_0px_#000]'
                      : isDone
                      ? 'bg-[#D4F1F4] text-black'
                      : 'bg-white text-stone-600'
                  }`}
                >
                  <span className="font-extrabold">Step {s.stepNumber}</span>
                  <span className="hidden md:inline font-normal">• {s.title}</span>
                </button>
              );
            })}
          </div>

          <div className="text-xs font-hand font-extrabold text-black pl-4 whitespace-nowrap bg-[#FFE68C] px-3 py-1 rounded-xl border border-black shadow-[1px_1px_0px_#000]">
            {Math.round(progressPercent)}% Done
          </div>
        </div>

        {/* Main Center Cooking Workspace */}
        <main className="relative z-10 flex-1 max-w-4xl mx-auto w-full px-6 py-8 flex flex-col justify-center items-center">
          <motion.div
            key={currentStep.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="w-full flex flex-col items-center text-center space-y-6"
          >
            {/* Step Phase Number Badge */}
            <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-2xl bg-[#FFE68C] border-2 border-black text-black text-xs font-hand font-extrabold shadow-[2px_2px_0px_#000]">
              <Sparkles className="w-4 h-4 stroke-[2.5]" />
              <span>STEP {currentStep.stepNumber} OF {steps.length}</span>
            </div>

            {/* Giant Step Title */}
            <h2 className="text-3xl sm:text-5xl md:text-6xl font-hand font-extrabold text-black tracking-tight leading-tight max-w-3xl">
              {currentStep.title}
            </h2>

            {/* Giant Readable Instruction Typography */}
            <p className="text-lg sm:text-2xl text-stone-800 font-doodle font-bold leading-relaxed max-w-3xl px-8 py-5 rounded-3xl bg-[#FFFDF8] border-[2.5px] border-black shadow-[4px_4px_0px_#000]">
              {currentStep.instruction}
            </p>

            {/* Chef Tip Callout */}
            {currentStep.chefTip && (
              <div className="max-w-2xl px-5 py-3 rounded-2xl bg-[#FFE68C] border-2 border-black text-left flex items-start space-x-3 text-xs sm:text-sm text-black shadow-[3px_3px_0px_#000]">
                <Sparkles className="w-4 h-4 stroke-[2.5] flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-hand font-extrabold mr-2">Chef's Advice:</span>
                  <span className="font-doodle font-bold italic">{currentStep.chefTip}</span>
                </div>
              </div>
            )}

            {/* Embedded Step Countdown Timer */}
            {timerTotal > 0 && (
              <div className="mt-4 p-6 rounded-3xl bg-[#FFFDF8] border-[2.5px] border-black shadow-[4px_4px_0px_#000] flex flex-col items-center space-y-3 w-full max-w-md">
                <div className="flex items-center space-x-2 text-xs font-hand font-extrabold text-black">
                  <Clock className="w-4 h-4 stroke-[2.5]" />
                  <span>{currentStep.timerLabel || 'Step Countdown'}</span>
                </div>

                {/* Giant Digital Readout */}
                <div
                  className={`text-5xl sm:text-6xl font-mono font-bold tracking-wider px-8 py-2 rounded-2xl border-2 border-black shadow-[3px_3px_0px_#000] transition-all ${
                    timerCompleted
                      ? 'bg-[#D4F1F4] text-black animate-bounce'
                      : timerRunning
                      ? 'bg-[#FFE68C] text-black'
                      : 'bg-white text-black'
                  }`}
                >
                  {formatTimer(timerSeconds)}
                </div>

                {/* Timer Controls */}
                <div className="flex items-center space-x-3 pt-2">
                  <button
                    onClick={handleToggleTimer}
                    className={`flex items-center space-x-2 px-6 py-3 rounded-2xl font-hand font-extrabold text-sm border-2 border-black shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer ${
                      timerRunning
                        ? 'bg-[#FFAAA6] text-black hover:bg-rose-300'
                        : 'bg-[#FFE68C] text-black hover:bg-amber-300'
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
                    className="p-3 rounded-2xl bg-white text-black border-2 border-black shadow-[2px_2px_0px_#000] hover:bg-[#FAF7F0] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
                    title="Reset Timer (R)"
                  >
                    <RotateCcw className="w-4 h-4 stroke-[2.5]" />
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </main>

        {/* Bottom HUD Navigation Controls */}
        <footer className="relative z-10 w-full px-6 py-4 border-t-[2.5px] border-black bg-[#FFFDF8] flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
          {/* Keyboard shortcuts reminder */}
          <div className="hidden lg:flex items-center space-x-4 text-xs font-hand font-bold text-black">
            <span className="flex items-center space-x-1">
              <kbd className="px-2 py-0.5 rounded-md bg-[#FFE68C] border border-black">← / P</kbd>
              <span>Prev</span>
            </span>
            <span className="flex items-center space-x-1">
              <kbd className="px-2 py-0.5 rounded-md bg-[#FFE68C] border border-black">→</kbd>
              <span>Next</span>
            </span>
            <span className="flex items-center space-x-1">
              <kbd className="px-2 py-0.5 rounded-md bg-[#FFE68C] border border-black">Space</kbd>
              <span>Timer</span>
            </span>
            <span className="flex items-center space-x-1">
              <kbd className="px-2 py-0.5 rounded-md bg-[#FFE68C] border border-black">V</kbd>
              <span>Voice</span>
            </span>
          </div>

          {/* Prev / Next Big Buttons */}
          <div className="flex items-center space-x-4 w-full sm:w-auto justify-between sm:justify-end">
            <button
              onClick={handlePrevStep}
              disabled={currentStepIndex === 0}
              className="flex items-center space-x-2 px-6 py-3 rounded-2xl bg-white border-2 border-black text-black disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer font-hand font-extrabold text-xs shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
            >
              <ChevronLeft className="w-4 h-4 stroke-[3]" />
              <span>Previous Step</span>
            </button>

            <button
              onClick={handleNextStep}
              className={`flex items-center space-x-2 px-8 py-3 rounded-2xl font-hand font-extrabold text-xs border-2 border-black transition-all cursor-pointer shadow-[3px_3px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none ${
                isFinalStep
                  ? 'bg-[#D4F1F4] text-black hover:bg-cyan-200'
                  : 'bg-[#FFE68C] text-black hover:bg-amber-300'
              }`}
            >
              {isFinalStep ? (
                <>
                  <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
                  <span>Finish Recipe 🎉</span>
                </>
              ) : (
                <>
                  <span>Next Step</span>
                  <ChevronRight className="w-4 h-4 stroke-[3]" />
                </>
              )}
            </button>
          </div>
        </footer>
      </motion.div>
    </AnimatePresence>
  );
};
