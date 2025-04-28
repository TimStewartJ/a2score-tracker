import React from "react";
import { useScore } from "~/context/ScoreContext";
import { ClockIcon, XMarkIcon } from "@heroicons/react/24/outline";

export default function ScoreHistory({ onClose }: { onClose: () => void }) {
  const { history, state } = useScore();
  const playerMap = React.useMemo(() => {
    const map: Record<string, string> = {};
    state.players.forEach((p) => {
      map[p.id] = p.name;
    });
    return map;
  }, [state.players]);

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
          aria-label="Close history"
        >
          <XMarkIcon className="h-6 w-6" />
        </button>
        <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
          <ClockIcon className="h-6 w-6 text-blue-400" />
          Score History
        </h2>
        {history.length === 0 ? (
          <div className="text-gray-400">No score changes yet.</div>
        ) : (
          <ul className="space-y-2">
            {history.slice().reverse().map((h, idx) => (
              <li key={idx} className="flex items-center justify-between bg-gray-700 rounded px-3 py-2">
                <span className="font-medium">{playerMap[h.id] ?? h.id}</span>
                <span className={
                  h.diff > 0 ? "text-green-400" : "text-red-400"
                }>
                  {h.diff > 0 ? "+" : ""}{h.diff}
                </span>
                <span className="text-xs text-gray-400 ml-2">
                  {new Date(h.timestamp).toLocaleTimeString()}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
