import { css } from "@emotion/react";
import { useContext } from "react";
import {
  cssFlex,
  cssFlexDirectionShort,
  cx,
  varTileSize,
} from "utilities/styles";
import { AppContext } from "./AppContext";

const cssToken = css({
  position: "relative",
  color: "var(--pencil)",
  textAlign: "center",
  fontSize: `calc(0.8 * ${varTileSize})`,
  lineHeight: 1.2,
  minWidth: "1em",
  "&.highlight": {
    background: "radial-gradient(var(--highlight) 50%, #fff0 85%)",
  },
  "&.complete": {
    color: "var(--pen)",
  },
});

const cssCount = css({
  fontSize: "0.3em",
  position: "absolute",
  bottom: 0,
  right: 0,
  color: "var(--pen)",
  fontWeight: "bolder",
  transform: "translate(15%, 0%)",
  background: "radial-gradient(var(--highlight) 50%, #fff0 85%)",
  borderRadius: "50%",
  width: "1.3em",
  padding: ".3em .2em",
});

export function Tokens() {
  const { highlightValue, setHighlightValue, tokens } = useContext(AppContext)!;

  return (
    <div css={[cssFlex, cssFlexDirectionShort]}>
      {tokens.map(({ token, count }, i) => (
        <div
          key={i}
          className={cx("clickable", {
            highlight: highlightValue === i,
            complete: count === tokens.length,
          })}
          css={[cssFlex, cssToken]}
          onClick={() => setHighlightValue(highlightValue === i ? null : i)}
        >
          {token}
          <div css={cssCount}>{count}</div>
        </div>
      ))}
    </div>
  );
}
