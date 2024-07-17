import Modal from "./Modal";

import { optionsState } from "../data/gameState";
import randomId from "../utils/randomId";

import { LazyLoadImage } from "react-lazy-load-image-component";

export default function Options() {
  return (
    <Modal
      showModal={optionsState.value.isActive}
      closeModal={() => {
        optionsState.value = { ...optionsState.value, isActive: false };
      }}
    >
      <div className="size-full flex flex-col gap-16">
        <h1 className="">OPTIONS</h1>

        <div className="w-4/5 flex flex-col flex-1 self-center gap-8">
          <div className="flex justify-between p-2">
            <label htmlFor="volume-slider">Volume</label>
            <input
              type="range"
              name="volume"
              id="volume-slider"
              defaultValue={optionsState.value.volume}
              onChange={(event) =>
                (optionsState.value = { ...optionsState.value, volume: event.target.value })
              }
            />
          </div>

          <div className="flex justify-between p-2">
            <label htmlFor="volume-mute">Mute</label>
            <input
              type="checkbox"
              name="mute"
              id="volume-mute"
              onChange={(event) =>
                (optionsState.value = { ...optionsState.value, mute: event.target.checked })
              }
            />
          </div>

          <div className="flex flex-col bg-slate-200  gap-4 p-2 pb-4">
            <h2>Notation</h2>

            <div className="px-8 flex justify-around">
              <div className="flex flex-col justify-center items-center">
                <label htmlFor="root-note">RootNote</label>
                <select
                  name="root-note"
                  id="root-note"
                  value={optionsState.value.rootNote}
                  onChange={(event) =>
                    (optionsState.value = { ...optionsState.value, rootNote: event.target.value })
                  }
                >
                  {Object.keys(optionsState.value.allNotes).map((note) => {
                    return (
                      <option key={randomId("option")} value={note}>
                        {note}
                      </option>
                    );
                  })}
                </select>
              </div>

              <div className="flex flex-col justify-center items-center">
                <label htmlFor="notation">Select the Notation Type</label>
                <select
                  name="notation"
                  id="notation"
                  value={optionsState.value.notation}
                  onChange={(event) =>
                    (optionsState.value = { ...optionsState.value, notation: event.target.value })
                  }
                >
                  <option value="scientific">Scientific</option>
                  <option value="chromatic">Chromatic</option>
                  <option value="do-re-mi">Do-Re-Mi Notation</option>
                  {/* <option value="abc">ABC Notation</option> */}
                </select>
              </div>
            </div>
          </div>

          <div className="flex flex-col  justify-center items-center">
            <h2>Key Bindings</h2>
            <LazyLoadImage
              src={`${import.meta.env.BASE_URL}/images/Keyboard.png`}
              alt="keyboard"
              width={600}
            />
          </div>
        </div>
      </div>
    </Modal>
  );
}
