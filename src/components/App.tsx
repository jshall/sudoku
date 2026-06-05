import { css } from "@emotion/react";
import { useMemo } from "react";
import {
  borderWidth,
  cssFlex,
  cssFlexDirectionLong,
  cssNoSelect,
  gameSize,
  gridTemplate,
  noteSize,
  tileSize,
  varBorderWidth,
  varGameSize,
  varNoteSize,
} from "./_styles";
import { AppContext, useAppContext } from "./AppContext";
import Board from "./Board";
import { Toolbar } from "./Toolbar";

const cssApp = css({
  [gameSize]: 3,
  [borderWidth]: "1px",
  [gridTemplate]: `repeat(${varGameSize}, 1fr)`,
  [noteSize]: `calc(round(down, (((100svmin - 2 * ${varBorderWidth}) / ${varGameSize} - 2 * ${varBorderWidth}) / ${varGameSize} - 2 * ${varBorderWidth}) / ${varGameSize}, 1px))`,
  [tileSize]: `calc(${varGameSize}*${varNoteSize})`,
  width: "100svw",
  height: "100svh",
  overflow: "clip",
});

export default function App() {
  const ctx = useAppContext(location.hash);

  const cssSizeVariables = useMemo(
    () => css({ [gameSize]: ctx.game.size }),
    [ctx.game.size],
  );

  return (
    <div
      css={[
        cssFlex,
        cssFlexDirectionLong,
        cssNoSelect,
        cssApp,
        cssSizeVariables,
      ]}
    >
      <AppContext value={ctx}>
        <Toolbar />
        <Board />
      </AppContext>
    </div>
  );
}
