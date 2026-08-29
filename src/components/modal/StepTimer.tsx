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
              colors: ['#F59E0B', '#10B981', '#FB923C'],
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
    <div className="mt-3 p-3.5 rounded-2xl bg-amber-50/50 border border-amber-200/60 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
      {/* Label and Status */}
      <div className="flex items-center space-x-3 w-full sm:w-auto">
        {/* Circular Progress Indicator */}
        <div className="relative w-10 h-10 flex-shrink-0 flex items-center justify-center">
          <svg className="w-10 h-10 transform -rotate-90" viewBox="0 0 36 36">
            <path
              className="text-stone-200"
              strokeWidth="3.5"
              stroke="currentColor"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            <path
              className={`${
                isCompleted ? 'text-emerald-500' : 'text-amber-500'
              } transition-all duration-300`}
              strokeDasharray="100, 100"
              strokeDashoffset={strokeDashoffset}
              strokeWidth="3.5"
              strokeLinecap="round"
              stroke="currentColor"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            {isCompleted ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 animate-bounce" />
            ) : (
              <Clock className="w-4 h-4 text-amber-600" />
            )}
          </div>
        </div>

        <div>
          <div className="text-xs font-bold text-stone-800">
            {label}
          </div>
          <div className="text-[11px] text-stone-500">
            Step {stepNumber} Timer
          </div>
        </div>
      </div>

      {/* Timer Display & Controls */}
      <div className="flex items-center space-x-3 w-full sm:w-auto justify-between sm:justify-end">
        {/* Time Digits */}
        <div
          className={`font-mono text-base sm:text-lg font-bold px-3 py-1 rounded-xl border ${
            isCompleted
              ? 'text-emerald-700 border-emerald-200 bg-emerald-50 animate-pulse'
              : isRunning
              ? 'text-amber-700 border-amber-300 bg-amber-50 shadow-xs'
              : 'text-stone-700 border-stone-200 bg-white'
          }`}
        >
          {formatTime(timeLeft)}
        </div>

        {/* Buttons */}
        <div className="flex items-center space-x-1.5">
          <button
            onClick={togglePlayPause}
            className={`p-2 rounded-xl text-xs font-semibold flex items-center space-x-1 transition-all duration-200 cursor-pointer shadow-xs ${
              isRunning
                ? 'bg-amber-100 text-amber-800 border border-amber-300 hover:bg-amber-200'
                : 'bg-amber-500 text-white hover:bg-amber-600 shadow-amber-500/20'
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
            className="p-2 rounded-xl bg-white text-stone-600 hover:text-stone-900 border border-stone-200 transition-all cursor-pointer shadow-xs"
            title="Reset Timer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
