# Design Spec: Floating Panels & Active Game Controls

We want to break the single right-side launcher panel into three separate floating glass cards:
1. **Game Info**: Player names (`You` vs `Opponent`), active timers (`10:00`), status indicator.
2. **Move History / Recent Games**: Flexible card that grows to fill vertical space. Displays Move History when a game is active, and Recent Games when a game is over or has not started.
3. **Action Controls**: Stacked control buttons pinned to the bottom.

We will also remove the manual "Previous Games" / "Show Moves" toggle button and update the design norms spec.

---

## 1. Component Layout

The `.play-page__panel` will be refactored from a single full-height `GlassCard` wrapper into a flex column layout containing three separate `GlassCard` wrappers:

```html
<div className="play-page__panel">
  {/* Card 1: Game Info */}
  <GlassCard padding="md" className="play-page__info-card">
    ...
  </GlassCard>

  {/* Card 2: Move History / Recent Games */}
  <GlassCard padding="md" className="play-page__middle-card">
    ...
  </GlassCard>

  {/* Card 3: Action Controls */}
  <GlassCard padding="md" className="play-page__actions-card">
    ...
  </GlassCard>
</div>
```

---

## 2. Details of Floating Cards

### A. Card 1: Game Info
* **Aesthetics**: GlassCard containing two player rows (White and Black).
* **Timers**:
  * Each player has a timer displaying standard chess timing format (`MM:SS`, e.g., `10:00`).
  * The timer for the player whose turn it is (`boardState.turn === 'w'` or `'b'`) is highlighted with `play-page__timer--active` and pulses.
  * Timers are paused/inactive when `!isGameActive` or `isGameOver`.
* **Status**: A clean, single-line text readout of the current game status (e.g., `"White to move"`, `"Checkmate!"`, `"Draw by agreement"`, `"Waiting to start"`).

### B. Card 2: Middle Card (Flex Grow)
* **Aesthetics**: Takes up all remaining vertical viewport space:
  ```css
  .play-page__middle-card {
    flex: 1;
    min-height: 0;
    display: flex;
    flex-direction: column;
  }
  ```
* **State Logic**:
  * If the game is active (`isGameActive && !isGameOver`), it renders the **MoveList** component inside a flex-grow container with thin scrollbars.
  * If the game has not started or is finished (`!isGameActive || isGameOver`), it renders the **Recent Games** list, automatically expanded.
* **Transition**: Controlled automatically by the active game state. The manual history toggle button is removed.

### C. Card 3: Action Controls
* **Aesthetics**: Card at the bottom holding stacked actions.
* **Control States**:
  * **Active & In-Progress** (`isGameActive && !isGameOver`):
    * `Offer Draw` (Secondary)
    * `Resign` (Secondary, colored error red)
    * `New Game` (Secondary)
  * **Game Over** (`isGameOver`):
    * `Play Again` (Primary)
  * **Not Started / Reset**:
    * `New Game` (Primary)

---

## 3. Design Norms Update
The `specs/design_norms.md` file will be modified to add Section 9: "Floating Side Panel & Active Game UI", establishing guidelines for:
* Breaking sidebar layouts into multiple independent card elements.
* Player info card layout, active timer pulsing highlights, and automated context toggling.

---

## 4. Verification Plan

### Automated Checks
* Verify that the React application compiles and runs without typescript/lint errors:
  ```bash
  npm run build
  ```

### Manual Verification
1. Start the dev server (`npm run dev`).
2. Verify that when no game is active, Card 1 shows default state, Card 2 automatically displays Recent Games, and Card 3 shows "New Game" (Primary).
3. Start a new game:
   * Verify that Card 2 switches automatically to show Move History (empty initially).
   * Verify that Card 3 shows the vertical actions: "Offer Draw", "Resign", and "New Game".
   * Verify that Card 1 highlights the white timer and says "White to move".
4. Make moves:
   * Verify that the active timer switches between White and Black as the turn changes.
   * Verify that the move history updates.
5. End the game (e.g. by Resigning):
   * Verify that Card 2 automatically switches back to Recent Games.
   * Verify that Card 1 shows the final game status (e.g. "Resigned - Black wins!").
   * Verify that Card 3 displays "Play Again" (Primary).
