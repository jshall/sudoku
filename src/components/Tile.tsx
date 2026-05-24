import { useSyncExternalStore } from "react";
import type { Cell } from "../Sudoku";
import { Notes } from "./Notes";
import { TileValue } from "./TileValue";

export type TileProps = {
  cell: Cell;
  highlight?: number;
  setHighlight: (value: number) => void;
};
export function Tile({ cell, highlight, setHighlight }: TileProps) {
  const locked = useSyncExternalStore(
    cell.lockUpdates.subscribe,
    () => cell.locked,
  );
  const value = useSyncExternalStore(
    cell.valueUpdates.subscribe,
    () => cell.value,
  );
  const noteString = useSyncExternalStore(
    cell.noteUpdates.subscribe,
    () => cell.notes,
  );

  const notes = noteString.split("|") as ("used" | "unlikely" | "possible")[];
  let className = "tile";
  if (highlight !== undefined) {
    if (highlight === value) className += " highlight";
    if (value === undefined && notes[highlight] === "possible")
      className += " highlight";
  }

  return (
    <div className={className}>
      {value === undefined ? (
        <Notes {...{ cell, notes, setHighlight }} />
      ) : (
        <TileValue {...{ cell, locked, setHighlight, value }} />
      )}
    </div>
  );
}
