# Tab Rotator Extension

**Tab Rotator** is a simple and polished Chrome extension that rotates the current webpage 90°, 180°, 270°, or resets it with a smooth bounce animation.

It supports all websites — including complex pages like YouTube — without breaking scrolling or causing layout issues.

---

## Features
- Rotate the page 90° clockwise with one click.
- Right-click the extension for more options:
  - Rotate 90°
  - Rotate 180°
  - Rotate 270°
  - Reset rotation (with bounce animation)
- Scroll naturally after rotation (no locking or black screens).
- Works on dynamic websites (e.g., YouTube, Google, ChatGPT, etc.).
- Continuous rotation: keeps turning clockwise beyond 360°.
- Clean and lightweight design.

---

## Installation

1. **Download** this repository as a ZIP file and extract it.
2. **Open Chrome** and navigate to `chrome://extensions/`.
3. Turn on **Developer Mode** (toggle switch in the top right).
4. Click **Load Unpacked**.
5. Select the extracted project folder.

The extension icon should now appear in your Chrome toolbar.

---

## Usage

- **Left-click** the Tab Rotator icon to rotate the current page 90° clockwise.
- **Right-click** the icon to open a menu with options:
  - Rotate 90°
  - Rotate 180°
  - Rotate 270°
  - Reset rotation

**Resetting** the page triggers a smooth bounce animation.

**Note:** Rotation is tracked per tab and resets automatically when a page is refreshed.

---

## Technical Details

- Rotation is handled inside a dynamically created wrapper `<div>`, ensuring compatibility with video players and dynamic websites like YouTube.
- The wrapper uses the browser's actual window dimensions to perfectly centre the rotated page.
- Scrollbars remain functional and content stays visible at all angles.

---

## License

This project is licensed under the MIT License.  
Feel free to modify and improve it.
