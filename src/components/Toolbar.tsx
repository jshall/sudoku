import { css } from "@emotion/react";
import { useContext } from "react";
import { flexDirectionShort, flexStyle } from "./_styles";
import { AppContext } from "./AppContext";
import { Tokens } from "./Tokens";

const buttonGroupStyle = css({
  flex: 0,
  flexDirection: "column",
  gap: "0.4em",
  padding: "0.4em",
});

export function Toolbar() {
  const { game, newGame } = useContext(AppContext)!;

  return (
    <div css={[flexStyle, flexDirectionShort]}>
      <div css={[flexStyle, buttonGroupStyle]}>
        <button type="button" onClick={() => newGame(game)}>
          New Game
        </button>
      </div>
      <Tokens />
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
