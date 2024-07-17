import { AbcNotation, Chord, Note } from "tonal";
import { optionsState } from "./gameState";
import { effect, signal } from "@preact/signals-react";

export const levels = signal([]);

effect(() => {
  const rootMidi = Note.midi(optionsState.value.rootNote + 4);
  const rootNote = Note.fromMidi(rootMidi);
  const chordMajor = Chord.notes("M", rootNote);
  // const chordMinor = Chord.notes("m", rootNote);

  const rootPitchClass = Note.pitchClass(rootNote);

  const abcChord = (noteArray) => {
    const chord = noteArray.map((note) => AbcNotation.scientificToAbcNotation(note)).join("");
    return "[" + chord + "]";
  };

  levels.value = [
    {
      title: "First Chord",
      noteLength: "1",
      taskAbc: `"${rootPitchClass} major chord"${abcChord(chordMajor)}`,
      taskCheck: abcChord(chordMajor),
      dialog: [
        "This is Fugue Machine, one of my inventions...",
        "The display is divided to three sections: Chroma Flower, Sheet music and Card Container ...",
        "On the left side, is the Chroma Flower, it will highlight the notes you are playing...",
        "On the right side, is your goal and your empty sheet music...",
        "Your task is to use your cards, which are located on bottom to imitate the sheet music on the goal...",
        "You can change your Root note and preferred notation on the left side or in the Options menu...",
        "Click on the cards to highlight them and either play or discard them to your liking...",
        "You can drag the cards to sort them...",
        "Don't worry about the rest for now, just try it out an experiment!",
      ],
    },
    {
      title: "Learning the Intervals",
      noteLength: "1",
      taskAbcString: '"unison"[AA]"2nd"[AB]"3rd"[Ac]"4th"[Ad]"5th"[Ae]"6th"[Af]"7th"[Ag]',
      taskCheckString: "ABcdefg",
      dialog: [
        "Let's look at something more complex...",
        "... Intervals!",
        "If 2 notes play at the same time, that is called an interval...",
        "I put some intervals for you to practice...",
        "Just like last time, play your cards and try to imitate the task. The note A is repeating so don't worry about it. Only play it first time. Then, only the other note.",
      ],
    },
  ];
}, [optionsState.value.rootNote]);
