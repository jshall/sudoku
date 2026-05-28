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
  const mustBe = useMemo(() => {
    const possible = notes
      .map((n, i) => (n === "possible" ? i : null))
      .filter((i) => i !== null);
    return possible.length === 1 ? possible[0] : null;
  }, [notes]);

  return { cell, value, locked, notes, mustBe };
}

export const TileContext = createContext<ReturnType<
  typeof useCellContext
> | null>(null);
