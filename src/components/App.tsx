import { css } from "@emotion/react";
import { useEffect, useMemo, useState } from "react";
import { Game } from "../Sudoku";
import { AppContext, useAppContext } from "./AppContext";
import Board from "./Board";
import { Tokens } from "./Tokens";

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
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexDirection: "column",
  "&.landscape": {
    flexDirection: "row",
  },
  userSelect: "none",
});

export default function App() {
  const [layout, setLayout] = useState("portrait");
  const [sizeVariables, setSizeVariables] = useState(css`
    --grid: repeat(3, 1fr);
    --tile: 10.8svmin;
    --note: 3.6svmin;
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
    const g = game.size;
    function resize() {
      const { width, height } = window.visualViewport!;
      setLayout(width > height ? "landscape" : "portrait");
      const n = Math.floor(
        (((Math.min(width, height) - 2) / g - 2) / g - 2) / g,
      );
      setSizeVariables(css`
        --grid: repeat(${g}, 1fr);
        --tile: ${g * n}px;
        --note: ${n}px;
      `);
    }
    resize();
    addEventListener("resize", resize);
    return () => removeEventListener("resize", resize);
  }, [game.size]);

  return (
    <div className={layout} css={[sizeVariables, appStyle]}>
      <AppContext value={useAppContext(game)}>
        <Tokens />
        <Board />
      </AppContext>
    </div>
  );
}
