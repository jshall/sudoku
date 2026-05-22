import { useState } from "react";
import "./Board.css";
import { Tile } from "./Tile";
import { Game } from "./Sudoku";

type BoardProps = { game: Game };
export default function Board({ game }: BoardProps) {
  const [highlight, setHiglight] = useState<number>();

  return (
    <div
      className="board"
      style={{ "--size": game.size } as React.CSSProperties}
    >
      {game.squares.map((group, i) => (
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
    </div>
  );
}
