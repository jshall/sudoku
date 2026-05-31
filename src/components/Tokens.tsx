import { useContext } from "react";
import { AppContext } from "./AppContext";
import { cx } from "../utils";

export function Tokens() {
  const { game, highlightValue, newGame, setHighlightValue, tokens } =
    useContext(AppContext)!;

  return (
    <div id="tokens" className="flex">
      <div className="flex column buttons">
        <button type="button" onClick={() => newGame(game)}>
          New Game
        </button>
        <button type="button" onClick={() => game.clear()}>
          Reset
        </button>
      </div>
      {tokens.map(({ token, count }, i) => (
        <div
          key={i}
          className={cx("flex clickable", {
            highlight: highlightValue === i,
          })}
          onClick={() => setHighlightValue((v) => (i === v ? null : i))}
        >
          <div className="token">{token}</div>
          <div className="count">{count}</div>
        </div>
      ))}
      <div className="flex column buttons">
        <button type="button" onClick={() => game.lock()}>
          Lock
        </button>
      </div>
    </div>
  );
}
