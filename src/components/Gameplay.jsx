import { useState } from "react";
import { computed } from "@preact/signals-react";
import { closestCenter, DndContext, DragOverlay, useSensor, useSensors } from "@dnd-kit/core";
import { arrayMove, horizontalListSortingStrategy, SortableContext } from "@dnd-kit/sortable";

import { CustomPointerSensor } from "../utils/CustomPointerSensor";

import Card from "./Card";
import Deck from "./Deck";
import SheetMusic from "./SheetMusic";
import ChromaFlower from "./ChromaFlower";

import { motion } from "framer-motion";
import { gameState, optionsState, playerState } from "../data/gameState";

export default function Gameplay() {
  const items = computed(() => playerState.value.hand);
  const [selectedCards, setSelectedCards] = useState(new Set());

  const [activeId, setActiveId] = useState(null);

  const sensors = useSensors(
    useSensor(CustomPointerSensor, {
      activationConstraint: {
        delay: 200,
        distance: 20,
        tolerance: 5,
      },
    })
  );

  const [isDeck, setIsDeck] = useState(false);

  const [noteString, setNoteString] = useState(`X:1\nT:Core Gameplay\nK:C\nM:4/4\nL:1/4\n${"dd"}`);

  function handleDragStart(event) {
    const { active } = event;
    setActiveId(active.id);
  }

  function handleDragEnd(event) {
    const { active, over } = event;

    if (active && over && active.id !== over.id) {
      playerState.value.hand = arrayMove(
        items.value,
        items.value.findIndex((item) => item.id === active.id),
        items.value.findIndex((item) => item.id === over.id)
      );
    }

    setActiveId(null);
    setNoteString("cdef");
  }

  const handleCardSelection = (cardId) => {
    setSelectedCards((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(cardId)) {
        newSet.delete(cardId);
      } else {
        newSet.add(cardId);
      }
      return newSet;
    });
  };

  function handleTurn(playOrDiscard) {
    const selectedCardIds = Array.from(selectedCards);

    console.log(playOrDiscard, selectedCardIds);

    const newHand = [...playerState.value.hand];
    const playedCards = [];
    const newDeck = [...playerState.value.deck];

    selectedCardIds.forEach((cardId) => {
      const cardIndex = newHand.findIndex((card) => card.id === cardId);
      if (cardIndex !== -1) {
        const [card] = newHand.splice(cardIndex, 1);
        playedCards.push(card);
      }
    });

    while (newHand.length < playerState.value.handSize && newDeck.length > 0) {
      newHand.push(newDeck.shift());
    }

    newDeck.push(...playedCards);

    playerState.value = {
      ...playerState.value,
      hand: newHand,
      deck: newDeck,
    };

    setSelectedCards(new Set());
  }

  return (
    <>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="grid grid-cols-6 grid-rows-3 size-full">
          <Deck
            cards={playerState.value.deck}
            showModal={isDeck}
            closeModal={() => setIsDeck(false)}
          />

          <div className="flex-grow flex row-span-2 col-span-6">
            <div className="flex flex-grow items-center justify-center p-4 ">
              <ChromaFlower />
            </div>

            <div className="flex flex-grow flex-col items-center justify-center gap-4 p-4 bg-green-500 relative ">
              <div className="bg-white text-black flex justify-center ">
                <SheetMusic id="core-gameplay" notation={noteString} />
              </div>

              <div className="flex justify-end gap-2 absolute top-4 right-4">
                <button
                  onClick={() => (optionsState.value = { ...optionsState.value, isActive: true })}
                >
                  Options
                </button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => {
                    gameState.value = { ...gameState.value, currentScene: "main-menu" };
                  }}
                >
                  Main Menu
                </motion.button>
              </div>
            </div>
          </div>

          <div className="bg-slate-600 row-span-1 col-span-6 flex ">
            <div className="w-[10%] flex flex-col justify-center items-center gap-2 ">
              <p className="text-white font-bold text-2xl">Energy: {playerState.value.energy}</p>
            </div>

            <SortableContext items={items.value} strategy={horizontalListSortingStrategy}>
              <ul className="w-[75%] h-full flex justify-center items-center p-4 gap-4 bg-slate-700">
                {items.value.map((card) => (
                  <Card
                    key={card.id}
                    card={card}
                    isSelected={selectedCards.has(card.id)}
                    onSelect={() => handleCardSelection(card.id)}
                  />
                ))}
              </ul>
            </SortableContext>

            <div className="w-[20%] py-20 px-4 grid grid-cols-2 grid-rows-2 grid-flow-col  gap-4">
              <button onClick={() => handleTurn("play")} disabled={selectedCards.size === 0}>
                Play
              </button>
              <button onClick={() => handleTurn("discard")} disabled={selectedCards.size === 0}>
                Discard
              </button>
              <button
                className="self-center row-span-2 w-full aspect-[8/11]"
                onClick={() => setIsDeck(true)}
              >
                Show <br />
                Deck
              </button>
            </div>
          </div>
        </div>

        <DragOverlay>
          {activeId ? (
            <Card card={items.value.find((item) => item.id === activeId)} idSuffix="-clone" />
          ) : null}
        </DragOverlay>
      </DndContext>
    </>
  );
}
