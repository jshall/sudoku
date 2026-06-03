import { css } from "@emotion/react";
import { flexStyle, noSelectStyle, useOrientation } from "./_styles";
import { AppContext, useAppContext } from "./AppContext";
import Board from "./Board";
import { Toolbar } from "./Toolbar";

const appStyle = css({
  width: "100svw",
  height: "100svh",
});

export default function App() {
  const ctx = useAppContext(location.hash);
  const { flexDirectionLong } = useOrientation();

  return (
    <>
      <div css={[flexStyle, flexDirectionLong, noSelectStyle, appStyle]}>
        <AppContext value={ctx}>
          <Toolbar />
          <Board />
        </AppContext>
      </div>
    </>
  );
}
