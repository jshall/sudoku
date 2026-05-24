import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { Game } from "../Sudoku";
import "./Board.css";
import { Tile } from "./Tile";

export type BoardProps = { game: Game };
export default function Board({ game }: BoardProps) {
  const board = useRef<HTMLDivElement>(null);
  const [highlight, setHiglight] = useState<number>();

  const solved = useSyncExternalStore(
    game.valueUpdates.subscribe,
    () => game.solved,
  );

  useEffect(
    () =>
      board.current?.style.setProperty("--size-board", game.size.toString()),
    [game.size],
  );

  return (
    <div id="board" className={solved ? "solved" : undefined} ref={board}>
      {game.blocks.map((group, i) => (
        <div key={i} className="group">
          {group.map((cell, i) => (
            <Tile
              key={i}
              cell={cell}
              highlight={highlight}
              setHighlight={(value: number) =>
                setHiglight(highlight === value ? undefined : value)
              }
            />
          ))}
        </div>
      ))}
      <div id="solved">Solved!</div>
    </div>
  );
}
