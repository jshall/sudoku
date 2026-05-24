import type { Cell } from "../Sudoku";

type NewType = {
  locked: boolean;
  cell: Cell;
  setHighlight: (value: number) => void;
  value: number;
};
export function TileValue({ locked, cell, setHighlight, value }: NewType) {
  return (
    <div
      className={`value ${locked ? "locked" : ""}`}
      onClick={() => {
        // eslint-disable-next-line react-hooks/immutability
        if (!locked) cell.value = undefined;
      }}
      onAuxClick={(e) => {
        if (e.button == 1) cell.lock();
      }}
      onContextMenuCapture={(e) => {
        e.preventDefault();
        setHighlight(value);
      }}
    >
      {cell.game.tokens[value]}
    </div>
  );
}
