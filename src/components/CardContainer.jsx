import { playerState } from "../data/gameState";
import Card from "./Card";

export default function CardContainer({ cards }) {
  return (
    <>
      <div className=" flex flex-col justify-center items-center gap-2">
        <p className="text-white font-bold text-2xl">
          Energy: {playerState.value.energy} / {playerState.value.maxEnergy}
        </p>
      </div>

      <ul className=" max-w-[60%] h-full flex justify-center items-center p-4  gap-4 bg-slate-700 ">
        {cards.map((card) => (
          <Card key={card.id} card={card} />
        ))}
      </ul>

      <div className=" flex flex-col justify-center items-center gap-2">
        <button>Play</button>
        <button>Discard</button>
      </div>
    </>
  );
}
