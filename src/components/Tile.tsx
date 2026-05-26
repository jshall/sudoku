import { useSyncExternalStore } from "react";
import type { Cell } from "../Sudoku";
import { Notes } from "./Notes";
import { TileValue } from "./TileValue";

export type TileProps = { cell: Cell };
export function Tile(props: TileProps) {
  const { cell } = props;
  const value = useSyncExternalStore(
    cell.valueUpdates.subscribe,
    () => cell.value,
  );

  return value === null ? <Notes {...props} /> : <TileValue {...props} />;
}
