import { optionsState } from "../data/gameState";

import { Chord, Note, Range } from "tonal";
import { usePiano } from "./PianoProvider";

export default function ChromaFlower() {
  const size = 400;
  const pad = 80;

  const notes = optionsState.value.allNotes;
  const rootNote = optionsState.value.rootNote;
  const notesToPlay = Range.chromatic([rootNote + 3, rootNote + 4], { sharps: true }).slice(0, -1);

  const { activeNotes, pianoOnce, offset, changeOffset } = usePiano();
  const activeNoteNames = activeNotes.map((note) => Note.fromMidiSharps(note));

  const svgCenterX = size / 2;
  const svgCenterY = size / 2;

  const generateDAttribute = (size) => {
    const a = size / 26.67;
    const b = size / 33.33;
    const c = size / 40;
    const d = size / 11;
    const e = size / 2.8;
    const f = size / 6.67;
    const g = size / 8;
    const h = size / 4;

    return `M 0,0 a ${a},${a},0,0,0,${b},${-c} l ${d} ${-e} a ${f},${f},0,0,0,1,${-c} a ${g},${g},0,0,0,${-h},0 a ${f},${f},0,0,0,1,${c} l ${d},${e} a ${a},${a},0,0,0,${b},${c}z`;
  };

  function handlePetalClick(index) {
    const noteToPlay = notesToPlay[index];

    pianoOnce(noteToPlay, 1);
  }

  return (
    <div className="flex flex-col size-full">
      <svg
        viewBox={`${-pad} ${-pad} ${size + 2 * pad} ${size + 2 * pad}`}
        xmlns="http://www.w3.org/2000/svg"
        textAnchor="middle"
        dominantBaseline="middle"
      >
        <text x={size / 2} y={size / 2} style={{ fontSize: "1.2rem" }} fill="white">
          {Chord.detect(activeNoteNames)[0]}
        </text>
        <g transform={`translate(${svgCenterX}, ${svgCenterY}) `}>
          {Object.keys(notes).map((note, index) => {
            const isPlaying = activeNotes.find(
              (playingNote) => Note.pitchClass(Note.fromMidiSharps(playingNote)) === note
            );

            const octave = +Note.fromMidi(isPlaying).slice(-1);

            return (
              <g
                key={`chroma-petals-${note}`}
                onClick={() => handlePetalClick(index)}
                style={{
                  transition: "opacity 500ms ease-out",
                  cursor: "pointer",
                  opacity: isPlaying ? "1" : "0.35",
                }}
              >
                <g transform={` rotate(${index * 30}) translate(0, -${size / 8}) `}>
                  <path d={generateDAttribute(size)} fill={note.length > 1 ? "#222" : "#eee"} />
                </g>

                <g transform={`rotate(${index * 30}) translate(0, -${size / 2 + pad / 6}) `}>
                  <circle cx="0" cy="0" r={size / 10} fill={notes[note]} />
                  <text
                    x="0"
                    y="0"
                    fill="white"
                    fontFamily="monospace"
                    fontSize={size / 10}
                    fontWeight="bold"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    transform={`rotate(${index * -30})`}
                  >
                    {optionsState.value.notation === "chromatic"
                      ? index
                      : optionsState.value.notation === "do-re-mi"
                      ? optionsState.value.doremiArray[index]
                      : note}
                  </text>
                  {isPlaying && (
                    <text
                      x="0"
                      y="27"
                      fill="white"
                      fontFamily="monospace"
                      fontSize={size / 15}
                      fontWeight="bold"
                      textAnchor="middle"
                      dominantBaseline="middle"
                      transform={`rotate(${index * -30})`}
                    >
                      {octave}
                    </text>
                  )}
                  {isPlaying && <circle cx="0" cy={pad} r={size / 40} fill={notes[note]} />}
                </g>
              </g>
            );
          })}
        </g>
      </svg>
      <div className="flex justify-around items-center w-full mb-2">
        <button
          onClick={(event) => {
            event.stopPropagation();
            changeOffset(-1);
          }}
          className="z-50  p-1 bg-blue-600 text-white rounded-full hover:bg-blue-400"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 hover:scale-110"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 12H5" />
          </svg>
        </button>

        <p className="text-3xl text-white">Transpose Octave: {offset}</p>

        <button
          onClick={(event) => {
            event.stopPropagation();
            changeOffset(1);
          }}
          className="z-50  p-1 bg-blue-600 text-white rounded-full hover:bg-blue-400 "
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 hover:scale-110"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </div>
    </div>
  );
}
