import { signal } from "@preact/signals-react";

const defaultGameState = {
  isMainMenu: true,
  isPlaying: false,
  isCutscene: false,

  currentScene: "mainMenu",
  currentLevel: 0,
};

const defaultOptionsState = {
  isActive: false,
  volume: 100,
  mute: "false",
  notation: "scientific",
  rootNote: "A",
};

const defaultPlayerState = {
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
export const optionsState = signal(defaultOptionsState);
