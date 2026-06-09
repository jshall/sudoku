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
  const [highlightValue, setHighlightValue] = useState<number | null>(null);
  const solved = useSyncExternalStore(
    game.receiveStateUpdates,
    () => game.solved,
  );
  const [tokens, setTokens] = useState(game.tokens);

  const newGame = useCallback(
    (game: Game) => {
      setHighlightValue(null);
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
        setHighlightValue(null);
      saveGame(game);
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
