export const MessageTypes = {
  ASK: "ask",
  ANSWER: "answer",
  READY: "ready",
  CONNECT: "connected",
  SWITCH_TURN: "switch_turn",
};

export const MessagesEventTypes = {
  ON_ASK: "on_ask",
  ON_ANSWER: "on_answer",
  ON_READY: "on_ready",
  ON_CONNECT: "on_connect",
  ON_SWITCH_TURN: "on_switch_turn",
};

export const BoardEventTypes = {
  ON_UPDATE: "on_update",
  ON_SWITCH_TURN: "on_switch_turn",
};

export const BOARD_VALUES = {
  EMPTY: 0,
  SHIP: 1,
  MISS: 2,
  HIT: 3,
  AROUND_SHIP: 4,
};

export const BOARD_SIZE = 10;

export const HIT_SHIP_COUNT_FOR_WIN = 20;

export const BOARD_INDEX_LETTERS = [
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
];
