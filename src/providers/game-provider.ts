import { selfBoardProvider } from "./self-board-provider";
import { enemyBoardProvider } from "./enemy-board-provider";
import { signalingProvider } from "./signaling-provider";
import { MessageTypes, MessagesEventTypes } from "../constants";
import { AnswerMessageModel, AskMessageModel } from "../types";

class GameProvider {
  constructor() {
    signalingProvider.eventEmitter.on(MessagesEventTypes.ON_ASK, this.onAsk);
    signalingProvider.eventEmitter.on(
      MessagesEventTypes.ON_ANSWER,
      this.onAnswer
    );
  }

  public init() {
    selfBoardProvider.init();
    enemyBoardProvider.init();
    signalingProvider.init();
  }

  public ask(i: number, j: number) {
    signalingProvider.sendMessage(MessageTypes.ASK, {
      i,
      j,
    });
  }

  public gameEnd(amIWin: boolean) {
    amIWin ? alert("You win!") : alert("You lose!");

    window.location.reload();
  }

  private onAsk = ({ i, j }: AskMessageModel) => {
    selfBoardProvider.checkAttack(i, j);
  };

  private onAnswer = (answer: AnswerMessageModel[]) => {
    enemyBoardProvider.setAnswer(answer);
  };
}

export const gameProvider = new GameProvider();
