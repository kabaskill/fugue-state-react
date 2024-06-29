import { gameState, optionsState } from "../data/gameState";

import * as Tone from "tone";

export default function MainMenu() {
  return (
    <section className="m-auto flex flex-col justify-around items-center gap-8">
      <h1>Fugue State</h1>
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

      <button
        onClick={() => {
          const synth = new Tone.Synth().toDestination();
          synth.triggerAttackRelease("C4", "8n");
        }}
      >
        Start Audio
      </button>
      <button
        onClick={() => {
          optionsState.value = {
            ...optionsState.value,
            isMusicPlaying: !optionsState.value.isMusicPlaying,
          };
          console.log(optionsState.value);
        }}
      >
        Toggle Music
      </button>
    </section>
  );
}
