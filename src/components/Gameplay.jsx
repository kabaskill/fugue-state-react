import React, { useEffect, useState } from "react";
import { computed } from "@preact/signals-react";
import { closestCenter, DndContext, DragOverlay, useSensor, useSensors } from "@dnd-kit/core";
import { arrayMove, horizontalListSortingStrategy, SortableContext } from "@dnd-kit/sortable";
import { CustomPointerSensor } from "../utils/CustomPointerSensor";

import Card from "./Card";
import Deck from "./Deck";
import SheetMusic from "./SheetMusic";
import QuestPane from "./QuestPane";
import PowerCard from "./PowerCard";
import { usePiano } from "./PianoProvider";

const ChromaFlower = React.lazy(() => import("./ChromaFlower"));

import { gameState, optionsState, playerState } from "../data/gameState";
import randomId from "../utils/randomId";
import { levels } from "../data/levels";
import { AbcNotation, Note } from "tonal";
import { motion } from "framer-motion";

export default function Gameplay() {
  const sensors = useSensors(
    useSensor(CustomPointerSensor, {
      activationConstraint: {
        delay: 100,
        distance: 20,
        tolerance: 50,
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

  const levelInfo = levels.value[gameState.value.currentLevel];
  const [playerTaskString, setPlayerTaskString] = useState("");
  const [taskFinished, setTaskFinished] = useState(false);

  useEffect(() => {
    if (playerTaskString === levelInfo.taskCheck) {
      setTaskFinished(true);
    }
  }, [playerTaskString, levelInfo.taskCheck]);

  useEffect(() => {
    playerState.value = {
      ...playerState.value,
      deck: [...playerState.value.deck, ...playerState.value.discardPile],
    };
  }, []);

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
    const newDiscardPile = [...playerState.value.discardPile];

    let chordPlayed = "";

    selectedCardIds.forEach((cardId) => {
      const cardIndex = newHand.findIndex((card) => card.id === cardId);
      if (cardIndex !== -1) {
        const card = newHand[cardIndex];

        if (playOrDiscard === "play" && !taskFinished) {
          if (card.type === "note") {
            const playedNote = AbcNotation.scientificToAbcNotation(card.note + card.octave);
            chordPlayed += playedNote;
          } else if (card.power.name === "Undo Chord") {
            setPlayerTaskString(card.power.effect(playerTaskString));
          } else {
            const updatedState = card.power.effect(playerState.value);
            newHand.push(
              ...updatedState.hand.filter(
                (c) => !newHand.some((existingCard) => existingCard.id === c.id)
              )
            );
            playerState.value = updatedState;
          }
        }

        newHand.splice(cardIndex, 1);
        playedCards.push(card);
      }
    });

    chordPlayed = "[" + chordPlayed + "]";
    setPlayerTaskString((prev) => prev + chordPlayed);
    newDiscardPile.push(...playedCards);

    playerState.value = {
      ...playerState.value,
      hand: newHand,
      discardPile: newDiscardPile,
    };

    drawNewCards();
    setSelectedCards(new Set());
  }

  function drawNewCards() {
    const { deck, hand, handNotes, handPowers } = playerState.value;
    let newHand = [...hand];
    let newDeck = [...deck];

    const drawNoteCards = handNotes - newHand.filter((c) => c.type === "note").length;
    for (let i = 0; i < drawNoteCards; i++) {
      if (newDeck.length === 0) break;
      const card = newDeck.find((c) => c.type === "note");
      if (card) {
        newHand.push(card);
        newDeck = newDeck.filter((c) => c.id !== card.id);
      }
    }

    const drawPowerCards = handPowers - newHand.filter((c) => c.type === "power").length;
    for (let i = 0; i < drawPowerCards; i++) {
      if (newDeck.length === 0) break;
      const card = newDeck.find((c) => c.type === "power");
      if (card) {
        newHand.push(card);
        newDeck = newDeck.filter((c) => c.id !== card.id);
      }
    }

    playerState.value = {
      ...playerState.value,
      hand: newHand,
      deck: newDeck,
    };
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="grid grid-cols-6 grid-rows-3 size-full relative">
        <Deck
          cards={playerState.value.deck}
          discardPile={playerState.value.discardPile}
          showModal={isDeckOpen}
          closeModal={() => setIsDeckOpen(false)}
        />

        <QuestPane />

        {taskFinished && (
          <button
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2/5 h-1/4 z-50 text-2xl "
            onClick={() =>
              (gameState.value = {
                ...gameState.value,
                currentLevel: gameState.value.currentLevel + 1,
                currentScene: "cutscene",
                currentCutscene: gameState.value.currentCutscene + 1,
              })
            }
          >
            GO TO NEXT LEVEL
          </button>
        )}

        <div className="flex justify-end gap-2 absolute top-4 right-4 z-10">
          <button onClick={() => (optionsState.value = { ...optionsState.value, isActive: true })}>
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

        <div className="flex row-span-2 col-span-6">
          <div className="w-1/3">
            <ChromaFlower />
          </div>

          <div className="flex w-2/3 gap-4 p-2 bg-slate-500  ">
            <div className="flex flex-col w-full gap-2">
              <div className="bg-slate-100  relative pb-16 rounded-xl ">
                <SheetMusic
                  id={levelInfo.title}
                  title={levelInfo.title}
                  notation={levelInfo.taskAbc}
                  isTask
                />
              </div>

              <div className="bg-slate-100 flex-1 relative pb-16 rounded-xl ">
                <SheetMusic
                  id="task"
                  title="Player's Music"
                  notation={playerTaskString + abcNoteString}
                />
              </div>
            </div>
          </div>
        </div>

        {/*CARD CONTAINER*/}
        <div className="bg-slate-600 row-span-1 col-span-6 flex ">
          <div className="w-[15%] flex flex-col justify-center items-center gap-4 ">
            <p className="text-white font-bold text-2xl text-center">
              Energy:
              <br /> {playerState.value.energy} / {playerState.value.maxEnergy}
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
                    <option value="do-re-mi">do-re-mi Notation</option>
                    {/* <option value="abc">ABC Notation</option> */}
                  </select>
                </div>
              </div>
            </div>
          </div>

          <SortableContext items={items.value} strategy={horizontalListSortingStrategy}>
            <ul className="w-[65%] h-full flex justify-center items-center p-4  gap-4 bg-slate-700">
              {items.value.map((card) => {
                if (card.type === "note") {
                  return (
                    <Card
                      key={card.id}
                      card={card}
                      isSelected={selectedCards.has(card.id)}
                      onSelect={() => handleCardSelection(card.id)}
                    />
                  );
                }

                if (card.type === "power") {
                  return (
                    <PowerCard
                      key={card.id}
                      card={card}
                      isSelected={selectedCards.has(card.id)}
                      onSelect={() => handleCardSelection(card.id)}
                    />
                  );
                }
              })}
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
              Deck:
              {playerState.value.deck.length}
            </button>
          </div>
        </div>
      </div>

      <DragOverlay>
        {activeId ? (
          items.value.find((item) => item.id === activeId).type === "note" ? (
            <Card card={items.value.find((item) => item.id === activeId)} idSuffix="-clone" />
          ) : (
            <PowerCard card={items.value.find((item) => item.id === activeId)} idSuffix="-clone" />
          )
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
