import React, { useEffect, useState } from "react";
import { gameProvider } from "../../providers/game-provider";
import { SelfBoard } from "../self-board";
import { EnemyBoard } from "../enemy-board";
import { signalingProvider } from "../../providers/signaling-provider";
import { MessageTypes, MessagesEventTypes } from "../../constants";
import "./index.scss";

export const Game = () => {
  const [youReady, setYouReady] = useState(false);
  const [enemyReady, setEnemyReady] = useState(false);
  const [isYourTurn, setIsYourTurn] = useState(false);

  useEffect(() => {
    const onReadyOff = signalingProvider.eventEmitter.on(
      MessagesEventTypes.ON_READY,
      onEnemyReady
    );

    const onConnectOff = signalingProvider.eventEmitter.on(
      MessagesEventTypes.ON_CONNECT,
      setIsYourTurn
    );

    const onSwitchTurn = signalingProvider.eventEmitter.on(
      MessagesEventTypes.ON_SWITCH_TURN,
      () => {
        setIsYourTurn((prev) => !prev);
      }
    );

    gameProvider.init();

    return () => {
      onSwitchTurn();
      onConnectOff();
      onReadyOff();
    };
  }, []);

  const onEnemyReady = () => setEnemyReady(true);

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

      {enemyReady ? (
        <EnemyBoard isYourTurn={isYourTurn} />
      ) : (
        <h2>The enemy is not ready yet.</h2>
      )}
    </div>
  );
};
