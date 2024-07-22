import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { motion } from "framer-motion";
import { usePiano } from "./PianoProvider";
import { optionsState } from "../data/gameState";
import { useState } from "react";

export default function Card({ card, idSuffix = "", isSelected, onSelect }) {
  const chromaticIndex = Object.keys(optionsState.value.allNotes).findIndex(
    (index) => index === card.note
  );

  const [isEditing, setIsEditing] = useState(false);
  const [edited, setEdited] = useState(false);
  const [editedCard, setEditedCard] = useState({ ...card, note: chromaticIndex });

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: card.id + idSuffix,
    disabled: isEditing,
  });

  const { pianoOnce } = usePiano();

  const style = {
    height: "100%",
    transition,
    transform: CSS.Transform.toString(transform),
    zIndex: isDragging || isSelected ? 1000 : undefined,
    opacity: isDragging ? 0.25 : undefined,
  };

  const handleCardClick = () => {
    if (!isDragging && !isEditing) {
      onSelect();
      if (!isSelected) {
        pianoOnce(card.note + card.octave, 1);
      }
    }
  };

  const handleEdit = (event) => {
    event.stopPropagation();
    setIsEditing(true);
  };

  const handleDone = (event) => {
    event.stopPropagation();
    setIsEditing(false);
    setEdited(true);
    const newNote = Object.keys(optionsState.value.allNotes)[editedCard.note];
    card.note = newNote;
    card.octave = editedCard.octave;
    card.color = optionsState.value.allNotes[newNote];
  };

  const handleCancel = (event) => {
    event.stopPropagation();
    setIsEditing(false);
    setEditedCard({ ...card, note: chromaticIndex });
  };

  const handleInputChange = (event) => {
    event.stopPropagation();
    const { name, value } = event.target;
    const newCard = { ...editedCard, [name]: parseInt(value) };
    if (name === "note") {
      const newNote = Object.keys(optionsState.value.allNotes)[value];
      newCard.color = optionsState.value.allNotes[newNote];
    }
    setEditedCard(newCard);
  };

  const handlePlayNote = (event) => {
    event.stopPropagation();
    const newNote = Object.keys(optionsState.value.allNotes)[editedCard.note];
    pianoOnce(newNote + editedCard.octave, 1);
  };

  const renderIcon = () => {
    if (isEditing) {
      return (
        <motion.g whileHover={{ scale: 1.3 }} onClick={handlePlayNote} className="cursor-pointer">
          <path d="M18 15l8-5-8-5v10z" transform="translate(7, 21) scale(0.60)" fill="white" />
        </motion.g>
      );
    } else if (!edited) {
      return (
        <motion.g whileHover={{ scale: 1.3 }} onClick={handleEdit} className="cursor-pointer">
          <path
            d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"
            transform="translate(15, 23) scale(0.4)"
            fill="white"
          />
        </motion.g>
      );
    }
    return null;
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <motion.div
        animate={{ y: isSelected ? -35 : 0 }}
        whileHover={{ scale: 1.05, zIndex: 1000 }}
        className={`card ${!isEditing && ""}`}
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
          className={`${isEditing ? "w-3/5" : "w-2/3"}`}
          viewBox="0 0 40 40"
          textAnchor="middle"
          dominantBaseline="middle"
        >
          <circle cx="50%" cy="50%" r="45%" fill={isEditing ? editedCard.color : card.color} />
          <text
            x="50%"
            y={edited ? "50%" : "45%"}
            fill="white"
            fontFamily="monospace"
            fontSize="0.8rem"
            fontWeight="bold"
          >
            {optionsState.value.notation === "chromatic"
              ? chromaticIndex
              : optionsState.value.notation === "do-re-mi"
              ? optionsState.value.doremiArray[chromaticIndex]
              : `${
                  isEditing ? Object.keys(optionsState.value.allNotes)[editedCard.note] : card.note
                }`}
          </text>
          {renderIcon()}
        </svg>

        {isEditing ? (
          <div className="flex flex-col justify-center items-center gap-2">
            <input
              type="range"
              name="note"
              value={editedCard.note}
              onChange={handleInputChange}
              min="0"
              max="11"
              list="notes"
            />
            <datalist id="notes">
              {Object.keys(optionsState.value.allNotes).map((note, index) => (
                <option key={note} value={index} label={note}></option>
              ))}
            </datalist>

            <p className="text-lg ">Octave: {editedCard.octave}</p>
            <input
              type="range"
              name="octave"
              value={editedCard.octave}
              onChange={handleInputChange}
              min={0}
              max={7}
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={handleCancel}
                className="mr-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
              <button
                onClick={handleDone}
                className="p-1 bg-green-500 text-white rounded-full hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </button>
            </div>
          </div>
        ) : (
          <>
            <p className="text-lg ">Octave: {editedCard.octave}</p>
            <div className="text-center px-4 mx-4 bg-slate-200 rounded-md">
              {/* <p className="text-xl">Note Card:</p> */}
              <p className="text-base">Play or discard the note</p>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
}
