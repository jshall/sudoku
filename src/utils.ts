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

export const gridStyle = css({
  display: "grid",
  alignItems: "center",
  justifyContent: "center",
  gridTemplateRows: "var(--grid)",
  gridTemplateColumns: "var(--grid)",
  "> *": {
    flex: 1,
  },
});

export const flexStyle = css({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
});
