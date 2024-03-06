import EventEmitter from "../helpers/event-emitter";
import { BOARD_SIZE, BOARD_VALUES, BoardEventTypes } from "../constants";
import { AnswerType } from "../constants";
import { Board } from "../types";

class EnemyBoardProvider {
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

  public setAnswer(answerType: string) {
    switch (answerType) {
      // TODO: Implement cases
      case AnswerType.MISS: {
        break;
      }
      case AnswerType.HIT: {
        break;
      }
      case AnswerType.KILL: {
        break;
      }
    }
    this.render();
  }

  private render() {
    this.eventEmitter.emit(BoardEventTypes.ON_UPDATE, this.board);
  }
}

export const enemyBoardProvider = new EnemyBoardProvider();
