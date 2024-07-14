import { useEffect, useRef } from "react";
import abcjs from "abcjs";
import { AbcNotation } from "tonal";
import { usePiano } from "./PianoProvider";

export default function SheetMusic({ id, title = "", notation, noteLength = "1", isTask = false }) {
  const { pianoOnce, releaseAllNotes } = usePiano();
  const abcString = `X:1\nT:${title}\nM:4/4\nL:${noteLength}\nK:C\n${notation}|]`;

  const timeoutsRef = useRef([]);

  function handlePlay(abcNotes) {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];

    releaseAllNotes();
    const chordsRemoved = abcNotes.replace(/(["'])(?:(?=(\\?))\2.)*?\1/g, "");
    const notes = [];
    for (let i = 0; i < chordsRemoved.length; i++) {
      const note = AbcNotation.abcToScientificNotation(chordsRemoved[i]);
      if (note.length > 0) {
        notes.push(note);
      } else {
        i++;
      }
    }
    console.log("🚀  notes:", notes);

    notes.forEach((note, index) => {
      const timeoutId = setTimeout(() => pianoOnce(note), index * 1500);
      timeoutsRef.current.push(timeoutId);
    });
  }

  useEffect(() => {
    abcjs.renderAbc(id, abcString, {
      selectionColor: "#db0e0e",
      responsive: "resize",
      minPadding: 30,
      add_classes: true,
      scale: 2,
    });
  }, [notation, id, abcString]);

  return (
    <>
      <div id={id}></div>
      {isTask && (
        <button onClick={() => handlePlay(notation)} className="w-1/6 absolute bottom-2 right-2">
          Play Notes
        </button>
      )}
    </>
  );
}
