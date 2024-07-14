import { useState } from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { levels } from "../data/levels";
import { gameState, optionsState } from "../data/gameState";
import { motion } from "framer-motion";

export default function QuestPane({ taskFinished }) {
  const [dialogIndex, setDialogindex] = useState(0);

  return (
    <div className="  w-1/3 flex flex-col justify-between ">
      <div className="flex justify-end gap-2 pb-2 ">
        <button onClick={() => (optionsState.value = { ...optionsState.value, isActive: true })}>
          Options
        </button>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => {
            gameState.value = { ...gameState.value, currentScene: "main-menu" };
          }}
        >
          Main Menu
        </motion.button>
      </div>

      <div className="flex flex-col  w-full h-full gap-2">
        <div className="bg-slate-200  text-center rounded-xl  flex flex-col flex-1 justify-between relative">
          <div className="size-full flex justify-center items-center">
            <p className="text-lg px-4 pb-2 ">
              {levels[gameState.value.currentLevel].dialog[dialogIndex]}
            </p>
          </div>

          <div className="flex justify-between w-full pt-4 absolute bottom-0">
            <button
              disabled={dialogIndex === 0}
              onClick={() =>
                dialogIndex === 0 ? setDialogindex(0) : setDialogindex(dialogIndex - 1)
              }
            >
              {"<"}
            </button>
            {taskFinished && (
              <button
                onClick={() =>
                  (gameState.value = {
                    ...gameState.value,
                    currentLevel: gameState.value.currentLevel + 1,
                    currentScene: "cutscene",
                    currentCutscene: gameState.value.currentCutscene + 1,
                  })
                }
              >
                GO TO NEXT LEVEL
              </button>
            )}
            <button
              disabled={dialogIndex === levels[gameState.value.currentLevel].dialog.length - 1}
              onClick={() =>
                dialogIndex === levels[gameState.value.currentLevel].dialog.length - 1
                  ? setDialogindex(levels[gameState.value.currentLevel].dialog.length - 1)
                  : setDialogindex(dialogIndex + 1)
              }
            >
              {">"}
            </button>
          </div>
        </div>
      </div>
      <LazyLoadImage
        src={`${import.meta.env.BASE_URL}placeholders/Fritz.png`}
        className="w-4/5 self-end pt-4 "
        alt="characters"
        loading="lazy"
      />
    </div>
  );
}
