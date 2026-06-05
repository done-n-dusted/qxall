# Flexible Moves List and Active Actions Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Allow the active game's moves list to expand and fit the remaining viewport space, pin actions at the bottom line, and show "New Game", "Resign", and "Offer Draw" buttons during active play.

**Architecture:** We will modify `PlayPage.tsx` to handle `isResigned` and `isDrawAgreed` game ending states, block board interactions when the game is over, and conditionally render the action buttons. We will adjust `PlayPage.css` to use a flexible flexbox layout where the moves list expands to fill the sidebar while the action buttons sit pinned at the bottom.

**Tech Stack:** React 19, TypeScript, CSS Variables, Vite.

---

### Task 1: Game State Logic for Resign, Offer Draw, and Move Blocking

**Files:**
- Modify: `packages/frontend/src/pages/PlayPage/PlayPage.tsx`

- [ ] **Step 1: Define `isResigned` and `isDrawAgreed` state and reset logic**
  Update `PlayPage.tsx` to add states:
  ```typescript
  const [isResigned, setIsResigned] = useState(false);
  const [isDrawAgreed, setIsDrawAgreed] = useState(false);
  ```
  Ensure these are reset in `handleNewGame`:
  ```typescript
  const handleNewGame = () => {
    boardState.reset();
    setShowHistory(false);
    setIsResigned(false);
    setIsDrawAgreed(false);
  };
  ```

- [ ] **Step 2: Update `isGameOver` check and implement `handleSelectSquare` interceptor**
  Redefine `isGameOver` to include resignation and draw agreement:
  ```typescript
  const isGameOver = boardState.isCheckmate || boardState.isStalemate || boardState.isDraw || isResigned || isDrawAgreed;
  ```
  Intercept square selection to block moves when `isGameOver` is true:
  ```typescript
  const handleSelectSquare = (square: string) => {
    if (isGameOver) return;
    boardState.selectSquare(square);
  };
  ```
  Pass the wrapped function to the board:
  ```typescript
  <ChessBoard boardState={{ ...boardState, selectSquare: handleSelectSquare }} />
  ```

- [ ] **Step 3: Update `getStatusText` to handle resigned and draw states**
  Update the `getStatusText` helper function:
  ```typescript
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
  ```
  And call it inside `PlayPage`:
  ```typescript
  const statusText = getStatusText(boardState, isResigned, isDrawAgreed);
  ```

- [ ] **Step 4: Commit**
  ```bash
  git add packages/frontend/src/pages/PlayPage/PlayPage.tsx
  git commit -m "feat: add resign and draw states and block piece moves when game is over"
  ```

---

### Task 2: Flexbox Sidebar Layout Updates for Viewport Scaling

**Files:**
- Modify: `packages/frontend/src/pages/PlayPage/PlayPage.css`
- Modify: `packages/frontend/src/pages/PlayPage/PlayPage.tsx`

- [ ] **Step 1: Set scrollable content and wrappers to use flexbox layout**
  Update `PlayPage.css` so that `.play-page__content-scrollable` has:
  ```css
  .play-page__content-scrollable {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: var(--space-3);
    min-height: 0;
    overflow-y: hidden; /* Prevent scrolling the entire outer container when active */
  }
  ```
  And update `.play-page__moves-wrapper`:
  ```css
  .play-page__moves-wrapper {
    flex: 1 1 0%;
    min-height: 0;
    display: flex;
    flex-direction: column;
    transition: opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1),
                visibility 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }
  ```
  Also update `.play-page__moves` height constraints:
  ```css
  .play-page__moves {
    flex: 1;
    min-height: 0;
    height: auto; /* Allow flexible height */
    display: flex;
    flex-direction: column;
  }
  ```

- [ ] **Step 2: Hide recent games section when active to prevent layout push**
  Make sure when the game is active (`shouldShowHistory` is false), the recent games wrapper has `display: none` or `max-height: 0` so it doesn't push the actions down.
  We will adjust:
  ```css
  .play-page__history-wrapper--collapsed {
    display: none; /* Do not reserve layout space when collapsed */
  }
  ```
  And adjust `.play-page__history-wrapper--expanded`:
  ```css
  .play-page__history-wrapper--expanded {
    display: flex;
    flex-direction: column;
    flex: 1;
    min-height: 0;
    overflow-y: auto;
  }
  ```
  Also, update `.play-page__content-scrollable` to allow vertical scrolling only when there are no active moves (so the history list is scrollable, but when moves are shown, the moves list itself scrolls):
  We can add a class `.play-page__content-scrollable--scrollable` when `!isGameActive || showHistory` is true.

- [ ] **Step 3: Commit**
  ```bash
  git add packages/frontend/src/pages/PlayPage/PlayPage.css packages/frontend/src/pages/PlayPage/PlayPage.tsx
  git commit -m "style: implement flexible flexbox sidebar layout for moves list"
  ```

---

### Task 3: Contextual Action Buttons Rendering

**Files:**
- Modify: `packages/frontend/src/pages/PlayPage/PlayPage.tsx`

- [ ] **Step 1: Update the buttons block rendering in `PlayPage.tsx`**
  Modify the actions container:
  ```tsx
  {/* Quick-Start Actions */}
  <div className="play-page__actions">
    {isGameActive && !isGameOver ? (
      <>
        <Button variant="secondary" onClick={handleNewGame}>
          New Game
        </Button>
        <Button variant="secondary" onClick={() => setIsResigned(true)} className="play-page__btn-resign">
          Resign
        </Button>
        <Button variant="secondary" onClick={() => setIsDrawAgreed(true)}>
          Offer Draw
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
  ```

- [ ] **Step 2: Commit**
  ```bash
  git add packages/frontend/src/pages/PlayPage/PlayPage.tsx
  git commit -m "feat: show contextual buttons based on game status"
  ```

---

### Task 4: Styling and Verification

**Files:**
- Modify: `packages/frontend/src/pages/PlayPage/PlayPage.css`

- [ ] **Step 1: Add styling for `play-page__btn-resign`**
  ```css
  .play-page__btn-resign {
    color: var(--color-error) !important;
    border-color: rgba(255, 180, 171, 0.2) !important;
  }

  .play-page__btn-resign:hover:not(:disabled) {
    background: rgba(255, 180, 171, 0.1) !important;
  }
  ```

- [ ] **Step 2: Verify build and correctness**
  Run `npm run build:frontend` to verify there are no TypeScript compilation or linter errors.
  Command: `npm run build:frontend`

- [ ] **Step 3: Commit**
  ```bash
  git add packages/frontend/src/pages/PlayPage/PlayPage.css
  git commit -m "style: add resign button error variant and verify build"
  ```
