const Deck = ({ cards }) => {

  if (!cards || !cards.length) {
    return <div>Loading deck...</div>;
  }
  
  return (
    <div className=" border-black border-2 ">
      <p className="text-center">Deck: {cards.length}</p>

      <ul className="flex flex-wrap gap-4">
        {cards.map((card) => {
          return (
            <li key={card.id}>
              {card.note}
              {card.octave}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Deck;
