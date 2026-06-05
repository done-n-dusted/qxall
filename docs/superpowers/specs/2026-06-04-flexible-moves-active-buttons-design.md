# Design Spec: Flexible Moves List and Active Game Actions

This document details the layout updates to let the active game's moves list expand to fit the viewport, pin action buttons to the bottom line, and implement "Resign" and "Offer Draw" actions.

## Requirements & Scope

1. **Flexible Move List**: When a game is active, the moves list should expand dynamically to fill all available vertical space in the sidebar.
2. **Bottom-Aligned Actions**: Action buttons should be pinned at the bottom of the sidebar.
3. **Contextual Action Buttons**:
   - **Active Game (moves > 0)**: Displays "New Game", "Resign", and "Offer Draw".
   - **Game Over (any terminal state)**: Displays only a single "Play Again" button.
   - **Inactive Game (moves === 0)**: Displays only a "New Game" button and automatically shows the "Recent Games" (previous games) list.
4. **Resign & Draw Functionality**:
   - Clicking "Resign" ends the game. The status text indicates which side resigned and who won.
   - Clicking "Offer Draw" ends the game with a "Draw by agreement" status.
   - All further moves are disabled when the game is resigned or draw is agreed.

## UI Design & Layout Changes

### 1. CSS Structure Updates
We will modify the flex layout of the sidebar in `PlayPage.css`:
- Convert `.play-page__panel-inner` and `.play-page__content-scrollable` into structured flexboxes.
- When the game is active (`.play-page__moves-wrapper--expanded` is active), set the moves list wrapper to `flex: 1 1 0%` and `min-height: 0` to let it grow.
- Remove the fixed height values (`height: 180px`, `max-height: 180px`).
- Ensure the action buttons (`.play-page__actions`) are positioned after the moves list, naturally staying at the bottom.

### 2. State & Component Logic in `PlayPage.tsx`
- We will track `isResigned` (boolean) and `isDrawAgreed` (boolean) state in `PlayPage.tsx`.
- We will define a computed variable `isGameOver`:
  ```typescript
  const isGameOver = boardState.isCheckmate || boardState.isStalemate || boardState.isDraw || isResigned || isDrawAgreed;
  ```
- Disable board interactions when `isGameOver` is true. We'll pass `isGameOver` or intercept `selectSquare` in `PlayPage.tsx` (by only allowing `boardState.selectSquare` if `!isGameOver`).
- Update `getStatusText` to handle custom end states:
  ```typescript
  if (isResigned) {
    return `Resigned - ${boardState.turn === 'w' ? 'Black' : 'White'} wins!`;
  }
  if (isDrawAgreed) {
    return 'Draw by agreement';
  }
  ```

## Verification Plan

### Manual Verification
1. Open the chess app.
2. Verify that the launcher initially shows "Recent Games" and the "New Game" button.
3. Make a move on the board (activating the game).
4. Verify that the Moves list expands to fill the height, and the bottom contains three buttons: "New Game", "Resign", and "Offer Draw".
5. Make several moves and verify that the moves list scrolls nicely and does not overflow the sidebar.
6. Click "Resign" and verify that:
   - The status text shows the appropriate resign message.
   - The bottom action row collapses to a single "Play Again" button.
   - You cannot make any further moves on the board.
7. Click "Play Again" to reset the board.
8. Make a move, then click "Offer Draw", and verify:
   - The status text shows "Draw by agreement".
   - The buttons collapse to "Play Again".
   - Further board moves are disabled.
