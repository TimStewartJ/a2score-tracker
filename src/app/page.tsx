"use client";
import React, { useEffect } from "react";
import { ScoreProvider, useScore } from "~/context/ScoreContext";
import PlayerCard from "./_components/PlayerCard";

function ScoreBoard() {
  const { state, addPlayer, removePlayer } = useScore();

  // Initialize with two default players
  useEffect(() => {
    if (state.players.length === 0) {
      addPlayer("player-1", "Player 1");
      addPlayer("player-2", "Player 2");
    }
  }, [state.players.length, addPlayer]);

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

  return (
    <div className="h-screen flex flex-col bg-gray-900 text-white">
      <header className="flex items-center justify-between bg-gray-800 p-4">
        <h1 className="text-xl font-bold">Score Keeper</h1>
        <div className="space-x-2">
          <button onClick={handleAdd} className="px-4 py-2 bg-green-600 rounded hover:bg-green-700">
            Add Player
          </button>
          <button onClick={handleRemove} disabled={state.players.length <= 2} className="px-4 py-2 bg-red-600 rounded disabled:opacity-50 hover:bg-red-700">
            Remove Player
          </button>
        </div>
      </header>
      <main className="flex-1 overflow-auto p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 h-full">
          {state.players.map((p) => (
            <PlayerCard
              key={p.id}
              player={p}
            />
          ))}
        </div>
      </main>
    </div>
  );
}

export default function Page() {
  return (
    <ScoreProvider>
      <ScoreBoard />
    </ScoreProvider>
  );
}
