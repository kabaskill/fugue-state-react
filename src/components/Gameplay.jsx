import {
  closestCenter,
  DndContext,
  DragOverlay,
  // PointerSensor,
  // useSensor,
  // useSensors,
} from "@dnd-kit/core";
import { arrayMove, horizontalListSortingStrategy, SortableContext } from "@dnd-kit/sortable";
import { useState, useEffect } from "react";

import Card from "./Card";
import Deck from "./Deck";
import CardContainer from "./CardContainer";
import SheetMusic from "./SheetMusic";
import ChromaFlower from "./ChromaFlower";

import { AbcNotation } from "tonal";

import { motion } from "framer-motion";
import { gameState, optionsState, playerState } from "../data/gameState";

export default function Gameplay() {
  const initialDeck = [
    { name: "Card1", id: "0001", value: "C" },
    { name: "Card2", id: "0002", value: "D" },
    { name: "Card3", id: "0003", value: "E" },
    { name: "Card4", id: "0004", value: "F" },
    { name: "Card5", id: "0005", value: "G" },
    { name: "Card6", id: "0006", value: "A" },
    { name: "Card7", id: "0007", value: "B" },
    { name: "Card8", id: "0008", value: "c" },
    { name: "Card9", id: "0009", value: "d" },
    { name: "Card10", id: "0010", value: "e" },
    { name: "Card11", id: "0011", value: "f" },
    { name: "Card12", id: "0012", value: "g" },
    { name: "Card13", id: "0013", value: "a" },
    { name: "Card14", id: "0014", value: "b" },
  ];

  const [deck, setDeck] = useState(initialDeck);
  const [containerCards, setContainerCards] = useState([]);

  const [activeId, setActiveId] = useState(null);
  const activeCard = containerCards.find((card) => card.id === activeId);

  const sciNoteString = ["C4"].map((note) => AbcNotation.scientificToAbcNotation(note)).join("");

  const [noteString, setNoteString] = useState(
    `X:1\nT:Core Gameplay\nK:C\nM:4/4\nL:1/4\n${sciNoteString}`
  );

  // const sensors = useSensors(
  //   useSensor(PointerSensor, {
  //     activationConstraint: {
  //       delay: 200,
  //       distance: 10,
  //     },
  //   })
  // );

  useEffect(() => {
    const numberOfCards = 5;
    const initialContainerCards = [];
    const newDeck = [...deck];

    for (let i = 0; i < numberOfCards; i++) {
      const randomIndex = Math.floor(Math.random() * newDeck.length);
      initialContainerCards.push(newDeck.splice(randomIndex, 1)[0]);
    }

    setDeck(newDeck);
    setContainerCards(initialContainerCards);
  }, []);

  function handleDragEnd(event) {
    const { active, over } = event;

    if (!over) {
      return;
    }

    if (active.id === over.id) {
      return;
    }

    if (over && over.id === "droppable-area") {
      const draggedCard = containerCards.find((card) => card.id === active.id);

      if (draggedCard) {
        const draggedCardIndex = containerCards.findIndex((card) => card.id === event.active.id);
        const draggedCard = containerCards[draggedCardIndex];
        const firstCardOnDeck = deck[0];

        setNoteString(noteString + draggedCard.value);

        containerCards.splice(draggedCardIndex, 1);
        deck.splice(0, 1);

        setDeck([...deck, draggedCard]);
        setContainerCards([...containerCards, firstCardOnDeck]);
        playerState.value = { ...playerState.value, energy: playerState.value.energy - 1 };
      }
    } else {
      setContainerCards((cards) => {
        const oldIndex = cards.findIndex((card) => card.id === active.id);
        const newIndex = cards.findIndex((card) => card.id === over.id);
        return arrayMove(cards, oldIndex, newIndex);
      });
    }
  }

  return (
    <>
      <DndContext
        // sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={({ active }) => setActiveId(active.id)}
        onDragEnd={handleDragEnd}
      >
        <div className="grid grid-cols-6 grid-rows-3 size-full">
          <div className="flex-grow flex  row-span-2 col-span-6">
            <div className="flex flex-grow items-center justify-center p-4 ">
              <ChromaFlower />
            </div>

            <div className=" flex flex-grow flex-col items-center justify-center gap-4 p-4 bg-green-500 ">
              <div className=" bg-white text-black flex justify-center ">
                <SheetMusic id="core-gameplay" notation={noteString} />
              </div>
            </div>

            <div className="  flex flex-grow flex-col  p-4 bg-blue-500 gap-4 ">
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => (optionsState.value = { ...optionsState.value, isActive: true })}
                >
                  Options
                </button>
                <motion.button
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 1.1 }}
                  onClick={() => {
                    gameState.value = { ...gameState.value, currentScene: "main-menu" };
                  }}
                >
                  Main Menu
                </motion.button>
              </div>
              <Deck cards={deck} />
            </div>
          </div>

          <SortableContext items={containerCards} strategy={horizontalListSortingStrategy}>
            <div className="bg-slate-600 row-span-1 col-span-6 flex items-center justify-around ">
              <CardContainer cards={containerCards} />
            </div>
          </SortableContext>
        </div>

        <DragOverlay>
          {activeCard ? <Card card={activeCard} idSuffix="-clone" /> : null}
        </DragOverlay>
      </DndContext>
    </>
  );
}
