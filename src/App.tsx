import "./App.css";
import Board from "./Board";
import { Game } from "./Sudoku";

export default function App() {
  return (
    <section id="center">
      <Board game={new Game(3)} />
    </section>
  );
}
