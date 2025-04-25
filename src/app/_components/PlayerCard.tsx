import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useScore } from "~/context/ScoreContext";

type Player = { id: string; name: string; score: number };

type Props = {
  player: Player;
  buttons: number[];
};

export default function PlayerCard({ player, buttons }: Props) {
  const { increment, decrement } = useScore();
  const [pendingChange, setPendingChange] = useState(0);
  const [progress, setProgress] = useState(100);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  const applyPendingChanges = useCallback(() => {
    if (pendingChange > 0) {
      increment(player.id, pendingChange);
    } else if (pendingChange < 0) {
      decrement(player.id, -pendingChange);
    }
    setPendingChange(0);
    setProgress(100);
  }, [increment, decrement, pendingChange, player.id]);
  
  // Reset timer when pendingChange changes
  useEffect(() => {
    if (pendingChange === 0) return;

    // Clear any existing timer
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      clearInterval(timerRef.current);
    }

    // Reset progress bar
    setProgress(0);

    // Start progress animation
    const startTime = Date.now();
    const duration = 2000; // 2 seconds
    
    const intervalId = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const newProgress = Math.min(100, (elapsed / duration) * 100);
      setProgress(newProgress);
      
      if (elapsed >= duration) {
        clearInterval(intervalId);
      }
    }, 16);

    // Set timer to apply changes after 1 second
    timerRef.current = setTimeout(() => {
      applyPendingChanges();
      clearInterval(intervalId);
    }, duration);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        clearInterval(intervalId);
      }
    };
  }, [pendingChange, applyPendingChanges]);

  const handleScoreChange = (amt: number) => {
    setPendingChange(prev => prev + amt);
  };

  const getProgressColor = () => {
    if (pendingChange > 0) return 'stroke-green-500';
    if (pendingChange < 0) return 'stroke-red-500';
    return 'stroke-gray-500';
  };

  // Calculate the circle's properties
  const calculateCircleProgress = () => {
    const radius = 24; // Circle radius
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference * (1 - progress / 100);
    
    return {
      radius,
      circumference,
      strokeDashoffset
    };
  };

  const { radius, circumference, strokeDashoffset } = calculateCircleProgress();

  return (
    <div className="flex-1 basis-0 bg-gray-700 rounded-lg p-4 flex flex-col items-center justify-between min-h-72 relative">
      <div className="flex flex-col items-center flex-1 w-full">
        <div className="text-lg font-semibold mb-2">{player.name}</div>
        <div className="text-6xl font-extrabold mb-1">{player.score}</div>
      </div>
      
      {/* Floating pending change with circular progress */}
      {pendingChange !== 0 && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
          <div className="w-20 h-20 flex items-center justify-center">
            {/* SVG Circular progress bar */}
            <svg className="w-full h-full -rotate-90 absolute">
              {/* Background circle */}
              <circle 
                cx="40" 
                cy="40" 
                r={radius} 
                strokeWidth="4"
                stroke="#4B5563" 
                fill="none"
              />
              {/* Progress circle */}
              <circle 
                cx="40" 
                cy="40" 
                r={radius} 
                strokeWidth="4"
                stroke="currentColor" 
                fill="none"
                strokeLinecap="round"
                className={`transition-all duration-100 ${getProgressColor()}`}
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
              />
            </svg>
            
            {/* Text in the middle of circle */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
              <span className={`text-2xl font-bold ${pendingChange > 0 ? 'text-green-400' : 'text-red-400'}`}>
                {pendingChange > 0 ? '+' : ''}{pendingChange}
              </span>
            </div>
          </div>
        </div>
      )}
      
      <div className="flex flex-wrap gap-2 justify-center mt-4 w-full">
        {buttons.map((amt) => (
          <button
            key={amt}
            onClick={(e) => {
              console.log(`Button clicked: ${amt} timestamp: ${Date.now()} detail: ${e.detail}`);
              handleScoreChange(amt);
            }}
            className={`w-12 h-12 rounded hover:bg-opacity-80 ${amt > 0
              ? 'bg-green-500 text-white hover:bg-green-600'
              : 'bg-red-500 text-white hover:bg-red-600'
              }`}
          >
            {amt > 0 ? `+${amt}` : amt}
          </button>
        ))}
      </div>
    </div>
  );
}
