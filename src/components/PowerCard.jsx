import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { motion } from "framer-motion";

export default function PowerCard({ card, idSuffix = "", isSelected, onSelect }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: card.id + idSuffix,
  });

  const style = {
    maxWidth: "20%",
    transition,
    transform: CSS.Transform.toString(transform),
    zIndex: isDragging || isSelected ? 1000 : undefined,
    opacity: isDragging ? 0.25 : undefined,
  };

  const handleCardClick = () => {
    if (!isDragging) {
      onSelect();
    }
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <motion.div
        animate={{ y: isSelected ? -35 : 0 }}
        whileHover={{ scale: 1.05, zIndex: 1000 }}
        className="card"
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
            {card.power.cost}
          </text>
        </svg>

        <svg className="w-2/3" viewBox="0 0 40 40" textAnchor="middle" dominantBaseline="middle">
          <circle cx="50%" cy="50%" r="45%" fill="green" />
          <text
            x="50%"
            y="50%"
            fill="white"
            fontFamily="monospace"
            fontSize="0.7rem"
            fontWeight="bold"
          >
            Power
          </text>
        </svg>
        <p className="text-center">
          {card.power.name}
          {card.power.oneTime && " (One Time)"}
        </p>
        <div className=" w-5/6 h-1/4 px-4 bg-slate-200 rounded-md flex justify-center items-center text-center">
          {/* <p className="text-xl">Note Card:</p> */}
          <p>{card.power.desc}</p>
        </div>
      </motion.div>
    </div>
  );
}
