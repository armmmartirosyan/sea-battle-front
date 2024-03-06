import React, { useEffect } from "react";
import { BOARD_INDEX_LETTERS, BoardEventTypes } from "../../constants";
import { enemyBoardProvider } from "../../providers/enemy-board-provider";
import { gameProvider } from "../../providers/game-provider";
import { Board } from "../../types";
import "./enemy-board.scss";

export const EnemyBoard = () => {
  const [board, setBoard] = React.useState<Board>(null);

  useEffect(() => {
    const onUpdateEnemyOff = enemyBoardProvider.eventEmitter.on(
      BoardEventTypes.ON_UPDATE,
      setBoard
    );

    enemyBoardProvider.init();

    return onUpdateEnemyOff;
  }, []);

  const onClick = (i: number, j: number) => {
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
                  <div
                    key={j}
                    onClick={() => onClick(i, j)}
                    className="column"
                  />
                ))}
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
};
