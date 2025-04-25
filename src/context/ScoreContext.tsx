"use client"
import React, { createContext, useContext, useReducer, type ReactNode } from "react";

type Player = { id: string; name: string; score: number };
type State = { players: Player[] };
type Action =
  | { type: "add"; payload: { id: string; name: string } }
  | { type: "remove"; payload: { id: string } }
  | { type: "increment"; payload: { id: string; amount?: number } }
  | { type: "decrement"; payload: { id: string; amount?: number } }
  | { type: "reset" };

const initialState: State = { players: [] };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "add":
      return {
        players: [
          ...state.players,
          { id: action.payload.id, name: action.payload.name, score: 0 },
        ],
      };
    case "remove":
      return {
        players: state.players.filter((p) => p.id !== action.payload.id),
      };
    case "increment":
      return {
        players: state.players.map((p) =>
          p.id === action.payload.id
            ? { ...p, score: p.score + (action.payload.amount ?? 1) }
            : p
        ),
      };
    case "decrement":
      return {
        players: state.players.map((p) =>
          p.id === action.payload.id
            ? { ...p, score: p.score - (action.payload.amount ?? 1) }
            : p
        ),
      };
    case "reset":
      return { players: state.players.map((p) => ({ ...p, score: 0 })) };
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
};

const ScoreContext = createContext<ContextType | undefined>(undefined);

export function ScoreProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const value: ContextType = {
    state,
    addPlayer: (id, name) => dispatch({ type: "add", payload: { id, name } }),
    removePlayer: (id) => dispatch({ type: "remove", payload: { id } }),
    increment: (id, amount) =>
      dispatch({ type: "increment", payload: { id, amount } }),
    decrement: (id, amount) =>
      dispatch({ type: "decrement", payload: { id, amount } }),
    reset: () => dispatch({ type: "reset" }),
  };

  return <ScoreContext.Provider value={value}>{children}</ScoreContext.Provider>;
}

export function useScore() {
  const ctx = useContext(ScoreContext);
  if (!ctx) throw new Error("useScore must be inside ScoreProvider");
  return ctx;
}