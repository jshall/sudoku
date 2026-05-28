import { useContext, useMemo, type UIEvent } from "react";
import { cx } from "../utils";
import { AppContext } from "./AppContext";
import { TileContext } from "./TileContext";

export function TileValue() {
  const { highlightValue, setHighlightValue, tokens } = useContext(AppContext)!;
  const { cell, value, locked } = useContext(TileContext)!;
  const events = useMemo(() => {
    const base = {
      onClick() {
        setHighlightValue((val) => (val === value ? null : value));
      },
    };
    return locked
      ? base
      : {
          ...base,
          onContextMenu(e: UIEvent) {
            e.preventDefault();
            // eslint-disable-next-line react-hooks/immutability
            cell.value = null;
          },
        };
  }, [cell, locked, setHighlightValue, value]);
  return (
    <div
      className={cx("tile flex value", {
        clickable: "onClick" in events || "onContextMenu" in events,
        locked,
        highlight: cell.value === highlightValue,
      })}
      {...events}
    >
      {tokens[value!].token}
    </div>
  );
}
