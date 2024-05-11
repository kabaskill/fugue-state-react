const Deck = ({ cards }) => {
  return (
    <div className="w-[200px] border-black border-2 mx-4">
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
