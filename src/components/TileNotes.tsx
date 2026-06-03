import { css } from "@emotion/react";
import { useContext, useMemo, type UIEvent } from "react";
import { cx, flexStyle, gridStyle } from "./_styles";
import { AppContext } from "./AppContext";
import { TileContext } from "./TileContext";

function noteStyle(noteSize: number) {
  return css({
    width: noteSize,
    height: noteSize,
    fontSize: noteSize,
    "&.unlikely": {
      color: "rgb(from var(--pencil) r g b / 0.2)",
    },
  });
}

export function TileNotes() {
  const { highlightValue, tokens, uiSizes } = useContext(AppContext)!;
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
      css={[gridStyle(uiSizes.grid), tileStyle(uiSizes.border)]}
      {...events}
    >
      {notes.map((note, i) => (
        <div
          key={i}
          className={note}
          css={[flexStyle, noteStyle(uiSizes.note)]}
        >
          {note === "used" ? "" : tokens[i].token}
        </div>
      ))}
    </div>
  );
}
