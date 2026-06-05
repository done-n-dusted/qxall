# Chess Side Panel Collapsing Behavior Design Spec

This document details the visual and behavioral design for collapsing and expanding the side panel elements in the chess game.

## Goal
Improve the user interface layout on the Chess Play page by making the side panel dynamic:
1. Provide two main buttons: **New Game** and **Previous Games**.
2. Automatically collapse the **Previous Games** (recent games) list to the bottom of the panel when a game is active (moves have been made).
3. Expand and show the **Previous Games** list when no game is active (a fresh board, or after resetting/clicking "New Game").
4. Allow manual toggling to see previous games via the **Previous Games** button, which collapses the current game's moves list.

## Layout States

### 1. Active Play State
- **Trigger**: The current game has move history (`moveHistory.length > 0`) and the user has not explicitly requested to view the history.
- **UI Behavior**:
  - The **Moves** section (MoveList component) is fully expanded, taking up the main scrollable/vertical space.
  - The **Previous Games** section at the bottom collapses. It only displays its header title ("Previous Games") or remains collapsed to the bottom, without showing the individual game cards.
  - Buttons:
    - **New Game** (secondary style or primary, resets the board).
    - **Previous Games** (standard style, toggles to History View).

### 2. History View State
- **Trigger**: Either no game is active (`moveHistory.length === 0`), or the user explicitly clicks the **Previous Games** button while a game is active.
- **UI Behavior**:
  - The **Moves** section collapses and hides completely.
  - The **Previous Games** section expands to fill the available space, displaying the list of recent games.
  - Buttons:
    - **New Game**
    - **Previous Games** (highlighted/active style).

## React State and Component Logic

We will introduce a `showHistory` boolean state in `PlayPage.tsx`:
```tsx
const [showHistory, setShowHistory] = useState(false);
```

### Derived States
- `isGameActive = boardState.moveHistory.length > 0`
- `shouldShowHistory = !isGameActive || showHistory`
- `shouldShowMoves = isGameActive && !showHistory`

### Event Handlers & Effects
1. **Making a Move**:
   We will monitor the move history length. When it increases, we automatically collapse the history view to show the moves:
   ```tsx
   useEffect(() => {
     if (boardState.moveHistory.length > 0) {
       setShowHistory(false);
     }
   }, [boardState.moveHistory.length]);
   ```

2. **Clicking "Previous Games"**:
   ```tsx
   const handlePreviousGamesClick = () => {
     setShowHistory(true);
   };
   ```

3. **Clicking "New Game"**:
   ```tsx
   const handleNewGameClick = () => {
     boardState.reset();
     setShowHistory(false);
   };
   ```

## Styling & Animations
We will update `PlayPage.css` to add smooth height/opacity transitions for:
- `.play-page__moves`
- `.play-page__recent-list`

When a section is collapsed, we apply CSS classes that set height to `0`, `overflow: hidden`, and reduce opacity, while the expanded section transitions back to its full height or flex-grow state.
