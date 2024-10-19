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
    <section className="flex size-full items-center justify-around">
      

      {/* <img
        src={`${import.meta.env.BASE_URL}/images/Keyboard.png`}
        alt="keyboard"
      /> */}
      <div className="flex h-full w-1/2 flex-col justify-around border-2 border-red-100">
        <h1>Fugue State</h1>

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

      <ChromaFlower />
    </section>
  );
}
