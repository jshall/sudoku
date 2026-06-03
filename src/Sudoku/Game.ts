import { Cell } from "./Cell";
import { createDispatcher } from "./Dispatcher";
import { Group } from "./Group";

export class Game {
  public readonly size: number;
  public readonly length: number;
  public readonly columns: readonly (readonly Cell[])[];
  public readonly rows: readonly (readonly Cell[])[];
  public readonly blocks: readonly (readonly Cell[])[];
  public readonly tokens: readonly { token: string; count: number }[];
  public readonly valueUpdates = createDispatcher();

  constructor(init: number | string | string[][]) {
    const { size, length, data } = parseInit(init);
    this.size = size;
    this.length = length;
    this.tokens = getTokens(size).map((token) => ({ token, count: 0 }));

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
    if (data) this.load(data);
  }

  public get solved() {
    return this.rows.every((r) => r.every((c) => c.value !== null));
  }

  public clear(clearMarks: boolean = true, force: boolean = false): void {
    this.columns.forEach((row) => {
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
    this.columns.forEach((group) =>
      group.forEach((cell) => {
        if (cell.value !== null) {
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

  public save(): string {
    const { cellBits } = getDataInfo(this.size);
    let bitString = "";
    this.rows.forEach((row) =>
      row.forEach(({ locked, value }) => {
        bitString += locked ? "1" : "0";
        bitString += bits((value ?? -1) + 1, cellBits - 1);
      }),
    );
    return new Uint8Array(
      bitString.match(/.{1,8}/g)!.map((s) => parseInt(s.padEnd(8, "0"), 2)),
    ).toBase64({ alphabet: "base64url", omitPadding: true });
  }
  public load(data: string | string[][]) {
    if (typeof data === "string") {
      const { length, cellBits } = getDataInfo(data);
      const bitSring = [...Uint8Array.fromBase64(data)]
        .map((b) => bits(b, 8))
        .join("");
      const splitter = new RegExp(`.{${cellBits}}`, "g");
      const cells: string[] = bitSring.match(splitter) ?? [];
      this.rows.forEach((row, r) =>
        row.forEach((cell, c) => {
          const bits = cells[length * r + c];
          const value = parseInt(bits.slice(1), 2);
          if (value) {
            cell.value = value - 1;
            if (bits.startsWith("1")) cell.lock();
          }
        }),
      );
    } else {
      this.clear(true, true);
      const tokenValues = Object.fromEntries(
        this.tokens.map(({ token }, v) => [token, v]),
      );
      this.rows.forEach((row, r) =>
        row.forEach((cell, c) => {
          cell.value = tokenValues[data[r][c]];
          cell.lock();
        }),
      );
    }
  }
}

function parseInit(init: number | string | string[][]) {
  if (typeof init === "number") return { size: init, length: init * init };
  if (init instanceof Array)
    return {
      size: Math.sqrt(init.length),
      length: init.length,
      data: init,
    };
  const { size, length } = getDataInfo(init);
  return { size, length, data: init };
}

function getDataInfo(data: number | string | ArrayBuffer) {
  const size =
    typeof data === "number"
      ? data
      : {
          [8]: 2,
          [51]: 3,
          [192]: 4,
          [469]: 5,
          [1134]: 6,
        }[
          (data instanceof ArrayBuffer ? data : Uint8Array.fromBase64(data))
            .byteLength
        ];
  if (!size || size < 2 || size > 6) throw "Invalid size";
  const length = size * size;
  const cellBits = 1 + Math.ceil(Math.log2(length + 1));
  return { size, length, cellBits };
}

function bits(n: number, b: number) {
  return n.toString(2).padStart(b, "0");
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
