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
                value: string[][];
                solution: string[][];
              }[];
            };
          } = await res.json();
          return new Game(data.newboard.grids[0]?.value);
        },
      },
      {
        name: "default",
        load: () =>
          new Game(
            "BkEgXBUAASACgAXoAAAAlYAKABIAAZAAALgAAGQABEAJABPAAA" +
              "AClQAiAFgABcGQVBgA",
          ),
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
            "vupAAsAArAAqAwAiAAAhoAlvjAAAksAAAosAhAAAAAlAqAAmAA" +
              "ktAAmAAhAAAlvAlAAAAqAisAAAAAmwsAAinAhAAAmAAAAAAwAk" +
              "ApAmAAAArAtAAvrAukAAAnAAAAAsnAAAAAoAAAhmAipAAtAmAA" +
              "AAuAvAwAsAAAAAAtAAAsAwmAAjqjAAAAAliArAAAAuAsjAAAuA" +
              "ArAAiqAAuAArAwAAAAAhAmkAAAhpAAAswiAloAAAwAvAtAAqAA" +
              "sAAnrp",
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
            "4ApoAlAAjAzAmhAA3A5AtA1A2AAAAAvAi0mpAytAAsu1AxAhAA" +
              "AAAjAAA2AyAAAAAtAAmh3vAAAAvAt2uA1AwkAr3AiAqzAyAAsA" +
              "AAi5An3AArAAA2AxAyoAAA0AmAAAArAjAshiAxmAAAA3ApAAol" +
              "AAAAAAA3yAuwAAA2AAAAArAtAAAnAA1A0A23rAAhviAsqwx4Ay" +
              "AxA3hAAAA512zAAAntplAAqmiAtumAAAAxpnAAoqzAjAAAA5Ah" +
              "qiAyAz4lAAAA2AAp5AAojnAAAAAoAAAvAAxApAAzAAAqAsAyAk" +
              "A2AwAAAsAA0thqxAArAAAlAvAuAtAlAyAAA5AAnA3AAiAAAxAA" +
              "AAA1mhAArtAAiAAAA0lsAwA5pmA4AAAAvAztqAA5kjAAAAyluA" +
              "2p0AAstqwAAAvyi1AAAA5oAxAvAxhy4mAnlrAAuksAiA5AA2AA" +
              "A3AuAAAAAoAAAplArvAAAAAAAirAAqA2AAAAm0AnupAwAvAAAA" +
              "oAwAAAizA1AxAAAmAA0vApsAAAmAA3AryAnAj5AphAsA4otA1A" +
              "AAAxswuAAkAAAAAlA1AAA3AAAAAhA5AxmlAA1kAsot3AjAAAAA" +
              "1A2A4ApAoAAy3AuAkAAiA5mAvA",
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
  savedGames[game.size][name] = game.save();
  localStorage.setItem(SAVED_GAMES_KEY, JSON.stringify(savedGames));
  localStorage.setItem(LATEST_SIZE_SAVED, game.size.toString());
}
