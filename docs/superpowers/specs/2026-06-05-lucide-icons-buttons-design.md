# Design Spec: Lucide Icons & Button Enhancements

This document details the visual and behavioral design for integrating Lucide icons into the side pane buttons of the chess application.

## Goal
Improve the user interface layout and visual clarity of the side panel by:
1. Installing and using `lucide-react` for high-quality, lightweight SVG icons.
2. Enhancing all side panel buttons with contextual Lucide icons placed on the left side of the text.
3. Restoring the "Previous Games" / "Show Moves" toggle action so that history remains accessible during active play.
4. Defining and updating the design norms specifications for button/icon layouts.

## Button Actions & Icons Map
The buttons inside the side pane will map to these Lucide icons:
* **New Game**: `Plus` (variant="secondary" in active state, variant="primary" in idle state)
* **Play Again**: `RotateCcw` (variant="primary" in game over state)
* **Offer Draw**: `Handshake` (variant="secondary")
* **Resign**: `Flag` (variant="secondary", with error/red styling)
* **Previous Games**: `History` (variant="secondary" or active variant="primary")
* **Show Moves**: `List` (variant="secondary")

## Visual Layout & Button Alignment
* All buttons will use `display: inline-flex` or `display: flex` with `align-items: center` and `justify-content: center`.
* Gap size between the icon and button label text is 8px (`var(--space-1)`).
* Icons are sized at exactly `16px` with a default stroke weight of `2px`.
* Button text and icons will share the same `currentColor` so they transition synchronously on hover/active states.

## State Logic & Toggle Behavior
We utilize the `showHistory` state in `PlayPage.tsx` along with `isGameActive` and `isGameOver`.

When a game is active (`isGameActive && !isGameOver`), the actions stacked at the bottom of the pane are:
1. **Show History / Show Moves**: Toggles `showHistory`. If showing history, this button shows "Show Moves" with the `List` icon. If showing moves, this button shows "Previous Games" with the `History` icon.
2. **Offer Draw**: Styled with `Handshake` icon.
3. **Resign**: Styled with `Flag` icon.
4. **New Game**: Styled with `Plus` icon.
