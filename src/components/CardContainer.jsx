import Card from "./Card";

const CardContainer = ({ cards }) => {
  return (
    <>
      <div className="fixed bottom-0 flex justify-center w-full">
        <div className="bg-slate-600 w-1/5 flex flex-col justify-center items-center gap-2">
          <button className="w-4/5 h-1/4 bg-fuchsia-400 hover:bg-fuchsia-600 active:bg-fuchsia-900">
            button1
          </button>
          <button className="w-4/5 h-1/4 bg-fuchsia-400 hover:bg-fuchsia-600 active:bg-fuschia-900">
            button2
          </button>
        </div>

        <ul className="relative w-3/5 flex justify-center p-4 gap-2 bg-slate-800">
          {cards.map((card) => (
            <Card key={card.id} card={card} />
          ))}
        </ul>

        <div className="bg-slate-600 w-1/5 flex flex-col justify-center items-center gap-2">

        </div>
      </div>
    </>
  );
};

export default CardContainer;
