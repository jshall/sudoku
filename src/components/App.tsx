import "./App.css";
import { Game } from "../Sudoku";
import Board from "./Board";

export default function App() {
  return (
    <section id="center">
      <Board game={new Game(3)} />
    </section>
  );
}
