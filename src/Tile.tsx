import { useMemo, useSyncExternalStore } from "react";
import type { Cell } from "./Sudoku";

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

  const notes = useMemo(
    () => noteString.split("|") as ("used" | "unlikely" | "possible")[],
    [noteString],
  );
  const classList = useMemo(() => {
    const list = ["tile"];
    if (highlight !== undefined) {
      if (highlight === value) list.push("highlight");
      if (value === undefined && notes[highlight] === "possible")
        list.push("highlight");
    }
    return list;
  }, [value, notes, highlight]);

  return (
    <div className={classList.join(" ")}>
      {value === undefined ? (
        <div className="notes">
          {notes.map((note, i) => (
            <div
              key={i}
              className={note}
              onClick={() => {
                if (note != "used") cell.value = i;
              }}
              onAuxClick={(e) => {
                if (e.button == 1) cell.toggleNote(i);
              }}
              onContextMenuCapture={(e) => {
                e.preventDefault();
                setHighlight(i);
              }}
            />
          ))}
        </div>
      ) : (
        <div
          className={`value ${locked ? "locked" : ""}`}
          onClick={() => (cell.value = undefined)}
          onAuxClick={(e) => {
            if (e.button == 1) cell.lock();
          }}
          onContextMenuCapture={(e) => {
            e.preventDefault();
            setHighlight(value);
          }}
        >
          <span>{cell.game.tokens[value]}</span>
        </div>
      )}
    </div>
  );
}
