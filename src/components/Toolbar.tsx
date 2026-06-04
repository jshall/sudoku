import { css } from "@emotion/react";
import { useContext } from "react";
import { cssFlex, cssFlexDirectionShort } from "./_styles";
import { AppContext } from "./AppContext";
import { NewGame } from "./NewGame";
import { Tokens } from "./Tokens";

const cssButtonGroup = css({
  flex: 0,
  flexDirection: "column",
  gap: "0.4em",
  padding: "0.4em",
});

export function Toolbar() {
  const { game } = useContext(AppContext)!;

  return (
    <div css={[cssFlex, cssFlexDirectionShort]}>
      <div css={[cssFlex, cssButtonGroup]}>
        <NewGame />
      </div>
      <Tokens />
      <div css={[cssFlex, cssButtonGroup]}>
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
