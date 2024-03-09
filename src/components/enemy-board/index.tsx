import React, { useEffect, useState } from "react";
import {
  BOARD_INDEX_LETTERS,
  BOARD_VALUES,
  BoardEventTypes,
} from "../../constants";
import { enemyBoardProvider } from "../../providers/enemy-board-provider";
import { gameProvider } from "../../providers/game-provider";
import { Board, EnemyBoardProps } from "../../types";
import { Cell } from "../column";

export const EnemyBoard = ({ isYourTurn }: EnemyBoardProps) => {
  const [board, setBoard] = useState<Board>(null);

  useEffect(() => {
    const onUpdateEnemyOff = enemyBoardProvider.eventEmitter.on(
      BoardEventTypes.ON_UPDATE,
      setBoard
    );

    enemyBoardProvider.init();

    return onUpdateEnemyOff;
  }, []);

  const onHit = (i: number, j: number) => {
    if (!isYourTurn || (board && board[i][j] !== BOARD_VALUES.EMPTY)) {
      return;
    }

    gameProvider.ask(i, j);
  };

  return (
    <div className="board_container">
      <h1>Enemy board</h1>
      <div className="board">
        {!!board && (
          <>
            <div className="board_index_letter_box">
              {BOARD_INDEX_LETTERS.map((letter, index) => (
                <p className="board_index_letter" key={index}>
                  {letter}
                </p>
              ))}
            </div>

            {board.map((row, i) => (
              <div key={i} className="row">
                <p className="row_index">{i + 1}</p>

                {row.map((cell, j) => (
                  <Cell key={j} cell={cell} i={i} j={j} onClick={onHit} />
                ))}
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
};
