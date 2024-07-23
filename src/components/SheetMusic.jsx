import { useEffect, useRef } from "react";
import abcjs from "abcjs";
import { usePiano } from "./PianoProvider";
import { gameState } from "../data/gameState";
import { levels } from "../data/levels";

export default function SheetMusic({ id, title = "", notation, noteLength = "1", isTask = false }) {
  const { pianoOnce, releaseAllNotes } = usePiano();
  const abcString = `X:1\nT:${title}\nM:4/4\nL:${noteLength}\nK:C\n${notation}|]`;

  const timeoutsRef = useRef([]);

  const levelInfo = levels.value[gameState.value.currentLevel];

  function handlePlay(task) {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];

    releaseAllNotes();

    task.forEach((noteArr, index) => {
      const timeoutId = setTimeout(
        () => noteArr.forEach((note) => pianoOnce(note, 1.9)),
        index * 2000
      );
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
        <button
          onClick={() => handlePlay(levelInfo.taskChords)}
          className="w-1/6 absolute bottom-2 right-2"
        >
          Play Notes
        </button>
      )}
    </>
  );
}
