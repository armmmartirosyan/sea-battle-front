import React, { useEffect, useState } from "react";
import { gameProvider } from "../../providers/game-provider";
import { SelfBoard } from "../self-board";
import { EnemyBoard } from "../enemy-board";
import { signalingProvider } from "../../providers/signaling-provider";
import { MessageTypes, MessagesEventTypes } from "../../constants";
import "./game.scss";

export const Game = () => {
  const [youReady, setYouReady] = useState(false);
  const [enemyReady, setEnemyReady] = useState(false);

  useEffect(() => {
    gameProvider.init();

    const onReadyOff = signalingProvider.eventEmitter.on(
      MessagesEventTypes.ON_READY,
      onEnemyReady
    );

    return onReadyOff;
  }, []);

  const onEnemyReady = () => {
    setEnemyReady(true);
  };

  const handleYouReady = () => {
    signalingProvider.sendMessage(MessageTypes.READY, null);
    setYouReady(true);
  };

  return (
    <div className="game_container">
      <div className="game_info_box">
        {(!youReady || !enemyReady) && (
          <p>
            The game will be started after You and your enemy will be ready.
          </p>
        )}

        {!youReady && <button onClick={handleYouReady}>You ready</button>}
      </div>

      <SelfBoard ready={youReady} />
      {enemyReady ? <EnemyBoard /> : <h2>The enemy is not ready yet.</h2>}
    </div>
  );

  const ship = {
    cordinates: [
      { i: 1, j: 1 },
      { i: 1, j: 2 },
    ],
  };
};
