import { signal } from "@preact/signals-react";
import randomId from "../utils/randomId";

const defaultGameState = {
  currentScene: "main-menu",
  currentLevel: 0,
};

const defaultOptionsState = {
  isActive: false,
  volume: 100,
  mute: "false",
  notation: "scientific",
  rootNote: "A",
};

const noteCards = () => {
  const array = [];

  for (let i = 0; i < 12; i++) {
    array.push({
      unlocked: true,
      isPowerup: false,
      name: "Card",
      id: randomId(),
      value: i,
      description: "A card",
      image: "",
    });
  }

  return array;
};

const defaultPlayerState = {
  deck: noteCards(),
  hand: [],
  handSize: 5,
  discard: [],
  energy: 3,
  maxEnergy: 3,
  totalEnergySpent: 0,
};

export const gameState = signal(defaultGameState);
export const playerState = signal(defaultPlayerState);
export const optionsState = signal(defaultOptionsState);
