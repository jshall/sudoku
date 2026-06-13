import {
  createContext,
  useCallback,
  useEffect,
  useState,
  useSyncExternalStore,
} from "react";
import { Game } from "Sudoku";
import { getGame, saveGame } from "utilities/gameLibrary";

export const AppContext = createContext<ReturnType<
  typeof useAppContext
> | null>(null);
export function useAppContext(init: string) {
  const [game, setGame] = useState(() => {
    const test = init.match(
      /^#(\/((?<size>\d)(\/(?<sourceName>.+))?)|(?<data>.+))/,
    );
    if (test?.groups) {
      const { size, sourceName, data } = test.groups;
      try {
        if (size) return getGame(parseInt(size), sourceName, false);
        if (data) return new Game(data);
      } catch (error) {
        console.error(error);
      }
    }
    return getGame();
  });
  const [highlightValue, shv] = useState<number | null>(null);
  const solved = useSyncExternalStore(
    game.receiveStateUpdates,
    () => game.solved,
  );
  const [tokens, setTokens] = useState(game.tokens);

  const setHighlightValue = useCallback(
    (value: number | null) => {
      if (value === null || tokens.every((t) => t.count == game.length))
        return shv(null);
      while (value == highlightValue || tokens[value].count == game.length)
        value = (value + 1) % game.length;
      shv(value);
    },
    [tokens, game.length, highlightValue],
  );

  const newGame = useCallback(
    (game: Game) => {
      shv(null);
      setTokens([...game.tokens]);
      setGame(game);
    },
    [setGame],
  );

  // Update tokens
  useEffect(() => {
    window.game = game;
    return game.receiveStateUpdates(() => {
      setTokens([...game.tokens]);
      if (
        highlightValue !== null &&
        game.tokens[highlightValue].count === game.length
      )
        setHighlightValue((highlightValue + 1) % game.length);
      saveGame(game);
    });
  }, [game, setTokens, highlightValue, setHighlightValue]);

  return {
    game,
    newGame,
    highlightValue,
    setHighlightValue,
    solved,
    tokens,
  };
}
