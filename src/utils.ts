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
