import { useEffect, useCallback, useState } from "react";
import * as Tone from "tone";
import midiData from "../data/midiDataErl.json";
import { usePiano } from "./PianoProvider.jsx";

export default function MidiPlayer() {
  const { piano, addActiveNote, removeActiveNote, releaseAllNotes } = usePiano();
  const [isPlaying, setIsPlaying] = useState(false);

  const scheduleNote = useCallback(
    (note) => {
      const startTime = note.time;
      const endTime = startTime + note.duration;

      Tone.getTransport().schedule((time) => {
        piano.triggerAttack(note.name, time, note.velocity);
        addActiveNote(note.name);
      }, startTime);

      Tone.getTransport().schedule((time) => {
        piano.triggerRelease(note.name, time);
        removeActiveNote(note.name);
      }, endTime);
    },
    [piano, addActiveNote, removeActiveNote]
  );

  useEffect(() => {
    if (midiData && midiData.tracks) {
      Tone.getTransport().cancel();
      Tone.getTransport().stop();

      midiData.tracks.forEach((track) => {
        track.notes.forEach(scheduleNote);
      });

      return () => {
        Tone.getTransport().cancel();
        Tone.getTransport().stop();
      };
    }
  }, [scheduleNote]);

  const handlePlay = () => {
    Tone.getTransport().start();
    setIsPlaying(true);
  };

  const handlePause = () => {
    Tone.getTransport().pause();
    setIsPlaying(false);
  };

  const handleStop = () => {
    Tone.getTransport().stop();
    setIsPlaying(false);
    releaseAllNotes();
  };

  return (
    <div className="flex flex-col justify-center items-center">
      <p>Midi Player</p>
      <div className="flex">
        <button onClick={handlePlay} disabled={isPlaying}>
          Play
        </button>
        <button onClick={handlePause} disabled={!isPlaying}>
          Pause
        </button>
        <button onClick={handleStop}>Stop</button>
      </div>
    </div>
  );
}
