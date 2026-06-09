import { BitStream } from "./BitStream";
import type { Game } from "./Game";

export type State = BinaryState | StructuredState;
export type BinaryState = string | ArrayBuffer;
export type StructuredState = number[][] | string[][] | Cell[][];
export type Cell = {
  value: number | null;
  locked: boolean;
  unlikely?: number[];
};

export function encodeGame(
  type: "structured",
  includeGuesses?: false | undefined,
  includeUnlikely?: false | undefined,
): string[][];
export function encodeGame(
  type: "structured",
  includeGuesses: true,
  includeUnlikely?: boolean,
): Cell[][];
export function encodeGame(
  type: "binary",
  includeGuesses?: boolean,
  includeUnlikely?: boolean,
): string;
export function encodeGame(
  this: Game,
  type: "binary" | "structured",
  includeGuesses = false,
  includeUnlikely = false,
): State {
  if (type === "structured") {
    if (includeGuesses)
      return this.map(({ value, locked, notes }) => {
        const unlikely = includeUnlikely
          ? notes
              .split("|")
              .map((n, i) => (n === "unlikely" ? i : null))
              .filter((i) => i !== null)
          : undefined;
        return { value, locked, unlikely };
      });
    return this.map(({ value, locked }) =>
      value !== null && locked ? this.tokens[value].token : "-",
    );
  }
  const valueBits = Math.ceil(Math.log2(this.length));
  const bits = new BitStream();
  bits.write(this.size, 3);
  bits.write(includeGuesses);
  bits.write(includeUnlikely);
  this.forEach(({ locked, value, notes }) => {
    bits.write(locked);
    if (locked) return bits.write(value!, valueBits);
    if (!includeGuesses) return;
    bits.write(value !== null);
    if (value !== null) bits.write(value, valueBits);
    else if (includeUnlikely) {
      notes.split("|").forEach((note, value) => {
        if (note === "unlikely") {
          bits.write(true);
          bits.write(value, valueBits);
        }
      });
      bits.write(false);
    }
  });
  return bits.toString();
}

export function parseState(init: number | State): {
  size: number;
  length: number;
  state?: StructuredState;
} {
  if (typeof init === "number") return { size: init, length: init * init };
  if (init instanceof Array)
    return { size: Math.sqrt(init.length), length: init.length, state: init };
  const bits = new BitStream(init);
  const size = bits.readNumber(3);
  const length = size * size;
  const includeGuesses = bits.readBoolean();
  const includeUnlikely = bits.readBoolean();
  const valueBits = Math.ceil(Math.log2(length));
  const state: Cell[][] = [];
  for (let r = 0; r < length; r++) {
    const row: Cell[] = [];
    for (let c = 0; c < length; c++) {
      let value: number | null = null;
      let unlikely: number[] | undefined = undefined;
      const locked = bits.readBoolean();
      if (locked) value = bits.readNumber(valueBits);
      else if (includeGuesses) {
        const hasValue = bits.readBoolean();
        if (hasValue) value = bits.readNumber(valueBits);
        else if (includeUnlikely) {
          unlikely = [];
          for (
            let addUnlikely = bits.readBoolean();
            addUnlikely;
            addUnlikely = bits.readBoolean()
          )
            unlikely.push(bits.readNumber(valueBits));
        }
      }
      row.push({ value, locked, unlikely });
    }
    state.push(row);
  }
  return { size, length, state };
}

export function loadGame(this: Game, state: StructuredState) {
  this.clear(true, true);
  if (typeof state[0][0] === "object") {
    (state as Cell[][]).forEach((row, r) =>
      row.forEach(({ value, locked, unlikely }, c) => {
        const cell = this.get(r, c);
        cell.value = value;
        if (locked) cell.lock();
        unlikely?.forEach((i) => cell.toggleNote(i));
      }),
    );
    return;
  }
  const lookup = Object.fromEntries(
    this.tokens.map(({ token }, value) => [token, value]),
  );
  (state as (number | string)[][]).forEach((row, r) =>
    row.forEach((token, c) => {
      this.get(r, c).value = lookup[token];
    }),
  );
  this.lock();
}
