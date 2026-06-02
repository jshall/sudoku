import { css } from "@emotion/react";
import { useContext } from "react";
import { gridStyle } from "../utils";
import { cx } from "../utils";
import { AppContext } from "./AppContext";
import { Tile } from "./Tile";

const boardStyle = css({
  position: "relative",
  border: "var(--border-hard) 1px",
});

const blockStyle = css({
  border: "var(--border-hard) 1px",

  color: "var(--pencil)",
  fontFamily: "var(--mono)",
});

const solvedStyle = css({
  display: "none",
  pointerEvents: "none",

  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",

  color: "var(--accent)",
  lineHeight: "normal",
  padding: "0.2em 0.6em",
  fontSize: "20vmin",

  background:
    "radial-gradient(ellipse, rgb(from var(--bg) r g b / 0.8) 55%, #fff0 70% )",

  ".solved > &": {
    display: "block",
  },
});

export default function Board() {
  const { game, solved } = useContext(AppContext)!;

  return (
    <div className={cx({ solved })} css={[gridStyle, boardStyle]}>
      {game.blocks.map((group, i) => (
        <div key={i} css={[gridStyle, blockStyle]}>
          {group.map((cell, i) => (
            <Tile key={i} cell={cell} />
          ))}
        </div>
      ))}
      <div css={solvedStyle}>Solved!</div>
    </div>
  );
}
