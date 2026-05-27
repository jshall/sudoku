import type { Cell } from "../Sudoku";
import { TileNotes } from "./TileNotes";
import { TileValue } from "./TileValue";
import { TileContext, useCellContext } from "./TileContext";

export type TileProps = { cell: Cell };
export function Tile({ cell }: TileProps) {
  const ctx = useCellContext(cell);
  return (
    <TileContext value={ctx}>
      {ctx.value === null ? <TileNotes /> : <TileValue />}
    </TileContext>
  );
}
