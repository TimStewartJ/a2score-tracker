import React from 'react';
import { useScore } from "~/context/ScoreContext";

type Player = { id: string; name: string; score: number };

type Props = {
  player: Player;
  buttons: number[];
};

export default function PlayerCard({ player, buttons }: Props) {
  const { increment, decrement } = useScore();

  return (
    <div className="flex-1 basis-0 bg-gray-700 rounded-lg p-4 flex flex-col items-center justify-between min-h-72">
      <div className="flex flex-col items-center flex-1 w-full">
        <div className="text-lg font-semibold mb-2">{player.name}</div>
        <div className="text-6xl font-extrabold mb-4">{player.score}</div>
      </div>
      <div className="flex flex-wrap gap-2 justify-center mt-4 w-full">
        {buttons.map((amt) => (
          <button
            key={amt}
            onClick={(e) => {
              console.log(`Button clicked: ${amt} timestamp: ${Date.now()}`);
              return amt > 0 ? increment(player.id, amt) : decrement(player.id, -amt);
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
