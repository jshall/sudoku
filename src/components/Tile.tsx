import type { Cell } from "../Sudoku";
import { TileContext, useCellContext } from "./TileContext";
import { TileNotes } from "./TileNotes";
import { TileValue } from "./TileValue";

export type TileProps = { cell: Cell };
export function Tile({ cell }: TileProps) {
  const ctx = useCellContext(cell);
  return (
    <TileContext value={ctx}>
      {ctx.value === null ? <TileNotes /> : <TileValue />}
    </TileContext>
  );
}
