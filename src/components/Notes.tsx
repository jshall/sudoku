import { useMemo, useSyncExternalStore, type MouseEvent } from "react";
import type { TileProps } from "./Tile";

export function Notes({ cell }: TileProps) {
  const highlight = useSyncExternalStore(
    cell.game.highlightUpdates.subscribe,
    () => cell.game.highlight,
  );
  const noteString = useSyncExternalStore(
    cell.noteUpdates.subscribe,
    () => cell.notes,
  );
  const notes = useMemo(
    () => noteString.split("|") as ("used" | "unlikely" | "possible")[],
    [noteString],
  );
  const highlightMe = useMemo(
    () => highlight !== null && notes[highlight] === "possible",
    [highlight, notes],
  );

  function events(i: number) {
    let clickTimer: number | null;
    return notes[i] === "used"
      ? {}
      : {
          onClick() {
            if (!clickTimer)
              clickTimer = setTimeout(() => (cell.value = i), 250);
          },
          onDoubleClick() {
            clearTimeout(clickTimer!);
            clickTimer = null;
            cell.toggleNote(i);
          },
          onContextMenu(e: MouseEvent) {
            e.preventDefault();
            cell.game.highlight = i;
          },
        };
  }

  return (
    <div className={`notes${highlightMe ? " highlight" : ""}`}>
      {notes.map((note, i) => (
        <div key={i} className={note} {...events(i)}>
          {note === "used" ? "" : cell.game.tokens[i]}
        </div>
      ))}
    </div>
  );
}
