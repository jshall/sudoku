import { css } from "@emotion/react";
import { useContext, useMemo, type UIEvent } from "react";
import { flexStyle } from "../utils";
import { cx } from "../utils";
import { AppContext } from "./AppContext";
import { TileContext } from "./TileContext";

const valueStyle = css({
  width: "var(--tile, 1px)",
  height: "var(--tile, 1px)",
  fontSize: "var(--tile, 1px)",
  "&.locked": {
    color: "var(--pen)",
  },
});

export function TileValue() {
  const { highlightValue, game, setHighlightValue, tokens } =
    useContext(AppContext)!;
  const { tileStyle, cell, value, locked } = useContext(TileContext)!;
  const events = useMemo(() => {
    const base =
      tokens[value!].count === game.length
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
  }, [cell, game.length, locked, setHighlightValue, tokens, value]);
  return (
    <div
      className={cx({
        clickable: "onClick" in events || "onContextMenu" in events,
        locked,
        highlight: cell.value === highlightValue,
      })}
      css={[flexStyle, tileStyle, valueStyle]}
      {...events}
    >
      {tokens[value!].token}
    </div>
  );
}
