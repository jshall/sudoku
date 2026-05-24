import { Game } from "../Sudoku";
import Board from "./Board";

export default function App() {
  return <Board game={new Game(3)} />;
}
