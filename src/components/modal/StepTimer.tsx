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
              colors: ['#FFE68C', '#FFAAA6', '#BBE1FA', '#D4F1F4'],
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
    <div className="mt-3 p-3.5 rounded-2xl bg-[#FAF7F0] border-2 border-black flex flex-col sm:flex-row items-center justify-between gap-3 shadow-[2px_2px_0px_#000] font-sans">
      {/* Label and Status */}
      <div className="flex items-center space-x-3 w-full sm:w-auto">
        {/* Circular Progress Indicator */}
        <div className="relative w-10 h-10 flex-shrink-0 flex items-center justify-center">
          <svg className="w-10 h-10 transform -rotate-90" viewBox="0 0 36 36">
            <path
              className="text-stone-300"
              strokeWidth="4"
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
              strokeWidth="4"
              strokeLinecap="round"
              stroke="currentColor"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            {isCompleted ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 animate-bounce stroke-[2.5]" />
            ) : (
              <Clock className="w-4 h-4 text-black stroke-[2.5]" />
            )}
          </div>
        </div>

        <div>
          <div className="text-xs font-hand font-extrabold text-black">
            {label}
          </div>
          <div className="text-[11px] font-doodle font-bold text-stone-600">
            Step {stepNumber} Timer
          </div>
        </div>
      </div>

      {/* Timer Display & Controls */}
      <div className="flex items-center space-x-3 w-full sm:w-auto justify-between sm:justify-end">
        {/* Time Digits */}
        <div
          className={`font-mono text-base font-bold px-3 py-1 rounded-xl border-2 border-black shadow-[1.5px_1.5px_0px_#000] ${
            isCompleted
              ? 'bg-[#D4F1F4] text-black animate-pulse'
              : isRunning
              ? 'bg-[#FFE68C] text-black'
              : 'bg-white text-black'
          }`}
        >
          {formatTime(timeLeft)}
        </div>

        {/* Buttons */}
        <div className="flex items-center space-x-1.5">
          <button
            onClick={togglePlayPause}
            className={`p-2 rounded-xl border-2 border-black transition-all cursor-pointer shadow-[1.5px_1.5px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none ${
              isRunning
                ? 'bg-[#FFAAA6] text-black hover:bg-rose-300'
                : 'bg-[#FFE68C] text-black hover:bg-amber-300'
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
            className="p-2 rounded-xl bg-white text-black border-2 border-black shadow-[1.5px_1.5px_0px_#000] hover:bg-stone-100 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
            title="Reset Timer"
          >
            <RotateCcw className="w-3.5 h-3.5 stroke-[2.5]" />
          </button>
        </div>
      </div>
    </div>
  );
};
