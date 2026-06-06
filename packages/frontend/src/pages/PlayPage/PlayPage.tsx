import { useState, useEffect, useCallback, useMemo } from 'react';
import { ChessBoard, useBoardState, MoveList, Button, GlassCard, Chip } from '../../components';
import { Plus, RotateCcw, Flag, Handshake } from 'lucide-react';
import './PlayPage.css';

function getStatusText(
  boardState: ReturnType<typeof useBoardState>,
  isResigned: boolean,
  isDrawAgreed: boolean,
  whiteTime: number,
  blackTime: number
): string {
  if (whiteTime === 0) {
    return 'Timeout - Black wins!';
  }
  if (blackTime === 0) {
    return 'Timeout - White wins!';
  }
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

function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
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
  const [whiteTime, setWhiteTime] = useState(600);
  const [blackTime, setBlackTime] = useState(600);

  const isGameOver = boardState.isCheckmate || boardState.isStalemate || boardState.isDraw || isResigned || isDrawAgreed || whiteTime === 0 || blackTime === 0;
  const statusText = getStatusText(boardState, isResigned, isDrawAgreed, whiteTime, blackTime);
  const isGameActive = boardState.moveHistory.length > 0;

  useEffect(() => {
    if (!isGameActive || isGameOver) return;

    const intervalId = setInterval(() => {
      if (boardState.turn === 'w') {
        setWhiteTime((time) => Math.max(0, time - 1));
      } else {
        setBlackTime((time) => Math.max(0, time - 1));
      }
    }, 1000);

    return () => clearInterval(intervalId);
  }, [isGameActive, isGameOver, boardState.turn]);

  const handleNewGame = () => {
    boardState.reset();
    setIsResigned(false);
    setIsDrawAgreed(false);
    setWhiteTime(600);
    setBlackTime(600);
  };

  const handleSelectSquare = useCallback((square: string) => {
    if (isGameOver) return;
    boardState.selectSquare(square);
  }, [isGameOver, boardState.selectSquare]);

  const memoizedBoardState = useMemo(() => ({
    ...boardState,
    selectSquare: handleSelectSquare
  }), [boardState, handleSelectSquare]);

  return (
    <div className="play-page">
      <div className="play-page__grid">
        {/* Board (Always on the Left) */}
        <div className="play-page__board">
          <ChessBoard boardState={memoizedBoardState} />
        </div>

        {/* Side Panel / Launcher (Always on the Right) */}
        <div className="play-page__panel">
          {/* Card 1: Game Info & Timers */}
          <GlassCard padding="md" className="play-page__info-card">
            <div className="play-page__player-info">
              {/* Black Player Row */}
              <div
                className={[
                  'play-page__player-row',
                  isGameActive && !isGameOver
                    ? boardState.turn === 'b'
                      ? 'play-page__player-row--active'
                      : 'play-page__player-row--inactive'
                    : '',
                ].join(' ')}
              >
                <div className="play-page__player-name">
                  <div className="play-page__player-turn-dot" />
                  <span>Opponent</span>
                </div>
                <div
                  className={[
                    'play-page__timer',
                    isGameActive && !isGameOver && boardState.turn === 'b'
                      ? 'play-page__timer--active'
                      : '',
                  ].join(' ')}
                >
                  {formatTime(blackTime)}
                </div>
              </div>

              {/* White Player Row */}
              <div
                className={[
                  'play-page__player-row',
                  isGameActive && !isGameOver
                    ? boardState.turn === 'w'
                      ? 'play-page__player-row--active'
                      : 'play-page__player-row--inactive'
                    : '',
                ].join(' ')}
              >
                <div className="play-page__player-name">
                  <div className="play-page__player-turn-dot" />
                  <span>You</span>
                </div>
                <div
                  className={[
                    'play-page__timer',
                    isGameActive && !isGameOver && boardState.turn === 'w'
                      ? 'play-page__timer--active'
                      : '',
                  ].join(' ')}
                >
                  {formatTime(whiteTime)}
                </div>
              </div>
            </div>

            <div className="play-page__status">
              <span className="play-page__status-text">{statusText}</span>
            </div>
          </GlassCard>

          {/* Card 2: Move History / Recent Games */}
          <GlassCard padding="md" className="play-page__middle-card">
            <div className="play-page__middle-scroller">
              {isGameActive && !isGameOver ? (
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
              ) : (
                <div className="play-page__section">
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
              )}
            </div>
          </GlassCard>

          {/* Card 3: Action Controls */}
          <GlassCard padding="md" className="play-page__actions-card">
            <div className="play-page__actions">
              {isGameActive && !isGameOver ? (
                <>
                  <Button variant="secondary" onClick={() => setIsDrawAgreed(true)}>
                    <Handshake size={16} /> Offer Draw
                  </Button>
                  <Button variant="secondary" onClick={() => setIsResigned(true)} className="play-page__btn-resign">
                    <Flag size={16} /> Resign
                  </Button>
                  <Button variant="secondary" onClick={handleNewGame}>
                    <Plus size={16} /> New Game
                  </Button>
                </>
              ) : isGameOver ? (
                <Button variant="primary" onClick={handleNewGame}>
                  <RotateCcw size={16} /> Play Again
                </Button>
              ) : (
                <Button variant="primary" onClick={handleNewGame}>
                  <Plus size={16} /> New Game
                </Button>
              )}
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
