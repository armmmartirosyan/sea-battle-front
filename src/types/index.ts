export type AskMessageModel = {
  userId: string;
  i: number;
  j: number;
};

export type AnswerMessageModel = {
  userId: string;
  answerType: string;
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
