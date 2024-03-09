import React from "react";
import { ColumnProps } from "../../types";
import { BOARD_VALUES } from "../../constants";
import { ShipIcon } from "../ship-icon";

export function Cell({ cell, i, j, onClick }: ColumnProps) {
  return (
    <div className="column" onClick={() => onClick(i, j)}>
      {cell === BOARD_VALUES.SHIP && <ShipIcon />}

      {cell === BOARD_VALUES.HIT && <ShipIcon className="hit" />}

      {cell === BOARD_VALUES.MISS && "·"}

      {cell === BOARD_VALUES.AROUND_SHIP && (
        <span className="around_ship">·</span>
      )}
    </div>
  );
}
