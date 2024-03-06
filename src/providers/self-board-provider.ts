import EventEmitter from "../helpers/event-emitter";
import {
  BOARD_SIZE,
  BOARD_VALUES,
  BoardEventTypes,
  MessageTypes,
} from "../constants";
import { signalingProvider } from "./signaling-provider";
import { AnswerType } from "../constants";
import { Board } from "../types";

class SelfBoardProvider {
  private board: Board = null;
  public eventEmitter: EventEmitter = new EventEmitter();

  public init() {
    this.board = [];

    for (let i = 0; i < BOARD_SIZE; i++) {
      this.board[i] = [];

      for (let j = 0; j < BOARD_SIZE; j++) {
        this.board[i][j] = BOARD_VALUES.EMPTY;
      }
    }

    this.render();
  }

  public checkAttack(i: number, j: number) {
    if (!this.board) {
      return;
    }

    let answerType = AnswerType.MISS;

    switch (this.board[i][j]) {
      case BOARD_VALUES.EMPTY:
        answerType = AnswerType.MISS;
        break;
      case BOARD_VALUES.SHIP:
        answerType = AnswerType.HIT; // TODO: check is killed or hit
        break;
    }

    // TODO: rerender this position

    signalingProvider.sendMessage(MessageTypes.ANSWER, {
      userId: "user_1",
      answerType,
    });

    this.render();
  }

  public setBoard(i: number, j: number) {
    if (!this.board) return;

    this.board[i][j] = BOARD_VALUES.SHIP;
    this.render();
  }

  private render() {
    this.eventEmitter.emit(BoardEventTypes.ON_UPDATE, this.board);
  }
}

export const selfBoardProvider = new SelfBoardProvider();
