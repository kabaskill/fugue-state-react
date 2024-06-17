import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import * as Tone from "tone";
import { AbcNotation } from "tonal";

import { motion } from "framer-motion";
import { useState } from "react";

const Card = ({ card }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: card.id,
  });

  const [isSelected, setIsSelected] = useState(false);

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
    zIndex: isDragging ? 1000 : undefined,
    opacity: isDragging ? 0.25 : undefined,
    height: "100%",
  };

  function handlePlaySound() {
    Tone.start();
    const synth = new Tone.Synth().toDestination();
    const playValue = card.value + "4";
    synth.triggerAttackRelease(playValue, "8n");
  }

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <motion.button
        ref={setNodeRef}
        animate={{ y: isSelected ? -25 : 0 }}
        whileHover={{ scale: 1.05 }}
        className="h-full relative p-2 cursor-pointer grid grid-rows-8 items-center  "
        onPointerDown={() => {
          setIsSelected(!isSelected);
          handlePlaySound();
        }}
      >
        <svg className="w-1/5 h-1/5 absolute top-0 right-0">
          <circle cx="50%" cy="50%" r="35%" fill="blue" />
          <text
            x="50%"
            y="50%"
            fill="white"
            fontFamily="monospace"
            fontSize="1.7rem"
            fontWeight="bold"
            textAnchor="middle"
            dominantBaseline="middle"
          >
            1
          </text>
        </svg>

        <svg className='row-span-5 w-full'>
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
            {AbcNotation.abcToScientificNotation(card.value)}
          </text>
        </svg>

        <p className="row-span-3 ">Adds a quarter note</p>
      </motion.button>
    </div>
  );
};

export default Card;
