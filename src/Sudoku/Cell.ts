import { createDispatcher } from "./Dispatcher";
import { Game } from "./Game";
import { Group } from "./Group";

export type Note = {
  alreadyUsed: number;
  unlikely: boolean;
};
export class Cell {
  private _groups: Group[];
  private _locked: boolean = false;
  private _value: number | null = null;
  private _notes: Note[];

  readonly game: Game;
  readonly lockUpdates = createDispatcher();
  readonly valueUpdates = createDispatcher();
  readonly noteUpdates = createDispatcher();

  constructor(...groups: Group[]) {
    this._groups = groups;
    const { length } = (this.game = groups[0].game);
    this._notes = Array.from({ length }, () => ({
      alreadyUsed: 0,
      unlikely: false,
    }));
    groups.forEach((g) => {
      if (g.game !== this.game) throw new Error("Incompatible groups");
      g.add(this, (action, value) => {
        this._notes[value].alreadyUsed += action;
        this.noteUpdates.dispatch();
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
      this.game.validate(value);
      if (this._notes[value].alreadyUsed)
        throw Error("This value has already been eliminated.");
    }
    this._groups.forEach(({ updateUsage }) => {
      updateUsage(value === null ? -1 : 1, value ?? this._value!);
    });
    this._value = value;
    this.valueUpdates.dispatch();
    this.game.valueUpdates.dispatch();
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
      this.lockUpdates.dispatch();
    }
  }
  public toggleNote(value: number, status?: boolean): void {
    this.game.validate(value);
    this._notes[value].unlikely =
      status === undefined ? !this._notes[value].unlikely : status;
    this.noteUpdates.dispatch();
  }
}
