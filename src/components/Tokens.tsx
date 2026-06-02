import { css } from "@emotion/react";
import { useContext } from "react";
import { flexStyle } from "../utils";
import { cx } from "../utils";
import { AppContext } from "./AppContext";

const toolbarStyle = css({
  color: "var(--pencil)",
  ".landscape &": {
    flexDirection: "column",
    height: "100svh",
  },
  ".portrait &": {
    flexDirection: "row",
    width: "100svw",
  },
});

const buttonGroupStyle = css({
  flex: 0,
  flexDirection: "column",
  gap: "0.4em",
  padding: "0.4em",
});

const tokenStyle = css({
  flex: 1,
  position: "relative",
  container: "size",
  textAlign: "center",
  fontSize: "calc(0.7 * var(--tile))",
  lineHeight: "normal",
  "&.highlight": {
    background: "radial-gradient(var(--highlight) 50%, #fff0 85%)",
  },
});

const countStyle = css({
  fontSize: "0.3em",
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(160%, 50%)",
});

export function Tokens() {
  const { game, highlightValue, newGame, setHighlightValue, tokens } =
    useContext(AppContext)!;

  return (
    <div css={[flexStyle, toolbarStyle]}>
      <div css={[flexStyle, buttonGroupStyle]}>
        <button type="button" onClick={() => newGame(game)}>
          New Game
        </button>
      </div>
      {tokens.map(({ token, count }, i) => {
        const events =
          tokens[i].count === game.length
            ? {}
            : {
                onClick() {
                  setHighlightValue((v) => (i === v ? null : i));
                },
              };
        return (
          <div
            key={i}
            className={cx({
              clickable: "onClick" in events,
              highlight: highlightValue === i,
            })}
            css={[flexStyle, tokenStyle]}
            {...events}
          >
            <div>{token}</div>
            <div css={countStyle}>{count}</div>
          </div>
        );
      })}
      <div css={[flexStyle, buttonGroupStyle]}>
        <button type="button" onClick={() => game.lock()}>
          Lock
        </button>
        <button type="button" onClick={() => game.clear()}>
          Reset
        </button>
      </div>
    </div>
  );
}
