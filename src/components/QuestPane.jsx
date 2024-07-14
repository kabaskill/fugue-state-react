import { useState } from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { levels } from "../data/levels";
import { gameState } from "../data/gameState";
import Modal from "./Modal";

export default function QuestPane() {
  const [dialogIndex, setDialogindex] = useState(0);
  const [showModal, setShowModal] = useState(true);

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
        <div className=" size-full relative">
          <div className="bg-slate-200 shadow-black shadow-lg w-3/5 h-1/3 text-center rounded-3xl relative left-80 top-48">
            <div className="h-full w-4/5 flex justify-center items-center mx-auto">
              <p className="text-3xl px-4 pb-16 ">
                {levels[gameState.value.currentLevel].dialog[dialogIndex]}
              </p>
              {dialogIndex === levels[gameState.value.currentLevel].dialog.length - 1 && (
                <button
                  className="absolute top-2 right-2 rounded-full  "
                  onClick={() => {
                    setShowModal(false);
                  }}
                >
                  X
                </button>
              )}
            </div>

            <div className="flex justify-around w-full pt-4 absolute bottom-4">
              <button
                disabled={dialogIndex === 0}
                onClick={() =>
                  dialogIndex === 0 ? setDialogindex(0) : setDialogindex(dialogIndex - 1)
                }
              >
                {"<"}
              </button>

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

          <LazyLoadImage
            src={`${import.meta.env.BASE_URL}placeholders/Fritz.png`}
            className=" w-1/3 absolute right-0 bottom-0"
            alt="characters"
            loading="lazy"
          />
        </div>
      </Modal>
    </>
  );
}
