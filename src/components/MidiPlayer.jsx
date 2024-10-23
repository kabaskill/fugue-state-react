import { useEffect, useCallback, useState } from "react";
import * as Tone from "tone";
import { usePiano } from "./PianoProvider.jsx";
import Button from "./Button.jsx";

const midiFiles = import.meta.glob("../data/midiData/*.json");

export default function MidiPlayer() {
  const { piano, addActiveNote, removeActiveNote, releaseAllNotes } =
    usePiano();
  const [isPlaying, setIsPlaying] = useState(false);
  const [midiData, setMidiData] = useState(null);
  const [selectedFile, setSelectedFile] = useState("Erlkönig");
  const [availableFiles, setAvailableFiles] = useState([]);

  useEffect(() => {
    const files = Object.keys(midiFiles).map((filePath) =>
      filePath.replace("../data/midiData/", "").replace(".json", ""),
    );
    setAvailableFiles(files);
  }, []);

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
    [piano, addActiveNote, removeActiveNote],
  );

  useEffect(() => {
    if (selectedFile) {
      const filePath = `../data/midiData/${selectedFile}.json`;
      if (midiFiles[filePath]) {
        midiFiles[filePath]().then((data) => {
          setMidiData(data.default);
        });
      }
    }
  }, [selectedFile]);

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
  }, [midiData, scheduleNote]);

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
    <div className="flex flex-col items-center justify-center gap-4">
      <p>Midi Player</p>
      <div className="flex gap-2">
        <Button onClick={handlePlay} disabled={isPlaying}>
          Play
        </Button>
        <Button onClick={handlePause} disabled={!isPlaying}>
          Pause
        </Button>
        <Button onClick={handleStop}>Stop</Button>
      </div>

      <label className="flex w-full justify-between">
        Select a midi file:
        <select
          value={selectedFile}
          onChange={(e) => setSelectedFile(e.target.value)}
        >
          {availableFiles.map((file) => (
            <option key={file} value={file}>
              {file}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}
