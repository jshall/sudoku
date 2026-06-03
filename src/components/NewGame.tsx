/* eslint-disable no-unexpected-multiline */
import { css } from "@emotion/react";
import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { boxShadowStyle, flexStyle } from "./_styles";
import { AppContext, generators } from "./AppContext";

const inputRowStyle = css({ marginBottom: ".7em" });

const dialogStyle = css({
  "&[open]": flexStyle,
  flexDirection: "column",
  borderRadius: "1rem",
});

export function NewGame() {
  const { newGame } = useContext(AppContext)!;
  const dialog = useRef<HTMLDialogElement>(null);
  const [isGenerating, setGenerating] = useState(false);
  const [size, setSize] = useState(3);
  const [generatorName, setGeneratorName] = useState("dosuku");

  const sizeOptions = useMemo(
    () =>
      Object.entries(generators).map(([size, [description]]) => (
        <option key={size} value={size}>
          {description}
        </option>
      )),
    [],
  );
  const generatorOptions = useMemo(
    () =>
      Object.keys(generators[size][1]).map((name) => (
        <option key={name}>{name}</option>
      )),
    [size],
  );

  useEffect(() => {
    const list = Object.keys(generators[size][1]);
    if (!list.includes(generatorName))
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setGeneratorName(list[0]);
  }, [size, generatorName, setGeneratorName]);

  const generate = useCallback(async () => {
    setGenerating(true);
    try {
      const init = await generators[size][1][generatorName]();
      newGame(init);
      dialog.current?.close();
    } finally {
      setGenerating(false);
    }
  }, [dialog, generatorName, size, newGame]);

  return (
    <>
      <button type="button" onClick={() => dialog.current?.showModal()}>
        New Game
      </button>
      <dialog ref={dialog} css={[dialogStyle, boxShadowStyle]}>
        <h2>New Game</h2>
        <div css={inputRowStyle}>
          <label>
            Board size:&nbsp;
            <select
              id="size"
              value={size}
              onChange={(e) => setSize(parseInt(e.target.value))}
            >
              {sizeOptions}
            </select>
          </label>
        </div>
        <div css={inputRowStyle}>
          <label>
            Generator:&nbsp;
            <select
              id="generatorName"
              value={generatorName}
              onChange={(e) => setGeneratorName(e.target.value)}
            >
              {generatorOptions}
            </select>
          </label>
        </div>
        {isGenerating ? (
          <div>Generating...</div>
        ) : (
          <div css={[flexStyle, { gap: ".6em" }]}>
            <button onClick={() => dialog.current?.close()}>Cancel</button>
            <button onClick={generate}>Generate!</button>
          </div>
        )}
      </dialog>
    </>
  );
}
