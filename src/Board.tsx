import { useMemo } from "react";
import "./Board.css";
import { Tile } from "./Tile";
import { Game } from "./Sudoku";

type BoardProps = { size: number };
export default function Board({ size }: BoardProps) {
  const children = useMemo(
    () =>
      new Game(size).squares.map((group, i) => (
        <div key={i} className="group">
          {group.map((cell, i) => (
            <Tile key={i} cell={cell} />
          ))}
        </div>
      )),
    [size],
  );
  return (
    <div className="board" style={{ "--size": size } as React.CSSProperties}>
      {children}
    </div>
  );
}
