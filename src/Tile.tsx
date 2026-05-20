import { useSyncExternalStore } from "react";
import type { Cell } from "./Sudoku";

export type TileProps = { cell: Cell };
export function Tile({ cell }: TileProps) {
  const locked = useSyncExternalStore(
    cell.lockUpdates.subscribe,
    () => cell.locked,
  );
  const value = useSyncExternalStore(
    cell.valueUpdates.subscribe,
    () => cell.value,
  );
  const notes = useSyncExternalStore(
    cell.noteUpdates.subscribe,
    () => cell.notes,
  );

  return (
    <div className="tile">
      {value === undefined ? (
        <div className="notes">
          {notes.split("|").map((note, i) => (
            <div
              key={i}
              className={note}
              onClick={() => (cell.value = i)}
              onAuxClick={() => cell.toggleNote(i)}
            />
          ))}
        </div>
      ) : (
        <div
          className={`value ${locked ? "locked" : ""}`}
          onClick={() => (cell.value = undefined)}
          onAuxClick={() => cell.lock()}
        >
          <span>{value + 1}</span>
        </div>
      )}
    </div>
  );
}
