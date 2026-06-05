import { css } from "@emotion/react";
import { createContext, useMemo, useSyncExternalStore } from "react";
import type { Cell } from "../Sudoku";
import { varBorderWidth } from "./_styles";

const cssTile = css({
  border: `var(--border-soft) ${varBorderWidth}`,

  "&.highlight": {
    background: "var(--highlight)",
  },
});

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

  return { cell, locked, mustBe, notes, cssTile, value };
}

export const TileContext = createContext<ReturnType<
  typeof useCellContext
> | null>(null);
