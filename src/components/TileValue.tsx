import { useSyncExternalStore } from "react";
import { cx } from "../utils";
import type { TileProps } from "./Tile";

export function TileValue({ cell }: TileProps) {
  const locked = useSyncExternalStore(
    cell.lockUpdates.subscribe,
    () => cell.locked,
  );
  const highlight = useSyncExternalStore(
    cell.game.highlightUpdates.subscribe,
    () => cell.game.highlight,
  );
  return (
    <div
      className={cx("tile flex value", {
        locked,
        highlight: cell.value === highlight,
      })}
      onContextMenu={(e) => {
        e.preventDefault();
        // eslint-disable-next-line react-hooks/immutability
        if (!locked) cell.value = null;
      }}
      onClick={() => {
        // eslint-disable-next-line react-hooks/immutability
        cell.game.highlight = cell.value;
      }}
    >
      {cell.game.tokens[cell.value!]}
    </div>
  );
}
