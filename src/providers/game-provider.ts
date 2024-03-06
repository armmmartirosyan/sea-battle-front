import { selfBoardProvider } from "./self-board-provider";
import { enemyBoardProvider } from "./enemy-board-provider";
import { signalingProvider } from "./signaling-provider";
import { MessageTypes } from "../constants";
import { AnswerMessageModel, AskMessageModel } from "../types";

class GameProvider {
  constructor() {
    signalingProvider.eventEmitter.on(MessageTypes.ASK, this.onAsk);
    signalingProvider.eventEmitter.on(MessageTypes.ANSWER, this.onAnswer);
  }

  public init() {
    selfBoardProvider.init();
    enemyBoardProvider.init();
    signalingProvider.init();
  }

  public ask(i: number, j: number) {
    signalingProvider.sendMessage(MessageTypes.ASK, {
      userId: "user_1",
      i,
      j,
    });
  }

  private onAsk({ i, j }: AskMessageModel) {
    selfBoardProvider.checkAttack(i, j);
  }

  private onAnswer({ answerType }: AnswerMessageModel) {
    enemyBoardProvider.setAnswer(answerType);
  }
}

export const gameProvider = new GameProvider();
