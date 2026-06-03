import { css } from "@emotion/react";
import { useMemo } from "react";
import { Game } from "../Sudoku";
import { flexStyle, noSelectStyle, useOrientation } from "./_styles";
import { AppContext, DEFAULT_GAME, useAppContext } from "./AppContext";
import Board from "./Board";
import { Toolbar } from "./Toolbar";

function parse(init: string) {
  const number = parseInt(init);
  if (number) return number;
  return init;
}

function firstValidGame(...init: (number | string)[]) {
  for (const item of init) {
    try {
      return new Game(item);
    } catch {
      console.debug("new game failed:", item);
    }
  }
  return new Game(DEFAULT_GAME);
}

const appStyle = css({
  width: "100svw",
  height: "100svh",
});

export default function App() {
  const { flexDirectionLong } = useOrientation();
  const game = useMemo(
    () =>
      firstValidGame(
        parse(location.hash.slice(1)),
        localStorage.getItem("gameState") ?? "",
      ),
    [],
  );

  return (
    <div css={[flexStyle, flexDirectionLong, appStyle, noSelectStyle]}>
      <AppContext value={useAppContext(game)}>
        <Toolbar />
        <Board />
      </AppContext>
    </div>
  );
}
