
import { gameState, optionsState } from "../data/gameState";
import ChromaFlower from "./ChromaFlower";
import MidiPlayer from "./MidiPlayer";

export default function MainMenu() {

  return (
    <section className="w-4/5 h-2/3 m-auto flex justify-around items-center gap-16">
      <div className="w-1/2 aspect-square">
        <ChromaFlower />
      </div>

      <div className="h-4/5 flex flex-col justify-between">
        <h1 className="text-6xl">Fugue State</h1>

        <div className="flex flex-col gap-4">
          <button
            onClick={() => {
              gameState.value = { ...gameState.value, currentScene: "cutscene" };
            }}
          >
            Play
          </button>
          <button onClick={() => (optionsState.value = { ...optionsState.value, isActive: true })}>
            Options
          </button>
  
          <MidiPlayer />
        </div>
      </div>
    </section>
  );
}
