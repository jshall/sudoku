import {
  createContext,
  useEffect,
  useState,
  useSyncExternalStore,
} from "react";
import type { Game } from "../Sudoku";

export const AppContext = createContext<ReturnType<
  typeof useAppContext
> | null>(null);
export function useAppContext(game: Game) {
  const [highlightValue, setHighlightValue] = useState<number | null>(null);
  const solved = useSyncExternalStore(
    game.valueUpdates.subscribe,
    () => game.solved,
  );

  function newGame(game: Game) {
    if (game.size === 3)
      fetch("https://sudoku-api.vercel.app/api/dosuku")
        .then((res) => res.json())
        .then(
          ({
            newboard: {
              grids: [{ value }],
            },
          }) => game.load(value),
        );
    else game.clear(true, true);
  }
  function saveGame(game: Game) {
    localStorage.setItem("gameState", JSON.stringify(game.save()));
  }

  useEffect(() => {
    window.game = game;
  }, [game]);

  return { game, highlightValue, setHighlightValue, solved, newGame, saveGame };
}
