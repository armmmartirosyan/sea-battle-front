export type AskMessageModel = {
  i: number;
  j: number;
};

export type AnswerMessageModel = {
  i: number;
  j: number;
  boardValue: number;
};

export type Listener = {
  id: string;
  cb: Function;
};

export type ListenerInfo = {
  [key: string]: Listener[];
};

export type Board = number[][] | null;

export type SelfBoardProps = { ready: boolean };

export type EnemyBoardProps = { isYourTurn: boolean };

export type ColumnProps = {
  onClick: (i: number, j: number) => void;
  cell: number;
  i: number;
  j: number;
};

export type ShipCoord = { i: number; j: number };

export type ShipCoordsObject = { ships: ShipCoord[]; hitShips: ShipCoord[] };
