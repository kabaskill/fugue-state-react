import Card from "./Card";

const CardContainer = ({ cards }) => {
  return (
    <>
      <div className="fixed bottom-0 flex justify-center w-full h-[35dvh] max-h-[40dvh]">
        <div className="bg-slate-600 w-1/5 flex flex-col justify-center items-center gap-2">
          <p className="text-white font-bold text-2xl">Energy:5</p>
        </div>

        <ul className="relative w-3/5 flex justify-center p-4 gap-2 bg-slate-700">
          {cards.map((card) => (
            <Card key={card.id} card={card} />
          ))}
        </ul>

        <div className="bg-slate-600 w-1/5 flex flex-col justify-center items-center gap-2">
          <button className="w-4/5 h-1/4 ">Play</button>
          <button className="w-4/5 h-1/4 ">Discard</button>
        </div>
      </div>
    </>
  );
};

export default CardContainer;
