import { effect, signal } from "@preact/signals-react";
import { Range } from "tonal";
import randomId from "../utils/randomId";

// Utility Functions
const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

const mappedNotes = (startKey) => {
  const coloredNotesArray = Range.chromatic(["A3", "G#4"], { sharps: true, pitchClass: true }).map(
    (note, index) => ({
      [note]: `hsl(${index * 30}, 80%, 50%)`,
    })
  );

  const startIndex = coloredNotesArray.findIndex((item) => Object.keys(item)[0] === startKey);

  if (startIndex === -1) {
    console.error("Start key not found in the array.");
    return coloredNotesArray.reduce((acc, item) => ({ ...acc, ...item }), {});
  }

  const reorderedArray = [
    ...coloredNotesArray.slice(startIndex),
    ...coloredNotesArray.slice(0, startIndex),
  ];

  return reorderedArray.reduce((acc, item) => ({ ...acc, ...item }), {});
};

const card = (note, octave, cost = 1, unlocked = true) => ({
  id: randomId("card-" + note + octave),
  unlocked,
  note,
  octave,
  color: mappedNotes("A")[note],
  description: `Plays the note ${note} on the piano.`,
  cost,
  click: () => {
    console.log(`Card Played (${note}, ${octave})`);
  },
});

const noteDeck = (allNotes) => Object.keys(allNotes).map((note) => card(note, 4));

const drawHand = (deck, handSize) => {
  return deck.splice(0, handSize);
};

// Default States
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

const initialDeck = shuffleArray(noteDeck(defaultOptionsState.allNotes));
const initialHand = drawHand(initialDeck, 5);

const defaultPlayerState = {
  deck: initialDeck,
  hand: initialHand,
  handSize: 5,
  energy: 0,
  totalEnergySpent: 0,
};

// Initialize States
export const gameState = signal(defaultGameState);
export const playerState = signal(defaultPlayerState);
export const optionsState = signal(defaultOptionsState);

// Effects
effect(() => {
  const allNotes = mappedNotes(optionsState.value.rootNote);

  optionsState.value.allNotes = allNotes;
}, optionsState.value.rootNote);
