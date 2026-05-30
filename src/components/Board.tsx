import { useContext } from "react";
import { cx } from "../utils";
import { Tile } from "./Tile";
import { AppContext } from "./AppContext";

export default function Board() {
  const { game, solved } = useContext(AppContext)!;

  return (
    <div className={cx("board grid", { solved })}>
      {game.blocks.map((group, i) => (
        <div key={i} className={cx("block grid")}>
          {group.map((cell, i) => (
            <Tile key={i} cell={cell} />
          ))}
        </div>
      ))}
      <div className={"solved"}>Solved!</div>
    </div>
  );
}
