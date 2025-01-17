import {
  createContext,
  useContext,
  useEffect,
  useCallback,
  useState,
} from "react";
import * as Tone from "tone";
import { Note } from "tonal";
import { setupKeyboard } from "../utils/keyboard";
import { pianoProviderLoaded } from "../data/gameState";

const PianoContext = createContext();

export function PianoProvider({ children }) {
  const [piano, setPiano] = useState(null);
  const [offset, setOffset] = useState(0);

  const [activeNotes, setActiveNotes] = useState([]);
  const [activeParts, setActiveParts] = useState([]);

  useEffect(() => {
    const sampler = new Tone.Sampler({
      urls: {
        A0: "A0.mp3",
        C1: "C1.mp3",
        "D#1": "Ds1.mp3",
        "F#1": "Fs1.mp3",
        A1: "A1.mp3",
        C2: "C2.mp3",
        "D#2": "Ds2.mp3",
        "F#2": "Fs2.mp3",
        A2: "A2.mp3",
        C3: "C3.mp3",
        "D#3": "Ds3.mp3",
        "F#3": "Fs3.mp3",
        A3: "A3.mp3",
        C4: "C4.mp3",
        "D#4": "Ds4.mp3",
        "F#4": "Fs4.mp3",
        A4: "A4.mp3",
        C5: "C5.mp3",
        "D#5": "Ds5.mp3",
        "F#5": "Fs5.mp3",
        A5: "A5.mp3",
        C6: "C6.mp3",
        "D#6": "Ds6.mp3",
        "F#6": "Fs6.mp3",
        A6: "A6.mp3",
        C7: "C7.mp3",
        "D#7": "Ds7.mp3",
        "F#7": "Fs7.mp3",
        A7: "A7.mp3",
        C8: "C8.mp3",
      },
      release: 1,
      volume: 0,
      baseUrl: `${import.meta.env.BASE_URL}audio/piano/`,
      onload: () => {
        pianoProviderLoaded.value = true;
        console.log("Sampler loaded!");
      },
    }).toDestination();

    const reverb = new Tone.Reverb(5).toDestination();
    sampler.connect(reverb);

    setPiano(sampler);

    return () => {
      sampler.dispose();
    };
  }, []);

  const playNote = useCallback((note) => {
    setActiveNotes((prev) => [...prev, Note.midi(note)].sort((a, b) => a - b));
  }, []);

  const releaseNote = useCallback((note) => {
    setActiveNotes((prev) =>
      prev.filter((n) => n !== Note.midi(note)).sort((a, b) => a - b),
    );
  }, []);

  const addActiveNote = useCallback((note) => {
    setActiveNotes((prev) => [...prev, Note.midi(note)]);
  }, []);

  const removeActiveNote = useCallback((note) => {
    setActiveNotes((prev) => prev.filter((n) => n !== Note.midi(note)));
  }, []);

  const pianoOnce = (note, duration = 3) => {
    if (!piano) return;

    const noteOctave = +note.slice(-1) + +offset;
    const noteToPlay = note.slice(0, -1) + noteOctave;

    piano.triggerAttackRelease(noteToPlay, duration);
    playNote(noteToPlay);
    setTimeout(() => releaseNote(noteToPlay), duration * 1000);
  };

  const releaseAllNotes = () => {
    if (!piano) return;
    setActiveNotes([]);
    piano.releaseAll();
  };

  const playKey = useCallback(
    (note, noteOffset, isKeyUp = false) => {
      if (!piano) return;

      const fullNote = `${note}${noteOffset + offset}`;

      if (isKeyUp) {
        piano.triggerRelease(fullNote);
        releaseNote(fullNote);
      } else {
        piano.triggerAttack(fullNote);
        playNote(fullNote);
      }
    },
    [piano, offset],
  );

  const changeOffset = useCallback((delta) => {
    setOffset((prev) => prev + delta);
  }, []);

  useEffect(() => {
    if (!piano) return;

    const cleanup = setupKeyboard(playKey, changeOffset);

    return cleanup;
  }, [piano, playKey, changeOffset]);

  // Function to play a sequence of notes
  const playSequence = useCallback(
    (sequence) => {
      if (!piano) return;

      const part = new Tone.Part((time, note) => {
        piano.triggerAttackRelease(note.note, note.duration, time);
      }, sequence).start();

      setActiveParts((prevParts) => [...prevParts, part]);
      return part;
    },
    [piano],
  );

  const startAllSequences = () => {
    Tone.getTransport().start();
  };

  const stopAllSequences = () => {
    activeParts.forEach((part) => part.stop());
    setActiveParts([]);
  };

  return (
    <PianoContext.Provider
      value={{
        piano,
        pianoOnce,
        releaseAllNotes,
        addActiveNote,
        removeActiveNote,
        offset,
        changeOffset,
        activeNotes,
        playSequence,
        startAllSequences,
        stopAllSequences,
      }}
    >
      {children}
    </PianoContext.Provider>
  );
}

export const usePiano = () => useContext(PianoContext);
