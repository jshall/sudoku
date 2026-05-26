import { useSyncExternalStore } from "react";
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
      className={`value${locked ? " locked" : ""}${cell.value == highlight ? " highlight" : ""}`}
      onContextMenu={() => {
        // eslint-disable-next-line react-hooks/immutability
        if (!locked) cell.value = null;
      }}
      onClick={(e) => {
        e.preventDefault();
        // eslint-disable-next-line react-hooks/immutability
        cell.game.highlight = cell.value;
      }}
    >
      {cell.game.tokens[cell.value!]}
    </div>
  );
}
