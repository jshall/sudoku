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
  private _value: number | undefined = undefined;
  private _notes: Note[];

  readonly id: string;
  readonly game: Game;
  readonly lockUpdates = createDispatcher();
  readonly valueUpdates = createDispatcher();
  readonly noteUpdates = createDispatcher();

  get locked(): boolean {
    return this._locked;
  }
  get value(): number | undefined {
    return this._value;
  }
  set value(value: number | null | undefined) {
    if (this._locked) throw Error("You may not change this tile.");
    if (value === null) value = undefined;
    if (value === this._value) return;
    if (value !== undefined) {
      this.game.validate(value);
      if (this._notes[value].alreadyUsed)
        throw Error("This value has already been eliminated.");
    }
    this._groups.forEach(({ updateUsage }) => {
      updateUsage(value === undefined ? -1 : 1, value ?? this._value!);
    });
    this._value = value;
    this.valueUpdates.dispatch();
  }
  get notes() {
    return this._notes
      .map(({ alreadyUsed, unlikely }) =>
        alreadyUsed ? "used" : unlikely ? "unlikely" : "possible",
      )
      .join("|");
  }

  constructor(id: string, ...groups: Group[]) {
    this.id = id;
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

  public lock(): void {
    if (this._value !== undefined) {
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
