import * as Tone from "tone";

const synth = new Tone.Synth().toDestination();

function playSound() {
  synth.triggerAttackRelease("C4", "8n");
}

const Deck = ({ cards }) => {
  return (
    <div className="w-[200px] border-black border-2 mx-4">
      <button
        onClick={() => playSound()}
        className="bg-slate-50 text-slate-900 p-2 my-4 rounded-md"
      >
        Test Audio
      </button>
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
