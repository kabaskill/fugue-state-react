import { effect, signal } from "@preact/signals-react";
import { Range } from "tonal";
import randomId from "../utils/randomId";
import shuffleArray from "../utils/shuffleArray";

const mappedNotes = (startKey) => {
  const coloredNotesArray = Range.chromatic(["A3", "G#4"], {
    sharps: true,
    pitchClass: true,
  }).map((note, index) => ({
    [note]: `hsl(${index * 30}, 80%, 50%)`,
  }));

  const startIndex = coloredNotesArray.findIndex(
    (item) => Object.keys(item)[0] === startKey,
  );

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

//CARD and DECK DATA
const card = (note = "", octave = "", cost = 1, unlocked = true) => ({
  id: randomId("note-card"),
  type: "note",
  unlocked: unlocked,
  note: note,
  octave: octave,
  color: coloredNotes[note],
  cost,
});

const noteDeck = () => {
  const noteDeck = [];
  for (let i = 0; i < 12; i++) {
    noteDeck.push(card());
  }
  return noteDeck;
};

const powerCard = (powerName, powerObject, unlocked = true) => ({
  id: randomId("power"),
  type: "power",
  unlocked: unlocked,
  power: {
    name: powerName,
    effect: powerObject.effect,
    desc: powerObject.desc,
    oneTime: powerObject.oneTime,
    cost: powerObject.cost,
  },
});

const powers = {
  Energy: (value = 1) => ({
    effect: (state) => {
      const newState = { ...state, energy: state.energy + value };
      return newState;
    },
    desc: `Increase Energy by ${value}`,
    oneTime: false,
    cost: 0,
  }),

  "Max Energy": (value = 3) => ({
    effect: (state) => {
      const newState = { ...state, maxEnergy: state.maxEnergy + value };
      return newState;
    },
    desc: `Increase Max Energy by ${value}`,
    oneTime: true,
    cost: 1,
  }),

  "Create Note": () => ({
    effect: (hand) => {
      const newCard = card();
      hand.push(newCard);
    },
    desc: `Create a Note Card in Hand`,
    oneTime: true,
    cost: 1,
  }),

  "Undo Chord": (value = 1) => ({
    effect: () => {
      console.log("This card operates on local state");
    },
    desc: `Undo ${value} chord and return its energy`,
    oneTime: false,
    cost: 2,
  }),
};

const powerDeck = () => {
  const powersDeck = [];

  for (const [key, powerFunction] of Object.entries(powers)) {
    powersDeck.push(powerCard(key, powerFunction()));
  }

  powersDeck.push(powerCard("Undo Chord", powers["Undo Chord"]()));
  powersDeck.push(powerCard("Energy", powers["Energy"]()));

  return shuffleArray(powersDeck);
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
  doremiObject: {
    A: "la",
    "A#": "la#",
    B: "si",
    C: "do",
    "C#": "do#",
    D: "re",
    "D#": "re#",
    E: "mi",
    F: "fa",
    "F#": "fa#",
    G: "sol",
    "G#": "sol#",
  },
};

const initialDeck = noteDeck();
const initialPowerDeck = powerDeck();

const drawInitialHand = (deck, powerDeck, handNotes, handPowers) => {
  const newDeck = [...deck];
  const newPowerDeck = [...powerDeck];
  const hand = [];

  for (let i = 0; i < handNotes; i++) {
    hand.push(newDeck.pop());
  }

  for (let i = 0; i < handPowers; i++) {
    hand.push(newPowerDeck.pop());
  }

  return {
    hand,
    deck: [...newDeck, ...newPowerDeck],
  };
};

const { hand: initialHand, deck: remainingDeck } = drawInitialHand(
  initialDeck,
  initialPowerDeck,
  3,
  2,
);

const defaultPlayerState = {
  deck: remainingDeck,
  hand: initialHand,
  powers: initialPowerDeck,
  discardPile: [],
  burnedCards: [],
  handSize: 5,
  handNotes: 3,
  handPowers: 2,
  energy: 5,
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
    const allNotes = mappedNotes(newRootNote);
    optionsState.value.allNotes = allNotes;

    rootNoteCache = newRootNote;
  }
}, [optionsState.value.rootNote]);
