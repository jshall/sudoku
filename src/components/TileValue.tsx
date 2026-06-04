import { css } from "@emotion/react";
import { useContext, useMemo, type UIEvent } from "react";
import { cx, cssFlex } from "./_styles";
import { AppContext } from "./AppContext";
import { TileContext } from "./TileContext";

const cssValue = css({
  width: "var(--tile-size)",
  height: "var(--tile-size)",
  fontSize: "var(--tile-size)",
  "&.locked": {
    color: "var(--pen)",
  },
});

export function TileValue() {
  const { highlightValue, setHighlightValue, tokens } = useContext(AppContext)!;
  const { cssTile, cell, value, locked } = useContext(TileContext)!;
  const events = useMemo(() => {
    const base =
      tokens[value!].count === tokens.length
        ? {}
        : {
            onClick() {
              setHighlightValue((val) => (val === value ? null : value));
            },
          };
    return locked
      ? base
      : {
          ...base,
          onContextMenu(e: UIEvent) {
            e.preventDefault();
            // eslint-disable-next-line react-hooks/immutability
            cell.value = null;
          },
        };
  }, [cell, locked, setHighlightValue, tokens, value]);
  return (
    <div
      className={cx({
        clickable: "onClick" in events || "onContextMenu" in events,
        locked,
        highlight: cell.value === highlightValue,
      })}
      css={[cssFlex, cssTile, cssValue]}
      {...events}
    >
      {tokens[value!].token}
    </div>
  );
}
