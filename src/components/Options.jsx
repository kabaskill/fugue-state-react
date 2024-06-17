import Modal from "./Modal";

import { optionsState } from "../data/gameState";

export default function Options() {
  return (
    <Modal
      showModal={optionsState.value.isActive}
      closeModal={() => {
        optionsState.value = { ...optionsState.value, isActive: false };
      }}
    >
      <div className="w-full h-full flex flex-col gap-16">
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
                  <option value="A">A</option>
                  <option value="A#">A#</option>
                  <option value="B">B</option>
                  <option value="C">C</option>
                  <option value="C#">C#</option>
                  <option value="D">D</option>
                  <option value="D#">D#</option>
                  <option value="E">E</option>
                  <option value="F">F</option>
                  <option value="F#">F#</option>
                  <option value="G">G</option>
                  <option value="G#">G#</option>
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
                  <option value="abc">ABC Notation</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}
