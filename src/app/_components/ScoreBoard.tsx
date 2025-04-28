"use client";
import React, { useEffect, useState } from "react";
import { useScore } from "~/context/ScoreContext";
import PlayerCard from "./PlayerCard";

import { ClockIcon } from "@heroicons/react/24/outline";
import ScoreHistory from "./ScoreHistory";
import GameSettingsModal from "./GameSettingsModal";
import { Cog6ToothIcon } from "@heroicons/react/24/outline";

export default function ScoreBoard() {
  const { state, addPlayer } = useScore();
  const [showHistory, setShowHistory] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  // Initialize with two default players
  useEffect(() => {
    if (state.players.length === 0) {
      addPlayer("player-1", "Player 1");
      addPlayer("player-2", "Player 2");
    }
  }, [state.players.length, addPlayer]);

  return (
    <div className="h-screen flex flex-col bg-gray-900 text-white">
      <header className="flex items-center justify-between bg-gray-800 p-2">
        <h1 className="text-xl font-bold">Score Keeper</h1>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowHistory(true)}
            className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700 flex items-center justify-center"
            aria-label="Show Score History"
          >
            <ClockIcon className="h-6 w-6 text-white" />
          </button>
          <button
            onClick={() => setShowSettings(true)}
            className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600 flex items-center justify-center"
            aria-label="Game Settings"
          >
            <Cog6ToothIcon className="h-6 w-6 text-white" />
          </button>
        </div>
      </header>
      <main className="flex-1 overflow-auto p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 h-full">
          {state.players.map((p) => (
            <PlayerCard key={p.id} player={p} />
          ))}
        </div>
      </main>
      {showHistory && <ScoreHistory onClose={() => setShowHistory(false)} />}
      {showSettings && <GameSettingsModal onClose={() => setShowSettings(false)} />}
    </div>
  );
}