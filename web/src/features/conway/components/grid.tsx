"use client";

import { MouseEvent, PointerEvent, useCallback, useEffect, useRef, useState } from "react";

import { Cell } from "#features/conway/components/cell";
import type { Board, BoardValue } from "#features/conway/models";

type DragMode = "set-alive" | "set-dead" | undefined;

type GridProps = {
  board: Board;
  boardSize: number;
  isPlaying: boolean;
  ariaLabel: string;
  onSetCell: (row: number, col: number, value: BoardValue) => void;
};

export const ConwayGrid = ({ board, boardSize, isPlaying, ariaLabel, onSetCell }: GridProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const dragModeRef = useRef<DragMode>(undefined);
  const boardRef = useRef(board);
  useEffect(() => {
    boardRef.current = board;
  }, [board]);
  const [rowHover, setRowHover] = useState(-1);
  const [colHover, setColHover] = useState(-1);

  const getCellCoordsFromMousePos = useCallback(
    (clientX: number, clientY: number): [number, number] | undefined => {
      const container = containerRef.current;
      if (!container) {
        return undefined;
      }
      const rect = container.getBoundingClientRect();
      const col = Math.floor(((clientX - rect.left) / rect.width) * boardSize);
      const row = Math.floor(((clientY - rect.top) / rect.height) * boardSize);
      if (
        Number.isNaN(row) ||
        Number.isNaN(col) ||
        row < 0 ||
        row >= boardSize ||
        col < 0 ||
        col >= boardSize
      ) {
        return undefined;
      }
      return [row, col];
    },
    [boardSize],
  );

  const getCellFromPointerEvent = useCallback(
    (evt: PointerEvent<HTMLDivElement>) => getCellCoordsFromMousePos(evt.clientX, evt.clientY),
    [getCellCoordsFromMousePos],
  );

  const handlePointerDown = useCallback(
    (evt: PointerEvent<HTMLDivElement>) => {
      if (isPlaying) {
        return;
      }
      evt.preventDefault();
      const coords = getCellFromPointerEvent(evt);
      if (!coords) {
        return;
      }
      const [row, col] = coords;
      const isAlive = boardRef.current[row]?.[col] === 1;
      const mode: DragMode = isAlive ? "set-dead" : "set-alive";
      dragModeRef.current = mode;
      onSetCell(row, col, isAlive ? 0 : 1);
      if (evt.currentTarget instanceof HTMLElement) {
        evt.currentTarget.setPointerCapture(evt.pointerId);
      }
    },
    [isPlaying, getCellFromPointerEvent, onSetCell],
  );

  const handlePointerMove = useCallback(
    (evt: PointerEvent<HTMLDivElement>) => {
      if (!dragModeRef.current || isPlaying) {
        return;
      }
      const coords = getCellFromPointerEvent(evt);
      if (!coords) {
        return;
      }
      const [row, col] = coords;
      const isAlive = boardRef.current[row]?.[col] === 1;
      if (dragModeRef.current === "set-alive" && !isAlive) {
        onSetCell(row, col, 1);
      } else if (dragModeRef.current === "set-dead" && isAlive) {
        onSetCell(row, col, 0);
      }
    },
    [isPlaying, getCellFromPointerEvent, onSetCell],
  );

  const handlePointerUp = useCallback(() => {
    dragModeRef.current = undefined;
  }, []);

  const handleMouseMove = useCallback(
    (evt: MouseEvent<HTMLDivElement>) => {
      if (isPlaying) {
        return;
      }
      const coords = getCellCoordsFromMousePos(evt.clientX, evt.clientY);
      if (!coords) {
        setRowHover(-1);
        setColHover(-1);
        return;
      }
      setRowHover(coords[0]);
      setColHover(coords[1]);
    },
    [isPlaying, getCellCoordsFromMousePos],
  );

  const handleMouseLeave = useCallback(() => {
    setRowHover(-1);
    setColHover(-1);
  }, []);

  return (
    <div
      ref={containerRef}
      role="region"
      aria-label={ariaLabel}
      className="touch-none overflow-hidden rounded-lg border border-default select-none"
      style={{
        aspectRatio: "1 / 1",
        cursor: isPlaying ? "not-allowed" : "crosshair",
        display: "grid",
        gridTemplateColumns: `repeat(${boardSize.toString()}, 1fr)`,
        width: "100%",
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onContextMenu={(evt) => {
        evt.preventDefault();
      }}
    >
      {board.map((row, ri) =>
        row.map((cell, ci) => (
          <Cell
            // the grid is automatically generated, so we
            // don't have anything else to use as key than the coordinates.
            // eslint-disable-next-line react/no-array-index-key
            key={`${ri.toString()}-${ci.toString()}`}
            alive={cell === 1}
            isHovered={!isPlaying && rowHover === ri && colHover === ci}
          />
        )),
      )}
    </div>
  );
};
