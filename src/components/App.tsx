import { useEffect, useMemo } from "react";
import { Game } from "../Sudoku";
import Board from "./Board";
import { AppContext, useAppContext } from "./AppContext";
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

export default function App() {
  const game = useMemo(
    () =>
      firstValidGame(
        parse(location.hash.slice(1)),
        localStorage.getItem("gameState") ?? "",
      ),
    [],
  );

  useEffect(() => {
    const app = document.getElementById("root")!;
    const g = game.size;
    function resize() {
      const layout =
        window.visualViewport!.width > window.visualViewport!.height
          ? "landscape"
          : "portrait";
      const b = Math.min(
        window.visualViewport!.width,
        window.visualViewport!.height,
      );
      const n = Math.floor((((b - 2) / g - 2) / g - 2) / g);
      const t = g * n;

      app.className = layout;
      app.style.setProperty("--width-note", `${n}px`);
      app.style.setProperty("--width-tile", `${t}px`);
      app.style.setProperty("--grid", `repeat(${g}, 1fr)`);
    }
    resize();
    addEventListener("resize", resize);
    return () => removeEventListener("resize", resize);
  }, [game.size]);

  return (
    <AppContext value={useAppContext(game)}>
      <Tokens />
      <Board />
    </AppContext>
  );
}
