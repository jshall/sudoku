import { css } from "@emotion/react";
import { useContext, useMemo, type UIEvent } from "react";
import { cx, flexStyle } from "./_styles";
import { AppContext } from "./AppContext";
import { TileContext } from "./TileContext";

function valueStyle(tileSize: number) {
  return css({
    width: tileSize,
    height: tileSize,
    fontSize: tileSize,
    "&.locked": {
      color: "var(--pen)",
    },
  });
}

export function TileValue() {
  const { highlightValue, game, setHighlightValue, tokens, uiSizes } =
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
      css={[
        flexStyle,
        tileStyle(uiSizes.border),
        valueStyle(uiSizes.note * uiSizes.grid),
      ]}
      {...events}
    >
      {tokens[value!].token}
    </div>
  );
}
