import { useSignals } from "@preact/signals-react/runtime";
import { AnimatePresence, motion } from "framer-motion";

// STATE DATA
import { gameState, optionsState } from "./data/gameState";

// COMPONENTS
import Gameplay from "./components/Gameplay";
import Options from "./components/Options";

import { PianoProvider } from "./components/PianoProvider";
import * as Tone from "tone";
import MidiPlayer from "./components/MidiPlayer";
import { useState } from "react";

export default function App() {
  useSignals();

  const [playMusic, setPlayMusic] = useState(false);

  return (
    <PianoProvider>
      <main className="flex flex-col items-center justify-center mx-auto h-full">
        <AnimatePresence>
          <Options />
        </AnimatePresence>

        {gameState.value.currentScene === "main-menu" && (
          <section className="flex flex-col justify-around items-center gap-8">
            <h1>Fugue State</h1>
            <button
              onClick={() => {
                gameState.value = { ...gameState.value, currentScene: "gameplay" };
              }}
            >
              Play
            </button>
            <button
              onClick={() => (optionsState.value = { ...optionsState.value, isActive: true })}
            >
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
                setPlayMusic(true);
              }}
            >
              Start Music
            </button>
            {playMusic && <MidiPlayer />}
          </section>
        )}

        {gameState.value.currentScene === "gameplay" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="h-full"
          >
            <Gameplay />
          </motion.div>
        )}
      </main>
    </PianoProvider>
  );
}
