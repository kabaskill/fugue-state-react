const noteKeys = {
  KeyQ: { note: "F", octave: 4 },
  Digit2: { note: "F#", octave: 4 },
  KeyW: { note: "G", octave: 4 },
  Digit3: { note: "G#", octave: 4 },
  KeyE: { note: "A", octave: 4 },
  Digit4: { note: "A#", octave: 4 },
  KeyR: { note: "B", octave: 4 },
  KeyT: { note: "C", octave: 5 },
  Digit6: { note: "C#", octave: 5 },
  KeyY: { note: "D", octave: 5 },
  Digit7: { note: "D#", octave: 5 },
  KeyU: { note: "E", octave: 5 },
  KeyI: { note: "F", octave: 5 },
  Digit9: { note: "F#", octave: 5 },
  KeyO: { note: "G", octave: 5 },
  Digit0: { note: "G#", octave: 5 },
  KeyP: { note: "A", octave: 5 },
  Minus: { note: "A#", octave: 5 },
  BracketLeft: { note: "B", octave: 5 },
  BracketRIght: { note: "C", octave: 3 },

  KeyZ: { note: "C", octave: 3 },
  KeyS: { note: "C#", octave: 3 },
  KeyX: { note: "D", octave: 3 },
  KeyD: { note: "D#", octave: 3 },
  KeyC: { note: "E", octave: 3 },
  KeyV: { note: "F", octave: 3 },
  KeyG: { note: "F#", octave: 3 },
  KeyB: { note: "G", octave: 3 },
  KeyH: { note: "G#", octave: 3 },
  KeyN: { note: "A", octave: 3 },
  KeyJ: { note: "A#", octave: 3 },
  KeyM: { note: "B", octave: 3 },
  Comma: { note: "C", octave: 4 },
  KeyL: { note: "C#", octave: 4 },
  Period: { note: "D", octave: 4 },
  Semicolon: { note: "D#", octave: 4 },
  Slash: { note: "E", octave: 4 },
};

export function setupKeyboard(playKeyCallback, octaveCallback) {
  const handleKeyDown = (e) => {
    if (e.code === "Digit1") octaveCallback(-1);
    if (e.code === "Equal") octaveCallback(1);
    if (e.repeat || !noteKeys[e.code]) return;
    if (e.ctrlKey || e.altKey || e.metaKey) return;
    if (e.code === "Slash") e.preventDefault();
    playKeyCallback(noteKeys[e.code].note, noteKeys[e.code].octave);
  };

  const handleKeyUp = (e) => {
    if (!noteKeys[e.code]) return;
    playKeyCallback(noteKeys[e.code].note, noteKeys[e.code].octave, true);
  };

  document.addEventListener("keydown", handleKeyDown);
  document.addEventListener("keyup", handleKeyUp);

  return () => {
    document.removeEventListener("keydown", handleKeyDown);
    document.removeEventListener("keyup", handleKeyUp);
  };
}
