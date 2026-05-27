import { useContext, useMemo, type MouseEvent } from "react";
import { cx } from "../utils";
import { TileContext } from "./TileContext";
import { AppContext } from "./AppContext";

export function TileNotes() {
  const { game, highlightValue, setHighlightValue } = useContext(AppContext)!;
  const { cell, notes } = useContext(TileContext)!;
  const highlight = useMemo(
    () => highlightValue !== null && notes[highlightValue] === "possible",
    [highlightValue, notes],
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
            setHighlightValue(i);
          },
        };
  }

  return (
    <div className={cx("tile grid", { highlight })}>
      {notes.map((note, i) => (
        <div key={i} className={cx("note flex", note)} {...events(i)}>
          {note === "used" ? "" : game.tokens[i]}
        </div>
      ))}
    </div>
  );
}
