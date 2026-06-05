import { ChessBoard, useBoardState, MoveList, Button, GlassCard } from '../../components';
import './PlayPage.css';

function getStatusText(boardState: ReturnType<typeof useBoardState>): string {
  if (boardState.isCheckmate) return 'Checkmate!';
  if (boardState.isStalemate) return 'Stalemate';
  if (boardState.isDraw) return 'Draw';
  return boardState.turn === 'w' ? 'White to move' : 'Black to move';
}

export function PlayPage() {
  const boardState = useBoardState();
  const statusText = getStatusText(boardState);
  const isGameOver = boardState.isCheckmate || boardState.isStalemate || boardState.isDraw;

  return (
    <div className="play-page">
      <div className="play-page__grid">
        {/* Board */}
        <div className="play-page__board">
          <ChessBoard boardState={boardState} />
        </div>

        {/* Side Panel */}
        <div className="play-page__panel">
          <GlassCard padding="lg" className="play-page__panel-inner">
            {/* Status */}
            <div className="play-page__status">
              <span
                className={[
                  'play-page__turn-indicator',
                  boardState.turn === 'w'
                    ? 'play-page__turn-indicator--white'
                    : 'play-page__turn-indicator--black',
                ].join(' ')}
              />
              <span className="play-page__status-text">{statusText}</span>
            </div>

            {/* Move list */}
            <div className="play-page__moves">
              <MoveList
                moves={boardState.moveHistory}
                currentMoveIndex={
                  boardState.moveHistory.length > 0
                    ? boardState.moveHistory.length - 1
                    : undefined
                }
              />
            </div>

            {/* New Game button */}
            <div className="play-page__new-game">
              <Button
                variant="secondary"
                onClick={() => boardState.reset()}
              >
                {isGameOver ? 'Play Again' : 'New Game'}
              </Button>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
