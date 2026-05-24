import type { Cell } from "../Sudoku";

export type NotesProps = {
  cell: Cell;
  setHighlight: (value: number) => void;
  notes: ("unlikely" | "used" | "possible")[];
};
export function Notes({ notes, cell, setHighlight }: NotesProps) {
  return (
    <div className="notes">
      {notes.map((note, i) => (
        <div
          key={i}
          className={note}
          onClick={() => {
            if (note != "used") cell.value = i;
          }}
          onAuxClick={(e) => {
            if (e.button == 1) cell.toggleNote(i);
          }}
          onContextMenuCapture={(e) => {
            e.preventDefault();
            setHighlight(i);
          }}
        />
      ))}
    </div>
  );
}
