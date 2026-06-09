import { Game } from "Sudoku";

const LATEST_SIZE_SAVED = "latestSize";
const SAVED_GAMES_KEY = "savedGames";
const AUTOSAVE_NAME = "latest";

export interface GameSourceMetaData {
  name: string;
}
export interface GameSourceSync extends GameSourceMetaData {
  load(): Game;
}
export interface GameSourceAsync extends GameSourceMetaData {
  generate(): Promise<Game>;
}
export type GameSource = GameSourceSync | GameSourceAsync;

interface GameLibrary {
  [size: number]: {
    description: string;
    options: GameSource[];
  };
}

const global: GameLibrary = {
  [2]: {
    description: "4x4",
    options: [{ name: "blank", load: () => new Game(2) }],
  },
  [3]: {
    description: "9x9",
    options: [
      {
        name: "dosuku",
        async generate() {
          const res = await fetch("https://sudoku-api.vercel.app/api/dosuku");
          const data: {
            newboard: {
              grids: {
                value: number[][];
                solution: number[][];
              }[];
            };
          } = await res.json();
          return new Game(data.newboard.grids[0]?.value);
        },
      },
      {
        name: "default",
        load: () => new Game("YwisoIky0wRqTIjAWDAgRJXBOhAqLMKLgAA"),
      },
      { name: "blank", load: () => new Game(3) },
    ],
  },
  [4]: {
    description: "16x16",
    options: [
      {
        name: "default",
        load: () =>
          new Game(
            "h7uDZoy-iIXU9IT2L7QBRkqT4VICnlAyjsFf7I2QFQPpsKhpw9p2YsDdg" +
              "XEKo4OKh159sDg2_UlmQKRaDrch00RydNPggrMQwN_ipcfecMmy2sAA",
          ),
      },
      { name: "blank", load: () => new Game(4) },
    ],
  },
  [5]: {
    description: "25x25",
    options: [
      {
        name: "default",
        load: () =>
          new Game(
            "puonSETJLAbOFjRqC5DnLQxsK7dGCAEQ1YgsJYNrguWa2tF8arZCpyYlY" +
              "h4TbFQ1YMZxmlCpErghYShsoJ5AG2K28agqWCY0ZtdqiC6FXTfhuxYN" +
              "oA401yE1lEhTLCstlDCiYnpyRBwgphYst5A1KOCeKYE4uMFBkKVbFG1" +
              "XiszsgpwKhIuWrEjEcEzYhGANJYCqwhDOSte4olbhcyspOI4gxkta0Z" +
              "ldlN4uxh0DidguYQY7yppKi2OtC4NRstBOKJFVwCGopahLmmtoXrgnX" +
              "iHJowEpncorEpsqxTIuFECtvPY0DCu-0jBI0GwIHDCWQ0jVz2bIgaNW" +
              "6hOY7LUZC4lXAAA",
          ),
      },
      { name: "blank", load: () => new Game(5) },
    ],
  },
  [6]: {
    description: "36x36",
    options: [{ name: "blank", load: () => new Game(6) }],
  },
};

function getSavedGames() {
  const json = localStorage.getItem(SAVED_GAMES_KEY);
  return json
    ? (JSON.parse(json) as { [size: number]: { [name: string]: string } })
    : null;
}

export function* availableSizes() {
  for (const [size, { description }] of Object.entries(global)) {
    yield { size, description };
  }
}

export function* availableSources(size: number) {
  const savedGames = getSavedGames();
  if (savedGames && size in savedGames)
    for (const [name, state] of Object.entries(savedGames[size])) {
      yield { name, load: () => new Game(state) };
    }
  for (const item of global[size].options) {
    yield item;
  }
}

export function getGame(): Game;
export function getGame(size: number): Game;
export function getGame(size: number, name: string, allowAsync: false): Game;
export function getGame(
  size: number,
  name: string,
  allowAsync?: boolean,
): Game | Promise<Game>;
export function getGame(
  size?: number,
  name?: string,
  allowAsync: boolean = true,
) {
  if (!size) size = parseInt(localStorage.getItem(LATEST_SIZE_SAVED) ?? "");
  if (Number.isNaN(size)) {
    size = 3;
    name = "default";
  }
  if (!name) allowAsync = false;
  const source = availableSources(size).find(
    (source) => !name || source.name == name,
  );
  if (!source) throw `Invalid size or name: ${size},${name}`;
  if (!allowAsync && "generate" in source) throw "source is async";
  return "load" in source ? source.load() : source.generate();
}

export function saveGame(game: Game, name: string = AUTOSAVE_NAME) {
  const savedGames = getSavedGames() ?? {};
  if (!savedGames[game.size]) savedGames[game.size] = {};
  savedGames[game.size][name] = game.save("binary", true, true);
  localStorage.setItem(SAVED_GAMES_KEY, JSON.stringify(savedGames));
  localStorage.setItem(LATEST_SIZE_SAVED, game.size.toString());
}
