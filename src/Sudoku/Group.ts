import { Game } from "./Game";
import { Cell } from "./Cell";
import { createDispatcher } from "./Dispatcher";

export class Group {
  private readonly _list: Cell[] = [];
  private readonly subscribe;

  public readonly game: Game;
  public updateUsage;
  public map = this._list.map.bind(this._list);
  public forEach = this._list.forEach.bind(this._list);

  constructor(game: Game) {
    this.game = game;
    const { subscribe, dispatch } =
      createDispatcher<[action: 1 | -1, value: number]>();
    this.subscribe = subscribe;
    this.updateUsage = dispatch;
  }

  public add(
    item: Cell,
    updateUsage: (action: 1 | -1, value: number) => void,
  ): void {
    this._list[this._list.length] = item;
    this.subscribe(updateUsage);
  }
}
