import { useState } from "react";
import { cutscenes } from "../data/cutscenes";
import { gameState } from "../data/gameState";
import Modal from "./Modal";

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
      <h1 className=" absolute top-[-4rem] text-white">
        {scene.title} <span className="italic">{scene.description}</span>
      </h1>

      <img
        src={`/placeholders/${scene.dialog[dialogIndex].character}.png`}
        alt="characters"
        className={`absolute top-0 h-2/3 ${
          scene.dialog[dialogIndex].character === "Player" ? "left-0" : "right-0 scale-x-[-1]"
        }`}
        loading="lazy"
      />
      <div className="border-black border-4 rounded-2xl w-[100%] h-1/3 mx-auto absolute bottom-0 left-0 ">
        <div className="left-6 top-6 absolute">
          <h2>{scene.dialog[dialogIndex].character}</h2>
          <p className="">{scene.dialog[dialogIndex].line}</p>
        </div>

        <div className="absolute right-4 top-4 h-3/5 aspect-square">
          {isEnded && (
            <button
              className="size-full"
              onClick={() => (gameState.value = { ...gameState.value, currentScene: "gameplay" })}
            >
              GO!
            </button>
          )}
        </div>

        <div className="absolute bottom-4 w-[50%] left-[25%] flex justify-around">
          {isEnded && (
            <button onClick={() => setDialogIndex(dialogIndex === 0 ? 0 : dialogIndex - 1)}>
              Previous
            </button>
          )}
          <button
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
