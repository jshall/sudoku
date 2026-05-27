import { useMemo } from "react";
import { Game } from "../Sudoku";
import Board from "./Board";
import { AppContext, useAppContext } from "./AppContext";

export default function App() {
  const game = useMemo(() => {
    const gameState = localStorage.getItem("gameState");
    return new Game(gameState ? JSON.parse(gameState) : 3);
  }, []);
  const ctx = useAppContext(game);
  const { saveGame, newGame } = ctx;

  return (
    <AppContext value={ctx}>
      <button type="button" className="save" onClick={() => saveGame(game)}>
        Save Game
      </button>
      <button type="button" className="new" onClick={() => newGame(game)}>
        New Game
      </button>
      <Board />
    </AppContext>
  );
}
