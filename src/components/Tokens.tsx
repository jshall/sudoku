import { css } from "@emotion/react";
import { useContext } from "react";
import { cx, flexStyle, useOrientation } from "./_styles";
import { AppContext } from "./AppContext";

function tokenStyle(tileSize: number) {
  return css({
    position: "relative",
    container: "size",
    color: "var(--pencil)",
    textAlign: "center",
    fontSize: Math.floor(0.7 * tileSize),
    lineHeight: 1,
    minWidth: "1em",
    "&.highlight": {
      background: "radial-gradient(var(--highlight) 50%, #fff0 85%)",
    },
  });
}

const countStyle = css({
  fontSize: "0.3em",
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(160%, 50%)",
});

export function Tokens() {
  const { flexDirectionShort } = useOrientation();
  const { game, highlightValue, setHighlightValue, tokens, uiSizes } =
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
            css={[flexStyle, tokenStyle(uiSizes.note * uiSizes.grid)]}
            {...events}
          >
            {token}
            <div css={countStyle}>{count}</div>
          </div>
        );
      })}
    </div>
  );
}
