import { useState } from "react";
import { cutscenes } from "../data/cutscenes";
import { gameState } from "../data/gameState";
import Modal from "./Modal";

export default function Cutscene(
  isCutscene = gameState.value.currentScene === "cutscene",
) {
  const [dialogIndex, setDialogIndex] = useState(0);
  const [isEnded, setIsEnded] = useState(false);

  const scene = cutscenes[gameState.value.currentCutscene];

  if (!isEnded && dialogIndex === scene.dialog.length - 1) {
    setIsEnded(true);
  }

  return (
    <Modal
      showModal={isCutscene}
      closeModal={() => {
        if (gameState.value.currentCutscene === cutscenes.length - 1) {
          gameState.value = { ...gameState.value, currentScene: "main-menu" };
        } else {
          gameState.value = { ...gameState.value, currentScene: "gameplay" };
        }
      }}
      showXButton={true}
    >
      <h1 className="absolute top-[-4.5rem] text-white">
        {scene.title} <span className="italic">{scene.description}</span>
      </h1>

      <div
        className={`absolute top-0 h-2/3 ${
          scene.dialog[dialogIndex].image === "Player" ? "left-0" : "right-0"
        }`}
      >
        <img
          className="size-full"
          src={`${import.meta.env.BASE_URL}placeholders/${scene.dialog[dialogIndex].image}.png`}
          alt="characters"
        />
      </div>

      <div className="absolute bottom-0 left-0 mx-auto h-1/3 w-[100%] rounded-2xl border-2 border-black bg-slate-200">
        <div className="p-8 text-center">
          <h2 className="text-2xl font-bold">
            {scene.dialog[dialogIndex].image}
          </h2>
          <p className="text-balance text-xl">
            {scene.dialog[dialogIndex].line}
          </p>
        </div>

        <div className="absolute bottom-4 left-[25%] flex w-[50%] justify-around">
          {isEnded && (
            <>
              <button
                disabled={dialogIndex === 0}
                onClick={() =>
                  setDialogIndex(dialogIndex === 0 ? 0 : dialogIndex - 1)
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
                onClick={() => {
                  if (
                    gameState.value.currentCutscene ===
                    cutscenes.length - 1
                  ) {
                    window.open("https://www.oguzkabasakal.com", "_blank");
                  } else {
                    gameState.value = {
                      ...gameState.value,
                      currentScene: "gameplay",
                    };
                  }
                }}
              >
                GO!
              </button>
            </>
          )}
          <button
            disabled={dialogIndex === scene.dialog.length - 1}
            onClick={() =>
              setDialogIndex(
                dialogIndex === scene.dialog.length - 1
                  ? scene.dialog.length - 1
                  : dialogIndex + 1,
              )
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
      </div>
    </Modal>
  );
}
