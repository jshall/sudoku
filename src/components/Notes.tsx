import type { Cell } from "../Sudoku";

export type NotesProps = {
  cell: Cell;
  setHighlight: (value: number) => void;
  notes: ("unlikely" | "used" | "possible")[];
};
export function Notes({ notes, cell, setHighlight }: NotesProps) {
  return (
    <div className="notes">
      {notes.map((note, i) => {
        let clickTimer: number | undefined;
        return (
          <div
            key={i}
            className={note}
            onClick={() => {
              if (note != "used" && !clickTimer)
                clickTimer = setTimeout(() => (cell.value = i), 250);
            }}
            onDoubleClick={() => {
              clearTimeout(clickTimer);
              clickTimer = undefined;
              cell.toggleNote(i);
            }}
            onContextMenuCapture={(e) => {
              e.preventDefault();
              setHighlight(i);
            }}
          >
            {note != "used" ? cell.game.tokens[i] : ""}
          </div>
        );
      })}
    </div>
  );
}
