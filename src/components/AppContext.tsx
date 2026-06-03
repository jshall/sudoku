import {
  createContext,
  useEffect,
  useState,
  useSyncExternalStore,
} from "react";
import type { Game } from "../Sudoku";

export const DEFAULT_GAME =
  "BkEgXBUAASACgAXoAAAAlYAKABIAAZAAALgAAGQABEAJABPAAAAClQAiAFgABcGQVBgA";

export const AppContext = createContext<ReturnType<
  typeof useAppContext
> | null>(null);
export function useAppContext(game: Game) {
  const [uiSizes, updateUiSizes] = useState({ grid: 0, note: 0, border: 0 });
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

  // Update tokens
  useEffect(() => {
    window.game = game;
    return game.valueUpdates.subscribe(() => {
      setTokens([...game.tokens]);
      if (
        highlightValue !== null &&
        game.tokens[highlightValue].count === game.length
      )
        setHighlightValue(null);
      localStorage.setItem("gameState", game.save());
    });
  }, [game, setTokens, highlightValue]);

  // Manage sizing
  useEffect(() => {
    const grid = game.size;
    function resize() {
      if (!visualViewport) return;
      const { width, height } = visualViewport;
      const border = 1;
      const note = Math.floor(
        (((Math.min(width, height) - 2 * border) / grid - 2 * border) / grid -
          2 * border) /
          grid,
      );
      updateUiSizes({ grid, note, border });
    }
    resize();
    addEventListener("resize", resize);
    return () => removeEventListener("resize", resize);
  }, [game.size]);

  return {
    game,
    newGame,
    highlightValue,
    setHighlightValue,
    solved,
    tokens,
    uiSizes,
  };
}
