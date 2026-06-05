import { useEffect, useRef } from 'react';
import './MoveList.css';

interface MoveListProps {
  moves: string[];
  currentMoveIndex?: number;
  onMoveClick?: (moveIndex: number) => void;
  className?: string;
}

/**
 * Pairs moves into rows: each row has a move number, white move, and optional black move.
 */
function pairMoves(moves: string[]) {
  const rows: { moveNumber: number; white: string; black: string | null; whiteIndex: number; blackIndex: number | null }[] = [];
  for (let i = 0; i < moves.length; i += 2) {
    rows.push({
      moveNumber: Math.floor(i / 2) + 1,
      white: moves[i],
      black: i + 1 < moves.length ? moves[i + 1] : null,
      whiteIndex: i,
      blackIndex: i + 1 < moves.length ? i + 1 : null,
    });
  }
  return rows;
}

export function MoveList({
  moves,
  currentMoveIndex,
  onMoveClick,
  className = '',
}: MoveListProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef<HTMLSpanElement>(null);

  // Auto-scroll to the current/active move
  useEffect(() => {
    if (activeRef.current && containerRef.current) {
      activeRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      });
    }
  }, [currentMoveIndex]);

  const rows = pairMoves(moves);

  const classes = ['move-list', 'glass', className].filter(Boolean).join(' ');

  return (
    <div className={classes} ref={containerRef}>
      <div className="move-list__header">Moves</div>

      {moves.length === 0 ? (
        <div className="move-list__empty">No moves yet</div>
      ) : (
        <div className="move-list__rows">
          {rows.map((row) => (
            <div className="move-list__row" key={row.moveNumber}>
              <span className="move-list__move-number">{row.moveNumber}.</span>

              <span
                ref={currentMoveIndex === row.whiteIndex ? activeRef : undefined}
                className={[
                  'move-list__move',
                  currentMoveIndex === row.whiteIndex ? 'move-list__move--active' : '',
                ].filter(Boolean).join(' ')}
                onClick={() => onMoveClick?.(row.whiteIndex)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onMoveClick?.(row.whiteIndex);
                  }
                }}
              >
                {row.white}
              </span>

              {row.black !== null ? (
                <span
                  ref={currentMoveIndex === row.blackIndex ? activeRef : undefined}
                  className={[
                    'move-list__move',
                    currentMoveIndex === row.blackIndex ? 'move-list__move--active' : '',
                  ].filter(Boolean).join(' ')}
                  onClick={() => onMoveClick?.(row.blackIndex!)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      onMoveClick?.(row.blackIndex!);
                    }
                  }}
                >
                  {row.black}
                </span>
              ) : (
                <span className="move-list__move move-list__move--empty" />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
