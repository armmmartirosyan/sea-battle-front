import EventEmitter from "../helpers/event-emitter";
import {
  BOARD_SIZE,
  BOARD_VALUES,
  BoardEventTypes,
  HIT_SHIP_COUNT_FOR_WIN,
} from "../constants";
import { AnswerMessageModel, Board } from "../types";
import { gameProvider } from "./game-provider";

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

  public setAnswer(answer: AnswerMessageModel[]) {
    if (!this.board) return;

    answer.forEach(({ i, j, boardValue }: AnswerMessageModel) => {
      this.board![i][j] = boardValue;
    });

    this.render();
  }

  private render() {
    if (!this.board) return;

    this.eventEmitter.emit(BoardEventTypes.ON_UPDATE, [...this.board]);

    this.checkForWin();
  }

  private checkForWin() {
    if (!this.board) return;

    let hitShipCount = 0;

    this.board.forEach((_, i) => {
      this.board![i].forEach((cell) => {
        if (cell === BOARD_VALUES.HIT) hitShipCount++;
      });
    });

    if (hitShipCount === HIT_SHIP_COUNT_FOR_WIN) {
      gameProvider.gameEnd(true);
    }
  }
}

export const enemyBoardProvider = new EnemyBoardProvider();
