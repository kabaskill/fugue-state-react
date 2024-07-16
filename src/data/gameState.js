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

const coloredNotes = mappedNotes("A");

const card = (note, octave, cost = 1, unlocked = true) => ({
  id: randomId("note-card"),
  unlocked,
  note,
  octave,
  color: coloredNotes[note],
  cost,
});

const powerCard = (power, cost = 1, unlocked = true) => ({
  id: randomId("power-card"),
  unlocked,
  color: "red",
  cost,
  power,
});

const powers = [
  { addEnergy: (value, energy) => energy + value, desc: "Increase Energy by 1" },
  { addMaxEnergy: (value, maxEnergy) => maxEnergy + value, desc: "Increase Max Energy by 1" },
  { createNoteInHand: (note, octave) => card(note, octave), desc: "Create Note Card in Hand" },
  {
    undoChord: (chordString) => chordString.splice(0, chordString.length - 1),
    desc: "Undo last played chord",
  },
];

const powerDeck = () => {
  const powersDeck = [];
  for (let i = 0; i < 2; i++) {
    for (let j = 0; j < powers.length; j++) {
      powersDeck.push(powerCard(powers[j]));
    }
  }
  return powersDeck;
};

console.log("🚀  powerDeck:", powerDeck());

const noteDeck = () => {
  const noteDeck = [];
  for (let i = 0; i < 12; i++) {
    noteDeck.push(card("A", 4));
  }
  return noteDeck;
};

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
  allNotes: coloredNotes,
  doremiArray: ["la", "la#", "si", "do", "do#", "re", "re#", "mi", "fa", "fa#", "sol", "sol#"],
};

const initialDeck = shuffleArray(noteDeck(defaultOptionsState.allNotes));
const initialHand = drawHand(initialDeck, 3);

const defaultPlayerState = {
  deck: initialDeck,
  hand: initialHand,
  handSize: 3,
  energy: 0,
  maxEnergy: 5,
  totalEnergySpent: 0,
};

// Initialize States
export const gameState = signal(defaultGameState);
export const playerState = signal(defaultPlayerState);
export const optionsState = signal(defaultOptionsState);
export const pianoProviderLoaded = signal(false);

// Effects
let rootNoteCache = optionsState.peek().rootNote;

effect(() => {
  const newRootNote = optionsState.value.rootNote;
  if (rootNoteCache !== newRootNote) {
    const oldRootNote = rootNoteCache;

    const allNotes = mappedNotes(newRootNote);
    optionsState.value.allNotes = allNotes;

    const oldNotes = mappedNotes(oldRootNote);

    const remapNote = (oldNote) => {
      const oldIndex = Object.keys(oldNotes).findIndex((item) => item === oldNote);
      return Object.keys(allNotes)[oldIndex];
    };

    playerState.value.hand = playerState.value.hand.map((card) => {
      const newNote = remapNote(card.note);
      return {
        ...card,
        note: newNote,
        color: coloredNotes[newNote],
      };
    });

    playerState.value.deck = playerState.value.deck.map((card) => {
      const newNote = remapNote(card.note);
      return {
        ...card,
        note: newNote,
        color: coloredNotes[newNote],
      };
    });

    rootNoteCache = newRootNote;
  }
}, [optionsState.value.rootNote]);
