import { Cell } from "./Cell";
import { createDispatcher } from "./Dispatcher";

export class Group extends Array<Cell> {
  private readonly subscribe;

  public updateUsage;

  constructor() {
    super();
    const { subscribe, dispatch } =
      createDispatcher<[action: 1 | -1, value: number]>();
    this.subscribe = subscribe;
    this.updateUsage = dispatch;
  }

  public add(
    item: Cell,
    updateUsage: (action: 1 | -1, value: number) => void,
  ): void {
    this.push(item);
    this.subscribe(updateUsage);
  }
}
