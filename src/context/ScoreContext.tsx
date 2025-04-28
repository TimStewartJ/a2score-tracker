"use client"
import React, { createContext, useContext, useReducer, type ReactNode } from "react";

type Player = { id: string; name: string; score: number };
type ScoreChange = {
  type: "increment" | "decrement";
  id: string;
  name?: string;
  diff: number;
  timestamp: number;
};
type State = { players: Player[], defaultScore: number, history: ScoreChange[] };
type Action =
  | { type: "add"; payload: { id: string; name: string } }
  | { type: "remove"; payload: { id: string } }
  | { type: "increment"; payload: { id: string; amount?: number } }
  | { type: "decrement"; payload: { id: string; amount?: number } }
  | { type: "reset" }
  | { type: "setAllScores"; payload: { score: number } }
  | { type: "updateName"; payload: { id: string; name: string } };

const initialState: State = { players: [], defaultScore: 50, history: [] };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "add": {
      const newPlayer = { id: action.payload.id, name: action.payload.name, score: state.defaultScore };
      return {
        ...state,
        players: [...state.players, newPlayer],
      };
    }
    case "remove": {
      return {
        ...state,
        players: state.players.filter((p) => p.id !== action.payload.id),
      };
    }
    case "increment": {
      const amount = action.payload.amount ?? 1;
      return {
        ...state,
        players: state.players.map((p) =>
          p.id === action.payload.id ? { ...p, score: p.score + amount } : p
        ),
        history: [
          ...state.history,
          {
            type: "increment",
            id: action.payload.id,
            diff: amount,
            timestamp: Date.now(),
          },
        ],
      };
    }
    case "decrement": {
      const amount = action.payload.amount ?? 1;
      return {
        ...state,
        players: state.players.map((p) =>
          p.id === action.payload.id ? { ...p, score: p.score - amount } : p
        ),
        history: [
          ...state.history,
          {
            type: "decrement",
            id: action.payload.id,
            diff: -amount,
            timestamp: Date.now(),
          },
        ],
      };
    }
    case "reset":
      return {
        ...state,
        players: state.players.map((p) => ({ ...p, score: state.defaultScore })),
        history: [],
      };
    case "setAllScores":
      if (action.payload.score === state.defaultScore) return state;
      return {
        ...state,
        defaultScore: action.payload.score,
        players: state.players.map((p) => ({ ...p, score: action.payload.score })),
        history: [],
      };
    case "updateName":
      return {
        ...state,
        players: state.players.map((p) =>
          p.id === action.payload.id ? { ...p, name: action.payload.name } : p
        ),
      };
    default:
      return state;
  }
}

type ContextType = {
  state: State;
  addPlayer: (id: string, name: string) => void;
  removePlayer: (id: string) => void;
  increment: (id: string, amount?: number) => void;
  decrement: (id: string, amount?: number) => void;
  reset: () => void;
  setAllScores: (score: number) => void;
  updatePlayerName: (id: string, name: string) => void;
  history: ScoreChange[];
};

const ScoreContext = createContext<ContextType | undefined>(undefined);

export function ScoreProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const value: ContextType = {
    state,
    addPlayer: (id, name) => dispatch({ type: "add", payload: { id, name } }),
    removePlayer: (id) => dispatch({ type: "remove", payload: { id } }),
    increment: (id, amount) => {
      console.log("increment called", { id, amount });
      dispatch({ type: "increment", payload: { id, amount } });
    },
    decrement: (id, amount) => {
      console.log("decrement called", { id, amount });
      dispatch({ type: "decrement", payload: { id, amount } });
    },
    reset: () => dispatch({ type: "reset" }),
    setAllScores: (score) => {
      if (score === state.defaultScore) return; // Prevent dispatch if same as default
      dispatch({ type: "setAllScores", payload: { score } });
    },
    updatePlayerName: (id, name) => {
      dispatch({ type: "updateName", payload: { id, name } });
    },
    history: state.history,
  };

  return <ScoreContext.Provider value={value}>{children}</ScoreContext.Provider>;
}

export function useScore() {
  const ctx = useContext(ScoreContext);
  if (!ctx) throw new Error("useScore must be inside ScoreProvider");
  return ctx;
}