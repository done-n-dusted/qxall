import { useState, useCallback, useRef } from 'react';
import { Chess } from 'chess.js';
import type { Square, Piece, Color } from 'chess.js';

/** Board position as an 8×8 array: position[rank][file], rank 0 = rank 8, rank 7 = rank 1 */
export type BoardPosition = (Piece | null)[][];

export interface BoardState {
  position: BoardPosition;
  selectedSquare: string | null;
  legalMoves: string[];
  lastMove: { from: string; to: string } | null;
  isCheck: boolean;
  isCheckmate: boolean;
  isStalemate: boolean;
  isDraw: boolean;
  turn: Color;
  moveHistory: string[];
  fen: string;
  selectSquare: (square: string) => void;
  reset: () => void;
}

/**
 * Maps chess.js board() output to our BoardPosition format.
 * chess.js board() returns rows from rank 8 (index 0) to rank 1 (index 7).
 */
function getPosition(game: Chess): BoardPosition {
  return game.board().map((row) =>
    row.map((cell) =>
      cell ? { color: cell.color, type: cell.type } : null,
    ),
  );
}

/**
 * Finds the square of the king for the given color.
 */
function findKingSquare(game: Chess, color: Color): string | null {
  const board = game.board();
  for (let rank = 0; rank < 8; rank++) {
    for (let file = 0; file < 8; file++) {
      const cell = board[rank][file];
      if (cell && cell.type === 'k' && cell.color === color) {
        return cell.square;
      }
    }
  }
  return null;
}

export function useBoardState(): BoardState & { checkSquare?: string } {
  const gameRef = useRef(new Chess());

  const [position, setPosition] = useState<BoardPosition>(() =>
    getPosition(gameRef.current),
  );
  const [selectedSquare, setSelectedSquare] = useState<string | null>(null);
  const [legalMoves, setLegalMoves] = useState<string[]>([]);
  const [lastMove, setLastMove] = useState<{
    from: string;
    to: string;
  } | null>(null);
  const [isCheck, setIsCheck] = useState(false);
  const [isCheckmate, setIsCheckmate] = useState(false);
  const [isStalemate, setIsStalemate] = useState(false);
  const [isDraw, setIsDraw] = useState(false);
  const [turn, setTurn] = useState<Color>('w');
  const [moveHistory, setMoveHistory] = useState<string[]>([]);
  const [fen, setFen] = useState(() => gameRef.current.fen());

  /** Sync all derived state from the game instance */
  const syncState = useCallback(() => {
    const game = gameRef.current;
    setPosition(getPosition(game));
    setIsCheck(game.isCheck());
    setIsCheckmate(game.isCheckmate());
    setIsStalemate(game.isStalemate());
    setIsDraw(game.isDraw());
    setTurn(game.turn());
    setMoveHistory(game.history());
    setFen(game.fen());
  }, []);

  const selectSquare = useCallback(
    (square: string) => {
      const game = gameRef.current;
      const piece = game.get(square as Square);

      // Nothing selected yet
      if (selectedSquare === null) {
        // Can only select own pieces
        if (piece && piece.color === game.turn()) {
          setSelectedSquare(square);
          const moves = game.moves({
            square: square as Square,
            verbose: true,
          });
          setLegalMoves(moves.map((m) => m.to));
        }
        return;
      }

      // Clicking the same square → deselect
      if (selectedSquare === square) {
        setSelectedSquare(null);
        setLegalMoves([]);
        return;
      }

      // Clicking another own piece → reselect
      if (piece && piece.color === game.turn()) {
        setSelectedSquare(square);
        const moves = game.moves({
          square: square as Square,
          verbose: true,
        });
        setLegalMoves(moves.map((m) => m.to));
        return;
      }

      // Attempt to move to the target square
      const targetMoves = game.moves({
        square: selectedSquare as Square,
        verbose: true,
      });
      const moveMatch = targetMoves.find((m) => m.to === square);

      if (moveMatch) {
        // Handle promotion: default to queen
        const moveArg: { from: string; to: string; promotion?: string } = {
          from: selectedSquare,
          to: square,
        };
        if (moveMatch.promotion) {
          moveArg.promotion = 'q';
        }

        try {
          game.move(moveArg);
          setLastMove({ from: selectedSquare, to: square });
          syncState();
        } catch {
          // Invalid move — shouldn't happen since we checked legal moves
        }
      }

      // Always clear selection after a move attempt
      setSelectedSquare(null);
      setLegalMoves([]);
    },
    [selectedSquare, syncState],
  );

  const reset = useCallback(() => {
    gameRef.current.reset();
    setSelectedSquare(null);
    setLegalMoves([]);
    setLastMove(null);
    syncState();
  }, [syncState]);

  // Compute king square for check indicator
  const checkSquare = isCheck ? findKingSquare(gameRef.current, turn) : null;

  return {
    position,
    selectedSquare,
    legalMoves,
    lastMove,
    isCheck,
    isCheckmate,
    isStalemate,
    isDraw,
    turn,
    moveHistory,
    fen,
    selectSquare,
    reset,
    // Expose check square for the component to highlight
    ...(checkSquare !== null ? { checkSquare } : {}),
  } as BoardState & { checkSquare?: string };
}
