import { useEffect, useState } from "react";
import { computed } from "@preact/signals-react";
import { closestCenter, DndContext, DragOverlay, useSensor, useSensors } from "@dnd-kit/core";
import { arrayMove, horizontalListSortingStrategy, SortableContext } from "@dnd-kit/sortable";
import { CustomPointerSensor } from "../utils/CustomPointerSensor";

import Card from "./Card";
import Deck from "./Deck";
import SheetMusic from "./SheetMusic";
import ChromaFlower from "./ChromaFlower";

import { gameState, optionsState, playerState } from "../data/gameState";
import QuestPane from "./QuestPane";
import randomId from "../utils/randomId";
import { levels } from "../data/levels";
import { AbcNotation, Note } from "tonal";
import { usePiano } from "./PianoProvider";

export default function Gameplay() {
  const sensors = useSensors(
    useSensor(CustomPointerSensor, {
      activationConstraint: {
        delay: 100,
        distance: 20,
        tolerance: 5,
      },
    })
  );

  const { activeNotes } = usePiano();
  const activeNoteNames = activeNotes.map((note) => Note.fromMidiSharps(note));
  const abcNoteString = `${activeNotes.length > 0 ? "!mark!" : ""}[${activeNoteNames
    .map((note) => AbcNotation.scientificToAbcNotation(note))
    .join("")}]`;

  const items = computed(() => playerState.value.hand);
  const [selectedCards, setSelectedCards] = useState(new Set());

  const [activeId, setActiveId] = useState(null);
  const [isDeckOpen, setIsDeckOpen] = useState(false);

  const levelInfo = levels[gameState.value.currentLevel];
  const [levelEnergy, setLevelEnergy] = useState(0);
  const [playerTaskString, setPlayerTaskString] = useState("");
  const [taskFinished, setTaskFinished] = useState(false);

  useEffect(() => {
    if (playerTaskString === levelInfo.taskCheckString) {
      setTaskFinished(true);
    }
  }, [playerTaskString, levelInfo.taskCheckString]);

  function increaseEnergy(cost) {
    setLevelEnergy((prev) => prev + cost);
    playerState.value.totalEnergySpent = playerState.value.totalEnergySpent + cost;
  }

  function deleteLastNote() {
    if (playerTaskString === "") {
      return;
    }

    if (!taskFinished) {
      setPlayerTaskString((prev) => {
        if (prev[prev.length - 2] === "^") {
          return prev.slice(0, -2);
        } else {
          return prev.slice(0, -1);
        }
      });

      increaseEnergy(1);
    }
  }

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

    const newHand = [...playerState.value.hand];
    const playedCards = [];
    const newDeck = [...playerState.value.deck];

    selectedCardIds.forEach((cardId) => {
      const cardIndex = newHand.findIndex((card) => card.id === cardId);
      if (cardIndex !== -1) {
        const [card] = newHand.splice(cardIndex, 1);
        playedCards.push(card);

        if (playOrDiscard === "play" && !taskFinished) {
          const playedNote = AbcNotation.scientificToAbcNotation(card.note + card.octave);
          setPlayerTaskString((prev) => prev + playedNote);
          increaseEnergy(card.cost);
        }
      }
    });

    if (playOrDiscard === "discard" && !taskFinished) {
      increaseEnergy(1);
    }

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
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="grid grid-cols-6 grid-rows-3 size-full">
        <Deck
          cards={playerState.value.deck}
          showModal={isDeckOpen}
          closeModal={() => setIsDeckOpen(false)}
        />

        <div className="flex row-span-2 col-span-6">
          <div className="w-1/3">
            <ChromaFlower />
          </div>

          <div className="flex  w-2/3 gap-4 p-4 bg-slate-500  ">
            <div className="flex flex-col flex-1 gap-4">
              <div className="bg-slate-100 text-black flex flex-col flex-1 justify-center relative pb-16">
                <SheetMusic
                  id={levelInfo.title}
                  title={levelInfo.title}
                  notation={levelInfo.taskAbcString}
                  isTask
                />
              </div>

              <div className="bg-slate-100 text-black flex flex-col flex-1 justify-center relative pb-16">
                <SheetMusic id="task" title="Task" notation={playerTaskString + abcNoteString} />
                <button
                  disabled={playerTaskString === "" || taskFinished}
                  onClick={() => deleteLastNote()}
                  className="absolute bottom-4 right-4 "
                >
                  Delete Last Note
                  <br />
                  (1 Energy)
                </button>
              </div>
            </div>

            <QuestPane taskFinished={taskFinished} />
          </div>
        </div>

        {/*CARD CONTAINER*/}
        <div className="bg-slate-600 row-span-1 col-span-6 flex ">
          <div className="w-[15%] flex flex-col justify-center items-center gap-4 ">
            <p className="text-white font-bold text-2xl">Energy: {levelEnergy}</p>
            <p className="text-white font-bold text-2xl">
              Total Energy Spent: {playerState.value.totalEnergySpent}
            </p>

            <div className="flex flex-col w-full bg-slate-400  gap-4 p-4 ">
              <div className=" flex flex-col justify-around gap-4">
                <div className="flex  justify-between items-center">
                  <label htmlFor="root-note">Root Note</label>
                  <select
                    name="root-note"
                    id="root-note"
                    value={optionsState.value.rootNote}
                    onChange={(event) =>
                      (optionsState.value = {
                        ...optionsState.value,
                        rootNote: event.target.value,
                      })
                    }
                  >
                    {Object.keys(optionsState.value.allNotes).map((note) => {
                      return (
                        <option key={randomId("option")} value={note}>
                          {note}
                        </option>
                      );
                    })}
                  </select>
                </div>

                <div className="flex  justify-between items-center">
                  <label htmlFor="notation">Notation</label>
                  <select
                    name="notation"
                    id="notation"
                    value={optionsState.value.notation}
                    onChange={(event) =>
                      (optionsState.value = {
                        ...optionsState.value,
                        notation: event.target.value,
                      })
                    }
                  >
                    <option value="scientific">Scientific</option>
                    <option value="chromatic">Chromatic</option>
                    {/* <option value="abc">ABC Notation</option>
                       <option value="standart">Do-Re-Mi Notation</option> */}
                  </select>
                </div>
              </div>
            </div>
          </div>

          <SortableContext items={items.value} strategy={horizontalListSortingStrategy}>
            <ul className="w-[65%] h-full flex justify-center items-center p-4  gap-4 bg-slate-700">
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

          <div className="w-[20%] py-8 px-4 grid grid-cols-2 grid-rows-2 grid-flow-col place-items-center gap-4">
            <button
              className="size-4/5"
              onClick={() => handleTurn("play")}
              disabled={selectedCards.size === 0}
            >
              Play
            </button>
            <button
              className="size-4/5"
              onClick={() => handleTurn("discard")}
              disabled={selectedCards.size === 0}
            >
              Discard
            </button>
            <button
              className="self-center row-span-2 size-full "
              onClick={() => setIsDeckOpen(true)}
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
  );
}
