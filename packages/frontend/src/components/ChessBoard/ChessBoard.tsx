import { useBoardState } from './useBoardState';
import type { BoardState } from './useBoardState';
import './ChessBoard.css';
import { ChessPiece } from './ChessPieces';

/* ── File & Rank helpers ── */
const FILES = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'] as const;
const RANKS = ['8', '7', '6', '5', '4', '3', '2', '1'] as const;

/**
 * Determine if a square is light-colored.
 * a8 is light (fileIdx=0, rankIdx=0 → even → light).
 * a1 is dark  (fileIdx=0, rankIdx=7 → odd  → dark).
 */
function isLightSquare(fileIndex: number, rankIndex: number): boolean {
  return (fileIndex + rankIndex) % 2 === 0;
}


/* ── Component Props ── */
interface ChessBoardProps {
  /** Optional external board state — if not provided, uses internal state */
  boardState?: BoardState & { checkSquare?: string };
}

export function ChessBoard({ boardState: externalState }: ChessBoardProps) {
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

            // Build class list
            const classNames = [
              'chess-square',
              isLight ? 'chess-square--light' : 'chess-square--dark',
              isSelected && 'chess-square--selected',
              isActive && 'chess-square--active',
              isCheckSquare && 'chess-square--check',
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
                onClick={() => selectSquare(square)}
              >
                {/* Legal move dot (only on empty target squares) */}
                {isLegalTarget && !hasPiece && (
                  <div className="chess-legal-dot" />
                )}

                {/* Piece */}
                {piece && (
                  <div className="chess-piece">
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
}
