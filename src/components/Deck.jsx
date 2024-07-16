import randomId from "../utils/randomId";
import Modal from "./Modal";
import { LazyLoadImage } from "react-lazy-load-image-component";

export default function Deck({ cards, showModal, closeModal }) {
  if (!cards || !cards.length) {
    return <div>Loading deck...</div>;
  }

  return (
    <Modal showModal={showModal} closeModal={closeModal} showXButton={true}>
      <h1 className=" absolute top-[-4rem] text-white">
        DECK: <span className="italic">{cards.length}</span>
      </h1>

      <ul className="grid grid-cols-9 gap-4 p-6 overflow-auto">
        <h2 className="text-3xl col-span-9">Note Cards: </h2>
        {cards.map((card) => {
          return (
            <div key={randomId()} className="card">
              {card.unlocked ? (
                <LazyLoadImage src={`${import.meta.env.BASE_URL}/G-clef.svg`} alt="note-card" />
              ) : (
                <div>LOCKED</div>
              )}
            </div>
          );
        })}
      </ul>
    </Modal>
  );
}
