# Floating Panels and Active Game Controls Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Break the right side-panel into three separate floating glass cards containing game info (player names/timers), move history, and control buttons, with automated context toggling and no manual previous games button.

**Architecture:** Refactor `PlayPage.tsx` and `PlayPage.css` in the frontend package. Stacking three separate `GlassCard` instances vertically using a flex column layout, introducing ticking React timers for players, and switching Card 2 contents automatically based on whether the game is active or finished.

**Tech Stack:** React, TypeScript, Vanilla CSS, Lucide React

---

## Proposed Changes

### Task 1: CSS Layout & Styles for Triple Stack
**Files:**
* Modify: `packages/frontend/src/pages/PlayPage/PlayPage.css`

- [ ] **Step 1: Update CSS for the triple card stack**
  Add styles for the three floating cards (`.play-page__info-card`, `.play-page__middle-card`, and `.play-page__actions-card`). Remove obsolete styles for manual collapsing transitions and define player timer highlights and layout.

  Add/modify the following CSS inside `PlayPage.css`:
  ```css
  /* ── Triple Floating Stack Panel ── */
  .play-page__panel {
    height: 100%;
    min-height: 0;
    display: flex;
    flex-direction: column;
    gap: var(--space-3); /* Floating gap between cards */
    box-sizing: border-box;
  }

  .play-page__info-card {
    background: rgba(23, 31, 51, 0.45);
    border: 1px solid rgba(255, 255, 255, 0.1);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.25);
  }

  .play-page__middle-card {
    flex: 1;
    min-height: 0;
    display: flex;
    flex-direction: column;
    background: rgba(23, 31, 51, 0.45);
    border: 1px solid rgba(255, 255, 255, 0.1);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.25);
  }

  .play-page__actions-card {
    background: rgba(23, 31, 51, 0.45);
    border: 1px solid rgba(255, 255, 255, 0.1);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.25);
  }

  /* ── Player Info Rows & Timers ── */
  .play-page__player-info {
    display: flex;
    flex-direction: column;
    gap: var(--space-2);
  }

  .play-page__player-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: var(--space-1) 0;
    transition: opacity var(--transition-fast);
  }

  .play-page__player-row--inactive {
    opacity: 0.5;
  }

  .play-page__player-name {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    font-size: var(--body-md-size);
    font-weight: var(--label-md-weight);
    color: var(--color-on-surface);
  }

  .play-page__player-turn-dot {
    width: 8px;
    height: 8px;
    border-radius: var(--rounded-full);
    background-color: var(--color-primary);
    box-shadow: 0 0 8px var(--color-primary);
    opacity: 0;
    transition: opacity var(--transition-fast);
  }

  .play-page__player-row--active .play-page__player-turn-dot {
    opacity: 1;
  }

  .play-page__timer {
    background: rgba(255, 255, 255, 0.04);
    border: 1px solid rgba(255, 255, 255, 0.08);
    padding: var(--space-1) var(--space-2);
    border-radius: var(--rounded);
    font-family: monospace;
    font-size: var(--body-md-size);
    color: var(--color-on-surface-variant);
    transition: all var(--transition-fast);
  }

  .play-page__timer--active {
    background: rgba(56, 189, 248, 0.15);
    border-color: rgba(56, 189, 248, 0.4);
    color: #38bdf8;
    box-shadow: 0 0 10px rgba(56, 189, 248, 0.15);
  }

  .play-page__info-status-bar {
    margin-top: var(--space-2);
    padding-top: var(--space-2);
    border-top: 1px solid rgba(255, 255, 255, 0.05);
    font-size: var(--label-sm-size);
    color: var(--color-outline);
    text-align: center;
  }

  /* ── Middle Card Content Scroller ── */
  .play-page__middle-scroller {
    flex: 1;
    overflow-y: auto;
    min-height: 0;
    padding-right: var(--space-1);
  }

  .play-page__middle-scroller::-webkit-scrollbar {
    width: 6px;
  }

  .play-page__middle-scroller::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.01);
    border-radius: var(--rounded-full);
  }

  .play-page__middle-scroller::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.08);
    border-radius: var(--rounded-full);
  }

  .play-page__middle-scroller::-webkit-scrollbar-thumb:hover {
    background: rgba(255, 255, 255, 0.16);
  }
  ```

- [ ] **Step 2: Commit CSS changes**
  Run: `git add packages/frontend/src/pages/PlayPage/PlayPage.css`
  Run: `git commit -m "style: define triple floating cards and player timer layout"`

---

### Task 2: React Component Logic & Render Refactoring
**Files:**
* Modify: `packages/frontend/src/pages/PlayPage/PlayPage.tsx`

- [ ] **Step 1: Implement player timer hooks and format functions**
  Replace manual `showHistory` with player timer states and ticking loop.
  Add helper functions to format timers inside `PlayPage.tsx`:
  ```tsx
  const [whiteTime, setWhiteTime] = useState(600); // 10 minutes (600 seconds)
  const [blackTime, setBlackTime] = useState(600);

  // Active timers ticking down
  useEffect(() => {
    if (!isGameActive || isGameOver) return;
    const interval = setInterval(() => {
      if (boardState.turn === 'w') {
        setWhiteTime((t) => Math.max(0, t - 1));
      } else {
        setBlackTime((t) => Math.max(0, t - 1));
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [isGameActive, isGameOver, boardState.turn]);

  // Reset timers on new game
  const handleNewGame = () => {
    boardState.reset();
    setIsResigned(false);
    setIsDrawAgreed(false);
    setWhiteTime(600);
    setBlackTime(600);
  };

  const formatTime = (timeInSecs: number) => {
    const mins = Math.floor(timeInSecs / 60);
    const secs = timeInSecs % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  ```

- [ ] **Step 2: Update rendering structure to stack three GlassCards**
  Replace the old single inner `.play-page__panel-inner` layout with the new triple floating structure:
  ```tsx
  return (
    <div className="play-page">
      <div className="play-page__grid">
        {/* Board */}
        <div className="play-page__board">
          <ChessBoard boardState={{ ...boardState, selectSquare: handleSelectSquare }} />
        </div>

        {/* Triple Stack Right Panel */}
        <div className="play-page__panel">
          {/* Card 1: Game Info & Timers */}
          <GlassCard padding="md" className="play-page__info-card">
            <div className="play-page__player-info">
              {/* Black Player (Opponent) */}
              <div className={[
                'play-page__player-row',
                boardState.turn === 'b' && isGameActive && !isGameOver ? 'play-page__player-row--active' : 'play-page__player-row--inactive'
              ].join(' ')}>
                <span className="play-page__player-name">
                  <span className="play-page__player-turn-dot" />
                  ⚫ Opponent
                </span>
                <span className={[
                  'play-page__timer',
                  boardState.turn === 'b' && isGameActive && !isGameOver ? 'play-page__timer--active' : ''
                ].join(' ')}>
                  {formatTime(blackTime)}
                </span>
              </div>

              {/* White Player (You) */}
              <div className={[
                'play-page__player-row',
                boardState.turn === 'w' && isGameActive && !isGameOver ? 'play-page__player-row--active' : 'play-page__player-row--inactive'
              ].join(' ')}>
                <span className="play-page__player-name">
                  <span className="play-page__player-turn-dot" />
                  ⚪ You
                </span>
                <span className={[
                  'play-page__timer',
                  boardState.turn === 'w' && isGameActive && !isGameOver ? 'play-page__timer--active' : ''
                ].join(' ')}>
                  {formatTime(whiteTime)}
                </span>
              </div>
            </div>
            <div className="play-page__info-status-bar">
              {isGameActive ? statusText : 'Waiting to start'}
            </div>
          </GlassCard>

          {/* Card 2: Move List / Recent Games */}
          <GlassCard padding="md" className="play-page__middle-card">
            <div className="play-page__middle-scroller">
              {isGameActive && !isGameOver ? (
                <div className="play-page__section">
                  <h3 className="play-page__section-title">Move History</h3>
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
  ```

- [ ] **Step 3: Verify build passes**
  Run: `npm run build:frontend`
  Expected: Builds without errors.

- [ ] **Step 4: Commit changes**
  Run: `git add packages/frontend/src/pages/PlayPage/PlayPage.tsx`
  Run: `git commit -m "feat: refactor play page into triple card stack with ticking timers"`

---

### Task 3: Design Norms Documentation Update
**Files:**
* Modify: `specs/design_norms.md`

- [ ] **Step 1: Document triple card stack and timer highlighting in design norms**
  Add Section 9 to the end of `specs/design_norms.md`:
  ```markdown
  ---

  ## 9. Floating Side Panel & Active Game UI
  - **Panel Architecture (Triple Stack)**:
    - The launcher is segmented into three independent floating `GlassCard` containers instead of a single side panel.
    - Card 1 (Game Info) displays players and timers, Card 2 (Moves/Recent Games) displays gameplay context, and Card 3 (Actions) presents context-driven options.
  - **Ticking Player Timers**:
    - Show White and Black timers in `MM:SS` format.
    - Highlight the active player's timer with a light blue glowing background (`#38bdf8` at low opacity) and show a glowing active turn indicator dot.
  - **Automated Context Switching**:
    - The moves list and recent games list automatically switch context based on the active game state. Manual toggle button is hidden to ensure focused attention.
  ```

- [ ] **Step 2: Commit document updates**
  Run: `git add specs/design_norms.md`
  Run: `git commit -m "docs: update design norms to document triple stack side panel"`

---

### Task 4: Final Validation & PR Creation
- [ ] **Step 1: Final verification build**
  Run: `npm run build:frontend`
  Expected: Successful compilation.

- [ ] **Step 2: Create a pull request / merge changes**
  Run: `git push origin feat/floating-panels-layout`
