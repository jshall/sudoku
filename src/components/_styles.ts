import { css } from "@emotion/react";

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

export const cssNoSelect = css({
  userSelect: "none",
});

export const cssGrid = css({
  display: "grid",
  alignItems: "center",
  justifyContent: "center",
  gridTemplateRows: "var(--grid-template)",
  gridTemplateColumns: "var(--grid-template)",
  "> *": {
    flex: 1,
  },
});

export const cssFlex = css({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
});

export const cssFlexDirectionLong = css({
  "@media(orientation: portrait)": {
    flexDirection: "column",
  },
});

export const cssFlexDirectionShort = css({
  "@media(orientation: landscape)": {
    flexDirection: "column",
  },
});

export const cssBoxShadow = css({
  boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
});
