import randomId from "../utils/randomId";

const ChromaFlower = ({ size = 400, pad = 80 }) => {
  const notes = ["A", "A#", "B", "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#"];

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

  return (
    <div className={`bg-slate-700`}>
      <svg
        className="w-full min-w-full"
        viewBox={`${-pad} ${-pad} ${size + 2 * pad} ${size + 2 * pad}`}
        xmlns="http://www.w3.org/2000/svg"
        textAnchor="middle"
        dominantBaseline="middle"
      >
        <g transform={`translate(${svgCenterX}, ${svgCenterY}) `}>
          {notes.map((note, index) => {
            return (
              <g key={randomId("chroma-petals")}>
                <g transform={` rotate(${index * 30}) translate(0, -50) `}>
                  <path
                    d={generateDAttribute(size)}
                    fill={note.length > 1 ? "#222" : "#eee"}
                    opacity="0.9"
                    style={{ transition: "all 300ms ease-out", cursor: "pointer" }}
                    onClick={() => console.log(note)}
                  />
                </g>
                <g transform={`rotate(${index * 30}) translate(0, -212) `}>
                  <circle
                    cx="0"
                    cy="0"
                    r={size / 10}
                    fill={`hsl(${(index * 360) / 12}, 80%, 50%)`}
                  />
                  <text
                    x="0"
                    y="10"
                    fill="white"
                    fontFamily="monospace"
                    fontSize="36"
                    fontWeight="bold"
                    textAnchor="middle"
                    dominantBaseline="auto"
                    transform={`rotate(${index * -30})`}
                  >
                    {note}
                  </text>
                </g>
              </g>
            );
          })}
        </g>
      </svg>
    </div>
  );
};

export default ChromaFlower;
