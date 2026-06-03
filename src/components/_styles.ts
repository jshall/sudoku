import { css } from "@emotion/react";
import { useEffect } from "react";

export function cx(...classes: (string | Record<string, boolean>)[]) {
  const classList: string[] = [];
  for (const item of classes) {
    if (typeof item === "string") classList.push(item);
    else
      Object.entries(item).forEach(([name, keep]) => {
        if (keep) classList.push(name);
      });
  }
  return classList.join(" ");
}

export const noSelectStyle = css({
  userSelect: "none",
});

export function gridStyle(gridSize: number) {
  return css({
    display: "grid",
    alignItems: "center",
    justifyContent: "center",
    gridTemplateRows: `repeat(${gridSize}, 1fr)`,
    gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
    "> *": {
      flex: 1,
    },
  });
}

export const flexStyle = css({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
});

export function useOrientation() {
  useEffect(() => {
    function resize() {
      if (!visualViewport) return;
      const { width, height } = window.visualViewport!;
      document.body.className = width > height ? "landscape" : "portrait";
    }
    resize();
    addEventListener("resize", resize);
    return () => removeEventListener("resize", resize);
  }, []);

  return {
    flexDirectionLong: css({
      ".portrait &": {
        flexDirection: "column",
      },
    }),
    flexDirectionShort: css({
      ".landscape &": {
        flexDirection: "column",
      },
    }),
  };
}

export const boxShadowStyle = css({
  boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
});
