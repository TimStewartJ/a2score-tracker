import React from "react";
import { useScore } from "~/context/ScoreContext";
import { PlusIcon, MinusIcon, Cog6ToothIcon, XMarkIcon } from "@heroicons/react/24/outline";

export default function GameSettingsModal({ onClose }: { onClose: () => void }) {
  const { state, addPlayer, removePlayer, setAllScores } = useScore();
  const [defaultScore, setDefaultScore] = React.useState(state.defaultScore);
  const [showFeedback, setShowFeedback] = React.useState(false);

  React.useEffect(() => {
    setDefaultScore(state.defaultScore);
  }, [state.defaultScore]);

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

  // Apply default score change to context when confirmed
  const handleApply = () => {
    setAllScores(defaultScore);
    setShowFeedback(true);
    setTimeout(() => {
      setShowFeedback(false);
    }, 1500); // Show feedback for 1.5 seconds
  };

  // Close when clicking outside the modal
  const backdropRef = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (backdropRef.current && e.target === backdropRef.current) {
        onClose();
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [onClose]);

  return (
    <div ref={backdropRef} className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg shadow-lg p-6 w-full max-w-md max-h-[80vh] overflow-y-auto relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-400 hover:text-white p-1 rounded hover:bg-gray-700"
          aria-label="Close settings"
        >
          <XMarkIcon className="h-6 w-6" />
        </button>
        <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
          <Cog6ToothIcon className="h-6 w-6 text-blue-400" />
          Game Settings
        </h2>
        <div className="space-y-6">
          <label className="flex items-center space-x-2">
            <span className="text-sm">Default Score:</span>
            <input
              type="number"
              value={defaultScore}
              onChange={handleDefaultScoreChange}
              className="w-20 px-2 py-1 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500"
              onFocus={e => e.target.select()}
            />
            <button
              onClick={handleApply}
              className={`ml-2 px-3 py-1 rounded text-white font-semibold text-sm ${
                showFeedback 
                  ? "bg-green-600 hover:bg-green-700" 
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
              aria-label="Apply Default Score"
            >
              {showFeedback ? "Applied!" : "Set as Default"}
            </button>
          </label>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-300">Players: <span className="font-semibold">{state.players.length}</span></span>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={handleAdd}
              className="px-4 py-2 bg-green-600 rounded hover:bg-green-700 flex items-center justify-center"
              aria-label="Add Player"
            >
              <PlusIcon className="h-6 w-6 text-white" />
              <span className="ml-2">Add Player</span>
            </button>
            <button
              onClick={handleRemove}
              disabled={state.players.length <= 2}
              className="px-4 py-2 bg-red-600 rounded disabled:opacity-50 hover:bg-red-700 flex items-center justify-center"
              aria-label="Remove Player"
            >
              <MinusIcon className="h-6 w-6 text-white" />
              <span className="ml-2">Remove Player</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
