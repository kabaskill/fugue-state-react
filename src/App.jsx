import { useSignals } from "@preact/signals-react/runtime";
import { AnimatePresence, motion } from "framer-motion";

//STATE DATA
import { gameState, optionsState } from "./data/gameState";

//COMPONENTS
import Gameplay from "./components/Gameplay";
import Options from "./components/Options";

function App() {
  useSignals();

  return (
    <main className="flex flex-col items-center justify-center mx-auto h-full">
      <AnimatePresence>
        <Options />
      </AnimatePresence>

      {!gameState.value.isPlaying && (
        <section className="flex flex-col   justify-around items-center gap-8">
          <h1>Fugue State</h1>
          <button
            onClick={() => {
              gameState.value = { ...gameState.value, isPlaying: !gameState.value.isPlaying };
            }}
          >
            Play
          </button>
          <button onClick={() => (optionsState.value = { ...optionsState.value, isActive: true })}>
            Options
          </button>
        </section>
      )}

      {gameState.value.isPlaying && (
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
  );
}

export default App;
