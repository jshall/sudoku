import { Cell } from "./Cell";
import { Group } from "./Group";

export class Game {
  public readonly size: number;
  public readonly length: number;
  public readonly columns: readonly (readonly Cell[])[];
  public readonly rows: readonly (readonly Cell[])[];
  public readonly blocks: readonly (readonly Cell[])[];
  public readonly tokens: readonly string[];

  constructor(size: number) {
    this.size = size;
    const length = (this.length = size * size);
    this.tokens = getTokens(size);

    const columns: Group[] = (this.columns = []);
    const rows: Group[] = (this.rows = []);
    const blocks: Group[] = (this.blocks = []);
    for (let i: number = 0; i < length; i++) {
      columns[i] = new Group(this);
      rows[i] = new Group(this);
      blocks[i] = new Group(this);
    }

    for (let yy: number = 0; yy < size; yy++) {
      for (let y: number = 0; y < size; y++) {
        for (let xx: number = 0; xx < size; xx++) {
          for (let x: number = 0; x < size; x++) {
            new Cell(
              columns[x + xx * size],
              rows[y + yy * size],
              blocks[xx + yy * size],
            );
          }
        }
      }
    }
    globalThis.game = this;
  }

  public clear(clearMarks: boolean = true, force: boolean = false): void {
    this.columns.forEach((row) => {
      row.forEach((tile) => {
        // @ts-expect-error accessing private _locked
        if (force) tile._locked = false;
        if (!tile.locked) {
          tile.value = undefined;
        }
        if (clearMarks) {
          for (let i = 0; i < this.length; i++) {
            tile.toggleNote(i, false);
          }
        }
      });
    });
  }
  public lock(): void {
    this.columns.forEach((group) =>
      group.forEach((cell) => {
        if (cell.value !== undefined) {
          cell.lock();
        }
      }),
    );
  }
  public validate(value: number): void {
    if (value < 0 || value >= this.length) {
      throw Error("Out of range.");
    }
    if (value != value >> 0) {
      throw Error("Not an integer.");
    }
  }

  public save() {
    return this.rows.map((g) =>
      g.map(({ value }) => this.tokens[value!] ?? "-"),
    );
  }
  public load(data: string[][]) {
    this.clear(true, true);
    const tokenValues = Object.fromEntries(this.tokens.map((t, v) => [t, v]));
    this.rows.forEach((row, r) =>
      row.forEach((cell, c) => (cell.value = tokenValues[data[r][c]])),
    );
    this.lock();
  }
}

function getTokens(size: number) {
  switch (size) {
    case 2:
      return "♠♥♦♣".split("");
    case 3:
      return "123456789".split("");
    case 4:
      return "0123456789ABCDEF".split("");
    case 5:
      return "ABCDEFGHIJKLMNOPQRSTUVWXY".split("");
    default:
      throw "Invalid size";
  }
}
