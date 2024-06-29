import * as Tone from "tone";
import midiData from "../data/midiData.json";
import { usePiano } from "./PianoProvider.jsx";

export default function MidiPlayer() {
  const { piano } = usePiano();

  console.log(midiData);

  if (midiData && midiData.tracks) {
    const now = Tone.now();
    midiData.tracks.forEach((track) => {
      //schedule all of the events
      track.notes.forEach((note) => {
        piano.triggerAttackRelease(note.name, note.duration, note.time + now, note.velocity);
      });
    });
  }
  return <div >Playing MIDI</div>;
}
