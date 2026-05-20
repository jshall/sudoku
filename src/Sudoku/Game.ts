import { Cell } from "./Cell";
import { Group } from "./Group";

export class Game {
  public readonly size: number;
  public readonly length: number;
  public readonly columns: readonly Group[];
  public readonly rows: readonly Group[];
  public readonly squares: readonly Group[];

  constructor(size: number) {
    this.size = size;
    const length = (this.length = size * size);

    const columns: Group[] = (this.columns = []);
    const rows: Group[] = (this.rows = []);
    const squares: Group[] = (this.squares = []);
    for (let i: number = 0; i < length; i++) {
      columns[i] = new Group(this);
      rows[i] = new Group(this);
      squares[i] = new Group(this);
    }

    for (let yy: number = 0; yy < size; yy++) {
      for (let y: number = 0; y < size; y++) {
        for (let xx: number = 0; xx < size; xx++) {
          for (let x: number = 0; x < size; x++) {
            new Cell(
              `c${x + xx * size}r${y + yy * size}s${xx + yy * size}`,
              columns[x + xx * size],
              rows[y + yy * size],
              squares[xx + yy * size],
            );
          }
        }
      }
    }
  }

  public clear(clearMarks: boolean = true): void {
    this.columns.forEach((row) => {
      row.forEach((tile) => {
        if (!tile.locked) {
          tile.value = undefined;
        }
        if (clearMarks) {
          for (let i = 0; i < this.length; i++) {
            tile.toggleNote(i, true);
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
}
