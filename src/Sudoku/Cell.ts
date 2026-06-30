import { createDispatcher, type Dispatcher } from "./Dispatcher";
import type { Game } from "./Game";
import { Group } from "./Group";

export type Note = {
  alreadyUsed: number;
  unlikely: boolean;
};
export class Cell {
  private readonly validate: (value: number) => void;
  private readonly updateGroups: (action: 1 | -1, value: number) => void;
  private readonly stateChanged: Dispatcher["dispatch"];
  private readonly tokens: Game["tokens"];
  private readonly _notes: Note[];
  private _locked: boolean = false;
  private _value: number | null = null;

  private readonly lockChanged = createDispatcher();
  private readonly valueChanged = createDispatcher();
  private readonly noteChanged = createDispatcher();
  public readonly onLockChanged = this.lockChanged.subscribe;
  public readonly onValueChanged = this.valueChanged.subscribe;
  public readonly onNotesChanged = this.noteChanged.subscribe;

  constructor(
    tokens: Game["tokens"],
    stateChanged: Dispatcher["dispatch"],
    ...groups: Group[]
  ) {
    this.tokens = tokens;
    this.validate = (value: number) => {
      if (value < 0 || value >= tokens.length) {
        throw Error("Out of range.");
      }
      if (value != value >> 0) {
        throw Error("Not an integer.");
      }
    };
    this.updateGroups = (...args) =>
      groups.forEach((group) => {
        group.updateUsage(...args);
      });
    this.stateChanged = stateChanged;
    this._notes = tokens.map(() => ({
      alreadyUsed: 0,
      unlikely: false,
    }));
    groups.forEach((g) => {
      g.add(this, (action, value) => {
        this._notes[value].alreadyUsed += action;
        this.noteChanged.dispatch();
      });
    });
  }

  get locked(): boolean {
    return this._locked;
  }
  get value(): number | null {
    return this._value;
  }
  set value(value: number | null) {
    if (this._locked) throw Error("You may not change this tile.");
    if ((value ?? null) === this._value) return;
    if (typeof value === "number") {
      this.validate(value);
      if (this._notes[value].alreadyUsed)
        throw Error("This value has already been eliminated.");
    }
    const params = [value === null ? -1 : 1, value ?? this._value!] as const;
    this._value = value;
    this.tokens[params[1]].left -= params[0];
    this.valueChanged.dispatch();
    this.stateChanged();
    this.updateGroups(...params);
  }
  get notes() {
    return this._notes
      .map(({ alreadyUsed, unlikely }) =>
        alreadyUsed ? "used" : unlikely ? "unlikely" : "possible",
      )
      .join("|");
  }

  public lock(): void {
    if (this._value !== null) {
      this._locked = true;
      this.lockChanged.dispatch();
    }
  }
  public toggleNote(value: number, status?: boolean): void {
    this.validate(value);
    this._notes[value].unlikely =
      status === undefined ? !this._notes[value].unlikely : status;
    this.noteChanged.dispatch();
    this.stateChanged();
  }
}
