import { css } from "@emotion/react";
import { useContext } from "react";
import { cx, flexDirectionShort, flexStyle } from "./_styles";
import { AppContext } from "./AppContext";

const tokenStyle = css({
  // flex: 1,
  position: "relative",
  container: "size",
  color: "var(--pencil)",
  textAlign: "center",
  fontSize: "calc(0.7 * var(--tile))",
  lineHeight: 1,
  minWidth: "1em",
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
  const { game, highlightValue, setHighlightValue, tokens } =
    useContext(AppContext)!;

  return (
    <div css={[flexStyle, flexDirectionShort]}>
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
    </div>
  );
}
