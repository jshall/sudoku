import { Game } from "../Sudoku";
import Board from "./Board";

export default function App() {
  const game = new Game(3);
  fetch('https://sudoku-api.vercel.app/api/dosuku')
    .then(res=>res.json())
    .then(
      ({newboard:{grids:[{value}]}})=>
        game.load(value)
    )
  return <Board game={game} />;
}
