import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { motion, AnimatePresence } from "framer-motion";
import { usePiano } from "./PianoProvider";
import { optionsState, playerState } from "../data/gameState";
import { Note } from "tonal";
import { useEffect, useState } from "react";

export default function CardNew({ card, idSuffix = "", isSelected, onSelect, selectedIndex }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: card?.id + idSuffix,
  });
  const [newCard, setNewCard] = useState(card);

  const chromaticIndex = Object.keys(optionsState.value.allNotes).findIndex(
    (index) => index === newCard.note
  );

  const [hasRecievedNote, setHasRecievedNote] = useState(false);
  const { pianoOnce, activeNotes, offset } = usePiano();

  const style = {
    maxWidth: "20%",
    transition,
    transform: CSS.Transform.toString(transform),
    zIndex: isDragging || isSelected ? 1000 : undefined,
    opacity: isDragging ? 0.25 : undefined,
  };

  useEffect(() => {
    if (!isDragging && isSelected && !hasRecievedNote) {
      const noteMidi = activeNotes[selectedIndex];
      const noteValue = Note.fromMidiSharps(noteMidi);
      if (noteValue) {
        const [note, octave] = [noteValue.slice(0, -1), noteValue.slice(-1)];
        setNewCard((prevCard) => ({
          ...prevCard,
          note: note,
          octave: parseInt(octave),
          color: optionsState.value.allNotes[note],
        }));
        setHasRecievedNote(true);
        onSelect();
      }
    }
  }, [activeNotes]);

  useEffect(() => {
    const cardToUpdateIndex = playerState.value.hand.findIndex((card) => card.id === newCard.id);

    playerState.value.hand[cardToUpdateIndex] = newCard;
  }, [newCard]);

  function handleOctaveChange(change) {
    if (newCard.octave > -2 && newCard.octave < 7) {
      setNewCard((prevCard) => ({
        ...prevCard,
        octave: +prevCard.octave + +change,
      }));
    }
  }

  function handleCardClick() {
    if (!isDragging) {
      setHasRecievedNote(false);
      onSelect();
    }
  }

  function handlePlayNote(note, duration) {
    if (!isDragging) {
      pianoOnce(note, duration);
    }
  }

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <motion.div
        animate={{ y: isSelected ? -(35 + selectedIndex * 10) : 0 }}
        whileHover={{ scale: 1.05, zIndex: 1000 }}
        className={`card ${isDragging && "cursor-grab"}`}
        onClick={handleCardClick}
      >
        <svg
          className="w-1/5 h-1/5 absolute top-0 right-2"
          viewBox="0 0 15 15"
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
            {newCard.cost}
          </text>
        </svg>
        <motion.svg
          className="w-2/3"
          viewBox="0 0 40 40"
          textAnchor="middle"
          dominantBaseline="middle"
        >
          <motion.circle
            cx="50%"
            cy="50%"
            r="45%"
            animate={{ fill: newCard.color ? newCard.color : "#7fcbe9" }}
            transition={{ duration: 0.5 }}
          />
          <AnimatePresence mode="wait">
            <motion.text
              key={newCard.note}
              x="50%"
              y="50%"
              fill="white"
              fontFamily="monospace"
              fontSize="0.8rem"
              fontWeight="bold"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {newCard.note
                ? optionsState.value.notation === "chromatic"
                  ? chromaticIndex
                  : optionsState.value.notation === "do-re-mi"
                  ? optionsState.value.doremiObject[newCard.note]
                  : newCard.note
                : "Note"}
            </motion.text>
          </AnimatePresence>
          {newCard.note && !isSelected && (
            <motion.g
              whileHover={{ scale: 1.3 }}
              onClick={(event) => {
                event.stopPropagation();
                handlePlayNote(newCard.note + (newCard.octave - offset), 1);
              }}
              className="cursor-pointer"
            >
              <path
                d="M18 15l8-5-8-5v10z"
                transform="translate(7.5, 25) scale(0.6)"
                fill="white"
                stroke="#524949"
                strokeWidth="0.5px"
              />
            </motion.g>
          )}
        </motion.svg>
        {newCard.note ? (
          <>
            <p>Octave</p>
            <div className="flex justify-around items-center  w-full">
              <button
                onClick={(event) => {
                  event.stopPropagation();
                  handleOctaveChange(-1);
                }}
                className="z-50  p-1 bg-blue-600 text-white rounded-full hover:bg-blue-400"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 hover:scale-110"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 12H5" />
                </svg>
              </button>

              <motion.p
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="text-3xl text-white"
              >
                {newCard.octave}
              </motion.p>

              <button
                onClick={(event) => {
                  event.stopPropagation();
                  handleOctaveChange(1);
                }}
                className="z-50  p-1 bg-blue-600 text-white rounded-full hover:bg-blue-400 "
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 hover:scale-110"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
              </button>
            </div>
          </>
        ) : (
          <div className=" w-5/6 h-1/3 px-4 py-4 bg-slate-200 rounded-md flex justify-center items-center text-center">
            <p className="text-lg">{isSelected ? "Play a note to asign" : "Click to select"}</p>
          </div>
        )}
      </motion.div>
    </div>
  );
}
