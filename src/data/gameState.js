import { effect, signal } from "@preact/signals-react";
import { Range } from "tonal";
import randomId from "../utils/randomId";

//CONSTANTS
const mappedNotes = (startKey) => {
  const coloredNotesArray = Range.chromatic(["A3", "G#4"], { sharps: true, pitchClass: true }).map(
    (note, index) => {
      return {
        [note]: `hsl(${index * 30}, 80%, 50%)`,
      };
    }
  );

  const startIndex = coloredNotesArray.findIndex((item) => Object.keys(item)[0] === startKey);

  if (startIndex === -1) {
    console.error("Start key not found in the array.");
    return coloredNotesArray.reduce((acc, item) => ({ ...acc, ...item }), {});
  }

  if (startKey === "A") {
    return coloredNotesArray.reduce((acc, item) => ({ ...acc, ...item }), {});
  }

  const part1 = coloredNotesArray.slice(startIndex);
  const part2 = coloredNotesArray.slice(0, startIndex);

  const reorderedArray = part1.concat(part2);

  return reorderedArray.reduce((acc, item) => ({ ...acc, ...item }), {});
};

const cardNotes = Range.chromatic(["A3", "A5"], { sharps: true });


//DEFAULT STATES
const defaultGameState = {
  currentScene: "main-menu",
  currentLevel: 0,
  currentCutscene: 0,
};

const defaultOptionsState = {
  isActive: false,
  isMusicPlaying: false,
  volume: 100,
  mute: false,
  notation: "scientific",
  rootNote: "A",
  allNotes: mappedNotes("A"),
};

const defaultPlayerState = {
  deck: [],
  hand: [],
  handSize: 5,
  discard: [],
  energy: 3,
  maxEnergy: 3,
  totalEnergySpent: 0,
};

//INITIALIZE STATES
export const gameState = signal(defaultGameState);
export const playerState = signal(defaultPlayerState);
export const optionsState = signal(defaultOptionsState);

//EFFECTS
effect(() => {
  optionsState.value.allNotes = mappedNotes(optionsState.value.rootNote);
}, optionsState);
