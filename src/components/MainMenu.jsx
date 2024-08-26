import { gameState, optionsState } from "../data/gameState";
import ChromaFlower from "./ChromaFlower";
import MidiPlayer from "./MidiPlayer";
// import { usePiano } from "./PianoProvider";

export default function MainMenu() {
  // const melodySequence = [
  //   { time: "0:0:0", note: "C4", duration: "4n" },
  //   { time: "0:1:0", note: "D4", duration: "4n" },
  //   { time: "0:2:0", note: "E4", duration: "4n" },
  //   { time: "0:3:0", note: "F4", duration: "4n" },
  // ];
  
  // const chordSequence = [
  //   { time: "0:0", note: "C3", duration: "2n" },
  //   { time: "0:2", note: "C3", duration: "2n" },
  // ];

  // const { playSequence, startAllSequences } = usePiano();

  // const handleTestClick =  () => {

  //   playSequence(melodySequence); // Schedule the melody
  //   playSequence(chordSequence); // Schedule the chords
  
  //   // Start all sequences in sync
  //   startAllSequences();
  
  //   console.log("Sequences should be playing...");
  // };
  

  return (
    <section className="m-auto flex h-2/3 w-4/5 items-center justify-around gap-16">
      <div className="aspect-square w-1/2">
        <ChromaFlower />
      </div>

      <div className="flex h-4/5 flex-col justify-between">
        <h1 className="text-6xl">Fugue State</h1>

        <div className="flex flex-col gap-4">
          {/* <button onClick={handleTestClick}>TEST</button> */}

          <button
            onClick={() => {
              gameState.value = {
                ...gameState.value,
                currentScene: "cutscene",
              };
            }}
          >
            Play
          </button>
          <button
            onClick={() =>
              (optionsState.value = { ...optionsState.value, isActive: true })
            }
          >
            Options
          </button>

          <MidiPlayer />
        </div>
      </div>
    </section>
  );
}
