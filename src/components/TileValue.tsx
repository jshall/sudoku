import { useContext } from "react";
import { cx } from "../utils";
import { AppContext } from "./AppContext";
import { TileContext } from "./TileContext";

export function TileValue() {
  const { game, highlightValue, setHighlightValue } = useContext(AppContext)!;
  const { cell, value, locked } = useContext(TileContext)!;
  return (
    <div
      className={cx("tile flex value", {
        locked,
        highlight: cell.value === highlightValue,
      })}
      onContextMenu={(e) => {
        e.preventDefault();
        // eslint-disable-next-line react-hooks/immutability
        if (!locked) cell.value = null;
      }}
      onClick={() => {
        setHighlightValue(value);
      }}
    >
      {game.tokens[value!]}
    </div>
  );
}
