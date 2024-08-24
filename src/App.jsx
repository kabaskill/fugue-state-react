import React, { useState, Suspense } from "react";
import { useSignals } from "@preact/signals-react/runtime";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "./utils/cn";

import { PianoProvider } from "./components/PianoProvider";
import Options from "./components/Options";
import Modal from "./components/Modal";
import Cutscene from "./components/Cutscene";

import { gameState, pianoProviderLoaded } from "./data/gameState";

const Gameplay = React.lazy(() => import("./components/Gameplay"));
const MainMenu = React.lazy(() => import("./components/MainMenu"));

export default function App() {
  useSignals();

  const [showModal, setShowModal] = useState(true);
  const handleLoadPianoProvider = () => {
    setShowModal(false);
  };

  return (
    <>
      <Modal
        showModal={showModal}
        closeModal={() => setShowModal(false)}
        showXButton={false}
      >
        <div
          className={cn(
            "flex h-full w-full flex-col items-center justify-around",
          )}
        >
          <p className="w-3/5">
            Audio Engine needs to be loaded manually before you can start
            playing. Click the button to load the Audio Engine. You can also use
            your keyboard as a piano once the Audio Engine is started. Use black
            and white keys to play the notes. Yellow keys change the octave you
            are playing. Optimized for desktop resolutions.
          </p>

          <img
            src={`${import.meta.env.BASE_URL}/images/Keyboard.png`}
            alt="keyboard"
            className="w-4/5"
          />
          <button onClick={handleLoadPianoProvider}>Start Audio Engine</button>
        </div>
      </Modal>

      {!showModal && (
        <PianoProvider>
          {pianoProviderLoaded.value && (
            <main className="mx-auto flex h-full w-full flex-col items-center">
              <AnimatePresence>
                <Options />
              </AnimatePresence>

              {gameState.value.currentScene === "main-menu" && (
                <Suspense
                  fallback={<div className="m-auto text-6xl">Loading...</div>}
                >
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex h-full w-full flex-col"
                  >
                    <MainMenu />
                  </motion.div>
                </Suspense>
              )}

              {gameState.value.currentScene === "cutscene" && <Cutscene />}

              {gameState.value.currentScene === "gameplay" && (
                <Suspense
                  fallback={<div className="m-auto text-6xl">Loading...</div>}
                >
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex h-full w-full flex-col"
                  >
                    <Gameplay />
                  </motion.div>
                </Suspense>
              )}
            </main>
          )}
        </PianoProvider>
      )}
    </>
  );
}
