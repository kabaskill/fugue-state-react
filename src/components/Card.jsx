import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import SheetMusic from "./SheetMusic";

const Card = ({ card, idSuffix = "" }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: card.id,
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
    zIndex: isDragging ? 1000 : undefined,
    opacity: isDragging ? 0.5 : undefined,
  };

  const cardNote = "L:1/4\n" + card.value;
  const noteId = "card-note" + card.id + card.value + idSuffix;

  function handlePlaySound() {
    window.Tone.start();
    const synth = new window.Tone.Synth().toDestination();
    const playValue = card.value + "4";
    synth.triggerAttackRelease(playValue, "8n");
  }

  return (
    <button
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="relative p-2 cursor-pointer w-[10dvw] h-[25dvh] bg-slate-50 flex flex-col items-center justify-around  "
      onMouseDown={() => handlePlaySound()}
    >
      <div className=" w-1/2 h-1/3 ">
        <SheetMusic id={noteId} notation={cardNote} />
      </div>
      <p className="text-2xl">{card.value}</p>

      <p>Adds a quarter note</p>
    </button>
  );
};

export default Card;
