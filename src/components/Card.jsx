import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import { AbcNotation } from "tonal";

import { motion } from "framer-motion";
import { useState } from "react";
import { usePiano } from "./PianoProvider";

export default function Card({ card, idSuffix = ""}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: card.id + idSuffix,
  });

  const { pianoOnce } = usePiano();
  const [isSelected, setIsSelected] = useState(false);

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
    zIndex: isDragging ? 1000 : undefined,
    opacity: isDragging ? 0.25 : undefined,
  };

  const cardNote = AbcNotation.abcToScientificNotation(card.value);

  const handlePlaySound = async (note) => {
    pianoOnce(note, "4n");
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <motion.button
        animate={{ y: isSelected ? -25 : 0 }}
        whileHover={{ scale: 1.05 }}
        className=" relative aspect-[8/11] h-full  p-2  cursor-pointer grid grid-rows-8 items-center"
        onPointerDown={() => {
          setIsSelected(!isSelected);
          handlePlaySound(cardNote);
        }}
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
            1
          </text>
        </svg>

        <svg className="row-span-5 w-[100%]">
          <circle cx="50%" cy="50%" r="35%" fill={`hsl(${(4 * 360) / 12}, 80%, 50%)`} />
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
            {cardNote}
          </text>
        </svg>

        <p className="row-span-3">Adds a quarter note</p>
      </motion.button>
    </div>
  );
}
