import React, { useState, Suspense } from "react";
import { useSignals } from "@preact/signals-react/runtime";
import { AnimatePresence, motion } from "framer-motion";

import MidiPlayer from "./components/MidiPlayer";
import { PianoProvider } from "./components/PianoProvider";
import Options from "./components/Options";
import MainMenu from "./components/MainMenu";
import Modal from "./components/Modal";
import Cutscene from "./components/Cutscene";

import { gameState, optionsState } from "./data/gameState";

const Gameplay = React.lazy(() => import("./components/Gameplay"));

export default function App() {
  useSignals();
  const [isPianoProviderLoaded, setIsPianoProviderLoaded] = useState(false);
  const [showModal, setShowModal] = useState(true);
  const handleLoadPianoProvider = () => {
    setIsPianoProviderLoaded(true);
    setShowModal(false);
  };
  return (
    <>
      <Modal showModal={showModal} closeModal={() => setShowModal(false)} showXButton={false}>
        <div className="h-full flex flex-col items-center justify-around gap-8 p-12">
          <p className=" text-center ">
            Audio Engine needs to be loaded manually before you can start playing. Please click the
            button below to load the Audio Engine.
          </p>
          <p>
            Optimized for landscape resolutions. If you are using mobile devices, please rotate your
            device.
          </p>
          <p>You can also use your keyboard as a piano. Once the Audio Engine is started.</p>
          <button onClick={handleLoadPianoProvider}>Start Audio Engine</button>
        </div>
      </Modal>

      {isPianoProviderLoaded && (
        <PianoProvider>
          <main className=" flex flex-col items-center h-full w-full mx-auto">
            <AnimatePresence>
              <Options />
            </AnimatePresence>
            {optionsState.value.isMusicPlaying && <MidiPlayer />}
            {gameState.value.currentScene === "main-menu" && <MainMenu />}
            {gameState.value.currentScene === "cutscene" && <Cutscene />}
            {gameState.value.currentScene === "gameplay" && (
              <Suspense fallback={<div className="m-auto text-6xl">Loading...</div>}>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col w-full h-full"
                >
                  <Gameplay />
                </motion.div>
              </Suspense>
            )}
          </main>
        </PianoProvider>
      )}
    </>
  );
}
