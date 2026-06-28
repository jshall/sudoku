import { css } from "@emotion/react";
import { useCallback, useContext } from "react";
import { cssFlex, cssFlexDirectionShort } from "utilities/styles";
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

  const lock = useCallback(() => game.lock(), [game]);
  const reset = useCallback(() => game.clear(), [game]);

  return (
    <div css={[cssFlex, cssFlexDirectionShort]}>
      <div css={[cssFlex, cssButtonGroup]}>
        <NewGame />
      </div>
      <Tokens />
      <div css={[cssFlex, cssButtonGroup]}>
        <button type="button" onClick={lock}>
          Lock
        </button>
        <button type="button" onClick={reset}>
          Reset
        </button>
      </div>
    </div>
  );
}
