import { Cell } from "./Cell";
import { createDispatcher, type Dispatcher } from "./Dispatcher";
import { Group } from "./Group";
import { encodeGame, loadGame, parseState, type State } from "./State";

export class Game {
  private readonly groups = {
    columns: Array<Group>(),
    rows: Array<Group>(),
    blocks: Array<Group>(),
  };
  public readonly size: number;
  public readonly length: number;
  public readonly tokens: readonly { readonly token: string; left: number }[];
  public receiveStateUpdates: Dispatcher["subscribe"];

  constructor(init: number | State) {
    const { size, length, state } = parseState(init);
    this.size = size;
    this.length = length;
    this.tokens = getTokens(size).map((token) => ({ token, left: length }));
    const stateDispatcher = createDispatcher();
    this.receiveStateUpdates = stateDispatcher.subscribe;

    const { columns, rows, blocks } = this.groups;
    for (let i: number = 0; i < length; i++) {
      columns[i] = new Group();
      rows[i] = new Group();
      blocks[i] = new Group();
    }

    for (let yy: number = 0; yy < size; yy++) {
      for (let y: number = 0; y < size; y++) {
        for (let xx: number = 0; xx < size; xx++) {
          for (let x: number = 0; x < size; x++) {
            new Cell(
              this.tokens,
              stateDispatcher.dispatch,
              columns[x + xx * size],
              rows[y + yy * size],
              blocks[xx + yy * size],
            );
          }
        }
      }
    }
    if (state) loadGame.call(this, state);
  }

  public get solved() {
    return this.groups.columns.every((r) => r.every((c) => c.value !== null));
  }

  public get(row: number, column: number) {
    return this.groups.rows[row][column];
  }
  public map<T>(
    callbackfn: (
      cell: Cell,
      groupIndex: number,
      cellIndex: number,
    ) => T extends void ? never : T,
    group: keyof typeof this.groups = "rows",
  ) {
    return [...this.groups[group]].map((row, r) =>
      [...row].map((cell, c) => callbackfn(cell, r, c)),
    );
  }
  public forEach(
    callbackfn: (cell: Cell, groupIndex: number, cellIndex: number) => void,
    group: keyof typeof this.groups = "rows",
  ) {
    return this.groups[group].forEach((row, r) =>
      row.forEach((cell, c) => callbackfn(cell, r, c)),
    );
  }

  public clear(clearMarks: boolean = true, force: boolean = false): void {
    this.groups.columns.forEach((row) => {
      row.forEach((tile) => {
        // @ts-expect-error accessing private _locked
        if (force) tile._locked = false;
        if (!tile.locked) {
          tile.value = null;
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
    this.groups.columns.forEach((group) =>
      group.forEach((cell) => {
        if (cell.value !== null) {
          cell.lock();
        }
      }),
    );
  }

  public save = encodeGame.bind(this);
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
    case 6:
      return "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
    default:
      throw "Invalid size";
  }
}
