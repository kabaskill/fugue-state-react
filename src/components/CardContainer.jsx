import { playerState } from "../data/gameState";
import Card from "./Card";

export default function CardContainer({ cards,  }) {
  console.log("container:", cards);

  if (!cards || !cards.length) {
    return <div>Loading cards...</div>;
  }

  return (
    <>

      <ul className="max-w-[60%] h-full flex justify-center items-center p-4 gap-4 bg-slate-700">
        {cards.map((card) => {
          if (!card) {
            return null;
          }

          return <Card key={card.id} card={card}  />;
        })}
      </ul>

      <div className="flex flex-col justify-center items-center gap-2">
        <button>Play</button>
        <button>Discard</button>
      </div>
    </>
  );
}
