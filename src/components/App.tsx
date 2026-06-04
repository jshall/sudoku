import { css } from "@emotion/react";
import { useMemo } from "react";
import { cssFlex, cssFlexDirectionLong, cssNoSelect } from "./_styles";
import { AppContext, useAppContext } from "./AppContext";
import Board from "./Board";
import { Toolbar } from "./Toolbar";

const cssApp = css({
  width: "100svw",
  height: "100svh",
});

export default function App() {
  const ctx = useAppContext(location.hash);

  const cssSizeVariables = useMemo(
    () =>
      css({
        "--border-width": ctx.sizes.border + "px",
        "--grid-template": `repeat(${ctx.sizes.base}, 1fr)`,
        "--note-size": ctx.sizes.note + "px",
        "--tile-size": ctx.sizes.base * ctx.sizes.note + "px",
      }),
    [ctx.sizes],
  );

  return (
    <div
      css={[
        cssSizeVariables,
        cssFlex,
        cssFlexDirectionLong,
        cssNoSelect,
        cssApp,
      ]}
    >
      <AppContext value={ctx}>
        <Toolbar />
        <Board />
      </AppContext>
    </div>
  );
}
