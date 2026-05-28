import { useContext, useMemo, type UIEvent } from "react";
import { cx } from "../utils";
import { TileContext } from "./TileContext";
import { AppContext } from "./AppContext";

export function TileNotes() {
  const { highlightValue, tokens } = useContext(AppContext)!;
  const { cell, notes, mustBe } = useContext(TileContext)!;
  const highlight = useMemo(
    () => highlightValue !== null && notes[highlightValue] === "possible",
    [highlightValue, notes],
  );
  const events = useMemo(() => {
    const base =
      highlightValue !== null && notes[highlightValue] !== "used"
        ? {
            onContextMenu(e: UIEvent) {
              e.preventDefault();
              cell.toggleNote(highlightValue!);
            },
          }
        : {};
    return highlight
      ? {
          ...base,
          onClick() {
            // eslint-disable-next-line react-hooks/immutability
            cell.value = highlightValue;
          },
        }
      : mustBe !== null
        ? {
            ...base,
            onClick() {
              // eslint-disable-next-line react-hooks/immutability
              cell.value = mustBe;
            },
          }
        : base;
  }, [cell, highlight, highlightValue, notes, mustBe]);

  return (
    <div
      className={cx("tile grid", {
        clickable: "onClick" in events || "onContextMenu" in events,
        highlight,
      })}
      {...events}
    >
      {notes.map((note, i) => (
        <div key={i} className={cx("note flex", note)}>
          {note === "used" ? "" : tokens[i].token}
        </div>
      ))}
    </div>
  );
}
