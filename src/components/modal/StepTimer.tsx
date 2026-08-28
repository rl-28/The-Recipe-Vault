import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, CheckCircle2, Clock } from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundEngine } from '../../utils/soundEngine';

interface StepTimerProps {
  durationSeconds: number;
  label?: string;
  stepNumber: number;
}

export const StepTimer: React.FC<StepTimerProps> = ({
  durationSeconds,
  label = 'Step Timer',
  stepNumber,
}) => {
  const [timeLeft, setTimeLeft] = useState<number>(durationSeconds);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const intervalRef = useRef<number | null>(null);

  // Format seconds to HH:MM:SS or MM:SS
  const formatTime = (secs: number) => {
    const hours = Math.floor(secs / 3600);
    const minutes = Math.floor((secs % 3600) / 60);
    const seconds = secs % 60;

    if (hours > 0) {
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = window.setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(intervalRef.current!);
            setIsRunning(false);
            setIsCompleted(true);
            soundEngine.playTimerAlert();
            confetti({
              particleCount: 50,
              spread: 60,
              origin: { y: 0.7 },
              colors: ['#D4AF37', '#F59E0B', '#FFF'],
            });
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning]);

  const togglePlayPause = () => {
    soundEngine.playTick(isRunning ? 800 : 1200);
    if (isCompleted) {
      setTimeLeft(durationSeconds);
      setIsCompleted(false);
      setIsRunning(true);
    } else {
      setIsRunning(!isRunning);
    }
  };

  const handleReset = () => {
    soundEngine.playTick(600);
    if (intervalRef.current) clearInterval(intervalRef.current);
    setIsRunning(false);
    setIsCompleted(false);
    setTimeLeft(durationSeconds);
  };

  // Progress percentage (0 to 1)
  const progress = (durationSeconds - timeLeft) / durationSeconds;
  const strokeDashoffset = 100 - progress * 100;

  return (
    <div className="mt-3 p-3.5 rounded-xl bg-vault-950/80 border border-vault-gold-500/20 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-vault-inner">
      {/* Label and Status */}
      <div className="flex items-center space-x-3 w-full sm:w-auto">
        {/* Circular Progress Indicator */}
        <div className="relative w-10 h-10 flex-shrink-0 flex items-center justify-center">
          <svg className="w-10 h-10 transform -rotate-90" viewBox="0 0 36 36">
            <path
              className="text-vault-800"
              strokeWidth="3"
              stroke="currentColor"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            <path
              className={`${
                isCompleted ? 'text-vault-emerald' : 'text-vault-gold-400'
              } transition-all duration-300`}
              strokeDasharray="100, 100"
              strokeDashoffset={strokeDashoffset}
              strokeWidth="3"
              strokeLinecap="round"
              stroke="currentColor"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            {isCompleted ? (
              <CheckCircle2 className="w-4 h-4 text-vault-emerald animate-bounce" />
            ) : (
              <Clock className="w-4 h-4 text-vault-gold-400/80" />
            )}
          </div>
        </div>

        <div>
          <div className="text-xs font-mono font-semibold text-neutral-200">
            {label}
          </div>
          <div className="text-[10px] font-mono text-vault-steel">
            Step {stepNumber} Protocol Countdown
          </div>
        </div>
      </div>

      {/* Timer Display & Controls */}
      <div className="flex items-center space-x-3 w-full sm:w-auto justify-between sm:justify-end">
        {/* Time Digits */}
        <div
          className={`font-mono text-base sm:text-lg font-bold px-3 py-1 rounded-lg bg-vault-900 border ${
            isCompleted
              ? 'text-vault-emerald border-vault-emerald/40 bg-vault-emerald/10 animate-pulse'
              : isRunning
              ? 'text-vault-gold-300 border-vault-gold-500/40 shadow-neon-gold'
              : 'text-neutral-300 border-white/10'
          }`}
        >
          {formatTime(timeLeft)}
        </div>

        {/* Buttons */}
        <div className="flex items-center space-x-1.5">
          <button
            onClick={togglePlayPause}
            className={`p-2 rounded-lg font-mono text-xs font-semibold flex items-center space-x-1 transition-all duration-200 cursor-pointer ${
              isRunning
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30'
                : 'bg-vault-gold-500 text-vault-950 font-bold hover:bg-vault-gold-400 shadow-vault-glow'
            }`}
            title={isRunning ? 'Pause Timer' : 'Start Timer'}
          >
            {isRunning ? (
              <Pause className="w-3.5 h-3.5 fill-current" />
            ) : (
              <Play className="w-3.5 h-3.5 fill-current" />
            )}
          </button>

          <button
            onClick={handleReset}
            className="p-2 rounded-lg bg-vault-900 text-vault-steel hover:text-white border border-white/10 hover:border-white/20 transition-all cursor-pointer"
            title="Reset Timer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
