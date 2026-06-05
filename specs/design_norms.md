# Design Norms — qxall

This document establishes the UI/UX design norms and visual guidelines for the **qxall** ("Queen Takes All") application. All future frontend modifications should adhere strictly to these patterns to preserve visual harmony and structural consistency.

---

## 1. Core Philosophy (Zen Mode)
- **Breathing Room**: Layouts must feel sparse, intentional, and clutter-free. Use generous margin and spacing tokens (`var(--space-3)` to `var(--space-5)`) rather than packing content tightly.
- **Focused Attention**: Highlight the interactive chess board as the primary interface element. Auxiliary options are secondary, kept in the right-side launcher panel.
- **App-Like Feel**: The layout is an interactive web application, not a document-style page. The interface must fit clean viewports without global scrolling.

---

## 2. Colors & Typography
- **Primary Color Palette**:
  - **Base Background**: Deep dark blue (`var(--color-surface)` / `#0b1326`).
  - **Text Colors**: Light ice-blue (`var(--color-on-surface)` / `#dbe2fd`) and muted gray (`var(--color-on-surface-variant)` / `#c5c6ca`).
  - **Board Colors**: Light squares (`#d1d5db`), Dark squares (`#374151`).
- **Glow & Accent Colors**:
  - **King in Check**: A bright neon-pink radial gradient (`rgba(236, 72, 153, 0.65)` transitioning to transparent).
  - **Active/Last Move Square**: Pure white 2px inner-glow inset box shadow (`rgba(255, 255, 255, 0.9)`).
  - **Active Moves / Actions**: High-luminosity off-white overlays.
  - **Resign Buttons**: Error red (`var(--color-error)` / `#ffb4ab`) at low opacities with hover transitions.
- **Fonts**:
  - Primary font is **Inter** (`@fontsource/inter` package), with fallback to **Plus Jakarta Sans**.
  - Font sizes are standardized using typography tokens: `headline-lg` (40px, bold), `headline-md` (24px, semibold), `body-lg` (18px), `body-md` (16px), `label-md` (14px), and `label-sm` (12px).

---

## 3. Glassmorphism Design System
- **Cards & Containers**:
  - Utilize translucent backgrounds mixed with blur overlays (`backdrop-filter`).
  - **Standard Glass**: `rgba(23, 31, 51, 0.45)` background with 16px blur.
  - **Elevated Glass**: `rgba(45, 52, 73, 0.55)` background with 24px blur.
  - **Glass Borders**: Use a 1px solid stroke with varying opacities. Top and left borders catch highlights (`rgba(255,255,255,0.15)`), while bottom and right borders fade away (`rgba(255,255,255,0.05)`).
  - **Corners**: Rounded containers use `var(--rounded-xl)` (1.5rem / 24px), while board/interactive elements use `var(--rounded)` (0.5rem / 8px).

---

## 4. Page Layout Standards
- **Viewport Lock**:
  - The root layout (`.app-layout`) must occupy exactly `100vh`/`100dvh` and have `overflow: hidden`.
  - Body-level scrolling is disabled to establish a true dashboard experience.
- **Strict 70-30 Split**:
  - The main play interface uses CSS Grid with `grid-template-columns: 7fr 3fr;`.
  - **Left Side (70%)**: Houses the `ChessBoard` component, centered vertically.
  - **Right Side (30%)**: Houses the side panel launcher containing game details, buttons, and previous games.
- **Scrollable Panels**:
  - Scrolling is restricted to nested panel containers (like the recent games list or move list rows).
  - Custom thin scrollbars (`width: 6px`) styled with high transparency (`rgba(255, 255, 255, 0.08)`) are mandatory.

---

## 5. Chess Board Sizing & Assets
- **Aspect Ratio**: The board must maintain a strict `1:1` aspect ratio.
- **Cropping Prevention**: Board dimensions must be constrained by both viewport height and width. Use:
  ```css
  width: min(100%, calc(100vh - 140px));
  height: min(100%, calc(100vh - 140px));
  ```
  to guarantee the board scales dynamically without overflowing the screen.
- **Solid Vector Chess Pieces**:
  - Do not use outlined Unicode characters.
  - Render crisp, custom SVG vector shapes with solid fills (white bodies for white pieces, dark bodies for black pieces with light inner strokes).
  - Piece sizing must be exactly **90%** of the square dimensions, leaving a thin breathing margin.
  - Apply `filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.35))` for realistic depth.

---

## 6. Drag-and-Drop UX Rules
- **Interactions**:
  - Support both click-to-move and drag-and-drop.
  - Touch-action must be disabled (`touch-action: none`) on the board and squares to prevent mobile browser drag conflicts.
- **Drag Detection**:
  - Gestures exceeding 5px in delta are recognized as drag actions (which immediately select the piece to show legal moves). Less than 5px is treated as a simple click.
  - Dragged pieces must receive a high `z-index: 100 !important`, disable CSS transitions (`transition: none !important`) during drag to prevent drag lag, and render a high-elevation floating shadow.
  - Use debounced refs to suppress standard click actions immediately after a drop occurs.

---

## 7. Launcher Collapsing & Transitions
- **Collapsible Content**:
  - Previous games lists and MoveList containers collapse and expand dynamically based on the game state (e.g. show MoveList when game is active, show Previous Games when game is finished or toggled).
  - Toggle states utilize flex basis expansions (`flex: 1 1 0%`) combined with cubic-bezier opacity fades:
    ```css
    transition: opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1),
                visibility 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    ```
  - Collapsed wrappers use `display: none` to completely clear layout footprint and pointer interactions.
