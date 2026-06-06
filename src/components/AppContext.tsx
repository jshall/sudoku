import {
  createContext,
  useCallback,
  useEffect,
  useState,
  useSyncExternalStore,
} from "react";
import { Game } from "Sudoku";

export const DEFAULT_GAMES = {
  [3]: "BkEgXBUAASACgAXoAAAAlYAKABIAAZAAALgAAGQABEAJABPAAAAClQAiAFgABcGQVBgA",
  [4]: "vupAAsAArAAqAwAiAAAhoAlvjAAAksAAAosAhAAAAAlAqAAmAAktAAmAAhAAAlvAlAAAAqAisAAAAAmwsAAinAhAAAmAAAAAAwAkApAmAAAArAtAAvrAukAAAnAAAAAsnAAAAAoAAAhmAipAAtAmAAAAuAvAwAsAAAAAAtAAAsAwmAAjqjAAAAAliArAAAAuAsjAAAuAArAAiqAAuAArAwAAAAAhAmkAAAhpAAAswiAloAAAwAvAtAAqAAsAAnrp",
  [5]: "4ApoAlAAjAzAmhAA3A5AtA1A2AAAAAvAi0mpAytAAsu1AxAhAAAAAjAAA2AyAAAAAtAAmh3vAAAAvAt2uA1AwkAr3AiAqzAyAAsAAAi5An3AArAAA2AxAyoAAA0AmAAAArAjAshiAxmAAAA3ApAAolAAAAAAA3yAuwAAA2AAAAArAtAAAnAA1A0A23rAAhviAsqwx4AyAxA3hAAAA512zAAAntplAAqmiAtumAAAAxpnAAoqzAjAAAA5AhqiAyAz4lAAAA2AAp5AAojnAAAAAoAAAvAAxApAAzAAAqAsAyAkA2AwAAAsAA0thqxAArAAAlAvAuAtAlAyAAA5AAnA3AAiAAAxAAAAA1mhAArtAAiAAAA0lsAwA5pmA4AAAAvAztqAA5kjAAAAyluA2p0AAstqwAAAvyi1AAAA5oAxAvAxhy4mAnlrAAuksAiA5AA2AAA3AuAAAAAoAAAplArvAAAAAAAirAAqA2AAAAm0AnupAwAvAAAAoAwAAAizA1AxAAAmAA0vApsAAAmAA3AryAnAj5AphAsA4otA1AAAAxswuAAkAAAAAlA1AAA3AAAAAhA5AxmlAA1kAsot3AjAAAAA1A2A4ApAoAAy3AuAkAAiA5mAvA",
};

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
  return new Game(DEFAULT_GAMES[3]);
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
      default: async () => DEFAULT_GAMES[3],
      dosuku: async () => {
        const res = await fetch("https://sudoku-api.vercel.app/api/dosuku");
        const data: DosukuResponse = await res.json();
        return data.newboard.grids[0]?.value;
      },
      blank: async () => 3,
    },
  ],
  [4]: [
    "16x16",
    { default: async () => DEFAULT_GAMES[4], blank: async () => 4 },
  ],
  [5]: [
    "25x25",
    { default: async () => DEFAULT_GAMES[5], blank: async () => 5 },
  ],
  [6]: ["36x36", { blank: async () => 6 }],
};

export const AppContext = createContext<ReturnType<
  typeof useAppContext
> | null>(null);
export function useAppContext(init: string) {
  const [game, setGame] = useState(
    firstValidGame(parse(init), localStorage.getItem("gameState") ?? ""),
  );
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

  return {
    game,
    newGame,
    highlightValue,
    setHighlightValue,
    solved,
    tokens,
  };
}
