import { createContext, useMemo, useSyncExternalStore } from "react";
import type { Cell } from "../Sudoku";

export function useCellContext(cell: Cell) {
  const value = useSyncExternalStore(
    cell.valueUpdates.subscribe,
    () => cell.value,
  );
  const locked = useSyncExternalStore(
    cell.lockUpdates.subscribe,
    () => cell.locked,
  );
  const noteString = useSyncExternalStore(
    cell.noteUpdates.subscribe,
    () => cell.notes,
  );
  const notes = useMemo(
    () => noteString.split("|") as ("used" | "unlikely" | "possible")[],
    [noteString],
  );

  return { cell, value, locked, notes };
}

export const TileContext = createContext<ReturnType<
  typeof useCellContext
> | null>(null);
