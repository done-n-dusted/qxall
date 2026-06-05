import { useState } from 'react';
import { ChessBoard, useBoardState, MoveList, Button, GlassCard, Chip } from '../../components';
import './PlayPage.css';

function getStatusText(
  boardState: ReturnType<typeof useBoardState>,
  isResigned: boolean,
  isDrawAgreed: boolean
): string {
  if (isResigned) {
    return `Resigned - ${boardState.turn === 'w' ? 'Black' : 'White'} wins!`;
  }
  if (isDrawAgreed) {
    return 'Draw by agreement';
  }
  if (boardState.isCheckmate) return 'Checkmate!';
  if (boardState.isStalemate) return 'Stalemate';
  if (boardState.isDraw) return 'Draw';
  return boardState.turn === 'w' ? 'White to move' : 'Black to move';
}

const RECENT_GAMES = [
  {
    id: 1,
    opponent: 'Magnus',
    result: 'Win' as const,
    opening: 'Sicilian Defense: Najdorf',
    date: '2026-06-04',
  },
  {
    id: 2,
    opponent: 'Hikaru',
    result: 'Loss' as const,
    opening: "Queen's Gambit Declined",
    date: '2026-06-03',
  },
  {
    id: 3,
    opponent: 'Ding',
    result: 'Draw' as const,
    opening: 'Ruy Lopez: Berlin Defense',
    date: '2026-06-01',
  },
];

export function PlayPage() {
  const boardState = useBoardState();
  const [isResigned, setIsResigned] = useState(false);
  const [isDrawAgreed, setIsDrawAgreed] = useState(false);

  const isGameOver = boardState.isCheckmate || boardState.isStalemate || boardState.isDraw || isResigned || isDrawAgreed;
  const statusText = getStatusText(boardState, isResigned, isDrawAgreed);

  const [showHistory, setShowHistory] = useState(false);
  const [prevHistoryLength, setPrevHistoryLength] = useState(boardState.moveHistory.length);

  if (boardState.moveHistory.length !== prevHistoryLength) {
    setPrevHistoryLength(boardState.moveHistory.length);
    if (boardState.moveHistory.length > 0) {
      setShowHistory(false);
    }
  }

  const isGameActive = boardState.moveHistory.length > 0;
  const shouldShowHistory = !isGameActive || showHistory;
  const shouldShowMoves = isGameActive && !showHistory;

  const handleNewGame = () => {
    boardState.reset();
    setShowHistory(false);
    setIsResigned(false);
    setIsDrawAgreed(false);
  };

  const handleSelectSquare = (square: string) => {
    if (isGameOver) return;
    boardState.selectSquare(square);
  };


  return (
    <div className="play-page">
      <div className="play-page__grid">
        {/* Board (Always on the Left) */}
        <div className="play-page__board">
          <ChessBoard boardState={{ ...boardState, selectSquare: handleSelectSquare }} />
        </div>

        {/* Side Panel / Launcher (Always on the Right) */}
        <div className="play-page__panel">
          <GlassCard padding="lg" className="play-page__panel-inner">
            
            {/* Zen Heading & Status */}
            <div className="play-page__header">
              <h2 className="play-page__title">Master Every Opening</h2>
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
            </div>

            {/* Scrollable Panel Content (to keep viewport locked) */}
            <div className={[
              'play-page__content-scrollable',
              shouldShowHistory ? 'play-page__content-scrollable--scrollable' : ''
            ].filter(Boolean).join(' ')}>
              {/* Move List */}
              <div className="play-page__section">
                <div className={[
                  'play-page__moves-wrapper',
                  shouldShowMoves ? 'play-page__moves-wrapper--expanded' : 'play-page__moves-wrapper--collapsed'
                ].join(' ')}>
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
                </div>
              </div>

              {/* Recent Games */}
              <div className={[
                'play-page__section',
                'play-page__history-wrapper',
                shouldShowHistory ? 'play-page__history-wrapper--expanded' : 'play-page__history-wrapper--collapsed'
              ].join(' ')}>
                <h3 className="play-page__section-title">Recent Games</h3>
                <div className="play-page__recent-list">
                  {RECENT_GAMES.map((game) => (
                    <GlassCard key={game.id} padding="sm" className="play-page__game-card">
                      <div className="play-page__game-info">
                        <div className="play-page__game-row">
                          <span className="play-page__game-opponent">{game.opponent}</span>
                          <Chip>{game.result}</Chip>
                        </div>
                        <span className="play-page__game-opening">{game.opening}</span>
                        <span className="play-page__game-date">{game.date}</span>
                      </div>
                    </GlassCard>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick-Start Actions */}
            <div className="play-page__actions">
              {isGameActive && !isGameOver ? (
                <>
                  <Button variant="secondary" onClick={() => setIsDrawAgreed(true)}>
                    Offer Draw
                  </Button>
                  <Button variant="secondary" onClick={() => setIsResigned(true)} className="play-page__btn-resign">
                    Resign
                  </Button>
                  <Button variant="secondary" onClick={handleNewGame}>
                    New Game
                  </Button>
                </>
              ) : isGameOver ? (
                <Button variant="primary" onClick={handleNewGame}>
                  Play Again
                </Button>
              ) : (
                <Button variant="primary" onClick={handleNewGame}>
                  New Game
                </Button>
              )}
            </div>
            
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
