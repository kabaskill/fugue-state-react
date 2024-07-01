import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import { motion } from "framer-motion";
import { usePiano } from "./PianoProvider";

import { effect } from "@preact/signals-react";
import { optionsState } from "../data/gameState";

export default function Card({ card, idSuffix = "", isSelected, onSelect }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: card.id + idSuffix,
  });

  // effect(() => {
  //   const allNotes = optionsState.value.allNotes;
  //   if (Array.isArray(allNotes)) {
  //     const currIndex = allNotes.findIndex((note) => note === card.note);
  //     if (currIndex !== -1) {
  //       card.note = allNotes[currIndex];
  //     }
  //   }
  // }, [optionsState.value.rootNote]);

  const { pianoOnce } = usePiano();

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
    zIndex: isDragging ? 1000 : undefined,
    opacity: isDragging ? 0.25 : undefined,
  };

  const handleCardClick = () => {
    if (!isDragging) {
      onSelect();
      pianoOnce(card.note + card.octave, "4n");
    }
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <motion.button
        animate={{ y: isSelected ? -25 : 0 }}
        whileHover={{ scale: 1.05 }}
        className="relative aspect-[8/11] h-full p-2 cursor-pointer grid grid-rows-8 items-center"
        onClick={handleCardClick}
      >
        <svg className="w-1/5 h-1/5 absolute top-0 right-2">
          <circle cx="50%" cy="50%" r="35%" fill="blue" />
          <text
            x="50%"
            y="50%"
            fill="white"
            fontFamily="monospace"
            fontSize="1.4rem"
            fontWeight="bold"
            textAnchor="middle"
            dominantBaseline="middle"
          >
            {card.cost}
          </text>
        </svg>

        <svg className="row-span-5 w-[100%]">
          <circle cx="50%" cy="50%" r="35%" fill={card.color} />
          <text
            x="50%"
            y="50%"
            fill="white"
            fontFamily="monospace"
            fontSize="2.5rem"
            fontWeight="bold"
            textAnchor="middle"
            dominantBaseline="middle"
          >
            {card.note}
            {card.octave}
          </text>
        </svg>

        <p className="row-span-3">Adds a quarter note</p>
      </motion.button>
    </div>
  );
}
