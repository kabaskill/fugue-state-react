import { useState } from "react";
import { optionsState } from "../data/gameState";
import randomId from "../utils/randomId";

import { Chord, Note } from "tonal";

import { usePiano } from "./PianoProvider";

export default function ChromaFlower() {
  const size = 400;
  const pad = 80;

  const notes = optionsState.value.allNotes;

  const { activeNotes, playKey } = usePiano();
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

  const [linePoints, setLinePoints] = useState([]);
  const [lineColor, setLineColor] = useState("#000");

  function handlePetalClick(index) {
    const angle = (index * 2 * Math.PI) / 12 - Math.PI / 2;
    const point = {
      x: (size / 2 + pad / 6 - pad) * Math.cos(angle),
      y: (size / 2 + pad / 6 - pad) * Math.sin(angle),
    };

    setLineColor("#555");

    setLinePoints((prevPoints) => {
      const existingPoint = prevPoints.find((p) => p.x === point.x && p.y === point.y);
      if (existingPoint) {
        return prevPoints.filter((p) => p !== existingPoint);
      } else {
        return [...prevPoints, point];
      }
    });
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
            const isPlaying = activeNotes.some(
              (playingNote) => Note.pitchClass(Note.fromMidiSharps(playingNote)) === note
            );

            return (
              <g
                key={randomId("chroma-petals")}
                onClick={() => handlePetalClick(index)}
                onPointerDown={() => playKey(Object.keys(notes)[index], index < 3 ? 3 : 4)}
                onPointerUp={() => playKey(Object.keys(notes)[index], index < 3 ? 3 : 4, true)}
                onPointerLeave={() => playKey(Object.keys(notes)[index], index < 3 ? 3 : 4, true)}
                style={{ transition: "all 300ms ease-out", cursor: "pointer" }}
                opacity={isPlaying ? "1" : "0.25"}
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
                    {optionsState.value.notation === "chromatic" ? index : note}
                  </text>
                  {isPlaying && <circle cx="0" cy={pad} r={size / 40} fill={notes[note]} />}
                </g>
              </g>
            );
          })}
          {linePoints.length > 1 && (
            <polygon
              points={linePoints.map((p) => `${p.x},${p.y}`).join(" ")}
              fill={lineColor}
              stroke={lineColor}
              strokeWidth="4"
              opacity="0.75"
            />
          )}
        </g>
      </svg>
      {/* {activeNoteNames &&
        Chord.detect(activeNoteNames).map((chord) => {
          return <div key={randomId("detect-chord")}>{chord}</div>;
        })} */}
    </div>
  );
}
