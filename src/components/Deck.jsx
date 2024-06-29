const Deck = ({ cards }) => {
  return (
    <div className=" border-black border-2 ">
      <p className="text-center">Deck: {cards.length}</p>

      <ul className="flex flex-col">
        {cards.map((card) => (
          <li key={card.id}>
            {card.name}: {card.value}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Deck;
