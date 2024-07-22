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

effect(() => {
  const rootMidi = Note.midi(optionsState.value.rootNote + 4);

  const rootNote = Note.fromMidiSharps(rootMidi);
  const rootPitchClass = Note.pitchClass(rootNote);

  const abcChord = (noteArray) => {
    return noteArray.map((note) => AbcNotation.scientificToAbcNotation(note));
  };

  levels.value = [
    {
      title: "First Chord",
      noteLength: "1",
      taskAbc: `"C major chord"[${abcChord(chordBuilder("C4", "major")).join("")}]`,
      taskCheck: chordBuilder("C4", "major"),
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
        "Select the cards by clicking and either play or discard them by clicking the buttons on the right.",
        "Note Cards add notes or chords to your sheet music while each power card has a separate effect.",

        "Don't forget to asign a note to your note card however. You do this by playing any note when a note card is selected.",

        "Don't worry about the rest for now, just try it out an experiment!",
      ],
    },
    {
      title: "First Chord",
      noteLength: "1",
      taskAbc: `"A minor chord" [${abcChord(chordBuilder("A3", "minor")).join("")}]`,
      taskCheck: chordBuilder("A3", "minor"),
      dialog: [
        "This time we look at a different type of chord...",
        "A minor chord. It's not only a minor chord...",
        "It is 'A' minor chord.",
      ],
    },
  ];
}, [optionsState.value.rootNote]);
