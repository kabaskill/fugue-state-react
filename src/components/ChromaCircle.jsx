import { optionsState } from "../data/gameState";
import { usePiano } from "./PianoProvider";
import { Note } from "tonal";

export default function ChromaCircle({ notesArray }) {
  const size = 100;

  const radius = size / 2;
  const centerX = size / 2;
  const centerY = size / 2;

  const notes = optionsState.value.allNotes;

  const notesArrayFiltered = notesArray && notesArray.map((note) => Note.pitchClass(note));

  const { activeNotes } = usePiano();
  const activeNoteNames = activeNotes.map((note) => Note.pitchClass(Note.fromMidiSharps(note)));

  const noteArray = notesArray ? notesArrayFiltered : activeNoteNames;
  const sliceAngle = (2 * Math.PI) / noteArray.length;

  return (
    <svg
      viewBox={`0 0 ${size} ${size}`}
      xmlns="http://www.w3.org/2000/svg"
      textAnchor="middle"
      dominantBaseline="middle"
      className="size-full"
    >
      <g
        style={{
          transition: "opacity 1000ms ease-out",
          cursor: "pointer",
          opacity: noteArray.length > 0 ? "1" : "0",
        }}
      >
        {noteArray.map((note, i) => {
          const startAngle = i * sliceAngle - Math.PI / 2 - sliceAngle / 2;
          const endAngle = (i + 1) * sliceAngle - Math.PI / 2 - sliceAngle / 2;

          const startX = centerX + radius * Math.cos(startAngle);
          const startY = centerY + radius * Math.sin(startAngle);
          const endX = centerX + radius * Math.cos(endAngle);
          const endY = centerY + radius * Math.sin(endAngle);

          const pathData = `M${centerX},${centerY} L${startX},${startY} A${radius},${radius} 0 0,1 ${endX},${endY} Z`;

          return noteArray.length === 1 ? (
            <circle key={i} cx={centerX} cy={centerY} r={radius} fill={notes[note]} />
          ) : (
            <path key={i} d={pathData} fill={notes[note]} />
          );
        })}
      </g>
    </svg>
  );
}
