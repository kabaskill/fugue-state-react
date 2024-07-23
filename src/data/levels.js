import { AbcNotation, Chord, Note } from "tonal";
import { optionsState } from "./gameState";
import { effect, signal } from "@preact/signals-react";

export const levels = signal([]);

const chordBuilder = (note, str) => {
  switch (str) {
    case "major":
      return Chord.notes("M", note);
    case "minor":
      return Chord.notes("m", note);
    default:
      return Chord.notes("M", note);
  }
};

const abcChord = (noteArray) => {
  return noteArray.map((note) => AbcNotation.scientificToAbcNotation(note));
};

effect(() => {
  const rootMidi = Note.midi(optionsState.value.rootNote + 4);
  const rootNote = Note.fromMidiSharps(rootMidi);
  const rootPitchClass = Note.pitchClass(rootNote);
  console.log("🚀  rootPitchClass:", rootPitchClass);

  levels.value = [
    {
      title: "First Chord",
      noteLength: "1",
      taskAbc: `"C major"[${abcChord(chordBuilder("C4", "major")).join("")}]`,
      taskCheck: chordBuilder("C4", "major"),
      taskChords: [chordBuilder("C4", "major")],
      dialog: [
        "This is Fugue Machine, one of my inventions...",
        "It is a machine that helps you practice music. The display is divided to three sections...",
        "On the left, is the Chroma Flower. It is just like a piano but on a circle and with colors. It will highlight any note that is playing.",
        "Just try it! You can interact with it with your keyboard or mouse...",
        "On the right, is your Sheet Music...",
        "The top one is your task sheet and the bottom one is your empty sheet.",
        "Like Chroma Flower your Sheet Music will react to what notes are playing.",
        "You use your cards located on the bottom to interact with the Sheet Music ...",
        "There are 2 types of Cards. Notes and Powers...",
        "Select the cards by clicking and either play or discard them by clicking the buttons on the right. The order of selection matters...",
        "Note Cards add notes to your sheet music while each power card has a separate effect.",
        "Don't forget to asign a note to your note card however. You do this by playing any note when a note card is selected. If you make a mistake you can re-assign a note to the card.",
        "Don't worry about the rest for now, just try it out an experiment!",
      ],
    },
    {
      title: "'A' minor Chord",
      noteLength: "1",
      taskAbc: `"A minor" [${abcChord(chordBuilder("A3", "minor")).join("")}]`,
      taskCheck: chordBuilder("A3", "minor"),
      taskChords: [chordBuilder("A3", "minor")],
      dialog: [
        "This time we look at a different type of chord...",
        "A minor chord. It's not only a minor chord...",
        "It is 'A' minor chord!",
        "You probably noticed the energy levels change when you play a card...",
        "Every card has an energy cost which sits on top left corner of the card...",
        "Some cards also return energy, like Undo Chord and Energy...",
        "You also gain 1 energy everytime you match a chord from the task...",
        "Let's try it out!",
      ],
    },
    {
      title: "Hede",
      noteLength: "1",
      taskAbc: `"C major" [${abcChord(chordBuilder("C4", "major")).join("")}] "G major" [${abcChord(
        chordBuilder("G4", "major")
      ).join("")}] "C major" [${abcChord(chordBuilder("C4", "major")).join("")}]`,
      taskCheck: [
        ...chordBuilder("C4", "major"),
        ...chordBuilder("G4", "major"),
        ...chordBuilder("C4", "major"),
      ],
      taskChords: [
        chordBuilder("C4", "major"),
        chordBuilder("G4", "major"),
        chordBuilder("C4", "major"),
      ],
      dialog: ["Let's chain different chords togeher this time..."],
    },
  ];
}, [optionsState.value.rootNote]);
