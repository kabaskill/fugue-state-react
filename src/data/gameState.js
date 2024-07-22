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

//CARD and DECK DATA

const card = (note = "", octave = "", cost = 1, unlocked = true) => ({
  id: randomId("note-card"),
  type: "note",
  unlocked,
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
  unlocked,
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
    cost: 1,
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

  "Create Note": (note = "A", octave = 4) => ({
    effect: (state) => {
      const newCard = card(note, octave);
      const newState = { ...state, hand: [...state.hand, newCard] };
      return newState;
    },
    desc: `Create a Note Card in Hand`,
    oneTime: true,
    cost: 1,
  }),

  "Undo Chord": (value = 1) => ({
    effect: () => {
      console.log("This card operates on local state");
    },
    desc: `Undo ${value} chord`,
    oneTime: false,
    cost: 1,
  }),
};

const powerDeck = () => {
  const powersDeck = [];

  for (let i = 0; i < 2; i++) {
    for (const [key, powerFunction] of Object.entries(powers)) {
      powersDeck.push(powerCard(key, powerFunction()));
    }
  }

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
  doremiArray: ["la", "la#", "si", "do", "do#", "re", "re#", "mi", "fa", "fa#", "sol", "sol#"],
};

const initialDeck = noteDeck(defaultOptionsState.allNotes);
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
  2
);

const defaultPlayerState = {
  deck: remainingDeck,
  hand: initialHand,
  powers: initialPowerDeck,
  discardPile: [],
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

// Utility Functions for Game Actions
// const drawHand = (deck, handSize) => {
//   const newHand = [];
//   for (let i = 0; i < handSize; i++) {
//     if (deck.length === 0) break;
//     newHand.push(deck.pop());
//   }
//   return newHand;
// };

// const playCard = (card) => {
//   const { hand, deck, noteDiscardPile, powerDiscardPile } = playerState.value;
//   playerState.value.hand = hand.filter(c => c.id !== card.id);

//   if (card.type === 'note') {
//     playerState.value.noteDiscardPile.push(card);
//   } else if (card.type === 'power') {
//     playerState.value.powerDiscardPile.push(card);
//   }

//   drawNewCards();
// };

// const drawNewCards = () => {
//   const { deck, powerDeck, hand, handNotes, handPowers } = playerState.value;
//   let newHand = [...hand];

//   const drawNoteCards = handNotes - newHand.filter(c => c.type === 'note').length;
//   for (let i = 0; i < drawNoteCards; i++) {
//     if (deck.length === 0) break;
//     newHand.push(deck.pop());
//   }

//   const drawPowerCards = handPowers - newHand.filter(c => c.type === 'power').length;
//   for (let i = 0; i < drawPowerCards; i++) {
//     if (powerDeck.length === 0) break;
//     newHand.push(powerDeck.pop());
//   }

//   playerState.value.hand = newHand;
// };
