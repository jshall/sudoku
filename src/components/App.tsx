import { useEffect, useMemo } from "react";
import { Game } from "../Sudoku";
import Board from "./Board";

export default function App() {
  const game = useMemo(() => {
    const gameState = localStorage.getItem("gameState");
    return new Game(gameState ? JSON.parse(gameState) : 3);
  }, []);
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
  return (
    <>
      <button className="save" onClick={() => saveGame(game)}>
        Save Game
      </button>
      <button className="new" onClick={() => newGame(game)}>
        New Game
      </button>
      <Board game={game} />
    </>
  );
}
