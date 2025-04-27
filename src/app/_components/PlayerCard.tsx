import React, { useState, useEffect, useRef } from 'react';
import { useScore } from "~/context/ScoreContext";
import { useElapsedTime } from 'use-elapsed-time';
import { ArrowPathIcon } from '@heroicons/react/24/outline';

type Player = { id: string; name: string; score: number };

type Props = {
  player: Player;
};

export default function PlayerCard({ player }: Props) {
  const { increment, decrement } = useScore();
  const [pendingChange, setPendingChange] = useState(0);
  // Replace boolean with rotation state (0, 90, 180, 270)
  const [rotation, setRotation] = useState(0);

  // Use refs to always have the latest increment/decrement
  const incrementRef = useRef(increment);
  const decrementRef = useRef(decrement);
  useEffect(() => {
    incrementRef.current = increment;
    decrementRef.current = decrement;
  }, [increment, decrement]);

  // Store applyPendingChanges in a ref so effect only depends on pendingChange
  const applyRef = useRef<() => void>(() => undefined);
  useEffect(() => {
    applyRef.current = () => {
      if (pendingChange > 0) {
        incrementRef.current(player.id, pendingChange);
      } else if (pendingChange < 0) {
        decrementRef.current(player.id, -pendingChange);
      }
      setPendingChange(0);
    };
  }, [pendingChange, player.id]);

  // Timer duration in seconds
  const timerDuration = 2;
  const isPlaying = pendingChange !== 0;
  const { elapsedTime, reset } = useElapsedTime({
    isPlaying,
    duration: timerDuration,
    onComplete: () => {
      applyRef.current();
    },
    updateInterval: 0,
  });

  // Progress for the circle (0 to 1)
  const progress = Math.min(1, elapsedTime / timerDuration);

  const handleScoreChange = (amt: number) => {
    setPendingChange(prev => prev + amt);
    reset(); // restart timer
  };

  const getProgressColor = () => {
    if (pendingChange > 0) return 'stroke-green-500';
    if (pendingChange < 0) return 'stroke-red-500';
    return 'stroke-gray-500';
  };

  // Calculate the circle's properties
  const radius = 24;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - progress);

  const buttons = [-10, -5, -2, -1, 1, 2, 5];

  return (
    <div
      className="flex-1 basis-0 bg-gray-700 rounded-lg p-4 flex flex-col items-center justify-between min-h-72 relative transition-transform duration-500"
      style={{ transform: `rotate(${rotation}deg)` }}
    >
      {/* Rotation button with Heroicons Arrow Path icon */}
      <button
        className="absolute top-2 right-2 z-30 bg-gray-800 bg-opacity-80 rounded-full p-1 hover:bg-gray-600 transition-colors"
        onClick={() => setRotation((r) => (r + 180) % 360)}
        aria-label="Rotate Card"
        type="button"
      >
        {/* Heroicons Arrow Path icon from heroicons/react */}
        <ArrowPathIcon className="w-6 h-6 text-white" />
      </button>
      <div className="flex flex-col items-center flex-1 w-full">
        <div className="text-lg font-semibold mb-2">{player.name}</div>
        <div className="text-9xl font-extrabold mb-1">{player.score}</div>
      </div>
      {/* Floating pending change with circular progress */}
      {pendingChange !== 0 && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
          {/* Add a background for visibility */}
          <div className="w-20 h-20 flex items-center justify-center relative">
            <div className="absolute inset-0 rounded-full bg-gray-900 bg-opacity-70 z-0" />
            {/* SVG Circular progress bar */}
            <svg className="w-full h-full -rotate-90 absolute z-10">
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
                className={`transition-all duration-10 ${getProgressColor()}`}
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
              />
            </svg>
            {/* Text in the middle of circle */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20">
              <span className={`text-2xl font-bold ${pendingChange > 0 ? 'text-green-400' : 'text-red-400'}`}>
                {pendingChange > 0 ? '+' : ''}{pendingChange}
              </span>
            </div>
          </div>
        </div>
      )}
      <div className="flex flex-row gap-2 justify-center mt-4 w-full">
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
