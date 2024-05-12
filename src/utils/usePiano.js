import { useEffect, useState } from "react";
import { Sampler, start, now } from "tone";

export function usePiano() {
  const [piano, setPiano] = useState(null);

  useEffect(() => {
    start();
    if (piano) return;

    const newPiano = new Sampler({
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
      volume: -10,
      baseUrl: "/audio/piano/",
    });
    setPiano(newPiano);
  }, []);

  const pianoOnce = (note = "A4", duration = "8n", time) => {
    if (!piano) return;
    piano.triggerAttackRelease(note, duration, time);
  };

  const pianoAttack = (note = "A4", velocity) => {
    if (!piano) return;
    piano.triggerAttack(note, now(), velocity);
  };

  const pianoRelease = (note = "A4") => {
    if (!piano) return;
    piano.triggerRelease(note);
  };

  const pianoReleaseAll = () => {
    if (!piano) return;
    piano.releaseAll();
  };

  return { piano, pianoOnce, pianoAttack, pianoRelease, pianoReleaseAll };
}
