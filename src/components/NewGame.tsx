import { css } from "@emotion/react";
import { useCallback, useContext, useMemo, useRef, useState } from "react";
import {
  availableSizes,
  availableSources,
  getGame,
} from "utilities/gameLibrary";
import { cssBoxShadow, cssFlex } from "utilities/styles";
import { AppContext } from "./AppContext";

const cssInputRow = css({ marginBottom: ".7em" });

const cssDialog = css({
  "&[open]": cssFlex,
  flexDirection: "column",
  borderRadius: "1rem",
});

export function NewGame() {
  const { game, newGame } = useContext(AppContext)!;
  const dialog = useRef<HTMLDialogElement>(null);
  const [isGenerating, setGenerating] = useState(false);
  const [size, setSize] = useState(game.size);
  const [sourceName, setSourceName] = useState(
    availableSources(size).find(() => true)!.name,
  );

  const sizeOptions = useMemo(
    () =>
      availableSizes()
        .map(({ size, description }) => (
          <option key={size} value={size}>
            {description}
          </option>
        ))
        .toArray(),
    [],
  );
  const generatorOptions = useMemo(
    () =>
      availableSources(size)
        .map(({ name }) => <option key={name}>{name}</option>)
        .toArray(),
    [size],
  );

  async function generate() {
    setGenerating(true);
    try {
      newGame(await getGame(size, sourceName));
      dialog.current?.close();
    } finally {
      setGenerating(false);
    }
  }

  function onSizeChange(newValue: string) {
    const size = parseInt(newValue);
    const sources = availableSources(size)
      .map((s) => s.name)
      .toArray();
    if (!sources.includes(sourceName)) setSourceName(sources[0]);
    setSize(size);
  }

  const open = useCallback(() => dialog.current?.showModal(), [dialog]);
  const close = useCallback(() => dialog.current?.close(), [dialog]);

  return (
    <>
      <button type="button" onClick={open}>
        New Game
      </button>
      <dialog ref={dialog} css={[cssDialog, cssBoxShadow]}>
        <h2>New Game</h2>
        <div css={cssInputRow}>
          <label>
            Board size:&nbsp;
            <select
              id="size"
              value={size}
              onChange={(e) => onSizeChange(e.target.value)}
            >
              {sizeOptions}
            </select>
          </label>
        </div>
        <div css={cssInputRow}>
          <label>
            Generator:&nbsp;
            <select
              id="generatorName"
              value={sourceName}
              onChange={(e) => setSourceName(e.target.value)}
            >
              {generatorOptions}
            </select>
          </label>
        </div>
        {isGenerating ? (
          <div>Generating...</div>
        ) : (
          <div css={[cssFlex, { gap: ".6em" }]}>
            <button type="reset" onClick={close}>
              Cancel
            </button>
            <button type="submit" onClick={generate}>
              Generate!
            </button>
          </div>
        )}
      </dialog>
    </>
  );
}
