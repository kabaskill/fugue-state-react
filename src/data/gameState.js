import { signal } from "@preact/signals-react";

export const defaultGameState = {
  isMainMenu: true,
  isPlaying: false,
  isCutscene: false,
  options: {
    volume: 1,
    mute: false,
  },
  currentScene: "mainMenu",
  currentLevel: 0,
};

export const defaultPlayerState = {
  deck: [],
  hand: [],
  discard: [],
  drawPile: [],
  discardPile: [],
  energy: 3,
  totalEnergySpent: 0,
  handSize: 5,
  maxHandSize: 5,
  maxDeckSize: 30,
  maxDiscardSize: 30,
  maxDrawPileSize: 30,
  maxDiscardPileSize: 30,
};

export const gameState = signal(defaultGameState);
export const playerState = signal(defaultPlayerState);
