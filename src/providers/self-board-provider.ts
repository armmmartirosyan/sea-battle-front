import EventEmitter from "../helpers/event-emitter";
import {
  BOARD_SIZE,
  BOARD_VALUES,
  BoardEventTypes,
  HIT_SHIP_COUNT_FOR_WIN,
  MessageTypes,
} from "../constants";
import { signalingProvider } from "./signaling-provider";
import {
  AnswerMessageModel,
  Board,
  ShipCoord,
  ShipCoordsObject,
} from "../types";
import { gameProvider } from "./game-provider";

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
    if (!this.board) return;

    let answer: AnswerMessageModel[] = [];

    switch (this.board[i][j]) {
      case BOARD_VALUES.EMPTY:
        answer = [
          {
            i,
            j,
            boardValue: BOARD_VALUES.MISS,
          },
        ];

        this.board[i][j] = BOARD_VALUES.MISS;

        signalingProvider.sendMessage(MessageTypes.SWITCH_TURN, null);

        break;
      case BOARD_VALUES.SHIP:
        answer = this.getAnswer(i, j);

        answer.forEach(({ i, j, boardValue }: AnswerMessageModel) => {
          this.board![i][j] = boardValue;
        });
        break;
    }

    signalingProvider.sendMessage(MessageTypes.ANSWER, answer);

    this.render();
  }

  private getAnswer(i: number, j: number): AnswerMessageModel[] {
    const shipCoords = this.getShipCoords(i, j);
    const shipLength = shipCoords.hitShips.length + shipCoords.ships.length;

    if (shipLength === 1 || shipCoords.ships.length === 1) {
      const allShipCoords = shipCoords.ships.concat(shipCoords.hitShips);

      const newBoardCoordValues = allShipCoords.map((coord) => ({
        i: coord.i,
        j: coord.j,
        boardValue: BOARD_VALUES.HIT,
      }));

      const neighborsCoordValues =
        this.getNeighborsCoordsAndValues(newBoardCoordValues);

      return [...newBoardCoordValues, ...neighborsCoordValues];
    }

    return [
      {
        i,
        j,
        boardValue: BOARD_VALUES.HIT,
      },
    ];
  }

  private getNeighborsCoordsAndValues(
    newBoardCoordValues: AnswerMessageModel[]
  ): AnswerMessageModel[] {
    const neighborsCoordValues: AnswerMessageModel[] = [];

    newBoardCoordValues.forEach(({ i, j }) => {
      // get top neighbor
      if (i > 0 && this.board![i - 1][j] === BOARD_VALUES.EMPTY) {
        neighborsCoordValues.push({
          i: i - 1,
          j,
          boardValue: BOARD_VALUES.AROUND_SHIP,
        });
      }

      // get bottom neighbor
      if (i < BOARD_SIZE - 1 && this.board![i + 1][j] === BOARD_VALUES.EMPTY) {
        neighborsCoordValues.push({
          i: i + 1,
          j,
          boardValue: BOARD_VALUES.AROUND_SHIP,
        });
      }

      // get left neighbor
      if (j > 0 && this.board![i][j - 1] === BOARD_VALUES.EMPTY) {
        neighborsCoordValues.push({
          i,
          j: j - 1,
          boardValue: BOARD_VALUES.AROUND_SHIP,
        });
      }

      // get right neighbor
      if (j < BOARD_SIZE - 1 && this.board![i][j + 1] === BOARD_VALUES.EMPTY) {
        neighborsCoordValues.push({
          i,
          j: j + 1,
          boardValue: BOARD_VALUES.AROUND_SHIP,
        });
      }

      // get top left neighbor
      if (i > 0 && j > 0 && this.board![i - 1][j - 1] === BOARD_VALUES.EMPTY) {
        neighborsCoordValues.push({
          i: i - 1,
          j: j - 1,
          boardValue: BOARD_VALUES.AROUND_SHIP,
        });
      }

      // get bottom left neighbor
      if (
        i < BOARD_SIZE - 1 &&
        j > 0 &&
        this.board![i + 1][j - 1] === BOARD_VALUES.EMPTY
      ) {
        neighborsCoordValues.push({
          i: i + 1,
          j: j - 1,
          boardValue: BOARD_VALUES.AROUND_SHIP,
        });
      }

      // get top right neighbor
      if (
        i > 0 &&
        j < BOARD_SIZE - 1 &&
        this.board![i - 1][j + 1] === BOARD_VALUES.EMPTY
      ) {
        neighborsCoordValues.push({
          i: i - 1,
          j: j + 1,
          boardValue: BOARD_VALUES.AROUND_SHIP,
        });
      }

      // get bottom right neighbor
      if (
        i < BOARD_SIZE - 1 &&
        j < BOARD_SIZE - 1 &&
        this.board![i + 1][j + 1] === BOARD_VALUES.EMPTY
      ) {
        neighborsCoordValues.push({
          i: i + 1,
          j: j + 1,
          boardValue: BOARD_VALUES.AROUND_SHIP,
        });
      }
    });

    return neighborsCoordValues;
  }

  private getShipCoords(i: number, j: number): ShipCoordsObject {
    let shipCoords = {
      ships: [{ i, j }],
      hitShips: [] as ShipCoord[],
    };

    if (
      i > 0 &&
      (this.board![i - 1][j] === BOARD_VALUES.SHIP ||
        this.board![i - 1][j] === BOARD_VALUES.HIT)
    ) {
      shipCoords = this.getShipCoordsFromTop(i - 1, j, shipCoords);
    }

    if (
      i < BOARD_SIZE - 1 &&
      (this.board![i + 1][j] === BOARD_VALUES.SHIP ||
        this.board![i + 1][j] === BOARD_VALUES.HIT)
    ) {
      shipCoords = this.getShipCoordsFromBottom(i + 1, j, shipCoords);
    }

    if (
      j > 0 &&
      (this.board![i][j - 1] === BOARD_VALUES.SHIP ||
        this.board![i][j - 1] === BOARD_VALUES.HIT)
    ) {
      shipCoords = this.getShipCoordsFromLeft(i, j - 1, shipCoords);
    }

    if (
      j < BOARD_SIZE - 1 &&
      (this.board![i][j + 1] === BOARD_VALUES.SHIP ||
        this.board![i][j + 1] === BOARD_VALUES.HIT)
    ) {
      shipCoords = this.getShipCoordsFromRight(i, j + 1, shipCoords);
    }

    return shipCoords;
  }

  private getShipCoordsFromTop(
    i: number,
    j: number,
    shipCoords: ShipCoordsObject
  ): ShipCoordsObject {
    if (this.board![i][j] === BOARD_VALUES.SHIP) {
      shipCoords.ships.push({ i, j });
    } else if (this.board![i][j] === BOARD_VALUES.HIT) {
      shipCoords.hitShips.push({ i, j });
    }

    if (
      i - 1 >= 0 &&
      (this.board![i - 1][j] === BOARD_VALUES.SHIP ||
        this.board![i - 1][j] === BOARD_VALUES.HIT)
    ) {
      return this.getShipCoordsFromTop(i - 1, j, shipCoords);
    }

    return shipCoords;
  }

  private getShipCoordsFromBottom(
    i: number,
    j: number,
    shipCoords: ShipCoordsObject
  ): ShipCoordsObject {
    if (this.board![i][j] === BOARD_VALUES.SHIP) {
      shipCoords.ships.push({ i, j });
    } else if (this.board![i][j] === BOARD_VALUES.HIT) {
      shipCoords.hitShips.push({ i, j });
    }

    if (
      i < BOARD_SIZE - 1 &&
      (this.board![i + 1][j] === BOARD_VALUES.SHIP ||
        this.board![i + 1][j] === BOARD_VALUES.HIT)
    ) {
      return this.getShipCoordsFromBottom(i + 1, j, shipCoords);
    }

    return shipCoords;
  }

  private getShipCoordsFromLeft(
    i: number,
    j: number,
    shipCoords: ShipCoordsObject
  ): ShipCoordsObject {
    if (this.board![i][j] === BOARD_VALUES.SHIP) {
      shipCoords.ships.push({ i, j });
    } else if (this.board![i][j] === BOARD_VALUES.HIT) {
      shipCoords.hitShips.push({ i, j });
    }

    if (
      j - 1 >= 0 &&
      (this.board![i][j - 1] === BOARD_VALUES.SHIP ||
        this.board![i][j - 1] === BOARD_VALUES.HIT)
    ) {
      return this.getShipCoordsFromLeft(i, j - 1, shipCoords);
    }

    return shipCoords;
  }

  private getShipCoordsFromRight(
    i: number,
    j: number,
    shipCoords: ShipCoordsObject
  ): ShipCoordsObject {
    if (this.board![i][j] === BOARD_VALUES.SHIP) {
      shipCoords.ships.push({ i, j });
    } else if (this.board![i][j] === BOARD_VALUES.HIT) {
      shipCoords.hitShips.push({ i, j });
    }

    if (
      j < BOARD_SIZE - 1 &&
      (this.board![i][j + 1] === BOARD_VALUES.SHIP ||
        this.board![i][j + 1] === BOARD_VALUES.HIT)
    ) {
      return this.getShipCoordsFromRight(i, j + 1, shipCoords);
    }

    return shipCoords;
  }

  public setBoard(i: number, j: number) {
    if (!this.board) return;

    this.board[i][j] = BOARD_VALUES.SHIP;
    this.render();
  }

  private render() {
    if (!this.board) return;

    this.eventEmitter.emit(BoardEventTypes.ON_UPDATE, [...this.board]);

    this.checkForLose();
  }

  private checkForLose() {
    if (!this.board) return;

    let hitShipCount = 0;

    this.board.forEach((_, i) => {
      this.board![i].forEach((cell) => {
        if (cell === BOARD_VALUES.HIT) hitShipCount++;
      });
    });

    if (hitShipCount === HIT_SHIP_COUNT_FOR_WIN) {
      gameProvider.gameEnd(false);
    }
  }
}

export const selfBoardProvider = new SelfBoardProvider();
