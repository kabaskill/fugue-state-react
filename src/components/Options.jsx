import Modal from "./Modal";

import { optionsState } from "../data/gameState";
import randomId from "../utils/randomId";

export default function Options() {
  return (
    <Modal
      showModal={optionsState.value.isActive}
      closeModal={() => {
        optionsState.value = { ...optionsState.value, isActive: false };
      }}
    >
      <div className="flex size-full flex-col gap-16">
        <h1 className="">OPTIONS</h1>

        <div className="flex w-4/5 flex-1 flex-col gap-8 self-center">
          <div className="flex justify-between">
            <label htmlFor="volume-slider">Volume</label>
            <input
              type="range"
              name="volume"
              id="volume-slider"
              defaultValue={optionsState.value.volume}
              onChange={(event) =>
                (optionsState.value = {
                  ...optionsState.value,
                  volume: event.target.value,
                })
              }
            />
          </div>

          <div className="flex justify-between">
            <label htmlFor="volume-mute">Mute</label>
            <input
              type="checkbox"
              name="mute"
              id="volume-mute"
              onChange={(event) =>
                (optionsState.value = {
                  ...optionsState.value,
                  mute: event.target.checked,
                })
              }
            />
          </div>

          <div className="flex w-full justify-between">
            <div className="flex h-full flex-col justify-around">
              <div className="flex flex-col justify-center">
                <label htmlFor="root-note">RootNote</label>
                <select
                  name="root-note"
                  id="root-note"
                  value={optionsState.value.rootNote}
                  onChange={(event) =>
                    (optionsState.value = {
                      ...optionsState.value,
                      rootNote: event.target.value,
                    })
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

              <div className="flex flex-col justify-center">
                <label htmlFor="notation">Select the Notation Type</label>
                <select
                  name="notation"
                  id="notation"
                  value={optionsState.value.notation}
                  onChange={(event) =>
                    (optionsState.value = {
                      ...optionsState.value,
                      notation: event.target.value,
                    })
                  }
                >
                  <option value="scientific">Scientific</option>
                  <option value="chromatic">Chromatic</option>
                  <option value="do-re-mi">do-re-mi</option>
                  {/* <option value="abc">ABC Notation</option> */}
                </select>
              </div>
            </div>

            <div className="flex w-3/5 flex-col justify-center">
              <h2>Key Bindings</h2>
              <img
                src={`${import.meta.env.BASE_URL}/images/Keyboard.png`}
                alt="keyboard"
                className=""
              />
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}
