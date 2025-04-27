"use client";
import React, { useEffect, useState } from "react";
import { useScore } from "~/context/ScoreContext";
import PlayerCard from "./PlayerCard";
import { PlusIcon, MinusIcon } from "@heroicons/react/24/solid";

export default function ScoreBoard() {
  const { state, addPlayer, removePlayer, setAllScores } = useScore();
  const [defaultScore, setDefaultScore] = useState(state.defaultScore);

  // Initialize with two default players
  useEffect(() => {
    if (state.players.length === 0) {
      addPlayer("player-1", "Player 1");
      addPlayer("player-2", "Player 2");
    }
  }, [state.players.length, addPlayer]);

  // When defaultScore changes, set all player scores to that value
  useEffect(() => {
    if (state.players.length > 0 && state.defaultScore !== defaultScore) {
      setAllScores(defaultScore);
    }
  }, [defaultScore, state.players.length, setAllScores, state.defaultScore]);

  const handleAdd = () => {
    const nextIndex = state.players.length + 1;
    addPlayer(`player-${Date.now()}`, `Player ${nextIndex}`);
  };

  const handleRemove = () => {
    if (state.players.length > 2) {
      const lastPlayer = state.players[state.players.length - 1];
      if (lastPlayer) {
        removePlayer(lastPlayer.id);
      }
    }
  };

  const handleDefaultScoreChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value)) setDefaultScore(value);
  };

  return (
    <div className="h-screen flex flex-col bg-gray-900 text-white">
      <header className="flex items-center justify-between bg-gray-800 p-2">
        <h1 className="text-xl font-bold">Score Keeper</h1>
        <div className="flex items-center space-x-4">
          <label className="flex items-center space-x-2">
            <span className="text-sm">Default Score:</span>
            <input
              type="number"
              value={defaultScore}
              onChange={handleDefaultScoreChange}
              className="w-20 px-2 py-1 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </label>
          <button
            onClick={handleAdd}
            className="px-4 py-2 bg-green-600 rounded hover:bg-green-700 flex items-center justify-center"
            aria-label="Add Player"
          >
            <PlusIcon className="h-6 w-6 text-white" />
          </button>
          <button
            onClick={handleRemove}
            disabled={state.players.length <= 2}
            className="px-4 py-2 bg-red-600 rounded disabled:opacity-50 hover:bg-red-700 flex items-center justify-center"
            aria-label="Remove Player"
          >
            <MinusIcon className="h-6 w-6 text-white" />
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
    </div>
  );
}