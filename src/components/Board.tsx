import { useEffect, useRef, useSyncExternalStore } from "react";
import { Game } from "../Sudoku";
import "./Board.css";
import { Tile } from "./Tile";

export type BoardProps = { game: Game };
export default function Board({ game }: BoardProps) {
  const element = useRef<HTMLDivElement>(null);

  const solved = useSyncExternalStore(
    game.valueUpdates.subscribe,
    () => game.solved,
  );

  useEffect(() => {
    const g = game.size;
    function resize() {
      const b = Math.min(
        window.visualViewport!.width,
        window.visualViewport!.height,
      );
      const n = Math.floor((((b - 2) / g - 2) / g - 2) / g);
      const t = g * n;
      element.current?.style.setProperty("--width-note", `${n}px`);
      element.current?.style.setProperty("--width-tile", `${t}px`);
      element.current?.style.setProperty("--grid", `repeat(${g}, 1fr)`);
    }
    resize();
    addEventListener("resize", resize);
    return () => removeEventListener("resize", resize);
  }, [game.size]);

  return (
    <div id="board" className={solved ? "solved" : undefined} ref={element}>
      {game.blocks.map((group, i) => (
        <div key={i}>
          {group.map((cell, i) => (
            <Tile key={i} cell={cell} />
          ))}
        </div>
      ))}
      <div id="solved">Solved!</div>
    </div>
  );
}
