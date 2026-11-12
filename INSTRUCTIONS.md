# Technical Setup & Exhibition Guide

**Artwork**: `while (true) stayTogether();`  
**Authors**: Andrea, Juancho, Gagik  
**Theme**: Systems & Structures  

This document contains instructions for museum technicians and exhibition staff to install, configure, and maintain the interactive installation.

---

## 1. Quick Launch Options

### Option A: Hosted Version (Recommended / Easiest)
1. Ensure the exhibition computer is connected to the internet.
2. Open Google Chrome, Microsoft Edge, or any modern Chromium-based browser.
3. Navigate to:  
   **[https://mosdact-lasalle-2026.github.io/final-project-andrea-juancho-gag/](https://mosdact-lasalle-2026.github.io/final-project-andrea-juancho-gag/)**
4. Press **F11** on the keyboard to switch to full-screen mode.

### Option B: Local Version (Offline Setup)
1. Open the project folder in **Visual Studio Code** (or any local web server).
2. Start a local server:
   - In VS Code: Right-click `index.html` and choose **"Open with Live Server"**.
   - Alternatively via terminal: `npx serve` or `python -m http.server 8000`.
   *(Note: Do not open `index.html` directly via double-click / `file://` protocol, as browser security policies will block audio and image assets from loading).*
3. Press **F11** to toggle full-screen mode.

---

## 2. Controller & Hardware Configuration

The installation is designed for standard USB or wireless controllers (e.g., Xbox 360 / Xbox One / Amazon third-party Xbox clone controllers).

### Connecting Gamepads:
1. Plug in the controller(s) before or after launching the browser.
2. **Important Browser Behavior**: The browser will not detect a gamepad until **at least one button is pressed** on the controller after connection.
3. The title screen displays live feedback:
   - `NO CONTROLLER DETECTED (PRESS ANY BUTTON TO ACTIVATE)`
   - `CONTROLLERS DETECTED: 1` (or `2`)

### Player Assignment:
- **Two Controllers Connected**:
  - **Controller 1** (first connected/activated) &rarr; Left Paddle (Player 1)
  - **Controller 2** (second connected/activated) &rarr; Right Paddle (Player 2)
- **One Controller Connected (Single-Controller Mode)**:
  - **Left Stick / D-Pad** &rarr; Left Paddle (Player 1)
  - **Right Stick** &rarr; Right Paddle (Player 2)

---

## 3. In-Game Controls Reference

| Action | Controller | Keyboard (Backup) |
|---|---|---|
| **Player 1 (Left Paddle)** | Left Analog Stick (Up/Down) or D-Pad (Up/Down) | `W` (Up) / `S` (Down) |
| **Player 2 (Right Paddle)** | Left Analog Stick (Up/Down) or D-Pad (Up/Down) *(or Right Stick if 1 controller)* | `Up Arrow` (Up) / `Down Arrow` (Down) |
| **Start / Play Game** | **`A`** button or **`START`** button | **`P`** key |
| **Reset Game** | **`Y`** button or **`BACK` / `SELECT`** button | **`R`** key |
| **Fullscreen Toggle** | — | **`F11`** |

---

## 4. Maintenance & Troubleshooting

- **Controllers not responding / disconnected**:
  Press any face button or D-pad button on the controller to wake it up in the browser. If still not detected, unplug and re-plug the USB cable, then press a button.
- **No Sound / Audio muted**:
  Modern web browsers block audio playback until the page receives an initial user interaction. Simply click once anywhere on the screen with a mouse or press `P` / controller button.
- **Canvas Scaling**:
  The artwork dynamically recalculates paddle positions and canvas dimensions to fit any screen resolution or aspect ratio when entering/exiting fullscreen (`F11`).

