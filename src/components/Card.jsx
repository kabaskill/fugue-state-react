import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import { motion } from "framer-motion";
import { usePiano } from "./PianoProvider";

import { optionsState } from "../data/gameState";

export default function Card({ card, idSuffix = "", isSelected, onSelect }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: card.id + idSuffix,
  });

  const chromaticIndex = Object.keys(optionsState.value.allNotes).findIndex(
    (index) => index === card.note
  );
  const { pianoOnce } = usePiano();

  const style = {
    height: "100%",
    transition,
    transform: CSS.Transform.toString(transform),
    zIndex: isDragging ? 1000 : undefined,
    opacity: isDragging ? 0.25 : undefined,
  };

  const handleCardClick = () => {
    if (!isDragging) {
      onSelect();
      if (!isSelected) {
        pianoOnce(card.note + card.octave);
      }
    }
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <motion.button
        animate={{ y: isSelected ? -35 : 0 }}
        whileHover={{ scale: 1.05 }}
        className="relative aspect-[8/11] max-w-full max-h-full cursor-pointer pb-2"
        onClick={handleCardClick}
      >
        <svg
          className="w-1/5 h-1/5 absolute top-0 right-2"
          viewBox="0 0 15 15 "
          textAnchor="middle"
          dominantBaseline="middle"
        >
          <circle cx="50%" cy="50%" r="45%" fill="blue" />
          <text
            x="50%"
            y="50%"
            fill="white"
            fontFamily="monospace"
            fontSize="0.65rem"
            fontWeight="bold"
          >
            {card.cost}
          </text>
        </svg>

        <svg
          className="h-3/5 w-full "
          viewBox="0 0 40 40"
          textAnchor="middle"
          dominantBaseline="middle"
        >
          <circle cx="50%" cy="50%" r="40%" fill={card.color} />
          <text
            x="50%"
            y="50%"
            fill="white"
            fontFamily="monospace"
            fontSize="0.8rem"
            fontWeight="bold"
          >
            {optionsState.value.notation === "chromatic"
              ? chromaticIndex
              : `${card.note}${card.octave}`}
          </text>
        </svg>

        <div className="text-black bg-slate-100 rounded-md h-1/3 w-full text-balance flex justify-center items-center ">
          <p className="text-lg">
            {card.description}

            <span
              style={{
                color: card.color,
                fontWeight: "bold",
              }}
            >
              {card.note}
              {card.octave}
            </span>
          </p>
        </div>
      </motion.button>
    </div>
  );
}
