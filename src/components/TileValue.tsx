import { css } from "@emotion/react";
import { useContext, useMemo, type SyntheticEvent } from "react";
import { cssFlex, cx, varTileSize } from "utilities/styles";
import { AppContext } from "./AppContext";
import { TileContext } from "./TileContext";

const cssValue = css({
  width: varTileSize,
  height: varTileSize,
  fontSize: varTileSize,
  "&.locked": {
    color: "var(--pen)",
  },
});

export function TileValue() {
  const { highlightValue, setHighlightValue, tokens } = useContext(AppContext)!;
  const { cssTile, cell, value, locked } = useContext(TileContext)!;
  const events = useMemo(() => {
    const base = { onClick: () => setHighlightValue(value) };
    return locked
      ? base
      : {
          ...base,
          onContextMenu(e: SyntheticEvent) {
            e.preventDefault();
            // eslint-disable-next-line react-hooks/immutability
            cell.value = null;
          },
        };
  }, [cell, locked, setHighlightValue, value]);
  return (
    <div
      className={cx("clickable", {
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
