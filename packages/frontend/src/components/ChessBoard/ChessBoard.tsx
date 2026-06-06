import React, { useState, useEffect, useRef } from 'react';
import { useBoardState } from './useBoardState';
import type { BoardState } from './useBoardState';
import './ChessBoard.css';
import { ChessPiece } from './ChessPieces';

/* ── File & Rank helpers ── */
const FILES = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'] as const;
const RANKS = ['8', '7', '6', '5', '4', '3', '2', '1'] as const;

/**
 * Determine if a square is light-colored.
 */
function isLightSquare(fileIndex: number, rankIndex: number): boolean {
  return (fileIndex + rankIndex) % 2 === 0;
}

interface ChessBoardProps {
  /** Optional external board state — if not provided, uses internal state */
  boardState?: BoardState & { checkSquare?: string };
}

export const ChessBoard = React.memo(function ChessBoard({ boardState: externalState }: ChessBoardProps) {
  const internalState = useBoardState();
  const state = (externalState ?? internalState) as BoardState & {
    checkSquare?: string;
  };

  const {
    position,
    selectedSquare,
    legalMoves,
    lastMove,
    selectSquare,
  } = state;

  // Derive check square from state
  const checkSquare = state.checkSquare ?? null;

  // Drag states
  const [activeDragSquare, setActiveDragSquare] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const dragInfoRef = useRef({
    activeDragSquare: null as string | null,
    startX: 0,
    startY: 0,
    hasMoved: false,
  });

  const wasDraggingRef = useRef(false);

  const handleStart = (square: string, piece: any, clientX: number, clientY: number) => {
    // Only allow dragging own pieces on player's turn
    if (!piece || piece.color !== state.turn) return;

    setActiveDragSquare(square);
    setDragOffset({ x: 0, y: 0 });

    dragInfoRef.current = {
      activeDragSquare: square,
      startX: clientX,
      startY: clientY,
      hasMoved: false,
    };
  };

  useEffect(() => {
    if (!activeDragSquare) return;

    const handleMove = (e: MouseEvent | TouchEvent) => {
      const fromSquare = dragInfoRef.current.activeDragSquare;
      if (!fromSquare) return;

      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

      const deltaX = clientX - dragInfoRef.current.startX;
      const deltaY = clientY - dragInfoRef.current.startY;

      // Select the piece on the first drag movement exceeding 5px
      if (Math.abs(deltaX) > 5 || Math.abs(deltaY) > 5) {
        if (!dragInfoRef.current.hasMoved) {
          dragInfoRef.current.hasMoved = true;
          selectSquare(fromSquare);
        }
      }

      // Prevent scrolling on mobile during active dragging
      if (e.cancelable) {
        e.preventDefault();
      }

      setDragOffset({ x: deltaX, y: deltaY });
    };

    const handleEnd = (e: MouseEvent | TouchEvent) => {
      const clientX = 'changedTouches' in e ? e.changedTouches[0].clientX : e.clientX;
      const clientY = 'changedTouches' in e ? e.changedTouches[0].clientY : e.clientY;

      const fromSquare = dragInfoRef.current.activeDragSquare;
      const hasMoved = dragInfoRef.current.hasMoved;

      setActiveDragSquare(null);
      setDragOffset({ x: 0, y: 0 });
      dragInfoRef.current = {
        activeDragSquare: null,
        startX: 0,
        startY: 0,
        hasMoved: false,
      };

      if (fromSquare && hasMoved) {
        wasDraggingRef.current = true;
        setTimeout(() => {
          wasDraggingRef.current = false;
        }, 50);

        const element = document.elementFromPoint(clientX, clientY);
        const squareEl = element?.closest('[data-square]');
        const targetSquare = squareEl?.getAttribute('data-square');

        if (targetSquare && targetSquare !== fromSquare) {
          selectSquare(targetSquare);
        }
      }
    };

    window.addEventListener('mousemove', handleMove, { passive: false });
    window.addEventListener('mouseup', handleEnd);
    window.addEventListener('touchmove', handleMove, { passive: false });
    window.addEventListener('touchend', handleEnd);

    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleEnd);
      window.removeEventListener('touchmove', handleMove);
      window.removeEventListener('touchend', handleEnd);
    };
  }, [activeDragSquare, selectSquare]);

  return (
    <div className="chess-board-wrapper">
      {/* Rank labels (left side) */}
      <div className="chess-board-rank-labels">
        {RANKS.map((rank) => (
          <div key={rank} className="chess-board-rank-label">
            {rank}
          </div>
        ))}
      </div>

      {/* Board */}
      <div className="chess-board">
        {RANKS.map((rank, rankIndex) =>
          FILES.map((file, fileIndex) => {
            const square = `${file}${rank}`;
            const piece = position[rankIndex][fileIndex];
            const isLight = isLightSquare(fileIndex, rankIndex);
            const isSelected = selectedSquare === square;
            const isLegalTarget = legalMoves.includes(square);
            const isActive =
              lastMove !== null &&
              (lastMove.from === square || lastMove.to === square);
            const isCheckSquare = checkSquare === square;
            const hasPiece = piece !== null;
            const isCaptureTarget = isLegalTarget && hasPiece;

            const isDraggingThisPiece = activeDragSquare === square;
            const dragStyle = isDraggingThisPiece
              ? {
                  transform: `translate(${dragOffset.x}px, ${dragOffset.y}px)`,
                  pointerEvents: 'none' as const,
                }
              : undefined;

            const isCheckmateSquare = state.isCheckmate && isCheckSquare;

            const classNames = [
              'chess-square',
              isLight ? 'chess-square--light' : 'chess-square--dark',
              isSelected && 'chess-square--selected',
              isActive && 'chess-square--active',
              isCheckSquare && !isCheckmateSquare && 'chess-square--check',
              isCheckmateSquare && 'chess-square--checkmate',
              hasPiece && 'chess-square--has-piece',
              isLegalTarget && 'chess-square--legal-target',
              isCaptureTarget && 'chess-square--capture-target',
            ]
              .filter(Boolean)
              .join(' ');

            return (
              <div
                key={square}
                className={classNames}
                data-file={file}
                data-rank={rank}
                data-square={square}
                onClick={() => {
                  if (!wasDraggingRef.current) {
                    selectSquare(square);
                  }
                }}
                onMouseDown={(e) => {
                  if (e.button !== 0) return;
                  handleStart(square, piece, e.clientX, e.clientY);
                }}
                onTouchStart={(e) => {
                  const touch = e.touches[0];
                  handleStart(square, piece, touch.clientX, touch.clientY);
                }}
              >
                {/* Legal move dot (only on empty target squares) */}
                {isLegalTarget && !hasPiece && (
                  <div className="chess-legal-dot" />
                )}

                {/* Piece */}
                {piece && (
                  <div
                    className={[
                      'chess-piece',
                      isDraggingThisPiece ? 'chess-piece--dragging' : '',
                    ]
                      .filter(Boolean)
                      .join(' ')}
                    style={dragStyle}
                  >
                    <ChessPiece piece={piece} />
                  </div>
                )}
              </div>
            );
          }),
        )}
      </div>

      {/* File labels (bottom) */}
      <div className="chess-board-file-labels">
        {FILES.map((file) => (
          <div key={file} className="chess-board-file-label">
            {file}
          </div>
        ))}
      </div>
    </div>
  );
});
