import { useState } from "react";
import { levels } from "../data/levels";
import { gameState, playerState } from "../data/gameState";
import { motion } from "framer-motion";
import Modal from "./Modal";
import ChromaFlower from "./ChromaFlower";
import CardNew from "./CardNew";
import SheetMusic from "./SheetMusic";
import PowerCard from "./PowerCard";
import { cn } from "../utils/cn";

export default function QuestPane() {
  const [dialogIndex, setDialogindex] = useState(0);
  const [showModal, setShowModal] = useState(true);

  const level = levels.value;
  const current = gameState.value.currentLevel;

  const isChroma = current === 0 && (dialogIndex === 2 || dialogIndex === 3);
  const isSheet = current === 0 && dialogIndex >= 4 && dialogIndex <= 6;
  const isCard = current === 0 && dialogIndex >= 7 && dialogIndex <= 11;
  const isNote = current === 0 && dialogIndex === 11;

  const card = { ...playerState.value.hand[0], id: "quest-card" };
  const noteCard = {
    ...card,
    id: "quest-note-card",
    note: "A",
    octave: 4,
    color: "red",
  };
  const power = playerState.value.deck.find((item) => item.type === "power");

  return (
    <>
      <Modal
        showModal={showModal}
        closeModal={() => {
          setShowModal(false);
        }}
        showXButton={false}
        flexible
      >
        <div className="relative flex size-full items-center justify-end">
          {/* TALKBOX */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            key={dialogIndex}
            className="relative flex w-1/2 flex-col items-center justify-between rounded-xl bg-slate-200 text-lg shadow-md pt-4"
          >
            <div
              className={cn(
                "absolute left-full top-3/4 h-0 w-0",
                "border-b-[1rem] border-l-[1.5rem] border-t-[1rem] border-transparent border-l-slate-200 drop-shadow-xl",
              )}
            ></div>

            {/* CHROMA FLOWER */}
            {isChroma && (
              <div className="w-1/2 bg-slate-500">
                <ChromaFlower />
              </div>
            )}

            {/* SHEET MUSIC */}
            {isSheet && (
              <div className="w-4/5 bg-slate-200 pb-4">
                <SheetMusic
                  id="tutorial"
                  title="Welcome to Fugue State!"
                  notation={level[current].taskAbc}
                />
                <SheetMusic
                  id="tutorial-task"
                  title="My Empty Sheet"
                  notation='"This part is also reactive!" !mark![CEG]'
                />
              </div>
            )}

            {/* CARD */}
            {isCard && (
              <ul className="flex h-2/5 w-4/5 items-center justify-center gap-6 py-8">
                <CardNew
                  card={card}
                  key={card.id}
                  isSelected={false}
                  selectedIndex={0}
                />

                {!isNote ? (
                  <PowerCard
                    card={power}
                    isSelected={false}
                    onSelect={() => console.log("Power Clicked")}
                  />
                ) : (
                  <>
                    <svg
                      className="h-16 w-16"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#3b82f6"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M7 16l-4-4 4-4" />
                      <path d="M17 8l4 4-4 4" />
                      <path d="M3 12h18" />
                    </svg>
                    <CardNew
                      card={noteCard}
                      key={noteCard.id}
                      isSelected={false}
                      selectedIndex={0}
                    />
                  </>
                )}
              </ul>
            )}
            <p className="flex flex-1 items-center justify-center px-12 py-12 text-center text-2xl">
              {level[current].dialog[dialogIndex]}
            </p>
            
            {/* ARROW BUTTONS */}
            <div className="flex justify-between self-stretch p-4">
              <button
                disabled={dialogIndex === 0}
                onClick={() =>
                  dialogIndex === 0
                    ? setDialogindex(0)
                    : setDialogindex(dialogIndex - 1)
                }
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>

              <button
                disabled={dialogIndex === level[current].dialog.length - 1}
                onClick={() =>
                  dialogIndex === level[current].dialog.length - 1
                    ? setDialogindex(level[current].dialog.length - 1)
                    : setDialogindex(dialogIndex + 1)
                }
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>
            <button
              onClick={() => setShowModal(false)}
              className="absolute right-2 top-2 z-50 rounded-full bg-red-500 p-2 text-white hover:bg-red-400"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 hover:scale-110"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </motion.div>

          <div className="relative h-full w-1/3">
            <img
              className="absolute bottom-0 right-0 w-full"
              src={`${import.meta.env.BASE_URL}placeholders/Fritz.png`}
              alt="characters"
              loading="lazy"
            />
          </div>
        </div>
      </Modal>
    </>
  );
}
