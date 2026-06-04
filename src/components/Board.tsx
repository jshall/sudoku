import { css } from "@emotion/react";
import { useContext } from "react";
import { cx, cssGrid } from "./_styles";
import { AppContext } from "./AppContext";
import { Tile } from "./Tile";

const cssBoard = css({
  position: "relative",
  border: "var(--border-hard) var(--border-width)",
});

const cssBlock = css({
  border: "var(--border-hard) var(--border-width)",

  color: "var(--pencil)",
  fontFamily: "var(--mono)",
});

const cssSolved = css({
  display: "none",
  pointerEvents: "none",

  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",

  color: "var(--accent)",
  padding: "0.2em 0.6em",
  fontSize: "20vmin",
  lineHeight: 1,

  background:
    "radial-gradient(ellipse, rgb(from var(--bg) r g b / 0.8) 55%, #fff0 70% )",

  ".solved > &": {
    display: "block",
  },
});

export default function Board() {
  const { game, solved } = useContext(AppContext)!;

  return (
    <div className={cx({ solved })} css={[cssGrid, cssBoard]}>
      {game.blocks.map((group, i) => (
        <div key={i} css={[cssGrid, cssBlock]}>
          {group.map((cell, i) => (
            <Tile key={i} cell={cell} />
          ))}
        </div>
      ))}
      <div css={cssSolved}>Solved!</div>
    </div>
  );
}
