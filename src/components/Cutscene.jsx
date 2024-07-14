import { useState } from "react";
import { cutscenes } from "../data/cutscenes";
import { gameState } from "../data/gameState";
import Modal from "./Modal";

import { LazyLoadImage } from "react-lazy-load-image-component";

export default function Cutscene(isCutscene = gameState.value.currentScene === "cutscene") {
  const [dialogIndex, setDialogIndex] = useState(0);
  const [isEnded, setIsEnded] = useState(false);

  const scene = cutscenes[gameState.value.currentCutscene];

  if (!isEnded && dialogIndex === scene.dialog.length - 1) {
    setIsEnded(true);
  }

  return (
    <Modal
      showModal={isCutscene}
      closeModal={() => (gameState.value = { ...gameState.value, currentScene: "gameplay" })}
      showXButton={false}
    >
      <h1 className=" absolute top-[-4.5rem] text-white">
        {scene.title} <span className="italic">{scene.description}</span>
      </h1>

      <LazyLoadImage
        src={`${import.meta.env.BASE_URL}placeholders/${scene.dialog[dialogIndex].image}.png`}
        alt="characters"
        className={`absolute top-0 h-2/3 ${
          scene.dialog[dialogIndex].image === "Player" ? "left-0" : "right-0 "
        }`}
      />
      <div className="border-black border-2 bg-slate-200 rounded-2xl w-[100%] h-1/3 mx-auto absolute bottom-0 left-0 ">
        <div className="p-8 text-center">
          <h2 className="text-2xl font-bold ">{scene.dialog[dialogIndex].image}</h2>
          <p className="text-2xl text-balance">{scene.dialog[dialogIndex].line}</p>
        </div>

        <div className="absolute bottom-4 w-[50%] left-[25%] flex justify-around">
          {isEnded && (
            <>
              <button
                disabled={dialogIndex === 0}
                onClick={() => setDialogIndex(dialogIndex === 0 ? 0 : dialogIndex - 1)}
              >
                Previous
              </button>
              <button
                onClick={() => {
                  if (gameState.value.currentCutscene === cutscenes.length - 1) {
                    window.open("https://www.oguzkabasakal.com", "_blank");
                  } else {
                    gameState.value = { ...gameState.value, currentScene: "gameplay" };
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
                dialogIndex === scene.dialog.length - 1 ? scene.dialog.length - 1 : dialogIndex + 1
              )
            }
          >
            Next
          </button>
        </div>
      </div>
    </Modal>
  );
}
