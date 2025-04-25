"use client";
import React, { useEffect } from "react";
import { ScoreProvider, useScore } from "~/context/ScoreContext";

function ScoreBoard() {
  const { state, addPlayer, removePlayer, increment, decrement } = useScore();

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

  const buttons = [-10, -5, -2, -1, 1, 2, 5];

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
        <div className="flex flex-wrap gap-4 h-full">
          {state.players.map((p) => (
            <div key={p.id} className="flex-1 basis-0 bg-gray-700 rounded-lg p-4 flex flex-col items-center justify-between min-h-72">
              <div className="flex flex-col items-center flex-1 w-full">
                <div className="text-lg font-semibold mb-2">{p.name}</div>
                <div className="text-6xl font-extrabold mb-4">{p.score}</div>
              </div>
              <div className="flex flex-wrap gap-2 justify-center mt-4 w-full">
                {buttons.map((amt) => (
                  <button
                    key={amt}
                    onClick={() =>
                      amt > 0 ? increment(p.id, amt) : decrement(p.id, -amt)
                    }
                    className="w-12 h-12 bg-white text-gray-900 rounded hover:bg-gray-200"
                  >
                    {amt > 0 ? `+${amt}` : amt}
                  </button>
                ))}
              </div>
            </div>
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
