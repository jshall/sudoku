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
  const [tokens, setTokens] = useState(game.tokens);

  function newGame(game: Game) {
    setHighlightValue(null);
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

  useEffect(() => {
    window.game = game;
    return game.valueUpdates.subscribe(() => {
      setTokens([...game.tokens]);
      localStorage.setItem("gameState", game.save());
    });
  }, [game, game.size]);

  return {
    game,
    highlightValue,
    setHighlightValue,
    solved,
    tokens,
    newGame,
  };
}
