import React, { useEffect, useState } from "react";
import { selfBoardProvider } from "../../providers/self-board-provider";
import {
  BOARD_INDEX_LETTERS,
  BOARD_VALUES,
  BoardEventTypes,
} from "../../constants";
import { Board, SelfBoardProps } from "../../types";
import "./self-board.scss";

export const SelfBoard = ({ ready }: SelfBoardProps) => {
  const [board, setBoard] = useState<Board>(null);

  useEffect(() => {
    return selfBoardProvider.eventEmitter.on(
      BoardEventTypes.ON_UPDATE,
      onUpdate
    );
  }, []);

  const onUpdate = (newBoard: Board) => {
    if (!newBoard) return;

    setBoard([...newBoard]);
  };

  const onCellClick = (i: number, j: number) => {
    if (ready || !board || board[i][j] === BOARD_VALUES.SHIP) {
      return;
    }

    selfBoardProvider.setBoard(i, j);
  };

  return (
    <div className="board_container">
      <h1>Your board</h1>
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
                  <div
                    key={j}
                    className="column"
                    onClick={() => onCellClick(i, j)}
                  >
                    {cell}
                  </div>
                ))}
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
};
