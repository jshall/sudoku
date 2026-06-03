import {
  createContext,
  useCallback,
  useEffect,
  useState,
  useSyncExternalStore,
} from "react";
import { Game } from "../Sudoku";

export const DEFAULT_GAME =
  "BkEgXBUAASACgAXoAAAAlYAKABIAAZAAALgAAGQABEAJABPAAAAClQAiAFgABcGQVBgA";

function parse(init: string) {
  const number = parseInt(init);
  if (number) return number;
  return init;
}

function firstValidGame(...init: (number | string)[]) {
  for (const item of init) {
    try {
      return new Game(item);
    } catch {
      console.debug("new game failed:", item);
    }
  }
  return new Game(DEFAULT_GAME);
}

type DosukuResponse = {
  newboard: {
    grids: {
      value: string[][];
      solution: string[][];
    }[];
  };
};

export const generators: {
  [size: number]: [
    description: string,
    list: { [name: string]: () => Promise<number | string | string[][]> },
  ];
} = {
  [2]: ["4x4", { blank: async () => 2 }],
  [3]: [
    "9x9",
    {
      default: async () => DEFAULT_GAME,
      dosuku: async () => {
        const res = await fetch("https://sudoku-api.vercel.app/api/dosuku");
        const data: DosukuResponse = await res.json();
        return data.newboard.grids[0]?.value;
      },
      blank: async () => 3,
    },
  ],
  [4]: ["16x16", { blank: async () => 4 }],
};

export const AppContext = createContext<ReturnType<
  typeof useAppContext
> | null>(null);
export function useAppContext(init: string) {
  const [game, setGame] = useState(
    firstValidGame(parse(init), localStorage.getItem("gameState") ?? ""),
  );
  const [uiSizes, updateUiSizes] = useState({ grid: 0, note: 0, border: 0 });
  const [highlightValue, setHighlightValue] = useState<number | null>(null);
  const solved = useSyncExternalStore(
    game.valueUpdates.subscribe,
    () => game.solved,
  );
  const [tokens, setTokens] = useState(game.tokens);
  const newGame = useCallback(
    (init: ConstructorParameters<typeof Game>[0]) => {
      const game = new Game(init);
      setHighlightValue(null);
      setTokens([...game.tokens]);
      setGame(game);
    },
    [setGame],
  );

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
