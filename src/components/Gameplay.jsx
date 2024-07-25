import React, { useEffect, useState } from "react";
import { computed } from "@preact/signals-react";
import {
  closestCenter,
  DndContext,
  DragOverlay,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  horizontalListSortingStrategy,
  SortableContext,
} from "@dnd-kit/sortable";
import { CustomPointerSensor } from "../utils/CustomPointerSensor";

import CardNew from "./CardNew";
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
import EnergyBar from "./EnergyBar";

export default function Gameplay() {
  const sensors = useSensors(
    useSensor(CustomPointerSensor, {
      activationConstraint: {
        delay: 200,
        distance: 20,
        tolerance: 5,
      },
    }),
  );

  const { activeNotes } = usePiano();
  const activeNoteNames = activeNotes.map((note) => Note.fromMidiSharps(note));
  const abcNoteString = `${activeNotes.length > 0 ? "!mark!" : ""}[${activeNoteNames
    .map((note) => AbcNotation.scientificToAbcNotation(note))
    .join("")}]`;

  const items = computed(() => playerState.value.hand);
  const [selectedCards, setSelectedCards] = useState([]);

  const [activeId, setActiveId] = useState(null);
  const [isDeckOpen, setIsDeckOpen] = useState(false);

  const levelInfo = levels.value[gameState.value.currentLevel];
  const [playerTaskArray, setPlayerTaskArray] = useState([]);
  const [playerTurnArray, setPlayerTurnArray] = useState([]);

  const [taskFinished, setTaskFinished] = useState(false);
  const [playerAbc, setPlayerAbc] = useState("");

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
        items.value.findIndex((item) => item.id === over.id),
      );
    }

    setActiveId(null);
  }

  function handleCardSelection(cardId) {
    setSelectedCards((prev) => {
      const selectedCard = items.value.find((card) => card.id === cardId);

      if (prev.includes(cardId)) {
        return prev.filter((id) => id !== cardId);
      } else {
        const otherTypeSelected = prev.some(
          (id) =>
            items.value.find((card) => card.id === id)?.type !==
            selectedCard.type,
        );

        if (otherTypeSelected) {
          return [cardId];
        } else {
          return [...prev, cardId];
        }
      }
    });
  }

  function resetNoteCard(card) {
    if (card.type === "note") {
      return { ...card, note: "", octave: "", color: "" };
    }
    return card;
  }

  function handleTurn(playOrDiscard) {
    const newHand = [...playerState.value.hand];
    const playedCards = [];
    const playedNotes = [];
    const newDiscardPile = [...playerState.value.discardPile];
    const newDeck = [...playerState.value.deck];
    const newBurnedCards = [...playerState.value.burnedCards];

    let lastChord = "";
    let energyGain = 0;

    const energyCost = selectedCards.reduce((totalCost, cardId) => {
      const card = newHand.find((c) => c.id === cardId);

      if (playOrDiscard === "play") {
        return totalCost + (card.type === "note" ? card.cost : card.power.cost);
      } else {
        return 0;
      }
    }, 0);

    if (
      selectedCards.some((cardId) => {
        const card = newHand.find((c) => c.id === cardId);
        return card.type === "note" && !card.note;
      })
    ) {
      setSelectedCards([]);
      return;
    }

    if (energyCost > playerState.value.energy && playOrDiscard === "play") {
      setSelectedCards([]);
      return;
    }

    selectedCards.forEach((cardId, index) => {
      const cardIndex = newHand.findIndex((card) => card.id === cardId);
      if (cardIndex !== -1) {
        const card = newHand[cardIndex];
        newHand.splice(cardIndex, 1);

        if (playOrDiscard === "play") {
          if (card.type === "note") {
            const resetCard = resetNoteCard(card);
            playedCards.push(resetCard);
            playedNotes.push(card.note + card.octave);

            setPlayerTaskArray((prev) => [...prev, card.note + card.octave]);

            if (index === selectedCards.length - 1) {
              setPlayerTurnArray((prev) => [...prev, playedNotes]);
            }
          } else if (card.type === "power") {
            if (card.power.name === "Undo Chord") {
              const lastChord = playerTurnArray[playerTurnArray.length - 1];
              energyGain += lastChord.length;
              setPlayerTaskArray((prev) => prev.slice(0, -lastChord.length));
              setPlayerTurnArray((prev) => prev.slice(0, -1));
            } else {
              const updatedState = card.power.effect(playerState.value);
              newHand.push(
                ...updatedState.hand.filter(
                  (c) =>
                    !newHand.some((existingCard) => existingCard.id === c.id),
                ),
              );
              playerState.value = updatedState;
            }

            if (card.power.oneTime) {
              newBurnedCards.push(card);
            } else {
              playedCards.push(card);
            }
          }
        } else {
          if (card.type === "note") {
            const resetCard = resetNoteCard(card);
            newDiscardPile.push(resetCard);
          } else {
            newDiscardPile.push(card);
          }
        }
      }
    });

    lastChord = playedNotes.join("");

    if (lastChord) {
      const taskCheck = levelInfo.taskCheck.join("");
      if (taskCheck.includes(lastChord)) {
        energyGain += 1;
      }
    }

    playerState.value = {
      ...playerState.value,
      hand: [
        ...newHand.filter((card) => card.type === "note"),
        ...newHand.filter((card) => card.type === "power"),
      ],
      discardPile: [...newDiscardPile, ...playedCards],
      deck: newDeck,
      burnedCards: newBurnedCards,
      energy: playerState.value.energy - energyCost + energyGain,
    };

    setSelectedCards([]);
    drawNewCards();
  }

  function drawNewCards() {
    const { deck, hand, handNotes, handPowers } = playerState.value;
    let newHand = [...hand];
    let newDeck = [...deck];

    const drawNoteCards =
      handNotes - newHand.filter((c) => c.type === "note").length;
    for (let i = 0; i < drawNoteCards; i++) {
      if (newDeck.length === 0) break;
      const card = newDeck.find((c) => c.type === "note");
      if (card) {
        newHand.push(card);
        newDeck = newDeck.filter((c) => c.id !== card.id);
      }
    }

    const drawPowerCards =
      handPowers - newHand.filter((c) => c.type === "power").length;
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
      hand: [
        ...newHand.filter((card) => card.type === "note"),
        ...newHand.filter((card) => card.type === "power"),
      ],
      deck: newDeck,
    };
  }

  useEffect(() => {
    const newDeck = [
      ...playerState.value.hand,
      ...playerState.value.discardPile,
      ...playerState.value.deck,
    ].filter(
      (card) =>
        !playerState.value.burnedCards.some(
          (burnedCard) => burnedCard.id === card.id,
        ),
    );

    playerState.value = {
      ...playerState.value,
      hand: [],
      energy: playerState.value.maxEnergy,
      maxEnergy: playerState.value.maxEnergy,
      discardPile: [],
      deck: newDeck,
    };
    drawNewCards();
  }, []);

  useEffect(() => {
    if (playerTaskArray.join("") === levelInfo.taskCheck.join("")) {
      setTaskFinished(true);
    }

    const abcNotation = playerTurnArray
      .map(
        (turn) =>
          `[${turn.map((note) => AbcNotation.scientificToAbcNotation(note)).join("")}]`,
      )
      .join("");

    setPlayerAbc(abcNotation);
  }, [playerTaskArray, playerTurnArray]);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="relative grid size-full grid-cols-6 grid-rows-3">
        <Deck
          cards={playerState.value.deck}
          discardPile={playerState.value.discardPile}
          showModal={isDeckOpen}
          closeModal={() => setIsDeckOpen(false)}
        />

        <QuestPane />

        {taskFinished && (
          <button
            className="absolute left-1/2 top-1/2 z-50 h-1/4 w-2/5 -translate-x-1/2 -translate-y-1/2 transform text-2xl"
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

        <div className="absolute right-4 top-4 z-10 flex justify-end gap-2">
          <button
            onClick={() =>
              (optionsState.value = { ...optionsState.value, isActive: true })
            }
          >
            Options
          </button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => {
              gameState.value = {
                ...gameState.value,
                currentScene: "main-menu",
              };
            }}
          >
            Main Menu
          </motion.button>
        </div>

        <div className="col-span-6 row-span-2 flex">
          <div className="w-1/3">
            <ChromaFlower />
          </div>

          <div className="flex w-2/3 gap-4 bg-slate-500 p-2">
            <div className="flex w-full flex-col gap-2">
              <div className="relative rounded-xl bg-slate-100 pb-16">
                <SheetMusic
                  id={levelInfo.title}
                  title={levelInfo.title}
                  notation={levelInfo.taskAbc}
                  isTask
                />
              </div>

              <div className="relative flex-1 rounded-xl bg-slate-100">
                <SheetMusic
                  id="task"
                  title="Player's Music"
                  notation={playerAbc + abcNoteString}
                />
              </div>
            </div>
            {/* <div className="grid grid-cols-2 size-full">
              <ChromaCircle notesArray={levelInfo.taskCheck} />

              <ChromaCircle />
            </div> */}
          </div>
        </div>

        {/*CARD CONTAINER*/}
        <div className="col-span-6 row-span-1 flex bg-slate-600">
          <div
            className={`"} flex w-[15%] flex-col items-center justify-center gap-4`}
          >
            <EnergyBar />

            <div className="flex w-full flex-col gap-4 bg-slate-400 p-4">
              <div className="flex flex-col justify-around gap-4">
                <div className="flex items-center justify-between">
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

                <div className="flex items-center justify-between">
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

          <SortableContext
            items={items.value}
            strategy={horizontalListSortingStrategy}
          >
            <ul
              className={`flex h-full w-[65%] justify-center gap-4 bg-slate-700 p-4`}
            >
              {items.value.map((card) => {
                if (card.type === "note") {
                  return (
                    <CardNew
                      key={card.id}
                      card={card}
                      isSelected={selectedCards.includes(card.id)}
                      onSelect={() => handleCardSelection(card.id)}
                      selectedIndex={selectedCards.indexOf(card.id)}
                    />
                  );
                }

                if (card.type === "power") {
                  return (
                    <PowerCard
                      key={card.id}
                      card={card}
                      isSelected={selectedCards.includes(card.id)}
                      onSelect={() => handleCardSelection(card.id)}
                    />
                  );
                }
              })}
            </ul>
          </SortableContext>

          <div className="grid w-[20%] grid-flow-col grid-cols-2 grid-rows-2 place-items-center gap-4 px-4 py-8">
            <button
              className="size-4/5"
              onClick={() => handleTurn("play")}
              disabled={selectedCards.length === 0}
            >
              Play
            </button>
            <button
              className="size-4/5"
              onClick={() => handleTurn("discard")}
              disabled={selectedCards.length === 0}
            >
              Discard
            </button>
            <button
              className="row-span-2 size-full self-center"
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
            <CardNew
              card={items.value.find((item) => item.id === activeId)}
              idSuffix="-clone"
            />
          ) : (
            <PowerCard
              card={items.value.find((item) => item.id === activeId)}
              idSuffix="-clone"
            />
          )
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
