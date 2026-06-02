import { css } from "@emotion/react";
import { useEffect, useMemo, useState } from "react";
import { Game } from "../Sudoku";
import { flexDirectionLong, flexStyle, noSelectStyle } from "./_styles";
import { AppContext, useAppContext } from "./AppContext";
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
  return new Game(
    "BkEgXBUAASACgAXoAAAAlYAKABIAAZAAALgAAGQABEAJABPAAAAClQAiAFgABcGQVBgA",
  );
}

const appStyle = css({
  width: "100svw",
  height: "100svh",
});

export default function App() {
  const [sizeVariables, setSizeVariables] = useState(css`
    --tile: 0px;
    --note: 0px;
    --border-width: 0px;
  `);
  const game = useMemo(
    () =>
      firstValidGame(
        parse(location.hash.slice(1)),
        localStorage.getItem("gameState") ?? "",
      ),
    [],
  );

  useEffect(() => {
    const grid = game.size;
    function resize() {
      const { width, height } = window.visualViewport!;
      document.body.className = width > height ? "landscape" : "portrait";
      const border = 1;
      const note = Math.floor(
        (((Math.min(width, height) - 2 * border) / grid - 2 * border) / grid -
          2 * border) /
          grid,
      );
      setSizeVariables(css`
        --grid: repeat(${grid}, 1fr);
        --tile: ${grid * note}px;
        --note: ${note}px;
        --border-width: ${border}px;
      `);
    }
    resize();
    addEventListener("resize", resize);
    return () => removeEventListener("resize", resize);
  }, [game.size]);

  return (
    <div
      css={[
        sizeVariables,
        flexStyle,
        flexDirectionLong,
        appStyle,
        noSelectStyle,
      ]}
    >
      <AppContext value={useAppContext(game)}>
        <Toolbar />
        <Board />
      </AppContext>
    </div>
  );
}
