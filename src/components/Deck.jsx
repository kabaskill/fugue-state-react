import { playerState } from "../data/gameState";
import randomId from "../utils/randomId";
import Modal from "./Modal";
import { LazyLoadImage } from "react-lazy-load-image-component";

export default function Deck({ cards, discardPile, showModal, closeModal }) {
  if (!cards || !cards.length) {
    return console.log("No cards left. Game Over!");
  }

  const orderedCards = [
    ...cards.filter((card) => card.type === "note"),
    ...cards.filter((card) => card.type === "power"),
  ];
  const orderedDiscard = [
    ...discardPile.filter((card) => card.type === "note"),
    ...discardPile.filter((card) => card.type === "power"),
  ];

  const burnedCards = playerState.value.burnedCards;

  return (
    <Modal showModal={showModal} closeModal={closeModal} showXButton={true}>
      <h1 className=" absolute top-[-4rem] text-white">
        DECK: <span className="italic">{cards.length}</span>
      </h1>
      <div className="size-full overflow-auto">
        <ul className="grid grid-cols-9 gap-4 3 mb-8">
          <h2 className="text-3xl col-span-9">Available Cards: {cards.length}</h2>
          {orderedCards.map((card) => {
            return (
              <div key={randomId()} className="h-[180px]">
                <div  className="card ">
                  {card.unlocked ? (
                    card.type === "note" ? (
                      <>
                        <LazyLoadImage
                          src={`${import.meta.env.BASE_URL}/G-clef.svg`}
                          alt="note-card"
                        />
                      </>
                    ) : (
                      <p>{card.power.name}</p>
                    )
                  ) : (
                    <div>LOCKED</div>
                  )}
                </div>
              </div>
            );
          })}
        </ul>

        <div className="flex justify-between">
          <ul className="grid grid-cols-4 gap-4 w-1/2">
            <h2 className="text-3xl col-span-4">Played Cards: {discardPile.length} </h2>
            {orderedDiscard.map((card) => {
              return (
                <div key={randomId()} className="h-[180px]">
                  <div  className="card ">
                    {card.unlocked ? (
                      card.type === "note" ? (
                        <LazyLoadImage
                          src={`${import.meta.env.BASE_URL}/G-clef.svg`}
                          alt="note-card"
                        />
                      ) : (
                        <p>{card.power.name}</p>
                      )
                    ) : (
                      <div>LOCKED</div>
                    )}
                  </div>
                </div>
              );
            })}
          </ul>

          <ul className="grid grid-cols-4 gap-4  w-1/2">
            <h2 className="text-3xl col-span-4">Burned Cards: {burnedCards.length} </h2>
            {burnedCards.map((card) => {
              return (
                <div key={randomId()} className="h-[180px]">
                  <div  className="card ">
                    {<p>{card.power.name}</p>}
                  </div>
                </div>
              );
            })}
          </ul>
        </div>
      </div>
    </Modal>
  );
}
