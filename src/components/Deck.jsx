import Modal from "./Modal";
import Card from "./Card";

export default function Deck({ cards, showModal, closeModal }) {
  if (!cards || !cards.length) {
    return <div>Loading deck...</div>;
  }

  return (
    <Modal showModal={showModal} closeModal={closeModal} showXButton={true}>
      <h1 className=" absolute top-[-4rem] text-white">
        DECK: <span className="italic">{cards.length}</span>
      </h1>

      <ul className="size-full grid  grid-cols-5 gap-4 p-6 overflow-auto">
        {cards.map((card) => {
          return (
            <Card
              key={card.id}
              card={card}
              isSelected={false}
              onSelect={() => console.log(card.note)}
              onDeck={true}
            />
          );
        })}
      </ul>
    </Modal>
  );
}
