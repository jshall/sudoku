import { css } from "@emotion/react";
import { useContext, useMemo, type UIEvent } from "react";
import { flexStyle, gridStyle } from "../utils";
import { cx } from "../utils";
import { AppContext } from "./AppContext";
import { TileContext } from "./TileContext";

const noteStyle = css({
  width: "var(--note, 1px)",
  height: "var(--note, 1px)",
  fontSize: "var(--note, 1px)",
  "&.unlikely": {
    color: "rgb(from var(--pencil) r g b / 0.2)",
  },
});

export function TileNotes() {
  const { highlightValue, tokens } = useContext(AppContext)!;
  const { tileStyle, cell, notes, mustBe } = useContext(TileContext)!;
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
      className={cx({
        clickable: "onClick" in events || "onContextMenu" in events,
        highlight,
      })}
      css={[gridStyle, tileStyle]}
      {...events}
    >
      {notes.map((note, i) => (
        <div key={i} className={note} css={[flexStyle, noteStyle]}>
          {note === "used" ? "" : tokens[i].token}
        </div>
      ))}
    </div>
  );
}
